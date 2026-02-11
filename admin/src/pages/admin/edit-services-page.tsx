'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Package, Percent, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ToggleTabs from '@/components/customs/toggle-tabs'
import { orderService } from '@/services/order.service'
import Header from '@/components/shared/sytle-header'
import { FaPencil } from 'react-icons/fa6'
import { FaTrash } from 'react-icons/fa'
import { catalogService, isAvailable, type PartItem, type ServiceItem } from '@/services/catalog.service'
import api from '@/lib/api'

interface OrderItem {
  _id?: string
  itemType: 'SERVICE' | 'PART'
  name?: string
  quantity?: number
  unitPrice?: number
  itemDiscount?: number
  amountDiscount?: number
  lineTotals?: { subtotal: number; discount: number; final: number }
  serviceId?: any
}

interface OrderDiscount {
  type: 'NONE' | 'PERCENT' | 'FIXED'
  amount: number
}

interface OrderData {
  _id: string
  orderNumber: string
  status: string
  customerId: { _id: string; name: string; phone: string; email: string }
  tractor: { name: string; model: string }
  items: OrderItem[]
  orderDiscount: OrderDiscount
  totals: { itemsSubtotal: number; itemsDiscount: number; orderDiscount: number; final: number }
}

interface EditServiceOrderProps {
  orderData: OrderData
  onClose?: () => void
}

export default function EditServiceOrder({ orderData, onClose }: EditServiceOrderProps) {
  const [activeTab, setActiveTab] = useState('customer')
  const [editData, setEditData] = useState<OrderData>(orderData)
  const [isSaving, setIsSaving] = useState(false)
  const [servicesCatalog, setServicesCatalog] = useState<ServiceItem[]>([])
  const [partsCatalog, setPartsCatalog] = useState<PartItem[]>([])
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isAddPartOpen, setIsAddPartOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [selectedPartId, setSelectedPartId] = useState<string>('')
  const [newServiceQty, setNewServiceQty] = useState<number>(1)
  const [newPartQty, setNewPartQty] = useState<number>(1)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  // Load catalogs for services and parts (for adding new items)
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setIsLoadingCatalog(true)
        const [services, parts] = await Promise.all([
          catalogService.getServices(),
          catalogService.getParts(),
        ])
        setServicesCatalog(services)
        setPartsCatalog(parts)
      } catch (error: any) {
        const message = error?.response?.data?.message ?? 'Failed to load catalog items'
        toast.error(message)
      } finally {
        setIsLoadingCatalog(false)
      }
    }
    loadCatalogs()
  }, [])

  // Keep local editData in sync with incoming orderData when opening editor
  useEffect(() => {
    if (!orderData) return
    // Map backend discount shape into UI fields (itemDiscount / amountDiscount)
    const mappedItems: OrderItem[] = (orderData.items || []).map((item) => {
      const discountType = (item as any).discount?.type
      const discountValue = (item as any).discount?.value ?? 0
      const lineTotals = item.lineTotals

      let itemDiscount = 0
      let amountDiscount = 0

      if (discountType === 'PERCENT') {
        itemDiscount = discountValue
        // For display, derive amount discount from lineTotals if available
        amountDiscount = lineTotals?.discount ?? 0
      } else if (discountType === 'FLAT') {
        itemDiscount = 0
        amountDiscount = discountValue
      }

      return {
        ...item,
        itemDiscount,
        amountDiscount,
      }
    })

    setEditData({
      ...orderData,
      items: mappedItems,
    })
  }, [orderData])


  // Update item field
  const updateItemField = (itemIndex: number, field: string, value: any) => {
    const updatedItems = [...editData.items]
    const current = { ...updatedItems[itemIndex] }

    const numericFields = ['unitPrice', 'quantity', 'itemDiscount', 'amountDiscount']
    const nextValue = numericFields.includes(field) ? parseFloat(value) || 0 : value

    ;(current as any)[field] = nextValue

    // Keep percentage and amount discounts in sync, and recompute amount based on subtotal
    const quantity = current.quantity || 0
    const unitPrice = current.unitPrice || 0
    const subtotal = quantity * unitPrice

    if (field === 'itemDiscount' || field === 'unitPrice' || field === 'quantity') {
      const percent = current.itemDiscount || 0
      const amount = subtotal > 0 ? (subtotal * percent) / 100 : 0
      current.amountDiscount = amount
    } else if (field === 'amountDiscount') {
      const amount = current.amountDiscount || 0
      if (subtotal > 0) {
        const percent = Math.min(100, Math.max(0, (amount / subtotal) * 100))
        current.itemDiscount = percent
      } else {
        current.itemDiscount = 0
      }
    }

    updatedItems[itemIndex] = current
    setEditData({ ...editData, items: updatedItems })
  }

  // Remove item
  const removeItem = (itemIndex: number) => {
    setEditData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== itemIndex),
    }))
  }

  // Add new item
  // (Creation of new items is done via catalog selection + backend add; see handlers below.)

  // Helper to compute a stable key for matching items between original and edited arrays
  const getItemKey = (item: OrderItem) => {
    const id =
      item.itemType === 'SERVICE'
        ? (item as any).serviceId?._id || (item as any).serviceId
        : (item as any).partId?._id || (item as any).partId
    return {
      type: item.itemType,
      id: id ? String(id) : '',
    }
  }

  const originalItemsByKey = useMemo(() => {
    const map = new Map<string, { index: number; item: OrderItem }>()
    orderData.items.forEach((item, index) => {
      const key = getItemKey(item as any)
      if (!key.id) return
      map.set(`${key.type}:${key.id}`, { index, item: item as any })
    })
    return map
  }, [orderData.items])

  // Handle save: diff items and call appropriate backend endpoints
  const handleSave = async () => {
    try {
      setIsSaving(true)
      const orderId = editData._id

      // 1. Build edited map
      const editedMap = new Map<string, { index: number; item: OrderItem }>()
      editData.items.forEach((item, index) => {
        const key = getItemKey(item)
        if (!key.id) return
        editedMap.set(`${key.type}:${key.id}`, { index, item })
      })

      // 2. Deletions: items present in original but not in edited
      for (const [key, { item }] of originalItemsByKey.entries()) {
        if (!editedMap.has(key)) {
          const parts = key.split(':')
          const itemId = parts[1]
          await orderService.removeItem(orderId, itemId)
        }
      }

      // 3. Updates: quantity, price, name, discount percent
      for (const [key, { index: originalIndex, item: original }] of originalItemsByKey.entries()) {
        const edited = editedMap.get(key)
        if (!edited) continue

        const editedItem = edited.item

        const origQty = original.quantity ?? 0
        const newQty = editedItem.quantity ?? 0
        const origPrice = original.unitPrice ?? 0
        const newPrice = editedItem.unitPrice ?? 0
        const origName = original.name ?? ''
        const newName = editedItem.name ?? ''

        const keyParts = key.split(':')
        const itemId = keyParts[1]

        // Update quantity / unitPrice / name if changed
        if (newQty <= 0) {
          toast.error('Quantity must be greater than zero')
          setIsSaving(false)
          return
        }

        if (newQty !== origQty || newPrice !== origPrice || newName !== origName) {
          await orderService.updateItemQuantity(orderId, itemId, newQty, newPrice, newName)
        }

        // Update discount percent if changed
        const origDiscountPercent =
          (original as any).discount?.type === 'PERCENT' ? (original as any).discount.value ?? 0 : 0
        const newDiscountPercent = editedItem.itemDiscount ?? 0

        if (newDiscountPercent < 0 || newDiscountPercent > 100) {
          toast.error('Discount percent must be between 0 and 100')
          setIsSaving(false)
          return
        }

        if (Math.abs(newDiscountPercent - origDiscountPercent) > 0.0001) {
          await orderService.updateItemDiscount({
            orderId,
            itemId,
            discountPercent: newDiscountPercent,
          })
        }
      }

      // 4. Overall order discount
      const originalOrderDiscountAmount = orderData.orderDiscount?.amount ?? 0
      const newOrderDiscountAmount = editData.orderDiscount?.amount ?? 0

      if (newOrderDiscountAmount < 0) {
        toast.error('Order discount cannot be negative')
        setIsSaving(false)
        return
      }

      if (Math.abs(newOrderDiscountAmount - originalOrderDiscountAmount) > 0.0001) {
        await orderService.applyOrderDiscount({
          orderId,
          discountAmount: newOrderDiscountAmount,
        })
      }

      toast.success('Order updated successfully')
      onClose?.()
    } catch (error) {
      const apiError = error as any
      toast.error(apiError.response?.data?.message ?? 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-2xl from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
                <FaPencil className="w-5 h-5 text-teal-600" />
                <Header flag={false} title={'Edit Order'} />
              </h1>
              <p className="text-slate-600 mt-2 font-semibold">Order #{editData.orderNumber}</p>
            </div>
            <button
              onClick={() => onClose?.()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer bg-primary/20"
            >
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <ToggleTabs
            options={[
              { id: 'customer', label: 'customer', icon: <User className="w-4 h-4" /> },
              { id: 'services', label: 'services', icon: <Package className="w-4 h-4" /> },
              { id: 'parts', label: 'parts', icon: <Package className="w-4 h-4" /> },
              { id: 'discounts', label: 'discounts', icon: <Percent className="w-4 h-4" /> },
            ]}
            defaultActive={activeTab}
            onChange={handleTabChange}
          />

        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-96">
          {/* Customer Tab - Read Only */}
          {activeTab === 'customer' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Full Name</p>
                  <p className="text-xl font-bold text-slate-900">{editData.customerId?.name}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Phone Number</p>
                  <p className="text-xl font-bold text-slate-900">{editData.customerId?.phone}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Email Address</p>
                  <p className="text-xl font-bold text-slate-900">{editData.customerId?.email}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Tractor</p>
                  <p className="text-xl font-bold text-slate-900">{editData.tractor?.name}</p>
                  <p className="text-sm text-slate-600 mt-1">Model: {editData.tractor?.model}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Services</h2>
                <Button
                  onClick={() => setIsAddServiceOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>
              {isAddServiceOpen && (
                <div className="mb-6 flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-sm font-semibold text-slate-700">Add service from catalog:</span>
                  <select
                    className="min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    disabled={isLoadingCatalog}
                  >
                    <option value="">Select service</option>
                    {servicesCatalog.map((svc) => (
                      <option key={svc._id} value={svc._id}>
                      {svc.title ? svc.title : svc.name} — ₹{svc.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={newServiceQty}
                    onChange={(e) => setNewServiceQty(Number(e.target.value) || 1)}
                    disabled={isLoadingCatalog}
                  />
                  <Button
                    disabled={isLoadingCatalog}
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                    onClick={async () => {
                      if (!selectedServiceId) {
                        toast.error('Please select a service from catalog')
                        return
                      }
                      if (newServiceQty <= 0) {
                        toast.error('Quantity must be greater than zero')
                        return
                      }
                      try {
                        await api.post(`/orders/${editData._id}/items`, {
                          itemId: selectedServiceId,
                          quantity: newServiceQty,
                          type: 'service',
                        })
                        const svc = servicesCatalog.find((s) => s._id === selectedServiceId)
                        if (svc) {
                          const subtotal = svc.price * newServiceQty
                          setEditData((prev) => ({
                            ...prev,
                            items: [
                              ...prev.items,
                              {
                                itemType: 'SERVICE',
                                name: svc.name,
                                quantity: newServiceQty,
                                unitPrice: svc.price,
                                itemDiscount: 0,
                                amountDiscount: 0,
                                lineTotals: {
                                  subtotal,
                                  discount: 0,
                                  final: subtotal,
                                },
                                serviceId: { _id: svc._id, name: svc.name },
                              } as any,
                            ],
                          }))
                        }
                        setSelectedServiceId('')
                        setNewServiceQty(1)
                        setIsAddServiceOpen(false)
                        toast.success('Service added to order')
                      } catch (error: any) {
                        const message = error?.response?.data?.message ?? 'Failed to add service to order'
                        toast.error(message)
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    onClick={() => {
                      setIsAddServiceOpen(false)
                      setSelectedServiceId('')
                      setNewServiceQty(1)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {editData.items.filter((item) => item.itemType === 'SERVICE').length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No services added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                       <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-primary">Service Name</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Qty</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Unit Price</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">% Discount</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Rs. Discount</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-primary">Total</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {editData.items
                        .filter((item) => item.itemType === 'SERVICE')
                        .map((item, idx) => {
                          const itemIndex = editData.items.indexOf(item)
                          const subtotal = (item.quantity || 0) * (item.unitPrice || 0)
                          const amountDiscount = item.amountDiscount || 0
                          const total = subtotal - amountDiscount
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  value={item.name || item.title || ""}
                                  onChange={(e) => updateItemField(itemIndex, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                  placeholder="Service name"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'quantity', e.target.value)}
                                  className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.unitPrice || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'unitPrice', e.target.value)}
                                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={item.itemDiscount || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'itemDiscount', e.target.value)}
                                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.amountDiscount || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'amountDiscount', e.target.value)}
                                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">₹{total.toFixed(2)}</td>
                              <td className="px-6 py-4 text-center">
                                <Button
                                  onClick={() => removeItem(itemIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 cursor-pointer hover:scale-105 hover:bg-red-50 hover:text-red-600 duration-300 transition-transform"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Parts Tab */}
          {activeTab === 'parts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Parts</h2>
                <Button
                  onClick={() => setIsAddPartOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Part
                </Button>
              </div>
              {isAddPartOpen && (
                <div className="mb-6 flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-sm font-semibold text-slate-700">Add part from catalog:</span>
                  <select
                    className="min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    disabled={isLoadingCatalog}
                  >
                    <option value="">Select part</option>
                    {partsCatalog.map((part) => (
                      <option key={part._id} value={part._id}>
                        {part.title ? part.title : part.name} — ₹{part.price} ({part.stock ?? 0} in stock)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={newPartQty}
                    onChange={(e) => setNewPartQty(Number(e.target.value) || 1)}
                    disabled={isLoadingCatalog}
                  />
                  <Button
                    disabled={isLoadingCatalog}
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                    onClick={async () => {
                      if (!selectedPartId) {
                        toast.error('Please select a part from catalog')
                        return
                      }
                      if (newPartQty <= 0) {
                        toast.error('Quantity must be greater than zero')
                        return
                      }
                      try {
                        await api.post(`/orders/${editData._id}/items`, {
                          itemId: selectedPartId,
                          quantity: newPartQty,
                          type: 'part',
                        })
                        const part = partsCatalog.find((p) => p._id === selectedPartId)
                        if (part) {
                          const subtotal = part.price * newPartQty
                          setEditData((prev) => ({
                            ...prev,
                            items: [
                              ...prev.items,
                              {
                                itemType: 'PART',
                                name: part.name,
                                quantity: newPartQty,
                                unitPrice: part.price,
                                itemDiscount: 0,
                                amountDiscount: 0,
                                lineTotals: {
                                  subtotal,
                                  discount: 0,
                                  final: subtotal,
                                },
                                partId: { _id: part.id, name: part.name },
                              } as any,
                            ],
                          }))
                        }else{
                          toast.error('Selected part not found in catalog')
                        }
                        setSelectedPartId('')
                        setNewPartQty(1)
                        setIsAddPartOpen(false)
                        toast.success('Part added to order')
                      } catch (error: any) {
                        const message = error?.response?.data?.message ?? 'Failed to add part to order'
                        toast.error(message)
                      }
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                    onClick={() => {
                      setIsAddPartOpen(false)
                      setSelectedPartId('')
                      setNewPartQty(1)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {editData.items.filter((item) => item.itemType === 'PART').length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No parts added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-primary">Service Name</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Qty</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Unit Price</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">% Discount</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Rs. Discount</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-primary">Total</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-primary">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {editData.items
                        .filter((item) => item.itemType === 'PART')
                        .map((item, idx) => {
                          const itemIndex = editData.items.indexOf(item)
                          const subtotal = (item.quantity || 0) * (item.unitPrice || 0)
                          const amountDiscount = item.amountDiscount || 0
                          const total = subtotal - amountDiscount
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  value={item.title ? item.title : item.name}
                                  onChange={(e) => updateItemField(itemIndex, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                  placeholder="Part name"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'quantity', e.target.value)}
                                  className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.unitPrice || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'unitPrice', e.target.value)}
                                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={item.itemDiscount || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'itemDiscount', e.target.value)}
                                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.amountDiscount || 0}
                                  onChange={(e) => updateItemField(itemIndex, 'amountDiscount', e.target.value)}
                                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-center"
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">₹{total.toFixed(2)}</td>
                              <td className="px-6 py-4 text-center">
                                <Button
                                  onClick={() => removeItem(itemIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 cursor-pointer hover:scale-105 hover:bg-red-50 hover:text-red-600 duration-300 transition-transform"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Discounts Tab */}
          {activeTab === 'discounts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Order Discount</h2>
              <div className="">
                {/* Toggle Discount */}
                <div className="bg-gradient-to-br  rounded-xl p-4 border  mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <label className="block text-lg font-bold text-slate-900">Apply Overall Discount</label>
                    <button
                      onClick={() =>
                        setEditData({
                          ...editData,
                          orderDiscount: {
                            ...editData.orderDiscount,
                            type: editData.orderDiscount.type === 'NONE' ? 'FIXED' : 'NONE',
                            amount: editData.orderDiscount.type === 'NONE' ? 0 : editData.orderDiscount.amount,
                          },
                        })
                      }
                      className={`relative inline-flex h-8 cursor-pointer w-14 items-center rounded-full transition-colors ${editData.orderDiscount.type !== 'NONE' ? 'bg-teal-600' : 'bg-slate-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${editData.orderDiscount.type !== 'NONE' ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {editData.orderDiscount.type !== 'NONE' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-sm font-bold text-slate-900 mb-3">Discount Amount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={editData.orderDiscount.amount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            orderDiscount: { ...editData.orderDiscount, amount: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 font-bold text-xl"
                        placeholder="0"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Changes Applied */}
                {editData.orderDiscount.type !== 'NONE' && editData.orderDiscount.amount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 rounded-xl p-6 border-2 border-green-300 mb-6"
                  >
                    <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">✓</span>
                      Discount Applied
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-900">Discount Amount:</span>
                        <span className="font-bold text-green-700">-₹{editData.orderDiscount.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-green-300 pt-3">
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Order Summary */}
                <div className="bg-slate-100 rounded-xl p-6 border border-slate-300">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">Items Subtotal:</span>
                      <span className="font-bold text-slate-900">₹{editData.totals.itemsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">Items Discount:</span>
                      <span className="font-bold text-red-600">-₹{editData.totals.itemsDiscount.toFixed(2)}</span>
                    </div>
                    {editData.orderDiscount.type !== 'NONE' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-700">Order Discount:</span>
                        <span className="font-bold text-red-600">-₹{editData.orderDiscount.amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg border-t border-slate-300 pt-3 font-bold">
                      <span className="text-slate-900">Final Total:</span>
                      <span className="text-teal-600">₹{(editData.totals.final - (editData.orderDiscount.type !== 'NONE' ? editData.orderDiscount.amount : 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 justify-end mt-6">
          <Button onClick={() => onClose?.()} variant="outline" className="px-8 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-teal-600 hover:bg-teal-700 cursor-pointer text-white px-8 py-3 rounded-xl font-semibold"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

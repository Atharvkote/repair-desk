"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Phone, Mail, User, Wrench, Package, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FaFolderOpen, FaTrash } from "react-icons/fa6"
import { MdEdit } from "react-icons/md"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { orderService } from "@/services/order.service"
import Loader from "@/components/shared/loader"
import Header from "@/components/shared/sytle-header"
import { Edit } from "lucide-react"
import EditServicePage from "./edit-services-page"

const STATUS_COLORS = {
  "ONGOING": "bg-teal-50 text-teal-700 border-teal-200",
  "In Progress": "bg-teal-50 text-teal-700 border-teal-200",
  "PENDING": "bg-amber-50 text-amber-700 border-amber-200",
  "Pending": "bg-amber-50 text-amber-700 border-amber-200",
  "COMPLETED": "bg-green-50 text-green-700 border-green-200",
  "Ready for Delivery": "bg-blue-50 text-blue-700 border-blue-200",
  "ON_HOLD": "bg-rose-50 text-rose-700 border-rose-200",
  "On Hold": "bg-rose-50 text-rose-700 border-rose-200",
}

export default function ActiveServices() {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRow, setExpandedRow] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditorOn, setisEditorOn] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOngoingOrders()
      setServices(response.data)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim() || !services) {
      return services
    }

    const q = searchQuery.toLowerCase()

    return services.filter((service) => {
      return (
        service.orderNumber?.toLowerCase().includes(q) ||
        service._id?.toLowerCase().includes(q) ||
        service.customerId?.name?.toLowerCase().includes(q) ||
        service.tractor?.name?.toLowerCase().includes(q) ||
        service.tractor?.model?.toLowerCase().includes(q)
      )
    })
  }, [searchQuery, services])

  const getServices = (items = []) =>
    items?.filter(item => item.itemType === "SERVICE")

  const getParts = (items = []) =>
    items?.filter(item => item.itemType === "PART")

  const handleEdit = (service) => {
    setServiceToEdit(service);
    setisEditorOn(true);
  }

  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to delete order ${service.orderNumber}?`)) {
      return
    }

    try {
      await orderService.deleteOrder(service._id)
      toast.success("Order deleted successfully")
      fetchServices() // Refresh the list
    } catch (error) {
      console.error("Error deleting order:", error)
      toast.error(error?.response?.data?.message || error.message || "Failed to delete order")
    }
  }

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const calculateItemsTotal = (items, itemType) => {
    return items
      .filter(item => item.itemType === itemType)
      .reduce((sum, item) => sum + (item.lineTotals?.final || 0), 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      'ONGOING': 'In Progress',
      'COMPLETED': 'Ready for Delivery',
      'PENDING': 'Pending',
      'ON_HOLD': 'On Hold'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="space-y-6  animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-teal-600 tracking-tight flex items-center gap-2">
            <FaFolderOpen className="w-5 h-5 text-teal-600" />
            <Header title={t("activeServices.title")} />
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t("activeServices.description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t("activeServices.searchPlaceholder")}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-full md:w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("activeServices.orderId")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("activeServices.customer")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("activeServices.tractor")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("activeServices.date")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("activeServices.status")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t("activeServices.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices?.map((service, index) => (
                <motion.tr
                  key={service._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <td colSpan={6} className="p-0">
                    <div>
                      <div className="flex items-center hover:bg-slate-50/50 transition-colors">
                        <button
                          onClick={() => toggleRow(service._id)}
                          className="px-6 py-4 flex items-center gap-3 hover:text-teal-600 transition-colors"
                        >
                          <motion.div
                            animate={{ rotate: expandedRow === service._id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </motion.div>
                          <span className="font-bold text-sm text-teal-600">
                            {service.orderNumber || service._id}
                          </span>
                        </button>

                        <div className="flex-1 grid grid-cols-5 gap-4 pr-6 py-4">
                          <div>
                            <div className="font-semibold text-sm text-slate-900">
                              {service?.customerId?.name}
                            </div>
                            <div className="text-xs text-slate-500">{service.customerId?.phone}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">
                              {service.tractor?.name}
                            </div>
                            <div className="text-xs text-slate-500">{service.tractor?.model}</div>
                          </div>
                          <div className="text-sm text-slate-600">
                            {formatDate(service.createdAt || service.startedAt)}
                          </div>
                          <div>
                            <span
                              className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[service.status] || STATUS_COLORS["ONGOING"]
                                }`}
                            >
                              {getStatusDisplay(service.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
                            >
                              <MdEdit className="w-4 h-4" />
                              {t("activeServices.edit")}
                            </button>
                            <button
                              onClick={() => handleDelete(service)}
                              className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                              {t("activeServices.delete")}
                            </button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedRow === service._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden bg-slate-50/30"
                          >
                            <div className="px-6 py-6 space-y-6">
                              {/* Customer Information */}
                              <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 pb-3 border-b border-slate-100">
                                  <User className="w-5 h-5 text-teal-600" />
                                  <h4 className="font-bold text-sm uppercase tracking-wide">
                                    {t("activeServices.customerInformation")}
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                      <User className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                        {t("activeServices.name")}
                                      </div>
                                      <div className="text-sm font-bold text-slate-900 mt-1">
                                        {service.customerId?.name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                      <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                        {t("activeServices.phone")}
                                      </div>
                                      <div className="text-sm font-bold text-slate-900 mt-1">
                                        {service.customerId?.phone}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                      <Mail className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                        {t("activeServices.email")}
                                      </div>
                                      <div className="text-sm font-bold text-slate-900 mt-1">
                                        {service.customerId?.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Services and Parts Grid */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Services Section */}
                                <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                                  <div className="flex items-center gap-2 text-slate-900 px-5 py-4 bg-teal-50/30 border-b border-slate-200">
                                    <Wrench className="w-5 h-5 text-teal-600" />
                                    <h4 className="font-bold text-sm uppercase tracking-wide">
                                      {t("activeServices.servicesProvided")}
                                    </h4>
                                  </div>
                                  <div className="divide-y divide-slate-100">
                                    {getServices(service.items).length > 0 ? (
                                      <>
                                        {getServices(service.items).map((svc) => (
                                          <div key={svc.serviceId?._id} className="px-5 py-3 flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="text-sm font-semibold text-slate-900">
                                                {svc.serviceId?.title || svc.serviceId?.name || svc.name}
                                              </div>
                                              <div className="text-xs mt-0.5">
                                                <span className="text-slate-500">
                                                  {t("activeServices.qty")}: {svc.quantity}
                                                </span>
                                                {svc.serviceId?.status && (
                                                  <span className={`ml-2 font-medium ${svc.serviceId.status === "AVAILABLE"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                    }`}>
                                                    • {svc.serviceId.status}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="text-sm font-bold text-teal-600">
                                              ₹{svc.lineTotals?.final?.toFixed(2) || svc.unitPrice?.toFixed(2)}
                                            </div>
                                          </div>
                                        ))}
                                        <div className="px-5 py-3 flex items-center justify-between bg-slate-50/50">
                                          <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                            {t("activeServices.servicesTotal")}
                                          </div>
                                          <div className="text-base font-black text-teal-700">
                                            ₹{calculateItemsTotal(service.items, "SERVICE").toFixed(2)}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="px-5 py-8 text-center text-slate-400 text-sm">
                                        No services added
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Parts Section */}
                                <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                                  <div className="flex items-center gap-2 text-slate-900 px-5 py-4 bg-blue-50/30 border-b border-slate-200">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    <h4 className="font-bold text-sm uppercase tracking-wide">
                                      {t("activeServices.partsMaterials")}
                                    </h4>
                                  </div>
                                  <div className="divide-y divide-slate-100">
                                    {getParts(service.items).length > 0 ? (
                                      <>
                                        {getParts(service.items).map((part) => (
                                          <div key={part.partId?._id} className="px-5 py-3 flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="text-sm font-semibold text-slate-900">
                                                {part.partId?.title || part.partId?.name || part.name}
                                              </div>
                                              <div className="text-xs text-slate-500 mt-0.5">
                                                {t("activeServices.qty")}: {part.quantity}
                                              </div>
                                            </div>
                                            <div className="text-sm font-bold text-blue-600">
                                              ₹{part.lineTotals?.final?.toFixed(2) || part.unitPrice?.toFixed(2)}
                                            </div>
                                          </div>
                                        ))}
                                        <div className="px-5 py-3 flex items-center justify-between bg-slate-50/50">
                                          <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                            {t("activeServices.partsTotal")}
                                          </div>
                                          <div className="text-base font-black text-blue-700">
                                            ₹{calculateItemsTotal(service.items, "PART").toFixed(2)}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="px-5 py-8 text-center text-slate-400 text-sm">
                                        No parts added
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Order Total */}
                              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200/60 p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                                      {t("activeServices.orderTotal")}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                      {t("activeServices.dated")}: {formatDate(service.createdAt || service.startedAt)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-3xl font-black text-teal-700">
                                  ₹{service.totals?.final?.toFixed(2) || "0.00"}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices?.length === 0 && (
          <div className="py-12 text-center text-slate-400 font-medium italic">
            {t("activeServices.noActiveServices")}
          </div>
        )}
      </div>


      {isEditorOn &&
        serviceToEdit && (
          <EditServicePage
            orderData={serviceToEdit}
            onClose={() => {
              setisEditorOn(false)
              fetchServices()
            }}
          />
        )}

    </div>
  )
}
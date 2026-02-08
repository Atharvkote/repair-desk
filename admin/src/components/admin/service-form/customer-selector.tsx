"use client"

import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus2 } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useTranslation } from "react-i18next"
import { orderService } from "@/services/order.service"

interface CustomerSelectorProps {
  selectedUser: any
  onUserSelect: (user: any) => void
  onOrderCreated: (orderId: string) => void
  tractor: { name: string; model: string }
  onTractorChange: (tractor: { name: string; model: string }) => void
  isSearching: boolean
  users: any[]
  onSearch: (query: string) => void
}

export function CustomerSelector({
  selectedUser,
  onUserSelect,
  onOrderCreated,
  tractor,
  onTractorChange,
  isSearching,
  users,
  onSearch,
}: CustomerSelectorProps) {
  const { t } = useTranslation("pages")
  const [userQuery, setUserQuery] = useState("")
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const debouncedUserQuery = useDebounce(userQuery, 350)

  useEffect(() => {
    onSearch(debouncedUserQuery)
  }, [debouncedUserQuery, onSearch])

  const handleCreateOrder = async () => {
    if (!selectedUser) return

    setIsCreatingOrder(true)
    try {
      const order = await orderService.createDraftOrder({
        customerId: selectedUser._id,
        tractor:
          tractor.name || tractor.model
            ? {
                name: tractor.name || undefined,
                model: tractor.model || undefined,
              }
            : undefined,
      })
      onOrderCreated(order.data.id)
      toast.success("Draft order created")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create draft order")
    } finally {
      setIsCreatingOrder(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t("stepForm.customerTractorDetails")}</h3>
        <p className="text-slate-500 text-[15px]">{t("stepForm.customerTractorDescription")}</p>
      </div>

      {/* Customer Search */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
          {t("stepForm.searchCustomer")}
        </label>
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
          <Input
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={t("stepForm.searchPlaceholder")}
            className="pl-12 bg-slate-50/50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all text-[15px]"
          />
        </div>
      </div>

      {/* Customer Results */}
      <div className="max-h-[280px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/30 divide-y divide-slate-100/80">
        {isSearching ? (
          <div className="p-8 text-center text-slate-400 font-medium italic">Searching...</div>
        ) : userQuery && users.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="font-medium mb-3">No customers found</p>
            <Button
              size="sm"
              variant="outline"
              className="text-teal-600 border-teal-200 hover:bg-teal-50 bg-transparent"
            >
              <UserPlus2 className="w-4 h-4 mr-2" />
              Create New Customer
            </Button>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                onUserSelect(user)
                setUserQuery("")
              }}
              className="p-4 cursor-pointer hover:bg-white transition-colors flex justify-between items-center group"
            >
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.phone}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>

      {/* Selected Customer Display */}
      {selectedUser && (
        <div className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border border-teal-200/50 rounded-2xl p-5">
          <p className="text-sm text-slate-600 mb-2">Selected Customer</p>
          <p className="font-bold text-slate-900 mb-3">{selectedUser.name}</p>
          <p className="text-sm text-slate-600">{selectedUser.phone}</p>
        </div>
      )}

      {/* Tractor Details */}
      {selectedUser && (
        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
          <h4 className="font-bold text-slate-900">Tractor Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">Name</label>
              <Input
                value={tractor.name}
                onChange={(e) => onTractorChange({ ...tractor, name: e.target.value })}
                placeholder="e.g., Tractor A"
                className="h-10"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">Model</label>
              <Input
                value={tractor.model}
                onChange={(e) => onTractorChange({ ...tractor, model: e.target.value })}
                placeholder="e.g., JD 5050"
                className="h-10"
              />
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <Button
          onClick={handleCreateOrder}
          disabled={isCreatingOrder}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 rounded-xl font-semibold"
        >
          {isCreatingOrder ? "Creating..." : "Create Draft Order & Continue"}
        </Button>
      )}
    </div>
  )
}

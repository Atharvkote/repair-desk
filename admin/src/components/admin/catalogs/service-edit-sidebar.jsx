"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Settings, Save, Loader2 } from "lucide-react"
import { catalogService } from "@/services/catalog.service"
import { toast } from "sonner"

export function ServiceEditSidebar({ service, open, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: "", description: "", price: "", status: "AVAILABLE" })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (service && open) {
      // Load full service data if we only have partial data
      const loadServiceData = async () => {
        if (service._id && (!service.serviceCode || !service.price)) {
          try {
            setIsLoading(true)
            const fullService = await catalogService.getServiceById(service._id)
            setFormData({
              name: fullService.name || "",
              description: fullService.description || "",
              price: fullService.price?.toString() || "",
              status: fullService.status || "AVAILABLE",
            })
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load service details")
            onClose()
          } finally {
            setIsLoading(false)
          }
        } else {
          setFormData({
            name: service.name || "",
            description: service.description || "",
            price: service.price?.toString() || "",
            status: service.status || "AVAILABLE",
          })
        }
      }
      loadServiceData()
    }
  }, [service, open, onClose])

  if (!service) return null

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price) {
      toast.error("Service name and price are required")
      return
    }

    const price = Number(formData.price)
    if (isNaN(price) || price < 0) {
      toast.error("Price must be a valid non-negative number")
      return
    }

    setIsSaving(true)
    try {
      const updatedService = await catalogService.updateService(service._id || service.id, {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price,
        status: formData.status,
      })
      
      toast.success("Service updated successfully")
      onSave(updatedService)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update service")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide-over */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-md z-[70] transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-5 rounded-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Edit Service</h2>
                <p className="text-primary-foreground/80 text-xs">Update service details</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 mt-4 bg-white rounded-md shadow border border-border overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Service Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter service name"
                      className="h-10"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description"
                      className="h-10"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Price (₹) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                      className="h-10"
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading || isSaving}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
                disabled={isLoading || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="flex-1 bg-transparent"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default ServiceEditSidebar

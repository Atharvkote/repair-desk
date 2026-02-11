"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Package, Save, Loader2 } from "lucide-react"
import { catalogService } from "@/services/catalog.service"
import { toast } from "sonner"

export function PartsEditSidebar({ part, open, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "", unit: "piece", status: "AVAILABLE" })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (part && open) {
      const loadPartData = async () => {
        if (part._id && (!part.partCode || part.price === undefined)) {
          try {
            setIsLoading(true)
            const fullPart = await catalogService.getPartById(part._id)
            setFormData({
              name: fullPart.name || "",
              description: fullPart.description || "",
              price: fullPart.price?.toString() || "",
              stock: fullPart.stock?.toString() || "0",
              unit: fullPart.unit || "piece",
              status: fullPart.status || "AVAILABLE",
            })
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load part details")
            onClose()
          } finally {
            setIsLoading(false)
          }
        } else {
          setFormData({
            name: part.title || "",
            description: part.description || "",
            price: part.price?.toString() || "",
            stock: part.stock?.toString() || "0",
            unit: part.unit || "piece",
            status: part.status || "AVAILABLE",
          })
        }
      }
      loadPartData()
    }
  }, [part, open, onClose])

  if (!part) return null

  const handleSave = async () => {
    if (!formData.name.trim() || formData.price === "" || formData.stock === "") {
      toast.error("Part name, price, and stock are required")
      return
    }

    const price = Number(formData.price)
    const stock = Number(formData.stock)
    
    if (isNaN(price) || price < 0) {
      toast.error("Price must be a valid non-negative number")
      return
    }
    
    if (isNaN(stock) || stock < 0) {
      toast.error("Stock must be a valid non-negative number")
      return
    }

    setIsSaving(true)
    try {
      const updatedPart = await catalogService.updatePart(part._id || part.id, {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price,
        stock,
        unit: formData.unit,
        status: formData.status,
      })
      
      toast.success("Part updated successfully")
      onSave(updatedPart)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update part")
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
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Edit Part</h2>
                <p className="text-primary-foreground/80 text-xs">Update part details</p>
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
                    <label className="text-sm font-semibold text-foreground block mb-2">Part Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter part name"
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
                    <label className="text-sm font-semibold text-foreground block mb-2">Unit</label>
                    <Input
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g., piece, kg, liter"
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

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Stock Quantity *</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="Enter stock quantity"
                      className="h-10"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSaving}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="OUT_OF_STOCK">Out of Stock</option>
                      <option value="DISABLED">Disabled</option>
                    </select>
                  </div>
                </>
              )}
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

export default PartsEditSidebar

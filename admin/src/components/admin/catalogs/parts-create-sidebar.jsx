"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Save, Loader2 } from "lucide-react"
import { catalogService } from "@/services/catalog.service"
import { toast } from "sonner"

export function PartsCreateSidebar({ open, onClose, onCreate }) {
  const [formData, setFormData] = useState({ 
    partCode: "", 
    name: "", 
    description: "", 
    price: "", 
    stock: "", 
    unit: "piece",
    status: "AVAILABLE" 
  })
  const [isSaving, setIsSaving] = useState(false)

  const generatePartCode = () => {
    const prefix = "PRT"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }

  const handleCreate = async () => {
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

    const partCode = formData.partCode.trim() || generatePartCode()

    setIsSaving(true)
    try {
      const newPart = await catalogService.createPart({
        partCode,
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price,
        stock,
        unit: formData.unit,
        status: formData.status,
      })
      
      toast.success("Part created successfully")
      onCreate(newPart)
      setFormData({ 
        partCode: "", 
        name: "", 
        description: "", 
        price: "", 
        stock: "", 
        unit: "piece",
        status: "AVAILABLE" 
      })
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create part")
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
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Create Part</h2>
                <p className="text-primary-foreground/80 text-xs">Add a new part</p>
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
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Part Code (optional)</label>
                <Input
                  value={formData.partCode}
                  onChange={(e) => setFormData({ ...formData, partCode: e.target.value })}
                  placeholder="Auto-generated if left empty"
                  className="h-10"
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate</p>
              </div>

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
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button 
                onClick={handleCreate} 
                className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Part
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

export default PartsCreateSidebar

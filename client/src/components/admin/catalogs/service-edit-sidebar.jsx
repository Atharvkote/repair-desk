"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Settings, Save } from "lucide-react"

export function ServiceEditSidebar({ service, open, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: "", description: "", price: "", status: "available" })

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        status: service.status || "available",
      })
    }
  }, [service])

  if (!service) return null

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price) return
    onSave({
      ...service,
      ...formData,
      price: Number(formData.price),
    })
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
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Service Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Price (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
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

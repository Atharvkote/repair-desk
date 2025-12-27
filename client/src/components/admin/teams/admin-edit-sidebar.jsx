"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AdminEditSidebar = ({ admin, open, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: "", phone: "", status: "active" })

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        phone: admin.phone,
        status: admin.status,
      })
    }
  }, [admin, open])

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please fill in all required fields")
      return
    }
    onSave({ ...admin, ...formData })
  }

  if (!admin) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-over */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-md z-[70] transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-5 rounded-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded">
                <Save className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Edit Admin</h2>
                <p className="text-teal-100 text-xs">Update admin details</p>
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
                <Label htmlFor="admin-name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="admin-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter admin name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="admin-phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="admin-phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="admin-status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="admin-status" className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button onClick={handleSubmit} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2">
                <Save className="w-4 h-4" />
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

export default AdminEditSidebar

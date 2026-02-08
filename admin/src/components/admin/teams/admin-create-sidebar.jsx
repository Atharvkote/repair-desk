"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

const AdminCreateSidebar = ({ open, onClose, onCreate }) => {
  const { t } = useTranslation('admin')
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    status: "active",
  })

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.password.trim()) {
      toast.warning(t("createAdmin.fillAllFields"))
      return
    }
    if (formData.password.length < 6) {
      toast.warning(t("createAdmin.passwordMinLength"))
      return
    }
    onCreate(formData)
    setFormData({ name: "", phone: "", password: "", status: "active" })
  }

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
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{t("createAdmin.title")}</h2>
                <p className="text-teal-100 text-xs">{t("createAdmin.description")}</p>
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
                <Label htmlFor="new-admin-name" className="text-sm font-medium">
                  {t("createAdmin.name")} *
                </Label>
                <Input
                  id="new-admin-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder={t("createAdmin.name")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="new-admin-phone" className="text-sm font-medium">
                  {t("createAdmin.phone")} *
                </Label>
                <Input
                  id="new-admin-phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder={t("createAdmin.phone")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="new-admin-password" className="text-sm font-medium">
                  {t("createAdmin.password")} *
                </Label>
                <Input
                  id="new-admin-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={t("createAdmin.password")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="new-admin-status" className="text-sm font-medium">
                  {t("createAdmin.status")}
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="new-admin-status" className="mt-2">
                    <SelectValue placeholder={t("createAdmin.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("createAdmin.active")}</SelectItem>
                    <SelectItem value="inactive">{t("createAdmin.inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Box */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-teal-700 font-medium">{t("createAdmin.passwordMinLength")}</p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-4 bg-white flex gap-2">
              <Button onClick={handleSubmit} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                {t("createAdmin.create")}
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                {t("createAdmin.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminCreateSidebar

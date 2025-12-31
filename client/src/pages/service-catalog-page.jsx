"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MdEdit, MdOutlineMiscellaneousServices } from "react-icons/md"
import { FaEye, FaTrash } from "react-icons/fa6"
import ServiceDetailSidebar from "@/components/admin/catalogs/service-detail-sidebar"
import ServiceEditSidebar from "@/components/admin/catalogs/service-edit-sidebar"
import ServiceCreateSidebar from "@/components/admin/catalogs/service-create-sidebar"
import { useTranslation } from "react-i18next"
import { catalogService } from "@/services/catalog.service"
import { toast } from "sonner"
import { Search } from "lucide-react"
import { Plus } from "lucide-react"

const ServiceCatalog = () => {
  const { t } = useTranslation("pages")

  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState(null)
  const [editingService, setEditingService] = useState(null)

  const [viewSidebarOpen, setViewSidebarOpen] = useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [createSidebarOpen, setCreateSidebarOpen] = useState(false)

  // Fetch services
  const fetchCatalog = async () => {
    try {
      const data = await catalogService.getServices()
      setServices(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch services")
    }
  }

  useEffect(() => {
    fetchCatalog()
  }, [])

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const nameMatch = s.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const descMatch = s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return nameMatch || descMatch
    })
  }, [services, searchQuery])

  const handleView = (service) => {
    setSelectedService(service)
    setViewSidebarOpen(true)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setEditSidebarOpen(true)
  }

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((s) => s._id !== id))
  }

  const handleSaveService = (updatedService) => {
    setServices((prev) =>
      prev.map((s) => (s._id === updatedService._id ? updatedService : s))
    )
    setEditSidebarOpen(false)
  }

  const handleCreateService = (newService) => {
    setServices((prev) => [...prev, newService])
    setCreateSidebarOpen(false)
  }

  return (
    <div className="max-w-6xl px-5 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2"><MdOutlineMiscellaneousServices className="w-8 h-8" /> {t("serviceCatalog.title")}</h1>
          <p className="text-muted-foreground">{t("serviceCatalog.description")}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 text-teal-600  -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("serviceCatalog.searchPlaceholder")}
              className="pl-9 border-2 border-teal-600"
            />
          </div>
          <Button onClick={() => setCreateSidebarOpen(true)} className="bg-primary cursor-pointer hover:bg-primary/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            {t("serviceCatalog.newService")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sr. No.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("serviceCatalog.serviceName")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("serviceCatalog.description")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("serviceCatalog.price")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("serviceCatalog.status")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("serviceCatalog.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServices?.length > 0 ? (
              filteredServices?.map((service ,index) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.title ? service.title : service.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{service.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-teal-600">₹{service.price}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">{service.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleView(service)}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2 cursor-pointer"
                      >
                        <FaEye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleEdit(service)}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2 cursor-pointer"
                      >
                        <MdEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(service.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {t("serviceCatalog.noServicesFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sidebars */}
      <ServiceDetailSidebar
        service={selectedService}
        open={viewSidebarOpen}
        onClose={() => setViewSidebarOpen(false)}
      />
      <ServiceEditSidebar
        service={editingService}
        open={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        onSave={handleSaveService}
      />
      <ServiceCreateSidebar
        open={createSidebarOpen}
        onClose={() => setCreateSidebarOpen(false)}
        onCreate={handleCreateService}
      />
    </div>
  )
}

export default ServiceCatalog

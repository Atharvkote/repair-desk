"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit2, Eye, Trash2 } from "lucide-react"
import ServiceDetailSidebar from "@/components/admin/catalogs/service-detail-sidebar"
import ServiceEditSidebar from "@/components/admin/catalogs/service-edit-sidebar"
import ServiceCreateSidebar from "@/components/admin/catalogs/service-create-sidebar"
import { MdEdit, MdOutlineMiscellaneousServices } from "react-icons/md";
import { FaEye, FaTrash } from "react-icons/fa6"
const ServiceCatalog = () => {
  const [services, setServices] = useState([
    { id: "1", name: "Oil Change", description: "Regular engine oil replacement", price: 500, status: "available" },
    {
      id: "2",
      name: "Filter Replacement",
      description: "Air and fuel filter replacement",
      price: 300,
      status: "available",
    },
    { id: "3", name: "Tire Service", description: "Tire inspection and rotation", price: 800, status: "available" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState(null)
  const [viewSidebarOpen, setViewSidebarOpen] = useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [createSidebarOpen, setCreateSidebarOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleView = (service) => {
    setSelectedService(service)
    setViewSidebarOpen(true)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setEditSidebarOpen(true)
  }

  const handleDelete = (id) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleSaveService = (updatedService) => {
    setServices(services.map((s) => (s.id === updatedService.id ? updatedService : s)))
    setEditSidebarOpen(false)
  }

  const handleCreateService = (newService) => {
    setServices([...services, { ...newService, id: Date.now().toString() }])
    setCreateSidebarOpen(false)
  }

  return (
    <div className="max-w-6xl px-5 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2"><MdOutlineMiscellaneousServices className="w-8 h-8" /> Service CatalogService Catalog</h1>
                    <p className="text-muted-foreground">Manage and view all available services</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 text-teal-600  -translate-y-1/2" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search services..."
                            className="pl-9 border-2 border-teal-600"
                        />
                    </div>
                    <Button onClick={() => setCreateSidebarOpen(true)} className="bg-primary cursor-pointer hover:bg-primary/90 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        New Service
                    </Button>
                </div>
            </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
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
                  No services found
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

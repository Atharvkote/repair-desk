"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit2, Eye, Trash2 } from "lucide-react"
import AdminDetailSidebar from "@/components/admin/teams/admin-detail-sidebar"
import AdminEditSidebar from "@/components/admin/teams/admin-edit-sidebar"
import AdminCreateSidebar from "@/components/admin/teams/admin-create-sidebar"
import { RiAdminFill } from "react-icons/ri"
import { GrUserAdmin } from "react-icons/gr"
import { MdAdminPanelSettings } from "react-icons/md"
import { FaEye, FaTrash } from "react-icons/fa6"

const AdminManagement = () => {
  const [admins, setAdmins] = useState([
    { id: "1", name: "John Doe", phone: "+91 9876543210", email: "john@example.com", status: "active" },
    { id: "2", name: "Jane Smith", phone: "+91 9876543211", email: "jane@example.com", status: "active" },
    { id: "3", name: "Mike Johnson", phone: "+91 9876543212", email: "mike@example.com", status: "inactive" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [viewSidebarOpen, setViewSidebarOpen] = useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [createSidebarOpen, setCreateSidebarOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleView = (admin) => {
    setSelectedAdmin(admin)
    setViewSidebarOpen(true)
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setEditSidebarOpen(true)
  }

  const handleDelete = (id) => {
    setAdmins(admins.filter((a) => a.id !== id))
  }

  const handleSaveAdmin = (updatedAdmin) => {
    setAdmins(admins.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a)))
    setEditSidebarOpen(false)
  }

  const handleCreateAdmin = (newAdmin) => {
    setAdmins([...admins, { ...newAdmin, id: Date.now().toString() }])
    setCreateSidebarOpen(false)
  }

  return (
    <div className="max-w-6xl px-5 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">

        <div className="space-y-2 ">
          <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2"><MdAdminPanelSettings className="w-8 h-8" /> Teams</h1>
          <p className="text-muted-foreground">Create, manage, and view all team admins</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-teal-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="pl-9 border-2 border-teal-600"
            />
          </div>
          <Button onClick={() => setCreateSidebarOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Admin
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.phone}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        admin.status === "active"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }
                    >
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleView(admin)}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white gap- cursor-pointer"
                      >
                        <FaEye className="w-4 h-4" />
                      </Button>
                      {/* <Button
                        onClick={() => handleEdit(admin)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button> */}
                      <Button
                        onClick={() => handleDelete(admin.id)}
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
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sidebars */}
      <AdminDetailSidebar admin={selectedAdmin} open={viewSidebarOpen} onClose={() => setViewSidebarOpen(false)} />
      <AdminEditSidebar
        admin={editingAdmin}
        open={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        onSave={handleSaveAdmin}
      />
      <AdminCreateSidebar
        open={createSidebarOpen}
        onClose={() => setCreateSidebarOpen(false)}
        onCreate={handleCreateAdmin}
      />
    </div>
  )
}

export default AdminManagement

"use client"

import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/shared/sytle-header"
import { Search, Plus } from "lucide-react"
import { FaEye, FaTrash, FaScrewdriverWrench } from "react-icons/fa6"
import { MdEdit } from "react-icons/md"
import { catalogService } from "@/services/catalog.service"
import { toast } from "sonner"

import PartsDetailSidebar from "@/components/admin/catalogs/parts-detail-sidebar"
import PartsEditSidebar from "@/components/admin/catalogs/parts-edit-sidebar"
import PartsCreateSidebar from "@/components/admin/catalogs/parts-create-sidebar"
import Loader from "@/components/shared/loader"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const PartsCatalog = () => {
  const { t } = useTranslation("pages")
  const { permissions } = useAdminAuth()
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(false)


  const [selectedPart, setSelectedPart] = useState(null)
  const [editingPart, setEditingPart] = useState(null)
  const [deletingPart, setDeletingPart] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewSidebarOpen, setViewSidebarOpen] = useState(false)
  const [editSidebarOpen, setEditSidebarOpen] = useState(false)
  const [createSidebarOpen, setCreateSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")


  const fetchCatalog = async () => {
    try {
      setLoading(true)
      const parts_data = await catalogService.getParts()
      setParts(parts_data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch parts")
    } finally {
      setLoading(false)
    }
  }

  const handleView = (part) => {
    setSelectedPart(part)
    setViewSidebarOpen(true)
  }

  const handleEdit = (part) => {
    setEditingPart(part)
    setEditSidebarOpen(true)
  }
  const handleDeleteClick = (part) => {
    if (!permissions?.canDeleteParts) {
      toast.error("Only SUPER_ADMIN can delete parts")
      return
    }

    toast.custom(
      (t) => (
        <div className="w-full max-w-lg w-full rounded-xl border border-red-400 bg-red-100 p-4 shadow-xl">

          {/* TITLE */}
          <p className="text-md font-bold text-red-600">
            Delete this part?
          </p>

          {/* DESCRIPTION */}
          <p className="mt-1 text-sm text-gray-600 font-medium">
            “{part.title || part.name}” will be permanently removed.
            This action cannot be undone.
          </p>

          {/* ACTIONS */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t)

                const loading = toast.loading("Deleting part...")

                try {
                  await catalogService.deletePart(part._id || part.id)

                  setParts((prev) =>
                    prev.filter(
                      (p) => (p._id || p.id) !== (part._id || part.id)
                    )
                  )

                  toast.success("Part deleted successfully")
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete part"
                  )
                } finally {
                  toast.dismiss(loading)
                }
              }}
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 cursor-pointer text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>

            <button
              onClick={() => toast.dismiss(t)}
              className="flex-1 rounded-lg border border-gray-300 cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }




  const handleDeleteConfirm = async () => {
    if (!deletingPart) return

    setIsDeleting(true)
    try {
      await catalogService.deletePart(deletingPart._id || deletingPart.id)
      toast.success("Part deleted successfully")
      setParts((prev) => prev.filter((p) => (p._id || p.id) !== (deletingPart._id || deletingPart.id)))
      setDeletingPart(null)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete part")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSavePart = (updatedPart) => {
    setParts((prev) => prev.map((p) => (p._id || p.id) === (updatedPart._id || updatedPart.id) ? updatedPart : p))
    setEditSidebarOpen(false)
    fetchCatalog() // Refresh to ensure consistency
  }

  const handleCreatePart = (newPart) => {
    setParts((prev) => [...prev, newPart])
    setCreateSidebarOpen(false)
    fetchCatalog() // Refresh to ensure consistency
  }

  const filteredParts = useMemo(() => {
    return parts?.filter((s) => {
      const nameMatch =
        s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const descMatch = s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return nameMatch || descMatch
    })
  }, [parts, searchQuery])

  useEffect(() => {
    fetchCatalog()
  }, [])

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="max-w-6xl px-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
            <FaScrewdriverWrench className="w-7 h-7" />
            <Header title={t("partsCatalog.title")} />
          </h1>
          <p className="text-muted-foreground">{t("partsCatalog.description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 text-teal-600 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("partsCatalog.searchPlaceholder")}
              className="pl-9 border-2 border-teal-600"
            />
          </div>
          <Button
            onClick={() => setCreateSidebarOpen(true)}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("partsCatalog.newPart")}
          </Button>
        </div>
      </div>

      {/* Table layout matching ServiceCatalog */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sr. No.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("partsCatalog.title")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                {t("partsCatalog.desc")}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("partsCatalog.price")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("partsCatalog.stock")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("partsCatalog.status")}</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t("partsCatalog.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredParts?.length > 0 ? (
              filteredParts?.map((part, index) => (
                <tr key={part._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{part.title || part.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="line-clamp-1 max-w-xs">{part.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-teal-600">₹{part.price}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{part.stock}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        part.status === "in-stock"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }
                    >
                      {part.status === "in-stock" ? t("partsCatalog.inStock") : t("partsCatalog.lowStock")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleView(part)}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2 cursor-pointer"
                      >
                        <FaEye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleEdit(part)}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2 cursor-pointer"
                      >
                        <MdEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(part)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        // disabled={!permissions?.canDeleteParts}
                        title={!permissions?.canDeleteParts ? "Only SUPER_ADMIN can delete parts" : "Delete part"}
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {t("partsCatalog.noPartsFound") || "No parts found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sidebars */}
      <PartsDetailSidebar part={selectedPart} open={viewSidebarOpen} onClose={() => setViewSidebarOpen(false)} />
      <PartsEditSidebar
        part={editingPart}
        open={editSidebarOpen}
        onClose={() => setEditSidebarOpen(false)}
        onSave={handleSavePart}
      />
      <PartsCreateSidebar
        open={createSidebarOpen}
        onClose={() => setCreateSidebarOpen(false)}
        onCreate={handleCreatePart}
      />

    </div>
  )
}

export default PartsCatalog

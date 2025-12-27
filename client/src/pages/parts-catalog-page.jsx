"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit2, Eye, Trash2 } from "lucide-react"
import PartsDetailSidebar from "@/components/admin/catalogs/parts-detail-sidebar"
import PartsEditSidebar from "@/components/admin/catalogs//parts-edit-sidebar"
import PartsCreateSidebar from "@/components/admin/catalogs/parts-create-sidebar"
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md"
import { FaEye, FaTrash } from "react-icons/fa6"
import { useTranslation } from "react-i18next"

const PartsCatalog = () => {
    const { t } = useTranslation('pages')
    const [parts, setParts] = useState([
        {
            id: "1",
            name: "Engine Oil 5L",
            description: "Premium synthetic engine oil",
            price: 800,
            stock: 25,
            status: "in-stock",
        },
        {
            id: "2",
            name: "Air Filter",
            description: "High-efficiency air filter",
            price: 250,
            stock: 40,
            status: "in-stock",
        },
        {
            id: "3",
            name: "Spark Plugs Set",
            description: "Set of 4 spark plugs",
            price: 600,
            stock: 15,
            status: "low-stock",
        },
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPart, setSelectedPart] = useState(null)
    const [viewSidebarOpen, setViewSidebarOpen] = useState(false)
    const [editSidebarOpen, setEditSidebarOpen] = useState(false)
    const [createSidebarOpen, setCreateSidebarOpen] = useState(false)
    const [editingPart, setEditingPart] = useState(null)

    const filteredParts = parts.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleView = (part) => {
        setSelectedPart(part)
        setViewSidebarOpen(true)
    }

    const handleEdit = (part) => {
        setEditingPart(part)
        setEditSidebarOpen(true)
    }

    const handleDelete = (id) => {
        setParts(parts.filter((p) => p.id !== id))
    }

    const handleSavePart = (updatedPart) => {
        setParts(parts.map((p) => (p.id === updatedPart.id ? updatedPart : p)))
        setEditSidebarOpen(false)
    }

    const handleCreatePart = (newPart) => {
        setParts([...parts, { ...newPart, id: Date.now().toString() }])
        setCreateSidebarOpen(false)
    }

    return (
        <div className="max-w-6xl px-4 space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-5">

                <div className="space-y-2 ">
                    <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2"><IoExtensionPuzzleSharp className="w-8 h-8" /> {t("partsCatalog.title")}</h1>
                    <p className="text-muted-foreground">{t("partsCatalog.description")}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 text-teal-600  -translate-y-1/2  " />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("partsCatalog.searchPlaceholder")}
                            className="pl-9 border-2 border-teal-600"
                        />
                    </div>
                    <Button onClick={() => setCreateSidebarOpen(true)} className="cursor-pointer bg-primary hover:bg-primary/90 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        {t("partsCatalog.newPart")}
                    </Button>
                </div>
            </div>

            {/* Parts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParts.map((part) => (
                    <Card key={part.id} className="p-5 hover:shadow-lg transition-shadow">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">{part.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{part.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-muted-foreground">{t("partsCatalog.price")}</p>
                                    <p className="text-xl font-bold text-primary">₹{part.price}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">{t("partsCatalog.stock")}</p>
                                    <p className="text-xl font-bold text-foreground">{part.stock}</p>
                                </div>
                            </div>

                            <Badge
                                className={
                                    part.status === "in-stock"
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                        : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                }
                            >
                                {part.status === "in-stock" ? t("partsCatalog.inStock") : t("partsCatalog.lowStock")}
                            </Badge>

                            <div className="flex gap-2 pt-2 border-t  border-border">
                                <Button onClick={() => handleView(part)} variant="outline" size="sm" className="flex-1 gap-2 text-white cursor-pointer">
                                    <FaEye className="w-4 h-4" />
                                    {t("partsCatalog.view")}
                                </Button>
                                <Button onClick={() => handleEdit(part)} variant="outline" size="sm" className="flex-1 gap-2 text-white cursor-pointer">
                                    <MdEdit className="w-4 h-4" />
                                    {t("partsCatalog.edit")}
                                </Button>
                                <Button
                                    onClick={() => handleDelete(part.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
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

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Phone, Mail, User, Wrench, Package, Calendar, Download, FileText, CheckSquare, Square, Filter } from "lucide-react"
import { generateReceipt, exportToExcel, exportToPDF } from "@/components/utils/exporter"
import { FaShareSquare } from "react-icons/fa"
import { FaClock, FaTrash, FaUserClock } from "react-icons/fa6"
import { RiReceiptFill } from "react-icons/ri"
import { useTranslation } from "react-i18next"

const mockCompletedServices = [
    {
        id: "SO-1290",
        orderDate: "2025-01-10",
        completionDate: "2025-01-13",
        customer: {
            id: "1",
            name: "John Doe",
            phone: "9876543210",
            email: "john@example.com",
        },
        tractor: {
            name: "John Deere",
            model: "5050D",
        },
        status: "Completed",
        services: [
            { id: "s1", title: "Full Engine Overhaul", quantity: 1, price: 15000 },
            { id: "s2", title: "Hydraulic System Check", quantity: 1, price: 3500 },
        ],
        parts: [
            { id: "p1", title: "Oil Filter", quantity: 2, price: 450 },
            { id: "p2", title: "Hydraulic Fluid (5L)", quantity: 3, price: 1200 },
        ],
    },
    {
        id: "SO-1291",
        orderDate: "2025-01-08",
        completionDate: "2025-01-12",
        customer: {
            id: "2",
            name: "Jane Smith",
            phone: "9123456789",
            email: "jane@example.com",
        },
        tractor: {
            name: "Mahindra",
            model: "Arjun 555",
        },
        status: "Completed",
        services: [
            { id: "s3", title: "Brake System Repair", quantity: 1, price: 5500 },
            { id: "s4", title: "Tire Alignment", quantity: 1, price: 2000 },
        ],
        parts: [
            { id: "p3", title: "Brake Pads Set", quantity: 1, price: 3200 },
            { id: "p4", title: "Brake Fluid", quantity: 2, price: 600 },
        ],
    },
    {
        id: "SO-1288",
        orderDate: "2025-01-05",
        completionDate: "2025-01-09",
        customer: {
            id: "3",
            name: "Mike Peterson",
            phone: "9988776655",
            email: "mike@example.com",
        },
        tractor: {
            name: "Kubota",
            model: "MU4501",
        },
        status: "Completed",
        services: [{ id: "s5", title: "Routine Inspection", quantity: 1, price: 1500 }],
        parts: [{ id: "p5", title: "Air Filter", quantity: 1, price: 350 }],
    },
    {
        id: "SO-1285",
        orderDate: "2025-01-02",
        completionDate: "2025-01-07",
        customer: {
            id: "4",
            name: "Robert Fox",
            phone: "9876541230",
            email: "robert@example.com",
        },
        tractor: {
            name: "New Holland",
            model: "3630",
        },
        status: "Completed",
        services: [
            { id: "s6", title: "Transmission Rebuild", quantity: 1, price: 12000 },
            { id: "s7", title: "Cooling System Flush", quantity: 1, price: 2500 },
        ],
        parts: [
            { id: "p6", title: "Transmission Kit", quantity: 1, price: 8500 },
            { id: "p7", title: "Coolant (10L)", quantity: 2, price: 1400 },
        ],
    },
]

export default function ServiceHistory() {
    const { t } = useTranslation('pages')
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedRow, setExpandedRow] = useState(null)
    const [selectedServices, setSelectedServices] = useState([])

    const filteredServices = mockCompletedServices.filter((service) => {
        const q = searchQuery.toLowerCase()
        return (
            service.id.toLowerCase().includes(q) ||
            service.customer.name.toLowerCase().includes(q) ||
            service.tractor.name.toLowerCase().includes(q) ||
            service.tractor.model.toLowerCase().includes(q)
        )
    })

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id)
    }

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const toggleSelectService = (id) => {
        setSelectedServices((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
    }

    const toggleSelectAll = () => {
        if (selectedServices.length === filteredServices.length) {
            setSelectedServices([])
        } else {
            setSelectedServices(filteredServices.map((s) => s.id))
        }
    }


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4   ">
                <div className="bg-white  px-4 py-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold  flex text-teal-600 items-center gap-2"><FaClock className="w-7 h-7 text-teal-600" />{t("serviceHistory.title")}</h1>
                        <p className="text-sm text-slate-500 mt-1">{t("serviceHistory.description")}</p>
                    </div>

                </div>
                <div className="mx-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-xl font-semibold text-teal-600 mb-4">
                        <FaShareSquare className="w-5 h-5" />
                        {t("serviceHistory.exporter")}
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Left: Selected Info */}
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">
                                {selectedServices.length > 0
                                    ? `${selectedServices.length} ${t("serviceHistory.selected")}`
                                    : t("serviceHistory.noItemsSelected")}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">

                            {/* Middle: Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={exportToExcel}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                    {t("serviceHistory.exportExcel")}
                                </button>

                                <button
                                    onClick={exportToPDF}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FileText className="w-4 h-4" />
                                    {t("serviceHistory.exportPDF")}
                                </button>
                            </div>

                            {/* Right: Search */}
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={t("serviceHistory.searchPlaceholder")}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <button onClick={toggleSelectAll} className="hover:text-teal-600 transition-colors">
                                        {selectedServices.length === filteredServices.length && filteredServices.length > 0 ? (
                                            <CheckSquare className="w-5 h-5 text-teal-600" />
                                        ) : (
                                            <Square className="w-5 h-5 text-slate-400" />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    {t("serviceHistory.orderId")}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    {t("serviceHistory.customer")}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    {t("serviceHistory.tractor")}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    {t("serviceHistory.completed")}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    {t("serviceHistory.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredServices.map((service, index) => (
                                <motion.tr
                                    key={service.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <td colSpan={6} className="p-0">
                                        <div>
                                            <div className="flex items-center hover:bg-slate-50/50 transition-colors">
                                                <div className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleSelectService(service.id)}
                                                        className="hover:text-teal-600 transition-colors"
                                                    >
                                                        {selectedServices.includes(service.id) ? (
                                                            <CheckSquare className="w-5 h-5 text-teal-600" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => toggleRow(service.id)}
                                                    className="px-6 py-4 flex items-center gap-3 hover:text-teal-600 transition-colors"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: expandedRow === service.id ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                                    </motion.div>
                                                    <span className="font-bold text-sm text-teal-600">{service.id}</span>
                                                </button>

                                                <div className="flex-1 grid grid-cols-4 gap-4 pr-6 py-4">
                                                    <div>
                                                        <div className="font-semibold text-sm text-slate-900">{service.customer.name}</div>
                                                        <div className="text-xs text-slate-500">{service.customer.phone}</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-slate-900">{service.tractor.name}</div>
                                                        <div className="text-xs text-slate-500">{service.tractor.model}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-slate-600">{service.completionDate}</div>
                                                        <div className="text-xs text-slate-500">{t("serviceHistory.ordered")}: {service.orderDate}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => generateReceipt(service)}
                                                            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
                                                        >
                                                            <RiReceiptFill  className="w-3.5 h-3.5" />
                                                            {t("serviceHistory.receipt")}
                                                        </button>
                                                        <button
                                                            onClick={() => generateReceipt(service)}
                                                            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
                                                        >
                                                            <FaTrash className="w-3.5 h-3.5" />
                                                            {t("serviceHistory.delete")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedRow === service.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                                        className="overflow-hidden bg-slate-50/30"
                                                    >
                                                        <div className="px-6 py-6 space-y-6">
                                                            <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4">
                                                                <div className="flex items-center gap-2 text-slate-900 pb-3 border-b border-slate-100">
                                                                    <User className="w-5 h-5 text-teal-600" />
                                                                    <h4 className="font-bold text-sm uppercase tracking-wide">{t("serviceHistory.customerInformation")}</h4>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                                                            <User className="w-5 h-5 text-teal-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                                                                {t("serviceHistory.name")}
                                                                            </div>
                                                                            <div className="text-sm font-bold text-slate-900 mt-1">
                                                                                {service.customer.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                                            <Phone className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                                                                {t("serviceHistory.phone")}
                                                                            </div>
                                                                            <div className="text-sm font-bold text-slate-900 mt-1">
                                                                                {service.customer.phone}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                                                            <Mail className="w-5 h-5 text-purple-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                                                                {t("serviceHistory.email")}
                                                                            </div>
                                                                            <div className="text-sm font-bold text-slate-900 mt-1">
                                                                                {service.customer.email}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                                                                    <div className="flex items-center gap-2 text-slate-900 px-5 py-4 bg-teal-50/30 border-b border-slate-200">
                                                                        <Wrench className="w-5 h-5 text-teal-600" />
                                                                        <h4 className="font-bold text-sm uppercase tracking-wide">{t("serviceHistory.servicesProvided")}</h4>
                                                                    </div>
                                                                    <div className="divide-y divide-slate-100">
                                                                        {service.services.map((svc) => (
                                                                            <div key={svc.id} className="px-5 py-3 flex items-center justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="text-sm font-semibold text-slate-900">{svc.title}</div>
                                                                                    <div className="text-xs text-slate-500 mt-0.5">{t("serviceHistory.qty")}: {svc.quantity}</div>
                                                                                </div>
                                                                                <div className="text-sm font-bold text-teal-600">Rs. {svc.price}</div>
                                                                            </div>
                                                                        ))}
                                                                        <div className="px-5 py-3 flex items-center justify-between bg-slate-50/50">
                                                                            <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                                                                {t("serviceHistory.servicesTotal")}
                                                                            </div>
                                                                            <div className="text-base font-black text-teal-700">
                                                                                Rs. {calculateTotal(service.services)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
                                                                    <div className="flex items-center gap-2 text-slate-900 px-5 py-4 bg-blue-50/30 border-b border-slate-200">
                                                                        <Package className="w-5 h-5 text-blue-600" />
                                                                        <h4 className="font-bold text-sm uppercase tracking-wide">{t("serviceHistory.partsMaterials")}</h4>
                                                                    </div>
                                                                    <div className="divide-y divide-slate-100">
                                                                        {service.parts.map((part) => (
                                                                            <div key={part.id} className="px-5 py-3 flex items-center justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="text-sm font-semibold text-slate-900">{part.title}</div>
                                                                                    <div className="text-xs text-slate-500 mt-0.5">{t("serviceHistory.qty")}: {part.quantity}</div>
                                                                                </div>
                                                                                <div className="text-sm font-bold text-blue-600">Rs. {part.price}</div>
                                                                            </div>
                                                                        ))}
                                                                        <div className="px-5 py-3 flex items-center justify-between bg-slate-50/50">
                                                                            <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                                                                {t("serviceHistory.partsTotal")}
                                                                            </div>
                                                                            <div className="text-base font-black text-blue-700">
                                                                                Rs. {calculateTotal(service.parts)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-linear-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200/60 p-5 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                                                                        <Calendar className="w-6 h-6 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                                                                            {t("serviceHistory.orderTotal")}
                                                                        </div>
                                                                        <div className="text-xs text-slate-500 mt-0.5">
                                                                            {t("serviceHistory.completedDate")}: {service.completionDate}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-3xl font-black text-teal-700">
                                                                    Rs. {calculateTotal(service.services) + calculateTotal(service.parts)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredServices.length === 0 && (
                    <div className="py-12 text-center text-slate-400 font-medium italic">{t("serviceHistory.noCompletedServices")}</div>
                )}
            </div>
        </div>
    )
}

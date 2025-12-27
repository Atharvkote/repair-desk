"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  UserPlus2,
  Plus,
  Minus,
  Gift,
  User,
  Package,
  Percent,
  ClipboardCheck,
} from "lucide-react"
import ToggleTabs from "@/components/customs/toggle-tabs"
import { FaBoxArchive } from "react-icons/fa6"
import { IoSettingsSharp } from "react-icons/io5"
import { TRACTOR_SERVICE_CATALOG, PARTS_MATERIALS_CATALOG } from "@/lib/service-catalog"
import { ClipboardList } from "lucide-react" // Import ClipboardList
import { useLocation } from "react-router-dom"
import { GrServices } from "react-icons/gr"

export default function ServiceForm() {
  const location = useLocation()

  const [userQuery, setUserQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({ name: "", phone: "", email: "" })
  const [selections, setSelections] = useState([])
  const [tractor, setTractor] = useState({ name: "", model: "" })
  const [customTitle, setCustomTitle] = useState("")
  const [customPrice, setCustomPrice] = useState("")
  const [customDesc, setCustomDesc] = useState("")
  const [headerDate, setHeaderDate] = useState("")
  const [activeTab, setActiveTab] = useState("Services")
  const [searchQuery, setSearchQuery] = useState("")
  const [discounts, setDiscounts] = useState({})
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const now = new Date()
    const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setHeaderDate(iso)
  }, [])

  useEffect(() => {
    if (location.state?.editMode && location.state?.serviceData) {
      const { serviceData } = location.state

      console.log("Edit mode activated. Loading service data:", serviceData)

      if (serviceData.customer) {
        setSelectedUser(serviceData.customer)
      }

      if (serviceData.tractor) {
        setTractor(serviceData.tractor)
      }

      const allSelections = []

      if (serviceData.services && serviceData.services.length > 0) {
        serviceData.services.forEach((service) => {
          allSelections.push({
            item: {
              id: service.id,
              title: service.title,
              price: service.price,
              description: service.description || "",
            },
            quantity: service.quantity,
          })
        })
      }

      if (serviceData.parts && serviceData.parts.length > 0) {
        serviceData.parts.forEach((part) => {
          allSelections.push({
            item: {
              id: part.id,
              title: part.title,
              price: part.price,
              description: part.description || "",
            },
            quantity: part.quantity,
          })
        })
      }

      if (allSelections.length > 0) {
        setSelections(allSelections)
      }

      console.log("[v0] Form populated with", allSelections.length, "items")
    }
  }, [location.state])

  const [users, setUsers] = useState([
    { id: "1", name: "John Doe", phone: "9876543210", email: "john@example.com" },
    { id: "2", name: "Jane Smith", phone: "9123456789", email: "jane@example.com" },
  ])

  const results = useMemo(() => {
    const q = userQuery.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      [u.name, u.phone, u.email].filter(Boolean).some((v) => (v || "").toLowerCase().includes(q)),
    )
  }, [userQuery, users])

  const catalogResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const catalog = activeTab === "Services" ? TRACTOR_SERVICE_CATALOG : PARTS_MATERIALS_CATALOG
    if (!q) return catalog
    return catalog.filter((item) =>
      [item.title, item.description].filter(Boolean).some((v) => (v || "").toLowerCase().includes(q)),
    )
  }, [searchQuery, activeTab])

  const total = useMemo(() => selections.reduce((sum, s) => sum + s.item.price * s.quantity, 0), [selections])
  const totalDiscount = useMemo(() => {
    return selections.reduce((sum, s) => {
      const itemDiscount = discounts[s.item.id] || 0
      return sum + (s.item.price * s.quantity * itemDiscount) / 100
    }, 0)
  }, [selections, discounts])
  const finalTotal = useMemo(() => total - totalDiscount, [total, totalDiscount])

  const addSelection = (item) => {
    setSelections((prev) => {
      const idx = prev.findIndex((p) => p.item.id === item.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const decSelection = (id) => {
    setSelections((prev) => {
      const idx = prev.findIndex((p) => p.item.id === id)
      if (idx < 0) return prev
      const next = [...prev]
      const q = next[idx].quantity - 1
      if (q <= 0) return next.filter((s) => s.item.id !== id)
      next[idx] = { ...next[idx], quantity: q }
      return next
    })
  }

  const updateDiscount = (id, delta) => {
    setDiscounts((prev) => {
      const val = (prev[id] || 0) + delta
      if (val < 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: val }
    })
  }

  const addCustomService = () => {
    if (!customTitle.trim() || !customPrice.trim()) return
    const item = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      price: Number.parseFloat(customPrice),
      description: customDesc,
    }
    addSelection(item)
    setCustomTitle("")
    setCustomPrice("")
    setCustomDesc("")
  }

  const submitOrder = () => {
    alert(`Order created for ${selectedUser?.name} with total: ₹${finalTotal.toFixed(2)}`)
    setCurrentStep(1)
    setSelectedUser(null)
    setSelections([])
    setDiscounts({})
    setTractor({ name: "", model: "" })
  }

  const handleNext = () => {
    console.log(
      "[v0] handleNext triggered. currentStep:",
      currentStep,
      "selectedUser:",
      !!selectedUser,
      "selections:",
      selections.length,
    )
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const steps = [
    { id: 1, name: "Customer", icon: User },
    { id: 2, name: "Services", icon: Package },
    { id: 3, name: "Discounts", icon: Percent },
    { id: 4, name: "Review", icon: ClipboardCheck },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24 md:pb-12 relative">
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2"> <GrServices /> New Service</h1>
        <p className="text-foreground font-medium mb-3"> Create Service with ease and keep track of everything you do.  </p>
        <div className="relative flex justify-between items-start max-w-3xl mx-auto">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0">
            <motion.div
              className="h-full bg-teal-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? "#14b8a6" : "#f1f5f9",
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors border-4 border-white`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  )}
                </motion.div>
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-teal-600" : "text-slate-400"}`}
                  >
                    Step {step.id}
                  </span>
                  <span
                    className={`text-[13px] font-bold whitespace-nowrap ${isActive ? "text-slate-900" : "text-slate-400"}`}
                  >
                    {step.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-6 md:p-10"
          >
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Customer & Tractor Details</h3>
                  <p className="text-slate-500 text-[15px]">Identify the customer and the equipment being serviced.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                    Search Customer
                  </label>
                  <div className="relative group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                    <Input
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Search by name, phone, or email..."
                      className="pl-12 bg-slate-50/50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all text-[15px]"
                    />
                  </div>
                </div>

                <div className="max-h-[280px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/30 divide-y divide-slate-100/80 custom-scrollbar">
                  {results.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-medium italic">
                      No matching customers found.
                    </div>
                  ) : (
                    results.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className={`w-full text-left px-6 py-4 transition-all duration-200 flex items-center justify-between group
                          ${selectedUser?.id === u.id ? "bg-teal-50/80" : "hover:bg-white"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                            ${selectedUser?.id === u.id ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"}`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div
                              className={`font-bold text-[15px] ${selectedUser?.id === u.id ? "text-teal-900" : "text-slate-900"}`}
                            >
                              {u.name}
                            </div>
                            <div className="text-[13px] text-slate-500 mt-0.5">{u.phone || u.email}</div>
                          </div>
                        </div>
                        {selectedUser?.id === u.id && (
                          <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center shadow-md shadow-teal-500/20">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-100 pt-8 space-y-5">
                  <div className="flex items-center gap-2 text-slate-900">
                    <UserPlus2 className="w-5 h-5 text-teal-600" />
                    <span className="text-base font-bold tracking-tight">Register New Customer</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Full Name"
                      className="h-11 rounded-xl bg-slate-50/50"
                    />
                    <Input
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="h-11 rounded-xl bg-slate-50/50"
                    />
                    <Input
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Email Address"
                      className="h-11 rounded-xl bg-slate-50/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="border-teal-100 bg-teal-50/30 text-teal-700 hover:bg-teal-600 hover:text-white rounded-xl h-11 transition-all duration-300 font-semibold"
                    onClick={() => {
                      if (!newUser.name?.trim()) return
                      const created = { id: Date.now().toString(), ...newUser }
                      setUsers([...users, created])
                      setSelectedUser(created)
                      setNewUser({ name: "", phone: "", email: "" })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Register & Select
                  </Button>
                </div>

                <div className="border-t border-slate-100 pt-8 space-y-4">
                  <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                    Tractor Model Details
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={tractor.name}
                      onChange={(e) => setTractor({ ...tractor, name: e.target.value })}
                      placeholder="Make / Brand (e.g. John Deere)"
                      className="h-11 rounded-xl bg-slate-50/50"
                    />
                    <Input
                      value={tractor.model}
                      onChange={(e) => setTractor({ ...tractor, model: e.target.value })}
                      placeholder="Model Number"
                      className="h-11 rounded-xl bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Services & Components</h3>
                    <p className="text-slate-500 text-[15px]">
                      Selected for: <span className="font-bold text-teal-600">{selectedUser?.name}</span>
                    </p>
                  </div>
                  <ToggleTabs
                    options={[
                      { label: "Services", icon: <IoSettingsSharp className="w-4 h-4" /> },
                      { label: "Parts/Materials", icon: <FaBoxArchive className="w-4 h-4" /> },
                    ]}
                    defaultActive="Services"
                    onChange={setActiveTab}
                    className="bg-slate-100/50 border-none p-1 rounded-xl"
                  />
                </div>

                {/* Custom Entry */}
                <div className="rounded-2xl border border-teal-100 bg-teal-50/20 p-6 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-bold text-teal-900">
                      Add Custom {activeTab === "Services" ? "Service" : "Item"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <Input
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder={activeTab === "Services" ? "Service Title" : "Item Name"}
                      className="md:col-span-2 h-11 rounded-xl bg-white border-teal-100/50"
                    />
                    <Input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="Price (₹)"
                      className="h-11 rounded-xl bg-white border-teal-100/50"
                    />
                    <Input
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      placeholder="Brief Description"
                      className="md:col-span-2 h-11 rounded-xl bg-white border-teal-100/50"
                    />
                  </div>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-6 h-11 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                    onClick={addCustomService}
                  >
                    Confirm & Add
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Find ${activeTab === "Services" ? "services" : "spare parts"} in catalog...`}
                      className="pl-12 bg-slate-50/50 border-slate-200 h-12 rounded-xl focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar p-2 pr-1">
                    {catalogResults.map((item) => {
                      const selected = selections.find((s) => s.item.id === item.id)
                      return (
                        <motion.div
                          layout
                          key={item.id}
                          whileHover={{ y: -4 }}
                          className={`group p-5 rounded-2xl border transition-all duration-300 relative 
                            ${selected
                              ? "border-teal-200 bg-teal-50/50 shadow-md ring-1 ring-teal-200"
                              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/40"
                            }`}
                        >
                          <div className="flex flex-col h-full space-y-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-teal-700 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[12px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                              <span className="text-teal-700 font-extrabold text-[16px]">₹{item.price}</span>
                              {activeTab === "Services" ? (
                                <Button
                                  variant={selected ? "default" : "outline"}
                                  size="sm"
                                  className={`rounded-lg h-8 text-[11px] font-bold uppercase tracking-wider
                                    ${selected ? "bg-teal-600" : "border-slate-200 text-white hover:bg-teal-600 hover:text-white cursor-pointer"}`}
                                  onClick={() => (selected ? decSelection(item.id) : addSelection(item))}
                                >
                                  {selected ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                  {selected ? "Added" : "Add"}
                                </Button>
                              ) : (
                                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
                                  <button
                                    className="p-1 text-slate-500 hover:bg-white rounded-md transition-colors"
                                    onClick={() => decSelection(item.id)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="min-w-[28px] text-center font-bold text-slate-800 text-[13px]">
                                    {selected?.quantity || 0}
                                  </span>
                                  <button
                                    className="p-1 text-teal-600 hover:bg-white rounded-md transition-colors"
                                    onClick={() => addSelection(item)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-100 pt-6 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <ClipboardList className="w-4 h-4" />
                    <span className="text-[14px]">Subtotal Summary</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">Running Total</p>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Apply Discounts</h2>
                </div>

                {selections.length > 0 ? (
                  <div className="space-y-4">
                    {selections.map((s) => {
                      const itemTotal = s.item.price * s.quantity
                      const itemDiscount = discounts[s.item.id] || 0
                      const itemDiscountAmount = (itemTotal * itemDiscount) / 100
                      return (
                        <div
                          key={s.item.id}
                          className="rounded-lg border border-slate-200 p-5 bg-white hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="font-semibold text-slate-900 text-base">{s.item.title}</div>
                              <div className="text-sm text-slate-600 mt-1">Quantity: {s.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-slate-900 font-bold text-lg">₹{itemTotal.toFixed(2)}</div>
                              <div className="text-xs text-slate-500">Price</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-3 text-slate-700 bg-white border-slate-300 hover:bg-slate-100 transition-all duration-200"
                                onClick={() => updateDiscount(s.item.id, -5)}
                              >
                                <Minus className="w-4 h-4 mr-1" />
                                5%
                              </Button>
                              <span className="min-w-14 text-center font-bold text-slate-900 text-lg">
                                {itemDiscount}%
                              </span>
                              <Button
                                size="sm"
                                className="h-9 px-3 bg-teal-600 hover:bg-teal-700 transition-all duration-200"
                                onClick={() => updateDiscount(s.item.id, 5)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                5%
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-teal-600 font-bold text-base">
                                -₹{itemDiscountAmount.toFixed(2)}
                              </div>
                              <div className="text-xs text-slate-500">Discount</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600 bg-slate-50 rounded-lg">No items selected</div>
                )}

                <div className="rounded-lg border border-teal-200 bg-teal-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Total Discount Available</div>
                      <div className="text-3xl font-bold text-teal-600 mt-2">₹{totalDiscount.toFixed(2)}</div>
                    </div>
                    {/* <Button className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 transition-all duration-200 hover:shadow-lg">
                      Apply Discount
                    </Button> */}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Order</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Customer Details</h3>
                    </div>
                    <div className="px-5 py-4 space-y-4">
                      <div>
                        <div className="text-xs text-slate-600 font-medium uppercase">Name</div>
                        <div className="font-semibold text-slate-900 mt-1">{selectedUser?.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 font-medium uppercase">Phone</div>
                        <div className="font-semibold text-slate-900 mt-1">{selectedUser?.phone || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 font-medium uppercase">Email</div>
                        <div className="font-semibold text-slate-900 mt-1">{selectedUser?.email || "N/A"}</div>
                      </div>
                      {(tractor.name || tractor.model) && (
                        <>
                          <div>
                            <div className="text-xs text-slate-600 font-medium uppercase">Tractor</div>
                            <div className="font-semibold text-slate-900 mt-1">{tractor.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 font-medium uppercase">Model</div>
                            <div className="font-semibold text-slate-900 mt-1">{tractor.model || "N/A"}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Order Summary</h3>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold text-slate-900">₹{total.toFixed(2)}</span>
                      </div>
                      {totalDiscount > 0 && (
                        <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-3">
                          <span className="text-teal-600 font-medium">Discount</span>
                          <span className="text-teal-600 font-bold">-₹{totalDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-200 pt-3 mt-3 flex items-center justify-between">
                        <span className="text-slate-900 font-bold">Grand Total</span>
                        <span className="text-2xl font-bold text-teal-600">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selections.length > 0 && (
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Selected Items ({selections.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-200 max-h-48 overflow-y-auto">
                      {selections.map((s) => {
                        const itemTotal = s.item.price * s.quantity
                        const itemDiscount = discounts[s.item.id] || 0
                        const itemDiscountAmount = (itemTotal * itemDiscount) / 100
                        const itemFinalPrice = itemTotal - itemDiscountAmount
                        return (
                          <div key={s.item.id} className="px-5 py-3 text-sm hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-900">{s.item.title}</span>
                              <span className="text-slate-900 font-bold">₹{itemFinalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>
                                Qty: {s.quantity} × ₹{s.item.price.toFixed(2)}
                              </span>
                              {itemDiscount > 0 && (
                                <span className="text-teal-600 font-medium">-{itemDiscount}%</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed md:static bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 md:border-none md:bg-transparent p-4 md:p-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-3 border-2 border-white px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
            <p className="text-[13px] font-medium text-white">
              {currentStep === 4
                ? "Verify details before finalizing order."
                : `Next: ${steps[currentStep]?.name || "Finalize"}`}
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            {currentStep > 1 && (
              <Button
                variant="outline"
                className="flex-1 border-2  md:flex-none cursor-pointer px-6 h-12 border-white text-white hover:text-teal-600 hover:bg-white duration-300 transition-colors font-bold rounded-xl bg-transparent"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              className={`flex-[2] md:flex-none border-2 border-white px-10 h-12 rounded-xl font-bold bg-transparent
                ${"border-white text-white hover:text-teal-600 hover:bg-white duration-300 transition-colors cursor-pointer  "}
                 disabled:cursor-not-allowed`}
              onClick={currentStep === 4 ? submitOrder : handleNext}
              disabled={(currentStep === 1 && !selectedUser) || (currentStep === 2 && selections.length === 0)}
            >
              {currentStep === 4 ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Finalize Order
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

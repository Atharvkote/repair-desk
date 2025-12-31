"use client"

import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Package, Percent, ClipboardCheck, LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/useDebounce"
import { customerService } from "@/services/customer.service"
import { orderService } from "@/services/order.service"
import { catalogService } from "@/services/catalog.service"
import StepHeader from "@/components/admin/service-form/step-header"
import StepOneCustomer from "@/components/admin/service-form/step-one-customer"
import StepTwoCatalog from "@/components/admin/service-form/step-two-catalog"
import StepThreeDiscounts from "@/components/admin/service-form/step-three-discounts"
import StepFourReview from "@/components/admin/service-form/step-four-review"
import StepFooter from "@/components/admin/service-form/step-footer"
import Loader from "@/components/shared/loader"


interface Step {
  readonly id: number
  readonly name: string
  readonly icon: LucideIcon
}

interface Customer {
  readonly _id: string
  readonly name: string
  readonly phone: string
  readonly email: string
}

interface NewUser {
  name: string
  phone: string
  email: string
}

interface Tractor {
  name: string
  model: string
}

interface CatalogItem {
  readonly _id: string
  readonly id: string
  readonly title: string
  readonly price: number
  readonly description: string
  readonly serviceCode?: string
  readonly partCode?: string
  readonly stock?: number
  readonly status: "AVAILABLE" | "UNAVAILABLE"
}

interface Selection {
  readonly item: CatalogItem
  quantity: number
}

interface DiscountMap {
  [itemId: string]: number
}

interface CustomItemInput {
  title: string
  price: number
  description: string
  stock: number
  Code: string
  flag: "custom"
  type: "service" | "part"
}

interface ServiceData {
  readonly customer?: Customer
  readonly tractor?: Tractor
  readonly orderId?: string
  readonly services?: ReadonlyArray<{
    readonly id: string
    readonly title: string
    readonly price: number
    readonly description?: string
    readonly quantity: number
  }>
  readonly parts?: ReadonlyArray<{
    readonly id: string
    readonly title: string
    readonly price: number
    readonly description?: string
    readonly quantity: number
  }>
  readonly discounts?: DiscountMap
}

interface LocationState {
  readonly editMode?: boolean
  readonly serviceData?: ServiceData
}

interface CreateServicePayload {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly description: string
  readonly serviceCode: string
  readonly status: "AVAILABLE" | "UNAVAILABLE"
}

interface CreatePartPayload {
  readonly id: string
  readonly name: string
  readonly stock: number
  readonly price: number
  readonly description: string
  readonly partCode: string
  readonly status: "AVAILABLE" | "UNAVAILABLE"
}

interface CreateDraftOrderPayload {
  readonly customerId: string
  readonly tractor?: {
    readonly name?: string
    readonly model?: string
  }
}

interface AddItemPayload {
  readonly orderId: string
  readonly itemId: string
  readonly quantity: number
  readonly type: "service" | "part"
}

interface UpdateDiscountPayload {
  readonly orderId: string
  readonly itemId: string
  readonly discountPercent: number
}

interface OrderItem {
  readonly itemId: string
  readonly quantity: number
}

interface OrderResponse {
  readonly data: {
    readonly id: string
    readonly items?: ReadonlyArray<OrderItem>
  }
  readonly items?: ReadonlyArray<OrderItem>
}

interface ApiError {
  readonly response?: {
    readonly data?: {
      readonly message?: string
    }
    readonly status?: number
  }
  readonly name?: string
  readonly message?: string
}

type TabType = "Services" | "Parts"

// ==================== CONSTANTS ====================

const STEPS: readonly Step[] = [
  { id: 1, name: "Customer", icon: User },
  { id: 2, name: "Services", icon: Package },
  { id: 3, name: "Discounts", icon: Percent },
  { id: 4, name: "Review", icon: ClipboardCheck },
] as const

const INITIAL_NEW_USER: NewUser = { name: "", phone: "", email: "" }
const INITIAL_TRACTOR: Tractor = { name: "", model: "" }

// ==================== COMPONENT ====================

export default function ServiceFormPage(): JSX.Element {
  const { t } = useTranslation("pages")
  const location = useLocation()
  const locationState = location.state as LocationState | undefined

  // ==================== STATE ====================
  const [userQuery, setUserQuery] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null)
  const [newUser, setNewUser] = useState<NewUser>(INITIAL_NEW_USER)
  const [selections, setSelections] = useState<Selection[]>([])
  const [tractor, setTractor] = useState<Tractor>(INITIAL_TRACTOR)
  const [customTitle, setCustomTitle] = useState<string>("")
  const [customPrice, setCustomPrice] = useState<string>("")
  const [customDesc, setCustomDesc] = useState<string>("")
  const [customStock, setCustomStock] = useState<string>("")
  const [activeTab, setActiveTab] = useState<TabType>("Services")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [discounts, setDiscounts] = useState<DiscountMap>({})
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [draftOrderId, setDraftOrderId] = useState<string | null>(null)
  const [users, setUsers] = useState<Customer[]>([])
  const [catalogResults, setCatalogResults] = useState<CatalogItem[]>([])
  const [isSearchingCustomers, setIsSearchingCustomers] = useState<boolean>(false)
  const [isSearchingCatalog, setIsSearchingCatalog] = useState<boolean>(false)
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false)
  const [services, setServices] = useState<CatalogItem[]>([])
  const [parts, setParts] = useState<CatalogItem[]>([])
  
  const searchAbortControllerRef = useRef<AbortController | null>(null)
  const catalogAbortControllerRef = useRef<AbortController | null>(null)

  // ==================== DEBOUNCED VALUES ====================
  const debouncedUserQuery = useDebounce<string>(userQuery, 350)
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 350)

  // ==================== FETCH CATALOG ====================
  const fetchCatalog = useCallback(async (): Promise<void> => {
    try {
      const servicesData = await catalogService.getServices() as CatalogItem[]
      setCatalogResults(servicesData)
      setServices(servicesData)

      const partsData = await catalogService.getParts() as CatalogItem[]
      setParts(partsData)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError.response?.data?.message ?? "Failed to fetch services")
    }
  }, [])

  useEffect(() => {
    void fetchCatalog()
  }, [fetchCatalog])

  // ==================== EDIT MODE HANDLING ====================
  useEffect(() => {
    if (locationState?.editMode && locationState?.serviceData) {
      const { serviceData } = locationState


      if (serviceData.customer) {
        setSelectedUser(serviceData.customer)
      }

      if (serviceData.tractor) {
        setTractor(serviceData.tractor)
      }

      if (serviceData.orderId) {
        setDraftOrderId(serviceData.orderId)
      }

      const allSelections: Selection[] = []

      if (serviceData.services && serviceData.services.length > 0) {
        serviceData.services.forEach((service) => {
          allSelections.push({
            item: {
              _id: service.id,
              id: service.id,
              title: service.title,
              price: service.price,
              description: service.description ?? "",
              status: "AVAILABLE",
            },
            quantity: service.quantity,
          })
        })
      }

      if (serviceData.parts && serviceData.parts.length > 0) {
        serviceData.parts.forEach((part) => {
          allSelections.push({
            item: {
              _id: part.id,
              id: part.id,
              title: part.title,
              price: part.price,
              description: part.description ?? "",
              status: "AVAILABLE",
            },
            quantity: part.quantity,
          })
        })
      }

      if (allSelections.length > 0) {
        setSelections(allSelections)
      }

      if (serviceData.discounts) {
        setDiscounts(serviceData.discounts)
      }

    }
  }, [locationState])

  // ==================== FALLBACK CATALOG ====================
  useEffect(() => {
    if (!searchQuery.trim()) {
      const fallbackCatalog: CatalogItem[] = activeTab === "Services" ? services : parts
      setCatalogResults(fallbackCatalog)
    }
  }, [activeTab, searchQuery, services, parts])

  const results = useMemo<Customer[]>(() => users, [users])

  // ==================== CUSTOMER SEARCH ====================
  useEffect(() => {
    const searchCustomers = async (): Promise<void> => {
      if (!debouncedUserQuery.trim()) {
        setUsers([])
        return
      }

      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort()
      }

      searchAbortControllerRef.current = new AbortController()
      setIsSearchingCustomers(true)

      try {
        const customers = await customerService.searchCustomers(debouncedUserQuery) as Customer[]
        setUsers(customers)
      } catch (error) {
        const apiError = error as ApiError
        if (apiError.name !== "AbortError" && apiError.name !== "CanceledError") {
          console.error("Customer search error:", apiError)
          toast.error(apiError.response?.data?.message ?? "Failed to search customers")
        }
      } finally {
        setIsSearchingCustomers(false)
      }
    }

    void searchCustomers()

    return () => {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort()
      }
    }
  }, [debouncedUserQuery])

  useEffect(() => {
    const searchCatalog = async (): Promise<void> => {
      if (!debouncedSearchQuery.trim()) {
        const fallbackCatalog: CatalogItem[] = activeTab === "Services" ? services : parts
        setCatalogResults(fallbackCatalog)
        return
      }

      if (catalogAbortControllerRef.current) {
        catalogAbortControllerRef.current.abort()
      }

      catalogAbortControllerRef.current = new AbortController()
      setIsSearchingCatalog(true)

      try {
        const items: CatalogItem[] =
          activeTab === "Services"
            ? await catalogService.searchServices(debouncedSearchQuery)
            : await catalogService.searchParts(debouncedSearchQuery)
        setCatalogResults(items)
      } catch (error) {
        const apiError = error as ApiError
        if (apiError.name !== "AbortError" && apiError.name !== "CanceledError") {
          console.error("Catalog search error:", apiError)
          const fallbackCatalog: CatalogItem[] = activeTab === "Services" ? services : parts
          setCatalogResults(fallbackCatalog)
        }
      } finally {
        setIsSearchingCatalog(false)
      }
    }

    void searchCatalog()

    return () => {
      if (catalogAbortControllerRef.current) {
        catalogAbortControllerRef.current.abort()
      }
    }
  }, [debouncedSearchQuery, activeTab, services, parts])

  const total = useMemo<number>(() => {
    return selections.reduce((sum, s) => sum + s.item.price * s.quantity, 0)
  }, [selections])

  const totalDiscount = useMemo<number>(() => {
    return selections.reduce((sum, s) => {
      const itemDiscount: number = discounts[s.item._id] ?? 0
      return sum + (s.item.price * s.quantity * itemDiscount) / 100
    }, 0)
  }, [selections, discounts])

  const finalTotal = useMemo<number>(() => total - totalDiscount, [total, totalDiscount])

  // ==================== ADD SELECTION ====================
  const addSelection = useCallback(
    async (item: CatalogItem | CustomItemInput): Promise<void> => {
      if (!draftOrderId) {
        toast.error("Please select a customer first")
        return
      }

      let processedItem: CatalogItem = item as CatalogItem

      if ("flag" in item && item.flag === "custom") {
        try {
          const itemId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          
          if (item.type === "service") {
            const payload: CreateServicePayload = {
              id: itemId,
              name: item.title,
              price: item.price,
              description: item.description,
              serviceCode: item.Code,
              status: "AVAILABLE",
            }
            const newItem = await catalogService.createService(payload)
            processedItem = newItem.data as CatalogItem
          } else {
            const payload: CreatePartPayload = {
              id: itemId,
              name: item.title,
              stock: item.stock,
              price: item.price,
              description: item.description,
              partCode: item.Code,
              status: "AVAILABLE",
            }
            const newItem = await catalogService.createPart(payload)
            processedItem = newItem.data as CatalogItem
          }
          
          await fetchCatalog()
        } catch (error) {
          const apiError = error as ApiError
          toast.error(apiError.response?.data?.message ?? "Failed to add item")
          return
        }
      }

      const existingSelection: Selection | undefined = selections.find(
        (s) => s.item._id === processedItem._id
      )
      const newQuantity: number = existingSelection ? existingSelection.quantity + 1 : 1

      setSelections((prev) => {
        const idx: number = prev.findIndex((p) => p.item._id === processedItem._id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: newQuantity }
          return next
        }
        return [...prev, { item: processedItem, quantity: 1 }]
      })

      try {
        const itemType: "service" | "part" = activeTab === "Services" ? "service" : "part"
        const payload: AddItemPayload = {
          orderId: draftOrderId,
          itemId: processedItem._id,
          quantity: newQuantity,
          type: itemType,
        }

        const order: OrderResponse =
          itemType === "service"
            ? await orderService.addServiceItem(payload)
            : await orderService.addPartItem(payload)

        if (order.items) {
          const updatedSelections: Selection[] = order.items.map((orderItem) => {
            const catalogItem: CatalogItem =
              catalogResults.find((c) => c._id === orderItem.itemId) ?? processedItem
            return {
              item: catalogItem,
              quantity: orderItem.quantity,
            }
          })
          setSelections(updatedSelections)
        }
      } catch (error) {
        setSelections((prev) => {
          const idx: number = prev.findIndex((p) => p.item._id === processedItem._id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = {
              ...next[idx],
              quantity: existingSelection ? existingSelection.quantity : 0,
            }
            return next.filter((s) => s.quantity > 0)
          }
          return prev
        })
        const apiError = error as ApiError
        toast.error(apiError.response?.data?.message ?? "Failed to add item")
      }
    },
    [draftOrderId, selections, activeTab, catalogResults, fetchCatalog]
  )

  // ==================== DECREMENT SELECTION ====================
  const decSelection = useCallback(
    async (id: string): Promise<void> => {
      if (!draftOrderId) return

      const existingSelection: Selection | undefined = selections.find((s) => s.item._id === id)
      if (!existingSelection) return

      const newQuantity: number = existingSelection.quantity - 1

      setSelections((prev) => {
        const idx: number = prev.findIndex((p) => p.item._id === id)
        if (idx < 0) return prev
        const next = [...prev]
        if (newQuantity <= 0) {
          return next.filter((s) => s.item._id !== id)
        }
        next[idx] = { ...next[idx], quantity: newQuantity }
        return next
      })

      try {
        if (newQuantity <= 0) {
          await orderService.removeItem(draftOrderId, id)
        } else {
          await orderService.updateItemQuantity(draftOrderId, id, newQuantity)
        }
      } catch (error) {
        setSelections((prev) => {
          const idx: number = prev.findIndex((p) => p.item._id === id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = { ...next[idx], quantity: existingSelection.quantity }
            return next
          }
          return prev
        })
        const apiError = error as ApiError
        toast.error(apiError.response?.data?.message ?? "Failed to update item")
      }
    },
    [draftOrderId, selections]
  )

  // ==================== UPDATE DISCOUNT ====================
  const updateDiscount = useCallback(
    async (id: string, delta: number): Promise<void> => {
      if (!draftOrderId) return

      const newDiscount: number = (discounts[id] ?? 0) + delta
      const finalDiscount: number = newDiscount < 0 ? 0 : newDiscount

      setDiscounts((prev) => {
        if (finalDiscount === 0) {
          const { [id]: _, ...rest } = prev
          return rest
        }
        return { ...prev, [id]: finalDiscount }
      })

      try {

        const payload: UpdateDiscountPayload = {
          orderId: draftOrderId,
          itemId: id,
          discountPercent: finalDiscount,
        }
        await orderService.updateItemDiscount(payload)
      } catch (error) {
        setDiscounts((prev) => {
          const val: number = (prev[id] ?? 0) - delta
          if (val < 0) {
            const { [id]: _, ...rest } = prev
            return rest
          }
          return { ...prev, [id]: val }
        })
        const apiError = error as ApiError
        toast.error(apiError.response?.data?.message ?? "Failed to update discount")
      }
    },
    [draftOrderId, discounts]
  )

  // ==================== SUBMIT ORDER ====================
  const submitOrder = async (): Promise<void> => {
    if (!draftOrderId) {
      toast.error("No draft order found")
      return
    }

    try {
      setIsLoadingOrder(true)
      const order = await orderService.startService(draftOrderId)
      toast.success(`Service started for ${selectedUser?.name ?? "customer"}`)
      resetForm()
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage: string = apiError.response?.data?.message ?? apiError.message ?? "Failed to complete order"
      console.error("er", error)
      toast.error(errorMessage)

      if (apiError.response?.status === 409 || errorMessage.includes("status")) {
        toast.info("Order status prevents this action")
      }
    } finally {
      setIsLoadingOrder(false)
    }
  }

  // ==================== RESET FORM ====================
  const resetForm = (): void => {
    setCurrentStep(1)
    setSelectedUser(null)
    setSelections([])
    setDiscounts({})
    setTractor(INITIAL_TRACTOR)
    setDraftOrderId(null)
    setUserQuery("")
    setSearchQuery("")
    setUsers([])
    setCatalogResults([])
  }


  if(isLoadingOrder){
    return (
      <Loader/>
    )
  }

  // ==================== NAVIGATION ====================
  const handleNext = async (): Promise<void> => {
    if (currentStep === 1 && selectedUser && !draftOrderId) {
      try {
        const payload: CreateDraftOrderPayload = {
          customerId: selectedUser._id,
          tractor:
            tractor.name || tractor.model
              ? {
                  name: tractor.name || undefined,
                  model: tractor.model || undefined,
                }
              : undefined,
        }
        const order = await orderService.createDraftOrder(payload)
        setDraftOrderId(order.data.id)
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError.response?.data?.message ?? "Failed to create draft order")
        return
      }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = (): void => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // ==================== RENDER ====================
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24 md:pb-12 relative">
      <StepHeader currentStep={currentStep} steps={STEPS} />

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
            {currentStep === 1 && (
              <StepOneCustomer
                userQuery={userQuery}
                setUserQuery={setUserQuery}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                tractor={tractor}
                setTractor={setTractor}
                isSearchingCustomers={isSearchingCustomers}
                results={results}
                setDraftOrderId={setDraftOrderId}
              />
            )}

            {currentStep === 2 && (
              <StepTwoCatalog
                selectedUser={selectedUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                catalogResults={catalogResults}
                selections={selections}
                isSearchingCatalog={isSearchingCatalog}
                draftOrderId={draftOrderId}
                total={total}
                services={services}
                parts={parts}
                onAddSelection={addSelection}
                onDecSelection={decSelection}
              />
            )}

            {currentStep === 3 && (
              <StepThreeDiscounts
                selections={selections}
                discounts={discounts}
                totalDiscount={totalDiscount}
                total={total}
                onUpdateDiscount={updateDiscount}
              />
            )}

            {currentStep === 4 && (
              <StepFourReview
                selectedUser={selectedUser}
                tractor={tractor}
                selections={selections}
                discounts={discounts}
                total={total}
                totalDiscount={totalDiscount}
                finalTotal={finalTotal}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <StepFooter
        currentStep={currentStep}
        stepsLength={STEPS.length}
        stepName={STEPS[currentStep - 1]?.name ?? ""}
        selectedUser={selectedUser}
        selections={selections}
        isLoadingOrder={isLoadingOrder}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={submitOrder}
      />
    </div>
  )
}
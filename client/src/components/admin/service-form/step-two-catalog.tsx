"use client"

import { useState, useMemo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Check, Minus, ClipboardList } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { IoSettingsSharp } from "react-icons/io5"
import { FaBoxArchive } from "react-icons/fa6"
import ToggleTabs from "@/components/customs/toggle-tabs"

interface CatalogItem {
  readonly _id: string
  readonly id: string
  readonly title: string
  readonly name?: string
  readonly price: number
  readonly description?: string
}

interface Selection {
  readonly item: CatalogItem
  readonly quantity: number
}

interface Customer {
  readonly _id: string
  readonly name: string
  readonly phone?: string
  readonly email?: string
}

type TabType = "Services" | "Parts"

interface StepTwoCatalogProps {
  readonly selectedUser: Customer | null
  readonly searchQuery: string
  readonly setSearchQuery: (query: string) => void
  readonly activeTab: string
  readonly setActiveTab: (tab: string) => void
  readonly catalogResults: ReadonlyArray<CatalogItem>
  readonly selections: ReadonlyArray<Selection>
  readonly isSearchingCatalog: boolean
  readonly draftOrderId: string | null
  readonly total: number
  readonly services: ReadonlyArray<CatalogItem>
  readonly parts: ReadonlyArray<CatalogItem>
  readonly onAddSelection: (item: CatalogItem | CustomItemPayload) => Promise<void>
  readonly onDecSelection: (id: string) => Promise<void>
}

interface TranslationFunction {
  (key: string): string
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>

interface CustomItemPayload {
  readonly Code: string
  readonly title: string
  readonly price: number
  readonly description: string
  readonly stock: string
  readonly type: "service" | "part"
  readonly flag: "custom"
}

interface CustomItemForm {
  title: string
  price: string
  description: string
  stock: string
}

interface TabOption {
  readonly label: string
  readonly icon: JSX.Element
}

const INITIAL_CUSTOM_ITEM: CustomItemForm = {
  title: "",
  price: "",
  description: "",
  stock: "",
} as const

const CURRENCY_SYMBOL = "₹" as const
const CUSTOM_ITEM_PREFIX = "custom-" as const
const ZERO_QUANTITY = 0 as const

function isServicesTab(tab: string): boolean {
  return tab === "Services"
}

function generateCustomCode(): string {
  return `${CUSTOM_ITEM_PREFIX}${Date.now()}`
}

function parsePrice(priceString: string): number {
  return Number.parseFloat(priceString)
}

function hasRequiredFields(title: string, price: string): boolean {
  return Boolean(title.trim() && price.trim())
}

function findSelection(selections: ReadonlyArray<Selection>, itemId: string): Selection | undefined {
  return selections.find((s: Selection): boolean => s.item._id === itemId)
}

function getItemDisplayName(item: CatalogItem): string {
  return item.name ?? item.title
}

function getQuantity(selection: Selection | undefined): number {
  return selection?.quantity ?? ZERO_QUANTITY
}

export default function StepTwoCatalog({
  selectedUser,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  catalogResults,
  selections,
  isSearchingCatalog,
  draftOrderId,
  total,
  services,
  parts,
  onAddSelection,
  onDecSelection,
}: StepTwoCatalogProps): JSX.Element {
  const { t } = useTranslation("pages") as { t: TranslationFunction }

  const [customItem, setCustomItem] = useState<CustomItemForm>(INITIAL_CUSTOM_ITEM)

  const isServices = useMemo<boolean>(
    (): boolean => isServicesTab(activeTab),
    [activeTab]
  )

  const formattedTotal = useMemo<string>(
    (): string => total.toLocaleString(),
    [total]
  )

  const searchPlaceholder = useMemo<string>(
    (): string => `Find ${isServices ? "services" : "spare parts"} in catalog...`,
    [isServices]
  )

  const showStockField = useMemo<boolean>(
    (): boolean => !isServices,
    [isServices]
  )

  const tabOptions = useMemo<ReadonlyArray<TabOption>>(
    (): ReadonlyArray<TabOption> => [
      { label: t("stepForm.services"), icon: <IoSettingsSharp className="w-4 h-4" /> },
      { label: t("stepForm.partsMaterials"), icon: <FaBoxArchive className="w-4 h-4" /> },
    ],
    [t]
  )

  const canAddCustomItem = useMemo<boolean>(
    (): boolean => hasRequiredFields(customItem.title, customItem.price),
    [customItem.title, customItem.price]
  )

  const handleAddCustomService = useCallback(
    async (): Promise<void> => {
      if (!canAddCustomItem) return

      const payload: CustomItemPayload = {
        Code: generateCustomCode(),
        title: customItem.title,
        price: parsePrice(customItem.price),
        description: customItem.description,
        stock: customItem.stock,
        type: isServices ? "service" : "part",
        flag: "custom",
      }

      await onAddSelection(payload)
      setCustomItem(INITIAL_CUSTOM_ITEM)
    },
    [customItem, isServices, onAddSelection, canAddCustomItem]
  )

  const handleSearchChange = useCallback(
    (event: InputChangeEvent): void => {
      setSearchQuery(event.target.value)
    },
    [setSearchQuery]
  )

  const handleCustomTitleChange = useCallback(
    (event: InputChangeEvent): void => {
      setCustomItem({ ...customItem, title: event.target.value })
    },
    [customItem]
  )

  const handleCustomPriceChange = useCallback(
    (event: InputChangeEvent): void => {
      setCustomItem({ ...customItem, price: event.target.value })
    },
    [customItem]
  )

  const handleCustomDescChange = useCallback(
    (event: InputChangeEvent): void => {
      setCustomItem({ ...customItem, description: event.target.value })
    },
    [customItem]
  )

  const handleCustomStockChange = useCallback(
    (event: InputChangeEvent): void => {
      setCustomItem({ ...customItem, stock: event.target.value })
    },
    [customItem]
  )

  const handleAddCustomClick = useCallback(
    (event: ButtonClickEvent): void => {
      event.preventDefault()
      void handleAddCustomService()
    },
    [handleAddCustomService]
  )

  const handleItemAdd = useCallback(
    (item: CatalogItem): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        void onAddSelection(item)
      }
    },
    [onAddSelection]
  )

  const handleItemDec = useCallback(
    (itemId: string): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        void onDecSelection(itemId)
      }
    },
    [onDecSelection]
  )

  const handleServiceToggle = useCallback(
    (item: CatalogItem, isSelected: boolean): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        if (isSelected) {
          void onDecSelection(item._id)
        } else {
          void onAddSelection(item)
        }
      }
    },
    [onAddSelection, onDecSelection]
  )

  const renderHeader = (): JSX.Element => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t("stepForm.servicesComponents")}
        </h3>
        <p className="text-slate-500 text-[15px]">
          {t("stepForm.selectedFor")}:{" "}
          <span className="font-bold text-teal-600">{selectedUser?.name}</span>
        </p>
      </div>
      <ToggleTabs
        options={tabOptions as any}
        defaultActive={t("stepForm.services")}
        onChange={setActiveTab}
        className="bg-slate-100/50 border-none p-1 rounded-xl"
      />
    </div>
  )

  const renderCustomItemForm = (): JSX.Element => (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/20 p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold text-teal-900">
          {t("stepForm.addCustomService")}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Input
          type="text"
          value={customItem.title}
          onChange={handleCustomTitleChange}
          placeholder={t("stepForm.serviceName")}
          className="md:col-span-2 h-11 rounded-xl bg-white border-teal-100/50"
          aria-label="Custom item title"
        />
        <Input
          type="number"
          value={customItem.price}
          onChange={handleCustomPriceChange}
          placeholder={`${t("stepForm.price")} (${CURRENCY_SYMBOL})`}
          className="h-11 rounded-xl bg-white border-teal-100/50"
          aria-label="Custom item price"
        />
        <Input
          type="text"
          value={customItem.description}
          onChange={handleCustomDescChange}
          placeholder={t("stepForm.description")}
          className="md:col-span-2 h-11 rounded-xl bg-white border-teal-100/50"
          aria-label="Custom item description"
        />
        {showStockField && (
          <Input
            type="number"
            value={customItem.stock}
            onChange={handleCustomStockChange}
            placeholder="Add Stock"
            className="md:col-span-2 h-11 rounded-xl bg-white border-teal-100/50"
            aria-label="Custom item stock"
          />
        )}
      </div>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-6 h-11 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        onClick={handleAddCustomClick}
        disabled={!canAddCustomItem}
        aria-label="Add custom item"
      >
        {t("stepForm.add")}
      </Button>
    </div>
  )

  const renderSearchBar = (): JSX.Element => (
    <div className="relative group">
      <Search
        className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
        aria-hidden="true"
      />
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={searchPlaceholder}
        className="pl-12 bg-slate-50/50 border-slate-200 h-12 rounded-xl focus:bg-white transition-all"
        disabled={isSearchingCatalog}
        aria-label="Search catalog"
      />
    </div>
  )

  const renderServiceButton = (item: CatalogItem, selected: Selection | undefined): JSX.Element => {
    const isSelected: boolean = Boolean(selected)

    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        className={`rounded-lg h-8 text-[11px] font-bold uppercase tracking-wider ${
          isSelected
            ? "bg-teal-600"
            : "border-slate-200 text-white hover:bg-teal-600 hover:text-white cursor-pointer"
        }`}
        onClick={handleServiceToggle(item, isSelected)}
        aria-label={isSelected ? "Remove service" : "Add service"}
      >
        {isSelected ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
        {isSelected ? "Added" : "Add"}
      </Button>
    )
  }

  const renderPartControls = (item: CatalogItem, selected: Selection | undefined): JSX.Element => {
    const quantity: number = getQuantity(selected)

    return (
      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
        <button
          className="p-1 text-slate-500 hover:bg-white rounded-md transition-colors"
          onClick={handleItemDec(item._id)}
          aria-label="Decrease quantity"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="min-w-[28px] text-center font-bold text-slate-800 text-[13px]">
          {quantity}
        </span>
        <button
          className="p-1 text-teal-600 hover:bg-white rounded-md transition-colors"
          onClick={handleItemAdd(item)}
          aria-label="Increase quantity"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    )
  }

  const renderCatalogItem = (item: CatalogItem): JSX.Element => {
    const selected: Selection | undefined = findSelection(selections, item._id)
    const displayName: string = getItemDisplayName(item)

    return (
      <motion.div
        layout
        key={item._id}
        whileHover={{ y: -4 }}
        className={`group p-5 rounded-2xl border transition-all duration-300 relative ${
          selected
            ? "border-teal-200 bg-teal-50/50 shadow-md ring-1 ring-teal-200"
            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/40"
        }`}
      >
        <div className="flex flex-col h-full space-y-4">
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-teal-700 transition-colors">
              {displayName}
            </h4>
            <p className="text-[12px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
            <span className="text-teal-700 font-extrabold text-[16px]">
              {CURRENCY_SYMBOL}{item.price}
            </span>
            {isServices ? renderServiceButton(item, selected) : renderPartControls(item, selected)}
          </div>
        </div>
      </motion.div>
    )
  }

  const renderCatalogGrid = (): JSX.Element => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar p-2 pr-1">
      {catalogResults.map((item: CatalogItem): JSX.Element => renderCatalogItem(item))}
    </div>
  )

  const renderTotalSummary = (): JSX.Element => (
    <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-100 pt-6 mt-8 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-500 font-medium">
        <ClipboardList className="w-4 h-4" />
        <span className="text-[14px]">Subtotal Summary</span>
      </div>
      <div className="text-right">
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">
          Running Total
        </p>
        <span className="text-3xl font-black text-slate-900 tracking-tighter">
          {CURRENCY_SYMBOL}{formattedTotal}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {renderHeader()}
      {renderCustomItemForm()}
      <div className="space-y-4">
        {renderSearchBar()}
        {renderCatalogGrid()}
      </div>
      {renderTotalSummary()}
    </div>
  )
}

export type {
  StepTwoCatalogProps,
  CatalogItem,
  Selection,
  Customer,
  CustomItemPayload,
  TabType,
}
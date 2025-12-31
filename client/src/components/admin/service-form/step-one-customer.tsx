"use client"

import { useState, useMemo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus2, Plus, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { customerService } from "@/services/customer.service"
import { orderService } from "@/services/order.service"

interface Customer {
  readonly _id: string
  readonly name: string
  readonly phone?: string
  readonly email?: string
}

interface Tractor {
  readonly name: string
  readonly model: string
}

interface NewCustomer {
  name: string
  phone: string
  email: string
}

interface StepOneCustomerProps {
  readonly userQuery: string
  readonly setUserQuery: (query: string) => void
  readonly selectedUser: Customer | null
  readonly setSelectedUser: (user: Customer | null) => void
  readonly tractor: Tractor
  readonly setTractor: (tractor: Tractor) => void
  readonly isSearchingCustomers: boolean
  readonly results: ReadonlyArray<Customer>
  readonly setDraftOrderId: (id: string) => void
}

interface TranslationFunction {
  (key: string): string
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>

interface CreateDraftOrderPayload {
  readonly customerId: string
  readonly tractor?: {
    readonly name?: string
    readonly model?: string
  }
}

interface UpsertCustomerPayload {
  readonly name: string
  readonly phone?: string
  readonly email?: string
}

interface OrderResponse {
  readonly id: string
}

interface CustomerResponse {
  readonly data: Customer
}

interface ApiError {
  readonly response?: {
    readonly data?: {
      readonly message?: string
    }
    readonly message?: string
  }
  readonly message?: string
}

const INITIAL_NEW_CUSTOMER: NewCustomer = {
  name: "",
  phone: "",
  email: "",
} as const

const MAX_RESULTS_HEIGHT = 280 as const
const AVATAR_SIZE = 10 as const
const CHECK_ICON_SIZE = 6 as const

function getInitial(name: string | undefined): string {
  return name?.charAt(0)?.toUpperCase() ?? ""
}

function hasValue(value: string | undefined): boolean {
  return Boolean(value?.trim())
}

function hasTractorInfo(tractor: Tractor): boolean {
  return hasValue(tractor.name) || hasValue(tractor.model)
}

function getTractorPayload(tractor: Tractor): { name?: string; model?: string } | undefined {
  if (!hasTractorInfo(tractor)) {
    return undefined
  }

  return {
    name: hasValue(tractor.name) ? tractor.name : undefined,
    model: hasValue(tractor.model) ? tractor.model : undefined,
  }
}

function sanitizeString(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export default function StepOneCustomer({
  userQuery,
  setUserQuery,
  selectedUser,
  setSelectedUser,
  tractor,
  setTractor,
  isSearchingCustomers,
  results,
  setDraftOrderId,
}: StepOneCustomerProps): JSX.Element {
  const { t } = useTranslation("pages") as { t: TranslationFunction }

  const [newUser, setNewUser] = useState<NewCustomer>(INITIAL_NEW_CUSTOMER)

  const hasResults = useMemo<boolean>(
    (): boolean => results.length > 0,
    [results.length]
  )

  const hasQuery = useMemo<boolean>(
    (): boolean => hasValue(userQuery),
    [userQuery]
  )

  const emptyStateMessage = useMemo<string>(
    (): string =>
      hasQuery
        ? t("stepForm.noMatchingCustomers")
        : "Search customers using name , phone or email",
    [hasQuery, t]
  )

  const isCustomerSelected = useCallback(
    (customerId: string): boolean => {
      return selectedUser?._id === customerId
    },
    [selectedUser]
  )

  const handleSelectCustomer = useCallback(
    async (user: Customer): Promise<void> => {
      setSelectedUser(user)

      try {
        const payload: CreateDraftOrderPayload = {
          customerId: user._id,
          tractor: getTractorPayload(tractor),
        }

        const order: OrderResponse = await orderService.createDraftOrder(payload)
        setDraftOrderId(order.id)
        toast.success("Draft order created")
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError.response?.message ?? "Failed to create draft order")
        setSelectedUser(null)
      }
    },
    [tractor, setSelectedUser, setDraftOrderId]
  )

  const handleCreateCustomer = useCallback(
    async (): Promise<void> => {
      if (!hasValue(newUser.name)) {
        toast.error("Please enter customer name")
        return
      }

      try {
        const payload: UpsertCustomerPayload = {
          name: sanitizeString(newUser.name)!,
          phone: sanitizeString(newUser.phone),
          email: sanitizeString(newUser.email),
        }

        const response: CustomerResponse = await customerService.upsertCustomer(payload)
        setSelectedUser(response.data)
        setNewUser(INITIAL_NEW_CUSTOMER)
        setUserQuery(response.data.name)
        toast.success("Customer created successfully")
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError.response?.data?.message ?? "Failed to create customer")
      }
    },
    [newUser, setSelectedUser, setUserQuery]
  )

  const handleSearchChange = useCallback(
    (event: InputChangeEvent): void => {
      setUserQuery(event.target.value)
    },
    [setUserQuery]
  )

  const handleNewCustomerNameChange = useCallback(
    (event: InputChangeEvent): void => {
      setNewUser({ ...newUser, name: event.target.value })
    },
    [newUser]
  )

  const handleNewCustomerPhoneChange = useCallback(
    (event: InputChangeEvent): void => {
      setNewUser({ ...newUser, phone: event.target.value })
    },
    [newUser]
  )

  const handleNewCustomerEmailChange = useCallback(
    (event: InputChangeEvent): void => {
      setNewUser({ ...newUser, email: event.target.value })
    },
    [newUser]
  )

  const handleTractorNameChange = useCallback(
    (event: InputChangeEvent): void => {
      setTractor({ ...tractor, name: event.target.value })
    },
    [tractor, setTractor]
  )

  const handleTractorModelChange = useCallback(
    (event: InputChangeEvent): void => {
      setTractor({ ...tractor, model: event.target.value })
    },
    [tractor, setTractor]
  )

  const handleCreateCustomerClick = useCallback(
    (event: ButtonClickEvent): void => {
      event.preventDefault()
      void handleCreateCustomer()
    },
    [handleCreateCustomer]
  )

  const renderLoadingState = (): JSX.Element => (
    <div className="p-8 text-center text-slate-400 font-medium italic">
      Searching...
    </div>
  )

  const renderEmptyState = (): JSX.Element => (
    <div className="p-8 text-center text-slate-400 font-medium italic">
      {emptyStateMessage}
    </div>
  )

  const renderCustomerAvatar = (customer: Customer, isSelected: boolean): JSX.Element => (
    <div
      className={`w-${AVATAR_SIZE} h-${AVATAR_SIZE} rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
        isSelected ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
      }`}
    >
      {getInitial(customer.name)}
    </div>
  )

  const renderCustomerInfo = (customer: Customer, isSelected: boolean): JSX.Element => (
    <div>
      <div
        className={`font-bold text-[15px] ${
          isSelected ? "text-teal-900" : "text-slate-900"
        }`}
      >
        {customer.name}
      </div>
      <div className="text-[13px] text-slate-500 mt-0.5">
        {customer.phone ?? customer.email}
      </div>
    </div>
  )

  const renderCheckIcon = (): JSX.Element => (
    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center shadow-md shadow-teal-500/20">
      <Check className={`w-3.5 h-3.5 text-white`} />
    </div>
  )

  const renderCustomerItem = (customer: Customer): JSX.Element => {
    const isSelected: boolean = isCustomerSelected(customer._id)

    return (
      <button
        key={customer._id}
        onClick={() => void handleSelectCustomer(customer)}
        className={`w-full text-left px-6 py-4 transition-all duration-200 flex items-center justify-between group ${
          isSelected ? "bg-teal-50/80" : "hover:bg-white"
        }`}
        aria-label={`Select customer ${customer.name}`}
        aria-pressed={isSelected}
      >
        <div className="flex items-center gap-4">
          {renderCustomerAvatar(customer, isSelected)}
          {renderCustomerInfo(customer, isSelected)}
        </div>
        {isSelected && renderCheckIcon()}
      </button>
    )
  }

  const renderCustomerList = (): JSX.Element => {
    if (isSearchingCustomers) {
      return renderLoadingState()
    }

    if (!hasResults) {
      return renderEmptyState()
    }

    return (
      <>
        {results.map((customer: Customer): JSX.Element => renderCustomerItem(customer))}
      </>
    )
  }

  const renderSearchSection = (): JSX.Element => (
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
        {t("stepForm.searchCustomer")}
      </label>
      <div className="relative group">
        <Search
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
          aria-hidden="true"
        />
        <Input
          type="text"
          value={userQuery}
          onChange={handleSearchChange}
          placeholder={t("stepForm.searchPlaceholder")}
          className="pl-12 bg-slate-50/50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all text-[15px]"
          aria-label="Search customers"
        />
      </div>
    </div>
  )

  const renderResultsSection = (): JSX.Element => (
    <div
      className="overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/30 divide-y divide-slate-100/80 custom-scrollbar"
      style={{ maxHeight: `${MAX_RESULTS_HEIGHT}px` }}
      role="list"
      aria-label="Customer search results"
    >
      {renderCustomerList()}
    </div>
  )

  const renderNewCustomerSection = (): JSX.Element => (
    <div className="border-t border-slate-100 pt-8 space-y-5">
      <div className="flex items-center gap-2 text-slate-900">
        <UserPlus2 className="w-5 h-5 text-teal-600" aria-hidden="true" />
        <span className="text-base font-bold tracking-tight">
          {t("stepForm.registerNewCustomer")}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          value={newUser.name}
          onChange={handleNewCustomerNameChange}
          placeholder={t("stepForm.fullName")}
          className="h-11 rounded-xl bg-slate-50/50"
          aria-label="Customer name"
        />
        <Input
          type="tel"
          value={newUser.phone}
          onChange={handleNewCustomerPhoneChange}
          placeholder={t("stepForm.phoneNumber")}
          className="h-11 rounded-xl bg-slate-50/50"
          aria-label="Customer phone"
        />
        <Input
          type="email"
          value={newUser.email}
          onChange={handleNewCustomerEmailChange}
          placeholder={t("stepForm.emailAddress")}
          className="h-11 rounded-xl bg-slate-50/50"
          aria-label="Customer email"
        />
      </div>
      <Button
        variant="outline"
        className="border-teal-100 bg-teal-50/30 text-teal-700 hover:bg-teal-600 hover:text-white rounded-xl h-11 transition-all duration-300 font-semibold"
        onClick={handleCreateCustomerClick}
        aria-label="Register and select customer"
      >
        <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
        {t("stepForm.registerSelect")}
      </Button>
    </div>
  )

  const renderTractorSection = (): JSX.Element => (
    <div className="border-t border-slate-100 pt-8 space-y-4">
      <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
        {t("stepForm.tractorModelDetails")}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          value={tractor.name}
          onChange={handleTractorNameChange}
          placeholder={t("stepForm.makeBrand")}
          className="h-11 rounded-xl bg-slate-50/50"
          aria-label="Tractor name or brand"
        />
        <Input
          type="text"
          value={tractor.model}
          onChange={handleTractorModelChange}
          placeholder={t("stepForm.modelNumber")}
          className="h-11 rounded-xl bg-slate-50/50"
          aria-label="Tractor model number"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t("stepForm.customerTractorDetails")}
        </h3>
        <p className="text-slate-500 text-[15px]">
          {t("stepForm.customerTractorDescription")}
        </p>
      </div>

      {renderSearchSection()}
      {renderResultsSection()}
      {renderNewCustomerSection()}
      {renderTractorSection()}
    </div>
  )
}

export type {
  StepOneCustomerProps,
  Customer,
  Tractor,
  NewCustomer,
  CreateDraftOrderPayload,
  UpsertCustomerPayload,
}
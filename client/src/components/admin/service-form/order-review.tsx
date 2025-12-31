"use client"

import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface CatalogItem {
  readonly _id: string
  readonly title: string
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
  readonly phone: string
  readonly email?: string
}

interface Tractor {
  readonly name: string
  readonly model: string
}

type DiscountMap = Readonly<Record<string, number>>

interface OrderReviewProps {
  readonly selections: ReadonlyArray<Selection>
  readonly discounts: DiscountMap
  readonly selectedUser: Customer | null
  readonly tractor: Tractor
  readonly total: number
  readonly totalDiscount: number
  readonly finalTotal: number
  readonly isLoading: boolean
  readonly onSubmit: () => void
}

interface TranslationFunction {
  (key: string): string
}

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>

interface ItemCalculation {
  readonly itemId: string
  readonly title: string
  readonly quantity: number
  readonly unitPrice: number
  readonly subtotal: number
  readonly discountPercent: number
  readonly discountAmount: number
  readonly finalAmount: number
}

const DECIMAL_PLACES = 2 as const
const CURRENCY_SYMBOL = "$" as const
const PERCENT_SYMBOL = "%" as const
const DEFAULT_DISCOUNT = 0 as const
const LOADING_TEXT = "Starting Service..." as const
const SUBMIT_TEXT = "Start Service" as const

function formatCurrency(value: number, decimals: number = DECIMAL_PLACES): string {
  return value.toFixed(decimals)
}

function calculateItemDetails(
  selection: Selection,
  discountPercent: number
): ItemCalculation {
  const subtotal: number = selection.item.price * selection.quantity
  const discountAmount: number = (subtotal * discountPercent) / 100
  const finalAmount: number = subtotal - discountAmount

  return {
    itemId: selection.item._id,
    title: selection.item.title,
    quantity: selection.quantity,
    unitPrice: selection.item.price,
    subtotal,
    discountPercent,
    discountAmount,
    finalAmount,
  }
}

function getDiscountForItem(discounts: DiscountMap, itemId: string): number {
  return discounts[itemId] ?? DEFAULT_DISCOUNT
}

function hasTractorInfo(tractor: Tractor): boolean {
  return Boolean(tractor.name || tractor.model)
}

export function OrderReview({
  selections,
  discounts,
  selectedUser,
  tractor,
  total,
  totalDiscount,
  finalTotal,
  isLoading,
  onSubmit,
}: OrderReviewProps): JSX.Element {
  const { t } = useTranslation("pages") as { t: TranslationFunction }

  const itemCalculations = useMemo<ReadonlyArray<ItemCalculation>>(
    (): ReadonlyArray<ItemCalculation> => {
      return selections.map((selection: Selection): ItemCalculation => {
        const discountPercent: number = getDiscountForItem(discounts, selection.item._id)
        return calculateItemDetails(selection, discountPercent)
      })
    },
    [selections, discounts]
  )

  const isSubmitDisabled = useMemo<boolean>(
    (): boolean => isLoading || selections.length === 0,
    [isLoading, selections.length]
  )

  const buttonText = useMemo<string>(
    (): string => (isLoading ? LOADING_TEXT : SUBMIT_TEXT),
    [isLoading]
  )

  const hasDiscount = useMemo<boolean>(
    (): boolean => totalDiscount > 0,
    [totalDiscount]
  )

  const showTractor = useMemo<boolean>(
    (): boolean => hasTractorInfo(tractor),
    [tractor]
  )

  const handleSubmit = useCallback(
    (event: ButtonClickEvent): void => {
      event.preventDefault()
      onSubmit()
    },
    [onSubmit]
  )

  const renderCustomerField = (
    label: string,
    value: string | undefined
  ): JSX.Element | null => {
    if (!value) return null

    return (
      <div>
        <p className="text-slate-600">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    )
  }

  const renderCustomerInfo = (): JSX.Element => (
    <div className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border border-teal-200/50 rounded-2xl p-6">
      <h4 className="font-bold text-slate-900 mb-3">Customer Information</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {renderCustomerField("Name", selectedUser?.name)}
        {renderCustomerField("Phone", selectedUser?.phone)}
        {showTractor && renderCustomerField("Tractor Name", tractor.name)}
        {showTractor && renderCustomerField("Model", tractor.model)}
      </div>
    </div>
  )

  const renderItemDiscount = (discountPercent: number): JSX.Element | null => {
    if (discountPercent <= 0) return null

    return (
      <p className="text-sm text-red-600 mt-1">
        Discount: -{discountPercent}{PERCENT_SYMBOL}
      </p>
    )
  }

  const renderItemRow = (calculation: ItemCalculation): JSX.Element => {
    const formattedUnitPrice: string = formatCurrency(calculation.unitPrice)
    const formattedFinalAmount: string = formatCurrency(calculation.finalAmount)

    return (
      <div
        key={calculation.itemId}
        className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center"
      >
        <div className="flex-1">
          <p className="font-semibold text-slate-900">{calculation.title}</p>
          <p className="text-sm text-slate-500">
            {calculation.quantity} × {CURRENCY_SYMBOL}{formattedUnitPrice}
          </p>
          {renderItemDiscount(calculation.discountPercent)}
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-900">
            {CURRENCY_SYMBOL}{formattedFinalAmount}
          </p>
        </div>
      </div>
    )
  }

  const renderItemsSummary = (): JSX.Element => (
    <div className="space-y-3">
      <h4 className="font-bold text-slate-900">Items Summary</h4>
      {itemCalculations.map((calculation: ItemCalculation): JSX.Element => 
        renderItemRow(calculation)
      )}
    </div>
  )

  const renderSubtotalRow = (): JSX.Element => {
    const formattedTotal: string = formatCurrency(total)

    return (
      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
        <span className="text-slate-600">Subtotal</span>
        <span className="font-semibold text-slate-900">
          {CURRENCY_SYMBOL}{formattedTotal}
        </span>
      </div>
    )
  }

  const renderDiscountRow = (): JSX.Element | null => {
    if (!hasDiscount) return null

    const formattedDiscount: string = formatCurrency(totalDiscount)

    return (
      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
        <span className="text-red-600 font-semibold">Total Discount</span>
        <span className="font-bold text-red-600">
          -{CURRENCY_SYMBOL}{formattedDiscount}
        </span>
      </div>
    )
  }

  const renderTotalRow = (): JSX.Element => {
    const formattedFinalTotal: string = formatCurrency(finalTotal)

    return (
      <div className="flex justify-between items-center pt-3">
        <span className="text-lg font-bold text-slate-900">Total Amount</span>
        <span className="text-2xl font-bold text-teal-600">
          {CURRENCY_SYMBOL}{formattedFinalTotal}
        </span>
      </div>
    )
  }

  const renderTotals = (): JSX.Element => (
    <div className="bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-200">
      {renderSubtotalRow()}
      {renderDiscountRow()}
      {renderTotalRow()}
    </div>
  )

  const renderSubmitButton = (): JSX.Element => (
    <Button
      onClick={handleSubmit}
      disabled={isSubmitDisabled}
      className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={buttonText}
    >
      {buttonText}
    </Button>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t("stepForm.reviewOrder")}
        </h3>
        <p className="text-slate-500 text-[15px]">
          {t("stepForm.reviewOrderDescription")}
        </p>
      </div>

      {renderCustomerInfo()}
      {renderItemsSummary()}
      {renderTotals()}
      {renderSubmitButton()}
    </div>
  )
}

export type {
  OrderReviewProps,
  Selection,
  CatalogItem,
  Customer,
  Tractor,
  DiscountMap,
  ItemCalculation,
}
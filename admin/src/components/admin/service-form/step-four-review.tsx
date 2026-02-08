"use client"

import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface CatalogItem {
  readonly id: string
  readonly name?: string
  readonly title: string
  readonly price: number
  readonly description?: string
}

interface Selection {
  readonly item: CatalogItem
  readonly quantity: number
}

interface Customer {
  readonly _id?: string
  readonly name: string
  readonly phone: string
  readonly email?: string
}

interface Tractor {
  readonly name: string
  readonly model: string
}

type DiscountMap = Readonly<Record<string, number>>

interface StepFourReviewProps {
  readonly selectedUser: Customer | null
  readonly tractor: Tractor
  readonly selections: ReadonlyArray<Selection>
  readonly discounts: DiscountMap
  readonly total: number
  readonly totalDiscount: number
  readonly finalTotal: number
}

interface TranslationFunction {
  (key: string): string
}

interface ItemCalculation {
  readonly itemId: string
  readonly displayName: string
  readonly quantity: number
  readonly unitPrice: number
  readonly subtotal: number
  readonly discountPercent: number
  readonly discountAmount: number
  readonly finalPrice: number
}

const DECIMAL_PLACES = 2 as const
const CURRENCY_SYMBOL = "₹" as const
const PERCENT_SYMBOL = "%" as const
const DEFAULT_DISCOUNT = 0 as const
const FALLBACK_TEXT = "N/A" as const
const MAX_ITEMS_HEIGHT = 192 as const

function formatCurrency(value: number, decimals: number = DECIMAL_PLACES): string {
  return value.toFixed(decimals)
}

function getDiscountForItem(discounts: DiscountMap, itemId: string): number {
  return discounts[itemId] ?? DEFAULT_DISCOUNT
}

function calculateItemDetails(
  selection: Selection,
  discountPercent: number
): ItemCalculation {
  const subtotal: number = selection.item.price * selection.quantity
  const discountAmount: number = (subtotal * discountPercent) / 100
  const finalPrice: number = subtotal - discountAmount

  return {
    itemId: selection.item.id,
    displayName: selection.item.name ?? selection.item.title,
    quantity: selection.quantity,
    unitPrice: selection.item.price,
    subtotal,
    discountPercent,
    discountAmount,
    finalPrice,
  }
}

function hasTractorInfo(tractor: Tractor): boolean {
  return Boolean(tractor.name || tractor.model)
}

export default function StepFourReview({
  selectedUser,
  tractor,
  selections,
  discounts,
  total,
  totalDiscount,
  finalTotal,
}: StepFourReviewProps): JSX.Element {
  const { t } = useTranslation("pages") as { t: TranslationFunction }

  const itemCalculations = useMemo<ReadonlyArray<ItemCalculation>>(
    (): ReadonlyArray<ItemCalculation> => {
      return selections.map((selection: Selection): ItemCalculation => {
        const discountPercent: number = getDiscountForItem(discounts, selection.item.id)
        return calculateItemDetails(selection, discountPercent)
      })
    },
    [selections, discounts]
  )

  const hasDiscount = useMemo<boolean>(
    (): boolean => totalDiscount > 0,
    [totalDiscount]
  )

  const showTractor = useMemo<boolean>(
    (): boolean => hasTractorInfo(tractor),
    [tractor]
  )

  const hasSelections = useMemo<boolean>(
    (): boolean => selections.length > 0,
    [selections.length]
  )

  const formattedTotal = useMemo<string>(
    (): string => formatCurrency(total),
    [total]
  )

  const formattedDiscount = useMemo<string>(
    (): string => formatCurrency(totalDiscount),
    [totalDiscount]
  )

  const formattedFinalTotal = useMemo<string>(
    (): string => formatCurrency(finalTotal),
    [finalTotal]
  )

  const renderInfoField = (
    label: string,
    value: string | undefined,
    fallback: string = FALLBACK_TEXT
  ): JSX.Element => (
    <div>
      <div className="text-xs text-slate-600 font-medium uppercase">{label}</div>
      <div className="font-semibold text-slate-900 mt-1">{value ?? fallback}</div>
    </div>
  )

  const renderCustomerDetails = (): JSX.Element => (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Customer Details</h3>
      </div>
      <div className="px-5 py-4 space-y-4">
        {renderInfoField("Name", selectedUser?.name)}
        {renderInfoField("Phone", selectedUser?.phone)}
        {renderInfoField("Email", selectedUser?.email)}
        {showTractor && (
          <>
            {renderInfoField("Tractor", tractor.name)}
            {renderInfoField("Model", tractor.model)}
          </>
        )}
      </div>
    </div>
  )

  const renderSubtotalRow = (): JSX.Element => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">Subtotal</span>
      <span className="font-semibold text-slate-900">
        {CURRENCY_SYMBOL}{formattedTotal}
      </span>
    </div>
  )

  const renderDiscountRow = (): JSX.Element | null => {
    if (!hasDiscount) return null

    return (
      <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-3">
        <span className="text-teal-600 font-medium">Discount</span>
        <span className="text-teal-600 font-bold">
          -{CURRENCY_SYMBOL}{formattedDiscount}
        </span>
      </div>
    )
  }

  const renderTotalRow = (): JSX.Element => (
    <div className="border-t border-slate-200 pt-3 mt-3 flex items-center justify-between">
      <span className="text-slate-900 font-bold">Grand Total</span>
      <span className="text-2xl font-bold text-teal-600">
        {CURRENCY_SYMBOL}{formattedFinalTotal}
      </span>
    </div>
  )

  const renderOrderSummary = (): JSX.Element => (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Order Summary</h3>
      </div>
      <div className="px-5 py-4 space-y-3">
        {renderSubtotalRow()}
        {renderDiscountRow()}
        {renderTotalRow()}
      </div>
    </div>
  )

  const renderItemDiscount = (discountPercent: number): JSX.Element | null => {
    if (discountPercent <= 0) return null

    return (
      <span className="text-teal-600 font-medium">
        -{discountPercent}{PERCENT_SYMBOL}
      </span>
    )
  }

  const renderSelectionItem = (calculation: ItemCalculation): JSX.Element => {
    const formattedUnitPrice: string = formatCurrency(calculation.unitPrice)
    const formattedFinalPrice: string = formatCurrency(calculation.finalPrice)

    return (
      <div 
        key={calculation.itemId} 
        className="px-5 py-3 text-sm hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-900">
            {calculation.displayName}
          </span>
          <span className="text-slate-900 font-bold">
            {CURRENCY_SYMBOL}{formattedFinalPrice}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Qty: {calculation.quantity} × {CURRENCY_SYMBOL}{formattedUnitPrice}
          </span>
          {renderItemDiscount(calculation.discountPercent)}
        </div>
      </div>
    )
  }

  const renderSelectedItems = (): JSX.Element | null => {
    if (!hasSelections) return null

    return (
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-5 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">
            Selected Items ({selections.length})
          </h3>
        </div>
        <div 
          className="divide-y divide-slate-200 overflow-y-auto"
          style={{ maxHeight: `${MAX_ITEMS_HEIGHT}px` }}
        >
          {itemCalculations.map((calculation: ItemCalculation): JSX.Element => 
            renderSelectionItem(calculation)
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Order</h2>

      <div className="grid grid-cols-2 gap-6">
        {renderCustomerDetails()}
        {renderOrderSummary()}
      </div>

      {renderSelectedItems()}
    </div>
  )
}

export type {
  StepFourReviewProps,
  Selection,
  CatalogItem,
  Customer,
  Tractor,
  DiscountMap,
  ItemCalculation,
}
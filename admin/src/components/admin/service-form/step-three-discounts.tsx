"use client"

import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Gift } from "lucide-react"
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

type DiscountMap = Readonly<Record<string, number>>

interface StepThreeDiscountsProps {
  readonly selections: ReadonlyArray<Selection>
  readonly discounts: DiscountMap
  readonly totalDiscount: number
  readonly total: number
  readonly onUpdateDiscount: (id: string, delta: number) => Promise<void>
}

interface TranslationFunction {
  (key: string): string
}

type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>

interface ItemDiscountCalculation {
  readonly itemId: string
  readonly title: string
  readonly quantity: number
  readonly subtotal: number
  readonly discountPercent: number
  readonly discountAmount: number
}

const DECIMAL_PLACES = 2 as const
const CURRENCY_SYMBOL = "₹" as const
const PERCENT_SYMBOL = "%" as const
const DISCOUNT_INCREMENT = 5 as const
const DISCOUNT_DECREMENT = -5 as const
const DEFAULT_DISCOUNT = 0 as const
const ZERO_VALUE = 0 as const

function formatCurrency(value: number, decimals: number = DECIMAL_PLACES): string {
  return value.toFixed(decimals)
}

function formatPercentage(value: number, decimals: number = 1): string {
  return value.toFixed(decimals)
}

function getDiscountForItem(discounts: DiscountMap, itemId: string): number {
  return discounts[itemId] ?? DEFAULT_DISCOUNT
}

function calculateItemDiscount(
  selection: Selection,
  discountPercent: number
): ItemDiscountCalculation {
  const subtotal: number = selection.item.price * selection.quantity
  const discountAmount: number = (subtotal * discountPercent) / 100

  return {
    itemId: selection.item._id,
    title: selection.item.title,
    quantity: selection.quantity,
    subtotal,
    discountPercent,
    discountAmount,
  }
}

function calculateSavingsPercentage(totalDiscount: number, total: number): number {
  return total > ZERO_VALUE ? (totalDiscount / total) * 100 : ZERO_VALUE
}

export default function StepThreeDiscounts({
  selections,
  discounts,
  totalDiscount,
  total,
  onUpdateDiscount,
}: StepThreeDiscountsProps): JSX.Element {
  const { t } = useTranslation("pages") as { t: TranslationFunction }

  const itemCalculations = useMemo<ReadonlyArray<ItemDiscountCalculation>>(
    (): ReadonlyArray<ItemDiscountCalculation> => {
      return selections.map((selection: Selection): ItemDiscountCalculation => {
        const discountPercent: number = getDiscountForItem(discounts, selection.item._id)
        return calculateItemDiscount(selection, discountPercent)
      })
    },
    [selections, discounts]
  )

  const hasSelections = useMemo<boolean>(
    (): boolean => selections.length > ZERO_VALUE,
    [selections.length]
  )

  const savingsPercentage = useMemo<number>(
    (): number => calculateSavingsPercentage(totalDiscount, total),
    [totalDiscount, total]
  )

  const formattedTotalDiscount = useMemo<string>(
    (): string => formatCurrency(totalDiscount),
    [totalDiscount]
  )

  const formattedSavingsPercentage = useMemo<string>(
    (): string => formatPercentage(savingsPercentage),
    [savingsPercentage]
  )

  const handleIncreaseDiscount = useCallback(
    (itemId: string): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        void onUpdateDiscount(itemId, DISCOUNT_INCREMENT)
      }
    },
    [onUpdateDiscount]
  )

  const handleDecreaseDiscount = useCallback(
    (itemId: string): (event: ButtonClickEvent) => void => {
      return (event: ButtonClickEvent): void => {
        event.preventDefault()
        void onUpdateDiscount(itemId, DISCOUNT_DECREMENT)
      }
    },
    [onUpdateDiscount]
  )

  const renderEmptyState = (): JSX.Element => (
    <div className="text-center py-12 text-slate-600 bg-slate-50 rounded-lg">
      No items selected
    </div>
  )

  const renderItemHeader = (calculation: ItemDiscountCalculation): JSX.Element => {
    const formattedSubtotal: string = formatCurrency(calculation.subtotal)

    return (
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold text-slate-900 text-base">
            {calculation.title}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            Quantity: {calculation.quantity}
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-900 font-bold text-lg">
            {CURRENCY_SYMBOL}{formattedSubtotal}
          </div>
          <div className="text-xs text-slate-500">Price</div>
        </div>
      </div>
    )
  }

  const renderDiscountControls = (calculation: ItemDiscountCalculation): JSX.Element => (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        variant="outline"
        className="h-9 px-3 text-slate-700 bg-white border-slate-300 hover:bg-slate-100 transition-all duration-200"
        onClick={handleDecreaseDiscount(calculation.itemId)}
        disabled={calculation.discountPercent <= DEFAULT_DISCOUNT}
        aria-label={`Decrease discount by ${Math.abs(DISCOUNT_DECREMENT)}%`}
      >
        <Minus className="w-4 h-4 mr-1" />
        {Math.abs(DISCOUNT_DECREMENT)}{PERCENT_SYMBOL}
      </Button>
      <span className="min-w-14 text-center font-bold text-slate-900 text-lg">
        {calculation.discountPercent}{PERCENT_SYMBOL}
      </span>
      <Button
        size="sm"
        className="h-9 px-3 bg-teal-600 hover:bg-teal-700 transition-all duration-200"
        onClick={handleIncreaseDiscount(calculation.itemId)}
        disabled={calculation.discountPercent >= 100}
        aria-label={`Increase discount by ${DISCOUNT_INCREMENT}%`}
      >
        <Plus className="w-4 h-4 mr-1" />
        {DISCOUNT_INCREMENT}{PERCENT_SYMBOL}
      </Button>
    </div>
  )

  const renderDiscountAmount = (calculation: ItemDiscountCalculation): JSX.Element => {
    const formattedDiscountAmount: string = formatCurrency(calculation.discountAmount)

    return (
      <div className="text-right">
        <div className="text-teal-600 font-bold text-base">
          -{CURRENCY_SYMBOL}{formattedDiscountAmount}
        </div>
        <div className="text-xs text-slate-500">Discount</div>
      </div>
    )
  }

  const renderItemFooter = (calculation: ItemDiscountCalculation): JSX.Element => (
    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
      {renderDiscountControls(calculation)}
      {renderDiscountAmount(calculation)}
    </div>
  )

  const renderSelectionItem = (calculation: ItemDiscountCalculation): JSX.Element => (
    <div
      key={calculation.itemId}
      className="rounded-lg border border-slate-200 p-5 bg-white hover:shadow-md transition-all duration-200"
    >
      {renderItemHeader(calculation)}
      {renderItemFooter(calculation)}
    </div>
  )

  const renderSelectionsList = (): JSX.Element => (
    <div className="space-y-4">
      {itemCalculations.map((calculation: ItemDiscountCalculation): JSX.Element =>
        renderSelectionItem(calculation)
      )}
    </div>
  )

  const renderTotalDiscountCard = (): JSX.Element => (
    <div className="rounded-lg border border-teal-200 bg-teal-50 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900 text-sm">
            Total Discount Available
          </div>
          <div className="text-3xl font-bold text-teal-600 mt-2">
            {CURRENCY_SYMBOL}{formattedTotalDiscount}
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-600 text-sm font-medium">
            Savings on Order
          </div>
          <div className="text-2xl font-bold text-teal-600 mt-1">
            {formattedSavingsPercentage}{PERCENT_SYMBOL}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="w-6 h-6 text-teal-600" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-slate-900">Apply Discounts</h2>
      </div>

      {hasSelections ? renderSelectionsList() : renderEmptyState()}

      {renderTotalDiscountCard()}
    </div>
  )
}

export type {
  StepThreeDiscountsProps,
  Selection,
  CatalogItem,
  DiscountMap,
  ItemDiscountCalculation,
}
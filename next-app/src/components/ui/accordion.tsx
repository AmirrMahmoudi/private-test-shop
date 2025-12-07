"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string[]
  onValueChange: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  type?: "single" | "multiple"
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  children: React.ReactNode
  className?: string
}

function Accordion({ type = "multiple", defaultValue = [], value, onValueChange, children, className }: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (itemValue: string) => {
    const newValue = type === "single"
      ? currentValue.includes(itemValue) ? [] : [itemValue]
      : currentValue.includes(itemValue)
        ? currentValue.filter(v => v !== itemValue)
        : [...currentValue, itemValue]

    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("space-y-1", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

function AccordionItem({ value, children, className }: AccordionItemProps) {
  return <div className={cn("border-b last:border-b-0", className)}>{children}</div>
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionTrigger must be used within Accordion")

  const itemValue = React.useMemo(() => {
    const child = React.Children.toArray(children)[0]
    if (React.isValidElement(child) && (child.props as Record<string, unknown>).value) {
      return (child.props as Record<string, unknown>).value as string
    }
    return ""
  }, [children])

  const isOpen = context.value.includes(itemValue)

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(itemValue)}
      className={cn(
        "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDownIcon className={cn(
        "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
        isOpen && "rotate-180"
      )} />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionContent must be used within Accordion")

  const itemValue = React.useMemo(() => {
    const parent = React.Children.toArray(children)[0]
    if (React.isValidElement(parent) && (parent.props as Record<string, unknown>).value) {
      return (parent.props as Record<string, unknown>).value as string
    }
    return ""
  }, [children])

  const isOpen = context.value.includes(itemValue)

  if (!isOpen) return null

  return (
    <div className={cn("overflow-hidden text-sm", className)}>
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

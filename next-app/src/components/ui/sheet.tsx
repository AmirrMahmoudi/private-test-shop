"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

function SheetTrigger({ children, className, asChild }: SheetTriggerProps) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within Sheet")

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => context.setOpen(true),
      className: cn(className, (children.props as Record<string, unknown>).className as string | undefined)
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      type="button"
      onClick={() => context.setOpen(true)}
      className={className}
    >
      {children}
    </button>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
  side?: "left" | "right" | "top" | "bottom"
}

import { createPortal } from "react-dom"

function SheetContent({ children, className, side = "right" }: SheetContentProps) {
  const context = React.useContext(SheetContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!context) throw new Error("SheetContent must be used within Sheet")

  React.useEffect(() => {
    if (context.open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [context.open])

  if (!mounted || !context.open) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          "fixed z-[100] h-full w-3/4 border-l bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out",
          side === "right" && "right-0 top-0 animate-in slide-in-from-right",
          side === "left" && "left-0 top-0 animate-in slide-in-from-left",
          className
        )}
      >
        <button
          type="button"
          onClick={() => context.setOpen(false)}
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>,
    document.body
  )
}

function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
}

function SheetClose({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetClose must be used within Sheet")

  return (
    <button
      type="button"
      onClick={() => context.setOpen(false)}
      className={className}
    >
      {children}
    </button>
  )
}

export { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose }

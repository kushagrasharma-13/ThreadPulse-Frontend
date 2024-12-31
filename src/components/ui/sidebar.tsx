"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "4rem"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    collapsible?: "icon" | "none"
  }
>(({ collapsible = "none", className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-collapsible={collapsible}
      className={cn(
        "group/sidebar relative flex h-full flex-col overflow-hidden bg-background data-[collapsible=icon]:w-[--sidebar-width-icon] md:data-[collapsible=icon]:w-[--sidebar-width]",
        className
      )}
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center px-4 group-data-[collapsible=icon]/sidebar:justify-center", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 group-data-[collapsible=icon]/sidebar:justify-center", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarTrigger = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("h-7 w-7", className)}
    {...props}
  >
    <PanelLeft className="h-4 w-4" />
    <span className="sr-only">Toggle Sidebar</span>
  </Button>
))
SidebarTrigger.displayName = "SidebarTrigger"

const sidebarMenuItemVariants = cva(
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        active: "bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & VariantProps<typeof sidebarMenuItemVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(sidebarMenuItemVariants({ variant }), "group-data-[collapsible=icon]/group-data-[collapsible=icon]/sidebar:px-0", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, SidebarMenuItem, SidebarMenu }


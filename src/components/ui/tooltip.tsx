import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"



const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>


export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  isLoading?: boolean
  disabled?: boolean
  id?: string
  className?: string
  maxDisplayed?: number
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione…",
  searchPlaceholder = "Buscar…",
  emptyText = "Nenhum item encontrado.",
  isLoading = false,
  disabled = false,
  id,
  className,
  maxDisplayed = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selected = React.useMemo(() => new Set(value), [value])

  const labelByValue = React.useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options],
  )

  const toggle = (optionValue: string) => {
    const next = new Set(selected)
    if (next.has(optionValue)) {
      next.delete(optionValue)
    } else {
      next.add(optionValue)
    }
    onChange([...next])
  }

  const hiddenCount = Math.max(value.length - maxDisplayed, 0)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-xl border border-input bg-background/40 px-3 py-1.5 text-left text-sm shadow-sm backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {value.length === 0 ? (
              <span className="text-muted-foreground/80">{placeholder}</span>
            ) : (
              <>
                {value.slice(0, maxDisplayed).map((item) => (
                  <Badge key={item} className="max-w-[10rem] truncate">
                    {labelByValue.get(item) ?? item}
                  </Badge>
                ))}
                {hiddenCount > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    +{hiddenCount}
                  </span>
                ) : null}
              </>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] max-w-[28rem] p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="size-4 text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      data-checked={selected.has(option.value) ? "true" : undefined}
                      onSelect={() => toggle(option.value)}
                    >
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

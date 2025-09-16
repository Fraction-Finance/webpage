import React, { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { countries } from '@/data/countries';

export function CountryComboBox({ value, onChange, placeholder = "Selecciona un país..." }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? countries.find((country) => country.value.toLowerCase() === value.toLowerCase())?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Busca un país..." />
          <CommandEmpty>No se encontró el país.</CommandEmpty>
          <CommandGroup>
            <CommandList>
                {countries.map((country) => (
                <CommandItem
                    key={country.value}
                    value={country.label}
                    onSelect={(currentValue) => {
                        const selectedCountry = countries.find(c => c.label.toLowerCase() === currentValue.toLowerCase());
                        onChange(selectedCountry ? selectedCountry.value : "");
                        setOpen(false);
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === country.value ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {country.label}
                </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
));
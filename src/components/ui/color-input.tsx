"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorInput = ({ label, value, onChange }: ColorInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border border-input flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: value }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <HexColorPicker color={value} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <Input
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28"
        />
      </div>
    </div>
  );
};

export default ColorInput;

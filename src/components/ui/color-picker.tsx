import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { X } from "lucide-react";
import { Button } from "./button";
import { Label } from "./label";

type Props = {
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
};

const ColorPicker = ({ backgroundColor, setBackgroundColor }: Props) => {
  const [color, setColor] = useState(backgroundColor);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBackgroundColor(color);
  }, [color]);

  // Handle closing the color picker when clicking outside

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);

  return (
    <div className="relative" ref={pickerRef}>
      <div className="flex items-center justify-between">
        <Button
          className="border-2 h-6 w-10 border-border"
          id="color-picker"
          style={{ backgroundColor: color }}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        ></Button>
        <Label htmlFor="color-picker" className="cursor-pointer">
          BG
        </Label>
        <Button
          onClick={() => {
            // setColor("#ffffff");
            setBackgroundColor("transparent");
          }}
          size={"icon"}
          className="h-5 w-5 p-1"
          variant={"ghost"}
        >
          <X />
        </Button>
      </div>
      {isOpen && (
        <div className="absolute p-1 bg-background rounded-sm shadow-sm">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

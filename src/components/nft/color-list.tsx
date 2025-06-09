"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Move } from "lucide-react";
import ColorInput from "@/components/ui/color-input";

interface ColorListProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  maxColors?: number;
}

const ColorList = ({ colors, onChange, maxColors = 6 }: ColorListProps) => {
  const addColor = () => {
    if (colors.length < maxColors) {
      // Add a new color that's different from the last one
      const lastColor = colors[colors.length - 1];
      let newColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");

      // Make sure the generated color is not too similar to the last one
      if (lastColor && lastColor.toLowerCase() === newColor.toLowerCase()) {
        newColor =
          "#" +
          Math.floor(Math.random() * 8388607 + 8388607)
            .toString(16)
            .padStart(6, "0");
      }

      onChange([...colors, newColor]);
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    onChange(newColors);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      onChange(newColors);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Blob Colors</h3>
        {colors.length < maxColors && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addColor}
            className="h-8 px-2"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Color
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Move className="h-4 w-4 text-muted-foreground cursor-move" />
            </div>
            <div className="flex-grow">
              <ColorInput
                label={`Color ${index + 1}`}
                value={color}
                onChange={(color) => updateColor(index, color)}
              />
            </div>
            {colors.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeColor(index)}
                className="flex-shrink-0 h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        {colors.length}/{maxColors} colors used
      </div>
    </div>
  );
};

export default ColorList;

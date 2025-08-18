import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999',
  '#1e40af', '#3b82f6', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6',
  '#6366f1', '#84cc16', '#f97316', '#dc2626'
];

export const ColorPicker = ({ color, onChange, label = "Color" }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <div 
            className="w-4 h-4 rounded border border-border" 
            style={{ backgroundColor: color }}
          />
          {label}: {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Custom Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 rounded border border-border cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Preset Colors</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => {
                    onChange(presetColor);
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
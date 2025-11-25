'use client'

interface ColorSelectorProps {
  colors: string[]
  selectedColor?: string
  onColorSelect?: (color: string) => void
}

const colorMap: Record<string, string> = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#EF4444',
  Blue: '#3B82F6',
  Grey: '#6B7280',
  Green: '#22C55E',
  Orange: '#F97316',
  Pink: '#EC4899',
}

export default function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  return (
    <div className="mb-8">
      <h3 className="font-medium mb-4">
        Select Color: <span className="font-normal text-gray-500">{selectedColor || 'Choose a color'}</span>
      </h3>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => {
          const bgColor = colorMap[color] || '#E5E7EB'
          const isSelected = selectedColor === color
          const isWhite = color === 'White'

          return (
            <button
              key={color}
              onClick={() => onColorSelect?.(color)}
              className={`w-10 h-10 rounded-full transition-all ${
                isSelected ? 'ring-2 ring-offset-2 ring-nike-black' : ''
              } ${isWhite ? 'border border-gray-300' : ''}`}
              style={{ backgroundColor: bgColor }}
              title={color}
              aria-label={`Select ${color}`}
            />
          )
        })}
      </div>
    </div>
  )
}
'use client'

const colorMap: Record<string, string> = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#DC2626',
  Blue: '#2563EB',
  Grey: '#6B7280',
  Green: '#16A34A',
  Orange: '#EA580C',
  Pink: '#EC4899',
}

interface ColorSelectorProps {
  colors: string[]
  selectedColor?: string
  onColorSelect?: (color: string) => void
}

export default function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">
        Select Color: <span className="font-normal text-nike-gray">{selectedColor}</span>
      </h3>
      <div className="flex gap-3">
        {colors.map((color) => {
          const bgColor = colorMap[color] || '#CCCCCC'
          const isSelected = selectedColor === color
          const isWhite = color === 'White'
          
          return (
            <button
              key={color}
              onClick={() => onColorSelect?.(color)}
              className={`w-8 h-8 rounded-full transition-all ${
                isWhite ? 'border border-gray-300' : ''
              } ${
                isSelected ? 'ring-2 ring-offset-2 ring-black' : ''
              }`}
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
'use client'

interface ColorSelectorProps {
  colors: string[]
  selectedColor?: string
  onColorSelect?: (color: string) => void
}

export default function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  return (
    <div>
      <h3 className="font-medium mb-3">Select Color</h3>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect?.(color)}
            className={`px-4 py-2 border rounded hover:border-nike-black transition-colors ${
              selectedColor === color ? 'border-nike-black bg-nike-black text-white' : 'border-gray-300'
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  )
}
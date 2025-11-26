'use client'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize?: string
  onSizeSelect?: (size: string) => void
}

export default function SizeSelector({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) {
  return (
    <div>
      <h3 className="font-medium mb-3">Select Size</h3>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect?.(size)}
            className={`border rounded py-3 hover:border-nike-black transition-colors ${
              selectedSize === size ? 'border-nike-black bg-nike-black text-white' : 'border-gray-300'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
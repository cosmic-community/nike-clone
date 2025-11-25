'use client'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize?: string
  onSizeSelect?: (size: string) => void
}

export default function SizeSelector({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Select Size</h3>
        <button className="text-nike-gray text-sm hover:text-nike-black underline">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect?.(size)}
            className={`border rounded py-3 text-center transition-all ${
              selectedSize === size
                ? 'border-nike-black bg-nike-black text-white'
                : 'border-gray-300 hover:border-nike-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
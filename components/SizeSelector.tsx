'use client'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize?: string
  onSizeSelect?: (size: string) => void
}

export default function SizeSelector({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Select Size</h3>
        <button className="text-nike-gray text-sm hover:text-black underline">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect?.(size)}
            className={`py-3 border rounded-md text-sm font-medium transition-all
              ${selectedSize === size 
                ? 'border-black bg-black text-white' 
                : 'border-gray-300 hover:border-black'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
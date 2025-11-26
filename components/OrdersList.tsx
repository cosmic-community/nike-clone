import { Order } from '@/types'
import Link from 'next/link'

interface OrdersListProps {
  orders: Order[]
}

export default function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
        <Link 
          href="/products" 
          className="inline-block bg-nike-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Order #{order.title.replace('Order ', '')}</h3>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                order.metadata.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.metadata.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.metadata.status}
              </span>
              <p className="text-lg font-bold mt-2">${order.metadata.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Shipping Address:</strong> {order.metadata.shipping_address}
            </p>
            
            <div className="space-y-2">
              {order.metadata.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  {item.product_image && (
                    <img 
                      src={`${item.product_image}?w=100&h=100&fit=crop&auto=format,compress`}
                      alt={item.product_name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-gray-600">
                      Qty: {item.quantity} 
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                    </p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
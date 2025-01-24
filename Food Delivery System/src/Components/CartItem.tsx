import type React from "react"
import { useCart } from "../contexts/CartContext"

interface CartItemProps {
  id: number
  name: string
  price: number
  quantity: number
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity }) => {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">${price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center">
        <button onClick={() => updateQuantity(id, quantity - 1)} className="px-2 py-1 bg-gray-200 rounded-l">
          -
        </button>
        <span className="px-4 py-1 bg-gray-100">{quantity}</span>
        <button onClick={() => updateQuantity(id, quantity + 1)} className="px-2 py-1 bg-gray-200 rounded-r">
          +
        </button>
      </div>
      <div>
        <p className="font-bold">${(price * quantity).toFixed(2)}</p>
        <button onClick={() => removeFromCart(id)} className="text-red-500 hover:text-red-700">
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem


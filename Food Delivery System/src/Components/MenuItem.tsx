import type React from "react"
import { useCart } from "../contexts/CartContext"

interface MenuItemProps {
  id: number
  name: string
  description: string
  price: number
  onEdit: () => void
  onDelete: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({ id, name, description, price, onEdit, onDelete }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{description}</p>
      <p className="text-blue-600 font-bold mt-2">${price.toFixed(2)}</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => addToCart({ id, name, price, quantity: 1 })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add to Cart
        </button>
        <div>
          <button onClick={onEdit} className="text-yellow-500 hover:text-yellow-600 mr-2">
            Edit
          </button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default MenuItem


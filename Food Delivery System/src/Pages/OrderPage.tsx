import type React from "react"
import { useState, useEffect } from "react"
import { useCart } from "../contexts/CartContext"
import CartItem from "../components/CartItem"
import axios from "axios"

const OrderPage: React.FC = () => {
  const { cart, total, clearCart } = useCart()
  const [orderHistory, setOrderHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchOrderHistory()
  }, [])

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get("/api/orders")
      setOrderHistory(response.data)
    } catch (error) {
      console.error("Failed to fetch order history:", error)
    }
  }

  const placeOrder = async () => {
    try {
      const response = await axios.post("/api/orders", { items: cart, total })
      setOrderHistory((prevHistory) => [...prevHistory, response.data])
      clearCart()
      setShowHistory(true)
    } catch (error) {
      console.error("Failed to place order:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Order</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {cart.map((item) => (
              <CartItem key={item.id} {...item} />
            ))}
          </div>
          <div className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</div>
          <button onClick={placeOrder} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Place Order
          </button>
        </>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Order History</h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
        {showHistory && (
          <div className="space-y-4">
            {orderHistory.map((order, index) => (
              <div key={index} className="border p-4 rounded">
                <h4 className="font-bold">Order #{order.id}</h4>
                <p>Total: ${order.total.toFixed(2)}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                <ul className="mt-2">
                  {order.items.map((item: any, itemIndex: number) => (
                    <li key={itemIndex}>
                      {item.name} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPage


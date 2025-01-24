import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
}

interface MenuContextType {
  menuItems: MenuItem[]
  loading: boolean
  error: string | null
  fetchMenuItems: () => Promise<void>
  createMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>
  updateMenuItem: (id: number, item: Partial<MenuItem>) => Promise<void>
  deleteMenuItem: (id: number) => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export const MenuProvider: React.FC = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMenuItems = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/menu-items")
      setMenuItems(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch menu items")
    } finally {
      setLoading(false)
    }
  }

  const createMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      const response = await axios.post("/api/menu-items", item)
      setMenuItems((prevItems) => [...prevItems, response.data])
    } catch (err) {
      setError("Failed to create menu item")
    }
  }

  const updateMenuItem = async (id: number, item: Partial<MenuItem>) => {
    try {
      const response = await axios.put(`/api/menu-items/${id}`, item)
      setMenuItems((prevItems) => prevItems.map((i) => (i.id === id ? { ...i, ...response.data } : i)))
    } catch (err) {
      setError("Failed to update menu item")
    }
  }

  const deleteMenuItem = async (id: number) => {
    try {
      await axios.delete(`/api/menu-items/${id}`)
      setMenuItems((prevItems) => prevItems.filter((i) => i.id !== id))
    } catch (err) {
      setError("Failed to delete menu item")
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
        fetchMenuItems,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}


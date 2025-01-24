import type React from "react"
import { useState, useEffect } from "react"
import { useMenu } from "../contexts/MenuContext"
import MenuItem from "../components/MenuItem"

const MenuPage: React.FC = () => {
  const { menuItems, loading, error, createMenuItem, updateMenuItem, deleteMenuItem, fetchMenuItems } = useMenu()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [editingItem, setEditingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0 })
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const filteredAndSortedItems = menuItems
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "price") return a.price - b.price
      return 0
    })

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage)
  const paginatedItems = filteredAndSortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const validateForm = (item: { name: string; description: string; price: number }) => {
    if (!item.name.trim()) {
      setFormError("Name is required")
      return false
    }
    if (!item.description.trim()) {
      setFormError("Description is required")
      return false
    }
    if (item.price <= 0) {
      setFormError("Price must be greater than 0")
      return false
    }
    return true
  }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!validateForm(newItem)) return

    setIsSubmitting(true)
    try {
      await createMenuItem(newItem)
      setNewItem({ name: "", description: "", price: 0 })
    } catch (err) {
      setFormError("Failed to create menu item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (editingItem && validateForm(editingItem)) {
      setIsSubmitting(true)
      try {
        await updateMenuItem(editingItem.id, editingItem)
        setEditingItem(null)
      } catch (err) {
        setFormError("Failed to update menu item. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(id)
      } catch (err) {
        console.error("Failed to delete menu item:", err)
        alert("Failed to delete menu item. Please try again.")
      }
    }
  }

  if (loading) return <div className="text-center py-4">Loading...</div>
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-auto"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-auto"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedItems.map((item) => (
          <MenuItem
            key={item.id}
            {...item}
            onEdit={() => setEditingItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</h3>
        {formError && (
          <p className="text-red-500 mb-4" role="alert">
            {formError}
          </p>
        )}
        <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={editingItem ? editingItem.name : newItem.name}
              onChange={(e) =>
                editingItem
                  ? setEditingItem({ ...editingItem, name: e.target.value })
                  : setNewItem({ ...newItem, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={editingItem ? editingItem.description : newItem.description}
              onChange={(e) =>
                editingItem
                  ? setEditingItem({ ...editingItem, description: e.target.value })
                  : setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={editingItem ? editingItem.price : newItem.price}
              onChange={(e) => {
                const value = Number.parseFloat(e.target.value)
                editingItem
                  ? setEditingItem({ ...editingItem, price: value })
                  : setNewItem({ ...newItem, price: value })
              }}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : editingItem ? "Update Item" : "Add Item"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default MenuPage


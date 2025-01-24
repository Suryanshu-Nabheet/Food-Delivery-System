import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"

interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "completed"
  createdAt: string
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [sortBy, setSortBy] = useState<"title" | "createdAt" | "status">("createdAt")
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks")
      setTasks(response.data)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/tasks", newTask)
      setTasks([...tasks, response.data])
      setNewTask({ title: "", description: "" })
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      try {
        const response = await axios.put(`/api/tasks/${editingTask.id}`, editingTask)
        setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)))
        setEditingTask(null)
      } catch (error) {
        console.error("Failed to update task:", error)
      }
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((task) => (filterStatus === "all" ? true : task.status === filterStatus))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "status") return a.status.localeCompare(b.status)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "pending" | "completed")}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "title" | "createdAt" | "status")}
          className="px-3 py-2 border rounded"
        >
          <option value="title">Sort by Title</option>
          <option value="createdAt">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>
      <div className="space-y-4">
        {currentTasks.map((task) => (
          <div key={task.id} className="border p-4 rounded">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            <div className="mt-2">
              <button onClick={() => setEditingTask(task)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                Edit
              </button>
              <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">{editingTask ? "Edit Task" : "Add New Task"}</h3>
        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={editingTask ? editingTask.title : newTask.title}
              onChange={(e) =>
                editingTask
                  ? setEditingTask({ ...editingTask, title: e.target.value })
                  : setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={editingTask ? editingTask.description : newTask.description}
              onChange={(e) =>
                editingTask
                  ? setEditingTask({ ...editingTask, description: e.target.value })
                  : setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          {editingTask && (
            <div>
              <label htmlFor="status" className="block mb-1">
                Status
              </label>
              <select
                id="status"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as "pending" | "completed" })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingTask ? "Update Task" : "Add Task"}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default TaskPage


import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Restaurant App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/menu" className="hover:text-blue-200">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/order" className="hover:text-blue-200">
                Order
              </Link>
            </li>
            <li>
              <Link to="/tasks" className="hover:text-blue-200">
                Tasks
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button onClick={logout} className="hover:text-blue-200">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header


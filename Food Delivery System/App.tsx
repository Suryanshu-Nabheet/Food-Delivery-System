import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import { MenuProvider } from "./contexts/MenuContext"
import PrivateRoute from "./components/PrivateRoute"
import Header from "./components/Header"
import LoginPage from "./pages/LoginPage"
import MenuPage from "./pages/MenuPage"
import OrderPage from "./pages/OrderPage"
import TaskPage from "./pages/TaskPage"

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Switch>
                  <Route exact path="/login" component={LoginPage} />
                  <PrivateRoute exact path="/menu" component={MenuPage} />
                  <PrivateRoute exact path="/order" component={OrderPage} />
                  <PrivateRoute exact path="/tasks" component={TaskPage} />
                  <Redirect from="/" to="/menu" />
                </Switch>
              </main>
            </div>
          </Router>
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  )
}

export default App


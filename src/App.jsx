import { Routes, Route } from "react-router-dom";
import './App.css'
import { HomePage } from './pages/HomePage'
import { About } from './pages/About'
import { RootLayout } from "./components/RootLayout";
import { Login } from "./components/sections/Login";
import { WalletProvider } from './context/WalletContext'
import { AuthContextProvider } from './context/supabaseAuthContext'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <WalletProvider>
      <AuthContextProvider>
        <Routes>
          <Route element={<RootLayout />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthContextProvider>
    </WalletProvider>
  )
}

export default App

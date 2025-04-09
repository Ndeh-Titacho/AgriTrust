import { Routes, Route } from "react-router-dom";
import './App.css'
import { HomePage } from './pages/HomePage'
import { About } from './pages/About'
import { RootLayout } from "./components/RootLayout";
import { Login } from "./components/sections/Login";
import { WalletProvider } from './context/WalletContext'
import { Dashboard } from './pages/Dashboard'
import { AuthContextProvider } from './context/supabaseAuthContext'
import { FullTabs } from './components/ui/FullTabs'
import { AuthPage } from './pages/AuthPage'
import { FarmerDashboard } from './pages/dashboards/FarmerDashboard'
import { ConsumerDashboard } from './pages/dashboards/ConsumerDashboard'
import { VerifierDashboard } from './pages/dashboards/VerifierDashboard'
import { FinancialDashboard } from './pages/dashboards/FinancialDashboard'

function App() {
  return (
    <AuthContextProvider>
      <WalletProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            
            {/* Role-specific dashboard routes */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
            <Route path="/verifier/dashboard" element={<VerifierDashboard />} />
            <Route path="/financial/dashboard" element={<FinancialDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </WalletProvider>
    </AuthContextProvider>
  )
}

export default App

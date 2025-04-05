
import { Routes, Route } from "react-router-dom";
import './App.css'
import { HomePage } from './pages/HomePage'
import { About } from './pages/About'
import { RootLayout } from "./components/RootLayout";
import { Login } from "./components/sections/Login";

function App() {
  

  return (
    <Routes>
      <Route element={<RootLayout />} >
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  
    
   
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './features/dashboard/DashBoard';
import CreateNote from './features/Notes/CreateNote';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<DashBoard />} />
        <Route path="/notes/create" element={<CreateNote />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import Home from "./pages/Home"
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Competitions } from "./pages/Competitions"
import { CompetitionPage } from "./pages/CompetitionPage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="competitions/:compid" element={<CompetitionPage />} />
        <Route path="competitions" element={<Competitions />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App

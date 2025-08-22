import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewCar from "./pages/NewCar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-car" element={<NewCar />} />
      </Routes>
    </BrowserRouter>
  );
}

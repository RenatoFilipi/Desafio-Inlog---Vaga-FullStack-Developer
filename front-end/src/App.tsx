import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewCar from "./pages/NewCar";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="test-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-car" element={<NewCar />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

import "./App.css";
import LogoBar from "./components/LogoBar";
import NavBar from "./components/NavBar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Clients from "./pages/Clients/Clients";
import Bills from "./pages/Bills/Bills";
import Prototypes from "./pages/Prototypes";
import Products from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <LogoBar />
        <NavBar />
        <Routes>
        <Route path="/clients" exact element={<Clients/>} />
        <Route path="/bills" exact element={<Bills/>} />
        <Route path="/prototypes" exact element={<Prototypes/>} />
        <Route path="/products" exact element={<Products/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

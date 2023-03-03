import "./App.css";
import LogoBar from "./components/LogoBar";
import NavBar from "./components/NavBar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Clients from "./pages/Clients/Clients";
import Bills from "./pages/Bills/Bills";
import Prototypes from "./pages/Prototypes/Prototypes";
import Products from "./pages/Products/Products";
import Footer from "./components/Footer";
import Login from "./pages/Login/Login";
import { useEffect } from "react";
import { fetchClientsData } from "./components/services/clientDataService";
import { fetchBillsData } from "./components/services/billDataService";
import { fetchPrototypesData } from "./components/services/prototypeDataService";
import Register from "./pages/Resgister/Register";
import AuthService from "./components/services/authService";

function App() {
  useEffect(() => {
    const fetchData = async () => {

      const clients = await fetchClientsData();
      const bills = await fetchBillsData();
      const prototypes = await fetchPrototypesData();
      localStorage.setItem("clients", JSON.stringify(clients));
      localStorage.setItem("bills", JSON.stringify(bills));
      localStorage.setItem("prototypes", JSON.stringify(prototypes));
    }
    fetchData();
  }, []);

  const isAuth = AuthService.authHeader()["x-access-token"];

  return (
    <BrowserRouter>
      <div className="App">
        <LogoBar />
        <NavBar />
        <Routes>
          {isAuth ? (
            <Route>
              <Route path="/clients" exact element={<Clients />} />
              <Route path="/bills" exact element={<Bills />} />
              <Route path="/prototypes" exact element={<Prototypes />} />
              <Route path="/products" exact element={<Products />} />
            </Route>
          ) : (
            <Route>
              <Route path="/" exact element={<Login />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/register" exact element={<Register />} />
            </Route>
          )}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import CatalogLayout from "./components/CatalogLayout/CatalogLayout";
import AboutPage from "./pages/AboutPage/AboutPage";
import CartPage from "./pages/CartPage/CartPage";
import CatalogPage from "./pages/CatalogPage/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import ContactsPage from "./pages/ContactsPage/ContactsPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import OrderSuccessPage from "./pages/OrderSuccessPage/OrderSuccessPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import SalesPage from "./pages/SalesPage/SalesPage";

function App() {
  return (
    <CatalogLayout>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/catalog" element={<Navigate to="/" replace />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<OrderSuccessPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CatalogLayout>
  );
}

export default App;

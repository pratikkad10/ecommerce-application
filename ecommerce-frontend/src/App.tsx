import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TopNavBar } from './components/layout/TopNavBar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { VerifyEmailToken } from './pages/Auth/VerifyEmailToken';
import { EmailVerified } from './pages/Auth/EmailVerified';
import { OAuthCallback } from './pages/Auth/OAuthCallback';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ResetPassword } from './pages/Auth/ResetPassword';
import { NotFound } from './pages/NotFound/NotFound';
import { ShopAll } from './pages/Shop/ShopAll';
import { ProductDetails } from './pages/Shop/ProductDetails';
import { CategoryDetails } from './pages/Category/CategoryDetails';
import { SearchResults } from './pages/Shop/SearchResults';
import { NewArrivals } from './pages/Shop/NewArrivals';
import { BestSellers } from './pages/Shop/BestSellers';
import { Sale } from './pages/Shop/Sale';
import { Wishlist } from './pages/Shop/Wishlist';
import { Cart } from './pages/Cart/Cart';
import { Checkout } from './pages/Checkout/Checkout';
import { Orders } from './pages/Orders/Orders';
import { Account } from './pages/Account/Account';
import { Toaster } from './components/ui/toast';
import { WishlistInitializer } from './components/common/WishlistInitializer';

// Admin imports
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminProductForm } from './pages/Admin/AdminProductForm';
import { AdminOrders } from './pages/Admin/AdminOrders';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminCategories } from './pages/Admin/AdminCategories';

import './App.css';

// Layout component to wrap pages that need the TopNavBar and Footer
function MainLayout() {
  return (
    <>
      <TopNavBar />
      <div className="grow flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistInitializer />
          <CartDrawer />
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Transactional Routes (No Nav/Footer) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify-email-token" element={<VerifyEmailToken />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />

              {/* Admin Dashboard Routes (Protected, No Nav/Footer, Own Layout) */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="categories" element={<AdminCategories />} />
              </Route>

              {/* Standard Routes (With Nav/Footer) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopAll />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Account />} />
                <Route path="/category/:slug" element={<CategoryDetails />} />
                <Route path="/product/:id" element={<ProductDetails />} />
              </Route>
              
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" richColors closeButton />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;



import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TopNavBar } from './components/layout/TopNavBar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { VerifyEmailToken } from './pages/Auth/VerifyEmailToken';
import { EmailVerified } from './pages/Auth/EmailVerified';
import { OAuthCallback } from './pages/Auth/OAuthCallback';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { NotFound } from './pages/NotFound/NotFound';
import { ShopAll } from './pages/Shop/ShopAll';
import { ProductDetails } from './pages/Shop/ProductDetails';
import { CategoryDetails } from './pages/Category/CategoryDetails';
import { SearchResults } from './pages/Shop/SearchResults';
import { NewArrivals } from './pages/Shop/NewArrivals';
import { BestSellers } from './pages/Shop/BestSellers';
import { Sale } from './pages/Shop/Sale';
import { Wishlist } from './pages/Shop/Wishlist';
import { Toaster } from './components/ui/toast';
import { WishlistInitializer } from './components/common/WishlistInitializer';
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
        <WishlistInitializer />
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Transactional Routes (No Nav/Footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-token" element={<VerifyEmailToken />} />
            <Route path="/email-verified" element={<EmailVerified />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* Standard Routes (With Nav/Footer) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopAll />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/best-sellers" element={<BestSellers />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/category/:slug" element={<CategoryDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Route>
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" richColors closeButton />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from './components/Navbar'
import ProductList from './components/Products/ProductList'
import ProductDetail from './components/Products/ProductDetail'
import Cart from './components/Products/Cart'
import Checkout from './components/Products/Checkout'
import HomePage from './components/HomePage'
import TrainerAuthWrapper from './components/Authentication/TrainerAuthentication';
import AuthWrapper from './components/Authentication/UserAuthentication';
import ResetPassword from './components/Authentication/ResetPassword';
import Register from './components/Authentication/Register'
import Blogs from './components/Blog/Blogs'
import UserProfile from "./components/UserProfile";
import TrainerProfile from './components/TrainerProfile'
import About from './components/About';
import ProgramsList from './components/ProgramsList';
import ProgramOne from './components/ProgramOne';
import OurPrograms from './components/OurPrograms';
import ContactUs from './components/ContactUs'
import AddPost from './components/Blog/AddPost'
import Detail from "./components/Blog/Detail";
import SubscriptionForm from "./components/PlansCheckout"
import BookmarkComponent from './components/Blog/BookmarkComponent'; // Import BookmarkComponent

function App() {
  const location = useLocation(); // Get the current route
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId'); // Get userId from localStorage (ensure it is stored during login)
  
  // Define paths where you don't want to show the Navbar and Footer
  const hideNavbarFooter = ["/login", "/login-trainer", "/reset-password", "/register"];
  
  return (
    <>
      {!hideNavbarFooter.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/login" element={<AuthWrapper />} />
        <Route path="/login-trainer" element={<TrainerAuthWrapper />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/product/:category_slug/:product_slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<OurPrograms/>}/>
        <Route path="/programslist" element={<ProgramsList/>}/>        
        <Route path="/program/:id" element={<ProgramOne />} />
        <Route path="/subscribe/:id" element={<SubscriptionForm />} />

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/userProfile" element={role === 'trainer' ? <TrainerProfile /> : <UserProfile />} />  
        <Route path="/AddPost" element={<AddPost />} />
        <Route path="/Detail/:sulg/" element={<Detail />} />
        <Route path="/bookmarks" element={<BookmarkComponent userId={userId} />} /> {/* Add route for Bookmarks */}
      </Routes>
      
      {!hideNavbarFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}


// export default App;
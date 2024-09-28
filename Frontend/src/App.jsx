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



// function App() {

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<AuthWrapper />}></Route>
//         <Route path="/login-trainer" element={<TrainerAuthWrapper />}></Route>
//       </Routes>
//       <Navbar />
//       <Routes>
//         {/* <Route path="/login" element={<Authintication />} />
//         <Route path="/details" element={<OurPrograms/>}/>
//         <Route path="/programslist" element={<ProgramsList/>}/>        
//         <Route path="/program/:id" element={<ProgramOne />} />
//         <Route path="/Blogs" element={<Blogs />} />
//         <Route path="/ProductList" element={<ProductList />} />
//         <Route path="/ProductDetail" element={<ProductDetail />} /> */}

//         <Route path="/ProductList" element={<ProductList />} />
//         <Route path="/product/:name" element={<ProductDetail />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/Checkout" element={<Checkout />} />
//         <Route path="/Home" element={<HomePage />} />


//         {/* Add more routes as needed */}
//       </Routes>
//       <Footer />
//     </Router>
//   )
// }

function App() {
  const location = useLocation(); // Get the current route

  // Define paths where you don't want to show the Navbar and Footer
  const hideNavbarFooter = ["/login", "/login-trainer"];

  return (
    <>
      {!hideNavbarFooter.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/login" element={<AuthWrapper />} />
        <Route path="/login-trainer" element={<TrainerAuthWrapper />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/product/:name" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Home" element={<HomePage />} />
        {/* Add more routes as needed */}
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

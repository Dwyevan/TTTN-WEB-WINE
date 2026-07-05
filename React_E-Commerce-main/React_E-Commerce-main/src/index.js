import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Thêm Navigate
import { Provider } from "react-redux";
import store from "./redux/store";
import API_BASE_URL from './config';

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  AdminOrders,
  AddProduct,
  AdminDashboard,
  AdminProductList,
  EditProduct,
  Profile,
  AdminOrderDetail,
  AdminFeedbackList,
  AdminCouponList,
  WineAIChat,
  PaymentResult,
  AdminInventory,
  Wishlist,
  AdminUserList,
  AdminSettings,
  AdminCategory
} from "./pages";

import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { AdminLayout } from './components';

// Axios Interceptor for JWT
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// --- PHẦN CẢI THIỆN: COMPONENT PHÂN QUYỀN ---

// Bảo vệ cho Admin: Chỉ ADMIN mới vào được
const AdminProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "ADMIN") {
    // Nếu không phải admin, đá về trang Home hoặc Login
    return <Navigate to="/" replace />;
  }
  return children;
};

// Bảo vệ cho User đã đăng nhập: Phải đăng nhập mới vào được (Profile, Checkout)
const UserProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppProvider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/wines`);
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            {/* PUBLIC ROUTES - Ai cũng xem được */}
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES FOR USER - Chỉ người dùng đã đăng nhập */}
            <Route path="/checkout" element={<UserProtectedRoute><Checkout /></UserProtectedRoute>} />
            <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
            <Route path="/payment/result" element={<PaymentResult />} />
            <Route path="/wine-ai-chat" element={<WineAIChat products={products} />} />

            {/* ADMIN ROUTES - CHỈ ADMIN MỚI ĐƯỢC VÀO */}
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserList />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="feedbacks" element={<AdminFeedbackList />} />
              <Route path="coupons" element={<AdminCouponList />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="categories" element={<AdminCategory />} />
            </Route>

            {/* 404 ROUTES */}
            <Route path="*" element={<PageNotFound />} />
            <Route path="/product/*" element={<PageNotFound />} />
          </Routes>

          <WineAIChat products={products} />

        </ScrollToTop>
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppProvider />);
// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom/client";
// import axios from "axios";
// import "../node_modules/font-awesome/css/font-awesome.min.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./redux/store";

// import {
//   Home,
//   Product,
//   Products,
//   AboutPage,
//   ContactPage,
//   Cart,
//   Login,
//   Register,
//   Checkout,
//   PageNotFound,
//   AdminOrders,
//   AddProduct,
//   AdminDashboard,
//   AdminProductList,
//   EditProduct,
//   Profile,
//   AdminOrderDetail,
//   AdminFeedbackList,
//   AdminCouponList,
//   WineAIChat,
// } from "./pages";

// import ScrollToTop from "./components/ScrollToTop";
// import { Toaster } from "react-hot-toast";
// import { AdminLayout } from './components';

// const AppProvider = () => {
//   const [products, setProducts] = useState([]);

// // TRONG index.js
// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       // Đảm bảo đường dẫn là /api/wines thay vì /api/products
//       const res = await axios.get(`${API_BASE_URL}/api/wines`);
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Lỗi lấy dữ liệu:", err);
//     }
//   };
//   fetchProducts();
// }, []);
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <ScrollToTop>
//           <Routes>
//             {/* PUBLIC ROUTES */}
//             <Route path="/" element={<Home />} />
//             <Route path="/product" element={<Products />} />
//             <Route path="/product/:id" element={<Product />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/contact" element={<ContactPage />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/profile" element={<Profile />} />
//             {/* PAGE AI CHAT (TOÀN MÀN HÌNH) */}
//             <Route path="/wine-ai-chat" element={<WineAIChat products={products} />} />

//             {/* ADMIN ROUTES */}
//             <Route path="/admin" element={<AdminLayout />}>
//               <Route index element={<AdminDashboard />} />
//               <Route path="orders" element={<AdminOrders />} />
//               <Route path="add-product" element={<AddProduct />} />
//               <Route path="products" element={<AdminProductList />} />
//               <Route path="edit-product/:id" element={<EditProduct />} />
//               <Route path="orders/:id" element={<AdminOrderDetail />} />
//               <Route path="feedbacks" element={<AdminFeedbackList />} />
//               <Route path="coupons" element={<AdminCouponList />} />
//             </Route>

//             {/* 404 ROUTES */}
//             <Route path="*" element={<PageNotFound />} />
//             <Route path="/product/*" element={<PageNotFound />} />
//           </Routes>

//           {/* FLOATING AI CHATBOX (LUÔN XUẤT HIỆN Ở GÓC MÀN HÌNH) */}
//           {/* Bỏ điều kiện length > 0 để nút chat không bị mất khi DB trống */}
//           <WineAIChat products={products} />

//         </ScrollToTop>
//         <Toaster position="top-center" reverseOrder={false} />
//       </BrowserRouter>
//     </Provider>
//   );
// };

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<AppProvider />);
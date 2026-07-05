// Cấu hình URL API Backend
// - Khi chạy local (npm start): dùng http://localhost:8080
// - Khi deploy lên Vercel: đặt biến REACT_APP_API_URL trên Vercel Dashboard
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default API_BASE_URL;

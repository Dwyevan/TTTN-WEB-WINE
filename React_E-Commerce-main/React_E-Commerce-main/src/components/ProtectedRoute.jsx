import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdminPage = false }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Nếu chưa đăng nhập -> cho về trang Login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Nếu trang yêu cầu quyền ADMIN mà user là CUSTOMER -> cho về Home
    if (isAdminPage && user.role !== "ADMIN") {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
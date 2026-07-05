// Lấy key dựa vào user
const getCartKey = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return `cart_${user.username || user.email}`;
    }
  } catch (error) {}
  return "cart_guest";
};

// Lấy dữ liệu từ localStorage an toàn
const getInitialCart = () => {
  try {
    const key = getCartKey();
    const storedCart = localStorage.getItem(key);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    return [];
  }
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;
  const cartKey = getCartKey(); // Luôn lấy key hiện tại trước khi lưu

  switch (action.type) {
    case "ADDITEM":
      // Đảm bảo id tồn tại
      if (!product || !product.id) return state;

      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // Ép kiểu price về số để tránh NaN khi tính toán ở Component
        updatedCart = [...state, { ...product, qty: 1, price: Number(product.price) }];
      }
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      if (!product || !product.id) return state;

      const exist2 = state.find((x) => x.id === product.id);
      
      // Kiểm tra an toàn trước khi xử lý
      if (!exist2) return state;

      if (exist2.qty <= 1) {
        // Nếu bằng 1 hoặc nhỏ hơn thì xóa luôn khỏi giỏ
        updatedCart = state.filter((x) => x.id !== exist2.id);
      } else {
        // Giảm số lượng
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      return updatedCart;

    case "EMPTY_CART":
    case "CLEAR_CART":
      localStorage.removeItem(cartKey);
      return [];

    case "SYNC_CART": // Gọi khi login / logout để tải lại giỏ hàng
      return getInitialCart();

    default:
      return state;
  }
};

export default handleCart;
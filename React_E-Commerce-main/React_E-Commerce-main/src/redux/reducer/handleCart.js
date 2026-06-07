// Lấy dữ liệu từ localStorage an toàn
const getInitialCart = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    return [];
  }
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

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
      localStorage.setItem("cart", JSON.stringify(updatedCart));
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
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    // Nên thêm case xóa sạch giỏ hàng sau khi đặt hàng thành công
    case "CLEAR_CART":
      localStorage.removeItem("cart");
      return [];

    default:
      return state;
  }
};

export default handleCart;
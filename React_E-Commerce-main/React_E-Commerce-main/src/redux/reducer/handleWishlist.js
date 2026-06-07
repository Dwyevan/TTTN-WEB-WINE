const getInitialWishlist = () => {
    const saved = localStorage.getItem("wine_wishlist");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }
    return [];
};

const handleWishlist = (state = getInitialWishlist(), action) => {
    const product = action.payload;
    let newState;
    
    switch (action.type) {
        case "TOGGLE_WISHLIST":
            const exist = state.find((x) => x.id === product.id);
            if (exist) {
                // Remove if exists
                newState = state.filter((x) => x.id !== product.id);
            } else {
                // Add if not exists
                newState = [...state, product];
            }
            break;
        default:
            return state;
    }

    // Persist to localStorage
    if (newState) {
        localStorage.setItem("wine_wishlist", JSON.stringify(newState));
        return newState;
    }
    return state;
};

export default handleWishlist;

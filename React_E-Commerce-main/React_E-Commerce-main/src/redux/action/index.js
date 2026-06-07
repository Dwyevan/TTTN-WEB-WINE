// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// For Toggle Item in Wishlist
export const toggleWishlist = (product) => {
    return {
        type: "TOGGLE_WISHLIST",
        payload: product
    }
}
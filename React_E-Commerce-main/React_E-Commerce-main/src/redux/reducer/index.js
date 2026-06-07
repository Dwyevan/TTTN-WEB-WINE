import handleCart from './handleCart'
import handleWishlist from './handleWishlist'
import { combineReducers } from "redux";

const rootReducers = combineReducers({
    handleCart,
    handleWishlist,
})
export default rootReducers
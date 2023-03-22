import {createSlice} from "@reduxjs/toolkit";
import {getAllProductsThunk} from "../../redux-thunk/products-thunk/getAllProductsThunk";
import {isError} from "../../../utils/utilStore";
import {isLiked} from "../../../utils/products";
import {changeLikeProductThunk} from "../../redux-thunk/products-thunk/changeLikeProductThunk";
import {SORTED} from "../../../utils/constans";

const initialState = {
    products: [],
    favourites: [],
    total: 0,
    isLoading: false, 
    currentSort: '',
    error: null
}
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        sortedProductsState: (state, action) => {
            switch (action.payload) {
                case SORTED.LOW:
                    state.products = state.products.sort((a, b) => b.price - a.price);
                    state.currentSort = action.payload;
                    break;
                case SORTED.CHEAP:
                    state.products = state.products.sort((a, b) => a.price - b.price);
                    state.currentSort = action.payload;
                    break;
                case SORTED.SALE:
                    state.products = state.products.sort((a, b) => b.discount - a.discount);
                    state.currentSort = action.payload;
                    break;
                default:
                    state.products = state.products.sort((a, b) => b.likes.length - a.likes.length);
                    state.currentSort = SORTED.POPULAR;

            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllProductsThunk.fulfilled, (state, action) => {
            const {total, products, currentUser} = action.payload;

            state.products = products;
            state.favourites = products.filter(item => isLiked(item.likes, currentUser._id));
            state.total = total;
            state.isLoading = false;
        })

        builder.addCase(getAllProductsThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })

        builder.addCase(changeLikeProductThunk.fulfilled, (state, action) => {
            const {product, liked} = action.payload;

            state.products = state.products.map((cardState) => {
                return cardState._id === product._id ? product : cardState;
            })

            if (!liked) {
                state.favourites.push(product);
            } else {
                state.favourites = state.favourites.filter(card => card._id !== product._id);
            }
        })

        builder.addCase(changeLikeProductThunk.pending, state => {
            state.error = null;
            state.isLoading = true;
        })

        builder.addMatcher(isError, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        })
    }
})
export const {sortedProductsState} = productsSlice.actions;

export default productsSlice.reducer;

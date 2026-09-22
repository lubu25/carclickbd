import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    addToCart:
        typeof window !== "undefined" && localStorage.getItem("addToCart")
            ? JSON.parse(localStorage.getItem("addToCart") || "[]")
            : [],
    cartTotalAmount: 0,
    cartTotalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {

            console.log('payload', payload);


            const itemIndex = state.addToCart.findIndex((item: any) => item.id === payload.id);

            console.log("itemIndex", itemIndex);

            if (itemIndex >= 0) {
                state.addToCart[itemIndex].quantity += 1
                console.log("old");

            }
            else {
                const tempProduct = { ...payload, quantity: 1 };
                state.addToCart.push(tempProduct)
                console.log("new");

            }

            console.log("state.addToCart", state.addToCart);



            localStorage.setItem('addToCart', JSON.stringify(state.addToCart))
        },

        getTotal: (state) => {
            const { total, quantity } = state.addToCart.reduce(
                (cartTotal: any, cartItem: any) => {

                    const { quantity, bidPrice } = cartItem;
                    const itemTotal = bidPrice * quantity

                    cartTotal.total += itemTotal;
                    cartTotal.quantity += quantity;
                    return cartTotal;
                },
                {
                    total: 0,
                    quantity: 0,
                }
            );

            state.cartTotalAmount = total;
            state.cartTotalQuantity = quantity;
        },

        decreaseCartQuantity: (state, { payload }) => {

            const cartItemIndex = state.addToCart.findIndex(
                (item: any) => item.id === payload.id
            );
            if (state.addToCart[cartItemIndex].quantity > 1) {
                state.addToCart[cartItemIndex].quantity -= 1;
                // alert

            } else if (state.addToCart[cartItemIndex].quantity === 1) {
                state.addToCart = state.addToCart.filter(
                    (item: any) => item.id !== payload.id
                );


            }
            localStorage.setItem("addToCart", JSON.stringify(state.addToCart));
        },

        // removeFromCart
        removeFromCart: (state, { payload }) => {
            state.addToCart = state.addToCart.filter(
                (item: any) => item.id !== payload.id
            );
            localStorage.setItem("addToCart", JSON.stringify(state.addToCart));
        },

        // clear cart
        clearCart: (state, action) => {
            state.addToCart = [];
            localStorage.setItem("addToCart", JSON.stringify(state.addToCart));
        },

    },
});

export const { addToCart, getTotal, decreaseCartQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
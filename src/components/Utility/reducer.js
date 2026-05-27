
import { type } from "./action.type";

export const initialState = {
    basket: [],
    user: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case type.ADD_TO_BASKET:
            const existingitem = state.basket.find((item) => item.id === action.item.id);
            if (!existingitem) {
                return {
                    ...state,
                    basket: [...state.basket, { ...action.item, amount: 1 }]
                };
            } else {
                const updatebasket = state.basket.map((item) => {
                    return item.id === action.item.id ? { ...item, amount: item.amount + 1 } : item;
                });
                return {
                    ...state,
                    basket: updatebasket
                };
            }
        
        case type.REMOVE_FROM_BASKET:
            const existingItem = state.basket.find((item) => item.id === action.id);
            
            // ✅ FIXED: Add check for undefined
            if (!existingItem) {
                return state; // Item doesn't exist, return current state
            }
            
            if (existingItem.amount === 1) {
                // Remove item completely if amount is 1
                return {
                    ...state,
                    basket: state.basket.filter((item) => item.id !== action.id)
                };
            } else {
                // Decrease amount by 1
                const updatebasket = state.basket.map((item) => {
                    return item.id === action.id ? { ...item, amount: item.amount - 1 } : item;
                });
                return {
                    ...state,
                    basket: updatebasket
                };
            }
        
        case type.EMPTY_BASKET:
            return {
                ...state,
                basket: []
            };
            
        case type.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        
        default:
            return state;
    }
};
import { combineReducers } from '@reduxjs/toolkit';
import { burgerIngredientsSlice } from './slices/burgerIngredientsSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { feedSlice } from './slices/feedSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/ordersSlice';

export const rootReducer = combineReducers({
    burgerIngredients: burgerIngredientsSlice.reducer,
    burgerConstructor: burgerConstructorSlice.reducer,
    feeds: feedSlice.reducer,
    user: userSlice.reducer,
    orders: ordersSlice.reducer
}); 
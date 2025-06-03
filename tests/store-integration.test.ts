import store from '../src/services/store';
import { rootReducer } from '../src/services/reducers';
import { burgerIngredientsSlice } from '../src/services/slices/burgerIngredientsSlice';
import { burgerConstructorSlice } from '../src/services/slices/burgerConstructorSlice';
import { feedSlice } from '../src/services/slices/feedSlice';
import { userSlice } from '../src/services/slices/userSlice';
import { ordersSlice } from '../src/services/slices/ordersSlice';
import { configureStore } from '@reduxjs/toolkit';
import { fetchBurgerIngredients } from '../src/services/slices/burgerIngredientsSlice';
import { getUser } from '../src/services/slices/userSlice';
import { TIngredient } from '../src/utils/types';

jest.mock('../src/utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
  getUserApi: jest.fn()
}));

describe('Тесты состояний', () => {
  it('Проверка правильной инициализации rootReducer', () => {
    const state = store.getState();

    expect(state).toEqual({
      burgerIngredients: burgerIngredientsSlice.getInitialState(),
      burgerConstructor: burgerConstructorSlice.getInitialState(),
      feeds: feedSlice.getInitialState(),
      user: userSlice.getInitialState(),
      orders: ordersSlice.getInitialState(),
    });
  });
});

describe('Root Reducer Tests', () => {
  it('should return initial state for unknown action', () => {
    const store = configureStore({ reducer: rootReducer });
    const initialState = store.getState();
    const action = { type: 'UNKNOWN_ACTION' };

    const nextState = rootReducer(undefined, action);

    expect(nextState).toEqual(initialState);
  });

  describe('Async Action Handling', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Test Bun',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'bun.png',
        image_mobile: 'bun-mobile.png',
        image_large: 'bun-large.png',
        __v: 0
      }
    ];

    const mockUser = {
      email: 'test@test.com',
      name: 'Test User'
    };

    it('should handle fetchBurgerIngredients.pending', () => {
      const store = configureStore({ reducer: rootReducer });
      store.dispatch(fetchBurgerIngredients.pending('requestId'));

      const state = store.getState();
      expect(state.burgerIngredients.status).toBe('loading');
      expect(state.burgerIngredients.error).toBeNull();
    });

    it('should handle fetchBurgerIngredients.fulfilled', () => {
      const store = configureStore({ reducer: rootReducer });
      store.dispatch(fetchBurgerIngredients.fulfilled(mockIngredients, 'requestId'));

      const state = store.getState();
      expect(state.burgerIngredients.ingredients).toEqual(mockIngredients);
      expect(state.burgerIngredients.status).toBe('succeeded');
      expect(state.burgerIngredients.error).toBeNull();
    });

    it('should handle fetchBurgerIngredients.rejected', () => {
      const store = configureStore({ reducer: rootReducer });
      store.dispatch(fetchBurgerIngredients.rejected(new Error('Failed to fetch'), 'requestId'));

      const state = store.getState();
      expect(state.burgerIngredients.status).toBe('failed');
      expect(state.burgerIngredients.error).toBe('Failed to fetch');
      expect(state.burgerIngredients.ingredients).toEqual([]);
    });

    it('should handle getUser async actions', () => {
      const store = configureStore({ reducer: rootReducer });

      // Test pending state
      store.dispatch(getUser.pending('requestId'));
      let state = store.getState();
      expect(state.user.isLoading).toBe(true);

      // Test fulfilled state
      store.dispatch(getUser.fulfilled({ success: true, user: mockUser }, 'requestId'));
      state = store.getState();
      expect(state.user.user).toEqual(mockUser);
      expect(state.user.isLoading).toBe(false);
      expect(state.user.isAuthChecked).toBe(true);

      // Test rejected state
      store.dispatch(getUser.rejected(new Error('Auth failed'), 'requestId'));
      state = store.getState();
      expect(state.user.isLoading).toBe(false);
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toBeNull();
    });
  });
});

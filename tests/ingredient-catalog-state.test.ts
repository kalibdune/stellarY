import { burgerIngredientsSlice, fetchBurgerIngredients } from '../src/services/slices/burgerIngredientsSlice';
import { TIngredient } from '../src/utils/types';

type IngredientsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

jest.mock('../src/utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Burger Ingredients State Management', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Квантовая булка R2-D3',
      type: 'bun',
      proteins: 100,
      fat: 30,
      carbohydrates: 60,
      calories: 520,
      price: 1500,
      image: 'bun.png',
      image_mobile: 'bun-mobile.png',
      image_large: 'bun-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Хрустящие кольца Сатурна',
      type: 'main',
      proteins: 320,
      fat: 185,
      carbohydrates: 150,
      calories: 2200,
      price: 550,
      image: 'rings.png',
      image_mobile: 'rings-mobile.png',
      image_large: 'rings-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Нейтронный',
      type: 'sauce',
      proteins: 50,
      fat: 40,
      carbohydrates: 35,
      calories: 80,
      price: 150,
      image: 'sauce.png',
      image_mobile: 'sauce-mobile.png',
      image_large: 'sauce-large.png',
      __v: 0
    }
  ];

  describe('Ingredients Loading States', () => {
    it('should handle initial state', () => {
      const initialState = burgerIngredientsSlice.getInitialState();
      expect(initialState.ingredients).toEqual([]);
      expect(initialState.status).toBe('idle');
      expect(initialState.error).toBeNull();
    });

    it('should handle ingredients loading start', () => {
      const initialState = burgerIngredientsSlice.getInitialState();
      const nextState = burgerIngredientsSlice.reducer(
        initialState,
        fetchBurgerIngredients.pending('requestId')
      );

      expect(nextState.status).toBe('loading');
      expect(nextState.error).toBeNull();
      expect(nextState.ingredients).toEqual([]);
    });

    it('should handle successful ingredients load', () => {
      const loadingState = {
        ...burgerIngredientsSlice.getInitialState(),
        status: 'loading' as IngredientsStatus
      };

      const nextState = burgerIngredientsSlice.reducer(
        loadingState,
        fetchBurgerIngredients.fulfilled(mockIngredients, 'requestId')
      );

      expect(nextState.status).toBe('succeeded');
      expect(nextState.error).toBeNull();
      expect(nextState.ingredients).toEqual(mockIngredients);
    });

    it('should handle ingredients load failure', () => {
      const loadingState = {
        ...burgerIngredientsSlice.getInitialState(),
        status: 'loading' as IngredientsStatus
      };

      const nextState = burgerIngredientsSlice.reducer(
        loadingState,
        fetchBurgerIngredients.rejected(new Error('Failed to fetch'), 'requestId')
      );

      expect(nextState.status).toBe('failed');
      expect(nextState.error).toBe('Failed to fetch');
      expect(nextState.ingredients).toEqual([]);
    });
  });

  describe('Ingredients Data Analysis', () => {
    const stateWithIngredients = {
      ...burgerIngredientsSlice.getInitialState(),
      status: 'succeeded' as IngredientsStatus,
      ingredients: mockIngredients
    };

    it('should correctly categorize ingredients by type', () => {
      const buns = stateWithIngredients.ingredients.filter(item => item.type === 'bun');
      const mains = stateWithIngredients.ingredients.filter(item => item.type === 'main');
      const sauces = stateWithIngredients.ingredients.filter(item => item.type === 'sauce');

      expect(buns).toHaveLength(1);
      expect(mains).toHaveLength(1);
      expect(sauces).toHaveLength(1);

      expect(buns[0].name).toBe('Квантовая булка R2-D3');
      expect(mains[0].name).toBe('Хрустящие кольца Сатурна');
      expect(sauces[0].name).toBe('Соус Нейтронный');
    });

    it('should provide correct ingredient details', () => {
      const bun = stateWithIngredients.ingredients.find(item => item.type === 'bun');
      expect(bun).toBeTruthy();
      expect(bun?.proteins).toBe(100);
      expect(bun?.fat).toBe(30);
      expect(bun?.carbohydrates).toBe(60);
      expect(bun?.calories).toBe(520);
      expect(bun?.price).toBe(1500);
    });

    it('should maintain data integrity', () => {
      const ingredient = stateWithIngredients.ingredients.find(
        item => item._id === '643d69a5c3f7b9001cfa0941'
      );
      expect(ingredient).toBeTruthy();
      expect(ingredient).toEqual({
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Хрустящие кольца Сатурна',
        type: 'main',
        proteins: 320,
        fat: 185,
        carbohydrates: 150,
        calories: 2200,
        price: 550,
        image: 'rings.png',
        image_mobile: 'rings-mobile.png',
        image_large: 'rings-large.png',
        __v: 0
      });
    });
  });
});

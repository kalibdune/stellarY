import { burgerConstructorSlice, addIngredient, removeIngredient, moveIngredient, updateBun } from '../src/services/slices/burgerConstructorSlice';
import { TIngredient } from '../src/utils/types';

jest.mock('../src/utils/burger-api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('Burger Constructor Reducer Tests', () => {
  const mockBun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Space Bun 3000',
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
  };

  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Space Filling',
    type: 'main',
    proteins: 320,
    fat: 185,
    carbohydrates: 150,
    calories: 2200,
    price: 550,
    image: 'filling.png',
    image_mobile: 'filling-mobile.png',
    image_large: 'filling-large.png',
    __v: 0
  };

  it('should handle initial state', () => {
    const initialState = burgerConstructorSlice.getInitialState();
    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = burgerConstructorSlice.reducer(initialState, action);

    expect(nextState).toEqual(initialState);
    expect(nextState.constructorItems.bun).toBeNull();
    expect(nextState.constructorItems.ingredients).toEqual([]);
  });

  describe('Ingredient Management', () => {
    it('should add a bun to the constructor', () => {
      const initialState = burgerConstructorSlice.getInitialState();
      const nextState = burgerConstructorSlice.reducer(initialState, updateBun(mockBun));
      expect(nextState.constructorItems.bun).toEqual(mockBun);
    });

    it('should replace existing bun with a new one', () => {
      const oldBun = { ...mockBun, name: 'Old Bun' };
      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          ...burgerConstructorSlice.getInitialState().constructorItems,
          bun: oldBun
        }
      };
      const nextState = burgerConstructorSlice.reducer(initialState, updateBun(mockBun));
      expect(nextState.constructorItems.bun).toEqual(mockBun);
    });

    it('should add a non-bun ingredient to the constructor', () => {
      const initialState = burgerConstructorSlice.getInitialState();
      const nextState = burgerConstructorSlice.reducer(initialState, addIngredient(mockIngredient));

      expect(nextState.constructorItems.ingredients).toHaveLength(1);
      expect(nextState.constructorItems.ingredients[0]).toEqual(mockIngredient);
    });

    it('should remove an ingredient from the constructor', () => {
      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          ...burgerConstructorSlice.getInitialState().constructorItems,
          ingredients: [mockIngredient]
        }
      };
      const nextState = burgerConstructorSlice.reducer(initialState, removeIngredient(0));

      expect(nextState.constructorItems.ingredients).toHaveLength(0);
    });

    it('should move ingredients within the constructor', () => {
      const ingredient2 = { ...mockIngredient, name: 'Second Ingredient' };
      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        constructorItems: {
          ...burgerConstructorSlice.getInitialState().constructorItems,
          ingredients: [mockIngredient, ingredient2]
        }
      };
      const nextState = burgerConstructorSlice.reducer(
        initialState,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(nextState.constructorItems.ingredients[0]).toEqual(ingredient2);
      expect(nextState.constructorItems.ingredients[1]).toEqual(mockIngredient);
    });
  });
});
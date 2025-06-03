import { feedSlice, fetchOrders } from '../src/services/slices/feedSlice';
import { TFeedsResponse } from '../src/utils/burger-api';
import type { FeedState } from '../src/services/slices/feedSlice';

jest.mock('../src/utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

describe('Feed State Management', () => {
  const mockOrders = [
    {
      _id: '67de7ac86fce7d001db5b7b5',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941'
      ],
      status: 'pending',
      name: 'Галактический бургер "Сверхновая"',
      createdAt: '2025-03-22T08:54:32.432Z',
      updatedAt: '2025-03-22T08:54:33.081Z',
      number: 88123
    },
    {
      _id: '67de7ac86fce7d001db5b7b6',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0942'
      ],
      status: 'done',
      name: 'Нейтронный бургер',
      createdAt: '2025-03-22T08:55:32.432Z',
      updatedAt: '2025-03-22T08:55:33.081Z',
      number: 88124
    }
  ];

  describe('Order Data Fetching', () => {
    it('should handle initial state', () => {
      const initialState = feedSlice.getInitialState();
      expect(initialState.status).toBe('idle');
      expect(initialState.error).toBeNull();
      expect(initialState.feeds).toBeNull();
    });

    it('should handle fetch start', () => {
      const initialState = feedSlice.getInitialState();
      const nextState = feedSlice.reducer(initialState, fetchOrders.pending('requestId'));

      expect(nextState.status).toBe('loading');
      expect(nextState.error).toBeNull();
    });

    it('should handle successful fetch', () => {
      const mockFeedResponse: TFeedsResponse = {
        success: true,
        orders: mockOrders,
        total: 100,
        totalToday: 10
      };

      const loadingState: FeedState = {
        ...feedSlice.getInitialState(),
        status: 'loading' as const
      };

      const nextState = feedSlice.reducer(loadingState, fetchOrders.fulfilled(mockFeedResponse, 'requestId'));

      expect(nextState.status).toBe('succeeded');
      expect(nextState.feeds).toEqual(mockFeedResponse);
      expect(nextState.error).toBeNull();
    });

    it('should handle fetch failure', () => {
      const loadingState: FeedState = {
        ...feedSlice.getInitialState(),
        status: 'loading' as const
      };

      const nextState = feedSlice.reducer(
        loadingState,
        fetchOrders.rejected(new Error('Network error'), 'requestId')
      );

      expect(nextState.status).toBe('failed');
      expect(nextState.error).toBe('Network error');
      expect(nextState.feeds).toBeNull();
    });
  });

  describe('Order Data Analysis', () => {
    const stateWithOrders = {
      ...feedSlice.getInitialState(),
      status: 'succeeded',
      feeds: {
        success: true,
        orders: mockOrders,
        total: 100,
        totalToday: 10
      }
    };

    it('should correctly identify order statuses', () => {
      const doneOrders = stateWithOrders.feeds?.orders.filter(order => order.status === 'done');
      const pendingOrders = stateWithOrders.feeds?.orders.filter(order => order.status === 'pending');

      expect(doneOrders).toHaveLength(1);
      expect(pendingOrders).toHaveLength(1);
      expect(doneOrders?.[0].number).toBe(88124);
      expect(pendingOrders?.[0].number).toBe(88123);
    });

    it('should maintain correct order chronology', () => {
      const orderedByDate = [...(stateWithOrders.feeds?.orders || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      expect(orderedByDate[0].number).toBe(88124);
      expect(orderedByDate[1].number).toBe(88123);
    });

    it('should track order totals', () => {
      expect(stateWithOrders.feeds?.total).toBe(100);
      expect(stateWithOrders.feeds?.totalToday).toBe(10);
    });
  });
});

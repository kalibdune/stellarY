import { userSlice, loginUser, getUser, updateUser, logoutUser, registerUser } from '../src/services/slices/userSlice';
import { TUser } from '../src/utils/types';
import { TLoginData, TAuthResponse, TRegisterData } from '../src/utils/burger-api';

jest.mock('../src/utils/burger-api', () => ({
    loginUserApi: jest.fn(),
    registerUserApi: jest.fn(),
    logoutApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn()
}));

describe('User Authentication and Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testUser: TUser = {
        email: 'cosmic_explorer@galaxy.com',
        name: 'Cosmic Explorer'
    };

    const loginData: TLoginData = {
        email: 'cosmic_explorer@galaxy.com',
        password: 'nebula123'
    };

    const registerData: TRegisterData = {
        ...loginData,
        name: 'Cosmic Explorer'
    };

    const authResponse: TAuthResponse = {
        success: true,
        user: testUser,
        accessToken: 'Bearer.cosmic.token',
        refreshToken: 'refresh.nebula.token'
    };

    describe('Registration Process', () => {
        it('should handle user registration states', () => {
            const initialState = userSlice.getInitialState();

            // Test pending state
            const pendingState = userSlice.reducer(initialState, registerUser.pending('requestId', registerData));
            expect(pendingState.isAuthChecked).toBe(true);
            expect(pendingState.isLoading).toBe(true);

            // Test successful registration
            const successState = userSlice.reducer(pendingState, registerUser.fulfilled(testUser, 'requestId', registerData));
            expect(successState.user).toEqual(testUser);
            expect(successState.isLoading).toBe(false);

            // Test failed registration
            const failedState = userSlice.reducer(initialState, registerUser.rejected(new Error('Registration failed'), 'requestId', registerData));
            expect(failedState.isLoading).toBe(false);
            expect(failedState.user).toBeNull();
        });
    });

    describe('Authentication Flow', () => {
        it('should handle login process', () => {
            const initialState = userSlice.getInitialState();

            // Test login pending
            const pendingState = userSlice.reducer(initialState, loginUser.pending('requestId', loginData));
            expect(pendingState.isLoading).toBe(true);
            expect(pendingState.isAuthChecked).toBe(true);

            // Test successful login
            const successState = userSlice.reducer(pendingState, loginUser.fulfilled(testUser, 'requestId', loginData));
            expect(successState.user).toEqual(testUser);
            expect(successState.isLoading).toBe(false);

            // Test failed login
            const failedState = userSlice.reducer(initialState, loginUser.rejected(new Error('Invalid credentials'), 'requestId', loginData));
            expect(failedState.isLoading).toBe(false);
            expect(failedState.isAuthChecked).toBe(true);
        });

        it('should handle logout process', () => {
            const loggedInState = {
                ...userSlice.getInitialState(),
                user: testUser
            };

            const logoutState = userSlice.reducer(loggedInState, logoutUser.fulfilled(undefined, 'requestId'));
            expect(logoutState.user).toBeNull();
            expect(logoutState.isAuthChecked).toBe(true);
        });
    });

    describe('User Profile Management', () => {
        it('should handle profile updates', () => {
            const initialState = {
                ...userSlice.getInitialState(),
                user: testUser
            };

            const updatedUser = {
                ...testUser,
                name: 'Stellar Explorer'
            };

            // Test update pending
            const pendingState = userSlice.reducer(initialState, updateUser.pending('requestId', { name: 'Stellar Explorer' }));
            expect(pendingState.isLoading).toBe(true);

            // Test successful update
            const successState = userSlice.reducer(pendingState, updateUser.fulfilled({ success: true, user: updatedUser }, 'requestId', { name: 'Stellar Explorer' }));
            expect(successState.user).toEqual(updatedUser);
            expect(successState.isLoading).toBe(false);

            // Test failed update
            const failedState = userSlice.reducer(initialState, updateUser.rejected(new Error('Update failed'), 'requestId', { name: 'Stellar Explorer' }));
            expect(failedState.isLoading).toBe(false);
        });

        it('should handle user data fetching', () => {
            const initialState = userSlice.getInitialState();

            // Test fetch pending
            const pendingState = userSlice.reducer(initialState, getUser.pending('requestId'));
            expect(pendingState.isLoading).toBe(true);

            // Test successful fetch
            const successState = userSlice.reducer(pendingState, getUser.fulfilled({ success: true, user: testUser }, 'requestId'));
            expect(successState.user).toEqual(testUser);
            expect(successState.isLoading).toBe(false);
            expect(successState.isAuthChecked).toBe(true);

            // Test failed fetch
            const failedState = userSlice.reducer(initialState, getUser.rejected(new Error('Fetch failed'), 'requestId'));
            expect(failedState.isLoading).toBe(false);
            expect(failedState.isAuthChecked).toBe(true);
            expect(failedState.user).toBeNull();
        });
    });
});
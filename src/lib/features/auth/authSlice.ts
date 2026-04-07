import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "admin" | "teacher" | "student" | "parent";
    } | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthState['user']>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { setAuthUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
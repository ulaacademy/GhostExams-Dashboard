import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as analyticsAPI from '../api/analytics';

// Async thunks
export const fetchDashboardOverview = createAsyncThunk(
    'analytics/fetchDashboardOverview',
    async (_, { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchDashboardOverview();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchRevenueAnalytics = createAsyncThunk(
    'analytics/fetchRevenueAnalytics',
    async (period = '30', { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchRevenueAnalytics(period);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchSubscriptionAnalytics = createAsyncThunk(
    'analytics/fetchSubscriptionAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchSubscriptionAnalytics();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchExamAnalytics = createAsyncThunk(
    'analytics/fetchExamAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchExamAnalytics();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUserAnalytics = createAsyncThunk(
    'analytics/fetchUserAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchUserAnalytics();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPlanAnalytics = createAsyncThunk(
    'analytics/fetchPlanAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchPlanAnalytics();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchRecentActivities = createAsyncThunk(
    'analytics/fetchRecentActivities',
    async (limit = 20, { rejectWithValue }) => {
        try {
            const response = await analyticsAPI.fetchRecentActivities(limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    overview: null,
    revenue: null,
    subscriptions: null,
    exams: null,
    users: null,
    plans: null,
    activities: [],
    loading: false,
    error: null,
};

// Slice
const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAnalytics: () => initialState,
    },
    extraReducers: (builder) => {
        // Dashboard Overview
        builder
            .addCase(fetchDashboardOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.overview = action.payload;
            })
            .addCase(fetchDashboardOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Revenue Analytics
        builder
            .addCase(fetchRevenueAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.revenue = action.payload;
            })
            .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Subscription Analytics
        builder
            .addCase(fetchSubscriptionAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptions = action.payload;
            })
            .addCase(fetchSubscriptionAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Exam Analytics
        builder
            .addCase(fetchExamAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExamAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload;
            })
            .addCase(fetchExamAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // User Analytics
        builder
            .addCase(fetchUserAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUserAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Plan Analytics
        builder
            .addCase(fetchPlanAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlanAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlanAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Recent Activities
        builder
            .addCase(fetchRecentActivities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.activities = action.payload;
            })
            .addCase(fetchRecentActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Actions
export const { clearError, resetAnalytics } = analyticsSlice.actions;

// Selectors
export const selectOverview = (state) => state.analytics.overview;
export const selectRevenue = (state) => state.analytics.revenue;
export const selectSubscriptionAnalytics = (state) => state.analytics.subscriptions;
export const selectExamAnalytics = (state) => state.analytics.exams;
export const selectUserAnalytics = (state) => state.analytics.users;
export const selectPlanAnalytics = (state) => state.analytics.plans;
export const selectRecentActivities = (state) => state.analytics.activities;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;

// Reducer
export default analyticsSlice.reducer;


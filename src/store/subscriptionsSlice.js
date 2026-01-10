import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    fetchSubscriptions as apiFetchSubscriptions,
    activateSubscription as apiActivateSubscription,
    deactivateSubscription as apiDeactivateSubscription,
    cancelSubscription as apiCancelSubscription,
    renewSubscription as apiRenewSubscription,
    changeSubscriptionPlan as apiChangeSubscriptionPlan,
    updatePaymentStatus as apiUpdatePaymentStatus,
} from '@/api/subscription'

// Thunks
export const fetchSubscriptionsList = createAsyncThunk(
    'subscriptions/fetchSubscriptionsList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchSubscriptions(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const activateSubscriptionThunk = createAsyncThunk(
    'subscriptions/activateSubscription',
    async ({ subscriptionId, data }, { rejectWithValue }) => {
        try {
            const result = await apiActivateSubscription(subscriptionId, data)
            return { subscriptionId, data: result }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const deactivateSubscriptionThunk = createAsyncThunk(
    'subscriptions/deactivateSubscription',
    async ({ subscriptionId, data }, { rejectWithValue }) => {
        try {
            const result = await apiDeactivateSubscription(subscriptionId, data || {})
            return { subscriptionId, data: result }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const cancelSubscriptionThunk = createAsyncThunk(
    'subscriptions/cancelSubscription',
    async ({ subscriptionId, data }, { rejectWithValue }) => {
        try {
            const result = await apiCancelSubscription(subscriptionId, data)
            return { subscriptionId, data: result }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const renewSubscriptionThunk = createAsyncThunk(
    'subscriptions/renewSubscription',
    async ({ subscriptionId, data }, { rejectWithValue }) => {
        try {
            const result = await apiRenewSubscription(subscriptionId, data)
            return { subscriptionId, data: result }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const changeSubscriptionPlanThunk = createAsyncThunk(
    'subscriptions/changeSubscriptionPlan',
    async ({ subscriptionId, data }, { rejectWithValue }) => {
        try {
            const result = await apiChangeSubscriptionPlan(subscriptionId, data)
            return { subscriptionId, data: result }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const updatePaymentStatusThunk = createAsyncThunk(
    'subscriptions/updatePaymentStatus',
    async ({ subscriptionId, data }, { rejectWithValue }) => {
        try {
            const result = await apiUpdatePaymentStatus(subscriptionId, data)
            return { subscriptionId, data: result }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

const initialListState = { items: [], loading: false, error: null, loadedOnce: false, total: 0, page: 1, limit: 10 }

const initialState = {
    subscriptions: { ...initialListState },
}

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch subscriptions
        builder.addCase(fetchSubscriptionsList.pending, (state) => {
            state.subscriptions.loading = true
            state.subscriptions.error = null
        })
        builder.addCase(fetchSubscriptionsList.fulfilled, (state, action) => {
            state.subscriptions.loading = false
            const payload = action.payload || {}
            // Handle response structure: { success: true, data: [...] }
            let raw = []
            if (Array.isArray(payload)) {
                raw = payload
            } else if (payload.data && Array.isArray(payload.data)) {
                raw = payload.data
            } else if (payload.subscriptions && Array.isArray(payload.subscriptions)) {
                raw = payload.subscriptions
            } else if (payload.items && Array.isArray(payload.items)) {
                raw = payload.items
            }
            
            // Backend may return subscriptions without a populated teacher record,
            // so we should not drop items that have null/undefined teacherId.
            const actualSubscriptions = raw
            
            state.subscriptions.items = actualSubscriptions.map((item) => {
                // Handle teacherId - it might be an object or a string
                const teacherId = typeof item.teacherId === 'object' ? item.teacherId?._id : item.teacherId
                const teacherName = typeof item.teacherId === 'object'
                    ? (item.teacherId?.name || item.teacherId?.fullName)
                    : (item.teacherName || teacherId)
                
                // Handle planId - it might be an object or a string
                const planId = typeof item.planId === 'object' ? item.planId._id : item.planId
                const planName = typeof item.planId === 'object' ? item.planId.name : item.planName || planId
                
                return {
                    id: item.id ?? item._id,
                    teacherId: teacherId,
                    teacherName: teacherName,
                    planId: planId,
                    planName: planName,
                    status: item.status,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    paymentStatus: item.paymentStatus,
                    paymentDate: item.paymentDate,
                    amount: item.amount,
                    currency: item.currency,
                    notes: item.notes,
                    paymentMethod: item.paymentMethod,
                    cancellationReason: item.cancellationReason,
                    cancelledAt: item.cancelledAt,
                    cancelledBy: item.cancelledBy,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    ...item,
                }
            })
            state.subscriptions.loadedOnce = true
            state.subscriptions.total = payload.total ?? actualSubscriptions.length
            state.subscriptions.page = payload.page ?? 1
            state.subscriptions.limit = payload.limit ?? state.subscriptions.limit
        })
        builder.addCase(fetchSubscriptionsList.rejected, (state, action) => {
            state.subscriptions.loading = false
            state.subscriptions.error = action.payload || 'Failed to load subscriptions'
        })

        // Update subscription (used by all update actions)
        builder.addCase(activateSubscriptionThunk.fulfilled, (state, action) => {
            const { subscriptionId } = action.payload
            const idx = state.subscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId))
            if (idx !== -1) {
                state.subscriptions.items[idx] = { ...state.subscriptions.items[idx], ...action.payload.data, status: 'active' }
            }
        })

        builder.addCase(deactivateSubscriptionThunk.fulfilled, (state, action) => {
            const { subscriptionId } = action.payload
            const idx = state.subscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId))
            if (idx !== -1) {
                state.subscriptions.items[idx] = { ...state.subscriptions.items[idx], ...action.payload.data, status: 'inactive' }
            }
        })

        builder.addCase(cancelSubscriptionThunk.fulfilled, (state, action) => {
            const { subscriptionId } = action.payload
            const idx = state.subscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId))
            if (idx !== -1) {
                state.subscriptions.items[idx] = { ...state.subscriptions.items[idx], ...action.payload.data, status: 'cancelled' }
            }
        })

        builder.addCase(renewSubscriptionThunk.fulfilled, (state, action) => {
            const { subscriptionId } = action.payload
            const idx = state.subscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId))
            if (idx !== -1) {
                state.subscriptions.items[idx] = { ...state.subscriptions.items[idx], ...action.payload.data }
            }
        })

        builder.addCase(changeSubscriptionPlanThunk.fulfilled, (state, action) => {
            const { subscriptionId } = action.payload
            const idx = state.subscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId))
            if (idx !== -1) {
                state.subscriptions.items[idx] = { ...state.subscriptions.items[idx], ...action.payload.data }
            }
        })

        builder.addCase(updatePaymentStatusThunk.fulfilled, (state, action) => {
            const { subscriptionId } = action.payload
            const idx = state.subscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId))
            if (idx !== -1) {
                state.subscriptions.items[idx] = { ...state.subscriptions.items[idx], ...action.payload.data }
            }
        })
    },
})

export default subscriptionsSlice.reducer

// Selectors
export const selectSubscriptions = (state) => state.subscriptions.subscriptions.items
export const selectSubscriptionsLoading = (state) => state.subscriptions.subscriptions.loading
export const selectSubscriptionsError = (state) => state.subscriptions.subscriptions.error
export const selectSubscriptionsLoadedOnce = (state) => state.subscriptions.subscriptions.loadedOnce
export const selectSubscriptionsTotal = (state) => state.subscriptions.subscriptions.total

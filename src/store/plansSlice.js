import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    fetchPlans as apiFetchPlans,
    fetchActivePlans as apiFetchActivePlans,
    fetchPlanById as apiFetchPlanById,
    createPlan as apiCreatePlan,
    updatePlan as apiUpdatePlan,
    deletePlan as apiDeletePlan,
    togglePlanActivation as apiTogglePlanActivation,
} from '@/api/plans'

// Thunks
export const fetchPlansList = createAsyncThunk(
    'plans/fetchPlansList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchPlans(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const fetchActivePlansList = createAsyncThunk(
    'plans/fetchActivePlansList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchActivePlans(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const fetchPlanById = createAsyncThunk(
    'plans/fetchPlanById',
    async (planId, { rejectWithValue }) => {
        try {
            const data = await apiFetchPlanById(planId)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const createPlanThunk = createAsyncThunk(
    'plans/createPlan',
    async (planData, { rejectWithValue }) => {
        try {
            const data = await apiCreatePlan(planData)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const updatePlanThunk = createAsyncThunk(
    'plans/updatePlan',
    async ({ planId, planData }, { rejectWithValue }) => {
        try {
            const data = await apiUpdatePlan(planId, planData)
            return { planId, data }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const deletePlanThunk = createAsyncThunk(
    'plans/deletePlan',
    async ({ planId, permanent }, { rejectWithValue }) => {
        try {
            await apiDeletePlan(planId, permanent)
            return { planId }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const togglePlanActivationThunk = createAsyncThunk(
    'plans/togglePlanActivation',
    async (planId, { rejectWithValue }) => {
        try {
            const data = await apiTogglePlanActivation(planId)
            return { planId, data }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

const initialListState = { items: [], loading: false, error: null, loadedOnce: false, total: 0, page: 1, limit: 10, search: '' }

const initialState = {
    plans: { ...initialListState },
    activePlans: { ...initialListState },
    currentPlan: null,
}

const plansSlice = createSlice({
    name: 'plans',
    initialState,
    reducers: {
        clearCurrentPlan: (state) => {
            state.currentPlan = null
        },
    },
    extraReducers: (builder) => {
        // Fetch all plans
        builder.addCase(fetchPlansList.pending, (state) => {
            state.plans.loading = true
            state.plans.error = null
        })
        builder.addCase(fetchPlansList.fulfilled, (state, action) => {
            state.plans.loading = false
            const payload = action.payload || {}
            // Handle response structure: { success: true, data: [...] }
            let raw = []
            if (Array.isArray(payload)) {
                raw = payload
            } else if (payload.data && Array.isArray(payload.data)) {
                raw = payload.data
            } else if (payload.plans && Array.isArray(payload.plans)) {
                raw = payload.plans
            } else if (payload.items && Array.isArray(payload.items)) {
                raw = payload.items
            }
            
            state.plans.items = raw.map((item) => ({
                id: item.id ?? item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                currency: item.currency,
                maxStudents: item.maxStudents,
                maxExams: item.maxExams,
                maxQuestions: item.maxQuestions,
                duration: item.duration,
                durationUnit: item.durationUnit,
                features: item.features || [],
                isActive: item.isActive ?? true,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                ...item,
            }))
            state.plans.loadedOnce = true
            state.plans.total = payload.total ?? raw.length
            state.plans.page = payload.page ?? 1
            state.plans.limit = payload.limit ?? state.plans.limit
        })
        builder.addCase(fetchPlansList.rejected, (state, action) => {
            state.plans.loading = false
            state.plans.error = action.payload || 'Failed to load plans'
        })

        // Fetch active plans
        builder.addCase(fetchActivePlansList.pending, (state) => {
            state.activePlans.loading = true
            state.activePlans.error = null
        })
        builder.addCase(fetchActivePlansList.fulfilled, (state, action) => {
            state.activePlans.loading = false
            const payload = action.payload || {}
            const raw = Array.isArray(payload) ? payload : (payload.plans || payload.items || [])
            state.activePlans.items = raw.map((item) => ({
                id: item.id ?? item._id,
                ...item,
            }))
            state.activePlans.loadedOnce = true
            state.activePlans.total = payload.total ?? raw.length
        })
        builder.addCase(fetchActivePlansList.rejected, (state, action) => {
            state.activePlans.loading = false
            state.activePlans.error = action.payload || 'Failed to load active plans'
        })

        // Fetch plan by ID
        builder.addCase(fetchPlanById.pending, (state) => {
            state.currentPlan = null
        })
        builder.addCase(fetchPlanById.fulfilled, (state, action) => {
            const payload = action.payload
            state.currentPlan = {
                id: payload.id ?? payload._id,
                ...payload,
            }
        })

        // Create plan
        builder.addCase(createPlanThunk.fulfilled, (state, action) => {
            const payload = action.payload
            state.plans.items.unshift({
                id: payload.id ?? payload._id,
                ...payload,
            })
        })

        // Update plan
        builder.addCase(updatePlanThunk.fulfilled, (state, action) => {
            const { planId } = action.payload
            const idx = state.plans.items.findIndex((i) => String(i.id) === String(planId))
            if (idx !== -1) {
                state.plans.items[idx] = { ...state.plans.items[idx], ...action.payload.data }
            }
        })

        // Delete plan
        builder.addCase(deletePlanThunk.fulfilled, (state, action) => {
            const { planId } = action.payload
            state.plans.items = state.plans.items.filter((i) => String(i.id) !== String(planId))
        })

        // Toggle activation
        builder.addCase(togglePlanActivationThunk.fulfilled, (state, action) => {
            const { planId } = action.payload
            const idx = state.plans.items.findIndex((i) => String(i.id) === String(planId))
            if (idx !== -1) {
                state.plans.items[idx].isActive = !state.plans.items[idx].isActive
            }
        })
    },
})

export default plansSlice.reducer

// Selectors
export const selectPlans = (state) => state.plans.plans.items
export const selectPlansLoading = (state) => state.plans.plans.loading
export const selectPlansError = (state) => state.plans.plans.error
export const selectPlansLoadedOnce = (state) => state.plans.plans.loadedOnce
export const selectPlansTotal = (state) => state.plans.plans.total

export const selectActivePlans = (state) => state.plans.activePlans.items
export const selectActivePlansLoading = (state) => state.plans.activePlans.loading

export const selectCurrentPlan = (state) => state.plans.currentPlan
export const clearCurrentPlan = plansSlice.actions.clearCurrentPlan

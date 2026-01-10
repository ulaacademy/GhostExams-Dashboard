import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    fetchStudentPlans as apiFetchStudentPlans,
    fetchActiveStudentPlans as apiFetchActiveStudentPlans,
    fetchStudentPlanById as apiFetchStudentPlanById,
    createStudentPlan as apiCreateStudentPlan,
    updateStudentPlan as apiUpdateStudentPlan,
    deleteStudentPlan as apiDeleteStudentPlan,
    toggleStudentPlanActivation as apiToggleStudentPlanActivation,
} from '@/api/studentPlans'

// Thunks
export const fetchStudentPlansList = createAsyncThunk(
    'studentPlans/fetchStudentPlansList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchStudentPlans(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const fetchActiveStudentPlansList = createAsyncThunk(
    'studentPlans/fetchActiveStudentPlansList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchActiveStudentPlans(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const fetchStudentPlanById = createAsyncThunk(
    'studentPlans/fetchStudentPlanById',
    async (planId, { rejectWithValue }) => {
        try {
            const data = await apiFetchStudentPlanById(planId)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const createStudentPlanThunk = createAsyncThunk(
    'studentPlans/createStudentPlan',
    async (planData, { rejectWithValue }) => {
        try {
            const data = await apiCreateStudentPlan(planData)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const updateStudentPlanThunk = createAsyncThunk(
    'studentPlans/updateStudentPlan',
    async ({ planId, planData }, { rejectWithValue }) => {
        try {
            const data = await apiUpdateStudentPlan(planId, planData)
            return { planId, data }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const deleteStudentPlanThunk = createAsyncThunk(
    'studentPlans/deleteStudentPlan',
    async ({ planId, permanent }, { rejectWithValue }) => {
        try {
            await apiDeleteStudentPlan(planId, permanent)
            return { planId }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const toggleStudentPlanActivationThunk = createAsyncThunk(
    'studentPlans/toggleStudentPlanActivation',
    async (planId, { rejectWithValue }) => {
        try {
            const data = await apiToggleStudentPlanActivation(planId)
            return { planId, data }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

const initialListState = {
    items: [],
    loading: false,
    error: null,
    loadedOnce: false,
    total: 0,
    page: 1,
    limit: 10,
    search: '',
}

const initialState = {
    studentPlans: { ...initialListState },
    activeStudentPlans: { ...initialListState },
    currentStudentPlan: null,
}

const studentPlansSlice = createSlice({
    name: 'studentPlans',
    initialState,
    reducers: {
        clearCurrentStudentPlan: (state) => {
            state.currentStudentPlan = null
        },
    },
    extraReducers: (builder) => {
        // Fetch all student plans
        builder.addCase(fetchStudentPlansList.pending, (state) => {
            state.studentPlans.loading = true
            state.studentPlans.error = null
        })
        builder.addCase(fetchStudentPlansList.fulfilled, (state, action) => {
            state.studentPlans.loading = false
            const payload = action.payload || {}

            // شكل الرد عندك غالبًا: { success: true, data: [...] }
            let raw = []
            if (Array.isArray(payload)) raw = payload
            else if (payload.data && Array.isArray(payload.data)) raw = payload.data
            else if (payload.plans && Array.isArray(payload.plans)) raw = payload.plans
            else if (payload.items && Array.isArray(payload.items)) raw = payload.items

            state.studentPlans.items = raw.map((item) => ({
                id: item.id ?? item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                currency: item.currency,
                maxTeachers: item.maxTeachers,
                teacherType: item.teacherType,
                duration: item.duration,
                durationUnit: item.durationUnit,
                startDate: item.startDate,
                endDate: item.endDate,
                freeExtraTeachers: item.freeExtraTeachers ?? 0,
                freeExtraStudents: item.freeExtraStudents ?? 0,
                features: item.features || [],
                isActive: item.isActive ?? true,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                ...item,
            }))

            state.studentPlans.loadedOnce = true
            state.studentPlans.total = payload.total ?? raw.length
            state.studentPlans.page = payload.page ?? 1
            state.studentPlans.limit = payload.limit ?? state.studentPlans.limit
        })
        builder.addCase(fetchStudentPlansList.rejected, (state, action) => {
            state.studentPlans.loading = false
            state.studentPlans.error = action.payload || 'Failed to load student plans'
        })

        // Fetch active student plans
        builder.addCase(fetchActiveStudentPlansList.pending, (state) => {
            state.activeStudentPlans.loading = true
            state.activeStudentPlans.error = null
        })
        builder.addCase(fetchActiveStudentPlansList.fulfilled, (state, action) => {
            state.activeStudentPlans.loading = false
            const payload = action.payload || {}
            const raw = Array.isArray(payload) ? payload : (payload.data || payload.plans || payload.items || [])
            state.activeStudentPlans.items = raw.map((item) => ({
                id: item.id ?? item._id,
                ...item,
            }))
            state.activeStudentPlans.loadedOnce = true
            state.activeStudentPlans.total = payload.total ?? raw.length
        })
        builder.addCase(fetchActiveStudentPlansList.rejected, (state, action) => {
            state.activeStudentPlans.loading = false
            state.activeStudentPlans.error = action.payload || 'Failed to load active student plans'
        })

        // Fetch student plan by ID
        builder.addCase(fetchStudentPlanById.pending, (state) => {
            state.currentStudentPlan = null
        })
        builder.addCase(fetchStudentPlanById.fulfilled, (state, action) => {
            const payload = action.payload?.data ?? action.payload
            state.currentStudentPlan = {
                id: payload?.id ?? payload?._id,
                ...payload,
            }
        })

        // Create student plan
        builder.addCase(createStudentPlanThunk.fulfilled, (state, action) => {
            const payload = action.payload?.data ?? action.payload
            state.studentPlans.items.unshift({
                id: payload?.id ?? payload?._id,
                ...payload,
            })
        })

        // Update student plan
        builder.addCase(updateStudentPlanThunk.fulfilled, (state, action) => {
            const { planId } = action.payload
            const data = action.payload?.data?.data ?? action.payload?.data
            const idx = state.studentPlans.items.findIndex((i) => String(i.id) === String(planId))
            if (idx !== -1) {
                state.studentPlans.items[idx] = { ...state.studentPlans.items[idx], ...(data || {}) }
            }
        })

        // Delete student plan
        builder.addCase(deleteStudentPlanThunk.fulfilled, (state, action) => {
            const { planId } = action.payload
            state.studentPlans.items = state.studentPlans.items.filter((i) => String(i.id) !== String(planId))
        })

        // Toggle activation
        builder.addCase(toggleStudentPlanActivationThunk.fulfilled, (state, action) => {
            const { planId } = action.payload
            const idx = state.studentPlans.items.findIndex((i) => String(i.id) === String(planId))
            if (idx !== -1) {
                state.studentPlans.items[idx].isActive = !state.studentPlans.items[idx].isActive
            }
        })
    },
})

export default studentPlansSlice.reducer

// Selectors
export const selectStudentPlans = (state) => state.studentPlans.studentPlans.items
export const selectStudentPlansLoading = (state) => state.studentPlans.studentPlans.loading
export const selectStudentPlansError = (state) => state.studentPlans.studentPlans.error
export const selectStudentPlansLoadedOnce = (state) => state.studentPlans.studentPlans.loadedOnce
export const selectStudentPlansTotal = (state) => state.studentPlans.studentPlans.total

export const selectActiveStudentPlans = (state) => state.studentPlans.activeStudentPlans.items
export const selectActiveStudentPlansLoading = (state) => state.studentPlans.activeStudentPlans.loading

export const selectCurrentStudentPlan = (state) => state.studentPlans.currentStudentPlan
export const clearCurrentStudentPlan = studentPlansSlice.actions.clearCurrentStudentPlan

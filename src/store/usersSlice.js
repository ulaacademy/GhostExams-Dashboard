import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    fetchStudents as apiFetchStudents,
    banStudent as apiBanStudent,
    deleteStudent as apiDeleteStudent,
    fetchTeachers as apiFetchTeachers,
    banTeacher as apiBanTeacher,
    deleteTeacher as apiDeleteTeacher,
} from '@/api/users'

// Thunks - Students
export const fetchStudentsList = createAsyncThunk(
    'users/fetchStudentsList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchStudents(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const banStudentById = createAsyncThunk(
    'users/banStudentById',
    async ({ studentId, isBanned }, { rejectWithValue }) => {
        try {
            const data = await apiBanStudent(studentId, isBanned)
            return { studentId, isBanned, data }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const deleteStudentById = createAsyncThunk(
    'users/deleteStudentById',
    async (studentId, { rejectWithValue }) => {
        try {
            await apiDeleteStudent(studentId)
            return { studentId }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

// Thunks - Teachers
export const fetchTeachersList = createAsyncThunk(
    'users/fetchTeachersList',
    async (params, { rejectWithValue }) => {
        try {
            const data = await apiFetchTeachers(params || {})
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const banTeacherById = createAsyncThunk(
    'users/banTeacherById',
    async ({ teacherId, isBanned }, { rejectWithValue }) => {
        try {
            const data = await apiBanTeacher(teacherId, isBanned)
            return { teacherId, isBanned, data }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

export const deleteTeacherById = createAsyncThunk(
    'users/deleteTeacherById',
    async (teacherId, { rejectWithValue }) => {
        try {
            await apiDeleteTeacher(teacherId)
            return { teacherId }
        } catch (error) {
            return rejectWithValue(error?.response?.data || error.message)
        }
    }
)

const initialListState = { items: [], loading: false, error: null, loadedOnce: false, total: 0, page: 1, limit: 10, search: '' }

const initialState = {
    students: { ...initialListState },
    teachers: { ...initialListState },
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Students - fetch
        builder.addCase(fetchStudentsList.pending, (state) => {
            state.students.loading = true
            state.students.error = null
        })
        builder.addCase(fetchStudentsList.fulfilled, (state, action) => {
            state.students.loading = false
            const payload = action.payload || {}
            const raw = Array.isArray(payload)
                ? payload
                : (payload.data || payload.students || payload.items || [])
            state.students.items = raw.map((item) => ({
                ...item,
                id: item._id || item.id,
                name: item.name,
                email: item.email,
                isBanned: !!item.isBanned,
            }))
            state.students.loadedOnce = true
            state.students.total = payload.pagination?.total || payload.total || raw.length
            state.students.page = payload.pagination?.page || payload.page || 1
            state.students.limit = payload.pagination?.limit || payload.limit || state.students.limit
        })
        builder.addCase(fetchStudentsList.rejected, (state, action) => {
            state.students.loading = false
            state.students.error = action.payload || 'Failed to load students'
        })

        // Students - ban
        builder.addCase(banStudentById.fulfilled, (state, action) => {
            const { studentId, isBanned } = action.payload
            const idx = state.students.items.findIndex((i) => String(i.id) === String(studentId))
            if (idx !== -1) {
                state.students.items[idx] = { ...state.students.items[idx], isBanned }
            }
        })

        // Students - delete
        builder.addCase(deleteStudentById.fulfilled, (state, action) => {
            const { studentId } = action.payload
            state.students.items = state.students.items.filter((i) => String(i.id) !== String(studentId))
        })

        // Teachers - fetch
        builder.addCase(fetchTeachersList.pending, (state) => {
            state.teachers.loading = true
            state.teachers.error = null
        })
        builder.addCase(fetchTeachersList.fulfilled, (state, action) => {
            state.teachers.loading = false
            const payload = action.payload || {}
            const raw = Array.isArray(payload)
                ? payload
                : (payload.data || payload.teachers || payload.items || [])
            state.teachers.items = raw.map((item) => ({
                ...item,
                id: item._id || item.id,
                name: item.name,
                email: item.email,
                isBanned: !!item.isBanned,
            }))
            state.teachers.loadedOnce = true
            state.teachers.total = payload.pagination?.total || payload.total || raw.length
            state.teachers.page = payload.pagination?.page || payload.page || 1
            state.teachers.limit = payload.pagination?.limit || payload.limit || state.teachers.limit
        })
        builder.addCase(fetchTeachersList.rejected, (state, action) => {
            state.teachers.loading = false
            state.teachers.error = action.payload || 'Failed to load teachers'
        })

        // Teachers - ban
        builder.addCase(banTeacherById.fulfilled, (state, action) => {
            const { teacherId, isBanned } = action.payload
            const idx = state.teachers.items.findIndex((i) => String(i.id) === String(teacherId))
            if (idx !== -1) {
                state.teachers.items[idx] = { ...state.teachers.items[idx], isBanned }
            }
        })

        // Teachers - delete
        builder.addCase(deleteTeacherById.fulfilled, (state, action) => {
            const { teacherId } = action.payload
            state.teachers.items = state.teachers.items.filter((i) => String(i.id) !== String(teacherId))
        })
    },
})

export default usersSlice.reducer

// Selectors
export const selectStudents = (state) => state.users.students.items
export const selectStudentsLoading = (state) => state.users.students.loading
export const selectStudentsError = (state) => state.users.students.error
export const selectStudentsLoadedOnce = (state) => state.users.students.loadedOnce

export const selectTeachers = (state) => state.users.teachers.items
export const selectTeachersLoading = (state) => state.users.teachers.loading
export const selectTeachersError = (state) => state.users.teachers.error
export const selectTeachersLoadedOnce = (state) => state.users.teachers.loadedOnce



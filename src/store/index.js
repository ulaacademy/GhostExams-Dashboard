import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/api/auth'
import usersReducer from './usersSlice'
import plansReducer from './plansSlice'
import subscriptionsReducer from './subscriptionsSlice'
import analyticsReducer from './analyticsSlice'
import studentPlansReducer from './studentPlansSlice'
import studentSubscriptionsReducer from './studentSubscriptionsSlice'



const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        users: usersReducer,
        plans: plansReducer,
        subscriptions: subscriptionsReducer,
        analytics: analyticsReducer,
        studentPlans: studentPlansReducer,

        // ✅ الجديد
        studentSubscriptions: studentSubscriptionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});

export default store



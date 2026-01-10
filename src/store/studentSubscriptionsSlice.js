import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchStudentSubscriptions as apiFetchStudentSubscriptions,
  activateStudentSubscription as apiActivateStudentSubscription,
  deactivateStudentSubscription as apiDeactivateStudentSubscription,
  renewStudentSubscription as apiRenewStudentSubscription,
  updateStudentPaymentStatus as apiUpdateStudentPaymentStatus,
} from "@/api/studentSubscription";

export const fetchStudentSubscriptionsList = createAsyncThunk(
  "studentSubscriptions/fetchStudentSubscriptionsList",
  async (params, { rejectWithValue }) => {
    try {
      const data = await apiFetchStudentSubscriptions(params || {});
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const activateStudentSubscriptionThunk = createAsyncThunk(
  "studentSubscriptions/activateStudentSubscription",
  async ({ subscriptionId, data }, { rejectWithValue }) => {
    try {
      const result = await apiActivateStudentSubscription(subscriptionId, data || {});
      return { subscriptionId, data: result };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deactivateStudentSubscriptionThunk = createAsyncThunk(
  "studentSubscriptions/deactivateStudentSubscription",
  async ({ subscriptionId, data }, { rejectWithValue }) => {
    try {
      const result = await apiDeactivateStudentSubscription(subscriptionId, data || {});
      return { subscriptionId, data: result };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const renewStudentSubscriptionThunk = createAsyncThunk(
  "studentSubscriptions/renewStudentSubscription",
  async ({ subscriptionId, data }, { rejectWithValue }) => {
    try {
      const result = await apiRenewStudentSubscription(subscriptionId, data || {});
      return { subscriptionId, data: result };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateStudentPaymentStatusThunk = createAsyncThunk(
  "studentSubscriptions/updateStudentPaymentStatus",
  async ({ subscriptionId, data }, { rejectWithValue }) => {
    try {
      const result = await apiUpdateStudentPaymentStatus(subscriptionId, data || {});
      return { subscriptionId, data: result };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const initialListState = { items: [], loading: false, error: null, loadedOnce: false, total: 0, page: 1, limit: 10 };

const initialState = {
  studentSubscriptions: { ...initialListState },
};

const slice = createSlice({
  name: "studentSubscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudentSubscriptionsList.pending, (state) => {
      state.studentSubscriptions.loading = true;
      state.studentSubscriptions.error = null;
    });

    builder.addCase(fetchStudentSubscriptionsList.fulfilled, (state, action) => {
      state.studentSubscriptions.loading = false;
      const payload = action.payload || {};

      let raw = [];
      if (Array.isArray(payload)) raw = payload;
      else if (payload.data && Array.isArray(payload.data)) raw = payload.data;
      else if (payload.items && Array.isArray(payload.items)) raw = payload.items;

      state.studentSubscriptions.items = raw.map((item) => {
        const studentId = typeof item.studentId === "object" ? item.studentId?._id : item.studentId;
        const studentName =
          typeof item.studentId === "object"
            ? (item.studentId?.name || item.studentId?.fullName || item.studentId?.email)
            : (item.studentName || studentId);

        const planId = typeof item.planId === "object" ? item.planId?._id : item.planId;
        const planName = typeof item.planId === "object" ? item.planId?.name : (item.planSnapshot?.name || item.planName || planId);

        return {
          id: item.id ?? item._id,
          studentId,
          studentName,
          planId,
          planName,
          status: item.status,
          paymentStatus: item.paymentStatus,
          startDate: item.startDate,
          endDate: item.endDate,
          notes: item.notes,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          ...item,
        };
      });

      state.studentSubscriptions.loadedOnce = true;
      state.studentSubscriptions.total = payload.total ?? raw.length;
      state.studentSubscriptions.page = payload.page ?? 1;
      state.studentSubscriptions.limit = payload.limit ?? state.studentSubscriptions.limit;
    });

    builder.addCase(fetchStudentSubscriptionsList.rejected, (state, action) => {
      state.studentSubscriptions.loading = false;
      state.studentSubscriptions.error = action.payload || "Failed to load student subscriptions";
    });

    // updates
    const updateItem = (state, subscriptionId, patch = {}) => {
      const idx = state.studentSubscriptions.items.findIndex((i) => String(i.id) === String(subscriptionId));
      if (idx !== -1) state.studentSubscriptions.items[idx] = { ...state.studentSubscriptions.items[idx], ...patch };
    };

    builder.addCase(activateStudentSubscriptionThunk.fulfilled, (state, action) => {
      updateItem(state, action.payload.subscriptionId, { ...action.payload.data, status: "active", paymentStatus: "paid" });
    });

    builder.addCase(deactivateStudentSubscriptionThunk.fulfilled, (state, action) => {
      updateItem(state, action.payload.subscriptionId, { ...action.payload.data, status: "canceled" });
    });

    builder.addCase(renewStudentSubscriptionThunk.fulfilled, (state, action) => {
      updateItem(state, action.payload.subscriptionId, { ...action.payload.data });
    });

    builder.addCase(updateStudentPaymentStatusThunk.fulfilled, (state, action) => {
      updateItem(state, action.payload.subscriptionId, { ...action.payload.data });
    });
  },
});

export default slice.reducer;

export const selectStudentSubscriptions = (state) => state.studentSubscriptions.studentSubscriptions.items;
export const selectStudentSubscriptionsLoading = (state) => state.studentSubscriptions.studentSubscriptions.loading;
export const selectStudentSubscriptionsTotal = (state) => state.studentSubscriptions.studentSubscriptions.total;

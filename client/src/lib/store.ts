import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../features/auth/authApi";
import authReducer, { logout } from "../features/auth/authSlice";
import { companyApi } from "../features/company/companyApi";
import { candidateProfileApi } from "../features/profile/candidateProfileApi";
import { userApi } from "../features/profile/userApi";
import { resumeApi } from "../features/profile/resumeApi";
import { jobApi } from "../features/job/jobApi";
import { applicationApi } from "../features/application/applicationApi";

const resetApiOnLogout =
  (api: { dispatch: (action: any) => void }) =>
  (next: (action: any) => void) =>
  (action: any) => {
    if (action.type === logout.type) {
      api.dispatch(authApi.util.resetApiState());
      api.dispatch(userApi.util.resetApiState());
      api.dispatch(companyApi.util.resetApiState());
      api.dispatch(candidateProfileApi.util.resetApiState());
      api.dispatch(resumeApi.util.resetApiState());
      api.dispatch(jobApi.util.resetApiState());
      api.dispatch(applicationApi.util.resetApiState());
    }
    return next(action);
  };

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [candidateProfileApi.reducerPath]: candidateProfileApi.reducer,
    [resumeApi.reducerPath]: resumeApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        authApi.middleware,
        userApi.middleware,
        companyApi.middleware,
        candidateProfileApi.middleware,
        resumeApi.middleware,
        jobApi.middleware,
        applicationApi.middleware
      )
      .prepend(resetApiOnLogout),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

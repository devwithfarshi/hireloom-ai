import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { useGetMeQuery } from "../authApi";
import { logout, setUser } from "../authSlice";

export const useAuth = () => {
  const { user, token, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const { data, error, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error && isAuthenticated) {
      // If we get an error while authenticated, log the user out
      dispatch(logout());
    }
  }, [error, isAuthenticated, dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  };
};

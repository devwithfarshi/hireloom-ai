import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useGetMeQuery } from '../authApi';
import { setUser, logout } from '../authSlice';

export const useAuth = () => {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const { data, error, isLoading } = useGetMeQuery(undefined, {
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
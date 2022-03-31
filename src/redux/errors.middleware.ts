import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { Response } from './types/redux.types';
import toast from 'react-hot-toast';

export const ToastErrorsMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { payload } = action;

    if ([400, 401, 500, 403].includes(payload.status)) {
      const { message } = payload.data as Response<any>;
      if (message) toast.error(message);
    }
  }

  return next(action);
};

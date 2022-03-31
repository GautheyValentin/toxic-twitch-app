import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from '@shared/utils/local.storage.utils';
import { useDispatch } from 'react-redux';
import { ToastErrorsMiddleware } from './errors.middleware';
import { twitchReducer, twitchReducerPath } from './slices/twitch.slice';
import { userReducer, userReducerPath } from './slices/users.slice';

let previousLocalStorage = loadState(userReducerPath);

const store = configureStore({
  reducer: {
    [userReducerPath]: userReducer,
    [twitchReducerPath]: twitchReducer,
  },
  preloadedState: {
    [userReducerPath]: {
      users: previousLocalStorage || [],
      messages: [],
      status: `CLOSED`,
      channel: ``,
      channelConnected: ``,
    },
  },
  middleware: (getDefaultMiddleware: any) => {
    const allMiddleware: any[] = [ToastErrorsMiddleware];
    return getDefaultMiddleware().concat(...allMiddleware);
  },
});

store.subscribe(() => {
  const currentValue = store.getState()[userReducerPath].users;
  if (currentValue !== previousLocalStorage) {
    saveState({
      key: userReducerPath,
      value: currentValue,
    });
    previousLocalStorage = currentValue;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;

import { GetUserFromTokenPayload } from '@redux/gql/twitch.gql';
import { Message, User } from '@redux/types/app.types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestGQLTwitch } from '@shared/utils/redux.utils';
import toast from 'react-hot-toast';

export interface UserState {
  users: User[];
  messages: Message[];
  status: string;
  channel?: string;
  channelConnected?: string;
}

const initialState: UserState = {
  users: [],
  messages: [],
  status: `CLOSED`,
  channel: ``,
  channelConnected: ``,
};

export const addUser = createAsyncThunk(
  `users/addUser`,
  async (token: string) => {
    const {
      data: {
        data: { currentUser },
      },
    } = await RequestGQLTwitch(GetUserFromTokenPayload(`gotaga`), token);

    return {
      id: currentUser.id,
      displayName: currentUser.login,
      token,
    };
  },
);

export const userSlice = createSlice({
  name: `users`,
  initialState,
  extraReducers: (builder) => {
    builder.addCase(
      addUser.fulfilled,
      (states, action: PayloadAction<User>) => {
        if (states.users.find((v) => v.id === action.payload.id)) return;
        return {
          ...states,
          users: [...states.users, action.payload],
        };
      },
    );
    builder.addCase(addUser.rejected, (state, action) => {
      toast.error(action.error.message || `Unknow error`);
    });
  },
  reducers: {
    updateStatus: (
      state,
      action: PayloadAction<{
        status: string;
        channelConnected: string;
      }>,
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const previous =
        state.messages.length > 50 ? state.messages.slice(1) : state.messages;
      return {
        ...state,
        messages: [...previous, action.payload],
      };
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        users: state.users.filter((v) => v.id !== action.payload),
      };
    },
    clearMessage: (state, action: PayloadAction<void>) => {
      return {
        ...state,
        messages: [],
      };
    },
    setChannel: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        channel: action.payload,
      };
    },
  },
});

export const {
  deleteUser,
  addMessage,
  updateStatus,
  clearMessage,
  setChannel,
} = userSlice.actions;

export const { name: userReducerPath, reducer: userReducer } = userSlice;

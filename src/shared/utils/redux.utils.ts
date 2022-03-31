import { Dispatch } from '@reduxjs/toolkit';
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { TWITCH_CLIENT_ID, TWITCH_GQL_URL } from '@shared/constant';
import axios from 'axios';
import toast from 'react-hot-toast';

export const baseQuery = fetchBaseQuery({
  baseUrl: `https://gql.twitch.tv/gql`,
  prepareHeaders: (headers: Headers) => {
    headers.set(`Client-ID`, TWITCH_CLIENT_ID);
    return headers;
  },
});

export function createTransformResponseToast<T>(
  message?: string,
): (response: T) => T {
  return function <T>(response: T): T {
    if (`error` in response) {
      const { error } = response as unknown as { error: string };
      if (!error && message) toast.success(message);
    }

    return response;
  };
}

type FunctionDispatch = (dispatch: Dispatch) => any;

export function QueryStartedMiddleware(...fns: FunctionDispatch[]) {
  return async (
    _: any,
    {
      dispatch,
      queryFulfilled,
    }: { dispatch: Dispatch; queryFulfilled: Promise<any> },
  ) => {
    await queryFulfilled;
    fns.forEach((fn) => fn(dispatch));
  };
}

export function RequestGQLTwitch(payload: any, token: string): Promise<any> {
  return axios.post(TWITCH_GQL_URL, payload, {
    headers: {
      Authorization: `OAuth ${token}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  });
}

export function GenerateHex(size: number) {
  return [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join(``);
}

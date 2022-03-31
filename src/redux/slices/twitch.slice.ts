import {
  CreateRaidPayload,
  FollowUserPayload,
  GetRequestIdPayload,
  GetRewardsPayload,
  LaunchRaidPayload,
  RedeemRewardPayload,
} from '@redux/gql/twitch.gql';
import { IRedeem, IReward, TwitchPayload } from '@redux/types/app.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestGQLTwitch } from '@shared/utils/redux.utils';
import axios from 'axios';
import toast from 'react-hot-toast';

const GetUserId = async (username: string) => {
  const {
    data: { id },
  } = await axios.get(`https://api.ivr.fi/twitch/resolve/${username}`);
  return id;
};

export const followTwitch = createAsyncThunk(
  `twitch/follow`,
  async (payload: TwitchPayload, api) => {
    const id = await GetUserId(payload.channel);
    await RequestGQLTwitch(FollowUserPayload(id), payload.user.token);
  },
);

export const getRewardsTwitch = createAsyncThunk(
  `twitch/rewards`,
  async (payload: TwitchPayload, api) => {
    const {
      data: {
        data: {
          community: { channel },
        },
      },
    } = await RequestGQLTwitch(
      GetRewardsPayload(payload.channel),
      payload.user.token,
    );

    return {
      rewards: channel.communityPointsSettings.customRewards,
      channelId: channel.id,
      balance: channel.self.communityPoints.balance,
    };
  },
);

export const getRequestIdTwitch = createAsyncThunk(
  `twitch/requestId`,
  async (payload: TwitchPayload, api) => {
    const {
      data: {
        extensions: { requestID },
      },
    } = await RequestGQLTwitch(
      GetRequestIdPayload(payload.channel),
      payload.user.token,
    );

    return {
      requestId: requestID,
    };
  },
);

export const redeemRewardTwitch = createAsyncThunk(
  `twitch/redeem`,
  async (payload: TwitchPayload & { redeem: IRedeem }, api) => {
    await RequestGQLTwitch(
      RedeemRewardPayload(payload.channel, payload.redeem),
      payload.user.token,
    );
  },
);

export const raidTwitch = createAsyncThunk(
  `twitch/raid`,
  async (payload: TwitchPayload, api) => {
    const id = await GetUserId(payload.channel);
    await RequestGQLTwitch(
      CreateRaidPayload(payload.user.id, id),
      payload.user.token,
    );

    await new Promise((resolve, reject) =>
      setTimeout(async () => {
        await RequestGQLTwitch(
          LaunchRaidPayload(payload.user.id),
          payload.user.token,
        );
        resolve(`ok`);
      }, 11000),
    );
  },
);

interface InitialStates {
  rewards: IReward[];
  channelId?: string;
  requestId?: string;
  balance?: number;
}

const initialState: InitialStates = {
  rewards: [],
};

export const twitchSlice = createSlice({
  name: `twitch`,
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getRequestIdTwitch.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    });
    builder.addCase(getRequestIdTwitch.rejected, (state, action) => {
      toast.error(action.error.message || `Failed to fetch request id`);
    });
    builder.addCase(getRewardsTwitch.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    });
    builder.addCase(getRewardsTwitch.rejected, (state, action) => {
      toast.error(action.error.message || `Failed to fetch rewards`);
    });
    builder.addCase(followTwitch.fulfilled, (state, action) => {
      toast.success(`Followed`);
    });
    builder.addCase(followTwitch.rejected, (state, action) => {
      toast.error(action.error.message || `Follow: Unknow error`);
    });
    builder.addCase(raidTwitch.fulfilled, (state, action) => {
      toast.success(`Raided`);
    });
    builder.addCase(raidTwitch.rejected, (state, action) => {
      toast.error(action.error.message || `Raid: Unknow error`);
    });
    builder.addCase(redeemRewardTwitch.fulfilled, (state, action) => {
      toast.success(`Redeemed`);
    });
    builder.addCase(redeemRewardTwitch.rejected, (state, action) => {
      toast.error(action.error.message || `Redeem error`);
    });
  },
  reducers: {},
});

export const { name: twitchReducerPath, reducer: twitchReducer } = twitchSlice;

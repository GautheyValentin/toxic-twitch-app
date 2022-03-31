import { ChatUserstate } from 'tmi.js';

export interface User {
  id: string;
  displayName: string;
  token: string;
}

export interface Message {
  user?: ChatUserstate;
  message: string;
  isError?: boolean;
}

export interface TwitchPayload {
  user: User;
  channel: string;
}

export interface IReward {
  id: string;
  backgroundColor: string;
  cooldownExpiresAt?: any;
  cost: number;
  defaultImage: ITwitchImage;
  image: ITwitchImage;
  maxPerStreamSetting: MaxPerStreamSetting;
  maxPerUserPerStreamSetting: MaxPerUserPerStreamSetting;
  globalCooldownSetting: GlobalCooldownSetting;
  isEnabled: boolean;
  isInStock: boolean;
  isPaused: boolean;
  isSubOnly: boolean;
  isUserInputRequired: boolean;
  shouldRedemptionsSkipRequestQueue: boolean;
  redemptionsRedeemedCurrentStream?: any;
  prompt?: any;
  title: string;
  updatedForIndicatorAt: string;
}

export interface ITwitchImage {
  url: string;
  url2x: string;
  url4x: string;
}

export interface MaxPerUserPerStreamSetting {
  isEnabled: boolean;
  maxPerUserPerStream: number;
}

export interface MaxPerStreamSetting {
  isEnabled: boolean;
  maxPerStream: number;
}

export interface GlobalCooldownSetting {
  isEnabled: boolean;
  globalCooldownSeconds: number;
}

export interface IRedeem {
  rewardID: string;
  cost: number;
  title: string;
  textInput?: string;
  prompt?: string;
}

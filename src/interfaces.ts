export interface ICustomReward {
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
}

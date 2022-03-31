import { IRedeem } from '@redux/types/app.types';
import { GenerateHex } from '@shared/utils/redux.utils';

export const GetUserFromTokenPayload = (username: string) => ({
  operationName: `PlayerTrackingContextQuery`,
  variables: {
    channel: username,
    isLive: true,
    hasCollection: false,
    collectionID: ``,
    videoID: ``,
    hasVideo: false,
    slug: ``,
    hasClip: false,
  },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: `3fbf508886ff5e008cb94047acc752aad7428c07b6055995604de16c4b01160a`,
    },
  },
});

export const FollowUserPayload = (targetID: string) => ({
  extensions: {
    persistedQuery: {
      sha256Hash: `800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08`,
      version: 1,
    },
  },
  operationName: `FollowButton_FollowUser`,
  variables: {
    input: {
      disableNotifications: false,
      targetID: targetID,
    },
  },
});

export const CreateRaidPayload = (sourceID: string, targetID: string) => ({
  operationName: `chatCreateRaid`,
  variables: { input: { sourceID, targetID } },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: `f4fc7ac482599d81dfb6aa37100923c8c9edeea9ca2be854102a6339197f840a`,
    },
  },
});

export const LaunchRaidPayload = (sourceID: string) => ({
  operationName: `GoRaid`,
  variables: { input: { sourceID } },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: `878ca88bed0c5a5f0687ad07562cffc0bf6a3136f15e5015c0f5f5f7f367f70a`,
    },
  },
});

export const GetRewardsPayload = (channelLogin: string) => ({
  operationName: `ChannelPointsContext`,
  variables: {
    channelLogin,
    includeGoalTypes: [`CREATOR`, `BOOST`],
  },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: `1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024`,
    },
  },
});

export const GetRequestIdPayload = (channelID: string) => ({
  operationName: `UpdateCommunityPointsLastViewedContent`,
  variables: {
    input: {
      channelID,
      viewedContent: [`AUTOMATIC_REWARD`, `CUSTOM_REWARD`],
    },
  },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: `ae490fa8c1c284f6da9e43f0e7b6418100d887de8dd62ef2a08e320b8b75c1cf`,
    },
  },
});

export const RedeemRewardPayload = (channelID: string, redeem: IRedeem) => ({
  operationName: `RedeemCustomReward`,
  variables: {
    input: {
      channelID,
      transactionID: GenerateHex(32),
      ...redeem,
    },
  },
  extensions: {
    persistedQuery: {
      version: 1,
      sha256Hash: `d56249a7adb4978898ea3412e196688d4ac3cea1c0c2dfd65561d229ea5dcc42`,
    },
  },
});

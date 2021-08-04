import axios from 'axios';
import crypto from 'crypto';
import { ICustomReward, IRedeem } from './interfaces';

const TWITCH_API = 'https://gql.twitch.tv/gql';

export interface ITwithRequest {
  headers: {
    'Client-ID': string;
    'Authorization': string;
  }
}

class TwitchRequest {
  private config: ITwithRequest;

  private channel: string;

  private channelId: string | null = null;

  constructor(channel: string, config: ITwithRequest) {
    this.channel = channel;
    this.config = config;
  }

  public async GetRedemption(): Promise<{ rewards: ICustomReward[], requestID: string }> {
    const res = await axios.post(
      TWITCH_API,
      [
        {
          operationName: 'ChannelPointsContext',
          variables: {
            channelLogin: this.channel,
            includeGoalTypes: [
              'CREATOR',
              'BOOST',
            ],
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash: '1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024',
            },
          },
        },
      ],
      this.config,
    );

    const [twitchApi] = res.data;

    const redemption = twitchApi?.data?.community?.channel?.communityPointsSettings?.customRewards;

    this.channelId = twitchApi?.data?.community?.channel?.id;

    return {
      rewards: redemption,
      requestID: twitchApi?.extensions?.requestID,
    };
  }

  public async UpdateRequestId(): Promise<string | null> {
    const res = await axios.post(
      TWITCH_API,
      [
        {
          operationName: 'UpdateCommunityPointsLastViewedContent',
          variables: {
            input: {
              channelID: this.channelId,
              viewedContent: [
                'AUTOMATIC_REWARD',
                'CUSTOM_REWARD',
              ],
            },
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash: 'ae490fa8c1c284f6da9e43f0e7b6418100d887de8dd62ef2a08e320b8b75c1cf',
            },
          },
        },
      ],
      this.config,
    );

    const [twitchApi] = res.data;

    return twitchApi?.extensions?.requestID;
  }

  public async RedeemReward(redeem: IRedeem): Promise<void> {
    await axios.post(
      TWITCH_API,
      [
        {
          operationName: 'RedeemCustomReward',
          variables: {
            input: {
              channelID: this.channelId,
              transactionID: crypto.randomBytes(32).toString('hex'),
              ...redeem,
            },
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash: 'd56249a7adb4978898ea3412e196688d4ac3cea1c0c2dfd65561d229ea5dcc42',
            },
          },
        },
      ],
      this.config,
    );
  }
}

export default TwitchRequest;

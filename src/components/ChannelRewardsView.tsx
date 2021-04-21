import React, { useEffect, useState } from 'react';
import TwitchRequest from '../TwitchRequest';
import { GetAuthorization, GetClientId } from '../utils/storage';
import Reward from './Reward';
import { ReactComponent as Name } from '../assets/signature-solid.svg';
import { ReactComponent as Money } from '../assets/money-bill-wave-solid.svg';
import { ReactComponent as Refresh } from '../assets/redo-solid.svg';
import { ICustomReward } from '../interfaces';

enum SORT {
  NONE = 'NONE',
  PRICE = 'PRICE',
  PRICE_REVERSE = 'PRICE',
  NAME = 'NAME',
  NAME_REVERSE = 'NAME_REVERSE',
}

const ChannelRewardsView = ({ channel }: { channel: string }) => {
  const getTwitch = () => new TwitchRequest(channel, {
    headers: {
      'Client-ID': GetClientId(),
      Authorization: GetAuthorization(),
    },
  });

  const [sort, setSort] = useState<SORT>(SORT.NONE);

  const [twitch, setTwitch] = useState(getTwitch());

  const [rewards, setRewards] = useState<ICustomReward[]>([]);

  const refreshRewards = async () => {
    const data = await twitch.GetRedemption();
    setRewards(data.rewards);
  };

  useEffect(() => {
    setTwitch(getTwitch());
  }, [channel]);

  useEffect(() => {
    refreshRewards();
  }, [twitch]);

  const sortTable = (localRewards: ICustomReward[]) => {
    switch (sort) {
      case SORT.NAME:
        return localRewards.sort((a: any, b: any) => a.title.localeCompare(b.title));
      case SORT.PRICE:
        return localRewards.sort((a: any, b: any) => {
          if (a.cost < b.cost) return -1;
          if (a.cost > b.cost) return 1;
          return 0;
        });
      default:
        return rewards;
    }
  };

  const rClick = async (rewardId: string) => {
    const reward: any | undefined = rewards.find((value: ICustomReward) => value.id === rewardId);

    if (!reward) return;

    await twitch.RedeemReward({
      rewardID: rewardId,
      title: reward.title,
      cost: reward.cost,
    });
  };

  return (
    <>
      <div className="flex w-full justify-end space-x-4">
        <button type="button" onClick={() => setSort(SORT.NAME)} className="btn-primary">
          <Name width="20" height="20" />
        </button>
        <button type="button" onClick={() => setSort(SORT.PRICE)} className="btn-primary">
          <Money width="20" height="20" />
        </button>
        <button type="button" onClick={refreshRewards} className="btn-primary">
          <Refresh width="15" height="15" />
        </button>
      </div>
      <div className="flex flex-wrap w-full mt-10">
        {sortTable(rewards).map((v: ICustomReward) => (
          <Reward
            key={v.id}
            reward={v}
            onClick={rClick}
          />
        ))}
      </div>
    </>
  );
};

export default ChannelRewardsView;

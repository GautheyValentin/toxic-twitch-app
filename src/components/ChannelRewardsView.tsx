import React, { ChangeEvent, useEffect, useState } from 'react';
import Reward from './Reward';
import { IReward, User } from '@redux/types/app.types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRewardsTwitch,
  redeemRewardTwitch,
} from '@redux/slices/twitch.slice';
import { RootState } from '@redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faA, faMoneyBill, faRefresh } from '@fortawesome/free-solid-svg-icons';

enum SORT {
  NONE = `NONE`,
  PRICE = `PRICE`,
  PRICE_REVERSE = `PRICE`,
  NAME = `NAME`,
  NAME_REVERSE = `NAME_REVERSE`,
}

const ChannelRewardsView = ({
  channel,
  user,
}: {
  channel: string;
  user: User;
}) => {
  const dispatch = useDispatch();
  const { rewards, channelId, balance } = useSelector(
    (state: RootState) => state.twitch,
  );

  useEffect(() => {
    dispatch(
      getRewardsTwitch({
        user,
        channel,
      }),
    );
    const refInterval = setInterval(() => {
      dispatch(
        getRewardsTwitch({
          user,
          channel,
        }),
      );
    }, 2000);
    return () => {
      clearInterval(refInterval);
    };
  }, [user, channel, dispatch]);

  const [sort, setSort] = useState<SORT>(SORT.NONE);
  const [numberOfRequest, setNumberOfRequest] = useState<number>(1);

  const getTableSorted = (rewards: IReward[]) => {
    switch (sort) {
      case SORT.NAME:
        return [...rewards].sort((a: any, b: any) =>
          a.title.localeCompare(b.title),
        );
      case SORT.PRICE:
        return [...rewards].sort((a: any, b: any) => {
          if (a.cost < b.cost) return -1;
          if (a.cost > b.cost) return 1;
          return 0;
        });
      default:
        return rewards;
    }
  };

  const refreshReward = () => {
    dispatch(
      getRewardsTwitch({
        user,
        channel,
      }),
    );
  };

  const redeemReward = async (rewardId: string) => {
    const reward: any | undefined = rewards.find(
      (value: IReward) => value.id === rewardId,
    );
    if (!reward || !channelId) return;

    for (let i = 0; i < (numberOfRequest || 1); i += 1) {
      dispatch(
        redeemRewardTwitch({
          user,
          channel: channelId,
          redeem: {
            rewardID: rewardId,
            title: reward.title,
            cost: reward.cost,
            prompt: reward.prompt,
          },
        }),
      );
      await new Promise((resolve: any) => setTimeout(() => resolve(), 50));
    }
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <div className="font-bold text-lg">
          Rewards
          {balance && (
            <span className="ml-2 font-light text-base">{`(Points : ${balance})`}</span>
          )}
        </div>
        <div className="space-x-4">
          <input
            type="number"
            value={numberOfRequest}
            placeholder="Number of request"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNumberOfRequest(Number(e.target.value))
            }
          />
          <button
            type="button"
            onClick={() => setSort(SORT.NAME)}
            className="btn-primary"
          >
            <FontAwesomeIcon icon={faA} />
          </button>
          <button
            type="button"
            onClick={() => setSort(SORT.PRICE)}
            className="btn-primary"
          >
            <FontAwesomeIcon icon={faMoneyBill} />
          </button>
          <button type="button" onClick={refreshReward} className="btn-primary">
            <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap w-full mt-10">
        {getTableSorted(rewards).map((v: IReward) => (
          <Reward id={v.id} key={v.id} reward={v} onClick={redeemReward} />
        ))}
      </div>
    </>
  );
};

export default ChannelRewardsView;

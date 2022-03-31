import { IReward } from '@redux/types/app.types';
import React from 'react';

interface RewardProps {
  reward: IReward;
  // eslint-disable-next-line react/require-default-props
  onClick?: (id: string) => void | Promise<void>;
  id: string;
}

const Reward = ({ reward, onClick, id }: RewardProps) => {
  const preventClick = () => {
    if (onClick) onClick(reward.id);
  };

  return (
    <div
      className="flex flex-col items-center w-22 px-2 mb-4 cursor-pointer transition-all transform hover:scale-95"
      onClick={preventClick}
      aria-hidden="true"
      id={id}
    >
      <div
        className="w-20 h-20 rounded-lg flex flex-col items-center justify-center relative"
        style={{
          backgroundColor: reward.backgroundColor,
        }}
      >
        {reward.image ? (
          <img width="35" height="35" src={reward.image.url4x} alt="icon" />
        ) : (
          <img
            width="35"
            height="35"
            src={reward.defaultImage.url4x}
            alt="icon"
          />
        )}
        <div className="rounded p-1 bg-black bg-opacity-80 text-white text-xs absolute mx-auto bottom-0.5 max-w-max">
          {reward.cost}
        </div>

        {(!reward.isEnabled || reward.isPaused || !reward.isInStock) && (
          <div className="absolute -top-3 left-0 flex w-full justify-center items-center">
            <span className="bg-red-500 rounded text-xs px-1 py-0.5 text-white">
              Disabled
            </span>
          </div>
        )}
      </div>
      <h2 className="text-white text-xs mt-1">{reward.title}</h2>
      <h3 className="text-white mt-1" style={{ fontSize: `0.5rem` }}>
        {id}
      </h3>
    </div>
  );
};

export default Reward;

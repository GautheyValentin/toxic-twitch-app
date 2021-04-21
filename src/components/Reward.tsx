import React from 'react';
import { ICustomReward } from '../interfaces';

interface IReward {
  reward: ICustomReward
  // eslint-disable-next-line react/require-default-props
  onClick?: (id: string) => void | Promise<void>;
}

const Reward = ({ reward, onClick }: IReward) => {
  const preventClick = () => {
    if (onClick) onClick(reward.id);
  };

  return (
    <div
      className="flex flex-col items-center w-22 px-2 mb-4 cursor-pointer transition-all transform hover:scale-95"
      onClick={preventClick}
      aria-hidden="true"
    >
      <div
        className="w-20 h-20 rounded-lg flex flex-col items-center justify-center relative"
        style={{
          backgroundColor: reward.backgroundColor,
          filter: (!reward.isEnabled || reward.isPaused || !reward.isInStock) ? 'grayscale(100%)' : '',
        }}
      >
        {reward.image
          ? <img width="35" height="35" src={reward.image.url4x} alt="icon" />
          : <img width="35" height="35" src={reward.defaultImage.url4x} alt="icon" />}
        <div className="rounded p-1 bg-black bg-opacity-80 text-white text-xs absolute mx-auto bottom-0.5 max-w-max">
          {reward.cost}
        </div>
      </div>
      <h2 className="text-white text-xs mt-1">{reward.title}</h2>
    </div>
  );
};

export default Reward;

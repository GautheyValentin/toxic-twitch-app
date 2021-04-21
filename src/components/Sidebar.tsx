import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Close } from '../assets/times-solid.svg';
import { GetChannels } from '../utils/storage';

interface IProps {
  isOpen: boolean;
  close: () => void;
}

const Sidebar = ({
  isOpen, close,
}: IProps) => {
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    setChannels(GetChannels());
  }, [isOpen]);

  return (
    <div className={`fixed h-full bg-black justify-between flex-col w-4/5 md:w-2/5 xl:w-1/5 py-5 z-10 transition-all flex transform ${isOpen ? '-translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col overflow-auto">
        <div className="flex justify-end px-5">
          <Close className="w-10 h-10 text-white cursor-pointer transition-all transform hover:scale-95" onClick={close} />
        </div>
        <div className="flex flex-col space-y-5 mt-7">
          {channels.map((channel: string) => <Link key={channel} className="link-route" to={`/channel/${channel}`} onClick={close}>{channel}</Link>)}
        </div>

      </div>
      <div className="flex justify-center">
        <Link className="link-route" to="/settings" onClick={close}>Settings</Link>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import {
  HashRouter,
  Switch,
  Route,
  Redirect,
  RouteChildrenProps,
} from 'react-router-dom';
import Settings from './components/Settings';
import ChannelRewardsView from './components/ChannelRewardsView';
import Sidebar from './components/Sidebar';
import { GetChannels } from './utils/storage';
import { ReactComponent as Open } from './assets/bars-solid.svg';

const App = () => {
  const [open, setOpen] = useState(false);
  return (
    <HashRouter>
      <Sidebar isOpen={open} close={() => setOpen(false)} />
      <div className="flex items-center space-x-5 p-5">
        <Open width="20" className="text-white transition-all transform hover:scale-95 cursor-pointer" onClick={() => setOpen(true)} />
        <h1 className="font-medium text-lg text-white uppercase">
          <Switch>
            <Route path="/settings" render={() => 'Settings'} />
            <Route
              path="/channel/:id"
              render={(props: RouteChildrenProps) => {
                if (!props.match) {
                  return <Redirect to="/setting" />;
                }

                const { id } = props.match.params as { id: string };

                return id;
              }}
            />
          </Switch>
        </h1>
      </div>
      <div className="px-5">
        <Switch>

          <Route path="/settings" component={Settings} />
          <Route
            path="/channel/:id"
            render={(props: RouteChildrenProps) => {
              if (!props.match) {
                return <Redirect to="/setting" />;
              }

              const { id } = props.match.params as { id: string };

              return <ChannelRewardsView channel={id} />;
            }}
          />
          <Route
            path="/*"
            render={() => {
              const channels = GetChannels();
              if (channels.length < 1) return <Redirect to="/settings" />;
              return <Redirect to={`/channel/${channels[0]}`} />;
            }}
          />

        </Switch>
      </div>
    </HashRouter>
  );
};
export default App;

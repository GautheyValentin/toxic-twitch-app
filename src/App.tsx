import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserManager from './components/UserManager';

const App = () => {
  return (
    <HashRouter>
      <div className="flex items-center space-x-5 p-5">
        <h1 className="font-bold text-lg">
          <Link to="/">
            <Routes>
              <Route
                path="/users/:userId"
                element={
                  <>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className="ml-2">Return to users list</span>
                  </>
                }
              />
              <Route path="/*" element={<span>Toxic Twitch App</span>} />
            </Routes>
          </Link>
        </h1>
      </div>
      <div className="px-5">
        <Routes>
          <Route path="/users/:userId" element={<Dashboard />} />
          <Route path="/" element={<UserManager />} />
        </Routes>
      </div>
    </HashRouter>
  );
};
export default App;

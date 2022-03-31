import { followTwitch, raidTwitch } from '@redux/slices/twitch.slice';
import { setChannel, userReducerPath } from '@redux/slices/users.slice';
import { RootState } from '@redux/store';
import TchatService from '@shared/services/tchat.service';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelRewardsView from './ChannelRewardsView';
import Tchat from './Tchat';

const Dashboard = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, channel } = useSelector(
    (state: RootState) => state[userReducerPath],
  );

  const user = users.find((v) => v.id === userId);
  if (!user) {
    navigate(`/`);
    return <></>;
  }

  return (
    <div className="p-5">
      <div>
        <span className="font-bold text-lg mr-2">You use :</span>
        <span>{`${user.displayName} | ${user.id} | ${user.token}`}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 items-start">
        <div>
          <div className="bg-gray-800 rounded p-5">
            <Formik
              initialValues={{
                channel: ``,
              }}
              enableReinitialize
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                dispatch(setChannel(values.channel));
                resetForm();
                setSubmitting(false);
              }}
            >
              {({ values, dirty, isSubmitting }) => (
                <Form className="flex flex-col space-y-5">
                  <Field
                    type="text"
                    name="channel"
                    value={values.channel}
                    placeholder="Channel"
                  />
                  <button
                    type="submit"
                    disabled={!dirty || isSubmitting}
                    className="btn-primary"
                  >
                    Connect
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {channel && (
            <div className="grid grid-cols-1 gap-4 items-start mt-5">
              <button
                type="button"
                className="btn-primary"
                onClick={() => dispatch(followTwitch({ user, channel }))}
              >
                {`Follow ${channel}`}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={async () =>
                  TchatService.host(user.displayName, channel)
                }
              >
                {`Host ${channel}`}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  dispatch(
                    raidTwitch({
                      user,
                      channel,
                    }),
                  )
                }
              >
                {`Raid ${channel}`}
              </button>
            </div>
          )}
        </div>

        {channel && (
          <>
            <div className="col-span-2">
              <Tchat user={user} channel={channel} />
            </div>
            <div className="col-span-2 bg-gray-800 rounded p-5">
              <ChannelRewardsView channel={channel} user={user} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

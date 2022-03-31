import { Message, User } from '@redux/types/app.types';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { clearMessage, userReducerPath } from '@redux/slices/users.slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import TchatService from '@shared/services/tchat.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const Tchat = ({ user, channel }: { user: User; channel: string }) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { messages, status, channelConnected } = useSelector(
    (state: RootState) => state[userReducerPath],
  );

  useEffect(() => {
    messageBoxRef?.current?.scroll({ top: messageBoxRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    return () => {
      TchatService.disconnect();
    };
  }, []);

  useEffect(() => {
    TchatService.connect(user);
  }, [user]);

  useEffect(() => {
    TchatService.join(channel);
  }, [channel]);

  const GetColor = () => {
    if (status === `CLOSED`) return `text-red-400`;
    if (status === `OPENING` || status === `CLOSING`) return `text-orange-400`;
    return `text-green-500`;
  };

  return (
    <div className="space-y-5 bg-gray-800 rounded">
      <div className="text-lg font-medium p-5 flex justify-between items-center w-full">
        <div>Messages</div>
        <div>
          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              dispatch(clearMessage());
            }}
          >
            Clear message
          </button>
        </div>
      </div>
      <div className="px-5 space-y-1 h-96 overflow-auto" ref={messageBoxRef}>
        {messages?.map((v: Message, i: number) => {
          const username = v.user?.[`display-name`];
          return (
            <div key={i} className="flex space-x-5">
              {username && <div>{username}</div>}
              <div className={v.isError ? `text-red-500 font-lg` : undefined}>
                {v.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2  p-5">
          <div className="font-bold uppercase">{`Channel: ${channelConnected}`}</div>
          <div className={clsx(`font-bold uppercase text-lg`, GetColor())}>
            <FontAwesomeIcon icon={faCircle} />
            <span className="ml-2">{status}</span>
          </div>
        </div>
        <div className="p-5">
          <Formik
            initialValues={{
              message: ``,
            }}
            enableReinitialize
            onSubmit={(values, { setSubmitting, resetForm }) => {
              TchatService?.say?.(values.message);
              resetForm();
              setSubmitting(false);
            }}
          >
            {({ values, dirty, isSubmitting }) => (
              <Form className="flex flex-col space-y-5">
                <Field
                  type="text"
                  name="message"
                  value={values.message}
                  placeholder="Your message"
                />
                <button
                  type="submit"
                  disabled={!dirty || isSubmitting}
                  className="btn-primary"
                >
                  Send
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Tchat;

import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import {
  AddChannels,
  GetAuthorization, GetChannels, GetClientId, RemoveChannels, SetAuthorization, SetClientId,
} from '../utils/storage';

const Settings = () => {
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    setChannels(GetChannels());
  }, []);

  const addChannel = (channel: string) => {
    setChannels(AddChannels(channel));
  };

  const removeChannel = (channel: string) => {
    setChannels(RemoveChannels(channel));
  };

  return (
    <>
      <div className="max-w-lg w-full bg-gray-700 text-white p-2 rounded">
        <Formik
          initialValues={{
            clientId: GetClientId(),
            authorization: GetAuthorization(),
          }}
          enableReinitialize
          onSubmit={async (values, {
            setSubmitting,
          }) => {
            SetClientId(values.clientId);
            SetAuthorization(values.authorization);
            setSubmitting(false);
          }}
        >
          <Form className="space-y-4">
            <div className="flex flex-col">
              <label>Client ID</label>
              <Field className="custom-input" name="clientId" placeholder="Client ID" />
            </div>

            <div className="flex flex-col">
              <label>Authorization</label>
              <Field className="custom-input" name="authorization" type="password" placeholder="**************" />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary float">Submit</button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="max-w-lg w-full bg-gray-700 text-white p-2 rounded mt-10">
        <Formik
          initialValues={{
            channel: '',
          }}
          enableReinitialize
          onSubmit={async (values, {
            resetForm,
            setSubmitting,
          }) => {
            if (values.channel === '') return;
            addChannel(values.channel);
            setSubmitting(false);
            resetForm();
          }}
        >
          <Form className="space-y-4">
            <div className="flex space-x-4">
              <Field className="custom-input w-full" name="channel" placeholder="Channel Name" />
              <button type="submit" className="btn-primary float">Submit</button>
            </div>
          </Form>
        </Formik>

        <div className="mt-5 flex flex-col">
          {channels.map((channel: string) => (
            <div key={channel} className="flex justify-between">
              <span>{channel}</span>
              <button type="button" onClick={() => removeChannel(channel)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Settings;

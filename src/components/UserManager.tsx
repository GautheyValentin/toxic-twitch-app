import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  addUser,
  deleteUser,
  userReducerPath,
} from '@redux/slices/users.slice';
import { RootState } from '@redux/store';
import { Field, Form, Formik } from 'formik';
import React, { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserManager = () => {
  const { users } = useSelector((state: RootState) => state[userReducerPath]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-5 gap-4 items-start">
      <div className="bg-gray-800 rounded p-5">
        <Formik
          initialValues={{
            token: ``,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            dispatch(addUser(values.token));
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ values, dirty, isSubmitting }) => (
            <Form className="flex flex-col space-y-5">
              <Field
                type="text"
                name="token"
                value={values.token}
                placeholder="OAuth Token"
              />
              <button
                type="submit"
                disabled={!dirty || isSubmitting}
                className="btn-primary"
              >
                Save
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="bg-gray-800 rounded p-5 col-span-4 space-y-2">
        {!!users.length
          ? [...users].reverse().map((v) => (
              <div
                key={v.id}
                className="flex justify-between px-5 py-2 rounded bg-gray-900 hover:bg-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/users/${v.id}`);
                }}
              >
                <div>{v.displayName}</div>
                <div>{v.token}</div>
                <div>
                  <button
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      dispatch(deleteUser(v.id));
                    }}
                    className="text-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          : `No users`}
      </div>
    </div>
  );
};

export default UserManager;

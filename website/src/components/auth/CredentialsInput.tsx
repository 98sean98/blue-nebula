import React, { ChangeEventHandler, FC, HTMLAttributes, useState } from 'react';

import { LoginCredentials } from 'models/auth';

import { LabelledInput } from 'components/shared/actionable';

import { combineClassNames } from 'utilities/functions';

interface CredentialsInputProps extends HTMLAttributes<HTMLFormElement> {
  handleSubmit: (credentials: LoginCredentials) => void;
}

export const CredentialsInput: FC<CredentialsInputProps> = ({
  handleSubmit,
  ...props
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  const onButtonClick = () => handleSubmit(credentials);

  const fields: Array<{ label: string; key: keyof LoginCredentials }> = [
    { label: 'Username', key: 'username' },
    { label: 'Password', key: 'password' },
  ];

  const getOnInputChangeFunction = (
    key: keyof LoginCredentials,
  ): ChangeEventHandler<HTMLInputElement> => (event) =>
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [key]: event.target.value,
    }));

  return (
    <form
      {...props}
      className={combineClassNames('flex flex-col', props.className)}>
      {fields.map(({ label, key }, index) => (
        <LabelledInput
          key={index}
          labelText={label}
          inputProps={{
            className: 'border border-gray-200 rounded p-1',
            value: credentials[key],
            onChange: getOnInputChangeFunction(key),
          }}
          className={index !== 0 ? 'mt-2' : undefined}
        />
      ))}

      <button
        className={'mt-4 btn btn-primary'}
        onClick={onButtonClick}
        type={'submit'}>
        Login
      </button>
    </form>
  );
};

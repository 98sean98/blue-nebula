import React, {
  ChangeEventHandler,
  ComponentProps,
  FC,
  HTMLAttributes,
  MouseEventHandler,
  useState,
} from 'react';

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

  const onButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    handleSubmit(credentials);
  };

  const fields: Array<{
    label: string;
    key: keyof LoginCredentials;
    props?: Partial<ComponentProps<typeof LabelledInput>>;
  }> = [
    { label: 'Username', key: 'username' },
    {
      label: 'Password',
      key: 'password',
      props: { inputProps: { type: 'password' } },
    },
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
      {fields.map(({ label, key, props }, index) => (
        <LabelledInput
          key={index}
          labelText={label}
          {...props}
          inputProps={{
            className: 'border border-gray-200 rounded p-1',
            value: credentials[key],
            onChange: getOnInputChangeFunction(key),
            ...props?.inputProps,
          }}
          className={combineClassNames(
            index !== 0 ? 'mt-2' : '',
            props?.className,
          )}
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

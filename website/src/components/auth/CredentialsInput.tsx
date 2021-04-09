import React, { FC, HTMLAttributes, useState } from 'react';
import { combineClassNames } from '../../utilities/functions';
import { LabelledInput } from '../shared/actionable';

type Credentials = {
  username: string;
  password: string;
};

interface CredentialsInputProps extends HTMLAttributes<HTMLFormElement> {
  handleSubmit: (credentials: Credentials) => void;
}

export const CredentialsInput: FC<CredentialsInputProps> = ({
  handleSubmit,
  ...props
}) => {
  const [credentials] = useState<Credentials>({
    username: '',
    password: '',
  });

  const onButtonClick = () => handleSubmit(credentials);

  return (
    <form
      {...props}
      className={combineClassNames('flex flex-col', props.className)}>
      <LabelledInput
        labelText={'Username'}
        inputProps={{ className: 'border border-gray-200 rounded' }}
        className={'mt-2'}
      />
      <LabelledInput
        labelText={'Password'}
        inputProps={{ className: 'border border-gray-200 rounded' }}
        className={'mt-2'}
      />

      <button className={'mt-4 btn btn-primary'} onClick={onButtonClick}>
        Login
      </button>
    </form>
  );
};

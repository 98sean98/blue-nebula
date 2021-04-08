import React, { FC, HTMLAttributes } from 'react';

interface HelloProps extends HTMLAttributes<HTMLDivElement> {
  run: boolean;
}

export const Hello: FC<HelloProps> = ({ run, ...props }) => {
  return (
    <div {...props} className={`bg-blue-100 p-2 ${props.className}`}>
      <p className={'text-center'}>hello world</p>
    </div>
  );
};

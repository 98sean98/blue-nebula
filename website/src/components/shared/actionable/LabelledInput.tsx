import React, { FC, HTMLAttributes } from 'react';
import { combineClassNames } from '../../../utilities/functions';

interface LabelledInputProps extends HTMLAttributes<HTMLDivElement> {
  labelText: string;
  labelProps?: HTMLAttributes<HTMLLabelElement>;
  inputProps?: HTMLAttributes<HTMLInputElement>;
}

export const LabelledInput: FC<LabelledInputProps> = ({
  labelText,
  labelProps,
  inputProps,
  ...props
}) => {
  return (
    <div
      {...props}
      className={combineClassNames('flex flex-col', props?.className)}>
      <label htmlFor={labelText} {...labelProps}>
        {labelText}
      </label>
      <input id={labelText} {...inputProps} />
    </div>
  );
};

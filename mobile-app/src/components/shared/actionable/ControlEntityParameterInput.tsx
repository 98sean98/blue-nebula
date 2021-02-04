import React, { FC, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { Input, InputProps } from '@ui-kitten/components';

import { parseFromTypeToString } from '@utilities/functions/parse';
import { initialiseValueOfType } from '@utilities/functions/initialiseValueOfType';
import { DeclarableValueType, Value } from '@models/ValueType';

interface ControlEntityParameterInputProps extends InputProps {
  reduxValue: Value;
  onInputBlur: (value: string | undefined) => void;
}

export const ControlEntityParameterInput: FC<ControlEntityParameterInputProps> = ({
  reduxValue,
  onInputBlur,
  onBlur: onHigherBlur,
  ...props
}) => {
  const [value, setValue] = useState<string>(parseFromTypeToString(reduxValue));

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onInputBlur(value);
    if (typeof value === 'undefined' || value === '')
      setValue(
        parseFromTypeToString(
          initialiseValueOfType(
            typeof reduxValue as DeclarableValueType,
          ) as string,
        ),
      );
    if (typeof onHigherBlur !== 'undefined') onHigherBlur(e);
  };

  useEffect(() => setValue(parseFromTypeToString(reduxValue)), [reduxValue]);

  return (
    <Input {...props} value={value} onChangeText={setValue} onBlur={onBlur} />
  );
};

import React, { FC, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { Input, InputProps } from '@ui-kitten/components';

import { DeclarableValueType, Value } from '@models/ValueType';

import { parseFromTypeToString } from '@utilities/functions/parse';
import { initialiseValueOfType } from '@utilities/functions/initialiseValueOfType';

interface ResponsiveInputProps extends InputProps {
  storedValue: Value;
  onInputBlur: (value: string | undefined) => void;
}

export const ResponsiveInput: FC<ResponsiveInputProps> = ({
  storedValue,
  onInputBlur,
  onBlur: onHigherBlur,
  ...props
}) => {
  const [value, setValue] = useState<string>(
    parseFromTypeToString(storedValue),
  );

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onInputBlur(value);
    if (typeof value === 'undefined' || value === '')
      setValue(
        parseFromTypeToString(
          initialiseValueOfType(
            typeof storedValue as DeclarableValueType,
          ) as string,
        ),
      );
    if (typeof onHigherBlur !== 'undefined') onHigherBlur(e);
  };

  useEffect(() => setValue(parseFromTypeToString(storedValue)), [storedValue]);

  return (
    <Input {...props} value={value} onChangeText={setValue} onBlur={onBlur} />
  );
};

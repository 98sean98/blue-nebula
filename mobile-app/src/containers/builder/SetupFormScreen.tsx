import React, { FC, useCallback, useMemo, useState, Fragment } from 'react';
import { Alert, ScrollView, View, ViewProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@ui-kitten/components';
import { EvaStatus } from '@ui-kitten/components/devsupport';
import { camelCase } from 'camel-case';

import { SetupFormScreenProps } from '@navigation/builder';

import { tailwind } from '@styles/tailwind';

import { Setup } from '@models/setup';

import { RootState } from '@reduxApp';
import { removeSetup, setSetups } from '@reduxApp/builder/actions';

import { ResponsiveInput } from '@components/shared/actionable';
import { renderIcon } from '@components/shared/interface';

export const SetupFormScreen: FC<SetupFormScreenProps> = ({
  route,
  navigation,
}) => {
  const { keyOfSetupToBeEdited } = route.params;

  const dispatch = useDispatch();

  const { setups } = useSelector((state: RootState) => state.builder);
  const takenSetupNames = useMemo(
    () => Object.keys(setups).filter((name) => name !== keyOfSetupToBeEdited),
    [keyOfSetupToBeEdited, setups],
  );

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const initialSetup: Setup =
    typeof keyOfSetupToBeEdited !== 'undefined'
      ? setups[keyOfSetupToBeEdited]
      : {
          name: '',
          description: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          fields: {},
          controlEntitiesState: controlEntities,
        };

  const [setup, setSetup] = useState<Setup>(initialSetup);

  const [hasEmptyField, setHasEmptyField] = useState<boolean>(false);
  const [cachedNewField, setCachedNewField] = useState<{
    key: string;
    value: string;
  }>({ key: '', value: '' });

  const onSetupKeyChange = (key: keyof Setup, value: unknown) =>
    setSetup((currentSetup) => ({ ...currentSetup, [key]: value }));

  const onFieldKeyInputChange = useCallback(
    (oldKey: string, newKey: string): void => {
      const { [oldKey]: fieldValue, ...fields } = setup.fields;
      if (
        newKey !== '' &&
        ((fieldValue !== undefined && fieldValue !== '') ||
          cachedNewField.value !== '')
      ) {
        onSetupKeyChange('fields', {
          ...fields,
          [newKey]: fieldValue || cachedNewField.value,
        });
        setHasEmptyField(false);
      } else {
        setCachedNewField({
          key: newKey,
          value: fieldValue ?? cachedNewField.value,
        });
        setHasEmptyField(true);
        onSetupKeyChange('fields', fields);
      }
    },
    [cachedNewField.value, setup.fields],
  );

  const onFieldValueInputChange = useCallback(
    (fieldKey: string, newFieldValue: string): void => {
      if (fieldKey !== '') {
        if (newFieldValue === '') {
          setCachedNewField({ key: fieldKey, value: '' });
          setHasEmptyField(true);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [fieldKey]: oldFieldValue, ...fields } = setup.fields;
          onSetupKeyChange('fields', fields);
        } else {
          onSetupKeyChange('fields', {
            ...setup.fields,
            [fieldKey]: newFieldValue,
          });
          setHasEmptyField(false);
        }
      } else {
        setCachedNewField({ key: '', value: newFieldValue });
        setHasEmptyField(true);
      }
    },
    [setup.fields],
  );

  const onSubmitPress = (updatedName?: string) => {
    const name =
      typeof updatedName !== 'undefined' && updatedName !== ''
        ? updatedName
        : setup.name;
    const newSetupKey = camelCase(name);
    if (!takenSetupNames.includes(newSetupKey)) {
      if (
        typeof keyOfSetupToBeEdited !== 'undefined' &&
        keyOfSetupToBeEdited !== newSetupKey
      )
        dispatch(removeSetup(keyOfSetupToBeEdited));
      dispatch(
        setSetups({ [newSetupKey]: { ...setup, name, updatedAt: new Date() } }),
      );
      if (typeof keyOfSetupToBeEdited !== 'undefined') navigation.goBack();
      else navigation.navigate('Main', { screen: 'DevController' });
    } else {
      Alert.prompt(
        'Duplicated Name',
        'Another setup has the same name as the one you just entered. Please enter a different name.',
        (newName: string) => {
          onSetupKeyChange('name', newName);
          onSubmitPress(newName);
        },
      );
    }
  };

  const renderFieldInputs = useCallback(
    (
      fieldKey: string,
      fieldValue: string,
      viewProps?: ViewProps,
      inputStatus?: EvaStatus,
    ) => (
      <View
        {...viewProps}
        style={[
          tailwind('w-full flex-row justify-between'),
          viewProps?.style ?? {},
        ]}>
        <ResponsiveInput
          status={inputStatus}
          style={{ width: '49%' }}
          label={'Field key'}
          placeholder={'50 characters max'}
          maxLength={50}
          storedValue={fieldKey}
          onInputBlur={(newFieldKey) =>
            onFieldKeyInputChange(fieldKey, newFieldKey ?? '')
          }
        />
        <ResponsiveInput
          status={inputStatus}
          style={{ width: '49%' }}
          label={'Field value'}
          placeholder={'50 characters max'}
          maxLength={50}
          storedValue={fieldValue}
          onInputBlur={(newFieldValue) =>
            onFieldValueInputChange(fieldKey, newFieldValue ?? '')
          }
        />
      </View>
    ),
    [onFieldKeyInputChange, onFieldValueInputChange],
  );

  return (
    <ScrollView style={[{ flex: 1 }, tailwind('my-5 px-4')]}>
      {/* name */}
      <ResponsiveInput
        label={'Name'}
        caption={'A unique name'}
        placeholder={'50 characters max'}
        maxLength={50}
        storedValue={setup.name}
        onInputBlur={(value) => onSetupKeyChange('name', value ?? '')}
      />
      {/* description */}
      <ResponsiveInput
        label={'Description'}
        caption={'Describe what this setup achieves'}
        placeholder={'140 characters max'}
        maxLength={140}
        style={tailwind('mt-3')}
        storedValue={setup.description ?? ''}
        onInputBlur={(value) => onSetupKeyChange('description', value ?? '')}
      />

      {/* fields */}
      <View style={tailwind('mt-3')}>
        {Object.entries(setup.fields).map(([fieldKey, fieldValue], index) => (
          <Fragment key={index}>
            {renderFieldInputs(fieldKey, fieldValue, {
              style: index !== 0 ? tailwind('mt-3') : {},
            })}
          </Fragment>
        ))}
        <View
          style={
            Object.entries(setup.fields).length !== 0 ? tailwind('mt-3') : {}
          }>
          {hasEmptyField ? (
            renderFieldInputs(
              cachedNewField.key,
              cachedNewField.value ?? '',
              {},
              'warning',
            )
          ) : (
            <Button
              accessoryLeft={renderIcon('plus')}
              appearance={'outline'}
              status={'basic'}
              onPress={() => {
                setHasEmptyField(true);
                setCachedNewField({ key: '', value: '' });
              }}>
              Add another field
            </Button>
          )}
        </View>
      </View>

      {setup.name !== '' && setup.name !== undefined ? (
        <Button style={tailwind('mt-4')} onPress={() => onSubmitPress()}>
          Submit
        </Button>
      ) : null}
    </ScrollView>
  );
};

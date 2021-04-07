import React, { FC, useCallback, useMemo, useState, Fragment } from 'react';
import { Alert, ScrollView, View, ViewProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text } from '@ui-kitten/components';
import { EvaStatus } from '@ui-kitten/components/devsupport';

import { SetupFormScreenProps } from '@navigation/builder';

import { tailwind } from '@styles/tailwind';

import { Setup } from '@models/setup';

import { RootState } from '@reduxApp';
import {
  removeSetup,
  setMakerConfig,
  setSetups,
} from '@reduxApp/builder/actions';

import { ResponsiveInput, TimerInput } from '@components/shared/actionable';
import {
  PlatformKeyboardAvoidingView,
  renderIcon,
} from '@components/shared/interface';

import { replaceSetupKeyInActionTree } from '@utilities/functions/app-maker';

export const SetupFormScreen: FC<SetupFormScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const { keyOfSetupToBeEdited } =
    typeof route.params !== 'undefined'
      ? route.params
      : { keyOfSetupToBeEdited: undefined };

  const dispatch = useDispatch();

  const { setups, makerConfig } = useSelector(
    (state: RootState) => state.builder,
  );
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
    const newSetupKey = name;
    if (!takenSetupNames.includes(newSetupKey)) {
      if (
        typeof keyOfSetupToBeEdited !== 'undefined' &&
        keyOfSetupToBeEdited !== newSetupKey
      ) {
        dispatch(removeSetup(keyOfSetupToBeEdited));
        replaceSetupKeyInActionTree(
          makerConfig.actions,
          keyOfSetupToBeEdited,
          newSetupKey,
        );
        dispatch(setMakerConfig({ actions: makerConfig.actions }));
      }
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
    <PlatformKeyboardAvoidingView
      style={{ flex: 1, marginBottom: insets.bottom }}
      keyboardVerticalOffset={80}>
      <ScrollView contentContainerStyle={tailwind('py-5 px-4')}>
        {/* name */}
        <ResponsiveInput
          label={'Name'}
          caption={'A unique name'}
          placeholder={'50 characters max'}
          maxLength={50}
          storedValue={setup.name}
          onInputBlur={(value) => onSetupKeyChange('name', value ?? '')}
        />
        {/* optional description */}
        <ResponsiveInput
          label={'Description'}
          caption={'Describe what this setup achieves'}
          placeholder={'140 characters max'}
          maxLength={140}
          style={tailwind('mt-3')}
          storedValue={setup.description ?? ''}
          onInputBlur={(value) => onSetupKeyChange('description', value ?? '')}
        />
        {/* optional countdown timer */}
        <View style={tailwind('mt-3')}>
          <Text category={'label'} appearance={'hint'}>
            Optional Countdown Timer
          </Text>
          <TimerInput
            value={setup.countdownTimer ?? 0}
            onChange={(value) => {
              console.log({ value });
              onSetupKeyChange(
                'countdownTimer',
                value !== 0 ? value : undefined,
              );
            }}
            style={tailwind('mt-1')}
          />
          <Text category={'c1'} appearance={'hint'} style={tailwind('mt-1')}>
            If set, a countdown timer will appear in the simple controller
            screen, and it will run when a setup is being executed by the robot.
          </Text>
        </View>

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
    </PlatformKeyboardAvoidingView>
  );
};

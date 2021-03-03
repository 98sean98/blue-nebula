import React, { FC, useMemo, useState, Fragment } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Select, IndexPath, SelectItem, Button } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { capitalCase } from 'change-case';
import deepmerge from 'deepmerge';

import { NewControlEntityScreenProps } from '@navigation/builder';

import { tailwind } from '@styles/tailwind';

import { DeclarableValueType, Value } from '@models/ValueType';
import {
  ControlEntityEnum,
  ControlEntity,
  ControlEntities,
  Direction,
  Enable,
} from '@models/control-entity';

import { ResponsiveInput } from '@components/shared/actionable';

import { RootState } from '@reduxApp';
import { setControlEntities } from '@reduxApp/control/actions';

import { getObjectKeys } from '@utilities/functions/objectKeys';
import { mapStringArrayToObject } from '@utilities/functions/map';
import {
  parseFromTypeToString,
  parseStringToType,
} from '@utilities/functions/parse';
import { initialiseValueOfType } from '@utilities/functions/initialiseValueOfType';
import { getKeyboardType } from '@utilities/functions/ui';

const controlEntityTypes = Object.values(ControlEntityEnum);

const emptyNewControlEntities: ControlEntities = {};
controlEntityTypes.forEach((controlEntityType) => {
  const objectKeys = getObjectKeys(controlEntityType);
  const stringArray = objectKeys.map(({ valueType }) =>
    parseFromTypeToString(initialiseValueOfType(valueType)),
  );
  emptyNewControlEntities[controlEntityType] = mapStringArrayToObject(
    stringArray,
    objectKeys,
  ) as ControlEntity;
});

export const NewControlEntityScreen: FC<NewControlEntityScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const takenControlEntityNames = useMemo(() => Object.keys(controlEntities), [
    controlEntities,
  ]);

  const [
    selectedControlEntityTypeIndex,
    setSelectedControlEntityTypeIndex,
  ] = useState<IndexPath>(new IndexPath(0));

  const selectedControlEntityType = useMemo(
    () => controlEntityTypes[selectedControlEntityTypeIndex.row],
    [selectedControlEntityTypeIndex],
  );
  const controlEntityObjectKeys = useMemo(() => {
    const specialKeys = ['direction', 'enable'];
    const ordinary: ReturnType<typeof getObjectKeys> = [],
      special: ReturnType<typeof getObjectKeys> = [];
    getObjectKeys(selectedControlEntityType).forEach((objectKey) =>
      specialKeys.includes(objectKey.key)
        ? special.push(objectKey)
        : ordinary.push(objectKey),
    );
    return { ordinary, special };
  }, [selectedControlEntityType]);

  const [cachedNewControlEntities, setCachedNewControlEntities] = useState<
    ControlEntities
  >(emptyNewControlEntities);

  const getCachedValue = (key: string): Value => {
    try {
      return cachedNewControlEntities[selectedControlEntityType][
        key as keyof ControlEntity
      ];
    } catch (error) {
      return '';
    }
  };

  const onParameterChange = (
    key: string,
    value: string | undefined,
    valueType: DeclarableValueType,
  ) => {
    if (value !== undefined)
      setCachedNewControlEntities((entities) =>
        deepmerge(entities, {
          [selectedControlEntityType]: {
            [key]: parseStringToType(value, valueType),
          },
        }),
      );
  };

  const onSubmitPress = (updatedName?: string) => {
    const newControlEntity =
      cachedNewControlEntities[selectedControlEntityType];
    const name =
      typeof updatedName !== 'undefined' && updatedName !== ''
        ? updatedName
        : newControlEntity.name;
    const newControlEntityKey = name;
    if (!takenControlEntityNames.includes(newControlEntityKey)) {
      dispatch(
        setControlEntities({
          [newControlEntityKey]: {
            ...newControlEntity,
            name,
            type: selectedControlEntityType,
          },
        }),
      );
      navigation.goBack();
    } else {
      Alert.prompt(
        'Duplicated Name',
        'Another control entity has the same name as the one you just entered. Please enter a different name.',
        (newName: string) => {
          onParameterChange('name', newName, 'string');
          onSubmitPress(newName);
        },
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginBottom: insets.bottom }}
      behavior={'padding'}
      keyboardVerticalOffset={90}>
      <ScrollView contentContainerStyle={tailwind('py-5 px-4')}>
        {/* select a control entity type */}
        <Select
          label={'Control Entity Type'}
          value={capitalCase(selectedControlEntityType)}
          selectedIndex={selectedControlEntityTypeIndex}
          onSelect={(index) =>
            setSelectedControlEntityTypeIndex(index as IndexPath)
          }>
          {controlEntityTypes.map((controlEntityType) => (
            <SelectItem
              key={controlEntityType}
              title={capitalCase(controlEntityType)}
            />
          ))}
        </Select>

        {/* object keys */}
        <View>
          {controlEntityObjectKeys.ordinary.map(
            ({ key, valueType, description }) => (
              <ResponsiveInput
                key={key}
                label={capitalCase(key)}
                caption={description}
                storedValue={getCachedValue(key)}
                onInputBlur={(value) =>
                  onParameterChange(key, value, valueType)
                }
                keyboardType={getKeyboardType(valueType)}
                style={tailwind('mt-3')}
              />
            ),
          )}
          {controlEntityObjectKeys.special.map(
            ({ key, valueType, description }) => (
              <Fragment key={key}>
                {key === 'direction' ? (
                  <Select
                    label={capitalCase(key)}
                    caption={description}
                    value={getCachedValue(key) === Direction.CW ? 'CW' : 'CCW'}
                    selectedIndex={
                      getCachedValue(key) === Direction.CW
                        ? new IndexPath(0)
                        : new IndexPath(1)
                    }
                    onSelect={(index) =>
                      onParameterChange(
                        key,
                        ((index as IndexPath).row === 0
                          ? Direction.CW
                          : Direction.CCW
                        ).toString(),
                        valueType,
                      )
                    }
                    style={tailwind('mt-3')}>
                    <SelectItem title={'CW'} />
                    <SelectItem title={'CCW'} />
                  </Select>
                ) : null}
                {key === 'enable' ? (
                  <Select
                    label={capitalCase(key)}
                    caption={description}
                    value={getCachedValue(key) === Enable.Low ? 'Low' : 'High'}
                    selectedIndex={
                      getCachedValue(key) === Enable.Low
                        ? new IndexPath(0)
                        : new IndexPath(1)
                    }
                    onSelect={(index) =>
                      onParameterChange(
                        key,
                        ((index as IndexPath).row === 0
                          ? Enable.Low
                          : Enable.High
                        ).toString(),
                        valueType,
                      )
                    }
                    style={tailwind('mt-3')}>
                    <SelectItem title={'Low'} />
                    <SelectItem title={'High'} />
                  </Select>
                ) : null}
              </Fragment>
            ),
          )}
        </View>

        {/* submit button */}
        {getCachedValue('name') !== '' &&
        getCachedValue('name') !== undefined ? (
          <Button style={tailwind('mt-4')} onPress={() => onSubmitPress()}>
            Submit
          </Button>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

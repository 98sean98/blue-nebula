import React, { FC, useMemo, useState, Fragment } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Select, IndexPath, SelectItem, Button } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { capitalCase, camelCase } from 'change-case';
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

import { ControlEntityParameterInput } from '@components/shared/actionable';

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
  const dispatch = useDispatch();

  const { controlEntities } = useSelector((state: RootState) => state.control);

  const takenControlEntityNames = useMemo(() => Object.keys(controlEntities), [
    controlEntities,
  ]);

  const [selectedControlEntityIndex, setSelectedControlEntityIndex] = useState<
    IndexPath
  >(new IndexPath(0));

  const selectedControlEntity = useMemo(
    () => controlEntityTypes[selectedControlEntityIndex.row],
    [selectedControlEntityIndex],
  );
  const controlEntityObjectKeys = useMemo(() => {
    const specialKeys = ['direction', 'enable'];
    const ordinary: ReturnType<typeof getObjectKeys> = [],
      special: ReturnType<typeof getObjectKeys> = [];
    getObjectKeys(selectedControlEntity).forEach((objectKey) =>
      specialKeys.includes(objectKey.key)
        ? special.push(objectKey)
        : ordinary.push(objectKey),
    );
    return { ordinary, special };
  }, [selectedControlEntity]);

  const [cachedNewControlEntities, setCachedNewControlEntities] = useState<
    ControlEntities
  >(emptyNewControlEntities);

  const getCachedValue = (key: string): Value => {
    try {
      return cachedNewControlEntities[selectedControlEntity][
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
          [selectedControlEntity]: {
            [key]: parseStringToType(value, valueType),
          },
        }),
      );
  };

  const onSubmitPress = (updatedName?: string) => {
    const newControlEntity = cachedNewControlEntities[selectedControlEntity];
    const name = updatedName ?? newControlEntity.name;
    const newControlEntityKey = camelCase(name);
    if (!takenControlEntityNames.includes(newControlEntityKey)) {
      dispatch(
        setControlEntities({
          [newControlEntityKey]: { ...newControlEntity, name },
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
    <ScrollView style={[{ flex: 1 }, tailwind('my-4 px-4')]}>
      {/* select a control entity type */}
      <Select
        label={'Control Entity Type'}
        value={capitalCase(selectedControlEntity)}
        selectedIndex={selectedControlEntityIndex}
        onSelect={(index) => setSelectedControlEntityIndex(index as IndexPath)}>
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
            <ControlEntityParameterInput
              key={key}
              label={capitalCase(key)}
              caption={description}
              reduxValue={getCachedValue(key)}
              onInputBlur={(value) => onParameterChange(key, value, valueType)}
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
      {getCachedValue('name') !== '' && getCachedValue('name') !== undefined ? (
        <Button style={tailwind('mt-4')} onPress={() => onSubmitPress()}>
          Submit
        </Button>
      ) : null}
    </ScrollView>
  );
};

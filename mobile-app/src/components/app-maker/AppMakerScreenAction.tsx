import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  IconProps,
  MenuItem,
  OverflowMenu,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { tailwind } from '@styles/tailwind';

import { RootState } from '@reduxApp';

import { renderIcon } from '@components/shared/interface';

import { useAppMakerContext } from '@utilities/hooks';
import { getBackdropStyle } from '@utilities/functions/ui';
import { AppMakerMode } from '@utilities/context';

interface AppMakerScreenActionProps {
  iconProps?: IconProps;
}

export const AppMakerScreenAction: FC<AppMakerScreenActionProps> = ({
  iconProps,
}) => {
  const theme = useTheme();

  const {
    mode,
    focusedPageIndex,
    createNewPage,
    deletePage,
    toggleActionsCharting,
  } = useAppMakerContext();

  const {
    makerConfig: { pages },
  } = useSelector((state: RootState) => state.builder);

  const pageCount = useMemo(() => Object.keys(pages).length, [pages]);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // todo: build help modal
  const onHelpPress = () => {};

  const onNewPagePress = () => {
    createNewPage(pageCount, true);
    setShowMenu(false);
  };

  const showNewPageAction = useMemo(
    () => mode === AppMakerMode.ContentBuilding && pageCount < 5,
    [mode, pageCount],
  );

  const onDeletePagePress = () => {
    const goToPageIndex =
      focusedPageIndex === 0 || focusedPageIndex < pageCount - 1
        ? undefined
        : pageCount - 2;
    // undefined: no navigation, stay on currently focused page which is being deleted, so the next page is shown
    // pageCount - 2: navigate to the new last page
    deletePage(focusedPageIndex, goToPageIndex);
    setShowMenu(false);
  };

  const showDeletePageAction = useMemo(
    () => mode === AppMakerMode.ContentBuilding && pageCount > 0,
    [mode, pageCount],
  );

  const onActionsChartingPress = () => {
    toggleActionsCharting();
    setShowMenu(false);
  };

  const renderMenuAction = () => (
    <TopNavigationAction
      icon={renderIcon('more-vertical', iconProps)}
      onPress={toggleMenu}
    />
  );

  return (
    <View style={tailwind('flex-row items-center')}>
      <TopNavigationAction
        icon={renderIcon('question-mark-outline', iconProps)}
        onPress={onHelpPress}
      />
      <OverflowMenu
        anchor={renderMenuAction}
        visible={showMenu}
        onBackdropPress={toggleMenu}
        backdropStyle={getBackdropStyle()}>
        {showNewPageAction ? (
          <MenuItem
            accessoryLeft={renderIcon('plus-square-outline', {
              fill: theme['color-primary-default'],
              ...iconProps,
            })}
            title={'Add a new page'}
            onPress={onNewPagePress}
          />
        ) : (
          <></>
        )}
        {showDeletePageAction ? (
          <MenuItem
            accessoryLeft={renderIcon('trash-outline', {
              fill: theme['color-danger-default'],
              ...iconProps,
            })}
            title={'Delete this page'}
            onPress={onDeletePagePress}
          />
        ) : (
          <></>
        )}
        {pageCount > 0 ? (
          mode !== AppMakerMode.ActionsCharting ? (
            <MenuItem
              accessoryLeft={renderIcon('map-outline', {
                fill: theme['color-success-default'],
                ...iconProps,
              })}
              title={'Start charting page actions'}
              onPress={onActionsChartingPress}
            />
          ) : (
            <MenuItem
              accessoryLeft={renderIcon('stop-circle-outline', {
                fill: theme['color-warning-default'],
                ...iconProps,
              })}
              title={'Stop charting page actions'}
              onPress={onActionsChartingPress}
            />
          )
        ) : (
          <></>
        )}
      </OverflowMenu>
    </View>
  );
};

import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  IconProps,
  MenuItem,
  OverflowMenu,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

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
    cachedPages,
    focusedPageIndex,
    createNewPage,
    deletePage,
    resetPages,
    savePagesWithoutUpdatingActions,
    toggleActionsCharting,
  } = useAppMakerContext();

  const pageCount = useMemo(() => Object.keys(cachedPages).length, [
    cachedPages,
  ]);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleMenu = () => setShowMenu(!showMenu);

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
    deletePage(focusedPageIndex);
    setShowMenu(false);
  };

  const showDeletePageAction = useMemo(
    () => mode === AppMakerMode.ContentBuilding && pageCount > 0,
    [mode, pageCount],
  );

  const onRewindPagesChangesPress = () => {
    resetPages(0);
    setShowMenu(false);
  };

  const onSavePagesWithoutUpdatingActionsPress = () => {
    savePagesWithoutUpdatingActions();
    setShowMenu(false);
  };

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
        backdropStyle={getBackdropStyle()}
        style={tailwind('w-56')}>
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
        {mode === AppMakerMode.ContentBuilding ? (
          <>
            <MenuItem
              accessoryLeft={renderIcon('rewind-left-outline', {
                fill: theme['color-warning-default'],
                ...iconProps,
              })}
              title={'Rewind changes to pages'}
              onPress={onRewindPagesChangesPress}
            />
            <MenuItem
              accessoryLeft={renderIcon('save-outline', {
                fill: theme['color-warning-default'],
                ...iconProps,
              })}
              title={'Save pages without updating actions'}
              onPress={onSavePagesWithoutUpdatingActionsPress}
            />
          </>
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

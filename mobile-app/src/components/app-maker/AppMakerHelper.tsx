import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Icon,
  Layout,
  LayoutProps,
  Text,
  useTheme,
} from '@ui-kitten/components';

import { tailwind } from '@styles/tailwind';

interface AppMakerHelperProps extends LayoutProps {}

export const AppMakerHelper: FC<AppMakerHelperProps> = ({ ...props }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    icon: { width: 32, height: 32 },
  });

  return (
    <Layout
      {...props}
      style={[
        tailwind('rounded overflow-hidden px-6 py-5'),
        props?.style ?? {},
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text category={'h4'}>Summary</Text>
        <Text>
          App Maker customises what is rendered on the Simple Controller Screen.
          It shows pressable boxes on each page, and maps actions to saved
          Setups. An action is the action a user presses one of the boxes, and a
          stream of actions (one from each page) tied together forms an action
          tree path. App maker essentially provides a no-code approach for
          developers to design the Simple Controller Screen for ordinary users
          to interact with, thereby controlling their robots.
        </Text>

        <View style={tailwind('mt-4')}>
          <Text category={'h4'}>Content</Text>
          <Text>
            A page contains a layout of pressable boxes. App maker needs a
            minimum of 1 page, and a maximum of 5 pages to operate.
          </Text>
          <View style={tailwind('mt-2 flex flex-row items-center')}>
            <Icon
              style={styles.icon}
              fill={theme['color-primary-default']}
              name={'plus-square-outline'}
            />
            <Text style={tailwind('ml-2 flex-shrink')}>
              Add a new page after the current page.
            </Text>
          </View>
          <View style={tailwind('mt-2 flex flex-row items-center')}>
            <Icon
              style={styles.icon}
              fill={theme['color-danger-default']}
              name={'trash-outline'}
            />
            <Text style={tailwind('ml-2 flex-shrink')}>
              Delete the current page.
            </Text>
          </View>
          <View style={tailwind('mt-2')}>
            <Text>
              Click each box to change the text shown. Click the "Page title"
              text box to change the page title.
            </Text>
            <Text style={tailwind('mt-1')}>
              Swipe the container near the bottom of App Maker upwards to show a
              bunch of options that help customise the currently viewed page. It
              allows control for the page layout design, the number of boxes,
              and the styling of a box.
            </Text>
          </View>
        </View>

        <View style={tailwind('mt-4')}>
          <Text category={'h4'}>Managing Changes</Text>
          <View style={tailwind('mt-2 flex flex-row items-center')}>
            <Icon
              style={styles.icon}
              fill={theme['color-warning-default']}
              name={'rewind-left-outline'}
            />
            <Text style={tailwind('ml-2 flex-shrink')}>
              Rewind the changes made to the content in the pages.
            </Text>
          </View>
          <View style={tailwind('mt-2 flex flex-row items-center')}>
            <Icon
              style={styles.icon}
              fill={theme['color-info-default']}
              name={'save-outline'}
            />
            <Text style={tailwind('ml-2 flex-shrink')}>
              Save the changes made to the pages without updating the action
              tree.
            </Text>
          </View>
        </View>

        <View style={tailwind('mt-4')}>
          <Text category={'h4'}>Charting Actions</Text>
          <Text>
            Chart the action tree to link which pressable boxes (one on each
            page) are linked to a saved Setup.
          </Text>
          <View style={tailwind('mt-2 flex flex-row items-center')}>
            <Icon
              style={styles.icon}
              fill={theme['color-success-default']}
              name={'map-outline'}
            />
            <Text style={tailwind('ml-2 flex-shrink')}>
              Start charting page actions.
            </Text>
          </View>
          <Text style={tailwind('mt-1')}>
            You will be guided to press the boxes in each page, and select a
            saved Setup to be linked.
          </Text>
          <View style={tailwind('mt-2 flex flex-row items-center')}>
            <Icon
              style={styles.icon}
              fill={theme['color-warning-default']}
              name={'stop-circle-outline'}
            />
            <Text style={tailwind('ml-2 flex-shrink')}>
              Stop charting page actions to save the action tree you just made.
            </Text>
          </View>
          <Text style={tailwind('mt-1')}>
            You do not need to chart every possible action tree path in order to
            save the tree. The Simple Controller Screen is designed to
            accommodate for tree paths that are not linked with a saved Setup by
            disabling relevant boxes.
          </Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

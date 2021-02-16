import { Alert } from 'react-native';

export const renderBleErrorAlert = (params?: {
  title?: string;
  message?: string;
}) => {
  Alert.alert(
    params?.title || 'Bluetooth Error',
    `${
      params?.message ? params.message + '\n' : ''
    }Please disconnect, then reconnect.`,
  );
};

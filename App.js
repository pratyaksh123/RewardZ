import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import Navigator from './App/Navigator/Stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

const theme = {
  ...DefaultTheme,
};

// Wrap Here with a HOC if required.
export default () => {
  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log('Connected!');
      } else {
        Alert.alert(
          'No Internet Connection Detected !',
          'Please connect to the internet to access the App !'
        );
      }
    });
  }, []);
  return (
    <PaperProvider theme={theme}>
      <Navigator />
    </PaperProvider>
  );
};

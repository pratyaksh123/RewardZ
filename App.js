import React from 'react';
import Navigator from './App/Navigator/Stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
};

// Wrap Here with a HOC if required.
export default () => {
  return (
    <PaperProvider theme={theme}>
      <Navigator />
    </PaperProvider>
  );
};

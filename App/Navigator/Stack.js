import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from '../Screens/AuthScreen';
import HomeScreen from '../Screens/HomeScreen';
const Navigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTitleAlign: 'center',
      },
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
);

const Switch = createSwitchNavigator(
  {
    Auth: {
      screen: AuthScreen,
    },
    Home: {
      screen: Navigator,
    },
  },
  {
    initialRouteName: 'Auth',
  }
);

export default createAppContainer(Switch);

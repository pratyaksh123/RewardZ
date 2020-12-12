import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from '../Screens/AuthScreen';
import HomeScreen from '../Screens/HomeScreen';
import PaymentScreen from '../Screens/Payments';
import Icon from 'react-native-vector-icons/FontAwesome';
import Test from '../Screens/Test';

const bottomnav = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={20} color={tintColor} />
        ),
      },
    },
    Payments: {
      screen: PaymentScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="rupee" size={20} color={tintColor} />
        ),
      },
    },
  },
  {}
);

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
      screen: bottomnav,
    },
    Test: {
      screen: Test,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(Switch);

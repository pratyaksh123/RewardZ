import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
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
  }
);

export default createAppContainer(Navigator);

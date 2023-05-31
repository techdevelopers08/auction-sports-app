import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import TabNavigation from './BottomTabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SingleAuction from '../screens/SingleAuction';
import BidsHistoryScreen from '../screens/BidsHistoryScreen'
import WebLoginScreen from '../screens/WebLogin'
import Profile from '../screens/ProfileScreen';

const Stack = createStackNavigator({
  Splash: {
    screen: SplashScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  WebLogin: {
    screen: WebLoginScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Tabs: {
    screen: TabNavigation,
    navigationOptions: {
      headerShown: false,
    },
  },
  // SocialLogins: {
  //   screen: SocialLogins,
  //   navigationOptions: {
  //     headerShown: false,
  //   },
  // },
  Profile: {
    screen: Profile,
    navigationOptions: {
      headerShown: false,
    },
  },
  SingleAuction: {
    screen: SingleAuction,
    navigationOptions: {
      headerShown: false,
    },
  },
},{headerMode:'none'});

export default createAppContainer(Stack);

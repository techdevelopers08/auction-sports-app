import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import AuctionsScreen from '../screens/AuctionsList';
import WinnersScreen from '../screens/WinnersList';
import DashboardScreen from '../screens/Dashboard';
import BuyBidsScreen from '../screens/BuyBidsScreen';
import HelpScreen from '../screens/HelpScreen';
import BidsHistoryScreen from '../screens/BidsHistoryScreen';
import SvgImage from '../assets/SvgImage';
import VideoAdScreen from '../screens/VideoAdScreen';
import Winner from '../components/Winner';

const Auctions = createStackNavigator({
  '`': AuctionsScreen,
},{headerMode:'none'});

const Winners = createStackNavigator({
  Winners: WinnersScreen,
},{headerMode:'none'});

const Dashboard = createStackNavigator({
  Dashboard: DashboardScreen,
  BidsHistory: BidsHistoryScreen,
  VideoAd: VideoAdScreen,
},{headerMode:'none'});

const BuyBids = createStackNavigator({
  '`': BuyBidsScreen,
},{headerMode:'none'});

const Help = createStackNavigator({
  Help: HelpScreen,
},{headerMode:'none'});

const TabNavigation = createMaterialTopTabNavigator(
  {
    Auctions: {
      screen: Auctions,
      navigationOptions: {
        title: 'Auctions',
        tabBarIcon: ({focused}) => (
          <SvgImage svgName="auction" fill={focused ? '#ffffff' : '#9ebad8'} />
        ),
      },
    },
    Winners: {
      screen: Winners,
      navigationOptions: {
        title: 'Winners',
        tabBarIcon: ({focused}) => (
          <SvgImage svgName="winners" fill={focused ? '#ffffff' : '#9ebad8'} />
        ),
      },
    },
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        title: 'Dashboard',
        tabBarIcon: ({focused}) => (
          <SvgImage
            svgName="dashboard"
            fill={focused ? '#ffffff' : '#9ebad8'}
          />
        ),
      },
    },
    Buybids: {
      screen: BuyBids,
      navigationOptions: {
        title: 'Buy Bids!',
        tabBarIcon: ({focused}) => (
          <SvgImage svgName="buybids" fill={focused ? '#ffffff' : '#9ebad8'} />
        ),
      },
    },
    Help: {
      screen: Help,
      navigationOptions: {
        title: 'Help',
        tabBarIcon: ({focused}) => (
          <SvgImage svgName="help" fill={focused ? '#ffffff' : '#9ebad8'} />
        ),
      },
    },
  },
  {
    headerMode:'none',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    lazy: false,
    tabBarOptions: {
      showLabel: true,
      indicatorStyle: {
        opacity: 0,
      },
      showIcon: true,
      labelStyle: {
        fontSize: 8,
        color: '#ffffff',
      },
      style: {backgroundColor: '#3c74b1'},
      scrollEnabled: false,
    },
  },
);

export default createAppContainer(TabNavigation);

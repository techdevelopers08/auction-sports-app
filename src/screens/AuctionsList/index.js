import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Auction from '../../components/Auction';
import Header from '../../components/Header';
import styles from './styles';
import assets from '../../assets';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import endpoint from '../../config';
import {Events} from '../../assets/Events';

const AuctionsScreen = props => {
  const {navigation} = props;
  const [auctions, setAuctions] = useState([]);
  const [user, setUser] = useState({});
  const [filter, setFilter] = useState('SHOW_ALL');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
     
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));

    
      console.log("userData",userData.jwt)

      setUser(userData);
      
      axios
        .post(endpoint, {action: 'get-auction-list', jwt: userData.jwt})
        .then(response => {
          if (response.data.err) {
            console.log(response.data.err)
            setAuctions([]);
          } else {
            console.log("api working")
            console.log(response.data)
            setAuctions(response.data);
          }
        })
        .catch(error => {
          setAuctions([]);
          console.log('error');
        });
    };



    fetchData();
    props.navigation.addListener('didFocus', async () => {
      await fetchData();
    });
  }, []);

  const onRefresh = async () => {
    console.log('inside');
    const userData = JSON.parse(await AsyncStorage.getItem('userData'));
    setRefreshing(true);
    axios
      .post(endpoint, {action: 'get-auction-list', jwt: userData.jwt})
      .then(response => {
        console.log(response.data);
        setAuctions(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error)
      });
  };
  Events.on('auctionScreenBidChange', 'bid', newTotalBids => {
    if (typeof newTotalBids !== 'number') {
      newTotalBids = 0;
    }
    setUser({...user, bids: newTotalBids});
  });

  if (auctions.length === 0) {
    return (
      <View style={styles.emptyView}>
        <Header
          screen={"Auction"}
          filter={filter}
          userData={{
            name: user.username,
            bidsLeft: user.bids,
            image: user.avatar
              ? {uri: user.avatar}
              : assets.images.profile,
          }}
        />
        <Text>No auctions available</Text>
      </View>
    );
  }
  return (
   
    <View style={styles.mainContainer}>
  
      <Header
          screen={'Auctions'}
          filter={filter}
          userData={{...user}}
        />
      <FlatList
         keyExtractor={(index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        style={styles.list}
        data={auctions}
        renderItem={({item}) => <Auction item={item} navigation={navigation} />}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

AuctionsScreen.navigationOptions = () => ({
  headerStyle: {
    height: 0,
    title: '',
  },
});

export default AuctionsScreen;

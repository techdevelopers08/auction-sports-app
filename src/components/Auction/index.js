import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import AuctionDetails from '../AuctionDetails';

import styles from './styles';
import AuctionEnds from '../AuctionEnds';

const Auction = props => {

  const { navigation, item } = props;
  const {
    bidders,
    'end-date': endDate,
    id,
    'prize-pic': prizePic,
    rrp,
    title,
    'winner-avatar': winnerAvatar,
    'winner-username': winnerUsername,
    description,
  } = item;
  const { navigate } = navigation;

  function handleButtonPress() {
    ToastAndroid.showWithGravity(
      "Chl rea pra",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  }

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => {
        navigate('SingleAuction', {
          data: { id, winnerAvatar },
        });
      }}
      style={styles.mainContainer}
    >

      <View style={styles.nameView}>
        <Text style={styles.nameText}>{title}</Text>
      </View>
      <AuctionDetails
        showRRP={false}
        data={{
          description,
          bidders,
          winnerUsername,
          rrp,
          prizePic,
          winnerAvatar,
        }}
      />
      <AuctionEnds endsIn={endDate} />
    </TouchableOpacity>
  );
};

export default Auction;

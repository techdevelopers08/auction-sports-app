import React from "react";
import { View, Text, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./styles";

const row = (dateTime, price) => {
  const actualDate = new Date(dateTime * 1000);
  return (
    
    <View style={styles.row}>
      <View style={styles.priceView}>
        <View style={styles.imageView}>
          <Image
            source={require("../../assets/images/auctionImage.png")}
            style={styles.image}
          />
        </View>
      </View>
      <Text style={styles.date}>
        {actualDate.getDate().toString().length < 2
          ? "0" + actualDate.getDate().toString()
          : actualDate.getDate()}
        /
        {actualDate.getMonth().toString().length < 2
          ? "0" + actualDate.getMonth().toString()
          : actualDate.getMonth()}
        /
        {actualDate.getFullYear().toString().length < 2
          ? "0" + actualDate.getFullYear().toString()
          : actualDate.getFullYear()}
      </Text>
      <Text style={styles.time}>
        {actualDate.getHours().toString().length < 2
          ? "0" + actualDate.getHours().toString()
          : actualDate.getHours()}
        :
        {actualDate.getMinutes().toString().length < 2
          ? "0" + actualDate.getMinutes().toString()
          : actualDate.getMinutes()}
      </Text>

      <View style={styles.priceView}>
        <Text style={styles.price}>
          {!price.toString().includes(".") ? price + ".00" : price}
        </Text>
      </View>
    </View>
  );
};

const displayList = (list) => {
  if (list?.bids.length!==0) {
    return list?.bids.map((item) => {
      // console.log('item',item)
      const { recorded, bid_value } = item;
      return row(recorded, bid_value);
    });
  } else {
    return <View />;
  }
};

const BidsHistory = (props) => {
  const { data } = props;
  
  if (data?.bids.length>0) {
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Auction</Text>
          <Text style={{ ...styles.headerText, marginLeft: -10 }}>Date</Text>
          <Text style={{ ...styles.headerText, marginLeft: 0 }}>Time</Text>
          <Text style={{ ...styles.headerText, marginLeft: 0 }}>Amount</Text>
        </View>

        {displayList(data)}
        </ScrollView>
      </View>

    );
  } else {
    return <View />;
  }
};

export default BidsHistory;

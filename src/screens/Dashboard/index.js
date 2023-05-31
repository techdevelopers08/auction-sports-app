import React, { useState, useEffect } from "react";
import {
  Share,
  View,
  Text,
  Image,
  Button,
  Platform,
  Linking,
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import styles from "./styles";
import assets from "../../assets";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import endpoint from "../../config";
import { Events } from "../../assets/Events";

import DashboardButton from "../../components/DashboardButton";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import VideoAdScreen from "../VideoAdScreen";
// import GooglePay from '../../components/GooglePay';
// import ApplePay from '../../components/ApplePay';

import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";

const itemSkus = Platform.select({
  ios: ["ios.test.purchased"],
  android: ["android.test.purchased"],
});
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

// let data = ;

const DashboardScreen = (props) => {
  const { navigation } = props;
  const [auctions, setAuctions] = useState([]);
  const [user, setUser] = useState({});
  const [filter, setFilter] = useState("SHOW_ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [disableVideo, setDisableVideo] = useState(false);
  const [data, setData] = useState([
    { id: "01", status: true, title: "Create your unique Username" },
    { id: "02", status: true, title: "Upload your Profile picture" },
    { id: "03", status: false, title: "Share with your friends" },
    { id: "04", status: false, title: "Follow us on Facebook" },
    { id: "05", status: false, title: "Follow us on Instagram" },
    { id: "05", status: false, title: "Follow us on Youtube" },
  ]);

  const getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);

      // const products = await RNIap.getSubscriptions(itemSkus);
      console.log("productList:--", products);
      this.setState({ productList: products });
    } catch (err) {}
  };
  const initRNIAP = async () => {
    try {
      const result = await RNIap.initConnection();

      await RNIap.consumeAllItemsAndroid();
    } catch (err) {
      // console.warn(err.code, err.message);
    }
    await getItems();
    // purchaseUpdateSubscription = purchaseUpdatedListener(
    //   async (purchase: InAppPurchase | SubscriptionPurchase) => {
    //     const receipt = purchase.transactionReceipt;

    //     if (receipt) {
    //       try {
    //         if (Platform.OS === "ios") {
    //           finishTransactionIOS(purchase.transactionId);
    //         } else if (Platform.OS === "android") {
    //           // If consumable (can be purchased again)

    //           consumePurchaseAndroid(purchase.purchaseToken);
    //           //
    //           // // If not consumable
    //           // acknowledgePurchaseAndroid(purchase.purchaseToken);
    //           // await RNIap.consumeAllItemsAndroid();
    //         }
    //         // const ackResult = await finishTransaction(purchase);
    //       } catch (ackErr) {
    //         console.warn("ackErr--", ackErr);
    //       }
    //       // this.handleUpdateCredits();
    //       // this.setState({ receipt }, () => this.goNext());
    //     }
    //   }
    // );
    // purchaseErrorSubscription = purchaseErrorListener(
    //   (error: PurchaseError) => {
    //     // this.setState({errormsg: error.message, erroModol: true});
    //     // alert("purchase error", JSON.stringify(error));
    //   }
    // );
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      setUser(userData);

      // axios
      //   .post(endpoint, {action: 'get-auction-list', jwt: userData.jwt})
      //   .then(response => {
      //     if (response.data.err) {
      //       setAuctions([]);
      //     } else {
      //       setAuctions(response.data);
      //     }
      //   })
      //   .catch(error => {
      //     setAuctions([]);
      //     // console.log('error');
      //   });
    };
    fetchData();
    initRNIAP();
    props.navigation.addListener("didFocus", async () => {
      await fetchData();
    });
  }, []);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Try out Sports Fans Auctions.\nhttps://play.google.com/store/apps/details?id=com.sportsfansauctions",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert("ser", error.message);
      console("", error);
    }
  };

  const buyMoreBids = async () => {
    // this.props.navigation.navigate('Buybids')
    try {
      await RNIap.requestPurchase("ios.test.purchased", false).then((resp) =>
        console.log("purchased", resp)
      );
      // this.purchasePackage();
    } catch (err) {
      console.log("error--", err);
      // this.setState({
      //   inAppLoading: false,
      // });
    }
    alert("buy more bids pressed");
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>{user?.username}</Text>
            <Text style={styles.bidsText}>{user?.bids} bids left</Text>
            <View style={styles.buyMoreBidsBtn}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("Buybids")}
              >
                <View style={{ width: 180, marginVertical: -40 }}>
                  <Image
                    resizeMode={"contain"}
                    style={{ width: "100%" }}
                    source={require("../../assets/images/buy-more.png")}
                  />
                </View>
              </TouchableOpacity>
              {/* <Button
                title="BUY MORE BIDS"
                color="#fcc92e"
                // onPress={}
              /> */}
            </View>
          </View>
          <View style={styles.imageView}>
            {console.log(user.avatar)}
            <Image
              source={
                user.avatar ? { uri: user.avatar } : assets.images.profile
              }
              style={styles.image}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            // Top: 300,
          }}
        >
          <View style={styles.bidsContainer}>
            {/* <View style={styles.bidsHeader}>
              <Text style={styles.bidsHeaderText}>MEMBER CHECKLIST</Text>
            </View> */}

            {/* {data.map((item, index) => (
              <CheckBox
                title={item.title}
                key={item.id}
                checked={item.status}
                disabled={item.status}
                containerStyle={{
                  width: "100%",
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                }}
                textStyle={item.status ? { color: "red" } : null}
                checkedColor={item.status ? "red" : null}
                onPress={() => {
                  if (!item.status) {
                    if (item.title.includes("Create your unique Username")) {
                      props.navigation.navigate("Profile");
                    } else if (item.title.includes("Share with your friends")) {
                      onShare();
                    } else if (item.title.includes("Instagram")) {
                      Linking.openURL(
                        "https://www.instagram.com/sportsfansauctions"
                      );
                    } else if (item.title.includes("Facebook")) {
                      Linking.openURL(
                        "https://facebook.com/SportsFansAuctions"
                      );
                    } else if (item.title.includes("Youtube")) {
                      Linking.openURL(
                        "https://www.youtube.com/channel/UC5ps73cbreHP72gDR82rJtQ"
                      );
                    }
                  }
                  let d = data;
                  d[index]["status"] = !item.status;
                  setData([...d]);
                  // data[index]['status'] = !item.status;
                }}
              />
            ))} */}
          </View>
          {/* <ApplePay /> */}
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 40,
            }}
          >
            {console.log("disableVideo", disableVideo)}
            <VideoAdScreen
              disableVideo={disableVideo}
              disableFor60Seconds={() => {}}
              rewardBids={(newBids) => {
                setUser({ ...user, bids: newBids });
                setDisableVideo(true);
                // console.log("disableVideo innn", disableVideo);
                setTimeout(() => {
                  setDisableVideo(false);
                }, 60000);
              }}
            >
              <DashboardButton
                style={disableVideo ? { backgroundColor: "#6590bf" } : null}
                title={"GET FREE BIDS"}
                iconType="font-awesome"
                iconName={"gift"}
                disabled={true}
              />
            </VideoAdScreen>
            <DashboardButton
              title={"REFER A FRIEND"}
              onPress={() => onShare()}
            />
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <DashboardButton
              title={"SETTINGS"}
              iconType="ionicons"
              iconName={"settings"}
              onPress={() =>
                props.navigation.navigate("Profile", { previous: "dashboard" })
              }
            />
            <DashboardButton
              title={"BIDS HISTORY"}
              iconType="font-awesome"
              iconName={"history"}
              onPress={() => props.navigation.navigate("BidsHistory")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

DashboardScreen.navigationOptions = (props) => ({
  title: "",

  headerStyle: {
    height: 0,
    title: "",
  },
});

export default DashboardScreen;

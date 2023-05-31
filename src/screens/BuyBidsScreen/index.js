import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from "react-native";
import styles from "./styles";
import Header from "../../components/Header";
import BidsPackage from "../../components/BidsPackage";
import endpoint from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { Dialog } from "react-native-simple-dialogs";
import RNIap, {
  PurchaseError,
  purchaseErrorListener,
  finishTransaction,
  purchaseUpdatedListener,
} from "react-native-iap";
import assets from "../../assets";
import constants from "../../constants";
import { Events } from "../../assets/Events";

const itemSkus = Platform.select({
  ios: ["7", "8", "9"],
  android: ["7", "8", "9"],
});

const itemSubs = Platform.select({
  ios: ["01", "02", "03", "04", "05", "06"],
  android: ["01", "02", "03", "04", "05", "06"],
});

const renderTextStyle = (actualTime, time) => {
  if (actualTime === time) {
    return styles.selectedText;
  }
  return styles.unSelectedText;
};

const renderBorderStyle = (actualTime, time) => {
  if (actualTime === time) {
    return styles.selectedBorder;
  }
  return styles.unSelectedBorder;
};
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

class BuyBidsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedPlanId: "",
      time: "WEEKLY",
      packages: {},
      user: {},
      selectedPackage: [],
      purchaseSuccessful: false,
    };
  }
  requestPurchase = async (sku, planId, bids) => {
    this.setState({
      selectedPlanId: planId,
      bids,
    });
    try {
      await RNIap.requestPurchase(sku, false);
    } catch (err) {
      // Alert.alert(err.message);
      // Alert.alert('Server Error');
    }
  };
  requestSubscription = async (sku, planId, bids) => {
    this.setState({
      selectedPlanId: planId,
      bids,
    });
    try {
      await RNIap.requestPurchase(sku, false);
    } catch (err) {
      // Alert.alert(err.message);
      // Alert.alert('Server Error');
    }
  };
  goNext = async (receipt) => {
    console.log("reciept", this.state.selectedPackage);
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    await axios
      .post(
        endpoint +
          (Platform.OS === "ios" ? "/payment/ios" : "/payment/android"),
        {
          planID: this.state.selectedPlanId,
          jwt: userData.jwt,
          status: "success",
          paymentGatewayResponse: { ...receipt, jwt: userData.jwt },
        }
      )
      .then(async (response) => {
        console.log("Transaction Fres", response.data);
        // let userData = JSON.parse(await AsyncStorage.getItem("userData"));
        await axios
          .post(
            "https://auth.sportsfansauctions.com/api/user/profile/bid-count",
            {
              jwt: userData.jwt,
            }
          )
          .then(async (resp) => {
            console.log("Rwponse.bids total", resp.data.bids);
            if (!this.state.purchaseSuccessful) {
              this.setState({
                user: {
                  ...this.state.user,
                  bids: resp.data.bids,
                },
                purchaseSuccessful:
                  resp.data.bids - userData.bids > 0 ? true : false,
                purchaseMessage: `   CONGRATULATIONS !\n \nYou've got ${resp
                  .data.bids - userData.bids || 0} bids`,
              });

              console.log("congo");
            }
            // alert("si");

            await this.fetchData();
            await this.setPackage();
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify({
                ...userData,
                bids: resp.data.bids,
              })
            );
            this.setState({
              user: {
                ...this.state.user,
                bids: resp.data.bids,
              },
            });
          })
          .catch((error) => {
            console.log("error", error + "kk");
          });

        // Alert.alert("Purchase Succesful", "Your purchase is succesful");
      })
      .catch((error) => {
        console.log("Transaction Failer", error);
        if (this.state.purchaseSuccessful) {
          this.setState({
            purchaseSuccessful: true,
            purchaseMessage: `   SORRY !\n \nTransaction Failed.`,
          });
        }
        // Alert.alert('Server Error', 'Server Error');
      });
  };
  getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      const subscriptions = await RNIap.getSubscriptions(itemSubs);
      this.setState({ productList: products, subscriptionList: subscriptions });
      console.log("state prods+subs", this.state);
    } catch (err) {
      console.log(err.code, err.message);
    }
  };
  // getSubscriptions = async () => {
  //   try {
  //     const products = await RNIap.getSubscriptions(itemSubs);
  //     this.setState({subscriptionsList: products});
  //   } catch (err) {
  //     console.log(err.code, err.message);
  //   }
  // };
  fetchData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({
      user: userData,
    });
    axios
      .post(endpoint, { action: "get-buying-plans", jwt: userData.jwt })
      .then((response) => {
        console.log("packages", response.data);
        this.setState({
          packages: response.data,

          selectedPackage: response.data.weekly,
        });
        this.setPackage();
        // if(response.data["pay-as-you-go current"]){
        //   console.log('pay-as-you-go current')
        // this.setState({
        //   time: "TOP-UP/PAYG",
        //   selectedPackage:response.data["pay-as-you-go current"],

        // })
        // }
      })
      .catch((error) => {
        console.log("error");
      });
  };
  setPackage = () => {
    const {
      weekly,
      monthly,
      "pay-as-you-go current": payAsYouGo,
    } = this.state.packages;
    if (weekly) {
      this.setState({ selectedPackage: weekly, time: "WEEKLY" });
    } else if (payAsYouGo) {
      this.setState({ selectedPackage: payAsYouGo, time: "TOP-UP/PAYG" });
    } else {
      this.setState({ selectedPackage: monthly, time: "MONTHLY" });
    }
  };
  async componentDidMount() {
    await this.fetchData();
    try {
      await RNIap.initConnection();
      // const items = await RNIap.consumeAllItemsAndroid();
      // console.log('items', items);
      this.getItems();
    } catch (err) {
      console.log(err.code, err.message);
    }
    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          const ackResult = await finishTransaction(purchase);
        } catch (ackErr) {
          console.log("ackErr", ackErr);
        }

        !this.state.purchaseSuccessful
          ? this.setState({ receipt }, () => this.goNext(receipt))
          : null;
      }
    });
    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log("purchaseErrorListener", error);
        // Alert.alert("purchase error", JSON.stringify(error));
      }
    );

    this.props.navigation.addListener("didFocus", async () => {
      await this.fetchData();
    });
  }
  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  }

  render() {
    Events.on("buyBidsBidChange", "bid", (newTotalBids) => {
      if (typeof newTotalBids !== "number") {
        newTotalBids = 0;
      }
      this.setState({
        user: { ...this.state.user, bids: newTotalBids },
      });
    });
    const {
      weekly,
      monthly,
      "pay-as-you-go current": payAsYouGoCurrent,
      "pay-as-you-go": payAsYouGo,
    } = this.state.packages;
    // if()
    // console.log("jnkni", this.state);

    console.log("payAsyouGo", payAsYouGo);
    console.log("weeklyo", weekly);
    console.log("monthlyo", monthly);
    if (
      
      !weekly
      && this.state.time === "WEEKLY"
      ) {


      console.log("state0", this.state.selectedPackage);
      // console.log("jnkni", this.state.selectedPackage[0]);
      return (
        <View style={styles.emptyView}>
          <Header
            screen={"Buy Bids"}
            userData={{
              name: this.state.user.username,
              bidsLeft: this.state.user.bids,
              image: this.state.user.avatar
                ? { uri: this.state.user.avatar }
                : assets.images.profile,
            }}
          />
          <Text>Loading...</Text>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.selectedPackage) {
      return (
        <View
          style={styles.mainContainer}
          contentContainerStyle={styles.contentStyle}
        >
          {/* <View style={styles.mainContainer1}>
          <View style={styles.screenContainer}>
            <Text style={styles.screenText}>Buy Bids</Text>
            <Text style={styles.filter} />
          </View>
          <View style={styles.nameContainer}>
            <View style={styles.nameView}>
              <Text style={styles.nameText}>{this.state.user.username}</Text>
              <Text style={styles.bidsText}>
                {this.state.user.bids} bids left
              </Text>
            </View>
            <View style={styles.imageView}>
              <Image
                source={
                  this.state.user.avatar
                    ? {uri: endpoint + this.state.user.avatar}
                    : assets.images.totalBiddersImage
                }
                style={styles.image}
              />
            </View>
          </View>
        </View> */}
          {/* {alert(this.state.user.bids)} */}
          <Header
            screen={"Buy Bids"}
            userData={{
              name: this.state.user.username,
              bidsLeft: this.state.user.bids,
              image: this.state.user.avatar
                ? { uri: this.state.user.avatar }
                : assets.images.profile,
            }}
          />
          <ScrollView style={styles.innerContainer}>
            <View style={styles.blueContainer}>
              <Text style={styles.bidRefund}>
                100% Bid Refund Until You Win
              </Text>
            </View>
            <View style={styles.timeList}>
              <View style={styles.packageView}>
                <TouchableOpacity
                  disabled={!payAsYouGo}
                  style={renderBorderStyle(this.state.time, "WEEKLY")}
                  onPress={() => {
                    this.setState({
                      time: "WEEKLY",
                      selectedPackage: weekly,
                    });
                  }}
                >
                  <Text style={renderTextStyle(this.state.time, "WEEKLY")}>
                    WEEKLY
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.packageView}>
                <TouchableOpacity
                  disabled={!payAsYouGo}
                  style={renderBorderStyle(this.state.time, "MONTHLY")}
                  onPress={() => {
                    this.setState({
                      time: "MONTHLY",
                      selectedPackage: monthly,
                    });
                  }}
                >
                  <Text style={renderTextStyle(this.state.time, "MONTHLY")}>
                    MONTHLY
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.packageView}>
                <TouchableOpacity
                  // disabled={!payAsYouGo}
                  style={renderBorderStyle(this.state.time, "TOP-UP/PAYG")}
                  onPress={() => {
                    this.setState({
                      time: "TOP-UP/PAYG",
                      selectedPackage: payAsYouGo
                        ? payAsYouGo
                        : payAsYouGoCurrent,
                    });
                  }}
                >
                  <Text style={renderTextStyle(this.state.time, "TOP-UP/PAYG")}>
                    TOP-UP/PAYG
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.packages}>
              <BidsPackage
                type={"BEGINNER"}
                freeBids={this.state.selectedPackage[0].bonus}
                weeklyBids={this.state.selectedPackage[0].bids}
                perBids={this.state.selectedPackage[0]["cost-per-bid"]}
                price={this.state.selectedPackage[0].price}
                planId={this.state.selectedPackage[0].plan_id}
                requestPurchase={this.requestPurchase}
                requestSubscription={this.requestSubscription}
                popular={false}
              />
              <BidsPackage
                type={"ADVANCED"}
                freeBids={this.state.selectedPackage[1].bonus}
                weeklyBids={this.state.selectedPackage[1].bids}
                perBids={this.state.selectedPackage[1]["cost-per-bid"]}
                price={this.state.selectedPackage[1].price}
                planId={this.state.selectedPackage[1].plan_id}
                requestPurchase={this.requestPurchase}
                requestSubscription={this.requestSubscription}
                popular={
                  this.state.time === "WEEKLY" || this.state.time === "MONTHLY"
                }
              />
              <BidsPackage
                type={"EXPERT"}
                freeBids={this.state.selectedPackage[2].bonus}
                weeklyBids={this.state.selectedPackage[2].bids}
                perBids={this.state.selectedPackage[2]["cost-per-bid"]}
                price={this.state.selectedPackage[2].price}
                planId={this.state.selectedPackage[2].plan_id}
                requestPurchase={this.requestPurchase}
                requestSubscription={this.requestSubscription}
                popular={this.state.time === "TOP-UP/PAYG"}
              />
            </View>
            <Text style={styles.bonus}>
              *BONUS BIDS AND BIDS WITHIN FREE TRIAL PERIOD ARE NON-REFUNDABLE
            </Text>
            <Dialog
              dialogStyle={{
                backgroundColor: "#fdca2e",
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#fff",
              }}
              visible={this.state.purchaseSuccessful}
              // title="Bids Filter"
              onTouchOutside={() =>
                this.setState({ purchaseSuccessful: false })
              }
            >
              <View>
                <Text
                  style={{
                    // backgroundColor: "#ddd",
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 1,
                    fontWeight: "bold",
                    fontSize: 20,
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  {this.state.purchaseMessage}
                </Text>
              </View>
            </Dialog>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }
  }
}

BuyBidsScreen.navigationOptions = () => ({
  headerStyle: {
    height: 0,
    title: "",
  },
});

export default BuyBidsScreen;

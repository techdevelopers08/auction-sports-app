import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Picker,
  TouchableOpacity,
} from "react-native";
import Auction from "../../components/Auction";
import Header from "../../components/Header";
import BidsHistory from "../../components/BidsHistory";
import styles from "./styles";
import assets from "../../assets";
import AsyncStorage from "@react-native-community/async-storage";
import { Dialog } from "react-native-simple-dialogs";
import axios from "axios";
import endpoint from "../../config";
import { Events } from "../../assets/Events";
import Button from "../../components/Button";

class BidsHistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auctions: [],
      user: {},
      filter: "SHOW_ALL",
      auctionFilter: "SHOW_ALL",
      bidFilter: "SHOW_ALL",
      auctionFilters: ["filter", "filter00"],
      bidFilters: ["filter", "filter00"],
      auctionsDialog: false,
      bidsDialog: false,
      refreshing: false,
      bids: [],
    };
  }

  async componentDidMount() {
    Events.on("auctionScreenBidChange", "bid", (newTotalBids) => {
      if (typeof newTotalBids !== "number") {
        newTotalBids = 0;
      }
      this.setState({ user: { ...this.state.user, bids: newTotalBids } });
    });
     await this.fetchBids();
    await this.fetchAuctions();
  }
  fetchAuctions = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ user: userData });
    axios
      .post(endpoint, { action: "get-auction-list", jwt: userData.jwt })
      .then((response) => {
        console.log(response.data);
        if (response.data.err) {
          this.setState({ auctionFilters: [] });
          this.setState({ auctions: [] });
        } else {
          this.setState({ auctionFilters: response.data });
          this.setState({ auctions: response.data });
        }
      })
      .catch((error) => {
        this.setState({ auctionFilters: [] });
        this.setState({ auctions: [] });
        console.log(error)
      });
  };

  fetchBids = async (auction_id = null) => {
    console.log("chla");
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ user: userData });
    if (auction_id) {
      
      axios
        .post(endpoint, {
          action: "get-user-bid-history",
          jwt: userData.jwt,
          auction_id,
        })
        .then((response) => {
          if (response.data.err) {
            this.setState({ bids: [] });
          } else {
            this.setState({ bids: response.data });
          }
        })
        .catch((error) => {
          this.setState({ bids: [] });
          console.log('error');
        });
    } else {
      axios
        .post(endpoint, { action: "get-user-bid-history", jwt: userData.jwt })
        .then((response) => {
          if (response.data.err) {
            this.setState({ bids: [] });
          } else {
            this.setState({bidFilters:response.data.bids})
            console.log("repo",response.data);
            this.setState({ bids: response.data });
          }
        })
        .catch((error) => {
          this.setState({ bids: [] });
        });
    }
  };

  onRefresh = async () => {
    console.log("inside");
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ refreshing: true });
    await axios
      .post(endpoint, { action: "get-auction-list", jwt: userData.jwt })
      .then((response) => {
        this.setState({ auctions: response.data });
        this.setState({ refreshing: false });
      })
      .catch((error) => {
        console.log("error");
      });
     await axios
      .post(endpoint, { action: "get-user-bid-history", jwt: userData.jwt })
      .then((response) => {
        if (response.data.err) {
          this.setState({ bids: [] });
        } else {
          console.log("repo",response.data);
          this.setState({ bids: response.data });
        }
      })
      .catch((error) => {
        this.setState({ bids: [] });
      });

  };

  changeAuctionFilter = (filter) => {
    this.setState({ auctionFilter: filter });
    let list = this.state.auctions.filter(
      (auction) => auction.title === filter
    );
    this.setState({ auctionFilters: list });
  };

  changeBidFilter = async (filter) => {
    await this.fetchBids();
    this.setState({ bidFilter: filter });
    let list = this.state.bids.filter((bid) => bid.bid_status === filter);
    this.setState({ bids: list });
  };

  render() {
    if (
      this.state.bids.length === 0 ||
      this.state.auctionFilters.length === 0
    ) {
      return (
        <View style={styles.emptyView}>
          <Header
            screen={"Bids History"}
            filter={this.state.filter}
            userData={{
              name: this.state.user.username,
              bidsLeft: this.state.user.bids,
              image: this.state.user.avatar
                ? { uri: this.state.user.avatar }
                : assets.images.profile,
            }}
          />
          <Text>No bids available</Text>
          {/* <Button title="Auction" /> */}
        </View>
      ); 
    }
    return (
      <View style={styles.mainContainer}>
        <Header
          screen={"Auctions"}
          filter={this.state.filter}
          userData={{
            name: this.state.user.username,
            bidsLeft: this.state.user.bids,
            image: this.state.user.avatar
              ? { uri: endpoint + this.state.user.avatar }
              : assets.images.profile,
          }}
        />
        <View style={{ top: 100, width: "100%", height: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding : 20,
            }}
          >
            <View>
              <Button
                style={{ width: 105, height: 40 }}
                textStyle={{ fontWeight: "bold" }}
                title={"Auction"}
                onPress={() => {
                  this.setState({ auctionsDialog: true });
                }}
              />
              <Text
                style={{ 
                  margin: 5,
                  fontSize: 12,
                  color: "#4270ba",
                  textTransform: "uppercase",
                  alignSelf: "center",
                }}
              >
                {this.state.auctionFilter?.title}
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: "#4270ba" }}>Filters</Text>
            <View>
              <Button
                style={{ width: 130, height: 40 }}
                textStyle={{ fontWeight: "bold" }}
                title={"Bid Status"}
                onPress={() => {
                  this.setState({ bidsDialog: true });
                }}
              />
              <Text
                style={{
                  margin: 5,
                  fontSize: 12,
                  // color: "#000",
                  textTransform: "uppercase",
                  alignSelf: "center",
                }}
              >
                {this.state.bidFilter?.bid_status}
              </Text>
            </View>
          </View>

          <BidsHistory data={this.state.bids} />



          <Dialog
            visible={this.state.auctionsDialog}
            title="Actions Filter"
            onTouchOutside={() => this.setState({ auctionsDialog: false })}
          >
            {this.state.auctionFilters?.map((filter) => (
              <TouchableOpacity
                onPress={() => {

                  this.setState({ auctionFilter: filter });
                  
                }}
              >
                <Text
                  style={{
                    backgroundColor: "#ddd",
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 1,
                  }}
                >
                  {filter.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Dialog>
          <Dialog
            visible={this.state.bidsDialog}
            title="Bids Filter"
            onTouchOutside={() => this.setState({ bidsDialog: false })}
          >
            {this.state.bidFilters?.map((filter) => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ bidFilter: filter });
                }}
              >
                <Text
                  style={{
                    backgroundColor: "#ddd",
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 1,
                  }}
                >
                  {filter.bid_status}
                </Text>
              </TouchableOpacity>
            ))}
          </Dialog>
        </View>
      </View>
    );
  }
}

BidsHistoryScreen.navigationOptions = () => ({
  headerStyle: {
    height: 0,
    title: "",
  },
});

export default BidsHistoryScreen;



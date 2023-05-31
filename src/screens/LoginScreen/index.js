import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import endpoint from "../../config";
import { NetworkInfo } from "react-native-network-info";
import AsyncStorage from "@react-native-community/async-storage";
import { StackActions, NavigationActions } from "react-navigation";

import GoogleSignin from "../../components/GoogleSignin";
import FBLoginButton from "../../components/FBLoginButton";

import assets from "../../assets";
import styles from "./styles";
import Button from "../../components/Button";

const navigateToScreen = (routeName) => {
  const navigateAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
  props.navigation.dispatch(navigateAction);
};

const onCreateNew = (props, setError, setErrorValue) => {
  const { navigate } = props.navigation;
  NetworkInfo.getIPAddress().then((ipAddress) => {
    axios
      .post(endpoint, { action: "create-guest-user", ip: ipAddress })
      .then(async (response) => {
        console.log("guest user", response);
        if (response.data.jwt) {
          AsyncStorage.setItem("userData", JSON.stringify(response.data));
          props.navigation.replace("Tabs");
          //  props.navigation.replace('Tabs');
          // alert('press')
          // navigateToScreen('Tabs')
        }
        setError(true);
        setErrorValue("Network Error");
      })
      .catch((error) => {
        setError(true);
        setErrorValue("Network Error");
      });
  });
};

const { splash } = assets.images;
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentWillMount() {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    if ("jwt" in userData) {
      console.log("jwt", userData.jwt);
      this.props.navigation.reset("Tabs");
    }
  }
  async componentDidMount() {
    await AsyncStorage.clear();
  }

  _loginWithSocial = () => {
    console.log("socu");
    axios
      .post(
        "https://auth.sportsfansauctions.com/api/user/profile/login-with-social-media-token",
        { token: this.state.userInfo.id }
      )
      .then(async (response) => {
        console.log("Social USER LOGIN", response.data);
        if (response.data.jwt) {
          console.log("Social USER LOGIN", response.data);
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({
              email: this.state.userInfo?.email || "",
              password: "",
              username: this.state.userInfo?.fullName || "",
              city: response.data.city || "",
              mobile: response.data.mobile || "",
              firstname: this.state.userInfo?.firstName || "",
              lastname: this.state.userInfo?.lastName || "",
              add1: response.data.add1 || "",
              postcode: response.data.postcode || "",
              photo: response.data.avatar || "",
              "social-media": {
                name: this.state.userInfo?.platform,
                token: this.state.userInfo?.id,
              },
              ...response.data,
            })
          );
          this.props.navigation.replace("Tabs");
          return;
        }
        // setError(true);
        // setErrorValue("Network Error");
        console.log("error1 socio");
        this.props.navigation.navigate("Profile", {
          userInfo: this.state.userInfo,
        });
      })
      .catch((error) => {
        console.log("catch error1 socio");
        // setError(true);
        // setErrorValue("Network Error");
        this.props.navigation.navigate("Profile", {
          userInfo: this.state.userInfo,
        });
      });
  };
  render() {
    return (
      <KeyboardAvoidingView style={styles.mainContainer} behavior="height">
        <View style={styles.imageView}>
          <Image style={styles.image} source={splash} />
        </View>
        <View style={{ margin: 40, alignItems: "center", flex: 1 }}>
          <FBLoginButton
            style={{ margin: 10 }}
            navigation={this.props.navigation}
            setUserInfo={(userInfo) => {
              this.setState({ userInfo });
              console.log("InLoginScreen", userInfo);
              if (userInfo && userInfo.platform === "facebook") {
                this._loginWithSocial();
              }
              // this.props.navigation.navigate('Profile', {userInfo});
            }}
          />
          <GoogleSignin
            style={{ margin: 10 }}
            navigation={this.props.navigation}
            setUserInfo={(userInfo) => {
              this.setState({ userInfo });
              console.log("InLoginScreen", userInfo);
              if (userInfo && userInfo.platform === "google") {
                // this.props.navigation.navigate("Profile", { userInfo });
                this._loginWithSocial();
              }
            }}
          />

          <Button
            style={{ margin: 10 }}
            title={"Sign in with Email"}
            icon="email"
            color="#696767"
            onPress={() => this.props.navigation.navigate("Profile")}
          />
          {/* <InstaLoginButton  style={{margin:10}}></InstaLoginButton> */}
          <Button
            style={{ margin: 10 }}
            textStyle={{ fontWeight: "bold" }}
            color="#141414"
            onPress={() =>
              onCreateNew(
                this.props,
                (error) => this.setState({ error }),
                (errorValue) => this.setState({ errorValue })
              )
            }
            title={"GUEST LOGIN"}
          />
          <Button
            style={{ margin: 10 }}
            textStyle={{ fontWeight: "bold" }}
            color="#fdca2e"
            onPress={() => this.props.navigation.navigate("WebLogin")}
            title={"EXISTING MEMBER LOGIN"}
          />
        </View>
        <View style={styles.copyrightView}>
          <Text style={styles.copyrightText}>© 2020 Sports Fans Auctions</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;

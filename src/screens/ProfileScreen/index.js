import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  BackHandler,
  Alert,
  Platform,
  Linking,
} from "react-native";
import axios from "axios";
import { Dialog } from "react-native-simple-dialogs";
import AsyncStorage from "@react-native-community/async-storage";
import { Input } from "react-native-elements";
import { WebView } from "react-native-webview";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import styles from "./styles";

import InstructionStep from "../../components/InstructionStep";
import Button from "../../components/Button";
import ImageInput from "../../components/ImageInput";

import assets from "../../assets";

const { width, height } = Dimensions.get("window");
const { bids100, splash } = assets;

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(
      "Profilenavigation",
      this.props.navigation.getParam("userInfo")
    );
    // const userData = ;
  }
  profile = this.props.navigation.getParam("userInfo");

  state = {
    loading: false,
    disableUsername: false,
    disableEmail: false,
    userData: {},
    viewPass: false,
    isDashboard: false,
    disabled: this.profile ? true : false,
    email: this.profile?.email || "",
    password: "",
    basic: true,
    username: this.profile?.fullName || "",
    city: this.profile?.city || "",
    mobile: this.profile?.mobile || "",
    firstname: this.profile?.firstName || "",
    lastname: this.profile?.lastName || "",
    add1: "",
    postcode: "",
    photo: this.profile?.photo || "",
    "social-media": {
      name: this.profile?.platform,
      token: this.profile?.id,
    },
  };

  onChange = (value, property) => {
    this.setState({ [property]: value });
    console.log(this.state);
    // alert(property);
    // alert(value);
  };
  async componentDidMount() {
    const isDashboard = this.props.navigation.getParam("previous");
    // if(isDashboard && !this.state.disabled){
    //   this.setState({disableUsername:true})
    // }
    // if(!isDashboard && this.state.disabled){
    //   this.setState({disableEmail:true})
    // }else if(isDashboard ){
    //   this.setState({disableEmail:true})
    // }
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    if (isDashboard === "dashboard") {
      const {
        email,
        password,
        username,
        
        city,
        mobile,
        firstname,
        lastname,
        add1,
        postcode,
        picture,
      } = userData;
      console.log(
        "isDashboard",
        JSON.parse(await AsyncStorage.getItem("userData"))
      );
      this.setState({
        email,
        password,
        username,
        guestUser: username,
        city,
        mobile,
        firstname,
        lastname,
        add1,
        postcode,
        photo: picture?.data || userData.photo || "",
        isDashboard: true,
        userData,
      });
    }
  }
  createUser = () => {
    console.log("createUser");
    const { navigate } = this.props.navigation;

    axios
      .post(
        "https://auth.sportsfansauctions.com/api/user/profile/create",

        this.state.photo
          ? {
              username: this.state.username,
              city: this.state.city,
              mobile: this.state.mobile,
              password: "password",
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              add1: this.state.add1,
              picture: { type: "url", data: this.state.photo },
              postcode: this.state.postcode,
            }
          : {
              username: this.state.username,
              city: this.state.city,
              mobile: this.state.mobile,
              password: "password",
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              add1: this.state.add1,

              postcode: this.state.postcode,
            }
      )
      .then(async (response) => {
        console.log(response);
        if ("jwt" in response.data) {
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify({
              jwt: response.data.jwt,
              ...JSON.parse(response.config.data),
              bids: response.data.bids,
              username: this.state.username,
              city: this.state.city,
              mobile: this.state.mobile,
              password: "password",
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              add1: this.state.add1,
              picture: { type: "url", data: this.state.photo },
              postcode: this.state.postcode,
              avatar: this.state.photo,
            })
          );
          // console.log("response.config.data", JSON.parse(response.config.data));
          // console.log(
          //   "CreateUser !@#",
          //   JSON.parse(await AsyncStorage.getItem("userData"))
          // );

          this.props.navigation.replace("Tabs");

          // this.setState({ basic: false });
        } else if (response.data.saved === 1) {
          // alert("saved");

          this.props.navigation.replace("Tabs");
          // this.setState({ basic: false });
        } else {
          console.log("pictire expect", response.data.err);
          this.setState({ error: true });
          this.setState({ errorMessage: response.data.err });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        this.setState({ errorMessage: "Server Error" });
        this.setState({ loading: false });
      });
    // this.setState({loading:false})
  };
  updateUser = (userData) => {
    const { navigate } = this.props.navigation;
    const user = {
      username: this.state.username,
      city: this.state.city,
      mobile: this.state.mobile,
      password: "password",
      email: this.state.email,
      firstname: this.state.firstname,
      lastname: this.state.lastname,

      add1: this.state.add1,
      postcode: this.state.postcode,
    };
    console.log("updateUser", user);
    axios
      .post(
        "https://auth.sportsfansauctions.com/api/user/profile/save",

        this.state.photo
          ? {
              jwt: userData.jwt,
              ...user,
              picture: { type: "url", data: this.state.photo },
            }
          : {
              jwt: userData.jwt,
              ...user,
            }
      )
      .then(async (response) => {
        console.log("updateuser respinse", response);
        if ("jwt" in response.data) {
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({
              ...userData,
              jwt: response.data.jwt,

              ...JSON.parse(response.config.data),
              ...user,
              avatar: this.state.photo,
            })
          );
          console.log(
            "UpdateUser !@#",
            JSON.parse(await AsyncStorage.getItem("userData"))
          );
          this.props.navigation.replace("Tabs");
        } else if (response.data.saved === 1) {
          // alert("saved");
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({
              ...userData,
              jwt: response.data.jwt,
              ...JSON.parse(response.config.data),
              ...user,
              avatar: this.state.photo,
            })
          );
          console.log(
            "UpdateUser !@#",
            JSON.parse(await AsyncStorage.getItem("userData"))
          );
          this.props.navigation.replace("Tabs");
        } else {
          this.setState({ error: true });
          this.setState({ errorMessage: response.data.err });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        this.setState({ errorMessage: "Server Error" });
        this.setState({ loading: false });
      });
    // this.setState({loading:false})
  };
  createSocialMediaUser = () => {
    console.log("createSocialMediaUser");
    const { navigate } = this.props.navigation;
    const user = {
      username: this.state.username,
      city: this.state.city,
      mobile: this.state.mobile,
      password: "password",
      email: this.state.email,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      add1: this.state.add1,
      postcode: this.state.postcode,
      "social-media": this.state["social-media"],
    };

    console.log("User", user)

    axios
      .post(
        "https://auth.sportsfansauctions.com/api/user/profile/create",
        this.state.photo
          ? {
              ...user,
              picture: { type: "url", data: this.state.photo },
            }
          : { ...user }
      )
      .then((response) => {
        console.log("sociialuser", response);
        if ("jwt" in response.data) {
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({
              jwt: response.data.jwt,
              ...JSON.parse(response.config.data),
              city: this.state.city,
              mobile: this.state.mobile,
              password: "password",
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              add1: this.state.add1,
              picture: { type: "url", data: this.state.photo },
              postcode: this.state.postcode,
              bids: response.data.bids,
              username: this.state.username,
              avatar: this.state.photo,
            })
          );
          console.log("response.data.user", JSON.parse(response.config.data));
          this.props.navigation.replace("Tabs");
        } else if (response.data.saved === 1) {
          alert("saved");
          this.props.navigation.replace("Tabs");
        } else {
          this.setState({ error: true });
          this.setState({ errorMessage: response.data.err });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ error: true, loading: false });
        this.setState({ errorMessage: "Server Error" });
        this.setState({ loading: false });
      });
  };
  onSubmit = async () => {
    const {
      email,
      password,
      username,
      city,
      mobile,
      firstname,
      lastname,
      add1,
      postcode,
      photo,
    } = this.state;

    this.setState({ error: false, loading: true });
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ userData });
    // console.log("profile", userData);

    if (this.profile?.id) {
      this.createSocialMediaUser();
    } else {
      if (userData) {
        let error = "";
        let errorCount = [];
        if (!city) {
          error = "Please Enter the City first";
          errorCount.push("City");
        }
        if (!mobile) {
          error = "Please Enter the Mobile Number first";
          errorCount.push("Phone Number");
        }
        if (!firstname) {
          error = "Please Enter the Firstname  first";
          errorCount.push("Firstname");
        }
        if (!lastname) {
          error = "Please Enter the Lastname first";
          errorCount.push("Lastname");
        }
        if (!add1) {
          error = "Please Enter the Address first";
          errorCount.push("Address");
        }
        if (!postcode) {
          error = "Please Enter the Postcode first";
          errorCount.push("Postal Code");
        }
        if (!photo) {
          error = "Please Select the Photo first";
          errorCount.push("Photo");
        }
        if (!email || !username || !city || !mobile) {
          // alert(errorCount);
          this.setState({ error: true, loading: false });
          console.log("errorcount", errorCount);
          if (
            errorCount.filter((er) =>
              ["Username", "Email", "City", "Phone Number"].includes(er)
            ).length
          ) {
            error = "Empty fields are not allowed while updating user profile";

            Alert.alert(
              "Please add following fields: ",
              errorCount
                .filter((er) =>
                  ["Username", "Email", "City", "Phone Number"].includes(er)
                )
                .join("\n"),
              [
                {
                  text: "OK",
                  onPress: () => {
                    this.setState({ error: false, loading: false });
                  },
                },
              ]
            );
            return;
          }
        } else if (!firstname || !lastname || !add1 || !postcode || !photo) {
          Alert.alert(
            "Dont forget to add following fields: ",
            errorCount.join("\n"),
            [
              {
                text: "OK",
                onPress: () => {
                  this.setState({ error: false });
                  this.updateUser(userData);
                },
              },
            ]
          );
        } else {
          this.updateUser(userData);
        }
      } else {
        this.createUser();
      }
    }
    [];
    return;
  };
  renderButtons(backBtnCallback, nextBtnCallback) {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            flex: 1,

            marginHorizontal: 20,
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <Button
            style={{ ...styles.button }}
            textStyle={{ ...styles.buttonText }}
            color={"#787878"}
            title={"BACK"}
            onPress={() => backBtnCallback()}
          />
          <Button
            style={{ ...styles.button }}
            color={"#fdb32b"}
            loading={this.state.loading}
            textStyle={{ ...styles.buttonText, color: "#000" }}
            title={this.state.basic ? "NEXT" : "SAVE"}
            onPress={() => nextBtnCallback()}
          />
        </View>

        {!this.state.basic && this.props.navigation.getParam("previous") && (
          <Button
            style={{
              ...styles.button,
              width: "90%",
              flex: 1,

              marginHorizontal: 20,
              marginBottom: 30,
            }}
            color={"#555"}
            // loading={this.state.loading}
            textStyle={{ ...styles.buttonText, color: "#fff" }}
            title={"Cancel Payments"}
            onPress={() => {
              Platform.OS === "ios"
                ? Linking.openURL(
                    "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions"
                  )
                : Linking.openURL(
                    "https://play.google.com/store/account/subscriptions?package=android.test.purchased&sku=android.test.purchased"
                  );
            }}
          />
        )}
      </>
    );
  }
  checkError = () => {
    if (this.state.error) {
      if (
        this.state.errorMessage?.includes("e-mail") ||
        this.state.errorMessage?.includes("email") ||
        this.state.errorMessage?.includes("username") ||
        this.state.errorMessage?.includes("Username")
      ) {
        this.setState({ basic: true, error: false });
        Alert.alert("Error", this.state.errorMessage, [
          {
            text: "OK",
            onPress: () => {
              this.setState({ error: false });
            },
          },
        ]);
      }
   
    }
  };
  render() {
    this.checkError();
    return (
      <KeyboardAvoidingView
        behavior="height"
        style={{ ...styles.mainContainer }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        >
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={require("../../assets/images/splash.png")}
            />
          </View>

          {this.state.basic ? (
            <View
              style={{
                flexDirection: "column",

                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  ...styles.imageView,
                  height: 50,
                  marginVertical: -10,
                }}
              >
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={require("../../assets/images/profile-part-1.png")}
                />
              </View>
              <ImageInput
                type="Photo"
                logo={true}
                callback={(photo) => this.setState({ photo })}
              >
                <Image
                  style={styles.profileImage}
                  source={
                    !this.state.photo?.length
                      ? require("../../assets/images/profile.png")
                      : { uri: this.state.photo }
                  }
                />
              </ImageInput>

              <ImageInput
                // type="Photo"
                // logo={true}
                callback={(photo) => this.setState({ photo })}
              >
                <Text
                  style={{
                    ...styles.message,
                    color: "#af313d",
                    backgroundColor: "white",
                    marginVertical: -10,
                  }}
                >
                  ADD PIC TO GET FREE BIDS!
                </Text>
              </ImageInput>

              
              <View style={{ width: "90%", marginTop: 20 }}>
                <Input
                  placeholder={"Username"}
                 
                  disabled={
                    (this.state.isDashboard || this.state.disabled) &&
                    !this.state?.guestUser?.includes("Guest")
                  }
                  keyboardType={"default"}
                  onChangeText={(text) => this.onChange(text, "username")}
                  value={this.state.username}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
                <Input
                  placeholder={"E-mail"}
                  // leftIcon={{name: 'mail-outline', color: '#4270ba'}}
                  // leftIconContainerStyle={{paddingLeft: 10}}
                  disabled={
                    (this.state.isDashboard || this.state.disabled) &&
                    !this.state?.guestUser?.includes("Guest")
                  }
                  keyboardType={"email-address"}
                  onChangeText={(text) => this.onChange(text, "email")}
                  value={this.state.email}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
                <Input
                  placeholder={"Town/City"}
                  // leftIcon={{name: 'city-outline'}}
                  keyboardType={"default"}
                  onChangeText={(text) => this.onChange(text, "city")}
                  value={this.state.city}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
               
                {this.renderButtons(
                  () => {
                    if (!this.state.isDashboard) {
                      // BackHandler.exitApp();
                      this.props.navigation.goBack(null);
                    } else {
                      this.props.navigation.goBack(null);
                    }
                  },
                  () => {
                    // this.onSubmit();
                    if (
                      // this.state.photo &&
                      this.state.email &&
                      this.state.username
                    ) {
                      this.setState({ basic: false });
                    } else {
                      let error = "";
                      // if (!this.state.photo) {
                      //   error = error + "Please Upload the Profile Picture";
                      // }
                      if (!this.state.username) {
                        if (error === "") {
                          error = error + "Please Enter the Username";
                        } else if (!this.state.email) {
                          error = error + "and Enter Username";
                        } else {
                          error = error + " Enter Username";
                        }
                      }
                      if (!this.state.email) {
                        if (error === "") {
                          error = error + "Please Enter the Email";
                        } else {
                          error = error + " and Enter Email";
                        }
                      }
                      error = error + " first";
                      Alert.alert("Error", error);
                    }
                  }
                )}
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                marginTop: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  ...styles.imageView,
                  height: 50,
                  marginVertical: -50,
                }}
              >
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={require("../../assets/images/profile-part-2.png")}
                />
              </View>
              <Text style={styles.message}>
                THIS INFO WILL BE NEEDED IF YOU WIN
              </Text>
              <View style={{ width: "90%", marginTop: 20 }}>
                <Input
                  placeholder={"First Name"}
                  // leftIcon={{name: 'mail-outline'}}
                  keyboardType={"default"}
                  onChangeText={(text) => this.onChange(text, "firstname")}
                  value={this.state.firstname}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
                <Input
                  placeholder={"Surname"}
                  // leftIcon={{name: 'mail-outline'}}
                  keyboardType={"default"}
                  onChangeText={(text) => this.onChange(text, "lastname")}
                  value={this.state.lastname}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
                <Input
                  placeholder={"Address"}
                  // leftIcon={{name: 'mail-outline'}}
                  keyboardType={"default"}
                  onChangeText={(text) => this.onChange(text, "add1")}
                  value={this.state.add1}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
                <Input
                  placeholder={"Postcode"}
                  // leftIcon={{name: 'mail-outline'}}
                  // keyboardType={'d'}
                  onChangeText={(text) => this.onChange(text, "postcode")}
                  value={this.state.postcode}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />
                <Input
                  placeholder={"Mobile Number"}
                  // leftIcon={{name: 'call-outline'}}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) => this.onChange(text, "mobile")}
                  value={this.state.mobile}
                  autoCapitalize="none"
                  inputStyle={{ color: "#555" }}
                  placeholderTextColor={"#888"}
                  inputContainerStyle={{
                    ...styles.inputContainerStyle,
                  }}
                />

                {/* {this.state.error && (
                  <Text
                    style={{
                      margin: 10,
                      marginBottom: 30,
                      color: "red",
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                   {this.state.errorMessage} 
                  </Text> 
                )}*/}
                {this.renderButtons(
                  () => this.setState({ basic: true }),
                  () => this.onSubmit()
                )}
              </View>
              {/* <Dialog
                dialogStyle={{
                  // backgroundColor: "#fff",
                  // borderRadius: 15,
                  elevation: 5,
                  shadowColor: "#fff",
                }}
                visible={this.state.error}
                // title="Bids Filter"
                onTouchOutside={() =>
                  this.setState({ error: false })
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
                      color:'red'
                    }}
                  >
                   {this.state.errorMessage}
                  </Text>
                </View>
              </Dialog> */}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
ProfileScreen.navigationOptions = {
  title: "",
  headerStyle: {
    height: 0,
  },
};

export default ProfileScreen;

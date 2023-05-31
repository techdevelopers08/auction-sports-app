import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";
import Button from "../Button";
export default class FBLoginButton extends React.Component {
  constructor(props) {
    super(props);
    // console.log("FBLOGIN", props);
  }
  state = {
    userInfo: {},
  };
  loginCustom = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
          alert("hello")
          console.log("result", result);
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  };
  
  getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: { string: "id, name, first_name, last_name, email" },
    };
    const profileRequest = new GraphRequest(
      "/me",
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, result) => {
        if (error) {
          console.log("Loginhas an error", error);
        } else {
          console.log("Edr a rea")
          this.setState({ userInfo: result });
          console.log("result", result);
          const profileInfo = {
            id: result.id,
            firstName: result.first_name || "",
            platform: "facebook",
            lastName: result.last_name,
            fullName: result.name,
            email: result.email || "",
          };
          this.props.setUserInfo(profileInfo);
          // this.props.navigation.replace('Profile', {userInfo: profileInfo});
        }
      }
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };
  componentWillReceiveProps(nextProps) {
    console.log("FBcomponentWillReceiveProps", nextProps);
  }
  render() {
    // this.props.navigation.navigate('Profile')
    // console.log(this.props);
    return (
      <View style={{ width: "100%", height: 70 }}>
        {/* <Button
          style={{ ...this.props.style }}
          icon="facebook"
          color="#38548C"
          // style={{elevation:1}}
          title="Sign in with Facebook"
          onPress={() => this.loginCustom()}
        /> */}
        <LoginButton
          style={{ width: '100%', backgroundColor: "green", height: 70 }}
          publishPermissions={["email", "instagram_basic"]}
          onLoginFinished={(error, result) => {
            if (error) {
              // alert('Login failed with error: ' + error.message);
              console.log(error);
            } else if (result.isCancelled) {
              // alert('Login was cancelled');
            } else {
              AccessToken.getCurrentAccessToken().then((data) => {
                const accessToken = data.accessToken.toString();
                this.getInfoFromToken(accessToken);
              });
              console.log("Login was successful with permissions: ", result);
            }
          }}
          onLogoutFinished={() => {
            // alert('User logged out');
            this.setState({ userInfo: {} });
          }}
        />
      </View>
    );
  }
}

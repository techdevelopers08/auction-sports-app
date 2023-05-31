import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CookieManager from '@react-native-community/cookies';
import {Icon} from 'react-native-elements'
import assets from '../../assets';
import Button from '../Button'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  setIgToken = data => {
    console.log('data', data);
    this.setState({token: data.access_token});
  };

  onClear() {
    CookieManager.clearAll(true).then(res => {
      this.setState({token: null});
    });
  }
  render() {
    return (
      <>
        <Button
        icon="instagram"
        color="#af3aad"
          style={{margin:10}}
          onPress={() => this.instagramLogin.show()}
          title="Sign in with Instagram"
          >
          
        </Button>
        {/* <TouchableOpacity
          style={[styles.btn, {marginTop: 10, backgroundColor: 'green'}]}
          onPress={() => this.onClear()}>
          <Text style={{color: 'white', textAlign: 'center'}}>Logout</Text>
        </TouchableOpacity>
        <Text style={{margin: 10}}>Token: {this.state.token}</Text>
        {this.state.failure && (
          <View>
            <Text style={{margin: 10}}>
              failure: {JSON.stringify(this.state.failure)}
            </Text>
          </View>
        )} */}
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          appId="your-app-id"
          appSecret="your-app-secret"
          redirectUrl="your-redirect-Url"
          scopes={['user_profile', 'user_media']}
          onLoginSuccess={this.setIgToken}
          onLoginFailure={data => console.log(data)}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 5,
    backgroundColor: 'orange',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

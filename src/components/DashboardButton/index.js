import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

import styles from './styles';
import {Image} from 'react-native';

const DashboardButton = props => {
  useEffect(() => {}, []);
  const {onPress, title, disabled} = props;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={{}}>
      {/* <View style={styles.btnContainer}> */}
      <View style={{...styles.imgContainer,...props.style}}>
        <Icon
          style={styles.img}
          type={props.iconType || 'entypo'}
          name={props.iconName || 'facebook'}
          size={50}
          color={'#fff'}
        />
        <Text style={styles.textView}>{title}</Text>
      </View>
      {/* </View> */}
    </TouchableOpacity>
  );
};

DashboardButton.defaultProps = {
  title: 'title',
  imgSource: "{require('../../assets/images/700.png')}",
};

export default DashboardButton;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Stack from './src/navigation/AppNavigator';

const App = () => {
  return (
    <View style={styles.main}>
      <Stack />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
  },
});

export default App;

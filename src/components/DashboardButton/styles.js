import {StyleSheet} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  btnContainer: {backgroundColor:'#3f75af',padding: 20,borderRadius:10,elevation:1},
  imgContainer: {alignSelf:'center',backgroundColor:'#3f75af',margin: 20,borderRadius:10,elevation:1,height:150,width:150,alignItems:'center',justifyContent:'space-around',paddingVertical:20},
  textView: {textAlign: 'center', padding: 10, fontWeight: 'bold',alignSelf:'center',color:'#fff'},
  img:{alignSelf:'center',color:'#fff'}
});

export default styles;

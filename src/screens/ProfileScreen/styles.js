import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff'
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  inputContainerStyle: {
    borderColor: '#555',
    // borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 0,
    marginHorizontal: 10,
    backgroundColor: '#f1f1f1',
    paddingLeft: 10,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
    padding: 20,
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: '#4270ba',
    color:'white'

  },
  imageView: {
    width: '100%',
    marginVertical: 60,
    marginBottom: 30,
    height: 70,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button:{width: '40%',borderRadius:3,},
  buttonText:{
    fontWeight:'bold',
    fontSize:18
  }
});

export default styles;

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    margin: 10,
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  headerView: {
    flexDirection:'row',
    backgroundColor: '#000000',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 10,
    alignItems:'center',
    justifyContent:'space-between'
  },
  headerText: {
    color: '#ffffff',
    // flex:1,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom:10,
    alignSelf:'center'
  },
  row: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTime: {
    flexDirection: 'row',
  },
  date: {
    // marginRight: 20,
    marginLeft:-40,
    fontWeight: 'bold',
  },
  time: {
    fontWeight: 'bold',
    marginLeft:-40
  },
  priceView: {},
  price: {
    fontWeight: 'bold',
  },
  imageView: {
    height: 44,
    width: 44,
    backgroundColor:'#fff',
    borderRadius:0,
    elevation:10
    ,shadowOffset:{width:3,height:3}
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    elevation:5
  },
});

export default styles;

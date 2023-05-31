import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const Button = ({
  color,
  icon,
  title,
  onPress,
  style = {},
  textStyle = {},
  loading,
  loadingColor,
}) => {
  return (
    <>
      {!loading ? (
        <TouchableOpacity
          onPress={() => {
            onPress();
          }}
          style={[
            styles.button,
            style,
            { flexDirection: "row", justifyContent: "flex-start" },
            color ? { backgroundColor: color } : null,
          ]}
        >
          {icon ? (
            <Icon
              // type='FontAwesome'
              style={{ marginLeft: 15 }}
              name={icon || "email"}
              size={23}
              color={"#fff"}
            />
          ) : null}

          {/* <View style={{alignItems:"center",flex:1}}> */}
          <Text
            numberOfLines={1}
            style={[styles.title, textStyle, { flex: 1, textAlign: "center" }]}
          >
            {title || "title"}
          </Text>
          {/* </View> */}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            onPress();
          }}
          style={[
            styles.button,
            style,
            color ? { backgroundColor: color } : null,
          ]}
        >
          {loadingColor ? (
            <ActivityIndicator color={loadingColor} />
          ) : (
            <ActivityIndicator animating={true} color="white" />
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    // borderWidth: 1,
    // borderColor: 'white',
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4270ba",
    elevation: 1,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 16,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
});

export default Button;

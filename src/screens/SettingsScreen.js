import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, AsyncStorage } from "react-native";
import AppleHeader from "react-native-apple-header";
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group";
import {StackActions} from '@react-navigation/native';
const _iconStyle = (borderColor) => ({
  height: 50,
  width: 50,
  borderRadius: 25,
  borderColor: borderColor,
});

const styles = {
  // container: { marginTop: 5 },
  verticalStyle: { marginTop: 16 },
  textStyle: { textDecorationLine: "none" },
  iconImageStyle: { height: 20, width: 20 },
};

const staticData = [
  {
    id: 0,
    fillColor: "#ff7473",
    unfillColor: "#fbbfbb",
    iconStyle: _iconStyle("#fbbfbb"),
    iconImageStyle: styles.iconImageStyle,
  },
  {
    id: 1,
    fillColor: "#5567e9",
    unfillColor: "#afb5f5",
    iconStyle: _iconStyle("#afb5f5"),
    iconImageStyle: styles.iconImageStyle,
  },
  {
    id: 2,
    fillColor: "#a98ae7",
    unfillColor: "#cab6f4",
    iconStyle: _iconStyle("#cab6f4"),
    iconImageStyle: styles.iconImageStyle,
  },
  {
    id: 3,
    fillColor: "#fcb779",
    unfillColor: "#ffd1a7",
    iconStyle: _iconStyle("#ffd1a7"),
    iconImageStyle: styles.iconImageStyle,
  },
  {
    id: 4,
    fillColor: "#2be055",
    unfillColor: "#cbf2d5",
    iconStyle: _iconStyle("#cbf2d5"),
    iconImageStyle: styles.iconImageStyle,
  },
];

const verticalStaticData = [
  {
    id: 0,
    text: "English",
    name:"EN",
    fillColor: "#ff7473",
    unfillColor: "#fbbfbb",
    iconStyle: _iconStyle("#fbbfbb"),
    textStyle: styles.textStyle,
    style: styles.verticalStyle,
    iconImageStyle: styles.iconImageStyle,
  },
  {
    id: 1,
    text: "ภาษาไทย",
    name:"TH",
    fillColor: "#5567e9",
    unfillColor: "#afb5f5",
    iconStyle: _iconStyle("#afb5f5"),
    textStyle: styles.textStyle,
    style: styles.verticalStyle,
    iconImageStyle: styles.iconImageStyle,
  },
  // {
  //   id: 2,
  //   text: "Soft Purple",
  //   fillColor: "#a98ae7",
  //   unfillColor: "#cab6f4",
  //   iconStyle: _iconStyle("#cab6f4"),
  //   textStyle: styles.textStyle,
  //   style: styles.verticalStyle,
  //   iconImageStyle: styles.iconImageStyle,
  // },
  // {
  //   id: 3,
  //   text: "Takao",
  //   fillColor: "#fcb779",
  //   unfillColor: "#ffd1a7",
  //   iconStyle: _iconStyle("#ffd1a7"),
  //   textStyle: styles.textStyle,
  //   style: styles.verticalStyle,
  //   iconImageStyle: styles.iconImageStyle,
  // },
  // {
  //   id: 4,
  //   text: "Malachite",
  //   fillColor: "#2be055",
  //   unfillColor: "#cbf2d5",
  //   iconStyle: _iconStyle("#cbf2d5"),
  //   textStyle: styles.textStyle,
  //   style: styles.verticalStyle,
  //   iconImageStyle: styles.iconImageStyle,
  // },
];

const SettingsScreen = () => {
  const [lang, setLang] = useState('TH')
  useEffect(() => {
    const run= async () => {
      try {
        let getlang=await AsyncStorage.getItem('language')
        setLang(getlang)
      } catch (e) {
        console.log(e)
      }
    };

    run();
  }, []);

  // const imageSource = {
  //   uri:
  //     "https://images.unsplash.com/photo-1499482125586-91609c0b5fd4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
  // };

  // const horizontalCheckboxGroupContainer = () => (
  //   <>
  //     <View style={{ marginLeft: 32 }}>
  //       <Text style={{ color: "#a8a8ac", fontWeight: "500", fontSize: 16 }}>
  //         Pick your favorite color
  //       </Text>
  //     </View>
  //     <View
  //       style={{
  //         marginTop: 16,
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <BouncyCheckboxGroup
  //         data={staticData}
  //         onChange={(selectedItem) => {
  //           console.log("SelectedItem: ", JSON.stringify(selectedItem));
  //         }}
  //       />
  //     </View>
  //   </>
  // );
const navigation = useNavigation()
  const verticalCheckboxGroupContainer = (lang) => (
     
    <>
     
      <View
        style={{
          marginTop: 16,
          marginLeft: 32,
          justifyContent: "center",
        }}
      >
        <BouncyCheckboxGroup
          data={verticalStaticData}
          style={{ flexDirection: "column" }}
          initial={lang=='EN'?0:1}
          onChange={(selectedItem) => {
            if (selectedItem.id==0) {
               AsyncStorage.setItem('language', 'EN');
            }else{
               AsyncStorage.setItem('language', 'TH');
            }
            navigation.dispatch(StackActions.replace('Main'));
            
          }}
        />
      </View>
    </>
  );

  return (
    <>

        <View style={styles.container}>
          {/* {horizontalCheckboxGroupContainer()} */}
          {verticalCheckboxGroupContainer(lang)}
        </View>
     
    </>
  );
};

export default SettingsScreen;
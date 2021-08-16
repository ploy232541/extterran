import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, AsyncStorage } from "react-native";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {httpClient} from '../core/HttpClient';
import {
  useFonts,
  BaiJamjuree_200ExtraLight,
  BaiJamjuree_200ExtraLight_Italic,
  BaiJamjuree_300Light,
  BaiJamjuree_300Light_Italic,
  BaiJamjuree_400Regular,
  BaiJamjuree_400Regular_Italic,
  BaiJamjuree_500Medium,
  BaiJamjuree_500Medium_Italic,
  BaiJamjuree_600SemiBold,
  BaiJamjuree_600SemiBold_Italic,
  BaiJamjuree_700Bold,
  BaiJamjuree_700Bold_Italic,
} from '@expo-google-fonts/bai-jamjuree';
import { AppLoading } from 'expo';

const FunctionHome = ({ functionType }) => {
  let [fontsLoaded] = useFonts({
    BaiJamjuree_200ExtraLight,
    BaiJamjuree_200ExtraLight_Italic,
    BaiJamjuree_300Light,
    BaiJamjuree_300Light_Italic,
    BaiJamjuree_400Regular,
    BaiJamjuree_400Regular_Italic,
    BaiJamjuree_500Medium,
    BaiJamjuree_500Medium_Italic,
    BaiJamjuree_600SemiBold,
    BaiJamjuree_600SemiBold_Italic,
    BaiJamjuree_700Bold,
    BaiJamjuree_700Bold_Italic,
  });
  const navigation = useNavigation();
  const [lang, setLang] = useState('');
  const [visitors, setVisitors] = useState(0);
  useEffect(() => {
      const run = async () => {
          try {
            let getLang = await AsyncStorage.getItem('language');
            setLang(getLang)
            if (getLang === 'EN') {
              var lang_id = '1';
            } else {
              var lang_id = '2';
            }
            httpClient
              .get(`/Visitors/Counter`)
              .then(response => {
                  let res = response.data;
                  if (res != null) {
                    setVisitors(res)
                  }
              })
              .catch(error => {
                  console.log(error);
              });

          } catch (e) {
            console.log(e)
          }
        };
      run();
      
    }, []);
    if (!fontsLoaded) {
      return <AppLoading />;
    } else {
  switch (functionType) {
    case "guide":
      return (
        <TouchableOpacity
          style={styles.functionTypeStyle}
          onPress={() => navigation.navigate("HowToUseListScreen")}
        >
          <View>
            <Avatar.Icon icon="launch" style={{ backgroundColor: "#F5A700" }} />
          </View>
          <Text style={styles.textStyle}>
            {lang === 'EN' ? 'How to use' : 'วิธีการใช้งาน'}{"\n"}{lang === 'EN' ? 'E-learning' : 'ระบบ E-learning'}
          </Text>
        </TouchableOpacity>
      );
    case "qa":
      return (
        <TouchableOpacity
          style={styles.functionTypeStyle}
          onPress={() => navigation.navigate("QandAListScreen")}
        >
          <View>
            <Avatar.Icon
              icon="account-question"
              style={{ backgroundColor: "#634B78" }}
            />
          </View>
          <Text style={styles.textStyle}>{lang === 'EN' ? 'Q&A' : 'ถามตอบ'}{"\n"}{lang === 'EN' ? 'Problem' : 'ปัญหาการใช้งาน'}</Text>
        </TouchableOpacity>
      );
    case "download":
      return (
        <TouchableOpacity
          style={styles.functionTypeStyle}
          onPress={() => navigation.navigate("DownloadScreen")}
        >
          <View>
            <Avatar.Icon
              icon="file-download"
              style={{ backgroundColor: "#007166" }}
            />
          </View>
          <Text style={styles.textStyle}>
            {lang === 'EN' ? 'Download Documents' : 'เอกสารดาวน์โหลด'}{"\n"}{lang === 'EN' ? 'System Guide' : 'คู่มือและระบบอื่น ๆ'}
          </Text>
        </TouchableOpacity>
      );
      case "library":
      return (
        <TouchableOpacity style={styles.functionTypeStyle} 
        onPress={() => navigation.navigate("LibraryScreen")}
        >
          <View>
            <Avatar.Icon icon="library" 
            style={{ backgroundColor: "#ff471a" }}/>
          </View>
          <Text style={styles.textStyle,{fontFamily:'BaiJamjuree_400Regular'}}>
          {lang === 'EN' ? 'library' : 'ห้องสมุด'}
          </Text>
        </TouchableOpacity>
      );
    // case "visited":
    //   return (
    //     <TouchableOpacity style={styles.functionTypeStyle} disabled={true}>
    //       <View>
    //         <Avatar.Icon icon="human" />
    //       </View>
    //       <Text style={styles.textStyle}>
    //       {lang === 'EN' ? '' : 'จำนวนผู้เข้าชมเว็บไซต์'}{"\n"}{visitors} {lang === 'EN' ? 'visitors' : 'คน'}
    //       </Text>
    //     </TouchableOpacity>
    //   );
    default:
      return Alert.alert("Something went wrong!");
  }}
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily:'BaiJamjuree_400Regular',
    fontSize: 14,
    color: "#0097fc",
    paddingTop: 12,
    textAlign: "center",
  },
  functionTypeStyle: {
    alignItems: "center",
    paddingTop: 20,
  },
});

export default FunctionHome;

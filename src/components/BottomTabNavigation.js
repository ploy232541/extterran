import React, {useEffect, useState} from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icons from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "../screens/Home/HomeScreen";
import MyProgramsScreen from "../screens/MyProgramsScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import { AsyncStorage } from "react-native"
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

const Tab = createBottomTabNavigator();

function BottomTabNavigation({ initRoute }) {
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
  const [lang, setLang] = useState('');
  useEffect(() => {
      const run = async () => {
          try {
            let getLang = await AsyncStorage.getItem('language');
            setLang(getLang)
          } catch (e) {
            console.log(e)
          }
        };
      run();
      
    }, []);
    if (!fontsLoaded) {
      return <AppLoading />;
    } else {
  return (
    <Tab.Navigator initialRouteName={initRoute}>
      <Tab.Screen
      style={{fontFamily:'BaiJamjuree_400Regular'}}
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: lang == 'EN' ? 'Home' : "หน้าหลัก",
          tabBarIcon: ({ color, size }) => (
            <Icons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyProgramsTab"
        component={MyProgramsScreen}
        options={{
          tabBarLabel: lang == 'EN' ? 'Courses' : "หลักสูตร",
          tabBarIcon: ({ color, size }) => (
            <Icons name="view-list" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: "ค้นหา",
          tabBarIcon: ({ color, size }) => (
            <Icons name="search" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        style={{fontFamily:'BaiJamjuree_400Regular'}}
        options={{
          tabBarLabel: lang == 'EN' ? 'User' : "ผู้ใช้",
          tabBarIcon: ({ color, size }) => (
            <Icons name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );}
}

export default BottomTabNavigation;


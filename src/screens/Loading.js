import React, {useEffect} from 'react';
import {Text, View, AsyncStorage, StyleSheet, Alert} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import { useNavigation } from "@react-navigation/native"

  function loading() {
    const navigation = useNavigation()
    useEffect(() => {
      const checkToken = async () => {
        try {
          await AsyncStorage.setItem('language', 'TH');
          let userToken = await AsyncStorage.getItem('token');
          if (userToken != null) {
            navigation.dispatch(StackActions.replace('Main'));
          } else {
            navigation.dispatch(StackActions.replace('LoginScreen'));
          }
        } catch (e) {
          console.log(e)
        }
      };
  
      checkToken();
    }, []);

    return (
        <View style={styles.container}>
           <ActivityIndicator size={30} color="#0099ff" />
        </View>
      );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default loading

import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  AsyncStorage,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';
import { Title } from "react-native-paper";
import { Container, Header, Content, ListItem, Text, Radio, Right, Left } from 'native-base';
import { useNavigation } from "@react-navigation/native"
import {StackActions} from '@react-navigation/native';

function SettingsScreen() {
  const navigation = useNavigation()

  const [thai, setThai] = useState(false);
  const [eng, setEng] = useState(false);

  useEffect(() => {
    const run= async () => {
      try {
        let language = await AsyncStorage.getItem('language');
        // console.log(language)
        if (language === 'EN') {
          setEng(true)
        } else {
          setThai(true)
        }
      } catch (e) {
        console.log(e)
      }
    };

    run();
  }, []);

  const selectedRadioTH = async () => {
    setThai(true)
    setEng(false)
    await AsyncStorage.setItem('language', 'TH');
    navigation.dispatch(StackActions.replace('Main'));
  }
  const selectedRadioEN = async () => {
    setEng(true)
    setThai(false)
    await AsyncStorage.setItem('language', 'EN');
    navigation.dispatch(StackActions.replace('Main'));
  }
  return (
    <Container>
        <Content>
            <ListItem onPress={selectedRadioTH} selected={thai} >
              <Left>
                <Text>ภาษาไทย</Text>
              </Left>
              <Right>
                <Radio
                  disabled
                  color={"#f0ad4e"}
                  selectedColor={"#5cb85c"}
                  selected={thai}
                />
              </Right>
            </ListItem>
          <ListItem onPress={selectedRadioEN} selected={eng}>
            <Left>
              <Text>English</Text>
            </Left>
            <Right>
              <Radio
                disabled
                color={"#f0ad4e"}
                selectedColor={"#5cb85c"}
                selected={eng}
              />
            </Right>
          </ListItem>
        </Content>
      </Container>
  )
}

export default SettingsScreen;

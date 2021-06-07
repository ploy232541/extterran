import React, {Component} from 'react';
import {Text, View, AsyncStorage, Alert, Platform, Dimensions} from 'react-native';
import {Item, Input, Icon, Label, Button} from 'native-base';
import {httpClient} from '../core/HttpClient';
import AwesomeAlert from 'react-native-awesome-alerts';
// import DeviceInfo from 'react-native-device-info';
import { useNavigation } from "@react-navigation/native"
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      email: '',
      showAlert: null,
    };
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  onConfirm = () => {
    const { navigation } = this.props;
    this.setState({
      showAlert: false,
    });
    navigation.navigate('LoginScreen');
  };

  async componentDidMount() {
    const res = await AsyncStorage.getItem('language');
    if (res === 'EN') {
      this.setState({lang: 'EN'});
    } else {
      this.setState({lang: 'TH'});
    }
  }

  sendEmail = () => {
    try {
        const {email} = this.state;
  
        if (email === '') {
          Alert.alert(
            this.state.lang === 'EN'
              ? 'Please enter email.'
              : 'กรุณาใส่อีเมล',
          );
        } else {
          const params = {email: email};
          httpClient
          .post('/Login/Forgotpassword', params)
          .then(async response => {
            const res = response.data;
             if (res.result === 'Send email success') {
                this.showAlert();
             }else if(res.err === 'This email does not exist in the database'){
              Alert.alert(
                this.state.lang === 'EN'
                  ? 'This email does not exist in the database.'
                  : 'อีเมลนี้ไม่มีอยู่ในฐานข้อมูล',
              );
            }else if(res.result === 'Send email fail'){
              Alert.alert(
                this.state.lang === 'EN'
                  ? 'Email failed to send.'
                  : 'ส่งอีเมลไม่สำเร็จ',
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
        }
      } catch (err) {
        Alert.alert(err);
      }
  }
  
  render() {
    const { navigation } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1, 
          marginTop: 20,  
          marginLeft: 20, 
          marginRight: 20, 
          marginBottom: 20}}>
          <View
            style={{padding: 20, backgroundColor: '#f2f2f2', borderRadius: 10}}>
            <Label
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 22,
                marginBottom: 20,
              }}>
              {this.state.lang === 'EN' ? 'Forgot password' : 'ลืมรหัสผ่าน'}
            </Label>
            <View style={{marginBottom: 10}}>
              <Item floatingLabel>
                <Label>
                  {this.state.lang === 'EN'
                    ? 'Email'
                    : 'อีเมล'}
                </Label>
                <Input
                  onChangeText={text => this.setState({email: text})}
                />
                <Icon
                  type="MaterialCommunityIcons"
                  name="email"
                />
              </Item>
            </View>
            <View style={{marginTop: 30}}>
              <Button
                style={{
                  alignSelf: 'center',
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: '#ffc107',
                }}
                onPress={this.sendEmail}>
                <Text>
                  {this.state.lang === 'EN'
                    ? 'Send message'
                    : 'ส่งข้อความ'}
                </Text>
              </Button>
            </View>
          </View>
        </View>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          icon="checkcircle"
          title={this.state.lang === 'EN' ? 'Alert' : 'แจ้งเตือน'}
          message={
            this.state.lang === 'EN'
              ? 'Please check your email to reset your password.'
              : 'กรุณาเช็คอีเมลเพื่อรีเซตรหัสผ่าน'
          }
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          confirmText={this.state.lang === 'EN' ? 'OK' : 'ตกลง'}
          confirmButtonColor="#0099ff"
          onConfirmPressed={this.onConfirm}
        />
      </View>
    );
  }
}

export default function(props) {
    const navigation = useNavigation();
  
    return <ForgotPasswordScreen {...props} navigation={navigation} />;
  }

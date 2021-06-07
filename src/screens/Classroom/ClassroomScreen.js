import React, {Component} from 'react';
import {Text, View, SafeAreaView, AsyncStorage, Linking, TouchableOpacity, StyleSheet, Image, Platform} from 'react-native';
// import {IMAGE} from '../../../constants/Image';

export default class ClassroomScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
    };
  }
  async componentDidMount() {
    const res = await AsyncStorage.getItem('language');
    if (res === 'EN') {
      this.setState({lang: 'EN'});
    } else {
      this.setState({lang: 'TH'});
    }
  }

  async Send(){
    const user_id = await AsyncStorage.getItem('userId');
    Linking.openURL(`http://smartxlearning.com/login/loginapp/${user_id}?key=BwjPHhyjbhhhU4pex5e1igys5Dp8adlWe`)
    // Linking.openURL(`http://localhost/lms_exterran/login/loginapp/${user_id}?key=BwjPHhyjbhhhU4pex5e1igys5Dp8adlWe`)
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1, marginTop: 30}}>
          <TouchableOpacity onPress={this.Send.bind(this)}>
            <View style={{alignItems: 'center', padding: 30, backgroundColor: '#f2f2f2',
             padding: 20, borderRadius: 20, marginLeft: 30, marginRight: 30}}>
                <Image resizeMode='stretch' style={{width: '100%', height: 230}} 
                source={{uri: 'http://smartxlearning.com/themes/template/images/logo_course.jpg'}}
                />
                <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#404040'}}>{this.state.lang == 'EN' ? "Classroom online" : "ห้องเรียนออนไลน์"}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  loginButtonText: {
    fontSize: 20,
    color: '#FFF',
    alignSelf: 'center',
  },
  loginButton: {
    height: 45,
    backgroundColor: '#002266',
    alignSelf: 'stretch',
    marginTop: 20,
    margin: 20,
    borderRadius: 30,
    justifyContent: 'center',
  },
});

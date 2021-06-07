import React, {Component} from 'react';
import {Text, View, StyleSheet, AsyncStorage, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Button} from 'react-native-paper';
import moment from 'moment';
// import DeviceInfo from 'react-native-device-info';
import {httpClient} from '../../core/HttpClient';

export default class ModalShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',

      course_title_alert: '',
      course_date_start_alert: '',
      course_date_end_alert: '',
      course_day_learn_alert: '',
      diff_alert: '',
    };
  }
  async componentDidMount() {
    try {
      const user_id = await AsyncStorage.getItem('userId');
      const res = await AsyncStorage.getItem('language');
      if (res === 'EN') {
        this.setState({lang: 'EN'});
      } else {
        this.setState({lang: 'TH'});
      }
      httpClient
      .get(`/CourseOnline/getAlertModelDateTimeCourse/${this.props.course_id}/${user_id}`)
      .then(async response => {
        const result = response.data;
          if (result != null) {
                this.setState({course_title_alert: result.course_title, course_date_start_alert: result.course_date_start,
                course_date_end_alert: result.course_date_end, course_day_learn_alert: result.course_day_learn , diff_alert: result.diff})
          }
        })
        .catch(error => {
        console.log(error);
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  render() {
    let {container, buttun} = styles;
    return (
      <View style={container}>
        <Icon name="info-circle" size={60} style={{color: '#ff9900'}} />
        <Text style={{fontSize: 22, fontWeight: 'bold', marginTop:18}}>{this.state.lang === 'EN' ? 'Register Course' : 'ท่านได้ลงทะเบียนเรียน'}</Text>
        <Text style={{fontSize: 18, marginTop:25, textAlign: 'center'}}>{this.state.lang === 'EN' ? 'Course' : 'หลักสูตร'} "{this.state.course_title_alert}" {this.state.lang === 'EN' ? 'Successful' : 'เรียบร้อยแล้ว'}</Text>
        {/* <Text style={{fontSize: 14, color: '#ff471a', marginTop:18}}>{this.state.lang === 'EN' ? 'Successful' : 'เรียบร้อยแล้ว'} {this.state.course_day_learn_alert} {this.state.lang === 'EN' ? 'Day' : 'วัน'}</Text> */}
        <Text style={{fontSize: 14, color: '#ff471a', marginTop:18}}>{this.state.lang === 'EN' ? 'Since' : 'ตั้งแต่วัน'} {moment(this.state.course_date_start_alert).format('DD/MM/YYYY')} {this.state.course_date_end_alert != null ? this.state.lang === 'EN' ? `to ${moment(this.state.course_date_end_alert).format('DD/MM/YYYY')}` : `ถึงวันที่ ${moment(this.state.course_date_end_alert).format('DD/MM/YYYY')}` : null}</Text>
        {/* {this.state.lang === 'EN' ? 'to' : 'ถึงวันที่'} {moment(this.state.course_date_end_alert).format('DD/MM/YYYY')} */}
        <Text style={{fontSize: 14, color: '#ff471a'}}>{this.state.lang === 'EN' ? 'Remaining Time' : 'ท่านมีระยะเวลาการเรียนคงเหลือ'} {this.state.diff_alert} {this.state.lang === 'EN' ? 'Day' : 'วัน'}</Text>
        <Button style={buttun} onPress={() => this.props.screenProps.updateGlobalState(false)}>
          <Text style={{color: '#fff'}}>{this.state.lang === 'EN' ? 'Ok' : 'ยืนยัน'}</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  buttun:{
      marginTop: 20,
      backgroundColor: 'green',
  }
});

import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  Animated,
  StyleSheet,
  ScrollView,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Linking
} from 'react-native';
// import { useNavigation } from "@react-navigation/native"
import Modal from 'react-native-modal';
import ModalShow from './ModalShow';
import {Accordion} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {Tab, Tabs, TabHeading, Button} from 'native-base';
import TabDetail from './TabDetail';
import TabCourse from './TabCourse';
import {httpClient} from '../../core/HttpClient';
// import base64 from 'react-native-base64'
// import DeviceInfo from 'react-native-device-info';

// import {TabCourse, TabDetail} from '../../index';

class LearnScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      percent: 0,
      isModalVisible: false,

      image_course: '',
      course_title: '',
      course_detail: '',

      start_date: '',
      end_date: '',
      diff: '',

      course_workshop: null,
      checkHaveCer: null,
      statePrintCert: null,

    };
    
  }

  async componentDidMount() {
    try {
      const {course_id, reload} = this.props.route.params;
    //   if(reload){
    //     this.setState({isModalVisible: false})
    //   }
      var user_id = await AsyncStorage.getItem('userId');
      const res = await AsyncStorage.getItem('language');
      if (res === 'EN') {
        this.setState({lang: 'EN'});
        var lang_id = '1';
      } else {
        this.setState({lang: 'TH'});
        var lang_id = '2';
      }

      httpClient
        .get(`/CourseOnline/getCourseLearn/${course_id}/${lang_id}`)
        .then(async response => {
          const result = response.data;
            //  console.log(result);
            if (result != null) {
              for(i in result){
                 value = result[i]
                  this.setState({image_course: value.course_picture, course_title: value.course_title, course_detail: value.course_detail})
              }
            }
          })
          .catch(error => {
          console.log(error);
        });

       httpClient
        .get(`/CourseOnline/getAlertModelDateTimeCourse/${course_id}/${user_id}`)
        .then(async response => {
            const result = response.data;
              if (result != null) {
                      this.setState({start_date: result.start_date, end_date: result.end_date, diff: result.diff})

                      if(result.check_model == true){
                        this.setState({isModalVisible: true})
                      }
              }
            })
            .catch(error => {
            console.log(error);
        });

       httpClient
        .get(`/CourseOnline/getPercent_CourseGen/${course_id}/${user_id}`)
        .then(async response => {
          const result = response.data;
              // console.log(result.percent);
            if (result != null) {
              this.setState({percent: result.percent, checkHaveCer: result.checkHaveCer, 
                statePrintCert: result.statePrintCert, course_workshop: result.course_workshop})
            }
          })
          .catch(error => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  showModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  _updateGlobalState(payload) {
    this.setState({isModalVisible: payload});
  }

  PrintCertificate = async() =>{
    let {course_id} = this.props.route.params;
    let user_id = await AsyncStorage.getItem('userId');

    // Linking.openURL(`http://localhost/lms_exterran/CourseApiMobile/PrintCertificate?user_id=${user_id}&course_id=${course_id}&lang_id=${1}`)
    Linking.openURL(`http://smartxlearning.com/CourseApiMobile/PrintCertificate?user_id=${user_id}&course_id=${course_id}&lang_id=${1}`)
  }

  render() {
    const {checkHaveCer, statePrintCert} = this.state
    const {course_id} = this.props.route.params;
   
    return (
      <SafeAreaView style={{flex: 1 ,backgroundColor: '#fff'}}>
        <ScrollView>
          <View style={{backgroundColor: '#fff', margin: 20, borderColor: '#d9d9d9', borderWidth: 0.5, borderRadius: 5}}>
          <View style={{marginTop: -30, marginBottom: -50}}>
            <View
              style={{
                margin: 60,
                alignItems: 'center',
              }}>
              <Image
                resizeMode='stretch'
                source={{
                  uri: this.state.image_course != null ? this.state.image_course : 'http://smartxlearning.com/themes/template/img/book.png',
                }}
                style={{
                  width: '120%',
                  height: 180,
                  margin: 5,
                  borderColor: '#e6e6e6',
                  borderWidth: 6
                }}
              />
            </View>
          </View>
          <Text numberOfLines={2}
            style={{
              textAlign: 'center',
              fontSize: 18,
              marginTop: 0,
              marginLeft: 40,
              marginRight: 40,
              fontWeight: 'bold',
            }}>
            {this.state.course_title}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              marginTop: 15,
              marginLeft: 20,
              marginRight: 20,
              color: 'red'
            }}>
            {this.state.start_date} - {this.state.end_date} {this.state.lang === 'EN' ? 'Remaining Time' : 'ท่านมีระยะเวลาการเรียนคงเหลือ'} {this.state.diff} {this.state.lang === 'EN' ? 'Day' : 'วัน'}
            {this.state.course_workshop == true ? this.state.lang === 'EN' ? ' ( Workshop )' : ' ( มีปฏิบัติต่อ )' : null}
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 16,
              marginTop: 20,
              marginLeft: 45,
            }}>
             {this.state.lang === 'EN' ? 'Study status' : 'สถานะการเรียน'}
          </Text>
          <View style={{marginTop: 5}}>
            <View style={{alignItems: 'center'}}>
              <View style={styles.container}>
                <View style={[styles.inner, {width: `${this.state.percent}%`}]}/>
              </View>
            </View>
            <Text style={{marginLeft: 45, marginTop: 5}}>{`${
              this.state.percent
            }%`}</Text>
          </View>

        {
          checkHaveCer == true ?
              statePrintCert == true ?
                <View>
                    <View style={{height: 2, width: '90%', backgroundColor: '#e6e6e6', alignSelf: 'center', marginTop: 20, borderRadius: 5}}/>
                    <TouchableOpacity 
                        onPress={this.PrintCertificate}
                        >
                    <View
                        style={{
                        borderWidth: 1,
                        borderColor: '#bfbfbf',
                        backgroundColor: '#fff',
                        marginTop: 30,
                        marginLeft: 45,
                        marginRight: 45,
                        alignItems: 'center',
                        marginBottom: 30,
                        }}>
                        <Image
                        source={{uri: 'http://smartxlearning.com/themes/template/img/green-reward.png'}}
                        style={{width: Platform.OS == 'ios' ? Platform.isPad ? 120: 80 : 80, height: Platform.OS == 'ios' ? Platform.isPad ? 150: 90 : 90, marginTop: 10}}
                        resizeMode="contain"
                        />
                        <Text style={{fontSize: 12, marginTop: 0, marginBottom: 15}}>
                        {this.state.lang === 'EN' ? 'Certificate Printed' : 'พิมพ์ใบประกาศนียบัตร'}
                        </Text>
                    </View>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <View style={{height: 2, width: '90%', backgroundColor: '#e6e6e6', alignSelf: 'center', marginTop: 20, borderRadius: 5}}/>
                    <TouchableOpacity 
                        onPress={() => Alert.alert(this.state.lang === 'EN' ? 'You have not completed the course' : 'ท่านยังเรียนไม่ผ่านตามเงื่อนไข')}
                        >
                    <View
                        style={{
                        borderWidth: 1,
                        borderColor: '#bfbfbf',
                        backgroundColor: '#fff',
                        marginTop: 30,
                        marginLeft: 45,
                        marginRight: 45,
                        alignItems: 'center',
                        marginBottom: 30,
                        }}>
                        <Image
                        source={{uri: 'http://smartxlearning.com/themes/template/img/grey-reward.png'}}
                        style={{width: 80, 
                        height: 90, marginTop: 10}}
                        resizeMode="contain"
                        />
                        <Text style={{fontSize: 12, marginTop: 0, marginBottom: 15}}>
                        {this.state.lang === 'EN' ? 'You have not completed the course' : 'ท่านยังเรียนไม่ผ่านตามเงื่อนไข'}
                        </Text>
                    </View>
                    </TouchableOpacity>
                </View>
            :
            <View style={{marginTop: 20}}/>
        } 
       
      </View>

        <View style={{
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 40,
            }}>
              <Tabs
              locked
              tabBarUnderlineStyle={{
                borderBottomWidth: 4,
                borderBottomColor: '#010C65',
              }}>
              <Tab
                heading={
                  <TabHeading style={{backgroundColor: '#fff'}}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                      <Text style={{color: '#000', fontSize: 14, fontWeight: 'bold'}}>
                        {this.state.lang === 'EN' ? 'Details' : 'รายละเอียด'}
                      </Text>
                    </View>
                  </TabHeading>
                }>
              <TabDetail course_detail={this.state.course_detail}/>
              </Tab>
              <Tab
                heading={
                  <TabHeading style={{backgroundColor: '#fff'}}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                      <Text style={{color: '#000', fontSize: 14, fontWeight: 'bold'}}>
                        {this.state.lang === 'EN'
                          ? 'Course'
                          : 'เนื้อหาของคอร์สนี้'}
                      </Text>
                    </View>
                  </TabHeading>
                }>
              <TabCourse course_id={course_id} course_title={this.state.course_title} /> 
              </Tab>
            </Tabs>
          </View>

          <Modal
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.showModal()}>
            <ModalShow
              course_id={course_id}
              screenProps={{
                updateGlobalState: this._updateGlobalState.bind(this),
              }}
            />
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '78%',
    height: 10,
    backgroundColor: '#cccccc',
    borderRadius: 5,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    height: 8,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    color: 'black',
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
});


export default function(props) {
    return <LearnScreen {...props} />;
  }
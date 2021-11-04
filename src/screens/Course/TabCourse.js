import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage, Alert, Platform, Image, StyleSheet, TouchableHighlight} from 'react-native'
import {Accordion, Button, Label, Textarea} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
// import {Button} from 'react-native-paper';
import {httpClient} from '../../core/HttpClient';
// import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from "@react-navigation/native"
import { downloadFIle } from "../../utils/file";
import Modal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';
import FormData from 'form-data';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { AntDesign } from '@expo/vector-icons';

class TabCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      PreTestCourse: null,
      LessonAll: null,
      PostTestCourse: null,
      course_id: this.props.course_id,
      can_next_step: null,

      modalVisible: false,
      detail_feedback: '',
      file_feedback: '',


      ///state alert
      visible: false,
      icon: '',
      backgroundColorIcon: '',
      content: '',
    };
  }

  async componentDidMount() {
    try {
      const {course_id} = this.state
      const user_id = await AsyncStorage.getItem('userId');
      const res = await AsyncStorage.getItem('language');
      if (res === 'EN') {
        this.setState({lang: 'EN'});
        var lang_id = '1';
      } else {
        this.setState({lang: 'TH'});
        var lang_id = '2';
      }

     await httpClient
      .get(`/CoursePreTest/getCoursePreTest/${course_id}/${user_id}/${lang_id}`)
      .then(async response => {
        const result = response.data;
          if (result != null) {
            let step = result[0]?.coursePreTest.can_next_step ?? null
            // console.log(step)
            this.setState({PreTestCourse: result, can_next_step: step })
          }
        })
        .catch(error => {
        console.log(error);
      });

      await httpClient
      .get(`/Lesson/courseID/${course_id}/${user_id}/${lang_id}`)
      .then(async response => {
        const result = response.data;
          if (result != null) {
            this.setState({LessonAll: result })
          }
        })
        .catch(error => {
        console.log(error);
      });

      await httpClient
      .get(`/CoursePostTest/getCoursePostTest/${course_id}/${user_id}/${lang_id}`)
      .then(async response => {
        const result = response.data;
          if (result != null) {
            this.setState({PostTestCourse: result })
          }
        })
        .catch(error => {
        console.log(error);
      });

    } catch (err) {
      console.log(err);
    }
  }

  AlertNotPermission(){
    Alert.alert(this.state.lang === 'EN' ? 'You do not have permissions.' : 'ท่านไม่มีสิทธิ์')
  }

  errAlert(err){
    if(err === 'ท่านไม่มีสิทธิ์'){
      Alert.alert(this.state.lang === 'EN' ? 'You do not have permissions.' : 'ท่านไม่มีสิทธิ์')
    }else if(err === 'ไม่พบหลักสูตรรายวิชานี้ กรุณาติดต่อเจ้าหน้าที่'){
      Alert.alert(this.state.lang === 'EN' ? 'This course was not found, please contact us.' : 'ไม่พบหลักสูตรรายวิชานี้ กรุณาติดต่อเจ้าหน้าที่')
    }else if(err === 'สถานะรอการตรวจข้อสอบบรรยาย'){
      Alert.alert(this.state.lang === 'EN' ? 'Waiting for examination of lecture exams' : 'สถานะรอการตรวจข้อสอบบรรยาย')
    }
  }

  downloadIos(url) {
    // var date = new Date();
    // // var url = item.dow_address;
    // var ext = this.extention(url);
    // ext = '.' + ext[0];
    // const {config, fs} = RNFetchBlob;
    // let DocumentDir = fs.dirs.DocumentDir;
    // let options = {
    //   fileCache: true,
    //   path:
    //     DocumentDir +
    //     '/_' +
    //     Math.floor(date.getTime() + date.getSeconds() / 2) +
    //     ext,
    //   description: 'Downloaded',
    // };
    // config(options)
    //   .fetch('GET', url)
    //   .then(res => {
    //     RNFetchBlob.ios.previewDocument('file://' + res.path());
    //   });
  }

  downloadAndroid(url) {
    // var date = new Date();
    // // var url = item.dow_address;
    // var ext = this.extention(url);
    // ext = '.' + ext[0];
    // const {config, fs} = RNFetchBlob;
    // let DownloadDir = fs.dirs.DownloadDir;
    // let options = {
    //   fileCache: true,
    //   addAndroidDownloads: {
    //     useDownloadManager: true,
    //     notification: true,
    //     path:
    //     DownloadDir +
    //       '/_' +
    //       Math.floor(date.getTime() + date.getSeconds() / 2) +
    //       ext,
    //     description: 'Downloaded',
    //   },
    // };
    // config(options)
    //   .fetch('GET', url)
    //   .then(res => {
    //     /*
    //     Alert.alert(
    //       this.state.lang == 'EN' ? 'Download complete' : 'ดาวน์โหลดเรียบร้อย',
    //     );
    //     */
    //   });
  }

  extention(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  }

  async CheckCourseCurrentQuiz(item, type){
    try {
      const { navigation } = this.props;
      const course_id = item.coursePreTest ? item.coursePreTest.course_id : item.postTestCourse.coursePostTest.course_id
      const _type = item.coursePreTest ? item.coursePreTest.type : item.postTestCourse.coursePostTest.type
      const user_id = await AsyncStorage.getItem('userId');

      await httpClient
      .get(`/Lesson/CheckCourseCurrentQuiz/${course_id}/${user_id}/${type}`)
      .then(async response => {
        const result = response.data;
          if (result != null) {
            if(result.currentQuiz === 'learning'){
              if(type == "pre"){
                navigation.navigate('PreTestCourse', {course_id: course_id, type: _type})
              }else{
                navigation.navigate('PostTestCourse', {course_id: course_id, type: _type})
              }
            }else{
              navigation.navigate('ExamDetailCourse', {course_id: course_id, type: _type})
            }
          }
        })
        .catch(error => {
        console.log(error);
      });

    } catch (err) {
      console.log(err);
    }
  }
  
  async checkLessonCurrentQuiz(item, type){
    try {
      const { navigation } = this.props;
      const lesson_id = item.lesson.id;
      const user_id = await AsyncStorage.getItem('userId');
      await httpClient
      .get(`/Lesson/CheckLessonCurrentQuiz/${lesson_id}/${user_id}/${type}`)
      .then(async response => {
        const result = response.data;
          if (result != null) {
            if(result.currentQuiz === 'learning'){
              if(type == "pre"){
                navigation.navigate('PreTest', {lesson_id: item.lesson.id, type: type})
              }else{
                navigation.navigate('PostTest', {lesson_id: item.lesson.id, type: type})
              }
            }else{
              navigation.navigate('ExamDetailLesson', {lesson_id: item.lesson.id, type: type})
            }
          }
        })
        .catch(error => {
        console.log(error);
      });

    } catch (err) {
      console.log(err);
    }
  }

  _renderHeader_NO_PreTestCourse = (item, expanded) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          paddingTop: 13,
          paddingBottom: 13,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: 'green',
          borderWidth: 1,
          borderColor: '#d9d9d9',
        }}>
        {/* {expanded ? (
          <Icon style={{fontSize: 16, color: '#fff'}} name="minus" />
        ) : (
          <Icon style={{fontSize: 16, color: '#fff'}} name="plus" />
        )} */}

        <View style={{flex: 1, alignItems: 'flex-start'}}>
            <Text numberOfLines={1} style={{marginLeft: 5, color: '#fff', fontWeight: 'bold'}}>
              {this.state.lang === "EN" ? "Pre Test Course " : "การสอบก่อนเรียนหลักสูตร "} 
              {/* {item.coursePreTest.course_title} {item.coursePreTest.gen_title != '0' ? (this.state.lang === "EN" ? `(Gen ${item.coursePreTest.gen_title})` : `(รุ่นที่ ${item.coursePreTest.gen_title})`) : ''} */}
            </Text>
        </View>
      </View>
    );
  }

  _renderHeader_PreTestCourse = (item, expanded) => {
    return (
      <View
        style={{
          height: 52,
          flexDirection: 'row',
          padding: 10,
          paddingTop: 13,
          paddingBottom: 13,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#939598',
          borderWidth: 1,
          borderColor: '#d9d9d9',
        }}>
        {expanded ? (
          <Icon style={{fontSize: 16, color: '#fff'}} name="minus" />
        ) : (
          <Icon style={{fontSize: 16, color: '#fff'}} name="plus" />
        )}

        <View style={{flex: 1, alignItems: 'flex-start'}}>
            <Text numberOfLines={1} style={{marginLeft: 5, color: '#fff', fontWeight: 'bold'}}>
              {this.state.lang === "EN" ? "Pre Exam Course" : "สอบก่อนเรียนหลักสูตร"} 
              {/* {item.coursePreTest.course_title} */}
            </Text>
        </View>
      </View>
    );
  }

  _renderContent_PreTestCourse = (item) =>{
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#cccccc',
            }}>
            <Icon
              name="form"
              size={20}
              style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
            />
            <Text numberOfLines={1} style={{flex: this.state.lang === "EN" ? 0.5 : 0.7}}>{this.state.lang === "EN" ? "Pre Exam Course" : "สอบก่อนเรียนหลักสูตร"}</Text>
            <View style={{flex: 1, marginRight: 5}}>
              {
              item.coursePreTest.score === 'Waiting score' ? 
                <Button
                  disabled
                  style={{
                    backgroundColor: '#fff',
                    borderColor: '#cccccc',
                    borderWidth: 1,
                    alignSelf: 'flex-end',
                    margin: 8,
                    borderRadius: 5,
                    height: 35,
                    padding: 5
                  }}
                  >
                  <Text style={{fontSize: 12, color: 'red'}}>{this.state.lang === "EN" ? "Waiting for examination of lecture exams" : "รอตรวจข้อสอบบรรยาย"}</Text>
                </Button>
              :
              item.coursePreTest.can_next_step === '2' ? 
                  <Button
                  style={{
                    backgroundColor: '#ff9900',
                    borderColor: '#cccccc',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignSelf: 'flex-end',
                    margin: 8,
                    height: 35,
                    padding: 5,
                    paddingRight: 10
                  }}
                  onPress={this.CheckCourseCurrentQuiz.bind(this, item, 'pre')}
                  >
                  <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Testing": "ทำแบบทดสอบ"}</Text>
                </Button>
              :
                <Button
                disabled
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#cccccc',
                  borderWidth: 1,
                  borderRadius: 5,
                  alignSelf: 'flex-end',
                  margin: 8,
                  height: 35,
                  padding: 5
                }}
                >
                <Text style={{fontSize: 12, color: item.coursePreTest.score_past == 'y' ? 'green' : 'red'}}>{item.coursePreTest.score} {this.state.lang === "EN" ? "points" : "คะแนน"}</Text>
              </Button>
              }
              
            </View>
          </View>
        </View>
      );
  }

  _renderHeader = (item, expanded) => {
        return (
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#398ddd',
              // backgroundColor: '#e6e6e6',
              borderWidth: 1,
              borderColor: '#d9d9d9',
            }}>
            {expanded ? (
              <Icon style={{flex: 0.1, fontSize: 16, color: '#fff'}} name="minus" />
            ) : (
              <Icon style={{flex: 0.1, fontSize: 16, color: '#fff'}} name="plus" />
            )}

             {
              item.lesson.image != null ?
              <View style={{flex: 0.2, }}>
                <Image source={{uri: item.lesson.image}} resizeMode='stretch'
                      style={{ flex: 1, width: 40, height: 20, borderRadius: 3,  }}/>
              </View>
              :
              <View/>
            } 
           
             <View style={{flex: 0.8, alignItems: 'flex-start', }}>
                <Text numberOfLines={1} style={{marginLeft: 5, color: '#fff'}}> {item.lesson.title}</Text>
            </View>
            <View style={{flex: 0.5, alignItems: 'flex-start', }}>
                {item.lesson.learn_pass_status === 'pass' ? 
                <Button disabled style={{backgroundColor: '#008000', height: 30, borderRadius: 5, padding: 5, alignSelf: 'center'}}>
                  <Text style={{color: '#fff', fontSize: 12}}>{this.state.lang === "EN" ? "Complete" : "เรียนผ่านแล้ว"}</Text>
                </Button>
                : item.lesson.learn_pass_status === 'learning' ? 
                <Button disabled style={{backgroundColor: '#ff9900', height: 30, borderRadius: 5, padding: 5, alignSelf: 'center'}}>
                  <Text style={{color: '#fff', fontSize: 12}}>{this.state.lang === "EN" ? "Learning" : "กำลังเรียน"}</Text>
                </Button>
                :
                <Button disabled style={{backgroundColor: '#a6a6a6', height: 30, borderRadius: 5, padding: 5, alignSelf: 'center'}}>
                <Text style={{color: '#fff', fontSize: 12}}>{this.state.lang === "EN" ? "Not start" : "ยังไม่ได้เรียน"}</Text>
              </Button>
                }
            </View> 
          </View>
        );
  }
    
  _renderContent = (item) =>{
        const { navigation } = this.props;
        var idx = 1
        return (
          <View>
            {/*=========================== สอบก่อนเรียน start ===========================*/}
            {item.lesson.pre.pre != 0 ?
                item.lesson.prescore != null ?
                   item.lesson.prescore === 'Waiting score' ? 
                   <View>
                      <View  
                      style={{
                      alignItems: 'flex-start',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                      backgroundColor: '#f2f2f2'
                    }}>
                    <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Pre Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบก่อนเรียน`}</Text>
                    </View>
                   <View  
                      style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                    }}>
                    <Icon
                      name="form"
                      size={20}
                      style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                    />
                    <Text numberOfLines={1} style={{flex: 0.5}}>{this.state.lang === "EN" ? "Pre test" : "สอบก่อนเรียน"}</Text>
                      <View style={{flex: 1, alignItems: 'flex-end', marginRight: 5}}>
                        <Button
                          disabled
                          style={{
                            backgroundColor: '#fff',
                            borderColor: '#cccccc',
                            borderWidth: 1,
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5
                          }}
                          >
                          <Text style={{fontSize: 12, color: 'red'}}>{this.state.lang === "EN" ? "Waiting for examination of lecture exams" : "รอตรวจข้อสอบบรรยาย"}</Text>
                        </Button>
                      </View>
                  </View>
                  </View>
                   :
                    item.lesson.prescore.map((data) => {
                    return(
                      <View>
                      <View  
                      style={{
                      alignItems: 'flex-start',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                      backgroundColor: '#f2f2f2'
                    }}>
                    <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Pre Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบก่อนเรียน`}</Text>
                    </View>
                      <View  
                      style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                    }}>
                    <Icon
                      name="form"
                      size={20}
                      style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                    />
                     <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Results Pre Test" : "ผลทดสอบก่อนเรียน"} {data.label_no}</Text>
                      <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          disabled
                          style={{
                            backgroundColor: '#fff',
                            borderColor: '#cccccc',
                            borderWidth: 1,
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5, 
                          }}
                          >
                          <Text style={{fontSize: 12, color: data.score_past == 'y' ? 'green' : 'red'}}>{data.score} {this.state.lang === "EN" ? "points" : "คะแนน"}</Text>
                        </Button>
                      </View>
                  </View>
                  </View>
                    )})
                :
                <View>
                      <View  
                      style={{
                      alignItems: 'flex-start',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                      backgroundColor: '#f2f2f2'
                    }}>
                    <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Pre Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบก่อนเรียน`}</Text>
                    </View>
                <View  
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#cccccc',
                  }}>
                  <Icon
                    name="form"
                    size={20}
                    style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                  />
                  <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Pre test" : "สอบก่อนเรียน"}</Text>
                    <View style={{flex: 1, alignItems: 'flex-end', marginRight: 5}}>
                      <Button
                        style={{
                          backgroundColor: '#ff9900',
                          borderColor: '#cccccc',
                          borderWidth: 1,
                          alignSelf: 'flex-end',
                          margin: 8,
                          borderRadius: 5,
                          height: 35,
                          padding: 5
                        }}
                        onPress={this.state.can_next_step == 2 ? this.AlertNotPermission.bind(this) : this.checkLessonCurrentQuiz.bind(this, item, "pre")}
                        >
                        <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Testing" : "ทำแบบทดสอบ"}</Text>
                      </Button>
                    </View>
                </View>
                </View>
             :
            <View/>
            }
            {/*=========================== สอบก่อนเรียน end ===========================*/}


            {/*=========================== วีดีโอเรียน start ===========================*/}
            {item.lesson.learn ? 
            <View>
                <View  
                style={{
                alignItems: 'flex-start',
                borderBottomWidth: 1,
                borderBottomColor: '#cccccc',
                backgroundColor: '#f2f2f2'
              }}>
              <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Start` : `ขั้นตอนที่ ${idx++} เข้าสู่บทเรียน`}</Text>
              </View>
             {item.lesson.learn.map((data) => {
              return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccccc',
                }}>
                <Icon
                  name="indent-right"
                  size={20}
                  style={{color: '#b3b3b3', flex:0.1, marginLeft: 10}}
                />
                <Text numberOfLines={1} style={{flex:1, marginLeft: 5}}>{data.name}</Text>

                {
                  data.status === "pass" ? 
                    <Button disabled style={{alignSelf: 'center', backgroundColor: '#008000' , height: 30, borderRadius: 5, marginLeft:5, }}>
                      <Text style={{color: '#fff', fontSize: 9}}>{this.state.lang === "EN" ? "Complete" : "เรียนผ่าน"}</Text>
                    </Button>
                  : data.status === "learning" ? 
                    <Button disabled style={{alignSelf: 'center', backgroundColor: '#ff9900' , height: 30, borderRadius: 5, marginLeft:5}}>
                      <Text style={{color: '#fff', fontSize: 9}}>{this.state.lang === "EN" ? "Learning" : "กำลังเรียน"}</Text>
                    </Button>
                  :
                    <Button disabled style={{alignSelf: 'center', backgroundColor: '#b3b3b3' , height: 30, borderRadius: 5, marginLeft:5}}>
                      <Text style={{color: '#fff', fontSize: 10, paddingHorizontal:4, alignItems: "center"}}>{this.state.lang === "EN" ? "Not start" : "ยังไม่ได้เรียน"}</Text>
                    </Button>
                }
              
                <View style={{flex:0.8, marginHorizontal:5}}>
                { (item.lesson.prescore != null && item.lesson.pre.pre == 1) || item.lesson.pre.pre == 0 ?
                      <Button iconRight
                        style={{
                          backgroundColor: '#ff9900',
                          borderColor: '#cccccc',
                          borderWidth: 1,
                          alignSelf: 'center',
                          marginVertical: 8,
                          borderRadius: 5,
                          height: 35,
                          padding: 4
                        }}
                        
                        onPress={this.state.can_next_step == 2 ? this.AlertNotPermission.bind(this) : () => navigation.navigate('Vdo', {lesson_id: data.lesson_id, file_id: data.file_id, course_id: this.state.course_id})}
                        >
                        <Text style={{fontSize: 12, color: '#fff',}}>{this.state.lang === "EN" ? "Start" : "เข้าสู่บทเรียน"}</Text>
                        <Icon
                          name="play"
                          size={20}
                          style={{marginLeft: 5, marginRight: 3, color: '#fff'}}
                        />
                      </Button>
                      : 
                       <Button
                          iconRight
                          style={{
                            backgroundColor: '#ff9900',
                          borderColor: '#cccccc',
                          borderWidth: 1,
                          alignSelf: 'center',
                          marginVertical: 8,
                          borderRadius: 5,
                          height: 35,
                          padding: 4
                          }}
                          onPress={this.AlertNotPermission.bind(this)}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Start" : "เข้าสู่บทเรียน"}</Text>
                          <Icon
                          name="play"
                          size={20}
                          style={{marginLeft: 5, marginRight: 3, color: '#fff'}}
                        />
                        </Button>
                     }
                </View>
              </View>
             )})
            }
            </View>
            :
                <View/>
            }
            {/*=========================== วีดีโอเรียน end ===========================*/}


            {/*=========================== สอบหลังรียน start ===========================*/}
            {item.lesson.post.post != 0 ? 
                  item.lesson.postscore != null ? 
                      item.lesson.postscore === 'Waiting score' ? 
                      <View>
                          <View  
                            style={{
                            alignItems: 'flex-start',
                            borderBottomWidth: 1,
                            borderBottomColor: '#cccccc',
                            backgroundColor: '#f2f2f2'
                          }}>
                          <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Post Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบหลังเรียน`}</Text>
                          </View>
                        {
                          item.lesson.postscore_old ?
                            item.lesson.postscore_old.map((data) => {
                            return(
                              <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: '#cccccc',
                              }}>
                              <Icon
                                name="form"
                                size={20}
                                style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                              />
                              <Text numberOfLines={1} style={{flex: 0.6}}>{this.state.lang === "EN" ? "Results Post Test" : "สอบหลังเรียน"} {data.label_no}</Text>
                              <View style={{flex: 1, marginRight: 5}}>
                              <Button
                                  disabled
                                  style={{
                                    backgroundColor: '#fff',
                                    borderColor: '#cccccc',
                                    borderWidth: 1,
                                    alignSelf: 'flex-end',
                                    margin: 8,
                                    borderRadius: 5,
                                    height: 35,
                                    padding: 5
                                  }}
                                  >
                                  <Text style={{fontSize: 12, color: data.score_past == 'y' ? 'green' : 'red'}}>{data.score} {this.state.lang === "EN" ? "points" : "คะแนน"}</Text>
                                </Button>
                              </View>
                            </View>
                            )
                          })
                          :
                          <View/>
                        }
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderBottomWidth: 1,
                          borderBottomColor: '#cccccc',
                        }}>
                        <Icon
                          name="form"
                          size={20}
                          style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                        />
                        <Text numberOfLines={1} style={{flex: 0.5}}>{this.state.lang === "EN" ? "Post Test" : "สอบหลังเรียน"}</Text>
                        <View style={{flex: 1, marginRight: 5}}>
                          <Button
                            disabled
                            style={{
                              backgroundColor: '#fff',
                              borderColor: '#cccccc',
                              borderWidth: 1,
                              alignSelf: 'flex-end',
                              margin: 8,
                              borderRadius: 5,
                              height: 35,
                              padding: 5
                            }}
                            >
                            <Text style={{fontSize: 12, color: 'red'}}>{this.state.lang === "EN" ? "Waiting for examination of lecture exams" : "รอตรวจข้อสอบบรรยาย"}</Text>
                          </Button>
                        </View>
                      </View>
                      </View>
                        :
                        <View>
                            <View  
                              style={{
                              alignItems: 'flex-start',
                              borderBottomWidth: 1,
                              borderBottomColor: '#cccccc',
                              backgroundColor: '#f2f2f2'
                            }}>
                            <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Post Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบหลังเรียน`}</Text>
                            </View>
                            {item.lesson.postscore.map((data) => {
                              return(
                                <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#cccccc',
                                }}>
                                <Icon
                                  name="form"
                                  size={20}
                                  style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                                />
                                <Text numberOfLines={1} style={{flex: 0.6}}>{this.state.lang === "EN" ? "Results Post Test" : "สอบหลังเรียน"} {data.label_no}</Text>
                                <View style={{flex: 1, marginRight: 5}}>
                                <Button
                                    disabled
                                    style={{
                                      backgroundColor: '#fff',
                                      borderColor: '#cccccc',
                                      borderWidth: 1,
                                      alignSelf: 'flex-end',
                                      margin: 8,
                                      borderRadius: 5,
                                      height: 35,
                                      padding: 5
                                    }}
                                    >
                                    <Text style={{fontSize: 12, color: data.score_past == 'y' ? 'green' : 'red'}}>{data.score} {this.state.lang === "EN" ? "points" : "คะแนน"}</Text>
                                  </Button>
                                </View>
                              </View>
                              )
                            })
                            }
                           
                            {
                              item.lesson.posttestnew ?
                              <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                  }}>
                                  <Icon
                                    name="form"
                                    size={20}
                                    style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                                  />
                                  <Text numberOfLines={1} style={{flex: 0.5}}>{this.state.lang === "EN" ? "Post Test" : "สอบหลังเรียน"} {item.lesson.posttestnew.label_no_new}</Text>
                                  <View style={{flex: 1, alignItems: 'flex-end', marginRight: 5}}>
                                    <Button
                                      style={{
                                        backgroundColor: '#ff9900',
                                        borderColor: '#cccccc',
                                        borderWidth: 1,
                                        alignSelf: 'flex-end',
                                        margin: 8,
                                        borderRadius: 5,
                                        height: 35,
                                        padding: 5
                                      }}
                                      onPress={this.state.can_next_step == 2 ? this.AlertNotPermission.bind(this) : this.checkLessonCurrentQuiz.bind(this, item, "post")}
                                      >
                                      <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Testing" : "ทำแบบทดสอบ"}</Text>
                                    </Button>
                                  </View>
                                </View>
                              :
                              <View/>
                            }
                        </View>       

                  : (item.lesson.pre.pre != 0 && item.lesson.prescore != null) || (item.lesson.pre.pre === 0 && item.lesson.prescore == null) ?
                   <View>
                       <View  
                              style={{
                              alignItems: 'flex-start',
                              borderBottomWidth: 1,
                              borderBottomColor: '#cccccc',
                              backgroundColor: '#f2f2f2'
                            }}>
                            <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Post Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบหลังเรียน`}</Text>
                       </View>
                    <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                    }}>
                    <Icon
                      name="form"
                      size={20}
                      style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                    />
                    <Text numberOfLines={1} style={{flex: 0.5}}>{this.state.lang === "EN" ? "Post Test" : "สอบหลังเรียน"}</Text>
                    <View style={{flex: 1, marginRight: 5}}>
                      <Button
                        style={{
                          backgroundColor: '#ff9900',
                          borderColor: '#cccccc',
                          borderWidth: 1,
                          alignSelf: 'flex-end',
                          margin: 8,
                          borderRadius: 5,
                          height: 35,
                          padding: 5
                        }}
                        onPress={this.state.can_next_step == 2 || item.lesson.learn_pass_status != 'pass' ? this.AlertNotPermission.bind(this) : this.checkLessonCurrentQuiz.bind(this, item, "post")}
                        >
                        <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Testing" : "ทำแบบทดสอบ"}</Text>
                      </Button>
                    </View>
                  </View>
                  </View>
                    :
                  <View>
                    <View  
                           style={{
                           alignItems: 'flex-start',
                           borderBottomWidth: 1,
                           borderBottomColor: '#cccccc',
                           backgroundColor: '#f2f2f2'
                         }}>
                         <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? `Part ${idx++} Post Test` : `ขั้นตอนที่ ${idx++} แบบทดสอบหลังเรียน`}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccccc',
                      }}>
                      <Icon
                        name="form"
                        size={20}
                        style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                      />
                      <Text numberOfLines={1} style={{flex: 0.5}}>{this.state.lang === "EN" ? "Post Test" : "สอบหลังเรียน"}</Text>
                      <View style={{flex: 1, marginRight: 5}}>
                        <Button
                            style={{
                              backgroundColor: '#ff9900',
                              borderColor: '#cccccc',
                              borderWidth: 1,
                              alignSelf: 'flex-end',
                              margin: 8,
                              borderRadius: 5,
                              height: 35,
                              padding: 5
                            }}
                            onPress={this.AlertNotPermission.bind(this)}
                            >
                            <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Testing" : "ทำแบบทดสอบ"}</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
              :
              <View/>
            }
            {/*=========================== สอบหลังรียน end ===========================*/}


            {/*=========================== ดาวโหลดไฟล์ start ===========================*/}
            {item.lesson.file != null ? 
             <View>
              <View  
                  style={{
                  alignItems: 'flex-start',
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccccc',
                  backgroundColor: '#f2f2f2'
                }}>
                <Text numberOfLines={1} style={{flex: 1, padding: 10}}>{this.state.lang === "EN" ? "Training Handout & Related Documents" : "เอกสารดาวน์โหลด"}</Text>
              </View>
               { item.lesson.file.map((data) => {
                  return (
                    <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccccc',
                    }}>
                    <Icon
                      name="filetext1"
                      size={20}
                      style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                    />
                    <Text numberOfLines={1} style={{flex: 1}}>{data.file_name}</Text>
                    <View style={{flex: 0.3, alignItems: 'flex-end', marginRight: 5}}>
                    {/* {Platform.OS === 'ios' ? ( */}
                    <TouchableOpacity 
                        // onPress={this.downloadIos.bind(this, data.filepath)}
                        onPress={() => downloadFIle(data.filepath, data.file_name)}
                        style={{
                          backgroundColor: '#fff',
                          alignItems: 'center',
                          margin: 8,
                        }}>
                          <Icon
                            name="download"
                            size={25}
                            style={{marginLeft: 10, marginRight: 10, color: '#000'}}
                          />
                        </TouchableOpacity>
                    {/* ):
                    <TouchableOpacity 
                        onPress={this.downloadAndroid.bind(this, data.filepath)}
                        style={{
                          backgroundColor: '#fff',
                          alignItems: 'center',
                          margin: 8,
                        }}>
                          <Icon
                            name="download"
                            size={25}
                            style={{marginLeft: 10, marginRight: 10, color: '#000'}}
                          />
                    </TouchableOpacity>
                    } */}
                    </View>
                  </View>
                  )
                })
              }
              </View>
              :
              <View/>
            }
            {/*=========================== ดาวโหลดไฟล์ end ===========================*/}
         
          </View>
        
        );
  }

  _renderHeader_PostTestCourse = (item, expanded) => {
        return (
          <View
            style={{
              height: 52,
              flexDirection: 'row',
              padding: 10,
              paddingTop: 13,
              paddingBottom: 13,
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#939598',
              borderWidth: 1,
              borderColor: '#d9d9d9',
            }}>
            {expanded ? (
              <Icon style={{fontSize: 16, color: '#fff'}} name="minus" />
            ) : (
              <Icon style={{fontSize: 16, color: '#fff'}} name="plus" />
            )}
    
            <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text numberOfLines={1} style={{marginLeft: 5, color: '#fff', fontWeight: 'bold'}}>
                  {this.state.lang === "EN" ? "Exam Course" : "สอบหลักสูตร"} 
                  { item.postTestCourse.QQuestAns_course ?
                    this.state.lang === "EN" ? " & Assess Satisfaction" : " & ประเมินความพึงพอใจ"
                    :
                    null
                  } 
                  {/* {item.postTestCourse.course_title.course_title}  */}
                  </Text>
            </View>
          </View>
        );
  }
    
  _renderContent_PostTestCourse = (item) => {
          const { navigation } = this.props;
          const course_id = this.props.course_id;
          return (
            <View>
                {
                  item.postTestCourse ?
                    item.postTestCourse.error == 'สถานะรอการตรวจข้อสอบบรรยาย' ?
                    <View>
                        {
                          item.postTestCourse.result_Score ?
                            item.postTestCourse.result_Score.map((data) => {
                              return (
                                <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      borderBottomWidth: 1,
                                      borderBottomColor: '#cccccc',
                                    }}>
                                  <Icon
                                    name="form"
                                    size={20}
                                    style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                                  />
                                  <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Result " : "ผลการสอบ "} {data.label_resultFinal}</Text>
                                <View style={{flex: 1, marginRight: 5}}>
                                  <Button
                                    disabled
                                    style={{
                                      backgroundColor: '#fff',
                                      borderColor: '#cccccc',
                                      borderWidth: 1,
                                      alignSelf: 'flex-end',
                                      margin: 8,
                                      borderRadius: 5,
                                      height: 35,
                                      padding: 5
                                    }}
                                    >
                                    <Text style={{fontSize: 12, color: data.score_past == 'y' ? 'green' : 'red'}}>{data.score} {this.state.lang === "EN" ? "points" : "คะแนน"}</Text>
                                  </Button>
                                </View>
                              </View>
                              )
                            })
                          :
                          <View/>
                        }
                        <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: '#cccccc',
                              }}>
                            <Icon
                              name="form"
                              size={20}
                              style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                            />
                            <Text numberOfLines={1} style={{flex: 0.5}}>{this.state.lang === "EN" ? "Final Test " : "สอบ Final ครั้งที่ "} {item.postTestCourse.label_resultFinal}</Text>
                            <View style={{flex: 1, marginRight: 5}}>
                            <Button
                              disabled
                              style={{
                                backgroundColor: '#fff',
                                borderColor: '#cccccc',
                                borderWidth: 1,
                                alignSelf: 'flex-end',
                                margin: 8,
                                borderRadius: 5,
                                height: 35,
                                padding: 5
                              }}
                              >
                                <Text style={{fontSize: 12, color: 'red'}}>{this.state.lang === "EN" ? "Waiting for examination of lecture exams" : "รอตรวจข้อสอบบรรยาย"}</Text>
                            </Button>
                          </View>
                        </View>
                    </View>
                    : item.postTestCourse.error == 'ท่านไม่มีสิทธิ์' ?
                      <View 
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#cccccc',
                          }}>
                        <Icon
                          name="form"
                          size={20}
                          style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                        />
                        <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Final Test " : "สอบ Final ครั้งที่ "} {item.postTestCourse.coursePostTest.label_testFinalTimes}</Text>
                        <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          style={{
                              backgroundColor: '#ff9900',
                              borderColor: '#cccccc',
                              borderWidth: 1,
                              alignSelf: 'flex-end',
                              margin: 8,
                              borderRadius: 5,
                              height: 35,
                              padding: 5
                          }}
                          onPress={this.errAlert.bind(this, item.postTestCourse.error)}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Final test" : "เข้าสู่การสอบ"}</Text>
                        </Button>
                      </View>
                    </View>
                    : item.postTestCourse.result_Score ?
                       <View>
                          {item.postTestCourse.result_Score.map((data) => {
                            return (
                              <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#cccccc',
                                  }}>
                                <Icon
                                  name="form"
                                  size={20}
                                  style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                                />
                                <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Result " : "ผลการสอบ "} {data.label_resultFinal}</Text>
                              <View style={{flex: 1, marginRight: 5}}>
                                <Button
                                  disabled
                                  style={{
                                    backgroundColor: '#fff',
                                    borderColor: '#cccccc',
                                    borderWidth: 1,
                                    alignSelf: 'flex-end',
                                    margin: 8,
                                    borderRadius: 5,
                                    height: 35,
                                    padding: 5
                                  }}
                                  >
                                  <Text style={{fontSize: 12, color: data.score_past == 'y' ? 'green' : 'red'}}>{data.score} {this.state.lang === "EN" ? "points" : "คะแนน"}</Text>
                                </Button>
                              </View>
                            </View>
                            
                              )
                            })
                          }
                          {
                            item.postTestCourse.coursePostTest ? 
                            <View 
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#cccccc',
                                }}>
                              <Icon
                                name="form"
                                size={20}
                                style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                              />
                              <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Final Test Times " : "สอบ Final ครั้งที่ "} {item.postTestCourse.coursePostTest.label_testFinalTimes}</Text>
                              <View style={{flex: 1, marginRight: 5}}>
                              <Button
                                style={{
                                    backgroundColor: '#ff9900',
                                    borderColor: '#cccccc',
                                    borderWidth: 1,
                                    alignSelf: 'flex-end',
                                    margin: 8,
                                    borderRadius: 5,
                                    height: 35,
                                    padding: 5
                                }}
                                onPress={this.CheckCourseCurrentQuiz.bind(this, item, null)}
                                >
                                <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Final test" : "เข้าสู่การสอบ"}</Text>
                              </Button>
                            </View>
                          </View>
                            :
                            <View/>
                        }
                      </View>
                    : item.postTestCourse.coursePostTest ?
                    <View 
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderBottomWidth: 1,
                          borderBottomColor: '#cccccc',
                        }}>
                      <Icon
                        name="form"
                        size={20}
                        style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                      />
                      <Text numberOfLines={1} style={{flex: 0.9}}>{this.state.lang === "EN" ? "Final Test " : "สอบ Final ครั้งที่ "} {item.postTestCourse.coursePostTest.label_testFinalTimes}</Text>
                        <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          style={{
                              backgroundColor: '#ff9900',
                              borderColor: '#cccccc',
                              borderWidth: 1,
                              alignSelf: 'flex-end',
                              margin: 8,
                              borderRadius: 5,
                              height: 35,
                              padding: 5
                          }}
                          onPress={this.CheckCourseCurrentQuiz.bind(this, item, null)}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Final test" : "เข้าสู่การสอบ"}</Text>
                        </Button>
                      </View>
                    </View>
                    :
                    <View/>
                  :
                  <View/>
                }


                
              {/* ======================แบบสอบถาม=================== */}
              {item.postTestCourse.QQuestAns_course ? 
                  item.postTestCourse.QQuestAns_course.err ?
                      <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccccc',
                      }}>
                      <Icon
                        name="bars"
                        size={20}
                        style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                      />
                      <Text numberOfLines={1} style={{flex: 1}}>{this.state.lang === "EN" ? "Assess Satisfaction" : "ประเมินความพึงพอใจ"}</Text>
                      <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          style={{
                            backgroundColor: '#ff9900',
                            borderColor: '#cccccc',
                            borderWidth: 1,
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5
                          }}
                          onPress={() => this.errAlert(item.postTestCourse.QQuestAns_course.err)}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Rate" : "ประเมิน"}</Text>
                        </Button>
                      </View>
                    </View>
                  : item.postTestCourse.QQuestAns_course.course_id ?
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccccc',
                      }}>
                      <Icon
                        name="bars"
                        size={20}
                        style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                      />
                      <Text numberOfLines={1} style={{flex: 1}}>{this.state.lang === "EN" ? "Assess Satisfaction" : "ประเมินความพึงพอใจ"}</Text>
                      <View style={{flex: 1, marginRight: 5}}>
                        <Button
                         disabled
                          style={{
                            backgroundColor: '#009900',
                            borderColor: '#cccccc',
                            borderWidth: 1,
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5
                          }}
                          //onPress={() => navigation.navigate('QQuestAns_course', {course_id: item.postTestCourse.QQuestAns_course.course_id})}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Completed" : "ประเมินเรียบร้อย"}</Text>
                        </Button>
                      </View>
                    </View>      
                  : item.postTestCourse.QQuestAns_course.courseSurvey_id ?
                      <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccccc',
                      }}>
                      <Icon
                        name="bars"
                        size={20}
                        style={{marginLeft: 10, marginRight: 10, color: '#b3b3b3'}}
                      />
                      <Text numberOfLines={1} style={{flex: 1}}>{this.state.lang === "EN" ? "Assess Satisfaction" : "ประเมินความพึงพอใจ"}</Text>
                      <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          style={{
                            backgroundColor: '#ff9900',
                            borderColor: '#cccccc',
                            borderWidth: 1,
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5
                          }}
                          onPress={() => navigation.navigate('QQuestAns_course', {course_id: course_id})}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "Rate" : "ประเมิน"}</Text>
                        </Button>
                      </View>
                    </View>  
                  :
                    <View/> 
              :
                <View/>
              }
              {/* ======================แบบสอบถาม=================== */}
            
            </View>
          );
  }
 /* ***** */
 mimetype = (name) => {
  let allow = {
    png: "image/png",
    JPG: "image/JPG",
    pdf: "application/pdf",
    jpeg: "image/jpeg",
    jpg: "image/jpg"
  };
  let extention = name.split(".")[1];
  if (allow[extention] !== undefined) {
    return allow[extention];
  } else {
    return undefined;
  }
};

  async file_feedback() {
    let result = await DocumentPicker.getDocumentAsync({});
    result.type = this.mimetype(result.name);
    if (result.type !== undefined) {
      this.setState({file_feedback: result});
    }else {
      Alert.alert(
        this.state.lang === "EN"
          ? "Please select image or PDF file"
          : "กรุณาเลือกเป็นรูปภาพหรือไฟล์ PDF"
      );
    }
  }

  async saveFeedback(){
      const {course_id, detail_feedback, file_feedback} = this.state
      const user_id = await AsyncStorage.getItem('userId');

      if(detail_feedback == ''){
          Alert.alert(this.state.lang == "EN" ? "Please enter details." : "กรุณาใส่ รายละเอียด")
      }else{
    
        var params = {
          user_id: user_id,
          course_id: course_id,
          detail_feedback: detail_feedback,
        };

        if (file_feedback=='') {
      
          httpClient
            .post("/Learn/SaveFeedbackNofile", params)
            .then((response) => {
              const result = response.data;
              if (result != null) {
                this.setState({
                  modalVisible: false,
                  detail_feedback: "",
                  file_feedback: "",
                });
                this.setState({
                  visible: true,
                  icon: "check",
                  backgroundColorIcon: "green",
                  content: this.state.lang == "EN" ? "Success." : "เรียบร้อย",
                });
              } else {
                console.log("ส่งไม่สำเร็จ");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
    
          const data = new FormData();
          data.append("file", {
            name: file_feedback.name,
            type: file_feedback.type,
            uri: file_feedback.uri,
          });
          Object.keys(params).forEach((key) => data.append(key, params[key]));
  
          httpClient
            .post("/Learn/SaveFeedback", data, {})
            .then((response) => {
              const result = response.data;
              if (result != null) {
                this.setState({
                  modalVisible: false,
                  detail_feedback: "",
                  file_feedback: "",
                });
                this.setState({
                  visible: true,
                  icon: "check",
                  backgroundColorIcon: "green",
                  content: this.state.lang == "EN" ? "Success." : "เรียบร้อย",
                });
              } else {
                console.log("ส่งไม่สำเร็จ");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    
  }
    

    render() {
      const {PreTestCourse, LessonAll, PostTestCourse} = this.state;
        return (
            <View style={{marginLeft: 0, marginRight: 0, marginTop: 10}}>
                
                {PreTestCourse != null ? (
                  <Accordion
                  dataArray={PreTestCourse}
                  animation={true}
                  expanded={[]}
                  renderHeader={this._renderHeader_PreTestCourse}
                  renderContent={this._renderContent_PreTestCourse}
                  />
                ) 
                :
                <View style={{flex: 1, alignItems: 'center', flexDirection: 'row',height: 50, width: '100%', backgroundColor: '#939598', borderColor: '#e6e6e6', borderWidth: 1}}>
                  <Text style={{alignSelf: 'center', marginLeft: 10, color: '#fff'}}>{this.state.lang === "EN" ? "Pre Exam Course" : "สอบก่อนเรียนหลักสูตร"}</Text>
                  <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          disabled
                          style={{
                            backgroundColor: '#ff9900',
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5
                          }}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "No Exam Courses" : "ไม่มีข้อสอบหลักสูตร"}</Text>
                        </Button>
                      </View>
                </View>

                }

                <Accordion
                    dataArray={LessonAll}
                    animation={true}
                    expanded={[]}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                /> 
               
                {PostTestCourse != null ? (
                   <Accordion
                   dataArray={PostTestCourse}
                   animation={true}
                   expanded={[]}
                   renderHeader={this._renderHeader_PostTestCourse}
                   renderContent={this._renderContent_PostTestCourse}
                   />
                ) 
                :
                <View style={{flex: 1, alignItems: 'center' ,flexDirection: 'row',height: 50, width: '100%', backgroundColor: '#939598', borderColor: '#e6e6e6', borderWidth: 1}}>
                  <Text style={{alignSelf: 'center', marginLeft: 10, color: '#fff'}}>{this.state.lang === "EN" ? "Exam Course" : "สอบหลักสูตร"}</Text>
                  <View style={{flex: 1, marginRight: 5}}>
                        <Button
                          disabled
                          style={{
                            backgroundColor: '#ff9900',
                            alignSelf: 'flex-end',
                            margin: 8,
                            borderRadius: 5,
                            height: 35,
                            padding: 5
                          }}
                          >
                          <Text style={{fontSize: 12, color: '#fff'}}>{this.state.lang === "EN" ? "No Exam Courses" : "ไม่มีข้อสอบหลักสูตร"}</Text>
                        </Button>
                      </View>
                </View>
                }
                
                <View style={{alignItems: 'flex-end'}}>
                  <TouchableHighlight
                        style={{ ...styles.openButton1, backgroundColor: "#2196F3", marginTop: 20 }}
                        onPress={() => this.setState({modalVisible: true})}
                      >
                      <Text style={styles.textStyle}>{this.state.lang === "EN" ? "Feedback To Supervisor" : "Feedback To Supervisor"}</Text>
                  </TouchableHighlight>
                </View>

              <Modal
                visible={this.state.modalVisible}
                onBackdropPress={() => 
                  this.setState({modalVisible: false})
                }
               >
                  <View style={styles.modalView}>
                    <View style={{alignItems: 'center', marginBottom: 15}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20 }}>
                        {this.state.lang === "EN" ? "Feedback" : "Feedback"}
                      </Text>
                    </View>
                    <View style={{alignItems: 'flex-start', marginBottom: 15}}>
                      <Text style={{fontSize: 16 }}>
                        {this.state.lang === "EN" ? "Course : " : "หลักสูตร : "} {this.props.course_title}
                      </Text>
                    </View>
                    <View>
                      <Label style={{fontSize: 16}}>{this.state.lang === "EN" ? "Detail" : "รายละเอียด"}<Label style={{color: 'red'}}>*</Label></Label>
                      <Textarea value={this.state.note_text}  style={{backgroundColor: '#e6e6e6', borderRadius: 10}} rowSpan={5} 
                        onChangeText={text => this.setState({detail_feedback: text})}
                      />
                    </View>

                    <View style={{marginTop: 10, marginBottom: 20}}>
                       <Label style={{fontSize: 16}}>{this.state.lang === "EN" ? "File" : "ไฟล์"}</Label>
                       <View style={{flexDirection: 'row',justifyContent: 'center', alignItems: 'center'}}>
                          <View style={{flex: 0.5 }}>
                            <Button
                              onPress={this.file_feedback.bind(this)}
                              style={{
                                backgroundColor: "#DCDCDC",
                                height: 30,
                              }}
                            >
                              <Text style={{marginLeft: 5, marginRight: 5}}>{this.state.lang == 'EN' ? 'Choose File' : 'เลือกไฟล์'}</Text>
                            </Button>
                          </View>
                          <View style={{flex: 1}}>
                             <Text>{this.state.file_feedback.name}</Text>
                          </View>
                       </View>
                       
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <View style={{marginRight: 5}}>
                      <Button
                        style={{backgroundColor: "#2196F3", marginTop: 20 }}
                        onPress={this.saveFeedback.bind(this)}
                      >
                        <Text style={styles.textStyle}>{this.state.lang === "EN" ? "Save" : "บันทึก"}</Text>
                      </Button>
                      </View>
                      <View style={{marginLeft: 5}}>
                      <Button
                        style={{backgroundColor: "#cc0000", marginTop: 20 }}
                        onPress={() => 
                          this.setState({modalVisible: false})}
                      >
                        <Text style={styles.textStyle}>{this.state.lang === "EN" ? "Cancel" : "ยกเลิก"}</Text>
                      </Button>
                      </View>
                    </View>
                    
                  </View>
              </Modal>

              <FancyAlert
                visible={this.state.visible}
                icon={<View style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: this.state.backgroundColorIcon,
                  borderRadius: 50,
                  width: '100%',
                }}>
                  <AntDesign
                  name={this.state.icon}
                  size={36}
                  color="#FFFFFF"
                />
                </View>}
                style={{ backgroundColor: 'white' }}
              >
                <View style={styles.content}>
                  <Text style={styles.contentText}>{this.state.content}</Text>
            
                  <TouchableOpacity style={styles.btn} onPress={()=> this.setState({visible: false})}>
                    <Text style={styles.btnText}>{this.state.lang == 'EN' ? 'OK' : 'ตกลง'}</Text>
                  </TouchableOpacity>
                </View>
          </FancyAlert>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  modalView: {
    // marginLeft: Platform.OS == 'ios' ? Platform.isPad ? 100 : null : DeviceInfo.isTablet() ? 100 : null,
    // marginRight: Platform.OS == 'ios' ? Platform.isPad ? 100 : null : DeviceInfo.isTablet() ? 100 : null,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      marginLeft: 20,
      marginRight: 20
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    openButton1: {
      backgroundColor: "#F194FF",
      borderRadius: 10,
      padding: 10,
      elevation: 2,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -16,
      marginBottom: 16,
    },
    contentText: {
      textAlign: 'center',
      fontSize: 16
    },
    btn: {
      borderRadius: 32,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 8,
      alignSelf: 'stretch',
      backgroundColor: '#0099ff',
      marginTop: 16,
      minWidth: '50%',
      paddingHorizontal: 16,
    },
    btnText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },

});

export default function(props) {
  const navigation = useNavigation();
  return <TabCourse {...props} navigation={navigation} />;
}


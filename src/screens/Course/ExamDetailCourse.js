import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, Image, AsyncStorage} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button} from 'native-base';
import {httpClient} from '../../core/HttpClient';
import {StackActions} from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native"

class ExamDetailCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          course_title: '',
          questions: '',
          time_allowed: '',
          total_score: '',
        };
      }
      async componentDidMount() {
        try {
          const {course_id, type} = this.props.route.params;
          var user_id = await AsyncStorage.getItem('userId');
          const res = await AsyncStorage.getItem('language');
          if (res === 'EN') {
            this.setState({lang: 'EN'});
            var lang_id = '1';
          } else {
            this.setState({lang: 'TH'});
            var lang_id = '2';
          }

          await httpClient
          .get(`/Lesson/ExamDetailCourse/${course_id}/${type}/${lang_id}`)
          .then(async response => {
            const result = response.data;
              if (result != null) {
                this.setState({course_title: result.course_title, questions: result.questions, 
                    time_allowed: result.time_allowed, total_score: result.total_score,
                 })
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
    const {course_id, type} = this.props.route.params;
    const { navigation } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <ScrollView>
          <View style={styles.viewModal}>
            <View style={styles.itemStyle}>
                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 15, color: '#404040'}}>
                    {this.state.lang === "EN" ? 'Course Examination' : 'การสอบหลักสูตร'}
                </Text>
                <Text numberOfLines={1} style={{fontSize: 16, fontWeight: '500', marginTop: 5, color: '#404040', marginLeft: 20, marginRight: 20}}>
                 {this.state.lang === "EN" ? 'Course Name: ' : 'ชื่อหลักสูตร: '} {this.state.course_title}
                </Text>
                <View style={{backgroundColor: '#d9d9d9', height: 1, width: '80%', alignSelf: 'center', marginTop: 20}}></View>
                <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
                    <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
                        <Text style={{color: '#404040'}}>{this.state.lang === "EN" ? 'Number of questions' : 'จำนวนข้อสอบ'}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                        <Text style={{color: '#404040'}}>{this.state.questions} {this.state.lang === "EN" ? 'Questions' : 'ข้อ'}</Text>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', marginTop: -5}}>
                    <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
                        <Text style={{color: '#404040'}}>{this.state.lang === "EN" ? 'Time allowed' : 'เวลาในการทำข้อสอบ'}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                        <Text style={{color: '#404040'}}>{this.state.time_allowed} {this.state.lang === "EN" ? 'Minutes' : 'นาที'}</Text>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', marginTop: -5}}>
                    <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
                        <Text style={{color: '#404040'}}>{this.state.lang === "EN" ? 'Total score' : 'คะแนนเต็ม'}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                        <Text style={{color: '#404040'}}>{this.state.total_score} {this.state.lang === "EN" ? 'Points' : 'คะแนน'}</Text>
                    </View>
                </View>

                <View style={{alignSelf: 'center'}}>
                  {
                    type == 'pre' ? 
                    <Button 
                    onPress={() => navigation.dispatch(StackActions.replace('PreTestCourse', {course_id: course_id, type: type}))}
                    style={{height: 35, marginBottom: 20, borderRadius: 5, backgroundColor: '#ff8000'}}>
                            <Text style={{marginRight: 10, marginLeft: 10, color: '#fff', fontWeight: 'bold'}}>{this.state.lang === "EN" ? 'Test' : 'ทำแบบทดสอบ'}</Text>
                    </Button>   
                    :
                    <Button 
                    onPress={() => navigation.dispatch(StackActions.replace('PostTestCourse', {course_id: course_id, type: type}))}
                    style={{height: 35, marginBottom: 20, borderRadius: 5, backgroundColor: '#ff8000'}}>
                            <Text style={{marginRight: 10, marginLeft: 10, color: '#fff', fontWeight: 'bold'}}>{this.state.lang === "EN" ? 'Test' : 'ทำแบบทดสอบ'}</Text>
                    </Button>
                  }
                </View>
               
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewModal: {
    flex: 1,
    margin: 10,
  },
  itemStyle: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 10,
    height: 240,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#a6a6a6',
    marginTop: 30,
  },
});


export default function(props) {
  const navigation = useNavigation();
  return <ExamDetailCourse {...props} navigation={navigation} />;
}
import React, {Component} from 'react';
import {Text, View, SafeAreaView, ScrollView, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import {Button} from 'native-base';
import Dash from 'react-native-dash';
import moment from 'moment';
import {StackActions} from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native"

class ResultTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      loading: false,
      // showAnswer: false,
    };
  }

  async componentDidMount() {
    try {
      const res = await AsyncStorage.getItem('language');
      if (res === 'EN') {
        this.setState({lang: 'EN'});
      } else {
        this.setState({lang: 'TH'});
      }

    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const { navigation } = this.props;
    const {result} = this.props.route.params;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView>
        {
            result.modelScore.map((data) => {
                return (
                  <View style={{alignItems: 'center', margin: 40}}>
                    {data.score_past == 'y' ? 
                        <View style={{alignItems: 'center'}}>
                          <Icon name="checkcircle" size={100} style={{color: 'green'}} />
                          <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 10}}>{this.state.lang === "EN" ? 'Passed' : 'สอบผ่าน'}</Text>
                        </View>
                    :
                        <View style={{alignItems: 'center'}}>
                          <Icon name="closecircle" size={100} style={{color: 'red'}} />
                          <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 10}}>{this.state.lang === "EN" ? 'Fail' : 'สอบไม่ผ่าน'}</Text>
                        </View>
                    }
                 </View>
                )
            })
        }
         
          <View
            style={{
              backgroundColor: '#fff',
              marginLeft: 20,
              marginRight: 20,
              padding: 15,
              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 7,
            }}>

              {
                  result.typeTest == 'pre' ?
                  <View>
                    <Text style={{fontSize: 16, marginBottom: 5}}>{this.state.lang === "EN" ? 'Pre test' : 'สอบก่อนเรียน'}</Text>
                  </View>
                  :
                  <View>
                    <Text style={{fontSize: 16, marginBottom: 5}}>{this.state.lang === "EN" ? 'Post test' : 'สอบหลังเรียน'}</Text>
                  </View>
                }

              {
                result.lesson.map((data) => {
                    return (
                      <View style={{marginRight: 20}}>
                        <Text style={{fontSize: 16, marginBottom: 5}}>
                          {data.title}
                        </Text>
                      </View>
                     
                    )
                })
              }
            

            {
              result.modelScore.map((data) => {
                  return (
                    <Text style={{fontSize: 14, marginBottom: 5, color: '#00b3b3'}}>
                     {this.state.lang === "EN" ? 'The day of the exam : ' : 'วันที่ทำข้อสอบ : '} {moment(data.create_date).format('DD/MM/YYYY h:mm')}
                    </Text>
                  )
              })
            }

            {/* <View style={{flex: 1,flexDirection: 'row',justifyContent: 'space-around'}}>
              <View >
                <Button
                  iconLeft
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#bfbfbf',
                    backgroundColor: '#f2f2f2',
                    padding: 5,
                    alignSelf: 'center',
                  }}>
                  <Icon
                    name="form"
                    size={20}
                    style={{marginRight: 5, color: '#a6a6a6'}}
                  />
                  <Text style={{color: '#a6a6a6'}}>{result.full_score} {this.state.lang === "EN" ? 'questions' : 'ข้อ'}</Text>
                </Button>
              </View>
              <View >
                <Button
                  iconLeft
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#bfbfbf',
                    backgroundColor: '#f2f2f2',
                    padding: 5,
                    alignSelf: 'center',
                  }}>
                  <Icon1
                    name="clock"
                    size={30}
                    style={{marginRight: 2, color: '#a6a6a6'}}
                  />
                  <Text style={{color: '#a6a6a6'}}>{result.time_allowed} {this.state.lang === "EN" ? 'minutes' : 'นาที'}</Text>
                </Button>
              </View>

              {
                    result.answer !== null ?
                    <View >
                      <Button
                        // onPress={() => this.setState({showAnswer: true})}
                        iconLeft
                        style={{
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: '#bfbfbf',
                          backgroundColor: '#f2f2f2',
                          padding: 5,
                          alignSelf: 'center',
                        }}>
                        <Icon
                          name="unknowfile1"
                          size={20}
                          style={{marginRight: 5, color: '#a6a6a6'}}
                        />
                        <Text style={{color: '#a6a6a6'}}>{this.state.lang === "EN" ? 'see answer' : 'ดูเฉลย'}</Text>
                      </Button>
                    </View>
                    :
                    <View/>
              }
             
            </View> */}

          </View>

          {
              result.modelScore.map((data) => {
                  return (
                    <View>
                        <View style={{marginLeft: 30, marginTop: 30, marginBottom: 5}}>
                      <Text style={{fontSize: 18}}>{this.state.lang === "EN" ? 'Detail' : 'รายละเอียด'}</Text>
                    </View>
                    <View
                    style={{
                      backgroundColor: '#fff',
                      marginLeft: 15,
                      marginRight: 15,
                      padding: 25,
                      borderColor: '#d9d9d9',
                      borderWidth: 1,
                      borderRadius: 7,
                      // marginTop: 40,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Number of questions' : 'จำนวนข้อสอบทั้งหมด'}</Text>
                      </View>
                      <View style={{flex: 0.7, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16, color: '#000066'}}>{result.full_score} {this.state.lang === "EN" ? 'Questions' : 'ข้อ'}</Text>
                      </View>
                    </View>
                    <Dash
                      style={{width: '100%', height: 1, marginBottom: 10}}
                      dashColor="#d9d9d9"
                    />
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Time allowed' : 'เวลาในการทำข้อสอบ'}</Text>
                      </View>
                      <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16, color: '#000066'}}>{result.time_allowed} {this.state.lang === "EN" ? 'minutes' : 'นาที'}</Text>
                      </View>
                    </View>
                    <Dash
                      style={{width: '100%', height: 1, marginBottom: 10}}
                      dashColor="#d9d9d9"
                    />
        
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Time spent' : 'ใช้เวลาในการสอบ'}</Text>
                      </View>
                      <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16, color: '#000066'}}>{result.use_timeTest} {this.state.lang === "EN" ? 'minutes' : 'นาที'}</Text>
                      </View>
                    </View>
                    <Dash
                      style={{width: '100%', height: 1, marginBottom: 10}}
                      dashColor="#d9d9d9"
                    />
        
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Total score' : 'คะแนนเต็ม'}</Text>
                      </View>
                      <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16, color: '#000066'}}>{data.score_total} {this.state.lang === "EN" ? 'Points' : 'คะแนน'}</Text>
                      </View>
                    </View>
                    <Dash
                      style={{width: '100%', height: 1, marginBottom: 10}}
                      dashColor="#d9d9d9"
                    />
        
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Your score earned' : 'คะแนนที่ได้'}</Text>
                      </View>
                      <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16, color: '#000066'}}>{result.grandtotalscore} {this.state.lang === "EN" ? 'Points' : 'คะแนน'}</Text>
                      </View>
                    </View>
                    <Dash
                      style={{width: '100%', height: 1, marginBottom: 10}}
                      dashColor="#d9d9d9"
                    />
        
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Percent' : 'คิดเป็นร้อยละ'}</Text>
                      </View>
                      <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16, color: '#000066'}}>{result.percent_quiz} %</Text>
                      </View>
                    </View>
                    <Dash style={{width: '100%', height: 1}} dashColor="#d9d9d9" />
                  </View>
                  </View>
                  )
              })
            }
          
      {
        result.logQues[0].ques_type != 4 ?
          <View>
                <View style={{marginLeft: 30, marginTop: 30, marginBottom: 5}}>
                  <Text style={{fontSize: 18}}>{this.state.lang === "EN" ? 'Total score' : 'คะแนนทั้งหมด'}</Text>
                </View>
          <View
            style={{
              backgroundColor: '#fff',
              marginLeft: 20,
              marginRight: 20,
              padding: 25,
              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 7,
            }}>

            {
                result.logQues.map((data, key) => {
                  return (
                    <View>
                            {
                                data.result === 1 ?
                                <View style={{flexDirection: 'row'}}>
                                      <View style={{flex: 1, marginLeft: 30}}>
                                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'No. ' : 'ข้อ '}{key+1}</Text>
                                      </View>
                                      <View
                                        style={{flex: 0.5, alignItems: 'flex-end', marginRight: 40}}>
                                        <Icon name="checkcircle" size={20} style={{color: 'green'}} />
                                      </View>
                                  </View>
                                :
                                <View style={{flexDirection: 'row'}}>
                                      <View style={{flex: 1, marginLeft: 30}}>
                                        <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'No. ' : 'ข้อ '}{key+1}</Text>
                                      </View>
                                      <View
                                        style={{flex: 0.5, alignItems: 'flex-end', marginRight: 40}}>
                                        <Icon name="closecircle" size={20} style={{color: 'red'}} />
                                      </View>
                                  </View>
                            }
                          <Dash
                            style={{width: '100%', height: 1, marginBottom: 10}}
                            dashColor="#d9d9d9"
                          />
                    </View>
                  )
              })
            }

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1, marginLeft: 30}}>
                <Text style={{fontSize: 16}}>{this.state.lang === "EN" ? 'Total' : 'คะแนนทั้งหมด'}</Text>
              </View>
              <View
                style={{flex: 0.5, alignItems: 'flex-end', marginRight: 45}}>
                <Text style={{fontSize: 18}}>{result.grandtotalscore}</Text>
              </View>
            </View>
          </View>
            </View>
            :
            <View/>
          }
         
        { 
          result.answer !== null ?
        <View>
          <View style={{marginLeft: 30, marginTop: 30, marginBottom: 10}}>
            <Text style={{fontSize: 18}}>{this.state.lang === "EN" ? 'Answer' : 'เฉลย'}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              marginLeft: 20,
              marginRight: 20,
              padding: 15,
              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 7,
            }}>
                              <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View>
                                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.state.lang === "EN" ? 'No. ' : 'ข้อ '}</Text>
                                    </View>
                                    <View>
                                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.state.lang === "EN" ? 'Detail ' : 'รายละเอียด '}</Text>
                                    </View>
                                    <View>
                                       <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.state.lang === "EN" ? 'Status ' : 'สถานะ '}</Text>
                                    </View>
                                </View>
                                <Dash style={{width: '100%', height: 1, marginBottom: 10}}
                                      dashColor="#d9d9d9"
                                    />

                  {
                      result.answer.map(data => {
                          return (
                            <View>
                                <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View style={{flex: 0.3}}>
                                       <Text style={{fontSize: 14}}>{data.index}</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                      <View style={{flex: 1,flexDirection: 'column'}}>
                                          <Text style={{fontSize: 14, color: '#000080'}}>{this.state.lang === "EN" ? 'Question : ' : 'คำถาม : '}</Text>
                                          <Text style={{fontSize: 14}}>{data.question}</Text>
                                            <View style={{height: 10}}></View>
                                          <Text style={{fontSize: 14, color: '#000080'}}>{this.state.lang === "EN" ? 'Answer : ' : 'คำตอบ : '}</Text>
                                          <Text style={{fontSize: 14}}>{data.answer}</Text>
                                            <View style={{height: 10}}></View>
                                          <Text style={{fontSize: 14, color: '#000080'}}>{this.state.lang === "EN" ? 'Answer : ' : 'เฉลย : '}</Text>
                                          <Text style={{fontSize: 14}}>{data.choice_answer}</Text>
                                      </View>
                                    </View>
                                    <View style={{flex: 0.3, alignItems: 'flex-end', marginRight: 15}}>
                                      {
                                        data.icon_score == 'success' ? 
                                          <Icon name="checkcircle" size={20} style={{color: 'green'}} />
                                        : data.icon_score == 'danger' ?
                                          <Icon name="closecircle" size={20} style={{color: 'red'}} />
                                        :
                                        <View/>
                                      }
                                    </View>
                                </View>
                              <Dash
                                style={{width: '100%', height: 1, marginBottom: 10, marginTop: 10}}
                                dashColor="#d9d9d9"
                              />
                           </View>
                  )
              })
            }

          </View>
        </View>
        
        :
        <View/>
      }

          <View style={{alignSelf: 'center', margin: 30}}>
            <Button
              iconLeft
              light
              style={{
                padding: 10,
                backgroundColor: '#000080',
                borderRadius: 5,
              }}
             
              onPress={() =>  navigation.dispatch(StackActions.replace('LearnScreen', {course_id: result.course_id}))}
              >
              <Icon
                name="reload1"
                size={20}
                style={{marginRight: 10, color: '#fff'}}
              />
              <Text style={{fontSize: 18, color: '#fff'}}>
                {this.state.lang === "EN" ? 'Back to course' : 'กลับหน้าหลักสูตร'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default function(props) {
  const navigation = useNavigation();
  return <ResultTest {...props} navigation={navigation} />;
}

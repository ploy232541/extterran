import React, {Component} from 'react';
import { Text, Button } from "react-native-paper";
import { Card } from "react-native-elements";
import Icons from "react-native-vector-icons/MaterialIcons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View, StyleSheet, TextInput, Dimensions, AsyncStorage, Image, Alert } from "react-native";
import {httpClient} from '../core/HttpClient';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import {Item, Input, Label, Textarea, Form, Picker} from 'native-base';
import FormData from 'form-data';
import * as ImagePicker from 'expo-image-picker';

const HEIGHT = Dimensions.get("window").height;

class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      massages: '',
      select_1: [],
      select_2: [],
      problem_type: '',
      course: '',

      show: false,
      uploadPhoto: null,
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem('userId');
    const res = await AsyncStorage.getItem('language');
    if (res === 'EN') {
      this.setState({lang: 'EN'});
    } else {
      this.setState({lang: 'TH'});
    }

    try {
      httpClient
        .get(`/ReportProblem/getReportProblem`)
        .then(response => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_1: result,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });

        httpClient
        .get(`/ReportProblem/getCourse`)
        .then(response => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_2: result,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });

      httpClient
        .get(`/User/${id}`)
        .then(response => {
          const result = response.data;
          if (result != null) {
           
            for (let i = 0; i < result.length; i++) {
              var row = result[i];
              this.setState({
                firstname: this.state.lang === 'EN' ? row.firstname_en : row.firstname,
                lastname: this.state.lang === 'EN' ? row.lastname_en : row.lastname,
                phone: row.phone,
                email: row.email,
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (err) {
      Alert.alert(err);
  }
}

  handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled){
    this.setState({uploadPhoto: result});
    }
  }

  reset(){
    this.setState({
      massages: '',
      select_1: [],
      select_2: [],
      problem_type: '',
      course: '',
      uploadPhoto: null,
    })
  }

  onPressSend = () =>{
    try{
      const {
        firstname,
        lastname,
        phone,
        email,
        massages,
        problem_type,
        course,
        uploadPhoto,
      } = this.state

      if (firstname === '') {
        this.state.lang === 'EN'
          ? Alert.alert('Please enter firstname')
          : Alert.alert('กรุณาใส่ชื่อ');
        var error = true;
      } else if (lastname === '') {
        this.state.lang === 'EN'
          ? Alert.alert('Please enter lastname')
          : Alert.alert('กรุณาใส่นามสกุล');
        var error = true;
      } else if (email === '') {
        this.state.lang === 'EN'
          ? Alert.alert('Please enter email')
          : Alert.alert('กรุณาใส่อีเมล');
        var error = true;
      } else if (massages === '') {
        this.state.lang === 'EN'
          ? Alert.alert('Please enter massages')
          : Alert.alert('กรุณาใส่ข้อความ');
        var error = true;
      }

      if (error != true) {
        const params = {
          firstname: firstname,
          lastname: lastname,
          phone: phone,
          email: email,
          massages: massages,
          problem_type: problem_type,
          course: course,
        }
  
        if(uploadPhoto != null){
          const data = new FormData();
          data.append('image', {
            name:  '_image_',
            type: uploadPhoto.type,
            uri: uploadPhoto.uri,
          });
    
          Object.keys(params).forEach(key => data.append(key, params[key]));

          Alert.alert(
            this.state.lang === 'EN' ? 'Alert' : 'แจ้งเตือน',
            this.state.lang === 'EN' ? 'Confirm' : 'ยืนยัน',
            [
              {
                text: this.state.lang === 'EN' ? 'CANCEL' : 'ยกเลิก',
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: this.state.lang === 'EN' ? 'OK' : 'ตกลง', onPress: () =>  {
              httpClient
                .post(`/ReportProblem/InsertReportProblem_haveImage`, data)
                .then(response => {
                  const result = response.data;
                  if (result === true) {
                    Alert.alert(
                      this.state.lang === 'EN' ? 'Alert' : 'แจ้งเตือน',
                      this.state.lang === 'EN' ? 'Problem reported' : 'แจ้งปัญหาเรียบร้อย',
                      [
                        { text: this.state.lang === 'EN' ? 'OK' : 'ตกลง', onPress: () =>  this.reset() }
                      ],
                      { cancelable: false }
                    );
                  }else{
                    Alert.alert(this.state.lang === 'EN' ? `I can't report the problem` : 'แจ้งปัญหาไม่ได้')
                  }
                })
                .catch(error => {
                  console.log(error);
                });
              } 
            }
           ],
           { cancelable: false }
         );
        }else{
            const params = {
              firstname: firstname,
              lastname: lastname,
              phone: phone,
              email: email,
              massages: massages,
              problem_type: problem_type,
              course: course,
            }

            Alert.alert(
              this.state.lang === 'EN' ? 'Alert' : 'แจ้งเตือน',
              this.state.lang === 'EN' ? 'Confirm' : 'ยืนยัน',
              [
                {
                  text: this.state.lang === 'EN' ? 'CANCEL' : 'ยกเลิก',
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: this.state.lang === 'EN' ? 'OK' : 'ตกลง', onPress: () =>  {
                  httpClient
                  .post(`/ReportProblem/InsertReportProblem_notImage`, params)
                  .then(response => {
                    const result = response.data;
                    if (result === true) {
                      Alert.alert(
                        this.state.lang === 'EN' ? 'Alert' : 'แจ้งเตือน',
                        this.state.lang === 'EN' ? 'Problem reported' : 'แจ้งปัญหาเรียบร้อย',
                        [
                          { text: this.state.lang === 'EN' ? 'OK' : 'ตกลง', onPress: () =>  this.reset() }
                        ],
                        { cancelable: false }
                      );
                    }else{
                      Alert.alert(this.state.lang === 'EN' ? `I can't report the problem` : 'แจ้งปัญหาไม่ได้')
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
                } 
               }
              ],
              { cancelable: false }
            );
        }
      }
     } catch (err) {
      Alert.alert(err);
     }
  }

  render(){
    return (
      <ScrollView style={styles.root}>
        <Card containerStyle={{ borderColor: "#398DDD", marginBottom: 30 }}>
           <Card.Title>
            <View
              style={{
                flex: 1,
                paddingVertical: 15,
                paddingHorizontal: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icons size={24} name="info" />
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}
              >
              {this.state.lang == 'EN' ? 'Report a problem' : 'แจ้งปัญหาการใช้งาน'}
              </Text>
            </View>
          </Card.Title>
          <Card.Divider />
          <Text>{this.state.lang == 'EN' ? 'Fitsrt name' : 'ชื่อ'}<Label style={{color: 'red'}}>*</Label></Text>
          <TextInput style={styles.inputStyle} 
           value={this.state.firstname}
           onChangeText={text => this.setState({firstname: text})}
          />
  
          <Text>{this.state.lang == 'EN' ? 'Last name' : 'นามสกุล'}<Label style={{color: 'red'}}>*</Label></Text>
          <TextInput style={styles.inputStyle} 
           value={this.state.lastname}
           onChangeText={text => this.setState({lastname: text})}
          />
  
          <Text>{this.state.lang == 'EN' ? 'Phone' : 'เบอร์โทรศัพท์'}<Label style={{color: 'red'}}>*</Label></Text>
          <TextInput style={styles.inputStyle} 
           value={this.state.phone}
           onChangeText={text => this.setState({phone: text})}
          />
  
          <Text>{this.state.lang == 'EN' ? 'Email' : 'อีเมล'}<Label style={{color: 'red'}}>*</Label></Text>
          <TextInput style={styles.inputStyle} 
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />

          <Text style={{marginBottom: 10}}>{this.state.lang == 'EN' ? 'Problem type' : 'ประเภทปัญหา'}</Text>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="arrow-down" />}
                    style={{width: '100%', borderWidth: 1, borderColor: '#d9d9d9', marginBottom: 5}}
                    // placeholder={this.state.lang === 'EN' ? 'Selecte' : 'เลือก'}
                    placeholderStyle={{color: '#bfc6ea'}}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.problem_type}
                    onValueChange={text => this.setState({problem_type: text})}
                    textStyle={{fontSize: 14}}
                    >
                    <Picker.Item
                    label={this.state.lang === 'EN' ? 'Please select' : 'กรุณาเลือก'} value='' 
                    />
                      {this.state.select_1.map((data) => {
                        return (
                          <Picker.Item label={data.usa_title} value={data.usa_id} />
                        )
                      })}
                  </Picker>

            <Text style={{marginBottom: 10}}>{this.state.lang == 'EN' ? 'Course' : 'หลักสูตร'}</Text>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="arrow-down" />}
                    style={{width: '100%', borderWidth: 1, borderColor: '#d9d9d9', marginBottom: 5}}
                    // placeholder={this.state.lang === 'EN' ? 'Selecte' : 'เลือก'}
                    placeholderStyle={{color: '#bfc6ea'}}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.course}
                    onValueChange={text => this.setState({course: text})}
                    textStyle={{fontSize: 14}}
                    >
                      <Picker.Item label={this.state.lang === 'EN' ? 'Please select' : 'กรุณาเลือก'} value='' />
                      {this.state.select_2.map((data) => {
                          return (
                            <Picker.Item label={data.course_title} value={data.course_id} />
                          )
                        })}
                  </Picker>
  
          <Text>{this.state.lang == 'EN' ? 'Message' : 'ข้อความ'}<Label style={{color: 'red'}}>*</Label></Text>
               <Textarea
                  style={{marginBottom: 5}}
                  onChangeText={text => this.setState({massages: text})}
                  value={this.state.massages}
                  rowSpan={4}
                  bordered
                  placeholder={this.state.lang === 'EN' ? 'Type your message in the box.' : 'พิมพ์ข้อความในช่อง'}
                />
  
          <Text>{this.state.lang == 'EN' ? 'Upload image' : 'อัพโหลดรูปภาพ'}</Text>
          <TouchableOpacity
            onPress={this.handleChoosePhoto}
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
            }}
          >
            <View
              style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            >
              <Text>{this.state.lang == 'EN' ? 'Choose File' : 'เลือกรูปภาพ'}</Text>
            </View>
          </TouchableOpacity>

          <View style={{flex: 1, marginTop: 10}}>
                {this.state.uploadPhoto ? (
                    <Image 
                    resizeMode={'stretch'}
                    source={{uri: this.state.uploadPhoto.uri}} 
                    style={{ 
                      width: 120,
                      height: 120,
                      borderWidth: 1,
                      borderColor: 'gray',}} />
                  ) : (
                    <View/>
                  )}
          </View>
  
          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={this.onPressSend}
          >
            {this.state.lang == 'EN' ? 'Submit' : 'ยืนยัน'}
          </Button> 
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#fff" },
  inputStyle: {
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 5,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 5,
  },
  submitButton: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#59BDC5",
    marginTop: 40,
    color: "#fff",
  },
});


export default function(props) {
  return <ReportScreen {...props}  />;
}

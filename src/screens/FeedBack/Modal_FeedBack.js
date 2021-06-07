import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage, Alert, Platform, Image, StyleSheet, TouchableHighlight} from 'react-native'
import {Accordion, Button, Label, Textarea} from 'native-base';
import {httpClient} from '../../core/HttpClient';
import { downloadFIle } from "../../utils/file";
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import * as DocumentPicker from 'expo-document-picker';

export default class Modal_FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          listFeedBack: [],
          answer_text: '',
        };
      }

      async componentDidMount() {
        try {
          const courseId = this.props.courseId
          const user_id = await AsyncStorage.getItem('userId');
          const res = await AsyncStorage.getItem('language');
          if (res === 'EN') {
            this.setState({lang: 'EN'});
            var lang_id = '1';
          } else {
            this.setState({lang: 'TH'});
            var lang_id = '2';
          }

            httpClient
            .get(`/FeedBack/getModelFeedBack/${user_id}/${courseId}/${lang_id}`)
            .then(response => {
                let res = response.data;
                // console.log(res)
                if (res != null) {
                  this.setState({listFeedBack: res})
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
        const {listFeedBack} = this.state

        return (
            <View>
                <Modal
                visible={this.props.chkVisible}
                onBackdropPress={this.props.closeModal}
               >
                <View style={styles.modalView}>
                <View style={{alignItems: 'center', marginBottom: 15}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20 }}>
                        {this.state.lang === "EN" ? "Feedback" : "Feedback"}
                      </Text>
                </View>
                  <ScrollView>

                      {
                        listFeedBack ?
                          listFeedBack.map((data) => {
                              return(
                                  <>
                                     <View style={{alignItems: 'flex-end', marginBottom: 5}}>
                                        <Text style={{fontSize: 16 }}>
                                            {data.user_ques}
                                        </Text>
                                      </View>

                                        <View style={{alignItems: 'flex-end', marginBottom: 15}}>
                                        <View style={{backgroundColor: '#3399ff', padding: 20, borderRadius: 10, justifyContent: 'center',alignItems: 'center'}}>
                                            <Text style={{fontSize: 16, marginBottom: 10, color: '#fff' }}>
                                             {data.feedback_text}
                                            </Text>
                                            {
                                              data.file_url != null ?
                                              <Button
                                                onPress={() => downloadFIle(data.file_url, data.file_name)}
                                                style={{
                                                    backgroundColor: "#f2f2f2",
                                                    height: 30,
                                                    alignSelf: 'center'
                                                }}
                                                >
                                                <Icon name='file1' size={15} style={{marginLeft: 10}}/>
                                                <Text style={{marginLeft: 3, marginRight: 10}}>{this.state.lang == 'EN' ? 'File' : 'ไฟล์'}</Text>
                                              </Button> 
                                              :
                                              null
                                            }
                                          
                                        </View>
                                        </View>

                                        {
                                           data.answer_text != null ?
                                           <>
                                           <View style={{alignItems: 'flex-start'}}>
                                            <Label style={{fontSize: 16, marginBottom: 5}}>{data.user_ans}</Label>
                                            <View style={{alignItems: 'flex-start', marginBottom: 15}}>
                                                <View style={{backgroundColor: '#d9d9d9', padding: 20, borderRadius: 10, justifyContent: 'center',alignItems: 'center'}}>
                                                    <Text style={{fontSize: 16, marginBottom: 10 }}>
                                                    {data.answer_text}
                                                    </Text>
                                                    {
                                                      data.answer_file_url != null ?
                                                          <Button
                                                            onPress={() => downloadFIle(data.answer_file_url, data.answer_file_name)}
                                                            style={{
                                                                backgroundColor: "#4da6ff",
                                                                height: 30,
                                                                alignSelf: 'center'
                                                            }}
                                                            >
                                                            <Icon name='file1' size={15} style={{marginLeft: 10}}/>
                                                            <Text style={{marginLeft: 3, marginRight: 10}}>{this.state.lang == 'EN' ? 'File' : 'ไฟล์'}</Text>
                                                          </Button>
                                                      :
                                                      null
                                                    }
                                                    
                                                </View>
                                            </View>
                                           </View>
   
                                           </>
                                           :
                                           null
                                        }

                                        <View style={{height: 1, width: '100%', backgroundColor: '#e6e6e6', marginTop: 15, marginBottom: 20}}/>
                                  </>
                              )
                          })
                          :
                          null
                      }
                   
                  </ScrollView>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <View style={{marginLeft: 5}}>
                      <Button
                        style={{backgroundColor: "#cc0000", marginTop: 20 }}
                        onPress={this.props.closeModal}
                      >
                        <Text style={styles.textStyle}>{this.state.lang === "EN" ? "Close" : "ปิด"}</Text>
                      </Button>
                      </View>
                    </View>
                  </View>
              </Modal>
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
      padding: 20,
      height: 700,
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
  
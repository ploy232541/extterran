import React, { Component } from 'react'
import { Text, View, SafeAreaView, AsyncStorage, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native'
import {httpClient} from '../../core/HttpClient';
import RadioButtonRN from 'radio-buttons-react-native';
import {Textarea, Button, Input, Item } from "native-base";
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements'
var decode = require('decode-html');
import { Divider, RadioButton } from "react-native-paper";
import {StackActions} from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native"

class QQuestAns_course extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          loading: false,
          questionnaire: null,
          input: null,
          radio: null,
          checkbox: [],
          text: null,
          contentment: {},
        };
      }

    removeTags(str) { 
        if ((str===null) || (str==='')) 
            return false; 
        else
            str = str.toString(); 
        return str.replace( /(<([^>]+)>)/ig, ''); 
    } 
    
    async componentDidMount() {
          this.setState({loading: true})
          let course_id = this.props.route.params.course_id
          let user_id = await AsyncStorage.getItem('userId');
          let res = await AsyncStorage.getItem('language');
          if (res === 'EN') {
            this.setState({lang: 'EN'});
          } else {
            this.setState({lang: 'TH'});
          }

          const params = {course_id: course_id, user_id: user_id}
          httpClient
            .post(`/QuestionnaireCourse/Index` ,params)
            .then(async response => {
                const result = response.data;
                if (result != null) {
                    // console.log(result)
                    this.setState({
                        questionnaire: result,
                    })
                }else{
                    this.setState({
                    loading: false,
                    })
                }
                })
                .catch(error => {
                console.log(error);
            });
    }

    onPressSubmit = async() => {
        const { navigation } = this.props;
        let course_id = this.props.route.params.course_id
        let user_id = await AsyncStorage.getItem('userId');
        let {input, radio, checkbox, text, contentment} = this.state

        const params = {course_id: course_id, user_id: user_id,
             choice: {input: input, radio: radio, checkbox: checkbox.length > 0 ? checkbox : null, text: text, contentment: contentment}
        }

        Alert.alert(
            this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
            this.state.lang === "EN" ? "Confirm the assessment" : "ยืนยันการประเมิน",
            [
              { text: this.state.lang === "EN" ? "OK" : "ตกลง", onPress: () => 
                    // console.log(params)
                    httpClient
                    .post(`/QuestionnaireCourse/Index` ,params)
                    .then(async response => {
                        const result = response.data;
                        if (result.status == true) {
                            //console.log(result)
                            Alert.alert(
                                this.state.lang === "EN" ? "Completed assessment" : "ประเมินเรียบร้อย",
                                this.state.lang === "EN" ? "" : "",
                                [
                                  { text: this.state.lang === "EN" ? "OK" : "ตกลง", 
                                    onPress: () => navigation.dispatch(StackActions.replace('LearnScreen', {course_id: course_id}))
                                  }
                                ],
                                { cancelable: false }
                              );
                        }
                        })
                        .catch(error => {
                        console.log(error);
                    })
              },
              {
                text: this.state.lang === "EN" ? "CANCEL" : "ยกเลิก",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
            ],
            { cancelable: false }
          );
    }
    
    TextSort = (text, choice_id) => {
        let arr_input = []
        arr_input[choice_id] = text
        this.setState({input: arr_input})
    }

    Single_choice(e){
        let arr_radio = []
        arr_radio[e.value] = e.label
        this.setState({radio: arr_radio})
    }

    isItemChecked(choice_id) {
        return this.state.checkbox.indexOf(choice_id.toString()) > -1
    }

    manageToggle = (evt, choice_id) =>{
        if (this.isItemChecked(choice_id)) {
          this.setState({
            checkbox: this.state.checkbox.filter(i => i !== choice_id.toString())
          })
        } else {
          this.setState({
            checkbox: [...this.state.checkbox, choice_id.toString()],
          })
        }
    }

    TextLong = (text, choice_id) => {
        let arr_text = []
        arr_text[choice_id] = text
        this.setState({text: arr_text})
    }

    handleSurvey = (quesId, choiceId) => {
        this.setState((state) => ({
          contentment: {
            ...state.contentment,[quesId]: { value: choiceId },
          },
        }));
      };

    render() {
        const {questionnaire, input, checkbox, text, contentment} = this.state
        var radio_props = [];
        return (
            <SafeAreaView style={{flex: 1 ,backgroundColor: '#fff'}}>
                <ScrollView>
                    <View style={{flex: 1, padding: 20}}>
                        {
                            questionnaire != null ? 
                            <View>
                                <Text style={{fontSize: 16, marginBottom: 5, fontWeight: 'bold'}}>{questionnaire.survey.name} </Text>
                                <Text style={{fontSize: 14}}>{this.removeTags(decode(questionnaire.survey.instructions))} </Text>
                                <View style={{height: 1, width: '100%', backgroundColor: '#d9d9d9', marginTop: 5}}/>

                                {
                                   questionnaire.survey.item ? 
                                   <View>
                                        {
                                            questionnaire.survey.item.map((data) => {
                                                return(
                                                    <View>
                                                        <Text style={{marginTop: 10}}> {this.state.lang === "EN" ? "Group name" : "ชื่อกลุ่ม"} {data.section.section_title} </Text>
                                                        {
                                                        data.item.map((value) => {
                                                          return(
                                                                <View>
                                                                    {
                                                                        //=============input_type_id 1=============//
                                                                        value.question.input_type_id == 1 ?
                                                                            <View>
                                                                                <Text style={{marginTop: 20}}>{value.question.question_name}</Text>
                                                                                {
                                                                                    value.choice.map((choice) => {
                                                                                        return(
                                                                                            <Textarea rowSpan={2} bordered placeholder="Textarea" 
                                                                                                value={input}
                                                                                                onChangeText={text => this.TextSort(text, choice.name_id.toString())}
                                                                                            />
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                        //=============input_type_id 2=============//
                                                                        : value.question.input_type_id == 2 ? 
                                                                            <View>
                                                                                <Text style={{marginTop: 20}}>{value.question.question_name}</Text>
                                                                                { 
                                                                                 value.choice.map((choice) => {
                                                                                    radio_props.push({label: choice.text, value: choice.val })
                                                                                    })
                                                                                }
                                                                                <View style={{flex:1 , flexDirection: 'row'}}>
                                                                                    <View style={{flex:1}}>
                                                                                        <RadioButtonRN
                                                                                                data={radio_props}
                                                                                                // initial={radio}
                                                                                                selectedBtn={(e) => this.Single_choice(e)}
                                                                                        />
                                                                                    </View>
                                                                                    {/* <View style={{flex:1}}>
                                                                                             {
                                                                                                choice.other == 'specify' ?
                                                                                                    <Item regular>
                                                                                                        <Input placeholder='Regular Textbox' />
                                                                                                    </Item>
                                                                                                :
                                                                                                <View/>
                                                                                            }                      
                                                                                    </View> */}
                                                                                </View>
                                                                                
                                                                            </View>
                                                                        //=============input_type_id 3=============//
                                                                        : value.question.input_type_id == 3 ? 
                                                                            <View>  
                                                                                <Text style={{marginTop: 20}}>{value.question.question_name}</Text>
                                                                                { 
                                                                                 value.choice.map((choice) => {
                                                                                     return(
                                                                                        <View style={{flex:1 , flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                                                            <View style={{flex:1}}>
                                                                                                <CheckBox
                                                                                                    title={choice.text}
                                                                                                    checked={this.isItemChecked(choice.val)}
                                                                                                    onPress={evt => this.manageToggle(evt, choice.val )}
                                                                                                />
                                                                                            </View>
                                                                                            {/* <View style={{flex:1}}>
                                                                                                {
                                                                                                        choice.other == 'specify' ?
                                                                                                        <Item regular style={{height: 45}}>
                                                                                                            <Input placeholder='other' />
                                                                                                        </Item>
                                                                                                        :
                                                                                                        <View/>
                                                                                                }
                                                                                            
                                                                                            </View> */}
                                                                                        </View>
                                                                                     )
                                                                                    })
                                                                                }
                                                                                
                                                                            </View>
                                                                        //=============input_type_id 4=============//
                                                                        : value.question.input_type_id == 4 ? 
                                                                            <View style={{marginTop: 20, borderWidth: 1, borderColor: '#bfbfbf'}}>
                                                                                <Text style={{alignSelf: 'center', marginBottom: 10, marginTop: 10}}>{value.question.question_name}</Text>
                                                                                <View style={{width: '100%' ,height: 1, backgroundColor: '#bfbfbf', marginBottom: 5}}/>
                                                                                { value.data_ques_sub.map((value_sub, id) => (
                                                                                    <View key={id}>
                                                                                        <Text style={{marginLeft: 7, marginBottom: 5}}>{id+1}. {value_sub.sub_ques.option_choice_name}</Text>
                                                                                        <View>
                                                                                            <FlatList
                                                                                                data={Object.keys([...Array(value.question.question_range).keys()])}
                                                                                                scrollEnabled={false}
                                                                                                inverted
                                                                                                horizontal
                                                                                                keyExtractor={(item) => item}
                                                                                                contentContainerStyle={{
                                                                                                flexGrow: 1,
                                                                                                justifyContent: "space-between",
                                                                                                }}
                                                                                                renderItem={({ item }) => (
                                                                                                <View
                                                                                                    style={styles.row}
                                                                                                >
                                                                                                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                                                                                                        <View>
                                                                                                            <Text style={styles.text_normal}>{Number(item) + 1}</Text>
                                                                                                        </View>
                                                                                                        <View>
                                                                                                            <RadioButton
                                                                                                            value={Number(item) + 1}
                                                                                                            status={
                                                                                                                contentment[value_sub.sub_ques.option_choice_id]?.value ==
                                                                                                                Number(item) + 1
                                                                                                                ? "checked"
                                                                                                                : "unchecked"
                                                                                                            }
                                                                                                            onPress={() =>
                                                                                                                this.handleSurvey(
                                                                                                                value_sub.sub_ques.option_choice_id,
                                                                                                                Number(item) + 1,
                                                                                                                )
                                                                                                            }
                                                                                                            />
                                                                                                        </View>
                                                                                                    
                                                                                                    </View>
                                                                                                    
                                                                                                </View>
                                                                                                )}
                                                                                            />
                                                                                        </View>
                                                                                    </View>
                                                                                    ))
                                                                                }
                                                                            </View>
                                                                        //=============input_type_id 5=============//
                                                                        : value.question.input_type_id == 5 ? 
                                                                            <View>
                                                                                <Text style={{marginTop: 20}}>{value.question.question_name}</Text>
                                                                                {
                                                                                value.choice.map((choice) => {
                                                                                        return(
                                                                                            <Textarea rowSpan={5} bordered placeholder="Textarea" 
                                                                                                // value={text}
                                                                                                onChangeText={txt => this.TextLong(txt, choice.name_id.toString())}
                                                                                            />
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                        :
                                                                        <View/>
                                                                    }
                                                                  
                                                                </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                   </View>
                                   :
                                   <View/>
                                }

                                <Button style={{alignSelf: 'center', padding: 10, marginTop: 20, borderRadius: 10, backgroundColor: '#1a8cff'}}
                                    onPress={this.onPressSubmit}
                                >
                                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                                        {this.state.lang === "EN" ? "Save" : "บันทึก"}
                                    </Text>
                                </Button>
                            </View>
                            :
                            <View/>
                        }
                        
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#F3F5F9",
    },
    text_normal: {
      color: "#334356",
      fontSize: 14,

    //   flex: 1,
    },
    text_bold: {
      color: "#334356",
      fontSize: 20,
      flex: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    quesBox: {
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginVertical: 5,
    },
    textArea: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
    },
    saveBtn: {
      backgroundColor: "#449d44",
      flex: 1,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
  });

  export default function(props) {
    const navigation = useNavigation();
    return <QQuestAns_course {...props} navigation={navigation} />;
  }
  
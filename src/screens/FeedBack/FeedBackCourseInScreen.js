import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, AsyncStorage, ActivityIndicator, SafeAreaView } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import PeopleIcon from "react-native-vector-icons/Ionicons"
import { DataTable } from "react-native-paper"
import ArrowDownIcon from "react-native-vector-icons/AntDesign"
import { Dimensions } from "react-native"
import {Accordion, Button} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import {httpClient} from '../../core/HttpClient';
import Modal_FeedBack from './Modal_FeedBack';

const HEIGHT = Dimensions.get("window").height
const FeedBackCourseInScreen = (props) => {
    let title = props.route.params.title
    const [lang, setLang] = useState('TH');
    const [dataArray, setDataArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const run = async () => {
           getData()
          };
        run();
        
      }, []);

    
    const getData = async() => {
      try {
        setLoading(true)
        let getLang = await AsyncStorage.getItem('language');
        let user_id = await AsyncStorage.getItem('userId');
        setLang(getLang)
        if(getLang == "EN"){
          var lang_id = '1'
        }else{
          var lang_id = '2'
        }

        httpClient
        .get(`/FeedBack/getFeedBackCourseIn/${user_id}/${lang_id}`)
        .then(response => {
            let res = response.data;
            if (res != null) {
              setDataArray(res)
              setLoading(false)
            }else{
              setLoading(false)
            }
        })
        .catch(error => {
            console.log(error);
      });


      } catch (e) {
        console.log(e)
      }
    }
    

    const showModal = (course_id) => {
      setCourseId(course_id)
      setModalVisible(true)
    }

    const _closeModal = () =>{
      setModalVisible(false)
      setCourseId(null)
      getData()
    }

    if (loading) {
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      );
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
           {
             courseId ? 
              <Modal_FeedBack courseId={courseId} chkVisible={modalVisible} closeModal={_closeModal} />
             :
              null
           }
            
            <View style={styles.container}>
                <Text style={styles.textHeader}>{title}</Text>

              {
              dataArray ? 
                dataArray.map((data) => {
                  return(
                    
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', width: '100%', height: 50, borderWidth: 1, borderColor: '#e6e6e6' }}>
                      <View style={{flex: 1, marginLeft: 10}}> 
                        <Text style={{fontSize: 14}}>
                          {data.course_name}
                        </Text>
                      </View>
                      <View style={{flex: 0.4}}> 
                      {
                        data.feedback_show_button ?
                        <Button 
                        onPress={() => showModal(data.course_id)}
                        style={{height: 30, backgroundColor: '#3399ff'}}
                        >
                            <Text style={{marginLeft: 5, marginRight: 5, color: '#fff'}}>
                                FeedBack
                            </Text>
                            {
                              data.num_alert != null ?
                              <View style={{width: 15,
                                height: 15,
                                borderRadius: 100 / 2,
                                backgroundColor: "red",
                                marginRight: 4,
                                marginLeft: -2,
                                marginTop: -10,
                                alignItems: 'center',
                                justifyContent: 'center'}}>
                              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                                {data.num_alert}
                              </Text>
                            </View>
                            :
                              null
                            }
                          
                        </Button>
                        :
                        <Button disabled style={{height: 30, backgroundColor: '#b3e0ff'}}>
                            <Text style={{marginLeft: 5, marginRight: 5, color: '#fff'}}>
                                FeedBack
                            </Text>
                        </Button>
                      }
                      </View>
                    </View>
                  )
                })
                :
                null
              }

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
        marginVertical: 15,
    },
    textHeader: {
        color: "#398DDD",
        alignSelf: "center",
        fontSize: 18,
        marginVertical: 20,
    },
    textNumber: {
        fontWeight: "bold",
        fontSize: 14,
    },
})

export default FeedBackCourseInScreen

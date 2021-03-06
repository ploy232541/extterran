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
import ModalFeedBack from './ModalFeedBack';
import { Badge } from "react-native-elements";

const HEIGHT = Dimensions.get("window").height
const StaffCourseInScreen = (props) => {
    let title = props.route.params.title
    const [lang, setLang] = useState('TH');
    const [dataArray, setDataArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [userId, setUserId] = useState(null);
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
if (!dataArray.length>0) {
   httpClient
        .get(`/Team/getTeamCourseIn/${user_id}/${lang_id}`)
        .then(response => {
            let res = response.data;
            // console.log(response.data);
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
}
       


      } catch (e) {
        console.log(e)
      }
    }
    

    const showModal = (user_id) => {
      setUserId(user_id)
      setModalVisible(true)
    }

    const _renderHeader = (item, expanded) => {
        return (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "black",
              borderRadius: 4,
              marginBottom:2,
              marginTop:2,
            }}>
            <Icon2 style={{color: '#cccccc'}} size={20} name="user" />
            <Text style={{flex: 1, marginLeft: 5, color: '#000'}}>
              {/* {item.user_id}  :  */}

              {item.fullname}
            </Text>
            <View style={{ justifyContent: "flex-end", marginRight: 10 }}>
              {
                // item.feedback_show_button ?
                item.num_alert != null ?

                <Button 
                onPress={() => showModal(item.user_id)}
                style={{height: 30, backgroundColor: '#3399ff'}}
                
                >
                  
                    <Text style={{marginLeft: 5, marginRight: 5, color: '#fff'}}>
                        FeedBack
                    </Text>
                    {item.num_alert > 0 && (
          <Badge
            value={item.num_alert}
            status="error"
            containerStyle={{
              position: "absolute",
              top: -10,
              right: -4
            }}
          />
        )}
                    {/* {
                       item.num_alert != null ?
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
                        {item.num_alert}
                      </Text>
                     </View>
                     :
                      null
                    } */}
                   
                </Button>
                :       
                
                // <Button   disable={true} color="secondary"
                // style={{height: 30}}
                // >
                //     <Text style={{marginLeft: 5, marginRight: 5, color: '#CCCCCC'}}>
                //         FeedBack
                //     </Text>
                // </Button>
                // :
                <Button disabled style={{height: 30, backgroundColor: '#b3e0ff'}}>
                    <Text style={{marginLeft: 5, marginRight: 5, color: '#fff'}}>
                        FeedBack
                    </Text>
                </Button>
              }
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              {expanded ? (
                <Icon style={{fontSize: 16, color: '#010c65'}} name="up" />
              ) : (
                <Icon style={{fontSize: 16, color: '#010c65'}} name="down" />
              )}
            </View>
          </View>
        );
      }

      const _renderContent = item => {
                  console.log(item.course);

        return (
          <View style={{flex: 1}}>
            {item.course.length > 0 ?
                item.course.map((data) =>{
                  let status,color;
                  if(data.status_popup_regis == 1){
                    status = "?????????????????????????????????";
                    color = "red";
                  }else if(data.status_popup_regis == 2){
                    status = "??????????????????????????????";
                    color = "#1E90FF";
                  }else if(data.status_popup_regis == 3){
                    status = "???????????????????????????";
                    color = "green";
                  }

                  return (
                    <View
                    style={{
                      backgroundColor: 'White',
                      flexDirection: 'row'
                    }}>
                    <View style={{flex: 1,flexDirection: 'row', padding: 10, alignItems: 'center'}}>
                      <Icon2 style={{color: '#cccccc'}} size={20} name="book" />
                      <Text style={{marginLeft: 5}}>
                        {data.course_title}
                      </Text>
                    </View>
                    <View style={{flex: 0.4,padding: 10, alignItems: 'flex-end', }}>
                        <Text style={{color: color}}>{status}</Text>
                    </View>
                  </View>
                  )
                })
            :
            <View style={{alignSelf: 'center', padding: 10}}>
               <Text>{lang == "EN" ? 'No data' : '?????????????????????????????????'}</Text>
            </View>
            }
          </View>
        );
      };


    const _closeModal = () =>{
      setModalVisible(false)
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
      <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
    >
        {/* <ScrollView style={{ flex: 1, backgroundColor: "white" }}> */}
           {
             userId ? 
              <ModalFeedBack userId={userId} chkVisible={modalVisible} closeModal={_closeModal} />
             :
              null
           }
            
            <View style={styles.container}>
                <Text style={styles.textHeader}>{title}</Text>

                <View style={{ flexDirection: "row", marginVertical: 20 }}>
                    <PeopleIcon
                        name='md-people'
                        size={20}
                        style={{ marginRight: 10 }}
                    />
                    <Text style={styles.textNumber}>
                        ??????????????? <Text style={{ color: "#398DDD" }}>{dataArray.length}</Text> ??????
                    </Text>
                </View>

                <Accordion
                  dataArray={dataArray}
                  animation={true}
                  expanded={true}
                  renderHeader={_renderHeader}
                  renderContent={_renderContent}
                />

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
        marginVertical: 18,
    },
    textHeader: {
      color: "#398DDD",
      alignSelf: "center",
      fontSize: 24,
      fontWeight: "bold"
    },
    textNumber: {
        fontWeight: "bold",
        fontSize: 14,
    },
})

export default StaffCourseInScreen

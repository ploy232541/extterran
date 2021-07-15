import React, { Component } from 'react'
import { View, StyleSheet, AsyncStorage, Linking } from 'react-native'
import Modal from "react-native-modal";
import {
    Text,
    Searchbar,
    Card,
    Button,
    Divider,
    ProgressBar,
  } from "react-native-paper";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';

class WrapperComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
       }
     }

     async componentDidMount() {
        let getLang = await AsyncStorage.getItem('language');
        this.setState({lang: getLang})
    }

    async PrintCertificate(course_id){
        let user_id = await AsyncStorage.getItem('userId');
        // Linking.openURL(`http://localhost/lms_exterran/CourseApiMobile/PrintCertificate?user_id=${user_id}&course_id=${course_id}&lang_id=${1}`)
        Linking.openURL(`http://smartxlearning.com/CourseApiMobile/PrintCertificate?user_id=${user_id}&course_id=${course_id}&lang_id=${1}`)
      }

    render() {
        const { navigation } = this.props;
        const {lang} = this.state
        const {item, type} = this.props.route.params;
        return (
            <>
            {
                type == '1' ? 
                    <View style={{flex: 1,backgroundColor: '#fff', padding: 20}}>
                        <Text style={{textAlign: 'center',fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginRight: 20, marginBottom: 10}}>
                            {item.course_title}
                        </Text>
                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Status' : 'สถานะ'}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.containerpercent}>
                                    <View style={[styles.inner, {width: `${item.percent_course}%`}]}/>
                            </View>
                            <View style={{marginLeft: 5}}>
                                <Text>{item.percent_course}%</Text>
                            </View>
                        </View>
                        
                        </View>
                        <Divider />
                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Exam status' : 'สถานะการสอบทฤษฎี'}</Text>
                            {
                               item.status_final == 'Pass' ?
                                <Text style={{ color: "#28A745", fontSize: 16 }}>{lang == 'EN' ? 'Pass' : 'สอบผ่าน'}</Text>
                               :item.status_final == 'Fail' ?
                                <Text style={{ color: "red", fontSize: 16 }}>{lang == 'EN' ? 'Fail' : 'สอบไม่ผ่าน'}</Text>
                               :
                                <Text style={{ color: "#000", fontSize: 16 }}>{item.status_final}</Text>
                            }
                        </View>
                        <Divider />
                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Workshop status' : 'สถานะการสอบปฏิบัติ'}</Text>
                            {
                               item.status_workshop == 'Pass' ?
                                <Text style={{ color: "#28A745", fontSize: 16 }}>{lang == 'EN' ? 'Pass' : 'สอบผ่าน'}</Text>
                               :item.status_workshop == 'Fail' ?
                                <Text style={{ color: "red", fontSize: 16 }}>{lang == 'EN' ? 'Wait for the practice exam' : 'รอสอบปฏิบัติ'}</Text>
                               :
                                <Text style={{ color: "#000", fontSize: 16 }}>{item.status_workshop}</Text>
                            }
                        </View>
                        <Divider />

                        {
                            item.printCer != null ?
                            <View style={styles.list}>
                                <Text style={styles.contentTitle}>{lang == 'EN' ? 'Certificate' : 'ใบประกาศนียบัตร'}</Text>
                                <Button mode="contained" color="#F0AD4E"
                                onPress={() =>this.PrintCertificate(item.printCer)}
                                >
                                {lang == 'EN' ? 'Print' : 'พิมพ์ประกาศนียบัตร'}
                                </Button>
                            </View>
                            :
                            <View/>
                        }

                        {
                            item.click_to_course != null ?
                            <View style={styles.list}>
                                <View style={{flexDirection: 'row'}}>
                                    <Icons style={{marginTop: 2, marginRight: 2}} size={18} name="settings" />
                                    <Text style={styles.contentTitle}>
                                    {lang == 'EN' ? 'Manage' : 'จัดการ'}
                                    </Text>
                                </View>
                                <Button mode="contained" color="#337AB7"
                                onPress={() => navigation.navigate('LearnScreen', {course_id: item.click_to_course})}
                                >
                                {lang == 'EN' ? 'To course' : 'ไปยังหลักสูตร'}
                                </Button>
                            </View>
                            :
                            null
                        }
                </View>
                : type == '3' ? 
                    <View style={{flex: 1,backgroundColor: '#fff', padding: 20}}>
                        <Text style={{textAlign: 'center',fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginRight: 20, marginBottom: 10}}>
                            {item.course_title}
                        </Text>

                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Date' : 'วันที่ทำรายการ'}</Text>
                            <Text style={{ color: "#000", fontSize: 16 }}>{moment(item.created_date).format('DD/MM/YYYY  h:mm:ss')}</Text>
                        </View>
                        <Divider />
                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Status' : 'สถานะ'}</Text>
                            <Text style={{ color: "#000", fontSize: 16 }}>{item.status_train}</Text>
                        </View>
                        <Divider />
                   </View>
                : type == '5' ? 
                    <View style={{flex: 1,backgroundColor: '#fff', padding: 20}}>
                        <Text style={{textAlign: 'center',fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginRight: 20, marginBottom: 10}}>
                            {item.course_title}
                        </Text>
                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Status' : 'สถานะ'}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.containerpercent}>
                                    <View style={[styles.inner, {width: `${item.percent_course}%`}]}/>
                            </View>
                            <View style={{marginLeft: 5}}>
                                <Text>{item.percent_course}%</Text>
                            </View>
                        </View>
                        
                        </View>
                        <Divider />
                        <View style={styles.list}>
                            <Text style={styles.contentTitle}>{lang == 'EN' ? 'Exam status' : 'สถานะการสอบทฤษฎี'}</Text>
                            {
                               item.status_final == 'Pass' ?
                                <Text style={{ color: "#28A745", fontSize: 16 }}>{lang == 'EN' ? 'Pass' : 'สอบผ่าน'}</Text>
                               :item.status_final == 'Fail' ?
                                <Text style={{ color: "red", fontSize: 16 }}>{lang == 'EN' ? 'Fail' : 'สอบไม่ผ่าน'}</Text>
                               :
                                <Text style={{ color: "#000", fontSize: 16 }}>{item.status_final}</Text>
                            }
                        </View>
                        <Divider />

                        {
                            item.printCer != null ?
                            <View style={styles.list}>
                                <Text style={styles.contentTitle}>{lang == 'EN' ? 'Certificate' : 'ใบประกาศนียบัตร'}</Text>
                                <Button mode="contained" color="#F0AD4E"
                                onPress={() =>this.PrintCertificate(item.printCer)}
                                >
                                {lang == 'EN' ? 'Print' : 'พิมพ์ประกาศนียบัตร'}
                                </Button>
                            </View>
                            :
                            <View/>
                        }

                        <View style={styles.list}>
                            <View style={{flexDirection: 'row'}}>
                                <Icons style={{marginTop: 2, marginRight: 2}} size={18} name="settings" />
                                <Text style={styles.contentTitle}>
                                {lang == 'EN' ? 'Manage' : 'จัดการ'}
                                </Text>
                            </View>
                            <Button mode="contained" color="#337AB7"
                            onPress={() => navigation.navigate('LearnScreen', {course_id: item.click_to_course})}
                            >
                            {lang == 'EN' ? 'To course' : 'ไปยังหลักสูตร'}
                            </Button>
                        </View>
                    </View>
                :
                null
            }
          
            </>
       
       )
    }
}

const styles = StyleSheet.create({
    containerpercent: {
        width: '90%',
        height: 15,
        backgroundColor: '#cccccc',
        borderRadius: 5,
        justifyContent: 'center',
      },
    inner: {
        width: '100%',
        height: 13,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    root: {
      backgroundColor: "#fff",
    },
    container: { flex: 1, marginHorizontal: 10, marginVertical: 15 },
    headline: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
      color: "#398DDD",
      marginTop: 30,
    },
    searchbar: { marginVertical: 20 },
    view: {
    //   justifyContent: "flex-end",
      margin: 0,
    },
    content: {
      backgroundColor: "white",
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    contentTitle: {
      fontSize: 16,
      marginBottom: 12,
    },
    list: {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      padding: 16,
    },
  });

export default function(props) {
    const navigation = useNavigation();
    return <WrapperComponent {...props} navigation={navigation} />;
}

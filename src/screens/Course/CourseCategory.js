import React, {useEffect, useState} from 'react';
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Button, Title, Card } from "react-native-paper"
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage, Alert} from "react-native"
import ButtonCard from "../../shared/ButtonCard"
import { Dimensions } from "react-native"
import {httpClient} from '../../core/HttpClient';
import { useNavigation } from "@react-navigation/native"
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { AntDesign } from '@expo/vector-icons';

const HEIGHT = Dimensions.get('window').height;
function CourseCategory({route}) {
    const navigation = useNavigation();
    const [lang, setLang] = useState('');
    const [myProgramData, setMyProgramData] = useState('');
    const [visible, setVisible] = useState(false);
    const [icon, setIcon] = useState('');
    const [backgroundColorIcon, setBackgroundColorIcon] = useState('');
    const [content, setContent] = useState('');
    useEffect(() => {
        const run = async () => {
            try {
              let getLang = await AsyncStorage.getItem('language');
              let user_id = await AsyncStorage.getItem('userId');
              setLang(getLang)
              if (getLang === 'EN') {
                var lang_id = '1';
              } else {
                var lang_id = '2';
              }

              const { type } = route.params;

              httpClient
                .get(`/CourseOnline/getCategoryCourse/${user_id}/${lang_id}/${type}`)
                .then(response => {
                    let res = response.data;
                    if (res != null) {
                        setMyProgramData(res)
                    }
                })
                .catch(error => {
                    console.log(error);
              });

            } catch (e) {
              console.log(e)
            }
          };
        run();
        
      }, []);

    const formatDataList = (dataList, numberColumns) => {
        const totalRows = Math.floor(dataList.length / numberColumns)
        let totalLastRow = dataList.length - totalRows * numberColumns

        while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
            dataList.push({ id: "blank", empty: true })
            totalLastRow++
        }
        return dataList
    }

    const AlertError = () => {
        setVisible(true)
        setIcon('close')
        setBackgroundColorIcon('red')
        setContent(lang == 'EN' ? 'Not eligible.' : 'ไม่มีสิทธิ์')
    }

    const renderButtonCard = ({ item }) => {
        if (item.empty) {
            return (
                <View
                    style={{
                        flex: 1,
                        marginVertical: 5,
                        marginHorizontal: 5,
                        backgroundColor: "transparent",
                    }}></View>
            )
        }

        return (
            <View style={styles.buttonCard}>
                {
                    item.type == '1' ? 
                        <TouchableOpacity 
                        onPress={() => navigation.navigate("CousreScreenDetail", {cate_id: item.cate_id, title: item.cate_title, type: item.type})}
                        >
                        <Card>
                            <Card.Cover style={styles.imageStyle} source={{ uri: item.cate_image != null ? item.cate_image : 'http://smartxlearning.com/themes/template/img/book.png' }} />
                            <Card.Actions style={{alignSelf: 'center'}}>
                                    <Button>{item.cate_title}</Button>
                            </Card.Actions>
                        </Card>
                        </TouchableOpacity>
                    : item.type == '3' ? 
                        item.alert == 'ไม่มีสิทธิ์' ?
                        <TouchableOpacity 
                        onPress={AlertError}
                        >
                        <Card>
                            <Card.Cover style={styles.imageStyle} source={{ uri: item.cate_image != null ? item.cate_image : 'http://smartxlearning.com/themes/template/img/book.png' }} />
                            <Card.Actions style={{alignSelf: 'center'}}>
                                    <Button>{item.cate_title}</Button>
                            </Card.Actions>
                        </Card>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity 
                        onPress={() => navigation.navigate('CourseScreenDetailOut', {course_id: item.course_id, title: item.cate_title, type: item.type})}
                        >
                        <Card>
                            <Card.Cover style={styles.imageStyle} source={{ uri: item.cate_image != null ? item.cate_image : 'http://smartxlearning.com/themes/template/img/book.png' }} />
                            <Card.Actions style={{alignSelf: 'center'}}>
                                    <Button>{item.cate_title}</Button>
                            </Card.Actions>
                        </Card>
                        </TouchableOpacity>
                    : item.type == '5' ? 
                        <TouchableOpacity 
                        onPress={() => navigation.navigate("CousreScreenDetail", {cate_id: item.cate_id, title: item.cate_title, type: item.type})}
                        >
                        <Card>
                            <Card.Cover style={styles.imageStyle} source={{ uri: item.cate_image != null ? item.cate_image : 'http://smartxlearning.com/themes/template/img/book.png' }} />
                            <Card.Actions style={{alignSelf: 'center'}}>
                                    <Button>{item.cate_title}</Button>
                            </Card.Actions>
                        </Card>
                        </TouchableOpacity>
                    :
                    null

                }
              
            </View>
        )
    }

    const numberColumns = 2

    return (
        // <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ flex: 1, backgroundColor: "white" }}
                  >
          {/* <TouchableOpacity disabled style={{borderRadius: 5,width:'40%', alignSelf:'center', alignItems:'center', height:HEIGHT*0.05, justifyContent:'center', backgroundColor:'#3b5998', marginVertical:20}}>
            <Text style={{color:'white', fontSize: 16}}>{lang == "EN" ? 'Course category' : 'หมวดหมู่หลักสูตร5555'}</Text>
         </TouchableOpacity> */}

          <View style={styles.container_title}>
                        <View style={styles.line} />
                        <Text style={styles.title}>{lang == "EN" ? 'Course category' : 'หมวดหมู่หลักสูตร'}</Text>
                        <View style={styles.line} />
                    </View>

            <View>
                <FlatList
                    data={formatDataList(myProgramData, numberColumns)}
                    renderItem={renderButtonCard}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={numberColumns}
                />
            </View>
            <FancyAlert
                visible={visible}
                icon={<View style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColorIcon,
                borderRadius: 50,
                width: '100%',
                }}>
                <AntDesign
                name={icon}
                size={36}
                color="#FFFFFF"
                />
                </View>}
                style={{ backgroundColor: 'white' }}
            >
                <View style={styles.content}>
                <Text style={styles.contentText}>{content}</Text>
            
                <TouchableOpacity style={styles.btn} onPress={()=> setVisible(false)}>
                    <Text style={styles.btnText}>{lang == 'EN' ? 'OK' : 'ตกลง'}</Text>
                </TouchableOpacity>
                </View>
            </FancyAlert>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    buttonCard: {
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1,
    },
    imageStyle: {
        height: HEIGHT / 6,
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
    container_title: {
        marginHorizontal: 24,
        flexDirection: "row",
        marginVertical:24,
    },
    line: {
        backgroundColor: "#0097fc",
        height: 2,
        flex: 1,
        alignSelf: "center",
    },
    title: {
        fontSize: 24,
        paddingHorizontal: 5,
        fontWeight: "bold",
        justifyContent: "center"
    },
})

export default CourseCategory

import React, {useEffect, useState} from 'react';
import { Card, Text, Paragraph } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Alert, Platform, AsyncStorage } from "react-native";
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { AntDesign } from '@expo/vector-icons';
import { render } from "react-dom";
import { useNavigation } from "@react-navigation/native"

const HEIGHT = Dimensions.get("window").height;

const MyProgramCard = (props) => {
  const navigation = useNavigation()
  const [lang, setLang] = useState('');
  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState('');
  const [backgroundColorIcon, setBackgroundColorIcon] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const run = async () => {
          let getLang = await AsyncStorage.getItem('language');
          setLang(getLang)
      };
    run();
  }, []);


  const checkCourse = (data) => {
    if(data.alert != ''){
      if(data.alert == 'คุณผ่านบทเรียนนี้แล้ว'){
        setVisible(true)
        setIcon('close')
        setBackgroundColorIcon('red')
        setContent(lang == 'EN' ? 'You have passed this lesson.' : 'คุณผ่านบทเรียนนี้แล้ว')
      }else if(data.alert == 'ไม่มีสิทธิ์เรียนหลักสูตร ต้องผ่านหลักสูตรก่อนหน้า'){
        setVisible(true)
        setIcon('close')
        setBackgroundColorIcon('red')
        setContent(lang == 'EN' ? 'Not eligible for courses. Must have passed the previous course.' : 'ไม่มีสิทธิ์เรียนหลักสูตร ต้องผ่านหลักสูตรก่อนหน้า')
      }else if(data.alert == 'หลักสูตรหมดอายุ'){
        setVisible(true)
        setIcon('close')
        setBackgroundColorIcon('red')
        setContent(lang == 'EN' ? 'Time out learn.' : 'หลักสูตรหมดอายุ')
      }else if(data.alert == 'หลักสูตรยังไม่เปิด'){
        setVisible(true)
        setIcon('close')
        setBackgroundColorIcon('red')
        setContent(lang == 'EN' ? 'Course not yet open.' : 'หลักสูตรยังไม่เปิด')
      }
    }else{
      navigation.navigate('LearnScreen', {course_id: data.course_id})
    }
  }
 
  return (
    <TouchableOpacity
    onPress={() => checkCourse(props.item)}
    >
      <Card style={{width: 200 ,marginBottom: 2, marginRight: 20, borderRadius: 5}}>
        <Image
          resizeMode={'stretch'}
          style={styles.imageStyle}
          source={{ uri: props.item.course_picture != null ? props.item.course_picture : 'http://smartxlearning.com/themes/template/img/book.png' }}
        />
        <Card.Content style={{ paddingTop: 6 }}>
          <Text numberOfLines={1} style={styles.titleStyle}>{props.item.course_title}</Text>
          <Paragraph numberOfLines={1} style={styles.contentStyle}>{props.item.course_short_title}</Paragraph>
        </Card.Content>
      </Card>

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

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 14,
    color: "#0097fc",
  },
  contentStyle: {
    fontSize: 11,
  },
  imageStyle: {
    height: HEIGHT / 6,
    borderRadius: 5
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

export default MyProgramCard;

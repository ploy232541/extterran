import React, { useState, useEffect } from 'react'
import { Dimensions } from "react-native";
import {View, Text, StyleSheet, FlatList, AsyncStorage} from 'react-native'
import StaffCard from '../../components/StaffCard'

const HEIGHT = Dimensions.get('window').height
function StaffScreen() {
  const [lang, setLang] = useState('TH');

  useEffect(() => {
    const run = async () => {
        try {
          let getLang = await AsyncStorage.getItem('language');
          setLang(getLang)
        } catch (e) {
          console.log(e)
        }
      };
    run();
    
  }, []);

  let staffData = [
    {
      id:1,
      title:'หลักสูตรบังคับภายใน',
      //imgSrc: 'https://source.unsplash.com/1024x768/?nature',
      icon: "chalkboard-teacher",
      to:'StaffCourseInScreen'
    },
    {
      id:2,
      title:'หลักสูตรทั่วไป',
      //imgSrc: 'https://source.unsplash.com/1024x768/?nature',
      icon: "chalkboard",
      to:'StaffCourseGeneralScreen'
    },
    {
      id:3,
      title: lang == "EN" ? "Training Request" : "การอนุมัติขอร้องคำฝึก",
      //imgSrc: 'https://source.unsplash.com/1024x768/?nature',
      icon: "clipboard-check",
      to:'ConfirmTrainingScreen'
    },
    {
      id:4,
      title: lang == "EN" ? "Booking" : "Booking",
      //imgSrc: 'https://source.unsplash.com/1024x768/?nature',
      icon: "bookmark",
      to:'ConfirmBookingScreen'
    },
    {
      id:5,
      title: lang == "EN" ? "Timesheet" : "Timesheet",
      //imgSrc: 'https://source.unsplash.com/1024x768/?nature',
      icon: "table",
      to:'ConfirmBookingScreen'
    }
  ]

  const formatDataList = (dataList, numberColumns) => {
    const totalRows = Math.floor(dataList.length / numberColumns)
    let totalLastRow = dataList.length - totalRows * numberColumns

    while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
        dataList.push({ id: "blank", empty: true })
        totalLastRow++
    }
    return dataList
}

const renderProgramCard = ({ item }) => {
    if (item.empty) {
      return (
          <View
              style={{
                  flex: 1,
                  margin: 12,
                  // marginVertical: 5,
                  // marginHorizontal: 5,
                  backgroundColor: "transparent",
              }}></View>
      )
    }
    return (
        // <View style={{width:'50%', margin:5, flex:1}}>
        <View style={{flex: 1, marginTop: 12 , marginBottom: 12, marginStart: 12, marginEnd: 12,}}>
        <StaffCard
            title={item.title}
            imgSrc={item.imgSrc}
            to={item.to}
            icon={item.icon}
        />
        </View>
    )
}

const numberColumns = 2
  return (
    <View style={styles.container}>
            <FlatList
            data={formatDataList(staffData,numberColumns)}
            renderItem={renderProgramCard}
            numColumns={2}
             />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    // marginHorizontal:18,
    marginTop: 15
  }
})

export default StaffScreen;


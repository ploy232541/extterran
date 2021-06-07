import React, { useState, useEffect } from 'react'
import { Dimensions } from "react-native";
import {View, Text, StyleSheet, FlatList, AsyncStorage} from 'react-native'
import StaffCard from '../../components/StaffCard'

const HEIGHT = Dimensions.get('window').height
function FeedBackScreen() {
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
      icon: "chalkboard-teacher",
      to:'FeedBackCourseInScreen'
    },
    {
      id:2,
      title:'หลักสูตรทั่วไป',
      icon: "chalkboard",
      to:'FeedBackCourseGeneralScreen'
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
                  marginVertical: 5,
                  marginHorizontal: 5,
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
    //marginHorizontal:18,
    marginTop: 15
  }
})

export default FeedBackScreen;


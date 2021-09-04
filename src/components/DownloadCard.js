import React, {useEffect, useState} from 'react';
import { Card } from "react-native-paper"
import { View, StyleSheet, Text, FlatList, AsyncStorage, TouchableOpacity, Alert } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import {httpClient} from '../core/HttpClient';
import moment from 'moment';
import { downloadFIle } from "../utils/file";

const DownloadCard = ({ item }) => {
  const [lang, setLang] = useState('');
  const [dataList, setDataList] = useState([]);
  useEffect(() => {
      const run = async () => {
          try {
            let getLang = await AsyncStorage.getItem('language');
            setLang(getLang)
            if (getLang === 'EN') {
              var lang_id = '1';
            } else {
              var lang_id = '2';
            }

            httpClient
              .post(`/Document/DetailDocument`, {dty_id: item.dty_id, lang_id: lang_id})
              .then(response => {
                  let res = response.data;
                  if (res != null) {
                    setDataList(res)
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

    const renderDownloadCard = ({item}) =>{
        return (
        <View style={{flex: 1, flexDirection: "row", alignItems:'center', marginBottom: 20 }}>
            <View style={{flex: 0.6, marginRight: 5}}> 
               <Text style={{fontSize:12}}>{item.dow_name}</Text>
            </View>
            <View style={{flex: 1, flexDirection:'row', alignItems:'center'}}>
                <TouchableOpacity 
                onPress={()=> {item.dow_address?(downloadFIle(item.dow_address, item.dow_name)):Alert.alert("ไม่พบไฟล์ในฐานข้อมูล")}}
                >
                  <View style={{flex: 1, flexDirection:'row', alignItems:'center'}}>
                    <Icon name="ios-download" size={30}/><Text style={{fontSize:12, marginLeft:5}}> {lang == "EN" ? 'Download' : 'ดาวน์โหลด'}</Text>
                  </View>
                </TouchableOpacity>
                <Icon name="md-calendar" size={30} style={{marginLeft:10}}/><Text style={{fontSize:12, marginLeft:5}}>{moment(item.updatedate).format('DD/MM/YYYY')}</Text>
            </View>
        </View>
        )
      }
    return (
        <Card>
            <Card.Title title={item.dty_name} style={{ backgroundColor: "#DBDBDB"}} />
            <Card.Content style={{ marginVertical: 15 }}>
                <FlatList
                    data={dataList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderDownloadCard}
                />
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({})

export default DownloadCard

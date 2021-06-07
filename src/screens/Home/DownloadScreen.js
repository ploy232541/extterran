import React, {useEffect, useState} from 'react';
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { View, StyleSheet, AsyncStorage } from "react-native"
import DownloadCard from '../../components/DownloadCard'
import {httpClient} from '../../core/HttpClient';

function DownloadScreen() {
  const [lang, setLang] = useState('');
  const [download, setDownload] = useState([]);
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
              .get(`/Document/${lang_id}`)
              .then(response => {
                  let res = response.data;
                  if (res != null) {
                    setDownload(res)
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
        <View style={{marginHorizontal:18, marginVertical:10}}>
          <DownloadCard
            item={item}

          />
        </View>
      )
    }
    
    return (
        <ScrollView style={{flex:1, backgroundColor:'white'}}>
          <View style={styles.container}>
            <FlatList
              data={download}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderDownloadCard}
            />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal: 5,
  }
})

export default DownloadScreen;

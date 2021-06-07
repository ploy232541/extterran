import React, {useEffect, useState} from 'react';
import { Title } from "react-native-paper"
import { View, Text, StyleSheet, AsyncStorage} from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import VideoCard from '../../components/VideoCard'
import {httpClient} from '../../core/HttpClient';

function VideoListScreen() {
    const [lang, setLang] = useState('');
    const [video, setVideo] = useState([]);
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
                .get(`/Video/${lang_id}`)
                .then( async response => {
                  let res = await response.data;
                  if (res != null) {
                    setVideo(res)
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

    const renderVideoCard = ({item}) =>{
      return (
        <View>
          <VideoCard item={item}/>
        </View>
      )
    }

    return (
        <ScrollView style={{backgroundColor:'white'}}>
            <View style={styles.container}>
                <FlatList
                data={video}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderVideoCard}
                />

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:24
  }
})

export default VideoListScreen

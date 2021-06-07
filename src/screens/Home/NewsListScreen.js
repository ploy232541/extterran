import React, {useEffect, useState} from 'react';
import { Dimensions } from "react-native"
import { View, StyleSheet, AsyncStorage } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import NewsCard from "../../components/NewsCard"
import { useNavigation } from "@react-navigation/native"
import {httpClient} from '../../core/HttpClient';

function NewsListScreen() {
    const navigation = useNavigation()
    const [lang, setLang] = useState('');
    const [newsAll, setNewsAll] = useState([]);
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
                .get(`/News/NewsAll/${lang_id}`)
                .then(response => {
                    const res = response.data;
                    // console.log(res)
                    if (res != null) {
                        setNewsAll(res)
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


    // const newsData = [
    //     {
    //         id: 1,
    //         title: "Corona Infection",
    //         details:
    //             "Some quick example text to build on the card title and make up the bulk of the cards content.",
    //         imgSrc: "https://source.unsplash.com/1024x768/?nature",
    //     },
    //     {
    //         id: 2,
    //         title: "Corona Infection",
    //         details:
    //             "Some quick example text to build on the card title and make up the bulk of the cards content.",
    //         imgSrc: "https://source.unsplash.com/1024x768/?nature",
    //     },
    //     {
    //         id: 3,
    //         title: "Corona Infection",
    //         details:
    //             "Some quick example text to build on the card title and make up the bulk of the cards content.",
    //         imgSrc: "https://source.unsplash.com/1024x768/?nature",
    //     },
    //     {
    //         id: 4,
    //         title: "Corona Infection",
    //         details:
    //             "Some quick example text to build on the card title and make up the bulk of the cards content.",
    //         imgSrc: "https://source.unsplash.com/1024x768/?nature",
    //     },
    //     {
    //         id: 5,
    //         title: "Corona Infection",
    //         details:
    //             "Some quick example text to build on the card title and make up the bulk of the cards content.",
    //         imgSrc: "https://source.unsplash.com/1024x768/?nature",
    //     },
    //     {
    //         id: 6,
    //         title: "Corona Infection",
    //         details:
    //             "Some quick example text to build on the card title and make up the bulk of the cards content.",
    //         imgSrc: "https://source.unsplash.com/1024x768/?nature",
    //     },
    // ]

    const formatDataList = (dataList, numberColumns) => {
        const totalRows = Math.floor(dataList.length / numberColumns)
        let totalLastRow = dataList.length - totalRows * numberColumns
        while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
            dataList.push({ id: "blank", empty: true })
            totalLastRow++
        }
        return dataList
    }

    const renderNewsCard = ({ item }) => {
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
            <View style={styles.newsCardStyle}>
                <NewsCard
                    title={item.cms_title}
                    imgSrc={item.cms_picture}
                    short_title={item.cms_short_title}
                    details={item.cms_detail}
                    firstname={item.firstname}
                    firstname_en={item.firstname_en}
                    lang={lang}
                    link={item.cms_link}
                    date={item.update_date}
                />
            </View>
        )
    }

    const numCardColumns = 2

    return (
        <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={formatDataList(newsAll, numCardColumns)}
                    // keyExtractor={(item) => item.cms_id.toString()}
                    renderItem={renderNewsCard}
                    numColumns={numCardColumns}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
    },
    newsCardStyle: {
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1,
    },
})

export default NewsListScreen

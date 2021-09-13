import React, {Component} from 'react';
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Title, Searchbar } from "react-native-paper"
import HowtoUseCard from "../../components/HowtoUseCard"
import { View, StyleSheet, AsyncStorage, Text } from "react-native"
import {httpClient} from '../../core/HttpClient';
import {
    Container,
    Header,
    Item,
    Input,
    Icon,
    Button,
    List,
    ListItem,
  } from 'native-base';

const numberColumns = 2

class HowToUseListScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        lang: '',
        howToUse: [],
      };
      this.arrayholder = []
    }

    async componentDidMount() {
        const res = await AsyncStorage.getItem('language');
        if (res === 'EN') {
          this.setState({lang: 'EN'});
          var lang_id = '1';
        } else {
          this.setState({lang: 'TH'});
          var lang_id = '2';
        }

        httpClient
            .get(`/Usability/${lang_id}`)
            .then(response => {
                    let res = response.data;
                    if (res != null) {
                        this.setState({howToUse: res});
                        this.arrayholder = res
                    }
                })
                .catch(error => {
                    console.log(error);
                });
    }

    searchFilterFunction = text => {    
        const newData = this.arrayholder.filter(item => {      
           const itemData = `${this.state.lang === 'EN' ? item.usa_title.toUpperCase() : item.usa_title}`;
           const textData = text.toUpperCase();
           return itemData.indexOf(textData) > -1;    
        });
        
        this.setState({ howToUse: newData });  
      };

    renderHeader = () => {    
        return (    
          <Header searchBar rounded style={{backgroundColor: '#fff'}}>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder={this.state.lang === 'EN' ? 'Search' : 'ค้นหา'}
              onChangeText={text => this.searchFilterFunction(text)}
              />
            </Item>
          </Header> 
        );  
      };

    formatDataList = (dataList, numberColumns) => {
        const totalRows = Math.floor(dataList.length / numberColumns)
        let totalLastRow = dataList.length - totalRows * numberColumns

        while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
            dataList.push({ id: "blank", empty: true })
            totalLastRow++
        }
        return dataList
    }

    renderHowtoUseCard = ({ item }) => {
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
            <View style={styles.howtoUseCardStyle}>
                <HowtoUseCard
                    title={item.usa_title}
                    details={item.usa_detail}
                    imgSrc={item.usa_address}
                />
            </View>
        )
    }

    render(){
        return (
            <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: "white" }}
          >
            {/* <ScrollView style={{ backgroundColor: "white", flex: 1 }}> */}
                <View style={styles.container}>
                    <FlatList
                        data={this.formatDataList(this.state.howToUse, numberColumns)}
                        renderItem={this.renderHowtoUseCard}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={numberColumns}
                        ListHeaderComponent={this.renderHeader}
                    />
                </View>
            </ScrollView>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
    },
    howtoUseCardStyle: {
        marginVertical: 5,
        marginHorizontal: 5,
        flex: 1,
    },
})

export default function(props) {
    return <HowToUseListScreen {...props} />;
  }

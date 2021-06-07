import React, {Component} from 'react';
import { View, StyleSheet, AsyncStorage, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  Text,
  Searchbar,
  Card,
  Button,
  Divider,
  ProgressBar,
} from "react-native-paper";
import Modal from "react-native-modal";
import Icons from "react-native-vector-icons/MaterialIcons";
import { Col, Row, Grid } from "react-native-easy-grid";
import {httpClient} from '../../core/HttpClient';
import {
  Header,
  Item,
  Input,
  Icon,
  List,
  ListItem,
} from 'native-base';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import WrapperComponent from './WrapperComponent'
import { useNavigation } from "@react-navigation/native";

class LearningStatusListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      statusList: [],
      open: false,
      loading: null
   }
   this.arrayholder
 }

 async componentDidMount() {
     this.setState({loading: true})
    const {type} = this.props.route.params;
    let getLang = await AsyncStorage.getItem('language');
    let user_id = await AsyncStorage.getItem('userId');
    this.setState({lang: getLang})
    if (getLang === 'EN') {
      var lang_id = '1';
    } else {
      var lang_id = '2';
    }

    httpClient
    .get(`/Dashboard/getDashboard/${user_id}/${lang_id}/${type}`)
    .then(async response => {
      const result = response.data;
      if (result != null) {
        this.setState({statusList: result, loading: false})
        this.arrayholder = result;
      }else{
        this.setState({loading: false})
      }
    })
    .catch(error => {
      console.log(error);
    });

 }

  handleOpen(item){
    const {type} = this.props.route.params;
    const { navigation } = this.props;
    navigation.navigate('WrapperComponent', {item: item, type: type})
  };

  searchFilterFunction = text => {    
    const newData = this.arrayholder.filter(item => {      
       const itemData = `${item.course_title.toUpperCase()}`;
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;    
    });
    this.setState({statusList: newData})
  };

  renderHeader = () => {    
    return (    
      <Header searchBar rounded style={{backgroundColor: '#d9d9d9'}}>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder={this.state.lang === 'EN' ? 'Search' : 'ค้นหา'} 
          onChangeText={text => this.searchFilterFunction(text)}
          />
        </Item>
      </Header> 
    );  
  };

  _reanderItem = ({item, key}) => {
    return (
      <View>
        <ListItem 
          onPress={() => this.handleOpen(item)}
        >
            <View style={{flexDirection: 'row'}}>
              <Icon1 name="book" style={{marginRight: 10}} size={20} />
               <Text style={{flex: 1}}>{item.course_title}</Text>
              <Icon1 name="chevron-right" style={{flex: 0.0}} size={15} />
            </View>
        </ListItem>
    </View>

    );
  };

 render(){
  const {type} = this.props.route.params;
  const {lang, statusList} = this.state
  // console.log(this.state.statusList)

  if (this.state.loading) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <ScrollView style={styles.root}>
         <View style={{marginBottom: 30}}>
         {
           type == '1' ?
            <>
            <Text style={styles.headline}>{lang === 'EN' ? 'Status' : 'สถานะ'} : หลักสูตรบังคับภายใน</Text>
            {
                statusList.length > 0 ?
                  <View style={styles.container}>
                  <List style={{borderWidth: 1, borderColor: '#e6e6e6'}}>
                      <ListItem itemDivider style={{backgroundColor: '#e6e6e6'}}>
                        <Text>{lang === 'EN' ? 'Course name' : 'ชื่อหลักสูตร'}</Text>
                      </ListItem>
                        <FlatList
                            data={statusList}
                            renderItem={this._reanderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={this.renderHeader}
                          />
                  </List>
                </View>
                :
                <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 50}}>
                  <Text style={{fontSize: 16}}>{lang === 'EN' ? 'No data' : 'ไม่มีข้อมูล'}</Text>
                </View>
           }
           </>
          : type == '3' ?
            <>
            <Text style={styles.headline}>{lang === 'EN' ? 'Status' : 'สถานะ'} : หลักสูตรบังคับภายนอก</Text>
              {
                statusList.length > 0 ?
                <View style={styles.container}>
                  <List style={{borderWidth: 1, borderColor: '#e6e6e6'}}>
                      <ListItem itemDivider style={{backgroundColor: '#e6e6e6'}}>
                        <Text>{lang === 'EN' ? 'Course name' : 'ชื่อหลักสูตร'}</Text>
                      </ListItem>
                        <FlatList
                            data={statusList}
                            renderItem={this._reanderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={this.renderHeader}
                          />
                  </List>
                </View>
                :
                <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 50}}>
                  <Text style={{fontSize: 16}}>{lang === 'EN' ? 'No data' : 'ไม่มีข้อมูล'}</Text>
                </View>
              }
            </>
          : type == '5' ?
            <>
            <Text style={styles.headline}>{lang === 'EN' ? 'Status' : 'สถานะ'} : หลักสูตรทั่วไป</Text>
            {
                statusList.length > 0 ?
                <View style={styles.container}>
                  <List style={{borderWidth: 1, borderColor: '#e6e6e6'}}>
                      <ListItem itemDivider style={{backgroundColor: '#e6e6e6'}}>
                        <Text>{lang === 'EN' ? 'Course name' : 'ชื่อหลักสูตร'}</Text>
                      </ListItem>
                        <FlatList
                            data={statusList}
                            renderItem={this._reanderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={this.renderHeader}
                          />
                  </List>
                </View>
                :
                <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 50}}>
                  <Text style={{fontSize: 16}}>{lang === 'EN' ? 'No data' : 'ไม่มีข้อมูล'}</Text>
                </View>
              }
            </>
          :
          null
         }
           
        </View>
    </ScrollView>
  );
 }
};

const styles = StyleSheet.create({
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
    justifyContent: "flex-end",
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
    fontSize: 20,
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
  return <LearningStatusListScreen {...props} navigation={navigation} />;
}
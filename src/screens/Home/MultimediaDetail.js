import React, { Component } from 'react'
import { StatusBar, Text, View, SafeAreaView, AsyncStorage, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, Platform, Alert, ActivityIndicator } from 'react-native'
import {httpClient} from '../../core/HttpClient';
import Icon1 from 'react-native-vector-icons/Feather';
// import RNFetchBlob from 'rn-fetch-blob';
import {
  Header,
  Item,
  Input,
  Icon,
  Button,
  List,
  ListItem,
} from 'native-base';
import { Video } from 'expo-av';
import { downloadFIle } from "../../utils/file";
// import JWPlayer from "react-native-jw-media-player";
// import Orientation from 'react-native-orientation-locker'
// import DeviceInfo from 'react-native-device-info';

const numColumns = 1;
const WIDTH = Dimensions.get('window').width;

class MultimediaDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          docList: [],
        };
        this.arrayholder = [];
      }

      async componentDidMount() {

        try {
          this.setState({ loading: true });
          const {library_type_id, title} = this.props.route.params;
          var user_id = await AsyncStorage.getItem('userId');
          const res = await AsyncStorage.getItem('language');
          if (res === 'EN') {
            this.setState({lang: 'EN'});
          } else {
            this.setState({lang: 'TH'});
          }
    
          httpClient
          .get(`/Library/MultimediaFiles/${library_type_id}/${user_id}`)
          .then(async response => {
            const result = response.data;
            if (result != null) {
              this.setState({
                docList: result,
                loading: false,
              });
              this.arrayholder = result;
            }else{
              this.setState({
                loading: false,
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
    
        } catch (err) {
          console.log(err);
        }
      }

      renderHeader = () => {    
        return (    
        <Header searchBar rounded style={{backgroundColor: '#fff'}}>
            <Item>
            <Icon name="ios-search" />
            <Input placeholder={this.state.lang === 'EN' ? 'Search' : 'ค้นหา'} onChangeText={text => this.searchFilterFunction(text)}/>
            </Item>
        </Header> 
        );  
        };
    
        searchFilterFunction = text => {    
          const newData = this.arrayholder.filter(item => {    
          const itemData = `${this.state.lang === "EN" ? item.library_name_en : item.library_name}`;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;    
          });
      
          this.setState({ docList: newData });  
        };


      formatData = (dataList, numColumns) => {
        const totalRows = Math.floor(dataList.length / numColumns);
        let totalLastRow = dataList.length - totalRows * numColumns;
    
        while (totalLastRow !== 0 && totalLastRow !== numColumns) {
          dataList.push({key: 'blank', empty: true});
          totalLastRow++;
        }
        return dataList;
      };


      Request_Download(item){
        Alert.alert(
          this.state.lang === "EN" ? 'Confirm' : 'ยืนยันใช่ไหม',
          this.state.lang === "EN" ? 'Download' : 'ที่จะขอดาวน์โหลด',
          [
            {
              text: this.state.lang === "EN" ? 'Cancel' : 'ยกเลิก',
              style: 'cancel'
            },
            { text: this.state.lang === "EN" ? 'Ok' : 'ตกลง', onPress: async () => {

                var user_id = await AsyncStorage.getItem('userId');
                const params = {library_id: item.library_id, user_id: user_id}
                httpClient
                  .post(`/Library/UpdateMultimediaFiles/`, params)
                  .then(response => {
                    const result = response.data;
                    if (result === 'success') {
                      this.componentDidMount(); 
                    }else{
                      Alert.alert("Fail")
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });

                  }
          }
          ],
          { cancelable: false }
        )
       
      }

      Cancel_Request_Download(item){
        Alert.alert(
          this.state.lang === "EN" ? 'Confirm' : 'ยืนยันใช่ไหม',
          this.state.lang === "EN" ? 'Cancel download request' : 'ที่จะยกเลิกการขอดาวน์โหลด',
          [
            {
              text: this.state.lang === "EN" ? 'Cancel' : 'ยกเลิก',
              style: 'cancel'
            },
            { text: this.state.lang === "EN" ? 'Ok' : 'ตกลง', onPress: async () => {

                var user_id = await AsyncStorage.getItem('userId');
                const params = {library_id: item.library_id, user_id: user_id}
                httpClient
                  .post(`/Library/CancelLibraryRequest/`, params)
                  .then(response => {
                    const result = response.data;
                    if (result === 'success') {
                      this.componentDidMount(); 
                    }else{
                      Alert.alert("Fail")
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });

                  }
          }
          ],
          { cancelable: false }
        )
       
      }

      Request_New_Download(item){
        Alert.alert(
          this.state.lang === "EN" ? 'Confirm' : 'ยืนยันใช่ไหม',
          this.state.lang === "EN" ? 'Request download' : 'ที่จะขอดาวน์โหลด',
          [
            {
              text: this.state.lang === "EN" ? 'Cancel' : 'ยกเลิก',
              style: 'cancel'
            },
            { text: this.state.lang === "EN" ? 'Ok' : 'ตกลง', onPress: async () => {

                var user_id = await AsyncStorage.getItem('userId');
                const params = {library_id: item.library_id, user_id: user_id}
                httpClient
                  .post(`/Library/Request_New_Library/`, params)
                  .then(response => {
                    const result = response.data;
                    if (result === 'success') {
                      this.componentDidMount(); 
                    }else{
                      Alert.alert("Fail")
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });

                  }
          }
          ],
          { cancelable: false }
        )
       
      }

      _reanderItem = ({item, index}) => {
        let {itemStyle, itemText, itemInvisible} = styles;
        if (item.empty) {
          return <View style={itemInvisible} />;
        }

        var str = item.library_filename;
        if(str != undefined){
            var arr = str.split(".");
            var type_document = arr[1]; 
        }

        return (
            <View style={itemStyle}>
                <View style={styles.video}>
                      <Video 
                          source={{uri: item.library_address}}  
                          rate={1.0}
                          volume={1.0}
                          isMuted={false}
                          resizeMode='contain'
                          isLooping
                          useNativeControls
                          style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            }} 
                       />
                </View>
                <Text numberOfLines={1} style={itemText}>{this.state.lang === "EN" ? item.library_name_en : item.library_name}</Text>
                <View style={{alignSelf: 'center'}}>
                {
                  item.req_status === 'Request Download' ? 
                    <Button iconLeft
                      onPress={this.Request_Download.bind(this, item)}
                      style={{height: 35, marginBottom: 10, borderRadius: 5, backgroundColor: '#5bc0de'}}>
                        <Icon1 name="download" style={{marginLeft: 10, color: '#fff'}} size={18} />
                        <Text style={{marginRight: 10, marginLeft: 5, color: '#fff', fontWeight: 'bold', fontSize: 12}}>
                          {this.state.lang === "EN" ? 'Request Download' : 'ขอดาวน์โหลด'}
                        </Text>
                    </Button>   
                  : item.req_status === 'Waiting' ? 
                    <Button iconLeft
                      onPress={this.Cancel_Request_Download.bind(this, item)}
                      style={{height: 35, marginBottom: 10, borderRadius: 5, backgroundColor: '#ffc107'}}>
                        <Icon1 name="download" style={{marginLeft: 10, color: '#fff'}} size={18} />
                        <Text style={{marginRight: 10, marginLeft: 5, color: '#fff', fontWeight: 'bold', fontSize: 12}}>
                          {this.state.lang === "EN" ? 'Waiting' : 'รอการอนุมัติ'}
                        </Text>
                    </Button>  
                  : item.req_status === 'Download' ? 
                    <Button iconLeft
                        onPress={() => downloadFIle(item.library_address, item.library_filename)}
                        style={{height: 35, marginBottom: 10, borderRadius: 5, backgroundColor: '#28a745'}}>
                          <Icon1 name="download" style={{marginLeft: 10, color: '#fff'}} size={18} />
                          <Text style={{marginRight: 10, marginLeft: 5, color: '#fff', fontWeight: 'bold', fontSize: 12}}>
                            {this.state.lang === "EN" ? 'Download' : 'ดาวน์โหลด'}
                          </Text>
                    </Button> 
                  : item.req_status === 'Reject' ? 
                    <Button iconLeft
                        onPress={this.Request_New_Download.bind(this, item)}
                        style={{height: 35, marginBottom: 10, borderRadius: 5, backgroundColor: '#d9534f'}}>
                          <Icon1 name="download" style={{marginLeft: 10, color: '#fff'}} size={18} />
                          <Text style={{marginRight: 10, marginLeft: 5, color: '#fff', fontWeight: 'bold', fontSize: 12}}>
                            {this.state.lang === "EN" ? 'Reject' : 'ไม่อนุมัติ'}
                          </Text>
                    </Button> 
                  :
                  <View/>
                }
                </View>
            
              </View>
        );
      };


    render() {
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
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                    <FlatList
                      data={this.formatData(this.state.docList, numColumns)}
                      renderItem={this._reanderItem}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={numColumns}
                      ListHeaderComponent={this.renderHeader}
                    />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    subContainer: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 40,
      backgroundColor: "black",
      alignItems: "center"
    },
    playerContainer: {
      height: 300,
      width: '100%',
      backgroundColor: "white"
    },
    warningText: {
      color: "red",
      fontWeight: "700",
      position: "absolute",
      alignSelf: "center",
      top: 20
    },
    player: {
      flex: 1
    },
    button: {
      marginTop: 40,
      backgroundColor: '#001a66',
      padding: 5,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 5,
    },
    text: {
      color: '#ffffff',
      fontSize: 16,
    },
    itemStyle: {
      backgroundColor: '#fff',
      alignItems: 'center',
      //justifyContent: 'center',
      flex: 1,
      margin: 15,
      //height: 170,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#a6a6a6',
    },
    itemText: {
      padding: 10,
      color: '#000000',
      fontSize: 16,
    },
    itemInvisible: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      flex: 1,
      margin: 10,
    },
    video: {
      //marginTop: 40,
      width: '100%',
      height: 200,
      alignSelf: 'center',
    },
    videoAndroid: {
      //marginTop: 40,
      width: '100%',
      // height: 0,
      // alignSelf: 'center',
    },
    mediaPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });
  

  export default function(props) {
    return <MultimediaDetail {...props} />;
  }

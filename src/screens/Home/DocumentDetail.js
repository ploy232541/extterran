import React, { Component } from 'react'
import { Text, View, SafeAreaView, AsyncStorage, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, Platform, ActivityIndicator, Linking } from 'react-native'
import {httpClient} from '../../core/HttpClient';
// import {IMAGE} from '../../../constants/Image';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
// import RNFetchBlob from 'rn-fetch-blob';
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
import { StackActions, useNavigation } from "@react-navigation/native"
import { downloadFIle } from "../../utils/file";
import PDFScreen from './PDFScreen';
import { Alert } from 'react-native';

const numColumns = 2;
const WIDTH = Dimensions.get('window').width;



class DocumentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          docList: [],
          loading: false,
        };
        this.arrayholder = [];
      }
      
      async componentDidMount() {

        try {
          this.setState({ loading: true });
          const {library_type_id, title} = this.props.route.params;
          const res = await AsyncStorage.getItem('language');
          if (res === 'EN') {
            this.setState({lang: 'EN'});
          } else {
            this.setState({lang: 'TH'});
          }

          console.log(library_type_id)
    
          httpClient
          .get(`/Library/DocumentFiles/${library_type_id}`)
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
         const a=itemData.toString().toUpperCase()
   
           return a.indexOf(text.toString().toUpperCase()) > -1;    
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

      LinkingEbook(library_address){
          Linking.openURL(library_address)
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
        
        const { navigate } = this.props.navigation;
        return (
                <TouchableOpacity
                onPress={() => navigate('PDFScreen', { address: item.library_address,filename:item.library_filename})}
                // onPress={console.log(item.library_address)}
                // onPress=navigate("PDFScreen")
                  // onPress={
                  //   item.status_ebook == '1' ?
                  //     this.LinkingEbook.bind(this, item.library_address)
                  //   :
          
                  //     // () => PDFScreen(item.library_address, item.library_filename)
                  //   }
                style={{flex: 1.1}}>
               <View style={itemStyle}>
                 <Image
                   resizeMode='cover'
                   source={{uri: 'http://smartxlearning.com/themes/template/img/other-library.png'}}
                   style={{
                     width: '100%',
                     height: Platform.OS == 'ios' ? Platform.isPad ? 300: 120 : 120,
                     borderTopLeftRadius: 5,
                     borderTopRightRadius: 5,
                   }}
                 />
                   {
                       type_document === 'doc' || type_document === 'docx' ?
                           <View style={{flex: 1, flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', right: 10 ,top: 7, backgroundColor: '#fff', borderRadius: 3, padding: 4}}>
                               <Icon1 name="file-pdf" size={15}/>
                               <Text style={{fontSize: 12}}>Word</Text>
                           </View>
                       : type_document === 'xls' || type_document === 'xlsx' ?
                           <View style={{flex: 1, flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', right: 10 ,top: 7, backgroundColor: '#fff', borderRadius: 3, padding: 4}}>
                               <Icon1 name="file-pdf" size={15}/>
                               <Text style={{fontSize: 12}}>Excel</Text>
                           </View>
                       : type_document === 'ppt' || type_document === 'pptx' ?
                           <View style={{flex: 1, flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', right: 10 ,top: 7, backgroundColor: '#fff', borderRadius: 3, padding: 4}}>
                               <Icon1 name="file-pdf" size={15}/>
                               <Text style={{fontSize: 12}}>PowerPoint</Text>
                           </View>
                       : type_document === 'pdf' ? 
                            <View style={{flex: 1, flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', right: 10 ,top: 7, backgroundColor: '#fff', borderRadius: 3, padding: 4}}>
                               <Icon1 name="file-pdf" size={15}/>
                               <Text style={{fontSize: 12}}>PDF</Text>
                           </View>
                       :
                       <View style={{flex: 1, flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', right: 10 ,top: 7, backgroundColor: '#fff', borderRadius: 3, padding: 4}}>
                        <Icon2 name="book" size={15}/>
                       <Text style={{fontSize: 12}}>E-Book</Text>
                       </View>
                   }
                   <Text numberOfLines={2} style={itemText}>{this.state.lang === "EN" ? item.library_name_en : item.library_name}</Text>
                   </View>
             </TouchableOpacity>
        );
      };

    render() {
      const { navigate } = this.props.navigation;
        const {library_type_id, title} = this.props.route.params;
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
      margin: 10,
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
  });

  export default function(props) {
  
    return <DocumentDetail {...props} />;
  }
  
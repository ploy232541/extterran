import React, { Component } from 'react'
import {View, SafeAreaView, TouchableOpacity, AsyncStorage, FlatList, ActivityIndicator} from 'react-native';
import {
    Container,
    Header,
    Item,
    Input,
    Icon,
    Button,
    Text,
    List,
    ListItem,
  } from 'native-base';
  import Icon1 from 'react-native-vector-icons/FontAwesome';
  import {httpClient} from '../../core/HttpClient';
  import { useNavigation } from "@react-navigation/native"

class TabDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          loading: false,
          dataList: [],
        };
        this.arrayholder = [];
      }

      async componentDidMount() {
        try {
          this.setState({ loading: true });
          const res = await AsyncStorage.getItem('language');
          if (res === 'EN') {
            this.setState({lang: 'EN'});
          } else {
            this.setState({lang: 'TH'});
          }
    
          httpClient
          .get(`/Library/DocumentType`)
          .then(async response => {
            const result = response.data;
            // console.log(result);
            if (result != null) {
              this.setState({
                dataList: result,
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

      
    showModal(item){
      const { navigation } = this.props;
      navigation.navigate('DocumentDetail', {library_type_id: item.library_type_id, title: this.state.lang === "EN" ? item.library_type_name_en : item.library_type_name});
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
    const itemData = `${this.state.lang === "EN" ? item.library_type_name_en.toUpperCase() : item.library_type_name.toUpperCase()}`;
    const textData = text.toUpperCase();
    return itemData.indexOf(textData) > -1;    
    });

    this.setState({ dataList: newData });  
    };

    _reanderItem = ({item, key}) => {
    return (
        <View>
        <ListItem onPress={this.showModal.bind(this, item)}>
            <View style={{flexDirection: 'row'}}>
                <Icon1 name="folder-open" style={{marginRight: 10}} size={20} />
                <Text style={{flex: 1}}>
                  {this.state.lang === "EN" ? item.library_type_name_en : item.library_type_name}
                </Text>
                <Icon1 name="chevron-right" style={{flex: 0.0}} size={15} />
            </View>
        </ListItem>
    </View>

    );
    };

    render() {
        if (this.state.loading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
              </View>
            );
          }
        return (
            <SafeAreaView style={{flex: 1}}>
                    <View style={{flex: 1, marginLeft: 0, marginRight: 0}}>
                        <List style={{borderWidth: 1, borderColor: '#e6e6e6'}}>
                            <FlatList
                                data={this.state.dataList}
                                renderItem={this._reanderItem}
                                keyExtractor={(item, key) => key.toString()}
                                ListHeaderComponent={this.renderHeader}
                            />
                        </List>
                    </View>
            </SafeAreaView>
        )
    }
}

export default function(props) {
  const navigation = useNavigation();

  return <TabDocument {...props} navigation={navigation} />;
}
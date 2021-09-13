import React, {Component} from 'react';
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    AsyncStorage,
    ScrollView,
    ActivityIndicator,
    Image,
    Linking,
  } from 'react-native';
  import {Accordion} from 'native-base';
  import Icon from 'react-native-vector-icons/AntDesign';
  import Icon2 from 'react-native-vector-icons/FontAwesome';
  import {httpClient} from '../../core/HttpClient';
  var decode = require('decode-html');
  import HTML from 'react-native-render-html';

class QandAListScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        lang: '',
        dataArray: '',
      };
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
            .get(`/Faq/${lang_id}`)
            .then(response => {
            const result = response.data;
                if (result != null) {
                    this.setState({
                        dataArray: result,
                    });
                }
            })
            .catch(error => {
            console.log(error);
            });
    }

    _renderHeader(item, expanded) {
        return (
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
              backgroundColor: '#f2f2f2',
              borderWidth: 1,
              borderColor: '#e6e6e6',
            //   borderRadius: 5,
            }}>
            <Icon2 style={{color: 'red'}} size={25} name="question-circle" />
            <Text style={{flex: 1, marginLeft: 5, color: '#000'}}>
              {item.faq_type_title_TH}
            </Text>
            <View style={{justifyContent: 'flex-end'}}>
              {expanded ? (
                <Icon style={{fontSize: 16, color: '#010c65'}} name="up" />
              ) : (
                <Icon style={{fontSize: 16, color: '#010c65'}} name="down" />
              )}
            </View>
          </View>
        );
      }

      _renderContent = item => {
        return (
          <View style={{flex: 1, padding: 10}}>
            <View
              style={{
                backgroundColor: '#fff7be',
                marginBottom: 10,
                borderRadius: 5,
                borderColor: '#cccccc',
                borderWidth: 1,
              }}>
              <View style={{padding: 20}}>
                <Text style={{marginBottom: 5}}>
                  {this.state.lang == 'EN' ? 'Question :' : 'คำถาม :'}
                </Text>
                <HTML html={decode(item.faq_THtopic)} />
              </View>
            </View>
            <View style={{backgroundColor: '#d9d9d9', borderRadius: 5}}>
              <View style={{padding: 20}}>
                <Text>{this.state.lang == 'EN' ? 'Answer :' : 'คำตอบ :'}</Text>
    
                    <HTML 
                        html={decode(item.faq_THanswer)}
                        onLinkPress={(event, href)=>{Linking.openURL(href)}}
                        ignoredStyles= {['width','height']} 
                        tagsStyles={{ img:{ alignSelf:'center'}
                        }}
                      />
              </View>
            </View>
          </View>
        );
      };

    render(){
        return (
            // <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: "white" }}
          >
                <View style={{ margin: 15 }}>
                <Accordion
                  dataArray={this.state.dataArray}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                />
                </View>
            </ScrollView>
        )
    }
}

export default function(props) {
    return <QandAListScreen {...props}  />;
  }
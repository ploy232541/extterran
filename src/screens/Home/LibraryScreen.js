import React, { Component } from 'react'
import { Text, View, AsyncStorage, ActivityIndicator, SafeAreaView } from 'react-native'
import {httpClient} from '../../core/HttpClient';
import { Container, Header, Content, Tab, Tabs, TabHeading} from 'native-base';
import { useNavigation } from "@react-navigation/native"
import TabDocument from './TabDocument';
import TabMultimedia from './TabMultimedia';
// import {TabDocument, TabMultimedia} from '../../index';

class LibraryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
        };
      }
    
      async componentDidMount() {
        try {
        const res = await AsyncStorage.getItem('language');
        if (res === 'EN') {
          this.setState({lang: 'EN'});
        } else {
          this.setState({lang: 'TH'});
        }

        } catch (err) {
          Alert.alert(err);
        }
      }
    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Tabs
                locked
                tabBarUnderlineStyle={{
                    borderBottomWidth: 4,
                    borderBottomColor: '#010C65',
                }}>
                <Tab
                    heading={
                    <TabHeading style={{backgroundColor: '#fff'}}>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <Text style={{color: '#000', fontSize: 15, fontWeight: 'bold'}}>
                            {this.state.lang === 'EN' ? 'Document type library' : 'ห้องสมุดประเภทเอกสาร'}
                        </Text>
                        </View>
                    </TabHeading>
                    }>
                     <TabDocument/> 
                </Tab>
                <Tab
                    heading={
                    <TabHeading style={{backgroundColor: '#fff'}}>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <Text style={{color: '#000', fontSize: 15, fontWeight: 'bold'}}>
                            {this.state.lang === 'EN'
                            ? 'Multimedia library'
                            : 'ห้องสมุดประเภทมัลติมีเดีย'}
                        </Text>
                        </View>
                    </TabHeading>
                    }>
                    <TabMultimedia/>
                </Tab>
                </Tabs>
          </SafeAreaView>
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
    return <LibraryScreen {...props} navigation={navigation} />;
  }


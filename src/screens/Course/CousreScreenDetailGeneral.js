import React, { Component } from 'react'
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    ImageBackground,
    AsyncStorage,
    Alert,
    Platform,
  } from 'react-native';
  import { Button } from 'native-base';
  import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {httpClient} from '../../core/HttpClient';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import { useNavigation } from "@react-navigation/native"
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { AntDesign } from '@expo/vector-icons';
// import DeviceInfo from 'react-native-device-info';

  const HEIGHT = Dimensions.get('window').height;
  const numColumns = 2;
  const WIDTH = Dimensions.get('window').width;  

class CousreScreenDetailGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      cousreList: [],
      visible: false,
      icon: '',
      backgroundColorIcon: '',
      content: '',

    };
  }

  async componentDidMount() {
    try {
      const {cate_id, type} = this.props.route.params;
      const user_id = await AsyncStorage.getItem('userId');
      const res = await AsyncStorage.getItem('language');
      if (res === 'EN') {
        this.setState({lang: 'EN'});
        var lang_id = '1';
      } else {
        this.setState({lang: 'TH'});
        var lang_id = '2';
      }

      if(cate_id && type){
        httpClient
        .get(`/CourseOnline/getCourseOnlineGeneral/${cate_id}/${lang_id}/${user_id}/${type}`)
        .then(async response => {
          const result = response.data;
            if (result != null) {
              this.setState({cousreList: result})
            }
          })
          .catch(error => {
          console.log(error);
        });
      }

    } catch (err) {
      console.log(err);
    }
  }

  async onPress_LearnScreen(item){
    const user_id = await AsyncStorage.getItem('userId');
    const { navigation } = this.props;
    const course_id = item.course_id;

    if(item.alert === '??????????????????????????????????????????????????????'){
      Alert.alert(
        this.state.lang == 'EN' ? 'Confirm to enroll in the course.' : '?????????????????? ??????????????????????????????????????????????????????',
        "",
        [
          {
            text: this.state.lang == 'EN' ? 'CANCEL' : '??????????????????',
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: this.state.lang == 'EN' ? 'OK' : '????????????', onPress: () => {
            httpClient
            .post(`/CourseOnline/SaveCourseOnlineGeneral`, {course_id: course_id, user_id: user_id})
            .then(async response => {
              const result = response.data;
                if (result != null) {
                  this.componentDidMount()
                  // Alert.alert("save success")
                }
              })
              .catch(error => {
              console.log(error);
            });
          } }
        ],
        { cancelable: false }
      );
      
      // navigation.navigate('LearnScreen', {course_id: course_id})
    }else if(item.alert === '?????????????????????????????????????????????'){
        this.setState({
          visible: true,
          icon: 'close',
          backgroundColorIcon: 'red',
          content: this.state.lang == 'EN' ? 'Time out learn.' : '?????????????????????????????????????????????',
        })
     }else if(item.alert === '??????????????????????????????????????????????????????'){
        this.setState({
          visible: true,
          icon: 'close',
          backgroundColorIcon: 'red',
          content: this.state.lang == 'EN' ? 'Course not yet open.' : '??????????????????????????????????????????????????????',
        })
    }         

  }
  
    formatData = (dataList, numColumns) => {
        const totalRows = Math.floor(dataList.length / numColumns);
        let totalLastRow = dataList.length - totalRows * numColumns;
    
        while (totalLastRow !== 0 && totalLastRow !== numColumns) {
          dataList.push({key: 'blank', empty: true});
          totalLastRow++;
        }
        return dataList;
      };
    
      _reanderItem = ({item, index}) => {
        let {itemStyle, itemText, itemInvisible, status_notLearn, status_learning, status_pass} = styles;
        if (item.empty) {
          return <View style={itemInvisible} />;
        }
        return (
          <TouchableOpacity onPress={this.onPress_LearnScreen.bind(this, item)} 
          style={{flex: 1.1}}>
            <View style={itemStyle}>
              <ImageBackground
                resizeMode='stretch'
                source={{uri: item.course_picture != null ? item.course_picture : "http://smartxlearning.com/themes/template/img/book.png"}}
                style={{
                  width: '100%',
                  // height: 110,
                  height: 110,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}>
              </ImageBackground>

              <Text numberOfLines={1} style={itemText}>{item.course_title}</Text>

              <View style={{height: 1, width: '80%', backgroundColor: '#d9d9d9'}}/>

              <View style={{flex: 1, flexDirection: 'column', padding: 5}}>
               <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text numberOfLines={1} style={{fontSize: 9, marginRight: 5}}>{this.state.lang === 'EN' ? 'Start Date' : '????????????????????????????????????????????????'}</Text>
                  <Text numberOfLines={1} style={{fontSize: 9}}>{ moment(item.course_date_start).format('DD/MM/YYYY, h:mm')}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text numberOfLines={1} style={{fontSize: 9, marginRight: 5}}>{this.state.lang === 'EN' ? 'Date Expire' : '???????????????????????????????????????'}</Text>
                  <Text numberOfLines={1} style={{fontSize: 9}}>{ moment(item.course_date_end).format('DD/MM/YYYY, h:mm')}</Text>
                </View>
              </View>

              <View style={{ padding: 5}}>
                {
                  item.alert === '??????????????????????????????????????????????????????' ?
                    <Button disabled style={{ height: 30, backgroundColor: '#000080', borderRadius: 5, marginBottom: 5}} >
                      <Text style={{fontSize: 11 ,color: '#fff', paddingLeft: 10 , paddingRight: 10}}>
                        {this.state.lang === 'EN' ? 'Register lesson' : '??????????????????????????????????????????????????????'}
                      </Text>
                    </Button>
                  : item.alert === '?????????????????????????????????????????????' ?
                    <Button disabled style={{ height: 30, backgroundColor: '#800000', borderRadius: 5, marginBottom: 5}} >
                        <Text style={{fontSize: 11 ,color: '#fff', paddingLeft: 10 , paddingRight: 10}}>
                          {this.state.lang === 'EN' ? 'Timeout lesson' : '?????????????????????????????????????????????'}
                        </Text>
                    </Button>
                  : item.alert === '??????????????????????????????????????????????????????' ?
                    <Button disabled style={{ height: 30, backgroundColor: '#b3b300', borderRadius: 5, marginBottom: 5}} >
                        <Text style={{fontSize: 11 ,color: '#fff', paddingLeft: 10 , paddingRight: 10}}>
                          {this.state.lang === 'EN' ? 'Course not yet open' : '??????????????????????????????????????????????????????'}
                        </Text>
                    </Button>
                  :
                  <View/>
                }
                 
              </View>

            </View>
          </TouchableOpacity>
        );
      };

      render() {
        const {title} = this.props.route.params;
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={{alignSelf: 'center'}}>
              <Button disabled style={styles.button}>
              <Text numberOfLines={1} style={styles.text}>{this.state.lang === 'EN' ? 'Cousre' : '????????????????????????????????????'} {title}</Text>
              </Button>
            </View>
            <View style={{flex: 1, marginLeft: 10, marginRight: 10, marginTop: 20}}>
              <FlatList
                data={this.formatData(this.state.cousreList, numColumns)}
                renderItem={this._reanderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
              />
            </View>

            <FancyAlert
            visible={this.state.visible}
            icon={<View style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.state.backgroundColorIcon,
              borderRadius: 50,
              width: '100%',
            }}>
              <AntDesign
              name={this.state.icon}
              size={36}
              color="#FFFFFF"
            />
            </View>}
            style={{ backgroundColor: 'white' }}
          >
            <View style={styles.content}>
              <Text style={styles.contentText}>{this.state.content}</Text>
        
              <TouchableOpacity style={styles.btn} onPress={()=> this.setState({visible: false})}>
                <Text style={styles.btnText}>{this.state.lang == 'EN' ? 'OK' : '????????????'}</Text>
              </TouchableOpacity>
            </View>
          </FancyAlert>

          </SafeAreaView>
        );
      }
    }
    
    const styles = StyleSheet.create({
      button: {
        marginTop: 30,
        backgroundColor: '#3b5998',
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
        marginLeft: 40,
        marginRight: 40,
      },
      text: {
        color: '#ffffff',
        fontSize: 16,
      },
      itemStyle: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        flex: 1,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#a6a6a6'
      },
      itemText: {
        padding: 7,
        color: '#000000',
        fontSize: 14,
        //height: 55,
      },
      itemInvisible: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        flex: 1,
        margin: 10,
      },
      status_notLearn: {
        marginTop: 10,
        position: "absolute",
        alignSelf: 'flex-end',
        height: 25,
        backgroundColor: '#bfbfbf'
      },
      status_learning: {
        marginTop: 10,
        position: "absolute",
        alignSelf: 'flex-end',
        height: 25,
        backgroundColor: '#ff9900'
      },
      status_pass: {
        marginTop: 10,
        position: "absolute",
        alignSelf: 'flex-end',
        height: 25,
        backgroundColor: '#248f24'
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -16,
        marginBottom: 16,
      },
      contentText: {
        textAlign: 'center',
        fontSize: 16
      },
      btn: {
        borderRadius: 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        alignSelf: 'stretch',
        backgroundColor: '#0099ff',
        marginTop: 16,
        minWidth: '50%',
        paddingHorizontal: 16,
      },
      btnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      
    });

    export default function(props) {
      const navigation = useNavigation();
      return <CousreScreenDetailGeneral {...props} navigation={navigation} />;
    }
    
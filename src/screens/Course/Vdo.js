import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  AsyncStorage,
  Dimensions,
  Alert,
  TouchableHighlight,
  FlatList,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {Accordion, Textarea} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon4 from 'react-native-vector-icons/SimpleLineIcons';
import {httpClient} from '../../core/HttpClient';
import {StackActions} from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { WebView } from 'react-native-webview';
import { useNavigation } from "@react-navigation/native"
import YoutubePlayer from 'react-native-youtube-iframe';
////
import ProgressCircle from 'react-native-progress-circle'
import PaginationDot from "react-native-animated-pagination-dot";
import ImageView from "react-native-image-viewing";
import Carousel, { Pagination } from 'react-native-snap-carousel';

// import JWPlayer, { JWPlayerState } from "react-native-jw-media-player";
import { Video } from 'expo-av';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';

import SliderEntry from './SliderEntry';
import { sliderWidth, itemWidth } from '../../styles/SliderEntry.style';
// import styless, { colors } from '../../../styles/index.style';
// import DeviceInfo from 'react-native-device-info';
// import Orientation from 'react-native-orientation-locker';

const { width, height } = Dimensions.get("window");
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 200;
const HEIGHT = Dimensions.get('window').height;

var maxPlayPosition = 0.0;
var seeking = false;

var SLIDER_1_FIRST_ITEM = 0;

class Vdo extends Component {
  player;
  videoPlayer;
  constructor(props) {
    super(props);
    this.state = {
      course_id: this.props.route.params.course_id,
      user_id: null,
      lang: '',
      dataArray: null,
      status: null,

      //state note
      dataArrayNote: [],
      note_lesson_id: '',
      note_file_id: '',
      note_text: '',
      note_time: '',
      note_gen_id: '',

      modalVisible: false,

      //video Pdf Silde
      currentPage: 0,
      currentSlide: null,

      showModelImage: null,
      showAlertLearn: null,

      timeStr: null,
      timer: 100000000000,
      autoscroll: false,

      uirSildeImage: null,
      // uirSildeImageStore: [],
      visibleGallery: null,

      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      scrollEnabled: true,

      //////new video expo////
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',    
      //////new video expo////

    };
  }

  async componentDidMount() {
    try {
    const lesson_id = this.props.route.params.lesson_id
    const file_id = this.props.route.params.file_id
    const user_id = await AsyncStorage.getItem('userId');
    this.setState({user_id: user_id});
    const res = await AsyncStorage.getItem('language');
    if (res === 'EN') {
      this.setState({lang: 'EN'});
    } else {
      this.setState({lang: 'TH'});
    }
    
    this.getNote();

    await httpClient
    .get(`/Learn/getLearn/${lesson_id}/${file_id}/${user_id}`)
    .then(async response => {
      const result = response.data;
        if (result != null) {
          this.setState({dataArray: result, status: result.last, currentSlide: result.image})
        }
      })
      .catch(error => {
      console.log(error);
    });

    } catch (err) {
      Alert.alert(err);
    }

  }

  async getNote(){
    const {user_id} = this.state
    const {lesson_id, file_id, course_id} = this.props.route.params

    await httpClient
    .get(`/Learn/getLearnNote/${lesson_id}/${file_id}/${course_id}/${user_id}`)
    .then(response => {
      const result = response.data;
        //console.log(result)
        if (result.length > 0) {
          this.setState({dataArrayNote: result})
        }else{
          const dataArrayNew = [{title: 'New'}];
          this.setState({dataArrayNote: dataArrayNew})
        }
      })
      .catch(error => {
      console.log(error);
    });
  }

  showAlert = () => {
    this.setState({
      showAlertLearn: true,
    });
  };

  // onConfirm = () => {
  //   const { navigation } = this.props;
  //   let {course_id} = this.state
  //    this.setState({showAlertLearn: false});

  //    navigation.dispatch(StackActions.replace('LearnScreen', {course_id: course_id, reload: true}))
  // };

  // onPause() {
  //   this.JWPlayer.pause();
  // }

  // onTime(e, item, types, timeOld) {
  //   // console.log('====onTime====');
  //   let {status, user_id, course_id} = this.state
  //   let lesson_id = item.lesson_id
  //   let file_id = item.file_id
  //   let gen_id = item.gen_id
  //   let timePosition = e.nativeEvent.position
  //   let type = types

  //   // if(status != 's'){
  //     if(this.state.currentSlide != null){
  //       for(i in this.state.currentSlide){
  //         val = this.state.currentSlide[i]

  //         if(val.image_slide_time === Math.floor(timePosition).toString()){
  //           this.setState({uirSildeImage: val.image})
  //         }
  //       }
  //     }
  //   // }
      
  //   if(timePosition){ // for note save
  //     this.setState({note_lesson_id: lesson_id, note_file_id: file_id, note_time: timePosition, note_gen_id: gen_id})
  //   }

  //   if(status != 's'){
  //           if(Math.floor(timePosition) % 6 == 0){
  //             // console.log("บันทึกวีดีโอทุก 6 วิ");
  //             // console.log("บันทึกเวลาที่เรียนไป");
  //             let params = {lesson_id: lesson_id, file_id: file_id, user_id: user_id, gen_id: gen_id, type: type, current_time: timeOld < Math.floor(timePosition) || timeOld == 'l' ?  Math.floor(timePosition) : timeOld}
  //             // console.log(params);
  //             httpClient
  //             .post('/Learn/LearnSaveVdo', params)
  //             .then(response => {
  //               const result = response.data;
  //                 // console.log(result);
  //             })
  //             .catch(error => {
  //               console.log(error);
  //             });
  //           }
  //   }

  //   if (!seeking) {
  //     maxPlayPosition = timePosition
  //   }
  // }

  // async onComplete(item, types){
  // // console.log('====onComplete====');
  //   let playing = await this.JWPlayer.playerState()
  //   let {status, user_id, course_id} = this.state
  //   let lesson_id = item.lesson_id
  //   let file_id = item.file_id
  //   let gen_id = item.gen_id
  //   let type = types
  //    if(status != 's'){
  //     if(playing == 4){ //play end
  //       // console.log("เรียนผ่านแล้ว");
  //       let params = {lesson_id: lesson_id, file_id: file_id, user_id: user_id, gen_id: gen_id, status: 'success', type: type}
  //       // console.log(params);
  //       httpClient
  //       .post('/Learn/LearnSaveVdo', params)
  //       .then(response => {
  //         const result = response.data;
  //           // console.log(result);
  //           if(result.status == 'success'){
  //             this.componentDidMount()
  //             this.showAlert()
  //           }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //     }
  //   }
  // }

  // onPlay(item, types) {
  //     let {status, user_id, course_id} = this.state
  //     let lesson_id = item.lesson_id
  //     let file_id = item.file_id
  //     let gen_id = item.gen_id
  //     let type = types
  //     if(status != 's'){
  //             // console.log("กำลังเรียนเรียน");
  //             let params = {lesson_id: lesson_id, file_id: file_id, user_id: user_id, gen_id: gen_id, type: type}
  //             // console.log(params);
  //             httpClient
  //             .post('/Learn/LearnSaveVdo', params)
  //             .then(response => {
  //               const result = response.data;
  //                 // console.log(result);
  //                 this.componentDidMount()
  //             })
  //             .catch(error => {
  //               console.log(error);
  //             });
  //     }
  // }

  // onSeek(e) 
  // {
  //   let {status} = this.state

  //   if(status != 's'){
  //     if (!seeking) 
  //     {
  //         if (e.nativeEvent.offset > maxPlayPosition) 
  //         {
  //             seeking = true;
  //             this.JWPlayer.seekTo(maxPlayPosition);
  //         }
  //     } 
  //     else 
  //     {
  //         seeking = false;
  //     }   
  //   }
      
  // }

  // onFullScreen() {
  //   StatusBar.setHidden(true);
  //   // Orientation.unlockAllOrientations();
  // }

  // onFullScreenExit() {
  //   StatusBar.setHidden(false);
  //   // Orientation.lockToPortrait();
  // }

  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };
 
  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };
 
  onReplay = () => {
    //Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer.seek(0);
  };

  onProgress = data => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };

  onLoad = data => this.setState({ duration: data.duration, isLoading: false });
      
  onLoadStart = data => this.setState({ isLoading: true });
  
  onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });
  
  onError = () => alert('Oh! ', error);
  
  exitFullScreen = () => {
    alert('Exit full screen');
  };
  
  enterFullScreen = () => {};
  
  onFullScreen = () => {
    if (this.state.screenType == 'content')
      this.setState({ screenType: 'cover' });
    else this.setState({ screenType: 'content' });
  };
  renderToolbar = () => (
    <View>
      <Text> toolbar </Text>
    </View>
  );
  onSeeking = currentTime => this.setState({ currentTime });

  /////////////////////////////////Start all function learm Video////////////////////////////////////
  _renderHeaderVideo(item, expanded){
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
          borderWidth: 1,
          borderColor: '#d9d9d9'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ProgressCircle
            percent={item.status == 's' ? 100 : item.status == 'l' || item.status != null ? 100 : 100}
            radius={13}
            borderWidth={5}
            color={item.status == 's' ? "#258e25" : item.status == 'l' || item.status != null ? "#ff751a" : "#cc0000"}
            shadowColor="#999"
          >
          </ProgressCircle>
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {item.file_name != null ? item.file_name : item.filename}
          </Text>
        </View>
      </View>
    );
  }

  // onPressImageToVideo(item){
  //   this.setState({uirSildeImage: item.image})
  //   this.JWPlayer.seekTo(parseInt(item.image_slide_time));
  //   this.JWPlayer.pause()
  // }

  handlePlaybackStatusUpdate = (e, status, item) => {
    console.log(e)
    if(status != 's'){
      if(e.isPlaying){
        if(e.positionMillis == 0){
          console.log('=======save L=======')
        }
      }




       /////////บันทึกวีดีโอทุก 6 วิ//////////
      // if(e.positionMillis > 0){
      //   if(Math.floor(e.positionMillis) % 6000 == 0){
      //     console.log("บันทึกวีดีโอทุก 6 วิ");
      //   }
      // }

      /////////บันทึกวีดีโอจบ//////////
      // if(e.didJustFinish){
      //   console.log('====End video====')
      // }
    }
    
  };

  _renderContentVideo = item => {
    let {status, uirSildeImageStore} = this.state
    const passLearn = status == 's' ? true : false
    return (
      <View>
          <View style={styles.subContainer}>
              <View style={styles.playerContainer}>
                <Video
                  ref={ref => (this.player = ref)}
                  useNativeControls
                  paused={true}
                  resizeMode="contain"
                  source={{ uri: item.vdo }}
                  style={styles.mediaPlayer}
                  volume={1}
                  onPlaybackStatusUpdate={(e) => this.handlePlaybackStatusUpdate(e, status, item)}
                />

                {/* <MediaControls
                  duration={this.state.duration}
                  isLoading={this.state.isLoading}
                  mainColor="#333"
                  onFullScreen={this.onFullScreen}
                  onPaused={this.onPaused}
                  onReplay={this.onReplay}
                  onSeek={this.onSeek}
                  onSeeking={this.onSeeking}
                  playerState={this.state.playerState}
                  progress={this.state.currentTime}
                  toolbar={this.renderToolbar()}
                /> */}
                  {/* <Video
                      // ref={(r) => {
                      //   videoRef.current = r;
                      // }}
                      source={{ uri: 'http://localhost/lms_exterran/uploads/lesson/3212222722-1.mp4' }}
                      // source={{ uri: item.vdo }}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode="contain"
                      shouldPlay={true}
                      isLooping={false}
                      useNativeControls
                      style={styles.mediaPlayer}
                      // progressUpdateIntervalMillis={1000}
                    /> */}
                     
                    {/* <JWPlayer
                      ref={p => (this.JWPlayer = p)}
                      style={styles.player}
                      playlistItem={{
                        mediaId: "1",
                        file: item.vdo,
                        autostart: false,
                        startTime: item.status != null && item.status != 's' && item.status != 'l' ? parseInt(item.status) : 0
                      }}

                      onPlay={() => this.onPlay(item, 'video')}
                      onComplete={() => this.onComplete(item, 'video')}
                      onTime={(e) => this.onTime(e, item, 'video', item.status)}
                      onSeek={(e) => this.onSeek(e)}
                      onPause={() => this.onPause()}
                      nativeFullScreen={true} 
                      onFullScreen={() => this.onFullScreen()}
                      onFullScreenExit={() => this.onFullScreenExit()}
                      // landscapeOnFullScreen={true}
                      // portraitOnExitFullScreen={true}
                      // fullScreenOnLandscape={true}
                      // exitFullScreenOnPortrait={true}
                    /> */}
              </View>
            </View>

            <Accordion
              dataArray={this.state.dataArrayNote}
              animation={true}
              expanded={true}
              renderHeader={this._renderHeaderNote}
              renderContent={this._renderContentNote}
            />

            {
              this.state.currentSlide != null ? 
                passLearn ?
                (
                  <View style={{marginTop: 10}}>
                    <View style={{marginBottom: 20}}>
                      <View style={{padding: 10, marginBottom: 10}}>
                        {
                            this.state.uirSildeImage != null ?
                                <View style={{flex: 1, alignItems: 'center', borderWidth: 3, borderColor: '#e6e6e6'}}>
                                  <TouchableOpacity 
                                    onPress={() => this.setState({visibleGallery: true})}
                                  >
                                  <Image resizeMode={'stretch'} source={{uri: this.state.uirSildeImage}} style = {{ width: 250, height: 200}}/>
                                  </TouchableOpacity>
                                </View>
                            :
                            <View/>
                          }

                          {
                              this.state.uirSildeImage != null ?
                                  <ImageView
                                  images={[{uri: this.state.uirSildeImage}]}
                                  imageIndex={0}
                                  visible={this.state.visibleGallery}
                                  onRequestClose={() => this.setState({visibleGallery: false})}
                                  />
                                :
                                  <View/>
                          }
                      </View>
                    <FlatList 
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={this.state.currentSlide }
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item }) => {
                        return(
                          <TouchableOpacity
                            onPress={this.onPressImageToVideo.bind(this, item)}>
                            <Image 
                                resizeMode={'stretch'}
                                source={{uri: item.image}}
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderWidth:1,
                                    borderColor:'#66b3ff',
                                    margin:8
                                }}
                            />
                          </TouchableOpacity>
                        )
                      }
                    }
                  />
                 
                    </View>
                  </View>
                )
                :
                (
                <View style={{marginTop: 10, padding: 10, marginBottom: 20}}>
                   {
                      this.state.uirSildeImage != null ?
                          <View style={{flex: 1, alignItems: 'center', borderWidth: 3, borderColor: '#e6e6e6'}}>
                            <TouchableOpacity 
                              onPress={() => this.setState({visibleGallery: true})}
                            >
                            <Image resizeMode={'stretch'} source={{uri: this.state.uirSildeImage}} style = {{ width: 300, height: 250}}/>
                            </TouchableOpacity>
                          </View>
                      :
                      <View/>
                    }

                    {
                        this.state.uirSildeImage != null ?
                            <ImageView
                            images={[{uri: this.state.uirSildeImage}]}
                            imageIndex={0}
                            visible={this.state.visibleGallery}
                            onRequestClose={() => this.setState({visibleGallery: false})}
                            />
                          :
                            <View/>
                    }
                </View>
                )
                :
                <View/>
            }
            
      </View>
    );
  };
  /////////////////////////////////End all function learm Video////////////////////////////////////


  /////////////////////////////////Start all function learm PDF////////////////////////////////////
  saveLearnPdf(index, item){
    let {status, user_id, course_id} = this.state
    let lesson_id = item.lesson_id
    let file_id = item.file_id
    let gen_id = item.gen_id

    if(status != 's'){
            let params = {lesson_id: lesson_id, file_id: file_id, user_id: user_id, gen_id: gen_id, slide: index+1}
            httpClient
            .post('/Learn/LearnSavePdf', params)
            .then(async response => {
              const result = await response.data;
                // console.log(result);
                if(result.timeNext != null || result.timeNext != undefined){
                  this.setState({ slider1ActiveSlide: index+1, scrollEnabled: false })
                  this.setState({timeStr: '00:00:00'});
                  this.time_down(parseInt(result.timeNext))
                }else{
                  this.setState({ slider1ActiveSlide: index+1, scrollEnabled: true })
                  this.time_down(null)
                }

                if(result.status == 'success'){
                  // console.log("เรียนผ่านแล้ว");
                  this.componentDidMount()
                  this.showAlert()
                }else{
                      this.componentDidMount()
                  // console.log("กำลังเรียน");
                }
            })
            .catch(error => {
              console.log(error);
            });
    }else{
      this.setState({ slider1ActiveSlide: index})
    }

  }
  time_down(time){
    if(time != null){
      var count = time;
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var timeStr = '';
  
       this.setState({timer: count * 1000});
       this.interval = setInterval(async () => {
        count--;
        hours   = Math.floor(count / 3600);
        minutes = Math.floor((count - (hours * 3600)) / 60);
        seconds = count - (hours * 3600) - (minutes * 60);
  
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        timeStr = hours+':'+minutes+':'+seconds;
  
        this.setState({timeStr: timeStr});
  
        if (count == 0) {
            this.setState({scrollEnabled: true});
            clearInterval(this.interval);
        }
      }, 1000);
    }else{
      this.setState({timeStr: null});
    }
  
  }
  _renderHeaderPDF(item, expanded){
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
          borderWidth: 1,
          borderColor: '#d9d9d9'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProgressCircle
            percent={item.data[0].status == 's' ? 100 : item.data[0].status != null ? 100 : 100}
            radius={13}
            borderWidth={5}
            color={item.data[0].status == 's' ? "#258e25" : item.data[0].status != null ? "#ff751a" : "#cc0000"}
            shadowColor="#999"
          >
          </ProgressCircle>
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {item.data[0].file_name != null ? item.data[0].file_name : item.data[0].filename}
          </Text>
        </View>
      </View>
    );
  }

  _renderItemWithParallax ({item, index}, parallaxProps) {
    return (
        <SliderEntry
          data={item}
          even={(index + 1) % 2 === 0}
          parallax={true}
          parallaxProps={parallaxProps}
        />
    );
}
  _renderContentPDF = item => {
    // let arrlist = []
    // for(i in item.data){
    //   val = item.data[i]
    //   var value = {
    //     image: val.image,
    //     file_id: val.file_id,
    //     lesson_id: val.lesson_id,
    //     gen_id: val.gen_id,
    //   }
    //   arrlist.push(value)
    // }
    let arrlist = []
    for(i in item.data){
      val = item.data[i]
      var value = {
        illustration: val.image,
        file_id: val.file_id,
        lesson_id: val.lesson_id,
        gen_id: val.gen_id,
        status: val.status,
      }
      arrlist.push(value)
    }

    const { slider1ActiveSlide, timeStr, timer } = this.state;
    if(value.status != 's'){
      var index_old = parseInt(value.status);
    }
    return (
      <View>
          {/* <FlatListSlider
              data={arrlist}
              // timer={20000}
              width={Platform.OS == 'ios' ? 380 : 330}
              height={350}
              loop={true}
              autoscroll={false}
              onPress={item => console.log(item)}
              currentIndexCallback={index => this.saveLearnPdf(index, value)}
              contentContainerStyle={{paddingHorizontal: 16}}
              indicatorContainerStyle={{position:'absolute', bottom: 20}}
              animation
            /> */}
            {
              value.status != 's' ?
                <View>
                  <Carousel
                    ref={c => this._slider1Ref = c}
                    data={arrlist}
                    renderItem={this._renderItemWithParallax}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={true}
                    firstItem={index_old}
                    // inactiveSlideScale={0.94}
                    // inactiveSlideOpacity={0.7}
                    // inactiveSlideShift={30}
                    // containerCustomStyle={styless.slider}
                    // contentContainerCustomStyle={styless.sliderContentContainer}
                    loop={true}
                    // loopClonesPerSide={1}
                    autoplay={false}
                    // autoplayDelay={500}
                    // autoplayInterval={timer}
                    scrollEnabled={this.state.scrollEnabled}
                    onSnapToItem={(index) => this.saveLearnPdf(index_old, value)}
                    />
                    <View style={{alignItems: 'center', marginBottom: 20}}>
                            <PaginationDot 
                                activeDotColor={'black'} 
                                curPage={slider1ActiveSlide != 0  ? slider1ActiveSlide : index_old} 
                                maxPage={arrlist.length}
                                sizeRatio={1.0}
                            />
                    </View>
                </View>
              :
              <View>
                  <Carousel
                  ref={c => this._slider1Ref = c}
                  data={arrlist}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  // inactiveSlideScale={0.94}
                  // inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={30}
                  // containerCustomStyle={styless.slider}
                  // contentContainerCustomStyle={styless.sliderContentContainer}
                  loop={true}
                  // loopClonesPerSide={1}
                  autoplay={false}
                  // autoplayDelay={500}
                  // autoplayInterval={timer}
                  // scrollEnabled={this.state.scrollEnabled}
                  onSnapToItem={(index) => this.setState({slider1ActiveSlide: index})}
                />

                <View style={{alignItems: 'center', marginBottom: 20}}>
                      <PaginationDot 
                          activeDotColor={'black'} 
                          curPage={slider1ActiveSlide} 
                          maxPage={arrlist.length}
                          sizeRatio={1.0}
                      />
                </View>
            </View>
            }
               
               
                 {
                  this.state.timeStr != null ?
                  <View style={{alignItems:'flex-end', padding: 10}}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>{this.state.timeStr}</Text>
                  </View>
                  :
                  <View/>
                }

            
      </View>
    );
  };
  /////////////////////////////////End all function learm PDF////////////////////////////////////


  /////////////////////////////////Start all function learm Audio////////////////////////////////////
  _renderHeaderAudio(item, expanded){
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
          borderWidth: 1,
          borderColor: '#d9d9d9'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProgressCircle
            percent={item.status == 's' ? 100 : item.status == 'l' || item.status != null ? 100 : 100}
            radius={13}
            borderWidth={5}
            color={item.status == 's' ? "#258e25" : item.status == 'l' || item.status != null ? "#ff751a" : "#cc0000"}
            shadowColor="#999"
          >
          </ProgressCircle>
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {item.filename}
          </Text>
        </View>
      </View>
    );
  }

  _renderContentAudio = item => {
    // console.log(item.status)
    return (
      <View>
         <View style={styles.subContainer}>
              <View style={styles.playerContainer}>
                {/* <JWPlayer
                  ref={p => (this.JWPlayer = p)}
                  style={styles.player}
                  playlistItem={{
                    image: 'http://thorconn.com/themes/template2/images/audio-exterran.jpg',
                    mediaId: "1",
                    file: item.audio,
                    autostart: false,
                    startTime: item.status != null && item.status != 's' && item.status != 'l' ? parseInt(item.status) : 0
                  }}
                  
                  onPlay={() => this.onPlay(item, 'audio')}
                  onComplete={() => this.onComplete(item, 'audio')}
                  onTime={(e) => this.onTime(e, item, 'audio', item.status)}
                  onPause={() => this.onPause()}
                  onSeek={(e) => this.onSeek(e)}
                  nativeFullScreen={true} // when undefined or false you will need to handle the player styles in onFullScreen & onFullScreenExit callbacks
                  fullScreenOnLandscape={true}
                  onFullScreen={() => this.onFullScreen()}
                  onFullScreenExit={() => this.onFullScreenExit()}
                  // landscapeOnFullScreen={true}
                  // portraitOnExitFullScreen={true}
                  // fullScreenOnLandscape={true}
                  // exitFullScreenOnPortrait={true}
                /> */}
              </View>
            </View>
      </View>
    );
  };
  /////////////////////////////////End all function learm Audio////////////////////////////////////


  /////////////////////////////////Start all function learm Youtube////////////////////////////////////
  onChangeState(e, item, types){
    // console.log('====onCompleteYoutube====');
    let {status, user_id, course_id} = this.state
    let lesson_id = item.lesson_id
    let file_id = item.file_id
    let gen_id = item.gen_id
    let type = types
     if(status != 's'){
      if(e == 'ended'){ //play end
        // console.log("เรียนผ่านแล้ว");
        let params = {lesson_id: lesson_id, file_id: file_id, user_id: user_id, gen_id: gen_id, status: 'success', type: type}
        // console.log(params);
        httpClient
        .post('/Learn/LearnSaveVdo', params)
        .then(response => {
          const result = response.data;
            // console.log(result);
            if(result.status == 'success'){
              this.componentDidMount()
              this.showAlert()
            }
        })
        .catch(error => {
          console.log(error);
        });
      }else{
          // console.log("กำลังเรียนเรียน");
          let params = {lesson_id: lesson_id, file_id: file_id, user_id: user_id, gen_id: gen_id, type: type}
          // console.log(params);
          httpClient
          .post('/Learn/LearnSaveVdo', params)
          .then(response => {
            const result = response.data;
              // console.log(result);
            this.componentDidMount()
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
  _renderHeaderYoutube(item, expanded){
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
          borderWidth: 1,
          borderColor: '#d9d9d9'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProgressCircle
            percent={item.status == 's' ? 100 : item.status == 'l' || item.status != null ? 100 : 100}
            radius={13}
            borderWidth={5}
            color={item.status == 's' ? "#258e25" : item.status == 'l' || item.status != null ? "#ff751a" : "#cc0000"}
            shadowColor="#999"
          >
          </ProgressCircle>
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {item.file_name != null ? item.file_name : item.youtube}
          </Text>
        </View>
      </View>
    );
  }
  _renderContentYoutube = item => {
    return (
      <View>
         <View style={styles.subContainer}>
              <View style={styles.playerContainer}>
              <YoutubePlayer
                 height={500}
                 width={'100%'}
                 videoId={item.youtube.substring(32, 43)} 
                 play={false}
                 onChangeState={e => this.onChangeState(e, item, 'youtube')}
                 volume={50}
                 playbackRate={1}
                 playerParams={{
                   cc_lang_pref: "us",
                   showClosedCaptions: true
                 }}
               />
              </View>
            </View>
      </View>
    );
  };
  /////////////////////////////////End all function learm Youtube////////////////////////////////////


  /////////////////////////////////Start all function learm scorm////////////////////////////////////
  _renderHeaderScorm(item, expanded){
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
          borderWidth: 1,
          borderColor: '#d9d9d9'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProgressCircle
            percent={item.status == 's' ? 100 : item.status == 'l' ? 100 : 100}
            radius={13}
            borderWidth={5}
            color={item.status == 's' ? "#258e25" : item.status == 'l' ? "#ff751a" : "#cc0000"}
            shadowColor="#999"
          >
          </ProgressCircle>
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {item.filename}
          </Text>
        </View>
      </View>
    );
  }

  _renderContentScorm = item => {
    return (
        <View style={{
          flex: 1,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 40,
          backgroundColor: "black",
          alignItems: "center"
        }}>
              <View style={{
                 height: 300,
                 width: '100%',
                 backgroundColor: "white"
              }}>
                <WebView 
                  allowsFullscreenVideo={true}
                  source={{ uri: item.scorm}} 
                />
              </View>
          </View> 
    );
  };
  /////////////////////////////////End all function learm scorm////////////////////////////////////


  
   /////////////////////////////////Start all function learm Ebook////////////////////////////////////
   _renderHeaderEbook(item, expanded){
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
          borderWidth: 1,
          borderColor: '#d9d9d9'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProgressCircle
            percent={item.status == 's' ? 100 : item.status == 'l' ? 100 : 100}
            radius={13}
            borderWidth={5}
            color={item.status == 's' ? "#258e25" : item.status == 'l' ? "#ff751a" : "#cc0000"}
            shadowColor="#999"
          >
          </ProgressCircle>
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {item.filename}
          </Text>
        </View>
      </View>
    );
  }

  _renderContentEbook = item => {
    return (
        <View style={{
          flex: 1,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 40,
          backgroundColor: "black",
          alignItems: "center"
        }}>
              <View style={{
                 height: 550,
                 width: '100%',
                 backgroundColor: "white"
              }}>
                <WebView 
                  allowsFullscreenVideo={true}
                  source={{ uri: item.ebook}} 
                />
              </View>
          </View> 
    );
  };
  /////////////////////////////////End all function learm Ebook////////////////////////////////////


  /////////////////////////////////Start all function note////////////////////////////////////
  saveNote() {
    this.onPause();
    let {note_lesson_id, note_file_id, note_text, note_time, note_gen_id, user_id} = this.state
    if(note_text != ""){
      let params = {note_lesson_id: note_lesson_id, note_file_id: note_file_id,
          note_text: note_text, note_time: note_time, note_gen_id: note_gen_id, user_id: user_id}
      httpClient
      .post('/Learn/LearnNoteSave', params)
      .then(response => {
        const result = response.data;
          // console.log(result);
          if(result != null){
            this.setState({dataArrayNote: result, note_text: ''})
            this.getNote();
          }
      })
      .catch(error => {
        console.log(error);
      });
    }else{
      Alert.alert(this.state.lang === "EN" ? "Please type your message before taking notes." : "กรุณาพิมพ์ข้อความก่อนจดบันทึก")
    }
  }

  submitEditNote(){
    httpClient
    .post('/Learn/LearnNoteSave', {note_id: this.state.note_id, note_text: this.state.note_text})
    .then(response => {
      const result = response.data;
        if(result.success == 'success'){
          this.setState({modalVisible: false})
          this.getNote();
        }
    })
    .catch(error => {
      console.log(error);
    })
  }

  editNote(data){
    Alert.alert(
      this.state.lang == "EN" ? "Confirm" : "ยืนยันใช่ไหม",
      this.state.lang == "EN" ? "That you want to edit the record." : "ว่าต้องการแก้ไขบันทึก",
      [
        {
          text: this.state.lang == "EN" ? "Cancel" : "ยกเลิก",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: this.state.lang == "EN" ? "Ok" : "ตกลง", onPress: () => 
          this.setState({modalVisible: true, note_text: data.note_text, note_id: data.note_id})
       }
      ],
      { cancelable: false }
    );
  }

  deleteNote(note_id){
    Alert.alert(
      this.state.lang == "EN" ? "Confirm" : "ยืนยันใช่ไหม",
      this.state.lang == "EN" ? "That you want to delete the record." : "ว่าต้องการลบบันทึก",
      [
        {
          text: this.state.lang == "EN" ? "Cancel" : "ยกเลิก",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: this.state.lang == "EN" ? "Ok" : "ตกลง", onPress: () => 
          httpClient
          .post('/Learn/LearnNoteDelete', {note_id: note_id})
          .then(response => {
            const result = response.data;
              if(result == 'success'){
                this.getNote();
              }
          })
          .catch(error => {
            console.log(error);
          })
       }
      ],
      { cancelable: false }
    );
  }
  
  onFocus(){
    this.onPause();
  }

  zeroPad(nr, base){
    var  len = (String(base).length - String(nr).length)+1;
     return len > 0? new Array(len).join('0')+nr : nr;
  }

  _renderHeaderNote = (item, expanded) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#cccccc',
          //borderWidth: 1,
          //borderColor: '#cccccc',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon4 name="note" size={20} style={{color: '#000'}} />
          <Text style={{flex: 1, marginLeft: 5, color: '#000', fontSize: 16}}>
            {this.state.lang == "EN" ? "Note" : "จดบันทึก"}
          </Text>
        </View>
      </View>
    );
  }

  // noteTimeToVideo(time){
  //   this.JWPlayer.seekTo(parseInt(time));
  //   this.JWPlayer.pause()
  // }
  
  _renderContentNote = (item) => {
    return (
      <View style={{backgroundColor: '#fff', padding: 30}}>
        <Textarea onFocus={this.onFocus.bind(this)} onChangeText={text => this.setState({note_text: text})} 
          rowSpan={5} bordered placeholder={this.state.lang == "EN" ? "Message" : "เขียนข้อความ"} />
        <TouchableOpacity onPress={this.saveNote.bind(this)}
        style={{backgroundColor: 'green', alignItems: 'center', marginTop: 20, 
        marginLeft: 100, 
        marginRight: 100, 
        borderRadius: 10}}>
           <Text style={{padding: 10, fontSize: 14, fontWeight: 'bold', color: '#fff'}}>{this.state.lang == "EN" ? "Save" : "จดบันทึก"}</Text>
        </TouchableOpacity>
        
        {
          item.list ?
            <View>
               <View
                      style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                      <View style={{flex: 0.5}}>
                          <Text style={{fontSize: 14, marginTop: 20}}>{this.state.lang == "EN" ? "Time" : "เวลา"}</Text>
                      </View>
                      <View style={{flex: 1}}>
                          <Text style={{fontSize: 14, marginTop: 20}}>{this.state.lang == "EN" ? "Message" : "ข้อความ"}</Text>
                      </View>
              </View>
              <View style={{backgroundColor: '#e6e6e6', height: 2, width: '100%'}} />
              { item.list.map((data)=>{
                  return(
                    <View>
                      <View
                        style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                        <View style={{flex: 0.3}}>
                          <TouchableOpacity 
                           onPress={this.noteTimeToVideo.bind(this, data.note_time)}>
                            <Text style={{color: '#000080'}}>
                              { data.note_time <= 60 ?
                                "00:"+this.zeroPad(Math.floor(data.note_time % 60),60)
                              :
                                this.zeroPad(Math.floor(data.note_time / 60),60)+":"+this.zeroPad(Math.floor(data.note_time % 60),60)
                              }
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                          <Text>{data.note_text}</Text>
                        </View>
                        <View style={{flex: 0.1, marginLeft: 10}}>
                          <TouchableOpacity 
                             onPress={this.editNote.bind(this, data)}
                          >
                              <Icon1 name="edit" size={16} />
                          </TouchableOpacity>
                        </View>
                        <View style={{width:10}}/>
                        <View style={{flex: 0.1}}>
                          <TouchableOpacity
                            onPress={this.deleteNote.bind(this, data.note_id)}
                          >
                              <Icon name="delete" size={16} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{backgroundColor: '#e6e6e6', height: 1, width: '100%', marginTop: 10}} />
                    </View>
                  )
                })
              }
            </View>
            :
            <View/>
        }
        
      </View>
    );
  };
  /////////////////////////////////End all function note////////////////////////////////////

  render() {
    const {dataArray} = this.state
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView>

         <View>
           { 
             dataArray != null ?
              dataArray.type == 'vdo' ?
              <Accordion
                dataArray={dataArray.video}
                animation={true}
                expanded={0}
                renderHeader={this._renderHeaderVideo}
                renderContent={this._renderContentVideo}
              />
              : dataArray.type == 'pdf' ?
              <Accordion
                dataArray={dataArray.pdf}
                animation={true}
                expanded={0}
                renderHeader={this._renderHeaderPDF}
                renderContent={this._renderContentPDF}
              />  
              : dataArray.type == 'audio' ?
              <Accordion
                dataArray={dataArray.audio}
                animation={true}
                expanded={0}
                renderHeader={this._renderHeaderAudio}
                renderContent={this._renderContentAudio}
              /> 
              : dataArray.type == 'youtube' ?
              <Accordion
                dataArray={dataArray.youtube}
                animation={true}
                expanded={0}
                renderHeader={this._renderHeaderYoutube}
                renderContent={this._renderContentYoutube}
              /> 
              : dataArray.type == 'scorm' ?
              <Accordion
                dataArray={dataArray.scorm}
                animation={true}
                expanded={0}
                renderHeader={this._renderHeaderScorm}
                renderContent={this._renderContentScorm}
              /> 
              : dataArray.type == 'ebook' ?
              <Accordion
                dataArray={dataArray.ebook}
                animation={true}
                expanded={0}
                renderHeader={this._renderHeaderEbook}
                renderContent={this._renderContentEbook}
              /> 
              :
              <View/>
            :
            <View/>
          }

             <Modal
                visible={this.state.modalVisible}
                onBackdropPress={() => 
                  this.setState({modalVisible: false})
                }
              >
                  <View style={styles.modalView}>
                    <View style={{alignItems: 'center', marginBottom: 15}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20 }}>
                        {this.state.lang === "EN" ? "Edit note" : "แก้ไขโน๊ต"}
                      </Text>
                    </View>
                    <View>
                      <Textarea value={this.state.note_text} onChangeText={text => this.setState({note_text: text})} style={{backgroundColor: '#e6e6e6', borderRadius: 10}} rowSpan={5} placeholder={this.state.lang === "EN" ? "Message" : "ข้อความ"}/>
                    </View>

                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "#2196F3", marginTop: 20, marginLeft: 100, marginRight: 100 }}
                      onPress={this.submitEditNote.bind(this)}
                    >
                      <Text style={styles.textStyle}>{this.state.lang === "EN" ? "Save" : "บันทึก"}</Text>
                    </TouchableHighlight>
                  </View>
              </Modal>
          </View>

          <AwesomeAlert
            show={this.state.showAlertLearn}
            showProgress={false}
            icon="checkcircle"
            title={this.state.lang === "EN" ? "Passed" : "คุณเรียนผ่านแล้ว"}
            message={
              this.state.lang === "EN" ? "Back to lesson" : "กลับเข้าสู่บทเรียน"
            }
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            confirmText={this.state.lang === 'EN' ? 'OK' : 'ตกลง'}
            confirmButtonColor="#0099ff"
            onConfirmPressed={this.onConfirm}
          />

        </ScrollView>
      </SafeAreaView>
    );
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
  text: {
    fontSize: 18,
    color: "white",
    margin: 40
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    // marginLeft: Platform.OS == 'ios' ? Platform.isPad ? 100 : null : DeviceInfo.isTablet() ? 100 : null,
    // marginRight: Platform.OS == 'ios' ? Platform.isPad ? 100 : null : DeviceInfo.isTablet() ? 100 : null,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  child: {
    height: 300,
    width: '100%',
    justifyContent: 'center'
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoBenner: {
  width: '100%',
  // height: 173,
  height: HEIGHT / 3
},
});

export default function(props) {
  const navigation = useNavigation();
  return <Vdo {...props} navigation={navigation} />;
}


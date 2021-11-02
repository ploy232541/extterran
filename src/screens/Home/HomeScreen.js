import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  AsyncStorage,
  Linking,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SliderBox } from "react-native-image-slider-box";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-banner-carousel";
import MyProgramCard from "../../components/MyProgramCard";
import PublicRelationsCard from "../../components/PublicRelationsCard";
import FunctionHome from "../../components/FunctionHome";
import AutoHeightImage from "react-native-auto-height-image";
import { Video } from "expo-av";
import {
  FULLSCREEN_UPDATE_PLAYER_DID_DISMISS,
  FULLSCREEN_UPDATE_PLAYER_DID_PRESENT
} from "expo-av/build/Video";
import { httpClient } from "../../core/HttpClient";
import { WebView } from "react-native-webview";
import YoutubePlayer from "react-native-youtube-iframe";
import VideoPlayer from "expo-video-player";

import { AppLoading } from "expo";

// const vdo = require("../../video/benner_video.mp4");
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const HEIGHT_VIDEO = (Dimensions.get("window").width * 9) / 16;
//แก้ไขเวอร์ชัน
const mobileversion = 39;
var mobileversionshow = true;

const functionHomeList = [
  { id: 1, functionType: "guide" },
  { id: 2, functionType: "qa" },
  { id: 3, functionType: "download" },
  { id: 4, functionType: "library" }
  // { id: 5, functionType: "visited" },
];

const functionHome_renderItem = ({ item }) => {
  return (
    <View style={styles.programCardStyle}>
      <FunctionHome functionType={item.functionType} />
    </View>
  );
};
showyoutube = () => {
  return (
    <YoutubePlayer
      height={HEIGHT_VIDEO}
      width={WIDTH}
      videoId={video.link_path.replace("https://www.youtube.com/watch?v=", "")}
      play={false}
      volume={50}
      playbackRate={1}
      playerParams={{
        cc_lang_pref: "us",
        showClosedCaptions: true
      }}
    />
  );
};

const renderPage = (image, index) => {
  return (
    <TouchableOpacity
      onPress={() =>
        image.imgslide_link != null
          ? Linking.openURL(image.imgslide_link)
          : null
      }
    >
      <View key={index}>
        <Image
          resizeMode={"stretch"}
          style={{ width: "100%", height: 220 }}
          source={{ uri: image.url }}
        />
      </View>
    </TouchableOpacity>
  );
};

const _numColumns = 2;

function HomeScreen() {

  const navigation = useNavigation();
  const [lang, setLang] = useState("");
  const [course, setCourse] = useState([]);
  const [imageSlide, setImageSlide] = useState([]);
  const [video, setVideo] = useState(null);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countloading, setCountloading] = useState(0);

  const [mobile, setMobile] = useState([]);
  useEffect(() => {
    const run = async () => {
      try {
        let getLang = await AsyncStorage.getItem("language");
        let user_id = await AsyncStorage.getItem("userId");
        setLang(getLang);
        if (getLang === "EN") {
          var lang_id = "1";
        } else {
          var lang_id = "2";
        }

        httpClient
          .get(`/CourseOnline/getCourseOrgchart/${user_id}/${lang_id}`)
          .then((response) => {
            let res = response.data;
            setLoading(false);
            if (res != null) {
              setCourse(res);
            }
          })
          .catch((error) => {
            console.log(error);
          });

        httpClient
          .get(`/ImageSlide/getImageSlide/${lang_id}`)
          .then((response) => {
            let res = response.data;
            // console.log(res);
            if (res != null) {
              setImageSlide(res);
            }
          })
          .catch((error) => {
            console.log(error);
          });

        //    httpClient
        //     .get(`/Video/Limit/${lang_id}`)
        //     .then( async response => {
        //         setLoading(false)
        //       let res = await response.data;
        //       if (res != null) {
        //         setVideo(res)
        //       }
        //     })
        //     .catch(error => {
        //       console.log(error);
        //     });

        httpClient
          .get(`/News/Limit/${lang_id}`)
          .then((response) => {
            const res = response.data;
            if (res != null) {
              setNews(res);
            }
          })
          .catch((error) => {
            console.log(error);
          });
        httpClient
          .get(`/StatusMobile/checkstatus/`)
          .then((response) => {
            const res = response.data;
            if (res != null) {
              setMobile(res);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      }
    };
    run();
  }, []);

  public_renderItem = ({ item }) => {
    return (
      <View style={{ paddingTop: 12 }}>
        <PublicRelationsCard item={item} lang={lang} />
      </View>
    );
  };
  
    if (loading) {
      setTimeout(() => {
        setCountloading(countloading + 1);
      }, 1000);
      if (loading && countloading > 30) {
        return (
          <View style={{ backgroundColor: "#fff" }}>
            <AutoHeightImage
              style={{ width: "100%" }}
              source={require("../../asset/showdown.png")}
            />
          </View>
        );
      } else {
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActivityIndicator />
            </View>
          </SafeAreaView>
        );
      }
    }
    if (mobile.status_mobile == "y") {
      const { status_mobile, pathname, pic } = mobile;
   
      return (
        <View style={{ backgroundColor: "#fff" }}>
          <AutoHeightImage
            style={{ width: "100%" }}
            source={{ uri: `${pathname + pic}` }}
          />
        </View>
      );
    }
    if (mobile.version > mobileversion && mobileversionshow == true) {
      mobileversionshow = false;
      Alert.alert("กรุณาทำการอัพเดตเป็น version ล่าสุด ");
    }
 
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.background}>
          {/* Head Image on Home Screen */}
          <View style={styles.videoBenner}>
            {/* <Video
                    shouldPlay
                    isLooping
                    resizeMode="stretch"
                    source={vdo}
                    style={styles.mediaPlayer}
                    /> */}
            {/* <VideoPlayer
              videoProps={{
                shouldPlay: true,
                isLooping: true,
                resizeMode: "stretch",
                style: styles.mediaPlayer,
                source: vdo
              }}
            /> */}
            <AutoHeightImage
              resizeMode={"center"}
              style={{ width: "99%", height: "100%", alignSelf: "center" }}
              // source={require("../../asset/showdown.png")}
              source={require("../../asset/banner/banner.jpeg")}
            />
            {/* <Image
              resizeMode={"center"}
              style={{ width: "100%", height: "100%" }}
              // source={{ uri: `${pathname + pic}` }}
              source={require("../../asset/banner/banner.jpeg")}
            /> */}
          </View>

          <View style={styles.section}></View>

          {/* My Program */}
          <View style={styles.section}>
            <View style={styles.container_title}>
              <View style={styles.line} />
              <Text style={styles.title}>
                {lang == "EN" ? "Course" : "หลักสูตรของฉัน"}
              </Text>
              <View style={styles.line} />
            </View>
            <View style={styles.container_content}>
              <View
                style={{
                  paddingTop: 20
                }}
              >
                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {course.map((item) => {
                    return <MyProgramCard item={item} />;
                  })}
                </ScrollView>
              </View>
            </View>
          </View>

          {/* Information Board */}
          <View style={styles.section}>
            <View style={styles.container_title}>
              <View style={styles.line} />
              <Text style={styles.title}>
                {lang == "EN" ? "Advertising Board" : "ป้ายประชาสัมพันธ์"}
              </Text>
              <View style={styles.line} />
            </View>
            <View style={{ paddingTop: 20 }}>
              <Carousel autoplay autoplayTimeout={5000} loop index={0}>
                {imageSlide.map((image, index) => renderPage(image, index))}
              </Carousel>
            </View>
          </View>

          {/* Video Introduction */}
          <TouchableOpacity
            style={styles.section}
            onPress={() => navigation.navigate("VideoListScreen")}
          >
            <View style={styles.container_title}>
              <View style={styles.line} />
              <Text style={styles.title}>
                {lang == "EN" ? "Videos" : "วิดีโอแนะนำ"}
              </Text>
              <View style={styles.line} />
            </View>

            <View style={{ paddingTop: 20 }}>
              <Image
                // resizeMode={"center"}
                // style={{ width: "90%", height: "60%",alignSelf:"center"}}
                style={{
                  width: "99%",
                  height: HEIGHT / 4,
                  alignSelf: "center"
                }}
                // source={{ uri: `${pathname + pic}` }}
                source={require("../../asset/video-play.jpeg")}
              />
              {/* {
                          video != null ?
                            video.vdo_type === 'link' ?
                           เอาวีดีโอใส่ตรงนี้
                            :
                            <Video
                                source={{
                                    uri: video.link_path,
                                }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode='contain'
                                isLooping
                                useNativeControls
                                style={{ width: '90%', height: HEIGHT / 4, alignSelf:'center'}}
                            />
                         :
                         null
                        } */}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigation.navigate("VideoListScreen")}
              >
                <Text
                  style={{
                    color: "white",
                
                  }}
                >
                  {lang == "EN" ? "View" : "ดูทั้งหมด"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Public Relations */}
          <View style={styles.section}>
            <View style={styles.container_title}>
              <View style={styles.line} />
              <Text style={styles.title}>
                {lang == "EN" ? "News" : "ข่าวประชาสัมพันธ์"}
              </Text>
              <View style={styles.line} />
            </View>
            <View style={styles.container_content}>
              <View style={{ paddingTop: 8 }}>
                <FlatList
                  data={news}
                  renderItem={public_renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigation.navigate("NewsListScreen")}
              >
                <Text
                  style={{
                    color: "white",
              
                  }}
                >
                  {lang == "EN" ? "View" : "ดูทั้งหมด"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Function Home */}
          <View style={styles.section}>
            <View style={styles.container_content}>
              <View>
                <FlatList
                  data={functionHomeList}
                  renderItem={functionHome_renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={_numColumns}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }


const styles = StyleSheet.create({
  videoBenner: {
    width: "100%",
    // height: 173,
    height: HEIGHT / 4.5
  },
  mediaPlayer: {
    width: "100%",
    height: HEIGHT / 4.5,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  background: {
    backgroundColor: "white",
    flex: 1
  },
  container_title: {
    marginHorizontal: 24,
    flexDirection: "row"
  },
  container_content: {
    marginHorizontal: 24
  },
  line: {
    backgroundColor: "#0097fc",
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 18,
    paddingHorizontal: 5,

  },
  section: {
    backgroundColor: "#fff",
    paddingBottom: 30
  },
  buttonContainer: {
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 20,
    width: "30%",
    borderRadius: 4
  },
  buttonStyle: {
    backgroundColor: "#0097fc",
    padding: 8,
    alignItems: "center",
    borderRadius: 4
  },
  programCardStyle: {
    width: "48%",
    marginHorizontal: 4
  },
  image: {
    width: "100%",
    height: null,
    resizeMode: "cover"
  }
});

export default HomeScreen;

import * as React from "react";
import { Title, Card, Paragraph } from "react-native-paper";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import HTML from "react-native-render-html";
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
var decode = require("decode-html");

const openLink = (link) => {
  let decodeLink = JSON.parse(link);
  Linking.openURL(decodeLink[0]);
};

const NewsDetailScreen = (props) => {
  const title = props.route.params.title;
  const imgSrc = props.route.params.imgSrc;
  const details = props.route.params.details;
  const firstname = props.route.params.firstname;
  const firstname_en = props.route.params.firstname_en;
  const lang = props.route.params.lang;
  const date = props.route.params.date;
  const link = props.route.params.link;
  const [webViewHeight, setWebViewHeight] = React.useState(null);
  const onMessage = (event) => {
    setWebViewHeight(Number(event.nativeEvent.data));
  }

  const onShouldStartLoadWithRequest = (request) => { 
    if (request.navigationType === 'click') {
      // Open all new click-throughs in external browser.
      Linking.openURL(request.url);
      return false;
    }
    return true;
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, height: styles.header.height + webViewHeight }}>
      <View style={styles.header}>
      <Card style={styles.cardStyle}>
          <Card.Cover
            source={{
              uri:
                imgSrc != null
                  ? imgSrc
                  : "http://smartxlearning.com/themes/template/img/newspaper.jpg",
            }}
          />
          <Card.Content style={{ alignItems: "center"}}>
            <Title style={{ marginVertical: 20 }}>{title}</Title>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
               
              }}
            >
              <Icon name="md-calendar" size={20} />
              <Text style={{ marginLeft: 5 }}>
                {moment(date).format("DD/MM/YYYY")}
              </Text>
              <Icon name="md-person" size={20} style={{ marginLeft: 5 }} />
              <Text style={{ marginLeft: 5 }}>
                {lang === "EN" ? firstname_en : firstname}
              </Text>
            </View>
            {/* <Paragraph> */}
          
          </Card.Content>
          <Card.Content style={{ marginTop: 18 }}>
            {link != "" && link != null ? (
              <TouchableOpacity onPress={(e) => openLink(link)}>
                <Paragraph>
                  {lang === "EN" ? "More links" : "ลิ้งค์เพิ่มเติม"}
                </Paragraph>
              </TouchableOpacity>
            ) : null}
          </Card.Content>
        </Card>
        
      </View>
      <WebView
        source={{ html:decode(decode(details))}}
        bounces={true}
        scrollEnabled={false}
        onMessage={onMessage}
        injectedJavaScript="window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));"
        style={styles.content}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />

      
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  header: {
    marginBottom: 30,
    height: 320,
    justifyContent: 'center'    
  },
  content: {
margin:10,
  
  },
});

export default NewsDetailScreen;

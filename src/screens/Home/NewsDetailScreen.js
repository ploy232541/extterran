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
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import HTML from "react-native-render-html";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
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
  };
  let htmlsdecode = decode(decode(details));
  let htmls = `<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <style>
   
    ul {
      list-style:  none;
    }
</style>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  </head>
  <body>
  <div class="container-sm" style="margin:10">
  <br>
    <h6>${htmlsdecode}</h6>
</div>
    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
    -->
  </body>
</html>`;
  const onShouldStartLoadWithRequest = (request) => {
    if (request.navigationType === "click") {
      // Open all new click-throughs in external browser.
      Linking.openURL(request.url);
      return false;
    }
    return true;
  };
  if (details.includes("<iframe")) {
    return (
      <View style={styles.container}>
        {/* <ScrollView
                    
                    style={{ flex: 1, backgroundColor: "white" }}
                  > */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            height: styles.header.height + webViewHeight
          }}
        >
          <View style={styles.header}>
            <Card style={styles.cardStyle}>
              <Card.Cover
                source={{
                  uri:
                    imgSrc != null
                      ? imgSrc
                      : "http://smartxlearning.com/themes/template/img/newspaper.jpg"
                }}
              />
              <Card.Content style={{ alignItems: "center" }}>
                <Title style={{ marginVertical: 20 }}>{title}</Title>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 20
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
            source={{ html: htmlsdecode }}
            bounces={true}
            scrollEnabled={true}
            onMessage={onMessage}
            injectedJavaScript="window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));"
            style={styles.content}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            staticContentMaxWidth={Dimensions.get("window").width - 10}
            alterChildren={(node) => {
              if (node.name === "iframe" || node.name === "img") {
                delete node.attribs.width;
                delete node.attribs.height;
              }
              return node.children;
            }}
          />
        </ScrollView>
      </View>
    );
  } else if (details.includes("source")) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            height: styles.header.height + webViewHeight
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Card style={styles.cardStyle}>
              <Card.Cover
                source={{
                  uri:
                    imgSrc != null
                      ? imgSrc
                      : "http://smartxlearning.com/themes/template/img/newspaper.jpg"
                }}
              />
              <Card.Content style={{ alignItems: "center" }}>
                <Title style={{ marginVertical: 20 }}>{title}</Title>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 20
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
            source={{ html: htmls }}
            bounces={true}
            scrollEnabled={true}
            onMessage={onMessage}
            injectedJavaScript="window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));"
            style={styles.content}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            staticContentMaxWidth={Dimensions.get("window").width - 10}
            alterChildren={(node) => {
              if (node.name === "iframe" || node.name === "img") {
                delete node.attribs.width;
                delete node.attribs.height;
              }
              return node.children;
            }}
          />
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Card style={styles.cardStyle}>
            <Card.Cover
              source={{
                uri:
                  imgSrc != null
                    ? imgSrc
                    : "http://smartxlearning.com/themes/template/img/newspaper.jpg"
              }}
            />
            <Card.Content
              style={{ alignItems: "center", marginHorizontal: 40 }}
            >
              <Title style={{ marginVertical: 20 }}>{title}</Title>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 20
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

              <HTML
                html={decode(decode(details))}
                onLinkPress={(event, href) => {
                  Linking.openURL(href);
                }}
                ignoredStyles={["width", "height"]}
                tagsStyles={{ img: { flex: 1, alignSelf: "center" } }}
              />
              {/* </Paragraph> */}
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
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1"
  },
  header: {
    marginBottom: 30,
    height: 320,
    justifyContent: "center"
  },
  content: {
    margin: 10
  }
});

export default NewsDetailScreen;

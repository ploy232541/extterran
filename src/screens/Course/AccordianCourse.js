import { Button } from "native-base";
import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  AsyncStorage,
  Dimensions,
  Image,
} from "react-native";
import HTML from "react-native-render-html";
var decode = require("decode-html");
import Icon from "react-native-vector-icons/AntDesign";
const WIDTH = Dimensions.get("window").width;
export default class AccordianCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
      lang: "TH",
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    const res = AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN" });
    } else {
      this.setState({ lang: "TH" });
    }
  }

  render() {
    return (
      <View style={{ marginHorizontal: 10 }}>
        <TouchableOpacity
          ref={this.accordian}
          style={styles.row}
          onPress={() => this.toggleExpand()}
        >
          <Icon name={"plus"} size={16} color={"#fff"} />

          <Text style={[styles.title, styles.font]}>{this.props.title}</Text>


          <View style={{ flex: 0.2 }}>
            <Image
              // source={{ uri: item.lesson.image }}
              resizeMode="stretch"
              style={{ flex: 1, width: 90, height: 20, borderRadius: 3 }}
            />
          </View>

          <View style={{ flex: 0.8, alignItems: "flex-start" }}>
            <Text numberOfLines={1} style={{ marginLeft: 2, color: "#fff" }}>
              {" "}
              {/* {item.lesson.title} */}
            </Text>
          </View>
          <View style={{ alignItems: "flex-start", marginRight: 5 }}>
            <Button
              // disabled
              style={{
                backgroundColor: "#ff9900",
                height: 30,
                borderRadius: 5,
                padding: 5,
                alignSelf: "center",
              }}
              title="oj"
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>
                {this.state.lang === "EN" ? "Learning" : "กำลังเรียน"}
              </Text>
            </Button>
          </View>
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={{ flex: 1, padding: 10 }}>
            <View style={styles.child}>
              <Text>{this.state.lang == "EN" ? "Question" : "คำถาม"}:</Text>
              <View style={{ backgroundColor: "#87CEEB", borderRadius: 5 }}>
                <View style={{ padding: 20 }}>
                  <HTML
                    html={decode(this.props.qdata)}
                    ignoredStyles={["width", "height"]}
                    tagsStyles={{ img: { alignSelf: "center" } }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.child}>
              <Text>{this.state.lang == "EN" ? "Question" : "คำตอบ"}:</Text>
              <View style={{ backgroundColor: "#d9d9d9", borderRadius: 5 }}>
                <View style={{ padding: 20 }}>
                  <HTML
                    html={decode(this.props.data)}
                    ignoredStyles={["width", "height"]}
                    tagsStyles={{
                      img: {
                        alignSelf: "center",
                        width: WIDTH / 1.5,
                        alignItems: "center",
                        marginTop: 12,
                      },
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    // textAlign: "center",
  },

  //กรอบ
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: "center",
    backgroundColor: "#1E90FF",
  },
  parentHr: {
    height: 1,
    color: "#a94",
    width: "100%",
  },
  child: {
    backgroundColor: "#F0FFF0",
    padding: 16,
  },
  child1: {
    backgroundColor: "#B0E0E6",
    padding: 16,
  },
});

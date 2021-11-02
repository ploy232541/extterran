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
} from "react-native";
import HTML from "react-native-render-html";
var decode = require("decode-html");
import Icon from "react-native-vector-icons/MaterialIcons";
const WIDTH = Dimensions.get("window").width;
export default class Accordian extends Component {
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
          <Icon name={"help"} size={30} color={"#fff"} />
          <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
          <Icon
            name={
              this.state.expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
            }
            size={30}
            color={"#fff"}
          />
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
                    tagsStyles={{ img: { alignSelf: "center",width: WIDTH/1.5,alignItems:"center",marginTop: 12, } }}
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: "center",
    backgroundColor: "#2a3",
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

import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import HTML from "react-native-render-html";
var decode = require("decode-html");

export default class TabDetail extends Component {
  removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }
  render() {
    return (
      <View style={{ paddingTop: 10 }}>
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#f2f2f2"
            // height: 300,
          }}
        >
          {/* <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  > */}
          <HTML html={decode(decode(this.props.course_detail))} />
          {/* </ScrollView> */}
        </View>
      </View>
    );
  }
}

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Platform,
  Image,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import { Accordion, Button, Label, Textarea } from "native-base";
import { httpClient } from "../../core/HttpClient";
import { downloadFIle } from "../../utils/file";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";

export default class ModalFeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      listFeedBack: [],
      answer_text: "",
      upload_file: null
    };
  }

  async componentDidMount() {
    try {
      const supervisor_id = this.props.userId;
      const user_id = await AsyncStorage.getItem("userId");
      const res = await AsyncStorage.getItem("language");
      if (res === "EN") {
        this.setState({ lang: "EN" });
        var lang_id = "1";
      } else {
        this.setState({ lang: "TH" });
        var lang_id = "2";
      }

      httpClient
        .get(`/Team/getModelFeedBack/${user_id}/${supervisor_id}/${lang_id}`)
        .then((response) => {
          let res = response.data;
          // console.log(res)
          if (res != null) {
            this.setState({ listFeedBack: res });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async uploadFile() {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type == "success") {
      this.setState({ upload_file: result });
    }
  }

  async saveFeedback(feedback_id) {
    try {
      const { upload_file, answer_text } = this.state;
      const user_id = await AsyncStorage.getItem("userId");

      if (answer_text == "") {
        Alert.alert(
          this.state.lang == "EN" ? "Please enter answer." : "กรุณาใส่ คำตอบ"
        );
      } else {
        var params = {
          feedback_id: feedback_id,
          user_id: user_id,
          answer_text: answer_text
        };

        const data = new FormData();

        if (upload_file != null) {
          data.append("file", {
            name: upload_file.name,
            type: upload_file.type,
            uri: upload_file.uri
          });
        }

        Object.keys(params).forEach((key) => data.append(key, params[key]));

        httpClient
          .post("/Team/AnswerFeedback", data, {})
          .then((response) => {
            const result = response.data;
            if (result != null) {
              this.componentDidMount();
            } else {
              console.log("ส่งไม่สำเร็จ");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { listFeedBack, upload_file } = this.state;

    return (
      <View>
        <Modal
          visible={this.props.chkVisible}
          onBackdropPress={this.props.closeModal}
        >
          <View style={styles.modalView}>
            <View style={{ alignItems: "center", marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {this.state.lang === "EN" ? "Feedback" : "Feedback"}
              </Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {listFeedBack
                ? listFeedBack.map((data) => {
                    return (
                      <>
                        <View
                          style={{ alignItems: "flex-start", marginBottom: 5 }}
                        >
                          <Text style={{ fontSize: 16 }}>{data.user_ques}</Text>
                        </View>
                        <View
                          style={{ alignItems: "flex-start", marginBottom: 15 }}
                        >
                          <Text style={{ fontSize: 16 }}>
                            {this.state.lang === "EN"
                              ? "Course : "
                              : "หลักสูตร : "}{" "}
                            {data.course_name}
                          </Text>
                        </View>

                        <View
                          style={{ alignItems: "flex-start", marginBottom: 15 }}
                        >
                          <View
                            style={{
                              backgroundColor: "#d9d9d9",
                              padding: 20,
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text style={{ fontSize: 16, marginBottom: 10 }}>
                              {data.feedback_text}
                            </Text>
                            <Button
                              onPress={() =>
                                downloadFIle(data.file_url, data.file_name)
                              }
                              style={{
                                backgroundColor: "#4da6ff",
                                height: 30,
                                alignSelf: "center"
                              }}
                            >
                              <Icon
                                name="file1"
                                size={15}
                                style={{ marginLeft: 10 }}
                              />
                              <Text style={{ marginLeft: 3, marginRight: 10 }}>
                                {this.state.lang == "EN" ? "File" : "ไฟล์"}
                              </Text>
                            </Button>
                          </View>
                        </View>

                        {data.answer_text != null ? (
                          <>
                            <View style={{ alignItems: "flex-end" }}>
                              <Label style={{ fontSize: 16, marginBottom: 5 }}>
                                {data.user_ans}
                              </Label>
                              <View
                                style={{
                                  alignItems: "flex-start",
                                  marginBottom: 15
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#3399ff",
                                    padding: 20,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      marginBottom: 10,
                                      color: "#fff"
                                    }}
                                  >
                                    {data.answer_text}
                                  </Text>
                                  {data.answer_file_url != null ? (
                                    <Button
                                      onPress={() =>
                                        downloadFIle(
                                          data.answer_file_url,
                                          data.answer_file_name
                                        )
                                      }
                                      style={{
                                        backgroundColor: "#fff",
                                        height: 30,
                                        alignSelf: "center"
                                      }}
                                    >
                                      <Icon
                                        name="file1"
                                        size={15}
                                        style={{ marginLeft: 10 }}
                                      />
                                      <Text
                                        style={{
                                          marginLeft: 3,
                                          marginRight: 10
                                        }}
                                      >
                                        {this.state.lang == "EN"
                                          ? "File"
                                          : "ไฟล์"}
                                      </Text>
                                    </Button>
                                  ) : null}
                                </View>
                              </View>
                            </View>
                          </>
                        ) : (
                          <>
                            <View>
                              <Label style={{ fontSize: 16 }}>
                                {this.state.lang === "EN" ? "Answer" : "คำตอบ"}
                                <Label style={{ color: "red" }}>*</Label>
                              </Label>
                              <Textarea
                                value={this.state.note_text}
                                style={{
                                  backgroundColor: "#e6e6e6",
                                  borderRadius: 10
                                }}
                                rowSpan={2}
                                onChangeText={(text) =>
                                  this.setState({ answer_text: text })
                                }
                              />
                            </View>

                            <View style={{ marginTop: 10, marginBottom: 20 }}>
                              <Label style={{ fontSize: 16 }}>
                                {this.state.lang === "EN" ? "File" : "ไฟล์"}
                              </Label>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <View style={{ flex: 0.5 }}>
                                  <Button
                                    onPress={this.uploadFile.bind(this)}
                                    style={{
                                      backgroundColor: "#DCDCDC",
                                      height: 30
                                    }}
                                  >
                                    <Text
                                      style={{ marginLeft: 5, marginRight: 5 }}
                                    >
                                      {this.state.lang == "EN"
                                        ? "Choose File"
                                        : "เลือกไฟล์"}
                                    </Text>
                                  </Button>
                                </View>
                                <View style={{ flex: 1 }}>
                                  {upload_file ? (
                                    <Text>{upload_file.name}</Text>
                                  ) : null}
                                </View>
                              </View>
                            </View>

                            <Button
                              style={{ backgroundColor: "#2196F3" }}
                              onPress={this.saveFeedback.bind(
                                this,
                                data.feedback_id
                              )}
                            >
                              <Text style={styles.textStyle}>
                                {this.state.lang === "EN" ? "Reply" : "ตอบ"}
                              </Text>
                            </Button>
                          </>
                        )}

                        <View
                          style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "#e6e6e6",
                            marginTop: 15,
                            marginBottom: 20
                          }}
                        />
                      </>
                    );
                  })
                : null}
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <View style={{ marginLeft: 5 }}>
                <Button
                  style={{ backgroundColor: "#cc0000", marginTop: 20 }}
                  onPress={this.props.closeModal}
                >
                  <Text style={styles.textStyle}>
                    {this.state.lang === "EN" ? "Close" : "ปิด"}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    // marginLeft: Platform.OS == 'ios' ? Platform.isPad ? 100 : null : DeviceInfo.isTablet() ? 100 : null,
    // marginRight: Platform.OS == 'ios' ? Platform.isPad ? 100 : null : DeviceInfo.isTablet() ? 100 : null,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    height: 700,
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  openButton1: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -16,
    marginBottom: 16
  },
  contentText: {
    textAlign: "center",
    fontSize: 16
  },
  btn: {
    borderRadius: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: "stretch",
    backgroundColor: "#0099ff",
    marginTop: 16,
    minWidth: "50%",
    paddingHorizontal: 16
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  }
});

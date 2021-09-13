import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  AsyncStorage,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { httpClient } from "../../core/HttpClient";
import { Label, Button, Input, Textarea } from "native-base";
import { RadioButton, Checkbox } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DatePicker from "react-native-datepicker";
import * as DocumentPicker from "expo-document-picker";
import { number } from "prop-types";
import FormData from "form-data";
const HEIGHT = Dimensions.get("window").height;
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { AntDesign } from "@expo/vector-icons";
import { downloadFIle } from "../../utils/file";

export default class CourseScreenDetailOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      listData: [],
      selectCheckBox: {},
      checkBoxChoice: [],
      checkBoxArray: [],
      checkButton: null,
      filedAll: [],
      fileAll: [],

      ///state alert
      visible: false,
      icon: "",
      backgroundColorIcon: "",
      content: "",

      loading: null
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      this.setState({ loading: true });
      const { course_id, title, type } = this.props.route.params;
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
        .get(
          `/CourseOnline/getCourseOnlineOut/${course_id}/${user_id}/${lang_id}`
        )
        .then(async (response) => {
          const result = response.data;
          if (result != null) {
            this.setState({ listData: result });
            for (i in result) {
              value = result[i];
              if (value.button != undefined) {
                this.setState({ checkButton: value.button });
              }
            }
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  submitForm = async () => {
    const { course_id } = this.props.route.params;
    const user_id = await AsyncStorage.getItem("userId");
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      var lang_id = "1";
    } else {
      var lang_id = "2";
    }
    const { listData, checkBoxArray } = this.state;

    if (listData.length > 0) {
      let arr_field_id = [];
      let checkBoxName = null;
      let checkBoxRequired = null;
      let radioName = null;
      let radioRequired = null;
      for (i in listData) {
        value = listData[i];

        if (value.isInput) {
          if (value.isInput.input) {
            arr_field_id.push({
              field_id: value.isInput.input.field_id,
              required: value.isInput.input.required,
              field: "input",
              name_field: value.isInput.label.field_name
            });
          }
        } else if (value.isRadio) {
          if (value.isRadio.label) {
            radioName = value.isRadio.label.field_name;
            radioRequired = value.isRadio.label.required;
          }
          if (value.isRadio.radio) {
            let arr_chek = [];
            for (x in arr_field_id) {
              let chek_field_id = arr_field_id[x];
              arr_chek.push(chek_field_id.field_id);
            }

            if (!arr_chek.includes(value.isRadio.radio.field_id)) {
              arr_field_id.push({
                field_id: value.isRadio.radio.field_id,
                required: radioRequired,
                field: "radio",
                name_field: radioName
              });
            }
          }
        } else if (value.isTextarea) {
          if (value.isTextarea.textarea) {
            arr_field_id.push({
              field_id: value.isTextarea.textarea.field_id,
              required: value.isTextarea.textarea.required,
              field: "textarea",
              name_field: value.isTextarea.label.field_name
            });
          }
        } else if (value.isDate) {
          if (value.isDate.date) {
            arr_field_id.push({
              field_id: value.isDate.date.field_id,
              required: value.isDate.date.required,
              field: "date",
              name_field: value.isDate.label.field_name
            });
          }
        } else if (value.isFile) {
          if (value.isFile.file) {
            arr_field_id.push({
              field_id: value.isFile.file.field_id,
              required: value.isFile.file.required,
              field: "file",
              name_field: value.isFile.label.field_name
            });
          }
        } else if (value.isCheckbox) {
          if (value.isCheckbox.label) {
            checkBoxName = value.isCheckbox.label.field_name;
            checkBoxRequired = value.isCheckbox.label.required;
          }

          if (value.isCheckbox.checkbox) {
            let arr_chek = [];
            for (x in arr_field_id) {
              let chek_field_id = arr_field_id[x];
              arr_chek.push(chek_field_id.field_id);
            }
            if (!arr_chek.includes(value.isCheckbox.checkbox.field_id)) {
              arr_field_id.push({
                field_id: value.isCheckbox.checkbox.field_id,
                required: checkBoxRequired,
                field: "checkbox",
                name_field: checkBoxName
              });
            }
          }
        }
      }

      Alert.alert(
        this.state.lang == "EN" ? "Confirm the recording." : "ยืนยันการบันทึก",
        "",
        [
          {
            text: this.state.lang == "EN" ? "CANCEL" : "ยกเลิก",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: this.state.lang == "EN" ? "OK" : "ตกลง",
            onPress: () => {
              let dataAll = {};
              let check_required = true;
              if (arr_field_id.length > 0) {
                for (i in arr_field_id) {
                  value = arr_field_id[i];

                  if (value.field === "checkbox") {
                    if (value.required == "true") {
                      if (checkBoxArray.length == 0) {
                        check_required = false;
                        Alert.alert(
                          this.state.lang == "EN"
                            ? `Please enter ${value.name_field}.`
                            : `กรุณาใส่ ${value.name_field}`
                        );
                        break;
                      } else {
                        let boxArray =
                          checkBoxArray[`field_id_${value.field_id}`];
                        if (boxArray != undefined && boxArray.length != 0) {
                          dataAll[value.field_id] = boxArray;
                        } else {
                          check_required = false;
                          Alert.alert(
                            this.state.lang == "EN"
                              ? `Please enter ${value.name_field}.`
                              : `กรุณาใส่ ${value.name_field}`
                          );
                          break;
                        }
                      }
                    } else {
                      if (checkBoxArray) {
                        let boxArray =
                          checkBoxArray[`field_id_${value.field_id}`];
                        if (boxArray != undefined && boxArray.length != 0) {
                          dataAll[value.field_id] = boxArray;
                        }
                      }
                    }
                  } else if (value.field === "file") {
                    if (value.required == "true") {
                      if (
                        this.state[`field_id_${value.field_id}`] != undefined
                      ) {
                        if (
                          this.state[`field_id_${value.field_id}`].uri !=
                          undefined
                        ) {
                          let file = {
                            field_id: value.field_id,
                            name: this.state[`field_id_${value.field_id}`].name,
                            uri: this.state[`field_id_${value.field_id}`].uri
                          };

                          this.setState({
                            fileAll: [...this.state.fileAll, file]
                          });
                          dataAll[value.field_id] =
                            this.state[`field_id_${value.field_id}`].name;
                        }
                      } else {
                        check_required = false;
                        Alert.alert(
                          this.state.lang == "EN"
                            ? `Please enter ${value.name_field}.`
                            : `กรุณาใส่ ${value.name_field}`
                        );
                        break;
                      }
                    } else {
                      if (
                        this.state[`field_id_${value.field_id}`] != undefined
                      ) {
                        if (this.state[`field_id_${value.field_id}`].uri) {
                          let file = {
                            field_id: value.field_id,
                            name: this.state[`field_id_${value.field_id}`].name,
                            uri: this.state[`field_id_${value.field_id}`].uri
                          };

                          this.setState({
                            fileAll: [...this.state.fileAll, file]
                          });
                          dataAll[value.field_id] =
                            this.state[`field_id_${value.field_id}`].name;
                        }
                      }
                    }
                  } else {
                    if (value.required == "true") {
                      if (
                        this.state[`field_id_${value.field_id}`] != undefined
                      ) {
                        dataAll[value.field_id] =
                          this.state[`field_id_${value.field_id}`];
                      } else {
                        check_required = false;
                        Alert.alert(
                          this.state.lang == "EN"
                            ? `Please enter ${value.name_field}.`
                            : `กรุณาใส่ ${value.name_field}`
                        );
                        break;
                      }
                    } else {
                      if (
                        this.state[`field_id_${value.field_id}`] != undefined
                      ) {
                        dataAll[value.field_id] =
                          this.state[`field_id_${value.field_id}`];
                      }
                    }
                  }
                }
              }

              if (check_required == true) {
                let params = {
                  course_id: course_id,
                  user_id: user_id,
                  lang_id: lang_id,
                  fieldAll: dataAll
                };

                httpClient
                  .post(`/CourseOnline/saveCourseOnlineOut`, params)
                  .then(async (response) => {
                    const result = response.data;
                    if (result != true) {
                      this.uploadFileToServer(result);
                    } else {
                      this.setState({
                        visible: true,
                        icon: "check",
                        backgroundColorIcon: "green",
                        content:
                          this.state.lang == "EN" ? "Success." : "เรียบร้อย"
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  async uploadFileToServer(result) {
    const { fileAll } = this.state;
    if (result.length > 0) {
      for (i in result) {
        value = result[i];

        if (fileAll.length > 0) {
          for (j in fileAll) {
            val = fileAll[j];

            if (value.filed_id == val.field_id) {
              var params = {
                form_ans_id: value.form_ans_id
                // form_id: value.form_id
              };

              const data = new FormData();
              data.append("file", {
                name: val.name,
                uri: val.uri
              });

              Object.keys(params).forEach((key) =>
                data.append(key, params[key])
              );

              httpClient
                .post("/CourseOnline/CourseOutUploadFile", data, {})
                .then((response) => {
                  const result = response.data;
                  if (result == true) {
                    this.setState({
                      visible: true,
                      icon: "check",
                      backgroundColorIcon: "green",
                      content:
                        this.state.lang == "EN" ? "Success." : "เรียบร้อย"
                    });
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        }
      }
    }
  }

  onChangeInput = (text, field_id) => {
    const update = {};
    update["field_id_" + field_id] = text;
    this.setState(update);
  };

  onChangeTextarea = (text, field_id) => {
    const update = {};
    update["field_id_" + field_id] = text;
    this.setState(update);
  };

  onChangeRadio = (value, field_id) => {
    const update = {};
    update["field_id_" + field_id] = value;
    this.setState(update);
  };

  onChangeDate = (date, field_id) => {
    const update = {};
    update["field_id_" + field_id] = date;
    this.setState(update);
  };

  uploadFile = async (field_id) => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type == "success") {
      const update = {};
      update["field_id_" + field_id] = result;
      this.setState(update);
    }
  };

  removeValue = (arr, value) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        arr.splice(i, 1);
        break;
      }
    }
    return arr;
  };

  onChangeCheckbox = async (id, field_id) => {
    const checkCopy = { ...this.state.selectCheckBox };
    if (checkCopy[id]) checkCopy[id] = false;
    else checkCopy[id] = true;
    await this.setState({ selectCheckBox: checkCopy });

    if (this.state.selectCheckBox) {
      if (this.state.selectCheckBox[id] == true) {
        await this.setState({
          checkBoxChoice: [...this.state.checkBoxChoice, id]
        });
      } else {
        await this.removeValue(this.state.checkBoxChoice, id);
      }
      const param = {};
      param["field_id_" + field_id] = this.state.checkBoxChoice;
      this.setState({ checkBoxArray: param });
    }
  };

  closeAlert() {
    this.setState({ visible: false });
    this.fetchData();
  }

  render() {
    const { course_id, title, type } = this.props.route.params;
    const { listData, checkButton } = this.state;

    if (this.state.loading) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      );
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          backgroundColor: "#fff",
          borderWidth: 2,
          marginVertical: 18,
          marginHorizontal: 15,
          borderRadius: 12
        }}
      >
        <View style={{ flex: 1, padding: 30 }}>
          <Text style={{ fontSize: 20, alignSelf: "center", marginBottom: 20 }}>
            {" "}
            {title}{" "}
          </Text>
          {listData.map((data) => {
            return (
              <View style={{ marginBottom: 10 }}>
                {data.isInput ? ( ///////////////////input/////////////////////
                  <View style={styles.boxView}>
                    {data.isInput.label ? (
                      <Label style={styles.labels}>
                        {data.isInput.label.field_name}{" "}
                        {data.isInput.label.required == "true" ? (
                          <Label style={{ color: "red" }}>*</Label>
                        ) : null}
                      </Label>
                    ) : null}
                    {data.isInput.input ? (
                      <TextInput
                        style={[
                          styles.inputStyle,
                          {
                            backgroundColor:
                              data.isInput.input.checkInput != "" ||
                              data.isInput.input.text_dis != ""
                                ? "#d9d9d9"
                                : "#fff"
                          }
                        ]}
                        editable={
                          data.isInput.input.checkInput != "" ||
                          data.isInput.input.text_dis != ""
                            ? false
                            : true
                        }
                        onChangeText={(text) =>
                          this.onChangeInput(text, data.isInput.input.field_id)
                        }
                        value={
                          data.isInput.input.value
                            ? data.isInput.input.value
                            : this.state[
                                `field_id_${data.isInput.input.field_id}`
                              ]
                        }
                      />
                    ) : null}
                  </View>
                ) : data.isTextarea ? ( ///////////////////textarea/////////////////////
                  <View style={styles.boxView}>
                    {data.isTextarea.label ? (
                      <Label style={styles.labels}>
                        {data.isTextarea.label.field_name}{" "}
                        {data.isTextarea.label.required == "true" ? (
                          <Label style={{ color: "red" }}>*</Label>
                        ) : null}
                      </Label>
                    ) : null}

                    {data.isTextarea.textarea ? (
                      <Textarea
                        rowSpan={5}
                        bordered
                        style={{
                          borderRadius: 5,
                          backgroundColor:
                            data.isTextarea.textarea.disabled == "disabled"
                              ? "#d9d9d9"
                              : "#fff"
                        }}
                        disabled={
                          data.isTextarea.textarea.disabled == "disabled"
                            ? true
                            : false
                        }
                        onChangeText={(text) =>
                          this.onChangeTextarea(
                            text,
                            data.isTextarea.textarea.field_id
                          )
                        }
                        value={
                          data.isTextarea.textarea.value
                            ? data.isTextarea.textarea.value
                            : this.state[
                                `field_id_${data.isTextarea.textarea.field_id}`
                              ]
                        }
                      />
                    ) : null}
                  </View>
                ) : data.isRadio ? ( ///////////////////radio/////////////////////
                  <View style={styles.boxView}>
                    {data.isRadio.label ? (
                      <Label style={[styles.labels, { marginBottom: 5 }]}>
                        {data.isRadio.label.field_name}{" "}
                        {data.isRadio.label.required == "true" ? (
                          <Label style={{ color: "red" }}>*</Label>
                        ) : null}
                      </Label>
                    ) : null}
                    {data.isRadio.radio ? (
                      <View>
                        <RadioButton.Group
                          onValueChange={(value) =>
                            this.onChangeRadio(
                              value,
                              data.isRadio.radio.field_id
                            )
                          }
                          value={
                            this.state[
                              `field_id_${data.isRadio.radio.field_id}`
                            ]
                          }
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center"
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#e6e6e6",
                                borderRadius: 20,
                                marginBottom: 5,
                                marginRight: 10
                              }}
                            >
                              <RadioButton
                                disabled={
                                  data.isRadio.radio.disabled == "disabled"
                                    ? true
                                    : false
                                }
                                color="green"
                                value={data.isRadio.radio.value}
                                status={data.isRadio.radio.checked}
                              />
                            </View>
                            <View style={{ marginRight: 10 }}>
                              <Text>{data.isRadio.radio.label}</Text>
                            </View>
                          </View>
                        </RadioButton.Group>
                      </View>
                    ) : null}
                  </View>
                ) : data.isDate ? ( ///////////////////date/////////////////////
                  <View style={styles.boxView}>
                    {data.isDate.label ? (
                      <Label style={[styles.labels, { marginBottom: 5 }]}>
                        {data.isDate.label.field_name}{" "}
                        {data.isDate.label.required == "true" ? (
                          <Label style={{ color: "red" }}>*</Label>
                        ) : null}
                      </Label>
                    ) : null}

                    {data.isDate.date ? (
                      <View>
                        <DatePicker
                          disabled={
                            data.isDate.date.disabled == "disabled"
                              ? true
                              : false
                          }
                          style={styles.datePickerStyle}
                          date={
                            data.isDate.date.value != ""
                              ? data.isDate.date.value
                              : this.state[
                                  `field_id_${data.isDate.date.field_id}`
                                ]
                          }
                          mode="date"
                          placeholder="dd/mm/yyyy"
                          format="DD/MM/YYYY"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          onDateChange={(date) => {
                            this.onChangeDate(date, data.isDate.date.field_id);
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                ) : data.isFile ? ( ///////////////////file/////////////////////
                  <View>
                    {data.isFile.label ? (
                      <Label style={[styles.labels, { marginBottom: 5 }]}>
                        {data.isFile.label.field_name}{" "}
                        {data.isFile.label.required == "true" ? (
                          <Label style={{ color: "red" }}>*</Label>
                        ) : null}
                      </Label>
                    ) : null}
                    {data.isFile.sublabel ? (
                      <Label style={styles.sublabels}>
                        {data.isFile.sublabel.small}
                      </Label>
                    ) : null}

                    {data.isFile.file ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <View style={{ flex: 0.5 }}>
                            <Button
                              disabled={
                                data.isFile.file.disabled == "disabled"
                                  ? true
                                  : false
                              }
                              onPress={() =>
                                this.uploadFile(data.isFile.file.field_id)
                              }
                              style={{
                                backgroundColor: "#DCDCDC",
                                height: 30,
                                marginTop: 8
                              }}
                            >
                              <Text style={{ marginLeft: 5, marginRight: 5 }}>
                                {this.state.lang == "EN"
                                  ? "Choose File"
                                  : "เลือกไฟล์"}
                              </Text>
                            </Button>
                          </View>
                          <View style={{ flex: 1 }}>
                            {data.isFile.file.value != "" ? (
                              <Button
                                onPress={() =>
                                  downloadFIle(
                                    data.isFile.file.value,
                                    Date.now().toString()
                                  )
                                }
                                style={{
                                  backgroundColor: "#fff",
                                  height: 30,
                                  borderColor: "#3399ff",
                                  borderWidth: 1,
                                  marginTop: 8
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#3399ff",
                                    fontWeight: "bold",
                                    marginLeft: 10,
                                    marginRight: 10
                                  }}
                                >
                                  {this.state.lang == "EN"
                                    ? "Download file"
                                    : "ดาวน์โหลดไฟล์"}
                                </Text>
                              </Button>
                            ) : (
                              <Text>
                                {
                                  this.state[
                                    `field_id_${data.isFile.file.field_id}`
                                  ]?.name
                                }
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : data.isCheckbox ? ( ///////////////////checkbox/////////////////////
                  <View>
                    {data.isCheckbox.label ? (
                      <Label style={[styles.labels, { marginBottom: 5 }]}>
                        {data.isCheckbox.label.field_name}{" "}
                        {data.isCheckbox.label.required == "true" ? (
                          <Label style={{ color: "red" }}>*</Label>
                        ) : null}
                      </Label>
                    ) : null}
                    {data.isCheckbox.checkbox ? (
                      <View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              borderRadius: 5,
                              marginBottom: 5,
                              marginRight: 10,
                              //   borderColor: "#e6e6e6",
                              borderColor: "black",
                              borderWidth: 2
                            }}
                          >
                            <Checkbox
                              onPress={() =>
                                this.onChangeCheckbox(
                                  data.isCheckbox.checkbox.value,
                                  data.isCheckbox.checkbox.field_id
                                )
                              }
                              disabled={
                                data.isCheckbox.checkbox.disabled == "disabled"
                                  ? true
                                  : false
                              }
                              color="green"
                              value={
                                this.state.selectCheckBox[
                                  data.isCheckbox.checkbox.value
                                ]
                              }
                              status={
                                data.isCheckbox.checkbox.checked == "checked"
                                  ? "checked"
                                  : this.state.selectCheckBox[
                                      data.isCheckbox.checkbox.value
                                    ] == true
                                  ? "checked"
                                  : "unchecked"
                              }
                            />
                          </View>
                          <View style={{ marginRight: 10 }}>
                            <Text>{data.isCheckbox.checkbox.label}</Text>
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })}
          <View style={{ flex: 1, alignSelf: "center" }}>
            <Button
              disabled={checkButton}
              onPress={this.submitForm}
              style={{
                backgroundColor: "green",
                height: 40,
                marginTop: 8,
                marginBottom: 8
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  marginLeft: 10,
                  marginRight: 10
                }}
              >
                {this.state.lang == "EN" ? "Submit" : "บันทึก"}
              </Text>
            </Button>
          </View>
        </View>

        <FancyAlert
          visible={this.state.visible}
          icon={
            <View
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: this.state.backgroundColorIcon,
                borderRadius: 50,
                width: "100%"
              }}
            >
              <AntDesign name={this.state.icon} size={36} color="#FFFFFF" />
            </View>
          }
          style={{ backgroundColor: "white" }}
        >
          <View style={styles.content}>
            <Text style={styles.contentText}>{this.state.content}</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={this.closeAlert.bind(this)}
            >
              <Text style={styles.btnText}>
                {this.state.lang == "EN" ? "OK" : "ตกลง"}
              </Text>
            </TouchableOpacity>
          </View>
        </FancyAlert>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  boxView: {
    marginBottom: 10
  },
  inputStyle: {
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#cccccc",
    borderWidth: 1
  },
  textareaStyle: {
    borderRadius: 5,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#cccccc",
    borderWidth: 1
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center"
  },
  datePickerStyle: {
    width: "100%",
    borderRadius: 5
  },
  labels: {
    fontSize: 16
  },
  sublabels: {
    color: "gray",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 5
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

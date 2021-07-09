import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker, Tab } from "native-base";
import { Avatar } from "react-native-paper";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { set } from "react-native-reanimated";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HomeScreen from "../Home/HomeScreen";
import MyProgramsScreen from "../MyProgramsScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import { Alert } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";
import Icons from "react-native-vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import HTML from "react-native-render-html";
import { Rows, Table } from "react-native-table-component";
import FormData from "form-data";

let dimensions = Dimensions.get("window");
let pickerWidth = dimensions.width - 56;
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

export default class ExternalScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUser: "กรุณาเลือกผู้ใช้",
      course: "กรุณาเลือกหลักสูตร",
      trainingNeedItem: {
        employee_id: "",
        data: [],
      },
      courseItem: {
        courseName: "",
        trainingProvider: "",
        trainingPurpose: "",
        startDate: "DD/MM/YYYY",
        price: "",
        other: "",
        upload_file: null,
      },

      isDatePickerVisible: false,
      trainingNeed: [],
      empList: [],
      purposeList: [],
      startDate: "DD/MM/YYYY",

      tem: -1,
      dateIndex: -1,
      dateI: -1,
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN", lang_id: 1 });
    } else {
      this.setState({ lang: "TH", lang_id: 2 });
    }
    try {
      httpClient
        .get(`/Training/EmployeeTrainingNeed/${id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              empList: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/TrainingNeedPurpose/`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              purposeList: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
     console.log(error);
    }
  }

  formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  showDatePicker = (index, i) => {
    this.setState({ isDatePickerVisible: true, dateIndex: index, dateI: i });
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleConfirm = (date) => {
    var date = this.formatDate(date);
    let trainingNeed = [...this.state.trainingNeed];

    let item = { ...trainingNeed[this.state.dateIndex] };
    let data = { ...item["data"] };
    let param = data[this.state.dateI];
    param.startDate = date;
    data[this.state.dateI] = param;
    trainingNeed[this.state.dateIndex] = item;
    var id = "Id of subbrands to remove: ";
    //ลบ key ส่วนเกินออก
    trainingNeed.forEach(function (o) {
      o.data = o.data.filter((s) => s.id != id);
    });

    this.setState({
      trainingNeed: trainingNeed,
    });

    this.hideDatePicker();
  };

  culDate = (startcul, endcul) => {
    let date1 = new Date(startcul);
    let date2 = new Date(endcul);
    this.setState({
      total: "0",
    });
    if (date2 >= date1) {
      let diffInMs = Math.abs(date2 - date1);
      let totals = diffInMs / (1000 * 60 * 60 * 24) + 1;
      this.setState({
        total: totals.toString(),
      });
    }
  };

  deleteCourse(index, i) {
    let trainingNeed = [...this.state.trainingNeed];
    let item = { ...trainingNeed[index] };
    let data = item["data"];
    data.splice(i, 1);
    item["data"] = data;
    trainingNeed[index] = item;
    this.setState({ trainingNeed: trainingNeed });
  }

  deleteEmployee(index) {
    let itemCopy = [...this.state.trainingNeed];
    itemCopy.splice(index, 1);
    this.setState({ trainingNeed: itemCopy });
  }
  addCourse(index) {
    let trainingNeed = [...this.state.trainingNeed];
    let item = { ...trainingNeed[index] };

    let data = [...item["data"], this.state.courseItem];
    item["data"] = data;
    trainingNeed[index] = item;

    this.setState({ trainingNeed: trainingNeed });
  }

  async uploadFile(index, i) {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type == "success") {
      let trainingNeed = [...this.state.trainingNeed];

      let item = { ...trainingNeed[index] };
      let data = { ...item["data"] };
      let param = data[i];
      param.upload_file = result;
      data[i] = param;
      trainingNeed[index] = item;
      var id = "Id of subbrands to remove: ";
      //ลบ key ส่วนเกินออก
      trainingNeed.forEach(function (o) {
        o.data = o.data.filter((s) => s.id != id);
      });
      console.log(trainingNeed);
      this.setState({
        trainingNeed: trainingNeed,
      });
    }
  }
  onPressSend() {
    const { trainingNeed } = this.state;
    if (trainingNeed.length <= 0) {
      Alert.alert("กรุณาเพิ่มพนักงานอย่างน้อย 1 รายการ");
    } else {
      let index = 0;
      let error = false;
      let trainingNeed = [...this.state.trainingNeed];

      do {
        let item = { ...trainingNeed[index] };
        let data = item.data;
        error = true;
        if (item.employee_id == "" || item.employee_id == null) {
          Alert.alert("กรุณาเลือกพนักงาน \n ช่องที่ " + (index + 1));
        } else {
          let i = 0;
          if (data.length > 0) {
            do {
              error = true;
              let param = data[i];
              if (param.courseName == null || param.courseName == "") {
                Alert.alert(
                  "กรุณากรอกชื่อหลักสูตร \n ช่องที่ " +
                    (index + 1) +
                    "\n ลำดับที่ " +
                    (i + 1)
                );
              } else if (
                param.trainingProvider == null ||
                param.trainingProvider == ""
              ) {
                Alert.alert(
                  "กรุณาเพิ่มผู้ให้บริการฝึกอบรม \n ช่องที่ " +
                    (index + 1) +
                    "\n ลำดับที่ " +
                    (i + 1)
                );
              } else if (
                param.trainingPurpose == null ||
                param.trainingPurpose == ""
              ) {
                Alert.alert(
                  "กรุณาเลือกวัตถุประสงค์ \n ช่องที่ " +
                    (index + 1) +
                    "\n ลำดับที่ " +
                    (i + 1)
                );
              } else if (param.startDate == "DD/MM/YYYY") {
                Alert.alert(
                  "กรุณาใส่วันที่ \n ช่องที่ " +
                    (index + 1) +
                    "\n ลำดับที่ " +
                    (i + 1)
                );
              } else if (param.price == null || param.price == "") {
                Alert.alert(
                  "กรุณาเพิ่มราคา \n ช่องที่ " +
                    (index + 1) +
                    "\n ลำดับที่ " +
                    (i + 1)
                );
              } else if (param.upload_file == null || param.upload_file == "") {
                Alert.alert(
                  "กรุณาแนบไฟล์ \n ช่องที่ " +
                    (index + 1) +
                    "\n ลำดับที่ " +
                    (i + 1)
                );
              } else {
                error = false;
              }

              i++;
            } while (i < data.length && error == false);
          } else {
            Alert.alert(
              "กรุณาเพิ่มคอสเรียนอย่างน้อย 1 รายการ ในช่องที่ " + (index + 1)
            );
          }
        }

        index++;
      } while (index < trainingNeed.length && error == false);
      if (error == false) {
        const data = new FormData();

        Object.keys(trainingNeed).forEach((key) =>
          data.append(key, trainingNeed[key])
        );
        Alert.alert(
          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
          this.state.lang === "EN" ? "Confirm" : "ยืนยัน",
          [
            {
              text: this.state.lang === "EN" ? "CANCEL" : "ยกเลิก",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            ,
            {
              text: this.state.lang === "EN" ? "OK" : "ตกลง",
              onPress: () => {
                httpClient
                  .post("/Training/InsertTrainingNeedsExternal", data)
                  .then((response) => {
                    const result = response.data;
                    if (result === true) {
                      Alert.alert(
                        this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                        this.state.lang === "EN"
                          ? "Training request sent"
                          : "ส่งคำขอฝึกอบรมเรียบร้อยแล้ว",
                        [
                          {
                            text: this.state.lang === "EN" ? "OK" : "ตกลง",
                            onPress: () => this.reset(),
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      Alert.alert(
                        this.state.lang === "EN"
                          ? `Training request failed`
                          : "ไม่สามารถส่งคำร้องขอฝึกอบรมได้"
                      );
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              },
            },
          ]
        );
      }
    }
  }
  render() {
    return (
      <View style={styles.background}>
        <ScrollView>
          <View style={styles.textHeader}>
            <Text style={{ color: "#333333", fontSize: "24" }}>
              Training Needs - External
            </Text>
          </View>

          {/* <Divider style={{ paddingBottom: 1, marginTop: 15 }} /> */}
          <View
            style={{
              marginVertical: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
            <Avatar.Icon
              icon="arrow-down"
              size={30}
              style={styles.arrowDownStyle}
            />
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
          </View>

          {/* Start Card by aek*/}
          {/* จะทำการแสดงพนักงาน */}
          {this.state.trainingNeed.map((Item, index) => {
            //เริ่มทำกอปปี้พนักงาน
            // excludeEmployees คือก็อปปี้ไอดีพนักงาน
            let excludeEmployees = [];
            // วนบันทึกไอดีไปเรื่อยๆ ยกเว้นไอดีของของตัวเอง
            for (let i = 0; i < this.state.trainingNeed.length; i++) {
              if (i != index) {
                excludeEmployees.push(this.state.trainingNeed[i].employee_id);
              }
            }
            // ลูปข้อมูล พนักงาน employeeId ว่ามีไหม เครื่องหมาย ! เปลี่ยนจากเจอเป็นไม่เจอ เมื่อไม่เจอมันจะทำการใส่ employee ใน listEmployees
            let listEmployees = [];
            for (let i = 0; i < this.state.empList.length; i++) {
              let employee = this.state.empList[i];
              let employeeId = employee.user_id;
              // เช็คว่ามี
              if (!excludeEmployees.includes(employeeId)) {
                listEmployees.push(employee);
              }
            }
            // จบ การกอปปี้พนักงาน
            return (
              <View>
                <ScrollView>
                  <View style={styles.containerSec2}>
                    <View style={styles.contentInSec}>
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-around",
                          paddingHorizontal: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text style={styles.textStyle1}>
                          {this.state.lang === "EN"
                           ? "Employee Name No."+ (index + 1)
                            : "ชื่อพนักงานคนที่ " + (index + 1)}
                        </Text>

                        <View>
                          <Picker
                            mode="dropdown"
                            iosIcon={
                              <Icon
                                name="angle-down"
                                style={{ width: "8%", paddingHorizontal: 2 }}
                              />
                            }
                            style={styles.inputLightStyle}
                            placeholder={
                              this.state.lang === "EN"
                                ? "Selecte"
                                : "เลือกพนักงาน"
                            }
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={
                              Item.employee_id ? Item.employee_id : ""
                            }
                            // onBlur={() => {
                            //   // this.updateEmployees()
                            //   this.setState({
                            //     trainingNeed: this.state.trainingNeed,
                            //   });
                            // }}
                            onValueChange={(text) => {
                              let trainingNeed = [...this.state.trainingNeed];
                              let item = { ...trainingNeed[index] };
                              item.employee_id = text;
                              trainingNeed[index] = item;
                              this.setState({ trainingNeed: trainingNeed });
                            }}
                            textStyle={{ fontSize: 14 }}
                          >
                            <Picker.Item
                              label={
                                this.state.lang === "EN"
                                  ? "Please select "
                                  : "กรุณาเลือก"
                              }
                              value=""
                            />

                            {listEmployees.map((element, l) => {
                              return (
                                <Picker.Item
                                  label={
                                    this.state.lang === "EN"
                                      ? element.firstname_en +
                                        " " +
                                        element.lastname_en
                                      : element.firstname +
                                        " " +
                                        element.lastname
                                  }
                                  value={element.user_id}
                                />
                              );
                            })}
                          </Picker>
                        </View>
                      </View>

                      <Divider
                        style={{
                          paddingBottom: 1,
                          marginTop: 10,
                          backgroundColor: "#398DDD",
                        }}
                      />
                      

                      {Item.data.map((param, i) => {
                        return (
                          <View style={{ marginTop: 24 }}>
                            <View style={styles.containerSec3}>
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "space-around",
                                  paddingHorizontal: 10,
                                  // marginBottom: 8,
                                }}
                              >
                                <Text style={styles.textStyle1}>
                                  {this.state.lang === "EN"
                                  ? "Employee Name No."+ (index + 1)
                                    : "พนักงานคนที่ " +
                                      (index + 1) +
                                      " คอสเรียนที่ " +
                                      (i + 1)}
                                </Text>
                                <TextInput
                                  style={styles.inputStyle4}
                                  placeholder={
                                    this.state.lang === "EN"
                                      ? "Course Name"
                                      : "ชื่อหลักสูตร"
                                  }
                                  value={param.courseName}
                                  onChangeText={(text) => {
                                    let trainingNeed = [
                                      ...this.state.trainingNeed,
                                    ];

                                    let item = { ...trainingNeed[index] };
                                    let data = { ...item["data"] };
                                    let param = data[i];
                                    param.courseName = text;
                                    data[i] = param;
                                    trainingNeed[index] = item;
                                    var id = "Id of subbrands to remove: ";
                                    //ลบ key ส่วนเกินออก
                                    trainingNeed.forEach(function (o) {
                                      o.data = o.data.filter((s) => s.id != id);
                                    });

                                    this.setState({
                                      trainingNeed: trainingNeed,
                                    });
                                  }}
                                ></TextInput>

                                <TextInput
                                  style={styles.inputStyle4}
                                  placeholder={
                                    this.state.lang === "EN"
                                      ? "Training Provider"
                                      : "ผู้ให้บริการฝึกอบรม"
                                  }
                                  value={param.trainingProvider}
                                  onChangeText={(text) => {
                                    let trainingNeed = [
                                      ...this.state.trainingNeed,
                                    ];

                                    let item = { ...trainingNeed[index] };
                                    let data = { ...item["data"] };
                                    let param = data[i];
                                    param.trainingProvider = text;
                                    data[i] = param;
                                    trainingNeed[index] = item;
                                    var id = "Id of subbrands to remove: ";
                                    //ลบ key ส่วนเกินออก
                                    trainingNeed.forEach(function (o) {
                                      o.data = o.data.filter((s) => s.id != id);
                                    });

                                    this.setState({
                                      trainingNeed: trainingNeed,
                                    });
                                  }}
                                ></TextInput>

                                <View>
                                  <Picker
                                    mode="dropdown"
                                    iosIcon={
                                      <Icon
                                        name="angle-down"
                                        style={{
                                          width: "8%",
                                          paddingHorizontal: 2,
                                        }}
                                      />
                                    }
                                    style={styles.inputLightStyle}
                                    placeholder={
                                      this.state.lang === "EN"
                                        ? "Selecte a purpose"
                                        : "เลือกจุดประสงค์"
                                    }
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={param.trainingPurpose}
                                    onValueChange={(text) => {
                                      let trainingNeed = [
                                        ...this.state.trainingNeed,
                                      ];

                                      let item = { ...trainingNeed[index] };
                                      let data = { ...item["data"] };
                                      let param = data[i];
                                      param.trainingPurpose = text;
                                      data[i] = param;
                                      trainingNeed[index] = item;
                                      var id = "Id of subbrands to remove: ";
                                      //ลบ key ส่วนเกินออก
                                      trainingNeed.forEach(function (o) {
                                        o.data = o.data.filter(
                                          (s) => s.id != id
                                        );
                                      });
                                      this.setState({
                                        trainingNeed: trainingNeed,
                                      });
                                    }}
                                    textStyle={{ fontSize: 14 }}
                                  >
                                    <Picker.Item
                                      label={
                                        this.state.lang === "EN"
                                          ? "Please select a purpose"
                                          : "กรุณาเลือกจุดประสงค์"
                                      }
                                      value=""
                                    />
                                    {this.state.purposeList.map((data) => {
                                      return (
                                        <Picker.Item
                                          label={
                                            this.state.lang === "EN"
                                              ? data.purpose_en
                                              : data.purpose_th
                                          }
                                          value={data.id}
                                        />
                                      );
                                    })}
                                  </Picker>
                                </View>

                                <View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showDatePicker(index, i)
                                    }
                                  >
                                    <View style={styles.inputStyle5}>
                                      <Text style={{ color: "#bfc6ea" }}>
                                        {param.startDate}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>

                                <TextInput
                                  style={styles.inputStyle4}
                                  placeholder={
                                    this.state.lang === "EN"
                                      ? "Training Cost"
                                      : "ราคา"
                                  }
                                  value={param.price}
                                  onChangeText={(text) => {
                                    let trainingNeed = [
                                      ...this.state.trainingNeed,
                                    ];

                                    let item = { ...trainingNeed[index] };
                                    let data = { ...item["data"] };
                                    let param = data[i];
                                    param.price = text;
                                    data[i] = param;
                                    trainingNeed[index] = item;
                                    var id = "Id of subbrands to remove: ";
                                    //ลบ key ส่วนเกินออก
                                    trainingNeed.forEach(function (o) {
                                      o.data = o.data.filter((s) => s.id != id);
                                    });

                                    this.setState({
                                      trainingNeed: trainingNeed,
                                    });
                                  }}
                                ></TextInput>

                                <TextInput
                                  style={styles.inputStyle4}
                                  placeholder={
                                    this.state.lang === "EN" ? "Other" : "อื่นๆ"
                                  }
                                  value={param.other}
                                  onChangeText={(text) => {
                                    let trainingNeed = [
                                      ...this.state.trainingNeed,
                                    ];

                                    let item = { ...trainingNeed[index] };
                                    let data = { ...item["data"] };
                                    let param = data[i];
                                    param.other = text;
                                    data[i] = param;
                                    trainingNeed[index] = item;
                                    var id = "Id of subbrands to remove: ";
                                    //ลบ key ส่วนเกินออก
                                    trainingNeed.forEach(function (o) {
                                      o.data = o.data.filter((s) => s.id != id);
                                    });

                                    this.setState({
                                      trainingNeed: trainingNeed,
                                    });
                                  }}
                                ></TextInput>

                                <View>
                                  <Text style={styles.textInputEng}>
                                    File :
                                  </Text>
                                  <Text style={styles.textInputThai}>
                                    แนบไฟล์
                                  </Text>
                                  <View
                                    style={{ marginTop: 5, marginBottom: 20 }}
                                  >
                                    <Button
                                      style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        backgroundColor: "#4392de",
                                        height: HEIGHT / 18,
                                        // width: "20%",
                                        marginTop: 10,
                                        marginBottom: 10,
                                        borderColor: "#4392de",
                                      }}
                                      onPress={this.uploadFile.bind(
                                        this,
                                        index,
                                        i
                                      )}
                                    >
                                      <Text
                                        style={{
                                          marginHorizontal: 8,
                                          color: "white",
                                        }}
                                      >
                                        {this.state.lang == "EN"
                                          ? "Choose File"
                                          : "เลือกไฟล์"}
                                      </Text>
                                    </Button>

                                    <View
                                      style={{
                                        flex: 1,
                                        marginTop: 20,
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      {param.upload_file ? (
                                        <Text style={{ color: "red" }}>
                                          {param.upload_file.name}
                                        </Text>
                                      ) : null}
                                    </View>
                                  </View>
                                </View>

                                <Divider
                                  style={{
                                    paddingBottom: 1,

                                    marginBottom: 4,
                                    marginTop: 10,
                                  }}
                                />
                              </View>

                              <DateTimePickerModal
                                isVisible={this.state.isDatePickerVisible}
                                mode="date"
                                locale={this.state.lang === "EN" ? "en" : "th"}
                                onConfirm={this.handleConfirm}
                                onCancel={this.hideDatePicker}
                              />

                              <View style={styles.pickerContainer2}>
                                <TouchableOpacity
                                  style={styles.addButton}
                                  onPress={() => this.addCourse(index)}
                                >
                                  <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.deleteButton}
                                  onPress={() => this.deleteCourse(index, i)}
                                >
                                  <Text style={styles.addButtonText}>-</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                      {/* จบกรอบใน */}
                    </View>

                    <Button
                      mode="contained"
                      style={styles.btnDelCard}
                      onPress={() => this.deleteEmployee(index)}
                    >
                      <Icons
                        name="md-remove-circle"
                        size={20}
                        style={{
                          marginLeft: 10,
                          marginRight: 5,
                          color: "white",
                        }}
                      />
                      <Text
                        style={{
                          color: "white",
                          marginRight: 10,
                          fontSize: 14,
                        }}
                      >
                        {this.state.lang === "EN" ? "Delete" : "ลบ"}
                      </Text>
                    </Button>
                  </View>
                  {/* End กรอบนอก&กรอบใน */}
                </ScrollView>
              </View>
            );
          })}

          {/* <Button style={styles.submitButton}>
            <Text style={{ color: "#fff" }}>Submit</Text>
          </Button> */}
          <View>
            {/* เมื่อกดปุ่มนี้จะทำการเพิ่มพนักงาน */}
            <Button
              style={styles.btnStyle1}
              onPress={() => {
                let trainingNeedItem = this.state.trainingNeedItem;
                trainingNeedItem["data"] = [
                  {
                    courseName: "",
                    trainingProvider: "",
                    trainingPurpose: "",
                    startDate: "DD/MM/YYYY",
                    price: "",
                    other: "",
                    upload_file: null,
                  },
                ];
                let trainingNeed = [
                  ...this.state.trainingNeed,
                  trainingNeedItem,
                ];
                this.setState({
                  trainingNeed: trainingNeed,
                });
              }}
            >
              <Icon name="user-plus" color="#fff" size="26" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {this.state.lang === "EN" ? "Add Employee" : "เพิ่มพนักงาน"}
              </Text>
            </Button>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 20,
              marginBottom: 40,
            }}
          >
            <View style={styles.buttonContainer}>
              <Button
                style={styles.btnConfirmStyle}
                onPress={() => this.onPressSend()}
              >
                <Text style={{ color: "white" }}>
                  {this.state.lang === "EN" ? "Submit" : "ยืนยัน"}
                </Text>
              </Button>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                style={styles.btnCancelStyle}
                onPress={() => this.setState({ trainingNeed: [] })}
              >
                <Text style={{ color: "white" }}>
                  {this.state.lang === "EN" ? "Cancle" : "ยกเลิก"}
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: 500,
    marginHorizontal: WIDTH / 20,
    marginVertical: HEIGHT / 36,
  },
  //กรอบข้อมูล
  containerSec2: {
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD",
    marginHorizontal: 10,
    marginBottom: 24,
  },
  textHeader: {
    alignItems: "center",
    padding: 15,
  },
  //ชื่อหัวข้อ
  textStyle1: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  cardStyle: {
    marginVertical: 100,
    //marginTop: 12,
  },
  /// picker styles
  userPickerStyles: {
    width: pickerWidth,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 14,
    // marginVertical: 24,
    height: 60,
  },
  coursePickerStyles: {
    //height: 10,
    width: pickerWidth - 56,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    marginHorizontal: 16,
  },
  ///กรอบเพิ่มข้อมูล
  pickerContainer: {
    flexDirection: "row",
    marginVertical: 1,
    marginTop: 5,
    marginBottom: 12,
    marginLeft: 1,
    marginRight: -95,
  },
  pickerContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    marginBottom: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 5,
    marginTop: -2,
    marginLeft: 1,
  },
  /// add button
  addButton: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4392de",
    width: 36,
    height: 36,
    marginLeft: 10,
    marginRight: 8,
    marginTop: 5,
  },
  /// del button
  deleteButton: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: 36,
    height: 36,
    marginLeft: 8,
    marginRight: 2,
    marginTop: 5,
  },
  containerSec1: {
    marginHorizontal: 20,
  },
  containerSec3: {
    // width: "95%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999998",
    marginHorizontal: 10,
    // marginRight: 8,
    // marginLeft: 10,
  },
  contentInSec: {
    padding: 2,
  },
  btnStyle1: {
    height: 45,
    backgroundColor: "#4392de",
    marginLeft: 12,
    marginRight: 12,
    // marginTop: 5,
    width: "60%",
    alignSelf: "center",
    borderRadius: 10,
  },
  submitButton: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#3BB54A",
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  input1: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    marginHorizontal: 8,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    marginHorizontal: 8,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  btnDelCard: {
    backgroundColor: "#b30000",
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 20,
    width: "100%",
    marginTop: 15,
    marginBottom: 2,
    borderColor: "#007aff",
  },
  inputStyle4: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#007aff",
    height: HEIGHT / 20,
    marginTop: 15,
    paddingLeft: 10,
    marginBottom: 2,
  },
  inputStyle5: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#007aff",
    height: HEIGHT / 20,
    marginTop: 15,
    paddingLeft: 10,
    marginBottom: 2,
    justifyContent: "center",
  },
  buttonContainer: {
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 20,
    width: "30%",
    borderRadius: 4,
  },
  buttonContainer1: {
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 20,
    width: "20%",
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 18,
  },
  btnConfirmStyle: {
    backgroundColor: "#449D44",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    // paddingHorizontal: 32,
  },
  btnCancelStyle: {
    backgroundColor: "#5A6268",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    // paddingHorizontal: 32,
  }, containerSec1: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 18,
  },
});

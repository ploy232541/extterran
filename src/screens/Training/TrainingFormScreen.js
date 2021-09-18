import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  AsyncStorage,
  Pressable,
  Modal,
  SafeAreaView,
  Image,
  Alert
} from "react-native";
import React, { Component, createRef } from "react";
import { Avatar } from "react-native-paper";
import { CheckBox, Divider } from "react-native-elements";
import { Button, Label, Picker, Row } from "native-base";
import { httpClient } from "../../core/HttpClient";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { now } from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import HTML from "react-native-render-html";
import { Rows, Table } from "react-native-table-component";
import FormData from "form-data";
import { number } from "prop-types";
import NumberFormat from "react-number-format";
import "intl";
import "intl/locale-data/jsonp/en";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

function fixedCoursePicker(selectedCourse) {
  return (
    <View style={styles.coursePickerStyles}>
      <Picker enabled={false}>
        <Picker.Item label={selectedCourse} value={selectedCourse} />
      </Picker>
    </View>
  );
}

export default class TrainingFormScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      lang: "",
      firstname: "",
      position: "",
      dept: "",
      select_1: [],
      select_2: [],
      select_3: [],
      problem_type: "",
      course: "",
      course_id: "",
      showCourse: false,
      inputCourse: false,
      nameCourse: "",
      courseselect: "",
      lang_id: 1,
      expense: 0,
      showinputExpense: true,
      showuninputExpense: false,
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      currentDate: "DD/MM/YYYY",
      startdateeng: "",
      startdatethai: "",
      enddateeng: "",
      enddatethai: "",
      isStart: false,
      isDatePickerVisible: false,
      date: new Date(),
      startcul: "",
      endcul: "",
      total: "0",
      place: "",
      nameplace: "",
      nameplace_etc: "",
      courseItem: [],
      courseItem2: [],
      upload_file: null,
      profile: [],
      culMonths: "",
      courseComfrom: [],
      select_all: [],
      tableData: [
        [
          "Training / Seminar / Education Costs (THB) \nค่าใช้จ่ายการฝึกอบรม/การศึกษา (บาท)",
          "Period of Bond Contract (Months) \nระยะเวลาผูกพันตามสัญญา (เดือน)"
        ],
        ["35,000 - 50,000", "4"],
        ["50,001 - 100,000", "8"],
        ["100,001 - 150,000", "12"],
        ["150,001 Up ขึ้นไป", "16"]
      ],
      isSelected: true,
      modalVisible: false,
      conditionExpenseCourse: [],
      dateNow: "",
      inputRef: createRef(),
      condition: [],
      form_month: null,
      dateThai: "",
      countMonthEng: "",
      countMonthThai: "",
      dateTimeNow: "",
      signPurpose: [],
      preRequist: [],
      expected: []
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");

    this.setState({
      user_id: id,
      dateNow: this.formatDate(now()),
      dateTimeNow: this.formatDateTime(now()),
      dateThai: this.formatThai(now()),
      dateEng: this.formatEng(now())
    });
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN", lang_id: 1 });
    } else {
      this.setState({ lang: "TH", lang_id: 2 });
    }

    try {
      httpClient
        .get(`/Training/TrainingFormCourse/${this.state.lang_id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_2: result
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/TrainingFormScreen/${id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            for (let i = 0; i < result.length; i++) {
              var row = result[i];

              this.setState({
                profile: row,
                firstname:
                  this.state.lang === "EN" ? row.firstname_en : row.firstname,
                lastname:
                  this.state.lang === "EN" ? row.lastname_en : row.lastname,
                position: row.position_title,
                dept: row.dep_title
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      httpClient
        .get(`/Training/TrainingFormExpenseCourse`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              conditionExpenseCourse: result
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      httpClient
        .get(`/Training/TrainingFormExpenseCondition`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            if (this.state.lang_id == 2) {
              this.setState({
                condition: result[0].from_condition_th
              });
            } else {
              this.setState({
                condition: result[0].from_condition_en
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      httpClient
        .get(`/Training/TrainingSignPurpose`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            if (this.state.lang_id == 2) {
              this.setState({
                signPurpose: result
              });
            } else {
              this.setState({
                signPurpose: result
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      Alert.alert(err);
    }
  }
  //aek
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  showdialog() {
    const { modalVisible } = this.state;
    return (
      <View style={stylesdialog.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={stylesdialog.centeredView}>
            <View style={stylesdialog.modalView}>
              <HTML html={this.state.condition} />

              <Pressable
                style={[stylesdialog.button, stylesdialog.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={stylesdialog.textStyle}>
                  {" "}
                  {this.state.lang === "EN" ? "Accept" : "ยอมรับ"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  clearFunc(ok) {
    if (ok === "ok") {
      this.setState({
        problem_type: "",
        course: "",
        showCourse: false,
        inputCourse: false,
        nameCourse: "",
        courseselect: "",
        expense: 0,
        showinputExpense: true,
        showuninputExpense: false,
        startDate: "DD/MM/YYYY",
        endDate: "DD/MM/YYYY",
        currentDate: "DD/MM/YYYY",
        startdateeng: "",
        startdatethai: "",
        enddateeng: "",
        enddatethai: "",
        isStart: false,
        isDatePickerVisible: false,

        startcul: "",
        endcul: "",
        total: "0",
        place: "",
        nameplace: "",
        nameplace_etc: "",
        courseItem: [],
        courseItem2: [],
        upload_file: null,
        profile: [],
        culMonths: "",

        tableData: [
          [
            "Training / Seminar / Education Costs (THB) \nค่าใช้จ่ายการฝึกอบรม/การศึกษา (บาท)",
            "Period of Bond Contract (Months) \nระยะเวลาผูกพันตามสัญญา (เดือน)"
          ],
          ["35,000 - 50,000", "4"],
          ["50,001 - 100,000", "8"],
          ["100,001 - 150,000", "12"],
          ["150,001 Up ขึ้นไป", "16"]
        ],
        isSelected: true,
        modalVisible: false,
        inputRef: createRef(),

        form_month: null,
        dateThai: "",
        countMonthEng: "",
        countMonthThai: "",
        dateTimeNow: "",
        pre_requerse: "",
        pre_requerse2: "",
        preRequist: "",
        expected: ""
      });
    }
    this.componentDidMount;
  }

  //end aek

  deleteCourse(index, courseItem) {
    let itemCopy = [...courseItem];
    itemCopy.splice(index, 1);
    this.setState({
      courseItem: itemCopy
    });
  }
  deleteCourse2(index, courseItem) {
    let itemCopy = [...courseItem];
    itemCopy.splice(index, 1);
    this.setState({
      courseItem2: itemCopy
    });
  }
  reset() {
    this.setState({
      form_month: null,
      course: "",
      courseselect: "",
      nameCourse: "",
      expense: "",
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      total: "",
      place: "",
      upload_file: "",
      nameplace_etc: "",
      pre_requerse: "",
      pre_requerse2: "",
      courseItem: [],
      courseItem2: []
    });
  }

  /* ***** */
  mimetype = (name) => {
    let allow = {
      png: "image/png",
      JPG: "image/JPG",
      pdf: "application/pdf",
      jpeg: "image/jpeg",
      jpg: "image/jpg"
    };
    let extention = name.split(".")[1];
    if (allow[extention] !== undefined) {
      return allow[extention];
    } else {
      return undefined;
    }
  };
  /* ***** */
  onPressSend = () => {
    try {
      const {
        user_id,
        course,
        courseselect,
        nameCourse,
        expense,
        startDate,
        endDate,
        total,
        place,
        upload_file,
        nameplace_etc,
        pre_requerse,
        pre_requerse2,
        courseItem,
        courseItem2
      } = this.state;

      if (course == "") {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please select a course type"
            : "กรุณาเลือกประเภทหลักสูตร"
        );
      } else if (
        (courseselect == "" || courseselect == "0") &&
        nameCourse == ""
      ) {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please select a course"
            : "กรุณาเลือกหลักสูตร"
        );
      } else if (startDate == "DD/MM/YYYY") {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please enter the start date of the training"
            : "กรุณากรอกวันที่เริ่มการฝึกอบรม"
        );
      } else if (endDate == "DD/MM/YYYY") {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please enter the training end date"
            : "กรุณากรอกวันที่สิ้นสุดการฝึกอบรม"
        );
      } 
      // else if (
      //   (upload_file == "" || upload_file == null) &&
      //   (this.state.course == 3 ||
      //     this.state.course == 4 ||
      //     this.state.course == 0)
      // ) {
      //   Alert.alert(
      //     this.state.lang === "EN" ? "Please attach the file" : "กรุณาแนบไฟล์"
      //   );
      // } 
      else if (total <= 0) {
        Alert.alert(
          this.state.lang === "EN"
            ? "Include at least 1 training day."
            : "รวมวันฝึกอบรมต้องมีอย่างน้อย 1 วัน"
        );
      } else {
        const params = {
          user_id,
          course,
          courseselect,
          nameCourse,
          expense: expense ? expense : 0,
          startDate,
          endDate,
          total,
          place,
          nameplace_etc,
          pre_requerse,
          pre_requerse2,
          courseItem,
          courseItem2
        };
        Alert.alert(
          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
          this.state.lang === "EN" ? "Confirm" : "ยืนยัน",
          [
            {
              text: this.state.lang === "EN" ? "CANCEL" : "ยกเลิก",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            ,
            {
              text: this.state.lang === "EN" ? "OK" : "ตกลง",
              onPress: () => {
                httpClient
                  .post("/Training/InsertTrainingRequest", params)
                  .then((response) => {
                    const result = response.data;
                    if (result != false) {
                      if (upload_file != null && upload_file != "") {
                        const data = new FormData();
                        data.append("file", {
                          name: result + "",
                          type: upload_file.type,
                          uri: upload_file.uri
                        });

                        httpClient
                          .post("/Training/InsertTrainingRequestFile", data, {})
                          .then((response) => {
                            const result = response.data;
                            if (result == true) {
                              Alert.alert(
                                this.state.lang === "EN"
                                  ? "Alert"
                                  : "แจ้งเตือน",
                                this.state.lang === "EN"
                                  ? "Training request sent"
                                  : "ส่งคำขอฝึกอบรมเรียบร้อยแล้ว",
                                [
                                  {
                                    text:
                                      this.state.lang === "EN" ? "OK" : "ตกลง",
                                    onPress: () =>
                                      this.props.navigation.goBack()
                                  }
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
                      } else {
                        Alert.alert(
                          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                          this.state.lang === "EN"
                            ? "Training request sent"
                            : "ส่งคำขอฝึกอบรมเรียบร้อยแล้ว",
                          [
                            {
                              text: this.state.lang === "EN" ? "OK" : "ตกลง",
                              onPress: () => this.props.navigation.goBack()
                            }
                          ],
                          { cancelable: false }
                        );
                      }
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
              }
            }
          ]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  //aek

  onPickerValueChange = (value) => {
    this.setState({
      expense: 0,
      course: value,
      courseselect: "",
      course_id: value
    });
    if (value == "") {
      this.setState({
        showCourse: false,
        inputCourse: false
      });
    } else if (value == "0") {
      this.setState({
        showCourse: false,
        inputCourse: true
      });
    } else {
      this.sub_course(value);
      this.setState({
        inputCourse: false,
        showCourse: true
      });
    }
    if (value == 3 || value == 4) {
      this.setState({
        showinputExpense: false,
        showuninputExpense: true
      });
    } else {
      this.setState({
        showinputExpense: true,
        showuninputExpense: false
      });
    }
  };
  onPickerValueChanges = (v) => {
    this.setState({ courseselect: v, nameplace_etc: "" });
    if (v != "") {
      let ck = this.state.lang_id == 1 ? v : Number(v) - 1;
      console.log(ck);
      let result = this.state.select_all.find((member) => {
        return member.course_id == ck;
      });
      console.log(result);
      this.setState({
        courseComfrom: result
      });

      if (this.state.course != "0" && this.state.course != null) {
        this.setState({
          courseComfrom: result,
          nameCourse: ""
        });
      } else {
        this.setState({
          courseComfrom: []
        });
      }
      if (this.state.course == 3 || this.state.course == 4) {
        this.setState({
          expense: Number(result.course_fee).toString()
        });
      } else {
        this.setState({
          expense: 0
        });
      }
      if (
        this.state.course == 3 ||
        this.state.course == 4 ||
        this.state.course == 0
      ) {
        this.checkcourse(Number(result.course_fee ? result.course_fee : 0));
      }

      this.getplace(v);
    }
  };
  //เอก
  getplace = (v) => {
    try {
      httpClient
        .get(`/Training/TrainingFormPlace/${this.state.lang_id}/${v}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_3: result
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  };
  async sub_course(value) {
    let user_id = await AsyncStorage.getItem("userId");

    try {
      httpClient
        .get(
          `/Training/TrainingFormNameCourse/${user_id}/${this.state.lang_id}/${value}`
        )
        .then((response) => {
          const result = response.data;

          if (result != null) {
            this.setState({
              select_1: result
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      httpClient
        .get(
          `/Training/TrainingFormNameCourseAllLang/${user_id}/${this.state.lang_id}/${value}`
        )
        .then((response) => {
          const result = response.data;

          if (result != null) {
            this.setState({
              select_all: result
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }
  formatDate = (date) => {
    let d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };
  formatDateTime = (date) => {
    let d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      H = d.getHours(),
      M = d.getMinutes(),
      S = d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (M.length < 2) M = "0" + M;
    if (S.length < 2) S = "0" + S;
    let dates = [day, month, year].join("/") + " " + [H, M, S].join(":");

    return dates;
  };
  formatDatetotal = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  };
  formatThai = (date) => {
    var monthNamesThai = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤษจิกายน",
      "ธันวาคม"
    ];
    let d = new Date(date),
      month = monthNamesThai[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear() + 543;
    return [day, month, year].join(" ");
  };
  formatEng = (date) => {
    var monthNamesEng = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let d = new Date(date),
      month = monthNamesEng[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    return [day, month, year].join(" ");
  };
  formatThaiCountMonth = (date, m) => {
    var monthNamesThai = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤษจิกายน",
      "ธันวาคม"
    ];
    let d = new Date(date);
    d.setDate(d.getDate() + 1);
    d.setMonth(d.getMonth() + Number(m));
    let month = monthNamesThai[d.getMonth()];
    let day = "" + d.getDate();
    let year = d.getFullYear() + 543;
    return [day, month, year].join(" ");
  };
  formatEngCountMonth = (date, m) => {
    var monthNamesEng = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let d = new Date(date);
    d.setDate(d.getDate() + 1);
    d.setMonth(d.getMonth() + Number(m));
    let month = monthNamesEng[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    return [day, month, year].join(" ");
  };
  showDatePicker = (props) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (dates) => {
    var date = this.formatDate(dates);
    var dates = this.formatDatetotal(dates);
    var datethai = this.formatThai(dates);
    var dateeng = this.formatEng(dates);

    if (this.state.isStart) {
      this.setState({
        startDate: date,
        startcul: dates,
        isStart: false,
        startdatethai: datethai,
        startdateeng: dateeng
      });
      if (this.state.endcul != 0) {
        this.culDate(dates, this.state.endcul);
      }
    } else {
      this.setState({
        endDate: date,
        endcul: dates,
        enddatethai: datethai,
        enddateeng: dateeng
      });

      if (this.state.startcul != 0) {
        this.culDate(this.state.startcul, dates);
      }
    }
    this.changPlace();
    this.hideDatePicker();
  };
  culDate = (startcul, endcul) => {
    let date1 = new Date(startcul);
    let date2 = new Date(endcul);
    this.setState({
      total: "0"
    });
    if (date2 >= date1) {
      let diffInMs = Math.abs(date2 - date1);
      let totals = diffInMs / (1000 * 60 * 60 * 24) + 1;
      this.setState({
        total: totals.toString()
      });
    }
  };
  changPlace = (text) => {
    this.setState({
      nameplace_etc: text,
      place: "",
      nameplace: ""
    });
    this.dateCount();
  };

  async uploadFile() {
    let result = await DocumentPicker.getDocumentAsync({});
    result.type = this.mimetype(result.name);
    if (result.type !== undefined) {
      this.setState({ upload_file: result });
    } else {
      Alert.alert(
        this.state.lang === "EN"
          ? "Please select image or PDF file"
          : "กรุณาเลือกเป็นรูปภาพหรือไฟล์ PDF"
      );
    }
  }

  checkcourse = (expensecourse) => {
    if (!isNaN(expensecourse)) {
      let condition = 0;
      if (expensecourse >= 35000) {
        for (let data of this.state.conditionExpenseCourse) {
          if (condition == 0) {
            if (data.from_expense_2 == "") {
              if (expensecourse >= Number(data.from_expense)) {
                if (condition == 0) {
                  this.setModalVisible(true);
                  condition = Number(data.from_expense);
                  this.setState({
                    form_month: data.form_month
                  });
                  this.setModalVisible(true);
                  break;
                }
              }
            } else {
              if (
                expensecourse >= Number(data.from_expense) &&
                expensecourse <= Number(data.from_expense_2)
              ) {
                if (condition == 0) {
                  this.setModalVisible(true);
                  condition = Number(data.from_expense);
                  this.setState({
                    form_month: data.form_month
                  });

                  this.setModalVisible(true);
                  break;
                }
              }
            }
          }
        }
      } else {
        this.setState({
          form_month: null
        });
      }
      this.dateCount();
    } else {
      Alert.alert("ไม่สามารถคำนวนค่าใช้จ่ายได้ กรุณาตรวจสอบค่าใช้จ่ายอีกครั้ง");
      this.setState({
        form_month: null
      });
    }
  };
  placeFunc = (k) => {
    this.setState({ place: k, nameplace_etc: "" });
    let result = this.state.select_3.find((member) => {
      return member.id === k;
    });
    this.setState({
      nameplace: k
        ? this.state.lang === "EN"
          ? result.place_en
          : result.place_th
        : ""
    });
    this.dateCount();
  };
  dateCount = () => {
    let countMonthEng = this.formatEngCountMonth(
      this.state.endcul,
      this.state.form_month
    );
    let countMonthThai = this.formatThaiCountMonth(
      this.state.endcul,
      this.state.form_month
    );
    this.setState({
      countMonthEng: countMonthEng,
      countMonthThai: countMonthThai
    });
  };

  render() {
    const { listFeedBack, upload_file } = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        {/* <ScrollView style={{ backgroundColor: "#d9d9d9" }}> */}
        <View
          style={{
            flex: 1,
            borderWidth: 2,
            borderRadius: 12,
            marginTop: 20,
            borderColor: "white",
            backgroundColor: "white",
            marginHorizontal: 15,
            marginBottom: 20
          }}
        >
          <View style={styles.containerSec1}>
            {/* <View style={styles.textHeader}> */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#4393de",
                marginTop: 18,
                alignSelf: "center"
              }}
            >
              {this.state.lang === "EN"
                ? "EXTERRAN (THAILAND) LTD."
                : "บริษัท เอ็กซ์เธอร์แอน (ประเทศไทย) จำกัด"}
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                marginTop: 12,
                marginBottom: 15
              }}
            >
              Training Request
            </Text>
            {/* </View> */}

            <View>
              <Divider style={{ backgroundColor: "black", borderWidth: 2 }} />
            </View>

            {/* ส่วนที่1 */}
            <View style={{ margin: 20, marginHorizontal: 8 }}>
              <Text style={styles.textInputEng}>First name :</Text>
              <Text style={styles.textInputThai}>ชื่อ</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.firstname}
              />

              <Text style={styles.textInputEng}>Last name:</Text>
              <Text style={styles.textInputThai}>นามสกุล</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.lastname}
              />

              <Text style={styles.textInputEng}>Position :</Text>
              <Text style={styles.textInputThai}>ตำแหน่ง</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.position}
              />

              <Text style={styles.textInputEng}>Dept :</Text>
              <Text style={styles.textInputThai}>แผนก</Text>
              <TextInput style={styles.inputStyle} value={this.state.dept} />
            </View>

            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
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
          </View>
          {/* ส่วนที่1 */}

          {/* ส่วนที่2 */}
          <View style={styles.containerSec2}>
            <View style={styles.contentInSec2}>
              <Text style={styles.textInputEng}>
                Name of Course :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>ชื่อหลักสูตร</Text>

              <Picker
                mode="dropdown"
                iosIcon={
                  <Icon
                    name="angle-down"
                    style={{ width: "8%", paddingHorizontal: 2 }}
                  />
                }
                style={styles.inputLightStyle}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.course}
                onValueChange={(t) => this.onPickerValueChange(t)}
                textStyle={{ fontSize: 14 }}
              >
                <Picker.Item
                  label={
                    this.state.lang === "EN"
                      ? "Please select a course type."
                      : "กรุณาเลือกประเภทหลักสูตร"
                  }
                  value=""
                />
                {this.state.select_2.map((data) => {
                  return (
                    <Picker.Item label={data.type_name} value={data.type_id} />
                  );
                })}

                <Picker.Item
                  label={
                    this.state.lang === "EN" ? "Other Courses" : "หลักสูตรอื่นๆ"
                  }
                  value="0"
                />
              </Picker>

              <View>
                {this.state.showCourse && (
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
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.courseselect}
                      onValueChange={this.onPickerValueChanges}
                      // this.setState({ course: text })}
                      textStyle={{ fontSize: 14 }}
                    >
                      <Picker.Item
                        label={
                          this.state.lang === "EN"
                            ? "Please select a course."
                            : "กรุณาเลือกหลักสูตร"
                        }
                        value=""
                      />

                      {this.state.select_1.map((data) => {
                        return (
                          <Picker.Item
                            label={data.course_title}
                            value={data.course_id}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                )}
              </View>

              <View>
                {this.state.inputCourse && (
                  <View>
                    <TextInput
                      style={styles.inputStyle1}
                      value={this.state.nameCourse}
                      placeholder="กรุณากรอกชื่อหลักสูตร"
                      onChangeText={(text) =>
                        this.setState({ nameCourse: text, courseComfrom: [] })
                      }
                    />
                  </View>
                )}
              </View>

              {this.state.showinputExpense && (
                <View>
                  <Text style={styles.textInputEng}>
                    Expense (excluded vat) :
                    <Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    ค่าใช้จ่ายต่อบุคคล (ไม่รวมภาษี)
                  </Text>

                  <TextInput
                    style={styles.inputStyle1}
                    // keyboardType={"numeric"}
                    onChangeText={(text) => {
                      if (text == "0") {
                        this.setState({
                          expense: "0"
                        });
                      }
                      this.setState({
                        expense: Number(text.replace(/,/g, ""))
                      });
                    }}
                    placeholder="กรุณากรอกจำนวนเงิน"
                    value={this.state.expense}
                    onBlur={(e) => this.checkcourse(this.state.expense)}
                  />
                </View>
              )}

              <View>
                {this.state.showuninputExpense && (
                  <TextInput
                    style={styles.inputStyle}
                    value={new Intl.NumberFormat().format(this.state.expense)}
                  />
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  marginTop: 15,
                  marginBottom: 15,
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "red" }}>
                  {this.state.form_month != null
                    ? (this.state.lang == "EN"
                        ? "Contract Bond : "
                        : " สัญญาผูกพันธ์การฝึกอบรม: ") +
                      this.state.form_month +
                      (this.state.lang == "EN" ? "Months" : " เดือน")
                    : ""}
                </Text>
              </View>

              <Text style={styles.textInputEng}>
                Start Date :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>วันที่เริ่มฝึกอบรม</Text>
              <TouchableOpacity onPress={() => this.showDatePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ paddingLeft: 10 }}>
                    {this.state.startDate}
                  </Text>
                </View>
              </TouchableOpacity>

              <DateTimePickerModal
                locale="th_TH"
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
              />

              <Text style={styles.textInputEng}>
                End Date :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>วันที่สิ้นสุดฝึกอบรบ</Text>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
                <View style={styles.inputDate}>
                  <Text style={{ paddingLeft: 10 }}>{this.state.endDate}</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.textInputEng}>
                Total :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>รวมวันฝึกอบรม</Text>
              <TextInput
                keyboardType="number-pad"
                style={styles.inputStyle}
                value={this.state.total}
              />

              <Text style={styles.textInputEng}>Place :</Text>
              <Text style={styles.textInputThai}>สถานที่ฝึกอบรม</Text>
              {this.state.showuninputExpense && (
                <Picker
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      name="angle-down"
                      style={{ width: "8%", paddingHorizontal: 2 }}
                    />
                  }
                  style={styles.inputLightStyle}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.place}
                  onValueChange={this.placeFunc}
                  textStyle={{ fontSize: 14 }}
                >
                  <Picker.Item
                    label={
                      this.state.lang === "EN"
                        ? "Please select a training location"
                        : "กรุณาเลือกสถานที่ฝึกอบรม"
                    }
                    value=""
                  />
                  {this.state.select_3.map((data) => {
                    let place_lang = "place_th";
                    if (this.state.lang_id == 1) {
                      place_lang = "place_en";
                    }
                    return (
                      <Picker.Item
                        label={data.place_th ? data.place_th : data.place_en}
                        value={data.id}
                      />
                    );
                  })}
                </Picker>
              )}
              {this.state.showinputExpense && (
                <TextInput
                  keyboardType="text"
                  value={this.state.nameplace_etc}
                  style={styles.inputStyle1}
                  maxLength={100}
                  onChangeText={this.changPlace}
                  placeholder="กรุณากรอกสถานที่"
                />
              )}

              <View>
                <Text style={styles.textInputEng}>File :</Text>
                <Text style={styles.textInputThai}>แนบไฟล์</Text>
                <View style={{ marginTop: 5, marginBottom: 20 }}>
                  <Button
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      backgroundColor: "#4392de",
                      height: HEIGHT / 18,
                      // width: "20%",
                      marginTop: 10,
                      marginBottom: 10,
                      borderColor: "#4392de"
                    }}
                    onPress={this.uploadFile.bind(this)}
                  >
                    <Text style={{ marginHorizontal: 8, color: "white" }}>
                      {this.state.lang == "EN" ? "Choose File" : "เลือกไฟล์"}
                    </Text>
                  </Button>

                  <View
                    style={{ flex: 1, marginTop: 10, alignItems: "flex-start" }}
                  >
                    {upload_file ? (
                      <Text style={{ color: "green" }}>
                        ชื่อไฟล์: {upload_file.name}
                      </Text>
                    ) : (
                      <Text>ชื่อไฟล์:</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* จบส่วนที่2 */}

          <View
            style={{
              marginVertical: 30,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
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

          {/* ส่วนที่3  */}
          <View style={styles.containerSec2}>
            <View style={styles.contentInSec2}>
              <Text style={styles.textInputEng}>
                Pre-Requisities for Training :
              </Text>

              <Text style={styles.textInputThai}>
                คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 2,
                  marginBottom: 2
                }}
              >
                <TextInput
                  keyboardType="text"
                  style={styles.inputStyle2}
                  value={this.state.pre_requerse}
                  maxLength={100}
                  onChangeText={(text) => this.setState({ pre_requerse: text })}
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingVertical: 2,
                    margin: 4
                  }}
                >
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      this.setState({
                        courseItem: [
                          ...this.state.courseItem,
                          this.state.preRequist
                        ]
                      })
                    }
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: 1 }}>
                {this.state.courseItem.map((item, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 2,
                        marginBottom: 2
                      }}
                      key={index}
                    >
                      <TextInput
                        keyboardType="text"
                        style={styles.inputStyle2}
                        name={index}
                        value={item}
                        maxLength={100}
                        onChangeText={(text) => {
                          let courseItem = [...this.state.courseItem];
                          let item = { ...courseItem[index] };
                          item = text;
                          courseItem[index] = item;
                          this.setState({ courseItem: courseItem });
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 1,
                          marginBottom: 4
                        }}
                      >
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() =>
                            this.deleteCourse(index, this.state.courseItem)
                          }
                        >
                          <Text style={styles.addButtonText}>-</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* ส่วนที่4 */}
              <Text style={styles.textInputEng}>
                Expected Result of Training :
              </Text>
              <Text style={styles.textInputThai}>
                ผลที่คาดว่าจะได้รับจากการฝึกอบรม
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 2,
                  marginBottom: 2
                }}
              >
                <TextInput
                  keyboardType="text"
                  style={styles.inputStyle2}
                  value={this.state.pre_requerse2}
                  maxLength={100}
                  onChangeText={(text) =>
                    this.setState({ pre_requerse2: text })
                  }
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingVertical: 2,
                    margin: 4
                  }}
                >
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                      this.setState({
                        courseItem2: [
                          ...this.state.courseItem2,
                          this.state.expected
                        ]
                      })
                    }
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: 1 }}>
                {this.state.courseItem2.map((item, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 2,
                        marginBottom: 2
                      }}
                      key={index}
                    >
                      <TextInput
                        keyboardType="text"
                        style={styles.inputStyle2}
                        value={item}
                        maxLength={100}
                        onChangeText={(text) => {
                          let courseItem2 = [...this.state.courseItem2];
                          let item = { ...courseItem2[index] };
                          item = text;
                          courseItem2[index] = item;
                          this.setState({ courseItem2: courseItem2 });
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 1,
                          marginBottom: 4
                        }}
                      >
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() =>
                            this.deleteCourse2(index, this.state.courseItem2)
                          }
                        >
                          <Text style={styles.addButtonText}>-</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
              {/* จบส่วนที่4 */}

              {/* ส่วนที่5 */}
              <Text style={styles.textInputEng}>Participant/Requeste :</Text>
              <Text style={styles.textInputThai}>ผู้เข้าอบรม</Text>
              <TextInput
                keyboardType="text"
                style={styles.inputStyle}
                value={this.state.firstname + " " + this.state.lastname}
              />

              <Text style={styles.textInputEng}>Date :</Text>
              <Text style={styles.textInputThai}>วันที่</Text>
              <TextInput
                keyboardType="text"
                style={styles.inputStyle}
                value={this.state.dateNow}
              />
              {/* จบส่วนที่5 */}
            </View>
          </View>
          {/* จบส่วนที่3 */}

          <View
            style={{
              marginVertical: 30,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
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

          {/* ส่วนที่6 */}
          <View style={styles.containerSec4}>
            <View style={styles.contentInSec2}>
              <Text style={styles.textInputEng}>Approved :</Text>
              <Text style={styles.textInputThai}>อนุมัติโดย</Text>

              <View style={styles.confirmStyle}>
                <Divider
                  style={{ paddingBottom: 1, backgroundColor: "blue" }}
                />
                <View style={styles.textConfirm}>
                  <Text>Particlapant's SuperVisor</Text>
                  <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม / ผู้ยื่นคำขอ</Text>
                </View>
              </View>

              <View style={styles.confirmStyle}>
                <Divider
                  style={{ paddingBottom: 1, backgroundColor: "blue" }}
                />
                <View style={styles.textConfirm}>
                  <Text>Country Manager</Text>
                  <Text>ผู้จัดการประจำประเทศ</Text>
                </View>
              </View>

              <Text style={styles.textInputEng}>Acknowledged By HR :</Text>

              <View style={styles.confirmStyle}>
                <Divider
                  style={{ paddingBottom: 1, backgroundColor: "blue" }}
                />
                <View style={styles.textConfirm}>
                  <Text>HR Training Coordinator</Text>
                  <Text>เจ้าหน้าที่</Text>
                </View>
              </View>

              <View style={styles.confirmStyle}>
                <Divider
                  style={{ paddingBottom: 1, backgroundColor: "blue" }}
                />
                <View style={styles.textConfirm}>
                  <Text>Human Resources Manager</Text>
                  <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                </View>
              </View>
            </View>
          </View>
          {/* จบส่วนที่6 */}

          <View style={{ marginBottom: 28 }}></View>

          {/* ส่วนที่7 */}
          {this.state.form_month != null && (
            <View style={styles.containerSec5}>
              <View tyle={styles.contentInSec2}>
                <View style={styles.pickerContainer1}>
                  <Text style={styles.textHeader1}>หนังสือสัญญา</Text>
                </View>

                <View style={styles.pickerContainer1}>
                  <Image
                    style={styles.logo1}
                    source={require("../../asset/exeterran.png")}
                  />

                  {/* <View style={styles.pickerContainer1}> */}
                  <Text style={styles.textInputEng4}>
                    EXTERRAN (THAILAND) LTD.
                  </Text>
                  <Text style={styles.textInputEng3}>
                    100/58 Sathorn Nakorn Tower, 28th FL..,
                  </Text>
                  <Text style={styles.textInputEng3}>
                    North Sathorn Road, Silom, Bangrak
                  </Text>
                  <Text style={styles.textInputEng3}>
                    Bangkok 10500 Thailand
                  </Text>
                  <Text style={styles.textInputEng1}></Text>
                  <Text style={styles.textInputEng3}>
                    Phone 66 (0)2636-8977
                  </Text>
                  <Text style={styles.textInputEng3}>
                    Fax 66 (0) 2636-8997 www.exterran.com
                  </Text>
                </View>

                <View style={styles.confirmStyle1}>
                  <Divider style={{ marginTop: 20, paddingBottom: 1 }} />
                </View>

                <View style={styles.pickerContainer1}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 0.1 }}></View>
                    <View style={{ flex: 8 }}>
                      <Text style={styles.textHeader2}>
                        The Training / Seminar / Education Bond
                      </Text>
                    </View>

                    <View style={{ flex: 0.1 }}></View>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 0.1 }}></View>
                    <View style={{ flex: 8 }}>
                      <Text style={styles.textInputThai1}>
                        สัญญาผูกพันการฝึกอบรม สัมมนา การศึกษา
                      </Text>
                    </View>

                    <View style={{ flex: 0.1 }}></View>
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputEng5}>
                      This Training/ Seminar /Education Bond Contract is made on
                      the
                      <Text style={{ fontWeight: "bold" }}>
                        {" " + this.state.dateEng}
                      </Text>{" "}
                      Between{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        Exterran (Thailand) Ltd.,{" "}
                      </Text>
                      a company incorporated in Thailand, having its address
                      registered at 100/58 Sathorn Nakorn Tower, 28th Floor,
                      North Sathorn Road, Silom, Bangrak, Bangkok 10500,
                      hereinafter referred to as the “Sponsoring Company”, on
                      the one part, And
                      <Text style={{ fontWeight: "bold" }}>
                        {" " +
                          this.state.profile.firstname_en +
                          " " +
                          this.state.profile.lastname_en +
                          " "}
                      </Text>
                      identification number{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.profile.identification}{" "}
                      </Text>
                      hereinafter called “Employee”, the other part.
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai2}>
                      สัญญาผูกพันการฝึกอบรม สัมมนา การศึกษาฉบับนี้
                      จัดทำขึ้นเมื่อวันที่
                      <Text style={{ fontWeight: "bold" }}>
                        {" " + this.state.dateThai + " "}
                      </Text>
                      ระหว่าง
                      <Text style={{ fontWeight: "bold" }}>
                        {" " + "บริษัท เอ็กซ์เธอร์แอน จำกัด" + " "}
                      </Text>
                      สำนักงานตั้งอยู่เลขที่ 100/58 อาคารสาธรนคร ชั้น 28
                      ถนนสาทรเหนือ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500
                      ซึ่งต่อไปในสัญญานี้เรียกว่า “บริษัทให้การสนับสนุน”
                      ฝ่ายหนึ่ง กับ
                      <Text style={{ fontWeight: "bold" }}>
                        {" " +
                          this.state.profile.firstname +
                          " " +
                          this.state.profile.lastname +
                          " "}
                      </Text>
                      เลขประจำตัวประชาชน
                      <Text style={{ fontWeight: "bold" }}>
                        {" " + this.state.profile.identification + " "}
                      </Text>
                      ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้รับ” อีกฝ่ายหนึ่ง
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputEng5}>
                      Whereas the Sponsoring Company and Recipient Employee
                      agreed on the following:
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai4}>
                      ทั้งสองฝ่ายได้ตกลงกันดังนี้:
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      1. Support recipient to study for the
                      <Text style={{ fontWeight: "bold" }}>
                        "
                        {this.state.course != "0"
                          ? this.state.courseComfrom.course_title
                          : this.state.nameCourse
                          ? this.state.nameCourse
                          : "--ไม่ได้กรอกคอสเรียน--"}
                        "
                      </Text>{" "}
                      at
                      <Text style={{ fontWeight: "bold" }}>
                        {" "}
                        {this.state.nameplace
                          ? this.state.nameplace
                          : this.state.nameplace_etc
                          ? this.state.nameplace_etc
                          : "--ไม่ได้กรอกสถานที่--"}
                      </Text>{" "}
                      which will be conducted on{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.startdateeng
                          ? this.state.startdateeng
                          : "--ไม่ได้กรอกวันเริ่ม--"}{" "}
                        -{" "}
                        {this.state.enddateeng
                          ? this.state.enddateeng
                          : "--ไม่ได้กรอกวันสิ้นสุด--"}{" "}
                      </Text>{" "}
                      {"\n"}จัดให้พนักงานเข้ารับการฝึกอบรม
                      สัมมนาหรือการศึกษาหลักสูตร{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        "
                        {this.state.course != "0"
                          ? this.state.courseComfrom.course_title
                          : this.state.nameCourse}
                        " ณ{" "}
                        {this.state.nameplace
                          ? this.state.nameplace
                          : this.state.nameplace_etc
                          ? this.state.nameplace_etc
                          : "--ไม่ได้กรอกสถานที่--"}
                      </Text>{" "}
                      ซึ่งจัดขึ้นระหว่างวันที่{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.startdatethai
                          ? this.state.startdatethai
                          : "--ไม่ได้กรอกวันเริ่ม--"}{" "}
                        -{" "}
                        {this.state.enddatethai
                          ? this.state.enddatethai
                          : "--ไม่ได้กรอกวันสิ้นสุด--"}
                      </Text>
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputEng6}>
                      With the details are ass follow:
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      100% of the training course fees including but not limited
                      to transportation expense, meal expense, accommodations,
                      will be paid but the company.
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputEng6}>
                      โดยมีรายละเอียดการสนับสนุนดังนี้:
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      บริษัทสนับสนุนค่าฝึกอบรม ค่าเดินทาง ค่าที่พัก
                      และเบี้ยเลี้ยงค่าอาหาร
                      ตลอดการฝึกอบรมหรือการศึกษาเต็มตามจำนวนให้กับพนักงานในการฝึกอบรมหรือการศึกษาตลอดหลักสูตร
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputEng6}>
                      The recipient employee has agreed as follows:
                      ผู้รับทุนตกลงดังนี้:
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8, marginTop: 4 }}>
                    <Text style={styles.textInputThai3}>
                      1. Accept the Company sponsorship the above-mentioned
                      programs. Thereafter on completion and certification, the
                      Employee must serv a service bond of{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.form_month} months per course
                      </Text>{" "}
                      (hereinafter referred to as “Bond Period”) with the
                      Company after finishing the training course will be{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.countMonthEng}
                      </Text>
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      ยอมรับให้บริษัทฯเป็นผู้ออกค่าใช้จ่ายในการเข้ารับการอบรม
                      หรือการศึกษาดังกล่าว
                      แบะพนักงานตกลงว่าหลังจากสำเร็จการฝึกอบรม หรือการศึกษา
                      นักงานจำทำงานให้แก่บริษัทฯ มีกำหนดระยะเวลา{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.form_month
                          ? this.state.form_month + " "
                          : "..........."}
                        เดือน ต่อหลักสูตร โดยเริ่มนับหลังจากเสร็จสิ้นการฝึกอบรม{" "}
                      </Text>{" "}
                      คือวันที่{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {this.state.countMonthThai
                          ? this.state.countMonthThai + " "
                          : ".........."}
                      </Text>
                      {`(ซึ่งในสัญญานี้เรียกว่า “ระยะเวลาใช้ทุนคืน”)`}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View
                  style={{
                    // flex: 1,
                    padding: 12,
                    // paddingTop: 10,
                    backgroundColor: "#fff",
                    marginBottom: 5
                  }}
                >
                  {/* <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}> */}
                  <Table borderStyle={{ borderWidth: 1, borderColor: "#999" }}>
                    {/* <Row
                    data={this.state.tableData}
                    style={styles.head}
                    textStyle={styles.text}
                  /> */}
                    <Rows data={this.state.tableData} textStyle={styles.text} />
                  </Table>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      2. If the recipient has not completed the training course
                      of education program under this contract irrespective
                      causes or unable to continue working with Company due to
                      resignation or dismissal by Company as a result of
                      breaking the Company’s employee work rules and
                      regulations, Code of Conduct or under Thai Labor Law,
                      except the recipient undergoes the severe accident which
                      causes the recipient unable to work, the recipient must
                      pay the full amount or in the lieu of the Bond Period on
                      the pro-rata basis of given training/education costs and
                      expenses to Company immediately or prior to the date of
                      the last wage/ salary payment.
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      หากผู้รับไม่จบการฝึกอบรม
                      หรือการศึกษาตามสัญญาฉบับนี้ด้วยสาเหตุใดก็ตาม
                      หรือผู้รับไม่สามารถทำงานต่อให้บริษัทได้เนื่องจากผู้รับลาออกจากบริษัทฯ
                      หรือบริษัทฯ
                      ให้พ้นสภาพการเป็นพนักงานอันเนื่องจากผู้รับได้กระทำผิดต่อข้อบังคับเกี่ยวกับการทำงานหรือกฎระเบียบว่าด้วยหลักจริยธรรมของบริษัทฯ
                      หรือตามกฎหมายแรงาน
                      เว้นแต่ผู้รับประสบอุบัติเหตุร้ายแรงจนไม่สามารถทำงานต่อให้กับบริษัทฯได้
                      ผู้รับจะต้องชดใช้เงินทุนการฝึกอบรมหรือการศึกษาที่ได้รับไปแล้วทั้งหมดคืนให้กับบริษัทฯ
                      ทันที หรือก่นอวันที่ผู้รับได้รับค่าจ้างงวดสุดท้าย
                      กรณีที่ผู้ได้รับได้ทำงานใช้ทุนคืนตามระยะเวลาใช้ทุนคืนบางส่วน
                      ให้ผู้รับคืนเงินส่วนที่เหลือโดยคำนวณตามสัดส่วนระยะเวลาคงเหลือของระยะเวลาใช้ทุนคืน
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      IN WITHNESS WHEREOF the parties have fully satisfied
                      themselves with the terms and conditions hereof and have
                      hereto appended their signatures on the day and year first
                      above written, in Bangkok Thailand
                      คู่สัญญาได้อ่านข้อความในสัญญาและเข้าใจครบถ้วนทุกประการแล้วจึงได้ลงนามสัญญา
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputEng6}>
                      <Text style={{ fontWeight: "bold" }}>Remark: </Text> This
                      Contract is made in one original and one duplicate copy.
                      The original and the duplicate shall be retained by the
                      Employee and the Company respectively.
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text style={styles.textInputThai3}>
                      <Text style={{ fontWeight: "bold" }}>หมายเหตุ: </Text>
                      สัญญานี้จัดทำขึ้น 2 ฉบับเท่านั้น ต้นฉบับสำหรับพนักงาน
                      คู่ฉบับสำหรับบริษัทฯ
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={styles.checkboxContainer}>
                  <CheckBox
                    checked
                    style={stylescheckbox.checkbox}
                    title={
                      this.state.lang_id == 1
                        ? "I accept the terms "
                        : "ยอมรับเงื่อนไข"
                    }
                  />

                  {/* เอก */}
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={styles.textInputThai5}>
                        <Text style={{ fontWeight: "bold" }}>
                          Employee Recipient ผู้รับ:
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={styles.pickerContainer2}>
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                  <View
                    style={{
                      flex: 4,
                      borderWidth: 0,
                      alignItems: "flex-start",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={{
                        // textAlign: "justify",
                        marginLeft: 6,
                        textDecorationLine: "underline",
                        borderWidth: 0
                      }}
                    >
                      {this.state.profile.firstname +
                        " " +
                        this.state.profile.lastname}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                    <View
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "center"
                      }}
                    >
                      {/* <View style={{ paddingLeft: "25%" }}> */}
                      <Text
                        style={{
                          // textAlign: "justify",
                          // marginHorizontal: 8,
                          borderWidth: 0
                        }}
                      >
                        Date:
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 0,
                        alignItems: "flex-start",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          borderWidth: 0
                        }}
                      >
                        {this.state.dateTimeNow}
                      </Text>
                    </View>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                  </View>
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginTop: 12, marginBottom: 5 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.profile.firstname +
                          " " +
                          this.state.profile.lastname}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <Text
                      style={{
                        textAlign: "justify",
                        // marginHorizontal: 8,
                        marginBottom: 24
                      }}
                    >
                      {this.state.position}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={styles.textInputThai5}>
                        <Text style={{ fontWeight: "bold" }}>
                          For and on behalf of Exterran (Thailand) Ltd.
                        </Text>
                        {"\n"}ผู้แทนบริษัทเอ็กซ์เธอร์แอน (ประเทศไทย) จำกัด:
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={styles.pickerContainer2}>
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                  <View style={{ flex: 4, borderWidth: 0 }}>
                    {/* <Text style={{ textAlign: "justify", marginHorizontal: 8 }}> */}
                    {/* <Text style={{ textDecorationLine: "underline" }}> */}
                    <Image
                      style={styles.logo}
                      source={{
                        uri: `http://smartxlearning.com/uploads/signature/${this.state.signPurpose[0].purpose_id}/${this.state.signPurpose[0].sign_image}`
                      }}
                    />
                  </View>

                  {/* </Text> */}
                  {/* </Text> */}
                  {/* <View style={{ textAlign: "justify", paddingTop: 32 }}>
                    <Text>Date:</Text>
                  </View> */}

                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                    <View
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                        borderWidth: 0
                      }}
                    >
                      {/* <View style={{ paddingLeft: "25%" }}> */}
                      <Text
                        style={{
                          // textAlign: "justify",
                          // marginHorizontal: 8,
                          borderWidth: 0
                        }}
                      >
                        Date:
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 0,
                        alignItems: "flex-start",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          borderWidth: 0
                        }}
                      >
                        {this.state.dateTimeNow}
                      </Text>
                    </View>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                  </View>

                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                </View>

                {/* <View
                    style={{
                      textAlign: "justify",
                      paddingTop: 32,
                    }}
                  >
                    <Text style={{ textDecorationLine: "underline" }}>
                      {" "} */}

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginTop: 14, marginBottom: 8 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.lang === "EN"
                          ? this.state.signPurpose[0].purpose_name_en +
                            " " +
                            this.state.signPurpose[0].purpose_lastname_en
                          : this.state.signPurpose[0].purpose_name +
                            " " +
                            this.state.signPurpose[0].purpose_lastname}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.signPurpose[0].purpose_position}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 24 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.signPurpose[0].purpose_position_en}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={styles.textInputThai5}>
                        <Text style={{ fontWeight: "bold" }}>
                          In the presence of Witness พยาน:
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={styles.pickerContainer2}>
                  {/* <Text style={{ textAlign: "justify", marginHorizontal: 8 }}>
                    <Text style={{ textDecorationLine: "underline" }}> */}
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                  <View style={{ flex: 4, borderWidth: 0 }}>
                    <Image
                      style={styles.logo}
                      source={{
                        uri: `http://smartxlearning.com/uploads/signature/${this.state.signPurpose[1].purpose_id}/${this.state.signPurpose[1].sign_image}`
                      }}
                    />
                  </View>
                  {/* </Text>
                  </Text> */}

                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                    <View
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                        borderWidth: 0
                      }}
                    >
                      {/* <View style={{ paddingLeft: "25%" }}> */}
                      <Text
                        style={{
                          // textAlign: "justify",
                          // marginHorizontal: 8,
                          borderWidth: 0
                        }}
                      >
                        Date:
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 0,
                        alignItems: "flex-start",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          borderWidth: 0
                        }}
                      >
                        {this.state.dateTimeNow}
                      </Text>
                    </View>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                  </View>
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginTop: 14, marginBottom: 8 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.lang === "EN"
                          ? this.state.signPurpose[1].purpose_name_en +
                            " " +
                            this.state.signPurpose[1].purpose_lastname_en
                          : this.state.signPurpose[1].purpose_name +
                            " " +
                            this.state.signPurpose[1].purpose_lastname}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.signPurpose[1].purpose_position}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 24 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.signPurpose[1].purpose_position_en}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={styles.textInputThai5}>
                        <Text style={{ fontWeight: "bold" }}>
                          In the presence of Witness พยาน:
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={styles.pickerContainer2}>
                  {/* <Text style={{ textAlign: "justify", marginHorizontal: 8 }}>
                    <Text style={{ textDecorationLine: "underline" }}> */}
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                  <View style={{ flex: 4, borderWidth: 0 }}>
                    <Image
                      style={styles.logo}
                      source={{
                        uri: `http://smartxlearning.com/uploads/signature/${this.state.signPurpose[2].purpose_id}/${this.state.signPurpose[2].sign_image}`
                      }}
                    />
                  </View>
                  {/* </Text>
                  </Text> */}
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                    <View
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                        borderWidth: 0
                      }}
                    >
                      {/* <View style={{ paddingLeft: "25%" }}> */}
                      <Text
                        style={{
                          // textAlign: "justify",
                          // marginHorizontal: 8,
                          borderWidth: 0
                        }}
                      >
                        Date:
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 0,
                        alignItems: "flex-start",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          borderWidth: 0
                        }}
                      >
                        {this.state.dateTimeNow}
                      </Text>
                    </View>
                    <View style={{ flex: 1, borderWidth: 0 }}></View>
                  </View>
                  <View style={{ flex: 0.1, borderWidth: 0 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginTop: 14, marginBottom: 8 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.lang === "EN"
                          ? this.state.signPurpose[2].purpose_name_en +
                            " " +
                            this.state.signPurpose[2].purpose_lastname_en
                          : this.state.signPurpose[2].purpose_name +
                            " " +
                            this.state.signPurpose[2].purpose_lastname}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.signPurpose[2].purpose_position}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.1 }}></View>
                  <View style={{ flex: 8 }}>
                    <View style={{ marginBottom: 24 }}>
                      <Text style={styles.textInputThai3}>
                        {this.state.signPurpose[0].purpose_position_en}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}></View>
                </View>
              </View>
            </View>
          )}
          {/* จบส่วนที่7 */}

          {/* ทำต่อ */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 45,
              marginBottom: 10
            }}
          >
            <Pressable
              style={[stylesdialog.button, stylesdialog.buttonOpen]}
              onPress={() => this.onPressSend()}
            >
              <Text style={styles.textStyle}>
                {this.state.lang === "EN" ? "Accept" : "ยืนยัน"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Text style={styles.textStyle}>
                {this.state.lang === "EN" ? "Cancel" : "ยกเลิก"}
              </Text>
            </Pressable>
          </View>

          {/* ส่วนที่8 */}
          <View>{this.showdialog()}</View>
          {/* จบส่วนที่8*/}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    marginHorizontal: WIDTH / 20,
    marginVertical: HEIGHT / 36
    // marginBottom: 32,
  },
  containerSec1: {
    // borderWidth: 1,
    // padding: 12,
    // borderRadius: 8,
    // marginHorizontal: 20,
    // marginTop: 18,
    marginHorizontal: 8,
    marginVertical: 18
  },
  //กรอบข้อมูลรอบนอก
  containerSec2: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD"
  },
  containerSec4: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "red"
  },
  containerSec5: {
    marginHorizontal: 12,
    marginBottom: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "gray"
  },
  containerSec3: {
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
    backgroundColor: "#fff"
  },
  contentInSec2: {
    padding: 12
  },
  textHeader: {
    alignItems: "center",
    padding: 14
  },
  textHeader1: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15
  },
  textHeader2: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 8,
    alignSelf: "center"
  },
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  inputStyle1: {
    borderRadius: 15,
    borderColor: "#007aff",
    borderWidth: 1,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  inputStyle2: {
    borderRadius: 15,
    borderColor: "#007aff",
    borderWidth: 1,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    width: "85%"
  },
  inputStyle3: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginTop: 8,
    marginHorizontal: 8,
    width: 270
  },
  inputStyle4: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginLeft: -298,
    //marginHorizontal: 20,
    marginTop: 15,
    width: "123%"
  },
  inputStyle5: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginTop: 8,
    marginHorizontal: 12,
    width: "78%"
  },
  inputStyle6: {
    backgroundColor: "#fff",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 8,
    paddingLeft: 18,
    marginHorizontal: 12,
    marginBottom: 12
  },
  ///กรอบเพิ่มข้อมูล
  pickerContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginVertical: 1,
    marginTop: 1,
    marginBottom: 4
  },
  pickerContainer1: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 1,
    marginTop: 1,
    marginBottom: 4
  },
  pickerContainer2: {
    flexDirection: "row",
    justifyContent: "space-evenly"
    // paddingVertical: 12,
    // marginBottom: 2,
  },
  textInputEng: {
    marginTop: 10
  },
  textInputEng1: {
    marginTop: 5,
    marginHorizontal: 8,
    textAlign: "left"
  },
  textInputEng2: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5
  },
  textInputEng3: {
    marginTop: 5,
    fontSize: 12
  },
  textInputEng4: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 12
  },
  textInputEng5: {
    marginTop: 12,
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputThai: {
    color: "grey"
  },
  textInputThai1: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center"
  },
  textInputThai2: {
    marginTop: 15,
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputEng6: {
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputThai3: {
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputThai4: {
    textAlign: "justify",
    // marginHorizontal: 8,
    marginBottom: 4
  },
  textInputThai5: {
    textAlign: "justify"
    // marginHorizontal: 8,
    // marginBottom: 18,
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 10,
    // height: HEIGHT / 15,
    height: HEIGHT / 18,
    width: "100%",
    marginTop: 10,
    // paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#007aff"
  },
  viewBorderDropdown: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 18,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
    borderColor: "#007aff"
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30
  },
  confirmStyle1: {
    marginTop: 2,
    marginBottom: 10,
    marginHorizontal: 14
    // paddingTop: 2,
    // paddingBottom: 10,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    margin: 7
  },
  addButton: {
    borderRadius: 50,
    backgroundColor: "#4392de",
    width: WIDTH / 11,
    height: HEIGHT / 21,
    marginHorizontal: 2,
    marginTop: 5,
    fontSize: 24
  },
  deleteButton: {
    borderRadius: 50,
    backgroundColor: "red",
    width: WIDTH / 11,
    height: HEIGHT / 21,
    marginHorizontal: 5,
    marginTop: 8,
    fontSize: 24
  },
  logo1: {
    marginTop: 4,
    // marginBottom: 12,
    alignItems: "center",
    width: 250,
    height: 120
    // width: WIDTH / 2,
    // height: HEIGHT / 2,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff"
  },
  text: {
    margin: 6,
    textAlign: "center"
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20
  },
  checkbox: {
    alignSelf: "center",
    borderRadius: 1
  },
  label: {
    margin: 18
    // marginHorizontal: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 22,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonCancel: {
    backgroundColor: "gray"
  },
  buttonAccept: {
    backgroundColor: "blue"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  logo: {
    width: WIDTH / 5,
    height: HEIGHT / 12,
    marginLeft: 8,
    alignItems: "center",
    marginTop: 2
  },
  logo2: {
    width: WIDTH / 3,
    height: HEIGHT / 9,
    // padding: 1,
    alignItems: "center",
    marginTop: 5
  }
});
const stylesdialog = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    elevation: 2
    // margin:5
  },
  buttonOpen: {
    backgroundColor: "green"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

const stylescheckbox = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  checkbox: {
    alignSelf: "center"
  },
  label: {
    margin: 8
  }
});

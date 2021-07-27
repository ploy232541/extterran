import { Picker,Tab } from "native-base";
import Icons from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import React, { 
  Component,
  } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Dimensions,
  Alert,
   } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { CheckBox } from 'react-native-elements'
import { AsyncStorage } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FormData from "form-data";
import { httpClient } from "../../core/HttpClient";

const HEIGHT = Dimensions.get("window").height;


const radio_props = [
  { label: "A: Fit, no restrictions recommended", value: 1 },
  { label: "B: Fit, with restrictions recommended (see comments)", value: 2 },
  { label: "C: Unfit at this time, to be rechecked on (date)", value: 3 },
  { label: "D: Unfit", value: 4 },
];

const radio1_props = [
  { label: "ใช่", value: 1 },
  { label: "ไม่", value: 2 },
  { label: "N/A", value: 3 },
];



export default class MedicalCheckupsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "",
      // ใช้ insert
      staff_id: "",
      user_id: "",
      form_approval: 0,
      startDate: null,
      endDate: null,
      hospital_id: "",
      doctor_id: "",
      chk_other: false,
      abnormal: "",
      spcecify: null,
      fitness: 0,
      comments: null,
      fit_for_confined: 0,
      file_download: null,
      followupdate: null,
      comment_follow: null,
      certificate: null,
      // จบใช้ insert
      last_hospital_id: " ",
      last_chk_other: false,
      select_1: [],
      select_2: [],
      medical: false,
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");
    this.setState({ user_id: id});
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN"});
    } else {
      this.setState({ lang: "TH"});
    }
    try {
      httpClient
        .get(`/Training/hospital`)
        .then((response) => {
          const result = response.data;
          //console.log("result1 = " + result);

          if (result != null && result != "") {
            //let data = [];

            // for (let i = 0; i < result.length; i++) {
            //     data[i] = {id: result[i,i+1], name: result[i,i]};
            // }
            this.setState({
              select_1: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

        httpClient
        .get(`/Training/getstaffname/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          //console.log("result2 = " + result);

          if (result != null && result != "") {
            this.setState({
              staff_id: result[0].username,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

        // httpClient
        // .get(`/Training/getmedicalcheckupdate/${this.state.user_id}`)
        // .then((response) => {
        //   const result = response.data;

        //   if (result != null && result != "") {
        //     this.setState({
        //       medical: result,
        //     });
        //   }
        //   // if (medical == true) {
        //   //   httpClient
        //   //     .get(``)
        //   // }
        // })
        // .catch((error) => {
        //   console.log(error);
        // });
    } catch (error) {}
  }

  getDoctor = () => {
    try {
      httpClient
        .get(`/Training/doctor/${this.state.hospital_id}`)
        .then((response) => {
          const result = response.data;

          if (result != null && result != "") {
            this.setState({
              select_2: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
    }
  }

  formatDate = (date) => {
    let d = new Date(date),
      month = String(d.getMonth() +1),
      day = String(d.getDate()),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };
  formatDate2 = (date) => {
    let d = new Date(date),
      month = String(d.getMonth() +1),
      day = String(d.getDate()),
      year = d.getFullYear() +1;

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };
  showDatePicker = (props, index) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
    if (props == "start" && index >= 0) {
      this.setState({ isStart: true, tem: index });
    }
    if (props != "start" && props >= 0) {
      this.setState({ tem: props });
    }
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (date) => {
    var date1 = this.formatDate(date);
    var date2 = this.formatDate2(date);

    if (this.state.isStart) {
      this.setState({
        startDate: date1,
        endDate: date2,
        isStart: false,
      });
    } else {
      this.setState({
        followupdate: date1,
      });
    }
    this.hideDatePicker();
  };

  radiocheck = (check) => {
    if (check === 1) {
      this.setState({
        fitness: check,
        radioformA: true,
        radioformB: false,
        comments: null,
        fit_for_confined: 0,
        file_download: null,
        followupdate: null,
        comment_follow: null,
        certificate: null,
      });
    } else if (check === 2 || check === 3 || check === 4) {
      this.setState({
        fitness: check,
        radioformB: true,
        radioformA: false,
        comments: null,
        fit_for_confined: 0,
        file_download: null,
        followupdate: null,
        comment_follow: null,
        certificate: null,
      });
    } 
  }

  radiocheck2 = (check) => {
    if (check === 1 || check === 2 || check === 3) {
      this.setState({
        fit_for_confined: check,
      });
    }
  }

  async uploadFile() {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type == "success") {
      this.setState({ file_download: result });
    }
  }

  async uploadCertificateFile() {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type == "success") {
      this.setState({ certificate: result });
    }
  }

  formA = () => {
    if (this.state.radioformA) {
      return (   
        <View>
          <Text>Comments:</Text>
          <TextInput 
          style={styles.inputStyle} 
          value={this.state.comments}
          onChangeText={(text) =>
            this.setState({ comments: text})}
          />

          <Text>
            Fit for Confined Space work </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio1_props}
              initial={this.state.fit_for_confined -1}
              onPress={(item) => this.radiocheck2(item)}
              style={{ marginHorizontal: 4 }}
            />
          </View>

          <Text>
            Upload File: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text style={styles.textInput}>(กรุณาแนบไฟล์ใหม่ทุกรอบ)</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
              marginBottom: 12,
            }}
            onPress={this.uploadFile.bind(this)}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>Choose File</Text>
            </View>
          </TouchableOpacity>
            <View
              style={{ flex: 1, marginTop: 10, alignItems: "flex-start" }}
                >
                {this.state.file_download ? (
                  <Text style={{ color: "green" }}>
                    ชื่อไฟล์: {this.state.file_download.name}
                  </Text>
                    ) : (
                      <Text>ชื่อไฟล์:</Text>
                    )}
            </View>
        </View>
      );
    } else {
      return null;
    }
  };

  formB = () => {
    if (this.state.radioformB) {
      return (
        <View>
          <Text>
            Comments: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput 
          style={styles.inputStyle} 
          value={this.state.comments}
          onChangeText={(text) =>
            this.setState({ comments: text})}
          />

          <Text>
            Fit for Confined Space work <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio1_props}
              initial={this.state.fit_for_confined -1}
              onPress={(item) => this.radiocheck2(item)}
              style={{ marginHorizontal: 4 }}
            />
          </View>

          <Text>
            Upload File: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text style={styles.textInput}>(กรุณาแนบไฟล์ใหม่ทุกรอบ)</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
              marginBottom: 12,
            }}
            onPress={this.uploadFile.bind(this)}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>Choose File</Text>
            </View>
          </TouchableOpacity>

          <Text>
            Follow up date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => this.showDatePicker()}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.followupdate}</Text>
            </View>
          </TouchableOpacity>

          <Text>
            Comment: Progress of follow up{" "}
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(กรณีมีใบรับรองแพทย์ให้อัพโหลดไฟล์แนบมาด้วย)</Text>
          <TextInput 
          style={styles.inputStyle} 
          value={this.state.comment_follow}
          onChangeText={(text) =>
            this.setState({ comment_follow: text})}
          />

          <Text>Medical certificate: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
              marginBottom: 12,
            }}
            onPress={this.uploadCertificateFile.bind()}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>Choose File</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  formDoctorA = () => {
      return(
        <View>
        <Text>
            Medical Examination Provider <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(Hospital Name, Location)</Text>
          <TextInput style={styles.inputStyle} 
          value={this.state.hospital_id}
          onChangeText={(text) =>
            this.setState({ hospital_id: text})}
          />

          <Text>
            Occupational Medicine Doctor <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} />
        </View>
      );
  }

  formDoctorB = () => {
      return(
        <View>
        <Text>
            Medical Examination Provider <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(Hospital Name, Location)</Text>
                      <Picker
                        // enabled={false}
                        mode="dropdown"
                        placeholder= "Select Hospital"
                        iosIcon={
                          <Icon
                            name="angle-down"
                            style={{
                              width: "10%",
                              paddingHorizontal: 1,
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.dropdownstyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.hospital_id}
                        onValueChange={(text) => this.setState({ hospital_id: text })}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label="Select Hospital"
                          value=""
                        />
                        {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
                      <Text>
            Occupational Medicine Doctor <Text style={{ color: "red" }}>*</Text>
          </Text>
                      <Picker
                        //enabled={!this.state.select_uniform}
                        mode="dropdown"
                        placeholder= "Select Doctor"
                        iosIcon={
                          <Icon
                            name="angle-down"
                            style={{
                              width: "10%",
                              paddingHorizontal: 1,
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.dropdownstyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.doctor_id}
                        onValueChange={(text) => this.setState({ doctor_id: text })}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label="Select Doctor"
                          value=""
                        />
                        {this.state.select_2.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
        {/* <Text>
            Medical Examination Provider <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(Hospital Name, Location)</Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Occupational Medicine Doctor <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} /> */}
        </View>
      );
  }

  onPressSend = () => {
    const {staff_id, user_id, form_approval, startDate, endDate, hospital_id, doctor_id, chk_other, abnormal, spcecify, fitness, comments, fit_for_confined, file_download, followupdate, comment_follow, certificate} =
      this.state;
      if (startDate == null) {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please select Medical Examination Date"
            : "กรุณาเลือกวันตรวจสุขภาพ"
        );
      } else if (hospital_id == "") {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please select Medical Examination Provider"
            : "กรุณาเลือกผู้ให้บริการตรวจสุขภาพ"
        );
      } else if (doctor_id == "") {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please select Occupational Medicine Doctor"
            : "กรุณาเลือกแพทย์อาชีวเวชศาสตร์"
        );
      } else if (abnormal == "") {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please Fill Abnormal Finding"
            : "กรุณากรอกการค้นหาที่ผิดปกติ"
        );
      } else if (fitness != 1 && (spcecify == null || specify == "")) {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please Fill Other, please Specify"
            : "กรุณากรอกช่อง Other, please Specify"
        );
      } else if (fitness == 0) {
        Alert.alert(
          this.state.lang === "EN"
            ? "Please Select Fitness for Duty Certificate"
            : "กรุณาเลือกความพร้อมสำหรับใบรับรองการปฏิบัติหน้าที่"
        );
      } else if (fitness == 1) {
          if (fit_for_confined == 0) {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Select Fit for Confined Space work"
              : "กรุณาเลือกความพร้อมในการปฏิบัติงานในที่อับอากาศ"
            );
          } else if (file_download == null) {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Upload File"
              : "กรุณาอัพโหลดไฟล์"
            );
          }
          else{
            const params = {
            staff_id,
            user_id,
            form_approval,
            startDate,
            endDate,
            hospital_id,
            doctor_id,
            chk_other,
            abnormal,
            spcecify,
            fitness,
            comments,
            fit_for_confined,
            // file_download,
            followupdate,
            comment_follow,
            // certificate,
            };
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
                      .post("/Training/insertmedicalcheckup", params)
                      .then((response) => {
                        const result = response.data;
                        if (result != false) {
                          if (file_download != null && file_download != "") {
                            console.log(file_download);
                            const data = new FormData();
                            data.append('file', {
                              name: result + "",
                              uri: file_download.uri
                            });
                            console.log(data);

                            httpClient
                              .post("/Training/InsertMedicalCheckUpFile", 
                              data, 
                              {}
                              )
                              .then((response) => {
                                const result = response.data;
                                if (result == true) {
                                  Alert.alert(
                                    this.state.lang === "EN"
                                      ? "Alert"
                                      : "แจ้งเตือน",
                                    this.state.lang === "EN"
                                      ? "A medical check-up has been sent"
                                      : "ทำการส่งใบตรวจสุขภาพ",
                                    [
                                      {
                                        text:
                                          this.state.lang === "EN"
                                            ? "OK"
                                            : "ตกลง",
                                        //onPress: () => this.reset(),
                                      },
                                    ],
                                    { cancelable: false }
                                  );
                                } else {
                                  Alert.alert(
                                    this.state.lang === "EN"
                                      ? "A medical check-up failed sent"
                                      : "ไม่สามารถส่งใบตรวจสุขภาพ"
                                  );
                                }
                              })
                              .catch((error) => {
                              console.log(error);
                              });
                          }
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
      } else if (fitness == 2 || fitness == 3 || fitness == 4) {
          if (comments == null && comments == "") {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Fill Comment"
              : "กรุณากรอกความคิดเห็น"
            );
          } else if (fit_for_confined == 0 || fit_for_confined == -1) {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Select Fit for Confined Space work"
              : "กรุณาเลือกความพร้อมในการปฏิบัติงานในที่อับอากาศ"
            );
          } else if (file_download == null) {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Upload File"
              : "กรุณาอัพโหลดไฟล์"
            );
          } else if (followupdate == null) {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Select Follow up date"
              : "กรุณาเลือก Follow up date"
            );
          } else if (comment_follow == null && comment_follow == "") {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Fill Comment: Progress of follow up"
              : "กรุณากรอก Comment: Progress of follow up"
            );
          } else if (certificate == null) {
            Alert.alert(
            this.state.lang === "EN"
              ? "Please Upload Certificate File"
              : "กรุณาอัพโหลดไฟล์ใบรับรองแพทย์"
            );
          }
        }
  }

  reset = async () => {
    try {
      httpClient
        .get()
    } catch (error) {
    }
  }

  render() {
    if (this.state.hospital_id != "" && this.state.last_hospital_id != this.state.hospital_id) {
        this.getDoctor()
        this.state.doctor_id = "";
        this.state.last_hospital_id = this.state.hospital_id;
      }
    else if (this.state.chk_other != this.state.last_chk_other) {
      this.state.last_chk_other = this.state.chk_other;
      this.state.hospital_id = "";
      this.state.doctor_id = "";
    }
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ใช้ Insert+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("staff_id = " + this.state.staff_id);
    console.log("user_id = " + this.state.user_id);
    console.log("form_approval = " + this.state.form_approval);
    console.log("startDate = " + this.state.startDate);
    console.log("endDate = " + this.state.endDate);
    console.log("chk_other = " + this.state.chk_other);
    console.log("hospital_id = " + this.state.hospital_id);
    console.log("doctor_id = " + this.state.doctor_id);
    console.log("abnormal = " + this.state.abnormal);
    console.log("spcecify = " + this.state.spcecify);
    console.log("fitness = " + this.state.fitness);
    console.log("comments = " + this.state.comments);
    console.log("fit_for_confined = " + this.state.fit_for_confined);
    console.log("file_download = " + this.state.file_download);
    console.log("followupdate = " + this.state.followupdate);
    console.log("comment_follow = " + this.state.comment_follow);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++จบใช้ Insert+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("last_chk_other = " + this.state.last_chk_other);
    console.log("select_1 = " + this.state.select_1);
    console.log("select_2 = " + this.state.select_2);
    console.log("last_hospital_id = " + this.state.last_hospital_id);
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
    return (
      <ScrollView style={styles.background}>
        <View style={styles.textHead1}>
          <Text
            style={{ fontSize: 24, color: "#1E90FF", fontWeight: "bold", alignSelf: "center"}}
          >
            Medical Checkups
          </Text>
        </View>
        <View style={styles.container}>
          <Text>
            Medical Examination Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity 
          onPress={() => this.showDatePicker("start")}
          // disabled={true}
          >
            <View style={styles.inputDate}>
              <Text 
              style={{ paddingLeft: 10 }}
              >
              {this.state.startDate}
              </Text>
            </View>
          </TouchableOpacity>

          {/* โชว์ DateTimePickerModal*/}
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          <Text>
            Date due for next Examination{" "}
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(plus +12 Months)</Text>
          <TouchableOpacity >
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.endDate}</Text>
            </View>
          </TouchableOpacity>

          {this.state.chk_other ? this.formDoctorA() : this.formDoctorB()}
          <View style={styles.checkboxContainer}>
            <CheckBox
              //value={this.state.chk_other}
              //style={styles.checkbox}
              checked={this.state.chk_other}
              onPress={() => this.setState({chk_other: !this.state.chk_other})}
            />
            <Text style={styles.checkbox}>โรงพยาบาลอื่นๆ</Text>
          </View>
          
          {/* <View style={styles.container}>
          <Text>Is CheckBox selected: {this.state.chk_other ? "👍" : "👎"}</Text>
          </View> */}

          {/* <Text>
            Medical Examination Provider <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(Hospital Name, Location)</Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Occupational Medicine Doctor <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} /> */}

          <Text>
            Abnormal Finding <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput 
          style={styles.inputStyle} 
          value={this.state.abnormal}
          onChangeText={(text) =>
            this.setState({ abnormal: text})}
          />

          {this.state.radioformB ? (
            <ScrollView>
              <Text>Other, please spcecify <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput 
              style={styles.inputStyle} 
              value={this.state.spcecify}
              onChangeText={(text) =>
                this.setState({ spcecify: text})}
              />
            </ScrollView>
          ) : (
            <ScrollView>
              <Text>Other, please spcecify</Text>
              <TextInput 
              style={styles.inputStyle} 
              value={this.state.spcecify}
              onChangeText={(text) =>
                this.setState({ spcecify: text})}
              />
            </ScrollView>
          )}

          {/* <Text>Other, please spcecify</Text>
          <TextInput style={styles.inputStyle} /> */}

          <Text>
            Fitness for Duty Certificate <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio_props}
              initial={this.state.fitness -1}
              onPress={(item) => this.radiocheck(item)}
              style={{ marginHorizontal: 4 }}
            />
          </View>

          {/* ส่วน formA */}
          {this.formA()}

          {/* ส่วนของ formB */}
          {this.formB()}

          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
              กรณีมีข้อสงสัยติดต่อแผนก HSSE:
            </Text>
            <Text>
              1.Kriangkrai Bedsed Tell: 02 0963806 {"\n"} Email:{" "}
              <Text style={{ color: "blue" }}>
                Kriangkrai.Bedsed@Exterran.com
              </Text>
              ,
            </Text>
            <Text>
              2.Chalermpong Inkaew Tell: 02 0963855 {"\n"} Email:{" "}
              <Text style={{ color: "blue" }}>
                Chalermpong.Inkaew@Exterran.com
              </Text>
              ,
            </Text>
            <Text>
              3.Thiraphat Sirisathian Tell: 02 0963807 {"\n"} Email:{" "}
              <Text style={{ color: "blue" }}>
                Thiraphat.Sirisathian@Exterran.com
              </Text>
            </Text>
          </View>

          {/* <Text>Comments:</Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Upload File : <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text style={styles.textInput}>(กรุณาแนบไฟล์ใหม่ทุกรอบ)</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>Choose File</Text>
            </View>
          </TouchableOpacity> */}

            <Button
              onPress={() => this.onPressSend()}
              mode="contained"
              style={styles.submitButton}
            >
              Submit
            </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
  },
  container: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderColor: "#398DDD",
  },
  checkboxContainer:{
    flexDirection: "row",
  },
  checkbox: {
    alignSelf: "center",
  },
  selectableInputStyle2: {
    borderColor: "#DCDCDC",
    backgroundColor: "#FFF",
    color: "#555",
    borderRadius: 5,
    borderWidth: 1,
    height: HEIGHT / 25,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 25,
    width: "100%",
  },
  submitButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    backgroundColor: "#28A745",
    marginTop: 20,
    color: "#fff",
    borderRadius: 20,
  },
  textHeader: {
    alignItems: "center",
    padding: 20,
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#007aff",
  },
  dropdownstyle: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 20,
    width: "100%",
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#007aff",
  },
  textInput: {
    color: "grey",
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 12,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
  },
  viewBorderDropdown: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10,
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
    borderColor: "#007aff",
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  textHead1: {
    marginTop: 20,
    // marginLeft: 20,
    // marginVertical: 50,
  },
});

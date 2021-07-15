import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const HEIGHT = Dimensions.get("window").height;

const radio_props = [
  { label: "A: Fit, no restrictions recommended", value: 0 },
  { label: "B: Fit, with restrictions recommended (see comments)", value: 1 },
  { label: "C: Unfit at this time, to be rechecked on (date)", value: 2 },
  { label: "D: Unfit", value: 3 },
];

const radio1_props = [
  { label: "ใช่", value: 0 },
  { label: "ไม่", value: 1 },
  { label: "N/A", value: 2 },
];

export default class MedicalCheckupsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "",
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
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
      // httpClient
      //       .get(`/Training/TrainingFormScreen/${id}`)
      //       .then((response) => {
      //         const result = response.data;
      //         if (result != null) {
      //           for (let i = 0; i < result.length; i++) {
      //             var row = result[i];
      //             this.setState({
      //               firstname:
      //                 this.state.lang === "EN" ? row.firstname_en : row.firstname,
      //               lastname:
      //                 this.state.lang === "EN" ? row.lastname_en : row.lastname,
      //               identification: row.identification,
      //               phone: row.phone,
      //               province:
      //                 this.state.lang === "EN" ? row.pv_name_en : row.pv_name_th,
      //               district:
      //                 this.state.lang === "EN" ? row.dt_name_en : row.dt_name_th,
      //               subdistrict:
      //                 this.state.lang === "EN" ? row.sdt_name_en : row.sdt_name_th,
      //               zipcode: row.zipcode,
      //             });
      //           }
      //         }
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //       });
    } catch (error) {}
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
    var date = this.formatDate(date);
    if (this.state.isStart && this.state.tem == -1) {
      this.setState({ startDate: date, isStart: false });
    } else if (this.state.isStart && this.state.tem >= 0) {
      let tem = this.state.tem;
      let medical = [...this.state.medical];
      let item = { ...medical[tem] };
      let data = { ...item["data"] };
      data.startDate = date;
      item["data"] = data;
      medical[tem] = item;
      this.setState({ medical: medical, tem: -1, isStart: false });
    } else if (this.state.tem >= 0) {
      let tem = this.state.tem;
      let medical = [...this.state.medical];
      let item = { ...medical[tem] };
      let data = { ...item["data"] };
      data.endDate = date;
      item["data"] = data;
      medical[tem] = item;
      this.setState({ medical: medical, tem: -1 });
    } else {
      this.setState({ endDate: date, isStart: false, tem: -1 });
    }

    this.hideDatePicker();
  };

  radiocheck = (check) => {
    if (check === 0) {
      this.setState({
        radioformA: !this.state.radioformA,
        radioformB: false,
        radioformC: false,
        radioformD: false,
      });
    } else if (check === 1) {
      this.setState({
        radioformB: !this.state.radioformB,
        radioformA: false,
        radioformC: false,
        radioformD: false,
      });
    } else if (check === 2) {
      this.setState({
        radioformC: !this.state.radioformC,
        radioformA: false,
        radioformB: false,
        radioformD: false,
      });
    } else if (check === 3) {
      this.setState({
        radioformD: !this.state.radioformD,
        radioformA: false,
        radioformB: false,
        radioformC: false,
      });
    }
  };

  formA = () => {
    if (this.state.radioformA) {
      return (
        <View>
          <Text>Comments:</Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Fit for Confined Space work </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio1_props}
              // initial={0}
              initial={1}
              onPress={() => {}}
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

  formB = () => {
    if (this.state.radioformB) {
      return (
        <View>
          <Text>
            Comments: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Fit for Confined Space work <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio1_props}
              // initial={0}
              initial={1}
              onPress={() => {}}
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
          <TouchableOpacity onPress={() => this.showDatePicker("start")}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
            </View>
          </TouchableOpacity>

          <Text>
            Comment: Progress of follow up{" "}
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(กรณีมีใบรับรองแพทย์ให้อัพโหลดไฟล์แนบมาด้วย)</Text>
          <TextInput style={styles.inputStyle} />

          <Text>Medical certificate: </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
              marginBottom: 12,
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
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  formC = () => {
    if (this.state.radioformC) {
      return (
        <View>
          <Text>
            Comments: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Fit for Confined Space work <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio1_props}
              // initial={0}
              initial={1}
              onPress={() => {}}
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
          <TouchableOpacity onPress={() => this.showDatePicker("start")}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
            </View>
          </TouchableOpacity>

          <Text>
            Comment: Progress of follow up{" "}
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(กรณีมีใบรับรองแพทย์ให้อัพโหลดไฟล์แนบมาด้วย)</Text>
          <TextInput style={styles.inputStyle} />

          <Text>Medical certificate: </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
              marginBottom: 12,
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
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  formD = () => {
    if (this.state.radioformD) {
      return (
        <View>
          <Text>
            Comments: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Fit for Confined Space work <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <RadioForm
              radio_props={radio1_props}
              // initial={0}
              initial={1}
              onPress={() => {}}
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
          <TouchableOpacity onPress={() => this.showDatePicker("start")}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
            </View>
          </TouchableOpacity>

          <Text>
            Comment: Progress of follow up{" "}
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(กรณีมีใบรับรองแพทย์ให้อัพโหลดไฟล์แนบมาด้วย)</Text>
          <TextInput style={styles.inputStyle} />

          <Text>Medical certificate: </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#DCDCDC",
              width: "30%",
              marginTop: 10,
              height: HEIGHT / 25,
              marginBottom: 12,
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
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <ScrollView style={styles.background}>
        <View style={styles.textHead1}>
          <Text
            style={{ fontSize: "24%", color: "#1E90FF", fontWeight: "bold", alignSelf: "center"}}
          >
            Medical Checkups
          </Text>
        </View>
        <View style={styles.container}>
          <Text>
            Medical Examination Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => this.showDatePicker("start")}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
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
          <TouchableOpacity onPress={() => this.showDatePicker()}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.endDate}</Text>
            </View>
          </TouchableOpacity>

          <Text>
            Medical Examination Provider <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Text>(Hospital Name, Location)</Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Occupational Medicine Doctor <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} />

          <Text>
            Abnormal Finding <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} />

          {this.state.radioformB || this.state.radioformC || this.state.radioformD ? (
            <ScrollView>
              <Text>Other, please spcecify <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput style={styles.inputStyle} />
            </ScrollView>
          ) : (
            <ScrollView>
              <Text>Other, please spcecify</Text>
              <TextInput style={styles.inputStyle} />
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
              // initial={0}
              initial={1}
              onPress={(item) => this.radiocheck(item)}
              style={{ marginHorizontal: 4 }}
            />
          </View>

          {/* ส่วน formA */}
          {this.formA()}

          {/* ส่วนของ formB */}
          {this.formB()}

          {/* ส่วนของ formC */}
          {this.formC()}

          {/* ส่วนของ formD */}
          {this.formD()}

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

          <View style={styles.submitButton}>
            <Text style={{ color: "#fff" }}>Submit</Text>
          </View>
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
  submitButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
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

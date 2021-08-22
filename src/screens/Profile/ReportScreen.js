import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { CheckBox } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { httpClient } from "../../core/HttpClient";
import { DataTable, Button } from "react-native-paper";
import { Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AsyncStorage } from "react-native";

const HEIGHT = Dimensions.get("window").height;

export default class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      isDatePickerVisible: false,
      isDatePickerVisible1: false,
      endcul: "",
      endcul1: "",
      tablereport: false,
      tableData: [],
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");
    this.setState({user_id: id });
    try {
      httpClient
        .get(`/Profile/querycheckinformation/${id}`)
        .then((response) => {
          const result = response.data;
          // console.log(result);
          if (result != null) {
            this.setState({
              tableData: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      Alert.alert(err);
    }
  }

  showDatePicker = (props) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
  };

  showDatePicker1 = (props) => {
    this.setState({ isDatePickerVisible1: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
  };

  formatDate = (date) => {
    var d = new Date(date),
      month = "" + parseInt(d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };

  formatDate1 = (date) => {
    var d = new Date(date),
      month = "" + parseInt(d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };

  handleConfirm = (dates) => {
    var date = this.formatDate(dates);
    // console.log(date);
    if (this.state.isStart) {
      this.setState({
        startDate: date,
        isStart: false,
      });
      if (this.state.endcul != 0) {
        this.culDate(dates, this.state.endcul);
      }
    } else {
      this.setState({
        endDate: date,
        endcul: dates,
        enddatethai: datethai,
        enddateeng: dateeng,
      });

      if (this.state.startcul != 0) {
        this.culDate(this.state.startcul, dates);
      }
    }

    this.hideDatePicker();
  };

  handleConfirm1 = (dates) => {
    var date = this.formatDate1(dates);
    // console.log(date);
    if (this.state.isStart) {
      this.setState({
        endDate: date,
        isStart: false,
      });
      if (this.state.endcul1 != 0) {
        this.culDate(dates, this.state.endcul1);
      }
    } else {
      this.setState({
        endDate: date,
        endcul1: dates,
        enddatethai: datethai,
        enddateeng: dateeng,
      });

      if (this.state.startcul != 0) {
        this.culDate(this.state.startcul, dates);
      }
    }

    this.hideDatePicker1();
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  hideDatePicker1 = () => {
    this.setState({ isDatePickerVisible1: false });
  };

  onChange = (index, value) => {
    let data = this.state.data;
    data[index].rd_row = value;
    this.setState({ data: data });
  };

  onChange1 = (index, value) => {
    let data = this.state.data;
    data[index].rd_row = value;
    this.setState({ data: data });
  };

  optionTitleReport(titleId) {
    let titleName;
    switch (titleId) {
      case 1:
        titleName = "BBS พฤติกรรม";
        break;
      case 2:
        titleName = "SWA การหยุดงาน";
        break;
      case 3:
        titleName = "HazOb รายงานความสภาพเสี่ยงที่จะเกิดอุบัติภัย";
        break;
      case 4:
        titleName = "Near Miss สภาพที่เป็นอันตราย/เหตุการณ์เกือบเกิดอุบัติเหตุ";
        break;
      case 5:
        titleName = "อื่นๆ";
        break;
    }
    return titleName;
  }

  searchdate() {
    var data = this.state.tableData;
    // for(let i = 0; i<data.length; i++){
    //   let day = data[i].observation_date.split(":")[0];
    //   console.log("for ", day);
    // }

    const results = data.filter((res) => {
      // let year = res.observation_date.split("T")[0].split("-")[0];
      // let month = res.observation_date.split("T")[0].split("-")[1];
      // let day = res.observation_date.split("T")[0].split("-")[2];
      // let date = day+"/"+month+"/"+year;

      let startD = this.state.startDate.split("/");
      let endD = this.state.endDate.split("/");

      let startDate = new Date(startD[2], parseInt(startD[1]) - 1, startD[0]);
      let endDate = new Date(endD[2], parseInt(endD[1]) - 1, endD[0]);
      let dataDate = new Date(
        res.observation_date.split("T")[0].split("-")[0],
        parseInt(res.observation_date.split("T")[0].split("-")[1]) - 1,
        res.observation_date.split("T")[0].split("-")[2]
      );

      // var startDate = Date.parse(this.state.startDate);
      // var endDate = Date.parse(this.state.endDate);
      // var dataDate = Date.parse(res.observation_date);

      if (dataDate >= startDate && dataDate <= endDate) {
        console.log("res", res.observation_date);
        return res;
        // this.setState({DataTable:})
      }
      // console.log(dataDate > startDate && dataDate < endDate)
      // console.log("observation_date ",dataDate);
    });
    // console.log("startDate ", this.state.startDate);
    // console.log("endDate ", this.state.endDate);
    // console.log("results", results);
    this.setState({ tableData: results });
  }

  cutdate(date) {
    let day = date.split("T")[0].split("-")[2];
    let month = date.split("T")[0].split("-")[1];
    let year = date.split("T")[0].split("-")[0];
    let dateNew = day + "/" + month + "/" + year;
    return dateNew;
    // let dateNew2 = day + "/" + month + "/" + newYear;
  }
  render() {
    const stateTable = this.state.tableData;
    // console.log(stateTable);
    var dataTable = [];
    for (let i = 0; i < stateTable.length; i++) {
      dataTable.push(
        <View>
          <View style={styles.container}>
            <Text style={{ padding: 5 }}>
              Fullname :{" "}
              <Text>
                {stateTable[i].firstname_en + " " + stateTable[i].lastname_en}
              </Text>
            </Text>
            <Text style={{ padding: 5 }}>
              Title Report :{" "}
              <Text>
                {this.optionTitleReport(stateTable[i].what_kind_of_report)}
              </Text>
            </Text>
            <Text style={{ padding: 5, marginBottom: 20 }}>
              วันที่พบ : <Text>{this.cutdate(stateTable[i].observation_date)}</Text>
            </Text>
            <Button
              style={styles.veiwButton}
              // icon="file-document"
              onPress={() => {
                this.props.navigation.navigate("ReportView", {
                  formId: stateTable[i].id,
                });
              }}
            >
              <Icon name="file" size={20} style={{ color: "#007aff" }}>
                <Text style={{ fontSize: 14, color: "#007aff" }}> View</Text>
              </Icon>
              {/* <Text style={{ color: "#007aff" }}>Veiw</Text> */}
            </Button>
            <Button
              onPress={() =>
                Linking.openURL(
                  `https://smartxlearning.com/index.php/ProfileMobile/PdfInformation_mobile?id=${stateTable[i].id}&user_id=${stateTable[i].user_id}`
                )
              }
              style={styles.veiwButton1}
              // icon="printer"
            >
              {/* <Text style={{ color: "#FF0000" }}>Print</Text> */}
              <Icon name="print" size={20} style={{ color: "orange" }}>
                <Text style={{ fontSize: 14, color: "orange" }}> Print</Text>
              </Icon>
            </Button>
          </View>
        </View>
        //ตารางเสร็จแล้ว เก็บไว้ดู
        // <DataTable.Row>
        //   <DataTable.Cell style={styles.tableText}>
        //     {stateTable[i].firstname_en + " " + stateTable[i].lastname_en}
        //   </DataTable.Cell>
        //   <DataTable.Cell>
        //     {this.optionTitleReport(stateTable[i].what_kind_of_report)}
        //   </DataTable.Cell>
        //   <DataTable.Cell>{stateTable[i].observation_date}</DataTable.Cell>
        //   <DataTable.Cell>
        //     <Button
        //       style={styles.veiwButton}
        //       icon="file-document"
        //       onPress={() => {
        //         this.props.navigation.navigate("ReportView", {
        //           formId: stateTable[i].id,
        //         });
        //       }}
        //     >
        //       <Text style={{ color: "#007aff" }}>Veiw</Text>
        //     </Button>
        //   </DataTable.Cell>
        //   <DataTable.Cell>
        //     <Button
        //       onPress={() =>
        //         Linking.openURL(
        //           `https://smartxlearning.com/index.php/ProfileMobile/PdfInformation_mobile?id=${stateTable[i].id}&user_id=${stateTable[i].user_id}`
        //         )
        //       }
        //       style={styles.veiwButton}
        //       icon="file-document"
        //     >
        //       <Text style={{ color: "#007aff" }}>Print</Text>
        //     </Button>
        //   </DataTable.Cell>
        // </DataTable.Row>
      );
    }
    // console.log("stateTable", stateTable.length);
    // console.log(dataTable[0]);
    return (
      <ScrollView>
        <View style={styles.textHead1}>
          <Text style={{ fontSize: "25", color: "#1E90FF", marginBottom: 20 , marginTop:20 , alignSelf: "center",}}>
            รายการ Report
          </Text>

          <Text>
            วันเริ่มต้น <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => this.showDatePicker("start")}
            style={{ padding: 5, marginRight: 10 }}
          >
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
            </View>

            <DateTimePickerModal
              onChange={(e) => {
                // console.log(e);
              }}
              isVisible={this.state.isDatePickerVisible}
              mode="date"
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
          </TouchableOpacity>

          <Text>
            วันสิ้นสุด <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => this.showDatePicker1("start")}
            style={{ padding: 5, marginRight: 10 }}
          >
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 9 }}>{this.state.endDate}</Text>
            </View>

            <DateTimePickerModal
              onChange1={(e) => {
                // console.log(e);
              }}
              isVisible={this.state.isDatePickerVisible1}
              mode="date"
              onConfirm={this.handleConfirm1}
              onCancel={this.hideDatePicker1}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#1E90FF",
              width: "20%",
              marginTop: 10,
              height: HEIGHT / 25,
              alignSelf: "center",
              borderRadius: 5,
            }}
            onPress={() => this.searchdate()}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
               
              }}
            >
              <Icon name="search" size={20} style={{ color: "#fff" }}>
                <Text style={{ fontSize: 14, color: "#fff" }}> ค้นหา</Text>
              </Icon>
            </View>
          </TouchableOpacity>

          {/* <View style={styles.container}>
            <ScrollView horizontal={true}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Fullname</DataTable.Title>
                  <DataTable.Title>Title Report</DataTable.Title>
                  <DataTable.Title>วันที่พบ</DataTable.Title>
                  <DataTable.Title>view</DataTable.Title>
                  <DataTable.Title>Print</DataTable.Title>
                </DataTable.Header>
                {dataTable}
              </DataTable>
            </ScrollView>
          </View> */}
          {dataTable}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#ffff",
  },

  textHead1: {
    marginTop: 10,
    marginLeft: 20,
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
  veiwButton: {
    alignSelf: "center",
    backgroundColor: "#ffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007aff",
    marginBottom: 10,
    width: 300,
    // justifyContent: "center",
  },

  veiwButton1: {
    alignSelf: "center",
    backgroundColor: "#ffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "orange",
    marginBottom: 10,
    width: 300,
    // justifyContent: "center",
  },

  tableText: {
    textAlign: "left",
  },

  container: {
    flex: 1,
    padding: 5,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 50,
    borderRadius: 10,
  },

  head: { height: 40 },
  wrapper: { flexDirection: "row" },
  title: { flex: 1 },
  row: { height: 28 },

  boxWithShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
});

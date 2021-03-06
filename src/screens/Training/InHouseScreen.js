import React, { Component, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "native-base";
import { Avatar, trainingNeed } from "react-native-paper";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { set } from "react-native-reanimated";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";
import Icons from "react-native-vector-icons/Ionicons";
import RNPickerDialog from "rn-modal-picker";
let dimensions = Dimensions.get("window");
let pickerWidth = dimensions.width - 56;
const WIDTH = Dimensions.get("window").height;

export default class InHouseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseItem: [],
      trainingNeed: [],
      selectEmp: [],
      selectCourse: [],
      lang: "",
      firstname: "",
      team: false,
      empList: [],
      emp: [],
      placeHolderText: "Select Employee",
      selectedText: "",
      defaultValue: true,
      select: "",
      value: "",
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
      const user_id = await AsyncStorage.getItem("userId");

      httpClient
        .get(`/Team/getMenuTeam/${user_id}`)
        .then(async (response) => {
          const res = response.data;
          this.setState({ team: res });
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/EmployeeTrainingNeed/${id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            // console.log(result);
            let emp = [];
            for (let i in result) {
              emp[i] = {
                id: result[i].user_id,
                name: result[i].firstname,
              };
            }
            this.setState({
              empList: emp,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      httpClient
        .get(`/Training/TrainingNeedCouse`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              selectCourse: result,
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
  selectedValue(index, item) {
    console.log(item);
    this.setState({ selectedText: item.name });
  }
  deleteEmployee(index) {
    let itemCopy = [...this.state.trainingNeed];
    itemCopy.splice(index, 1);
    this.setState({ trainingNeed: itemCopy });
  }
  deleteCourse(index, i) {
    let trainingNeed = [...this.state.trainingNeed];
    let item = { ...trainingNeed[index] };
    let data = item["data"];
    data.splice(i, 1);
    item["data"] = data;
    trainingNeed[index] = item;
    this.setState({ trainingNeed: trainingNeed });
  }
  addCourse(index) {
    let trainingNeed = [...this.state.trainingNeed];
    let item = { ...trainingNeed[index] };

    let data = [...item["data"], { course_id: "" }];
    item["data"] = data;
    trainingNeed[index] = item;

    this.setState({ trainingNeed: trainingNeed });
  }
  onPressSend = async () => {
    let id = await AsyncStorage.getItem("userId");
    const { trainingNeed } = this.state;
    if (trainingNeed.length <= 0) {
      Alert.alert("?????????????????????????????????????????????????????????????????????????????? 1 ??????????????????");
    } else {
      let index = 0;
      let error = false;
      let trainingNeed = [...this.state.trainingNeed];
      do {
        let item = { ...trainingNeed[index] };
        let data = item.data;
        error = true;
        if (item.employee_id == "" || item.employee_id == null) {
          Alert.alert("??????????????????????????????????????????????????????????????? \n ??????????????? " + (index + 1));
        } else {
          if (data.length <= 0) {
            Alert.alert(
              "????????????????????????????????????????????????????????????????????????????????? 1 ?????????????????? ???????????????????????????????????? " + (index + 1)
            );
          } else {
            let i = 0;
            if (data.length > 0) {
              do {
                error = true;
                let param = data[i].course_id;
                if (param == null || param == "") {
                  Alert.alert(
                    "?????????????????????????????????????????????????????? \n ???????????????????????????????????? " +
                      (index + 1) +
                      "\n ???????????????????????? " +
                      (i + 1)
                  );
                } else {
                  error = false;
                }
                i++;
              } while (i < data.length && error == false);
            }
          }
        }
        index++;
      } while (index < trainingNeed.length && error == false);
      if (error == false) {
        let data = { trainingNeed: trainingNeed, user_id: id };

        Alert.alert(
          this.state.lang === "EN" ? "Alert" : "???????????????????????????",
          this.state.lang === "EN" ? "Confirm" : "??????????????????",
          [
            {
              text: this.state.lang === "EN" ? "CANCEL" : "??????????????????",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            ,
            {
              text: this.state.lang === "EN" ? "OK" : "????????????",
              onPress: () => {
                httpClient
                  .post("/Training/InsertTrainingNeedsInHouse", data)
                  .then((response) => {
                    const result = response.data;
                    if (result === true) {
                      Alert.alert(
                        this.state.lang === "EN" ? "Alert" : "???????????????????????????",
                        this.state.lang === "EN"
                          ? "Training request sent"
                          : "?????????????????????????????????????????????????????????????????????????????????",
                        [
                          {
                            text: this.state.lang === "EN" ? "OK" : "????????????",
                            onPress: () => this.reset(),
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      Alert.alert(
                        this.state.lang === "EN"
                          ? `Training request failed`
                          : "??????????????????????????????????????????????????????????????????????????????????????????"
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
  };
  reset() {
    this.setState({ trainingNeed: [] });
  }

  render() {
    return (
      <View style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.textHeader}>
            <Text style={{ color: "#333333", fontSize: 24 }}>
              Training Needs - In house
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
              style={Styless.arrowDownStyle}
            />
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
          </View>

          {this.state.trainingNeed.map((item, index) => {
            let excludeEmployees = [];

            for (let i = 0; i < this.state.trainingNeed.length; i++) {
              if (i != index) {
                excludeEmployees.push(this.state.trainingNeed[i].employee_id);
              }
            }

            let listEmployees = [];
            for (let i = 0; i < this.state.empList.length; i++) {
              let employee = this.state.empList[i];
              let employeeId = employee.id;
              // ???????????????????????????
              if (!excludeEmployees.includes(employeeId)) {
                listEmployees.push(employee);
              }
            }

            return (
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.containerSec2}>
                  <View style={styles.contentInSec}>
                    <Text style={styles.textStyle1}>
                      {this.state.lang === "EN"
                        ? "Employee Name No." + (index + 1)
                        : "???????????????????????????????????????????????? " + (index + 1)}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1 }}></View>
                      <View style={{ flex: 80 }}>
                        <RNPickerDialog
                          data={listEmployees}
                          pickerTitle={"???????????????????????????????????????????????????"}
                          // labelText={'???????????????????????????????????????????????????'}
                          showSearchBar={true}
                          showPickerTitle={true}
                          listTextStyle={Styless.listTextStyle}
                          pickerStyle={Styless.pickerStyle}
                          selectedText={item.employee_name}
                          placeHolderText={this.state.placeHolderText}
                          searchBarPlaceHolder={"Search....."}
                          searchBarPlaceHolderColor={"#007aff"}
                          selectedTextStyle={Styless.selectedTextStyle}
                          placeHolderTextColor={"#d9d9d9"}
                          dropDownIconStyle={Styless.dropDownIconStyle}
                          searchBarStyle={Styless.searchBarStyle}
                          //dropDownIcon={require('../assets/pin.png')}

                          selectedValue={(i, items) => {
                            let trainingNeed = [...this.state.trainingNeed];
                            let item = { ...trainingNeed[index] };
                            item.employee_id = items.id;
                            item.employee_name = items.name;
                            trainingNeed[index] = item;
                            this.setState({ trainingNeed: trainingNeed });
                            this.selectedValue(index, items);
                          }}
                        >
                          {/* {listEmployees.map((element, l) => {
                            return (
                              <RNPickerDialog.item
                                label={
                                  this.state.lang === "EN"
                                    ? element.firstname_en +
                                      " " +
                                      element.lastname_en
                                    : element.firstname + " " + element.lastname
                                }
                                value={element.user_id}
                              />
                            );
                          })} */}
                        </RNPickerDialog>
                      </View>

                      <View style={{ flex: 1 }}></View>
                    </View>
                    {/* End User Picker */}

                    <Divider style={{ paddingBottom: 1, marginTop: 14 }} />

                    {/* ????????????????????????????????? ????????????????????????????????????????????????????????????????????? */}

                    {item.data.map((p) => {})}
                    {item.data.map((param, ip) => {
                      let excludeCourse = [];

                      for (
                        let l = 0;
                        l < this.state.trainingNeed[index].data.length;
                        l++
                      ) {
                        if (l != ip) {
                          excludeCourse.push(
                            this.state.trainingNeed[index].data[l].course_id
                          );
                        }
                      }
                      let listCourse = [];
                      for (let i = 0; i < this.state.selectCourse.length; i++) {
                        let selectCourse = this.state.selectCourse[i];
                        let courseId = selectCourse.course_id;
                        // ???????????????????????????
                        if (!excludeCourse.includes(courseId)) {
                          listCourse.push(selectCourse);
                        }
                      }
                      return (
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                        >
                          <View style={{ marginTop: 15 }}>
                            <View style={styles.pickerContainer}>
                              <View style={styles.scFlex}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={
                                    <Icon
                                      name="angle-down"
                                      style={{ width: "8%" }}
                                    />
                                  }
                                  style={styles.bdPicker1}
                                  placeholderStyle={{ color: "#bfc6ea" }}
                                  placeholder="SelectCourse"
                                  placeholderIconColor="#007aff"
                                  textStyle={{
                                    fontSize: 14,
                                    marginRight: "45%",
                                  }}
                                  selectedValue={param.course_id}
                                  onValueChange={(text) => {
                                    let trainingNeed = [
                                      ...this.state.trainingNeed,
                                    ];

                                    let item = { ...trainingNeed[index] };
                                    let data = { ...item["data"] };
                                    let param = data[ip];
                                    param.course_id = text;
                                    data[ip] = param;
                                    trainingNeed[index] = item;
                                    var id = "Id of subbrands to remove: ";
                                    //?????? key ?????????????????????????????????
                                    trainingNeed.forEach(function (o) {
                                      o.data = o.data.filter((s) => s.id != id);
                                    });
                                    this.setState({
                                      trainingNeed: trainingNeed,
                                    });
                                  }}
                                >
                                  {listCourse.map((Item) => {
                                    return (
                                      <Picker.Item
                                        label={Item.course_title}
                                        value={Item.course_id}
                                      />
                                    );
                                  })}
                                </Picker>
                              </View>
                              <View style={styles.pickerContainer2}>
                                <TouchableOpacity
                                  style={styles.addButton}
                                  onPress={() => this.addCourse(index)}
                                >
                                  <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.deleteButton}
                                  onPress={() => this.deleteCourse(index, ip)}
                                >
                                  <Text style={styles.addButtonText}>-</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </ScrollView>
                      );
                    })}
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
                      {this.state.lang === "EN" ? "Delete" : "??????"}
                    </Text>
                  </Button>
                  {/* ???????????????????????????????????????????????? */}
                </View>
              </ScrollView>
            );
          })}

          {/* <Button style={styles.submitButton}>
          <Text style={{ color: "#fff" }}>Submit</Text>
        </Button> */}

          <View>
            {/* ??????????????????????????????????????????????????????????????????????????????????????????????????? */}
            <Button
              style={styles.btnStyle1}
              onPress={() => {
                if (this.state.team) {
                  let trainingNeed = [
                    ...this.state.trainingNeed,
                    {
                      employee_id: "",
                      data: [{ course_id: "" }],
                    },
                  ];
                  this.setState({ trainingNeed: trainingNeed });
                } else {
                  Alert.alert("?????????????????????????????????????????????????????????????????????????????????????????????????????????");
                }
              }}
            >
              <Icon name="user-plus" color="#fff" size={26} />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {this.state.lang === "EN" ? "Add Employee" : "????????????????????????????????????"}
              </Text>
            </Button>
          </View>

          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-around",
              paddingVertical: 12,
              paddingHorizontal: 24,
              marginBottom: 40,
            }}
          >
            <View style={{ flex: 4 }}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.btnConfirmStyle}
                  onPress={() => this.onPressSend()}
                >
                  <Text style={{ color: "white" }}>
                    {this.state.lang === "EN" ? "Confirm" : "??????????????????"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}></View>

            <View style={{ flex: 4 }}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.btnCancelStyle}
                  onPress={(e) => this.props.navigation.goBack()}
                >
                  <Text style={{ color: "white" }}>
                    {this.state.lang === "EN" ? "Cancel" : "??????????????????"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    // flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: 500,
  },
  textHeader: {
    alignItems: "center",
    padding: 20,
  },
  //btn Add trainingNeed
  btnStyle1: {
    height: 45,
    backgroundColor: "#4392de",
    marginLeft: 12,
    marginRight: 12,
    // marginTop: 5,
    // width: "60%",
    alignSelf: "center",
    borderRadius: 10,
  },
  //????????????????????????????????????????????????
  containerSec2: {
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD",
    marginHorizontal: 10,
    marginBottom: 24,
  },
  //??????????????????????????????
  textStyle1: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  trainingNeedStyle: {
    marginVertical: "100%",
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
  ///?????????????????????????????????????????????
  pickerContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 12,
  },
  /// add button
  addButton: {
    borderRadius: 10,
    backgroundColor: "#4392de",
    height: 44,
    paddingHorizontal: 8,
  },
  /// del button
  deleteButton: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: 36,
    height: 36,
    marginLeft: -152,
    marginTop: 5,
  },
  addButtonText: {
    // color: "white",
    // fontSize: 30,
    // fontWeight: "700",
    // marginBottom: 5,
    // marginTop: -2,
    // marginLeft: 1,
  },
  contentInSec: {
    padding: 2,
  },
  submitButton: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#3BB54A",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonContainer: {
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 20,
    borderRadius: 4,
    marginTop: 2,
    width: "50%",
  },
  btnConfirmStyle: {
    backgroundColor: "#449D44",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    height: 45,
  },
  btnCancelStyle: {
    backgroundColor: "#5A6268",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    height: 45,
  },
  btnDeltrainingNeed: {
    backgroundColor: "#b30000",
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  scFlex: {
    flex: 5,
  },
  scFlex1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bdPicker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginBottom: 5,
    // marginHorizontal: 5,
    marginVertical: 5,
  },
  bdPicker1: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginHorizontal: 4,
  },
  btnDelCard: {
    backgroundColor: "#b30000",
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
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
});

const Styless = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: 500,
  },
  selectedTextStyle: {
    height: 100,
    borderColor: "#d9d9d9",
    backgroundColor: "transparent",
    justifyContent: "center",
    width: "100%",
    color: "gray",
    fontSize: 15,
    paddingLeft: 15,
    marginTop: -5,
  },

  selectedTextStyle1: {
    height: 50,
    borderColor: "gray",
    backgroundColor: "transparent",
    justifyContent: "center",
    width: "100%",
    color: "gray",
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 15,
  },

  listTextStyle: {
    color: "#000",
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left",
  },
  searchBarStyle: {
    marginBottom: 10,
    flexDirection: "row",
    height: 60,
    shadowRadius: 1,
    shadowOpacity: 1.0,
    borderWidth: 1,
    // shadowOffset: {
    //   width: 1,
    //   height: 1,
    // },
    borderColor: "gray",
    // shadowColor: '#303030',
    borderRadius: 5,
    elevation: 1,
    marginHorizontal: 10,
  },
  placeHolderTextStyle: {
    color: "red",
    padding: 10,
    textAlign: "left",
    width: "99%",
    flexDirection: "row",
  },
  dropDownIconStyle: {
    width: 10,
    height: 10,
    left: -40,
    // marginTop: 20,
  },
  dropDownIconStyle1: {
    width: 10,
    height: 10,
    left: -40,
    marginTop: 15,
  },
  pickerStyle: {
    marginTop: 12,

    marginBottom: 12,
    paddingHorizontal: 6,
    borderWidth: 0.6,
    height: 43,
    width: 350,
    borderColor: "gray",
    borderRadius: 4,
    elevation: 0.6,
    width: "100%",
  },
  pickerStyle1: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    marginBottom: 12,
  },
});
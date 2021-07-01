import React, { Component, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Picker } from "native-base";
import { Avatar, Card } from "react-native-paper";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { set } from "react-native-reanimated";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";
import Icons from "react-native-vector-icons/Ionicons";

let dimensions = Dimensions.get("window");
let pickerWidth = dimensions.width - 56;
const WIDTH = Dimensions.get("window").height;

export default class InHouseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "กรุณาเลือกผู้ใช้",
      course: "กรุณาเลือกหลักสูตร",
      courseItem: [],
      card: [],
      selectEmp: [],
      selectCourse: [],
      lang: "",
      firstname: "",
      getEmp: [],
      courses1: [],
      courses2: [],
      arrSelect: [],
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
          // console.log(result);
          if (result != null) {
            this.setState({
              selectEmp: result,
              firstname:
                this.state.lang === "EN"
                  ? result.firstname_en
                  : result.firstname,
              lastname:
                this.state.lang === "EN" ? result.lastname_en : result.lastname,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
    try {
      httpClient.get(`/Training/CourseInhouse`).then((response) => {
        const result = response.data;
        // console.log(result);
        if (result != null) {
          this.setState({
            selectCourse: result,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  deleteCourse(index, cardIndex) {
    let card = this.state.card;
    card[cardIndex].course.splice(index, 1);
    this.setState({ card: card });
  }
  deleteCard(cardIndex) {
    let card = this.state.card;
    card.splice(cardIndex, 1);
    this.setState({ card: card });
  }
  addInput = (cardIndex) => {
    let card = this.state.card;
    card[cardIndex].course.push(" ");
    this.setState({ card: card });
  };
  addCard = () => {
    let card = this.state.card;
    card.push({ emp: " ", course: [] });
    this.setState({ card: card });
  };
  onChangeSelect = (cardIndex, itemValue) => {
    let card = this.state.card;
    let arrSelect = this.state.arrSelect;
    if (
      card[cardIndex].selected === "" &&
      arrSelect.includes(itemValue) !== true
    ) {
      arrSelect.push(itemValue);
      card[cardIndex].selected = itemValue;
      this.setState({ card: card, arrSelect: arrSelect });
    } else {
      console.log("check Index");
      let chk = arrSelect.indexOf(card[cardIndex].selected);
      console.log(arrSelect);
      console.log(chk);
      if (arrSelect.includes(itemValue) !== true) {
        arrSelect.splice(chk, 1);
        arrSelect.push(itemValue);
        card[cardIndex].selected = itemValue;
        this.setState({ card: card, arrSelect: arrSelect });
      }
    }

    console.log(card);
    console.log(arrSelect);
  };
  onChangeCourse = (cardIndex, itemIndex, itemValue) => {
    let card = this.state.card;
    card[cardIndex].course = itemValue;
    this.setState({ card: card });
    console.log(card);
  };
  courseCard(selectedUser, cardIndex, card) {
    return (
      <ScrollView>
        <View style={styles.containerSec2}>
          <View style={styles.contentInSec}>
            <Text style={styles.textStyle1}>Employee Name</Text>
            <View>
              {/* Start User Picker */}
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="angle-down" style={{ width: "8%" }} />}
                style={{
                  width: "97%",
                  borderWidth: 1,
                  borderColor: "#d9d9d9",
                  marginBottom: 5,
                  marginHorizontal: 5,
                  marginVertical: 5,
                }}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholder="SelectEmployee"
                placeholderIconColor="#007aff"
                textStyle={{ fontSize: 14 }}
                selectedValue={this.state.card[cardIndex].selected}
                onValueChange={(itemValue, itemIndex) =>
                  this.onChangeSelect(cardIndex, itemValue)
                }
              >
                {/* <Picker.Item label={"SelectEmployee"} /> */}
                {this.state.selectEmp.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.firstname + " " + item.lastname}
                      value={item.user_id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
            {/* End User Picker */}

            <Divider style={{ paddingBottom: 1, marginTop: 14 }} />
            {/* แก้ */}
            {/* Start Selectable Course Picker */}
            <View style={{ marginTop: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  marginBottom: 12,
                  borderColor: "red",
                  borderWidth: 2,
                  width: "100%"
                }}
              >
                <Picker
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      name="angle-down"
                      style={{ width: "7%", marginLeft: 2 }}
                    />
                  }
                  style={{
                    // width: "80%",
                    borderWidth: 1,
                    borderColor: "#d9d9d9",
                  }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholder="SelectCourse"
                  placeholderIconColor="#007aff"
                  textStyle={{ fontSize: 14, marginRight: "45%" }}
                  selectedValue={card[cardIndex].course}
                  onValueChange={(itemValue, itemIndex) =>
                    this.onChangeCourse(cardIndex, itemIndex, itemValue)
                  }
                >
                  {this.state.selectCourse.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item.course_title}
                        value={item.course_id}
                        key={index}
                      />
                    );
                  })}
                </Picker>

                <View style={{ borderColor: "orange", borderWidth: 1 }}>
                  <TouchableOpacity onPress={() => this.addInput(cardIndex)}>
                    <Icons
                      name="md-add-circle"
                      size={40}
                      style={{
                        color: "blue",
                      }}
                    />
                    {/* <Text style={styles.addButtonText}>+</Text> */}
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                {card[cardIndex].course.map((item, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 5,
                        marginBottom: 12,
                        borderColor: "red",
                        borderWidth: 2,
                      }}
                      key={index}
                    >
                      <Picker
                        mode="dropdown"
                        iosIcon={
                          <Icon
                            name="angle-down"
                            style={{ width: "7%", marginLeft: 2 }}
                          />
                        }
                        // style={{
                        //   width: "65%",
                        //   borderWidth: 1,
                        //   borderColor: "#d9d9d9",
                        //   marginHorizontal: 5,
                        //   marginBottom: 5,
                        // }}
                        style={{
                          // width: "50%",
                          borderWidth: 1,
                          borderColor: "#d9d9d9",
                        }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholder="SelectCourse"
                        placeholderIconColor="#007aff"
                        textStyle={{ fontSize: 14, marginRight: "45%" }}
                        selectedValue={card[cardIndex].course}
                        onValueChange={(itemValue, itemIndex) =>
                          this.onChangeCourse(cardIndex, itemIndex, itemValue)
                        }
                      >
                        {this.state.selectCourse.map((item, index) => {
                          return (
                            <Picker.Item
                              label={item.course_title}
                              value={item.course_id}
                              key={index}
                            />
                          );
                        })}
                      </Picker>

                      <View style={{ borderColor: "orange", borderWidth: 1 }}>
                  <TouchableOpacity 
                  onPress={() => this.deleteCourse(index, cardIndex)}
                  >
                    <Icons
                      name="md-remove-circle"
                      size={40}
                      style={{
                        color: "red",
                      }}
                    />
                    {/* <Text style={styles.addButtonText}>+</Text> */}
                  </TouchableOpacity>
                </View>
                    </View>
                  );
                })}
                {/* <Button
                  mode="contained"
                  style={{
                    margin: 8,
                    backgroundColor: "red",
                  }}
                  onPress={() => this.deleteCard(cardIndex)}
                >
                  Delete Form
                </Button> */}

                <Button
                  mode="contained"
                  style={styles.btnDelCard}
                  onPress={() => this.deleteCard(cardIndex)}
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

                {/* End */}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
  render() {
    const selectedUser = this.state.selectedUser;
    const card = this.state.card;
    return (
      <View style={styles.background}>
        <ScrollView>
          <View style={styles.textHeader}>
            <Text style={{ color: "#333333", fontSize: "24" }}>
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
              style={styles.arrowDownStyle}
            />
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
          </View>

          {/* Start */}
          {card.map((item, cardIndex) => {
            return (
              <View>
                {this.courseCard(
                  //  courseItem,
                  //  setCourseItem,
                  //  course,
                  //  setCourse,
                  selectedUser,
                  //  setSelectedUser,
                  cardIndex,
                  card
                  //  setCard
                )}
              </View>
            );
          })}

          {/* <Button style={styles.submitButton}>
          <Text style={{ color: "#fff" }}>Submit</Text>
        </Button> */}

          <View>
            {/* เมื่อกดปุ่มนี้จะทำการเพิ่มพนักงาน */}
            <Button style={styles.btnStyle1} onPress={() => this.addCard()}>
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
              paddingVertical: 12,
              paddingHorizontal: 24,
              marginBottom: 40,
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.btnConfirmStyle}>
                <Text style={{ color: "white" }}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.btnCancelStyle}>
                <Text style={{ color: "white" }}>ยกเลิก</Text>
              </TouchableOpacity>
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
  //btn Add Card
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
  //กรอบข้อมูลรอบนอก
  containerSec2: {
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD",
    marginHorizontal: 10,
    marginBottom: 24,
  },
  //ชื่อหัวข้อ
  textStyle1: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 6,
    fontSize: 18,
  },
  cardStyle: {
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
  ///กรอบเพิ่มข้อมูล
  pickerContainer: {
    flexDirection: "row",
    // marginVertical: 1,
    marginTop: 5,
    marginBottom: 12,
    // marginLeft: 1,
    // marginRight: -95,
    borderColor: "red",
    borderWidth: 2,
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
    width: "20%",
    borderRadius: 4,
    marginTop: 2,
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
  btnDelCard: {
    backgroundColor: "#b30000",
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});

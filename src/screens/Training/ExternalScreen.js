import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Picker, Tab } from "native-base";
import { Avatar, Card, TextInput } from "react-native-paper";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { set } from "react-native-reanimated";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HomeScreen from "../Home/HomeScreen";
import MyProgramsScreen from "../MyProgramsScreen";
import ProfileScreen from "../Profile/ProfileScreen";

let dimensions = Dimensions.get("window");
let pickerWidth = dimensions.width - 56;

function deleteCourse(index, courseItem, setCourseItem) {
  let itemCopy = [...courseItem];
  itemCopy.splice(index, 1);
  setCourseItem(itemCopy);
}

function courseCard(
  courseItem,
  setCourseItem,
  course,
  setCourse,
  selectedUser,
  setSelectedUser,
  cardIndex,
  card,
  setCard,
  currentDate,
  setcurrentDate,
  isStart,
  setIsStart,
  isDatePickerVisible,
  setDatePickerVisibility,
  showDatePicker,
  handleConfirm,
  hideDatePicker,
) {
  return (
    <View>
      <ScrollView>
        <View style={styles.containerSec2}>
          <View style={styles.contentInSec}>
            <Text style={styles.textStyle1}>Employee Name</Text>

            <View>
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
                placeholderIconColor="#007aff"
                textStyle={{ fontSize: 14 }}
              >
                <Picker.Item label={"SelectEmployee"} />
              </Picker>
            </View>

            {/* Start กรอบใน */}
            <Divider style={{ paddingBottom: 1, marginTop: 15 }} />

            <View style={{ marginTop: 18 }}>
              <View style={styles.containerSec3}>
                <TextInput
                  style={styles.input}
                  placeholder="Course Name"
                  // keyboardType="numeric"
                />
                <TextInput
                  style={styles.input1}
                  placeholder="Training Provider"
                  // keyboardType="numeric"
                />

                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="angle-down" style={{ width: "8%" }} />}
                  style={{
                    width: "95%",
                    borderWidth: 1,
                    borderColor: "#d9d9d9",
                    marginBottom: 10,
                    marginHorizontal: 8,
                  }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  textStyle={{ fontSize: 14 }}
                >
                  <Picker.Item label={"SelectCourse"} />
                </Picker>

                <TouchableOpacity onPress={() => showDatePicker()}>
                  <View style={styles.inputDate}>
                    <Text style={{ paddingLeft: 10 }}>{currentDate}</Text>
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

                <TextInput
                  style={styles.input1}
                  placeholder="Training Cost"
                  // keyboardType="numeric"
                />
                <TextInput
                  style={styles.input1}
                  placeholder="Other"
                  // keyboardType="numeric"
                />

                <Text style={{ marginLeft: 10, fontSize: 16 }}>แนบไฟล์</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#DCDCDC",
                    width: "40%",
                    height: "8%",
                    marginTop: 10,
                    marginBottom: 15,
                    marginLeft: 8,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={{ marginLeft: 10, marginRight: 10 }}>
                      เลือกไฟล์
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.pickerContainer2}>
                  <TouchableOpacity
                    style={styles.addButton}
                    // onPress={() => setCards([...cards, "1"])}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    // onPress={() => deleteCourse(cardIndex, card, setCard)}
                  >
                    <Text style={styles.addButtonText}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <Button
            mode="contained"
            style={styles.btnDelCard}
            onPress={() => deleteCourse(cardIndex, card, setCard)}
          >
            Delete Form
          </Button>
        </View>
        {/* End กรอบนอก&กรอบใน */}
      </ScrollView>
    </View>
  );
}

function ExternalScreen() {

  const [selectedUser, setSelectedUser] = useState("กรุณาเลือกผู้ใช้");
  const [course, setCourse] = useState("กรุณาเลือกหลักสูตร");
  const [courseItem, setCourseItem] = useState([]);
  const [card, setCard] = useState([]);

  const [currentDate, setcurrentDate] = React.useState("dd/mm/yy");
  const [isStart, setIsStart] = React.useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const showDatePicker = (props) => {
    setDatePickerVisibility(true);
    if (props == "start") {
      setIsStart(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    date = formatDate(date);

    if (isStart) {
      setStartDate(date);
      setIsStart(false);
    } else {
      setEndDate(date);
    }
    hideDatePicker();
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.textHeader}>
          <Text style={{ color: "#333333", fontSize: "24" }}>
            Training Needs - External
          </Text>
        </View>

        <View>
          <Button
            style={styles.btnStyle1}
            onPress={() => setCard([...card, "1"])}
          >
            <Icon name="user-plus" color="#fff" size="26" />
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
              }}
            >
              Add Employee
            </Text>
          </Button>
        </View>

        {/* <Divider style={{ paddingBottom: 1, marginTop: 15 }} /> */}
        <View
          style={{
            marginVertical: 25,
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
              {courseCard(
                courseItem,
                setCourseItem,
                course,
                setCourse,
                selectedUser,
                setSelectedUser,
                cardIndex,
                card,
                setCard,
                currentDate,
                setcurrentDate,
                isStart,
                setIsStart,
                isDatePickerVisible,
                setDatePickerVisibility,
                showDatePicker,
                handleConfirm,
                hideDatePicker,
              )}
            </View>
          );
        })}
        
        <Button style={styles.submitButton}>
        <Text style={{ color: "#fff" }}>Submit</Text>
      </Button>

      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: 500,
  },
  //กรอบข้อมูล
  containerSec2: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
    marginHorizontal: 10,
    marginVertical: 36,
  },
  textHeader: {
    alignItems: "center",
    padding: 20,
  },
  //ชื่อหัวข้อ
  textStyle1: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 6,
    fontSize: 18,
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
    width: "95%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999999",
    marginHorizontal: 10,
    // marginRight: 8,
    // marginLeft: 10,
  },
  contentInSec: {
    padding: 2,
  },
  btnStyle1: {
    height: 45,
    backgroundColor: "#F0AD4E",
    marginLeft: 12,
    marginRight: 12,
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
    marginTop: 1,
    marginVertical: 18,
    marginHorizontal: 10,
    backgroundColor: "red",
  },
});

export default ExternalScreen;

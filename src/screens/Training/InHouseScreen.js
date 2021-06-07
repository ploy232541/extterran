import React, { useState } from "react";
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
  setCard
) {
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
              placeholderIconColor="#007aff"
              textStyle={{ fontSize: 14 }}
              // selectedValue={selectedUser}
              // onValueChange={(itemValue, index) => setSelectedUser(itemValue)}
            >
              <Picker.Item label={"SelectEmployee"} />
              {/* <Picker.Item label={"User 1"} value={"User1"} />
            <Picker.Item label={"User 2"} value={"User2"} />
            <Picker.Item label={"User 3"} value={"User3"} /> */}
            </Picker>
          </View>
          {/* End User Picker */}

          <Divider style={{ paddingBottom: 1, marginTop: 15 }} />

          {/* Start Selectable Course Picker */}
          <View style={{ marginTop: 15 }}>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="angle-down" style={{ width: "8%" }} />}
                style={{
                  width: "65%",
                  borderWidth: 1,
                  borderColor: "#d9d9d9",
                  marginHorizontal: 5,
                  marginBottom: 5,
                }}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                textStyle={{ fontSize: 14 }}
                // selectedValue={course}
                // onValueChange={(itemValue, itemIndex) => setCourse(itemValue)}
              >
                <Picker.Item label={"SelectCourse"} />
                {/* <Picker.Item label="Course 1" value="Course1" />
              <Picker.Item label="Course 2" value="Course2" />
              <Picker.Item label="Course 3" value="Course3" /> */}
              </Picker>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setCourseItem([...courseItem, course,])}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View>
              {courseItem.map((item, index) => {
                return (
                  <View style={styles.pickerContainer} key={index}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="angle-down" style={{ width: "6%" }} />}
                      style={{
                        width: "65%",
                        borderWidth: 1,
                        borderColor: "#d9d9d9",
                        marginHorizontal: 5,
                        marginBottom: 5,
                      }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      textStyle={{ fontSize: 14 }}
                      // selectedValue={item}
                      // enabled={false}
                    >
                      {/* <Picker.Item label={item} value={item} /> */}
                      <Picker.Item label={"SelectCourse1"} />
                    </Picker>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        deleteCourse(index, courseItem, setCourseItem)
                      }
                    >
                      <Text style={styles.addButtonText}>-</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <Button
                mode="contained"
                style={{
                  margin: 8,
                  backgroundColor: "red",
                }}
                onPress={() => deleteCourse(cardIndex, card, setCard)}
              >
                Delete Form
              </Button>
              {/* End */}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function InHouseScreen() {
  const [selectedUser, setSelectedUser] = useState("กรุณาเลือกผู้ใช้");
  const [course, setCourse] = useState("กรุณาเลือกหลักสูตร");
  const [courseItem, setCourseItem] = useState([]);
  const [card, setCard] = useState([]);

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.textHeader}>
          <Text style={{ color: "#333333", fontSize: "24" }}>
            Training Needs - In house
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
                setCard
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
  textHeader: {
    alignItems: "center",
    padding: 20,
  },
  //btn Add Card
  btnStyle1: {
    height: 45,
    width: "94%",
    backgroundColor: "#F0AD4E",
    marginVertical: 2,
    marginHorizontal: 12,
  },
  //กรอบข้อมูลรอบนอก
  containerSec2: {
    marginTop: 18,
    marginRight: 12,
    marginLeft: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
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
    marginVertical: 1,
    marginTop: 5,
    marginBottom: 12,
    marginLeft: 1,
    marginRight: -95,
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
    marginLeft: -145,
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
    marginLeft: -145,
    marginTop: 5,
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
});

export default InHouseScreen;


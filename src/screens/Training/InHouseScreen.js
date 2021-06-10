import { Picker } from "native-base";
import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Avatar, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

let dimensions = Dimensions.get("window");
let pickerWidth = dimensions.width - 56;
const HEIGHT = Dimensions.get("window").height;

export default class componentName extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
              select_2: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      Alert.alert(error);
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

          {/* ในกรอบ */}
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
                    <Text style={styles.textStyle1}>Employee Name</Text>

                    {/* Start User Picker */}
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
                          this.state.lang === "EN" ? "Selecte" : "เลือก"
                        }
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        textStyle={{ fontSize: 14 }}
                        // selectedValue={selectedUser}
                        // onValueChange={(itemValue, index) => setSelectedUser(itemValue)}
                      >
                        <Picker.Item
                          label={
                            this.state.lang === "EN"
                              ? "Please select"
                              : "กรุณาเลือก"
                          }
                          value=""
                        />
                        {/* {this.state.select_1.map((data) => {
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
                                })} */}
                      </Picker>
                    </View>
                    {/* End User Picker */}
                  </View>

                  <Divider style={{ paddingBottom: 1, marginTop: 10 }} />

                  <View style={{ marginTop: 24, marginBottom: 24 }}>
                    <View style={styles.containerSec3}>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                             paddingVertical: 24,
                            padding: 62,

                            //  marginHorizontal: 10,
                          }}
                        >
                          {/* Start Course Picker */}
                          <View>
                            <Picker
                              mode="dropdown"
                              iosIcon={
                                <Icon
                                  name="angle-down"
                                  style={{ width: "18%", paddingHorizontal: 2, }}
                                />
                              }
                              style={styles.inputLightStyle1}
                              placeholder={
                                this.state.lang === "EN" ? "Selecte" : "เลือก"
                              }
                              placeholderStyle={{ color: "#bfc6ea" }}
                              placeholderIconColor="#007aff"
                              textStyle={{ fontSize: 14 }}
                              // selectedValue={selectedUser}
                              // onValueChange={(itemValue, index) => setSelectedUser(itemValue)}
                            >
                              <Picker.Item
                                label={
                                  this.state.lang === "EN"
                                    ? "Please select"
                                    : "กรุณาเลือก"
                                }
                                value=""
                              />
                              {/* {this.state.select_1.map((data) => {
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
                                })} */}
                            </Picker>
                          </View>
                          {/* End Course Picker */}

                          <TouchableOpacity
                            style={styles.addButton}
                            onPress={() =>
                              setCourseItem([...courseItem, course])
                            }
                          >
                            <Text style={styles.addButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                    </View>

                </View>
              </View>
            </ScrollView>
          </View>
          {/* ในกรอบ */}
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
  },
  //กรอบข้อมูล
  containerSec2: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
    marginHorizontal: 10,
    marginBottom: 50,
  },
  containerSec3: {
    // width: "95%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999999",
    marginHorizontal: 10,
    // marginRight: 8,
    // marginLeft: 10,
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
  //btn Add Card
  btnStyle1: {
    height: 45,
    width: "94%",
    backgroundColor: "#F0AD4E",
    marginVertical: 2,
    marginHorizontal: 12,
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
    height: HEIGHT / 20,
    width: 50,
    // marginHorizontal: 10
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
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 20,
    width: "100%",
    marginTop: 15,
    marginBottom: 2,
    borderColor: "#007aff",
  },
  inputLightStyle1: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 20,
    width: "76%",
    marginBottom: 2,
    borderColor: "#007aff",
    // marginHorizontal: 24,
  },
});

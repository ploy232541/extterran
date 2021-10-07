import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { Picker, Tab } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { AsyncStorage } from "react-native";
import Icons from "react-native-vector-icons/FontAwesome";
import { httpClient } from "../../core/HttpClient";

const HEIGHT = Dimensions.get("window").height;

let dimensions = Dimensions.get("window");
let imageHeight = Math.round((dimensions.width * 9) / 16);

export default class SafetyBootsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boots: false,
      shoes: false,
      select_1: [],
      select_boots: false,
      user_id: "",
      lang: "",
      boots_id: "",
      boots_type: "",
      boots_name: "",
      boots_size: "",
      month: "",
      orgid: "",
      authorityid: [],
      per_id: "", //
      select_type: "", //
      uniform_type: "", //
      uniform_name: "", //
      uniform_part: "", //
      uniform_total: "", //
      loading: true
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");

    let n = new Date().getMonth();

    this.setState({ user_id: id, month: n });
    //สำหรับเทส
    if (n < 8) {
      console.log(n);
      this.setState({ select_boots: true });
    }
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN" });
    } else {
      this.setState({ lang: "TH" });
    }
    try {
      httpClient
        .get(`/Training/SizeBoots`)
        .then((response) => {
          const result = response.data;

          if (result != null) {
            let data = [];

            for (var i in result) {
              data[i] = { id: i, name: result[i] };
            }
            this.setState({
              select_1: data
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/getBoots/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          if (result != null && result != "") {
            let size = this.state.select_1.find((member) => {
              return member.name == result[0].size;
            });
            if (size == null) {
              this.reset();
            } else {
              this.setState({
                boots_id: result[0].request_id,
                boots_type: result[0].uniform_type,
                uniform_part: result[0].uniform_part,
                uniform_type: result[0].uniform_type,
                select_type: result[0].select_type,
                boots_size: size.id,
                select_boots: true
              });
              if (result[0].uniform_type == 4) {
                this.setState({ boots: true });
              } else if (result[0].uniform_type == 5) {
                this.setState({ shoes: true });
              }
            }
          }
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/getorgcharttest/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            for (let i = 0; i < result.length; i++) {
              var row = result[i];

              this.setState({
                orgid: row.orgchart_id
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/getauthorityid/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            for (let i = 0; i < result.length; i++) {
              this.setState({
                authorityid: result
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }

  onPressSend = () => {
    const {
      user_id,
      boots_id,
      per_id,
      boots_type,
      uniform_total,
      uniform_part,
      uniform_type,
      select_type,
      boots_name,
      uniform_name,
      boots_size
    } = this.state;
    if (boots_size == null || boots_size == "") {
      this.state.lang === "EN"
        ? Alert.alert("Please select a shoe size.")
        : Alert.alert("กรุณาเลือก SIZE รองเท้า");
    } else {
      let result = this.state.select_1.find((member) => {
        return member.id === this.state.boots_size;
      });
      const params = {
        boots_id,
        per_id,
        user_id,
        boots_type,
        uniform_total,
        uniform_part,
        uniform_type,
        select_type,
        boots_name,
        uniform_name,
        boots_size: result.name
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
                .post(`/Training/InsertSafetyBoots`, params)
                .then((response) => {
                  const result = response.data;

                  if (result === true) {
                    Alert.alert(
                      this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                      this.state.lang === "EN" ? "Success" : "บันทึกสำเร็จ",
                      [
                        {
                          text: this.state.lang === "EN" ? "OK" : "ตกลง",
                          onPress: (e) => this.props.navigation.goBack()
                        }
                      ],
                      { cancelable: false }
                    );
                  } else {
                    Alert.alert(
                      this.state.lang === "EN"
                        ? `Can't save SizeBoots`
                        : "ไม่สามารถบันทึกไซต์รองเท้าได้"
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
  };
  reset = async () => {
    //สำหรับเทส
    if (this.state.month < 8) {
      this.setState({ select_boots: true });
    }
    try {
      httpClient
        .get(`/Training/getBoots/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          if (result != null && result != "") {
            let size = this.state.select_1.find((member) => {
              return member.name == result[0].size;
            });
            if (size == null) {
              this.reset();
            } else {
              this.setState({
                boots_id: result[0].request_id,
                boots_type: result[0].uniform_type,
                uniform_part: result[0].uniform_part,
                uniform_type: result[0].uniform_type,
                select_type: result[0].select_type,
                boots_size: size.id,
                select_boots: true
              });
              if (result[0].uniform_type == 4) {
                this.setState({ boots: true });
              } else if (result[0].uniform_type == 5) {
                this.setState({ shoes: true });
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      );
    }
    console.log("orgid = " + this.state.orgid);
    if (
      this.state.orgid == 2 ||
      (this.state.orgid == 3 && this.state.authorityid != null)
    ) {
      return (
        <View style={styles.background}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <Text style={{ color: "#009bdc", fontSize: 24 }}>
                {this.state.lang === "EN"
                  ? "Select Safety Boots"
                  : "เลือกขนาด Safety Boots"}
              </Text>
            </View>
            <View style={styles.containerSec1}>
              <Card style={styles.card}>
                <Card.Title title="Safety Boots" />
                <Card.Content>
                  <Image
                    style={styles.cardImage}
                    source={require("../../asset/boots_image/safety.png")}
                  />

                  {this.state.boots ? (
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                    >
                      <Button
                        style={{ backgroundColor: "red" }}
                        mode="contained"
                        disabled={this.state.select_boots}
                        onPress={() =>
                          this.setState({
                            boots: false,
                            boots_type: "",
                            uniform_total: "",
                            uniform_part: "",
                            uniform_type: "",
                            select_type: "",
                            boots_size: ""
                          })
                        }
                      >
                        {" "}
                        <Icons
                          name="check"
                          size={20}
                          style={{
                            marginLeft: 10,
                            marginRight: 5,
                            color: "white"
                          }}
                        />
                        Safety Boots
                      </Button>

                      <View style={{ marginTop: 12 }}>
                        <Text>
                          {this.state.lang === "EN"
                            ? "Boot size (US)"
                            : "ขนาดรองเท้า (US)"}
                        </Text>
                        <Picker
                          enabled={!this.state.select_boots}
                          mode="dropdown"
                          placeholder={
                            this.state.lang === "EN"
                              ? "Choose size..."
                              : "เลือกขนาด..."
                          }
                          iosIcon={
                            <Icon
                              name="angle-down"
                              style={{
                                width: "10%",
                                paddingHorizontal: 1,
                                paddingBottom: 24
                              }}
                            />
                          }
                          style={styles.selectableInputStyle}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.boots_size}
                          onValueChange={(text) =>
                            this.setState({ boots_size: text })
                          }
                          textStyle={{ fontSize: 14 }}
                        >
                          <Picker.Item
                            label={
                              this.state.lang === "EN"
                                ? "Choose size..."
                                : "เลือกขนาด..."
                            }
                            value=""
                          />
                          {this.state.select_1.map((item) => {
                            return (
                              <Picker.Item label={item.name} value={item.id} />
                            );
                          })}
                        </Picker>
                      </View>
                    </ScrollView>
                  ) : (
                    <Button
                      mode="contained"
                      disabled={this.state.select_boots}
                      onPress={() =>
                        this.setState({
                          boots: true,
                          shoes: false,
                          boots_type: 1,
                          uniform_total: 1,
                          uniform_part: 4,
                          uniform_type: 4,
                          select_type: 2,
                          boots_size: "",
                          boots_name: "Safety Boots",
                          uniform_name: "Safety Boots"
                        })
                      }
                    >
                      Safety Boots
                    </Button>
                  )}
                </Card.Content>
              </Card>

              <Card style={styles.card}>
                <Card.Title title="Safety Shoes" />
                <Card.Content>
                  <Image
                    style={styles.cardImage}
                    source={require("../../asset/boots_image/safetshoes.png")}
                  />
                  {this.state.shoes ? (
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                    >
                      <Button
                        style={{ backgroundColor: "red" }}
                        mode="contained"
                        disabled={this.state.select_boots}
                        onPress={() =>
                          this.setState({
                            shoes: false,
                            boots_type: "",
                            uniform_total: "",
                            uniform_part: "",
                            uniform_type: "",
                            select_type: "",
                            boots_size: ""
                          })
                        }
                      >
                        <Icons
                          name="check"
                          size={20}
                          style={{
                            marginLeft: 10,
                            marginRight: 5,
                            color: "white"
                          }}
                        />
                        Safety Shoes
                      </Button>
                      <View style={{ marginTop: 12 }}>
                        <Text>
                          {this.state.lang === "EN"
                            ? "Boot size (US)"
                            : "ขนาดรองเท้า (US)"}
                        </Text>
                        <Picker
                          enabled={!this.state.select_boots}
                          mode="dropdown"
                          placeholder={
                            this.state.lang === "EN"
                              ? "Choose size..."
                              : "เลือกขนาด..."
                          }
                          iosIcon={
                            <Icon
                              name="angle-down"
                              style={{
                                width: "10%",
                                paddingHorizontal: 1,
                                paddingBottom: 24
                              }}
                            />
                          }
                          style={styles.selectableInputStyle}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.boots_size}
                          onValueChange={(text) =>
                            this.setState({ boots_size: text })
                          }
                          textStyle={{ fontSize: 14 }}
                        >
                          <Picker.Item
                            label={
                              this.state.lang === "EN"
                                ? "Choose size..."
                                : "เลือกขนาด..."
                            }
                            value=""
                          />
                          {this.state.select_1.map((item) => {
                            return (
                              <Picker.Item label={item.name} value={item.id} />
                            );
                          })}
                        </Picker>
                      </View>
                    </ScrollView>
                  ) : (
                    <Button
                      mode="contained"
                      disabled={this.state.select_boots}
                      onPress={() =>
                        this.setState({
                          shoes: true,
                          boots: false,
                          boots_type: 2,
                          uniform_total: 1,
                          uniform_part: 4,
                          uniform_type: 5,
                          select_type: 2,
                          boots_size: "",
                          boots_name: "Safety Shoes",
                          uniform_name: "Safety Shoes"
                        })
                      }
                    >
                      Safety Shoes
                    </Button>
                  )}
                </Card.Content>
              </Card>

              <Button
                disabled={this.state.select_boots}
                onPress={() => this.onPressSend()}
                mode="contained"
                style={styles.submitButton}
              >
                ยืนยัน
              </Button>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.background}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <Text style={{ color: "#009bdc", fontSize: 24 }}>
                {this.state.lang === "EN"
                  ? "Select Safety Boots"
                  : "เลือกขนาด Safety Boots"}
              </Text>
            </View>
            <View style={styles.containerSec1}>
              <Card style={styles.card}>
                <Card.Title title="Safety Boots" />
                <Card.Content>
                  <Image
                    style={styles.cardImage}
                    source={require("../../asset/boots_image/safety.png")}
                  />

                  {this.state.boots ? (
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                    >
                      <Button
                        style={{ backgroundColor: "red" }}
                        mode="contained"
                        disabled={this.state.select_boots}
                        onPress={() =>
                          this.setState({
                            boots: false,
                            boots_type: "",
                            uniform_total: "",
                            uniform_part: "",
                            uniform_type: "",
                            select_type: "",
                            boots_size: ""
                          })
                        }
                      >
                        {" "}
                        <Icons
                          name="check"
                          size={20}
                          style={{
                            marginLeft: 10,
                            marginRight: 5,
                            color: "white"
                          }}
                        />
                        Safety Boots
                      </Button>

                      <View style={{ marginTop: 12 }}>
                        <Text>
                          {this.state.lang === "EN"
                            ? "Boot size (US)"
                            : "ขนาดรองเท้า (US)"}
                        </Text>
                        <Picker
                          enabled={!this.state.select_boots}
                          mode="dropdown"
                          placeholder={
                            this.state.lang === "EN"
                              ? "Choose size..."
                              : "เลือกขนาด..."
                          }
                          iosIcon={
                            <Icon
                              name="angle-down"
                              style={{
                                width: "10%",
                                paddingHorizontal: 1,
                                paddingBottom: 24
                              }}
                            />
                          }
                          style={styles.selectableInputStyle}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.boots_size}
                          onValueChange={(text) =>
                            this.setState({ boots_size: text })
                          }
                          textStyle={{ fontSize: 14 }}
                        >
                          <Picker.Item
                            label={
                              this.state.lang === "EN"
                                ? "Choose size..."
                                : "เลือกขนาด..."
                            }
                            value=""
                          />
                          {this.state.select_1.map((item) => {
                            return (
                              <Picker.Item label={item.name} value={item.id} />
                            );
                          })}
                        </Picker>
                      </View>
                    </ScrollView>
                  ) : (
                    <Button
                      mode="contained"
                      disabled={this.state.select_boots}
                      onPress={() =>
                        this.setState({
                          boots: true,
                          shoes: false,
                          boots_type: 1,
                          uniform_total: 1,
                          uniform_part: 4,
                          uniform_type: 4,
                          select_type: 2,
                          boots_size: "",
                          boots_name: "Safety Boots",
                          uniform_name: "Safety Boots"
                        })
                      }
                    >
                      Safety Boots
                    </Button>
                  )}
                </Card.Content>
              </Card>

              <Button
                disabled={this.state.select_boots}
                onPress={() => this.onPressSend()}
                mode="contained"
                style={styles.submitButton}
              >
                ยืนยัน
              </Button>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 50
  },
  textHeader: {
    alignItems: "center",
    padding: 15
  },
  containerSec1: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    borderColor: "#398DDD",
    marginBottom: 15
  },
  inputStyle: {
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 5,
    height: HEIGHT / 25,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  selectableInputStyle: {
    borderColor: "#DCDCDC",
    backgroundColor: "#FFF",
    color: "#555",
    borderRadius: 5,
    borderWidth: 1,
    height: HEIGHT / 25,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
    width: "100%"
  },
  submitButton: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#28A745",
    marginTop: 20,
    color: "#fff",
    borderRadius: 20,
    width: "35%"
  },
  card: {
    marginVertical: 16,
    backgroundColor: "#FAF0E6"
  },
  cardImage: {
    resizeMode: "cover",
    width: "100%",
    height: imageHeight
  },

  cardImageContainerExists: {
    borderColor: "#4392de",
    borderWidth: 1,
    marginBottom: 16
  },
  cardImageTextContainerExists: {
    backgroundColor: "#4392de",
    padding: 16,
    alignItems: "center"
  },
  cardImageTextExists: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  }
});

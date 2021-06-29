import { Picker } from "native-base";
import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Text,
  Image,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome";
import { httpClient } from "../../core/HttpClient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Alert } from "react-native";

const HEIGHT = Dimensions.get("window").height;

let dimensions = Dimensions.get("window");
let imageHeight = Math.round((dimensions.width * 9) / 16);

export default class OutfitScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "",
      user_id: "",
      bob: false,
      shirt: "",
      coverall: "",
      shirts_type: "",
      sex: "",
      shirts_size: "",
      editShirt: "",
      pants_size: "",
      editPant: "",
      amount_shirts: "",
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");

    // let n = new Date().getMonth();
    // this.setState({ user_id: id, month: n });
    // if (this.state.month < 10) {
    //   this.setState({ select_boots: true });
    // }
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN" });
    } else {
      this.setState({ lang: "TH" });
    }
    try {
    } catch (error) {}
  }

  render() {
    return (
      <View style={styles.background}>
        <ScrollView>
          <View style={styles.textHeader}>
            <Text style={{ color: "#009bdc", fontSize: "24" }}>
              {this.state.lang === "EN"
                ? "Select size uniform"
                : "เลือกขนาด Uniform"}
            </Text>
          </View>
          <View style={styles.containerSec1}>
            {/* card:1 */}
            <Card style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  {this.state.lang === "EN" ? "Size Charts: " : "ตารางไซส์: "}
                </Text>
                <Button 
                style={{ borderColor: "orange", borderWidth: 1, backgroundColor: "orange" }}
               
                // ปุ่มดูใส่เสื้อ
              //  onPress={() => props.navigation.navigate('SafetyBootsScreen')}
                >
                  <Text style={{ fontSize: 10, alignSelf: "center", color: "white" }}>
                    {this.state.lang === "EN"
                      ? "Bob เอวบ๊อบ ชาย/หญิง"
                      : "Bob เอวบ๊อบ ชาย/หญิง"}
                  </Text>
                </Button>
              </View>

              <Card.Content>
                <Image
                  style={styles.cardImage}
                  source={require("../../asset/outfit_image/uniform-1.png")}
                />

                {this.state.bob ? (
                  <ScrollView>
                    <Button
                      style={{ backgroundColor: "red" }}
                      mode="contained"
                      // disabled={this.state.select_bob}
                      onPress={() =>
                        this.setState({
                          bob: false,
                          shirts_type: "",
                          sex: "",
                          shirts_size: "",
                          editShirt: "",
                          pants_size: "",
                          editPant: "",
                          amount_shirts: "",
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
                          color: "white",
                        }}
                      />
                      {this.state.lang === "EN"
                        ? "ชุดเชิ้ตเอวบ๊อบ (Bob)"
                        : "ชุดเชิ้ตเอวบ๊อบ (Bob)"}
                    </Button>

                    {/* เพิ่ม */}
                    <View style={{ marginTop: 12 }}>
                      <Text>{this.state.lang === "EN" ? "Sex" : "เพศ"}</Text>
                      <Picker
                        // enabled={!this.state.select_boots}
                        mode="dropdown"
                        placeholder={
                          this.state.lang === "EN" ? "Sex..." : "เพศ..."
                        }
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
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.sex}
                        onValueChange={(text) => this.setState({ sex: text })}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label={this.state.lang === "EN" ? "Sex..." : "เพศ..."}
                          value=""
                        />
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Shirt size" : "ขนาดเสื้อ"}
                      </Text>
                      <Picker
                        // enabled={!this.state.select_boots}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.shirts_size}
                        onValueChange={(text) =>
                          this.setState({ shirts_size: text })
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
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวแขนเสื้อ (นิ้ว)"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Pant size" : "ขนาดกางเกง"}
                      </Text>
                      <Picker
                        // enabled={!this.state.select_boots}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.pants_size}
                        onValueChange={(text) =>
                          this.setState({ pants_size: text })
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
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวขากางเกง (นิ้ว)"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    // disabled={this.state.select_boots}
                    onPress={() =>
                      this.setState({
                        bob: true,
                        // shoes: false,
                        // boots_type: 1,
                        // boots_size: "",
                        // boots_name: "Safety Boots",
                      })
                    }
                  >
                    {this.state.lang === "EN"
                      ? "ชุดเชิ้ตเอวบ๊อบ (Bob)"
                      : "ชุดเชิ้ตเอวบ๊อบ (Bob)"}
                  </Button>
                )}
              </Card.Content>
            </Card>
            {/* card:1 */}

            {/* card:2 */}
            <Card style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  {this.state.lang === "EN" ? "Size Charts: " : "ตารางไซส์: "}
                </Text>
                <Button style={{ borderColor: "orange", borderWidth: 1, backgroundColor: "orange" }}
                // ปุ่มดูใส่เสื้อ
              //  onPress={() => props.navigation.navigate('SafetyBootsScreen')}
              >
                  <Text style={{ fontSize: 10, alignSelf: "center", color: "white" }}>
                    {this.state.lang === "EN"
                      ? "Shirt เสื้อปกเชิ้ตเอวเชิ้ต ชาย/หญิง"
                      : "Shirt เสื้อปกเชิ้ตเอวเชิ้ต ชาย/หญิง"}
                  </Text>
                </Button>
              </View>

              <Card.Content>
                <Image
                  style={styles.cardImage}
                  source={require("../../asset/outfit_image/uniform-2.png")}
                />

                {this.state.shirt ? (
                  <ScrollView>
                    <Button
                      style={{ backgroundColor: "red" }}
                      mode="contained"
                      // disabled={this.state.select_bob}
                      onPress={() =>
                        this.setState({
                          shirt: false,
                          shirts_type: "",
                          sex: "",
                          shirts_size: "",
                          editShirt: "",
                          pants_size: "",
                          editPant: "",
                          amount_shirts: "",
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
                          color: "white",
                        }}
                      />
                      {this.state.lang === "EN"
                        ? "ชุดเชิ้ตเอวปล่อย (Shirt)"
                        : "ชุดเชิ้ตเอวปล่อย (Shirt)"}
                    </Button>

                    {/* เพิ่ม */}
                    <View style={{ marginTop: 12 }}>
                      <Text>{this.state.lang === "EN" ? "Sex" : "เพศ"}</Text>
                      <Picker
                        // enabled={!this.state.select_boots}
                        mode="dropdown"
                        placeholder={
                          this.state.lang === "EN" ? "Sex..." : "เพศ..."
                        }
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
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.sex}
                        onValueChange={(text) => this.setState({ sex: text })}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label={this.state.lang === "EN" ? "Sex..." : "เพศ..."}
                          value=""
                        />
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Shirt size" : "ขนาดเสื้อ"}
                      </Text>
                      <Picker
                        // enabled={!this.state.select_boots}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.shirts_size}
                        onValueChange={(text) =>
                          this.setState({ shirts_size: text })
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
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวแขนเสื้อ (นิ้ว)"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Pant size" : "ขนาดกางเกง"}
                      </Text>
                      <Picker
                        // enabled={!this.state.select_boots}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.pants_size}
                        onValueChange={(text) =>
                          this.setState({ pants_size: text })
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
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวขากางเกง (นิ้ว)"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    // disabled={this.state.select_boots}
                    onPress={() =>
                      this.setState({
                        shirt: true,
                        // shoes: false,
                        // boots_type: 1,
                        // boots_size: "",
                        // boots_name: "Safety Boots",
                      })
                    }
                  >
                    {this.state.lang === "EN"
                      ? "ชุดเชิ้ตเอวปล่อย (Shirt)"
                      : "ชุดเชิ้ตเอวปล่อย (Shirt)"}
                  </Button>
                )}
              </Card.Content>
            </Card>
            {/* card:2 */}

            {/* card:3 */}
            <Card style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                  }}
                >
                  {this.state.lang === "EN" ? "Size Charts: " : "ตารางไซส์: "}
                </Text>
                <Button style={{ borderColor: "orange", borderWidth: 1, backgroundColor: "orange" }}
                // ปุ่มดูใส่เสื้อ
              //  onPress={() => props.navigation.navigate('SafetyBootsScreen')}
                >
                  <Text style={{ fontSize: 10, alignSelf: "center", color: "white" }}>
                    {this.state.lang === "EN"
                      ? "Coverall ชุดหมี"
                      : "Coverall ชุดหมี"}
                  </Text>
                </Button>
              </View>

              <Card.Content>
                <Image
                  style={styles.cardImage}
                  source={require("../../asset/outfit_image/uniform-3.png")}
                />

                {this.state.coverall ? (
                  <ScrollView>
                    <Button
                      style={{ backgroundColor: "red" }}
                      mode="contained"
                      // disabled={this.state.select_bob}
                      onPress={() =>
                        this.setState({
                          coverall: false,
                          shirts_type: "",
                          coverall_size: "",
                          editShirt: "",
                          amount_shirts: "",
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
                          color: "white",
                        }}
                      />
                      {this.state.lang === "EN"
                        ? "ชุดหมี (Coverall)"
                        : "ชุดหมี (Coverall)"}
                    </Button>

                    {/* เพิ่ม */}
                    <View style={{ marginTop: 12 }}>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Coverall size"
                          : "ขนาดชุดหมี"}
                      </Text>
                      <Picker
                        // enabled={!this.state.select_boots}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.coverall_size}
                        onValueChange={(text) =>
                          this.setState({ coverall_size: text })
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
                        {/* {this.state.select_1.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })} */}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขขนาดชุด (นิ้ว)"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    // disabled={this.state.select_boots}
                    onPress={() =>
                      this.setState({
                        coverall: true,
                        // shoes: false,
                        // boots_type: 1,
                        // boots_size: "",
                        // boots_name: "Safety Boots",
                      })
                    }
                  >
                    {this.state.lang === "EN"
                      ? "ชุดหมี (Coverall)"
                      : "ชุดหมี (Coverall)"}
                  </Button>
                )}
              </Card.Content>
            </Card>
            {/* card:3 */}

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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 50,
  },
  textHeader: {
    alignItems: "center",
    padding: 15,
  },
  containerSec1: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    borderColor: "#398DDD",
    marginBottom: 15,
  },
  inputStyle: {
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 5,
    height: HEIGHT / 25,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
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
    width: "100%",
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
    marginVertical: 8,
    backgroundColor: "#28A745",
    marginTop: 20,
    color: "#fff",
    borderRadius: 20,
    width: "35%",
  },
  card: {
    marginVertical: 16,
    backgroundColor: "#FAF0E6",
  },
  cardImage: {
    resizeMode: "cover",
    width: "100%",
    height: imageHeight,
  },

  cardImageContainerExists: {
    borderColor: "#4392de",
    borderWidth: 1,
    marginBottom: 16,
  },
  cardImageTextContainerExists: {
    backgroundColor: "#4392de",
    padding: 16,
    alignItems: "center",
  },
  cardImageTextExists: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

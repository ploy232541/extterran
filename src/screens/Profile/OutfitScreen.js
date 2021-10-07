import { Picker } from "native-base";
import React, { Component } from "react";
import { AsyncStorage, Modal } from "react-native";
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome";
import { httpClient } from "../../core/HttpClient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Alert } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import moment from "moment";

const HEIGHT = Dimensions.get("window").height;

let dimensions = Dimensions.get("window");
let imageHeight = Math.round((dimensions.width * 9) / 16);

export default class OutfitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      showsModel1: false,
      showsModel2: false,
      showsModel3: false,
      gender: [
        { name: "f", namethai: "ผู้หญิง", nameeng: "female" },
        { name: "m", namethai: "ผู้ชาย", nameeng: "male" }
      ],
      sizeUniforms: [],
      select_bob: {
        sex: "",
        shirt_size: "",
        edit_shirt: "",
        pant_size: "",
        edit_pant: "",
        amount: "",
        selects: false
      },
      select_shirt: {
        sex: "",
        shirt_size: "",
        edit_shirt: "",
        pant_size: "",
        edit_pant: "",
        amount: "",
        selects: false
      },
      status1: false,
      status2: false,

      select_coverall: { size: "", edit: "", amount: "", selects: false },
      select_uniform: false,
      show_bob: false,
      show_shirt: false,
      show_coverall: false,
      status_bob: false,
      status_shirt: false,
      status_coverall: false,
      bob_shirt_size: "",
      bob_pant_size: "",
      shirt_shirt_size: "",
      shirt_pant_size: "",
      coverall_size: ""
    };
  }
  async componentDidMount() {
    let month = new Date().getMonth();
    if (month <= 8) {
      this.setState({ select_uniform: true });
    } else {
    }
    const res = await AsyncStorage.getItem("language");
    let id = await AsyncStorage.getItem("userId");
    if (res === "EN") {
      this.setState({ lang: "EN" });
    } else {
      this.setState({ lang: "TH" });
    }
    try {
      await httpClient
        .get(`/Training/SizeUniforms`)
        .then((response) => {
          const result = response.data;
          this.setState({ loading: false });
          if (result != null) {
            let data = [];

            for (var i in result) {
              data[i] = { id: i, name: result[i] };
            }
            this.setState({
              sizeUniforms: data
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await httpClient.get(`/Profile/getUniform/${id}`).then((response) => {
        let result = response.data;

        if (result != null) {
          let getCovercall = result.getCovercall[0];
          let getshirtBob = result.getshirtBob[0];
          let getshirtShirt = result.getshirtShirt[0];
          let gettrousersBob = result.gettrousersBob[0];
          let gettrousersShirt = result.gettrousersShirt[0];
          let yearss = "";
          let status_bob = getshirtBob ? true : false;
          let status_shirt = getshirtShirt ? true : false;
          let status_covercall = getCovercall ? true : false;
          this.setState({
            status_bob,
            status_shirt,
            status_covercall,
            status2: true
          });

          if (result.getshirtBob[0]) {
            yearss = moment(getshirtBob.created_date).format("YYYY");
          } else if (result.getshirtShirt[0]) {
            yearss = moment(getshirtShirt.created_date).format("YYYY");
          } else if (result.getCovercall[0]) {
            yearss = moment(getCovercall.created_date).format("YYYY");
          }

          if (yearss == new Date().getFullYear()) {
            this.setState({ select_uniform: true });
          }
          let select_bob = {
            sex: getshirtBob
              ? getshirtBob.uniform_sex
                ? getshirtBob.uniform_sex
                : ""
              : "",
            shirt_size: getshirtBob
              ? getshirtBob.uniform_size
                ? getshirtBob.uniform_size
                : ""
              : "",
            edit_shirt: getshirtBob
              ? getshirtBob.sleevelength
                ? getshirtBob.sleevelength
                : ""
              : "",
            pant_size: gettrousersBob
              ? gettrousersBob.uniform_size
                ? gettrousersBob.uniform_size
                : ""
              : "",
            edit_pant: gettrousersBob
              ? gettrousersBob.trouserbeak
                ? gettrousersBob.trouserbeak
                : ""
              : "",
            amount: gettrousersBob
              ? gettrousersBob.uniform_total
                ? gettrousersBob.uniform_total
                : ""
              : ""
          };
          this.setState({ select_bob });

          let select_shirt = {
            sex: getshirtShirt
              ? getshirtShirt.uniform_sex
                ? getshirtShirt.uniform_sex
                : ""
              : "",
            shirt_size: getshirtShirt
              ? getshirtShirt.uniform_size
                ? getshirtShirt.uniform_size
                : ""
              : "",
            edit_shirt: getshirtShirt
              ? getshirtShirt.sleevelength
                ? getshirtShirt.sleevelength
                : ""
              : "",
            pant_size: gettrousersShirt
              ? gettrousersShirt.uniform_size
                ? gettrousersShirt.uniform_size
                : ""
              : "",
            edit_pant: gettrousersShirt
              ? gettrousersShirt.trouserbeak
                ? gettrousersShirt.trouserbeak
                : ""
              : "",
            amount: gettrousersShirt
              ? gettrousersShirt.uniform_total
                ? gettrousersShirt.uniform_total
                : ""
              : ""
          };

          this.setState({ select_shirt });

          let select_coverall = {
            size: getCovercall.uniform_size ? getCovercall.uniform_size : "",
            edit: getCovercall.sleevelength ? getCovercall.sleevelength : "",
            amount: getCovercall.uniform_total ? getCovercall.uniform_total : ""
          };
          this.setState({ select_coverall });
        }
      });
    } catch (error) {}
  }
  onPressSend = async () => {
    let id = await AsyncStorage.getItem("userId");
    let { select_shirt, select_bob, select_coverall } = this.state;
    let getShirt = select_shirt.selects ? select_shirt : null;
    let getBob = select_bob.selects ? select_bob : null;
    let getCoverall = select_coverall.selects ? select_coverall : null;
    let getData = { getBob, getShirt, getCoverall, id };
    if (getShirt == null && getBob == null && getCoverall == null) {
      Alert.alert(
        this.state.lang === "EN"
          ? "Please select a uniform"
          : "กรุณาเลือกชุดยูนิฟอร์ม"
      );
    } else {
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
                .post(`/Profile/InsertUniforms`, getData)
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
                      this.state.lang === "EN" ? `Fail` : "เกิดข้อผิดพลาด"
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
  render() {
    if (
      this.state.sizeUniforms.length > 0 &&
      !this.state.status1 &&
      this.state.status2 &&
      (this.state.select_bob.amount > 0 ||
        this.state.select_shirt.amount > 0 ||
        this.state.select_coverall.amount > 0)
    ) {
      setTimeout(() => {
        let bob_shirt_size,
          bob_pant_size,
          shirt_shirt_size,
          shirt_pant_size,
          coverall_size;
        for (let a of this.state.sizeUniforms) {
          if (a.name == this.state.select_bob.shirt_size.toUpperCase()) {
            bob_shirt_size = a.id;
          }

          if (a.name == this.state.select_bob.pant_size.toUpperCase()) {
            bob_pant_size = a.id;
          }
          if (a.name == this.state.select_shirt.shirt_size.toUpperCase()) {
            shirt_shirt_size = a.id;
          }

          if (a.name == this.state.select_shirt.pant_size.toUpperCase()) {
            shirt_pant_size = a.id;
          }

          if (a.name == this.state.select_coverall.size.toUpperCase()) {
            coverall_size = a.id;
          }
        }
        this.setState({
          bob_shirt_size,
          bob_pant_size,
          shirt_shirt_size,
          shirt_pant_size,
          coverall_size,
          status1: true
        });
      }, 2000);
    }

    const closeModal1 = () => {
      if (this.state.showsModel1) {
        this.setState({ showsModel1: false });
      }
    };
    const closeModal2 = () => {
      if (this.state.showsModel2) {
        this.setState({ showsModel2: false });
      }
    };
    const closeModal3 = () => {
      if (this.state.showsModel3) {
        this.setState({ showsModel3: false });
      }
    };
    const images1 = [
      {
        url: "",
        props: {
          // Or you can set source directory.
          source: require("../../asset/outfit_image/1-sizeuniform.png")
        }
      },
      {
        url: "",
        props: {
          // Or you can set source directory.
          source: require("../../asset/outfit_image/2-sizeuniform.png")
        }
      }
    ];
    const images2 = [
      {
        url: "",
        props: {
          // Or you can set source directory.
          source: require("../../asset/outfit_image/3-sizeuniform.png")
        }
      },
      {
        url: "",
        props: {
          // Or you can set source directory.
          source: require("../../asset/outfit_image/4-sizeuniform.png")
        }
      }
    ];
    const images3 = [
      {
        url: "",
        props: {
          // Or you can set source directory.
          source: require("../../asset/outfit_image/5-sizeuniform.png")
        }
      }
    ];

    return (
      <View style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.textHeader}>
            <Text style={{ color: "#009bdc", fontSize: 24 }}>
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
                  paddingVertical: 15
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16
                  }}
                >
                  {this.state.lang === "EN" ? "Size Charts: " : "ตารางไซส์: "}
                </Text>
                <Button
                  style={{
                    borderColor: "orange",
                    borderWidth: 1,
                    backgroundColor: "orange"
                  }}
                  // ปุ่มดูไซส์เสื้อ
                  onPress={() => {
                    this.setState({ showsModel1: true });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
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
                {this.state.show_bob ||
                (this.state.select_uniform && this.state.status_bob) ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  >
                    <Button
                      style={{ backgroundColor: "red" }}
                      mode="contained"
                      disabled={this.state.select_uniform}
                      onPress={() => {
                        let select_bob = this.state.select_bob;
                        select_bob.selects = false;
                        this.setState({
                          show_bob: false,
                          select_bob
                        });
                      }}
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
                      {this.state.lang === "EN"
                        ? "ชุดเชิ้ตเอวบ๊อบ (Bob)"
                        : "ชุดเชิ้ตเอวบ๊อบ (Bob)"}
                    </Button>

                    {/* เพิ่ม */}
                    <View style={{ marginTop: 12 }}>
                      <Text>
                        {this.state.lang === "EN" ? "Sex" : "เพศ"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Picker
                        enabled={!this.state.select_uniform}
                        mode="dropdown"
                        placeholder={this.state.lang === "EN" ? "Sex" : "เพศ"}
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
                        selectedValue={this.state.select_bob.sex}
                        onValueChange={(text) => {
                          let select_bob = this.state.select_bob;
                          select_bob.sex = text;
                          this.setState({ select_bob });
                        }}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label={this.state.lang === "EN" ? "Sex" : "เพศ"}
                          value=""
                        />
                        {this.state.gender.map((item) => {
                          return (
                            <Picker.Item
                              label={
                                this.state.lang === "EN"
                                  ? item.nameeng
                                  : item.namethai
                              }
                              value={item.name}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Shirt size" : "ขนาดเสื้อ"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>

                      <Picker
                        enabled={!this.state.select_uniform}
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
                        selectedValue={this.state.bob_shirt_size}
                        onValueChange={(text) => {
                          let select_bob = this.state.select_bob;

                          for (let a of this.state.sizeUniforms) {
                            if (a.id == text) {
                              select_bob.shirt_size = a.name;
                              break;
                            }
                          }

                          this.setState({ bob_shirt_size: text, select_bob });
                        }}
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
                        {this.state.sizeUniforms.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
                    </View>
                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวแขนเสื้อ (นิ้ว)"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.select_bob.edit_shirt}
                        onChangeText={(text) => {
                          let select_bob = this.state.select_bob;
                          select_bob.edit_shirt = text;
                          this.setState({ select_bob });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Pant size" : "ขนาดกางเกง"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Picker
                        enabled={!this.state.select_uniform}
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
                        selectedValue={this.state.bob_pant_size}
                        onValueChange={(text) => {
                          let select_bob = this.state.select_bob;
                          for (let a of this.state.sizeUniforms) {
                            if (a.id == text) {
                              select_bob.pant_size = a.name;
                              break;
                            }
                          }

                          this.setState({ bob_pant_size: text, select_bob });
                        }}
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
                        {this.state.sizeUniforms.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวขากางเกง (นิ้ว)"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.select_bob.edit_pant}
                        onChangeText={(text) => {
                          let select_bob = this.state.select_bob;
                          select_bob.edit_pant = text;
                          this.setState({ select_bob });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        keyboardType="numeric"
                        editable={!this.state.select_uniform}
                        value={this.state.select_bob.amount.toString()}
                        onChangeText={(text) => {
                          let select_bob = this.state.select_bob;
                          select_bob.amount = text;
                          this.setState({ select_bob });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_uniform}
                    onPress={() => {
                      let select_bob = this.state.select_bob;
                      select_bob.selects = true;
                      this.setState({
                        show_bob: true,
                        select_bob
                      });
                    }}
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
                  paddingVertical: 15
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16
                  }}
                >
                  {this.state.lang === "EN" ? "Size Charts: " : "ตารางไซส์: "}
                </Text>
                <Button
                  style={{
                    borderColor: "orange",
                    borderWidth: 1,
                    backgroundColor: "orange"
                  }}
                  // ปุ่มดูไซส์เสื้อ
                  onPress={() => {
                    this.setState({ showsModel2: true });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
                    {this.state.lang === "EN"
                      ? "Shirt เสื้อปกเชิ้ตเอวเชิ้ต ชาย/หญิง"
                      : "Shirt เสื้อปกเชิ้ตเอวเชิ้ต ชาย/หญิง"}
                    <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </Button>
              </View>

              <Card.Content>
                <Image
                  style={styles.cardImage}
                  source={require("../../asset/outfit_image/uniform-2.png")}
                />
                {this.state.show_shirt ||
                (this.state.select_uniform && this.state.status_shirt) ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  >
                    <Button
                      style={{ backgroundColor: "red" }}
                      mode="contained"
                      disabled={this.state.select_uniform}
                      onPress={() => {
                        let select_shirt = this.state.select_shirt;
                        select_shirt.selects = false;
                        this.setState({
                          show_shirt: false,
                          select_shirt
                        });
                      }}
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
                      {this.state.lang === "EN"
                        ? "ชุดเชิ้ตเอวปล่อย (Shirt)"
                        : "ชุดเชิ้ตเอวปล่อย (Shirt)"}
                    </Button>

                    {/* เพิ่ม */}
                    <View style={{ marginTop: 12 }}>
                      <Text>
                        {this.state.lang === "EN" ? "Sex" : "เพศ"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Picker
                        enabled={!this.state.select_uniform}
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
                              paddingBottom: 24
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.select_shirt.sex}
                        // selectedValue={this.state.shirt_gender}
                        onValueChange={(text) => {
                          let select_shirt = this.state.select_shirt;
                          select_shirt.sex = text;
                          this.setState({ select_shirt });
                        }}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label={this.state.lang === "EN" ? "Sex..." : "เพศ..."}
                          value=""
                        />
                        {this.state.gender.map((item) => {
                          return (
                            <Picker.Item
                              label={
                                this.state.lang === "EN"
                                  ? item.nameeng
                                  : item.namethai
                              }
                              value={item.name}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Shirt size" : "ขนาดเสื้อ"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Picker
                        enabled={!this.state.select_uniform}
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
                        selectedValue={this.state.shirt_shirt_size}
                        onValueChange={(text) => {
                          let select_shirt = this.state.select_shirt;

                          for (let a of this.state.sizeUniforms) {
                            if (a.id == text) {
                              select_shirt.shirt_size = a.name;

                              break;
                            }
                          }

                          this.setState({
                            shirt_shirt_size: text,
                            select_shirt
                          });
                        }}
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
                        {this.state.sizeUniforms.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวแขนเสื้อ (นิ้ว)"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.select_shirt.edit_shirt}
                        onChangeText={(text) => {
                          let select_shirt = this.state.select_shirt;
                          select_shirt.edit_shirt = text;

                          this.setState({
                            edit_shirt_size: text,
                            select_shirt
                          });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Pant size" : "ขนาดกางเกง"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Picker
                        enabled={!this.state.select_uniform}
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
                        selectedValue={this.state.shirt_pant_size}
                        onValueChange={(text) => {
                          let select_shirt = this.state.select_shirt;
                          for (let a of this.state.sizeUniforms) {
                            if (a.id == text) {
                              select_shirt.pant_size = a.name;
                              break;
                            }
                          }

                          this.setState({
                            shirt_pant_size: text,
                            select_shirt
                          });
                        }}
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
                        {this.state.sizeUniforms.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวขากางเกง (นิ้ว)"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.select_shirt.edit_pant.toString()}
                        onChangeText={(text) => {
                          let select_shirt = this.state.select_shirt;
                          select_shirt.edit_pant = text;

                          this.setState({
                            select_shirt
                          });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        value={this.state.select_shirt.amount.toString()}
                        onChangeText={(text) => {
                          let select_shirt = this.state.select_shirt;
                          select_shirt.amount = text;

                          this.setState({
                            select_shirt
                          });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_uniform}
                    onPress={() => {
                      let select_shirt = this.state.select_shirt;
                      select_shirt.selects = true;
                      this.setState({
                        show_shirt: true,
                        select_shirt
                      });
                    }}
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
                  paddingVertical: 15
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16
                  }}
                >
                  {this.state.lang === "EN" ? "Size Charts: " : "ตารางไซส์: "}
                </Text>
                <Modal visible={this.state.showsModel1} transparent>
                  <ImageViewer
                    imageUrls={images1}
                    onCancel={closeModal1}
                    enableSwipeDown
                  />
                </Modal>
                <Modal visible={this.state.showsModel2} transparent>
                  <ImageViewer
                    imageUrls={images2}
                    onCancel={closeModal2}
                    enableSwipeDown
                  />
                </Modal>
                <Modal visible={this.state.showsModel3} transparent>
                  <ImageViewer
                    imageUrls={images3}
                    onCancel={closeModal3}
                    enableSwipeDown
                  />
                </Modal>
                <Button
                  style={{
                    borderColor: "orange",
                    borderWidth: 1,
                    backgroundColor: "orange"
                  }}
                  // ปุ่มดูไซส์เสื้อ
                  onPress={() => {
                    this.setState({ showsModel3: true });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
                    {this.state.lang === "EN"
                      ? "Coverall ชุดหมี"
                      : "Coverall ชุดหมี"}
                    <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </Button>
              </View>

              <Card.Content>
                <Image
                  style={styles.cardImage}
                  source={require("../../asset/outfit_image/uniform-3.png")}
                />

                {this.state.show_coverall ||
                (this.state.select_uniform && this.state.status_covercall) ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  >
                    <Button
                      style={{ backgroundColor: "red" }}
                      mode="contained"
                      disabled={this.state.select_uniform}
                      onPress={() => {
                        let select_coverall = this.state.select_coverall;
                        select_coverall.selects = false;
                        this.setState({
                          show_coverall: false,
                          select_coverall
                        });
                      }}
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
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Picker
                        enabled={!this.state.select_uniform}
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
                        selectedValue={this.state.coverall_size}
                        onValueChange={(text) => {
                          let select_coverall = this.state.select_coverall;
                          for (let a of this.state.sizeUniforms) {
                            if (a.id == text) {
                              select_coverall.size = a.name;
                              break;
                            }
                          }

                          this.setState({
                            coverall_size: text,
                            select_coverall
                          });
                        }}
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
                        {this.state.sizeUniforms.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.id} />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขขนาดชุด (นิ้ว)"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.select_coverall.edit}
                        onChangeText={(text) => {
                          let select_coverall = this.state.select_coverall;
                          select_coverall.edit = text;
                          this.setState({ select_coverall });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        editable={!this.state.select_uniform}
                        value={this.state.select_coverall.amount.toString()}
                        onChangeText={(text) => {
                          let select_coverall = this.state.select_coverall;
                          select_coverall.amount = text;
                          this.setState({ select_coverall });
                        }}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_uniform}
                    onPress={() => {
                      let select_coverall = this.state.select_coverall;
                      select_coverall.selects = true;
                      this.setState({
                        show_coverall: true,
                        select_coverall
                      });
                    }}
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
              disabled={this.state.select_uniform}
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
  },
  contentContainer: {
    paddingVertical: 20
  }
});

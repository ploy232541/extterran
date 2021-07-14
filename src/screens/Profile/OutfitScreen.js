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
  ActivityIndicator,
  SafeAreaView,
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
      uniform_id: "",
      user_id: "",
      selectcount: 2,
      maxselect: 2,
      select_1: [],
      orgchartid: "",
      roving: ["10","11","12","13","14","15","16","17","18"],
      alertiffillsome: false,
      canfill: false,
      //all
      gender: [{name:'f'},{name:'m'}],
      select_uniform: false,
      uniform_type: 0,
      //all
      //bob
      bob: false,
      bob_size: "",
      edit_bob_size: "",
      bob_pant_size: "",
      edit_bob_pant_size: "",
      bob_gender: "",
      bob_count: 0,
      //bob
      //shirt
      shirt: false,
      shirt_size: "",
      edit_shirt_size: "",
      shirt_pant_size: "",
      edit_shirt_pant_size: "",
      shirt_gender: "",
      shirt_count: 0,
      //shirt
      //coverall
      coverall: false,
      coverall_size: "",
      edit_coverall_size: "",
      //coverall_pant_size: "",
      //edit_coverall_pant_size: "",
      //coverall_gender: "",
      coverall_count: 0,
      //coverall
      loading:true,
    };
  }

  async componentDidMount() {

    let id = await AsyncStorage.getItem("userId");

    let n = new Date().getMonth();
    this.setState({ user_id: id, month: n });
    if (this.state.month > 10) {
      this.setState({ select_uniform: true });
    }
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN" });
    } else {
      this.setState({ lang: "TH" });
    }
    try {
      httpClient
        .get(`/Training/SizeUniforms`)
        .then((response) => {
          const result = response.data;

          if (result != null) {
            let data = [];

            for (var i in result) {
              data[i] = { id: i, name: result[i] };
            }
            this.setState({
              select_1: data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      /*httpClient
        .get(`/Training/getUniforms/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            let size = this.state.select_1.find((member) => {
              return member.name == result[0].boots_size;
            });
            this.setState({
              boots_id: result[0].boots_id,
              per_id: result[0].per_id,
              boots_type: result[0].boots_type,
              uniform_total: result[0].uniform_total,
              uniform_part: result[0].uniform_part,
              uniform_type: result[0].uniform_type,
              select_type: result[0].select_type,
              boots_name: result[0].boots_name,
              uniform_name: result[0].uniform_name,
              boots_size: size.id,
              select_uniform: true,
            });
            if (result[0].boots_type == 1) {
              this.setState({ boots: true });
            } else if (result[0].boots_type == 2) {
              this.setState({ shoes: true });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });*/

      httpClient
        .get(`/Training/getuniforms/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          //let i = 0;
          //console.log("result = " + (Number(result.length)+3)%2);
          //console.log("result = " + result[i + 1].uniform_id);
          for (let i = 0; i < result.length; i++) {
            //console.log("result = " + result[i].uniform_size);
            if (result[i].uniform_type == "1" && result[i].uniform_part == "1") {
              let bob_size = this.state.select_1.find((item) => {
                return item.name == result[i].uniform_size;
              });
              let bob_pant_size = this.state.select_1.find((item) => {
                return item.name == result[i+1].uniform_size;
              });
              console.log("bob_size.id = " + bob_size.id);
              this.setState({
                bob_count: String(result[i].uniform_total),
                bob_gender: result[i].uniform_sex,
                bob_size: bob_size.id,
                bob_pant_size: bob_pant_size.id,
                edit_bob_size: result[i].sleevelength,
                edit_bob_pant_size: result[i+1].trouserbeak,
                select_uniform: true,
              })
              this.setState({bob: true});
            }
            if (result[i].uniform_type == "2" && result[i].uniform_part == "1") {
              let shirt_size = this.state.select_1.find((member) => {
                return member.name == result[i].uniform_size;
              });
              let shirt_pant_size = this.state.select_1.find((member) => {
                return member.name == result[i+1].uniform_size;
              });
              this.setState({
                shirt_count: String(result[i].uniform_total),
                shirt_gender: result[i].uniform_sex,
                shirt_size: shirt_size.id,
                shirt_pant_size: shirt_pant_size.id,
                edit_shirt_size: result[i].sleevelength,
                edit_shirt_pant_size: result[i+1].trouserbeak,
                select_uniform: true,
              })
              this.setState({shirt: true});
            }
            if (result[i].uniform_type == "3" && result[i].uniform_part == "3") {
              let coverall_size = this.state.select_1.find((member) => {
                return member.name == result[i].uniform_size;
              });
              this.setState({coverall: true});
              this.setState({
                coverall_count: String(result[i].uniform_total),
                coverall_size: coverall_size.id,
                edit_coverall_size: result[i].sleevelength,
                select_uniform: true,
              })
              
            }
          }
          this.setState({loading:false})
          
          /*if (result != null) {
            if ((Number(result.length))%2 != 1) {
              
            }
          }*/
          /*if (result != null) {
            let bobsize = this.state.select_1.find((member) => {
              return member.name == result[1].uniform_size;
            });
            let bobpantsize = this.state.select_1.find((member) => {
              return member.name == result[0].uniform_size;
            });
            this.setState({
              bob_count: String(result[0].uniform_total),
              bob_gender: result[0].uniform_sex,
              bob_size: bobsize.id,
              bob_pant_size: bobpantsize.id,
              edit_bob_size: result[1].sleevelength,
              edit_bob_pant_size: result[0].trouserbeak,
              select_uniform: true,
            })
            this.setState({bob: true});
          }*/
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
                orgchartid: row.orgchart_id,
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
    const {alertiffillsome, uniform_id, user_id, selectcount, bob_size, edit_bob_size, bob_pant_size, edit_bob_pant_size, bob_gender, bob_count, shirt_size, edit_shirt_size, shirt_pant_size, edit_shirt_pant_size, shirt_gender, shirt_count, coverall_size, edit_coverall_size, coverall_count} =
      this.state;
      console.log("bob gender  = " + bob_gender);
      console.log("shirt gender  = " + shirt_gender);
      console.log("bob size = " + bob_size);
      console.log("edit bob size = " + edit_bob_size);
      console.log("bob pant size = " + bob_pant_size);
      console.log("edit bob pant size = " + edit_bob_pant_size);
      console.log("bob count = " + bob_count);
      console.log(Number(bob_count) + Number(shirt_count));
    if ( Number(bob_count) + Number(shirt_count) + Number(coverall_count) > Number(this.state.selectcount)) {
      this.state.lang === "EN"
        ? Alert.alert("You can\'t select all a uniform more than " + this.state.selectcount)
        : Alert.alert("คุณไม่สามารถเลือกชุดยูนิฟอร์มทั้งหมดได้เกิน " + this.state.selectcount + " ตัว");
    }
    else{
      for (let i = 1; i != 4; i++) {
        if (i == 1 || i == 2) {
          if (i == 1 && bob_count != 0) {
            if (bob_gender == "" || bob_size == "" || bob_pant_size == "") {
              this.state.lang === "EN"
                ? Alert.alert("Please fill in all details.")
                : Alert.alert("กรุณากรอกรายละเอียดให้ครบถ้วน");
            }
            else{
              let bob_size = this.state.select_1.find((member) => {
              return member.id === this.state.bob_size;
              });
              let bob_pant_size = this.state.select_1.find((member) => {
              return member.id === this.state.bob_pant_size;
              });
              const params = {
                uniform_id,
                user_id,
                bob_size: bob_size.name,
                bob_pant_size: bob_pant_size.name,
                edit_bob_pant_size,
                edit_bob_size,
                bob_gender,
                bob_count,
              }
              this.state.alertiffillsome = true;
              console.log(params);
              httpClient
                .post(`/Training/insertbob`, params)
                .catch((error) => {
                console.log(error);
                });
            }
            
          }
          if (i == 2 && shirt_count != 0) {
            if (shirt_gender == "" || shirt_size == "" || shirt_pant_size == "") {
              this.state.lang === "EN"
                ? Alert.alert("Please fill in all details.")
                : Alert.alert("กรุณากรอกรายละเอียดให้ครบถ้วน");
            }
            else{
              let shirt_size = this.state.select_1.find((member) => {
              return member.id === this.state.shirt_size;
              });
              let shirt_pant_size = this.state.select_1.find((member) => {
              return member.id === this.state.shirt_pant_size;
              });
              const params = {
                uniform_id,
                user_id,
                shirt_size: shirt_size.name,
                shirt_pant_size: shirt_pant_size.name,
                edit_shirt_pant_size,
                edit_shirt_size,
                shirt_gender,
                shirt_count,
              }
              this.state.alertiffillsome = true;
              httpClient
              .post(`/Training/insertshirt`, params)
              .catch((error) => {
                console.log(error);
                });
            }
          }
        }
        if (i == 3 && coverall_count != 0) {
          if (coverall_size == "") {
              this.state.lang === "EN"
                ? Alert.alert("Please fill in all details.")
                : Alert.alert("กรุณากรอกรายละเอียดให้ครบถ้วน");
            }
            else{
              let coverall_size = this.state.select_1.find((member) => {
              return member.id === this.state.coverall_size;
              });
              const params = {
                uniform_id,
                user_id,
                coverall_size: coverall_size.name,
                edit_coverall_size,
                coverall_count,
              }
              this.state.alertiffillsome = true;
              httpClient
              .post(`/Training/insertcoverall`, params)
              .catch((error) => {
                console.log(error);
                });
            }
        }
        
      }
    
      if (this.state.alertiffillsome == true) {
        Alert.alert(
          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
          this.state.lang === "EN" ? "Success" : "บันทึกสำเร็จ",
          [
            {
              text: this.state.lang === "EN" ? "OK" : "ตกลง",
              onPress: () => this.reset(),
            },
          ],
        );
      } else {
        Alert.alert(
          this.state.lang === "EN"
            ? `Can't save`
            : "ไม่สามารถบันทึกได้"
        );
      }
    }
  };

  reset = async () => {
    if (this.state.month <10 ) {
      this.setState({ select_uniform: true });
    }
    try {
      httpClient
        .get(`/Training/getuniforms/${this.state.user_id}`)
        .then((response) => {
          const result = response.data;
          //let i = 0;
          //console.log("result = " + (Number(result.length)+3)%2);
          //console.log("result = " + result[i + 1].uniform_id);
          for (let i = 0; i < result.length; i++) {
            //console.log("result = " + result[i].uniform_type);
            if (result[i].uniform_type == "1" && result[i].uniform_part == "1") {
              let bobsize = this.state.select_1.find((member) => {
                return member.name == result[i].uniform_size;
              });
              let bobpantsize = this.state.select_1.find((member) => {
                return member.name == result[i+1].uniform_size;
              });
              this.setState({
                bob_count: String(result[i].uniform_total),
                bob_gender: result[i].uniform_sex,
                bob_size: bobsize.id,
                bob_pant_size: bobpantsize.id,
                edit_bob_size: result[i].sleevelength,
                edit_bob_pant_size: result[i+1].trouserbeak,
                select_uniform: true,
              })
              this.setState({bob: true});
            }
            if (result[i].uniform_type == "2" && result[i].uniform_part == "1") {
              let shirtsize = this.state.select_1.find((member) => {
                return member.name == result[i].uniform_size;
              });
              let shirtpantsize = this.state.select_1.find((member) => {
                return member.name == result[i+1].uniform_size;
              });
              this.setState({
                shirt_count: String(result[i].uniform_total),
                shirt_gender: result[i].uniform_sex,
                shirt_size: shirtsize.id,
                shirt_pant_size: shirtpantsize.id,
                edit_shirt_size: result[i].sleevelength,
                edit_shirt_pant_size: result[i+1].trouserbeak,
                select_uniform: true,
              })
              this.setState({shirt: true});
            }
            if (result[i].uniform_type == "3" && result[i].uniform_part == "3") {
              let coverallsize = this.state.select_1.find((member) => {
                return member.name == result[i].uniform_size;
              });
              this.setState({
                shirt_count: String(result[i].uniform_total),
                coverall_size: shirtsize.id,
                edit_coverall_size: result[i].sleevelength,
                select_uniform: true,
              })
              this.setState({coverall: true});
            }
          }
          
          /*if (result != null) {
            if ((Number(result.length))%2 != 1) {
              
            }
          }*/
          /*if (result != null) {
            let bobsize = this.state.select_1.find((member) => {
              return member.name == result[1].uniform_size;
            });
            let bobpantsize = this.state.select_1.find((member) => {
              return member.name == result[0].uniform_size;
            });
            this.setState({
              bob_count: String(result[0].uniform_total),
              bob_gender: result[0].uniform_sex,
              bob_size: bobsize.id,
              bob_pant_size: bobpantsize.id,
              edit_bob_size: result[1].sleevelength,
              edit_bob_pant_size: result[0].trouserbeak,
              select_uniform: true,
            })
            this.setState({bob: true});
          }*/
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }



  render() {  if (this.state.loading) {
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
    console.log("orgchartid = " + this.state.orgchartid);
    for (let i = 0; i < this.state.roving.length; i++) {
      if (this.state.orgchartid == this.state.roving[i]) {
        this.state.selectcount = 3;
        this.state.maxselect = 3;
      }
    }
    console.log("selectcount = " + this.state.selectcount);
    if (Number(this.state.bob_count)+Number(this.state.shirt_count)+Number(this.state.coverall_count) >= Number(this.state.selectcount)) {
      this.state.canfill = true;
    } else {
      this.state.canfill = false;
    }
    return (
      <View style={styles.background}>
        <ScrollView>
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
                      disabled={this.state.select_uniform}
                      onPress={() =>
                        this.setState({
                            bob: false,
                            bob_size: "",
                            edit_bob_size: "",
                            bob_pant_size: "",
                            edit_bob_pant_size: "",
                            bob_gender: "",
                            bob_count: 0,
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.bob_gender}
                        onValueChange={(text) => this.setState({ bob_gender: text })}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label={this.state.lang === "EN" ? "Sex..." : "เพศ..."}
                          value=""
                        />
                        {this.state.gender.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.name} />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Shirt size" : "ขนาดเสื้อ"}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.bob_size}
                        onValueChange={(text) =>
                          this.setState({ bob_size: text })
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

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวแขนเสื้อ (นิ้ว)"}
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.edit_bob_size}
                        onChangeText={(text) =>
                        this.setState({ edit_bob_size: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Pant size" : "ขนาดกางเกง"}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.bob_pant_size}
                        onValueChange={(text) =>
                          this.setState({ bob_pant_size: text })
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

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวขากางเกง (นิ้ว)"}
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.edit_bob_pant_size}
                        onChangeText={(text) =>
                        this.setState({ edit_bob_pant_size: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Amount"
                          : "จำนวน"}
                      </Text>
                      <TextInput
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Amount..." 
                            : "จำนวน..."
                        }
                        keyboardType = "numeric"
                        editable={!this.state.select_uniform}
                        value={this.state.bob_count}
                        onChangeText={(text) =>
                        this.setState({ bob_count: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_uniform || this.state.canfill}
                    onPress={() =>
                      this.setState({
                        bob: true,
                        bob_size: "",
                        edit_bob_size: "",
                        bob_pant_size: "",
                        edit_bob_pant_size: "",
                        bob_gender: "",
                        bob_count: 0,
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
                      disabled={this.state.select_uniform}
                      onPress={() =>
                        this.setState({
                          shirt: false,
                          shirt_size: "",
                          edit_shirt_size: "",
                          shirt_pant_size: "",
                          edit_shirt_pant_size: "",
                          shirt_gender: "",
                          shirt_count: 0,
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.shirt_gender}
                        onValueChange={(text) => this.setState({ shirt_gender: text })}
                        textStyle={{ fontSize: 14 }}
                      >
                        <Picker.Item
                          label={this.state.lang === "EN" ? "Sex..." : "เพศ..."}
                          value=""
                        />
                        {this.state.gender.map((item) => {
                          return (
                            <Picker.Item label={item.name} value={item.name} />
                          );
                        })}
                      </Picker>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Shirt size" : "ขนาดเสื้อ"}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.shirt_size}
                        onValueChange={(text) =>
                          this.setState({ shirt_size: text })
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

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวแขนเสื้อ (นิ้ว)"}
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.edit_shirt_size}
                        onChangeText={(text) =>
                        this.setState({ edit_shirt_size: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Pant size" : "ขนาดกางเกง"}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.shirt_pant_size}
                        onValueChange={(text) =>
                          this.setState({ shirt_pant_size: text })
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

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN"
                          ? "Edit (inch)"
                          : "แก้ไขความยาวขากางเกง (นิ้ว)"}
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.edit_shirt_pant_size}
                        onChangeText={(text) =>
                        this.setState({ edit_shirt_pant_size: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                      </Text>
                      <TextInput
                        keyboardType = "numeric"
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        value={this.state.shirt_count}
                        onChangeText={(text) =>
                        this.setState({ shirt_count: text})
                      }
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_uniform || this.state.canfill}
                    onPress={() =>
                      this.setState({
                        shirt: true,
                        shirt_size: "",
                        edit_shirt_size: "",
                        shirt_pant_size: "",
                        edit_shirt_pant_size: "",
                        shirt_gender: "",
                        shirt_count: 0,
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
                      disabled={this.state.select_uniform}
                      onPress={() =>
                        this.setState({
                          coverall: false,
                          coverall_size: "",
                          edit_coverall_size: "",
                          //coverall_pant_size: "",
                          //edit_coverall_pant_size: "",
                          //coverall_gender: "",
                          coverall_count: 0,
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
                        {this.state.select_1.map((item) => {
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
                      </Text>
                      <TextInput
                        editable={!this.state.select_uniform}
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN"
                            ? "Type Inch..."
                            : "ขนาด(นิ้ว)..."
                        }
                        value={this.state.edit_coverall_size}
                        onChangeText={(text) =>
                        this.setState({ edit_coverall_size: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>

                    {/* เพิ่ม */}
                    <View>
                      <Text>
                        {this.state.lang === "EN" ? "Amount" : "จำนวน"}
                      </Text>
                      <TextInput
                        keyboardType = "numeric"
                        style={styles.selectableInputStyle2}
                        placeholder={
                          this.state.lang === "EN" ? "Amount..." : "จำนวน..."
                        }
                        editable={!this.state.select_uniform}
                        value={this.state.coverall_count}
                        onChangeText={(text) =>
                        this.setState({ coverall_count: text})}
                        // onChangeText={(text) => setTrouserBeak(text)}
                      ></TextInput>
                    </View>
                    {/* เพิ่มสิ้นสุด */}
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_uniform || this.state.canfill}
                    onPress={() =>
                      this.setState({
                        coverall: true,
                        coverall_size: "",
                        edit_coverall_size: "",
                        //coverall_pant_size: "",
                        //edit_coverall_pant_size: "",
                        //coverall_gender: "",
                        coverall_count: 0,
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

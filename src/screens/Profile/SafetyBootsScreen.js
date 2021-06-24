import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Text,
  Image,
  Alert,
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
      select_boots:true
    };
  }
  async componentDidMount() {
    let n=new Date().getMonth()
    if (n>=10) {
      this.setState({select_boots:false})
    }
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN", lang_id: 1 });
    } else {
      this.setState({ lang: "TH", lang_id: 2 });
    }
    try {
      httpClient
      .get(`/Training/SizeBoots`)
      .then((response) => {
        const result = response.data;
        
        if (result != null) {
          let data=[]
         
          for(var i in result){ 
            
            data[i]={id:i,name:result[i]}
            
          }
          console.log(data);
          this.setState({
            select_1: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    } catch (error) {}
  }

  


  render() {
    return (
      <View style={styles.background}>

        <ScrollView>
          <View style={styles.textHeader}>
            <Text style={{ color: "#009bdc", fontSize: "24" }}>
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
                  <ScrollView>
                    <Button
                      mode="contained"
                      disabled={this.state.select_boots}
                      
                      onPress={() => this.setState({ boots: false })}
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.sizeBoots}
                        onValueChange={(text) =>
                          this.setState({ sizeBoots: text })
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
                        {/* ยังแก้ไม่เสร็จ */}
                        {this.state.select_1.map((item) => {
                              return (
                                <Picker.Item
                                  label={
                                    item.name
                                  }
                                  value={item.id}
                                />
                              );
                            })}
                      </Picker>
                    </View>
                   
                  </ScrollView>
                ) : (
                  <Button
                    mode="contained"
                    disabled={this.state.select_boots}
                    onPress={() => this.setState({ boots: true, shoes: false })}
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
                  <ScrollView>
                    <Button mode="contained"
                    disabled={this.state.select_boots}
                     onPress={() => this.setState({ shoes: false })}
                     >
                      <Icons
                        name="check"
                        size={20}
                        style={{
                          marginLeft: 10,
                          marginRight: 5,
                          color: "white",
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
                              paddingBottom: 24,
                            }}
                          />
                        }
                        style={styles.selectableInputStyle}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        // selectedValue={this.state.purpose}
                        // onValueChange={(text) =>
                        //   this.setState({ purpose: text })
                        // }
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
                        {/* ยังแก้ไม่เสร็จ */}
                        {this.state.select_1.map((item) => {
                              return (
                                <Picker.Item
                                  label={
                                    item.name
                                  }
                                  value={item.id}
                                />
                              );
                            })}
                      </Picker>
                    </View>
                  </ScrollView>
                ) : (
                  <Button mode="contained"
                  disabled={this.state.select_boots}
                  onPress={() => this.setState({ shoes: true, boots: false })}
                  >Safety Shoes</Button>
                )}
              </Card.Content>
            </Card>

            <Button mode="contained" style={styles.submitButton}>
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

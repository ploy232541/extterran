import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Alert,
  Pressable
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  Text,
  Searchbar,
  Card,
  Button,
  Divider,
  ProgressBar
} from "react-native-paper";
import Modal from "react-native-modal";
import Icons from "react-native-vector-icons/MaterialIcons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { httpClient } from "../../core/HttpClient";
import { Header, Item, Input, Icon, List, ListItem } from "native-base";
import Icon1 from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const type = [
  { title: "BBS พฤติกรรม", id: 1 },
  { title: "SWA การหยุดงาน", id: 2 },
  { title: "HazOb รายงานความสภาพเสี่ยงที่จะเกิดอุบัติภัย", id: 3 },
  { title: "Near Miss สภาพที่เป็นอันตราย/เหตุการณ์เกือบเกิดอุบัติเหตุ", id: 4 },
  { title: "", id: 5 }
];

export default class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      datalist: [],
      loading: true,
      startDate: "Start Date",
      endDate: "End Date",
      maindatalist: []
    };
  }
  async componentDidMount() {
    let getLang = await AsyncStorage.getItem("language");
    let user_id = await AsyncStorage.getItem("userId");
    this.setState({ lang: getLang });
    if (getLang === "EN") {
      var lang_id = "1";
    } else {
      var lang_id = "2";
    }
    try {
      httpClient
        .get(`/Profile/checkinformation/${user_id}`)
        .then(async (response) => {
          const result = response.data;
          console.log(result);
          if (result != null) {
            this.setState({
              datalist: result,
              maindatalist: result,
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }

  formatDate = (date) => {
    let d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();
    month++;
    month = month.toString();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  showDatePicker = (props) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (dates) => {
    var date = this.formatDate(dates);

    if (this.state.isStart) {
      this.setState({
        startDate: date,
        isStart: false
      });
    } else {
      this.setState({
        endDate: date
      });
    }

    this.hideDatePicker();
  };
  _reanderItem = ({ item, key }) => {
    let types =
      item.what_kind_of_report != 5
        ? type[item.what_kind_of_report - 1]
        : item.what_kind_of_report_detail;
    return (
      <View>
        <ListItem onPress={() => this.handleOpen(item)}>
          <View style={{ flexDirection: "row" }}>
            <Icon1 name="info" style={{ marginRight: 10 }} size={20} />
            <Text style={{ flex: 1 }}>
              {types.title ? types.title : types}
              {" \n\tวันที่ " +
                moment(item.observation_date).format("DD/MM/YYYY")}
            </Text>
            <Icon1 name="chevron-right" style={{ flex: 0.0 }} size={15} />
          </View>
        </ListItem>
      </View>
    );
  };
  handleOpen(item) {
    const { navigation } = this.props;
    navigation.navigate("ReportView", { item });
  }
  renderHeader = () => {
    return (
      <ScrollView style={{borderRadius: 10}}>
        <View >
          <DateTimePickerModal
            locale={this.state.lang == "EN" ? "en_EN" : "th_TH"}
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />
          <Header searchBar rounded style={{ backgroundColor: "#d9e6d9" }}>
            <Item
              style={{ backgroundColor: "#fff", margin: 5 }}
              onPress={() => this.showDatePicker("start")}
            >
              <Icon name="calendar" />
              <View>
                <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
              </View>
            </Item>
            <Item
              style={{ backgroundColor: "#fff", margin: 5 }}
              onPress={() => this.showDatePicker()}
            >
              <Icon name="calendar" />

              <View>
                <Text style={{ paddingLeft: 10 }}>{this.state.endDate}</Text>
              </View>
            </Item>
          </Header>
          <Header>
            <Item style={{ backgroundColor: "#fff", margin: 7 }}>
              <Pressable
                style={[stylesdialog.button, stylesdialog.buttonOpen]}
                onPress={() => {
                  if (
                    this.state.startDate != "Start Date" ||
                    this.state.endDate != "End Date"
                  ) {
                    const newData = this.state.maindatalist.filter((item) => {
                      let dateString = moment(item.observation_date).format(
                        "DD/MM/YYYY"
                      );
                      var dateMomentObject = moment(dateString, "DD/MM/YYYY");
                      var dateObject = dateMomentObject.toDate();
                      if (
                        this.state.startDate != "Start Date" &&
                        this.state.endDate != "End Date"
                      ) {
                        var dateMomentObjectStart = moment(
                          this.state.startDate,
                          "DD/MM/YYYY"
                        );
                        var dateObjectStart = dateMomentObjectStart.toDate();
                        var dateMomentObjectEnd = moment(
                          this.state.endDate,
                          "DD/MM/YYYY"
                        );
                        var dateObjectEnd = dateMomentObjectEnd.toDate();
                        if (
                          dateObject >= dateObjectStart &&
                          dateObject <= dateObjectEnd
                        ) {
                          return item;
                        }
                      } else if (this.state.startDate != "Start Date") {
                        var dateMomentObjectStart = moment(
                          this.state.startDate,
                          "DD/MM/YYYY"
                        );
                        var dateObjectStart = dateMomentObjectStart.toDate();
                        if (dateObject >= dateObjectStart) {
                          return item;
                        }
                      } else if (this.state.endDate != "End Date") {
                        var dateMomentObjectEnd = moment(
                          this.state.endDate,
                          "DD/MM/YYYY"
                        );
                        var dateObjectEnd = dateMomentObjectEnd.toDate();
                        if (dateObject <= dateObjectEnd) {
                          return item;
                        }
                      }
                    });
                    this.setState({ datalist: newData });
                  } else {
                    this.setState({ datalist: this.state.maindatalist });
                  }
                }}
              >
                <Text style={styles.textStyle}>
                  <Icon1 name="search" style={{ marginRight: 10 }} size={18} />
                  {this.state.lang === "EN" ? "  Search" : "  ค้นหา"}
                </Text>
              </Pressable>
            </Item>
            <Item style={{ margin: 7 }}>
              <Pressable
                style={[stylesdialog.button, stylesdialog.buttonCancel]}
                onPress={() => {
                  this.setState({
                    startDate: "Start Date",
                    endDate: "End Date",
                    datalist: this.state.maindatalist
                  });
                }}
              >
                <Text style={styles.textStyle}>
                  <Icon1 name="retweet" style={{ marginRight: 10 }} size={18} />
                  {this.state.lang === "EN" ? "  Clear" : "  ล้างค่า"}
                </Text>
              </Pressable>
            </Item>
          </Header>
        </View>
      </ScrollView>
    );
  };
  searchFilterFunction = (start, end) => {
    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.course_title.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ statusList: newData });
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
    return (
      <ScrollView style={styles.root}>
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.headline}>รายการ Report</Text>

          <View style={styles.container}>
            <List style={{ borderWidth: 1, borderColor: "#e6e6e6" },{borderRadius: 10}}>
              <FlatList
                data={this.state.datalist}
                renderItem={this._reanderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={this.renderHeader}
              />
            </List>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 15,
    borderColor: "#ddd",
    borderWidth: 1
  },
  headline: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#398DDD",
    marginTop: 30
  },
  searchbar: { marginVertical: 20 },
  view: {
    justifyContent: "flex-end",
    margin: 0
  },
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  },
  list: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 16
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 18,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
    borderColor: "#007aff"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonCancel: {
    backgroundColor: "gray"
  }
});
const stylesdialog = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 24,
    elevation: 2
    // margin:5
  },
  buttonOpen: {
    backgroundColor: "green"
  },
  buttonCancel: {
    backgroundColor: "gray"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  containerSec: {
    flex: 1,
    backgroundColor: "#ff0",
    borderRadius: 20
  }
});

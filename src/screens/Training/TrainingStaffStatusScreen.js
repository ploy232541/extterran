import * as React from "react";
import { Searchbar } from "react-native-paper";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { ScrollView } from "react-native-gesture-handler";

const HEIGHT = Dimensions.get("window").height;

const approveList = {
  tableHead: ["ชื่อ-นามสกุล", "หลักสูตร","ติดตามสถานะ", "สถานะการอนุมัติ", "พิมพ์"],
  tableData: [],
};

const bookingList = {
  tableHead: ["ชื่อ-นามสกุล","ประเภท", "ติดตามสถานะ", "สถานะการอนุมัติ", "พิมพ์"],
  tableData: [[1,2,3,4,5]],
};

const ApproveList = () => {
  return approveList.tableData != "" ? (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
        <Row
          data={approveList.tableHead}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows data={approveList.tableData} textStyle={styles.text} />
      </Table>
    </View>
  ) : (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
        <Row
          data={approveList.tableHead}
          style={styles.head}
          textStyle={styles.text}
        />
      </Table>
      <View style={styles.noneDataStyle}>
        <Text style={styles.text}>ไม่มีข้อมูล</Text>
      </View>
    </View>
  );
};

const BookingList = () => {
  return bookingList.tableData != "" ? (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
        <Row
          data={bookingList.tableHead}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows data={bookingList.tableData} textStyle={styles.text} />
      </Table>
    </View>
  ) : (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
        <Row
          data={bookingList.tableHead}
          style={styles.head}
          textStyle={styles.text}
        />
      </Table>
      <View style={styles.noneDataStyle}>
        <Text style={styles.text}>ไม่มีข้อมูล</Text>
      </View>
    </View>
  );
};

function TrainingStaffStatusScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusList, setStatusList] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);


  

  const statusConfirm = [
    { label: "อนุมัติ", value: "อนุมัติ" },
    { label: "ไม่อนุมัติ", value: "ไม่อนุมัติ" },
    { label: "รอการอนุมัติ", value: "รอการอนุมัติ" },
  ];

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={{ paddingTop: 20 }}>
        <Searchbar
          placeholder="ค้นหา"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>

      <View style={styles.inputLightStyle}>
        <Dropdown
          placeholder="กรุณาเลือกสถานที่อบรม"
          data={statusConfirm}
          value={statusList}
          onChange={(item) => setStatusList(item)}
          underlineColor="transparent"
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#DCDCDC",
          width: "20%",
          marginTop: 10,
          height: HEIGHT / 25,
          alignSelf: "center",
        }}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>ค้นหา</Text>
        </View>
      </TouchableOpacity>

      <View style={{ paddingTop: 20 }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.titleStyle}>รายชื่อผู้อนุมัติ</Text>
        </View>
        <ApproveList />
      </View>

      <View style={styles.container}>
          <View style={{ paddingTop: 20 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.titleStyle}>สถานะการอนุมัติ Booking</Text>
            </View>
            <BookingList />
          </View>
        </View>

    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flex: 1,
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 12,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  titleStyle: {
    fontWeight: "bold",
  },
  backgroundTable: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  head: {
    height: 36,
  },
  text: {
    margin: 4,
    fontSize: 12,
    alignSelf: "center",
  },
  noneDataStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
});

export default TrainingStaffStatusScreen;

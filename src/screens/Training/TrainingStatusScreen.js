import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";


const trainingList = {
  tableHead: ["หลักสูตร", "ติดตามสถานะ", "สถานะการอนุมัติ", "พิมพ์"],
  tableData: [["1", "2", "3", "4"],],
};

const bookingList = {
  tableHead: ["ประเภท", "ติดตามสถานะ", "สถานะการอนุมัติ", "พิมพ์"],
  tableData: [],
};

const TrainingList = () => {
  return trainingList.tableData != "" ? (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
        <Row
          data={trainingList.tableHead}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows data={trainingList.tableData} textStyle={styles.text} />
      </Table>
    </View>
  ) : (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
        <Row
          data={trainingList.tableHead}
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

const TrainingStatusScreen = () => {
  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ paddingTop: 20 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.titleStyle}>สถานะใบคำร้องขอฝึกอบรม</Text>
            </View>
            <TrainingList />
          </View>
        </View>

        <View style={styles.container}>
          <View style={{ paddingTop: 20 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.titleStyle}>สถานะการอนุมัติ Booking</Text>
            </View>
            <BookingList />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingTop: 20,
    marginHorizontal: 8,
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

export default TrainingStatusScreen;


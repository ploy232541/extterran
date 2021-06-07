import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import PeopleIcon from "react-native-vector-icons/Ionicons";
import { DataTable } from "react-native-paper";
import ArrowDownIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HEIGHT = Dimensions.get("window").height;
const ConfirmBookingScreen = (props) => {
  const navigation = useNavigation();
  let title = props.route.params.title;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Text style={styles.textHeader}>{title}</Text>

        <View style={{ flexDirection: "row", marginVertical: 20 }}>
          <PeopleIcon name="md-people" size={20} style={{ marginRight: 10 }} />
          <Text style={styles.textNumber}>
            จำนวน <Text style={{ color: "#398DDD" }}>xxx</Text> คน
          </Text>
        </View>

        {/* <View style={styles.nameStyle}>
                    <View style={{flexDirection:'row'}}>
                        <Text>นาย XXX XXXXXXXXX</Text>
                        <ArrowDownIcon name='down' size={24}/>
                    </View>
                </View> */}
        <DataTable style={{ marginTop: 20, borderBottomWidth: 1 }}>
          <DataTable.Row style={{ borderWidth: 1 }}>
            <DataTable.Cell>นาย XXX XXXXXXXXX</DataTable.Cell>
            <DataTable.Cell
              style={{
                right: 0,
                position: "absolute",
                alignSelf: "center",
                flex: 1,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('StaffForm')}>
                <View
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#398DDD",
                    width: "100%",
                    height: HEIGHT * 0.03,
                    justifyContent: "center",
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>รายละเอียด</Text>
                </View>
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        <DataTable style={{ borderBottomWidth: 1 }}>
          <DataTable.Row style={{ borderWidth: 1 }}>
            <DataTable.Cell>นาย XXX XXXXXXXXX</DataTable.Cell>
            <DataTable.Cell
              style={{
                right: 0,
                position: "absolute",
                alignSelf: "center",
                flex: 1,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('StaffForm')}>
                <View
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#398DDD",
                    width: "100%",
                    height: HEIGHT * 0.03,
                    justifyContent: "center",
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>รายละเอียด</Text>
                </View>
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical: 18,
  },
  textHeader: {
    color: "#398DDD",
    alignSelf: "center",
    fontSize: 18,
  },
  textNumber: {
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ConfirmBookingScreen;

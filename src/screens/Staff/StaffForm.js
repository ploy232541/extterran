import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const StaffForm = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {/* <ScrollView style={{ backgroundColor: "white" }}> */}
      <View style={styles.container}>
        <View style={{ marginHorizontal: 48 }}>
          <Divider style={{ backgroundColor: "#6e767e" }} />
        </View>

        <Text
          style={{
            fontSize: 16,
            color: "#4393de",
            marginTop: 10,
            alignSelf: "center"
          }}
        >
          บริษัท เอ็กซ์เธอร์แอน (ประเทศไทย) จำกัด
        </Text>
        <Text style={{ alignSelf: "center", fontSize: 16 }}>
          Booking Request
        </Text>

        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 12,
            marginTop: 20,
            borderColor: "#d9d9d9"
          }}
        >
          <View style={{ margin: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline"
              }}
            >
              <Text>ชื่อ</Text>
              <Text>XXXXX</Text>
              <Text>นามสกุล</Text>
              <Text>XXXXX</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text>ตำแหน่ง</Text>
              <Text style={{ marginLeft: 48 }}>XXXXX</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 5
              }}
            >
              <Text>แผนก</Text>
              <Text style={{ marginLeft: 60 }}>XXXXX</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 5
              }}
            >
              <Text>ค่าใช้จ่ายต่อบุคคล(ไม่รวมภาษี)</Text>
              <Text style={{ marginLeft: 24 }}>XXXXXXXXX</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 5
              }}
            >
              <Text>วันที่เริ่มฝึกอบรม</Text>
              <Text style={{ marginLeft: 8 }}>XXXXX</Text>
              <Text style={{ marginLeft: 8 }}>วันที่สิ้นสุดฝึกอบรม</Text>
              <Text style={{ marginLeft: 8 }}>XXXXX</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 5
              }}
            >
              <Text>รวมวันฝึกอบรม</Text>
              <Text style={{ marginLeft: 8 }}>XXXXX</Text>
              <Text style={{ marginLeft: 8 }}>สถานที่ฝึกอบรม</Text>
              <Text style={{ marginLeft: 8 }}>XXXXX</Text>
            </View>
          </View>
          <Divider style={{ backgroundColor: "black", marginHorizontal: 10 }} />

          <View style={{ margin: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>ไฟล์แนบ</Text>
              <TouchableOpacity style={{ marginLeft: 30 }}>
                <View
                  style={{
                    backgroundColor: "#f0efef",
                    width: 80,
                    height: HEIGHT * 0.04,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderRadius: 5
                  }}
                >
                  <AntIcon name="filetext1" size={24} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Divider style={{ backgroundColor: "black", marginHorizontal: 10 }} />

          <View style={{ margin: 20 }}>
            <Text>คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม</Text>
            <Text style={styles.marginText}>1. XXXXXX</Text>
            <Text style={styles.marginText}>2. XXXXXX</Text>
            <Text>คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม</Text>
            <Text style={styles.marginText}>1. XXXXXX</Text>
            <Text style={styles.marginText}>ผู้เข้าอบรม/ผู้ยื่นคำขอ XXXX</Text>
            <Text style={styles.marginText}>วันที่ XXXXXX</Text>
          </View>

          <Divider style={{ backgroundColor: "black", marginHorizontal: 10 }} />

          <View style={{ margin: 20 }}>
            <Text>อนุมัติโดย</Text>
            <Divider
              style={{
                backgroundColor: "#4393de",
                marginHorizontal: 36,
                marginTop: 40
              }}
            />
            <View
              style={{
                marginHorizontal: 36,
                alignItems: "center",
                marginTop: 5,
                marginBottom: 40
              }}
            >
              <Text>Country Manager</Text>
              <Text>ผู้จัดการประจำประเทศ</Text>
            </View>

            <Text>Acknowleadged by HR</Text>
            <Divider
              style={{
                backgroundColor: "#4393de",
                marginHorizontal: 36,
                marginTop: 40
              }}
            />
            <View
              style={{
                marginHorizontal: 36,
                alignItems: "center",
                marginTop: 5
              }}
            >
              <Text>HR Training Coordinator</Text>
              <Text>เจ้าหน้าที่</Text>
            </View>

            <Divider
              style={{
                backgroundColor: "#4393de",
                marginHorizontal: 36,
                marginTop: 40
              }}
            />
            <View
              style={{
                marginHorizontal: 36,
                alignItems: "center",
                marginTop: 5
              }}
            >
              <Text>Human Resources Manager</Text>
              <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              margin: 20
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                width: WIDTH / 5,
                height: HEIGHT * 0.04,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4
              }}
            >
              <Text style={{ color: "white" }}>อนุมัติ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "red",
                width: WIDTH / 5,
                height: HEIGHT * 0.04,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4
              }}
            >
              <Text style={{ color: "white" }}>ไม่อนุมัติ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical: 18
  },
  marginText: {
    marginTop: 5
  }
});

export default StaffForm;

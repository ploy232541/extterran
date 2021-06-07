import React from "react";
import { Dimensions } from "react-native";
import { View, StyleSheet, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const MyGeneralCourse = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 32, marginVertical: 18 }}>
        <Searchbar
          placeholder="ค้นหาหลักสูตร"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.headerButton}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            หลักสูตรทั่วไป
          </Text>
        </TouchableOpacity>
        <View style={styles.cardCourse}>
          <View
            style={{
              flexDirection: "row",
              margin: 10,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                width: "50%",
              }}
            >
              <Icon name="Trophy" size={30} color={"blue"} />
              <Text style={{ fontSize: 18, color: "blue" }}>
                หลักสูตรการเดินเรือ
              </Text>
              <Text numberOfLines={2}>
                Some quick example text to build on the card title and make up
                the bulk of the cards content
              </Text>

              <View style={{ marginTop: 10, marginBottom: 10, width: "80%" }}>
                <Divider
                  style={{ paddingBottom: 1, backgroundColor: "grey" }}
                />
              </View>

              <Text>วันที่เริ่มเรียน 1 มิ.ย. 2563</Text>
              <Text>วันที่สิ้นสุด 1 มิ.ย. 2564</Text>
            </View>
            <Image
              source={{
                uri: "https://source.unsplash.com/1024x768/?nature",
              }}
              style={{ height: HEIGHT * 0.225, width: "50%" }}
            />
          </View>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginVertical: 20,
              backgroundColor: "#3b5998",
              height: HEIGHT * 0.035,
              justifyContent: "center",
              width: "60%",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white" }}>สมัครเรียนหลักสูตร</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.footerButton}>
          <Text
            style={{
              color: "black",
              fontSize: 18,
            }}
          >
            หลักสูตรงานเอกสาร
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton}>
          <Text
            style={{
              color: "black",
              fontSize: 18,
            }}
          >
            หลักสูตรภาษาอังกฤษ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerButton: {
    backgroundColor: "#3b5998",
    alignItems: "center",
    height: HEIGHT * 0.05,
    justifyContent: "center",
    marginVertical: 20,
  },
  footerButton: {
    backgroundColor: "#DBDBDB",
    alignItems: "center",
    height: HEIGHT * 0.05,
    justifyContent: "center",
    marginVertical: 10,
  },
  cardCourse: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
});

export default MyGeneralCourse;


import * as React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import BookingCard from "../../components/BookingCard";

const needList = [
  {
    id: 1,
    funcType: "In House",
    src: require('../../asset/booking-1.png'),
    to: "InHouseScreen",
  },
  {
    id: 2,
    funcType: "External",
    src: require('../../asset/booking-1.png'),
    to: "ExternalScreen",
  },
];

const _renderItem = ({ item }) => {
  return (
    <View style={{ paddingTop: 12 }}>
      <BookingCard funcType={item.funcType} src={item.src} to={item.to} />
    </View>
  );
};

const _numColumns = 2;

function TrainingNeedScreen() {
  
  return (
    <View style={styles.background}>
      <FlatList
        data={needList}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={_numColumns}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default TrainingNeedScreen;

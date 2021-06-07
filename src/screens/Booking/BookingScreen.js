import * as React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import BookingCard from "../../components/BookingCard";

const bookFunctionList = [
  {
    id: 1,
    funcType: "Flight",
    src: "https://picsum.photos/700",
    to: "FlightBookingScreen",
  },
  {
    id: 2,
    funcType: "Accomodation",
    src: "https://picsum.photos/700",
    to: "AccommodationBookingScreen",
  },
  {
    id: 3,
    funcType: "Ground Transportation",
    src: "https://picsum.photos/700",
    to: "GroundTransportationBookingScreen",
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

function BookingScreen() {
  return (
    <View style={styles.background}>
      <FlatList
        data={bookFunctionList}
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

export default BookingScreen;

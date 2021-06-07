import * as React from "react";
import { View, StyleSheet, TextInput, Dimensions, Text } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

const HEIGHT = Dimensions.get("window").height;

function SafetyBootsScreen() {
  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Safety Boots" />
          <Card.Content>
            <Button mode="contained">Safety Boots</Button>

            <Text>ขนาดรองเท้า</Text>
            <TextInput style={styles.inputStyle} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Safety Boots" />
          <Card.Content>
            <Button mode="outlined">Safety Boots</Button>
          </Card.Content>
        </Card>

        <Button mode="contained" style={styles.submitButton}>
          ต่อไป
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 50,
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
  submitButton: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#28A745",
    marginTop: 40,
    color: "#fff",
    borderRadius: 20,
  },
  card: { marginVertical: 16 },
});

export default SafetyBootsScreen;

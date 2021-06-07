import * as React from "react";
import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const HEIGHT = Dimensions.get("window").height;

const radio_props = [
  { label: "A: Fit, no restrictions recommended", value: 0 },
  { label: "B: Fit, with restrictions recommended (see comments)", value: 1 },
  { label: "C: Unfit at this time, to be rechecked on (date)", value: 2 },
  { label: "D: Unfit", value: 3 },
];

function MedicalCheckupsScreen() {
  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <Text>Medical Examination Date</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Date due for next Examination</Text>
        <Text>(plus +12 Months)</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Medical Examination Provider</Text>
        <Text>(Hospital Name, Location)</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Occupational Medicine Doctor</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Abnormal Finding</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Suggestion</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Fitness for Duty Certificate *</Text>
        <View>
          <RadioForm radio_props={radio_props} initial={0} onPress={() => {}} />
        </View>

        <Text>Comments: *</Text>
        <TextInput style={styles.inputStyle} />

        <Text>Upload File :</Text>
        <Text style={styles.textInput}>(กรุณาแนบไฟล์ใหม่ทุกรอบ)*</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#DCDCDC",
            width: "30%",
            marginTop: 10,
            height: HEIGHT / 25,
          }}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text>Choose File</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.submitButton}>
          <Text style={{ color: "#fff" }}>Submit</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#fff" },
  container: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 50,
  },
  submitButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#28A745",
    marginTop: 40,
    color: "#fff",
    borderRadius: 20,
  },
  textHeader: {
    alignItems: "center",
    padding: 20,
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
  textInput: {
    color: "grey",
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 12,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
  },
  viewBorderDropdown: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10,
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 15,
    height: HEIGHT / 12,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});

export default MedicalCheckupsScreen;

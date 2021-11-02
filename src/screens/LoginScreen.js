import React, { useState, useContext ,useEffect} from 'react'
import {
  StyleSheet,
  AsyncStorage,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {Button, Text, Item, Label, Input, Icon, View} from 'native-base';
import {StackActions} from '@react-navigation/native';
import {Card} from 'react-native-elements';
import {httpClient} from '../core/HttpClient';
import { useNavigation } from "@react-navigation/native"

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const [lang, setLang] = useState("TH");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState("eye-off");
  const [showPassword, setShowPassword] = useState(true);
  const WIDTH = Dimensions.get("window").width;
  const _changeIcon = () => {
    setIcon(icon === "eye" ? "eye-off" : "eye");
    setShowPassword(!showPassword);
  };

  const onPressTH = async () => {
    setLang("TH");
    await AsyncStorage.setItem("language", "TH");
  };

  const onPressEN = async () => {
    setLang("EN");
    await AsyncStorage.setItem("language", "EN");
  };
  const onLoginPressed = () => {
    try {
      let params = { username: username, password: password };
      httpClient
        .post("/Login", params)
        .then(async (response) => {
          const res = response.data;

          if (res.err === "Please enter Employee code") {
            lang === "EN"
              ? Alert.alert("Please enter Employee code.")
              : Alert.alert("กรุณากรอก รหัสพนักงาน");
          } else if (res.err === "Please enter password") {
            lang === "EN"
              ? Alert.alert("Please enter password.")
              : Alert.alert("กรุณากรอก พาสเวิร์ด");
          } else if (res.err === "Invalid Employee code") {
            lang === "EN"
              ? Alert.alert("Employee code Invalid.")
              : Alert.alert("รหัสพนักงานไม่ถูกต้อง");
          } else if (res.err === "Invalid password") {
            lang === "EN"
              ? Alert.alert("Invalid password.")
              : Alert.alert("พาสเวิร์ด ไม่ถูกต้อง");
          }

          if (res.result === "success") {
            // save user id and token
            await AsyncStorage.setItem("userId", res.id);
            await AsyncStorage.setItem("fullnameTH", res.fullnameTH);
            await AsyncStorage.setItem("fullnameEN", res.fullnameEN);
            await AsyncStorage.setItem("token", res.token);
            navigation.dispatch(StackActions.replace("Main"));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
   
      <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              left: "75%",
              top: "8%",
              backgroundColor: "#e6e6e6",
              borderRadius: 5,
            }}
          >
            <View style={{ flexDirection: "row", padding: 5 }}>
              <TouchableOpacity onPress={onPressTH}>
                <Text
                  style={
                    (lang === "TH" ? styles.active : styles.noActive
                  )
                  }
                >
                  TH
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                
                }}
              >
                {" "}
                /{" "}
              </Text>
              <TouchableOpacity onPress={onPressEN}>
                <Text style={lang === "EN" ? styles.active : styles.noActive}>
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Card
            containerStyle={{
              overflow: "hidden",
              flexDirection: "column",
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 20,
              borderRadius: 10,
              padding: 20,
              backgroundColor: "#fff",
            }}
          >
            {/* <Image
                source={{uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Exterran_logo.svg/1200px-Exterran_logo.svg.png'}}
                resizeMode={'stretch'}
                style={styles.logo}
              /> */}
            <Text style={styles.text1}>
              {lang === "EN" ? "Login" : "เข้าสู่ระบบ"}
            </Text>

            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <Item floatingLabel style={{ marginBottom: 10 }}>
                <Label
       
                >
                  {lang === "EN" ? "Employee code" : "รหัสพนักงาน"}
                </Label>
                <Input
                  
                  onChangeText={(text) => setUsername(text)}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                />
              </Item>
              <Item floatingLabel>
                <Label
                
                >
                  {lang === "EN" ? "Password" : "รหัสผ่าน"}
                </Label>
                <Input
                 
                  secureTextEntry={showPassword}
                  onChangeText={(text) => setPassword(text)}
                />
                <Icon name={icon} onPress={_changeIcon} />
              </Item>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
              underlayColor={"#d9d9d9"}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordButtonText}>
                {lang === "EN" ? "Forgot password" : "ลืมรหัสผ่าน"}
              </Text>
            </TouchableOpacity>

            <Button onPress={onLoginPressed} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                {lang === "EN" ? "Login" : "เข้าสู่ระบบ"}
              </Text>
            </Button>
          </Card>
        </View>
      </View>

  );
}

const stylesdialog = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    // margin:5
  },
  buttonOpen: {
    backgroundColor: "green",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
const styles = StyleSheet.create({
  active: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002266",
  },
  noActive: {
    fontSize: 18,
    fontWeight: "100",
    color: "gray",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 0.5,
    flexDirection: "column",
    resizeMode: "contain",
    justifyContent: "center",
  },
  logo: {
    marginTop: 30,
    alignSelf: "center",
    height: 100,
    width: 200,
    marginBottom: 15,
  },
  text1: {

    marginTop: 20,
    alignSelf: "center",
    // fontWeight: 'bold',
    fontSize: 25,
    color: "#002266",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: "100%",
    marginTop: 10,
    padding: 4,
    borderRadius: 5,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#48bbec33",
  },
  loginButton: {
    height: 45,
    backgroundColor: "#3399ff",
    alignSelf: "stretch",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 30,
    justifyContent: "center",
  },
  registerButton: {
    height: 50,
    alignSelf: "stretch",
    marginTop: 0,
    justifyContent: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingRight: 15,
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 18,
    color: "#FFF",
    alignSelf: "center",

  },
  labelRegister: {
    fontSize: 16,
    color: "#0007",
    alignSelf: "center",
  },
  registerButtonText: {
    paddingLeft: 5,
    fontSize: 16,
    color: "#002266",
    alignSelf: "center",
  },
  forgotPasswordButtonText: {
    fontSize: 14,
    color: "#002266",
    alignSelf: "center",

  },
  heading: {
    fontSize: 30,
    marginBottom: 40,
  },
  error: {
    color: "red",
    paddingTop: 10,
  },
  success: {
    color: "green",
    paddingTop: 10,
  },
  loader: {
    marginTop: 20,
  },
});

// export default LoginScreen

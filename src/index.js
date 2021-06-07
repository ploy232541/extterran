// In App.js in a new project

import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, AsyncStorage } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icons from "react-native-vector-icons/MaterialIcons";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
  Divider,
  Avatar,
  Title,
  Caption,
  Button,
} from "react-native-paper";
import { Col, Row, Grid } from "react-native-easy-grid";
import { UserContext } from "./context/UserContext";
import BottomTabNavigation from "./components/BottomTabNavigation";
import TrainingScreen from "./screens/Training/TrainingScreen";
import ReportScreen from "./screens/ReportScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CourseCategoryGeneral from "./screens/Course/CourseCategoryGeneral";
import StudyPlanScreen from "./screens/StudyPlan/StudyPlanScreen";
import LearningStatusScreen from "./screens/LearningStatus/LearningStatusScreen";
import Loading from "./screens/Loading";
import LoginScreen from "./screens/LoginScreen";
import routes from "./routes";
import { useNavigation } from "@react-navigation/native"
import {StackActions} from '@react-navigation/native';
import {httpClient} from './core/HttpClient';
import StaffScreen from "./screens/Staff/StaffScreen";
import FeedBackScreen from "./screens/FeedBack/FeedBackScreen";
import ClassroomScreen from "./screens/Classroom/ClassroomScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation()
  const [lang, setLang] = useState(null)
  const [fullName, setFullName] = useState(null)
  useEffect(() => {
    const run = async () => {
      try {
        let language  = await AsyncStorage.getItem('language')
        let fullnameTH = await AsyncStorage.getItem('fullnameTH');
        let fullnameEN = await AsyncStorage.getItem('fullnameEN');
        setLang(language)
        if(language == "EN"){
          setFullName(fullnameEN)
        }else{
          setFullName(fullnameTH)
        }
      
      } catch (e) {
        console.log(e)
      }
    };
    run();
  }, []);

   const Logout = async() => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('language');
    await AsyncStorage.removeItem('fullnameTH');
    await AsyncStorage.removeItem('fullnameEN');
    navigation.dispatch(StackActions.replace('LoginScreen'));
  }

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <Grid>
          {/* <Col size={1}>
            <Avatar.Image />
          </Col> */}
          <Col size={2}>
            <Title style={{fontWeight: 'bold'}}>{fullName}</Title>
            {/* <Caption>สมาชิกทั่วไป</Caption> */}
            {/* <Button mode="outlined" compact={true}>
              ข้อมูลส่วนตัว
            </Button> */}
          </Col>
        </Grid>
      </View>
      <Divider />
      <View>
        <DrawerItemList {...props} />
      </View>
      <View
        style={{
          padding: 20,
        }}
      >
        <Button icon="exit-to-app" mode="contained" onPress={Logout}>
        {lang == "EN" ? "Logout" : "ออกจากระบบ"}
        </Button>
      </View>
    </DrawerContentScrollView>
  );
}

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

  switch (routeName) {
    case "HomeTab":
      return " ";
    case "MyProgramsTab":
      return " ";
    case "SearchTab":
      return " ";
    case "ProfileTab":
      return " ";
    case "AccountTab":
      return "  ";
  }
}

function DrawerStack() {
  const [lang, setLang] = useState(null)
  const [team, setTeam] = useState(null)
  useEffect(() => {
    const run = async () => {
      try {
        const user_id = await AsyncStorage.getItem('userId');
        setLang(await AsyncStorage.getItem('language'))

        httpClient
          .get(`/Team/getMenuTeam/${user_id}`)
          .then(async response => {
            const res = response.data;
            setTeam(res)
          })
          .catch(error => {
            console.log(error);
          });
      } catch (e) {
        console.log(e)
      }
    };
    run();
  }, []);

  return (
    <Drawer.Navigator
                screenOptions={{ headerShown: true }}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen
                  name="Home"
                  options={({ route }) => ({
                    title: lang == 'EN' ? "Home" : "หน้าหลัก",
                    headerTitle: getHeaderTitle(route),
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="home" />
                    ),
                  })}
                >
                  {({ navigation }) => (
                    <BottomTabNavigation initRoute="HomeTab" />
                  )}
                </Drawer.Screen>

                <Drawer.Screen
                  name="MyPrograms"
                  options={({ route }) => ({
                    title: lang == 'EN' ? "Course" : "หลักสูตรของฉัน",
                    headerTitle: getHeaderTitle(route),
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="view-list" />
                    ),
                  })}
                >
                  {({ navigation }) => (
                    <BottomTabNavigation initRoute="MyProgramsTab" />
                  )}
                </Drawer.Screen>

                <Drawer.Screen
                  name="Status"
                  options={{
                    title: lang == 'EN' ? "Study status" : "สถานะการเรียน",
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="insert-chart" />
                    ),
                  }}
                >
                  {({ navigation }) => (
                    <ScrollView>
                      <LearningStatusScreen />
                    </ScrollView>
                  )}
                </Drawer.Screen>

                {
                  team != null ? 
                    <Drawer.Screen
                    name="Staff"
                    options={{
                      title: lang == 'EN' ? "Team" : "ทีมงาน",
                      drawerIcon: ({ size, color }) => (
                        <Icons size={size} color={color} name="people" />
                      ),
                    }}
                  >
                    {({ navigation }) => (
                      <ScrollView style={{backgroundColor: '#fff'}}>
                        <StaffScreen />
                      </ScrollView>
                    )}
                  </Drawer.Screen>
                  :
                  null
                }
               
                <Drawer.Screen
                  name="StudyPlan"
                  options={{
                    title: lang == 'EN' ? "Study plan" : "แผนการเรียน",
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="library-books" />
                    ),
                  }}
                >
                  {({ navigation }) => (
                    <ScrollView>
                      <StudyPlanScreen />
                    </ScrollView>
                  )}
                </Drawer.Screen>

                <Drawer.Screen
                  name="Programs"
                  options={{
                    title: lang == 'EN' ? "General course" : "หลักสูตรทั่วไป",
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="school" />
                    ),
                  }}
                >
                  {({ navigation }) => (
                      <CourseCategoryGeneral />
                  )}
                </Drawer.Screen>

                <Drawer.Screen
                  name="Training"
                  options={{
                    title: lang == 'EN' ? "Training" : "ฝึกอบรม",
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="today" />
                    ),
                  }}
                >
                  {({ navigation }) => (
                    <ScrollView>
                      <TrainingScreen />
                    </ScrollView>
                  )}
                </Drawer.Screen>

                <Drawer.Screen
                    name="Classroom"
                    options={{
                      title: lang == 'EN' ? "Classroom online" : "ห้องเรียนออนไลน์",
                      drawerIcon: ({ size, color }) => (
                        <Icons size={size} color={color} name="cast-connected" />
                      ),
                    }}
                  >
                    {({ navigation }) => (
                      <ScrollView style={{backgroundColor: '#fff'}}>
                        <ClassroomScreen />
                      </ScrollView>
                    )}
                  </Drawer.Screen>


                <Drawer.Screen
                    name="FeedBack"
                    options={{
                      title: lang == 'EN' ? "Feedback To Supervisor" : "Feedback To Supervisor",
                      drawerIcon: ({ size, color }) => (
                        <Icons size={size} color={color} name="forum" />
                      ),
                    }}
                  >
                    {({ navigation }) => (
                      <ScrollView style={{backgroundColor: '#fff'}}>
                        <FeedBackScreen />
                      </ScrollView>
                    )}
                  </Drawer.Screen>

                <Drawer.Screen
                  name="Settings"
                  options={{
                    title: lang == 'EN' ? "Settings language" : "ตั้งค่าภาษา",
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="settings" />
                    ),
                  }}
                >
                  {({ navigation }) => (
                    <ScrollView>
                      <SettingsScreen />
                    </ScrollView>
                  )}
                </Drawer.Screen>

                <Drawer.Screen
                  name="Report"
                  options={{
                    title: lang == 'EN' ? "Report a problem" : "แจ้งปัญหาการใช้งาน",
                    drawerIcon: ({ size, color }) => (
                      <Icons size={size} color={color} name="report-problem" />
                    ),
                  }}
                >
                  {({ navigation }) => (
                    <ScrollView>
                      <ReportScreen />
                    </ScrollView>
                  )}
                </Drawer.Screen>
              </Drawer.Navigator>
  );
}



function MainApp() {
  
  const [theme, setTheme] = React.useState(DefaultTheme);
  const paperTheme = React.useMemo(() => {
  const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        accent: theme.dark ? "rgb(255, 55, 95)" : "rgb(255, 45, 85)",
      },
    };
  }, [theme.colors, theme.dark]);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              title: " ",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CustomDrawerContent"
            component={CustomDrawerContent}
            options={{
              title: " ",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Main"
            component={DrawerStack}
            options={{
              title: " ",
              headerShown: false,
            }}
          />

          {Object.keys(routes).map((name) => (
            <Stack.Screen
              key={name}
              name={name}
              getComponent={() => routes[name].component}
              options={{ title: routes[name].title }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default MainApp;

import { documentDirectory, downloadAsync } from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  NativeModules,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ActivityIndicator, Button, Card, List } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";

import axios from "axios";
import Constants from "expo-constants";
import shareAsync from "expo-sharing";
import Icons from "react-native-vector-icons/AntDesign";
import Icons0 from "react-native-vector-icons/Entypo";
import Icons1 from "react-native-vector-icons/FontAwesome";
import Icons2 from "react-native-vector-icons/Fontisto";
import Icons3 from "react-native-vector-icons/Ionicons";
import Icons4 from "react-native-vector-icons/MaterialCommunityIcons";
import join from "url-join";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorage } from "react-native";

import indexStyle, { colors } from "../styles/index.style";

import BookingApproveFormScreen from "../screens/Staff/BookingApproveFormScreen";
import TrainingApproveFormScreen from "../screens/Staff/TrainingApproveFormScreen";
import ModalBookingStatus from "../screens/Training/ModalBookingStatus";
import ModalBookingUnderStatus from "../screens/Training/ModalBookingUnderStatus";
import ModalTrainingStatus from "../screens/Training/ModalTrainingStatus";
import ModalTrainingUnderStatus from "../screens/Training/ModalTrainingUnderStatus";
import Icon from "react-native-vector-icons/FontAwesome";

const absoluteURLRegex = /^(?:\w+:)\/\//;
const { manifest } = Constants;

var _language;

axios.interceptors.request.use(async (config) => {
  if (!absoluteURLRegex.test(config.url)) {
    const jwtToken = await AsyncStorage.getItem("token");

    //  Check falsy values (0, 0n, null, undefined, false, NaN, "") in jwtToken.
    if (jwtToken) config.headers = { "x-access-token": jwtToken };

    config.url = join(
      `http://${
        __DEV__ //  DEVELOPMENT MODE
          ? Constants.isDevice // real devices
            ? //  connect via a computer's localhost.
              manifest.debuggerHost.split(`:`).shift()
            : "localhost" //  localhost
          : "smartxlearning.com" //  server
      }:3000`,
      config.url
    );
  }

  return config;
});

export const httpClient = axios;

export async function downloadFile(fileLink, fileName) {
  const path = fileLink.split("/"),
    extend = path[path.length - 1].split(".")[1],
    fileUri = `${documentDirectory}${encodeURI(fileName)}.${extend}`,
    { uri } = await downloadAsync(fileLink, fileUri);

  await shareAsync(uri);
}

export async function setLanguage() {
  useEffect(() => {
    const run = async () => {
      try {
        _language = (await AsyncStorage.getItem("language")) ?? getOSLocale();

        await AsyncStorage.setItem("language", _language);
      } catch (e) {
        console.log(e);
      }
    };

    run();
  }, []);
}

export async function switchLanguage() {
  try {
    _language = _language == "EN" ? "TH" : "EN";

    await AsyncStorage.setItem("language", _language);
  } catch (e) {
    console.log(e);
  }
}

export function accordionListScreen(type, subtype, title = null) {
  const word = ["0", "Training", "??????????????????????????????", "Course", "????????????????????????"];
  const word0 = ["1", "Booking", "??????????????????", "Category", "??????????????????"];
  const [expanded, setExpanded] = useState(false);
  const [expanded0, setExpanded0] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [lang, setLang] = useState(getLanguage());
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [bookingList, setBookingList] = useState([]);
  const [trainingList, setTrainingList] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [modalData0, setModalData0] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible0, setModalVisible0] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  let count = bookingList.length || trainingList.length,
    isNotEmpty = bookingList.length > 0 || trainingList.length > 0,
    isOnlyOne = bookingList.length == 1 || trainingList.length == 1;

  const setDataList = (router, func) => {
    httpClient
      .get(router)
      .then((response) => {
        let res = response.data;

        if (res) func(res);

        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    const source = httpClient.CancelToken.source();
    run();
    return () => {
      setExpanded(false);
      setExpanded0(false);
      setExpanded1(false);
      setExpanded2(false);
      setBookingId(null);
      setRequestId(null);
      setBookingList([]);
      setTrainingList([]);
      setLoading(true);
      source.cancel();
    };
  }, []);
  const run = async () => {
    try {
      let langCode = getLanguage(),
        langId = langCode === "EN" ? "1" : "2",
        userId = await AsyncStorage.getItem("userId");

      setLang(langCode);

      if (type == 0) {
        setDataList(
          `/Training/getBooking${
            subtype == 1 ? "Under" : ""
          }/${langId}/${userId}`,
          setBookingList
        );

        setDataList(
          `/Training/getTrainingRequest${
            subtype == 1 ? "Under" : ""
          }/${langId}/${userId}`,
          setTrainingList
        );
      } else if (type == 1) {
        if (subtype == 2) {
          setDataList(
            `/Team/getTrainingRequest/${userId}/${langId}`,
            setTrainingList
          );
        }
        if (subtype == 3) {
          setDataList(
            `/Team/getBookingRequest/${userId}/${langId}`,
            setBookingList
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const accordion = (
    word,
    expanded,
    func,
    modal,
    visible,
    closed,
    shown,
    data
  ) => {
    return (
      <View style={indexStyle.accordionStyle}>
        <List.Accordion
          expanded={expanded}
          onPress={() => (isNotEmpty ? func(!expanded) : null)}
          style={{
            borderRadius: 10,
            backgroundColor: "orange",
            marginVertical: 12,
            marginHorizontal: 10
          }}
          title={
            type == 0
              ? isNotEmpty
                ? subtype == 1
                  ? lang == "EN"
                    ? `List of ${word[1]} Requests`
                    : `???????????????????????????????????????${word[2]}`
                  : lang == "EN"
                  ? `Your ${word[1]} Requests`
                  : "???????????????????????????????????????" + word[2]
                : lang == "EN"
                ? "No requests found."
                : "?????????????????????????????????????????????????????????"
              : type == 1
              ? subtype == 2 || subtype == 3
                ? isNotEmpty
                  ? lang == "EN"
                    ? `Waiting for approval :    ${count}    person${
                        isOnlyOne ? "" : "s"
                      }.`
                    : `????????????????????????????????????????????????????????? ${count} ??????????????????`
                  : lang == "EN"
                  ? "No person is waiting for approval."
                  : "????????????????????????????????????????????????????????????????????????????????????"
                : null
              : null
          }
        >
          {data.length > 0
            ? data.map((item) => {
                return (
                  // <Card style={indexStyle.cardStyle}>
                  <Card
                    style={{
                      borderRadius: 10,
                      marginHorizontal: 10,
                      backgroundColor: "white",
                      marginTop: 5,
                      borderColor: "#003263",
                      borderWidth: 1
                    }}
                  >
                    <Card.Content style={indexStyle.cardContentStyle}>
                      <View
                        style={[
                          indexStyle.infoStyle,
                          {
                            width:
                              word[0] == "0" && item.url_print ? "62%" : "81%"
                          }
                        ]}
                      >
                        {item.booking_type == 1 ||
                        item.type == "??????????????????????????????????????????" ? (
                          <Icons0
                            name={"aircraft"}
                            size={30}
                            // style={indexStyle.iconsStyle}
                            style={{ color: "#007bff", marginBottom: 10 }}
                          />
                        ) : item.booking_type == 2 ||
                        item.type == "??????????????????"? (
                          <Icons1
                            name={"hotel"}
                            size={30}
                            // style={indexStyle.iconsStyle}
                            style={{ color: "#007bff", marginBottom: 10 }}
                          />
                        ) : item.booking_type == 3 ||
                        item.type == "??????????????????"? (
                          <Icons2
                            name={"car"}
                            size={30}
                            // style={indexStyle.iconsStyle}
                            style={{ color: "#007bff", marginBottom: 10 }}
                          />
                        ) : null}

                        {/* <View style={{flexDirection: "row",
                            flexWrap: "wrap"}}>

                        
                          <Icons0
                            name={"aircraft"}
                            size={30}
                            // style={indexStyle.iconsStyle}
                            style={{ color: "#007bff",  marginBottom: 10 }}
                            
                          />
                          <Icons1
                            name={"hotel"}
                            size={30}
                            // style={indexStyle.iconsStyle}
                            style={{ color: "#007bff", marginBottom: 10 }}
                          />
                          <Icons2
                            name={"car"}
                            size={30}
                            // style={indexStyle.iconsStyle}
                            style={{ color: "#007bff", marginBottom: 10 }}
                          />
                        </View> */}

                        <Text style={indexStyle.textStyle}>
                          {(type == 0 && subtype == 1) || type == 1
                            ? `${item.fullname}\n\n`
                            : null}
                          <Text style={indexStyle.textBoldStyle}>
                            {`${
                              word[0] === "0"
                                ? `${lang == "EN" ? word[3] : word[4]} : `
                                : `${lang == "EN" ? word0[3] : word0[4]} : `
                            }`}
                          </Text>
                          {`${
                            word[0] === "0"
                              ? item.course_title
                              : item.booking_type_text ||
                                `${item.type} ${item.detail}`
                          }`}
                          {type == 0 ? (
                            <>
                              <Text style={indexStyle.textBoldStyle}>
                                {`\n\n${lang == "EN" ? "Status" : "???????????????"} : `}
                              </Text>
                              <Text
                                style={{ color: item.request_status_color }}
                              >
                                {`${item.request_status_text}`}
                              </Text>
                              {item.note_reject != null
                                ? `\n\n${
                                    lang == "EN" ? "Note" : "????????????????????????"
                                  } : ${item.note_reject}`
                                : null}
                            </>
                          ) : null}
                        </Text>
                      </View>

                      {word[0] == "0" && item.url_print ? (
                        <TouchableOpacity
                          style={{
                            borderRadius: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 36,
                            marginLeft: 8,
                            marginRight: 2,
                            marginTop: 10
                          }}
                          onPress={() => Linking.openURL(item.url_print)}
                        >
                          <Icon
                            name="print"
                            size={30}
                            style={{ color: "orange" }}
                          >
                            <Text style={{ fontSize: 14, color: "black" }}>
                              {lang == "EN" ? " " + "Print" : " " + "???????????????"}
                            </Text>
                          </Icon>
                        </TouchableOpacity>
                      ) : null}

                      <TouchableOpacity
                        style={{
                          borderRadius: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#007bff",
                          height: 36,
                          marginLeft: 8,
                          marginRight: 2,
                          marginTop: 10
                        }}
                        onPress={() =>
                          shown(
                            item.modal || item.request_id || item.booking_id
                          )
                        }
                      >
                        <Icon name="file" size={25} style={{ color: "white" }}>
                          <Text style={{ fontSize: 14, color: "white" }}>
                            {lang == "EN" ? " " + "Detail" : " " + "??????????????????"}
                          </Text>
                        </Icon>
                      </TouchableOpacity>
                    </Card.Content>
                  </Card>
                );
              })
            : null}
        </List.Accordion>
        {modal ? (
          type == 0 ? (
            subtype == 1 ? (
              word[0] === "0" ? (
                <ModalTrainingUnderStatus
                  chkVisible={visible}
                  closeModal={closed}
                  modelData={modal}
                />
              ) : word[0] === "1" ? (
                <ModalBookingUnderStatus
                  chkVisible={visible}
                  closeModal={closed}
                  modelData={modal}
                />
              ) : null
            ) : word[0] === "0" ? (
              <ModalTrainingStatus
                chkVisible={visible}
                closeModal={closed}
                modelData={modal}
              />
            ) : word[0] === "1" ? (
              <ModalBookingStatus
                chkVisible={visible}
                closeModal={closed}
                modelData={modal}
              />
            ) : null
          ) : type == 1 ? (
            subtype == 2 ? (
              <TrainingApproveFormScreen
                chkVisible={visible}
                closeModal={closed}
                request_id={modal}
              />
            ) : subtype == 3 ? (
              <BookingApproveFormScreen
                booking_id={modal}
                chkVisible={visible}
                closeModal={closed}
              />
            ) : null
          ) : null
        ) : null}
      </View>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    run();
  };

  const closeModal0 = () => {
    setModalVisible0(false);
    run();
  };
  const closeModal1 = () => {
    setModalVisible1(false);
    run();
  };

  const closeModal2 = () => {
    setModalVisible2(false);
    run();
  };

  const showModal = (modal) => {
    setModalVisible(true);
    setModalData(modal);
  };

  const showModal0 = (modal) => {
    setModalVisible0(true);
    setModalData0(modal);
  };

  const showModel1 = (requestId) => {
    setModalVisible1(true);
    setRequestId(requestId);
  };

  const showModal2 = (bookingId) => {
    setModalVisible2(true);
    setBookingId(bookingId);
  };

  // console.log(bookingList.forEach((item) => item.booking_id));

  return (
    <SafeAreaView style={indexStyle.container}>
      {loading ? (
        activityIndicator()
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {type == 0 ? (
            <>
              {accordion(
                word,
                expanded,
                setExpanded,
                modalData,
                modalVisible,
                closeModal,
                showModal,
                trainingList
              )}

              {accordion(
                word0,
                expanded0,
                setExpanded0,
                modalData0,
                modalVisible0,
                closeModal0,
                showModal0,
                bookingList
              )}
            </>
          ) : subtype == 2 ? (
            accordion(
              word,
              expanded1,
              setExpanded1,
              requestId,
              // trainingList.forEach((item) => item.training_id),
              modalVisible1,
              closeModal1,
              showModel1,
              trainingList
            )
          ) : subtype == 3 ? (
            accordion(
              word0,
              expanded2,
              setExpanded2,
              bookingId,
              // bookingList.forEach((item) => item.booking_id),
              modalVisible2,
              closeModal2,
              showModal2,
              bookingList
            )
          ) : (
            ""
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export function activityIndicator() {
  return (
    <View style={indexStyle.activityIndicatorView}>
      <ActivityIndicator
        color={colors.exterran}
        size={30}
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

export function blank(margin) {
  return (
    <View
      style={[
        indexStyle.scrollView,
        { backgroundColor: "transparent", margin: margin }
      ]}
    />
  );
}

export function buttonCard(
  func,
  to,
  title,
  icon = null,
  src = null,
  type = null
) {
  return (
    <View style={indexStyle.buttonCardView}>
      <TouchableOpacity onPress={() => func(to, { title: title, type: type })}>
        <Card style={indexStyle.buttonCardStyle}>
          {icon ? (
            <>
              <Icons4 name={icon} size={35} style={indexStyle.buttonCardIcon} />

              <Card.Content style={indexStyle.buttonCardContent}>
                <Text numberOfLines={1} style={indexStyle.buttonCardText}>
                  {title}
                </Text>
              </Card.Content>
            </>
          ) : (
            <>
              <Card.Cover
                source={{ uri: src }}
                style={indexStyle.buttonCardCover}
              />

              <Card.Actions style={indexStyle.buttonCardActions}>
                <Button color={colors.exterran0}>{title}</Button>
              </Card.Actions>
            </>
          )}
        </Card>
      </TouchableOpacity>
    </View>
  );
}

export function flatListScreen(dataList, numColumns, to = null) {
  const navigation = useNavigation();
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [lang, setLang] = useState(getLanguage());

  const widgets = ({ item }) => {
    return item.empty
      ? null // blank(5 || 15)
      : buttonCard(
          navigation.navigate,
          to ?? item.to,
          lang == "EN" ? item.titleEN : item.title,
          item.icon ?? null,
          item.imgSrc ?? null,
          to ? item.to : null
        );
  };

  if (lang != getLanguage()) setLang(getLanguage());

  useEffect(() =>
    setScrollEnabled(
      Math.ceil(Object.keys(dataList).length / 2) > 2 ? true : false
    )
  );

  return (
    <FlatList
      data={formatDataList(dataList, numColumns)}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      renderItem={widgets}
      scrollEnabled={scrollEnabled}
      style={indexStyle.container}
    />
  );
}

export function formatDataList(dataList, numColumns) {
  const totalRow = Math.floor(dataList.length / numColumns);

  let totalLastRow = dataList.length - totalRow * numColumns;

  while (totalLastRow !== 0 && totalLastRow !== numColumns) {
    dataList.push({ empty: true, id: "blank" });
    totalLastRow++;
  }

  return dataList;
}

export function getLanguage() {
  return _language;
}

export function getOSLocale() {
  // Determine device language.
  const locale = (
    Platform.OS === "ios"
      ? // iOS 12, e.g. "fr_FR"
        NativeModules.SettingsManager.settings.AppleLocale ||
        // iOS 13+, e.g. "en_US"
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : // Android, e.g. "th_TH"
        NativeModules.I18nManager.localeIdentifier
  )
    .slice(0, 2)
    .toUpperCase();

  return locale != "TH" ? "EN" : locale;
}

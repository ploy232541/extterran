import { Accordion, Icon } from "native-base";
import React, { useEffect, useState } from "react";
import { View, Text, AsyncStorage, ScrollView, Linking } from "react-native";
import HTML from "react-native-render-html";
import { httpClient } from "../../core/HttpClient";
import Accordian from "./Accordian";
var decode = require("decode-html");
export default function QandAListScreen(props) {
  const [lang, setLang] = useState("");
  const [data, setData] = useState([]);
  const run = async () => {
    const getlang = await AsyncStorage.getItem("language");
    var lang_id = 2;
    if (getlang == "EN") {
      setLang(getlang);
      lang_id = 1;
    } else {
      setLang("TH");
    }
    try {
      httpClient
        .get(`/Faq/${lang_id}`)
        .then((res) => {
          let result = res.data;
          if (result != null) {
            setData(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    run();
  }, []);
  const renderAccordians = () => {
    const items = [];
    for (var item of data) {
      items.push(
        <Accordian
          title={item.faq_type_title_TH}
          qdata={item.faq_THtopic}
          data={item.faq_THanswer}
        />
      );
    }
    return items;
  };

  return (
    <ScrollView>
      <View marginTop={10}>{renderAccordians()}</View>
    </ScrollView>
  );
}

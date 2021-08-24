import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { Divider, CheckBox } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Picker } from "native-base";
import { Avatar, RadioButton } from "react-native-paper";
import RadioForm from "react-native-simple-radio-button";
import { AsyncStorage } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { Alert } from "react-native";

const radio_props = [
  { label: "BBS พฤติกรรม", value: 0 },
  { label: "SWA การหยุดงาน", value: 1 },
  { label: "HazOb รายงานความสภาพเสี่ยงที่จะเกิดอุบัติภัย", value: 2 },
  {
    label: "Near Miss สภาพที่เป็นอันตราย/เหตุการณ์เกือบเกิดอุบัติเหตุ",
    value: 3,
  },
  { label: "Other", value: 4 },
];

const radio_table = [{ label: " ", value: 0 }];

const radio1_props = [
  { label: "Yes (ใช่)", value: 0 },
  { label: "No (ไม่)", value: 1 },
  { label: "NA", value: 2 },
];

const radio_severity = [
  { label: "Severe / ร้ายแรงที่สุด", value: 0 },
  { label: "Major / ร้ายแรงมาก", value: 1 },
  { label: "Serious / ร้ายแรง", value: 2 },
  { label: "Minor / ไม่ร้ายแรง", value: 3 },
  { label: "Incidental / เล็กน้อย", value: 4 },
];

const radio_probability = [
  { label: "Frequent / เกิดขึ้นบ่อยมาก", value: 0 },
  { label: "Occational / เกิดได้บ่อยก", value: 1 },
  { label: "Seldom / นาน ๆ ครั้ง", value: 2 },
  { label: "Unlikely / มีโอกาสเกิดขึ้นน้อย", value: 3 },
  { label: "Remote / เกิดขึ้นได้ยากมาก", value: 4 },
];

const radio_BBS = [
  { label: "Safe \t", value: 0 },
  { label: "At risk \t", value: 1 },
  { label: "N/A \t", value: 2 },
];

const radio_Other = [
  { label: "Safe \t", value: 0 },
  { label: "At risk \t", value: 1 },
  { label: "N/A \t", value: 2 },
];

const HEIGHT = Dimensions.get("window").height;

const accounts1 = [
  {
    accNumber: "อื่นๆ ระบุในข้อถัดไป",
  },
];

const accounts = [
  {
    accNumber: "1.1 อยู่ในจุดอันตราย",
  },
  {
    accNumber: "1.2 สายตามองทางเดิน",
  },
  {
    accNumber: "1.3 สายตามองงานที่จะทำ",
  },
  {
    accNumber: "1.4 จุดที่อาจถูก หนีบ ตัด ดึง บาด",
  },
  {
    accNumber: "1.5 การขึ้นลงบันใดหรือทางต่างระดับ",
  },
  {
    accNumber: "2.1 การเคลื่อนย้ายวัสดุโดยการยก หย่อน ดัน หรือดึง",
  },
  {
    accNumber: "2.2 การบิดเอี้ยวตัว",
  },
  {
    accNumber: "2.3 การเอื้อม หยิบ จับสิ่งของ",
  },
  {
    accNumber: "3.1 การเลือกใช้เครื่องมืออุปกณ์",
  },
  {
    accNumber: "3.2 อุปกรณ์ป้องกัน กั้น แยก หรือเตือนภัย",
  },
  {
    accNumber: "4.1 การวางแผนและการบ่งชี้อันตรายในงาน",
  },
  {
    accNumber: "4.2 การปฏิบัติตามขั้นตอนระเบียบการปฏิบัติงาน",
  },
  {
    accNumber: "4.3 การตัดแยกระบบแหล่งพลังงาน",
  },
  {
    accNumber: "4.4 งานที่ก่อให้เกิดความร้อนและประกายไฟ",
  },
  {
    accNumber: "4.5 งานในที่อับอากาศ",
  },
  {
    accNumber: "4.7 การสื่อสารระหว่างเพื่อนร่วมงาน",
  },
  {
    accNumber: "5.1 ความมั่นคงแข็งเเรงของพื้นโครงสร้าง",
  },
  {
    accNumber: "5.2 ความสะอาดเรียบร้อย",
  },
  {
    accNumber: "5.3 แสงสว่างเพียงพอกับงาน",
  },
  {
    accNumber: "6.1 การหยุดพักระหว่างทำงานเป็นระยะ",
  },
  {
    accNumber: "6.2 ตำแหน่งของคอและหลัง",
  },
  {
    accNumber: "6.5 ตำแหน่งของไหล่",
  },
  {
    accNumber: "6.6 ตำแหน่งของการวางข้อมือและแขน",
  },
  {
    accNumber: "6.9 ตำแหน่งของการวางเท้า",
  },
  {
    accNumber: "7.1 การป้องกันการหกรั่วไหล",
  },
  {
    accNumber: "7.2 การจัดการกรณีมีการหกรั่วไหล",
  },
  {
    accNumber: "7.3 การจัดการของเสีย",
  },
  {
    accNumber: "8.1 อุปกรณ์ป้องกันศรีษะ",
  },
  {
    accNumber: "8.2 อุปกรณ์ป้องกันใบหน้าและตวงตา",
  },
  {
    accNumber: "8.3 อุปกรณ์ป้องกันหูและการได้ยิน",
  },
  {
    accNumber: "8.4 อุปกรณ์ป้องกันระบบทางเดินหายใจ",
  },
  {
    accNumber: "8.5 อุปกรณ์ป้องกันมือ",
  },
  {
    accNumber: "8.6 อุปกรณ์ป้องกันการตกจากที่สูง",
  },
  {
    accNumber: "8.7 ชุดปฏิบัติงาน",
  },
  {
    accNumber: "8.8 อุปกรณ์ชูชีพ",
  },
  {
    accNumber: "8.9 อุปกรณ์ป้องกันเท้า",
  },
  {
    accNumber: "9.2 เข็มขัดนิรภัย",
  },
  {
    accNumber: "9.3 อัตราความเร็ว",
  },
  {
    accNumber: "9.4 ระยะห่างระหว่างรถ",
  },
];

export default class ReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      formId: props.route.params.formId,
      inputFormType: null,
      dataform1: [
        {
          formtype: 1,
          question_id: 1,
          question_type: 2,
          question_name: "observation_detail",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 2,
          question_type: 4,
          question_name: "activated_stop_work",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 3,
          question_type: 2,
          question_name: "recommendation_for_improvement",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 4,
          question_type: 4,
          question_name: "part10_1_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 5,
          question_type: 4,
          question_name: "part10_1_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 6,
          question_type: 4,
          question_name: "part10_1_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 7,
          question_type: 4,
          question_name: "part10_1_4",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 8,
          question_type: 4,
          question_name: "part10_1_5",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 9,
          question_type: 4,
          question_name: "part10_2_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 10,
          question_type: 4,
          question_name: "part10_2_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 11,
          question_type: 4,
          question_name: "part10_2_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 12,
          question_type: 4,
          question_name: "part10_3_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 13,
          question_type: 4,
          question_name: "part10_3_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 14,
          question_type: 4,
          question_name: "part10_4_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 15,
          question_type: 4,
          question_name: "part10_4_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 16,
          question_type: 4,
          question_name: "part10_4_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 17,
          question_type: 4,
          question_name: "part10_4_4",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 18,
          question_type: 4,
          question_name: "part10_4_5",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 19,
          question_type: 4,
          question_name: "part10_4_7",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 20,
          question_type: 4,
          question_name: "part10_5_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 21,
          question_type: 4,
          question_name: "part10_5_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 22,
          question_type: 4,
          question_name: "part10_5_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 23,
          question_type: 4,
          question_name: "part11_6_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 24,
          question_type: 4,
          question_name: "part11_6_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 25,
          question_type: 4,
          question_name: "part11_6_5",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 26,
          question_type: 4,
          question_name: "part11_6_6",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 27,
          question_type: 4,
          question_name: "part11_6_9",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 28,
          question_type: 4,
          question_name: "part11_7_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 29,
          question_type: 4,
          question_name: "part11_7_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 30,
          question_type: 4,
          question_name: "part11_7_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 31,
          question_type: 4,
          question_name: "part11_8_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 32,
          question_type: 4,
          question_name: "part11_8_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 33,
          question_type: 4,
          question_name: "part11_8_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 34,
          question_type: 4,
          question_name: "part11_8_4",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 35,
          question_type: 4,
          question_name: "part11_8_5",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 36,
          question_type: 4,
          question_name: "part11_8_6",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 37,
          question_type: 4,
          question_name: "part11_8_7",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 38,
          question_type: 4,
          question_name: "part11_8_8",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 39,
          question_type: 4,
          question_name: "part11_8_9",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 40,
          question_type: 4,
          question_name: "part11_9_2",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 41,
          question_type: 4,
          question_name: "part11_9_3",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 42,
          question_type: 4,
          question_name: "part11_9_4",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 43,
          question_type: 4,
          question_name: "part12_1_1",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 1,
          question_id: 44,
          question_type: 2,
          question_name: "other",
          answer_id: null,
          answer_detail: null,
        },
      ],

      dataform2: [
        {
          formtype: 2,
          question_id: 45,
          question_type: 2,
          question_name: "stop_work_opportunity_and_why",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 46,
          question_type: 2,
          question_name: "possible_consequences",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 47,
          question_type: 2,
          question_name: "comments_responses",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 48,
          question_type: 5,
          question_name: "was_work_activity_resumed",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 49,
          question_type: 5,
          question_name: "was_swa_valid",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 50,
          question_type: 5,
          question_name: "was_issue_resolved",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 51,
          question_type: 5,
          question_name: "is_follow_up_action_required",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 2,
          question_id: 52,
          question_type: 2,
          question_name: "actions_detail_explanation",
          answer_id: null,
          answer_detail: null,
        },
      ],

      dataform3: [
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 53,
          question_type: 3,
          question_name: "category",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 54,
          question_type: 1,
          question_name: "form3_category_other",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 55,
          question_type: 3,
          question_name: "related",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 56,
          question_type: 1,
          question_name: "related_other",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 57,
          question_type: 2,
          question_name: "description",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 58,
          question_type: 4,
          question_name: "severity",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 59,
          question_type: 4,
          question_name: "probability",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 60,
          question_type: 3,
          question_name: "situation",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 61,
          question_type: 1,
          question_name: "situation_other",
          answer_id: null,
          answer_detail: null,
        },
        {
          formtype: 3,
          question_id: 62,
          question_type: 2,
          question_name: "recommendation",
          answer_id: null,
          answer_detail: null,
        },
      ],

      store: [],

      data1: [{ rd_row1: "" }],

      data: [
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
        { rd_row: "" },
      ],

      CheckboxCategory: false,
      CheckboxCategory1: false,
      CheckboxCategory2: false,
      CheckboxCategory3: false,
      CheckboxCategory4: false,
      CheckboxCategory5: false,
      CheckboxCategory6: false,
      CheckboxCategory7: false,
      CheckboxCategory8: false,
      CheckboxCategory9: false,
      CheckboxCategory10: false,

      CheckboxRelated: false,
      CheckboxRelated1: false,
      CheckboxRelated2: false,
      CheckboxRelated3: false,
      CheckboxRelated4: false,
      CheckboxRelated5: false,
      CheckboxRelated6: false,
      CheckboxRelated7: false,
      CheckboxRelated8: false,
      CheckboxRelated9: false,
      CheckboxRelated10: false,
      CheckboxRelated11: false,
      CheckboxRelated12: false,
      CheckboxRelated13: false,

      checkboxYesorNo: false,
      checkboxYesorNo1: false,
      checkboxYesorNo2: false,

      radioformBBS: false,
      radioformSWA: false,
      radioformHazOb: false,
      radioformNearMiss: false,

      form_BBS: null,
      startDate: "DD/MM/YYYY",
      isDatePickerVisible: false,
      endcul: "",
      course: "",
      profile: "",
      position: "",
      firstname: "",
      dept: "",
      lang: "",
      staff: "",
      worklo: "",
      selectlocation: [],
      selectlocationSub: [],
      location: "",
      sublocation: "",
      check: "",

      storeRadio: -1,
      //bbs
      Detail: "",
      Activated: -1,
      improvement: "",
      Otherbbs12: "",

      //swa
      StopWork: "",
      Possible: "",
      Comments: "",
      Waswork: "",
      WasSWA: "",
      Wasissue: "",
      Isfollow: "",
      Actions: "",

      //HazOB
      Otherhazob1: "",
      Otherhazob2: "",
      Otherhazob3: "",
      Description: "",
      Severity: -1,
      Probability: -1,
      Recommendation: "",
    };
  }

  async componentDidMount() {
    // const { navigation } = this.props;
    let id = await AsyncStorage.getItem("userId");
    let formId = this.state.formId;
    this.setState({ user_id: id });

    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN", lang_id: 1 });
    } else {
      this.setState({ lang: "TH", lang_id: 2 });
    }

    try {
      httpClient
        .get(`/Training/TrainingFormScreen/${id}`)
        .then((response) => {
          const result = response.data;
          // console.log(result);
          if (result != null) {
            for (let i = 0; i < result.length; i++) {
              var row = result[i];
              // console.log(row);
              this.setState({
                profile: row,
                firstname:
                  this.state.lang === "EN" ? row.firstname_en : row.firstname,
                lastname:
                  this.state.lang === "EN" ? row.lastname_en : row.lastname,
                position: row.position_title,
                dept: row.dep_title,
                staff:
                  this.state.lang === "EN" ? row.pv_name_en : row.pv_name_th,
                worklo: row.work_location,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/Selectlocation`)
        .then((response) => {
          const result = response.data;
          // console.log(result);
          if (result != null) {
            this.setState({
              selectlocation: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/SelectlocationSub`)
        .then((response) => {
          const result = response.data;
          // console.log(result);
          if (result != null) {
            this.setState({
              selectlocationSub: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Profile/ReportView/${formId}`)
        .then((response) => {
          const result = response.data;
          const dataform1 = this.state.dataform1;
          const dataform2 = this.state.dataform2;
          const dataform3 = this.state.dataform3;
          // console.log("ReportView",result);
          this.setState({
            worklo: result.workLocation,
            location: result.Location,
            sublocation: result.subLocation,
            startDate: this.formatDate(result.observationDate),
            inputFormType: result.formType,
          });
          this.radiocheck(result.formType - 1);
          if (result.formType == 1) {
            for (let i = 0; i < dataform1.length; i++) {
              // console.log(result.answer[i].answerId);
              dataform1[i].answer_id = result.answer[i].answerId;
              dataform1[i].answer_detail = result.answer[i].answerDetail;
            }
            // console.log(dataform1);
            this.setState({ dataform1: dataform1 });
          } else if (result.formType == 2) {
            for (let i = 0; i < dataform2.length; i++) {
              dataform2[i].answer_id = result.answer[i].answerId;
              dataform2[i].answer_detail = result.answer[i].answerDetail;
            }
            this.setState({ dataform2: dataform2 });
          } else if (result.formType == 3) {
            for (let i = 0; i < dataform3.length; i++) {
              dataform3[i].answer_id = result.answer[i].answerId;
              dataform3[i].answer_detail = result.answer[i].answerDetail;
            }
            this.setState({ dataform3: dataform3 });
          } else {
            console.log(result.formType);
          }
          // if (result != null) {
          //   this.setState({
          //     selectlocationSub: result,
          //   });
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      Alert.alert(err);
    }
  }

  onChange = (index, value) => {
    let data = this.state.data;
    // let rd_row = this.state.rd_row
    data[index].rd_row = value;
    this.setState({ data: data });
    // console.log(data);
  };
  onChange1 = (index, value) => {
    let data1 = this.state.data1;
    data1[index].rd_row1 = value;
    this.setState({ data1: data1 });
    // console.log(data1);
  };

  radiocheck = (check) => {
    // console.log(check);
    this.setState({ storeRadio: check });
    if (check === 0) {
      this.setState({
        radioformBBS: !this.state.radioformBBS,
        radioformSWA: false,
        radioformHazOb: false,
      });
    } else if (check === 1) {
      this.setState({
        radioformSWA: !this.state.radioformSWA,
        radioformBBS: false,
        radioformHazOb: false,
      });
    } else if (check === 2) {
      this.setState({
        radioformHazOb: !this.state.radioformHazOb,
        radioformBBS: false,
        radioformSWA: false,
      });
    } else if (check === 3) {
      this.setState({
        radioformHazOb: !this.state.radioformHazOb,
        radioformBBS: false,
        radioformSWA: false,
      });
    } else if (check === 4) {
      this.setState({
        radioformBBS: !this.state.radioformBBS,
        radioformSWA: false,
        radioformHazOb: false,
      });
    }
  };

  // reset = () => {
  //   this.setState({
  //     startDate: "DD/MM/YYYY",
  //     location: "",
  //     sublocation:"",
  //     storeRadio:-1,
  //     StopWork:"",
  //     Possible:"",
  //     Comments:"",
  //     Waswork:"",
  //     WasSWA:"",
  //     Wasissue:"",
  //     Isfollow:"",
  //     Actions:"",
  //   });
  // };
  showDatePicker = (props) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
  };

  formatDate = (date) => {
    var d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  formatDate1 = (date) => {
    let d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear() + 1;

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  handleConfirm = (dates) => {
    var date = this.formatDate(dates);
    var date1 = this.formatDate1(dates);
    // console.log(radio_props);
    // console.log(date);
    if (this.state.isStart) {
      this.setState({
        startDate: date,
        startDate1: date1,

        isStart: false,
      });
      if (this.state.endcul != 0) {
        this.culDate(dates, this.state.endcul);
      }
    } else {
      this.setState({
        endDate: date,
        endcul: dates,
        enddatethai: datethai,
        enddateeng: dateeng,
      });

      if (this.state.startcul != 0) {
        this.culDate(this.state.startcul, dates);
      }
    }

    this.hideDatePicker();
  };

  formBBS = () => {
    if (this.state.radioformBBS) {
      let InputIndex = this.state.dataform1[1].answer_id;
      var inputRadio8 = [];
      if (InputIndex != null) {
        inputRadio8.push(
          <RadioForm
            radio_props={radio1_props}
            initial={InputIndex}
            // onPress = {() => this.radiocheck(formType)}
          />
        );
      }
      var inputradio10 = [];
      const dataformbbs = this.state.dataform1;
      // const dataaccounts = accounts;
      // console.log(accounts.length);
      // console.log(dataformbbs.length);
      let number = 0;
      for (let i = 3; i < 42; i++) {
        const initnumber = dataformbbs[i].answer_id;
        inputradio10.push(
          <View>
            <Text style={{ marginVertical: 10, paddingLeft: 8 }}>
              {accounts[number].accNumber}
            </Text>
            <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
              <RadioForm
                radio_props={radio_BBS}
                formHorizontal={true}
                initial={initnumber}
              />
            </View>
          </View>
        );
        number++;
      }
      console.log(inputradio10);
      return (
        <View>
          <View style={styles.textHead3}>
            <Text style={{ color: "#007aff", fontSize: 20 }}>
              BBS Observation การสังเกตพฤติกรรมความปลอดภัย
            </Text>
          </View>
          <Divider style={{ marginTop: 5 }}></Divider>

          <Text style={styles.textHead3}>
            7. Observation Detail / เรื่องที่เจอ
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            value={this.state.dataform1[0].answer_detail}
            // onChangeText={(text) => this.setState({ Detail: text })}
            placeholder="อธิบายรายละเอียด"
            // value={this.state.Detail}
          ></TextInput>

          <Text style={styles.textHead3}>
            8. Activated Stop Work ได้มีการหยุดงานหรือไม่
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <View>
            {/* <RadioForm
              radio_props={radio1_props}
              initial={-1}
              offPress={(text) => this.setState({ Activated: text })}
            /> */}
            {inputRadio8}
          </View>

          <Text style={styles.textHead3}>
            9. Recommendation for improvement / การแก้ไขเพื่อไม่ให้เกิดขึ้นอีก
            หรือการสนับสนุนการปฏิบัติอย่างปลอดภัย
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            value={this.state.dataform1[2].answer_detail}
            // onChangeText={(text) => this.setState({ improvement: text })}
            placeholder="อธิบายรายละเอียด"
          ></TextInput>

          <Text style={styles.textHead3}>
            10. Critical Behavior Inventory (CBI) 1-9
          </Text>

          <View style={styles.containerSec}>
            {/* {accounts.map((account, index) => {
              return (
                <View key={account.accNumber}>
                  <Text style={{ marginVertical: 10, paddingLeft: 8 }}>
                    {account.accNumber}
                  </Text>
                  <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                    <RadioForm
                      radio_props={radio_BBS}
                      formHorizontal={true}
                      initial={-1}
                      offPress={(item) => this.onChange(index, item)}
                    />
                  </View>
                </View>
              );
            })} */}
            {inputradio10}
          </View>

          <Text style={styles.textHead3}>11. Other/อื่นๆ</Text>
          <View style={styles.containerSec}>
            {accounts1.map((account, index) => {
              return (
                <View key={account.accNumber}>
                  <Text style={{ marginVertical: 10, paddingLeft: 8 }}>
                    {account.accNumber}
                  </Text>
                  <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                    <RadioForm
                      radio_props={radio_BBS}
                      formHorizontal={true}
                      initial={-1}
                      offPress={(item) => this.onChange1(index, item)}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.textHead3}>12. Other/อื่นๆ</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            onChangeText={(text) => this.setState({ Otherbbs12: text })}
          ></TextInput>
        </View>
      );
    } else {
      return null;
    }
  };

  formSWA = () => {
    if (this.state.radioformSWA) {
      return (
        <View>
          <View style={styles.textHead4}>
            <Text style={{ fontSize: 20, color: "#1E90FF", marginBottom: 10 }}>
              Stop Work Authority/Responsibility (SWA/SWR)
              การใช้อำนาจในการหยุดงาน
            </Text>
          </View>

          <Divider style={styles.lineunder1}></Divider>

          <Text style={styles.textHead3}>
            7. Stop Work Opportunity and Why อธิบายเหตุการณ์
            การกระทำหรือสภาพการณ์ที่ไม่ปลอดภัยและการใช้อำนาจในการหยุดงาน
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            value={this.state.dataform2[0].answer_detail}
            // onChangeText={(text) => this.setState({ StopWork: text })}
          ></TextInput>

          <Text style={styles.textHead3}>
            8. Possible Consequences, if DO NOT STOP
            ผลกระทบต่อเนื่องที่อาจเกิดขึ้นตามมาถ้าไม่ใช้อำนาจในการหยุดงาน
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            value={this.state.dataform2[1].answer_detail}
            // onChangeText={(text) => this.setState({ Possible: text })}
          ></TextInput>

          <Text style={styles.textHead3}>
            9. Comments/Responses คำชี้แจงหรือการแก้ไข
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            value={this.state.dataform2[2].answer_detail}
            // onChangeText={(text) => this.setState({ Comments: text })}
          ></TextInput>

          <Text style={styles.textHead3}>
            10. Was work activity resumed? มีการทำงานต่อ
            หลังจากหาแนวทางแก้ไขแล้วหรือไม่
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <Picker
            mode="dropdown"
            iosIcon={
              <Icon
                name="angle-down"
                style={{ width: "8%", paddingHorizontal: 2 }}
              />
            }
            style={styles.inputLightStyle}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            enabled={false}
            selectedValue={this.state.dataform2[3].answer_id}
            // onValueChange={(itemValue) => this.setState({ Waswork: itemValue })}
            textStyle={{ fontSize: 14 }}
            placeholder="โปรดเลือกตำตอบ"
          >
            <Picker.Item label={"Yes"} value={0} />
            <Picker.Item label={"No"} value={1} />
            <Picker.Item label={"N/A"} value={2} />
          </Picker>

          <Text style={styles.textHead3}>
            11. Was SWA valid (real problem)? การหยุดงานครั้งนี้ถูกต้องแล้ว
            (มีปัญหาจริงหรือไม่)
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <Picker
            mode="dropdown"
            iosIcon={
              <Icon
                name="angle-down"
                style={{ width: "8%", paddingHorizontal: 2 }}
              />
            }
            style={styles.inputLightStyle}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            enabled={false}
            selectedValue={this.state.dataform2[4].answer_id}
            // onValueChange={(itemValue) => this.setState({ WasSWA: itemValue })}
            textStyle={{ fontSize: 14 }}
            placeholder="โปรดเลือกตำตอบ"
          >
            <Picker.Item label={"Yes"} value={0} />
            <Picker.Item label={"No"} value={1} />
            <Picker.Item label={"N/A"} value={2} />
          </Picker>

          <Text style={styles.textHead3}>
            12. Was issue resolved? มีการแก้ปัญหาเรียบร้อยแล้ว
            (หรือต้องทำในระยะยาว)
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <Picker
            mode="dropdown"
            iosIcon={
              <Icon
                name="angle-down"
                style={{ width: "8%", paddingHorizontal: 2 }}
              />
            }
            style={styles.inputLightStyle}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            enabled={false}
            selectedValue={this.state.dataform2[5].answer_id}
            // onValueChange={(itemValue) =>
            //   this.setState({ Wasissue: itemValue })
            // }
            textStyle={{ fontSize: 14 }}
            placeholder="โปรดเลือกตำตอบ"
          >
            <Picker.Item label={"Yes"} value={0} />
            <Picker.Item label={"No"} value={1} />
            <Picker.Item label={"N/A"} value={2} />
          </Picker>

          <Text style={styles.textHead3}>
            13. Is follow up action required? if yes explain:
            มีการติดตามผลหรือไม่ โปรดอธิบาย ในข้อถัดไป
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <Picker
            mode="dropdown"
            iosIcon={
              <Icon
                name="angle-down"
                style={{ width: "8%", paddingHorizontal: 2 }}
              />
            }
            style={styles.inputLightStyle}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            enabled={false}
            selectedValue={this.state.dataform2[6].answer_id}
            // onValueChange={(itemValue) =>
            //   this.setState({ Isfollow: itemValue })
            // }
            textStyle={{ fontSize: 14 }}
            placeholder="โปรดเลือกตำตอบ"
          >
            <Picker.Item label={"Yes"} value={0} />
            <Picker.Item label={"No"} value={1} />
            <Picker.Item label={"N/A"} value={2} />
          </Picker>

          <Text style={styles.textHead3}>
            14. Actions detail Explanation
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            // onChangeText={(text) => this.setState({ Actions: text })}
            value={this.state.dataform2[7].answer_detail}
          ></TextInput>
        </View>
      );
    } else {
      return null;
    }
  };

  formHazOb = () => {
    if (this.state.radioformHazOb) {
      return (
        <View>
          <View style={styles.textHead4}>
            <Text style={{ fontSize: 20, color: "#1E90FF", marginBottom: 10 }}>
              HazOb & Near Miss Report
            </Text>
          </View>

          <Divider style={styles.lineunder1}></Divider>

          <Text style={styles.textHead3}>
            8. Category ประเภท
            <Text style={{ color: "red" }}> *</Text>
          </Text>

          {/* checkbox */}
          {/* ส่วนของ Category  */}

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory}
              offPress={() => {
                this.setState({
                  CheckboxCategory: !this.state.CheckboxCategory,
                });
              }}
              style={styles.checkbox}
              title={"Aviation Operations / ปฏิบัติการอากาศยาน"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory1}
              offPress={() => {
                this.setState({
                  CheckboxCategory1: !this.state.CheckboxCategory1,
                });
              }}
              style={styles.checkbox}
              title={"Environment Impact / ผลกระทบต่อสิ่งแวดล้อม"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory2}
              offPress={() => {
                this.setState({
                  CheckboxCategory2: !this.state.CheckboxCategory2,
                });
              }}
              style={styles.checkbox}
              title={"Fire & Explosion / ไฟไหม้และการระเบิด"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory3}
              offPress={() => {
                this.setState({
                  CheckboxCategory3: !this.state.CheckboxCategory3,
                });
              }}
              style={styles.checkbox}
              title={"Injury & Illness / บาดเจ็บและการเจ็บป่วย"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory4}
              offPress={() => {
                this.setState({
                  CheckboxCategory4: !this.state.CheckboxCategory4,
                });
              }}
              style={styles.checkbox}
              title={"Marine Accident / อุบัติเหตุทางทะเล"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory5}
              offPress={() => {
                this.setState({
                  CheckboxCategory5: !this.state.CheckboxCategory5,
                });
              }}
              style={styles.checkbox}
              title={"Motor Vehicle Crash / อุบัติเหตุด้านยานพาหนะ"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory6}
              offPress={() => {
                this.setState({
                  CheckboxCategory6: !this.state.CheckboxCategory6,
                });
              }}
              style={styles.checkbox}
              title={"Policy, Law Non-Compliance / การละเมิดกฎฯ"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory7}
              offPress={() => {
                this.setState({
                  CheckboxCategory7: !this.state.CheckboxCategory7,
                });
              }}
              style={styles.checkbox}
              title={"Process Upset / ระบบกระบวนการผลิตขัดข้อง"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory8}
              offPress={() => {
                this.setState({
                  CheckboxCategory8: !this.state.CheckboxCategory8,
                });
              }}
              style={styles.checkbox}
              title={"Property, Equipment Damage / ทรัพย์สินเสียหาย"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory9}
              offPress={() => {
                this.setState({
                  CheckboxCategory9: !this.state.CheckboxCategory9,
                });
              }}
              style={styles.checkbox}
              title={"Splill or Release / การรั่วไหลของก๊าซและของแหลว"}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxCategory10}
              offPress={() => {
                this.setState({
                  CheckboxCategory10: !this.state.CheckboxCategory10,
                });
              }}
              style={styles.checkbox}
              title={"Other"}
            />
            {this.state.CheckboxCategory10 == true && (
              <View>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="อธิบายรายละเอียด"
                  onChangeText={(text) => this.setState({ Otherhazob1: text })}
                ></TextInput>
              </View>
            )}
          </View>

          {/* ส่วนของ Related   */}

          <Text style={styles.textHead3}>
            9. Related with / เกี่ยวเนื่องกัน
            <Text style={{ color: "red" }}> *</Text>
          </Text>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated}
              offPress={() => {
                this.setState({ CheckboxRelated: !this.state.CheckboxRelated });
              }}
              style={styles.checkbox}
              title={"Chemical / สารเคมี"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated1}
              offPress={() => {
                this.setState({
                  CheckboxRelated1: !this.state.CheckboxRelated1,
                });
              }}
              style={styles.checkbox}
              title={"Electrical / ไฟฟ้า"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated2}
              offPress={() => {
                this.setState({
                  CheckboxRelated2: !this.state.CheckboxRelated2,
                });
              }}
              style={styles.checkbox}
              title={"Fall Hazard Management / การจัดการงานบนที่สูง"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated3}
              offPress={() => {
                this.setState({
                  CheckboxRelated3: !this.state.CheckboxRelated3,
                });
              }}
              style={styles.checkbox}
              title={"Houskeeping / ความเป็นระเบียบเรียบร้อย"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated4}
              offPress={() => {
                this.setState({
                  CheckboxRelated4: !this.state.CheckboxRelated4,
                });
              }}
              style={styles.checkbox}
              title={"Hygiene, Sanitation / อนามัยและความสะอาด"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated5}
              offPress={() => {
                this.setState({
                  CheckboxRelated5: !this.state.CheckboxRelated5,
                });
              }}
              style={styles.checkbox}
              title={"Labeling, Marketing & Signs / ฉลาก, เครื่องหมาย ป้าย"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated6}
              offPress={() => {
                this.setState({
                  CheckboxRelated6: !this.state.CheckboxRelated6,
                });
              }}
              style={styles.checkbox}
              title={"Lifting Appliances / อุปกรณ์การยก, ผูก และเคลื่อนย้าย"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated7}
              offPress={() => {
                this.setState({
                  CheckboxRelated7: !this.state.CheckboxRelated7,
                });
              }}
              style={styles.checkbox}
              title={"Mechanical / เครื่องจักรกล"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated8}
              offPress={() => {
                this.setState({
                  CheckboxRelated8: !this.state.CheckboxRelated8,
                });
              }}
              style={styles.checkbox}
              title={"PPE / อุปกรณ์ป้องกันอันตรายส่วนบุคคล"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated9}
              offPress={() => {
                this.setState({
                  CheckboxRelated9: !this.state.CheckboxRelated9,
                });
              }}
              style={styles.checkbox}
              title={"Safety, Life Saving Eqipment / อุปกรณ์ความปลอดภัย"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated10}
              offPress={() => {
                this.setState({
                  CheckboxRelated10: !this.state.CheckboxRelated10,
                });
              }}
              style={styles.checkbox}
              title={"Vehicles / ยานพาหนะ, การขนส่ง"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated11}
              offPress={() => {
                this.setState({
                  CheckboxRelated11: !this.state.CheckboxRelated11,
                });
              }}
              style={styles.checkbox}
              title={"Welding, Burning / งานเชื่อม. งานเกี่ยวกับความร้อน"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated12}
              offPress={() => {
                this.setState({
                  CheckboxRelated12: !this.state.CheckboxRelated12,
                });
              }}
              style={styles.checkbox}
              title={"Walking Surface, Railings, Ladders / ทางเดิน, บันได"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.CheckboxRelated13}
              offPress={() => {
                this.setState({
                  CheckboxRelated13: !this.state.CheckboxRelated13,
                });
              }}
              style={styles.checkbox}
              title={"Other"}
            />
            {this.state.CheckboxRelated13 == true && (
              <View>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="อธิบายรายละเอียด"
                  onChangeText={(text) => this.setState({ Otherhazob2: text })}
                ></TextInput>
              </View>
            )}
          </View>

          <Text style={styles.textHead3}>
            10. Description / รายละเอียด- โปรดอธิบาย
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            onChangeText={(text) => this.setState({ Description: text })}
          ></TextInput>

          <Text style={styles.textHead3}>
            11. Severity - Impact ความรุนแรง - ผลกระทบ
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <RadioForm
            radio_props={radio_severity}
            initial={-1}
            offPress={(itemValue) => this.setState({ Severity: itemValue })}
          />

          <Text style={styles.textHead3}>
            12. Probability - Likelihood โอกาสที่จะเกิด
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <RadioForm
            radio_props={radio_probability}
            initial={-1}
            offPress={(itemValue) => this.setState({ Probability: itemValue })}
          />

          <Text style={styles.textHead3}>
            13. Does the same situation exist in other area?
            มีโอกาสพบความเสี่ยงดังกล่าวในสถานที่อื่นหรือไม่?
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.checkboxYesorNo}
              offPress={() => {
                this.setState({ checkboxYesorNo: !this.state.checkboxYesorNo });
              }}
              style={styles.checkbox}
              title={"No / ไม่ใช่"}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.checkboxYesorNo1}
              offPress={() => {
                this.setState({
                  checkboxYesorNo1: !this.state.checkboxYesorNo1,
                });
              }}
              style={styles.checkbox}
              title={
                "Yes / ใช่ (Please provide detail / กรุณาระบุรายละเอียดใน Other"
              }
            />
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.checkboxYesorNo2}
              offPress={() => {
                this.setState({
                  checkboxYesorNo2: !this.state.checkboxYesorNo2,
                });
              }}
              style={styles.checkbox}
              title={"Other"}
            />
            {this.state.checkboxYesorNo2 == true && (
              <View>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="อธิบายรายละเอียด"
                  offPress={(text) => this.setState({ Otherhazob3: text })}
                ></TextInput>
              </View>
            )}
          </View>

          <Text style={styles.textHead3}>
            14. Recommendation Action / ข้อแนะนำเพื่อการแก้ไข
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="อธิบายรายละเอียด"
            onChangeText={(text) => this.setState({ Recommendation: text })}
          ></TextInput>
        </View>
      );
    }
  };

  render() {
    const state = this.state;
    let formType = this.state.inputFormType;
    const radioData = this.state;
    // console.log(formType);
    console.log(this.state.dataform3);
    var formRadio = [];
    if (formType != null) {
      formType -= 1;
      formRadio.push(
        <RadioForm
          radio_props={radio_props}
          initial={formType}
          // onPress = {() => this.radiocheck(formType)}
        />
      );
    }

    return (
      <ScrollView styles={styles.background}>
        <View style={styles.textHead1}>
          <Text style={{ fontSize: 20, color: "#1E90FF" }}>แบบฟอร์มรายงาน</Text>
        </View>

        <View>
          <Text style={styles.textHead2}>
            Exterran BBS/SWA/HazOb/Near Miss report
          </Text>
        </View>

        <View style={styles.containerSec1}>
          <Text style={{ fontSize: 15 ,color: "#1E90FF" }}>
            Observer/ข้อมูลผู้รายงาน
          </Text>

          <Divider style={styles.lineunder} />
          <View>
            <Text style={styles.textHead3}>Fullname :</Text>
            <TextInput
              style={styles.inputStyle1}
              value={this.state.firstname + " " + this.state.lastname}
            />
          </View>
          <Divider style={styles.lineunder} />

          <Text style={styles.textHead3}>Position :</Text>
          <TextInput style={styles.inputStyle1} value={this.state.position} />

          <Divider style={styles.lineunder} />

          <Text style={styles.textHead3}>Dept :</Text>
          <TextInput style={styles.inputStyle1} value={this.state.dept} />

          <Divider style={styles.lineunder} />

          <Text style={styles.textHead3}>Staff's residence :</Text>
          <TextInput style={styles.inputStyle1} value={this.state.staff} />

          <Divider style={styles.lineunder} />

          <Text style={styles.textHead3}>Work location :</Text>
          <TextInput style={styles.inputStyle1} value={this.state.worklo} />

          <Divider style={styles.lineunder} />
        </View>

        <View style={styles.containerSec1}>
          <Text style={styles.textHead3}>
            Observation date / วันที่พบเห็น{" "}
            <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity offPress={() => this.showDatePicker("start")}>
            <View style={styles.inputDate}>
              <Text style={{ paddingLeft: 10 }}>{this.state.startDate}</Text>
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            onChange={(e) => {
              console.log(e);
            }}
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          <View>
            <Text>
              Location/สถานที่พบเหตุการณ์{" "}
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Picker
              mode="dropdown"
              iosIcon={
                <Icon
                  name="angle-down"
                  style={{ width: "8%", paddingHorizontal: 2 }}
                />
              }
              style={styles.inputLightStyle}
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.location}
              onValueChange={(itemValue) =>
                this.setState({ location: itemValue })
              }
              textStyle={{ fontSize: 14 }}
              placeholder="เลือกสถานที่พบเหตุการณ์"
            >
              {this.state.selectlocation.map((item, index) => {
                return (
                  <Picker.Item
                    label={item.work_location_ot}
                    value={item.id}
                    key={index}
                  />
                );
              })}
            </Picker>
          </View>

          <View>
            <Text>
              Sub Location/สถานที่พบเหตุการณ์{" "}
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Picker
              mode="dropdown"
              iosIcon={
                <Icon
                  name="angle-down"
                  style={{ width: "8%", paddingHorizontal: 2 }}
                />
              }
              style={styles.inputLightStyle}
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.sublocation}
              onValueChange={(text) => this.setState({ sublocation: text })}
              textStyle={{ fontSize: 14 }}
              placeholder="เลือกสถานที่พบเหตุการณ์"
            >
              {this.state.selectlocationSub.map((item, index) => {
                return (
                  <Picker.Item
                    label={item.loca_ot_sub_title}
                    value={item.id}
                    key={index}
                  />
                );
              })}
            </Picker>
          </View>

          <View
            style={{
              marginVertical: 40,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
            <Avatar.Icon icon="file" size={30} style={styles.arrowDownStyle} />
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
          </View>

          <View style={styles.textHead4}>
            <Text style={{ fontSize: 20, color: "#007aff" }}>
              Report Type ประเภทของรายงาน
            </Text>
          </View>

          <Divider style={{ marginTop: 20 }}></Divider>

          {/* <ส่วน Radio ที่1> */}

          <Text style={styles.textHead3}>
            What kind of report/ประเภทของรายงาน{" "}
            <Text style={{ color: "red" }}> *</Text>
          </Text>
          <View>
            {/* <RadioForm
              radio_props={radio_props}
              initial={formType}
              onPress={(item) => {
                this.radiocheck(item);
              }}
            /> */}
            {formRadio}
          </View>

          {/* ส่วน BBS */}
          {this.formBBS()}

          {/* ส่วนของ SWA */}
          {this.formSWA()}

          {/* ส่วนของ HazOb */}
          {this.formHazOb()}
        </View>
        <Button style={styles.submitButton} offPress={() => this.onPressSend()}>
          <Text style={{ color: "#fff" }}>Submit</Text>
        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },

  lineunder: {
    paddingBottom: 1,
    marginTop: 1,
    marginBottom: 1,
  },

  lineunder1: {
    paddingBottom: 1,
    marginTop: 5,
    marginBottom: 20,
  },

  textHead1: {
    marginTop: 10,
    marginLeft: 20,
    // marginVertical: 50,
  },
  textHead2: {
    marginTop: 20,
    marginLeft: 20,
  },

  textHead3: {
    marginTop: 20,
    marginBottom: 5,
  },
  textHead4: {
    marginTop: 20,
    // marginBottom: 20,
  },

  containerSec1: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
  },

  inputDate: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 18,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
    borderColor: "#007aff",
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 10,
    // height: HEIGHT / 15,
    height: HEIGHT / 18,
    width: "100%",
    marginTop: 10,
    // paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#007aff",
  },
  dropdownstyle: {
    borderRadius: 10,
    borderColor: "#007aff",
    color: "black",
  },
  inputStyle: {
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 5,
    height: HEIGHT / 25,
    // marginTop: 10,
    paddingLeft: 10,
    // marginBottom: 5,
  },
  // ตาราง
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  wrapper: {
    flexDirection: "row",
  },
  title: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  row: {
    height: 40,
  },
  text: {
    textAlign: "center",
  },
  text1: {
    paddingLeft: 10,
  },

  checkboxContainer: {
    // flexDirection: "row",
    margin: 5,
    justifyContent: "flex-start",
  },
  checkbox: {
    alignSelf: "center",
    borderRadius: 1,
    height: HEIGHT / 40,
    width: "6%",
    // padding: 20,
    margin: 8,
  },

  containerSec: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  container1: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
  },
  head: { height: 40, backgroundColor: "orange" },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: "#2ecc71" },
  row: { height: 28 },
  // text: { textAlign: "center" },

  inputStyle1: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },

  submitButton: {
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#3BB54A",
    marginTop: 20,
    marginBottom: 50,
  },
});

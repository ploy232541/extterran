import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  AsyncStorage,
  Alert,
  ActivityIndicator
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Icon, Textarea, Picker } from "native-base";
import { httpClient } from "../../core/HttpClient";
import AwesomeAlert from "react-native-awesome-alerts";
var decode = require("decode-html");
import HTML from "react-native-render-html";
import RadioButtonRN from "radio-buttons-react-native";
import Icon1 from "react-native-vector-icons/FontAwesome";
import { RadioButton } from "react-native-paper";
import { StackActions } from "@react-navigation/native";
import { CheckBox } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown-v2";
import Sortable from "./Sortable";
import { useNavigation } from "@react-navigation/native";

class PostTestCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      timeStr: "00:00:00",
      loading: false,
      showAlert: null,
      showAlertSave: null,
      question: [],
      currentQuiz: [],
      choice: [],
      countExam: 0,
      temp_all: [],
      last_ques: 0,

      ///STATE คำตอบ
      question_id: null,
      single_choice: null,
      many_choice: [],
      lecture: "",
      answer_sort: null,

      selected: [],
      dropdownVal: null
    };
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const { course_id, type } = this.props.route.params;
      const user_id = await AsyncStorage.getItem("userId");
      const res = await AsyncStorage.getItem("language");
      if (res === "EN") {
        this.setState({ lang: "EN" });
      } else {
        this.setState({ lang: "TH" });
      }
      const params = { course_id: course_id, user_id: user_id, type: type };
      await httpClient
        .post(`/CourseQuestion/index`, params)
        .then(async (response) => {
          const result = response.data;
          if (result != null) {
            this.time_test_start(result.time_up);
            this.setState({
              question: result.question,
              currentQuiz: result.currentQuiz,
              choice: result.choice,
              countExam: result.countExam,
              temp_all: result.temp_all,
              last_ques: result.last_ques,
              loading: false
            });
            this.checked_box_old();
            this.input_textarea();
          } else {
            this.setState({
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async Save(evnt) {
    try {
      const { navigation } = this.props;
      this.setState({ loading: true, showAlert: false, showAlertSave: false });
      const { course_id, type } = this.props.route.params;
      const user_id = await AsyncStorage.getItem("userId");
      const {
        single_choice,
        many_choice,
        lecture,
        dropdownVal,
        answer_sort,
        question_id,
        currentQuiz,
        question
      } = this.state;
      const params = {
        course_id: course_id,
        user_id: user_id,
        type: type,
        actionEvnt: evnt,
        Choice: single_choice,
        Many_choice: many_choice,
        Lecture: lecture,
        DropdownVal: dropdownVal,
        Answer_sort: answer_sort,
        Question_id: question_id,
        idx_now: currentQuiz.number
      };
      await httpClient
        .post(`/CourseQuestion/index`, params)
        .then(async (response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              loading: false
            });
            for (i in question) {
              value = question[i];
              if (value.ques_type != 3) {
                navigation.dispatch(
                  StackActions.replace("ResultCourseTest", { result: result })
                );
              } else {
                navigation.dispatch(
                  StackActions.replace("LearnScreen", {
                    course_id: result.course_id
                  })
                ); //ข้อสอบบรรยาย
              }
            }
          } else {
            this.setState({
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async Next(evnt) {
    try {
      this.setState({ loading: true });
      const { course_id, type } = this.props.route.params;
      const user_id = await AsyncStorage.getItem("userId");
      const {
        single_choice,
        many_choice,
        lecture,
        dropdownVal,
        answer_sort,
        question_id,
        currentQuiz
      } = this.state;
      const params = {
        course_id: course_id,
        user_id: user_id,
        type: type,
        actionEvnt: evnt,
        Choice: single_choice,
        Many_choice: many_choice,
        Lecture: lecture,
        DropdownVal: dropdownVal,
        Answer_sort: answer_sort,
        Question_id: question_id,
        idx_now: currentQuiz.number
      };
      await httpClient
        .post(`/CourseQuestion/index`, params)
        .then(async (response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              question: result.question,
              currentQuiz: result.currentQuiz,
              choice: result.choice,
              countExam: result.countExam,
              temp_all: result.temp_all,
              last_ques: result.last_ques,
              loading: false,
              many_choice: [],
              lecture: "",
              dropdownVal: null
            });
            this.checked_box_old();
            this.input_textarea();
          } else {
            this.setState({
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async Back(evnt) {
    try {
      this.setState({ loading: true });
      const { course_id, type } = this.props.route.params;
      const user_id = await AsyncStorage.getItem("userId");
      const {
        single_choice,
        many_choice,
        lecture,
        dropdownVal,
        answer_sort,
        question_id,
        currentQuiz
      } = this.state;
      const params = {
        course_id: course_id,
        user_id: user_id,
        type: type,
        actionEvnt: evnt,
        Choice: single_choice,
        Many_choice: many_choice,
        Lecture: lecture,
        DropdownVal: dropdownVal,
        Answer_sort: answer_sort,
        Question_id: question_id,
        idx_now: currentQuiz.number
      };
      await httpClient
        .post(`/CourseQuestion/index`, params)
        .then(async (response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              question: result.question,
              currentQuiz: result.currentQuiz,
              choice: result.choice,
              countExam: result.countExam,
              temp_all: result.temp_all,
              last_ques: result.last_ques,
              loading: false,
              many_choice: [],
              lecture: "",
              dropdownVal: null
            });
            this.checked_box_old();
            this.input_textarea();
          } else {
            this.setState({
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async Number_box(number) {
    try {
      this.setState({ loading: true });
      const { course_id, type } = this.props.route.params;
      const user_id = await AsyncStorage.getItem("userId");
      const {
        single_choice,
        many_choice,
        lecture,
        dropdownVal,
        answer_sort,
        question_id,
        currentQuiz
      } = this.state;
      const params = {
        course_id: course_id,
        user_id: user_id,
        type: type,
        actionEvnt: number,
        Choice: single_choice,
        Many_choice: many_choice,
        Lecture: lecture,
        DropdownVal: dropdownVal,
        Answer_sort: answer_sort,
        Question_id: question_id
      };
      await httpClient
        .post(`/CourseQuestion/index`, params)
        .then(async (response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              question: result.question,
              currentQuiz: result.currentQuiz,
              choice: result.choice,
              countExam: result.countExam,
              temp_all: result.temp_all,
              last_ques: result.last_ques,
              loading: false,
              many_choice: [],
              lecture: "",
              dropdownVal: null
            });
            this.checked_box_old();
            this.input_textarea();
          } else {
            this.setState({
              loading: false
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  }

  Single_choice(e) {
    this.setState({ single_choice: e.value, question_id: e.ques_id });
  }

  showAlert() {
    this.setState({
      showAlert: true
    });
  }

  Button_Save = () => {
    this.setState({
      showAlertSave: true
    });
  };

  time_test_start(time_down) {
    var count = time_down;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var timeStr = "";

    this.interval = setInterval(async () => {
      count--;
      hours = Math.floor(count / 3600);
      minutes = Math.floor((count - hours * 3600) / 60);
      seconds = count - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      timeStr = hours + ":" + minutes + ":" + seconds;

      if (seconds == 0) {
        const { course_id, type } = this.props.route.params;
        const user_id = await AsyncStorage.getItem("userId");
        const params = {
          course_id: course_id,
          user_id: user_id,
          type: type,
          time: count
        };

        httpClient
          .post(`/CourseQuestion/SaveTimeExam`, params)
          .then(async (response) => {
            const result = response.data;
            if (result != null) {
              //console.log(result)
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (count == 0) {
        this.setState({ timeStr: "00:00:00" });
        this.Save.bind(this, "save");
        this.showAlert(); /////// ยังต้องกด ok เพื่อ save
        clearInterval(this.interval);
      } else if (count > 1) {
        this.setState({ timeStr: timeStr });
      } else {
        this.setState({ timeStr: "00:00:00" });
      }
    }, 1000);
  }

  removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
      nbsp: " ",
      amp: "&",
      quot: '"',
      lt: "<",
      gt: ">"
    };
    return encodedString
      .replace(translate_re, function (match, entity) {
        return translate[entity];
      })
      .replace(/&#(\d+);/gi, function (match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
      });
  }

  isItemChecked(choice_id) {
    return this.state.many_choice.indexOf(choice_id.toString()) > -1;
  }

  manageToggle = (evt, choice_id, ques_id) => {
    if (this.isItemChecked(choice_id)) {
      this.setState({
        many_choice: this.state.many_choice.filter(
          (i) => i !== choice_id.toString()
        )
      });
    } else {
      this.setState({
        many_choice: [...this.state.many_choice, choice_id.toString()],
        question_id: ques_id
      });
    }
  };

  checked_box_old = () => {
    const { currentQuiz, question } = this.state;
    for (i in question) {
      value = question[i];
      if (value.ques_type == 1) {
        if (currentQuiz.ans_id != null) {
          let arr_ans_id = JSON.parse(currentQuiz.ans_id);
          this.setState({
            many_choice: arr_ans_id,
            question_id: currentQuiz.ques_id
          });
        }
      }
    }
  };

  input_textarea = () => {
    const { currentQuiz, question } = this.state;
    for (i in question) {
      value = question[i];
      if (value.ques_type == 3) {
        if (currentQuiz.ans_id != null) {
          this.setState({
            lecture: currentQuiz.ans_id,
            question_id: currentQuiz.ques_id
          });
        }
      }
    }
  };

  dropdownArrayState = () => {
    this.setState({
      selected: [...this.state.selected, { choice_id: "" }]
    });
  };
  onValueChange(value, index) {
    if (this.state.selected.length > 0) {
      let sel = this.state.selected;
      let arr = [];
      for (i in sel) {
        val = sel[i];
        arr.push(i);
      }
      if (!arr.includes(index.toString())) {
        this.dropdownArrayState();
      }
    } else {
      this.dropdownArrayState();
    }
    this.state.selected[index].choice_id = value;
    this.setState({ selected: this.state.selected });

    if (this.state.selected.length > 0) {
      const { question, selected } = this.state;
      let arr_ = [];
      for (i in selected) {
        val = selected[i];
        arr_.push(val["choice_id"]);
      }
      this.setState({ dropdownVal: arr_ });
      for (i in question) {
        val = question[i];
        this.setState({ question_id: val.ques_id });
      }
    }
  }

  callBack = (choiceArray) => {
    const { currentQuiz } = this.state;
    this.setState({
      answer_sort: choiceArray,
      question_id: currentQuiz.ques_id
    });
  };

  render() {
    const {
      question,
      currentQuiz,
      choice,
      countExam,
      temp_all,
      last_ques,
      single_choice,
      many_choice
    } = this.state;
    const questionTypeArrayStrTH = [
      "",
      "เลือกได้หลายคำตอบ",
      "เลือกได้คำตอบเดียว",
      "คำตอบแบบบรรยาย",
      "คำตอบแบบจับคู่",
      "",
      "คำตอบแบบจัดเรียง"
    ];
    const questionTypeArrayStrEN = [
      "",
      "Choose multiple answers",
      "Choose an answer",
      "Narrative responses",
      "Matching answer",
      "",
      "Sorted answer"
    ];

    var arr_radio_props = [];
    if (currentQuiz.question) {
      let question_id = JSON.parse(currentQuiz.question);

      for (i in question_id) {
        let val_question_id = question_id[i];

        for (i in choice) {
          _value = choice[i];
          let choice_detail = this.removeTags(decode(_value.choice_detail));

          if (val_question_id == _value.choice_id) {
            arr_radio_props.push({
              label: choice_detail,
              value: _value.choice_id,
              ques_id: _value.ques_id
            });
          }
        }
      }
    }

    var index_choice;
    if (currentQuiz.ans_id != null) {
      const str1 = currentQuiz.ans_id.toString();
      const str2 = str1.replace('["', "");
      const old_choice = str2.replace('"]', "");

      if (arr_radio_props.length > 0) {
        for (let i = 0; i < arr_radio_props.length; i++) {
          arr_value = arr_radio_props[i];

          if (old_choice == arr_value.value) {
            index_choice = i + 1;
          }
        }
      }
    }

    for (x in question) {
      _q = question[x];
      if (_q.ques_type == 4) {
        const thaichar = [
          "ก",
          "ข",
          "ค",
          "ง",
          "จ",
          "ฉ",
          "ช",
          "ซ",
          "ฌ",
          "ญ",
          "ฐ",
          "ฑ",
          "ฒ",
          "ณ",
          "ด",
          "ต",
          "ถ",
          "ท",
          "ธ",
          "น",
          "บ",
          "ป",
          "ผ",
          "ฝ",
          "พ",
          "ฟ",
          "ภ",
          "ม",
          "ย",
          "ร",
          "ล",
          "ว",
          "ศ",
          "ษ",
          "ส",
          "ห",
          "ฬ",
          "อ",
          "ฮ"
        ];
        var countchoice = 1;
        if (currentQuiz.question != null) {
          let choiceData = JSON.parse(currentQuiz.question);
          var Type4Answer_text = [];
          var Type4Answer_id = [];
          var choice_dropdownVal_1 = [];
          for (i in choiceData) {
            val_choice = choiceData[i];

            for (i in choice) {
              _choice = choice[i];
              if (
                val_choice == _choice.choice_id &&
                _choice.choice_answer == 2
              ) {
                choice_dropdownVal_1.push(
                  thaichar[countchoice - 1] +
                    ". " +
                    this.removeTags(decode(_choice.choice_detail))
                );
                Type4Answer_text[countchoice - 1] = thaichar[countchoice - 1];
                Type4Answer_id[countchoice - 1] = _choice.choice_id;
                countchoice++;
              }
            }
          }

          var choice_dropdownVal_2 = [];
          for (i in choiceData) {
            val_choice = choiceData[i];
            for (i in choice) {
              _choice = choice[i];
              if (
                val_choice == _choice.choice_id &&
                _choice.choice_answer == 1
              ) {
                choice_dropdownVal_2.push(
                  this.removeTags(decode(_choice.choice_detail))
                );
              }
            }
          }

          var data_dropdown = [];
          for (key in Type4Answer_text) {
            val = Type4Answer_text[key];
            data_dropdown.push({
              value: Type4Answer_id[key],
              label: val
            });
          }
        }
      }
    }

    if (this.state.loading) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "#ffb3b3",
              alignItems: "center",
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 5
            }}
          >
            <Text style={{ color: "#b30000", fontSize: 18, margin: 10 }}>
              {this.state.lang === "EN"
                ? "Time allowed"
                : "เวลาในการทำแบบทดสอบ"}{" "}
              : {this.state.timeStr}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginLeft: 30,
              marginRight: 30,
              marginTop: 20
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18 }}>
                {this.state.lang === "EN" ? "Question" : "การทำข้อสอบ"}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={{ fontSize: 18, color: "red" }}>
                {countExam}/{temp_all.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#002b80",
              height: 3,
              marginLeft: 25,
              marginRight: 25
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              marginLeft: 28,
              marginRight: 20,
              marginTop: 10,
              marginBottom: 20
            }}
          >
            {temp_all.map((val_temp) => {
              // console.log(val_temp.ques_id)
              for (i in question) {
                value = question[i];

                if (value.ques_id == val_temp.ques_id) {
                  return (
                    <TouchableOpacity
                      onPress={this.Number_box.bind(this, val_temp.number)}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderWidth: 1,
                          borderColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#1a8cff",
                          borderRadius: 5
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{val_temp.number}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                } else {
                  return val_temp.status == "1" ? (
                    <TouchableOpacity
                      onPress={this.Number_box.bind(this, val_temp.number)}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderWidth: 1,
                          borderColor: "#bfbfbf",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#248f24",
                          borderRadius: 5
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{val_temp.number}</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={this.Number_box.bind(this, val_temp.number)}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderWidth: 1,
                          borderColor: "#bfbfbf",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                          borderRadius: 5
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{val_temp.number}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              }
            })}
          </View>

          {question.map((data) => {
            return (
              <View>
                <View style={{ marginLeft: 20, marginRight: 20 }}>
                  <Text style={{ fontSize: 16 }}>
                    {this.state.lang === "EN"
                      ? `Exams: ${questionTypeArrayStrEN[data.ques_type]}`
                      : `ข้อสอบแบบ: ${questionTypeArrayStrTH[data.ques_type]}`}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: "#bfbfbf",
                    borderRadius: 5
                  }}
                >
                  <View
                    style={{ flex: 1, flexDirection: "row", marginTop: 20 }}
                  >
                    <View style={{ marginLeft: 15, marginRight: 5 }}>
                      <Text style={{ fontSize: 17 }}>
                        {currentQuiz.number}.
                      </Text>
                    </View>
                    <View style={{ paddingRight: 40 }}>
                      <HTML
                        html={decode(decode(data.ques_title))}
                        onLinkPress={(event, href) => {
                          Linking.openURL(href);
                        }}
                        ignoredStyles={["width", "height"]}
                        tagsStyles={{
                          img: { flex: 1, alignSelf: "center", width: 200 }
                        }}
                      />
                      {/* <Text style={{fontSize: 16}}>
                                { this.removeTags(this.decodeEntities(data.ques_title)) }
                             </Text> */}
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 30,
                      marginTop: 5,
                      marginBottom: 30,
                      marginRight: 40
                    }}
                  >
                    {
                      // ==================================== ques_type 1 แบบหลายคำตอบเดียว===================================
                      data.ques_type == 1 ? (
                        choice.map((data) => {
                          return (
                            <CheckBox
                              title={this.removeTags(
                                decode(data.choice_detail)
                              )}
                              checked={this.isItemChecked(data.choice_id)}
                              onPress={(evt) =>
                                this.manageToggle(
                                  evt,
                                  data.choice_id,
                                  data.ques_id
                                )
                              }
                            />
                          );
                        })
                      ) : // ==================================== ques_type 2 แบบคำตอบเดียว===================================
                      data.ques_type == 2 ? (
                        <RadioButtonRN
                          data={arr_radio_props}
                          initial={index_choice}
                          selectedBtn={(e) => this.Single_choice(e)}
                        />
                      ) : // ==================================== ques_type 3 แบบคำตอบบรรยาย===================================
                      data.ques_type == 3 ? (
                        <Textarea
                          style={{ height: 150, marginTop: 15 }}
                          bordered
                          placeholder={
                            this.state.lang === "EN"
                              ? "Write an answer"
                              : "เขียนคำตอบ"
                          }
                          onChangeText={(text) =>
                            this.setState({
                              lecture: text,
                              question_id: data.ques_id
                            })
                          }
                          value={this.state.lecture}
                        />
                      ) : // ==================================== ques_type 4 แบบคำตอบจับคู่===================================
                      data.ques_type == 4 ? (
                        <View>
                          <Text style={{ marginTop: 10, color: "#000066" }}>
                            {this.state.lang === "EN" ? "Part 1" : "ส่วนที่ 1"}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              marginBottom: 5,
                              backgroundColor: "#d9d9d9",
                              width: "100%"
                            }}
                          />
                          {choice_dropdownVal_1.map((data1) => {
                            return <Text> {data1}</Text>;
                          })}
                          <Text style={{ marginTop: 10, color: "#000066" }}>
                            {this.state.lang === "EN" ? "Part 2" : "ส่วนที่ 2"}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#d9d9d9",
                              width: "100%"
                            }}
                          />
                          {currentQuiz.ans_id != null
                            ? choice_dropdownVal_2.map((data2, key) => {
                                return (
                                  <View
                                    key={key}
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      marginTop: 10,
                                      alignItems: "center"
                                    }}
                                  >
                                    <View style={{ flex: 0.5, marginTop: -20 }}>
                                      {JSON.parse(currentQuiz.ans_id).map(
                                        (value, index) => {
                                          return key == index ? (
                                            <Dropdown
                                              placeholder={
                                                this.state.lang === "EN"
                                                  ? "Selecet"
                                                  : "เลือก"
                                              }
                                              value={value}
                                              onChangeText={(txt) => {
                                                this.onValueChange(txt, key);
                                              }}
                                              labelFontSize={14}
                                              data={data_dropdown}
                                              style={{ color: "#404040" }}
                                            />
                                          ) : (
                                            <View />
                                          );
                                        }
                                      )}
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                      <Text>{data2}</Text>
                                    </View>
                                  </View>
                                );
                              })
                            : choice_dropdownVal_2.map((data2, key) => {
                                return (
                                  <View
                                    key={key}
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      marginTop: 10,
                                      alignItems: "center"
                                    }}
                                  >
                                    <View style={{ flex: 0.5, marginTop: -20 }}>
                                      <Dropdown
                                        placeholder={
                                          this.state.lang === "EN"
                                            ? "Selecet"
                                            : "เลือก"
                                        }
                                        onChangeText={(txt) => {
                                          this.onValueChange(txt, key);
                                        }}
                                        labelFontSize={14}
                                        data={data_dropdown}
                                        style={{ color: "#404040" }}
                                      />
                                    </View>

                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                      <Text>{data2}</Text>
                                    </View>
                                  </View>
                                );
                              })}
                        </View>
                      ) : // ==================================== ques_type 6 แบบคำตอบจัดเรียง===================================
                      data.ques_type == 6 ? (
                        <Sortable
                          data_choice={choice}
                          data_currentQuiz={currentQuiz}
                          _callBack={this.callBack}
                        />
                      ) : (
                        <View />
                      )
                    }
                  </View>
                </View>
              </View>
            );
          })}

          {last_ques != 0 ? (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 40,
                  marginRight: 40,
                  marginBottom: 40,
                  alignSelf: "center"
                }}
              >
                <View style={{ flex: 1 }}>
                  <Button
                    iconLeft
                    light
                    style={{
                      alignSelf: "center",
                      borderRadius: 5,
                      borderColor: "#002b80",
                      borderWidth: 1,
                      backgroundColor: "#fff",
                      height: 50,
                      width: 100
                    }}
                    onPress={this.Back.bind(this, "previous")}
                  >
                    <Icon name="arrow-back" />
                    <Text style={{ marginLeft: 10, marginRight: 20 }}>
                      {this.state.lang === "EN" ? "Back" : "ย้อนกลับ"}
                    </Text>
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    iconRight
                    light
                    style={{
                      alignSelf: "center",
                      borderRadius: 5,
                      borderColor: "#002b80",
                      borderWidth: 1,
                      backgroundColor: "#fff",
                      height: 50,
                      width: 100
                    }}
                    onPress={this.Next.bind(this, "next")}
                  >
                    <Text style={{ marginLeft: 20, marginRight: 10 }}>
                      {this.state.lang === "EN" ? "Next" : "ถัดไป"}
                    </Text>
                    <Icon name="arrow-forward" style={{ marginRight: 20 }} />
                  </Button>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 40,
                  marginRight: 40,
                  marginBottom: 40,
                  alignSelf: "center"
                }}
              >
                <Button
                  iconLeft
                  style={{
                    alignSelf: "center",
                    borderRadius: 5,
                    backgroundColor: "#248f24",
                    borderWidth: 1,
                    height: 50,
                    width: 100
                  }}
                  onPress={this.Button_Save}
                >
                  <Icon1
                    name="send"
                    size={20}
                    style={{ marginLeft: 10, color: "#fff" }}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      marginRight: 20,
                      color: "#fff",
                      fontWeight: "bold"
                    }}
                  >
                    {this.state.lang === "EN" ? "Send" : "ส่งคำตอบ"}
                  </Text>
                </Button>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                marginLeft: 40,
                marginRight: 40,
                marginBottom: 40,
                alignSelf: "center"
              }}
            >
              <View style={{ flex: 1 }}>
                <Button
                  iconLeft
                  light
                  style={{
                    alignSelf: "center",
                    borderRadius: 5,
                    borderColor: "#002b80",
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    height: 50,
                    width: 100
                  }}
                  onPress={this.Back.bind(this, "previous")}
                >
                  <Icon name="arrow-back" />
                  <Text style={{ marginLeft: 10, marginRight: 20 }}>
                    {this.state.lang === "EN" ? "Back" : "ย้อนกลับ"}
                  </Text>
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  iconRight
                  light
                  style={{
                    alignSelf: "center",
                    borderRadius: 5,
                    borderColor: "#002b80",
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    height: 50,
                    width: 100
                  }}
                  onPress={this.Next.bind(this, "next")}
                >
                  <Text style={{ marginLeft: 20, marginRight: 10 }}>
                    {this.state.lang === "EN" ? "Next" : "ถัดไป"}
                  </Text>
                  <Icon name="arrow-forward" style={{ marginRight: 20 }} />
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          icon="closecircle"
          title={this.state.lang === "EN" ? "Alert" : "แจ้งเตือน"}
          message={this.state.lang === "EN" ? "Time is over." : "หมดเวลา"}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          confirmText={this.state.lang === "EN" ? "OK" : "ตกลง"}
          confirmButtonColor="#0099ff"
          onConfirmPressed={this.Save.bind(this, "save")}
        />
        <AwesomeAlert
          show={this.state.showAlertSave}
          showProgress={false}
          icon="questioncircle"
          title={this.state.lang === "EN" ? "Alert" : "แจ้งเตือน"}
          message={
            this.state.lang === "EN"
              ? "Confirm Send answer."
              : "ยืนยัน ส่งคำตอบ"
          }
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          showCancelButton={true}
          confirmText={this.state.lang === "EN" ? "OK" : "ตกลง"}
          confirmButtonColor="#0099ff"
          onConfirmPressed={this.Save.bind(this, "save")}
          cancelText={this.state.lang === "EN" ? "CENCEL" : "ยกเลิก"}
          cancelButtonColor="#b30000"
          onCancelPressed={() => this.setState({ showAlertSave: false })}
        />
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <PostTestCourse {...props} navigation={navigation} />;
}

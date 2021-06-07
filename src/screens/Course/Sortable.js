import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
var decode = require('decode-html');

class Sortable extends Component {
  state = {
    data: [],
    choice: this.props.data_choice,
    currentQuiz: this.props.data_currentQuiz,
    choice_Arr: null,
  };

  componentDidMount() {
    let {choice, currentQuiz} = this.state;
    if(currentQuiz.ans_id != null){
      let choiceData = JSON.parse(currentQuiz.ans_id)
          var _choice_Arr = []
          for(i in choiceData){
            val_choice = choiceData[i]
            for(i in choice){
                _choice = choice[i]
              if(val_choice == _choice.choice_id){
                _choice_Arr.push({key: val_choice.toString(), label: this.removeTags(decode(_choice.choice_detail))})
                }
            }
          }
          this.setState({data: [..._choice_Arr].map((value, index) => ({
            key: value.key.toString(), 
            label: value.label,
          }))})
    }else{
      if(currentQuiz.question != null){
        let choiceData = JSON.parse(currentQuiz.question);
          var _choice_Arr = []
            for(i in choiceData){
              val_choice = choiceData[i]
              for(i in choice){
                  _choice = choice[i]
                if(val_choice == _choice.choice_id){
                  _choice_Arr.push({key: _choice.choice_id.toString(), label: this.removeTags(decode(_choice.choice_detail))})
                  }
              }
            }
            this.setState({data: [..._choice_Arr].map((value, index) => ({
              key: value.key.toString(), 
              label: value.label,
            }))})
      }
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.data !== this.state.data){
      let choiceArray = []
      for(i in this.state.data){
         value = this.state.data[i]
         choiceArray.push(value.key)
      }
      this.props._callBack(choiceArray)
     }
  }

  removeTags(str) { 
    if ((str===null) || (str==='')) 
        return false; 
    else
        str = str.toString(); 
    return str.replace( /(<([^>]+)>)/ig, ''); 
  }  

  renderItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: 40,
          marginBottom: 5,
          backgroundColor: isActive ? "#99ccff" : '#e6e6e6',
          borderRadius: 5,
          alignItems: "flex-start",
          justifyContent: "center"
        }}
        onLongPress={drag}
      >
        <Text
          style={{
            color: "black",
            fontSize: 16,
            marginLeft: 10
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {data} = this.state
    return (
      <View style={{ flex: 1 }}>
        <DraggableFlatList
        style={{marginTop: 15}}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => this.setState({ data })}
        />
      </View>
    );
  }
}

export default Sortable;
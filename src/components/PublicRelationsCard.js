import React from "react";
import { Card, Text, Paragraph } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, Linking } from "react-native";
var decode = require('decode-html');
import moment from 'moment';
import { useNavigation } from "@react-navigation/native"
import { colors } from "react-native-elements";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const PublicRelationsCard = (props) => {
  const navigation = useNavigation()
  const checkLing = (item) =>{
    navigation.navigate('NewsDetailScreen', {title: item.cms_title, imgSrc: item.cms_picture, date: item.update_date,
      details: item.cms_detail, firstname: item.firstname, firstname_en: item.firstname_en, lang: props.lang, link: item.cms_link})
  }
  return (
    <TouchableOpacity 
    onPress={() => checkLing(props.item)}
    >
      <Card style={{ height: HEIGHT / 8, margin: 2}}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Image style={styles.imageStyle} source={{ uri: props.item.cms_picture != null ? props.item.cms_picture : 'http://smartxlearning.com/themes/template/img/newspaper.jpg'}} />
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text style={styles.titleStyle}>{props.item.cms_title}</Text>
            {
              props.item.cms_short_title != '' ? 
              <Paragraph numberOfLines={2} style={styles.contentStyle}>{props.item.cms_short_title}</Paragraph>
              :
              null
            }
                <View style={{flex: 1, marginTop: 5}}>
                  <Text style={{fontSize: 10, marginBottom: 5}}>
                    {moment(props.item.update_date).format('DD/MM/YYYY')}
                  </Text>
                   <Text style={{fontSize: 10}}>
                    {props.lang === "EN" ? `${props.item.views} views` : `ผู้ชม ${props.item.views} ครั้ง`}
                  </Text>
                </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 14,
  },
  contentStyle: {
    fontSize: 12,
  },
  imageStyle: {
      width: WIDTH / 2.4,
      height: HEIGHT / 8,
      borderRadius: 4
  }
});

export default PublicRelationsCard;

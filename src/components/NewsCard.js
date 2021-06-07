import React from "react"
import { View, StyleSheet, TouchableOpacity, Dimensions} from "react-native"
import { Card, Paragraph, Title } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"

const HEIGHT = Dimensions.get('window').height;

const NewsCard = ({ title, imgSrc, short_title, details, firstname, firstname_en, lang, link, date }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={ () => navigation.navigate('NewsDetailScreen',{title: title, imgSrc: imgSrc, date: date,
            details: details, firstname: firstname, firstname_en: firstname_en, lang: lang, link: link})}>
            <Card style={styles.cardStyle}>
                <Card.Cover source={{ uri: imgSrc != null ? imgSrc : 'http://smartxlearning.com/themes/template/img/newspaper.jpg' }} style={{height:HEIGHT*0.125, width:'100%'}}/>
                <Card.Content>
                    <Title style={{fontSize: 16}} numberOfLines={1}>{title}</Title>
                    <Paragraph numberOfLines={3}>{short_title}</Paragraph>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardStyle:{

    }
})

export default NewsCard

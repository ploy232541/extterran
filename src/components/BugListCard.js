import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Button} from "react-native"
import { Title } from "react-native-paper"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"

const BugListCard = ({ title, details, date }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('QandADetailScreen', {title:title, details:details, date:date})}>
            <View style={styles.container}>
                <Text
                    style={{
                        marginLeft: 10,
                        marginVertical: 10,
                        fontWeight: "bold",
                    }}>
                    {title}
                </Text>
                <View style={{ flexDirection: "row", marginHorizontal: 10, marginVertical: 10, alignItems:'center' }}>
                    <Icon
                        name='md-calendar'
                        size={30}
                    />
                    <Text style={{marginLeft:10}}>{date}</Text>
                    <View style={{backgroundColor:'#4267B2', width:'20%', borderRadius:5, alignItems:'center',right:0, position:'absolute'}}><Text style={{color:'white'}}>ตอบกลับ</Text></View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
        backgroundColor: "#DBDBDB",
        borderWidth: 1,
        borderColor: "#CCCCCC",
    },
})

export default BugListCard

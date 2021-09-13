import * as React from "react"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Title, Card } from "react-native-paper"
import { View, Text, StyleSheet, TextInput } from "react-native"
import { Dimensions } from "react-native"

const HEIGHT = Dimensions.get("window").height
const QandADetailScreen = (props) => {
    const title = props.route.params.title
    const date = props.route.params.date
    const details = props.route.params.details
    return (
        <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        {/* <ScrollView style={{ backgroundColor: "white", flex: 1 }}> */}
            <View style={styles.container}>
                <Card style={{ marginVertical: 40 }}>
                    <Card.Title
                        title={title}
                        style={{ backgroundColor: "#DBDBDB" }}
                    />
                    <Card.Content style={{ alignItems: "center" }}>
                        <Text style={{ marginVertical: 20, fontSize: 18 }}>
                            {title}
                        </Text>
                        <Text style={{ marginHorizontal: 20 }}>{details}</Text>
                        <View
                            style={{
                                backgroundColor: "#DBDBDB",
                                marginHorizontal: 10,
                                width: "100%",
                                alignItems: "center",
                                height:HEIGHT*0.2,
                                marginVertical:20
                            }}>
                            <View style={{ width: "90%", marginTop:20, marginBottom:5, flex:1}}>
                                <TextInput
                                    multiline={true}
                                    style={{
                                        backgroundColor: "white",
                                        borderColor: "#CCCCCC",
                                        borderWidth: 1,
                                        height: HEIGHT *0.125,
                                    }}
                                />
                                <View
                                style={{
                                    backgroundColor: "#4267B2",
                                    width: "20%",
                                    borderRadius: 5,
                                    alignItems: "center",
                                    position: "absolute",
                                    bottom: 0,
                                    right:0,
                                    marginVertical:5,
                                    flex:1
                                }}>
                                  <TouchableOpacity>
                                <Text style={{ color: "white" }}>ตอบกลับ</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                            
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
    },
})

export default QandADetailScreen

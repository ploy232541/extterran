import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../../styles/SliderEntry.style';
// import ImageView from "react-native-image-viewing";
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';


export default class SliderEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleShowImage: false,
            uriImage: null,
        }
    }

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
            //   containerStyle={{flex: 1}}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={{backgroundColor: '#fff'}}
            />
        );
    }

    render () {
        const { data: { title, subtitle, illustration }, even } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        const images = [{
            url: this.state.uriImage,
        }]

        if(this.state.uriImage != null){
            return (
                <Modal 
                    visible={this.state.visibleShowImage} transparent={true} >
                        <ImageViewer 
                            imageUrls={images}
                        />
                         <TouchableOpacity
                            style={{position: 'absolute', top: Platform.OS == 'ios' ? 35 : 35, right: 35}}
                            onPress={() => this.setState({visibleShowImage: false, uriImage: null})}
                            >
                          <Icon name="md-close" size={25} style={{color: '#fff'}} />
                        </TouchableOpacity>
               </Modal>
            )

        }

        return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.slideInnerContainer}
                style={{flex: 1, width: '100%', height: 500, borderWidth: 5, borderColor: '#e6e6e6'}}
                onPress={() => this.setState({uriImage: illustration, visibleShowImage: true})}
                >
                    {/* <View style={styles.shadow} /> */}
                    {/* <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}> */}
                        { this.image }
                        {/* <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} /> */}
                    {/* </View> */}
                    {/* <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                        { uppercaseTitle }
                        <Text
                        style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                        numberOfLines={2}
                        >
                            { subtitle }
                        </Text>
                    </View> */}
                </TouchableOpacity>
        );
    }
}
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import axios from 'axios'
import join from 'url-join'

var isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config)=> {
    if (!isAbsoluteURLRegex.test(config.url)) {
        const jwtToken = await AsyncStorage.getItem("token")        
        if (jwtToken != null) {
            config.headers = { 'x-access-token': jwtToken }
        }
        // config.url = join('http://smartxlearning.com:3000', config.url); //server 
        //config.url = join('https://warm-savannah-75708.herokuapp.com', config.url); //server heroku
        config.url = join('http://192.168.1.38:3000', config.url); //localhost office bws
        // config.url = join('http://192.168.1.39:3000', config.url); //localhost home 
    }
    return config;
});

export const httpClient = axios 
import {getBaseURL} from "../actions/managers/pageManager.js";

export const getServletURL = (servlet) => {
    return getBaseURL() + servlet;
}

export const getServiceURL = (service) => {
    const RESTAPI_URL = "http://localhost:4567/E199API/"
    return RESTAPI_URL + service;
}

export function getCallResult(xhr) {
    const {success, message, data} = getCallResultData(xhr);
    return {success, message}
}

export function getCallResultData(xhr) {
    let success = false;
    let message = null;
    let data = null;
    if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        success = true;
        message = response.message;
        data = response.data;
        console.log(message);
    } else if (xhr.status !== 200) {
        console.log("Error occurred");
        const response = JSON.parse(xhr.responseText);
        message = response.message;
        console.log('Message:', message);
        success = false;
    }
    console.log("result: ");
    console.log(success);
    console.log(message);
    console.log(data);
    return {success, message, data}
}


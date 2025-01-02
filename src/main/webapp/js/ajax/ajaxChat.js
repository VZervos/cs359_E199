import {getCallResult, getCallResultData, getServiceURL} from "./ajax.js";

export function getChatTypes(username) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('chatTypes?username=' + username));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}
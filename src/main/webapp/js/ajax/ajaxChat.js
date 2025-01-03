import {getCallResult, getCallResultData, getServiceURL} from "./ajax.js";

export function getChatTypes(username, incidentId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('chatTypes?username=' + username + '&incidentId=' + incidentId));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getMessages(incidentId, chattype = "public") {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('messages/' + incidentId + '?chattype=' + chattype));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function sendMessage(incidentId, message, sender = "admin", recipient = "public") {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResultData(xhr);
            resolve({success, message});
        };

        xhr.open('POST', getServiceURL('message'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "incident_id": incidentId,
            "message": message,
            "sender": sender,
            "recipient": recipient
        }));
    });
}
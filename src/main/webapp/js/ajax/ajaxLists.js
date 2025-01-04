import {getCallResultData, getServiceURL} from "./ajax.js";

export function getIncidentsList(type = "all", status = "all") {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('incidents/' + type + '/' + status));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getUsersList() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('users'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getVolunteersList(type = "all") {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('volunteers/' + type));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getParticipantsList(incidentId = "all") {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('participants/' + incidentId));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getMessagesList() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message, data} = getCallResultData(xhr);
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('messages/all/all'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}
import {getServiceURL} from "./ajax.js";

export function getIncidentsList() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                if (message) {
                    console.log('Message:', message);
                } else {
                    message = "Service execution success";
                    success = true;
                    data = response.data;
                    console.log(data);
                }
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
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('incidents/all/all'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getVolunteersList() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                if (message) {
                    console.log('Message:', message);
                } else {
                    message = "Service execution success";
                    success = true;
                    data = response.data;
                    console.log(data);
                }
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
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('volunteers'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getParticipantsList() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                if (message) {
                    console.log('Message:', message);
                } else {
                    message = "Service execution success";
                    success = true;
                    data = response.data;
                    console.log(data);
                }
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
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('participants'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function getMessagesList() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                if (message) {
                    console.log('Message:', message);
                } else {
                    message = "Service execution success";
                    success = true;
                    data = response.data;
                    console.log(data);
                }
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
            resolve({success, message, data});
        };

        xhr.open('GET', getServiceURL('messages/all/all'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}
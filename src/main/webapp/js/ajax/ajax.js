// const urlEncodedData = Object.keys(dataObj)
//     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataObj[key]))
//     .join('&');


import {getBaseURL} from "../pages/pageManagement.js";

const getServletURL = (servlet) => {
    return getBaseURL() + servlet;
}

const getServiceURL = (service) => {
    const RESTAPI_URL = "http://localhost:4567/E199API/"
    return RESTAPI_URL + service;
}

export function registerUser(userData) {
    const dataObj = typeof userData === "string" ? JSON.parse(userData) : userData;

    console.log(userData);

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Registered");
            const response = JSON.parse(xhr.responseText);
            console.log('Message:', response.message);
            console.log(JSON.stringify(dataObj));
        } else if (xhr.status !== 200) {
            console.log("Error occurred");
            const response = JSON.parse(xhr.responseText);
            console.log('Message:', response.message);
            console.log(dataObj);
        }
    };

    xhr.open('POST', getServletURL('RegisterUser'));
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(dataObj));
}

export function loginUser(usertype, user) {
    console.log(user)

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let response;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Login success");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
            }
            resolve(response);
        };

        xhr.open('POST', getServletURL('LoginUser'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "usertype": usertype,
            "user": user
        }));
    });
}

export function retrieveUser(usertype, username, password) {
    console.log(username)
    console.log(password);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let user = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Registered");
                const response = JSON.parse(xhr.responseText);
                success = true;
                message = response.message;
                user = response.user;
                console.log('Message:', response.message);
            } else if (xhr.readyState === 4 && xhr.status === 403) {
                console.log("Invalid credentials or user not founds");
                const response = JSON.parse(xhr.responseText);
                success = false;
                message = response.message;
                console.log('Message:', response.message);
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                success = false;
                message = response.message;
                console.log('Message:', response.message);
            }
            resolve({success, message, user});
        };

        xhr.open('POST', getServletURL('RetrieveUser'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "usertype": usertype,
            "username": username,
            "password": password
        }));
    });
}

export function checkForDuplicate(attribute, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Available");
                console.log('Message:', xhr.responseText);
                success = true;
                message = xhr.responseText;
            } else if (xhr.readyState === 4 && xhr.status === 409) {
                console.log("Not available");
                console.log('Message:', xhr.responseText);
                success = false;
                message = xhr.responseText;
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                console.log('Message:', xhr.responseText);
                success = false;
                message = xhr.responseText;
            }
            console.log("result: ");
            console.log(success);
            console.log(message);
            resolve({success, message});
        };

        console.log(attribute);
        console.log(value);
        switch (attribute) {
            case "username":
                console.log("username");
                xhr.open('GET', getServletURL('IsUsernameAvailable?username=' + value));
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            case "email":
                console.log("email");
                xhr.open('GET', getServletURL('IsEmailAvailable?email=' + value));
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            case "telephone":
                console.log("telephone");
                xhr.open('GET', getServletURL('IsTelephoneAvailable?telephone=' + value));
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            default:
                console.log(attribute);
                resolve({
                    "success": true,
                    "message": "No duplicates were found for " + attribute
                });
        }
    });
}

export function updateInfoField(field, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Updated" + field);
                const response = JSON.parse(xhr.responseText);
                message = response.message;
                console.log('Message:', message);
                success = true;

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
            resolve({success, message});
        };

        xhr.open('POST', getServletURL('UpdateInfoField'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "field": field,
            "value": value
        }));
    });
}

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

export function updateIncidentStatus(incidentId, newStatus) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                success = true;
                message = response.message;
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
            resolve({success, message});
        };

        xhr.open('PUT', getServiceURL('incidentStatus/' + incidentId + '/' + newStatus));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

export function updateIncidentFieldValue(incidentId, field, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let success = false;
            let message = null;
            let data = null;
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                success = true;
                message = response.message;
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
            resolve({success, message});
        };

        xhr.open('PUT', getServiceURL('incidentFieldValue/' + incidentId ));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "field": field,
            "value": value
        }));
    });
}
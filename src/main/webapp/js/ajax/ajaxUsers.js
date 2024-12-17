import {getCallResult, getServletURL} from "./ajax.js";

export function registerUser(userData) {
    console.log(userData);

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Registered");
            const response = JSON.parse(xhr.responseText);
            console.log('Message:', response.message);
            console.log(JSON.stringify(userData));
        } else if (xhr.status !== 200) {
            console.log("Error occurred");
            const response = JSON.parse(xhr.responseText);
            console.log('Message:', response.message);
            console.log(userData);
        }
    };

    xhr.open('POST', getServletURL('RegisterUser'));
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(userData));
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

export function updateInfoField(usertype, field, value) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const {success, message} = getCallResult(xhr);
            resolve({success, message});
        };

        xhr.open('POST', getServletURL('UpdateInfoField'));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
            "usertype": usertype,
            "field": field,
            "value": value
        }));
    });
}
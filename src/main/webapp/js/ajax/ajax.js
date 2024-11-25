// const urlEncodedData = Object.keys(dataObj)
//     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataObj[key]))
//     .join('&');

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

    xhr.open('POST', '../RegisterUser');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(dataObj));
}

export function loginUser(user) {
    console.log(user)

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Login success");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
                console.log(JSON.stringify(dataObj));
            } else if (xhr.status !== 200) {
                console.log("Error occurred");
                const response = JSON.parse(xhr.responseText);
                console.log('Message:', response.message);
                console.log(dataObj);
            }
            resolve(response);
        };

        xhr.open('POST', '../loginUser');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(user));
    });
}

export function retrieveUser(username, password) {
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

        xhr.open('POST', '../RetrieveUser');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({
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
                xhr.open('GET', '../IsUsernameAvailable?username=' + value);
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            case "email":
                console.log("email");
                xhr.open('GET', '../IsEmailAvailable?email=' + value);
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            case "telephone":
                console.log("telephone");
                xhr.open('GET', '../IsTelephoneAvailable?telephone=' + value);
                xhr.setRequestHeader('Content-type', 'x-www-form-urlencoded');
                xhr.send();
                console.log("sent");
                break;
            default:
                return {
                    "success": false,
                    "message": "An unexpected error occurred"
                };
        }
    });
}

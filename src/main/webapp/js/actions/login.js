import {loginUser, retrieveUser} from "../ajax/ajax.js";

$(document).ready(() => {
    $('#loginButton').on('click', async (event) => {
        const username = $('#login-username');
        const password = $('#login-password');
        const credentialsCorrectnessCheckResult = await retrieveUser(username, password);
        if (credentialsCorrectnessCheckResult["success"]) {
            console.log("Logged in successfully!");
            await loginUser(credentialsCorrectnessCheckResult["user"]);
            window.location.href = '../../html/dashboard.html';
        } else {
            console.log("Login failed due to validation errors.");
            const loginResultMessage = $('#login_result_message');
            loginResultMessage.show();
            loginResultMessage.text(credentialsCorrectnessCheckResult["message"]);
            loginResultMessage.css("color", "red");
        }
    });

    $('#login_result_message').hide();
});


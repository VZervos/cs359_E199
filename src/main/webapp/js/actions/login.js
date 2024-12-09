import {loginUser, retrieveUser} from "../ajax/ajax.js";

import {openDashboard} from "../pages/pageManagement.js";

$(document).ready(() => {
    $('#loginButton').click(async (event) => {
        const username = $('#login-username');
        const password = $('#login-password');
        const credentialsCorrectnessCheckResult = await retrieveUser(username.val(), password.val());
        console.log(credentialsCorrectnessCheckResult);
        if (credentialsCorrectnessCheckResult["success"]) {
            console.log("Logged in successfully!");
            await loginUser(credentialsCorrectnessCheckResult["user"]);
            openDashboard("user");
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


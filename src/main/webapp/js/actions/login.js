import {openDashboard} from "../pages/pageManagement.js";
import {getRadioValue} from "../utility/utility.js";
import {loginUser, retrieveUser} from "../ajax/ajaxUsers.js";

$(document).ready(() => {
    $('#loginButton').click(async (event) => {
        const username = $('#login-username');
        const password = $('#login-password');
        const user_type = getRadioValue("type").toLowerCase();
        console.log(user_type);
        const credentialsCorrectnessCheckResult = await retrieveUser(user_type, username.val(), password.val());
        console.log(credentialsCorrectnessCheckResult);
        if (credentialsCorrectnessCheckResult["success"]) {
            console.log("Logged in successfully!");
            await loginUser(user_type, credentialsCorrectnessCheckResult["user"]);
            openDashboard(user_type);
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


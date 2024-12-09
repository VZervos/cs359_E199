import {loginUser, retrieveUser} from "../ajax/ajax.js";

import {openDashboard} from "../pages/pageManagement.js";
import {getRadioValue} from "../utility/utility.js";

$(document).ready(() => {

    const retrieveUsertype = {
        "user": retrieveUser,
        // "volunteer": retrieveVolunteer,
        // "admin": retrieveAdmin,
    }

    const loginUsertype = {
        "user": loginUser,
        // "volunteer": loginVolunteer,
        // "admin": loginAdmin,
    }

    $('#loginButton').click(async (event) => {
        const username = $('#login-username');
        const password = $('#login-password');
        const usertype = getRadioValue("type").toLowerCase();
        console.log(usertype);
        const credentialsCorrectnessCheckResult = await retrieveUsertype[usertype](username.val(), password.val());
        console.log(credentialsCorrectnessCheckResult);
        if (credentialsCorrectnessCheckResult["success"]) {
            console.log("Logged in successfully!");
            await loginUsertype[usertype](credentialsCorrectnessCheckResult[usertype]);
            openDashboard(usertype);
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


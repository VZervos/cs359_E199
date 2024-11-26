
import {checkForDuplicate, updateInfoField} from "../ajax/ajax.js";
import {RESULT_STYLE} from "../utility/utility.js";

$(document).ready(() => {
    $('.update-info-button').click( async (event) => {
        const buttonClickedId = event.target.id;
        const infoField = buttonClickedId.split('-')[1];
        console.log(infoField);

        const infoFieldValue = $('#' + infoField).val();
        console.log(infoFieldValue);


        await checkForDuplicate(infoField, infoFieldValue).then(async result => {
            console.log("Promise result:", result);
            const isAvailable = result["success"];
            const message = result["message"];
            const valueAvailabilityMessage = $('#' + infoField + '_availability');

            if (isAvailable) {
                const updateResult = await updateInfoField(infoField, infoFieldValue);
                console.log(updateResult);
                const success = updateResult["success"];
                const message = updateResult["message"];
                valueAvailabilityMessage.css("color", RESULT_STYLE[success]);
                valueAvailabilityMessage.text(message);
            } else {
                valueAvailabilityMessage.css("color", RESULT_STYLE[isAvailable]);
                valueAvailabilityMessage.text(message);
            }
        });


        // const credentialsCorrectnessCheckResult = await retrieveUser(username.val(), password.val());
        // console.log(credentialsCorrectnessCheckResult);
        // if (credentialsCorrectnessCheckResult["success"]) {
        //     console.log("Logged in successfully!");
        //     await loginUser(credentialsCorrectnessCheckResult["user"]);
        //     openDashboard();
        // } else {
        //     console.log("Login failed due to validation errors.");
        //     const loginResultMessage = $('#login_result_message');
        //     loginResultMessage.show();
        //     loginResultMessage.text(credentialsCorrectnessCheckResult["message"]);
        //     loginResultMessage.css("color", "red");
        // }
    });
});


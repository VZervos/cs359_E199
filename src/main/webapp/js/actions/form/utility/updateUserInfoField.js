import {setResultMessage} from "../../../utility/utility.js";
import verifyAddress from "../../../evaluation/evaluateAddress.js";
import verifyPassword from "../../../evaluation/evaluatePassword.js";
import {extractFormValues} from "../../../utility_actions/extractFormValues.js";
import {checkForDuplicate} from "../../../ajax/ajaxValidation.js";
import {updateInfoField} from "../../../ajax/ajaxUsers.js";

async function checkAddressValidity(invalidField, message) {
    const country = $('#country').val();
    const prefecture = $('#prefecture').val();
    const municipality = $('#municipality').val()
    const address = $('#address').val();
    if (!country || !prefecture || !municipality || !address || country === "" || prefecture === "") {
        invalidField = true;
        message = "Some address fields are empty."
    } else {
        invalidField = await verifyAddress()
    }
    return {invalidField, message};
}

async function updateInfo(invalidField, user_type, infoField, infoFieldValue, message, valueAvailabilityMessageId) {
    let success = false;
    if (!invalidField) {
        const result = await updateInfoField(user_type, infoField, infoFieldValue);
        console.log(result);
        success = result["success"];
        message = result["message"];
    }
    setResultMessage(valueAvailabilityMessageId, {success, message});
    return {success, message};
}

$(document).ready(() => {
    const updateForm = $('form');

    updateForm.on('submit', async (event) => {
        const form = updateForm[0];

        event.preventDefault();

        const isFormValid = form.checkValidity();
        console.log(isFormValid);
        console.log(event);
        console.log(event.target[1].id)
        const user_type = event.target.id.split('-')[1];
        const infoField = event.target.id.split('-')[2];

        console.log(infoField);

        const formValues = JSON.parse(extractFormValues("form-" + user_type + "-" + infoField));

        const infoFieldValue = formValues[infoField];
        console.log(infoFieldValue);


        await checkForDuplicate(infoField, infoFieldValue).then(async result => {
            console.log("Promise result:", result);
            const valueAvailabilityMessageId = infoField + '_availability';
            const isAvailable = result["success"];
            let message = result["message"];

            if (isAvailable) {
                message = '';
                let invalidField = null;
                if (infoField === "address") {
                    const __ret = await checkAddressValidity(invalidField, message);
                    invalidField = __ret.invalidField;
                    message = __ret.message;
                    if (!invalidField) {
                        for (const [field, value] of Object.entries(formValues)) {
                            const updateResult = await updateInfo(invalidField, user_type, field, value, message, valueAvailabilityMessageId);
                            if (updateResult["success"])
                                setResultMessage(
                                    valueAvailabilityMessageId,
                                    {
                                        success: updateResult["success"],
                                        message: "All address fields have been successfully updated"
                                    }
                                );
                            else break;
                        }
                    }
                    return
                } else if (infoField === "password") {
                    invalidField = verifyPassword();
                }
                await updateInfo(invalidField, user_type, infoField, infoFieldValue, message, valueAvailabilityMessageId);
            } else {
                setResultMessage(valueAvailabilityMessageId, {success: isAvailable, message});
            }
        });
    });
});


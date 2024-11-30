import {getAddress} from "../evaluation/evaluateAddress.js";

export function extractFormValues(formId) {
    const formData = {};
    const userType = $('input[name="type"]:checked').val();

    $('#' + formId + ' input, #' + formId + ' select, #' + formId + ' textarea').each(function () {
        const inputName = $(this).attr('name');
        const inputValue = $(this).val();

        if ($(this).is(':radio') || $(this).is(':checkbox')) {
            if ($(this).is(':checked')) {
                if (userType === "user" && $(this).closest('.fireman-field').length) {
                    return;
                }
                formData[inputName] = inputValue;
            }
        } else if (inputName && inputValue) {
            if (userType === "user" && $(this).closest('.fireman-field').length) {
                return;
            }
            formData[inputName] = inputValue;
        }
    });

    const address = getAddress();
    formData["lat"] = address["lat"];
    formData["lon"] = address["lon"];
    const jsonData = JSON.stringify(formData);
    $('#result').show();
    $('#json_result').text(jsonData);
    console.log(jsonData);
    return jsonData;
}
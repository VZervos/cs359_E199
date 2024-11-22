import {ErrorMessage} from "../utility/ErrorMessage.js";

const BIRTHDATE_FIELD_ID = "birthdate";

const ERROR_AGE_NOT_ELIGIBLE = "Your age is not eligible to become a fireman.";

let errorMessage = new ErrorMessage('age_fireman_error');

const verifyFiremanAge = () => {
    const birthDateField = $('#' + BIRTHDATE_FIELD_ID);

    if (!$('#type_fireman').is(':checked'))
        return null;

    const birthDate = new Date(birthDateField.val());
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (age < 15 || age > 55) {
        errorMessage.showError(ERROR_AGE_NOT_ELIGIBLE);
        return BIRTHDATE_FIELD_ID;
    }

    errorMessage.hideError()
    return null;
};

export default verifyFiremanAge;
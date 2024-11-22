import {ErrorMessage} from "../utility/ErrorMessage.js";

const STRONG_PASSWORD = "Strong";
const MEDIUM_PASSWORD = "Medium";
const WEAK_PASSWORD = "Weak";

const ERROR_PASSWORDS_DO_NOT_MATCH = 'Passwords do not match';
const ERROR_PASSWORD_HAS_INVALID_STRING = 'Password contains invalid string: ';
const ERROR_WEAK_PASSWORD = 'Password is weak';

const PASSWORD_STRENGTH_STYLE = {
    [STRONG_PASSWORD]: "green",
    [MEDIUM_PASSWORD]: "yellow",
    [WEAK_PASSWORD]: "red"
};

const PASSWORD_FIELD_ID = "password";

let current_password_strength = null;
const password = $('#' + PASSWORD_FIELD_ID);
const passwordVerification = $('#password_verification');
const errorMessage = new ErrorMessage("password_verification_error");

const isPasswordWeak = (password) => {
    const checkCharacters = (passwordCharacters, passwordLength) => {
        let characters = {};
        passwordCharacters.forEach(char => {
            if (characters[char]) {
                characters[char]++;
            } else {
                characters[char] = 1;
            }
        });

        for (let char of Object.keys(characters)) {
            if (characters[char] >= passwordLength / 2) {
                return true;
            }
        }
        return false;
    }
    const checkNumbers = (passwordCharacters, passwordLength) => {
        let numbers = 0;
        passwordCharacters.forEach(char => {
            if (char >= '0' && char <= '9') numbers++;
        });
        return numbers > passwordLength / 2;
    }

    const passwordCharacters = [...password];
    const passwordLength = password.length;

    return checkCharacters(passwordCharacters, passwordLength) || checkNumbers(passwordCharacters, passwordLength);
}

const isPasswordStrong = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLowercase && hasUppercase && hasSymbol && hasNumber;
}

const evaluatePasswordStrength = (password) => {
    if (isPasswordWeak(password)) {
        return WEAK_PASSWORD;
    } else if (isPasswordStrong(password)) {
        return STRONG_PASSWORD;
    } else {
        return MEDIUM_PASSWORD;
    }
}

function checkPasswordStrength() {
    const passwordStrengthMessage = $('#password_strength');
    const passwordStrength = evaluatePasswordStrength(password.val());
    current_password_strength = passwordStrength;
    passwordStrengthMessage.text(passwordStrength);
    passwordStrengthMessage.css("color", PASSWORD_STRENGTH_STYLE[passwordStrength]);
}

function isPasswordSafe(password) {
    const INVALID_STRINGS = ["fire", "fotia", "ethelontis", "volunteer"];
    for (const str of INVALID_STRINGS) {
        if (password.toLowerCase().includes(str)) {
            return ERROR_PASSWORD_HAS_INVALID_STRING + str;
        }
    }
    checkPasswordStrength();
    if (current_password_strength === WEAK_PASSWORD) {
        return ERROR_WEAK_PASSWORD;
    }
    return null;
}

const checkPasswordsMatch = (password, passwordVerification) => {
    if (password !== passwordVerification) {
        return ERROR_PASSWORDS_DO_NOT_MATCH;
    }
    return null;
}

function verifyPassword() {
    errorMessage.hideError();

    let error;
    if ((error = checkPasswordsMatch(password.val(), passwordVerification.val())) ||
        (error = isPasswordSafe(password.val()))) {
        errorMessage.showError(error);
        return PASSWORD_FIELD_ID;
    }

    errorMessage.hideError();
    return null;
};

$(document).ready(() => {
    password.on('input', () => {
        checkPasswordStrength();
    });
});

export default verifyPassword;

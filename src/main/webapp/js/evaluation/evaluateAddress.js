import {reverseGeocode} from "../maps/geocoding.js"
import {ErrorMessage} from "../utility/ErrorMessage.js";

const ERROR_SERVICE_ONLY_IN_CRETE = "Currently, the service is available only in Crete.";
const ERROR_INVALID_ADDRESS = "The address entered is invalid.";

let address = '';
let addressFullname = '';
let lat = 0, lon = 0;
let errorMessage = new ErrorMessage('address_error');

export const getAddress = () => {
    return {
        'address': address,
        'addressFullname': addressFullname,
        'lat': lat,
        'lon': lon,
    }
}

const extractAddress = (addressField, municipalityField, countryField) => {
    const addressName = addressField.val() || addressField.text();
    const municipality = municipalityField.val() || municipalityField.text();
    const country = countryField.val() || countryField.text();
    address = addressName + ", " + municipality + ", " + country;
}

export async function verifyAddress(addressField, municipalityField, countryField) {
    extractAddress(addressField, municipalityField, countryField);
    console.log(address);
    return verifyFulladdress(address);
}

export async function verifyFulladdress(fulladdress) {
    address = fulladdress;
    console.log(address);
    const response = await reverseGeocode(address);

    if (!response || Object.entries(response).length === 0) {
        addressFullname = '';
        lat = 0;
        lon = 0;
        errorMessage.showError(ERROR_INVALID_ADDRESS);
        return "address";
    } else if (!response[0].display_name.includes("Region of Crete")) {
        errorMessage.showError(ERROR_SERVICE_ONLY_IN_CRETE);
        return "address";
    } else {
        const addressInfo = response[0];
        addressFullname = addressInfo.display_name;
        lat = addressInfo.lat;
        lon = addressInfo.lon;
        errorMessage.hideError(errorMessage);
        return null;
    }
}

export default verifyAddress;

import {reverseGeocode} from "../maps/geocoding.js"
import {ErrorMessage} from "../utility/ErrorMessage.js";

const ADDRESS_FIELD_ID = "address";

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

const extractAddress = () => {
    const addressName = $('#' + ADDRESS_FIELD_ID).val();
    const municipality = $('#municipality').val();
    const country = $('#country').val();
    address = addressName + ", " + municipality + ", " + country;
}

export async function verifyAddress() {
    extractAddress();
    const response = await reverseGeocode(address);

    if (!response || Object.entries(response).length === 0) {
        addressFullname = '';
        lat = 0;
        lon = 0;
        errorMessage.showError(ERROR_INVALID_ADDRESS);
        return ADDRESS_FIELD_ID;
    } else if (!response[0].display_name.includes("Region of Crete")) {
        errorMessage.showError(ERROR_SERVICE_ONLY_IN_CRETE);
        return ADDRESS_FIELD_ID;
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

import {AddressMap} from "../AddressMap.js";

$(document).ready(function () {
    const mapDiv = $('#formMap');
    const mapButton = $('#showAddressOnMap');
    const addressField = $('#address');
    const municipalityField = $('#municipality');
    const countryField = $('#country');
    const map = new AddressMap('formMap', mapDiv, mapButton, addressField, municipalityField, countryField);

    mapButton.click(async function () {
        await map.updateMap(true)
    });

    addressField.on('change', async () => await map.updateMap(false));
    municipalityField.on('change', async () => await map.updateMap(false));
    countryField.on('change', async () => await map.updateMap(false));


    map.hideMap(mapDiv, mapButton);
});



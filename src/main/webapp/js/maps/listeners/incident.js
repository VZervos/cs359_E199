import {AddressMap} from "../AddressMap.js";

$(document).ready(function () {

    $(document).on('click', '.map-toggle-button', async function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];

        const incidentId = getIncidentIdFromEvent(event);
        const mapButton = $('#' + incidentId + "-showAddressOnMap");
        const map = new AddressMap(incidentId + "-map", $('#' + incidentId + "-map"), mapButton, $('#' + incidentId + '-address'), $('#' + incidentId + '-municipality'), $('#' + incidentId + '-country'))
        await map.updateMap(true, true, $('#' + incidentId + "-location").text());
        mapButton.hide();
    });
});



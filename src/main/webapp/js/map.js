import {getAddress, verifyAddress} from "./evaluateAddress.js"

const MESSAGE_SHOW_ADDRESS_ON_MAP = "Show Address on Map";
const MESSAGE_HIDE_MAP = "Hide map";

let MapShown = false;
let map;
let markers;

const toggleMap = () => MapShown = !MapShown;
const enableMap = () => MapShown = true;
const disableMap = () => MapShown = false;
const showMap = (mapDiv, mapButton) => {
    mapDiv.show();
    mapButton.html(MESSAGE_HIDE_MAP)
}
const hideMap = (mapDiv, mapButton) => {
    mapDiv.hide();
    mapButton.html(MESSAGE_SHOW_ADDRESS_ON_MAP);
}

const setPosition = (lat, lon) => {
    const fromProjection = new OpenLayers.Projection("EPSG:4326");
    const toProjection = new OpenLayers.Projection("EPSG:900913");

    return new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
}
const setMarker = (position, name) => {
    markers.clearMarkers();
    map.addLayer(markers);

    const mar = new OpenLayers.Marker(position);
    markers.addMarker(mar);
    mar.events.register('mousedown', mar, function (evt) {
        handler(position, name);
        OpenLayers.Event.stop(evt);
    });
}
const zoomAtPosition = (position) => {
    const zoom = 11;
    map.setCenter(position, zoom);
}

function handler(position, message) {
    const popup = new OpenLayers.Popup.FramedCloud(
        "Popup",
        position,
        null,
        message,
        null,
        true
    );

    map.addPopup(popup);
}

function setupMap() {
    const map = new OpenLayers.Map("map");

    const osmLayer = new OpenLayers.Layer.OSM();
    map.addLayer(osmLayer);

    markers = new OpenLayers.Layer.Markers("Markers");
    return map;
}

$(document).ready(function () {
    const mapDiv = $('#map');
    const mapButton = $('#showAddressOnMap');

    const updateMapView = (address) => {
        if (MapShown && address) {
            showMap(mapDiv, mapButton);
            const position = setPosition(address.lat, address.lon);
            if (!map) {
                map = setupMap();
            }
            setMarker(position, address.addressFullname);
            zoomAtPosition(position);
        } else {
            hideMap(mapDiv, mapButton);
        }
    }

    async function updateMap(toggleClicked) {
        const isAddressInvalid = await verifyAddress();

        if (!MapShown && !toggleClicked)
            return;

        let address = null;
        if (isAddressInvalid) {
            disableMap();
        } else {
            address = getAddress();
            if (toggleClicked) toggleMap();
            else enableMap();
        }

        updateMapView(address);
    }

    mapButton.click(async function () {
        await updateMap(true)
    });

    $('#address').on('change', async () => await updateMap(false));
    $('#municipality').on('change', async () => await updateMap(false));
    $('#country').on('change', async () => await updateMap(false));

    hideMap(mapDiv, mapButton);
});



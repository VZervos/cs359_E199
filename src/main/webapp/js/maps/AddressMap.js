import {getAddress, verifyAddress, verifyFulladdress} from "../evaluation/evaluateAddress.js"

const MESSAGE_SHOW_ADDRESS_ON_MAP = "Show address on map";
const MESSAGE_HIDE_MAP = "Hide map";

export class AddressMap {
    constructor(mapId, mapDiv, mapButton, addressField, municipalityField, countryField) {
        this.MapShown = false;
        this.mapId = mapId;
        this.mapDiv = mapDiv;
        this.markers;
        this.map;
        this.mapButton = mapButton;
        this.addressField = addressField;
        this.municipalityField = municipalityField;
        this.countryField = countryField;
        console.log("created");
        console.log(this.mapId);
        console.log(this.mapDiv);
    }

    toggleMap() {
        this.MapShown = !this.MapShown;
    }

    enableMap() {
        console.log("enabled map");
        this.MapShown = true;
    }

    disableMap() {
        this.MapShown = false;
    }

    showMap() {
        console.log(this.mapDiv);
        this.mapDiv.show();
        this.mapButton.html(MESSAGE_HIDE_MAP)
    }

    hideMap() {
        this.mapDiv.hide();
        this.mapButton.html(MESSAGE_SHOW_ADDRESS_ON_MAP);
    }


    setPosition(lat, lon) {
        const fromProjection = new OpenLayers.Projection("EPSG:4326");
        const toProjection = new OpenLayers.Projection("EPSG:900913");

        return new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    }

    setMarker(position, name) {
        this.markers.clearMarkers();
        const mar = new OpenLayers.Marker(position);
        this.markers.addMarker(mar);
        this.map.addLayer(this.markers);
        mar.events.register('mousedown', mar, function (evt) {
            this.handler(position, name);
            OpenLayers.Event.stop(evt);
        });
    }

    zoomAtPosition(position) {
        if (!this.map) {
            console.error("Map is not initialized. Initializing map.");
            this.map = this.setupMap();
        }

        this.mapDiv.css({width: "100%", height: "30em", display: "block"});
        this.map.updateSize();

        const zoom = 11;
        this.map.setCenter(position, zoom);
    }


    handler(position, message) {
        const popup = new OpenLayers.Popup.FramedCloud(
            "Popup",
            position,
            null,
            message,
            null,
            true
        );

        this.map.addPopup(popup);
    }


    setupMap() {
        if (this.map) {
            console.warn("Map already initialized.");
            return this.map;
        }

        const map = new OpenLayers.Map(this.mapId);
        const osmLayer = new OpenLayers.Layer.OSM();
        map.addLayer(osmLayer);
        this.markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(this.markers);

        this.map = map;
        return map;
    }


    updateMapView(address) {
        if (!this.MapShown || !address) {
            this.hideMap();
            return;
        }

        if (!this.map) {
            console.log("Initializing map for the first time.");
            this.map = this.setupMap();
        }

        const position = this.setPosition(address.lat, address.lon);
        this.setMarker(position, address.addressFullname);
        this.zoomAtPosition(position);
        this.showMap();
    }


    async updateMap(toggleClicked, show = false, fulladdress) {
        const isAddressInvalid = fulladdress ? await verifyFulladdress(fulladdress) : await verifyAddress(this.addressField, this.municipalityField, this.countryField);

        if (!this.MapShown && !toggleClicked)
            return;

        console.log(isAddressInvalid);
        let address = null;
        if (isAddressInvalid) {
            this.disableMap();
        } else {
            address = getAddress();
            console.log(address);
            console.log(this.map);
            if (toggleClicked && !show) this.toggleMap();
            else this.enableMap();
        }

        this.updateMapView(address);
        console.log(`Map Visibility: ${this.mapDiv.is(':visible')}, Width: ${this.mapDiv.width()}, Height: ${this.mapDiv.height()}`);
    }
}

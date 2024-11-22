// https://rapidapi.com/GeocodeSupport/api/forward-reverse-geocoding/playground/apiendpoint_75751c3c-7f39-4403-ac0b-d56c5a77da9b
const createRequest = (address) => {
    return {
        async: true,
        crossDomain: true,
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + address + '&accept-language=en&polygon_threshold=0.0',
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'c5cac16836msh0f66039d6eb11b8p1b9d6ejsn3c932cc5fbb4',
            'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
    }
};

export function reverseGeocode(address) {
    return $.ajax(createRequest(address)).then((response) => {
        return response;
    }).catch((error) => {
        console.error("Error during geocoding:", error);
        return null;
    });
}

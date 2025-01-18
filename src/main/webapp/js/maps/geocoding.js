// https://rapidapi.com/GeocodeSupport/api/forward-reverse-geocoding/playground/apiendpoint_75751c3c-7f39-4403-ac0b-d56c5a77da9b
const X_RAPIDAPI_KEY = 'c5cac16836msh0f66039d6eb11b8p1b9d6ejsn3c932cc5fbb4';

const createRequest = (address) => {
    return {
        async: true,
        crossDomain: true,
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + address + '&accept-language=en&polygon_threshold=0.0',
        method: 'GET',
        headers: {
            'x-rapidapi-key': X_RAPIDAPI_KEY,
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

export function calculateDistance(origin, destinations) {
    return new Promise((resolve, reject) => {
        const data = null;
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        const processBatch = (batch, results = []) => {
            return new Promise((resolveBatch, rejectBatch) => {
                xhr.onreadystatechange = null;
                xhr.onerror = null;

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        try {
                            const response = JSON.parse(this.responseText);
                            console.log(response);

                            if (!response.distances || !response.distances[0]) {
                                throw new Error("Response does not contain valid distances data.");
                            }
                            if (!response.durations || !response.durations[0]) {
                                throw new Error("Response does not contain valid durations data.");
                            }

                            const batchResult = batch.map((destination, i) => ({
                                id: destination.id,
                                distance: response.distances[0][i],
                                time: response.durations[0][i],
                            }));

                            resolveBatch(results.concat(batchResult));
                        } catch (error) {
                            rejectBatch("Failed to parse response: " + error.message);
                        }
                    }
                });

                xhr.onerror = function () {
                    rejectBatch("Network error or request failed.");
                };

                const batchUrl = batch.map(location => location.lat + "%2C" + location.lon).join('%3B');
                console.log(batchUrl);
                xhr.open("GET",
                    "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=" + origin.lat + "%2C" + origin.lon +
                    "&destinations=" + batchUrl);
                xhr.setRequestHeader("x-rapidapi-host", "trueway-matrix.p.rapidapi.com");
                xhr.setRequestHeader("x-rapidapi-key", X_RAPIDAPI_KEY);
                xhr.send(data);
            });
        };

        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < destinations.length; i += chunkSize) {
            chunks.push(destinations.slice(i, i + chunkSize));
        }

        const processAllChunks = async () => {
            let allResults = [];
            for (const chunk of chunks) {
                allResults = await processBatch(chunk, allResults);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return allResults;
        };

        processAllChunks().then(resolve).catch(reject);
    });
}


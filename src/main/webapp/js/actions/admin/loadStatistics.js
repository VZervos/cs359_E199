async function loadStatistics() {

}

$(document).ready(async function () {
    const incidents_per_type_barchart = $('#statistics-incidents_per_type');
    const users_volunteers_piechart = $('#statistics-users_volunteers_count');
    const users_volunteers_3dpiechart = $('#statistics-firemen_vehicles_participated');


    await loadStatistics()
});
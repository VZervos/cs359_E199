import {getIncidentsList, getParticipantsList, getUsersList, getVolunteersList} from "../../ajax/ajaxLists.js";

//https://www.w3schools.com/js/js_graphics_google_chart.asp
async function loadIncidentsPerTypeStatistics(chartDiv) {
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(async function drawChart() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Incident type');
        data.addColumn('number', 'Occurrences');
        const incidentsList = await getIncidentsList();
        let incidentsPerType = {};
        incidentsList.data.forEach(incident => {
            const {incident_type} = incident;
            incidentsPerType[incident_type] = incident_type in incidentsPerType ? incidentsPerType[incident_type] + 1 : 1;
        });
        Object.entries(incidentsPerType).forEach(([key, value]) => {
            data.addRow([key, value]);
        });
        const options = {
            title: 'Incidents per type',
            chartArea: {width: '50%'},
            hAxis: {
                title: 'Total incidents',
                minValue: 0
            },
            vAxis: {
                title: 'Incident type'
            }
        };

        const chart = new google.visualization.BarChart(chartDiv[0]);
        chart.draw(data, options);
    });
}
async function loadUsersVolunteers(chartDiv) {
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(async function drawChart() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'User type');
        data.addColumn('number', 'Registered');
        const usersList = await getUsersList();
        const volunteersList = await getVolunteersList();
        data.addRow(["users", usersList.data.length]);
        data.addRow(["volunteers", volunteersList.data.length]);
        const options = {
            title: 'Number of users and volunteers',
            chartArea: {width: '50%'},
            hAxis: {
                title: 'User registrations',
                minValue: 0
            },
            vAxis: {
                title: 'User types'
            }
        };

        const chart = new google.visualization.PieChart(chartDiv[0]);
        chart.draw(data, options);
    });
}
async function loadFiremenVehicles(chartDiv) {
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(async function drawChart() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Volunteer type');
        data.addColumn('number', 'Participated');
        const participantsList = await getParticipantsList();
        const participantsPerType = {
            "simple": 0,
            "driver": 0
        };
        participantsList.data
            .filter(participant => participant.status !== "requested")
            .forEach(participant => {
            const {volunteer_type} = participant;
            participantsPerType[volunteer_type] = volunteer_type in participantsPerType ? participantsPerType[volunteer_type] + 1 : 1;
        });
        Object.entries(participantsPerType).forEach(([key, value]) => {
            data.addRow([key, value]);
        });

        const options = {
            title: 'Number of participant volunteer types',
            chartArea: {width: '50%'},
            hAxis: {
                title: 'User registrations',
                minValue: 0
            },
            vAxis: {
                title: 'User types'
            },
            is3D: true
        };

        const chart = new google.visualization.PieChart(chartDiv[0]);
        chart.draw(data, options);
    });
}

$(document).ready(async function () {
    const incidents_per_type_barchart = $('#statistics-incidents_per_type');
    const users_volunteers_piechart = $('#statistics-users_volunteers_count');
    const firemen_vehicles_3dpiechart = $('#statistics-firemen_vehicles_participated');

    await loadIncidentsPerTypeStatistics(incidents_per_type_barchart)
    await loadUsersVolunteers(users_volunteers_piechart);
    await loadFiremenVehicles(firemen_vehicles_3dpiechart);
});
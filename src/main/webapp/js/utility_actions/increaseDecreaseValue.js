// <div>
//     Vehicles:
//     <button type="button" className="incrdecr-button decr-button" id=${incident_id + "-vehicles-decrease"}>-</button>
//     <span id=${incident_id + "-vehicles-value"}>${vehicles}</span>
//     <button type="button" className="incrdecr-button incr-button" id=${incident_id + "-vehicles-increase"}>+</button>
//     <button className="save-info-button" id=${incident_id + "-change-vehicles-button"}>Save Changes</button>
// </div>

const getComponentTextAsNumber = (component) => Number(component.text());

export const increaseValue = (valueFieldId) => {
    const numberValueFieldComponent = $('#' + valueFieldId);
    numberValueFieldComponent.text(getComponentTextAsNumber(numberValueFieldComponent) + 1);
}

export const decreaseValue = (valueFieldId) => {
    const numberValueFieldComponent = $('#' + valueFieldId);
    numberValueFieldComponent.text(getComponentTextAsNumber(numberValueFieldComponent) - 1);
    if (getComponentTextAsNumber(numberValueFieldComponent) < 0) numberValueFieldComponent.text(0);
}

$(document).ready(function () {
    console.log("incrdecr loaded");
    $(document).on('click', '.incrdecr-button', function (event) {
        const getIncidentIdFromEvent = (event) => event.target.id.split('-')[0];
        const getFieldIdFromEvent = (event) => event.target.id.split('-')[1];

        const incident_id = getIncidentIdFromEvent(event);
        const fieldId = getFieldIdFromEvent(event);
        const valueFieldId = incident_id + "-" + fieldId + "-value";

        if ($(event.target).hasClass('incr-button')) increaseValue(valueFieldId);
        else if ($(event.target).hasClass('decr-button')) decreaseValue(valueFieldId);
        else console.assert(false);
    });
});
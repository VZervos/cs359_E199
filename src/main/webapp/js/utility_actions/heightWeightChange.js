const heightField = $('#height');
const weightField = $('#weight');

heightField.on('input', () => {
    updateFiremanHeight();
});

weightField.on('input', () => {
    updateFiremanWeight();
});

export const updateFiremanHeight = () => $('#height_value').text('Selected: ' + heightField.val() + 'm');

export const updateFiremanWeight = () => $('#weight_value').text('Selected: ' + weightField.val() + 'kg');

updateFiremanHeight();
updateFiremanWeight();

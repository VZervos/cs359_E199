export class ErrorMessage {
    constructor(errorMessageDivId) {
        this.errorMessageDiv = $('#' + errorMessageDivId);
        this.hideError()
    }

    showError(message) {
        this.errorMessageDiv.text(message);
        this.errorMessageDiv.show();
    }

    hideError() {
        this.errorMessageDiv.text('');
        this.errorMessageDiv.hide();
    }
}


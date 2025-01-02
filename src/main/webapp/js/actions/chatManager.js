import {clearHtml} from "../utility/utility.js";
import {getIncidentsList} from "../ajax/ajaxLists.js";
import {getChatTypes, getMessages, sendMessage} from "../ajax/ajaxChat.js";
import {ErrorMessage} from "../utility/ErrorMessage.js";

let errorMessage;

export async function loadChatHistory(incidentId, chattype, chatBox) {
    console.log(incidentId, chattype);
    const messages = await getMessages(incidentId, chattype);
    console.log(messages);
    clearHtml(chatBox)
    messages.data.forEach(message => chatBox.append(message.sender + ": " + message.message + '\n'))
}

export async function loadChatSection(incidentId, sender = "admin", chattype = "public") {
    async function loadChatSelector() {
        const chatTypes = await getChatTypes(sender);
        if (!chatTypes.data.length)
            return `<label class="note">No chat types found</label>`;

        const chatTypesOptions = [];
        chatTypes.data.forEach(chatType => {
            chatTypesOptions.push(
                `<option ${chatType === "public" ? "selected" : ""} value="${chatType}">${chatType}</option>`
            );
        });

        return chatTypesOptions.join('\n');
    }

    $('#messages').html(`
        <span id="chat-selector">
            <h4>Select chat</h4>
            <select autoComplete="type"
                    class="form-select"
                    id="type"
                    name="type"
                    required
            >
                    ${await loadChatSelector()}
            </select>
        </span>
        <h4 id="chat_title">${"Incident #" + incidentId + ": " + chattype + " chat"}</h4>
        <textarea class="giant-text-box"
                  id="chat_box"
                  name="chat_box"
                  readOnly></textarea>
        <h4>Send a message</h4>
        <textarea class="big-text-box"
                  id="message_box"
                  name="message_box"></textarea>
        <p id="message_status"></p>
        <button id="send-message-button">Send</button>
    `);

    errorMessage = new ErrorMessage("message_status");
}

export async function submitMessage(incidentId, message, sender, recipient, chatBox, messageBox) {
    const result = await sendMessage(incidentId, message, sender, recipient);
    if (!result.success) {
        errorMessage.showError(result.message);
        return;
    }

    errorMessage.hideError();
    await loadChatHistory(incidentId, recipient, chatBox);
    messageBox.val("")
}

export async function loadIncidentSelector() {
    const incidentSelector = $('#incident-selector');
    clearHtml(incidentSelector);

    const incidentsList = await getIncidentsList();
    if (!incidentsList.data.length) {
        incidentSelector.html(`
            <label class="note">No incidents found</label>
        `);
        return;
    }

    const incidentSelectorOptions = [
        `<option disabled value="">Select an incident</option>`
    ];
    incidentsList.data.forEach(incident => {
        const {incident_id, incident_type} = incident;
        incidentSelectorOptions.push(
            `<option value="${incident_id}">${incident_id} (${incident_type})</option>`
        );
    });

    incidentSelector.html(`
        <h4>Select incident</h4>
        <select autocomplete="incident"
                class="form-select"
                id="incident"
                name="incident"
                required
        >
            ${incidentSelectorOptions.join('\n')}
        </select>
    `);
}
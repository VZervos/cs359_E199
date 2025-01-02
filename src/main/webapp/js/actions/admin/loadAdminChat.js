import {clearHtml} from "../../utility/utility.js";
import {getIncidentsList} from "../../ajax/ajaxLists.js";
import {getChatTypes, getMessages} from "../../ajax/ajaxChat.js";

let loadChatButton;
let chatSection;

let incidentId;
let chattype;

async function loadChatHistory(incidentId, chattype) {
    console.log(incidentId, chattype);
    const chatbox = $('#chat_box')
    const messages = await getMessages(incidentId, chattype);
    console.log(messages);
    clearHtml(chatbox)
    messages.data.forEach(message => chatbox.append(message.sender + ": " + message.message + '\n'))
}

export async function loadChatSection(incidentId, username = "admin") {
    async function loadChatSelector() {
        const chatTypes = await getChatTypes(username);
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
        <button id="send-message-button">Send</button>
    `);
}

async function sendMessage() {

}

async function loadIncidentSelector() {
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


$(document).ready(async function () {
    loadChatButton = $('#load-chat-button');
    chatSection = $('#messages');

    loadChatButton.on('click', async function () {
        chattype = "public";
        const incident = $('#incident').val();
        incidentId = incident;
        await loadChatSection(incident);
        await loadChatHistory(incidentId, chattype)
    });

    $(document).on('change', '#type', async function (event) {
        chattype = $('#type').val();
        $('#chat_title').text("Incident #" + incidentId + ": " + chattype + " chat");
        await loadChatHistory(incidentId, chattype);
    });

    $(document).on('click', '#send-message-button', async function (event) {
        await sendMessage();
    });

    await loadIncidentSelector()
});
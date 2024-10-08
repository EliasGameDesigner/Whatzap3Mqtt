// Criar o cliente para se conectar ao servidor MQTT na porta 8000
let client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "");

let topicBase = "WHA3/";

if (!client.isConnected()) {
    console.log("Tentando conectar...");

    client.connect({
        onSuccess: () => Conectou(topicBase),
        onFailure: (error) => console.log("Falha na conexão:", error.errorMessage)
    });
}

// Criar as funções: Conexao_Perdida e Mensagem_Chegou
client.onConnectionLost = Conexao_perdida;
client.onMessageArrived = Mensagem_Chegou;

function Conectou(topic) {
    console.log("Conectado ao broker MQTT");

    // Inscrever-se no tópico
    client.subscribe(topic);
    console.log("Inscrito no tópico:", topic);
}

function Conexao_perdida(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("Conexão perdida:", responseObject.errorMessage);
        chatMessages.innerHTML += "Desconectado: " + responseObject.errorMessage + "<br>";
    }
}


let messagesHistory = {};       







function Mensagem_Chegou(message) {
    // chatMessages.innerHTML += "<br>";
    // chatMessages.innerHTML += message.payloadString;


    let topic = message.destinationName;
    let ip = topic.replace(topicBase, "");
    // Armazenar a mensagem no histórico
    if (!messagesHistory[ip]) {
        messagesHistory[ip] = [];
    }
    messagesHistory[ip].push(message.payloadString);

    // Verificar se o IP atual é o mesmo do tópico recebido
    if (ip === ipAtual) {
        chatMessages.innerHTML += "<br>" + message.payloadString;
    }



}

function Enviar(ip) {
    if (client.isConnected()) {
        let valor = "<div class='tuamsg'>" + ": " + messageInput.value + "</div>";
        let message = new Paho.MQTT.Message(valor);
        message.destinationName = topicBase + ip;
        client.send(message);
        console.log("Mensagem enviada:", valor);
    } else {
        console.log("Conexão não estabelecida");
    }
}

function trocarChat(ip) {
    // Desinscreva-se do tópico anterior, se necessário
    if (ipAtual !== 0) {
        client.unsubscribe(topicBase + ipAtual);
        console.log("Desinscrito do tópico:", topicBase + ipAtual);
    }

    ipAtual = ip;

    // Inscreva-se no novo tópico
    client.subscribe(topicBase + ip);
    console.log("Inscrito no novo tópico:", topicBase + ip);


    // Limpar o histórico de mensagens exibido
    chatMessages.innerHTML = "";

    // Exibir o histórico de mensagens para o novo chat
    if (messagesHistory[ip]) {
        messagesHistory[ip].forEach(msg => {
            chatMessages.innerHTML += "<br>" + msg;
        });
    }




}

// Selecionar contatos e gerenciar o título do chat
const contacts = document.querySelectorAll('.contact');
const chatTitle = document.getElementById('chat-title');
const chatMessages = document.getElementById('chatmessages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');




let esteip = 0;
let ipAtual = 0;

contacts.forEach((contact) => {
    contact.addEventListener('click', () => {
        const contactId = contact.id;
        chatTitle.textContent = `Chat com ${contactId === 'contact-1' ? 'Contato 1' : 'Contato 2'}`;
        
        // Carregar histórico de mensagens
        trocarChat(contactId);
    });
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        // Enviar mensagem para o tópico atual
        Enviar(ipAtual);
        messageInput.value = '';
    }
});

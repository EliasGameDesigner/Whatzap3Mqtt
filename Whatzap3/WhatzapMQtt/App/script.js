


topico = "cedup/texto";


//cria um cliente para se conectar ao servidor MQTT na porta 8000

client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "")
console.log(client)

if(client.isConnected){
    console.log("Conectou")
    client.connect({onSuccess:Conectou(topico)})
}



function Conectou(ip){
    //envia o tópico (variável) lida por todos os computadores
    
    client.subscribe(ip)
    message = new Paho.MQTT.Message('')
    message.destinationName = ip
}


//Criando as funções: Conexao_Perdida e Mensagem_Chegou

client.onConnectionLost = Conexao_perdida
client.onMessageArrived = Mensagem_Chegou



//Se perder a conexao será executada essa função:

function Conexao_perdida(responseObject) {
    if(responseObject.errorCode !== 0){
        chatbox.innerHTML += "Desconectado: " + responseObject.errorMessage
    }
    
}



// sempre que alguem atualizar o topico cedup/texto esta função é executada


function Mensagem_Chegou(message){
    chatbox.innerHTML += "<br>"
    chatbox.innerHTML += message.payloadString
}




function Enviar(ip){
    valor = "<div class='tuamsg'>" + apelido.value + ": " + texto.value + "</dv>"
    message = new Paho.MQTT.Message(valor)
    message.destinationName = ip
    client.send(message)
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////─────█─▄▀█──█▀▄─█─────////////////////////////////////////////////
//////////////////////////////////////////────▐▌──────────▐▌────////////////////////////////////////////////
//////////////////////////////////////////────█▌▀▄──▄▄──▄▀▐█────////////////////////////////////////////////
//////////////////////////////////////////───▐██──▀▀──▀▀──██▌───////////////////////////////////////////////
//////////////////////////////////////////──▄████▄──▐▌──▄████▄──////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////




const contacts = document.querySelectorAll('.contact');
const chatTitle = document.getElementById('chat-title');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');  

contacts.forEach((contact) => {
    contact.addEventListener('click', () => {
        const contactId = contact.id;
        chatTitle.textContent = `Chat with ${contactId === 'contact-1' ? 'Contact 1' : 'Contact 2'}`;
        // Renderizar mensagens do chat aqui
    
       
        client.disconnect();
        client.connect({onSuccess:Conectou(contactId)})
        
        



    });
    
});



// sendButton.addEventListener('click', () => {
//     const message = messageInput.value.trim();
//     if (message !== '') {
//       // Send message to current topic
//       valor = "<div class='tuamsg'>" +  ": " + texto.value + "</dv>"
//       message = new Paho.MQTT.Message(valor)
//       message.destinationName = topico // Use the current topic
//       client.send(message)
//       messageInput.value = '';
//     }
// });






//cria um cliente para se conectar ao servidor MQTT na porta 8000

client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "")
console.log(client)
topicobase  = "WHA3/";

if(client.isConnected){
    console.log("Conectou")
    
    client.connect({
      onSuccess: () => Conectou(topicobase) // 
    });
}


//Criando as funções: Conexao_Perdida e Mensagem_Chegou

client.onConnectionLost = Conexao_perdida
client.onMessageArrived = Mensagem_Chegou



function Conectou(ip) {
    // Aguarde a conexão ser estabelecida
    client.onConnect = () => {
      console.log('Conexão estabelecida');
      // Inscreva-se no tópico
      console.log(ip)
      client.subscribe(ip);
      message = new Paho.MQTT.Message('');
      message.destinationName = ip;
    };
}


function trocarChat(ip){
  message = new Paho.MQTT.Message('');
  message.destinationName = ip


}





//Se perder a conexao será executada essa função:

function Conexao_perdida(responseObject) {
    if(responseObject.errorCode !== 0){
      chatMessages.innerHTML += "Desconectado: " + responseObject.errorMessage
    }
    
}



// sempre que alguem atualizar o topico cedup/texto esta função é executada


function Mensagem_Chegou(message){
    chatMessages.innerHTML += "<br>"
    chatMessages.innerHTML += message.payloadString
}



function Enviar(ip) {
    if (client.isConnected()) {
      valor = "<div class='tuamsg'>"  + ": " + messageInput.value + "</dv>";
      message = new Paho.MQTT.Message(valor);
      message.destinationName = ip;
      client.send(message);
    } else {
      console.log('Conexão não estabelecida');
    }
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


//o ip vai ser a soma dos numeros do id dos 2 contatos,
ipAtual = 0;




contacts.forEach((contact) => {
    contact.addEventListener('click', () => {
      const contactId = contact.id;
      ipAtual = contactId
      chatTitle.textContent = `Chat with ${contactId === 'contact-1' ? 'Contact 1' : 'Contact 2'}`;
      // Renderizar mensagens do chat aqui
        
      
      console.log(contactId)
      console.log(ipAtual)

      //colocar pra carregar o historico de mensagem
      trocarChat(contactId);
      
      
    });
  });



sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
      // Send message to current topic
      Enviar(ipAtual)
      messageInput.value = '';
    }
});



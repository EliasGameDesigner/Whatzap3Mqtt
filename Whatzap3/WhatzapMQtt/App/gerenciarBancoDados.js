// Criando ou abrindo o banco de dados
const request = indexedDB.open('chatAppDB', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Cria uma objectStore chamada "conversations" com a chave primária "conversationId"
    if (!db.objectStoreNames.contains('conversations')) {
        const objectStore = db.createObjectStore('conversations', { keyPath: 'conversationId' });
    }
};

request.onsuccess = function(event) {
    const db = event.target.result;

    // Função para gerar o ID único da conversa baseado na soma dos IDs dos usuários
    function generateConversationId(userId1, userId2) {
        return userId1 + userId2;
    }

    // Função para adicionar uma mensagem ao histórico de uma conversa
    function addMessage(userId1, userId2, message) {
        const conversationId = generateConversationId(userId1, userId2);
        const transaction = db.transaction(['conversations'], 'readwrite');
        const objectStore = transaction.objectStore('conversations');

        const request = objectStore.get(conversationId);
        request.onsuccess = function(event) {
            let conversation = event.target.result;

            if (!conversation) {
                // Se a conversa não existir, cria uma nova
                conversation = { conversationId: conversationId, history: [] };
            }

            // Adiciona a nova mensagem ao histórico
            conversation.history.push(message);
            objectStore.put(conversation);
        };
    }

    // Função para recuperar o histórico de uma conversa
    function getConversationHistory(userId1, userId2) {
        const conversationId = generateConversationId(userId1, userId2);
        const transaction = db.transaction(['conversations'], 'readonly');
        const objectStore = transaction.objectStore('conversations');
        const request = objectStore.get(conversationId);

        request.onsuccess = function(event) {
            const conversation = event.target.result;
            if (conversation) {
                console.log('Histórico de conversa:', conversation.history);
            } else {
                console.log('Nenhum histórico encontrado para esta conversa.');
            }
        };
    }

    // Função para deletar uma conversa
    // function deleteConversation(userId1, userId2) {
    //     const conversationId = generateConversationId(userId1, userId2);
    //     const transaction = db.transaction(['conversations'], 'readwrite');
    //     const objectStore = transaction.objectStore('conversations');

    //     const request = objectStore.delete(conversationId);
    //     request.onsuccess = function() {
    //         console.log('Conversa deletada com sucesso.');
    //     };
    // }

    // Função para listar todas as conversas de um usuário
    function listAllConversations() {
        const transaction = db.transaction(['conversations'], 'readonly');
        const objectStore = transaction.objectStore('conversations');
        const request = objectStore.openCursor();

        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                console.log('ID da conversa:', cursor.value.conversationId);
                console.log('Histórico:', cursor.value.history);
                cursor.continue();
            } else {
                console.log('Todas as conversas foram listadas.');
            }
        };
    }

    // Exemplo de como adicionar uma mensagem
    addMessage(1, 2, 'Olá! Tudo bem?');
    addMessage(1, 2, 'Sim, e você?');
    addMessage(3, 2, 'Oi!');

    // Exemplo de como recuperar o histórico de uma conversa
    getConversationHistory(1, 2);

    // Exemplo de como deletar uma conversa
    // deleteConversation(1, 2);

    // Exemplo de como listar todas as conversas
    listAllConversations();
};

request.onerror = function(event) {
    console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
};

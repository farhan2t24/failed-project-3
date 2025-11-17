// Supabase configuration
const supabaseUrl = 'https://mzaiozwcaeirxnuoibve.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16YWlvendjYWVpcnhudW9pYnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODYxNDAsImV4cCI6MjA3ODk2MjE0MH0.87erNXBvikZTRPzbGzqUQnNZakmBE4peTj_s7cMzBco';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// AES key (fixed for demo)
const AES_KEY = "spytalk-secret-key-123";

// Global variables
let currentUser = null;
let selectedReceiver = null;
let messagesSubscription = null;

// DOM elements
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const enterBtn = document.getElementById('enter-btn');
const searchUserInput = document.getElementById('search-user');
const userList = document.getElementById('user-list');
const receiverName = document.getElementById('receiver-name');
const messagesDiv = document.getElementById('messages');
const messageText = document.getElementById('message-text');
const viewEncryptedBtn = document.getElementById('view-encrypted');
const sendBtn = document.getElementById('send-btn');

// Enter button click
enterBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    if (username && email) {
        try {
            // Generate a unique ID for the user
            const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            currentUser = { id: userId, username, email };
            // Store user info in Supabase
            const { error } = await supabase
                .from('users')
                .insert([{ id: userId, username, email }]);
            if (error) throw error;
            loginContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            loadUsers();
        } catch (error) {
            console.error('Error entering app:', error);
            alert('Error entering app. Please try again.');
        }
    } else {
        alert('Please enter both username and email.');
    }
});

// Load users for search
function loadUsers() {
    searchUserInput.addEventListener('input', async () => {
        const query = searchUserInput.value.trim().toLowerCase();
        if (query.length > 0) {
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .ilike('username', `%${query}%`)
                .neq('id', currentUser.id);
            if (error) console.error(error);
            else displayUsers(users);
        } else {
            userList.innerHTML = '';
        }
    });
}

// Display users
function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.email})`;
        li.addEventListener('click', () => selectReceiver(user));
        userList.appendChild(li);
    });
}

// Select receiver
function selectReceiver(user) {
    selectedReceiver = user;
    receiverName.textContent = `Chatting with ${user.username}`;
    loadMessages();
}

// Load messages
function loadMessages() {
    if (messagesSubscription) messagesSubscription.unsubscribe();
    const conversationId = getConversationId(currentUser.id, selectedReceiver.id);
    messagesSubscription = supabase
        .channel('messages')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
        }, payload => {
            displayMessage(payload.new);
        })
        .subscribe();

    // Load existing messages
    supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .then(({ data: messages, error }) => {
            if (error) console.error(error);
            else {
                messagesDiv.innerHTML = '';
                messages.forEach(displayMessage);
            }
        });
}

// Display message
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(message.sender_id === currentUser.id ? 'sent' : 'received');

    if (message.sender_id === currentUser.id) {
        messageDiv.innerHTML = `<strong>You:</strong> ${message.encrypted_text}`;
    } else {
        messageDiv.innerHTML = `<strong>${selectedReceiver.username}:</strong> ${message.encrypted_text}`;
        const decryptBtn = document.createElement('button');
        decryptBtn.textContent = 'Decrypt';
        decryptBtn.classList.add('decrypt-btn');
        decryptBtn.addEventListener('click', () => {
            const decrypted = decryptMessage(message.encrypted_text);
            alert(`Decrypted message: ${decrypted}`);
        });
        messageDiv.appendChild(decryptBtn);
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// View encrypted message
viewEncryptedBtn.addEventListener('click', () => {
    const text = messageText.value.trim();
    if (text) {
        const encrypted = encryptMessage(text);
        alert(`Encrypted message: ${encrypted}`);
    } else {
        alert('Please type a message first.');
    }
});

// Send message
sendBtn.addEventListener('click', async () => {
    const text = messageText.value.trim();
    if (text && selectedReceiver) {
        const encrypted = encryptMessage(text);
        const conversationId = getConversationId(currentUser.id, selectedReceiver.id);
        const { error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: conversationId,
                encrypted_text: encrypted,
                sender_id: currentUser.id,
                receiver_id: selectedReceiver.id
            }]);
        if (error) console.error(error);
        else messageText.value = '';
    } else {
        alert('Please select a receiver and type a message.');
    }
});

// Encrypt message
function encryptMessage(text) {
    return CryptoJS.AES.encrypt(text, AES_KEY).toString();
}

// Decrypt message
function decryptMessage(encryptedText) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, AES_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Get conversation ID
function getConversationId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

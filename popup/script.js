// Import the natural language toolkit library
const nltk = require('nltk');

// Import custom libraries for sentiment analysis, language detection, and named entity recognition
const { sentimentScore } = require('./sentiment');
const { detectLanguage } = require('./langdetect');
const { detectEntities } = require('./ner');

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const refreshButton = get(".refresh-button");

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you're trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];

const BOT_IMG = "../images/icon128.png";
const PERSON_IMG = "../images/icon1281.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "You";

const API_KEY = "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";
const API_ENDPOINT = "https://api.openai.com/v1/engines/davinci-instruct-beta/completions";

// Load chat history from localStorage
const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage();
});

msgerInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

refreshButton.addEventListener("click", () => {
  refreshChat();
});

async function sendMessage() {
  const msgText = msgerInput.value.trim();
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  const sentiment = sentimentScore(msgText);
  console.log("Sentiment Score:", sentiment);

  const language = detectLanguage(msgText);
  console.log("Detected Language:", language);

  const entities = detectEntities(msgText);
  console.log("Detected Entities:", entities);

  await sendToOpenAI(msgText);
  msgerInput.focus();
}

async function sendToOpenAI(message) {
  try {
    let botResponse;

    // Check for predefined inputs and return corresponding outputs
    if (message.toLowerCase() === "hi" || message.toLowerCase() === "hello")  {
      botResponse = "Hello! How can I assist you today?";
    } else if (message.toLowerCase() === "bye") {
      botResponse = "Goodbye! Have a great day!";
    } else if (message.toLowerCase() === "fuck you") {
      botResponse = "Don't say things like that! Be respectful.";
    } else if (message.toLowerCase() === "ok") {
      botResponse = "Happy to help you!";
    } else {
      // No predefined input found, make API call to OpenAI
      const data = {
        prompt: message,
        max_tokens: 100, // Adjust the length of the response as needed
        temperature: 0.7 // Controls the randomness of the response (0.0 to 1.0)
      };

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Failed to get response from OpenAI API");
      }

      const result = await response.json();
      botResponse = result.choices[0].text.trim();
    }

    // Display the bot response in the chat
    appendMessage(BOT_NAME, BOT_IMG, "left", botResponse);
  } catch (error) {
    console.error("An error occurred:", error);
    appendMessage(BOT_NAME, BOT_IMG, "left", "Oops! Something went wrong.");
  }
  
  // Save chat history to localStorage
  saveChatHistory();
}

function appendMessage(name, img, side, text) {
  const msgerChatMain = get(".msger-chat");

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("msg", `${side}-msg`);

  const msgImg = document.createElement("div");
  msgImg.classList.add("msg-img");
  msgImg.style.backgroundImage = `url(${img})`;

  const msgBubble = document.createElement("div");
  msgBubble.classList.add("msg-bubble");

  const msgInfo = document.createElement("div");
  msgInfo.classList.add("msg-info");

  const msgInfoName = document.createElement("div");
  msgInfoName.classList.add("msg-info-name");
  msgInfoName.textContent = name;

  const msgInfoTime = document.createElement("div");
  msgInfoTime.classList.add("msg-info-time");
  msgInfoTime.textContent = formatDate(new Date());

  const msgText = document.createElement("div");
  msgText.classList.add("msg-text");
  msgText.textContent = text;

  msgInfo.appendChild(msgInfoName);
  msgInfo.appendChild(msgInfoTime);

  msgBubble.appendChild(msgInfo);
  msgBubble.appendChild(msgText);

  messageContainer.appendChild(msgImg);
  messageContainer.appendChild(msgBubble);

  msgerChatMain.appendChild(messageContainer);

  scrollChatToBottom();
}

function scrollChatToBottom() {
  msgerChat.scrollTop = msgerChat.scrollHeight;
}

// Utility functions
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function refreshChat() {
  // Clear chat history
  msgerChat.innerHTML = '';

  // Add initial bot message
  appendMessage(BOT_NAME, BOT_IMG, "left", "Hi, I am your AI ChatBot 😄");

  // Save chat history to localStorage
  saveChatHistory();
}

function saveChatHistory() {
  const messages = Array.from(msgerChat.getElementsByClassName('msg'));
  const chatHistory = messages.map(message => {
    const name = message.querySelector('.msg-info-name').textContent;
    const img = message.querySelector('.msg-img').style.backgroundImage;
    const side = message.classList.contains('left-msg') ? 'left' : 'right';
    const text = message.querySelector('.msg-text').textContent;
    return { name, img, side, text };
  });

  // Convert image URLs to strings before storing in localStorage
  const chatHistoryString = JSON.stringify(chatHistory, (key, value) => {
    if (key === 'img') {
      return value.replace(/url\(["']?(.*?)["']?\)/, '$1');
    }
    return value;
  });

  localStorage.setItem("chatHistory", chatHistoryString);
}

// Display chat history on page load
chatHistory.forEach(message => {
  appendMessage(message.name, message.img, message.side, message.text);
});

// Start the chat
sendMessage("What is your state?");

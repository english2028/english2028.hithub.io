﻿let token = null;
fetch('https://openai-server-hh4m.onrender.com/checka',
{
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ aaa: new URLSearchParams(window.location.search).get('aaa') })
})
.then(response => response.json())
.then(data => {
 if (data.success) token = data.token;
 else alert('Scuzati - nu aveti acces...');
})
.catch(error => console.error('Eroare:', error));

let sendButton = window.document.getElementById('sendButton');
let inp = window.document.getElementById('textInput');
let outp = window.document.getElementById('textOutput');
let conversation = [];

let speech2text = new webkitSpeechRecognition();
let text2speech = window.speechSynthesis;

const speech = () => {
 speech2text.lang = 'en-EN';
 speech2text.start();
 sendButton.innerText = 'Speak...';
}

const talk = (text) => {
 let textToTalk = new SpeechSynthesisUtterance(text);
 textToTalk.onend = function(event) {
 sendButton.innerText = 'Do you have anything else you want to say? Click here - and speak up';
 };
 textToTalk.lang = 'en-EN';
 textToTalk.rate = 0.5;
 text2speech.speak(textToTalk);
}

speech2text.onresult = (event) => {                    
 inp.value = event.results[0][0].transcript;
 requestFunc();
}
const requestFunc = () => {
 if (inp.value && token) {
  sendButton.innerText = 'Wait...';
  let message = { "role": "user", "content": inp.value };
  conversation.push(message);
  axios.post('https://openai-server-hh4m.onrender.com/api/chat',
  {
   messages: conversation,
   token: token
  })
  .then(response => {
   let aiResponse = response.data.choices[0].message.content;
   outp.value = aiResponse;
   conversation.push({ "role": "assistant", "content": aiResponse });
   talk(aiResponse);
  })
  .catch(error => {
   console.error("Error request:", error.message);
   sendButton.innerText = 'Error API_KEY';
  });
 }
}

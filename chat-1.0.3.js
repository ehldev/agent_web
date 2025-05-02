(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute("data-api_key") || "sin-api";

    // Estilos
    const style = document.createElement("style");
    style.innerHTML = `
        .chat-btn {
position: fixed;
bottom: 24px;
right: 24px;
background: #4f46e5;
color: white;
border: none;
border-radius: 50%;
width: 64px;
height: 64px;
font-size: 28px;
cursor: pointer;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
z-index: 10000;
transition: background 0.3s ease;
}
.chat-btn:hover {
background: #4338ca;
}

.chat-popup {
position: fixed;
bottom: 100px;
right: 24px;
width: 360px;
max-height: 520px;
background: white;
border-radius: 16px;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
display: none;
flex-direction: column;
overflow: hidden;
z-index: 10000;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-header {
background: #4f46e5;
color: white;
padding: 16px;
font-weight: 600;
font-size: 16px;
text-align: center;
}

.chat-body {
flex: 1;
padding: 16px;
overflow-y: auto;
background: #f9fafb;
}

.chat-message {
margin-bottom: 12px;
max-width: 80%;
padding: 12px 16px;
border-radius: 18px;
font-size: 14px;
line-height: 1.4;
word-wrap: break-word;
clear: both;
}
.from-user {
background: #4f46e5;
color: white;
float: right;
border-bottom-right-radius: 4px;
}
.from-bot {
background: #e5e7eb;
color: #111827;
float: left;
border-bottom-left-radius: 4px;
}

.chat-input {
display: flex;
border-top: 1px solid #e5e7eb;
background: #ffffff;
}
.chat-input input {
flex: 1;
border: none;
padding: 14px 16px;
font-size: 14px;
border-radius: 0;
outline: none;
}
.chat-input button {
background: #4f46e5;
color: white;
border: none;
padding: 0 20px;
font-size: 18px;
cursor: pointer;
transition: background 0.3s ease;
}
.chat-input button:hover {
background: #4338ca;
}
    `;
    document.head.appendChild(style);

    // Botón
    const button = document.createElement("button");
    button.className = "chat-btn";
    button.innerHTML = "💬";
    document.body.appendChild(button);

    // Chat popup
    const popup = document.createElement("div");
    popup.className = "chat-popup";
    popup.innerHTML = `
<div class="chat-header">Chat de Ayuda</div>
<div class="chat-body" id="chat-body">
  <div class="chat-message from-bot">¡Hola! ¿En qué puedo ayudarte hoy?</div>
</div>
<div class="chat-input">
  <input type="text" id="chat-input" placeholder="Escribe un mensaje..." />
  <button id="chat-send">Enviar</button>
</div>
`;
    document.body.appendChild(popup);

    // Mostrar/ocultar chat
    button.addEventListener("click", () => {
      popup.style.display =
        popup.style.display === "flex" ? "none" : "flex";
    });

    // Lógica de envío
    const input = popup.querySelector("#chat-input");
    const sendBtn = popup.querySelector("#chat-send");
    const body = popup.querySelector("#chat-body");

    function appendMessage(text, from = "user") {
      const msg = document.createElement("div");
      msg.className =
        "chat-message " + (from === "user" ? "from-user" : "from-bot");
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      appendMessage(text, "user");
      input.value = "";

      // Simulación de respuesta de backend/n8n
      appendMessage("Pensando...", "bot");

      // Aquí se enviaría al backend real con la api_key
      fetch("https://agent-web-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          api_key: apiKey,
          site: window.location.hostname,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Reemplaza el "Pensando..." por la respuesta real
          const loading = body.querySelector(
            ".chat-message.from-bot:last-child"
          );
          if (loading)
            loading.innerHTML = data.reply || "Lo siento, hubo un error.";
        })
        .catch(() => {
          const loading = body.querySelector(
            ".chat-message.from-bot:last-child"
          );
          if (loading)
            loading.innerHTML = "Error al conectarse al servidor.";
        });
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  })();
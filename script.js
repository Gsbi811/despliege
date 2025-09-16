const btn = document.getElementById("actionBtn");
const msg = document.getElementById("message");

const mensajes = [
  "¡Así de rápido se despliega un proyecto con Netlify! 😎",
  "Tu proyecto ya está desplegado. 🚀",
  "¡Hola Mundo! 🌏",
  "Desplegar nunca fue tan fácil. 😉",
];

btn.addEventListener("click", () => {
  const randomMsg = mensajes[Math.floor(Math.random() * mensajes.length)];
  msg.textContent = randomMsg;
});

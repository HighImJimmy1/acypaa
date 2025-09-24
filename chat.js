(function(){
  const $ = (sel) => document.querySelector(sel);
  const messages = $("#messages");
  const input = $("#input");
  const form = $("#composer");
  const topic = $("#topic");
  const launcher = $("#chat-launcher");
  const panel = $("#chat-container");
  const closeBtn = $("#close-btn");

  function show(){ panel.classList.remove("hidden"); input.focus(); }
  function hide(){ panel.classList.add("hidden"); }
  launcher.addEventListener("click", show);
  closeBtn.addEventListener("click", hide);

  function addMessage(text, who="bot", citations=""){
    const div = document.createElement("div");
    div.className = "msg " + (who === "user" ? "user" : "bot");
    div.textContent = text;
    if (citations){
      const small = document.createElement("small");
      small.className = "citations";
      small.textContent = citations;
      div.appendChild(small);
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(q){
    const endpoint = (window.CHAT_CONFIG && window.CHAT_CONFIG.ENDPOINT) || "";
    if (!endpoint){ addMessage("Chat endpoint is not configured. Edit config.js and set CHAT_CONFIG.ENDPOINT.", "bot"); return; }
    try{
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ q, topic: topic.value || undefined })
      });
      if (!res.ok){
        const text = await res.text();
        throw new Error("HTTP " + res.status + ": " + text);
      }
      const data = await res.json(); // expecting { body: string } OR plain string
      const text = typeof data === "string" ? data : (data.body || JSON.stringify(data));
      // Try to split citations if present at the end "Sources: ..."
      let body=text, cites="";
      const ix = text.lastIndexOf("Sources:");
      if (ix !== -1 && text.length - ix < 300){
        body = text.slice(0, ix).trim();
        cites = text.slice(ix).trim();
      }
      addMessage(body, "bot", cites);
    }catch(err){
      addMessage("Error: " + err.message, "bot");
    }
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    addMessage(q, "user");
    input.value="";
    sendMessage(q);
  });

  // Autofocus when opened via keyboard
  window.addEventListener("keydown", (e)=>{
    if ((e.key === "c" || e.key === "C") && e.ctrlKey) show();
  });
})();
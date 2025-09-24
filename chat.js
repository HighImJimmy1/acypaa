(function(){
  const $ = (sel) => document.querySelector(sel);
  const messages = $("#messages");
  const input = $("#input");
  const form = $("#composer");

  function addMessage(text, who="tony", cites="") {
    const div = document.createElement("div");
    div.className = "msg " + (who === "user" ? "user" : "tony");
    div.textContent = text;
    if (cites){
      const small = document.createElement("small");
      small.className = "citations";
      small.textContent = cites;
      div.appendChild(small);
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(q) {
    const endpoint = (window.CHAT_CONFIG && window.CHAT_CONFIG.ENDPOINT) || "";
    if (!endpoint){ addMessage("Chat endpoint not configured. Set config.js", "tony"); return; }
    try {
      const res = await fetch(endpoint, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ q })
      });
      const data = await res.json();
      const text = typeof data === "string" ? data : (data.body || JSON.stringify(data));
      let body=text, cites="";
      const ix=text.lastIndexOf("Sources:");
      if(ix!==-1 && text.length-ix<300){
        body=text.slice(0,ix).trim();
        cites=text.slice(ix).trim();
      }
      addMessage(body, "tony", cites);
    }catch(err){
      addMessage("Error: " + err.message, "tony");
    }
  }

  form.addEventListener("submit", e=>{
    e.preventDefault();
    const q=input.value.trim();
    if(!q) return;
    addMessage(q, "user");
    input.value="";
    sendMessage(q);
  });
})();

# ACYPAA Chat UI (Static Web App)

This is a minimal, no-build static chat widget for ACYPAA. It calls a single Azure Functions HTTP endpoint that implements your RAG logic (Search → GPT → answer with citations).

## Files
- `index.html` – floating chat launcher + panel
- `style.css` – basic styles
- `chat.js` – frontend logic
- `config.js` – **set `ENDPOINT` to your Azure Function URL** (copy from `config.js` example)

## Local usage
1. Copy `config.example.js` to `config.js` and set `ENDPOINT`.
2. Open `index.html` in a browser (or use a simple static server).

## Deploy to Azure Static Web Apps (Free)
- Create a GitHub repo and push these files.
- In Azure Portal: **Static Web Apps → Create → Source = GitHub**.
  - Build preset: **Custom**
  - App location: `/`
  - Output location: `/`
- After deploy, the site is live and will auto-redeploy on every push.

## Notes
- Keep messages short; citations are appended when provided by the backend.
- The UI passes an optional `topic` (`bidding`, `big_book`, `ypaa`) to the `/chat` endpoint.

Architecture Overview
This project uses a modular setup designed for clarity and separation of concerns:
- Frontend:
Deployed on Vercel from this repository. All application code, routes, and UI live here.
- Database:
Powered by Supabase Cloud.
The local supabase/ folder is used only for development (local Postgres, migrations, and testing) and is intentionally excluded from version control.
- Automation & Workflows:
Handled by n8n, running on a separate server.
The local n8n/ folder contains development workflows and environment-specific files and is also excluded from version control.
Local tooling folders (supabase/, n8n/, docs/) are ignored via .gitignore because they are environment‑specific and not required for deployment.

If you want, I can help you expand this into a full README template with installation steps, environment variable instructions, and deployment notes.

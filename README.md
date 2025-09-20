# AI Intake Agent for Attack Capital Assignment

This project is a full-stack web application built with Next.js and TypeScript to manage and demonstrate a domain-specific AI voice agent using the OpenMic API. 

It fulfills all the requirements of the development assignment by showcasing complete webhook integration (pre-call, in-call function, post-call) and a user interface for full bot management (CRUD) and call log viewing.

---

## Features

- **Full Bot Management (CRUD):**  
  Create, list, update, and delete AI bots directly from the web interface.

- **Dynamic Webhook Integration:**
  - **Pre-call Webhook:** Fetches initial user data (e.g., a patient's name and history) to personalize the conversation from the beginning.  
  - **In-call Function:** Allows the AI to dynamically retrieve specific information (e.g., a patient's allergies) during a live conversation by calling a backend API.  
  - **Post-call Webhook:** Receives and processes the complete call transcript and AI-generated summary after the call ends.  

- **Real-time Call History:**  
  A dedicated page that displays detailed logs of all completed calls, automatically updating as new calls are finished.

---
## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Local Tunneling**: ngrok (for webhook development)
- **Core API**: OpenMic.ai

---

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aaupatel/attack-capital-assignment.git
   cd attack-capital-assignment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:

   Create a .env.local file in the root of the project. You will need to add your OpenMic API key.
   ```bash
   # Get this from the OpenMic dashboard
   OPENMIC_API_KEY="YOUR_API_KEY_HERE"
   # This is the base URL for the OpenMic API
   NEXT_PUBLIC_OPENMIC_API_URL="https://api.openmic.ai/v1"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3000.

---
## Running the Live Demo

To demonstrate the full webhook functionality, follow these steps:

1. **Start the Local Server:**  
   Run the development server: 
   ```bash
   npm run dev
   ```
2. **Expose with ngrok:**  
   In a separate terminal, run:  
   ```bash
   ngrok http 3000
   ```
   Copy the generated public HTTPS URL.
3. **Configure a Bot:**  
   On the OpenMic.ai dashboard, create a bot and configure its Pre-call, Post-call, and Custom Function webhooks to point to your public `ngrok` URL (e.g., https://your-url.ngrok-free.app/api/pre-call).  
   ```bash
   https://your-url.ngrok-free.app/api/pre-call
   ```
4. **Assign a Contact List:**  
   To provide initial data for the pre-call webhook, assign a Contact List to the bot under Inbound Settings.  
5. **Run a Test Call:**  
   Use the Test Call feature on the OpenMic dashboard to initiate a conversation. 
6. **Observe the Results:**  
   - The AI will use the webhook data during the call.
   - After the call ends, the complete transcript and AI-generated summary will appear in the application's Call Logs page.

---
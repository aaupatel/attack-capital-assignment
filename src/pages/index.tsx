import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";

// Defines the structure of a bot object
interface Bot {
  uid: string;
  name: string;
  prompt: string;
}

export default function HomePage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [botName, setBotName] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW --- State to manage which bot is currently being edited
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrompt, setEditedPrompt] = useState("");

  // Fetches the list of all bots from your backend API
  const fetchBots = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bots");
      if (!response.ok)
        throw new Error(
          "Failed to fetch bots. Check your API key in .env.local."
        );
      const data = await response.json();
      setBots(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bots when the component first loads
  useEffect(() => {
    fetchBots();
  }, []);

  // Handles the "Create Bot" form submission
  const handleCreateBot = async (e: FormEvent) => {
    e.preventDefault();
    if (!botName || !botPrompt) return;
    try {
      await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: botName,
          prompt: botPrompt,
          voice_id: "default",
        }),
      });
      setBotName("");
      setBotPrompt("");
      fetchBots(); // Refresh the bot list
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- NEW --- Function to start the editing process for a specific bot
  const handleEditClick = (bot: Bot) => {
    setEditingBot(bot);
    setEditedName(bot.name);
    setEditedPrompt(bot.prompt);
  };

  // --- NEW --- Function to save the updated bot details
  const handleSaveUpdate = async (botId: string) => {
    if (!editedName || !editedPrompt) return;
    try {
      await fetch("/api/bots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, name: editedName, prompt: editedPrompt }),
      });
      setEditingBot(null); // Exit editing mode
      fetchBots(); // Refresh the bot list
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handles deleting a bot
  const handleDeleteBot = async (botId: string) => {
    if (!window.confirm("Are you sure you want to delete this bot?")) return;
    try {
      await fetch("/api/bots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId }),
      });
      fetchBots(); // Refresh the bot list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Bot Management</title>
      </Head>
      <main className="main-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bot Management</h1>
          <Link href="/logs" className="text-blue-400 hover:underline">
            View Call Logs
          </Link>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Create New Bot</h2>
          <form onSubmit={handleCreateBot}>
            <div className="mb-4">
              <label
                htmlFor="botName"
                className="block text-sm font-medium mb-2"
              >
                Bot Name
              </label>
              <input
                id="botName"
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="input-field"
                placeholder="Medical Intake Assistant"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="botPrompt"
                className="block text-sm font-medium mb-2"
              >
                Bot Prompt
              </label>
              <textarea
                id="botPrompt"
                rows={4}
                value={botPrompt}
                onChange={(e) => setBotPrompt(e.target.value)}
                className="input-field"
                placeholder="You are Eva, a friendly medical intake assistant..."
              />
            </div>
            <button type="submit" className="btn">
              Create Bot
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Existing Bots</h2>
          {loading && <p>Loading bots...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && bots.length === 0 && (
            <p>No bots found. Create one above!</p>
          )}

          <div className="space-y-4">
            {bots.map((bot) => (
              <div key={bot.uid} className="p-4 bg-gray-700 rounded-lg">
                {editingBot?.uid === bot.uid ? (
                  // --- NEW: EDITING VIEW ---
                  // This form appears when a user clicks "Edit"
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Edit Name
                      </label>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Edit Prompt
                      </label>
                      <textarea
                        rows={6}
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="flex gap-x-2">
                      <button
                        onClick={() => handleSaveUpdate(bot.uid)}
                        className="btn bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBot(null)}
                        className="btn bg-gray-500 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- DEFAULT DISPLAY VIEW ---
                  <div className="flex justify-between items-center">
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xl font-bold truncate">{bot.name}</h3>
                      <p className="text-gray-400 mt-1 text-xs">
                        BOT UID: {bot.uid}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex gap-x-2 ml-4">
                      <button
                        onClick={() => handleEditClick(bot)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBot(bot.uid)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

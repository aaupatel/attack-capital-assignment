import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

type TranscriptItem = ["user" | "assistant" | "system" | "", string];

interface CallLog {
  call_sid: string;
  summary: string;
  transcript: TranscriptItem[];
  receivedAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs");
      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setLogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(fetchLogs, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Head>
        <title>Call Logs</title>
      </Head>
      <main className="main-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Call Logs</h1>
          <Link href="/" className="text-blue-400 hover:underline">
            &larr; Back to Bot Management
          </Link>
        </div>
        {loading && <p>Loading logs...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && logs.length === 0 && (
          <div className="card text-center">
            <p>
              No call logs found yet. Run a test call to see logs appear here.
            </p>
          </div>
        )}
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.call_sid} className="card">
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  Call SID: {log.call_sid}
                </p>
                <p className="text-sm text-gray-400">
                  Received: {new Date(log.receivedAt).toLocaleString()}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Summary:</h3>
                <p className="text-gray-300">{log.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Transcript:</h3>
                <div className="p-4 bg-gray-900 rounded-md space-y-2">
                  {log.transcript.map((item, index) => {
                    // Accessing data using array indices ---
                    const role = item[0];
                    const content = item[1];

                    // Render only if there is content to display
                    return content ? (
                      <p
                        key={index}
                        className={
                          role === "user" ? "text-green-400" : "text-cyan-400"
                        }
                      >
                        <strong>
                          {role === "user" ? "Patient" : "Assistant"}:
                        </strong>{" "}
                        {content}
                      </p>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

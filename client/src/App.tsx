import { useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

import '@livekit/components-styles';

const serverUrl = 'wss://test-vcs-uacuq3zn.livekit.cloud';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !name) return;

    setLoading(true);
    try {
      const resp = await fetch(`https://web-call-app-hx1k.onrender.com/get-token?room=${roomName}&identity=${name}`);
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
      alert("Ошибка подключения к бэкенду. Проверь, запущен ли Go-сервер.");
    } finally {
      setLoading(false);
    }
  };

  // Экран логина
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-full w-full bg-[#0f172a] text-white">
        <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10">
          <h1 className="text-3xl font-bold mb-6 text-center">WebRTC Call</h1>
          <form onSubmit={joinRoom} className="space-y-4">
            <input
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 focus:border-blue-500 outline-none"
              placeholder="Комната"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 focus:border-blue-500 outline-none"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors"
              disabled={loading}
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Экран конференции
  return (
    <div className="h-full w-full">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        onDisconnected={() => setToken(null)}
        data-lk-theme="default"
        style={{ height: '100vh' }} // Принудительно на весь экран
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
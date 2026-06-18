import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getAuthToken } from "./api";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: "http://localhost:8000/api/v1/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  },
});

export default echo;

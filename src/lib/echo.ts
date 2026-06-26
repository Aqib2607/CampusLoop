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

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

/** No-op stub used during SSR or when Reverb is not configured. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopChannel: any = { listen: () => noopChannel, stopListening: () => noopChannel };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopEcho: any = {
  private: () => noopChannel,
  channel: () => noopChannel,
  leave: () => {},
  leaveChannel: () => {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const echo: Echo<any> =
  typeof window !== "undefined" && reverbKey
    ? new Echo({
        broadcaster: "reverb",
        key: reverbKey,
        wsHost: "127.0.0.1",
        wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
        forceTLS: false,
        enabledTransports: ["ws", "wss"],
        authEndpoint: "http://127.0.0.1:8000/api/v1/broadcasting/auth",
        auth: {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        },
      })
    : noopEcho;

export default echo;

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (echo && typeof echo.disconnect === "function") {
      echo.disconnect();
    }
  });
}

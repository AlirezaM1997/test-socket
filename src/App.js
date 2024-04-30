import React, { useState } from "react";
import { useCookies } from "react-cookie";

const App = () => {
  const [token, setToken] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const wsUrl = "wss://api.hamafza-startup.ir/ws/graphql/";

  const ws = new WebSocket(wsUrl, "graphql-ws");

  ws.onopen = () => {
    const subscriptionQuery = `
    subscription{
      onNewMessage(channelIdentifier:"town-square"){
        channelIdentifier
        message{
          id
          message
        }
      }
    }
  `;

    const message = {
      id: "1", // Unique ID for the subscription
      type: "start", // Type of the message, 'start' for initiating a subscription
      payload: {
        query: subscriptionQuery,
        // You can also include variables here if your query needs them
      },
    };

    const serializedMessage = JSON.stringify(message);

    ws.send(serializedMessage);

    ws.onmessage = function (event) {
      // Handle incoming messages, including subscription data
      console.log("Received:", event.data);
    };
  };

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSaveToken = () => {
    setCookie("token", token);
    setToken("");
  };

  const handleRemoveToken = () => {
    removeCookie("token");
  };

  return (
    <div dir="rtl" style={{ padding: "2rem" }}>
      <h2>ذخیره مقدار در کوکی با کلید token</h2>
      <input
        type="text"
        dir="ltr"
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        value={token}
        onChange={handleTokenChange}
      />
      <button onClick={handleSaveToken}>ذخیره توکن</button>
      <button onClick={handleRemoveToken}>حذف توکن</button>
      {cookies?.token && (
        <h1 dir="ltr" style={{ wordBreak: "break-word" }}>
          token: {cookies.token}
        </h1>
      )}
    </div>
  );
};

export default App;

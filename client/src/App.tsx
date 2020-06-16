import React from "react"
import "./App.css"

import { w3cwebsocket as W3CWebSocket } from "websocket"

var client = new W3CWebSocket(process.env.WEBSOCKET_SERVER)

client.onerror = function () {
  console.log("[client]: Connection Error")
}

client.onopen = function () {
  console.log("[client]: WebSocket Client Connected")
}

client.onclose = function () {
  console.log("[client]: Client Closed")
}

client.onmessage = function (e) {
  if (typeof e.data === "string") {
    console.log("Received: '" + e.data + "'")
  }
}

function App() {
  return (
    <div className="App">
      <button onClick={() => client.send('{"action": "hello"}')}>Send Message</button>
    </div>
  )
}

export default App

const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = {
  "type": "service_account",
  "project_id": "pushdemo-f910e",
  "private_key_id": "d80ddc0ab06afe491534824cc10114e4c9ce62a8",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC9jk7xY8/yWDJ8\ndnrkHdCOVTummTD8ySrPYiKkLxBgFg9d+pqEJ1hV0osaDOmS2ok9FNVnRYF9lzC+\nLsPWmRUzwDJWFiV8oczz8LSdROK4+UMNanWePIrIJx3VDAgtabiMfiPhvAyOJQyz\nzCxpUyvuSZEosRetALwgF7aACe8nsful8hd66j8mq+JLA4Vv0SqqtjZMcIBeJGWt\nHc6ca6f1JcWh/nlaCvtz7ZzEv0SBDNNYHHWzJIoW0B/epbhOIOc7TZaOWpCgiy1z\n7CfQwCA8lHYzqtw03W6uzpvgP8OuRW5nZQbSDcwnp7nbEVq9uEathLf+ow+7mr7f\norQUVKaFAgMBAAECggEAAdmJ6b8x/ua/XDvJCZOgMRCGgZm5K+gMgQGBwvZULwtJ\nNXYIRZ7xq6BxviEWDpE0KZKJlLoWzfAxulMZJVtIAF0+9RMsm7BsqWhRYlGlcuRK\n9C5PvSnQuZoUZ3uBZaMyJs5BB74TSgEZxE+LN4wMDXNE+gsSXeVvC/eOIR08RlNW\nuKrG1G+xDjHlffhhEhW99rZ7yPduLOEocdPS8P+CmRKnG0jG2PQGhfgu1yR5NU1R\nkh/MOBsh/lSmP1LdCf85FxqM4SEU0C3a6jE1CiMGciEIX2Z8YmTQFxHMQmIGKbfO\n4cVqokeuWhZ1+A9fyzomgFTthYetLaM5HDPKluKKaQKBgQD7yTP8yr3oShZ/RYx7\nFqsocnROK0OXaeWMbgNS4Q9n9JLNVdgqemHarljJ/Ve3MWdQyxP1/SzhvlgyjdiQ\nmTT8r2BfRgnvgDW+Q0CJ8HrCYkiInySqfZN9K/nvOH3UJ2/rsSABsgb9vmuknLCU\ngoWkq/67XkRY8zkOoV7k1o0xTQKBgQDAunnFK2WZMrGeQrCCNOlRDVjwSLfL/q1I\n555Felx0YOL0xviboyrnKR0ny8+LV6Q+4b9LTAkWbP9k4nLNNhFLTOVnGj13k+Sh\nFCweALnKGR9H27CGe5S35utqopVT6r8j3l1yd/qLbSfChKYclPiOdL/m2yl2p0hi\noYw3gOsuGQKBgFSEipXtvGewDvMz9l8PEe8m1FG1BiBaZLqJ50W31IMRvwF8Mm63\n3AcbBSTwjLQqukKNmKq3DIzOZy65HJwVQYscl54Dlaw2flPaoVxsQ9jiQvTRbu5n\n7s1SqLgbX2mKv2//af4Hs38Tn3CHRGLlmVTYg06D6y9snZeCpabtOkH1AoGASOeB\nXrN+2EfT5rEFgguv4qgw55wqYrFxLW3ochHKXX+0+rE1o/JCLXVhAQfY97XsfJj6\nuuoFWgVbSvdaRARa4GgzMyA69jvstX4i/ip6HVgJfC4/hW/EHxjsHsdnw3m+Wjwo\njz+ReCKPcsao65DywTiqyxJGigrXl+/SUcCjtikCgYBze611plYI7jaSbxz1R1+F\nRz56pV0OMT4tasc7CcsFl8cpJ5yekJdV0AKueDT10AZc5UDwj1D/LrjObPzENZJO\njGQdSrHQsowhz9MSD4tAmDltrYYT3AwVK2XWjDiTzZ3fhk5m+/uMuTrXqvG9hNEs\n7bBKp8b9BZsYiqGtCTsyRw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@pushdemo-f910e.iam.gserviceaccount.com",
  "client_id": "108983058823628743392",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40pushdemo-f910e.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());

// POST API to send notifications
app.post("/send-notification", async (req, res) => {
  const { tokens, notification } = req.body;

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ error: "tokens array is required" });
  }

  const message = {
    notification: {
      title: notification?.title || "No Title",
      body: notification?.body || "No Body",
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    
    res.json({
      success: true,
      message: "Notification sent",
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));




const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./pushdemo-f910e-firebase-adminsdk-fbsvc-d80ddc0ab0.json");

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
    // const response = await admin.messaging().sendEachForMulticast(message);
    const response = await admin.messaging().sendMulticast(message);
    
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


// const express = require("express");
// const bodyParser = require("body-parser");
// const admin = require("firebase-admin");
// const serviceAccount = require("./pushdemo-f910e-firebase-adminsdk-fbsvc-0be56dcfc6.json"); // your service account JSON


// const app = express();
// app.use(bodyParser.json());

// // Initialize Firebase Admin
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // ✅ POST API to send notifications
// app.post("/send-notification", async (req, res) => {
//   const { tokens, notification } = req.body;
//   const title = notification?.title || "No Title";
//   const body = notification?.body || "No Body";

//   if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
//     return res.status(400).json({ error: "tokens array is required" });
//   }

//   const message = {
//     notification: { title, body },
//     tokens: tokens,
//   };

//   try {
//     const response = await admin.messaging().sendEachForMulticast(message);
//     res.json({
//       success: true,
//       message: "Notification sent",
//       successCount: response.successCount,
//       failureCount: response.failureCount,
//       responses: response.responses,
//     });
//   } catch (err) {
//     console.error("Error sending notification:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });







require("dotenv").config(); // Load .env locally
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Check env variable
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not defined!");
}


// Parse the JSON from env variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());

// POST API to send notifications
app.post("/send-notification", async (req, res) => {
  const { tokens, notification } = req.body;
  const title = notification?.title || req.body.title || "No Title";
  const body = notification?.body || req.body.body || "No Body";

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ error: "tokens array is required" });
  }

  const message = {
    notification: { title, body },
    tokens: tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message); // send to multiple devices
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

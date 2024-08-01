import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
// require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions", // Example endpoint
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Using the API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: question,
          max_tokens: 150,
        }),
      }
    );

    if (response.status === 401) {
      return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ error: errorData.error.message });
    }

    const data = await response.json();

    if (
      data.choices &&
      Array.isArray(data.choices) &&
      data.choices.length > 0
    ) {
      res.json({ answer: data.choices[0].text.trim() });
    } else {
      res.status(500).json({ error: "No choices found in API response" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data from OpenAI API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//

// still not working again

// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import fetch from "node-fetch";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// const PORT = process.env.PORT || 5000;

// app.post("/api/ask", async (req, res) => {
//   const { question } = req.body;

//   const response = await fetch(
//     "https://api.openai.com/v1/engines/davinci-codex/completions",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: question,
//         max_tokens: 150,
//       }),
//     }
//   );

//   const data = await response.json();
//   res.json({ answer: data.choices[0].text.trim() });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // the code below refused to work due to the ES require import. uncomment it and find out why

// // const express = require("express");
// // const bodyParser = require("body-parser");
// // const cors = require("cors");
// // const fetch = require("node-fetch");
// // require("dotenv").config();

// // const app = express();
// // app.use(bodyParser.json());
// // app.use(cors());

// // const PORT = process.env.PORT || 5000;

// // app.post("/api/ask", async (req, res) => {
// //   const { question } = req.body;

// //   const response = await fetch(
// //     "https://api.openai.com/v1/engines/davinci-codex/completions",
// //     {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         prompt: question,
// //         max_tokens: 150,
// //       }),
// //     }
// //   );

// //   const data = await response.json();
// //   res.json({ answer: data.choices[0].text });
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

async function fetchWithRetry(url, options, retries = 5, delay = 1000) {
  try {
    const response = await fetch(url, options);

    if (response.status === 429) {
      // Rate limit error: Retry after a delay
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      } else {
        throw new Error("Rate limit exceeded");
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetchWithRetry(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: question,
          max_tokens: 150,
        }),
      }
    );

    if (
      response.choices &&
      Array.isArray(response.choices) &&
      response.choices.length > 0
    ) {
      res.json({ answer: response.choices[0].text.trim() });
    } else {
      res.status(500).json({ error: "No choices found in API response" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.status(200).json(`server running successfully on ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

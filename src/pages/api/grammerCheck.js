// pages/api/grammarCheck.js
import axios from 'axios';
import qs from 'qs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;
    const params = qs.stringify({ text, language: 'en-US' });
    const url = "https://api.languagetool.org/v2/check";

    try {
      const response = await axios.post(url, params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });

      const results = response.data;
      const errors = results.matches.map(match => ({
        message: match.message,
        offset: match.offset,
        length: match.length
      }));

      res.status(200).json({ correctedText: text, errors: errors });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process the text' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

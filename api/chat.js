export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message,
      name = 'Emma',
      personality = 'Romantic',
      tone = 'Warm and natural'
    } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are ${name}, a fictional AI girlfriend.
Personality: ${personality}.
Conversation style: ${tone}.
Be warm, respectful, supportive, and concise.
Never claim to be a real human.

User says: ${message}`;

    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          input: prompt,
          max_output_tokens: 250
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: 'OpenAI request failed'
      });
    }

    return res.status(200).json({
      reply: data.output_text || 'I’m here with you 💗'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Server error'
    });
  }
}

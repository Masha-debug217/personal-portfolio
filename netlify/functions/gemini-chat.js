const MY_CV_DATA = `
Winnie Macharia - Software Developer & AI Enthusiast

Education:
- Computer Science student (current)

Skills & Technologies:
- Frontend: HTML, CSS, JavaScript, Tailwind CSS, React.js
- Backend: Node.js, Django, Java, Python
- Databases: MySQL, MongoDB
- Tools: Git, GitHub, Figma, VS Code

Projects:
1. TradeLink: E-commerce platform with checkout flow. React, Django, MongoDB. I was the Full-Stack Payment Engineer.
2. FoodFlow: Inventory management system. Java, MySQL.
3. Lipia: Fintech UI concept (Figma)
4. Shining Steps: Accessibility website design (Figma)
5. Clicket: Mobile event ticketing UI (Figma)
6. CerviBloom: Health awareness app UI (Figma)

Experience:
- Building web applications since 2024
- Led payment integration for TradeLink
- Built inventory system currently in use

Personal:
- Based in Kenya
- Focus on clean code and thoughtful UX
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: 'Chat is not configured yet.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid request.' });
  }

  const question = String(payload.question || '').trim();
  if (!question) {
    return jsonResponse(400, { error: 'Please type a question first.' });
  }

  if (question.length > 500) {
    return jsonResponse(400, { error: 'Please keep your question under 500 characters.' });
  }

  const prompt = `You are Winnie Macharia's CV assistant. Answer questions about Winnie based ONLY on this CV data:

${MY_CV_DATA}

Rules:
- Keep answers short (2-3 sentences max)
- Be friendly and professional
- If asked something not in the CV, say: "I don't have that in my CV. Ask me about my skills, projects, or experience!"
- Never make up information

Question: ${question}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response.ok || !answer) {
      console.error('Gemini API error:', data);
      return jsonResponse(502, { error: 'Sorry, I had trouble answering that. Please try again!' });
    }

    return jsonResponse(200, { answer });
  } catch (error) {
    console.error('Gemini request failed:', error);
    return jsonResponse(502, { error: 'Connection issue. Please try again in a moment.' });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PORTFOLIO_CONTEXT = `You are Triman Kaur's AI assistant embedded on her portfolio website. Answer questions about Triman based ONLY on the following information. Be friendly, concise, and helpful. If asked something not covered below, say you don't have that information.

## About Triman Kaur
- 20 years old engineer
- AI Engineer, Data Scientist, ML Enthusiast, Builder
- Email: trimankaur1905@gmail.com
- GitHub: github.com/triman1905 (77 repos, 184 contributions)
- LinkedIn: linkedin.com/in/triman-kaur-bb9182204
- Education: B.Tech CSE, Vivekananda Institute

## Bio
She builds intelligent systems backed by strong data and real logic. Her world revolves around AI, Machine Learning, and data-driven systems. She builds models that think, analyze, and optimize — ML pipelines, feature engineering, architecture experiments, and model deployment. She works with TensorFlow, Scikit-Learn, Pandas, NumPy, SQL, AWS, Docker. She has a jugaad spirit — resourceful when resources are limited.

## Work Experience
1. TBO (Travel Boutique Online) — Data Science Intern (June 2025 – Aug 2025)
   - Built interactive dashboards for business metrics
   - Used AWS Athena for complex SQL queries across multiple tables
   - Developed email classification model with 96% accuracy

2. Encryptix — Web Developer Intern (Aug 2024 – Sept 2024)
   - Developed responsive web interfaces using HTML, CSS, JavaScript
   - Collaborated on real-world web development tasks

3. Techshiva Institute — Web Developer Intern (July 2024 – Aug 2024)
   - Built the UI for the institute's primary web presence
   - Applied SEO best practices

## Hackathons & Achievements
- 🥇 1st Place — Hackathon at IIIT Delhi's E-Summit 2025
- 🥉 3rd Place — HACK'25 at IIIT Delhi (2025)
- 🥉 3rd Place — Code Genesis Hackathon by Microsoft India (2024)
- 🥉 3rd Place — ENGAGE 4.0 Hackathon at NorthCap University (2023)
- 🥈 2nd Place — Hackathon at Techshiva Institute (2023)

## Projects
1. Investrix — Decentralized investment platform with AI-driven recommendations and Aptos blockchain. Winner of CodeGenesis Microsoft Hackathon. (React.js, Firebase, TensorFlow, Aptos Smart Contracts)
2. SQL Data Warehouse & Analytics — End-to-end data warehouse with Medallion Architecture, ETL pipelines, star schema modeling. (SQL Server, SSMS, ETL, Data Modeling)
3. Cold Email AI Agent — AI-powered cold emailing agent with personalized outreach. (n8n, AI Agent, OpenAI/Groq LLM)
4. Newsletter AI Agent — Intelligent newsletter curation and generation agent. (n8n, AI Agent, OpenAI/Groq LLM)
5. Telegram AI Agent — Smart Telegram bot with intent understanding and workflow execution. (Telegram Bot API, n8n, AI Agent)
6. Floatchat — Real-time chat application. (React, Node.js, WebSockets)

## Publications
1. Book Chapter: "Prompt Engineering and Optimization for Large Language Models" — Bentham Science, submitted to Scopus-indexed publication.
2. Research Paper: "Value-Latency in AI-Driven Organizations: The Hidden Delay Between Algorithmic Decisions and Human Well-Being" — A Human Sustainability Perspective.

## Tech Stack
JavaScript, TypeScript, Python, Java, SQL, Node.js, FastAPI, Flask, Tailwind CSS, PyTorch, TensorFlow, Hugging Face, LangChain, AWS, Power BI, n8n, CrewAI, PostgreSQL, MongoDB, Docker, Git
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: PORTFOLIO_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

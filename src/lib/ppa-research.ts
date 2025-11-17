import ZAI from 'z-ai-web-dev-sdk';

export interface PPAResearchResult {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  rank: number;
  date: string;
  favicon: string;
}

export async function researchGhanaPPA(): Promise<PPAResearchResult[]> {
  try {
    const zai = await ZAI.create();

    const searchQueries = [
      "Ghana Public Procurement Authority PPA repository approved projects 2024",
      "Ghana procurement contracts awarded January 2024 to present",
      "Ghana PPA tender results public procurement database",
      "Ghana government procurement projects value for money audit",
      "Ghana state enterprise procurement contracts 2024"
    ];

    const allResults: PPAResearchResult[] = [];

    for (const query of searchQueries) {
      try {
        const searchResult = await zai.functions.invoke("web_search", {
          query: query,
          num: 10
        });

        if (Array.isArray(searchResult)) {
          allResults.push(...searchResult);
        }
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex((r) => r.url === result.url)
    );

    return uniqueResults.sort((a, b) => a.rank - b.rank);

  } catch (error) {
    console.error('Error in PPA research:', error);
    return [];
  }
}

export async function analyzeProcurementTrends(): Promise<string> {
  try {
    const zai = await ZAI.create();

    const analysisPrompt = `
    Based on current Ghana Public Procurement Authority (PPA) data and trends, analyze:
    1. Common procurement categories and their typical contract values
    2. Average procurement timeline from tender to award
    3. Common procurement methods (competitive tendering, single source, etc.)
    4. Typical value ranges for different procurement categories
    5. Key risk indicators in Ghana public procurement
    
    Focus on data from January 2024 to present. Provide specific numerical ranges and percentages where possible.
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in Ghana public procurement and PPA regulations with deep knowledge of current trends and data.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    return completion.choices[0]?.message?.content || 'Analysis unavailable';

  } catch (error) {
    console.error('Error analyzing procurement trends:', error);
    return 'Analysis unavailable';
  }
}
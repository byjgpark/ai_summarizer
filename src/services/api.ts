interface SummaryRequest {
    text: string;
    type?: 'text' | 'url' | 'youtube';
    language?: string;
  }
  
  interface SummaryResponse {
    summarization: string;
    error?: string;
  }
  
  export const createSummary = async (data: SummaryRequest): Promise<SummaryResponse> => {
    try {
      console.log("check data", data)

      const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_URL}/all-ai-summarizer/us-central1/createTextSummary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text : data.text}),
      });
      
      console.log("check response", response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating summary:', error);
      throw error;
    }
  };
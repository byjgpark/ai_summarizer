interface SummaryTextRequest {
    text: string;
    language?: string;
  }

  interface SummaryPdfRequest {
    pdf: File;
    language?: string;
  }
  
  interface SummaryResponse {
    summarization: string;
    error?: string;
  }

  interface SummaryYoutubeRequest {
    url: string;
    language?: string;
  }
  
  export const createTextSummary = async (data: SummaryTextRequest): Promise<SummaryResponse> => {
    try {
        console.log("check data from api :", data)

        const response = await fetch(`https://createtextsummary-${process.env.NEXT_PUBLIC_DEV_URL}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text : data.text}),
        });

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

  export const createPdfSummary = async (data: SummaryPdfRequest): Promise<SummaryResponse> => {
    try {
      if (!data.pdf) {
        throw new Error('PDF file is required');
      }

      const formData = new FormData();
      formData.append('pdf', data.pdf);
      
      if (data.language) {
        formData.append('language', data.language);
      }

       // Log the PDF file from FormData
       const pdfFile = formData.get('pdf') as File;
       console.log('PDF File:', {
         name: pdfFile.name,
         size: pdfFile.size,
         type: pdfFile.type
       });
 
       if (data.language) {
        formData.append('language', data.language);
      }

      const response = await fetch(
        `https://createpdfsummary-${process.env.NEXT_PUBLIC_DEV_URL}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating PDF summary:', error);
      throw error;
    }
  };

  export const createYoutubeSummary = async (data: SummaryYoutubeRequest): Promise<SummaryResponse> => {
    try {

        const response = await fetch(`https://createyoutubesummary-${process.env.NEXT_PUBLIC_DEV_URL}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({youtubeUrl : data.url}),
        });

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
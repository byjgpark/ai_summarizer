import { YoutubeTranscript } from 'youtube-transcript';

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
      // Extract video ID from URL
      const videoId = extractYoutubeVideoId(data.url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Get transcript
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      const fullText = transcript.map((item: { text: string }) => item.text).join(' ');

      debugger;

      // console.log('Full Text:', fullText);
      const devUrl = `${process.env.NEXT_PUBLIC_DEV_URL}/us-central1/createYoutubeSummary`
      
      // Send transcript for summarization
      const response = await fetch(devUrl, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl: data.url,
          transcript: fullText,
          language: data.language
        }),
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

  // Helper function to extract video ID from YouTube URL
  const extractYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
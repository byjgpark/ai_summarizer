'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useSummary } from '@/hooks/useSummary';
import { FileText, FileUp, Sparkles, Sun, Moon, Menu } from "lucide-react"
import Link from 'next/link'

export default function Summarizer() {
  const [activeTab, setActiveTab] = useState('text')
  // const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [animatedText, setAnimatedText] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');

  const { summary, error, loading ,text, setSummary, setError, setLoading, setText, generateTextSummary, generatePdfSummary } = useSummary();

  useEffect(() => {
    const text = "AI Content Summarizer"
    let i = 0
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setAnimatedText((prev) => prev + text.charAt(i))
        i++
      } else {

        clearInterval(intervalId)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfFileName(file.name);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.error('No file selected');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      setPdfFile(null);
      setPdfFileName('');
      return;
    }

    // Validate file size (e.g., 10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      alert('File is too large. Please upload a file smaller than 10MB');
      setPdfFile(null);
      setPdfFileName('');
      return;
    }

    console.log('Selected file:', file);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    setPdfFile(file);
    setPdfFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (activeTab === 'text') {
        await generateTextSummary(text, 'en');
      } else if (activeTab === 'pdf' && pdfFile) {
        console.log('Submitting PDF file:', pdfFile);
        const response = await generatePdfSummary(pdfFile, 'en');
        console.log('PDF Summary response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`py-4 px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            AI Summarizer
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>Pricing</Link>
            <Link href="/about" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>About</Link>
            <Link href="/login" className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md transition-colors duration-300`}>Login</Link>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {isMenuOpen && (
          <div className={`md:hidden mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Link href="/pricing" className={`block py-2 px-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>Pricing</Link>
            <Link href="/about" className={`block py-2 px-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>About</Link>
            <Link href="/login" className={`block py-2 px-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>Login</Link>
            <div className="flex items-center space-x-2 py-2 px-4">
              <Sun className="h-4 w-4" />
              <Switch id="theme-toggle-mobile" checked={isDarkMode} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600' : 'text-blue-600'}`}>
            {animatedText}
          </h1>
          
          <Card className={`w-full ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>Summarize Your Content</span>
              </CardTitle>
              <CardDescription className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter text, upload a PDF, or provide a YouTube link to get an AI-powered summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <form action="/profile" onSubmit={handleSubmit} encType="multipart/form-data" method="post">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className={`grid w-full grid-cols-3 mb-6 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <TabsTrigger value="text" className={`${isDarkMode ? 'data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400' : 'data-[state=active]:bg-white data-[state=active]:text-blue-600'}`}>Text</TabsTrigger>
                    <TabsTrigger value="pdf" className={`${isDarkMode ? 'data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400' : 'data-[state=active]:bg-white data-[state=active]:text-blue-600'}`}>PDF</TabsTrigger>
                    <TabsTrigger value="youtube" className={`${isDarkMode ? 'data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400' : 'data-[state=active]:bg-white data-[state=active]:text-blue-600'}`}>YouTube</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text">
                    <Textarea 
                      placeholder="Enter your text here..." 
                      className={`min-h-[150px] sm:min-h-[200px] ${isDarkMode ? 'bg-gray-700/30 border-gray-600 focus:border-blue-400 focus:ring-blue-400/50 placeholder-gray-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500/50 placeholder-gray-400'}`}
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                    />
                  </TabsContent>
                  <TabsContent value="pdf">
                    <div className="flex flex-col items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer 
                        ${isDarkMode 
                          ? 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        } transition-colors duration-300`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {pdfFileName ? (
                            <>
                              <FileText className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <p className={`mb-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Selected file: {pdfFileName}
                              </p>
                              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Click to change file
                              </p>
                            </>
                          ) : (
                            <>
                              <FileUp className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <p className={`mb-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                PDF (MAX. 10MB)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          name="pdf"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                      
                      {/* Optional: Add error message display */}
                      {error && (
                        <p className="mt-2 text-sm text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="youtube">
                    <Input 
                      type="url" 
                      placeholder="Enter YouTube video URL" 
                      className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600 focus:border-blue-400 focus:ring-blue-400/50 placeholder-gray-500' : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500/50 placeholder-gray-400'}`}
                    />
                  </TabsContent>
                </Tabs>
                <Button 
                  className={`w-full mt-6 ${isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-blue-600 hover:bg-blue-700'} transition-all duration-300 transform hover:scale-105`}
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Summarizing...
                    </span>
                  ) : (
                    'Summarize'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {summary && (
            <Card className={`w-full mt-8 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <FileText className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span>Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4">
                <div className={`whitespace-pre-wrap text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{summary}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 px-4 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 AI Summarizer. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
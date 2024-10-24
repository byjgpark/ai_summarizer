'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileUp, Youtube } from "lucide-react"

export default function Summarizer() {
  const [activeTab, setActiveTab] = useState('text')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSummary("This is a sample summary of the content you provided. In a real application, this would be the result returned from your AI summarization service.")
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Content Summarizer</h1>
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Summarize Your Content</CardTitle>
          <CardDescription>Enter text, upload a PDF, or provide a YouTube link to get a summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="pdf">PDF</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <Textarea 
                  placeholder="Enter your text here..." 
                  className="min-h-[200px]"
                />
              </TabsContent>
              <TabsContent value="pdf">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept=".pdf" />
                  </label>
                </div>
              </TabsContent>
              <TabsContent value="youtube">
                <Input type="url" placeholder="Enter YouTube video URL" />
              </TabsContent>
            </Tabs>
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? 'Summarizing...' : 'Summarize'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {summary && (
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QueryInterface from "@/components/QueryInterface";
import AdminPanel from "@/components/AdminPanel";
import StatusDashboard from "@/components/StatusDashboard";
import MedicalSources from "@/components/MedicalSources";
import EducationGenerator from "@/components/EducationGenerator";
import FileManager from "@/components/FileManager";
import { MessageSquare, Shield, Activity, Book, GraduationCap, FolderOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Mon AI
                </h1>
                <p className="text-sm text-gray-600">Medical AI & Smart Education Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="chat" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Files</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center space-x-2">
              <Book className="h-4 w-4" />
              <span>Sources</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  AI-Powered Medical Assistant
                </CardTitle>
                <CardDescription className="text-lg">
                  Get comprehensive medical answers with evidence-based citations from trusted sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QueryInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Intelligent Education Content Generator
                </CardTitle>
                <CardDescription className="text-lg">
                  Transform any content into smart flashcards and MCQs with AI-powered concept extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EducationGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Knowledge Base Administration
                </CardTitle>
                <CardDescription className="text-lg">
                  Upload and manage documents to expand the AI's knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Knowledge Base File Manager
                </CardTitle>
                <CardDescription className="text-lg">
                  Search, view, and manage all uploaded documents and extracted content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Medical Knowledge Sources
                </CardTitle>
                <CardDescription className="text-lg">
                  Trusted sources, medical textbooks, and reference materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MedicalSources />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <StatusDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

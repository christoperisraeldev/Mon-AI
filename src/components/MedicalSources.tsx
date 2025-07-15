// src/components/MedicalSources.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Book, Shield, Globe } from "lucide-react";
import { MEDICAL_SOURCES, BILLING_CODES } from '@/services/llmService';

const MedicalSources = () => {
  const handleSourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Medical Knowledge Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trusted" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trusted">Trusted Sources</TabsTrigger>
              <TabsTrigger value="books">Medical Textbooks</TabsTrigger>
              <TabsTrigger value="billing">Billing Codes</TabsTrigger>
            </TabsList>

            <TabsContent value="trusted" className="space-y-4">
              <div className="grid gap-4">
                {MEDICAL_SOURCES.trusted.map((source, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Globe className="h-4 w-4 text-green-600" />
                            <h3 className="font-semibold text-gray-900">{source.title}</h3>
                          </div>
                          {source.url && (
                            <button 
                              onClick={() => handleSourceClick(source.url)}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 transition-colors hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Visit Website</span>
                            </button>
                          )}
                          {source.api && (
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                API Available
                              </Badge>
                            </div>
                          )}
                          {source.pattern && (
                            <div className="mt-1 text-xs text-gray-500">
                              Includes: {source.pattern}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="books" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MEDICAL_SOURCES.books.map((book, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSourceClick(book.url)}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <Book className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{book.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            Available Online
                          </Badge>
                          <ExternalLink className="h-3 w-3 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These textbooks are available for purchase from various medical book retailers. 
                  Click on any book to view purchasing options and more information.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              {Object.entries(BILLING_CODES).map(([specialty, codes]) => (
                <Card key={specialty} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg">{specialty}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(codes).map(([code, description]) => (
                        <div key={code} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                          <Badge variant="outline" className="font-mono">
                            Item {code}
                          </Badge>
                          <span className="text-sm text-gray-700 flex-1 ml-4">{description}</span>
                          <button
                            onClick={() => handleSourceClick(`https://www9.health.gov.au/mbs/search.cfm?q=${code}`)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>MBS Details</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Medical Disclaimer</p>
              <p>
                This system provides educational information and should not replace professional medical advice. 
                Always consult with qualified healthcare professionals for medical decisions. The AI responses are 
                based on training data and may not reflect the most current medical guidelines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalSources;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Server, 
  Database, 
  Globe,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const StatusDashboard = () => {
  const apiStats = {
    uptime: 99.94,
    responseTime: 245,
    requestsPerMinute: 42,
    rateLimitUsage: 65,
    errors: 0.06
  };

  const tierStats = [
    {
      tier: 'Custom Knowledge Base',
      icon: <Database className="h-5 w-5" />,
      status: 'operational',
      avgResponseTime: 180,
      timeout: '2s',
      threshold: '0.8 similarity',
      successRate: 94.2
    },
    {
      tier: 'Academic Sources',
      icon: <Server className="h-5 w-5" />,
      status: 'operational',
      avgResponseTime: 3200,
      timeout: '4s',
      threshold: '0.7 relevance',
      successRate: 87.8
    },
    {
      tier: 'Web Search',
      icon: <Globe className="h-5 w-5" />,
      status: 'operational',
      avgResponseTime: 2100,
      timeout: '3s',
      threshold: 'fallback',
      successRate: 96.1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-900">
            <CheckCircle className="h-6 w-6" />
            <span>All Systems Operational</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{apiStats.uptime}%</div>
              <div className="text-sm text-green-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{apiStats.responseTime}ms</div>
              <div className="text-sm text-green-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{apiStats.requestsPerMinute}</div>
              <div className="text-sm text-green-600">Requests/min</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{apiStats.errors}%</div>
              <div className="text-sm text-green-600">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{apiStats.rateLimitUsage}%</div>
              <div className="text-sm text-green-600">Rate Limit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Query Endpoint Rate Limit</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>60 requests/minute</span>
                <span>{apiStats.rateLimitUsage}% used</span>
              </div>
              <Progress value={apiStats.rateLimitUsage} className="h-2" />
              <div className="text-xs text-gray-500">
                39 requests remaining in current window
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Admin Endpoint Rate Limit</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>10 requests/minute</span>
                <span>20% used</span>
              </div>
              <Progress value={20} className="h-2" />
              <div className="text-xs text-gray-500">
                8 requests remaining in current window
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Status */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Tier Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tierStats.map((tier, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {tier.icon}
                    <h3 className="font-semibold">{tier.tier}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(tier.status)}
                    <Badge className={getStatusColor(tier.status)}>
                      {tier.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Response Time</div>
                    <div className="font-medium">{tier.avgResponseTime}ms avg</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Timeout</div>
                    <div className="font-medium">{tier.timeout}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Threshold</div>
                    <div className="font-medium">{tier.threshold}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Success Rate</div>
                    <div className="font-medium">{tier.successRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>API Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Query Endpoint</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Endpoint:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">POST /api/v1/query</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate Limit:</span>
                  <span>60 requests/minute</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Response Time:</span>
                  <span>&lt; 8 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compression:</span>
                  <span>gzip, deflate</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Admin Endpoint</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Endpoint:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">POST /api/v1/admin/knowledge</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate Limit:</span>
                  <span>10 requests/minute</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max File Size:</span>
                  <span>10MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auth Required:</span>
                  <span>X-API-Key header</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusDashboard;

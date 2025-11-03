"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Brain,
  Loader2,
  Filter
} from "lucide-react";

interface ComprehensiveProcurement {
  id: string;
  title: string;
  description: string;
  category: string;
  value: number;
  status: string;
  riskLevel: string;
  entityId: string;
  entityName: string;
  procurementMethod: string;
  publicationDate: string;
  deadlineDate: string;
  awardDate?: string;
  supplier?: string;
  complianceScore: number;
  violations: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
}

interface ProcurementAnalytics {
  totalValue: number;
  complianceRate: number;
  violationCount: number;
  categoryDistribution: Record<string, number>;
  riskDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}

interface AIAgentAnalysis {
  insights: string[];
  recommendations: string[];
  violations: Array<{
    type: string;
    description: string;
    severity: string;
    responsible: string;
  }>;
  confidence: number;
}

export function ComprehensiveProcurementDashboard() {
  const [procurements, setProcurements] = useState<ComprehensiveProcurement[]>([]);
  const [analytics, setAnalytics] = useState<ProcurementAnalytics | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAgentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedProcurement, setSelectedProcurement] = useState<ComprehensiveProcurement | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    riskLevel: 'all',
    entityId: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    showOnlyViolations: false,
    showOnlyHighRisk: false
  });

  useEffect(() => {
    fetchProcurementData();
  }, [filters]);

  const fetchProcurementData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.riskLevel !== 'all') params.append('riskLevel', filters.riskLevel);
      if (filters.entityId !== 'all') params.append('entityId', filters.entityId);
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
      if (filters.minAmount) params.append('minAmount', filters.minAmount);
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
      if (filters.showOnlyViolations) params.append('showOnlyViolations', 'true');
      if (filters.showOnlyHighRisk) params.append('showOnlyHighRisk', 'true');

      const response = await fetch(`/api/procurement-dashboard?${params}`);
      const result = await response.json();
      
      // Handle the actual API response structure
      if (result.success && result.data) {
        setProcurements(result.data.recentProcurements || []);
        setAnalytics(result.data.analytics || null);
      } else {
        // Fallback for different response structure
        setProcurements(result.procurements || []);
        setAnalytics(result.analytics || null);
      }
    } catch (error) {
      console.error('Error fetching procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAIAnalysis = async () => {
    try {
      setAiLoading(true);
      
      const response = await fetch('/api/procurement-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procurements: filteredProcurements,
          filters
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const aiResult = await response.json();
      setAiAnalysis(aiResult);
    } catch (error) {
      console.error('Error running AI analysis:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredProcurements = procurements.filter(procurement => {
    if (filters.category !== "all" && procurement.category !== filters.category) return false;
    if (filters.status !== "all" && procurement.status !== filters.status) return false;
    if (filters.riskLevel !== "all" && procurement.riskLevel !== filters.riskLevel) return false;
    if (filters.entityId !== "all" && procurement.entityId !== filters.entityId) return false;
    if (filters.minAmount && procurement.value < parseInt(filters.minAmount)) return false;
    if (filters.maxAmount && procurement.value > parseInt(filters.maxAmount)) return false;
    if (filters.showOnlyViolations && (procurement.riskLevel !== "CRITICAL" && procurement.riskLevel !== "HIGH")) return false;
    if (filters.showOnlyHighRisk && (procurement.riskLevel !== "HIGH" && procurement.riskLevel !== "CRITICAL")) return false;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return `GHS ${(amount / 1000000).toFixed(1)}M`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "SUSPENDED": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Procurement Intelligence Dashboard</h1>
                <p className="text-muted-foreground">
                  Comprehensive procurement monitoring and analysis
                </p>
              </div>
            </div>
            <Badge variant="outline">{procurements.length} Procurements</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Procurements</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{procurements.length}</div>
              <p className="text-xs text-muted-foreground">
                Active procurements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics ? formatCurrency(analytics.totalValue) : 'GHS 0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Total procurement value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics ? analytics.complianceRate : 0}%</div>
              <p className="text-xs text-muted-foreground">
                Overall compliance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Violations</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics ? analytics.violationCount : 0}</div>
              <p className="text-xs text-muted-foreground">
                Detected violations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Procurements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Recent Procurements
                  </CardTitle>
                  <CardDescription>
                    Latest procurement activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {procurements.slice(0, 10).map((procurement) => (
                      <div key={procurement.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{procurement.title}</h4>
                            <Badge variant="secondary">{procurement.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{procurement.entityName}</span>
                            <span>{formatCurrency(procurement.value)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(procurement.status)}>
                            {procurement.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Category Distribution
                  </CardTitle>
                  <CardDescription>
                    Procurement distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics && Object.entries(analytics.categoryDistribution || {}).map(([category, count]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm">{count}</span>
                        </div>
                        <Progress value={(count / procurements.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                  <CardDescription>
                    Risk levels across procurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics && Object.entries(analytics.riskDistribution || {}).map(([level, count]) => (
                      <div key={level} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{level}</span>
                          <span className="text-sm">{count}</span>
                        </div>
                        <Progress value={(count / procurements.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Current status of all procurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics && Object.entries(analytics.statusDistribution || {}).map(([status, count]) => (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                          <span className="text-sm">{count}</span>
                        </div>
                        <Progress value={(count / procurements.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Detected Violations
                </CardTitle>
                <CardDescription>
                  Procurement violations and compliance issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {procurements.filter(p => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH').map((procurement) => (
                    <div key={procurement.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{procurement.title}</h4>
                          <Badge variant="destructive">{procurement.riskLevel}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{procurement.entityName}</span>
                          <span>{formatCurrency(procurement.value)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Analysis
                </CardTitle>
                <CardDescription>
                  Advanced AI analysis of procurement patterns and risks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!aiAnalysis ? (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">AI Analysis Not Available</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Run the AI analysis to get comprehensive insights, violation detection, and recommendations
                      </p>
                      <Button onClick={runAIAnalysis} disabled={aiLoading}>
                        {aiLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Brain className="h-4 w-4 mr-2" />
                        )}
                        {aiLoading ? 'Analyzing...' : 'Run AI Analysis'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* AI Analysis Results */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Key Insights</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {aiAnalysis.insights.map((insight, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  <p className="text-sm">{insight}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Recommendations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {aiAnalysis.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <p className="text-sm">{recommendation}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Violations Detected */}
                      {aiAnalysis.violations.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Violations Detected</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {aiAnalysis.violations.map((violation, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 border rounded-lg border-red-200 bg-red-50">
                                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{violation.type}</p>
                                    <p className="text-xs text-muted-foreground">{violation.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">{violation.severity}</Badge>
                                      <span className="text-xs text-muted-foreground">Confidence: {violation.confidence}%</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
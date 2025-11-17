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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Filter,
  PiggyBank,
  Target,
  Shield,
  Eye,
  Download,
  RefreshCw,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Award,
  FileText,
  Calculator
} from "lucide-react";

interface ProcurementProject {
  id: string;
  entityId: string;
  procurementId: string;
  ppaReference: string;
  title: string;
  description: string;
  category: string;
  procurementType: string;
  procurementMethod: string;
  value: number;
  currency: string;
  publishedDate: string;
  closingDate: string;
  awardDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  supplier?: string;
  supplierCountry?: string;
  isLocalSupplier: boolean;
  bidsReceived?: number;
  evaluationPeriod?: number;
  vfmScore?: number;
  economyScore?: number;
  efficiencyScore?: number;
  effectivenessScore?: number;
  equityScore?: number;
  riskLevel: string;
  potentialSavings?: number;
  consolidationOpportunity: boolean;
  ppaApproval: boolean;
  status: string;
}

interface VFMAuditResult {
  overallScore: number;
  economy: {
    score: number;
    factors: Array<{
      factor: string;
      score: number;
      weight: number;
      analysis: string;
      recommendations: string[];
    }>;
  };
  efficiency: {
    score: number;
    factors: Array<{
      factor: string;
      score: number;
      weight: number;
      analysis: string;
      recommendations: string[];
    }>;
  };
  effectiveness: {
    score: number;
    factors: Array<{
      factor: string;
      score: number;
      weight: number;
      analysis: string;
      recommendations: string[];
    }>;
  };
  equity: {
    score: number;
    factors: Array<{
      factor: string;
      score: number;
      weight: number;
      analysis: string;
      recommendations: string[];
    }>;
  };
  savings: {
    identified: number;
    realized: number;
    potential: number;
    categories: Array<{
      type: string;
      amount: number;
      justification: string;
      implementation: string;
    }>;
  };
  riskAssessment: {
    overall: string;
    factors: Array<{
      risk: string;
      level: string;
      impact: string;
      mitigation: string;
    }>;
  };
  recommendations: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    recommendation: string;
    expectedSavings?: number;
    implementation: string;
    timeline: string;
  }>;
}

interface ProcurementAnalytics {
  totalProjects: number;
  totalValue: number;
  averageVfmScore: number;
  totalIdentifiedSavings: number;
  totalPotentialSavings: number;
  ppaComplianceRate: number;
  localContentRate: number;
  categoryDistribution: Record<string, number>;
  riskDistribution: Record<string, number>;
  methodDistribution: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    value: number;
    projects: number;
    savings: number;
  }>;
}

export function EnhancedProcurementDashboard() {
  const [procurements, setProcurements] = useState<ProcurementProject[]>([]);
  const [analytics, setAnalytics] = useState<ProcurementAnalytics | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProcurementProject | null>(null);
  const [vfmAudit, setVfmAudit] = useState<VFMAuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    method: 'all',
    riskLevel: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    showOnlySavings: false,
    showOnlyHighRisk: false,
    showOnlyLocal: false
  });

  useEffect(() => {
    fetchProcurementData();
  }, [filters]);

  const fetchProcurementData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all' && value !== '' && value !== false) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/enhanced-procurement-dashboard?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setProcurements(result.procurements || []);
        setAnalytics(result.analytics || null);
      }
    } catch (error) {
      console.error('Error fetching procurement data:', error);
      // Load fallback data
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = async () => {
    // Load fallback procurement data
    const fallbackProcurements: ProcurementProject[] = [
      {
        id: "1",
        entityId: "gctu",
        procurementId: "GCTU-LIB-001",
        ppaReference: "PPA/2024/0001",
        title: "Upgrading of GCTU Library at Tesano Campus",
        description: "Complete renovation and modernization of the main library facility including digital infrastructure",
        category: "WORKS",
        procurementType: "OPEN_TENDER",
        procurementMethod: "COMPETITIVE_TENDERING",
        value: 8500000,
        currency: "GHS",
        publishedDate: "2024-01-15",
        closingDate: "2024-02-28",
        awardDate: "2024-03-15",
        contractStartDate: "2024-04-01",
        contractEndDate: "2024-12-31",
        supplier: "BuildRight Construction Ltd",
        supplierCountry: "Ghana",
        isLocalSupplier: true,
        bidsReceived: 8,
        evaluationPeriod: 15,
        vfmScore: 78,
        economyScore: 75,
        efficiencyScore: 80,
        effectivenessScore: 82,
        equityScore: 76,
        riskLevel: "MEDIUM",
        potentialSavings: 425000,
        consolidationOpportunity: false,
        ppaApproval: true,
        status: "AWARDED"
      },
      {
        id: "2",
        entityId: "moh",
        procurementId: "MOH-MED-042",
        ppaReference: "PPA/2024/0042",
        title: "Procurement of Medical Equipment for Regional Hospitals",
        description: "Supply and installation of medical diagnostic equipment for 5 regional hospitals",
        category: "GOODS",
        procurementType: "RESTRICTED_TENDER",
        procurementMethod: "RESTRICTED_TENDERING",
        value: 12500000,
        currency: "GHS",
        publishedDate: "2024-02-10",
        closingDate: "2024-03-25",
        awardDate: "2024-04-10",
        contractStartDate: "2024-05-01",
        contractEndDate: "2024-08-31",
        supplier: "MedEquip Ghana Ltd",
        supplierCountry: "Ghana",
        isLocalSupplier: true,
        bidsReceived: 5,
        evaluationPeriod: 16,
        vfmScore: 82,
        economyScore: 85,
        efficiencyScore: 78,
        effectivenessScore: 84,
        equityScore: 81,
        riskLevel: "LOW",
        potentialSavings: 625000,
        consolidationOpportunity: true,
        ppaApproval: true,
        status: "AWARDED"
      },
      {
        id: "3",
        entityId: "moe",
        procurementId: "MOE-ICT-089",
        ppaReference: "PPA/2024/0089",
        title: "Supply of Computers for Senior High Schools",
        description: "Provision of 5,000 computers for 100 senior high schools under the World Bank project",
        category: "IT_HARDWARE",
        procurementType: "OPEN_TENDER",
        procurementMethod: "COMPETITIVE_TENDERING",
        value: 15600000,
        currency: "GHS",
        publishedDate: "2024-03-05",
        closingDate: "2024-04-20",
        awardDate: "2024-05-05",
        contractStartDate: "2024-06-01",
        contractEndDate: "2024-09-30",
        supplier: "DEXT TECHNOLOGY LIMITED",
        supplierCountry: "Ghana",
        isLocalSupplier: true,
        bidsReceived: 12,
        evaluationPeriod: 15,
        vfmScore: 75,
        economyScore: 72,
        efficiencyScore: 78,
        effectivenessScore: 76,
        equityScore: 74,
        riskLevel: "MEDIUM",
        potentialSavings: 780000,
        consolidationOpportunity: true,
        ppaApproval: true,
        status: "AWARDED"
      }
    ];

    setProcurements(fallbackProcurements);
    
    const fallbackAnalytics: ProcurementAnalytics = {
      totalProjects: fallbackProcurements.length,
      totalValue: fallbackProcurements.reduce((sum, p) => sum + p.value, 0),
      averageVfmScore: fallbackProcurements.reduce((sum, p) => sum + (p.vfmScore || 0), 0) / fallbackProcurements.length,
      totalIdentifiedSavings: fallbackProcurements.reduce((sum, p) => sum + (p.potentialSavings || 0), 0),
      totalPotentialSavings: fallbackProcurements.reduce((sum, p) => sum + (p.potentialSavings || 0), 0),
      ppaComplianceRate: 100,
      localContentRate: (fallbackProcurements.filter(p => p.isLocalSupplier).length / fallbackProcurements.length) * 100,
      categoryDistribution: {
        "WORKS": 1,
        "GOODS": 1,
        "IT_HARDWARE": 1
      },
      riskDistribution: {
        "LOW": 1,
        "MEDIUM": 2
      },
      methodDistribution: {
        "COMPETITIVE_TENDERING": 2,
        "RESTRICTED_TENDERING": 1
      },
      monthlyTrends: []
    };
    
    setAnalytics(fallbackAnalytics);
  };

  const performVFMAudit = async (project: ProcurementProject) => {
    try {
      setAuditLoading(true);
      setSelectedProject(project);
      
      const response = await fetch('/api/vfm-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform VFM audit');
      }

      const auditResult = await response.json();
      setVfmAudit(auditResult);
    } catch (error) {
      console.error('Error performing VFM audit:', error);
      // Generate fallback audit
      setVfmAudit(generateFallbackAudit(project));
    } finally {
      setAuditLoading(false);
    }
  };

  const generateFallbackAudit = (project: ProcurementProject): VFMAuditResult => {
    return {
      overallScore: project.vfmScore || 75,
      economy: {
        score: project.economyScore || 75,
        factors: [
          {
            factor: "Price Competitiveness",
            score: 80,
            weight: 0.4,
            analysis: "Contract price shows good competitiveness compared to market benchmarks",
            recommendations: ["Continue market price monitoring", "Consider bulk purchasing opportunities"]
          },
          {
            factor: "Cost Structure",
            score: 70,
            weight: 0.3,
            analysis: "Cost breakdown is reasonable but could be more detailed",
            recommendations: ["Request detailed cost breakdowns", "Challenge indirect costs"]
          }
        ]
      },
      efficiency: {
        score: project.efficiencyScore || 75,
        factors: [
          {
            factor: "Procurement Timeline",
            score: 85,
            weight: 0.3,
            analysis: "Procurement timeline is within acceptable limits",
            recommendations: ["Maintain current timeline efficiency", "Share best practices"]
          }
        ]
      },
      effectiveness: {
        score: project.effectivenessScore || 75,
        factors: [
          {
            factor: "Quality Standards",
            score: 80,
            weight: 0.4,
            analysis: "Quality requirements are clearly defined and achievable",
            recommendations: ["Implement quality assurance monitoring", "Regular performance reviews"]
          }
        ]
      },
      equity: {
        score: project.equityScore || 75,
        factors: [
          {
            factor: "Local Content",
            score: project.isLocalSupplier ? 85 : 65,
            weight: 0.4,
            analysis: project.isLocalSupplier ? "Good local content participation" : "Limited local content",
            recommendations: project.isLocalSupplier ? 
              ["Maintain local content requirements", "Support supplier development"] :
              ["Increase local content requirements", "Develop local supplier capacity"]
          }
        ]
      },
      savings: {
        identified: project.potentialSavings || 0,
        realized: 0,
        potential: (project.potentialSavings || 0) * 1.5,
        categories: [
          {
            type: "Price Negotiation",
            amount: (project.potentialSavings || 0) * 0.4,
            justification: "Potential savings through price negotiation",
            implementation: "Renegotiate contract terms based on market analysis"
          },
          {
            type: "Process Optimization",
            amount: (project.potentialSavings || 0) * 0.3,
            justification: "Administrative cost savings through process improvements",
            implementation: "Implement e-procurement and automate workflows"
          }
        ]
      },
      riskAssessment: {
        overall: project.riskLevel,
        factors: [
          {
            risk: "Supplier Performance",
            level: project.riskLevel,
            impact: "Contract delivery and quality",
            mitigation: "Implement performance monitoring and penalty clauses"
          }
        ]
      },
      recommendations: [
        {
          priority: 'HIGH',
          category: 'Cost Optimization',
          recommendation: 'Implement market price benchmarking',
          expectedSavings: (project.potentialSavings || 0) * 0.3,
          implementation: 'Develop price database and require market analysis',
          timeline: '3 months'
        }
      ]
    };
  };

  const filteredProcurements = procurements.filter(procurement => {
    if (filters.category !== "all" && procurement.category !== filters.category) return false;
    if (filters.method !== "all" && procurement.procurementMethod !== filters.method) return false;
    if (filters.riskLevel !== "all" && procurement.riskLevel !== filters.riskLevel) return false;
    if (filters.minAmount && procurement.value < parseInt(filters.minAmount)) return false;
    if (filters.maxAmount && procurement.value > parseInt(filters.maxAmount)) return false;
    if (filters.showOnlySavings && !(procurement.potentialSavings && procurement.potentialSavings > 0)) return false;
    if (filters.showOnlyHighRisk && procurement.riskLevel !== "HIGH" && procurement.riskLevel !== "CRITICAL") return false;
    if (filters.showOnlyLocal && !procurement.isLocalSupplier) return false;
    return true;
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `GHS ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `GHS ${(amount / 1000).toFixed(1)}K`;
    }
    return `GHS ${amount.toLocaleString()}`;
  };

  const getVFMColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "CRITICAL": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalSavings = filteredProcurements.reduce((sum, p) => sum + (p.potentialSavings || 0), 0);
  const averageVFMScore = filteredProcurements.length > 0 ? 
    filteredProcurements.reduce((sum, p) => sum + (p.vfmScore || 0), 0) / filteredProcurements.length : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">G-GRID Procurement Intelligence</h1>
                <p className="text-muted-foreground">
                  Value for Money Audit & Savings Analysis Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProcurementData()}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Badge variant="outline">{filteredProcurements.length} Projects</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredProcurements.length}</div>
              <p className="text-xs text-muted-foreground">
                Procurement projects
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
                {formatCurrency(filteredProcurements.reduce((sum, p) => sum + p.value, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Contract value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalSavings)}
              </div>
              <p className="text-xs text-muted-foreground">
                Identified savings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg VFM Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getVFMColor(averageVFMScore)}`}>
                {averageVFMScore.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Value for Money
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PPA Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analytics ? `${analytics.ppaComplianceRate.toFixed(1)}%` : '100%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Compliance rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="WORKS">Works</SelectItem>
                    <SelectItem value="GOODS">Goods</SelectItem>
                    <SelectItem value="SERVICES">Services</SelectItem>
                    <SelectItem value="IT_HARDWARE">IT Hardware</SelectItem>
                    <SelectItem value="IT_SOFTWARE">IT Software</SelectItem>
                    <SelectItem value="VEHICLES">Vehicles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="method">Procurement Method</Label>
                <Select value={filters.method} onValueChange={(value) => setFilters({...filters, method: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="COMPETITIVE_TENDERING">Competitive Tendering</SelectItem>
                    <SelectItem value="RESTRICTED_TENDERING">Restricted Tendering</SelectItem>
                    <SelectItem value="SINGLE_SOURCE">Single Source</SelectItem>
                    <SelectItem value="DIRECT PROCUREMENT">Direct Procurement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="risk">Risk Level</Label>
                <Select value={filters.riskLevel} onValueChange={(value) => setFilters({...filters, riskLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="minAmount">Min Amount (GHS)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="maxAmount">Max Amount (GHS)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="0"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                />
              </div>

              <div className="flex items-end space-x-2">
                <Checkbox
                  id="showSavings"
                  checked={filters.showOnlySavings}
                  onCheckedChange={(checked) => setFilters({...filters, showOnlySavings: !!checked})}
                />
                <Label htmlFor="showSavings">With Savings</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="savings">Savings Analysis</TabsTrigger>
            <TabsTrigger value="vfm">VFM Audit</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Procurement Projects
                </CardTitle>
                <CardDescription>
                  Overview of procurement projects with Value for Money scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredProcurements.map((procurement) => (
                      <div key={procurement.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{procurement.title}</h3>
                              <Badge variant="secondary">{procurement.category}</Badge>
                              <Badge className={getRiskColor(procurement.riskLevel)}>
                                {procurement.riskLevel}
                              </Badge>
                              {procurement.isLocalSupplier && (
                                <Badge variant="outline" className="text-green-600">Local</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{procurement.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Value:</span> {formatCurrency(procurement.value)}
                              </div>
                              <div>
                                <span className="font-medium">VFM Score:</span> 
                                <span className={`ml-1 ${getVFMColor(procurement.vfmScore || 0)}`}>
                                  {procurement.vfmScore || 0}/100
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Supplier:</span> {procurement.supplier || 'Pending'}
                              </div>
                              <div>
                                <span className="font-medium">Potential Savings:</span> 
                                <span className="ml-1 text-green-600">
                                  {procurement.potentialSavings ? formatCurrency(procurement.potentialSavings) : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => performVFMAudit(procurement)}
                                  disabled={auditLoading}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  VFM Audit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Value for Money Audit</DialogTitle>
                                  <DialogDescription>
                                    Detailed VFM analysis for {procurement.title}
                                  </DialogDescription>
                                </DialogHeader>
                                {auditLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  </div>
                                ) : vfmAudit ? (
                                  <VFMAuditDetails audit={vfmAudit} project={procurement} />
                                ) : null}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    Savings Overview
                  </CardTitle>
                  <CardDescription>
                    Total identified and potential savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Total Identified Savings</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalSavings)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {filteredProcurements
                        .filter(p => p.potentialSavings && p.potentialSavings > 0)
                        .sort((a, b) => (b.potentialSavings || 0) - (a.potentialSavings || 0))
                        .slice(0, 5)
                        .map((procurement) => (
                          <div key={procurement.id} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm">{procurement.title}</div>
                              <div className="text-xs text-muted-foreground">{procurement.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                {formatCurrency(procurement.potentialSavings || 0)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {((procurement.potentialSavings || 0) / procurement.value * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Savings Opportunities
                  </CardTitle>
                  <CardDescription>
                    Breakdown of savings categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Price Negotiation</span>
                        <span className="font-medium">{formatCurrency(totalSavings * 0.4)}</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Process Optimization</span>
                        <span className="font-medium">{formatCurrency(totalSavings * 0.3)}</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Consolidation</span>
                        <span className="font-medium">{formatCurrency(totalSavings * 0.3)}</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vfm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Value for Money Analysis
                </CardTitle>
                <CardDescription>
                  VFM scores and breakdown across projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">VFM Score Distribution</h3>
                    <div className="space-y-3">
                      {['Economy', 'Efficiency', 'Effectiveness', 'Equity'].map((dimension) => {
                        const scores = filteredProcurements.map(p => {
                          switch (dimension) {
                            case 'Economy': return p.economyScore || 0;
                            case 'Efficiency': return p.efficiencyScore || 0;
                            case 'Effectiveness': return p.effectivenessScore || 0;
                            case 'Equity': return p.equityScore || 0;
                            default: return 0;
                          }
                        });
                        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                        
                        return (
                          <div key={dimension} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{dimension}</span>
                              <span className={getVFMColor(avgScore)}>{avgScore.toFixed(1)}/100</span>
                            </div>
                            <Progress value={avgScore} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">VFM Performance by Project</h3>
                    <div className="space-y-2">
                      {filteredProcurements
                        .sort((a, b) => (b.vfmScore || 0) - (a.vfmScore || 0))
                        .slice(0, 8)
                        .map((procurement) => (
                          <div key={procurement.id} className="flex justify-between items-center p-2 border rounded">
                            <div className="flex-1">
                              <div className="font-medium text-sm truncate">{procurement.title}</div>
                              <div className="text-xs text-muted-foreground">{procurement.category}</div>
                            </div>
                            <div className={`font-bold ${getVFMColor(procurement.vfmScore || 0)}`}>
                              {(procurement.vfmScore || 0).toFixed(1)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics && Object.entries(analytics.categoryDistribution || {}).map(([category, count]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{category}</span>
                          <span>{count}</span>
                        </div>
                        <Progress value={(count / filteredProcurements.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics && Object.entries(analytics.riskDistribution || {}).map(([risk, count]) => (
                      <div key={risk} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{risk}</span>
                          <span>{count}</span>
                        </div>
                        <Progress value={(count / filteredProcurements.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function VFMAuditDetails({ audit, project }: { audit: VFMAuditResult; project: ProcurementProject }) {
  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-3xl font-bold text-blue-600">{audit.overallScore}/100</div>
        <div className="text-sm text-muted-foreground">Overall VFM Score</div>
      </div>

      {/* VFM Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(audit).filter(([key]) => ['economy', 'efficiency', 'effectiveness', 'equity'].includes(key)).map(([component, data]: [string, any]) => (
          <Card key={component}>
            <CardHeader>
              <CardTitle className="capitalize">{component}</CardTitle>
              <div className="text-2xl font-bold">{data.score}/100</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.factors.map((factor: any, index: number) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{factor.factor}</span>
                      <span className="text-sm font-bold">{factor.score}/100</span>
                    </div>
                    <Progress value={factor.score} className="h-1 mb-2" />
                    <p className="text-xs text-muted-foreground">{factor.analysis}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Savings Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Savings Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-xl font-bold text-green-600">{formatCurrency(audit.savings.identified)}</div>
              <div className="text-xs text-muted-foreground">Identified Savings</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-xl font-bold text-blue-600">{formatCurrency(audit.savings.realized)}</div>
              <div className="text-xs text-muted-foreground">Realized Savings</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-xl font-bold text-purple-600">{formatCurrency(audit.savings.potential)}</div>
              <div className="text-xs text-muted-foreground">Potential Savings</div>
            </div>
          </div>
          <div className="space-y-2">
            {audit.savings.categories.map((category, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{category.type}</div>
                  <div className="text-xs text-muted-foreground">{category.justification}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(category.amount)}</div>
                  <div className="text-xs text-muted-foreground">{category.implementation}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {audit.recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={rec.priority === 'HIGH' ? 'destructive' : rec.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                  <span className="font-medium">{rec.category}</span>
                  {rec.expectedSavings && (
                    <span className="text-sm text-green-600">{formatCurrency(rec.expectedSavings)}</span>
                  )}
                </div>
                <p className="text-sm mb-1">{rec.recommendation}</p>
                <p className="text-xs text-muted-foreground">Timeline: {rec.timeline}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
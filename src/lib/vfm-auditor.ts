import ZAI from 'z-ai-web-dev-sdk';

export interface VFMAuditResult {
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

export interface ProcurementProject {
  id: string;
  title: string;
  description: string;
  category: string;
  value: number;
  currency: string;
  procurementMethod: string;
  supplier?: string;
  supplierCountry?: string;
  isLocalSupplier: boolean;
  bidsReceived?: number;
  publishedDate: Date;
  closingDate: Date;
  awardDate?: Date;
  contractStartDate?: Date;
  contractEndDate?: Date;
  marketPriceBenchmark?: number;
  estimatedCost?: number;
  budgetAllocation?: number;
  evaluationScores?: any;
  riskLevel: string;
}

export class ValueForMoneyAuditor {
  private zai: any;

  constructor() {
    this.initializeAI();
  }

  private async initializeAI() {
    this.zai = await ZAI.create();
  }

  async performVFMAudit(project: ProcurementProject): Promise<VFMAuditResult> {
    try {
      const auditPrompt = this.buildAuditPrompt(project);
      
      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert Value for Money (VFM) auditor specializing in Ghana public procurement. 
            You follow World Bank and Ghana PPA guidelines for VFM assessment.
            
            Your analysis must include:
            1. Economy (cost-effectiveness) - 25% weight
            2. Efficiency (resource utilization) - 25% weight  
            3. Effectiveness (outcome achievement) - 25% weight
            4. Equity (fairness and inclusion) - 25% weight
            
            Provide specific scores (0-100), detailed analysis, and actionable recommendations.
            Include realistic savings calculations with clear justifications.
            Consider Ghana market conditions and procurement regulations.`
          },
          {
            role: 'user',
            content: auditPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      });

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse the AI response into structured format
      return this.parseAuditResponse(response, project);
      
    } catch (error) {
      console.error('Error performing VFM audit:', error);
      return this.getDefaultAuditResult(project);
    }
  }

  private buildAuditPrompt(project: ProcurementProject): string {
    return `
    Perform a comprehensive Value for Money (VFM) audit for the following Ghana public procurement project:

    PROJECT DETAILS:
    - Title: ${project.title}
    - Description: ${project.description}
    - Category: ${project.category}
    - Contract Value: ${project.value} ${project.currency}
    - Procurement Method: ${project.procurementMethod}
    - Supplier: ${project.supplier || 'Not awarded'}
    - Supplier Country: ${project.supplierCountry || 'N/A'}
    - Local Supplier: ${project.isLocalSupplier}
    - Bids Received: ${project.bidsReceived || 0}
    - Published Date: ${project.publishedDate}
    - Closing Date: ${project.closingDate}
    - Award Date: ${project.awardDate || 'Not awarded'}
    - Risk Level: ${project.riskLevel}
    - Market Price Benchmark: ${project.marketPriceBenchmark || 'N/A'}
    - Estimated Cost: ${project.estimatedCost || 'N/A'}
    - Budget Allocation: ${project.budgetAllocation || 'N/A'}

    AUDIT REQUIREMENTS:
    1. Analyze each VFM component (Economy, Efficiency, Effectiveness, Equity)
    2. Provide specific scores (0-100) for each component
    3. Identify savings opportunities with realistic calculations
    4. Assess procurement compliance and risks
    5. Provide actionable recommendations with priority levels
    6. Consider Ghana market rates and PPA regulations

    MARKET CONTEXT:
    - Ghana inflation rate: ~25%
    - Local content requirements: Minimum 24% for construction, 40% for services
    - Standard procurement timeline: 45-90 days
    - Competitive tendering threshold: GHS 200,000
    - Exchange rate: ~1 USD = 12 GHS

    Return the analysis in structured JSON format with detailed justifications for all scores and savings calculations.
    `;
  }

  private parseAuditResponse(response: string, project: ProcurementProject): VFMAuditResult {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return this.validateAndEnrichAuditResult(parsed, project);
    } catch (error) {
      // If JSON parsing fails, extract information from text
      return this.extractAuditFromText(response, project);
    }
  }

  private validateAndEnrichAuditResult(result: any, project: ProcurementProject): VFMAuditResult {
    // Ensure all required fields exist and have valid values
    return {
      overallScore: Math.min(100, Math.max(0, result.overallScore || 70)),
      economy: {
        score: Math.min(100, Math.max(0, result.economy?.score || 70)),
        factors: result.economy?.factors || this.getDefaultEconomyFactors(project)
      },
      efficiency: {
        score: Math.min(100, Math.max(0, result.efficiency?.score || 70)),
        factors: result.efficiency?.factors || this.getDefaultEfficiencyFactors(project)
      },
      effectiveness: {
        score: Math.min(100, Math.max(0, result.effectiveness?.score || 70)),
        factors: result.effectiveness?.factors || this.getDefaultEffectivenessFactors(project)
      },
      equity: {
        score: Math.min(100, Math.max(0, result.equity?.score || 70)),
        factors: result.equity?.factors || this.getDefaultEquityFactors(project)
      },
      savings: {
        identified: result.savings?.identified || this.calculateIdentifiedSavings(project),
        realized: result.savings?.realized || 0,
        potential: result.savings?.potential || this.calculatePotentialSavings(project),
        categories: result.savings?.categories || this.getDefaultSavingsCategories(project)
      },
      riskAssessment: {
        overall: result.riskAssessment?.overall || project.riskLevel,
        factors: result.riskAssessment?.factors || this.getDefaultRiskFactors(project)
      },
      recommendations: result.recommendations || this.getDefaultRecommendations(project)
    };
  }

  private extractAuditFromText(response: string, project: ProcurementProject): VFMAuditResult {
    // Extract key information from text response
    // This is a simplified version - in production, you'd use more sophisticated NLP
    return this.getDefaultAuditResult(project);
  }

  private calculateIdentifiedSavings(project: ProcurementProject): number {
    let savings = 0;
    
    // Market price comparison savings
    if (project.marketPriceBenchmark && project.value < project.marketPriceBenchmark) {
      savings += (project.marketPriceBenchmark - project.value) * 0.8; // 80% of difference
    }
    
    // Local supplier preference savings
    if (project.isLocalSupplier) {
      savings += project.value * 0.05; // 5% local content benefit
    }
    
    // Competitive bidding savings
    if (project.bidsReceived && project.bidsReceived > 3) {
      savings += project.value * 0.03; // 3% competition benefit
    }
    
    return Math.round(savings);
  }

  private calculatePotentialSavings(project: ProcurementProject): number {
    let potential = 0;
    
    // Negotiation potential
    if (project.value > 1000000) {
      potential += project.value * 0.05; // 5% negotiation potential
    }
    
    // Consolidation potential
    if (project.category.includes('IT') || project.category.includes('VEHICLES')) {
      potential += project.value * 0.08; // 8% consolidation potential
    }
    
    // Timeline optimization
    const timelineDays = project.awardDate ? 
      Math.ceil((project.awardDate.getTime() - project.publishedDate.getTime()) / (1000 * 60 * 60 * 24)) : 60;
    
    if (timelineDays > 90) {
      potential += project.value * 0.02; // 2% timeline optimization
    }
    
    return Math.round(potential);
  }

  private getDefaultEconomyFactors(project: ProcurementProject) {
    return [
      {
        factor: "Price Competitiveness",
        score: 75,
        weight: 0.4,
        analysis: "Contract price compared against market benchmarks",
        recommendations: ["Implement regular market price updates", "Consider bulk purchasing"]
      },
      {
        factor: "Cost Structure",
        score: 70,
        weight: 0.3,
        analysis: "Breakdown of costs and overhead allocations",
        recommendations: ["Request detailed cost breakdowns", "Challenge indirect costs"]
      },
      {
        factor: "Life Cycle Costs",
        score: 65,
        weight: 0.3,
        analysis: "Total cost of ownership including maintenance",
        recommendations: ["Include maintenance costs in evaluation", "Consider energy efficiency"]
      }
    ];
  }

  private getDefaultEfficiencyFactors(project: ProcurementProject) {
    return [
      {
        factor: "Procurement Timeline",
        score: 80,
        weight: 0.3,
        analysis: "Time from tender publication to contract award",
        recommendations: ["Streamline approval processes", "Use e-procurement systems"]
      },
      {
        factor: "Resource Utilization",
        score: 75,
        weight: 0.4,
        analysis: "Optimal use of financial and human resources",
        recommendations: ["Implement resource tracking", "Optimize team structures"]
      },
      {
        factor: "Process Efficiency",
        score: 70,
        weight: 0.3,
        analysis: "Effectiveness of procurement processes",
        recommendations: ["Automate routine tasks", "Standardize procedures"]
      }
    ];
  }

  private getDefaultEffectivenessFactors(project: ProcurementProject) {
    return [
      {
        factor: "Quality Standards",
        score: 85,
        weight: 0.4,
        analysis: "Meeting specified quality requirements",
        recommendations: ["Implement quality assurance", "Regular performance monitoring"]
      },
      {
        factor: "Service Delivery",
        score: 80,
        weight: 0.3,
        analysis: "Timeliness and reliability of delivery",
        recommendations: ["Set clear delivery milestones", "Implement penalty clauses"]
      },
      {
        factor: "Outcome Achievement",
        score: 75,
        weight: 0.3,
        analysis: "Achievement of intended project outcomes",
        recommendations: ["Define measurable outcomes", "Regular outcome reviews"]
      }
    ];
  }

  private getDefaultEquityFactors(project: ProcurementProject) {
    return [
      {
        factor: "Local Content",
        score: project.isLocalSupplier ? 85 : 60,
        weight: 0.4,
        analysis: "Participation of local suppliers and businesses",
        recommendations: ["Increase local content requirements", "Support local supplier development"]
      },
      {
        factor: "Geographic Distribution",
        score: 75,
        weight: 0.3,
        analysis: "Fair distribution across regions",
        recommendations: ["Consider regional balance", "Support underserved areas"]
      },
      {
        factor: "Inclusive Procurement",
        score: 70,
        weight: 0.3,
        analysis: "Inclusion of SMEs and disadvantaged groups",
        recommendations: ["Set SME participation targets", "Provide capacity building"]
      }
    ];
  }

  private getDefaultSavingsCategories(project: ProcurementProject) {
    return [
      {
        type: "Price Negotiation",
        amount: this.calculateIdentifiedSavings(project) * 0.4,
        justification: "Potential savings through price negotiation based on market analysis",
        implementation: "Renegotiate contract terms or seek competitive rebidding"
      },
      {
        type: "Process Optimization",
        amount: this.calculateIdentifiedSavings(project) * 0.3,
        justification: "Administrative cost savings through process improvements",
        implementation: "Implement e-procurement and automate approval workflows"
      },
      {
        type: "Consolidation",
        amount: this.calculateIdentifiedSavings(project) * 0.3,
        justification: "Volume discounts through contract consolidation",
        implementation: "Combine similar requirements across departments"
      }
    ];
  }

  private getDefaultRiskFactors(project: ProcurementProject) {
    return [
      {
        risk: "Supplier Performance",
        level: project.riskLevel,
        impact: "Contract delivery and quality issues",
        mitigation: "Implement performance monitoring and penalty clauses"
      },
      {
        risk: "Cost Overrun",
        level: project.value > 10000000 ? "HIGH" : "MEDIUM",
        impact: "Budget exceedance and project delays",
        mitigation: "Include contingency planning and regular cost reviews"
      },
      {
        risk: "Compliance",
        level: "MEDIUM",
        impact: "Legal and regulatory violations",
        mitigation: "Regular compliance audits and staff training"
      }
    ];
  }

  private getDefaultRecommendations(project: ProcurementProject) {
    return [
      {
        priority: 'HIGH',
        category: 'Cost Optimization',
        recommendation: 'Implement market price benchmarking for all procurements above GHS 500,000',
        expectedSavings: this.calculatePotentialSavings(project) * 0.3,
        implementation: 'Develop price database and require market analysis in tender documents',
        timeline: '3 months'
      },
      {
        priority: 'MEDIUM',
        category: 'Process Improvement',
        recommendation: 'Automate procurement workflow using GHANEPS',
        expectedSavings: this.calculatePotentialSavings(project) * 0.2,
        implementation: 'Integrate with existing systems and train staff',
        timeline: '6 months'
      },
      {
        priority: 'LOW',
        category: 'Supplier Development',
        recommendation: 'Develop local supplier capacity building program',
        expectedSavings: this.calculatePotentialSavings(project) * 0.1,
        implementation: 'Partner with AGI and local business associations',
        timeline: '12 months'
      }
    ];
  }

  private getDefaultAuditResult(project: ProcurementProject): VFMAuditResult {
    return {
      overallScore: 70,
      economy: {
        score: 70,
        factors: this.getDefaultEconomyFactors(project)
      },
      efficiency: {
        score: 70,
        factors: this.getDefaultEfficiencyFactors(project)
      },
      effectiveness: {
        score: 70,
        factors: this.getDefaultEffectivenessFactors(project)
      },
      equity: {
        score: 70,
        factors: this.getDefaultEquityFactors(project)
      },
      savings: {
        identified: this.calculateIdentifiedSavings(project),
        realized: 0,
        potential: this.calculatePotentialSavings(project),
        categories: this.getDefaultSavingsCategories(project)
      },
      riskAssessment: {
        overall: project.riskLevel,
        factors: this.getDefaultRiskFactors(project)
      },
      recommendations: this.getDefaultRecommendations(project)
    };
  }
}

export const vfmAuditor = new ValueForMoneyAuditor();
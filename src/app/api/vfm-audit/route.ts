import { NextRequest, NextResponse } from 'next/server';
import { vfmAuditor } from '@/lib/vfm-auditor';

export async function POST(request: NextRequest) {
  try {
    const { project } = await request.json();

    if (!project) {
      return NextResponse.json(
        { error: 'Project data is required' },
        { status: 400 }
      );
    }

    // Perform VFM audit
    const auditResult = await vfmAuditor.performVFMAudit(project);

    return NextResponse.json({
      success: true,
      audit: auditResult
    });

  } catch (error) {
    console.error('Error performing VFM audit:', error);
    
    return NextResponse.json(
      { error: 'Failed to perform VFM audit' },
      { status: 500 }
    );
  }
}
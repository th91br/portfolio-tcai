export interface ExecutiveSummary {
  whoIs: string;
  whatIsLookingFor: string;
  mainProblem: string;
  primaryGoal: string;
  currentMoment: string;
  urgencyLevel: string;
  decisionCapacity: string;
  recommendedSolution: string;
  commercialStatus: string;
}

export interface OpportunityAnalysis {
  relevantProblem: string;
  opportunityArea: string;
  howTcaHelps: string;
  idealSolutionFit: string;
  expectedBusinessBenefit: string;
}

export interface ApproachStrategy {
  bestAngle: string;
  conversationStarter: string;
  attentionPoints: string[];
  howToDemonstrateValue: string[];
  whatToAvoid: string[];
  recommendedNextStep: string;
}

export interface RecommendedQuestion {
  question: string;
  purpose: string;
  category: 'necessidade' | 'impacto' | 'processo' | 'orcamento' | 'decisao' | 'tecnica';
}

export interface PossibleObjection {
  hypothesis: string;
  evidence: string;
  howToValidateAndOvercome: string;
}

export interface MeetingPrepBriefing {
  context: string;
  problem: string;
  goal: string;
  probableSolution: string;
  pointsToValidate: string[];
  strategicQuestions: string[];
  possibleObjections: string[];
  desiredOutcome: string;
}

export interface ProposalStrategy {
  coreProblem: string;
  priorityScope: string[];
  highlightItems: string[];
  scopeRisks: string[];
  openQuestionsToResolve: string[];
  valueArguments: string[];
}

export interface LossAnalysis {
  probableMainCause: string;
  commercialLearnings: string[];
  identifiedPattern: string;
  futureImprovementRecommendation: string;
}

export interface CopilotAnalysisOutput {
  summary: ExecutiveSummary;
  opportunity: OpportunityAnalysis;
  approach: ApproachStrategy;
  questions: RecommendedQuestion[];
  possibleObjections: PossibleObjection[];
  whatsappMessage: string;
  recommendedNextAction: string;
  meetingPrep: MeetingPrepBriefing;
  proposalStrategy?: ProposalStrategy;
  lossAnalysis?: LossAnalysis;
  confidenceNotes: string[];
  sourceSnapshotHash: string;
  generatedAt: string;
  model: string;
  promptVersion: string;
}

export interface LeadInsightRecord {
  id: string;
  lead_id: string;
  deal_id: string | null;
  insight_type: 'full_analysis' | 'meeting_prep' | 'proposal_strategy' | 'loss_analysis';
  structured_output: CopilotAnalysisOutput;
  model: string;
  prompt_version: string;
  source_snapshot_hash: string;
  helpful_feedback: boolean | null;
  tokens_usage: Record<string, any>;
  generated_at: string;
  generated_by: string;
  created_at: string;
}

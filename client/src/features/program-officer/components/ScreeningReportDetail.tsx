import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Bot,
  ShieldCheck,
  ShieldX,
  MessageSquare,
  Info,
  RefreshCw,
} from 'lucide-react';

interface HardRuleResult {
  criterionCode: string;
  criterionName: string;
  passed: boolean;
  explanation: string;
}

interface SoftFlag {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiSuggested: boolean;
}

interface ScreeningReport {
  reportId: string;
  applicationId: string;
  applicationTitle: string;
  programmeName: string;
  hardRulesPassed: boolean;
  hardRuleResults: HardRuleResult[];
  softFlags: SoftFlag[];
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiSummary: string;
  aiSuggested: boolean;
  isReviewed: boolean;
  createdAt: string;
}

const API_BASE = 'http://localhost:8086/api';

const riskColour: Record<string, string> = {
  LOW: 'text-emerald-400 bg-emerald-900/30 border-emerald-700',
  MEDIUM: 'text-amber-400 bg-amber-900/30 border-amber-700',
  HIGH: 'text-red-400 bg-red-900/30 border-red-700',
  CRITICAL: 'text-rose-400 bg-rose-900/30 border-rose-700',
};

export default function ScreeningReportDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [report, setReport] = useState<ScreeningReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [clarifyFlag, setClarifyFlag] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/eligibility/${applicationId}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Report not found — run screening first');
      const json = await res.json();
      setReport(json.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [applicationId]);

  const postAction = async (path: string, body?: object) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/eligibility/${applicationId}/${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error ?? 'Request failed');
      }
      return res.json();
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmEligible = async () => {
    await postAction('confirm-eligible');
    await fetchReport();
  };

  const handleOverrideIneligible = async () => {
    if (!overrideReason.trim()) return;
    await postAction('override-ineligible', { reason: overrideReason });
    setShowOverrideModal(false);
    setOverrideReason('');
    await fetchReport();
  };

  const handleSendClarification = async () => {
    if (!clarifyQuestion.trim()) return;
    await postAction('clarification', {
      question: clarifyQuestion,
      flagReference: clarifyFlag || undefined,
    });
    setShowClarifyModal(false);
    setClarifyQuestion('');
    setClarifyFlag('');
    alert('Clarification request sent to applicant.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-3 text-slate-400">Loading screening report…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/po/screening')}
          className="flex items-center gap-1 text-slate-400 hover:text-white mb-6 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Queue
        </button>
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/po/screening')}
            className="flex items-center gap-1 text-slate-400 hover:text-white mb-3 text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Queue
          </button>
          <h1 className="text-xl font-semibold text-white">{report.applicationTitle}</h1>
          <p className="text-sm text-slate-400 mt-1">{report.programmeName}</p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${riskColour[report.overallRiskLevel] ?? 'text-slate-400'}`}
        >
          <AlertTriangle className="w-4 h-4" />
          {report.overallRiskLevel} RISK
        </div>
      </div>

      {/* AI Advisory Banner */}
      {report.aiSuggested && (
        <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-800 rounded-lg text-blue-300 text-sm">
          <Bot className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            <strong>AI Suggested</strong> — All results below are advisory only. The Program Officer
            makes the final determination.
          </span>
        </div>
      )}

      {/* AI Summary */}
      {report.aiSummary && (
        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-slate-300 font-medium">
            <Info className="w-4 h-4" /> AI Screening Summary
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{report.aiSummary}</p>
        </div>
      )}

      {/* Hard Rule Results */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2 text-slate-300 font-medium">
          {report.hardRulesPassed ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldX className="w-4 h-4 text-red-400" />
          )}
          Hard Rule Checks ({report.hardRuleResults.filter((r) => r.passed).length}/
          {report.hardRuleResults.length} passed)
        </div>
        <div className="divide-y divide-slate-700/50">
          {report.hardRuleResults.length === 0 ? (
            <p className="px-4 py-3 text-slate-400 text-sm">No hard rule results available.</p>
          ) : (
            report.hardRuleResults.map((rule) => (
              <div key={rule.criterionCode} className="px-4 py-3 flex items-start gap-3">
                {rule.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm text-white font-medium">
                    <span className="text-slate-500 mr-1.5">{rule.criterionCode}</span>
                    {rule.criterionName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{rule.explanation}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Soft Flags */}
      {report.softFlags.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2 text-slate-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            AI Soft Flags ({report.softFlags.length}) — Advisory Only
          </div>
          <div className="divide-y divide-slate-700/50">
            {report.softFlags.map((flag, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${riskColour[flag.severity] ?? ''}`}
                >
                  {flag.severity}
                </span>
                <div>
                  <p className="text-sm text-white font-medium">
                    {flag.type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{flag.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Program Officer Actions */}
      {!report.isReviewed && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-300 font-medium mb-4">Program Officer Actions</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleConfirmEligible}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Confirm Eligible
            </button>
            <button
              onClick={() => setShowOverrideModal(true)}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <ShieldX className="w-4 h-4" />
              Override to Ineligible
            </button>
            <button
              onClick={() => setShowClarifyModal(true)}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              Send Clarification Request
            </button>
          </div>
        </div>
      )}

      {report.isReviewed && (
        <div className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-800 rounded-lg text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          This application has been reviewed and a decision recorded.
        </div>
      )}

      {/* Override Ineligible Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold mb-1">Override to Ineligible</h2>
            <p className="text-slate-400 text-sm mb-4">
              A written reason is required when overriding the eligibility decision.
            </p>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Enter reason for ineligibility…"
              rows={4}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleOverrideIneligible}
                disabled={!overrideReason.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Confirm Override
              </button>
              <button
                onClick={() => {
                  setShowOverrideModal(false);
                  setOverrideReason('');
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Request Modal */}
      {showClarifyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold mb-1">Send Clarification Request</h2>
            <p className="text-slate-400 text-sm mb-4">
              Your question will be sent to the applicant via the portal messaging system.
            </p>
            <div className="mb-3">
              <label className="text-xs text-slate-400 mb-1 block">
                Related Flag (optional)
              </label>
              <input
                value={clarifyFlag}
                onChange={(e) => setClarifyFlag(e.target.value)}
                placeholder="e.g. VAGUE_OUTCOMES"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="mb-4">
              <label className="text-xs text-slate-400 mb-1 block">Question for Applicant</label>
              <textarea
                value={clarifyQuestion}
                onChange={(e) => setClarifyQuestion(e.target.value)}
                placeholder="Enter your clarification question…"
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSendClarification}
                disabled={!clarifyQuestion.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Send Request
              </button>
              <button
                onClick={() => {
                  setShowClarifyModal(false);
                  setClarifyQuestion('');
                  setClarifyFlag('');
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

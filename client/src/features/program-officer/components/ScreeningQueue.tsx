import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ClipboardList, Play, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface QueueItem {
  reportId: string | null;
  applicationId: string;
  applicationTitle: string;
  programmeName: string;
  hardRulesPassed: boolean;
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
  softFlags: { type: string; severity: string }[];
  aiSuggested: boolean;
  isReviewed: boolean;
  createdAt: string | null;
}

const API_BASE = 'http://localhost:8086/api';

const riskBadge = (level: string | null) => {
  if (!level) return <span className="text-xs text-slate-400">Not screened</span>;
  const styles: Record<string, string> = {
    LOW: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700',
    MEDIUM: 'bg-amber-900/40 text-amber-300 border border-amber-700',
    HIGH: 'bg-red-900/40 text-red-300 border border-red-700',
    CRITICAL: 'bg-rose-900/40 text-rose-300 border border-rose-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level] ?? ''}`}>
      {level}
    </span>
  );
};

export default function ScreeningQueue() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/eligibility/queue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load queue');
      const json = await res.json();
      setQueue(json.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const runScreening = async (applicationId: string) => {
    setRunningId(applicationId);
    try {
      const res = await fetch(`${API_BASE}/eligibility/${applicationId}/run`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Screening failed');
      await fetchQueue();
      navigate(`/po/screening/${applicationId}`);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Screening failed');
    } finally {
      setRunningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-3 text-slate-400">Loading screening queue…</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold text-white">Eligibility Screening Queue</h1>
            <p className="text-sm text-slate-400">Applications pending review — Module 3</p>
          </div>
        </div>
        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {queue.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
          <p>No applications pending screening</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700 bg-slate-800/80">
                <th className="px-4 py-3 font-medium">Application</th>
                <th className="px-4 py-3 font-medium">Programme</th>
                <th className="px-4 py-3 font-medium">Hard Rules</th>
                <th className="px-4 py-3 font-medium">Risk Level</th>
                <th className="px-4 py-3 font-medium">Flags</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr
                  key={item.applicationId}
                  className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/po/screening/${item.applicationId}`)}
                      className="text-primary hover:underline font-medium text-left"
                    >
                      {item.applicationTitle}
                    </button>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {item.applicationId.slice(0, 8)}…
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.programmeName}</td>
                  <td className="px-4 py-3">
                    {item.reportId == null ? (
                      <span className="text-slate-500">—</span>
                    ) : item.hardRulesPassed ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{riskBadge(item.overallRiskLevel)}</td>
                  <td className="px-4 py-3">
                    {item.softFlags.length > 0 ? (
                      <span className="flex items-center gap-1 text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {item.softFlags.length}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.isReviewed ? (
                      <span className="text-xs text-emerald-400">Reviewed</span>
                    ) : item.reportId ? (
                      <span className="flex items-center gap-1 text-amber-400 text-xs">
                        <Clock className="w-3 h-3" /> Awaiting PO
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not screened</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.reportId ? (
                      <button
                        onClick={() => navigate(`/po/screening/${item.applicationId}`)}
                        className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        View Report
                      </button>
                    ) : (
                      <button
                        onClick={() => runScreening(item.applicationId)}
                        disabled={runningId === item.applicationId}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {runningId === item.applicationId ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        Run Screening
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

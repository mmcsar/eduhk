import { useState } from 'react';
import { Target, CheckCircle, Calendar, User } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchGoals } from '../services/api';

type StatusFilter = 'all' | 'not_started' | 'in_progress' | 'achieved' | 'paused';

export default function Goals() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const params = statusFilter !== 'all' ? { status: statusFilter } : undefined;
  const { data: goals, loading } = useApi(() => fetchGoals(params), [statusFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusLabels: Record<string, string> = {
    not_started: 'Non demarre',
    in_progress: 'En cours',
    achieved: 'Atteint',
    paused: 'En pause',
  };

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'not_started', label: 'Non demarres' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'achieved', label: 'Atteints' },
    { value: 'paused', label: 'En pause' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Objectifs</h2>
        <p>Suivez la progression des objectifs d'apprentissage</p>
      </div>

      <div className="tabs">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`tab ${statusFilter === f.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : (
        <div>
          {goals && goals.length > 0 ? (
            goals.map((goal: any) => (
              <div key={goal._id} className="card" style={{ marginBottom: 16 }}>
                <div className="goal-header">
                  <div>
                    <span className="goal-title" style={{ fontSize: 16 }}>{goal.title}</span>
                    {goal.description && (
                      <p style={{ fontSize: 13, color: 'var(--color-gray-500)', marginTop: 4 }}>
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className={`badge ${goal.priority}`}>{goal.priority}</span>
                    <span className={`badge ${goal.status.replace('_', '-')}`}>
                      {statusLabels[goal.status] || goal.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, margin: '12px 0', fontSize: 13, color: 'var(--color-gray-500)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Target size={14} /> {goal.subject}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={14} /> Echeance: {formatDate(goal.targetDate)}
                  </span>
                  {goal.student && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={14} /> {goal.student.firstName} {goal.student.lastName}
                    </span>
                  )}
                </div>

                <div className="progress-bar-container" style={{ marginTop: 16 }}>
                  <div
                    className={`progress-bar ${goal.progress >= 75 ? 'high' : goal.progress >= 40 ? 'medium' : 'low'}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="progress-label">{goal.progress}%</div>

                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="milestone-list">
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: 8 }}>
                      Etapes ({goal.milestones.filter((m: any) => m.completed).length}/{goal.milestones.length})
                    </div>
                    {goal.milestones.map((m: any, i: number) => (
                      <div key={i} className={`milestone-item ${m.completed ? 'completed' : ''}`}>
                        <div className={`milestone-check ${m.completed ? 'completed' : ''}`}>
                          {m.completed && <CheckCircle size={12} />}
                        </div>
                        <span>{m.title}</span>
                        {m.completedAt && (
                          <span style={{ fontSize: 11, color: 'var(--color-gray-400)', marginLeft: 'auto' }}>
                            {formatDate(m.completedAt)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {goal.coach && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-gray-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar sm">
                      {goal.coach.firstName?.[0]}{goal.coach.lastName?.[0]}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>
                      Coach: {goal.coach.firstName} {goal.coach.lastName} - {goal.coach.specialty}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card">
              <div className="empty-state">
                <Target size={40} />
                <p>Aucun objectif trouve</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

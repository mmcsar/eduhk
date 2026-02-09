import {
  Calendar,
  CheckCircle,
  Target,
  Users,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  User,
  BookOpen,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchSessionStats, fetchSessions, fetchGoals, fetchFeedback } from '../services/api';
import type { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: stats, loading: statsLoading } = useApi(() => fetchSessionStats(), []);
  const { data: sessions } = useApi(() => fetchSessions({ status: 'scheduled' }), []);
  const { data: goals } = useApi(() => fetchGoals({ status: 'in_progress' }), []);
  const { data: recentFeedback } = useApi(() => fetchFeedback(), []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const typeIcons: Record<string, any> = {
    one_on_one: User,
    group: Users,
    workshop: BookOpen,
  };

  return (
    <div>
      <div className="page-header">
        <h2>Tableau de bord</h2>
        <p>Vue d'ensemble du coaching scolaire</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <h3>{statsLoading ? '-' : stats?.total || 0}</h3>
            <p>Sessions totales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <h3>{statsLoading ? '-' : stats?.scheduled || 0}</h3>
            <p>Programmees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <h3>{statsLoading ? '-' : stats?.completed || 0}</h3>
            <p>Completees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <h3>{statsLoading ? '-' : `${stats?.completionRate || 0}%`}</h3>
            <p>Taux de completion</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Sessions a venir</span>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('sessions')}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          <div className="session-list">
            {sessions && sessions.length > 0 ? (
              sessions.slice(0, 4).map((session: any) => {
                const Icon = typeIcons[session.type] || Calendar;
                return (
                  <div key={session._id} className="session-item">
                    <div className={`session-type-icon ${session.type}`}>
                      <Icon size={18} />
                    </div>
                    <div className="session-details">
                      <div className="session-title">{session.title}</div>
                      <div className="session-meta">
                        <span>{session.subject}</span>
                        <span>{formatDate(session.scheduledAt)}</span>
                        <span>{session.duration} min</span>
                      </div>
                    </div>
                    <span className={`badge ${session.status}`}>
                      {session.status === 'scheduled' ? 'Programmee' : session.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Calendar size={32} />
                <p>Aucune session programmee</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Objectifs en cours</span>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('goals')}>
              Voir tout <ArrowRight size={14} />
            </button>
          </div>
          {goals && goals.length > 0 ? (
            goals.slice(0, 4).map((goal: any) => (
              <div key={goal._id} className="goal-item">
                <div className="goal-header">
                  <span className="goal-title">{goal.title}</span>
                  <span className={`badge ${goal.priority}`}>{goal.priority}</span>
                </div>
                <div className="goal-subject">
                  <Target size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {goal.subject}
                  {goal.student && ` - ${goal.student.firstName} ${goal.student.lastName}`}
                </div>
                <div className="progress-bar-container">
                  <div
                    className={`progress-bar ${goal.progress >= 75 ? 'high' : goal.progress >= 40 ? 'medium' : 'low'}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="progress-label">{goal.progress}%</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Target size={32} />
              <p>Aucun objectif en cours</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <span className="card-title">Retours recents</span>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('feedback')}>
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
        {recentFeedback && recentFeedback.length > 0 ? (
          recentFeedback.slice(0, 3).map((fb: any) => (
            <div key={fb._id} className="feedback-item">
              <div className="feedback-header">
                <span className="feedback-student">
                  {fb.student?.firstName} {fb.student?.lastName}
                </span>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= fb.rating ? '#fbbf24' : 'none'}
                      className={s > fb.rating ? 'star-empty' : ''}
                    />
                  ))}
                </div>
              </div>
              {fb.comment && <div className="feedback-comment">{fb.comment}</div>}
              <div className="feedback-tags">
                {fb.strengths?.slice(0, 3).map((s: string, i: number) => (
                  <span key={i} className="tag strength">{s}</span>
                ))}
                {fb.areasForImprovement?.slice(0, 2).map((a: string, i: number) => (
                  <span key={i} className="tag improvement">{a}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Star size={32} />
            <p>Aucun retour disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}

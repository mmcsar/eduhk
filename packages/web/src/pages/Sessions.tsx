import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchSessions } from '../services/api';

type StatusFilter = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export default function Sessions() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const params = statusFilter !== 'all' ? { status: statusFilter } : undefined;
  const { data: sessions, loading } = useApi(() => fetchSessions(params), [statusFilter]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const typeIcons: Record<string, any> = {
    one_on_one: User,
    group: Users,
    workshop: BookOpen,
  };

  const typeLabels: Record<string, string> = {
    one_on_one: 'Individuel',
    group: 'Groupe',
    workshop: 'Atelier',
  };

  const statusLabels: Record<string, string> = {
    scheduled: 'Programmee',
    in_progress: 'En cours',
    completed: 'Terminee',
    cancelled: 'Annulee',
  };

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'scheduled', label: 'Programmees' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminees' },
    { value: 'cancelled', label: 'Annulees' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Sessions de coaching</h2>
        <p>Gerez et suivez toutes les sessions de coaching</p>
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
        <div className="session-list">
          {sessions && sessions.length > 0 ? (
            sessions.map((session: any) => {
              const Icon = typeIcons[session.type] || Calendar;
              return (
                <div key={session._id} className="card" style={{ marginBottom: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div className={`session-type-icon ${session.type}`}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{session.title}</h3>
                        <span className={`badge ${session.status}`}>
                          {statusLabels[session.status] || session.status}
                        </span>
                      </div>

                      {session.description && (
                        <p style={{ fontSize: 13, color: 'var(--color-gray-500)', marginBottom: 12 }}>
                          {session.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--color-gray-600)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={14} /> {formatDate(session.scheduledAt)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={14} /> {session.duration} min
                        </span>
                        {session.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={14} /> {session.location}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Icon size={14} /> {typeLabels[session.type] || session.type}
                        </span>
                      </div>

                      {session.coach && (
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar sm">
                            {session.coach.firstName?.[0]}{session.coach.lastName?.[0]}
                          </div>
                          <span style={{ fontSize: 13 }}>
                            {session.coach.firstName} {session.coach.lastName}
                            {session.coach.specialty && (
                              <span style={{ color: 'var(--color-gray-400)' }}>
                                {' '} - {session.coach.specialty}
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {session.students && session.students.length > 0 && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          <Users size={14} style={{ color: 'var(--color-gray-400)' }} />
                          {session.students.map((s: any, i: number) => (
                            <span key={s._id} style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>
                              {s.firstName} {s.lastName}{i < session.students.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {session.objectives && session.objectives.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: 4 }}>
                            Objectifs:
                          </div>
                          {session.objectives.map((obj: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '2px 0' }}>
                              {session.status === 'completed' ? (
                                <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                              ) : (
                                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--color-gray-300)' }} />
                              )}
                              {obj}
                            </div>
                          ))}
                        </div>
                      )}

                      {session.notes && (
                        <div style={{ marginTop: 12, padding: 12, background: 'var(--color-gray-50)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--color-gray-600)' }}>
                          {session.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card">
              <div className="empty-state">
                <Calendar size={40} />
                <p>Aucune session trouvee</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

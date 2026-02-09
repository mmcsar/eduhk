import { Star, User, Calendar, MessageSquare } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchFeedback } from '../services/api';

export default function FeedbackPage() {
  const { data: feedbackList, loading } = useApi(() => fetchFeedback(), []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Retours et evaluations</h2>
        <p>Consultez les retours sur les sessions de coaching</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : (
        <div>
          {feedbackList && feedbackList.length > 0 ? (
            feedbackList.map((fb: any) => (
              <div key={fb._id} className="card" style={{ marginBottom: 16 }}>
                <div className="feedback-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar">
                      {fb.student?.firstName?.[0]}{fb.student?.lastName?.[0]}
                    </div>
                    <div>
                      <div className="feedback-student">
                        {fb.student?.firstName} {fb.student?.lastName}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>
                        {fb.student?.grade}
                      </div>
                    </div>
                  </div>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        fill={s <= fb.rating ? '#fbbf24' : 'none'}
                        className={s > fb.rating ? 'star-empty' : ''}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, margin: '12px 0', fontSize: 13, color: 'var(--color-gray-500)' }}>
                  {fb.session && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={14} /> {fb.session.title}
                    </span>
                  )}
                  {fb.coach && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={14} /> {fb.coach.firstName} {fb.coach.lastName}
                    </span>
                  )}
                  {fb.createdAt && (
                    <span>{formatDate(fb.createdAt)}</span>
                  )}
                </div>

                {fb.comment && (
                  <div className="feedback-comment" style={{ marginTop: 12 }}>
                    <MessageSquare size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--color-gray-400)' }} />
                    {fb.comment}
                  </div>
                )}

                <div className="feedback-tags" style={{ marginTop: 12 }}>
                  {fb.strengths?.map((s: string, i: number) => (
                    <span key={`s-${i}`} className="tag strength">{s}</span>
                  ))}
                  {fb.areasForImprovement?.map((a: string, i: number) => (
                    <span key={`i-${i}`} className="tag improvement">{a}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <div className="empty-state">
                <MessageSquare size={40} />
                <p>Aucun retour disponible</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

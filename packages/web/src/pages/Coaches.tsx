import { Users, Mail, BookOpen } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchCoaches } from '../services/api';

export default function Coaches() {
  const { data: coaches, loading } = useApi(() => fetchCoaches(), []);

  return (
    <div>
      <div className="page-header">
        <h2>Coaches</h2>
        <p>Equipe de coaching scolaire</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {coaches && coaches.length > 0 ? (
            coaches.map((coach: any) => (
              <div key={coach._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div className="avatar lg" style={{
                    background: `hsl(${coach.firstName.charCodeAt(0) * 7 % 360}, 60%, 92%)`,
                    color: `hsl(${coach.firstName.charCodeAt(0) * 7 % 360}, 60%, 40%)`,
                  }}>
                    {coach.firstName[0]}{coach.lastName[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-primary)' }}>
                      <BookOpen size={14} />
                      {coach.specialty}
                    </div>
                  </div>
                </div>

                {coach.bio && (
                  <p style={{ fontSize: 13, color: 'var(--color-gray-500)', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {coach.bio}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-gray-400)', paddingTop: 12, borderTop: '1px solid var(--color-gray-100)' }}>
                  <Mail size={14} />
                  {coach.email}
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-state">
                <Users size={40} />
                <p>Aucun coach disponible</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

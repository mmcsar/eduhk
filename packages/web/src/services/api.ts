const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Coaches
export const fetchCoaches = () => request<any>('/coaches');
export const fetchCoach = (id: string) => request<any>(`/coaches/${id}`);
export const createCoach = (data: any) =>
  request<any>('/coaches', { method: 'POST', body: JSON.stringify(data) });

// Sessions
export const fetchSessions = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<any>(`/sessions${qs}`);
};
export const fetchSession = (id: string) => request<any>(`/sessions/${id}`);
export const fetchSessionStats = () => request<any>('/sessions/stats');
export const createSession = (data: any) =>
  request<any>('/sessions', { method: 'POST', body: JSON.stringify(data) });
export const completeSession = (id: string, notes?: string) =>
  request<any>(`/sessions/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  });
export const cancelSession = (id: string) =>
  request<any>(`/sessions/${id}/cancel`, { method: 'PATCH' });

// Goals
export const fetchGoals = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<any>(`/goals${qs}`);
};
export const fetchGoal = (id: string) => request<any>(`/goals/${id}`);
export const createGoal = (data: any) =>
  request<any>('/goals', { method: 'POST', body: JSON.stringify(data) });
export const updateGoalProgress = (id: string, progress: number) =>
  request<any>(`/goals/${id}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ progress }),
  });
export const toggleMilestone = (goalId: string, milestoneIndex: number) =>
  request<any>(`/goals/${goalId}/milestones/${milestoneIndex}/toggle`, {
    method: 'PATCH',
  });

// Feedback
export const fetchFeedback = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<any>(`/feedback${qs}`);
};
export const createFeedback = (data: any) =>
  request<any>('/feedback', { method: 'POST', body: JSON.stringify(data) });
export const fetchStudentSummary = (studentId: string) =>
  request<any>(`/feedback/student/${studentId}/summary`);

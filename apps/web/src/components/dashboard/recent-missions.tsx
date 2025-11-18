'use client';

export function RecentMissions() {
  const missions = [
    { id: 'MSN-001', from: 'Lubumbashi', to: 'Dar es Salaam', status: 'In Transit', progress: 65 },
    { id: 'MSN-002', from: 'Kinshasa', to: 'Matadi', status: 'At Checkpoint', progress: 45 },
    { id: 'MSN-003', from: 'Kolwezi', to: 'Lobito', status: 'Pending', progress: 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Missions</h3>
      <div className="space-y-4">
        {missions.map(mission => (
          <div key={mission.id} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{mission.id}</p>
                <p className="text-sm text-gray-600">
                  {mission.from} → {mission.to}
                </p>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {mission.status}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

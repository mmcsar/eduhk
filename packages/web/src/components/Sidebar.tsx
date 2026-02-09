import {
  LayoutDashboard,
  Calendar,
  Target,
  MessageSquare,
  Users,
} from 'lucide-react';
import type { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: any }[] = [
  { page: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { page: 'sessions', label: 'Sessions', icon: Calendar },
  { page: 'goals', label: 'Objectifs', icon: Target },
  { page: 'feedback', label: 'Retours', icon: MessageSquare },
  { page: 'coaches', label: 'Coaches', icon: Users },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>EduHK</h1>
        <p>Hit Coach</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            className={`nav-item ${currentPage === page ? 'active' : ''}`}
            onClick={() => onNavigate(page)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

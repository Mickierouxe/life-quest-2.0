
import { useState } from 'react';
import {//Icons - might change these to SVGs later that are better fantasy ones. 
  Home as HomeIcon,
  Flag,
  Layers3,
  Trophy,
  BookHeart,
  Users,
  Zap,
  Cat,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import PunchCards from './pages/PunchCards';
import BurstMode from './pages/BurstMode';
import Collections from './pages/Collections';
import LifeLog from './pages/LifeLogs';
import Accountability from './pages/Accountability';


const pages = {//
  Home,
  Campaigns,
  'Punch Cards': PunchCards,
  'Burst Mode': BurstMode,
  Collections,
  'Life Log': LifeLog,
  Accountability,
};


//Icons / nav link labels for the sidebar navigation
const navigation = [
  { label: 'Home', icon: HomeIcon },
  { label: 'Campaigns', icon: Flag },
  { label: 'Punch Cards', icon: Layers3 },
  { label: 'Burst Mode', icon: Zap },
  { label: 'Collections', icon: Trophy },
  { label: 'Life Log', icon: BookHeart },
  { label: 'Accountability', icon: Users },
];


export default function App() {
  const [activePage, setActivePage] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const ActivePage = pages[activePage as keyof typeof pages];

  return (
    <div className="app-shell">

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>

        <div className="brand">
          <div className="brand-symbol">
            <Sparkles size={19} />
            <Cat size={29} />
          </div>

          <h2>Life <span>Quest</span></h2>
          <p>PLAN · PROGRESS · CELEBRATE</p>
        </div>

        <div className="nav-heading">YOUR ADVENTURE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label ? 'active' : ''
                }`}
                onClick={() => {
                  setActivePage(item.label);
                  setMenuOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <Cat size={30} />
          <p>Your familiar is cheering you on.</p>
          <span>✦ You've got this. ✦</span>
        </div>

      </aside>

      <main className="main-content">
        {activePage === 'Home' ? (
    <Home onNavigate={setActivePage} />
    ) : (
        <ActivePage onNavigate={function (page: string): void {
              throw new Error('Function not implemented.');
            } } />
    )}
      </main>

    </div>
  );
}

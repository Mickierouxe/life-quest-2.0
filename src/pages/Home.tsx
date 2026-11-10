
import { useState } from 'react';
import {
  Sparkles,
  Cat,
  Trophy,
  Stamp,
  BookHeart,
  Compass,
  Flag,
  Plus,
  Zap,
  CalendarDays,
  ArrowRight,
  Footprints,
  Star,
  Gift,
  Send,
} from 'lucide-react';

type HomeProps = {
  onNavigate: (page: string) => void;
};

type LifeEntry = {
  id: number;
  title: string;
  content: string;
  category: 'Personal Win' | 'Adventure' | 'Health & Movement' | 'Creative' | 'Work' | 'General';
  mood: 'Amazing' | 'Good' | 'Okay' | 'Tired' | 'Challenging';
  date: number;
  isFavorite: boolean;
};

function getSavedEntries(): LifeEntry[] {
  try {
    return JSON.parse(localStorage.getItem('lifeQuest_lifeLog') || '[]');
  } catch {
    return [];
  }
}

export default function Home({ onNavigate }: HomeProps) {
  const [quickCapture, setQuickCapture] = useState('');
  const [entries, setEntries] = useState<LifeEntry[]>(getSavedEntries);

  const today = new Date();
  const latestEntry = entries[0];

  const saveQuickCapture = () => {
    const text = quickCapture.trim();
    if (!text) return;

    const newEntry: LifeEntry = {
      id: Date.now(),
      title: text,
      content: '',
      category: 'General',
      mood: 'Good',
      date: Date.now(),
      isFavorite: false,
    };

    const updatedEntries = [newEntry, ...entries];
    localStorage.setItem('lifeQuest_lifeLog', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    setQuickCapture('');
  };

  return (
    <div className="home-page">

      {/* TOP GREETING */}
      <header className="home-header">
        <div>
          <span className="eyebrow">
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <h1>Good day, adventurer! <span>✧</span></h1>
          <p>Another day. Another chance to make it epic.</p>
        </div>

        <div className="home-level">
          <Sparkles size={17} />
          LEVEL 01
        </div>
      </header>

      {/* QUICK ADD SHORTCUTS */}
      <section className="quick-add-section">
        <button onClick={() => onNavigate('Campaigns')}>
          <Flag size={18} /> New Campaign <Plus size={15} />
        </button>
        <button onClick={() => onNavigate('Punch Cards')}>
          <Stamp size={18} /> New Punch Card <Plus size={15} />
        </button>
        <button onClick={() => onNavigate('Collections')}>
          <Gift size={18} /> Add Collection <Plus size={15} />
        </button>
        <button onClick={() => onNavigate('Life Log')}>
          <BookHeart size={18} /> Life Log <ArrowRight size={15} />
        </button>
      </section>

      {/* MAIN DASHBOARD GRID */}
      <div className="dashboard-grid">

        {/* ACTIVE QUEST */}
        <section className="dashboard-card active-quest-card">
          <div className="dashboard-card-heading">
            <span><Compass size={19} /> ACTIVE CAMPAIGN</span>
            <button onClick={() => onNavigate('Campaigns')}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          <div className="quest-content">
            <div>
              <h2>Your next adventure awaits.</h2>
              <p>
                Your active campaigns will appear here.
                Pick a goal, break it into milestones, and
                watch your progress grow.
              </p>
            </div>
            <Compass className="quest-decoration" size={65} />
          </div>

          <button
            className="primary-dashboard-button"
            onClick={() => onNavigate('Campaigns')}
          >
            <Plus size={18} /> Create a Campaign
          </button>
        </section>

        {/* LATEST WIN */}
        <section className="dashboard-card latest-win-card">
          <div className="dashboard-card-heading">
            <span><Trophy size={19} /> YOUR LATEST WIN</span>
          </div>

          {latestEntry ? (
            <>
              <h3>{latestEntry.title}</h3>
              <p>{new Date(latestEntry.date).toLocaleDateString()}</p>
              <button onClick={() => onNavigate('Life Log')}>
                See your Life Log <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <h3>Your story is waiting to be written.</h3>
              <p>Your little and big wins will show up here.</p>
              <button onClick={() => onNavigate('Life Log')}>
                Record a win <ArrowRight size={15} />
              </button>
            </>
          )}
        </section>

        {/* NEXT DEADLINE */}
        <section className="dashboard-card deadline-card">
          <div className="dashboard-card-heading">
            <span><CalendarDays size={19} /> UPCOMING</span>
          </div>
          <h3>Your next deadline</h3>
          <p>Your upcoming campaign deadlines will appear here.</p>
          <button onClick={() => onNavigate('Campaigns')}>
            View campaigns <ArrowRight size={15} />
          </button>
        </section>

        {/* COLLECTIONS */}
        <section className="dashboard-card collections-card">
          <div className="dashboard-card-heading">
            <span><Trophy size={19} /> YOUR COLLECTIONS</span>
            <button onClick={() => onNavigate('Collections')}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          <div className="collection-preview-grid">
            <div>
              <Footprints size={30} />
              <strong>Movement</strong>
              <small>Your movement wins</small>
            </div>
            <div>
              <Star size={30} />
              <strong>Achievements</strong>
              <small>Milestones you've earned</small>
            </div>
            <div>
              <Gift size={30} />
              <strong>Rewards</strong>
              <small>Your earned treasures</small>
            </div>
          </div>
        </section>

        {/* QUICK CAPTURE */}
        <section className="dashboard-card quick-capture-card">
          <div className="dashboard-card-heading">
            <span><Sparkles size={19} /> QUICK CAPTURE</span>
          </div>
          <h3>Got a win? Write it down!</h3>
          <p>Big accomplishment or tiny victory. It all counts.</p>

          <form
            className="quick-capture-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveQuickCapture();
            }}
          >
            <input
              value={quickCapture}
              onChange={(event) => setQuickCapture(event.target.value)}
              placeholder="I completed a 45 minute workout..."
              aria-label="Write down a win"
            />
            <button type="submit" aria-label="Save to Life Log">
              <Send size={19} />
            </button>
          </form>
          <small>Saved straight to your Life Log.</small>
        </section>

        {/* BURST MODE */}
        <section className="dashboard-card burst-card">
          <div className="dashboard-card-heading">
            <span><Zap size={19} /> BURST MODE</span>
          </div>
          <h3>Ready for a little adventure?</h3>
          <p>Start a focused sprint and make some progress.</p>
          <button
            className="primary-dashboard-button"
            onClick={() => onNavigate('Burst Mode')}
          >
            <Zap size={17} /> Start a Sprint
          </button>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-card recent-activity-card">
          <div className="dashboard-card-heading">
            <span><BookHeart size={19} /> RECENT ACTIVITY</span>
            <button onClick={() => onNavigate('Life Log')}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          {entries.length > 0 ? (
            <div className="recent-entry-list">
              {entries.slice(0, 3).map((entry) => (
                <div className="recent-entry" key={entry.id}>
                  <Sparkles size={17} />
                  <span>{entry.title}</span>
                  <small>
                    {new Date(entry.date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p>Your recent wins and activities will appear here.</p>
          )}
        </section>

      </div>

      {/* LITTLE FAMILIAR */}
      <div className="home-familiar-note">
        <Cat size={22} />
        <span>Your familiar believes in you. Keep going, adventurer.</span>
        <Sparkles size={16} />
      </div>

    </div>
  );
}

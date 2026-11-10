
import { useEffect, useState, type FormEvent } from 'react';
import {
  Plus,
  BookHeart,
  Sparkles,
  Star,
  Heart,
  Footprints,
  Compass,
  Palette,
  BriefcaseBusiness,
  Feather,
  Trash2,
  CalendarDays,
} from 'lucide-react';

type EntryCategory =
  | 'Personal Win'
  | 'Adventure'
  | 'Health & Movement'
  | 'Creative'
  | 'Work'
  | 'General';

type Mood = 'Amazing' | 'Good' | 'Okay' | 'Tired' | 'Challenging';

type LifeEntry = {
  id: number;
  title: string;
  content: string;
  category: EntryCategory;
  mood: Mood;
  date: number;
  isFavorite: boolean;
};

const STORAGE_KEY = 'lifeQuest_lifeLog';

const categories: {
  name: EntryCategory;
  icon: typeof Star;
}[] = [
  { name: 'Personal Win', icon: Star },
  { name: 'Adventure', icon: Compass },
  { name: 'Health & Movement', icon: Footprints },
  { name: 'Creative', icon: Palette },
  { name: 'Work', icon: BriefcaseBusiness },
  { name: 'General', icon: Feather },
];

const moods: Mood[] = [
  'Amazing',
  'Good',
  'Okay',
  'Tired',
  'Challenging',
];

function loadEntries(): LifeEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function LifeLog() {
  const [entries, setEntries] = useState<LifeEntry[]>(loadEntries);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'All' | EntryCategory>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] =
    useState<EntryCategory>('Personal Win');
  const [mood, setMood] = useState<Mood>('Good');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) return;

    const newEntry: LifeEntry = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      category,
      mood,
      date: Date.now(),
      isFavorite: false,
    };

    setEntries((current) =>
      [newEntry, ...current].sort((a, b) => b.date - a.date)
    );

    setTitle('');
    setContent('');
    setCategory('Personal Win');
    setMood('Good');
    setShowForm(false);
  }

  function toggleFavorite(id: number) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, isFavorite: !entry.isFavorite }
          : entry
      )
    );
  }

  function deleteEntry(id: number) {
    if (!window.confirm('Remove this entry from your Life Log?')) {
      return;
    }

    setEntries((current) =>
      current.filter((entry) => entry.id !== id)
    );
  }

  const visibleEntries = entries.filter((entry) => {
    const matchesCategory =
      filter === 'All' || entry.category === filter;

    const matchesFavorite =
      !favoritesOnly || entry.isFavorite;

    return matchesCategory && matchesFavorite;
  });

  const favoriteCount = entries.filter(
    (entry) => entry.isFavorite
  ).length;

  const today = new Date().toDateString();

  const todayCount = entries.filter(
    (entry) => new Date(entry.date).toDateString() === today
  ).length;

  const CategoryIcon = (name: EntryCategory) =>
    categories.find((item) => item.name === name)?.icon || Feather;

  return (
    <div className="life-log-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Little moments, lasting memories</p>
          <h1>Life Log</h1>
          <p>A place to remember the life you're building.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          New Entry
        </button>
      </div>

      <section className="life-log-welcome">
        <div className="life-log-book-icon">
          <BookHeart size={31} />
        </div>

        <div>
          <p className="eyebrow">Your story, in your own words</p>
          <h2>Don't forget how far you've come.</h2>
          <p>
            Big milestones, tiny victories, spontaneous adventures.
            They all deserve a page.
          </p>
        </div>

        <Sparkles className="life-log-decoration" size={25} />
      </section>

      <section className="life-log-stats">
        <div className="life-log-stat">
          <BookHeart size={21} />
          <strong>{entries.length}</strong>
          <span>Memories recorded</span>
        </div>

        <div className="life-log-stat">
          <Star size={21} />
          <strong>{favoriteCount}</strong>
          <span>Favorite moments</span>
        </div>

        <div className="life-log-stat">
          <Sparkles size={21} />
          <strong>{todayCount}</strong>
          <span>Entries today</span>
        </div>
      </section>

      {showForm && (
        <form className="life-log-form" onSubmit={addEntry}>
          <div className="life-log-form-heading">
            <BookHeart size={22} />
            <h2>Write a little memory</h2>
          </div>

          <label>
            What's the moment?
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Finally went on that walk..."
              required
            />
          </label>

          <label>
            Tell the story (optional)
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What happened? How did it feel? What do you want to remember?"
              rows={4}
            />
          </label>

          <div className="life-log-form-row">
            <label>
              Category
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as EntryCategory)
                }
              >
                {categories.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              How did it feel?
              <select
                value={mood}
                onChange={(event) =>
                  setMood(event.target.value as Mood)
                }
              >
                {moods.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              <Sparkles size={17} />
              Save Memory
            </button>
          </div>
        </form>
      )}

      <section className="life-log-timeline">
        <div className="life-log-section-heading">
          <div>
            <p className="eyebrow">The pages of your story</p>
            <h2>Your Timeline</h2>
          </div>

          <button
            className={`life-log-favorites-toggle ${favoritesOnly ? 'active' : ''}`}
            onClick={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Star size={15} />
            {favoritesOnly ? 'All entries' : 'Favorites'}
          </button>
        </div>

        <div className="life-log-filters">
          {(['All', ...categories.map((item) => item.name)] as const).map(
            (value) => (
              <button
                key={value}
                className={filter === value ? 'active' : ''}
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            )
          )}
        </div>

        {visibleEntries.length === 0 ? (
          <div className="life-log-empty">
            <BookHeart size={39} />
            <h3>{favoritesOnly ? 'No favorite memories yet' : 'A fresh, blank page'}</h3>
            <p>
              {favoritesOnly
                ? 'Mark an entry with a star and it will find a home here.'
                : "Your first memory is waiting to be written. It doesn't have to be a big one."}
            </p>
          </div>
        ) : (
          <div className="life-log-entries">
            {visibleEntries.map((entry) => {
              const Icon = CategoryIcon(entry.category);

              return (
                <article className="life-log-entry" key={entry.id}>
                  <div className="life-log-entry-icon">
                    <Icon size={21} />
                  </div>

                  <div className="life-log-entry-content">
                    <div className="life-log-entry-meta">
                      <span className="life-log-category">
                        {entry.category}
                      </span>
                      <span className="life-log-date">
                        <CalendarDays size={13} />
                        {formatDate(entry.date)}
                      </span>
                    </div>

                    <h3>{entry.title}</h3>

                    {entry.content && (
                      <p className="life-log-entry-description">
                        {entry.content}
                      </p>
                    )}

                    <div className="life-log-entry-footer">
                      <span className={`life-log-mood mood-${entry.mood.toLowerCase()}`}>
                        {entry.mood}
                      </span>

                      {entry.isFavorite && (
                        <span className="life-log-favorite-label">
                          <Star size={13} />
                          Favorite
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="life-log-entry-actions">
                    <button
                      title={entry.isFavorite ? 'Remove favorite' : 'Mark favorite'}
                      onClick={() => toggleFavorite(entry.id)}
                    >
                      <Star
                        size={17}
                        fill={entry.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>

                    <button
                      title="Delete entry"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}


import { useEffect, useState } from 'react';
import {
  Plus,
  Stamp,
  Sparkles,
  Gift,
  CheckCircle2,
  RotateCcw,
  CalendarDays,
  Archive,
} from 'lucide-react';

type Frequency = 'anytime' | 'daily' | 'weekly';
type CardStatus = 'active' | 'completed' | 'retired';

type CompletedRound = {
  completedAt: number;
  stampsEarned: number;
  reward: string;
};

type PunchCard = {
  id: number;
  title: string;
  description: string;
  frequency: Frequency;
  stampGoal: number;
  weeklyTarget: number;
  weeksGoal: number;
  stamps: number[];
  reward: string;
  status: CardStatus;
  history: CompletedRound[];
};

const STORAGE_KEY = 'lifeQuest_punchCards';

function getWeekStart(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const daysSinceMonday = (day + 6) % 7;
  date.setDate(date.getDate() - daysSinceMonday);

  return date.getTime();
}

function isSameDay(first: number, second: number) {
  const a = new Date(first);
  const b = new Date(second);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getThisWeekCount(stamps: number[]) {
  const thisWeek = getWeekStart(Date.now());

  return stamps.filter(
    (stamp) => getWeekStart(stamp) === thisWeek
  ).length;
}

function getCompletedWeeks(card: PunchCard) {
  const weeklyCounts = new Map<number, number>();

  card.stamps.forEach((stamp) => {
    const week = getWeekStart(stamp);
    weeklyCounts.set(week, (weeklyCounts.get(week) || 0) + 1);
  });

  return [...weeklyCounts.values()].filter(
    (count) => count >= card.weeklyTarget
  ).length;
}

function isCardComplete(card: PunchCard) {
  if (card.frequency === 'weekly') {
    return getCompletedWeeks(card) >= card.weeksGoal;
  }

  return card.stamps.length >= card.stampGoal;
}

// Keeps cards created with the older version of Punch Cards.
function loadCards(): PunchCard[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return parsed.map((card: any) => ({
      id: card.id,
      title: card.title,
      description: card.description || '',
      frequency: card.frequency || 'anytime',
      stampGoal: card.stampGoal || 10,
      weeklyTarget: card.weeklyTarget || 3,
      weeksGoal: card.weeksGoal || 4,
      stamps:
        card.stamps ||
        Array.from(
          { length: card.stampsEarned || 0 },
          (_, index) => Date.now() - index * 86400000
        ),
      reward: card.reward || '',
      status: card.status || 'active',
      history: card.history || [],
    }));
  } catch {
    return [];
  }
}

export default function PunchCards() {
  const [cards, setCards] = useState<PunchCard[]>(loadCards);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('anytime');
  const [stampGoal, setStampGoal] = useState('10');
  const [weeklyTarget, setWeeklyTarget] = useState('3');
  const [weeksGoal, setWeeksGoal] = useState('4');
  const [reward, setReward] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  function createCard(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim() || !reward.trim()) return;

    const newCard: PunchCard = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      frequency,
      stampGoal: Math.max(1, Number(stampGoal)),
      weeklyTarget: Math.max(1, Number(weeklyTarget)),
      weeksGoal: Math.max(1, Number(weeksGoal)),
      stamps: [],
      reward: reward.trim(),
      status: 'active',
      history: [],
    };

    setCards((current) => [...current, newCard]);

    setTitle('');
    setDescription('');
    setFrequency('anytime');
    setStampGoal('10');
    setWeeklyTarget('3');
    setWeeksGoal('4');
    setReward('');
    setShowForm(false);
  }

  function canEarnStamp(card: PunchCard) {
    if (card.status !== 'active') return false;

    if (card.frequency === 'daily') {
      return !card.stamps.some((stamp) => isSameDay(stamp, Date.now()));
    }

    if (card.frequency === 'weekly') {
      return getThisWeekCount(card.stamps) < card.weeklyTarget;
    }

    return true;
  }

  function earnStamp(id: number) {
    setCards((current) =>
      current.map((card) => {
        if (card.id !== id || !canEarnStamp(card)) return card;

        const updatedCard = {
          ...card,
          stamps: [...card.stamps, Date.now()],
        };

        if (isCardComplete(updatedCard)) {
          updatedCard.status = 'completed';
        }

        return updatedCard;
      })
    );
  }

  function startAnotherRound(id: number) {
    setCards((current) =>
      current.map((card) => {
        if (card.id !== id) return card;

        return {
          ...card,
          stamps: [],
          status: 'active',
          history: [
            ...card.history,
            {
              completedAt: Date.now(),
              stampsEarned: card.stamps.length,
              reward: card.reward,
            },
          ],
        };
      })
    );
  }

  function retireCard(id: number) {
    setCards((current) =>
      current.map((card) => {
        if (card.id !== id) return card;

        return {
          ...card,
          status: 'retired',
          history: [
            ...card.history,
            {
              completedAt: Date.now(),
              stampsEarned: card.stamps.length,
              reward: card.reward,
            },
          ],
        };
      })
    );
  }

  function getProgress(card: PunchCard) {
    if (card.frequency === 'weekly') {
      return getCompletedWeeks(card);
    }

    return card.stamps.length;
  }

  function getGoal(card: PunchCard) {
    return card.frequency === 'weekly'
      ? card.weeksGoal
      : card.stampGoal;
  }

  function getProgressLabel(card: PunchCard) {
    if (card.frequency === 'weekly') {
      return `${getThisWeekCount(card.stamps)} / ${card.weeklyTarget} this week`;
    }

    if (card.frequency === 'daily') {
      return `${card.stamps.length} / ${card.stampGoal} days`;
    }

    return `${card.stamps.length} / ${card.stampGoal} stamps`;
  }

  function getFrequencyLabel(card: PunchCard) {
    if (card.frequency === 'daily') return 'Daily';
    if (card.frequency === 'weekly') return 'Weekly';
    return 'Anytime';
  }

  const activeCards = cards.filter((card) => card.status !== 'retired');
  const retiredCards = cards.filter((card) => card.status === 'retired');

  function deletePunchCard(id: number) {
    setCards((current) => current.filter((card) => card.id !== id));
  }

  return (
    <div className="punch-cards-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Little efforts, lovely rewards</p>
          <h1 className="h1">Punch Cards</h1>
          <p>Collect your stamps. Earn your rewards. Keep your magic moving.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          New Punch Card
        </button>
      </div>

      {showForm && (
        <form className="punch-form" onSubmit={createCard}>
          <h2>Create a Punch Card</h2>

          <label>
            Card name
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="The Wandering Moon"
              required
            />
          </label>

          <label>
            Description
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A little more movement in my week..."
            />
          </label>

          <label>
            How should stamps be earned?
            <select
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value as Frequency)
              }
            >
              <option value="anytime">Anytime — each completion counts</option>
              <option value="daily">Daily — one stamp per day</option>
              <option value="weekly">Weekly — reach a weekly target</option>
            </select>
          </label>

          {frequency === 'weekly' ? (
            <div className="form-row">
              <label>
                Completions per week
                <input
                  type="number"
                  min="1"
                  value={weeklyTarget}
                  onChange={(event) => setWeeklyTarget(event.target.value)}
                />
              </label>

              <label>
                Number of weeks
                <input
                  type="number"
                  min="1"
                  value={weeksGoal}
                  onChange={(event) => setWeeksGoal(event.target.value)}
                />
              </label>
            </div>
          ) : (
            <label>
              {frequency === 'daily' ? 'Number of days' : 'Number of stamps'}
              <input
                type="number"
                min="1"
                value={stampGoal}
                onChange={(event) => setStampGoal(event.target.value)}
              />
            </label>
          )}

          <label>
            Your reward
            <input
              value={reward}
              onChange={(event) => setReward(event.target.value)}
              placeholder="A new book, a game night..."
              required
            />
          </label>

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
              Create Card
            </button>
          </div>
        </form>
      )}

      <div className="punch-card-grid">
        {activeCards.map((card) => {
          const progress = getProgress(card);
          const goal = getGoal(card);
          const complete = card.status === 'completed';
          const canStamp = canEarnStamp(card);

          return (
            <div className="punch-card" key={card.id}>
              <div className="punch-card-top">
                <span className="frequency-label">
                  {getFrequencyLabel(card)}
                </span>
                {complete ? (
                  <CheckCircle2 className="completed-icon" />
                ) : (
                  <Stamp className="stamp-icon" />
                )}
              </div>

              <h2>{card.title}</h2>
              <p className="punch-description">{card.description}</p>

              <div className="stamp-grid">
                {Array.from({ length: goal }).map((_, index) => {
                  const filled = index < progress;

                  return (
                    <div
                      className={`stamp-slot ${filled ? 'filled' : ''}`}
                      key={index}
                    >
                      {filled ? <Sparkles size={17} /> : <span>✧</span>}
                    </div>
                  );
                })}
              </div>
                <div>
                  <button
                    className="delete-button"
                    onClick={() => deletePunchCard(card.id)}
                  >
                    <Archive size={16} />
                    Delete Card
                  </button>
                </div>

              <div className="punch-progress">
                <div className="progress-label">
                  <span>{getProgressLabel(card)}</span>
                  <span>{Math.round((progress / goal) * 100)}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, (progress / goal) * 100)}%` }}
                  />
                </div>
              </div>

              {card.frequency === 'weekly' && !complete && (
                <p className="weekly-note">
                  <CalendarDays size={14} />
                  {getCompletedWeeks(card)} of {card.weeksGoal} weeks completed
                </p>
              )}

              <div className="punch-reward">
                <Gift size={18} />
                <div>
                  <span>Reward</span>
                  <strong>{card.reward}</strong>
                </div>
              </div>

              {complete ? (
                <div className="completion-actions">
                  <p className="completion-message">
                    <Sparkles size={16} />
                    Card completed! You earned your reward!
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => startAnotherRound(card.id)}
                  >
                    <RotateCcw size={16} />
                    Start another round
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => retireCard(card.id)}
                  >
                    <Archive size={16} />
                    Retire this card
                  </button>
                </div>
              ) : (
                <button
                  className="stamp-button"
                  onClick={() => earnStamp(card.id)}
                  disabled={!canStamp}
                >
                  <Stamp size={17} />
                  {canStamp
                    ? 'Earn a Stamp'
                    : card.frequency === 'daily'
                      ? 'Already stamped today'
                      : 'Weekly target reached'}
                </button>
              )}

              {card.history.length > 0 && (
                <p className="round-history">
                  <Archive size={13} />
                  {card.history.length} previous round
                  {card.history.length === 1 ? '' : 's'} completed
                </p>
              )}
            </div>
          );
        })}
      </div>

      {activeCards.length === 0 && (
        <div className="empty-punch-state">
          <Stamp size={38} />
          <h2>Your collection awaits</h2>
          <p>Create your first punch card and give yourself something fun to work toward.</p>
        </div>
      )}

      {retiredCards.length > 0 && (
        <section className="retired-cards">
          <h2><Archive size={19} /> Retired Cards</h2>
          <p>These adventures are complete. Their history stays here.</p>

          {retiredCards.map((card) => (
            <div className="retired-card-row" key={card.id}>
              <div>
                <strong>{card.title}</strong>
                <span>{card.history.length} completed round(s)</span>
              </div>
              <CheckCircle2 size={19} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

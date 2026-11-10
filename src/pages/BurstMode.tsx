
import { useEffect, useState } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  History,
} from 'lucide-react';

type FocusSession = {
  id: number;
  task: string;
  duration: number;
  completedAt: number;
};

const STORAGE_KEY = 'lifeQuest_burstSessions';

const durations = [5, 10, 15, 25, 45];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function loadSessions(): FocusSession[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function BurstMode() {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(15);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessions, setSessions] = useState<FocusSession[]>(loadSessions);

  const totalSeconds = duration * 60;
  const secondsRemaining = Math.max(0, totalSeconds - secondsElapsed);
  const progress = Math.min(100, (secondsElapsed / totalSeconds) * 100);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // The timer only ticks while a burst is running.
  useEffect(() => {
    if (!isRunning || isComplete) return;

    const interval = window.setInterval(() => {
      setSecondsElapsed((current) => Math.min(current + 1, totalSeconds));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, isComplete, totalSeconds]);

  // Automatically finish and record a burst when the timer reaches zero.
  useEffect(() => {
    if (!isRunning || secondsElapsed < totalSeconds) return;

    setIsRunning(false);
    setIsComplete(true);

    setSessions((current) => [
      {
        id: Date.now(),
        task: task.trim() || 'Unspecified quest',
        duration,
        completedAt: Date.now(),
      },
      ...current,
    ]);
  }, [secondsElapsed, totalSeconds, isRunning, task, duration]);

  function startBurst() {
    if (isComplete) return;
    setIsRunning(true);
  }

  function pauseBurst() {
    setIsRunning(false);
  }

  function resetBurst() {
    setIsRunning(false);
    setSecondsElapsed(0);
    setIsComplete(false);
  }

  function finishEarly() {
    if (secondsElapsed === 0 || isComplete) return;

    setIsRunning(false);
    setIsComplete(true);

    setSessions((current) => [
      {
        id: Date.now(),
        task: task.trim() || 'Unspecified quest',
        duration: Math.max(1, Math.ceil(secondsElapsed / 60)),
        completedAt: Date.now(),
      },
      ...current,
    ]);
  }

  function startFreshBurst() {
    setSecondsElapsed(0);
    setIsComplete(false);
    setIsRunning(false);
    setTask('');
  }

  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (session) => new Date(session.completedAt).toDateString() === today
  );
  const todayMinutes = todaySessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  return (
    <div className="burst-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">A little focus goes a long way</p>
          <h1>Burst Mode</h1>
          <p>Choose a quest. Set a timer. Make a little magic happen.</p>
        </div>
      </div>

      <section className="burst-chamber">
        <div className="burst-glow" />

        <div className="burst-heading">
          <span className="burst-symbol">
            {isComplete ? (
              <CheckCircle2 size={25} />
            ) : (
              <Zap size={25} />
            )}
          </span>
          <span>{isComplete ? 'Quest completed' : 'Your focus chamber'}</span>
        </div>

        {!isComplete && (
          <label className="burst-task-field">
            What are we working on?
            <input
              value={task}
              onChange={(event) => setTask(event.target.value)}
              placeholder="e.g. Work on my Life Quest app..."
              disabled={isRunning}
            />
          </label>
        )}

        <div className="burst-timer">
          <div
            className="timer-ring"
            style={{
              background: `conic-gradient(var(--gold) ${progress}%, rgba(213, 185, 130, 0.13) ${progress}% 100%)`,
            }}
          >
            <div className="timer-inner">
              <span className="timer-caption">
                {isComplete ? 'WELL DONE' : isRunning ? 'IN YOUR FLOW' : 'TIME REMAINING'}
              </span>
              <strong>{formatTime(secondsRemaining)}</strong>
              <span className="timer-subtitle">
                {isComplete ? 'You did it!' : `${duration} minute burst`}
              </span>
            </div>
          </div>
        </div>

        {!isComplete && (
          <div className="burst-duration-picker">
            <span>Choose your burst</span>
            <div className="duration-options">
              {durations.map((minutes) => (
                <button
                  key={minutes}
                  className={duration === minutes ? 'selected' : ''}
                  onClick={() => {
                    if (!isRunning) {
                      setDuration(minutes);
                      setSecondsElapsed(0);
                    }
                  }}
                  disabled={isRunning}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>
        )}

        {isComplete ? (
          <div className="burst-finished">
            <Sparkles size={22} />
            <h2>Beautifully done.</h2>
            <p>
              {task.trim() || 'Your focus burst'} is in the books.
              Take a breath and enjoy that little win.
            </p>
            <button className="burst-primary-button" onClick={startFreshBurst}>
              <Zap size={17} />
              Start another burst
            </button>
          </div>
        ) : (
          <div className="burst-controls">
            {!isRunning ? (
              <button className="burst-primary-button" onClick={startBurst}>
                <Play size={18} />
                {secondsElapsed > 0 ? 'Resume burst' : 'Begin burst'}
              </button>
            ) : (
              <button className="burst-primary-button" onClick={pauseBurst}>
                <Pause size={18} />
                Pause
              </button>
            )}

            <div className="burst-secondary-controls">
              <button className="burst-quiet-button" onClick={resetBurst}>
                <RotateCcw size={16} />
                Reset
              </button>

              {secondsElapsed > 0 && (
                <button className="burst-quiet-button" onClick={finishEarly}>
                  <CheckCircle2 size={16} />
                  Finish burst
                </button>
              )}
            </div>
          </div>
        )}

        <p className="burst-encouragement">
          Progress over perfection. Always.
        </p>
      </section>

      <section className="burst-stats">
        <div className="burst-stat-card">
          <Clock size={21} />
          <div>
            <strong>{todayMinutes}</strong>
            <span>Minutes focused today</span>
          </div>
        </div>

        <div className="burst-stat-card">
          <Sparkles size={21} />
          <div>
            <strong>{todaySessions.length}</strong>
            <span>Bursts completed today</span>
          </div>
        </div>

        <div className="burst-stat-card">
          <Zap size={21} />
          <div>
            <strong>{sessions.length}</strong>
            <span>Total bursts completed</span>
          </div>
        </div>
      </section>

      <section className="burst-history">
        <div className="burst-section-heading">
          <div>
            <p className="eyebrow">Your little victories</p>
            <h2><History size={20} /> Recent Bursts</h2>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="burst-empty">
            <Sparkles size={25} />
            <p>Your first completed burst will appear here.</p>
          </div>
        ) : (
          sessions.slice(0, 8).map((session) => (
            <div className="burst-history-row" key={session.id}>
              <div className="burst-history-icon">
                <CheckCircle2 size={18} />
              </div>
              <div className="burst-history-task">
                <strong>{session.task}</strong>
                <span>
                  {new Date(session.completedAt).toLocaleDateString()} ·{' '}
                  {new Date(session.completedAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <span className="burst-history-duration">
                {session.duration} min
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

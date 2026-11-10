
import { useEffect, useState, type FormEvent } from 'react';
import {
  Plus,
  Sparkles,
  Trophy,
  Gift,
  Gem,
  Star,
  CheckCircle2,
  Archive,
  Trash2,
  BookOpen,
} from 'lucide-react';

type CollectionCategory = 'achievement' | 'reward' | 'treasure';
type CollectionStatus = 'collected' | 'wishlist';
type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

type CollectionItem = {
  id: number;
  title: string;
  description: string;
  category: CollectionCategory;
  rarity: Rarity;
  status: CollectionStatus;
  dateCollected: number | null;
};

const STORAGE_KEY = 'lifeQuest_collections';

const categoryInfo = {
  achievement: {
    label: 'Achievements',
    icon: Trophy,
  },
  reward: {
    label: 'Rewards',
    icon: Gift,
  },
  treasure: {
    label: 'Treasures',
    icon: Gem,
  },
};

function loadCollection(): CollectionItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Collections() {
  const [items, setItems] = useState<CollectionItem[]>(loadCollection);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | CollectionCategory>('all');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] =
    useState<CollectionCategory>('achievement');
  const [rarity, setRarity] = useState<Rarity>('common');
  const [status, setStatus] =
    useState<CollectionStatus>('collected');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) return;

    const newItem: CollectionItem = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      rarity,
      status,
      dateCollected: status === 'collected' ? Date.now() : null,
    };

    setItems((current) => [newItem, ...current]);

    setTitle('');
    setDescription('');
    setCategory('achievement');
    setRarity('common');
    setStatus('collected');
    setShowForm(false);
  }

  function toggleCollected(id: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const isCollected = item.status === 'collected';

        return {
          ...item,
          status: isCollected ? 'wishlist' : 'collected',
          dateCollected: isCollected ? null : Date.now(),
        };
      })
    );
  }

  function deleteItem(id: number) {
    const confirmed = window.confirm(
      'Remove this item from your collection?'
    );

    if (!confirmed) return;

    setItems((current) => current.filter((item) => item.id !== id));
  }

  const collectedItems = items.filter(
    (item) => item.status === 'collected'
  );

  const wishlistItems = items.filter(
    (item) => item.status === 'wishlist'
  );

  const visibleItems = items.filter((item) => {
    return filter === 'all' || item.category === filter;
  });

  const achievementCount = collectedItems.filter(
    (item) => item.category === 'achievement'
  ).length;

  const rewardCount = collectedItems.filter(
    (item) => item.category === 'reward'
  ).length;

  const treasureCount = collectedItems.filter(
    (item) => item.category === 'treasure'
  ).length;

  return (
    <div className="collections-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">A little archive of your adventures</p>
          <h1>Collections</h1>
          <p>Every accomplishment deserves a place in your story.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          Add to Collection
        </button>
      </div>

      <section className="collection-welcome">
        <div className="collection-welcome-icon">
          <BookOpen size={30} />
        </div>
        <div>
          <p className="eyebrow">Your personal archive</p>
          <h2>The things you've gathered along the way</h2>
          <p>
            Achievements, rewards, and little treasures.
            This is proof of all the adventures you've taken.
          </p>
        </div>
        <Sparkles className="collection-decoration" size={25} />
      </section>

      <section className="collection-stats">
        <div className="collection-stat">
          <Trophy size={22} />
          <strong>{achievementCount}</strong>
          <span>Achievements</span>
        </div>

        <div className="collection-stat">
          <Gift size={22} />
          <strong>{rewardCount}</strong>
          <span>Rewards earned</span>
        </div>

        <div className="collection-stat">
          <Gem size={22} />
          <strong>{treasureCount}</strong>
          <span>Treasures found</span>
        </div>

        <div className="collection-stat">
          <Star size={22} />
          <strong>{collectedItems.length}</strong>
          <span>Total collected</span>
        </div>
      </section>

      {showForm && (
        <form className="collection-form" onSubmit={addItem}>
          <h2>Add something to your collection</h2>

          <label>
            Name
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="The First Adventure..."
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What makes this one special?"
              rows={3}
            />
          </label>

          <div className="collection-form-row">
            <label>
              Collection type
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CollectionCategory)
                }
              >
                <option value="achievement">Achievement</option>
                <option value="reward">Reward</option>
                <option value="treasure">Treasure</option>
              </select>
            </label>

            <label>
              Rarity
              <select
                value={rarity}
                onChange={(event) =>
                  setRarity(event.target.value as Rarity)
                }
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </label>
          </div>

          <label>
            Collection status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as CollectionStatus)
              }
            >
              <option value="collected">Already collected</option>
              <option value="wishlist">Want to find</option>
            </select>
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
              Add Item
            </button>
          </div>
        </form>
      )}

      <section className="collection-library">
        <div className="collection-library-heading">
          <div>
            <p className="eyebrow">The grand archive</p>
            <h2>Your Collection</h2>
          </div>

          <span className="collection-total">
            {collectedItems.length} collected
          </span>
        </div>

        <div className="collection-filters">
          {(['all', 'achievement', 'reward', 'treasure'] as const).map(
            (value) => (
              <button
                key={value}
                className={filter === value ? 'active' : ''}
                onClick={() => setFilter(value)}
              >
                {value === 'all'
                  ? 'Everything'
                  : categoryInfo[value].label}
              </button>
            )
          )}
        </div>

        {visibleItems.length === 0 ? (
          <div className="collection-empty">
            <Gem size={38} />
            <h3>Your shelves are waiting</h3>
            <p>
              Add your first achievement, reward, or treasure
              to start filling your collection.
            </p>
          </div>
        ) : (
          <div className="collection-grid">
            {visibleItems.map((item) => {
              const Icon = categoryInfo[item.category].icon;
              const collected = item.status === 'collected';

              return (
                <article
                  className={`collection-item ${collected ? 'is-collected' : 'is-wishlist'}`}
                  key={item.id}
                >
                  <div className="collection-item-top">
                    <div className="collection-item-icon">
                      <Icon size={27} />
                    </div>

                    <span className={`rarity rarity-${item.rarity}`}>
                      {item.rarity}
                    </span>
                  </div>

                  <span className="collection-item-category">
                    {categoryInfo[item.category].label}
                  </span>

                  <h3>{item.title}</h3>

                  <p className="collection-item-description">
                    {item.description || 'A little piece of your story.'}
                  </p>

                  <div className="collection-item-bottom">
                    {collected ? (
                      <span className="collection-collected-label">
                        <CheckCircle2 size={14} />
                        Collected
                      </span>
                    ) : (
                      <span className="collection-wishlist-label">
                        <Sparkles size={14} />
                        Want to find
                      </span>
                    )}

                    <div className="collection-item-actions">
                      <button
                        title={collected ? 'Move to wishlist' : 'Mark collected'}
                        onClick={() => toggleCollected(item.id)}
                      >
                        {collected ? (
                          <Archive size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                      </button>

                      <button
                        title="Remove item"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {wishlistItems.length > 0 && (
        <section className="collection-wishlist">
          <div className="collection-library-heading">
            <div>
              <p className="eyebrow">Future adventures</p>
              <h2>Want to Find</h2>
            </div>
            <span className="collection-total">
              {wishlistItems.length} waiting
            </span>
          </div>
          <p>
            Things you're working toward or hoping to discover.
            Mark them collected when you earn them.
          </p>
        </section>
      )}
    </div>
  );
}


import "./Styling/Campaigns.css";
import { useState } from "react";
import { Plus, BookOpen, Sparkles, Compass } from "lucide-react";

import { useCampaigns } from "./CampaignContext";
import CampaignCreation from "./CapaignCreation";
import CampaignOverview from "./CampaignOverview";

export default function Campaigns() {
  const { campaigns } = useCampaigns();

  const [showCreation, setShowCreation] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  function handleCampaignCreated(campaignId: number) {
    setShowCreation(false);
    setSelectedCampaignId(campaignId);
  }

  if (selectedCampaignId !== null) {
    return (
      <CampaignOverview
        campaignId={selectedCampaignId}
        onBack={() => setSelectedCampaignId(null)}
      />
    );
  }

  if (showCreation) {
    return (
      <CampaignCreation
        onCancel={() => setShowCreation(false)}
        onCreated={handleCampaignCreated}
      />
    );
  }

  return (
    <div className="campaigns-page">

      {/* ADVENTURE LANDSCAPE */}
      <header className="campaign-hero">
        <div className="hero-brand">
          <span className="hero-paw">🐾</span>
          <span>Life Quest</span>
        </div>

        <div className="hero-compass">
          <Compass size={42} strokeWidth={1} />
        </div>

        <div className="hero-content">
          <span className="hero-eyebrow">A JOURNAL OF LITTLE ADVENTURES</span>
          <h1>Your Adventures Await</h1>
          <div className="hero-divider">
            <span />
            ✦
            <span />
          </div>
          <p>Every great journey begins with a single step.</p>
        </div>

        <div className="hero-cat">🐈‍⬛</div>
      </header>

      {/* CAMPAIGN BOOKSHELF */}
      <main className="campaign-library">

        <div className="library-heading">
          <div>
            <span className="eyebrow">YOUR COLLECTION</span>
            <h2><BookOpen size={25} /> Campaign Bookshelf</h2>
            <p>Every book holds a story still being written...</p>
          </div>

          <Sparkles className="library-sparkle" size={27} />
        </div>

        <div className="library-layout">

          <section className="bookshelf-area">
            {campaigns.length === 0 ? (
              <div className="empty-library">
                <div className="empty-book">✧</div>
                <h3>Your bookshelf is waiting...</h3>
                <p>
                  Every great adventure starts somewhere.
                  Create your first campaign and give your story a beginning.
                </p>
                <button
                  className="begin-button"
                  onClick={() => setShowCreation(true)}
                >
                  <Plus size={17} />
                  Begin your first adventure
                </button>
              </div>
            ) : (
              <div className="campaign-bookshelf">
                <div className="book-collection">
                  {campaigns.map((campaign, index) => {
                    const completed = campaign.completedMilestones.length;
                    const total = campaign.milestones.length;
                    const progress = total > 0
                      ? Math.round((completed / total) * 100)
                      : 0;

                    return (
                      <button
                        className={`campaign-book book-variant-${index % 4}`}
                        key={campaign.id}
                        onClick={() => setSelectedCampaignId(campaign.id)}
                        aria-label={`Open ${campaign.title}, ${progress}% complete`}
                      >
                        <span className="book-spine" />

                        <span className="book-cover-inner">
                          <span className="book-cover-decoration">✧ ❧ ✧</span>

                          <span className="book-art">
                            <span className="book-art-sun" />
                            <span className="book-art-mountain mountain-one" />
                            <span className="book-art-mountain mountain-two" />
                            <span className="book-art-hills" />
                            <span className="book-art-tree tree-one">♠</span>
                            <span className="book-art-tree tree-two">♠</span>
                          </span>

                          <span className="book-title-plaque">
                            {campaign.title}
                          </span>

                          <span className="book-progress-ribbon">
                            {progress}%
                          </span>

                          <span className="book-completion">
                            {progress === 100 ? "✦ COMPLETED ✦" : `${completed}/${total} quests`}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="bookshelf-ledge">
                  <span className="shelf-detail" />
                </div>
              </div>
            )}
          </section>

          {/* NEW ADVENTURE INVITATION */}
          <aside className="new-adventure">
            <span className="invitation-star">✦</span>
            <span className="eyebrow">THE NEXT CHAPTER</span>
            <h3>Begin a New Adventure</h3>
            <p>
              A new goal, a new quest, a new little story waiting to unfold.
            </p>

            <div className="invitation-book">
              <BookOpen size={57} strokeWidth={1} />
              <Sparkles className="invitation-sparkle" size={20} />
            </div>

            <button
              className="begin-button"
              onClick={() => setShowCreation(true)}
            >
              <Plus size={17} />
              Create a Campaign
            </button>

            <span className="invitation-footer">YOUR STORY IS YOURS TO WRITE</span>
          </aside>

        </div>

        <div className="library-footer">
          <span>✧</span>
          <p>Take your time. Every little step is part of the adventure.</p>
          <span>✧</span>
        </div>

      </main>
    </div>
  );
}

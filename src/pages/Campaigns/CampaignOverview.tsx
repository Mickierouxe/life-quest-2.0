import "./Styling/CampaignsOverview.css";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ScrollText,
  Map,
  Flag,
  Gift,
  Sparkles,
  CalendarDays,
  CheckCircle2,
  PawPrint,
  Compass,
} from "lucide-react";

import { useCampaigns } from "./CampaignContext";

type CampaignOverviewProps = {
  campaignId: number;
  onBack: () => void;
};

type JournalTab =
  | "Overview"
  | "Quests"
  | "Map"
  | "Milestones"
  | "Rewards"
  | "Encounters";

const journalTabs = [
  { name: "Overview", icon: BookOpen },
  { name: "Quests", icon: ScrollText },
  { name: "Map", icon: Map },
  { name: "Milestones", icon: Flag },
  { name: "Rewards", icon: Gift },
  { name: "Encounters", icon: Sparkles },
] as const;

export default function CampaignOverview({
  campaignId,
  onBack,
}: CampaignOverviewProps) {

  const { campaigns, toggleMilestone } = useCampaigns();

  const [activeTab, setActiveTab] = useState<JournalTab>("Overview");

  const campaign = campaigns.find(
    (item) => item.id === campaignId
  );

  if (!campaign) {
    return (
      <div className="journal-page">
        <button onClick={onBack}>
          <ArrowLeft size={17} />
          Back to Campaigns
        </button>
        <h2>Adventure not found</h2>
      </div>
    );
  }

  const completed = campaign.completedMilestones.length;
  const total = campaign.milestones.length;

  const progress = total > 0
    ? Math.round((completed / total) * 100)
    : 0;

  return (
    <div className="journal-page">

      <button className="journal-back" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to Campaigns
      </button>

      {/* Journal navigation */}
      <nav className="journal-tabs">
        {journalTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.name}
              className={`journal-tab ${
                activeTab === tab.name ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <Icon size={18} />
              {tab.name}
            </button>
          );
        })}
      </nav>

      {/* Journal contents */}
      <main className="journal-book">

        {activeTab === "Overview" && (
          <div className="journal-spread">

            <section className="journal-left-page">

              <span className="journal-ribbon">
                YOUR ADVENTURE JOURNAL
              </span>

              <h1>{campaign.title}</h1>

              <div className="journal-decoration">✦ ─── ❖ ─── ✦</div>

              <p className="journal-description">
                {campaign.description ||
                  "Every great adventure begins with a single step."}
              </p>

              <section className="journal-progress">
                <h2>Adventure Progress</h2>

                <div className="journal-progress-row">
                  <div className="journal-progress-track">
                    <div
                      className="journal-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <strong>{progress}%</strong>
                </div>

                <p>
                  {completed} of {total} milestones completed
                </p>
              </section>

              <section className="journal-details">
                <h2>Campaign Details</h2>

                <div className="journal-detail-item">
                  <CalendarDays size={19} />
                  <div>
                    <span>Target Date</span>
                    <strong>
                      {campaign.deadline
                        ? new Date(
                            `${campaign.deadline}T00:00:00`
                          ).toLocaleDateString()
                        : "No target date"}
                    </strong>
                  </div>
                </div>

                <div className="journal-detail-item">
                  <Flag size={19} />
                  <div>
                    <span>Adventure Status</span>
                    <strong>
                      {progress === 100 && total > 0
                        ? "Completed"
                        : "In Progress"}
                    </strong>
                  </div>
                </div>
              </section>

              <div className="journal-quote">
                "Small steps still move you forward."
              </div>

            </section>

            <section className="journal-right-page">

              <div className="journal-landscape">
                <div className="journal-landscape-content">
                  <Compass size={42} />
                  <h2>Your Adventure Awaits</h2>
                  <p>Every journey has a story.</p>
                </div>
              </div>

              <section className="journal-milestones">
                <h2>✦ Milestones ✦</h2>

                {campaign.milestones.length === 0 ? (
                  <p>No milestones added yet.</p>
                ) : (
                  campaign.milestones.map((milestone, index) => {
                    const isComplete =
                      campaign.completedMilestones.includes(index);

                    return (
                      <label
                        className="journal-milestone"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          checked={isComplete}
                          onChange={() =>
                            toggleMilestone(campaign.id, index)
                          }
                        />

                        <span>
                          {milestone}
                        </span>

                        {isComplete && (
                          <CheckCircle2 size={17} />
                        )}
                      </label>
                    );
                  })
                )}
              </section>

              <div className="journal-encouragement">
                <PawPrint size={24} />
                <p>You've got this, adventurer!</p>
              </div>

            </section>
          </div>
        )}

        {activeTab !== "Overview" && (
          <section className="journal-placeholder">
            <span className="journal-ribbon">
              YOUR ADVENTURE JOURNAL
            </span>

            <h1>{activeTab}</h1>

            <div className="journal-decoration">✦ ─── ❖ ─── ✦</div>

            <p>
              This chapter of your adventure is still being written.
            </p>

            <p>
              We'll build this section next!
            </p>

            <button
              className="journal-return"
              onClick={() => setActiveTab("Overview")}
            >
              Return to Overview
            </button>
          </section>
        )}

      </main>
    </div>
  );
}

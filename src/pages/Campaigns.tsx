
import { useEffect, useState } from 'react';//Use state stores campaigns and useEffect saves these to Local storage. 
import { Flag, Plus, CalendarDays, CheckCircle2, Sparkles } from 'lucide-react';//Might change these icons later 

type Campaign = {//Defining the type for a campaign object
  id: number;
  title: string;
  description: string;
  deadline: string;
  milestones: string[];
  completedMilestones: number[];
};

export default function Campaigns() {//Using use state to store campaigns and useEffect to save them to local storage.
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
  const savedCampaigns = localStorage.getItem('lifeQuest_campaigns');

  return savedCampaigns ? JSON.parse(savedCampaigns) : [];
});

useEffect(() => {//saving campaigns to local storage 
  localStorage.setItem(
    'lifeQuest_campaigns',
    JSON.stringify(campaigns)
  );
}, [campaigns]);

  const [showForm, setShowForm] = useState(false);//
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [milestonesText, setMilestonesText] = useState('');

  function createCampaign(event: React.FormEvent<HTMLFormElement>) {//Creating a new campaign and adding it to the campaigns state
    event.preventDefault();

    const milestones = milestonesText
      .split('\n')
      .map((milestone) => milestone.trim())
      .filter((milestone) => milestone.length > 0);

    const newCampaign: Campaign = {//Creating a new campaign object with the form data
      id: Date.now(),
      title,
      description,
      deadline,
      milestones,
      completedMilestones: [],
    };

    setCampaigns([...campaigns, newCampaign]);//Setting new values for the campaign form. 

    // Clear the form after creating a campaign.
    setTitle('');
    setDescription('');
    setDeadline('');
    setMilestonesText('');
    setShowForm(false);
  }

  function toggleMilestone(campaignId: number, milestoneIndex: number) {//Lets you complete a milestone and saves it. 
    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) => {
        if (campaign.id !== campaignId) return campaign;

        const alreadyCompleted = campaign.completedMilestones.includes(
          milestoneIndex
        );

        const completedMilestones = alreadyCompleted
          ? campaign.completedMilestones.filter(
              (index) => index !== milestoneIndex
            )
          : [...campaign.completedMilestones, milestoneIndex];

        return { ...campaign, completedMilestones };
      })
    );
  }

  return (
    <div className="campaigns-page">

      <header className="page-header">
        <div>
          <span className="eyebrow">YOUR ADVENTURE</span>
          <h1>Campaigns</h1>
          <p>Set your next adventure </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          New Campaign
        </button>
      </header>

      {showForm && (
        <section className="campaign-form-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A NEW ADVENTURE BEGINS</span>
              <h2>Create a Campaign</h2>
            </div>
            <Flag size={24} />
          </div>

          <form onSubmit={createCampaign}>
            <label>
              Campaign name
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: The Movement Comeback"
                required
              />
            </label>

            <label>
              What's this campaign about?
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what you're working toward..."
                rows={3}
              />
            </label>

            <label>
              Target date
              <input
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </label>

            <label>
              Milestones
              <span className="field-hint">
                Add one milestone per line. You can check them off as you go. 
              </span>
              <textarea
                value={milestonesText}
                onChange={(event) => setMilestonesText(event.target.value)}
                placeholder={'Complete the first week\nReach the halfway point\nFinish the campaign'}
                rows={5}
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
                Create Campaign
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="campaign-list">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR ACTIVE QUESTS</span>
            <h2>Current Campaigns</h2>
          </div>
          <Flag size={24} />
        </div>

        {campaigns.length === 0 ? (
          <div className="empty-campaigns">
            <Flag size={35} />
            <h3>Set your next challenge</h3>
            <p>
                Start your first campaign and track your progress toward your goals.
            </p>
            <button
              className="secondary-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} />
              Start your first campaign
            </button>
          </div>
        ) : (
          <div className="campaign-grid">
            {campaigns.map((campaign) => {
              const completed = campaign.completedMilestones.length;
              const total = campaign.milestones.length;
              const progress = Math.round((completed / total) * 100);//Calculating your progess till you hit 100 or complete.  

              return (
                <article className="campaign-card" key={campaign.id}>
                  <div className="campaign-card-top">
                    <div className="campaign-icon">
                      <Flag size={21} />
                    </div>
                    <span className="campaign-status">
                      {progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                  </div>

                  <h3>{campaign.title}</h3>
                  <p className="campaign-description">
                    {campaign.description || 'Every step moves you forward.'}
                  </p>

                  {campaign.deadline && (
                    <div className="campaign-deadline">
                      <CalendarDays size={15} />
                      Target: {new Date(`${campaign.deadline}T00:00:00`).toLocaleDateString()}
                    </div>
                  )}

                  <div className="campaign-progress-heading">
                    <span>Campaign progress</span>
                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="milestone-count">
                    {completed} of {total} milestones completed
                  </p>

                  <div className="milestone-list">
                    {campaign.milestones.map((milestone, index) => {
                      const isComplete =
                        campaign.completedMilestones.includes(index);

                      return (
                        <label className="milestone-item" key={index}>
                          <input
                            type="checkbox"
                            checked={isComplete}
                            onChange={() =>
                              toggleMilestone(campaign.id, index)
                            }
                          />
                          <span className={isComplete ? 'milestone-done' : ''}>
                            {milestone}
                          </span>
                          {isComplete && <CheckCircle2 size={16} />}
                        </label>
                      );
                    })}
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

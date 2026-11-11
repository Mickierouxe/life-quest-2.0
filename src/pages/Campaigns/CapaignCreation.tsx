import styles from "./Styling/CampaignCreation.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { Flag, Sparkles } from "lucide-react";

import { useCampaigns } from "./CampaignContext";
import type { Campaign } from "./CampaignTypes";

type CampaignCreationProps = {
  onCancel: () => void;
  onCreated: (campaignId: number) => void;
};

export default function CampaignCreation({
  onCancel,
  onCreated,
}: CampaignCreationProps) {

  // Get the function that adds campaigns to our shared data
  const { addCampaign } = useCampaigns();

  // Form information
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [milestonesText, setMilestonesText] = useState("");

  function createCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Turn each line into an individual milestone
    const milestones = milestonesText
      .split("\n")
      .map((milestone) => milestone.trim())
      .filter((milestone) => milestone.length > 0);

    // Build the new campaign object
    const newCampaign: Campaign = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      deadline,
      milestones,
      completedMilestones: [],
    };

    // Add campaign to shared data
    addCampaign(newCampaign);

    // Open the newly created campaign
    onCreated(newCampaign.id);
  }

  return (
    <div className="campaign-creation">

      <header className="page-header">
        <div>
          <span className="eyebrow">A NEW ADVENTURE BEGINS</span>
          <h1>Create a Campaign</h1>
          <p>Every great adventure starts somewhere.</p>
        </div>

        <Flag size={28} />
      </header>

      <section className="campaign-form-panel">

        <form onSubmit={createCampaign}>

          <label>
            Campaign name

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="The Movement Comeback..."
              required
            />
          </label>

          <label>
            What's this campaign about?

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the adventure you're embarking on..."
              rows={4}
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
            Campaign milestones

            <span className="field-hint">
              Add one milestone per line. These will become your campaign checkpoints.
            </span>

            <textarea
              value={milestonesText}
              onChange={(event) => setMilestonesText(event.target.value)}
              placeholder={"Complete the first week\nReach the halfway point\nFinish the adventure"}
              rows={5}
              required
            />
          </label>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              <Sparkles size={17} />
              Create Adventure
            </button>

          </div>

        </form>
      </section>
    </div>
  );
}

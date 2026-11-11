
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Campaign } from "./CampaignTypes";

type CampaignContextType = {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  toggleMilestone: (campaignId: number, milestoneIndex: number) => void;
};

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

const STORAGE_KEY = "lifeQuest_campaigns";

export function CampaignProvider({ children }: { children: ReactNode }) {

  // Load saved campaigns when the app starts
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const savedCampaigns = localStorage.getItem(STORAGE_KEY);

    if (!savedCampaigns) return [];

    try {
      return JSON.parse(savedCampaigns) as Campaign[];
    } catch {
      console.error("Could not load saved campaigns.");
      return [];
    }
  });

  // Automatically save whenever campaigns change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  // Add a new campaign
  function addCampaign(campaign: Campaign) {
    setCampaigns((current) => [...current, campaign]);
  }

  // Complete or undo a milestone
  function toggleMilestone(campaignId: number, milestoneIndex: number) {
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
    <CampaignContext.Provider
      value={{ campaigns, addCampaign, toggleMilestone }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

// Hook for accessing campaign data from any page
export function useCampaigns() {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error("useCampaigns must be used inside CampaignProvider");
  }

  return context;
}

type Campaign = {//Defining the type for a campaign object
  id: number;
  title: string;
  description: string;
  deadline: string;
  milestones: string[];
  completedMilestones: number[];
};


export type { Campaign };
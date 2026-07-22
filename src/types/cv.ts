export type CvTemplateId = "classic" | "modern" | "minimal";

export type CvExperience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

export type CvData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: string[];
  experience: CvExperience[];
  education: CvEducation[];
};

export type CvAiAction = "from_notes" | "summary" | "bullets";

export type CvAiRequest = {
  action: CvAiAction;
  notes?: string;
  cv?: Partial<CvData>;
  experienceId?: string;
};

export type CvAiResponse = {
  cv: CvData;
};

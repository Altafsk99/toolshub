import type { CvData, CvEducation, CvExperience } from "@/types/cv";

export function newId(): string {
  return crypto.randomUUID();
}

export function emptyExperience(): CvExperience {
  return {
    id: newId(),
    company: "",
    role: "",
    start: "",
    end: "",
    bullets: [""],
  };
}

export function emptyEducation(): CvEducation {
  return {
    id: newId(),
    school: "",
    degree: "",
    year: "",
  };
}

export function emptyCv(): CvData {
  return {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
    skills: [],
    experience: [emptyExperience()],
    education: [emptyEducation()],
  };
}

function uniqueIds<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.map((item) => {
    if (item.id && !seen.has(item.id)) {
      seen.add(item.id);
      return item;
    }
    const id = newId();
    seen.add(id);
    return { ...item, id };
  });
}

/** Fix duplicate/missing ids from AI output or old saved drafts. */
export function ensureCvIds(cv: CvData): CvData {
  return {
    ...cv,
    experience: uniqueIds(cv.experience),
    education: uniqueIds(cv.education),
  };
}

import type { CvData, CvEducation, CvExperience } from "@/types/cv";

export type CvSections = {
  contact: string[];
  experience: CvExperience[];
  education: CvEducation[];
};

export function getCvSections(cv: CvData): CvSections {
  return {
    contact: [cv.email, cv.phone, cv.location, cv.linkedin, cv.website]
      .map((part) => part.trim())
      .filter(Boolean),
    experience: cv.experience.filter(
      (item) =>
        item.company.trim() || item.role.trim() || item.bullets.some((b) => b.trim()),
    ),
    education: cv.education.filter(
      (item) => item.school.trim() || item.degree.trim() || item.year.trim(),
    ),
  };
}

export function roleLine(item: CvExperience): string {
  return [item.role.trim(), item.company.trim()].filter(Boolean).join(" — ") || "Role — Company";
}

export function dateLine(item: CvExperience): string {
  return [item.start.trim(), item.end.trim()].filter(Boolean).join(" – ");
}

export function educationLine(item: CvEducation): string {
  return [item.degree.trim(), item.school.trim()].filter(Boolean).join(" — ") || "Degree — School";
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyCv, emptyEducation, emptyExperience, ensureCvIds } from "@/lib/cv/defaults";
import { exportCvDocx, cvExportBasename } from "@/lib/cv/export-docx";
import { exportCvPdf } from "@/lib/cv/export-pdf";
import { CvAiError, requestCvAi } from "@/lib/cv/ai-client";
import { downloadBlob } from "@/lib/image/engine";
import type { CvData, CvExperience, CvTemplateId } from "@/types/cv";

type CvStore = {
  cv: CvData;
  template: CvTemplateId;
  notes: string;
  isAiLoading: boolean;
  isExporting: boolean;
  error: string | null;
  setTemplate: (template: CvTemplateId) => void;
  setField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
  setNotes: (notes: string) => void;
  setSkillsText: (text: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<CvExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<CvData["education"][number]>) => void;
  removeEducation: (id: string) => void;
  generateFromNotes: () => Promise<void>;
  improveSummary: () => Promise<void>;
  improveBullets: (experienceId: string) => Promise<void>;
  downloadPdf: () => Promise<void>;
  downloadDocx: () => Promise<void>;
  resetCv: () => void;
};

export const useCvStore = create<CvStore>()(
  persist(
    (set, get) => ({
      cv: emptyCv(),
      template: "classic" as CvTemplateId,
      notes: "",
      isAiLoading: false,
      isExporting: false,
      error: null,

      setTemplate: (template) => set({ template }),

      setField: (key, value) => {
        set((state) => ({ cv: { ...state.cv, [key]: value }, error: null }));
      },

      setNotes: (notes) => set({ notes, error: null }),

      setSkillsText: (text) => {
        const skills = text
          .split(/[,;\n]/)
          .map((skill) => skill.trim())
          .filter(Boolean);
        set((state) => ({ cv: { ...state.cv, skills }, error: null }));
      },

      addExperience: () => {
        set((state) => ({
          cv: { ...state.cv, experience: [...state.cv.experience, emptyExperience()] },
        }));
      },

      updateExperience: (id, patch) => {
        set((state) => ({
          cv: {
            ...state.cv,
            experience: state.cv.experience.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          },
          error: null,
        }));
      },

      removeExperience: (id) => {
        set((state) => ({
          cv: {
            ...state.cv,
            experience:
              state.cv.experience.length <= 1
                ? [emptyExperience()]
                : state.cv.experience.filter((item) => item.id !== id),
          },
        }));
      },

      addEducation: () => {
        set((state) => ({
          cv: { ...state.cv, education: [...state.cv.education, emptyEducation()] },
        }));
      },

      updateEducation: (id, patch) => {
        set((state) => ({
          cv: {
            ...state.cv,
            education: state.cv.education.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          },
          error: null,
        }));
      },

      removeEducation: (id) => {
        set((state) => ({
          cv: {
            ...state.cv,
            education:
              state.cv.education.length <= 1
                ? [emptyEducation()]
                : state.cv.education.filter((item) => item.id !== id),
          },
        }));
      },

      generateFromNotes: async () => {
        const { notes } = get();
        if (!notes.trim()) {
          set({ error: "Paste your rough notes first — jobs, skills, education." });
          return;
        }

        set({ isAiLoading: true, error: null });
        try {
          const result = await requestCvAi({ action: "from_notes", notes: notes.trim() });
          set({ cv: ensureCvIds(result.cv), isAiLoading: false });
        } catch (err) {
          set({
            isAiLoading: false,
            error: err instanceof CvAiError ? err.message : "Could not generate CV.",
          });
        }
      },

      improveSummary: async () => {
        const { cv } = get();
        set({ isAiLoading: true, error: null });
        try {
          const result = await requestCvAi({ action: "summary", cv });
          set((state) => ({
            cv: { ...state.cv, summary: result.cv.summary },
            isAiLoading: false,
          }));
        } catch (err) {
          set({
            isAiLoading: false,
            error: err instanceof CvAiError ? err.message : "Could not improve summary.",
          });
        }
      },

      improveBullets: async (experienceId) => {
        const { cv } = get();
        set({ isAiLoading: true, error: null });
        try {
          const result = await requestCvAi({ action: "bullets", cv, experienceId });
          const updated = result.cv.experience.find((item) => item.id === experienceId);
          if (!updated) throw new CvAiError("AI did not return experience bullets.");
          set((state) => ({
            cv: ensureCvIds({
              ...state.cv,
              experience: state.cv.experience.map((item) =>
                item.id === experienceId ? updated : item,
              ),
            }),
            isAiLoading: false,
          }));
        } catch (err) {
          set({
            isAiLoading: false,
            error: err instanceof CvAiError ? err.message : "Could not improve bullets.",
          });
        }
      },

      downloadPdf: async () => {
        const { cv, template } = get();
        if (!cv.fullName.trim()) {
          set({ error: "Add your name before downloading." });
          return;
        }

        set({ isExporting: true, error: null });
        try {
          const blob = await exportCvPdf(cv, template);
          downloadBlob(blob, `${cvExportBasename(cv)}.pdf`);
          set({ isExporting: false });
        } catch (err) {
          set({
            isExporting: false,
            error: err instanceof Error ? err.message : "Could not export PDF.",
          });
        }
      },

      downloadDocx: async () => {
        const { cv, template } = get();
        if (!cv.fullName.trim()) {
          set({ error: "Add your name before downloading." });
          return;
        }

        set({ isExporting: true, error: null });
        try {
          const blob = await exportCvDocx(cv, template);
          downloadBlob(blob, `${cvExportBasename(cv)}.docx`);
          set({ isExporting: false });
        } catch (err) {
          set({
            isExporting: false,
            error: err instanceof Error ? err.message : "Could not export Word document.",
          });
        }
      },

      resetCv: () => {
        set({ cv: emptyCv(), notes: "", error: null, template: "classic" });
      },
    }),
    {
      name: "privytool-cv-draft",
      partialize: (state) => ({ cv: state.cv, notes: state.notes, template: state.template }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<CvStore> | undefined;
        if (!saved?.cv) return current;
        return {
          ...current,
          ...saved,
          cv: ensureCvIds(saved.cv),
          template: saved.template ?? "classic",
        };
      },
    },
  ),
);

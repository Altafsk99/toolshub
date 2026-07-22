"use client";

import { CvPreview } from "@/components/cv/CvPreview";
import {
  chipClass,
  modeTabClass,
  panelAccentBtnClass,
  panelPrimaryBtnClass,
  panelSecondaryBtnClass,
  panelSectionClass,
} from "@/components/image/PanelChrome";
import { CV_TEMPLATES } from "@/lib/cv/templates";
import { useCvStore } from "@/stores/cvStore";

const inputClass =
  "focus-ring w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-soft/45";

const labelClass = "text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/65";

export function CvPanel() {
  const cv = useCvStore((s) => s.cv);
  const template = useCvStore((s) => s.template);
  const notes = useCvStore((s) => s.notes);
  const isAiLoading = useCvStore((s) => s.isAiLoading);
  const isExporting = useCvStore((s) => s.isExporting);
  const error = useCvStore((s) => s.error);
  const setTemplate = useCvStore((s) => s.setTemplate);
  const setField = useCvStore((s) => s.setField);
  const setNotes = useCvStore((s) => s.setNotes);
  const setSkillsText = useCvStore((s) => s.setSkillsText);
  const addExperience = useCvStore((s) => s.addExperience);
  const updateExperience = useCvStore((s) => s.updateExperience);
  const removeExperience = useCvStore((s) => s.removeExperience);
  const addEducation = useCvStore((s) => s.addEducation);
  const updateEducation = useCvStore((s) => s.updateEducation);
  const removeEducation = useCvStore((s) => s.removeEducation);
  const generateFromNotes = useCvStore((s) => s.generateFromNotes);
  const improveSummary = useCvStore((s) => s.improveSummary);
  const improveBullets = useCvStore((s) => s.improveBullets);
  const downloadPdf = useCvStore((s) => s.downloadPdf);
  const downloadDocx = useCvStore((s) => s.downloadDocx);
  const resetCv = useCvStore((s) => s.resetCv);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr] xl:items-start">
      <div className="space-y-5">
        <section className="rounded-lg border border-line bg-paper/70 p-4 sm:p-5">
          <div className={panelSectionClass}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
                AI assist
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
                Paste rough notes — job history, skills, education — and AI will structure your CV.
                Works on preview deploy when an API key is configured.
              </p>
            </div>
            <div>
              <label className={labelClass} htmlFor="cv-notes">
                Rough notes
              </label>
              <textarea
                id="cv-notes"
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: 3 years React dev at Acme, built dashboard, Node.js, BSc CS 2020, fluent English..."
                className={`${inputClass} mt-2 min-h-32 resize-y`}
              />
            </div>
            <button
              type="button"
              disabled={isAiLoading}
              onClick={() => void generateFromNotes()}
              className={panelAccentBtnClass}
            >
              {isAiLoading ? "Generating…" : "Generate CV from notes"}
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper/70 p-4 sm:p-5">
          <div className={panelSectionClass}>
            <p className="text-sm font-semibold text-ink">Profile</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="cv-name">
                  Full name
                </label>
                <input
                  id="cv-name"
                  value={cv.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cv-title">
                  Job title
                </label>
                <input
                  id="cv-title"
                  value={cv.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cv-email">
                  Email
                </label>
                <input
                  id="cv-email"
                  type="email"
                  value={cv.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cv-phone">
                  Phone
                </label>
                <input
                  id="cv-phone"
                  value={cv.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cv-location">
                  Location
                </label>
                <input
                  id="cv-location"
                  value={cv.location}
                  onChange={(e) => setField("location", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cv-linkedin">
                  LinkedIn
                </label>
                <input
                  id="cv-linkedin"
                  value={cv.linkedin}
                  onChange={(e) => setField("linkedin", e.target.value)}
                  className={`${inputClass} mt-2`}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className={labelClass} htmlFor="cv-summary">
                  Summary
                </label>
                <button
                  type="button"
                  disabled={isAiLoading}
                  onClick={() => void improveSummary()}
                  className="text-xs font-semibold text-accent-deep hover:underline"
                >
                  AI improve
                </button>
              </div>
              <textarea
                id="cv-summary"
                rows={4}
                value={cv.summary}
                onChange={(e) => setField("summary", e.target.value)}
                className={`${inputClass} mt-2 resize-y`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="cv-skills">
                Skills (comma separated)
              </label>
              <input
                id="cv-skills"
                value={cv.skills.join(", ")}
                onChange={(e) => setSkillsText(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Experience</p>
            <button type="button" onClick={addExperience} className={panelSecondaryBtnClass}>
              Add role
            </button>
          </div>
          <div className="space-y-5">
            {cv.experience.map((item, index) => (
              <div key={item.id} className="rounded-md border border-line/80 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft/60">
                    Role {index + 1}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isAiLoading}
                      onClick={() => void improveBullets(item.id)}
                      className="text-xs font-semibold text-accent-deep hover:underline"
                    >
                      AI bullets
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExperience(item.id)}
                      className="text-xs font-semibold text-ink-soft hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={item.role}
                    onChange={(e) => updateExperience(item.id, { role: e.target.value })}
                    placeholder="Job title"
                    className={inputClass}
                  />
                  <input
                    value={item.company}
                    onChange={(e) => updateExperience(item.id, { company: e.target.value })}
                    placeholder="Company"
                    className={inputClass}
                  />
                  <input
                    value={item.start}
                    onChange={(e) => updateExperience(item.id, { start: e.target.value })}
                    placeholder="Start (e.g. Jan 2022)"
                    className={inputClass}
                  />
                  <input
                    value={item.end}
                    onChange={(e) => updateExperience(item.id, { end: e.target.value })}
                    placeholder="End (e.g. Present)"
                    className={inputClass}
                  />
                </div>
                <textarea
                  rows={4}
                  value={item.bullets.join("\n")}
                  onChange={(e) =>
                    updateExperience(item.id, {
                      bullets: e.target.value.split("\n"),
                    })
                  }
                  placeholder="One achievement per line"
                  className={`${inputClass} mt-3 resize-y`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Education</p>
            <button type="button" onClick={addEducation} className={panelSecondaryBtnClass}>
              Add school
            </button>
          </div>
          <div className="space-y-4">
            {cv.education.map((item, index) => (
              <div key={item.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={item.degree}
                  onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
                  placeholder={`Degree ${index + 1}`}
                  className={inputClass}
                />
                <input
                  value={item.school}
                  onChange={(e) => updateEducation(item.id, { school: e.target.value })}
                  placeholder="School"
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <input
                    value={item.year}
                    onChange={(e) => updateEducation(item.id, { year: e.target.value })}
                    placeholder="Year"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeEducation(item.id)}
                    className={panelSecondaryBtnClass}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => void downloadPdf()}
            className={panelPrimaryBtnClass}
          >
            {isExporting ? "Exporting…" : "Download PDF"}
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => void downloadDocx()}
            className={panelPrimaryBtnClass}
          >
            {isExporting ? "Exporting…" : "Download Word"}
          </button>
          <button type="button" onClick={resetCv} className={panelSecondaryBtnClass}>
            Clear draft
          </button>
        </div>
      </div>

      <div className="xl:sticky xl:top-24">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/55">
            Live preview
          </p>
          <div className="flex flex-wrap gap-2">
            {CV_TEMPLATES.map((option) => (
              <button
                key={option.id}
                type="button"
                title={option.description}
                onClick={() => setTemplate(option.id)}
                className={template === option.id ? modeTabClass(true) : chipClass(false)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-3 text-xs text-ink-soft/65">
          {CV_TEMPLATES.find((t) => t.id === template)?.description}
        </p>
        <div className="overflow-auto rounded-lg border border-line bg-mist/40 p-3 sm:p-4">
          <CvPreview cv={cv} template={template} />
        </div>
      </div>
    </div>
  );
}

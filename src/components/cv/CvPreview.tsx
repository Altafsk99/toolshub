import type { ReactNode } from "react";
import type { CvData, CvTemplateId } from "@/types/cv";
import { getCvSections, dateLine, educationLine, roleLine } from "@/lib/cv/cv-sections";

type CvPreviewProps = {
  cv: CvData;
  template: CvTemplateId;
};

function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <h3 className={className}>{children}</h3>
  );
}

function ClassicPreview({ cv }: { cv: CvData }) {
  const { contact, experience, education } = getCvSections(cv);

  return (
    <article className="mx-auto w-full max-w-[210mm] bg-white px-8 py-10 text-[13px] leading-relaxed text-slate-800 shadow-sm ring-1 ring-slate-200">
      <header className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {cv.fullName.trim() || "Your Name"}
        </h2>
        {cv.title.trim() ? (
          <p className="mt-1 text-sm font-medium text-teal-700">{cv.title.trim()}</p>
        ) : null}
        {contact.length > 0 ? (
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {contact.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        ) : null}
      </header>

      {cv.summary.trim() ? (
        <section className="mt-5">
          <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">
            Summary
          </SectionTitle>
          <p className="mt-2 text-slate-700">{cv.summary.trim()}</p>
        </section>
      ) : null}

      {cv.skills.length > 0 ? (
        <section className="mt-5">
          <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">
            Skills
          </SectionTitle>
          <p className="mt-2 text-slate-700">{cv.skills.join(" · ")}</p>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mt-5">
          <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">
            Experience
          </SectionTitle>
          <ul className="mt-3 space-y-4">
            {experience.map((item) => (
              <li key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-900">{roleLine(item)}</p>
                  <p className="text-xs text-slate-500">{dateLine(item)}</p>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  {item.bullets.filter((bullet) => bullet.trim()).map((bullet) => (
                    <li key={`${item.id}-${bullet}`}>{bullet.trim()}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="mt-5">
          <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">
            Education
          </SectionTitle>
          <ul className="mt-3 space-y-3">
            {education.map((item) => (
              <li key={item.id}>
                <p className="font-semibold text-slate-900">{educationLine(item)}</p>
                {item.year.trim() ? (
                  <p className="text-xs text-slate-500">{item.year.trim()}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function ModernPreview({ cv }: { cv: CvData }) {
  const { contact, experience, education } = getCvSections(cv);

  return (
    <article className="mx-auto grid w-full max-w-[210mm] min-h-[297mm] grid-cols-[34%_1fr] overflow-hidden bg-white text-[13px] leading-relaxed shadow-sm ring-1 ring-slate-200">
      <aside className="bg-[#1E3A5F] px-5 py-8 text-slate-100">
        <h2 className="text-xl font-bold leading-tight text-white">
          {cv.fullName.trim() || "Your Name"}
        </h2>
        {cv.title.trim() ? (
          <p className="mt-2 text-xs font-medium text-sky-200">{cv.title.trim()}</p>
        ) : null}
        {contact.length > 0 ? (
          <div className="mt-6 space-y-2 text-[11px] text-slate-200">
            {contact.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        ) : null}
        {cv.skills.length > 0 ? (
          <section className="mt-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200">
              Skills
            </h3>
            <ul className="mt-3 space-y-1.5 text-[11px]">
              {cv.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>

      <main className="px-6 py-8 text-slate-800">
        {cv.summary.trim() ? (
          <section>
            <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1E3A5F]">
              Profile
            </SectionTitle>
            <p className="mt-2 text-slate-700">{cv.summary.trim()}</p>
          </section>
        ) : null}

        {experience.length > 0 ? (
          <section className="mt-6">
            <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1E3A5F]">
              Experience
            </SectionTitle>
            <ul className="mt-3 space-y-4">
              {experience.map((item) => (
                <li key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{roleLine(item)}</p>
                    <p className="text-xs text-slate-500">{dateLine(item)}</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                    {item.bullets.filter((bullet) => bullet.trim()).map((bullet) => (
                      <li key={`${item.id}-${bullet}`}>{bullet.trim()}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {education.length > 0 ? (
          <section className="mt-6">
            <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1E3A5F]">
              Education
            </SectionTitle>
            <ul className="mt-3 space-y-3">
              {education.map((item) => (
                <li key={item.id}>
                  <p className="font-semibold text-slate-900">{educationLine(item)}</p>
                  {item.year.trim() ? (
                    <p className="text-xs text-slate-500">{item.year.trim()}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </article>
  );
}

function MinimalPreview({ cv }: { cv: CvData }) {
  const { contact, experience, education } = getCvSections(cv);

  return (
    <article className="mx-auto w-full max-w-[210mm] bg-white px-10 py-10 text-[13px] leading-relaxed text-slate-800 shadow-sm ring-1 ring-slate-200">
      <header className="border-b border-slate-300 pb-4 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          {cv.fullName.trim() || "Your Name"}
        </h2>
        {cv.title.trim() ? (
          <p className="mt-2 text-sm uppercase tracking-[0.12em] text-slate-500">
            {cv.title.trim()}
          </p>
        ) : null}
        {contact.length > 0 ? (
          <p className="mt-3 text-xs text-slate-500">{contact.join(" · ")}</p>
        ) : null}
      </header>

      {cv.summary.trim() ? (
        <section className="mt-6">
          <SectionTitle className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
            Summary
          </SectionTitle>
          <p className="mt-3 text-center text-slate-700">{cv.summary.trim()}</p>
        </section>
      ) : null}

      {cv.skills.length > 0 ? (
        <section className="mt-6">
          <SectionTitle className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
            Skills
          </SectionTitle>
          <p className="mt-3 text-center text-slate-700">{cv.skills.join(" · ")}</p>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mt-6">
          <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
            Experience
          </SectionTitle>
          <ul className="mt-4 space-y-4">
            {experience.map((item) => (
              <li key={item.id} className="border-l-2 border-slate-300 pl-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-900">{roleLine(item)}</p>
                  <p className="text-xs text-slate-500">{dateLine(item)}</p>
                </div>
                <ul className="mt-2 space-y-1 text-slate-700">
                  {item.bullets.filter((bullet) => bullet.trim()).map((bullet) => (
                    <li key={`${item.id}-${bullet}`}>– {bullet.trim()}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="mt-6">
          <SectionTitle className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
            Education
          </SectionTitle>
          <ul className="mt-4 space-y-3">
            {education.map((item) => (
              <li key={item.id}>
                <p className="font-semibold text-slate-900">{educationLine(item)}</p>
                {item.year.trim() ? (
                  <p className="text-xs text-slate-500">{item.year.trim()}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

export function CvPreview({ cv, template }: CvPreviewProps) {
  if (template === "modern") return <ModernPreview cv={cv} />;
  if (template === "minimal") return <MinimalPreview cv={cv} />;
  return <ClassicPreview cv={cv} />;
}

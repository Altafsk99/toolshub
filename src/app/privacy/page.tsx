import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How PrivyTool handles privacy: file processing stays in your browser. Learn about local storage, analytics, and cookies.",
  path: "/privacy",
  keywords: ["privacy policy", "privytool privacy", "no upload", "browser processing"],
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 21, 2026">
      <p>
        PrivyTool (“we”, “us”) provides free browser-based tools at{" "}
        <Link href="/" className="text-accent-deep underline-offset-2 hover:underline">
          privytool.com
        </Link>
        . This policy explains what happens to your data when you use the site. We
        designed the product so your files do not need to leave your device.
      </p>

      <LegalSection id="files" title="1. Your files stay on your device">
        <p>
          Image and PDF tools process files in your browser using local JavaScript
          and Canvas / Web APIs. We do not operate a file-upload server for these
          tools. Your images and PDFs are not sent to PrivyTool servers for
          processing, storage, or analysis.
        </p>
        <p>
          Downloads you create are generated on your device. Clearing your browser
          data removes any temporary blobs or preview URLs created during a
          session.
        </p>
      </LegalSection>

      <LegalSection id="local-storage" title="2. Data stored on your device">
        <p>Some features use storage that never leaves your browser:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">Download history</strong> —
            original and output file copies for recent downloads, stored in
            IndexedDB on your device (capped; you can delete entries or clear all
            from History).
          </li>
          <li>
            <strong className="font-semibold text-ink">Preferences</strong> — export
            format and similar settings in localStorage.
          </li>
        </ul>
        <p>
          We cannot read this data remotely. Uninstalling the site’s data or using
          a private window prevents or limits persistence.
        </p>
      </LegalSection>

      <LegalSection id="analytics" title="3. Analytics and cookies">
        <p>
          When analytics are enabled via environment configuration, we may load:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">Google Analytics 4</strong> —
            page views and basic usage metrics. IP anonymization is enabled when
            configured.
          </li>
          <li>
            <strong className="font-semibold text-ink">Microsoft Clarity</strong> —
            session insights (e.g. heatmaps / anonymized interaction patterns) to
            improve UX.
          </li>
        </ul>
        <p>
          These services may set cookies or similar identifiers and collect
          technical data (browser type, pages visited, approximate location from
          IP). They do not receive your uploaded image or PDF file contents from
          PrivyTool’s processing pipeline.
        </p>
        <p>
          You can block analytics cookies with your browser settings or extensions.
          If analytics IDs are not configured, those scripts are not loaded.
        </p>
      </LegalSection>

      <LegalSection id="ads" title="4. Advertising (future)">
        <p>
          We may display third-party ads (for example Google AdSense) in the
          future. Ad partners may use cookies or similar technologies to show
          relevant ads. This policy will be updated before ads go live with
          partner details and opt-out links where required.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="5. Accounts and personal data">
        <p>
          PrivyTool does not require an account for core tools. We do not
          intentionally collect names, emails, or uploaded files as part of tool
          processing. If you email us, we will use your contact details only to
          respond.
        </p>
      </LegalSection>

      <LegalSection id="children" title="6. Children">
        <p>
          The service is not directed at children under 13. We do not knowingly
          collect personal information from children.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="7. Changes">
        <p>
          We may update this policy as the product evolves. The “Last updated”
          date at the top will change when we do. Continued use after updates
          means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="8. Contact">
        <p>
          Questions about privacy:{" "}
          <a
            href="mailto:privacy@privytool.com"
            className="text-accent-deep underline-offset-2 hover:underline"
          >
            privacy@privytool.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

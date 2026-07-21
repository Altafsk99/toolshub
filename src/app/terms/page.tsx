import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for PrivyTool — free browser-based image and PDF tools. Acceptable use, disclaimers, and liability.",
  path: "/terms",
  keywords: ["terms of use", "privytool terms", "terms of service"],
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="July 21, 2026">
      <p>
        These Terms of Use (“Terms”) govern your access to PrivyTool at{" "}
        <Link href="/" className="text-accent-deep underline-offset-2 hover:underline">
          privytool.com
        </Link>{" "}
        and related pages. By using the site, you agree to these Terms. If you do
        not agree, do not use the service.
      </p>

      <LegalSection id="service" title="1. The service">
        <p>
          PrivyTool provides free online utilities (including image and PDF tools)
          that run primarily in your browser. Features, availability, and
          supported formats may change without notice. We may add, remove, or
          modify tools at any time.
        </p>
      </LegalSection>

      <LegalSection id="your-responsibility" title="2. Your responsibilities">
        <p>You agree to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the tools only for lawful purposes.</li>
          <li>
            Only process files you have the right to use, modify, or distribute.
          </li>
          <li>
            Not attempt to disrupt the site, reverse-engineer in a way that
            violates applicable law, or abuse infrastructure.
          </li>
          <li>
            Not use automated scraping that overloads the site or violates robots
            rules in bad faith.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="no-upload-disclaimer" title="3. Client-side processing">
        <p>
          Tool processing is designed to run on your device. You remain
          responsible for the files you open in the browser, how you use outputs,
          and for keeping backups of important files. Browser limits, device
          memory, or unsupported formats may cause failures — re-try with smaller
          files or another browser if needed.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" title="4. Disclaimer of warranties">
        <p>
          The service is provided “as is” and “as available,” without warranties of
          any kind, express or implied, including merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant that tools
          will be uninterrupted, error-free, or that outputs will meet legal,
          medical, government-form, or print requirements.
        </p>
        <p>
          Always verify critical outputs (passport photos, official documents,
          print jobs) yourself before submitting or publishing them.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="5. Limitation of liability">
        <p>
          To the fullest extent permitted by law, PrivyTool and its operators are
          not liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of data, profits, or business, arising
          from your use of the service. Our total liability for any claim relating
          to the service shall not exceed one hundred U.S. dollars (USD $100) or
          the amount you paid us in the twelve months before the claim (if any),
          whichever is greater.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="6. Intellectual property">
        <p>
          The PrivyTool name, branding, site design, and original content are
          owned by us or our licensors. You retain all rights to files you process
          and to outputs you generate. You may not copy our branding or
          substantial site content for a competing service without permission.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="7. Third-party services">
        <p>
          The site may load third-party scripts (for example analytics) as
          described in our{" "}
          <Link
            href="/privacy"
            className="text-accent-deep underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          . Those services have their own terms. Links to external sites are for
          convenience; we are not responsible for their content.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="8. Changes to these Terms">
        <p>
          We may update these Terms from time to time. The “Last updated” date
          will change when we do. Continued use after changes constitutes
          acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="law" title="9. Governing law">
        <p>
          These Terms are governed by the laws applicable in the jurisdiction
          where the site operator is established, without regard to conflict-of-law
          rules. Courts in that jurisdiction shall have exclusive venue for
          disputes, except where consumer law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          Questions about these Terms:{" "}
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

import { MaxWidthWrapper } from "@/components";
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";

const CookiePolicy = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Legal"
          title="Cookie Policy"
          description="How we use cookies and similar technologies."
        />
        <p className="mt-6 text-sm italic text-muted-foreground">
          Last updated: 10th January 2026
        </p>
      </Section>

      <Section>
        <div className="space-y-8 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            At <strong className="text-foreground">Spark &amp; Mend</strong>, we
            use cookies and similar technologies to make our website work
            smoothly, understand how visitors use our pages, and improve the
            booking experience.
          </p>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a
              website. They help the site remember your preferences and activity.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How we use cookies</h2>
            <ul className="space-y-2 text-muted-foreground">
              <CheckListItem>Keep the site secure and running properly.</CheckListItem>
              <CheckListItem>Remember your quote details if you return later.</CheckListItem>
              <CheckListItem>Understand which pages are most useful.</CheckListItem>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Managing your cookies
            </h2>
            <p>
              You can control or delete cookies through your browser settings.
              If you choose to block cookies, some parts of the website may not
              work as intended.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Third-party services
            </h2>
            <p>
              We may use trusted third-party tools for analytics and performance
              monitoring. These providers may also set cookies to help measure
              usage and improve the service.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Changes to this policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. Updates will be
              posted here with a revised &quot;Last updated&quot; date.
            </p>
          </div>
        </div>
      </Section>
    </MaxWidthWrapper>
  );
};

export default CookiePolicy;

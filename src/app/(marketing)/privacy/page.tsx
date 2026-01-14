import { MaxWidthWrapper } from "@/components";
import { Section, SectionHeader } from "@/components/ui/section";

const Privacy = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Legal"
          title="Privacy Policy"
          description="How we collect, use, and protect your information."
        />
        <p className="mt-6 text-sm italic text-muted-foreground">
          Last updated: 17th June 2024
        </p>
      </Section>

      <Section>
        <div className="space-y-8 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            At <strong className="text-foreground">Spark & Mend</strong>, we are committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our website and services.
          </p>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
            <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
            <p>
              When you request a quote, book a clean, or contact us, we may collect
              personal information that can identify you, such as your name, email
              address, phone number, and payment information.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Non-Personal Information</h3>
            <p>
              We may also collect non-personal information about your use of the
              website, such as IP addresses, browser types, referring URLs, and
              other technical data.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Cookies and Tracking Technologies
            </h3>
            <p>
              We use cookies and similar tracking technologies to collect and store
              information about your interactions with our website. You can manage
              your cookie preferences through your browser settings.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How We Use Your Information</h2>
            <h3 className="text-base font-semibold text-foreground">Provide and Improve Services</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Provide, operate, and maintain our services.</li>
              <li>Improve and personalize your experience.</li>
              <li>Process payments and manage bookings.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Communication</h3>
            <p>We may use your information to:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                Send you updates, promotional materials, and other information
                related to our services.
              </li>
              <li>Respond to your inquiries and provide customer support.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Analytics and Research</h3>
            <p>We use non-personal information for analytical purposes, such as:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Monitoring and analyzing usage trends and preferences.</li>
              <li>Conducting research and improving our services.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How We Share Your Information</h2>
            <h3 className="text-base font-semibold text-foreground">Service Providers</h3>
            <p>
              We may share your information with third-party service providers who
              assist us in operating our services, such as payment processors, email
              services, and hosting providers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in
              response to valid requests by public authorities.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of all or a portion of
              our assets, your information may be transferred to the acquiring
              entity.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access, loss,
              or alteration. However, no method of transmission over the internet or
              method of electronic storage is 100% secure.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfil
              the purposes for which it was collected, comply with our legal
              obligations, resolve disputes, and enforce our agreements.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your Rights and Choices</h2>
            <h3 className="text-base font-semibold text-foreground">Access and Update</h3>
            <p>
              You have the right to access and update your personal information. You
              can do this by contacting us directly.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Opt-Out</h3>
            <p>
              You can opt out of receiving promotional emails from us by following
              the unsubscribe instructions in those emails. You may also contact us
              directly to opt out.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Data Deletion</h3>
            <p>
              You have the right to request the deletion of your personal
              information. Please contact us at sparkandmend@gmail.com to make this
              request.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We
              do not knowingly collect personal information from children under 18.
              If we become aware that we have collected personal information from a
              child under 18, we will take steps to delete such information.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your own. We will ensure that appropriate safeguards are in
              place to protect your personal information when it is transferred
              across borders.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on our website
              and updating the &quot;Last updated&quot; date at the top of this page.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at sparkandmend@gmail.com.
            </p>
          </div>

          <p className="font-medium text-foreground">
            By using Spark & Mend, you acknowledge that you have read,
            understood, and agree to the terms of this Privacy Policy.
          </p>
        </div>
      </Section>
    </MaxWidthWrapper>
  );
};

export default Privacy;

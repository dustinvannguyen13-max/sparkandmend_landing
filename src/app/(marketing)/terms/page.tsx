import { MaxWidthWrapper } from "@/components";
import { Section, SectionHeader } from "@/components/ui/section";
import Link from "next/link";

const TermsPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Legal"
          title="Terms and Conditions"
          description="Please read these terms carefully before using our services."
        />
        <p className="mt-6 text-sm italic text-muted-foreground">
          Last updated: 17th June 2024
        </p>
      </Section>

      <Section>
        <div className="space-y-8 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            Welcome to Spark & Mend. These terms and conditions outline the
            rules and regulations for the use of Spark & Mend&apos;s website
            and cleaning services.
          </p>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Acceptance of Terms</h2>
            <p>
              By accessing and using Spark & Mend, you accept and agree to be
              bound by these terms and conditions. If you do not agree to these
              terms, you may not use our website or services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Changes to Terms</h2>
            <p>
              Spark & Mend reserves the right to modify these terms at any time.
              We will notify you of any changes by updating the &quot;Last updated&quot;
              date at the top of this page. Your continued use of our website and
              services after any modifications indicates your acceptance of the new
              terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Use of Services</h2>
            <h3 className="text-base font-semibold text-foreground">Eligibility</h3>
            <p>
              To book cleaning services, you must be at least 18 years old and
              capable of entering into a binding contract.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Booking Information</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                You must provide accurate and complete information when requesting
                a quote or booking a clean.
              </li>
              <li>
                You are responsible for access instructions and any details you
                provide about the property.
              </li>
              <li>
                You agree to notify us promptly if your booking details change.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Acceptable Use</h3>
            <p>
              You agree not to misuse our website or services, including but not
              limited to:
            </p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Attempting to gain unauthorized access to our systems.</li>
              <li>Interfering with the website or service availability.</li>
              <li>Using the website for unlawful or prohibited activities.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Cleaning Services</h2>
            <h3 className="text-base font-semibold text-foreground">Service Scope</h3>
            <p>
              We provide residential, commercial, end-of-tenancy, and deep cleaning
              services. The scope of work and price are agreed before service
              begins.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Access and Safety</h3>
            <p>
              You agree to provide safe access to the property and inform us of any
              hazards, pets, or fragile items.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Cancellations and Rescheduling</h3>
            <p>
              If you need to cancel or reschedule, please contact us as soon as
              possible so we can arrange a new time.
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
            <h2 className="text-lg font-semibold text-foreground">Service Information</h2>
            <h3 className="text-base font-semibold text-foreground">Ownership</h3>
            <p>
              You retain ownership of any information or materials you provide to
              us, such as photos or access notes. By sharing them, you grant Spark
              and Mend permission to use them only as needed to deliver the
              service.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Responsibility</h2>
            <p>
              You are responsible for the accuracy of the information you provide.
              Spark & Mend does not accept liability for issues resulting from
              inaccurate details.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
            <p>
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="underline text-foreground">
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Termination</h2>
            <p>
              Spark & Mend reserves the right to decline or cancel a booking at
              any time, with or without notice, for any reason, including but not
              limited to unsafe conditions or misuse of services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Disclaimers and Limitations of Liability
            </h2>
            <h3 className="text-base font-semibold text-foreground">No Warranties</h3>
            <p>
              Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do
              not warrant that the service will be uninterrupted or error-free.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Limitation of Liability</h3>
            <p>
              In no event shall Spark & Mend be liable for any indirect,
              incidental, special, or consequential damages arising out of or in
              connection with your use of the service.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Governing Law</h2>
            <p>
              These terms shall be governed and construed in accordance with the
              laws of England and Wales, without regard to its conflict of law
              provisions.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have any questions or concerns about these terms, please
              contact us at sparkandmend@gmail.com.
            </p>
          </div>

          <p className="font-medium text-foreground">
            By using Spark & Mend, you acknowledge that you have read,
            understood, and agree to be bound by these terms and conditions.
          </p>
        </div>
      </Section>
    </MaxWidthWrapper>
  );
};

export default TermsPage;

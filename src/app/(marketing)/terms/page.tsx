import { AnimationContainer, MaxWidthWrapper } from "@/components";
import Link from "next/link";

const TermsPage = () => {
  return (
    <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
      <AnimationContainer delay={0.1} className="w-full">
        <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
          Terms and Conditions
        </h1>
        <p className="text-sm mb-2 italic mt-20">
          Last updated: 17th June 2024
        </p>
        <p className="mt-4">
          Welcome to Spark and Mend. These terms and conditions outline the
          rules and regulations for the use of Spark and Mend&apos;s website
          and cleaning services.
        </p>

        <h2 className="text-xl font-medium mt-8">Acceptance of Terms</h2>

        <p className="mt-8 text-muted-foreground">
          By accessing and using Spark and Mend, you accept and agree to be
          bound by these terms and conditions. If you do not agree to these
          terms, you may not use our website or services.
        </p>

        <h2 className="text-xl font-medium mt-12">Changes to Terms</h2>
        <p className="mt-8 text-muted-foreground">
          Spark and Mend reserves the right to modify these terms at any time.
          We will notify you of any changes by updating the &quot;Last
          updated&quot; date at the top of this page. Your continued use of our
          website and services after any modifications indicates your
          acceptance of the new terms.
        </p>

        <h2 className="text-xl font-medium mt-12">Use of Services</h2>

        <h3 className="text-lg mt-8">Eligibility</h3>
        <p className="mt-8">
          To book cleaning services, you must be at least 18 years old and
          capable of entering into a binding contract.
        </p>

        <h3 className="text-lg mt-8">Booking Information</h3>
        <div className="mt-8">
          <ul className="list-disc ml-8 text-muted-foreground">
            <li>
              You must provide accurate and complete information when
              requesting a quote or booking a clean.
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

        <h3 className="text-lg mt-8">Acceptable Use</h3>
        <div className="mt-8">
          You agree not to misuse our website or services, including but not
          limited to:
          <ul className="list-disc text-muted-foreground ml-8">
            <li>Attempting to gain unauthorized access to our systems.</li>
            <li>Interfering with the website or service availability.</li>
            <li>Using the website for unlawful or prohibited activities.</li>
          </ul>
        </div>

        <h2 className="text-xl font-medium mt-12">Cleaning Services</h2>

        <h3 className="text-lg mt-8">Service Scope</h3>
        <p className="mt-8 text-muted-foreground">
          We provide residential, commercial, end-of-tenancy, and deep cleaning
          services. The scope of work and price are agreed before service
          begins.
        </p>

        <h3 className="text-lg mt-8">Access and Safety</h3>
        <p className="mt-8 text-muted-foreground">
          You agree to provide safe access to the property and inform us of any
          hazards, pets, or fragile items.
        </p>

        <h3 className="text-lg mt-8">Cancellations and Rescheduling</h3>
        <p className="mt-8 text-muted-foreground">
          If you need to cancel or reschedule, please contact us as soon as
          possible so we can arrange a new time.
        </p>

        <h3 className="text-lg mt-8">Business Transfers</h3>
        <p className="mt-8 text-muted-foreground">
          In the event of a merger, acquisition, or sale of all or a portion of
          our assets, your information may be transferred to the acquiring
          entity.
        </p>

        <h2 className="text-xl font-medium mt-12">Service Information</h2>

        <h3 className="text-lg mt-8">Ownership</h3>

        <p className="mt-8 text-muted-foreground">
          You retain ownership of any information or materials you provide to
          us, such as photos or access notes. By sharing them, you grant Spark
          and Mend permission to use them only as needed to deliver the
          service.
        </p>

        <h2 className="text-xl font-medium mt-12">Responsibility</h2>
        <p className="mt-8 text-muted-foreground">
          You are responsible for the accuracy of the information you provide.
          Spark and Mend does not accept liability for issues resulting from
          inaccurate details.
        </p>

        <h2 className="text-xl font-medium mt-12">Privacy</h2>

        <p className="mt-8 text-muted-foreground">
          Your privacy is important to us. Please review our{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>{" "}
          to understand how we collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-medium mt-12">Termination</h2>
        <p className="mt-8 text-muted-foreground">
          Spark and Mend reserves the right to decline or cancel a booking at
          any time, with or without notice, for any reason, including but not
          limited to unsafe conditions or misuse of services.
        </p>

        <h2 className="text-xl font-medium mt-12">
          Disclaimers and Limitations of Liability
        </h2>

        <h3 className="text-lg mt-8">No Warranties</h3>
        <p className="mt-8 text-muted-foreground">
          Services are provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We do not warrant that the service will be
          uninterrupted or error-free.
        </p>

        <h3 className="text-lg mt-8">Limitation of Liability</h3>
        <p className="mt-8 text-muted-foreground">
          In no event shall Spark and Mend be liable for any indirect,
          incidental, special, or consequential damages arising out of or in
          connection with your use of the service.
        </p>

        <h2 className="text-xl font-medium mt-12">Governing Law</h2>
        <p className="mt-8 text-muted-foreground">
          These terms shall be governed and construed in accordance with the
          laws of England and Wales, without regard to its conflict of law
          provisions.
        </p>

        <h2 className="text-xl font-medium mt-12">Contact Us</h2>
        <p className="mt-8 text-muted-foreground">
          If you have any questions or concerns about these terms, please
          contact us at sparkandmend@gmail.com.
        </p>

        <p className="mt-8 font-medium">
          By using Spark and Mend, you acknowledge that you have read,
          understood, and agree to be bound by these terms and conditions.
        </p>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
};

export default TermsPage;

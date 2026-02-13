import type { Metadata } from "next";
import { MaxWidthWrapper } from "@/components";
import BookingLookup from "@/components/booking/booking-lookup";
import { Section, SectionHeader } from "@/components/ui/section";
import { generateMetadata } from "@/utils";

const TITLE = "Manage My Booking | Spark & Mend";
const DESCRIPTION =
  "View, update, or pay for your Spark & Mend booking using your reference number.";

export const metadata: Metadata = {
  ...generateMetadata({
    title: TITLE,
    description: DESCRIPTION,
    noIndex: true,
  }),
};

interface MyBookingPageProps {
  searchParams?: {
    reference?: string;
    payment?: string;
  };
}

const MyBookingPage = ({ searchParams }: MyBookingPageProps) => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section>
        <SectionHeader
          eyebrow="My Booking"
          title="View or update your booking"
          description="Enter your reference to see status, make a payment, or amend your details."
        />
      </Section>
      <Section>
        <BookingLookup
          initialReference={searchParams?.reference}
          paymentStatus={searchParams?.payment}
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default MyBookingPage;

import { Suspense } from "react";

import BookingConfirmation from "@/components/booking/booking-confirmation";

export const dynamic = "force-dynamic";

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-16 pb-20 text-center text-muted-foreground">
          Loading booking confirmation...
        </div>
      }
    >
      <BookingConfirmation />
    </Suspense>
  );
}

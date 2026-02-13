import { getActiveOffer, formatOfferLabel } from "@/lib/offers";
import OfferBarClient from "@/components/marketing/offer-bar-client";

const OfferBar = async () => {
  const offer = await getActiveOffer();
  if (!offer) return null;

  return (
    <OfferBarClient
      id={offer.id}
      title={offer.title}
      message={offer.message ?? undefined}
      ctaLabel={offer.cta_label ?? undefined}
      ctaHref={offer.cta_href ?? undefined}
      label={formatOfferLabel(offer)}
    />
  );
};

export default OfferBar;

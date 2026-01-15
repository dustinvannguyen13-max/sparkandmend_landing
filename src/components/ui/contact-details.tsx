import * as React from "react";
import Link from "next/link";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/utils";

type ContactDetailsProps = {
  email: string;
  phoneLabel: string;
  phoneHref: string;
  whatsappLabel: string;
  whatsappHref: string;
  className?: string;
};

const ContactDetails = ({
  email,
  phoneLabel,
  phoneHref,
  whatsappLabel,
  whatsappHref,
  className,
}: ContactDetailsProps) => {
  const links = [
    {
      Icon: Mail,
      label: `Email: ${email}`,
      href: `mailto:${email}`,
      external: false,
    },
    {
      Icon: Phone,
      label: `Call: ${phoneLabel}`,
      href: phoneHref,
      external: false,
    },
    {
      Icon: MessageSquare,
      label: `WhatsApp: ${whatsappLabel}`,
      href: whatsappHref,
      external: true,
    },
  ];

  return (
    <div
      className={cn(
        "mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground",
        className
      )}
    >
      {links.map(({ Icon, label, href, external }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          <Icon className="h-4 w-4 text-primary" aria-hidden />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
};

export default ContactDetails;

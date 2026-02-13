import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MaxWidthWrapper } from "@/components";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import blogs from "@/utils/constants/blogs.json";
import { generateMetadata as createMetadata } from "@/utils";

interface Props {
  params: {
    slug: string;
  };
}

type BlogContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | {
      type: "callout";
      title: string;
      text: string;
      cta_label?: string;
      cta_href?: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

type BlogPost = {
  title: string;
  description: string;
  slug: string;
  author_name?: string;
  date_published?: string;
  reading_time?: string;
  category?: string;
  tags?: string[];
  image?: string;
  meta_title?: string;
  meta_description?: string;
  content?: BlogContentBlock[];
};

const PLACEHOLDER_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";
const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";

const formatDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const renderBlock = (block: BlogContentBlock, index: number) => {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={`block-${index}`} className="text-2xl font-semibold text-foreground">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={`block-${index}`} className="text-xl font-semibold text-foreground">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul key={`block-${index}`} className="ml-5 list-disc space-y-2">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={`block-${index}`} className="ml-5 list-decimal space-y-2">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "image":
      return (
        <figure
          key={`block-${index}`}
          className="overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-[0_20px_60px_-40px_hsl(var(--primary)/0.25)]"
        >
          <div className="relative h-64 w-full">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="px-4 py-3 text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "callout":
      return (
        <div
          key={`block-${index}`}
          className="rounded-2xl border border-border/60 bg-card/90 p-6 shadow-[0_20px_60px_-50px_hsl(var(--primary)/0.35)]"
        >
          <h3 className="text-lg font-semibold text-foreground">{block.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{block.text}</p>
          {block.cta_href && block.cta_label ? (
            <div className="mt-4">
              <PrimaryButton asChild size="sm">
                <Link href={block.cta_href}>{block.cta_label}</Link>
              </PrimaryButton>
            </div>
          ) : null}
        </div>
      );
    case "p":
    default:
      return (
        <p key={`block-${index}`} className="text-base text-muted-foreground">
          {block.text}
        </p>
      );
  }
};

export const generateMetadata = ({ params }: Props) => {
  const blog = blogs.find((item) => item.slug === params.slug) as BlogPost | undefined;
  if (!blog) {
    return createMetadata({
      title: "Blog | Spark & Mend",
      description: "Cleaning tips and checklists from Spark & Mend.",
      noIndex: true,
    });
  }

  return createMetadata({
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.description,
    image: blog.image || PLACEHOLDER_IMAGE,
  });
};

const BlogPage = ({ params }: Props) => {
  const blog = blogs.find((item) => item.slug === params.slug) as BlogPost | undefined;

  if (!blog) {
    notFound();
  }

  const formattedDate = formatDate(blog.date_published);
  const content = Array.isArray(blog.content) ? blog.content : [];

  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className={heroSurface}>
        <StarsBackground
          className="absolute inset-0 opacity-55"
          starColor="#09484F"
          pointerEvents={false}
        />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-left">
            <SectionHeader
              eyebrow="Blog"
              title={blog.title}
              description={blog.description}
              align="left"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {blog.author_name && (
                <span className="font-semibold text-foreground">{blog.author_name}</span>
              )}
              {formattedDate && <span>{formattedDate}</span>}
              {blog.reading_time && <span>{blog.reading_time}</span>}
            </div>
            {blog.tags && blog.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_30px_70px_-55px_hsl(var(--primary)/0.45)]">
            <Image
              src={blog.image || PLACEHOLDER_IMAGE}
              alt="Clean, calm interior setting"
              width={1200}
              height={900}
              className="h-[240px] w-full rounded-[22px] object-cover sm:h-[300px]"
            />
          </div>
        </div>
      </Section>

      <Section className="pt-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-6 shadow-[0_40px_90px_-60px_hsl(var(--primary)/0.45)]">
            <article className="flex flex-col gap-6 text-lg leading-relaxed text-muted-foreground">
              {content.map((block, index) => renderBlock(block, index))}
            </article>
          </div>
          <div className="grid gap-4 rounded-3xl border border-border/60 bg-background/80 p-6 text-sm text-muted-foreground shadow-[0_25px_60px_-45px_hsl(var(--primary)/0.35)] md:grid-cols-[1fr_160px]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Stay in the loop</p>
              <p className="mt-2 text-sm text-foreground">
                Bookmark this guide and use the booking calculator to lock in your preferred clean. We follow up within 24 hours.
              </p>
            </div>
            <div className="flex flex-col items-start justify-end gap-3 pt-4 md:pt-0">
              <PrimaryButton asChild size="sm">
                <Link href="/resources/blog">View all articles</Link>
              </PrimaryButton>
              <PrimaryButton asChild size="sm">
                <Link href="/get-a-quote">Get your quote</Link>
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Section>
    </MaxWidthWrapper>
  );
};

export default BlogPage;

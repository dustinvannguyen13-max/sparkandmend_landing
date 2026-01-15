import Image from "next/image";
import { MaxWidthWrapper } from "@/components";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import blogs from "@/utils/constants/blogs.json";

interface Props {
  params: {
    slug: string;
  };
}

const PLACEHOLDER_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";
const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";

const BlogPage = ({ params }: Props) => {
  const blog = blogs.find((item) => item.slug === params.slug);

  if (!blog) {
    return null;
  }

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
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_30px_70px_-55px_hsl(var(--primary)/0.45)]">
            <Image
              src={PLACEHOLDER_IMAGE}
              alt="Clean, calm interior setting"
              width={1200}
              height={900}
              className="h-[240px] w-full rounded-[22px] object-cover sm:h-[300px]"
            />
          </div>
        </div>
      </Section>
    </MaxWidthWrapper>
  );
};

export default BlogPage;

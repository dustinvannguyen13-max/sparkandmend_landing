import Image from "next/image";
import { AnimationContainer, Blogs, MaxWidthWrapper } from "@/components";
import { Section, SectionHeader } from "@/components/ui/section";

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";

const BlogPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <SectionHeader
                eyebrow="Blog"
                title="Cleaning tips, checklists, and local updates"
                description="Practical advice to keep your space tidy between visits."
                align="left"
              />
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_28px_70px_-52px_hsl(var(--primary)/0.5)]">
              <Image
                src={HERO_IMAGE}
                alt="Clean, calm interior with warm lighting"
                width={1200}
                height={900}
                className="h-[240px] w-full rounded-[22px] object-cover sm:h-[300px]"
              />
            </div>
          </div>
        </AnimationContainer>
      </Section>
      <Section>
        <AnimationContainer delay={0.2}>
          <Blogs />
        </AnimationContainer>
      </Section>
    </MaxWidthWrapper>
  );
};

export default BlogPage;

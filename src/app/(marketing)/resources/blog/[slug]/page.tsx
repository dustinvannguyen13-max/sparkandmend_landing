import Image from "next/image";
import { MaxWidthWrapper } from "@/components";
import { Section, SectionHeader } from "@/components/ui/section";
import blogs from "@/utils/constants/blogs.json";

interface Props {
  params: {
    slug: string;
  };
}

const PLACEHOLDER_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";

const BlogPage = ({ params }: Props) => {
  const blog = blogs.find((item) => item.slug === params.slug);

  if (!blog) {
    return null;
  }

  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-left">
            <SectionHeader
              eyebrow="Blog"
              title={blog.title}
              description={blog.description}
              align="left"
            />
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_28px_70px_-52px_hsl(var(--primary)/0.5)]">
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

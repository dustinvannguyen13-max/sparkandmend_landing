import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import blogs from "@/utils/constants/blogs.json";

const PLACEHOLDER_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w";

const formatDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Blogs = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.slug} href={`/resources/blog/${blog.slug}`}>
            <Card className="group h-full overflow-hidden border-border/70 bg-card/90 transition-all duration-300 hover:-translate-y-[4px] hover:shadow-[0_30px_80px_-50px_hsl(var(--foreground)/0.35)]">
              <div className="relative h-44 overflow-hidden rounded-b-none rounded-t-2xl">
                <Image
                  src={blog.image || PLACEHOLDER_IMAGE}
                  alt="Clean, welcoming interior"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90">
                  {blog.category || "Spark & Mend"}
                </div>
              </div>
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {blog.date_published && <span>{formatDate(blog.date_published)}</span>}
                    {blog.reading_time && <span>{blog.reading_time}</span>}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">{blog.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {blog.description}
                  </CardDescription>
                </div>
                <PrimaryButton
                  variant="secondary"
                  className="mt-auto w-full justify-center text-sm"
                >
                  Read the article →
                </PrimaryButton>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

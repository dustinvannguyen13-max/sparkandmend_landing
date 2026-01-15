import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
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
            <Card className="group h-full border-border/70 bg-card/90 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_28px_70px_-44px_hsl(var(--primary)/0.4)]">
              <CardContent className="p-5">
                <div className="relative h-40 overflow-hidden rounded-2xl">
                  <Image
                    src={blog.image || PLACEHOLDER_IMAGE}
                    alt="Clean, welcoming interior"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {blog.category && (
                      <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                        {blog.category}
                      </span>
                    )}
                    {blog.date_published && (
                      <span>{formatDate(blog.date_published)}</span>
                    )}
                    {blog.reading_time && (
                      <span>{blog.reading_time}</span>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-foreground">
                    {blog.title}
                  </CardTitle>
                  <CardDescription>
                    {blog.description.length > 100
                      ? `${blog.description.substring(0, 100)}...`
                      : blog.description}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

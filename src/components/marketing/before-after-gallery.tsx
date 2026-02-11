import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BeforeAfterItem {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
}

interface BeforeAfterGalleryProps {
  items: BeforeAfterItem[];
}

const BeforeAfterGallery = ({ items }: BeforeAfterGalleryProps) => {
  return (
    <div className="grid gap-6">
      {items.map((item, index) => (
        <Card key={`${item.beforeSrc}-${index}`} className="border-none bg-card/85">
          {item.caption ? (
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                {item.caption}
              </CardTitle>
            </CardHeader>
          ) : null}
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Before
              </p>
              <div className="relative h-48 overflow-hidden rounded-xl border border-border/50 bg-muted/40">
                <Image
                  src={item.beforeSrc}
                  alt={item.beforeAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                After
              </p>
              <div className="relative h-48 overflow-hidden rounded-xl border border-border/50 bg-muted/40">
                <Image
                  src={item.afterSrc}
                  alt={item.afterAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BeforeAfterGallery;

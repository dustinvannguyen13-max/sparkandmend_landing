import React from "react";
import Image from "next/image";
import { Footer, Navbar } from "@/components";

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <>
            <div
                id="home"
                className="absolute inset-0 h-full [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
            >
                <Image
                    src="https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w"
                    alt="Spark & Mend cleaning scene"
                    fill
                    priority
                    sizes="100vw"
                    className="h-full w-full object-cover object-top opacity-15"
                />
            </div>
            <Navbar />
            <main className="mt-20 mx-auto w-full z-0 relative">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default MarketingLayout

import React from 'react'
import AnimationContainer from "@/components/global/animation-container";
const EnterprisePage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AnimationContainer delay={0.1}>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    Get a Free Quote
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                    Interested in our services? Fill out some info and we will be in touch shortly. We cannot wait to hear from you. Contact us for pricing.
                </p>
                <div className="mt-8 text-sm md:text-base text-muted-foreground">
                    <p className="font-medium text-foreground text-center">To get started, share:</p>
                    <ul className="list-disc text-left mt-4 max-w-lg mx-auto">
                        <li>Name (first and last)</li>
                        <li>Email (required)</li>
                        <li>Phone</li>
                        <li>Service interest: Basic, Intermediate, or Advanced</li>
                        <li>Preferred date</li>
                        <li>How you heard about us</li>
                        <li>Message (required)</li>
                        <li>Optional: sign up for news and updates</li>
                    </ul>
                </div>
                <div className="mt-10 text-base md:text-lg text-center text-muted-foreground space-y-2">
                    <p>Spark &amp; Mend</p>
                    <p>Email: sparkandmend@gmail.com</p>
                    <p>Call: 07715 293761 or 07452 824799</p>
                    <p>Hours: Monday - Friday, 9am - 6pm</p>
                </div>
            </AnimationContainer>
        </div>
    )
};

export default EnterprisePage

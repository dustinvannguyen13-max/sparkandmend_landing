import AnimationContainer from "@/components/global/animation-container";
import React from 'react'

const ChangeLogPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AnimationContainer delay={0.1}>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    About Spark and Mend
                </h1>
                <div className="text-base md:text-lg mt-6 text-center text-muted-foreground space-y-4">
                    <p>
                        At Spark and Mend, we believe a clean space makes all the difference, whether it is your home, office, or rental property. Based in Plymouth, we are proud to offer a full range of professional cleaning services, including residential, commercial, end-of-tenancy, and deep cleans.
                    </p>
                    <p>
                        Our team is committed to delivering exceptional results with reliability, attention to detail, and care. Every clean is carried out to a high standard using trusted methods and quality products, so you can relax knowing your property is in safe hands.
                    </p>
                    <p>
                        We understand that every client is unique, which is why we offer custom cleaning packages and flexible scheduling to fit around your lifestyle or business hours. Whether you need a regular clean or a one-off deep service, our goal is to leave your space spotless and your time protected.
                    </p>
                </div>
            </AnimationContainer>
        </div>
    )
};

export default ChangeLogPage

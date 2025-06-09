import { Box, Castle, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroProps {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  button?: {
    text?: string;
    icon?: React.ReactNode;
    url?: string;
  };
  trustText?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const Hero = ({
  icon = <Box className="size-6" />,
  heading = "Elevate Your 3D NFTs with SpectraMint",
  description = "Create, mint and showcase your immersive 3D NFTs on the most innovative marketplace built for the metaverse.",
  button = {
    text: "Explore Marketplace",
    icon: <Castle className="ml-2 size-4" />,
    url: "/market",
  },
  trustText = "Powered by blockchain technology",
  imageSrc = "/hero1.jpeg",
  imageAlt = "3D NFT showcase",
}: HeroProps) => {
  return (
    <section className="flex justify-center overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              {icon}
            </span>
            <h2 className="mx-auto max-w-5xl text-center text-3xl font-medium text-balance md:text-6xl">
              {heading}
            </h2>
            <p className="mx-auto max-w-3xl text-center text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
              <div className="flex items-center gap-4">
                <Button size="lg" asChild>
                  <a href={button.url}>
                    {button.text} {button.icon}
                  </a>
                </Button>
                <Button variant={"outline"} size="lg" asChild>
                  <a href={"/create-blob"}>
                    Create Blob <Circle />
                  </a>
                </Button>
              </div>
              {trustText && (
                <div className="text-xs text-muted-foreground">{trustText}</div>
              )}
            </div>
          </div>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="mx-auto h-full max-h-[524px] w-full max-w-5xl rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

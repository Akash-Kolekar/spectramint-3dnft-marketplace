import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "../wrappers/max-width-wrapper";

interface AboutProps {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "/file.svg",
    alt: "Metamask",
  },
  {
    src: "/file.svg",
    alt: "Coinbase",
  },
  {
    src: "/file.svg",
    alt: "Ethereum",
  },
  {
    src: "/file.svg",
    alt: "OpenSea",
  },
  {
    src: "/file.svg",
    alt: "Polygon",
  },
  {
    src: "/file.svg",
    alt: "Rarible",
  },
];

const defaultAchievements = [
  { label: "NFTs Minted", value: "10K+" },
  { label: "Artists Onboard", value: "2K+" },
  { label: "Transactions", value: "50K+" },
  { label: "Average Gas Fee", value: "0.001 ETH" },
];

const About = ({
  title = "About SpectraMint",
  description = "SpectraMint is revolutionizing the NFT space with our focus on immersive 3D NFTs that unlock new possibilities for creators and collectors in the metaverse.",
  mainImage = {
    src: "/hero2.webp",
    alt: "3D NFT gallery",
  },
  secondaryImage = {
    src: "/hero3.webp",
    alt: "3D NFT creation",
  },
  breakout = {
    src: "/globe.svg",
    alt: "SpectraMint logo",
    title: "Redefining Digital Ownership",
    description:
      "Our platform enables creators to mint, showcase and trade their 3D models with built-in royalties and verifiable ownership on the blockchain.",
    buttonText: "Learn more",
    buttonUrl: "/about",
  },
  companiesTitle = "Integrated with leading platforms",
  companies = defaultCompanies,
  achievementsTitle = "Our Marketplace in Numbers",
  achievementsDescription = "Leading the way in 3D NFT innovation with a growing community of creators and collectors.",
  achievements = defaultAchievements,
}: AboutProps = {}) => {
  return (
    <MaxWidthWrapper className="py-32">
      <div className="container">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="bg-muted flex flex-col justify-between gap-6 rounded-xl p-7 md:w-1/2 lg:w-auto">
              <img
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto" asChild>
                <a href={breakout.buttonUrl} target="_blank">
                  {breakout.buttonText}
                </a>
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        <div className="py-32">
          <p className="text-center">{companiesTitle} </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div className="flex items-center gap-3" key={company.src + idx}>
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-6 w-auto md:h-8"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-muted relative overflow-hidden rounded-xl p-10 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-4xl font-semibold">{achievementsTitle}</h2>
            <p className="text-muted-foreground max-w-xl">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
            {achievements.map((item, idx) => (
              <div className="flex flex-col gap-4" key={item.label + idx}>
                <p>{item.label}</p>
                <span className="text-4xl font-semibold md:text-5xl">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default About;

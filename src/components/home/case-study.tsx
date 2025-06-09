import { MoveRight } from "lucide-react";
import React from "react";
import MaxWidthWrapper from "../wrappers/max-width-wrapper";

interface CasestudyItem {
  logo: string;
  company: string;
  tags: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface CasestudyProps {
  featuredCasestudy?: CasestudyItem;
  casestudies?: CasestudyItem[];
}

const defaultFeaturedCasestudy: CasestudyItem = {
  logo: "/globe.svg",
  company: "Virtual Museum",
  tags: "ARTIST SPOTLIGHT / VIRTUAL EXHIBITION",
  title: "Immersive 3D Art Gallery in the Metaverse.",
  subtitle: "How artists are redefining exhibitions with SpectraMint.",
  image: "/hero4.jpeg",
  link: "/case-studies/virtual-museum",
};

const defaultCasestudies: CasestudyItem[] = [
  {
    logo: "/window.svg",
    company: "Digital Twins",
    tags: "ARCHITECTURE / REAL ESTATE",
    title: "3D NFTs for Real Estate Visualization.",
    subtitle: "Creating digital twins of properties as collectible assets.",
    image: "",
    link: "/case-studies/digital-twins",
  },
  {
    logo: "/file.svg",
    company: "GameFi Studio",
    tags: "GAMING / METAVERSE ASSETS",
    title: "Cross-platform 3D game assets.",
    subtitle: "How GameFi leverages SpectraMint for in-game items.",
    image: "",
    link: "/case-studies/gamefi",
  },
];

const Casestudy = ({
  featuredCasestudy = defaultFeaturedCasestudy,
  casestudies = defaultCasestudies,
}: CasestudyProps) => {
  return (
    <MaxWidthWrapper className="py-32">
      <div className="container">
        <div className="border border-border">
          <a
            href={featuredCasestudy.link || "#"}
            className="group grid gap-4 overflow-hidden px-6 transition-colors duration-500 ease-out hover:bg-muted/40 lg:grid-cols-2 xl:px-28"
          >
            <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <img src={featuredCasestudy.logo} alt="logo" className="h-9" />
                {featuredCasestudy.company}
              </div>
              <div>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {featuredCasestudy.tags}
                </span>
                <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                  {featuredCasestudy.title}
                  <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                    {" "}
                    {featuredCasestudy.subtitle}
                  </span>
                </h2>
                <div className="flex items-center gap-2 font-medium">
                  Read case study
                  <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            <div className="relative isolate py-16">
              <div className="relative isolate h-full border border-border bg-background p-2">
                <div className="h-full overflow-hidden">
                  <img
                    src={featuredCasestudy.image}
                    alt="placeholder"
                    className="aspect-14/9 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </a>
          <div className="flex border-t border-border">
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
            <div className="grid lg:grid-cols-2">
              {casestudies.map((item, idx) => (
                <a
                  key={item.company}
                  href={item.link || "#"}
                  className={`group flex flex-col justify-between gap-12 border-border bg-background px-6 py-8 transition-colors duration-500 ease-out hover:bg-muted/40 md:py-16 lg:pb-16 xl:gap-16 ${
                    idx === 0
                      ? "xl:border-l xl:pl-8"
                      : "border-t lg:border-t-0 lg:border-l xl:border-r xl:pl-8"
                  }`}
                >
                  <div className="flex items-center gap-2 text-2xl font-medium">
                    <img src={item.logo} alt="logo" className="h-9" />
                    {item.company}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {item.tags}
                    </span>
                    <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                      {item.title}
                      <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                        {" "}
                        {item.subtitle}
                      </span>
                    </h2>
                    <div className="flex items-center gap-2 font-medium">
                      Read case study
                      <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Casestudy;

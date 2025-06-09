import MaxWidthWrapper from "../wrappers/max-width-wrapper";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "/globe.svg",
    alt: "SpectraMint Logo",
    title: "SpectraMint",
    url: "/",
  },
  tagline = "The Future of 3D NFTs.",
  menuItems = [
    {
      title: "Marketplace",
      links: [
        { text: "Explore", url: "/market" },
        { text: "Collections", url: "/collections" },
        { text: "Artists", url: "/artists" },
        { text: "Rankings", url: "/rankings" },
        { text: "Activity", url: "/activity" },
        { text: "Categories", url: "/categories" },
      ],
    },
    {
      title: "Create",
      links: [
        { text: "Mint 3D NFT", url: "/create" },
        { text: "Create Blob", url: "/create-blob" },
        { text: "Creator Dashboard", url: "/dashboard" },
        { text: "Resources", url: "/resources" },
        { text: "Creator Program", url: "/creator-program" },
        { text: "Tools", url: "/tools" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "/about" },
        { text: "Careers", url: "/careers" },
        { text: "Blog", url: "/blog" },
        { text: "Docs", url: "/docs" },
        { text: "Contact", url: "/contact" },
        { text: "Partners", url: "/partners" },
      ],
    },
    {
      title: "Community",
      links: [
        { text: "Discord", url: "https://discord.gg/spectramint" },
        { text: "Twitter", url: "https://twitter.com/spectramint" },
        { text: "Telegram", url: "https://t.me/spectramint" },
      ],
    },
  ],
  copyright = "© 2025 SpectraMint. All rights reserved.",
  bottomLinks = [
    { text: "Terms of Service", url: "/terms" },
    { text: "Privacy Policy", url: "/privacy" },
  ],
}: FooterProps) => {
  return (
    <MaxWidthWrapper className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a href="https://shadcnblocks.com">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10"
                  />
                </a>
                <p className="text-xl font-semibold">{logo.title}</p>
              </div>
              <p className="mt-4 font-bold">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </MaxWidthWrapper>
  );
};

export default Footer;

"use client";

import React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import ConnectWalletButton from "./auth/connect-wallet-button";
import MaxWidthWrapper from "./wrappers/max-width-wrapper";
import { buttonVariants } from "./ui/button";

type Props = {};

const Header = (props: Props) => {
  const navUrls = [
    {
      title: "Market",
      url: "/market",
    },
    {
      title: "My owned NFTs",
      url: "/owned",
    },
    {
      title: "Create",
      url: "/create",
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-accent/20 border-b border-border px-5 py-3 z-30 backdrop-blur-md">
      <MaxWidthWrapper className="flex justify-between items-center">
        <Link href={"/"} className="uppercase font-bold text-xl">
          SpectraMint
        </Link>
        <nav className="flex items-center gap-3">
          {navUrls.map((url) => (
            <Link
              key={url.title}
              href={url.url}
              className="hover:text-primary hover:underline underline-offset-4"
            >
              {url.title}
            </Link>
          ))}
          <Link
            href={"/create-blob"}
            className={buttonVariants({ variant: "outline" })}
          >
            Blob Creator
          </Link>
          <ConnectWalletButton />

          <ModeToggle />
        </nav>
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;

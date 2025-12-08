"use client";

import Image from "next/image";

const ExploreBtn = () => {
  return (
    <a
      id="explore-btn"
      href="#events"
      className="mt-7 mx-auto w-max flex items-center gap-2"
      aria-label="Explore Events"
    >
      Explore Events
      <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
    </a>
  );
};

export default ExploreBtn;

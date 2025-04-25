"use client";

import { PortableText, PortableTextBlock } from "@portabletext/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { IoIosArrowRoundDown } from "react-icons/io";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

type AnimatedPagesProps = {
  localizedContent: {
    navigation: PortableTextBlock[];
    welcome: PortableTextBlock[];
  };
};

export default function AnimatedPages({ localizedContent }: AnimatedPagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const sections = sectionsRef.current.filter(Boolean);

    if (!container || sections.length === 0) return;

    // Reset any existing animations
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Configure each section for fullscreen view
    sections.forEach((section) => {
      gsap.set(section, {
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0,
        position: "relative",
      });
    });

    // Make the first section visible initially
    gsap.set(sections[0], { opacity: 1 });

    // Set up ScrollTrigger for each section
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        markers: false, // Enable for debugging - you can see the trigger points
        onEnter: () => {
          console.log(`Entering section ${i}`);
          gsap.to(section, {
            opacity: 1,
            duration: 0.5,
          });
        },
        onLeave: () => {
          console.log(`Leaving section ${i}`);
          if (i < sections.length - 1) {
            gsap.to(section, {
              opacity: 0,
              duration: 0.5,
            });
          }
        },
        onEnterBack: () => {
          console.log(`Entering back section ${i}`);
          gsap.to(section, {
            opacity: 1,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          console.log(`Leaving back section ${i}`);
          if (i > 0) {
            gsap.to(section, {
              opacity: 0,
              duration: 0.5,
            });
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen overflow-y-auto pointer-events-auto text-white no-scrollbar">
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        ref={(el) => {
          if (el) sectionsRef.current[0] = el;
        }}
      >
        <div className="max-w-xl text-center px-4 justify-center items-center flex-col flex">
          <h1 className="text-3xl font-libre font-bold italic">Followly</h1>
          <IoIosArrowRoundDown className="mt-20" size={30} />
        </div>
      </div>

      <div
        className="min-h-screen flex flex-col items-center justify-center"
        ref={(el) => {
          if (el) sectionsRef.current[1] = el;
        }}
      >
        <div className="max-w-xl text-center px-4 flex justify-center items-center flex-col">
          <PortableText value={localizedContent.navigation} />
          <IoIosArrowRoundDown className="mt-20" size={30} />
        </div>
      </div>

      <div
        className="min-h-screen flex flex-col items-center justify-center"
        ref={(el) => {
          if (el) sectionsRef.current[2] = el;
        }}
      >
        <div className="max-w-xl text-center px-4 ">
          <PortableText value={localizedContent.welcome} />
        </div>
      </div>
    </div>
  );
}

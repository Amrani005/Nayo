"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SectionUrlSync() {
  return (
    <Suspense fallback={null}>
      <SectionUrlSyncInner />
    </Suspense>
  );
}

function SectionUrlSyncInner() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const updateHash = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sections = Array.from(
          document.querySelectorAll<HTMLElement>("[data-url-section][id]"),
        );
        if (sections.length === 0) return;

        const anchorPosition = window.innerHeight * 0.3;
        const currentSection = [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= anchorPosition);
        const activeSection =
          currentSection ??
          (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1
            ? sections[sections.length - 1]
            : sections[0]);

        if (!activeSection || window.location.hash === `#${activeSection.id}`) return;

        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}#${activeSection.id}`,
        );
      });
    };

    updateHash();
    window.addEventListener("scroll", updateHash, { passive: true });
    window.addEventListener("resize", updateHash);
    const observer = new MutationObserver(updateHash);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHash);
      window.removeEventListener("resize", updateHash);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

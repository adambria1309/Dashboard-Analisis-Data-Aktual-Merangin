"use client";

import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, BarChart3, MapPinned, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DADAM from "@/img/DADAM.svg";
import encourage from "@/img/iconEncouraging.png";

const features = [
  {
    icon: BarChart3,
    title: "Data yang mudah dipahami",
    description: "Ikuti perkembangan ekonomi dan sosial-kependudukan melalui ringkasan yang jelas.",
  },
  {
    icon: MapPinned,
    title: "Informasi berbasis wilayah",
    description: "Jelajahi indikator Merangin melalui grafik dan peta interaktif.",
  },
  {
    icon: Sparkles,
    title: "Eksplorasi yang praktis",
    description: "Temukan konteks utama data daerah dalam satu dashboard.",
  },
];

export default function Home() {
  const [showArrow, setShowArrow] = useState(true);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowArrow(entry.isIntersecting);
    }, { threshold: 0.2 });

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dotLottie) return;

    if (showArrow) dotLottie.play();
    else dotLottie.pause();
  }, [dotLottie, showArrow]);

  const handleScroll = () => {
    document.getElementById("next-section")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[calc(100svh-7rem)] items-center overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 px-4 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-8 md:min-h-[calc(100svh-4rem)] lg:px-12"
      >
        <div className="pointer-events-none absolute -left-24 top-12 -z-10 size-72 rounded-full bg-gradient-to-br from-sky-200/50 via-sky-100/20 to-transparent dark:from-sky-700/25 dark:via-sky-800/10" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              BPS Kabupaten Merangin
            </p>
            <Image
              src={DADAM}
              alt="DADAM — Dashboard Analisis Data Aktual Merangin"
              width={555}
              height={161}
              priority
              sizes="(min-width: 1024px) 555px, 90vw"
              className="h-auto w-full max-w-[555px]"
            />
            <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              Kenali perkembangan Kabupaten Merangin melalui data.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Dashboard interaktif untuk membantu pemerintah dan masyarakat memahami kondisi
              ekonomi, tenaga kerja, kemiskinan, dan kependudukan Merangin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/summary"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                Buka ringkasan <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/economics"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Lihat dashboard ekonomi
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl" aria-hidden="true">
            <DotLottieReact
              src="https://lottie.host/2c0a47bd-ad4b-4917-b47d-e11862d4798b/nEeDDeOgOt.lottie"
              loop
              autoplay={false}
              dotLottieRefCallback={setDotLottie}
              style={{ width: "100%", height: "auto", aspectRatio: "1 / 1" }}
            />
          </div>
        </div>

        {showArrow && (
          <button
            type="button"
            onClick={handleScroll}
            aria-label="Gulir ke pengenalan dashboard"
            className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 motion-safe:animate-bounce rounded-full p-2 text-sky-700 transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:text-sky-300 dark:hover:bg-slate-800 sm:inline-flex"
          >
            <ChevronDown aria-hidden="true" size={32} strokeWidth={2.5} />
          </button>
        )}
      </section>

      <section
        id="next-section"
        className="scroll-mt-20 bg-gradient-to-br from-fuchsia-700 via-blue-700 to-sky-700 px-4 py-16 text-white sm:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="mx-auto w-full max-w-lg">
            <Image
              src={encourage}
              alt=""
              width={600}
              height={600}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="h-auto w-full rounded-3xl object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-100">
              Data Merangin, lebih dekat
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Pahami kondisi daerah dengan cara yang lebih menarik.
            </h2>
            <div className="mt-8 grid gap-4">
              {features.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className="flex gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm transition-colors hover:bg-white/15"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sky-100">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-100">
                      0{index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-blue-50">{description}</p>
                  </div>
                </article>
              ))}
            </div>
            <Link
              href="/summary#demografi"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Jelajahi data sosial-kependudukan
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

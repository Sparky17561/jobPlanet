import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  Sparkles,
  Globe,
  Trophy,
  LayoutDashboard,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PlatformStrengths = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  const strengths = [
    {
      capability: "Full Automation",
      description: "Applies + prepares + tracks — not just one feature",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      capability: "AI Personalization",
      description: "Every output tailored to job role + company",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      capability: "Browser Extension",
      description: "Works wherever job portals are",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
    {
      capability: "Gamified Referrals",
      description: "Quality-driven connections, not spam",
      icon: Trophy,
      color: "from-orange-500 to-red-500",
    },
    {
      capability: "Unified Dashboard",
      description: "One place for all career workflows",
      icon: LayoutDashboard,
      color: "from-indigo-500 to-purple-500",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children || [], {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium">
              Platform Strengths
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What Makes JobSphere Stand Out
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover the capabilities that set us apart from the competition
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strengths.map((strength, index) => {
            const IconComponent = strength.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all group shadow-lg"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${strength.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {strength.capability}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {strength.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformStrengths;

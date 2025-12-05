import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Target, Sparkles, BarChart3 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Vision = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
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

  const goals = [
    {
      icon: Zap,
      title: "Apply Faster",
      description: "Cut application time from 30 minutes to under 2 minutes",
      color: "text-blue-400",
    },
    {
      icon: Target,
      title: "Apply Smarter",
      description: "AI-powered personalization for every application",
      color: "text-purple-400",
    },
    {
      icon: Sparkles,
      title: "Stand Out",
      description: "Personalized resumes and cover letters that get noticed",
      color: "text-pink-400",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor applications and improve continuously",
      color: "text-cyan-400",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={contentRef} className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium">
              Core Vision
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Empowering Professionals with Automation & Intelligence
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-4">
            To empower professionals with automation, intelligence, and confidence
            while job-hunting — helping them apply faster, apply smarter, stand out
            with personalization, and track progress continuously.
          </p>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
            No more juggling multiple apps, rewriting the same answers, or losing
            track of applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((goal, index) => {
            const IconComponent = goal.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all ${goal.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {goal.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{goal.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Vision;

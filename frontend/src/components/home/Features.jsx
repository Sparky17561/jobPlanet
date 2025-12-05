import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileText,
  FileCheck,
  BarChart3,
  MessageSquare,
  Users,
  Mail,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children || [], {
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

  const features = [
    {
      title: "AI Form Filler",
      description:
        "Automatically fills career portal and company application forms with personalized responses.",
      icon: FileText,
      color: "text-blue-400",
    },
    {
      title: "JD-Tailored Resume & Cover Letter",
      description:
        "Transforms your resume dynamically for each job with ATS-friendly formatting.",
      icon: FileCheck,
      color: "text-purple-400",
    },
    {
      title: "Smart Application Tracker",
      description:
        "Tracks all applications automatically with insights on what works best.",
      icon: BarChart3,
      color: "text-green-400",
    },
    {
      title: "Interview Prep Hub",
      description:
        "Personalized preparation with JD-based questions and AI interview simulations.",
      icon: MessageSquare,
      color: "text-orange-400",
    },
    {
      title: "Gamified Referral Pool",
      description:
        "Quality-driven referral marketplace connecting candidates with referrers.",
      icon: Users,
      color: "text-yellow-400",
    },
    {
      title: "Cold Email & DM Generator",
      description:
        "Personalized networking outreach for LinkedIn, X, and email.",
      icon: Mail,
      color: "text-indigo-400",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={contentRef} className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium">
              Our Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Innovative Features of JobSphere
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Everything you need to streamline your job application process
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all ${feature.color}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

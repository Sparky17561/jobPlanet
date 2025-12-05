import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Users, Briefcase, Target } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  const sectionRef = useRef(null);
  const logosRef = useRef(null);

  // Placeholder partner logos - replace with actual partner logos/images
  const partners = [
    { name: "Tech Corp", icon: Building2 },
    { name: "Startup Hub", icon: Briefcase },
    { name: "Career Network", icon: Users },
    { name: "Job Portal", icon: Target },
    { name: "Recruitment Pro", icon: Building2 },
    { name: "Talent Pool", icon: Users },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logosRef.current?.children || [], {
        opacity: 0,
        scale: 0.8,
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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium">
              Our Partners
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Leading the Way in Job Application Automation
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Trusted by professionals and companies worldwide
          </p>
        </div>

        <div
          ref={logosRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {partners.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group"
              >
                <div className="text-white/40 group-hover:text-white/60 transition-colors">
                  <IconComponent className="w-8 h-8" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;


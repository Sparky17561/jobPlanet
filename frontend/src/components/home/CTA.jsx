import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ctaRef.current?.children || [], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="max-w-4xl mx-auto text-center">
        <div ref={ctaRef}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who are already using JobSphere to
            streamline their job application process and land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:border-white/40 hover:bg-white/5 transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

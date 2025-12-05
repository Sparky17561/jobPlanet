import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { Zap, TrendingUp, Target } from "lucide-react";

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .from(
        ctaRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Revolutionize Your Job Search With{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI-Powered Automation
          </span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Automate every step of your hiring journey — from tailoring resumes to
          filling forms, preparing interviews, tracking applications, and finding
          referrals — all in one seamless workflow.
        </p>
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/pricing"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:border-white/40 hover:bg-white/5 transition-all"
          >
            View Pricing
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
              &lt;2 min
            </div>
            <div className="text-white/60">Application Time</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
              10x
            </div>
            <div className="text-white/60">Faster Applications</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Target className="w-8 h-8 text-pink-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
              100%
            </div>
            <div className="text-white/60">Automated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from "react";
import { useNavigate } from "react-router-dom";


const CallToAction = () => {

  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(#22c55e 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }
      `}</style>

      <div id="cta" className="relative w-full overflow-hidden bg-white mb-0 border-t border-green-50">
        
        {/* Background Layer */}
        <div className="absolute inset-0 bg-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
          
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-200/30 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-300/20 rounded-full blur-[80px]"></div>
          
          {/* TOP RIGHT RESUME ACCENT */}
          <div className="hidden lg:block absolute top-10 right-[15%] w-24 h-32 bg-white border-2 border-green-200 rounded-xl shadow-lg shadow-green-100/50 -rotate-6 animate-float z-20">
             <div className="w-16 h-2.5 bg-green-200 mt-5 mx-auto rounded-sm"></div>
             <div className="w-16 h-1.5 bg-slate-200 mt-4 mx-auto rounded-sm"></div>
             <div className="w-16 h-1.5 bg-slate-100 mt-2 mx-auto rounded-sm"></div>
             <div className="w-10 h-1.5 bg-slate-100 mt-2 mx-auto rounded-sm"></div>
             <div className="absolute top-2 right-2 w-4 h-4 bg-green-50 rounded-sm border border-green-100"></div>
          </div>

          {/* NEW BOTTOM LEFT RESUME ACCENT */}
          <div 
            className="hidden lg:block absolute bottom-12 left-[15%] w-24 h-32 bg-white border-2 border-green-200 rounded-xl shadow-lg shadow-green-100/50 rotate-3 animate-float z-20"
            style={{ animationDelay: '1s' }} // Staggered animation
          >
             <div className="w-16 h-2.5 bg-green-200 mt-5 mx-auto rounded-sm"></div>
             <div className="w-16 h-1.5 bg-slate-200 mt-4 mx-auto rounded-sm"></div>
             <div className="w-16 h-1.5 bg-slate-100 mt-2 mx-auto rounded-sm"></div>
             <div className="w-10 h-1.5 bg-slate-100 mt-2 mx-auto rounded-sm"></div>
             <div className="absolute top-2 right-2 w-4 h-4 bg-green-50 rounded-sm border border-green-100"></div>
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pt-16 pb-20 px-6 max-w-5xl mx-auto">
          
          {/* Badge */}
          <div className="flex items-center justify-center bg-white/80 backdrop-blur-md px-3 py-1 gap-1.5 rounded-full text-[10px] md:text-xs border border-green-200 shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-800 font-bold tracking-wider uppercase">
              AI-Powered Builder
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 max-w-2xl">
            Build a Winning <span className="text-green-600 italic">AI Resume</span> in Minutes
          </h2>

          <p className="text-slate-600 mt-4 max-w-lg text-sm md:text-lg font-medium leading-relaxed">
            Stand out from the crowd. Our AI analyzes your career path to generate the perfect resume for every job.
          </p>

          <div className="mt-8">
  <button
   onClick={() => navigate("/login?state=register")}
    className="group relative inline-flex items-center gap-2 rounded-xl py-3 px-8 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-bold text-sm md:text-base shadow-xl shadow-green-200 active:scale-95 overflow-hidden"
  >
    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
      <div className="relative h-full w-8 bg-white/20"></div>
    </div>

    <span className="relative">Get Started Now</span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative transition-transform group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </button>
</div>
        
          
          <div className="mt-8 text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
             Trusted by 50,000+ professionals
          </div>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
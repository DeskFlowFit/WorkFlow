import React from 'react';

interface Props {
  exerciseId: string;
  isPlaying?: boolean;
  className?: string;
}

export const ExerciseAnimation: React.FC<Props> = ({ exerciseId, isPlaying = true, className = "w-full h-full" }) => {
  // Common colors from palette
  const cBody = "#4f46e5"; // Brand 600
  const cStatic = "#cbd5e1"; // Slate 300
  const cAccent = "#f59e0b"; // Amber 500

  const duration = isPlaying ? "2s" : "0s";
  const state = isPlaying ? "running" : "paused";

  const renderContent = () => {
    switch (exerciseId) {
      case 'chair-squats':
        return (
          <g>
            {/* Chair */}
            <path d="M120 180 L120 250 M180 180 L180 250 M110 180 L190 180 L190 130" stroke={cStatic} strokeWidth="8" fill="none" />
            
            {/* Person */}
            <g className="squat-anim">
              <circle cx="150" cy="70" r="15" fill={cBody} /> {/* Head */}
              <line x1="150" y1="85" x2="150" y2="140" stroke={cBody} strokeWidth="12" strokeLinecap="round" /> {/* Torso */}
              <line x1="150" y1="140" x2="130" y2="200" stroke={cBody} strokeWidth="10" strokeLinecap="round" /> {/* Leg L */}
              <line x1="150" y1="140" x2="170" y2="200" stroke={cBody} strokeWidth="10" strokeLinecap="round" /> {/* Leg R */}
              <line x1="150" y1="95" x2="120" y2="120" stroke={cBody} strokeWidth="8" strokeLinecap="round" /> {/* Arm L */}
              <line x1="150" y1="95" x2="180" y2="120" stroke={cBody} strokeWidth="8" strokeLinecap="round" /> {/* Arm R */}
            </g>
            <style>{`
              .squat-anim { animation: squat 3s ease-in-out infinite; transform-origin: 150px 200px; animation-play-state: ${state}; }
              @keyframes squat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(40px); }
              }
            `}</style>
          </g>
        );

      case 'desk-pushups':
        return (
          <g>
            {/* Desk */}
            <path d="M220 100 L220 250 M200 100 L260 100" stroke={cStatic} strokeWidth="8" fill="none" />
            
            {/* Person */}
            <g className="pushup-anim">
              <circle cx="140" cy="90" r="15" fill={cBody} />
              <line x1="140" y1="105" x2="100" y2="200" stroke={cBody} strokeWidth="12" strokeLinecap="round" /> {/* Body */}
              <line x1="100" y1="200" x2="80" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" /> {/* Legs */}
              <line x1="130" y1="110" x2="210" y2="100" stroke={cBody} strokeWidth="8" strokeLinecap="round" /> {/* Arms */}
            </g>
             <style>{`
              .pushup-anim { animation: pushup 2.5s ease-in-out infinite; transform-origin: 80px 250px; animation-play-state: ${state}; }
              @keyframes pushup {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(15deg); }
              }
            `}</style>
          </g>
        );

      case 'seated-spinal-twist':
        return (
          <g>
            {/* Chair */}
            <path d="M120 200 L120 250 M180 200 L180 250 M110 200 L190 200 M110 130 L110 200" stroke={cStatic} strokeWidth="8" fill="none" />
            
            {/* Person Legs (Static) */}
            <line x1="140" y1="200" x2="140" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" />
            <line x1="160" y1="200" x2="160" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" />
            
            {/* Torso (Rotating) */}
            <g className="twist-anim">
               <line x1="150" y1="130" x2="150" y2="200" stroke={cBody} strokeWidth="14" strokeLinecap="round" />
               <circle cx="150" cy="115" r="15" fill={cBody} />
               <path d="M120 140 L180 140" stroke={cBody} strokeWidth="8" strokeLinecap="round" /> {/* Shoulders */}
            </g>
            {/* Twist Indicator Arrows */}
            <path d="M190 120 Q 210 130 190 150" stroke={cAccent} strokeWidth="4" fill="none" markerEnd="url(#arrow)" opacity="0.6" className="twist-arrow" />

             <style>{`
              .twist-anim { animation: twist 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; animation-play-state: ${state}; }
              .twist-arrow { animation: fade 4s ease-in-out infinite; animation-play-state: ${state}; }
              @keyframes twist {
                0%, 100% { transform: scaleX(1); }
                50% { transform: scaleX(0.7); } /* Pseudo-3D effect */
              }
              @keyframes fade {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
              }
            `}</style>
          </g>
        );

      case 'stealth-glute-clench':
        return (
           <g>
            {/* Chair */}
            <path d="M120 200 L120 250 M180 200 L180 250 M110 200 L190 200" stroke={cStatic} strokeWidth="8" fill="none" />
            
            {/* Person */}
            <g className="glute-anim">
              <circle cx="150" cy="100" r="15" fill={cBody} />
              <line x1="150" y1="115" x2="150" y2="190" stroke={cBody} strokeWidth="12" strokeLinecap="round" />
              <line x1="150" y1="190" x2="130" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" />
              <line x1="150" y1="190" x2="170" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" />
            </g>
            
            {/* Energy Pulse */}
            <circle cx="150" cy="190" r="10" fill={cAccent} className="glute-pulse" opacity="0" />

             <style>{`
              .glute-anim { animation: lift 3s ease-in-out infinite; animation-play-state: ${state}; }
              .glute-pulse { animation: pulse 3s ease-in-out infinite; animation-play-state: ${state}; }
              @keyframes lift {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                50% { opacity: 0.6; transform: scale(1.5); }
              }
            `}</style>
          </g>
        );
      
      case 'under-desk-leg-extension':
        return (
          <g>
             {/* Chair */}
            <path d="M100 180 L100 250 M160 180 L160 250 M90 180 L170 180" stroke={cStatic} strokeWidth="8" fill="none" />
            {/* Desk */}
            <path d="M220 100 L220 250 M180 100 L260 100" stroke={cStatic} strokeWidth="8" fill="none" />

            {/* Person Torso (Static) */}
            <circle cx="130" cy="100" r="15" fill={cBody} />
            <line x1="130" y1="115" x2="130" y2="180" stroke={cBody} strokeWidth="12" strokeLinecap="round" />
            
            {/* Thigh (Static) */}
            <line x1="130" y1="180" x2="170" y2="180" stroke={cBody} strokeWidth="10" strokeLinecap="round" />
            
            {/* Lower Leg (Animated) */}
            <line x1="170" y1="180" x2="170" y2="230" stroke={cBody} strokeWidth="10" strokeLinecap="round" className="leg-anim" />

            <style>{`
              .leg-anim { animation: kick 3s ease-in-out infinite; transform-origin: 170px 180px; animation-play-state: ${state}; }
              @keyframes kick {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-80deg); }
              }
            `}</style>
          </g>
        );

      case 'soleus-pump':
        return (
          <g>
            {/* Floor */}
            <line x1="50" y1="250" x2="250" y2="250" stroke={cStatic} strokeWidth="4" />
            
            {/* Foot */}
            <g className="soleus-anim">
              <path d="M120 200 L120 240 L160 240" stroke={cBody} strokeWidth="12" strokeLinecap="round" fill="none" />
            </g>
            <style>{`
              .soleus-anim { animation: pump 0.8s ease-in-out infinite; transform-origin: 160px 240px; animation-play-state: ${state}; }
              @keyframes pump {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-25deg); }
              }
            `}</style>
          </g>
        );

      case 'bird-dog-desk':
        return (
           <g>
             {/* Desk */}
             <path d="M220 120 L220 250 M180 120 L260 120" stroke={cStatic} strokeWidth="8" fill="none" />
             
             {/* Person Body */}
             <g className="bird-anim">
               <circle cx="140" cy="100" r="15" fill={cBody} />
               <line x1="140" y1="115" x2="130" y2="180" stroke={cBody} strokeWidth="12" strokeLinecap="round" />
               <line x1="130" y1="180" x2="120" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" /> {/* Leg Static */}
               <line x1="130" y1="180" x2="120" y2="250" stroke={cBody} strokeWidth="10" strokeLinecap="round" className="bird-leg" /> {/* Leg Moving */}
               <line x1="140" y1="120" x2="180" y2="120" stroke={cBody} strokeWidth="8" strokeLinecap="round" className="bird-arm" /> {/* Arm Moving */}
             </g>
             
             <style>{`
              .bird-leg { animation: extLeg 3s ease-in-out infinite; transform-origin: 130px 180px; animation-play-state: ${state}; }
              .bird-arm { animation: extArm 3s ease-in-out infinite; transform-origin: 140px 120px; animation-play-state: ${state}; }
              @keyframes extLeg {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(45deg); }
              }
              @keyframes extArm {
                 0%, 100% { transform: rotate(0deg); }
                 50% { transform: rotate(-45deg); }
              }
            `}</style>
           </g>
        );

      default:
        // Generic Pulse
        return (
          <g>
             <circle cx="150" cy="150" r="30" fill={cBody} className="generic-pulse" />
             <style>{`
               .generic-pulse { animation: gp 2s ease-in-out infinite; transform-origin: center; animation-play-state: ${state}; }
               @keyframes gp {
                 0%, 100% { transform: scale(1); opacity: 1; }
                 50% { transform: scale(1.5); opacity: 0.5; }
               }
             `}</style>
          </g>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${className}`}>
      <svg 
        viewBox="0 0 300 300" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full max-w-[400px]"
      >
        <defs>
           <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
             <path d="M0,0 L0,6 L9,3 z" fill={cAccent} />
           </marker>
        </defs>
        {renderContent()}
      </svg>
    </div>
  );
};
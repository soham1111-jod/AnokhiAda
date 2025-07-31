import React, { useRef, useEffect, useState } from "react";

const words = [
  "Pendants",
  "Earrings",
  "Jhumkas",
  "Bracelets",
  "Hair accessories",
  "Hampers",
  "Customized hampers",
];

const ScrollingWords = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [duplicated, setDuplicated] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const calculateWidths = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        
        setContainerWidth(containerWidth);
        setContentWidth(contentWidth);
        setDuplicated(contentWidth < containerWidth * 1.5);
      }
    };

    calculateWidths();
    window.addEventListener("resize", calculateWidths);
    
    return () => window.removeEventListener("resize", calculateWidths);
  }, []);

  const renderWords = (start = 0, end = words.length) => (
    <div className="inline-flex" ref={contentRef}>
      {words.slice(start, end).map((word, index) => (
        <span 
          key={`${word}-${start}-${index}`} 
          className="mx-10 mt-5 mb-5 text-lg font-semibold text-gray-700 whitespace-nowrap"
        >
          {word}
        </span>
      ))}
    </div>
  );

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden whitespace-nowrap bg-gray-100 py-3"
    >
      <div className="inline-flex animate-marquee">
        {renderWords()}
        {/* Only duplicate if content is smaller than container */}
        {duplicated && renderWords()}
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee ${Math.max(15, contentWidth / 50)}s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${contentWidth}px);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingWords;
import { motion } from "framer-motion";

export default function CircularProgress({ value = 0, color = "#a855f7", size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated fill circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${color}80)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-extrabold font-display tracking-tight text-white"
        >
          {Math.round(value)}%
        </motion.span>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mt-0.5">
          Confidence
        </span>
      </div>
    </div>
  );
}


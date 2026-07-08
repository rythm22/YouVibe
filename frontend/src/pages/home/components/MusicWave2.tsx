import { motion } from "framer-motion";

export const MusicWave2 = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-center space-x-0.5 h-full">
      <motion.div
        className="w-1 bg-gradient-to-r from-white to-blue-500 rounded"
        animate={{
          height: isPlaying ? ["10px", "20px", "8px", "15px", "12px"] : "10px",
        }}
        transition={{
          duration: 0.7,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-1.5 bg-gradient-to-r from-white to-blue-500 rounded"
        animate={{
          height: isPlaying ? ["15px", "8px", "18px", "12px", "5px"] : "15px",
        }}
        transition={{
          duration: 0.75,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-1.5 bg-gradient-to-r from-white to-blue-500 rounded"
        animate={{
          height: isPlaying ? ["15px", "8px", "18px", "12px", "5px"] : "15px",
        }}
        transition={{
          duration: 0.75,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default MusicWave2;

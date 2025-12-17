"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CelebrationProps {
  show: boolean;
  message: string;
  emoji?: string;
  onComplete?: () => void;
}

export default function Celebration({
  show,
  message,
  emoji = "🎉",
  onComplete,
}: CelebrationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setVisible(false);
            onComplete?.();
          }}
        >
          <motion.div
            initial={{ y: 50, rotate: -10 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ y: -50, rotate: 10 }}
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-12 shadow-2xl text-center max-w-md mx-4"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: 2,
              }}
              className="text-8xl mb-4"
            >
              {emoji}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {message}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90"
            >
              Click anywhere to close
            </motion.p>
            
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                }}
                className="absolute text-2xl"
              >
                {["🎉", "✨", "🎊", "🌟", "💫"][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


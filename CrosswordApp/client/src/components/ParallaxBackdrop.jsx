import { motion as Motion, useScroll, useTransform } from "framer-motion";

function ParallaxBackdrop() {
  const { scrollYProgress } = useScroll();
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -220]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Motion.div
        style={{ y: ySlow }}
        className="absolute left-[6%] top-[12%] h-56 w-56 rounded-full bg-white/60 blur-3xl"
      />
      <Motion.div
        style={{ y: yMid }}
        className="absolute right-[8%] top-[22%] h-72 w-72 rounded-full bg-black/5 blur-[90px]"
      />
      <Motion.div
        style={{ y: yFast }}
        className="absolute left-[20%] bottom-[12%] h-80 w-80 rounded-[40%] bg-white/50 blur-[110px]"
      />
    </div>
  );
}

export { ParallaxBackdrop };

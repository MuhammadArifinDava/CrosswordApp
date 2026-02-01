import { useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { getPostImageUrl, getUserAvatarUrl } from "../utils/imageUtils";

function StickyHorizontalSection({ items, title, subtitle }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      const totalWidth = track.scrollWidth;
      const viewport = window.innerWidth;
      const distance = Math.max(0, totalWidth - viewport);
      setScrollRange(distance);
      setSectionHeight(distance + window.innerHeight);
    };

    update();
    const ro = new ResizeObserver(update);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const bgParallaxX = useTransform(scrollYProgress, [0, 1], [0, -scrollRange * 0.5]);
  const bgParallaxXFast = useTransform(scrollYProgress, [0, 1], [0, -scrollRange * 1.5]);

  const visibleItems = useMemo(() => items.slice(0, 10), [items]);

  return (
    <section ref={sectionRef} style={{ height: sectionHeight || "100vh" }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden mb-16">
        {/* Parallax Background Effects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Motion.div 
            style={{ x: bgParallaxX }} 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" 
          />
           <Motion.div 
            style={{ x: bgParallaxXFast }} 
            className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" 
          />
           <Motion.div 
            style={{ x: bgParallaxX }} 
            className="absolute top-10 left-[10%] text-[200px] font-bold text-slate-900/5 whitespace-nowrap select-none"
          >
            DISCOVER STORIES
          </Motion.div>
        </div>

        <div className="w-full relative z-10">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{subtitle}</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {title}
              </h2>
            </Motion.div>

            <div className="mt-24">
              <Motion.div ref={trackRef} style={{ x }} className="flex gap-8 items-center">
                {visibleItems.map((item, index) => (
                    <div
                      key={item._id}
                      className={`group relative min-w-[280px] max-w-[320px] shrink-0 overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-2 ${
                        index % 2 === 1 ? 'mt-24' : '-mt-12'
                      }`}
                    >
                      <Link to={`/posts/${item._id}`} className="block">
                        <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-100">
                          <img
                            src={getPostImageUrl(item)}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                        </div>
                        <div className="mt-5">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                            {item.category || "Featured"}
                          </p>
                          <h3 className="mt-3 text-lg font-semibold leading-tight text-slate-900">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                            {String(item.content || "").slice(0, 140)}
                          </p>
                        </div>
                      </Link>
                      <Link 
                        to={item.author?._id ? `/author/${item.author._id}` : "#"}
                        className="mt-6 flex items-center gap-3 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                        onClick={(e) => {
                          if (!item.author?._id) e.preventDefault();
                        }}
                      >
                        {getUserAvatarUrl(item.author) ? (
                          <img
                            src={getUserAvatarUrl(item.author)}
                            alt={item.author?.username}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold shadow-sm">
                            {(item.author?.username || "U").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">
                            {item.author?.username || "Unknown"}
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.24em]">Author</div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </Motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { StickyHorizontalSection };

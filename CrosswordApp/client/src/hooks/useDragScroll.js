import { useRef, useEffect } from 'react';

export function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startY;
    let scrollTop;

    const onMouseDown = (e) => {
      isDown = true;
      el.classList.add('cursor-grabbing');
      el.classList.remove('cursor-pointer');
      startY = e.pageY - el.offsetTop;
      scrollTop = el.scrollTop;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
      // Revert to default cursor if needed, though usually handled by CSS
    };

    const onMouseUp = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - el.offsetTop;
      const walk = (y - startY) * 2; // Scroll speed multiplier
      el.scrollTop = scrollTop - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return ref;
}

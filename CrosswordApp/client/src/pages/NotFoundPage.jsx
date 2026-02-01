import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Container } from "../components/Container";

function NotFoundPage() {
  return (
    <Container>
      <div className="py-16">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.6 }}
          className="mx-auto max-w-2xl text-center [perspective:1200px]"
        >
          <div className="card-3d surface rounded-[36px] p-12">
            <div className="mx-auto h-12 w-12 rounded-3xl bg-slate-900" />
            <div className="mt-6 font-display text-6xl font-semibold tracking-tight text-slate-900">404</div>
            <h1 className="mt-3 text-xl font-semibold text-slate-900">Page not found</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
    </Container>
  );
}

export default NotFoundPage;

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link to="/login" className="brand-logo" aria-label="Proofroom home">
          <span className="brand-check">✓</span><span>proofroom</span>
        </Link>
        <a className="muted-link" href="mailto:support@proofroom.co">Need a hand? Contact us <ArrowUpRight size={13} /></a>
      </header>
      <div className="auth-content">{children}</div>
      <footer className="auth-footer">
        <span>Clarity before content leaves the room.</span>
        <div><span>© 2026 Proofroom</span><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
      </footer>
    </main>
  );
}

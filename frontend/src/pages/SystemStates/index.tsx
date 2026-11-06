import { ArrowLeft, FileSearch, ShieldOff } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../AuthLayout";
import "../account.css";

export function NotFound() {
  return <AuthLayout><section className="not-found-state"><FileSearch className="not-found-illustration" size={78} strokeWidth={1.1}/><p className="error-code">404</p><h1>This page couldn’t be found.</h1><p>The link may have changed or the page may no longer exist. Let’s get you<br className="desktop-break"/> back to your workspace.</p><Link className="primary-button state-button" to="/dashboard"><ArrowLeft size={15}/> Back to Dashboard</Link></section></AuthLayout>;
}

export function AccessDenied() {
  return <AuthLayout><section className="account-card denied-card"><div className="account-icon gold-icon"><ShieldOff size={21}/></div><h1>Access denied</h1><p>You don’t have permission to access this page. If you need access, contact your workspace owner.</p><Link className="primary-button full-button" to="/dashboard"><ArrowLeft size={15}/> Back to Dashboard</Link><div className="signed-in-note">Signed in as maya@asterhome.co</div></section></AuthLayout>;
}

import { type FormEvent, useState } from "react";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../AuthLayout";
import { apiRequest } from "../../lib/api";
import "../account.css";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      await apiRequest("/auth/password/forgot", { body: { email } });
      setSent(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setLoading(false); }
  }

  return <AuthLayout><section className="account-card forgot-card">
    {sent ? <>
      <div className="account-icon"><MailCheck size={21} /></div>
      <h1>Check your inbox</h1>
      <p>If an account exists for {email}, you’ll receive a link to reset your password.</p>
      <p className="helper-copy">Didn’t receive the email? Check your spam folder or request a new link.</p>
      <button className="secondary-button full-button" disabled={loading} onClick={async () => {
        setError(""); setLoading(true);
        try { await apiRequest("/auth/password/forgot", { body: { email } }); }
        catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
        finally { setLoading(false); }
      }}>{loading ? "Sending…" : "Resend Reset Link"}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Link className="back-link" to="/login"><ArrowLeft size={15} /> Back to Login</Link>
    </> : <>
      <div className="account-icon gold-icon"><KeyRound size={20} /></div>
      <h1>Forgot your password?</h1>
      <p>Enter your work email and we’ll send you a link to reset your password.</p>
      <form onSubmit={submit} className="account-form">
        <label htmlFor="reset-email">Work email</label>
        <input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button full-button" disabled={loading}>{loading ? "Sending…" : "Send Reset Link"}</button>
      </form>
      <Link className="back-link" to="/login"><ArrowLeft size={15} /> Back to Login</Link>
    </>}</section></AuthLayout>;
}

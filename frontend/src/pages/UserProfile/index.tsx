import { type FormEvent, useState } from "react";
import { Eye, EyeOff, LogOut, Pencil, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";
import { apiRequest } from "../../lib/api";
import "../account.css";

export function UserProfile() {
  const [current, setCurrent] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState(""); const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    if (password.length < 12) { setError("Use at least 12 characters."); return; }
    if (password !== confirm) { setError("Your new passwords don’t match."); return; }
    setLoading(true);
    try { await apiRequest("/auth/password/change", { body: { currentPassword: current, newPassword: password } }); setSuccess("Your password has been updated."); setCurrent(""); setPassword(""); setConfirm(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setLoading(false); }
  }
  return <div className="app-shell"><Sidebar /><div className="app-main"><TopHeader breadcrumb="My profile" /><main className="profile-content">
    <p className="eyebrow">YOUR PROOFROOM ACCOUNT</p><h1>My profile</h1><p className="profile-intro">Your personal details and account security.</p>
    <section className="profile-card profile-summary"><div className="profile-person"><span className="avatar-large">ML</span><div><h2>Maya Lewis</h2><p>Brand manager · Aster</p></div><button className="outline-button edit-profile" type="button" onClick={() => setError("Profile details are managed by your workspace administrator.")}><Pencil size={16}/> Edit Profile</button></div><div className="profile-details"><div><span>Work email</span><strong>maya@asterhome.co</strong></div><div><span>Role</span><strong>Brand manager</strong></div><div><span>Workspace</span><strong>Aster</strong></div></div></section>
    <section className="profile-card password-card"><h2>Change Password</h2><p>Keep your account secure with a strong, unique password.</p><form className="account-form" onSubmit={updatePassword}>
      <label htmlFor="current-password">Current password</label><div className="password-field"><input id="current-password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Enter current password" value={current} onChange={e => setCurrent(e.target.value)} required/><button type="button" aria-label={visible ? "Hide passwords" : "Show passwords"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
      <div className="password-grid"><div><label htmlFor="new-password">New password</label><div className="password-field"><input id="new-password" type={visible ? "text" : "password"} autoComplete="new-password" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} required minLength={12}/></div></div><div><label htmlFor="confirm-password">Confirm new password</label><div className="password-field"><input id="confirm-password" type={visible ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter new password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={12}/></div></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}{success && <p className="form-success" role="status"><CheckCircle2 size={16}/>{success}</p>}
      <div className="password-actions"><span>Use at least 12 characters.</span><button className="primary-button" disabled={loading}>{loading ? "Updating…" : "Update Password"}</button></div>
    </form></section>
    <section className="logout-row"><div><h2>Sign out of Proofroom</h2><p>You’ll need to sign in again to access your workspace.</p></div><button className="outline-button" onClick={() => navigate("/login")}><LogOut size={16}/> Logout</button></section>
  </main></div></div>;
}

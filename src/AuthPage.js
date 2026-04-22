import React, { useState } from 'react';
import './AuthPage.css';
import { ACCOUNTS } from './data';

const DEMO_ACCOUNTS = [
  { label: 'John Doe',   sub: 'Resident · Bldg B Unit 212', email: 'john@buildserve.app',    password: 'resident123', role: 'resident' },
  { label: 'Sara Nguyen',sub: 'Resident · Bldg A Unit 105', email: 'sara@buildserve.app',     password: 'resident123', role: 'resident' },
  { label: 'Mike Green', sub: 'Building Manager',            email: 'manager@buildserve.app', password: 'manager123',  role: 'manager'  },
];

export default function AuthPage({ onLogin }) {
  const [tab,        setTab]        = useState('login');   // 'login' | 'signup'
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [showPw,     setShowPw]     = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw,    setLoginPw]    = useState('');

  // Signup form
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', confirm: '',
    role: 'resident', building: 'Building A', unit: '',
    phone: '',
  });
  const updSignup = (k, v) => setSignupData(p => ({ ...p, [k]: v }));

  const fillDemo = (acc) => {
    setTab('login');
    setLoginEmail(acc.email);
    setLoginPw(acc.password);
    setError('');
  };

  const doLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPw) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const user = ACCOUNTS.find(a =>
        a.email.toLowerCase() === loginEmail.toLowerCase() && a.password === loginPw
      );
      setLoading(false);
      if (!user) {
        setError('Incorrect email or password. Try a demo account below.');
        return;
      }
      onLogin(user);
    }, 900);
  };

  const doSignup = (e) => {
    e.preventDefault();
    setError('');
    const { name, email, password, confirm, role, building, unit, phone } = signupData;
    if (!name.trim())     { setError('Please enter your full name.'); return; }
    if (!email.trim())    { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    if (role === 'resident' && !unit.trim()) { setError('Please enter your unit number.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser = {
        id: 'u_' + Date.now(),
        role,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        unit: unit.trim() || null,
        building,
        avatar: name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2),
        phone: phone.trim() || '',
        moveIn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };
      setSuccess(`Account created! Welcome to BuildServe, ${name.split(' ')[0]}.`);
      setTimeout(() => onLogin(newUser), 1000);
    }, 1100);
  };

  return (
    <div className="auth-shell">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-grid" />

        <div className="auth-left-content">
          {/* LOGO */}
          <div className="al-logo">
            <div className="al-logomark">BS</div>
            <div>
              <div className="al-logoname">BuildServe</div>
              <div className="al-logosub">MAINTENANCE PORTAL</div>
            </div>
          </div>

          {/* HEADLINE */}
          <div className="al-headline">
            <div className="al-headline-tag">
              <span className="al-headline-tag-dot" />
              Now Live — BuildServe v3
            </div>
            <h1 className="al-h1">
              Maintenance<br/>
              <em>made simple.</em><br/>
              For everyone.
            </h1>
            <p className="al-p">
              Report issues, track requests in real time, and get notified the moment
              something changes — all in one place for residents and building managers.
            </p>
          </div>

          {/* FEATURES */}
          <div className="al-features">
            {[
              { icon: '⚡', cls: 'fi-orange', title: 'Instant Confirmation',   desc: 'Request ID and ETA the moment you submit — no more "did it go through?"' },
              { icon: '📍', cls: 'fi-blue',   title: 'Real-Time Tracking',     desc: 'Live status updates from Pending → Assigned → In Progress → Resolved.' },
              { icon: '✓',  cls: 'fi-green',  title: 'Verified Resolution',    desc: 'Resident confirms the fix is real before the request is closed.' },
            ].map((f, i) => (
              <div key={i} className="al-feature">
                <div className={`al-feature-icon ${f.cls}`}>{f.icon}</div>
                <div>
                  <div className="al-feature-title">{f.title}</div>
                  <div className="al-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="al-bottom">
          <div className="al-quote">
            "I emailed them 4 days ago about the leak. I have no idea if anyone even read it."
            <cite className="al-quote-cite">— Resident interview, the problem BuildServe solves</cite>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form-box">

          {/* TABS */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab==='login'?'active':''}`}  onClick={()=>{setTab('login');setError('');setSuccess('');}}>Sign In</button>
            <button className={`auth-tab ${tab==='signup'?'active':''}`} onClick={()=>{setTab('signup');setError('');setSuccess('');}}>Create Account</button>
          </div>

          {/* ── LOGIN ── */}
          {tab === 'login' && (<>
            <div className="auth-form-title">Welcome back</div>
            <div className="auth-form-sub">Sign in to your BuildServe account to continue.</div>

            {/* DEMO ACCOUNTS */}
            <div className="auth-demo-hint">
              <div className="auth-demo-hint-title">✦ Demo Accounts — click to fill</div>
              <div className="auth-demo-accounts">
                {DEMO_ACCOUNTS.map((a, i) => (
                  <div key={i} className="auth-demo-account" onClick={() => fillDemo(a)}>
                    <div>
                      <div className="auth-demo-account-name">{a.label}</div>
                      <div className="auth-demo-account-role">{a.sub}</div>
                    </div>
                    <span className="auth-demo-use-btn">Use →</span>
                  </div>
                ))}
              </div>
            </div>

            {error   && <div className="auth-error">⚠ {error}</div>}
            {success && <div className="auth-success-flash">✓ {success}</div>}

            <form onSubmit={doLogin}>
              <div className="auth-fields">
                <div className="auth-field">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉</span>
                    <input className="auth-input" type="email" placeholder="you@email.com"
                      value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email"/>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input className={`auth-input`} type={showPw ? 'text' : 'password'} placeholder="Enter your password"
                      value={loginPw} onChange={e => setLoginPw(e.target.value)} autoComplete="current-password"
                      style={{paddingRight: 44}}/>
                    <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(p => !p)}>
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <><span className="auth-spinner"/>Signing in…</> : 'Sign In →'}
              </button>
            </form>

            <div className="auth-switch">
              Don't have an account?
              <button onClick={() => { setTab('signup'); setError(''); }}>Create one</button>
            </div>
          </>)}

          {/* ── SIGNUP ── */}
          {tab === 'signup' && (<>
            <div className="auth-form-title">Create your account</div>
            <div className="auth-form-sub">Join BuildServe as a resident or building manager.</div>

            {error   && <div className="auth-error">⚠ {error}</div>}
            {success && <div className="auth-success-flash">✓ {success}</div>}

            <form onSubmit={doSignup}>
              <div className="auth-fields">

                {/* NAME */}
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">👤</span>
                    <input className="auth-input" type="text" placeholder="John Doe"
                      value={signupData.name} onChange={e => updSignup('name', e.target.value)} autoComplete="name"/>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="auth-field">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉</span>
                    <input className="auth-input" type="email" placeholder="you@email.com"
                      value={signupData.email} onChange={e => updSignup('email', e.target.value)} autoComplete="email"/>
                  </div>
                </div>

                {/* ROLE */}
                <div className="auth-field">
                  <label className="auth-label">I am a…</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🏢</span>
                    <select className="auth-select" value={signupData.role} onChange={e => updSignup('role', e.target.value)}>
                      <option value="resident">Resident / Tenant</option>
                      <option value="manager">Building Manager</option>
                    </select>
                  </div>
                </div>

                {/* BUILDING + UNIT (resident only) */}
                {signupData.role === 'resident' && (
                  <div className="auth-row-2">
                    <div className="auth-field">
                      <label className="auth-label">Building</label>
                      <div className="auth-input-wrap">
                        <span className="auth-input-icon">🏢</span>
                        <select className="auth-select" value={signupData.building} onChange={e => updSignup('building', e.target.value)}>
                          <option>Building A</option>
                          <option>Building B</option>
                          <option>Building C</option>
                        </select>
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Unit Number</label>
                      <div className="auth-input-wrap">
                        <span className="auth-input-icon">🚪</span>
                        <input className="auth-input" type="text" placeholder="e.g. 212"
                          value={signupData.unit} onChange={e => updSignup('unit', e.target.value)}/>
                      </div>
                    </div>
                  </div>
                )}

                {/* PHONE */}
                <div className="auth-field">
                  <label className="auth-label">Phone <span style={{fontWeight:400,textTransform:'none',fontSize:10,color:'var(--navy-400)',marginLeft:4}}>(optional)</span></label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">📱</span>
                    <input className="auth-input" type="tel" placeholder="+1 (555) 000-0000"
                      value={signupData.phone} onChange={e => updSignup('phone', e.target.value)}/>
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="auth-row-2">
                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters"
                        value={signupData.password} onChange={e => updSignup('password', e.target.value)} autoComplete="new-password"/>
                    </div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Confirm</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="Repeat password"
                        value={signupData.confirm} onChange={e => updSignup('confirm', e.target.value)} autoComplete="new-password"/>
                    </div>
                  </div>
                </div>

                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="checkbox" id="showpw" checked={showPw} onChange={() => setShowPw(p=>!p)} style={{accentColor:'var(--orange)'}}/>
                  <label htmlFor="showpw" style={{fontSize:12.5,color:'var(--navy-500)',cursor:'pointer'}}>Show passwords</label>
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <><span className="auth-spinner"/>Creating account…</> : 'Create Account →'}
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?
              <button onClick={() => { setTab('login'); setError(''); }}>Sign in</button>
            </div>
          </>)}

        </div>

        <div className="auth-footer">
          BuildServe · CS 422 UI Class Project · Kirtan · Rudra · Nisarg · Mithil · Mohamed
        </div>
      </div>
    </div>
  );
}

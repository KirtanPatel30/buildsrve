import React, { useState } from 'react';
import './ResidentOther.css';

export function ResidentNotifications({ navigate, notifications = [], dismissNotif, markAllRead, currentUser }) {
  const userId = currentUser?.id;
  const items  = notifications.filter(n => n.userId === userId);
  const unread = items.filter(i => i.unread).length;

  return (<>
    <div className="topbar">
      <div className="tb-title">Notifications</div>
      {unread > 0 && (
        <button className="btn btn-ghost btn-sm" onClick={() => markAllRead && markAllRead(userId)}>
          Mark all read
        </button>
      )}
      <button className="tb-cta" onClick={() => navigate('report')}>+ Report Issue</button>
    </div>
    <div className="page">
      <div className="other-wrap">
        {unread > 0 && (
          <div className="other-unread-banner a0">
            🔔 You have <strong>{unread} unread</strong> notification{unread > 1 ? 's' : ''}
          </div>
        )}
        <div className="card other-notif-list a1">
          {items.length === 0 && (
            <div className="other-empty">
              <div style={{fontSize:40,marginBottom:12}}>🔔</div>
              <div style={{fontWeight:600,marginBottom:6}}>All caught up!</div>
              <div style={{fontSize:13,color:'var(--navy-400)'}}>
                You will get notified here when your request status changes.
              </div>
            </div>
          )}
          {items.map(n => (
            <div key={n.id} className={`other-notif-row ${n.unread ? 'unread' : ''}`}>
              <div className={`other-notif-icon type-${n.type}`}>{n.icon}</div>
              <div className="other-notif-body">
                <div className="other-notif-title-row">
                  <span className="other-notif-title">{n.title}</span>
                  <span className="text-mono text-xs text-muted">{n.time}</span>
                </div>
                <div className="other-notif-text">{n.body}</div>
              </div>
              {n.unread && <div className="other-unread-dot"/>}
              <button
                className="btn btn-ghost"
                style={{padding:'4px 8px',fontSize:12}}
                onClick={() => dismissNotif && dismissNotif(n.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>);
}

export default ResidentNotifications;

export function ResidentProfile({ currentUser, myRequests = [], updateAccount }) {
  const [editing, setEditing]   = useState(false);
  const [phone,   setPhone]     = useState(currentUser?.phone || '');
  const [name,    setName]      = useState(currentUser?.name  || '');
  const [saved,   setSaved]     = useState(false);
  const [toggles, setToggles]   = useState({push:true,email:false,updates:true});
  const tog = k => setToggles(t => ({...t,[k]:!t[k]}));

  const u = currentUser || {};
  const total    = myRequests.length;
  const active   = myRequests.filter(r => r.status !== 'Resolved').length;
  const resolved = myRequests.filter(r => r.status === 'Resolved').length;
  const avgRating = myRequests.filter(r => r.rating > 0).length > 0
    ? (myRequests.reduce((s,r) => s+(r.rating||0), 0) / myRequests.filter(r => r.rating > 0).length).toFixed(1)
    : '—';

  const handleSave = () => {
    if (updateAccount) {
      updateAccount(u.id, {
        name:  name.trim()  || u.name,
        phone: phone.trim() || u.phone,
        avatar: (name.trim() || u.name).split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
      });
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (<>
    <div className="topbar"><div className="tb-title">Profile & Settings</div></div>
    <div className="page">
      <div className="other-wrap">

        {/* HERO */}
        <div className="card profile-hero a0">
          <div className="profile-av resident">{u.avatar||'?'}</div>
          <div className="profile-info">
            <div className="profile-name">{u.name||'Resident'}</div>
            <div className="profile-tags">
              <span className="profile-tag">{u.building||'Building'}</span>
              {u.unit && <span className="profile-tag">{u.unit}</span>}
              <span className="profile-tag profile-tag-green">Active Resident</span>
            </div>
            <div className="text-xs text-muted" style={{marginTop:4}}>Member since {u.moveIn||'Recently'}</div>
          </div>
          {!editing
            ? <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(true); setSaved(false); }}>✏ Edit Profile</button>
            : <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          }
        </div>

        {saved && (
          <div className="profile-saved-banner a0b">
            ✓ Profile updated successfully!
          </div>
        )}

        {/* EDIT FORM */}
        {editing && (
          <div className="card profile-edit-form a0c">
            <div className="profile-edit-title">Edit Your Information</div>
            <div className="field" style={{marginBottom:14}}>
              <label className="field-label">Full Name</label>
              <input
                className="field-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="field" style={{marginBottom:14}}>
              <label className="field-label">Phone Number</label>
              <input
                className="field-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div style={{display:'flex',gap:10,marginTop:4}}>
              <button className="btn btn-primary" style={{flex:1}} onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn btn-ghost" style={{flex:1}} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="profile-stats a1">
          {[
            {val:total,    label:'Total',      color:'var(--orange)'},
            {val:active,   label:'Active',     color:'var(--blue)'},
            {val:resolved, label:'Resolved',   color:'var(--green)'},
            {val:avgRating==='—'?'—':avgRating+'★', label:'Avg Rating', color:'var(--amber)'}
          ].map((s,i)=>(
            <div key={i} className="card profile-stat">
              <div className="profile-stat-val" style={{color:s.color}}>{s.val}</div>
              <div className="profile-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="profile-2col">
          <div className="a2">
            <div className="other-section-label">Account Information</div>
            <div className="card" style={{overflow:'hidden'}}>
              {[
                {icon:'🏢',label:'Building',     val:u.building||'—'},
                {icon:'🚪',label:'Unit',         val:u.unit||'—'},
                {icon:'📧',label:'Email',        val:u.email||'—'},
                {icon:'📱',label:'Phone',        val:u.phone||'Not provided'},
                {icon:'📅',label:'Move-in Date', val:u.moveIn||'—'},
              ].map((r,i)=>(
                <div key={i} className="profile-row">
                  <span className="profile-row-icon">{r.icon}</span>
                  <div>
                    <div className="profile-row-label">{r.label}</div>
                    <div className="profile-row-val">{r.val}</div>
                  </div>
                  {(r.label==='Phone'||r.label==='Full Name') && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{marginLeft:'auto',fontSize:11}}
                      onClick={() => setEditing(true)}>
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="a3">
            <div className="other-section-label">Preferences</div>
            <div className="card" style={{overflow:'hidden'}}>
              {[
                {k:'push',   icon:'🔔',label:'Push Notifications',  desc:'Status update alerts'},
                {k:'email',  icon:'📩',label:'Email Updates',        desc:'Receive updates via email'},
                {k:'updates',icon:'🏢',label:'Building Alerts',      desc:'Community-wide notices'},
              ].map(t=>(
                <div key={t.k} className="profile-row">
                  <span className="profile-row-icon">{t.icon}</span>
                  <div>
                    <div className="profile-row-label">{t.label}</div>
                    <div className="profile-row-desc">{t.desc}</div>
                  </div>
                  <button className={`profile-toggle ${toggles[t.k]?'on':''}`} onClick={()=>tog(t.k)} style={{marginLeft:'auto'}}>
                    <div className="profile-toggle-thumb"/>
                  </button>
                </div>
              ))}
            </div>

            <div className="other-section-label" style={{marginTop:18}}>Support</div>
            <div className="card" style={{overflow:'hidden'}}>
              {['❓ Help & FAQ','💬 Contact Support','📄 Terms of Service','🔒 Privacy Policy'].map((item,i)=>(
                <div key={i} className="profile-row profile-row-link">
                  <span className="profile-row-icon">{item.slice(0,2)}</span>
                  <span className="profile-row-label">{item.slice(3)}</span>
                  <span className="profile-row-arrow ml-auto">›</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  </>);
}

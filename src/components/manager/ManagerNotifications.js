import React, { useState } from 'react';
import '../resident/ResidentOther.css';
import './ManagerOther.css';

export function ManagerNotifications({ navigate, allNotifications = [], dismissNotif, markAllRead, currentUser, requests = [] }) {
  // Manager sees ALL notifications (all residents) plus urgent system alerts
  const urgentUnassigned = requests.filter(r => r.status === 'Pending Review' && !r.workerAssigned);
  const systemAlerts = urgentUnassigned.map(r => ({
    id: 'sys_' + r.id, icon: '🚨', type: 'red', unread: true,
    title: `Urgent: Request #${r.id} Needs Assignment`,
    body: `${r.residentName} (${r.residentUnit}) reported ${r.type}. No worker assigned yet.`,
    time: r.date,
  }));
  const allItems = [...systemAlerts, ...allNotifications];
  const unread = allItems.filter(i => i.unread).length;
  const userId = currentUser?.id;

  return (<>
    <div className="topbar">
      <div className="tb-title">Notifications</div>
      {unread>0&&<button className="btn btn-ghost btn-sm" onClick={()=>markAllRead&&markAllRead(userId)}>Mark all read</button>}
    </div>
    <div className="page">
      <div className="other-wrap">
        {unread>0&&<div className="other-unread-banner a0">🔔 You have <strong>{unread} unread</strong> notification{unread>1?'s':''}</div>}
        <div className="card other-notif-list a1">
          {allItems.length===0&&(
            <div className="other-empty">
              <div style={{fontSize:40,marginBottom:12}}>🔔</div>
              <div style={{fontWeight:600,marginBottom:6}}>All caught up!</div>
              <div style={{fontSize:13,color:'var(--navy-400)'}}>No new activity across all buildings.</div>
            </div>
          )}
          {allItems.map(n=>(
            <div key={n.id} className={`other-notif-row ${n.unread?'unread':''}`}>
              <div className={`other-notif-icon type-${n.type}`}>{n.icon}</div>
              <div className="other-notif-body">
                <div className="other-notif-title-row">
                  <span className="other-notif-title">{n.title}</span>
                  <span className="text-mono text-xs text-muted">{n.time}</span>
                </div>
                <div className="other-notif-text">{n.body}</div>
              </div>
              {n.unread&&<div className="other-unread-dot"/>}
              {!String(n.id).startsWith('sys_')&&(
                <button className="btn btn-ghost" style={{padding:'4px 8px',fontSize:12}} onClick={()=>dismissNotif&&dismissNotif(n.id)}>✕</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </>);
}

export default ManagerNotifications;

export function ManagerSettings({ currentUser }) {
  const u = currentUser || {};
  const [toggles, setToggles] = useState({urgent:true,newReq:true,resolved:true,community:false});
  const tog = k => setToggles(t=>({...t,[k]:!t[k]}));

  return (<>
    <div className="topbar"><div className="tb-title">Settings</div></div>
    <div className="page">
      <div className="other-wrap">
        {/* MANAGER PROFILE */}
        <div className="card profile-hero a0">
          <div className="profile-av manager">{u.avatar||'MG'}</div>
          <div className="profile-info">
            <div className="profile-name">{u.name||'Manager'}</div>
            <div className="profile-tags">
              <span className="profile-tag">Building Manager</span>
              <span className="profile-tag profile-tag-green">Active</span>
            </div>
            <div className="text-xs text-muted" style={{marginTop:4}}>{u.building||'Building Manager'}</div>
          </div>
          <button className="btn btn-secondary btn-sm">Edit Profile</button>
        </div>

        {/* BUILDING OVERVIEW */}
        <div className="a1">
          <div className="other-section-label">Buildings Under Management</div>
          <div className="card" style={{overflow:'hidden',marginBottom:20}}>
            {[
              {icon:'🏢',name:'Building A',units:24,note:'12 active residents'},
              {icon:'🏢',name:'Building B',units:18,note:'9 active residents'},
              {icon:'🏢',name:'Building C',units:30,note:'22 active residents'},
            ].map((b,i)=>(
              <div key={i} className="profile-row profile-row-link">
                <span className="profile-row-icon">{b.icon}</span>
                <div>
                  <div className="profile-row-label">{b.name}</div>
                  <div className="profile-row-desc">{b.units} units · {b.note}</div>
                </div>
                <span className="profile-row-arrow ml-auto">›</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-2col">
          <div className="a2">
            <div className="other-section-label">Notification Settings</div>
            <div className="card" style={{overflow:'hidden'}}>
              {[
                {k:'urgent', icon:'🚨',label:'Urgent Request Alerts',  desc:'Immediate alert for urgent requests'},
                {k:'newReq', icon:'＋',label:'New Request Alerts',     desc:'Alert when a resident submits a request'},
                {k:'resolved',icon:'✓',label:'Resolution Confirmations',desc:'Alert when resident verifies issue fixed'},
                {k:'community',icon:'⚠',label:'Community Alerts',     desc:'Building-wide pattern notifications'},
              ].map(t=>(
                <div key={t.k} className="profile-row">
                  <span className="profile-row-icon">{t.icon}</span>
                  <div><div className="profile-row-label">{t.label}</div><div className="profile-row-desc">{t.desc}</div></div>
                  <button className={`profile-toggle ${toggles[t.k]?'on':''}`} onClick={()=>tog(t.k)} style={{marginLeft:'auto'}}>
                    <div className="profile-toggle-thumb"/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="a3">
            <div className="other-section-label">System Settings</div>
            <div className="card" style={{overflow:'hidden'}}>
              {[
                {icon:'⏱',label:'Default Response SLA',    val:'24 hours'},
                {icon:'🔔',label:'Escalation After',        val:'48 hours'},
                {icon:'📊',label:'Report Period',           val:'Monthly'},
              ].map((r,i)=>(
                <div key={i} className="profile-row profile-row-link">
                  <span className="profile-row-icon">{r.icon}</span>
                  <div><div className="profile-row-label">{r.label}</div></div>
                  <div className="ml-auto" style={{display:'flex',alignItems:'center',gap:6}}>
                    <span className="text-mono text-xs" style={{color:'var(--navy-600)',fontWeight:600}}>{r.val}</span>
                    <span className="profile-row-arrow">›</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="other-section-label" style={{marginTop:18}}>Data & Reports</div>
            <div className="card" style={{overflow:'hidden'}}>
              {['📥 Export Request History','📊 Generate Monthly Report','🗑 Clear Resolved Requests'].map((item,i)=>(
                <div key={i} className="profile-row profile-row-link">
                  <span className="profile-row-icon">{item.slice(0,2)}</span>
                  <span className="profile-row-label">{item.slice(3)}</span>
                  <span className="profile-row-arrow ml-auto">›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="profile-shallow-note a4">ℹ Settings editing is a placeholder — not implemented in this prototype.</div>
      </div>
    </div>
  </>);
}

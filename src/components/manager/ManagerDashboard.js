import React from 'react';
import './ManagerDashboard.css';
import { ICON_MAP, statusClass, priorityClass, WORKERS } from '../../data';

export default function ManagerDashboard({ requests, navigate, openReq }) {
  const total    = requests.length;
  const pending  = requests.filter(r=>r.status==='Pending Review').length;
  const progress = requests.filter(r=>r.status==='In Progress').length;
  const resolved = requests.filter(r=>r.status==='Resolved').length;
  const urgent   = requests.filter(r=>r.priority==='Urgent'&&r.status!=='Resolved').length;

  const unassigned = requests.filter(r=>r.status==='Pending Review');
  const inProgress = requests.filter(r=>r.status==='In Progress');

  return (<>
    <div className="topbar">
      <div className="tb-title">Manager Dashboard</div>
      <div className="tb-search"><span className="tb-search-icon">⌕</span><input placeholder="Search all requests…"/></div>
      <button className="tb-icon-btn" onClick={()=>navigate('notifications')}>🔔<span className="tb-notif-dot"/></button>
      <button className="tb-cta" onClick={()=>navigate('allRequests')}>View All Requests</button>
    </div>
    <div className="page">

      {/* BANNER */}
      {urgent>0&&(
        <div className="mgr-urgent-banner a0">
          <div className="mub-bar"/>
          <span className="mub-icon">🚨</span>
          <div className="mub-text"><strong>{urgent} urgent request{urgent>1?'s':''}</strong> require immediate attention</div>
          <button className="btn btn-primary btn-sm" onClick={()=>navigate('allRequests')}>Review Now →</button>
        </div>
      )}

      {/* STATS */}
      <div className="mgr-stats a1">
        {[
          {label:'Total Requests', val:total,    icon:'◫', accent:'slate', sub:'All time'},
          {label:'Pending Review', val:pending,  icon:'◎', accent:'amber', sub:'Awaiting assignment'},
          {label:'In Progress',    val:progress, icon:'⚡', accent:'blue',  sub:'Being worked on'},
          {label:'Resolved',       val:resolved, icon:'✓', accent:'green', sub:'Completed'},
          {label:'Urgent',         val:urgent,   icon:'▲', accent:'red',   sub:'Need immediate action'},
        ].map((s,i)=>(
          <div key={i} className={`mgr-stat-card accent-${s.accent}`}>
            <div className="msc-top">
              <span className="msc-label">{s.label}</span>
              <div className={`msc-icon accent-${s.accent}`}>{s.icon}</div>
            </div>
            <div className="msc-val">{s.val}</div>
            <div className="msc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mgr-grid">
        {/* LEFT — UNASSIGNED QUEUE */}
        <div>
          <div className="card a2">
            <div className="card-header">
              <span className="card-title">⚡ Pending Assignment</span>
              <span className="chip chip-pending"><span className="chip-dot"/>{pending} waiting</span>
            </div>
            {unassigned.length===0?(
              <div className="mgr-empty">✓ All requests assigned!</div>
            ):(
              <table className="tbl">
                <thead><tr><th>ID</th><th>Type</th><th>Resident</th><th>Location</th><th>Priority</th><th>Date</th><th/></tr></thead>
                <tbody>
                  {unassigned.map(r=>(
                    <tr key={r.id} className="tbl-row clickable" onClick={()=>openReq(r)}>
                      <td><span className="text-mono text-xs text-muted">#{r.id}</span></td>
                      <td><div className="flex items-center gap-2"><span>{ICON_MAP[r.type]||'🔧'}</span><span style={{fontWeight:600,fontSize:12.5}}>{r.type}</span></div></td>
                      <td><span style={{fontSize:12.5}}>{r.residentName}</span></td>
                      <td><span className="text-sm text-muted" style={{maxWidth:160,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.location}</span></td>
                      <td><span className={`chip chip-${priorityClass(r.priority)}`}><span className="chip-dot"/>{r.priority}</span></td>
                      <td><span className="text-mono text-xs text-muted">{r.date}</span></td>
                      <td><span className="row-arrow">→</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* IN PROGRESS TABLE */}
          <div className="card a3" style={{marginTop:18}}>
            <div className="card-header">
              <span className="card-title">🔧 In Progress</span>
              <span className="chip chip-progress"><span className="chip-dot"/>{progress} active</span>
            </div>
            {inProgress.length===0?(
              <div className="mgr-empty">No requests currently in progress.</div>
            ):(
              <table className="tbl">
                <thead><tr><th>ID</th><th>Type</th><th>Resident</th><th>Worker</th><th>Priority</th><th/></tr></thead>
                <tbody>
                  {inProgress.map(r=>{
                    const w = WORKERS.find(w=>w.id===r.workerAssigned);
                    return (
                      <tr key={r.id} className="tbl-row clickable" onClick={()=>openReq(r)}>
                        <td><span className="text-mono text-xs text-muted">#{r.id}</span></td>
                        <td><div className="flex items-center gap-2"><span>{ICON_MAP[r.type]||'🔧'}</span><span style={{fontWeight:600,fontSize:12.5}}>{r.type}</span></div></td>
                        <td><span style={{fontSize:12.5}}>{r.residentName}</span></td>
                        <td>
                          {w?(
                            <div className="flex items-center gap-2">
                              <div className="mgr-worker-av">{w.avatar}</div>
                              <span style={{fontSize:12}}>{w.name}</span>
                            </div>
                          ):<span className="text-muted text-xs">Unassigned</span>}
                        </td>
                        <td><span className={`chip chip-${priorityClass(r.priority)}`}><span className="chip-dot"/>{r.priority}</span></td>
                        <td><span className="row-arrow">→</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="mgr-right">
          {/* WORKER STATUS */}
          <div className="card a4">
            <div className="card-header">
              <span className="card-title">Worker Status</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>navigate('workers')}>Manage →</button>
            </div>
            <div className="mgr-workers-list">
              {WORKERS.map(w=>{
                const assigned = requests.filter(r=>r.workerAssigned===w.id&&r.status!=='Resolved');
                return (
                  <div key={w.id} className="mgr-worker-row">
                    <div className="mgr-worker-av-lg">{w.avatar}</div>
                    <div style={{flex:1}}>
                      <div className="mgr-worker-name">{w.name}</div>
                      <div className="text-xs text-muted">{w.role}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="text-mono text-xs" style={{fontWeight:600,color:assigned.length>0?'var(--blue)':'var(--green)'}}>{assigned.length} active</div>
                      <div className={`mgr-worker-status ${assigned.length>0?'busy':'free'}`}>{assigned.length>0?'Busy':'Available'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ISSUE TYPE BREAKDOWN */}
          <div className="card a5">
            <div className="card-header"><span className="card-title">Issues by Type</span></div>
            <div className="mgr-type-list">
              {['Plumbing','Electrical','HVAC / Heating','Doors / Windows','General / Other'].map(type=>{
                const count = requests.filter(r=>r.type===type).length;
                return count>0?(
                  <div key={type} className="mgr-type-row">
                    <span>{ICON_MAP[type]}</span>
                    <span className="mgr-type-label">{type}</span>
                    <div className="mgr-type-bar-bg">
                      <div className="mgr-type-bar-fill" style={{width:`${(count/total)*100}%`}}/>
                    </div>
                    <span className="text-mono text-xs" style={{minWidth:16,textAlign:'right'}}>{count}</span>
                  </div>
                ):null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

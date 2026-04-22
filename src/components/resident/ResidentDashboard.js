import React from 'react';
import './ResidentDashboard.css';
import { ICON_MAP, statusClass, priorityClass } from '../../data';

export default function ResidentDashboard({ myRequests, navigate, openReq, currentUser }) {
  const u = currentUser || {};
  const total    = myRequests.length;
  const active   = myRequests.filter(r=>r.status!=='Resolved').length;
  const resolved = myRequests.filter(r=>r.status==='Resolved').length;
  const urgent   = myRequests.filter(r=>r.priority==='Urgent'&&r.status!=='Resolved').length;
  const recent   = myRequests.slice(0,4);

  const STATS = [
    {label:'Total Requests', val:total,    icon:'◫',  accent:'slate', trend:'All time'},
    {label:'Active',         val:active,   icon:'◎',  accent:'amber', trend:`${urgent} urgent`},
    {label:'Resolved',       val:resolved, icon:'✓',  accent:'green', trend:'Closed'},
    {label:'Est. Response',  val:'24h',    icon:'⏱',  accent:'blue',  trend:'Average'},
  ];

  return (<>
    <div className="topbar">
      <div className="tb-title">Dashboard</div>
      <div className="tb-search"><span className="tb-search-icon">⌕</span><input placeholder="Search…"/></div>
      <button className="tb-icon-btn" onClick={()=>navigate('notifications')}>🔔<span className="tb-notif-dot"/></button>
      <button className="tb-cta" onClick={()=>navigate('report')}>+ Report Issue</button>
    </div>
    <div className="page">

      {/* COMMUNITY ALERT */}
      <div className="res-alert a0">
        <div className="res-alert-bar"/>
        <span className="res-alert-icon">⚠️</span>
        <div className="res-alert-body">
          <strong>Community Alert:</strong> 2 residents in your building recently reported plumbing issues. Management has been notified.
        </div>
        <button className="btn btn-ghost btn-sm">Dismiss</button>
      </div>

      {/* STAT CARDS */}
      <div className="res-stats a1">
        {STATS.map((s,i)=>(
          <div key={i} className={`res-stat-card accent-${s.accent}`}>
            <div className="rsc-top">
              <span className="rsc-label">{s.label}</span>
              <div className={`rsc-icon accent-${s.accent}`}>{s.icon}</div>
            </div>
            <div className="rsc-val">{s.val}</div>
            <div className="rsc-trend">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="res-grid">
        {/* RECENT TABLE */}
        <div className="card a2">
          <div className="card-header">
            <span className="card-title">Recent Requests</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>navigate('myRequests')}>View all →</button>
          </div>
          {recent.length===0 ? (
            <div className="res-empty">
              <div style={{fontSize:36,marginBottom:10}}>◫</div>
              <div>No requests yet.</div>
              <button className="btn btn-primary btn-sm" style={{marginTop:12}} onClick={()=>navigate('report')}>Submit your first request</button>
            </div>
          ):(
            <table className="tbl">
              <thead><tr>
                <th>ID</th><th>Type</th><th>Location</th><th>Priority</th><th>Status</th><th>Date</th><th/>
              </tr></thead>
              <tbody>
                {recent.map(r=>(
                  <tr key={r.id} className="tbl-row clickable" onClick={()=>openReq(r)}>
                    <td><span className="text-mono text-muted text-sm">#{r.id}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{ICON_MAP[r.type]||'🔧'}</span>
                        <span style={{fontWeight:600,fontSize:13}}>{r.type}</span>
                      </div>
                    </td>
                    <td><span className="text-sm text-muted" style={{maxWidth:180,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.location}</span></td>
                    <td><span className={`chip chip-${priorityClass(r.priority)}`}><span className="chip-dot"/>{r.priority}</span></td>
                    <td><span className={`chip chip-${statusClass(r.status)}`}><span className="chip-dot"/>{r.status}</span></td>
                    <td><span className="text-mono text-xs text-muted">{r.date}</span></td>
                    <td><span className="row-arrow">→</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT COL */}
        <div className="res-right">
          {/* QUICK REPORT */}
          <button className="card res-quick-btn a3" onClick={()=>navigate('report')}>
            <div className="rqb-icon">＋</div>
            <div className="rqb-text">
              <div className="rqb-title">Report New Issue</div>
              <div className="rqb-sub">Plumbing · Electrical · HVAC · More</div>
            </div>
            <span className="rqb-arrow">→</span>
          </button>

          {/* STATUS BREAKDOWN */}
          <div className="card a4">
            <div className="card-header"><span className="card-title">Status Overview</span></div>
            <div className="res-breakdown">
              {[
                {label:'Pending Review',val:myRequests.filter(r=>r.status==='Pending Review').length,color:'var(--amber)'},
                {label:'In Progress',   val:myRequests.filter(r=>r.status==='In Progress').length,   color:'var(--blue)'},
                {label:'Resolved',      val:myRequests.filter(r=>r.status==='Resolved').length,       color:'var(--green)'},
              ].map((item,i)=>(
                <div key={i} className="res-bd-row">
                  <div className="res-bd-left">
                    <div className="res-bd-dot" style={{background:item.color}}/>
                    <span className="res-bd-label">{item.label}</span>
                  </div>
                  <div className="res-bd-right">
                    <span className="res-bd-count text-mono">{item.val}</span>
                    <div className="res-bd-bar-bg">
                      <div className="res-bd-bar-fill" style={{width:total>0?`${(item.val/total)*100}%`:'0%',background:item.color}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HCI CONCEPTS CARD */}
          <div className="card a5">
            <div className="card-header"><span className="card-title">How BuildServe Helps</span></div>
            <div className="res-hci">
              {[
                {icon:'✓',color:'var(--green)',  title:'Confirmation',     desc:'Instant request ID + status so you know it went through'},
                {icon:'🔔',color:'var(--blue)',  title:'Status Updates',   desc:'Notifications when your request moves to the next stage'},
                {icon:'◫',color:'var(--orange)', title:'One Place',        desc:'All your requests tracked in My Requests — no follow-up calls'},
              ].map((h,i)=>(
                <div key={i} className="res-hci-row">
                  <div className="res-hci-icon" style={{background:`${h.color}15`,color:h.color}}>{h.icon}</div>
                  <div>
                    <div className="res-hci-title">{h.title}</div>
                    <div className="res-hci-desc">{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

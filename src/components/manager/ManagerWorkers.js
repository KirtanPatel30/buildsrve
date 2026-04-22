import React, { useState } from 'react';
import './ManagerWorkers.css';
import { WORKERS } from '../../data';

export default function ManagerWorkers({ requests, navigate }) {
  const [selected, setSelected] = useState(null);

  const getWorkerRequests = (wId) => requests.filter(r => r.workerAssigned === wId);
  const getActive         = (wId) => getWorkerRequests(wId).filter(r => r.status !== 'Resolved');
  const getResolved       = (wId) => getWorkerRequests(wId).filter(r => r.status === 'Resolved');

  return (<>
    <div className="topbar">
      <div className="tb-title">Workers</div>
      <button className="tb-cta">+ Add Worker</button>
    </div>
    <div className="page">
      <div className="mw-grid">
        {/* WORKER CARDS */}
        <div className="mw-cards-col">
          {WORKERS.map((w, i) => {
            const active   = getActive(w.id).length;
            const resolved = getResolved(w.id).length;
            const total    = getWorkerRequests(w.id).length;
            const isBusy   = active > 0;
            return (
              <div key={w.id}
                className={`mw-card card a${i} ${selected?.id===w.id?'active':''}`}
                onClick={()=>setSelected(w)}>
                <div className="mw-card-top">
                  <div className="mw-avatar">{w.avatar}</div>
                  <div className="mw-info">
                    <div className="mw-name">{w.name}</div>
                    <div className="mw-role">{w.role}</div>
                    <div className="mw-phone text-mono text-xs text-muted">📞 {w.phone}</div>
                  </div>
                  <span className={`mw-status-badge ${isBusy?'busy':'free'}`}>
                    {isBusy ? '● Busy' : '● Available'}
                  </span>
                </div>
                <div className="mw-stats-row">
                  <div className="mw-stat">
                    <div className="mw-stat-val" style={{color:'var(--blue)'}}>{active}</div>
                    <div className="mw-stat-label">Active</div>
                  </div>
                  <div className="mw-stat">
                    <div className="mw-stat-val" style={{color:'var(--green)'}}>{resolved}</div>
                    <div className="mw-stat-label">Resolved</div>
                  </div>
                  <div className="mw-stat">
                    <div className="mw-stat-val" style={{color:'var(--navy-600)'}}>{total}</div>
                    <div className="mw-stat-label">Total</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WORKER DETAIL */}
        {selected && (() => {
          const active   = getActive(selected.id);
          const resolved = getResolved(selected.id);
          return (
            <div className="mw-detail card">
              <div className="mw-detail-header">
                <div className="mw-detail-av">{selected.avatar}</div>
                <div>
                  <div className="mw-detail-name">{selected.name}</div>
                  <div className="mw-detail-role">{selected.role}</div>
                  <div className="text-mono text-xs text-muted" style={{marginTop:4}}>📞 {selected.phone}</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}} onClick={()=>setSelected(null)}>✕</button>
              </div>

              <div className="mw-detail-stats">
                {[
                  {val:active.length,   label:'Active Jobs',    color:'var(--blue)'},
                  {val:resolved.length, label:'Resolved',       color:'var(--green)'},
                  {val:getWorkerRequests(selected.id).length, label:'Total', color:'var(--navy-600)'},
                ].map((s,i)=>(
                  <div key={i} className="mw-ds">
                    <div className="mw-ds-val" style={{color:s.color}}>{s.val}</div>
                    <div className="mw-ds-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {active.length > 0 && (
                <>
                  <div className="mw-detail-section-title">Active Assignments</div>
                  <div className="mw-job-list">
                    {active.map(r => (
                      <div key={r.id} className="mw-job-row">
                        <div className="mw-job-left">
                          <span style={{fontSize:18}}>{r.type==='Plumbing'?'💧':r.type==='Electrical'?'⚡':r.type==='HVAC / Heating'?'🌡️':'🔧'}</span>
                          <div>
                            <div style={{fontWeight:600,fontSize:13}}>{r.type}</div>
                            <div className="text-xs text-muted">{r.location}</div>
                          </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                          <span className={`chip chip-${r.priority?.toLowerCase()}`}><span className="chip-dot"/>{r.priority}</span>
                          <span className="text-mono text-xs text-muted">#{r.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {resolved.length > 0 && (
                <>
                  <div className="mw-detail-section-title" style={{marginTop:16}}>Recently Resolved</div>
                  <div className="mw-job-list">
                    {resolved.slice(0,3).map(r => (
                      <div key={r.id} className="mw-job-row mw-job-row-resolved">
                        <div className="mw-job-left">
                          <span style={{fontSize:18}}>{r.type==='Plumbing'?'💧':r.type==='Electrical'?'⚡':'🔧'}</span>
                          <div>
                            <div style={{fontWeight:600,fontSize:13,color:'var(--navy-600)'}}>{r.type}</div>
                            <div className="text-xs text-muted">{r.date}</div>
                          </div>
                        </div>
                        <span className="chip chip-resolved"><span className="chip-dot"/>Resolved</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {active.length === 0 && (
                <div className="mw-available-badge">✓ Available for new assignments</div>
              )}
            </div>
          );
        })()}

        {!selected && (
          <div className="mw-placeholder card">
            <div style={{fontSize:44,marginBottom:14}}>👷</div>
            <div style={{fontFamily:'var(--font-head)',fontSize:16,fontWeight:700,color:'var(--navy-600)',marginBottom:6}}>Select a worker</div>
            <div style={{fontSize:13,color:'var(--navy-400)'}}>Click any worker card to view their assignments and details.</div>
          </div>
        )}
      </div>
    </div>
  </>);
}

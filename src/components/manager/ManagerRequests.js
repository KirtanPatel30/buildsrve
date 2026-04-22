import React, { useState } from 'react';
import './ManagerRequests.css';
import { ICON_MAP, statusClass, priorityClass, WORKERS } from '../../data';

export default function ManagerRequests({ requests, selectedReq, setSelectedReq, assignWorker, resolveRequest, navigate }) {
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');
  const [note,     setNote]     = useState('');
  const [assigning,setAssigning]= useState(false);

  const filters = ['All','Pending Review','In Progress','Resolved'];

  const list = requests
    .filter(r => filter==='All' || r.status===filter)
    .filter(r => !search || r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.residentName.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search));

  const sel = selectedReq;

  const open = (r) => { setSelectedReq(r); setNote(''); setAssigning(false); };

  const doAssign = (workerId) => {
    assignWorker(sel.id, workerId);
    setSelectedReq(prev => ({...prev, workerAssigned: workerId, status:'In Progress'}));
    setAssigning(false);
  };

  const doResolve = () => {
    if (!note.trim()) return;
    resolveRequest(sel.id, note);
    setSelectedReq(prev => ({...prev, status:'Resolved', maintenanceNote: note}));
    setNote('');
  };

  const worker = sel?.workerAssigned ? WORKERS.find(w => w.id===sel.workerAssigned) : null;

  return (<>
    <div className="topbar">
      <div className="tb-title">All Requests</div>
      <div className="tb-search">
        <span className="tb-search-icon">⌕</span>
        <input placeholder="Search by type, location, resident…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
    </div>

    <div style={{display:'flex', height:'calc(100vh - 60px)', overflow:'hidden'}}>

      {/* ── LIST PANEL ── */}
      <div className={`mr-list ${sel ? 'narrow' : ''}`}>
        <div className="mr-filters">
          {filters.map(f => (
            <button key={f} className={`mr-ftab ${filter===f?'on':''}`} onClick={()=>setFilter(f)}>
              {f}
              <span className="mr-ftab-count">
                {f==='All' ? requests.length : requests.filter(r=>r.status===f).length}
              </span>
            </button>
          ))}
        </div>

        <div className="mr-table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th><th>Type</th><th>Resident</th>
                <th>Location</th><th>Priority</th><th>Status</th>
                <th>Worker</th><th>Date</th><th/>
              </tr>
            </thead>
            <tbody>
              {list.map((r,i) => {
                const w = WORKERS.find(w=>w.id===r.workerAssigned);
                return (
                  <tr key={r.id} className={`tbl-row clickable ${sel?.id===r.id?'mr-row-active':''}`} onClick={()=>open(r)}>
                    <td><span className="text-mono text-xs text-muted">#{r.id}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{ICON_MAP[r.type]||'🔧'}</span>
                        <span style={{fontWeight:600,fontSize:12.5,whiteSpace:'nowrap'}}>{r.type}</span>
                      </div>
                    </td>
                    <td>
                      <div className="mr-resident-cell">
                        <div className="mr-resident-av">{r.residentName.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                          <div style={{fontSize:12.5,fontWeight:600}}>{r.residentName}</div>
                          <div className="text-xs text-muted">{r.residentUnit}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-sm text-muted" style={{maxWidth:150,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.location}</span></td>
                    <td><span className={`chip chip-${priorityClass(r.priority)}`}><span className="chip-dot"/>{r.priority}</span></td>
                    <td><span className={`chip chip-${statusClass(r.status)}`}><span className="chip-dot"/>{r.status}</span></td>
                    <td>
                      {w ? (
                        <div className="flex items-center gap-2">
                          <div className="mr-worker-av">{w.avatar}</div>
                          <span style={{fontSize:12}}>{w.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="mr-unassigned-tag">Unassigned</span>
                      )}
                    </td>
                    <td><span className="text-mono text-xs text-muted">{r.date}</span></td>
                    <td><span className="row-arrow">→</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length===0 && (
            <div style={{padding:'48px',textAlign:'center',color:'var(--navy-400)',fontSize:14}}>
              No requests match this filter.
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      {sel && (
        <div className="mr-detail">
          <div className="mr-dh">
            <div>
              <div className="mr-dh-id">Request #{sel.id}</div>
              <div className="text-mono text-xs text-muted" style={{marginTop:3}}>
                {sel.residentName} · {sel.residentUnit} · {sel.date}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setSelectedReq(null)}>✕ Close</button>
          </div>

          <div className="mr-dscroll">
            {/* STATUS ROW */}
            <div className="flex gap-2" style={{marginBottom:20}}>
              <span className={`chip chip-${statusClass(sel.status)}`} style={{padding:'6px 14px',fontSize:12.5}}><span className="chip-dot"/>{sel.status}</span>
              <span className={`chip chip-${priorityClass(sel.priority)}`} style={{padding:'6px 14px',fontSize:12.5}}><span className="chip-dot"/>{sel.priority}</span>
              {sel.photo && <span className="chip" style={{background:'var(--blue-dim)',color:'var(--blue)',border:'1px solid rgba(37,99,235,0.2)',padding:'6px 14px',fontSize:12.5}}>📷 {typeof sel.photo === 'object' ? sel.photo.name : 'Photo Attached'}</span>}
            </div>

            {/* TIMELINE */}
            <div className="mr-section-title">Progress Timeline</div>
            <div className="mr-timeline">
              {sel.timeline.map((t,i) => (
                <div key={i} className={`mr-tl-item ${t.done?'done':''}`}>
                  <div className="mr-tl-dot">{t.done?'✓':i+1}</div>
                  {i < sel.timeline.length-1 && <div className={`mr-tl-line ${t.done && sel.timeline[i+1].done ?'done':''}`}/>}
                  <div className="mr-tl-label">{t.label}</div>
                  {t.time && <div className="mr-tl-time">{t.time}</div>}
                </div>
              ))}
            </div>

            {/* ISSUE INFO */}
            <div className="mr-section-title" style={{marginTop:20}}>Issue Details</div>
            <div className="card" style={{overflow:'hidden',marginBottom:16}}>
              <div className="mr-info-row">
                <span className="mr-info-label">Type</span>
                <span className="mr-info-val flex items-center gap-2"><span>{ICON_MAP[sel.type]}</span><strong>{sel.type}</strong></span>
              </div>
              <div className="mr-info-row">
                <span className="mr-info-label">Location</span>
                <span className="mr-info-val">📍 {sel.location}</span>
              </div>
              <div className="mr-info-row mr-info-row-col">
                <span className="mr-info-label">Description</span>
                <span className="mr-info-val" style={{lineHeight:1.6,color:'var(--navy-700)',marginTop:5}}>{sel.description}</span>
              </div>
              <div className="mr-info-row">
                <span className="mr-info-label">Submitted</span>
                <span className="mr-info-val text-mono text-xs">{sel.date}</span>
              </div>
            </div>

            {/* ASSIGN WORKER */}
            {sel.status === 'Pending Review' && (
              <>
                <div className="mr-section-title">Assign Worker</div>
                <div className="mr-assign-block">
                  {!assigning ? (
                    <button className="btn btn-primary btn-full btn-md" onClick={()=>setAssigning(true)}>
                      👷 Assign a Worker to This Request
                    </button>
                  ) : (
                    <div className="mr-worker-picker">
                      <div className="mr-wp-title">Select a worker to assign</div>
                      {WORKERS.map(w => {
                        const busy = requests.filter(r=>r.workerAssigned===w.id&&r.status!=='Resolved').length;
                        return (
                          <button key={w.id} className="mr-worker-option" onClick={()=>doAssign(w.id)}>
                            <div className="mr-wo-av">{w.avatar}</div>
                            <div style={{flex:1}}>
                              <div className="mr-wo-name">{w.name}</div>
                              <div className="text-xs text-muted">{w.role}</div>
                            </div>
                            <span className={`mr-wo-load ${busy===0?'free':'busy'}`}>
                              {busy===0 ? '✓ Available' : `${busy} active`}
                            </span>
                          </button>
                        );
                      })}
                      <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>setAssigning(false)}>Cancel</button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* CURRENT WORKER */}
            {worker && (
              <>
                <div className="mr-section-title">Assigned Worker</div>
                <div className="card mr-worker-card">
                  <div className="mr-wo-av-lg">{worker.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:'var(--navy-900)'}}>{worker.name}</div>
                    <div className="text-xs text-muted" style={{marginTop:2}}>{worker.role} · 📞 {worker.phone}</div>
                  </div>
                  <span className="chip chip-progress"><span className="chip-dot"/>On Job</span>
                </div>
              </>
            )}

            {/* RESOLVE FORM */}
            {sel.status === 'In Progress' && (
              <>
                <div className="mr-section-title" style={{marginTop:16}}>Mark as Resolved</div>
                <div className="mr-resolve-block">
                  <div className="field">
                    <label className="field-label">Maintenance Note <span style={{color:'var(--red)',marginLeft:2}}>*</span></label>
                    <textarea className="field-input" rows={3}
                      placeholder="Describe what was done to fix the issue. This note will be shown to the resident."
                      value={note} onChange={e=>setNote(e.target.value)}/>
                  </div>
                  <button className="btn btn-green btn-full btn-lg" style={{marginTop:12}}
                    disabled={!note.trim()} onClick={doResolve}>
                    ✓ Mark as Resolved
                  </button>
                </div>
              </>
            )}

            {/* RESOLVED — show note */}
            {sel.status === 'Resolved' && sel.maintenanceNote && (
              <>
                <div className="mr-section-title">Maintenance Note</div>
                <div className="mr-note-card">
                  <div className="mr-note-who">🔧 {worker?.name || 'Maintenance Worker'} · {worker?.role}</div>
                  <div className="mr-note-text">{sel.maintenanceNote}</div>
                </div>
                <div className="mr-resident-verify">
                  {sel.confirmed
                    ? <div className="mr-confirmed">✓ Resident confirmed this issue was resolved</div>
                    : <div className="mr-pending-verify">⏳ Awaiting resident confirmation</div>
                  }
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  </>);
}

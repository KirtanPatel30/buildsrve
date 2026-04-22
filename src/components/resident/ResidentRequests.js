import React, { useState } from 'react';
import './ResidentRequests.css';
import { ICON_MAP, statusClass, priorityClass, WORKERS } from '../../data';

export default function ResidentRequests({ myRequests, selectedReq, setSelectedReq, updateRequest, reopenRequest, navigate }) {
  const [filter, setFilter] = useState('All');
  const [rating, setRating] = useState(0);
  const [hover,  setHover]  = useState(0);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const filters = ['All','Pending Review','In Progress','Resolved'];

  const list = filter==='All' ? myRequests : myRequests.filter(r=>r.status===filter);
  const sel  = selectedReq;

  const open = (r) => { setSelectedReq(r); setRating(r.rating||0); setShowReopenConfirm(false); };

  const confirmFixed = () => {
    updateRequest(sel.id, { confirmed:true, rating });
    setSelectedReq(null);
  };

  const doReopen = () => {
    reopenRequest(sel.id);
    setSelectedReq(null);
    setShowReopenConfirm(false);
  };

  const worker = sel?.workerAssigned ? WORKERS.find(w=>w.id===sel.workerAssigned) : null;

  return (<>
    <div className="topbar">
      <div className="tb-title">My Requests</div>
      <div className="tb-search"><span className="tb-search-icon">⌕</span><input placeholder="Search requests…"/></div>
      <button className="tb-cta" onClick={()=>navigate('report')}>+ Report Issue</button>
    </div>

    <div style={{display:'flex',height:'calc(100vh - 60px)',overflow:'hidden'}}>
      {/* LIST */}
      <div className={`rr-list ${sel?'narrow':''}`}>
        <div className="rr-filters">
          {filters.map(f=>(
            <button key={f} className={`rr-ftab ${filter===f?'on':''}`} onClick={()=>setFilter(f)}>
              {f}
              <span className="rr-ftab-count">{f==='All'?myRequests.length:myRequests.filter(r=>r.status===f).length}</span>
            </button>
          ))}
        </div>
        <div className="rr-cards">
          {list.length===0&&<div className="rr-empty"><div style={{fontSize:36,marginBottom:10}}>◫</div><div>No requests here.</div></div>}
          {list.map((r,i)=>(
            <div key={r.id} className={`rr-card ${sel?.id===r.id?'active':''} a${Math.min(i,5)}`} onClick={()=>open(r)}>
              <div className="rr-card-top">
                <div className="flex items-center gap-2">
                  <span>{ICON_MAP[r.type]||'🔧'}</span>
                  <span className="rr-card-type">{r.type}</span>
                </div>
                <span className={`chip chip-${statusClass(r.status)}`}><span className="chip-dot"/>{r.status}</span>
              </div>
              <div className="rr-card-loc">📍 {r.location}</div>
              <div className="rr-card-desc">{r.description}</div>
              <div className="rr-card-foot">
                <span className={`chip chip-${priorityClass(r.priority)}`}><span className="chip-dot"/>{r.priority}</span>
                <span className="text-mono text-xs text-muted" style={{marginLeft:'auto'}}>#{r.id}</span>
                <span className="text-mono text-xs text-muted">{r.date}</span>
              </div>
              {r.status==='In Progress'&&<div className="rr-progress"><div className="rr-progress-fill"/></div>}
              {r.status==='Resolved'&&!r.confirmed&&<div className="rr-verify-hint">Tap to verify resolution →</div>}
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL PANEL */}
      {sel&&(
        <div className="rr-detail">
          <div className="rr-dh">
            <div>
              <div className="rr-dh-id">Request #{sel.id}</div>
              <div className="text-mono text-xs text-muted" style={{marginTop:3}}>{sel.date}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setSelectedReq(null)}>✕ Close</button>
          </div>

          <div className="rr-dscroll">
            {/* STATUS ROW */}
            <div className="rr-ds-row" style={{marginBottom:20}}>
              <span className={`chip chip-${statusClass(sel.status)}`} style={{padding:'6px 14px',fontSize:12.5}}><span className="chip-dot"/>{sel.status}</span>
              <span className={`chip chip-${priorityClass(sel.priority)}`} style={{padding:'6px 14px',fontSize:12.5}}><span className="chip-dot"/>{sel.priority}</span>
            </div>

            {/* TIMELINE */}
            <div className="rr-d-section-title">Progress</div>
            <div className="rr-timeline">
              {sel.timeline.map((t,i)=>(
                <div key={i} className={`rr-tl-item ${t.done?'done':''}`}>
                  <div className="rr-tl-dot">{t.done?'✓':''}</div>
                  {i<sel.timeline.length-1&&<div className={`rr-tl-line ${t.done&&sel.timeline[i+1].done?'done':''}`}/>}
                  <div className="rr-tl-content">
                    <div className="rr-tl-label">{t.label}</div>
                    {t.time&&<div className="rr-tl-time text-mono text-xs">{t.time}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* DETAILS */}
            <div className="rr-d-section-title" style={{marginTop:20}}>Issue Details</div>
            <div className="card" style={{overflow:'hidden',marginBottom:16}}>
              {[
                {label:'Type',     val:<span className="flex items-center gap-2"><span>{ICON_MAP[sel.type]}</span><span style={{fontWeight:600}}>{sel.type}</span></span>},
                {label:'Location', val:`📍 ${sel.location}`},
                {label:'Photo',    val:sel.photo ? ('✓ ' + (typeof sel.photo === 'object' ? sel.photo.name : 'Attached')) : 'No photo'},
              ].map((row,i)=>(
                <div key={i} className="rr-d-row">
                  <span className="rr-d-row-label">{row.label}</span>
                  <span className="rr-d-row-val">{row.val}</span>
                </div>
              ))}
              <div className="rr-d-row rr-d-row-col">
                <span className="rr-d-row-label">Description</span>
                <span className="rr-d-row-val" style={{lineHeight:1.6,marginTop:4}}>{sel.description}</span>
              </div>
            </div>

            {/* WORKER */}
            {worker&&(
              <>
                <div className="rr-d-section-title">Assigned Worker</div>
                <div className="card rr-worker-card" style={{marginBottom:16}}>
                  <div className="rr-worker-avatar">{worker.avatar}</div>
                  <div>
                    <div className="rr-worker-name">{worker.name}</div>
                    <div className="text-xs text-muted" style={{marginTop:2}}>{worker.role}</div>
                  </div>
                  <a href={`tel:${worker.phone}`} className="btn btn-blue btn-sm" style={{marginLeft:'auto'}}>📞 Call</a>
                </div>
              </>
            )}

            {/* MAINTENANCE NOTE */}
            {sel.status==='Resolved'&&sel.maintenanceNote&&(
              <>
                <div className="rr-d-section-title">Maintenance Note</div>
                <div className="rr-note-card" style={{marginBottom:16}}>
                  <div className="rr-note-who">🔧 {worker?.name||'Maintenance Worker'} · {worker?.role}</div>
                  <div className="rr-note-text">{sel.maintenanceNote}</div>
                </div>
              </>
            )}

            {/* RATING + VERIFY */}
            {sel.status==='Resolved'&&(
              <>
                <div className="rr-d-section-title">Rate the Service</div>
                <div className="card" style={{padding:'16px 20px',marginBottom:16}}>
                  <div className="rr-stars">
                    {[1,2,3,4,5].map(s=>(
                      <button key={s} className={`rr-star ${s<=(hover||rating)?'on':''}`}
                        onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
                        onClick={()=>setRating(s)}>★</button>
                    ))}
                    {rating>0&&<span style={{fontSize:12.5,color:'var(--navy-500)',marginLeft:8}}>
                      {['','😞','😕','😐','😊','🤩'][rating]}&nbsp;
                      {['','Very unsatisfied','Unsatisfied','Neutral','Satisfied','Very satisfied!'][rating]}
                    </span>}
                  </div>
                </div>

                {!sel.confirmed&&(
                  <>
                    <div className="rr-d-section-title">Is the issue fixed?</div>
                    <div className="rr-verify-info" style={{marginBottom:12}}>
                      Please check and confirm whether the problem has actually been resolved.
                    </div>

                    {!showReopenConfirm ? (
                      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
                        <button className="btn btn-green btn-full btn-lg" onClick={confirmFixed}>
                          ✓ Yes, Issue is Fixed
                        </button>
                        <button className="btn btn-red btn-full btn-lg" onClick={()=>setShowReopenConfirm(true)}>
                          ↺ No, Still Having the Issue
                        </button>
                      </div>
                    ) : (
                      <div className="rr-reopen-confirm">
                        <div className="rr-reopen-title">⚠ Reopen this request?</div>
                        <div className="rr-reopen-body">
                          This will send the request back to <strong>In Progress</strong> and notify the building manager to follow up.
                        </div>
                        <div style={{display:'flex',gap:10,marginTop:14}}>
                          <button className="btn btn-red" style={{flex:1,padding:'10px'}} onClick={doReopen}>
                            Yes, Reopen
                          </button>
                          <button className="btn btn-ghost" style={{flex:1,padding:'10px'}} onClick={()=>setShowReopenConfirm(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {sel.confirmed&&<div className="rr-confirmed">✓ You confirmed this issue was resolved</div>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </>);
}

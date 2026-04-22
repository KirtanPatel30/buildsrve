import React, { useState, useRef } from 'react';
import './ReportFlow.css';
import { ISSUE_TYPES, PRIORITIES } from '../../data';

export default function ReportFlow({ navigate, addRequest }) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ type:'', location:'', description:'', priority:'Normal', photo:null });
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    upd('photo', file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    upd('photo', null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const [submitted, setSubmitted] = useState(null);
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  const doSubmit = () => { const r = addRequest(form); setSubmitted(r); setStep(4); };

  return (<>
    <div className="topbar">
      <button className="btn btn-ghost btn-sm" onClick={()=>step>1&&step<4?setStep(s=>s-1):navigate('dashboard')}>
        ← {step>1&&step<4?'Back':'Dashboard'}
      </button>
      <div className="tb-title">Report an Issue</div>
      {step<4&&(
        <div className="rf-steps">
          {['Issue Type','Details','Review'].map((s,i)=>(
            <div key={i} className={`rf-step ${step===i+1?'active':step>i+1?'done':''}`}>
              <div className="rf-step-dot">{step>i+1?'✓':i+1}</div>
              <span>{s}</span>
              {i<2&&<span className="rf-step-sep">›</span>}
            </div>
          ))}
        </div>
      )}
      <div style={{width:120}}/>
    </div>

    <div className="page">
      <div className="rf-wrap">

        {/* STEP 1 */}
        {step===1&&(
          <div className="rf-panel a0">
            <div className="rf-ph">
              <h2 className="rf-ph-title">What type of issue is this?</h2>
              <p className="rf-ph-sub">Select the category that best describes the problem in your unit.</p>
            </div>
            <div className="rf-type-grid">
              {ISSUE_TYPES.map(t=>(
                <button key={t.key}
                  className={`rf-tile ${form.type===t.key?'sel':''}`}
                  style={{'--tc':t.color}}
                  onClick={()=>upd('type',t.key)}>
                  <div className="rf-tile-iconwrap"><span className="rf-tile-emoji">{t.icon}</span></div>
                  <div className="rf-tile-name">{t.key}</div>
                  <div className="rf-tile-desc">{t.desc}</div>
                  {form.type===t.key&&<div className="rf-tile-check">✓</div>}
                </button>
              ))}
            </div>
            <div className="rf-footer">
              <button className="btn btn-primary btn-lg" disabled={!form.type} onClick={()=>setStep(2)}>
                {form.type?`Continue with ${form.type} →`:'Select a category to continue'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2&&(
          <div className="rf-panel a0">
            <div className="rf-ph">
              <div className="rf-breadcrumb">
                <span className="rf-bc-type">{ISSUE_TYPES.find(t=>t.key===form.type)?.icon} {form.type}</span>
                <button className="btn btn-ghost btn-sm" onClick={()=>setStep(1)}>Change</button>
              </div>
              <h2 className="rf-ph-title">Describe the problem</h2>
              <p className="rf-ph-sub">The more detail you give, the faster our team can fix it.</p>
            </div>
            <div className="rf-form">
              <div className="rf-form-2col">
                <div className="field">
                  <label className="field-label">Location <span style={{color:'var(--red)',marginLeft:2}}>*</span></label>
                  <input className="field-input" placeholder="e.g. Building B – Unit 212 – Kitchen"
                    value={form.location} onChange={e=>upd('location',e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Priority Level</label>
                  <div className="rf-priority-row">
                    {PRIORITIES.map(p=>(
                      <button key={p.key} className={`rf-prio-btn ${form.priority===p.key?'sel':''}`}
                        style={{'--pc':p.color}} onClick={()=>upd('priority',p.key)}>
                        <span className="rf-prio-icon">{p.icon}</span>
                        <span className="rf-prio-name">{p.key}</span>
                        <span className="rf-prio-desc">{p.desc}</span>
                        {form.priority===p.key&&<span className="rf-prio-check">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Description <span style={{color:'var(--red)',marginLeft:2}}>*</span></label>
                <textarea className="field-input" rows={4}
                  placeholder="Describe the issue. When did it start? How severe is it? What have you tried?"
                  value={form.description} onChange={e=>upd('description',e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Photo <span className="opt-tag">Optional</span></label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{display:'none'}}
                  onChange={handlePhotoChange}
                />
                {!form.photo ? (
                  <div className="rf-photo-dropzone" onClick={()=>fileInputRef.current && fileInputRef.current.click()}>
                    <span className="rf-photo-icon">📷</span>
                    <div>
                      <div className="rf-photo-title">Take a Photo or Upload from Device</div>
                      <div className="rf-photo-sub">Click to open your camera or file picker. JPG PNG up to 10MB.</div>
                    </div>
                    <span className="btn btn-secondary btn-sm" style={{marginLeft:'auto',flexShrink:0,pointerEvents:'none'}}>Choose</span>
                  </div>
                ) : (
                  <div className="rf-photo-preview-wrap">
                    <img src={photoPreview} alt="Preview" className="rf-photo-preview-img" />
                    <div className="rf-photo-preview-info">
                      <div className="rf-photo-preview-name">✓ {form.photo.name}</div>
                      <div className="rf-photo-sub">{(form.photo.size / 1024).toFixed(0)} KB — ready to attach</div>
                    </div>
                    <button className="rf-photo-remove-btn" onClick={removePhoto} title="Remove photo">✕</button>
                  </div>
                )}
              </div>
            </div>
            <div className="rf-footer">
              <button className="btn btn-secondary btn-md" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-lg"
                disabled={!form.location.trim()||!form.description.trim()}
                onClick={()=>setStep(3)}>
                Review Request →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3&&(
          <div className="rf-panel a0">
            <div className="rf-ph">
              <h2 className="rf-ph-title">Review your request</h2>
              <p className="rf-ph-sub">Confirm the details below before submitting. You can go back to edit.</p>
            </div>
            <div className="rf-review-card card">
              <div className="rf-rv-grid">
                <div className="rf-rv-item">
                  <div className="rf-rv-label">Issue Type</div>
                  <div className="rf-rv-val rf-rv-type">
                    <span>{ISSUE_TYPES.find(t=>t.key===form.type)?.icon}</span><span>{form.type}</span>
                  </div>
                </div>
                <div className="rf-rv-item">
                  <div className="rf-rv-label">Priority</div>
                  <span className={`chip chip-${form.priority?.toLowerCase()}`}><span className="chip-dot"/>{form.priority}</span>
                </div>
                <div className="rf-rv-item">
                  <div className="rf-rv-label">Photo</div>
                  <div className="rf-rv-val">{form.photo ? '✓ ' + form.photo.name : 'None'}</div>
                </div>
                <div className="rf-rv-item">
                  <div className="rf-rv-label">Est. Response</div>
                  <div className="rf-rv-val">⏱ 24 hours</div>
                </div>
              </div>
              <div className="hr" style={{margin:'0 22px'}}/>
              <div className="rf-rv-section">
                <div className="rf-rv-label">Location</div>
                <div className="rf-rv-val">📍 {form.location}</div>
              </div>
              <div className="hr" style={{margin:'0 22px'}}/>
              <div className="rf-rv-section">
                <div className="rf-rv-label">Description</div>
                <div className="rf-rv-val" style={{lineHeight:1.6,color:'var(--navy-700)'}}>{form.description}</div>
              </div>
            </div>
            <div className="rf-review-note">
              <span>ℹ️</span>
              You'll receive a notification when a maintenance worker is assigned to your request.
            </div>
            <div className="rf-footer">
              <button className="btn btn-secondary btn-md" onClick={()=>setStep(2)}>← Edit Details</button>
              <button className="btn btn-primary btn-lg" onClick={doSubmit}>🚀 Submit Request</button>
            </div>
          </div>
        )}

        {/* STEP 4 — SUCCESS */}
        {step===4&&submitted&&(
          <div className="rf-success a0">
            <div className="rf-success-ring-wrap">
              <div className="rf-sr rf-sr-1"/>
              <div className="rf-sr rf-sr-2"/>
              <div className="rf-success-circle as">✓</div>
            </div>
            <h2 className="rf-success-title">Request Submitted!</h2>
            <p className="rf-success-sub">Your maintenance request has been received and is now under review by our team.</p>

            <div className="card rf-success-card">
              <div className="rf-sc-id-row">
                <div>
                  <div className="text-mono text-xs text-muted" style={{marginBottom:4}}>REQUEST ID</div>
                  <div className="rf-sc-id">#{submitted.id}</div>
                </div>
                <span className="chip chip-pending"><span className="chip-dot"/>Pending Review</span>
              </div>
              <div className="hr"/>
              <div className="rf-sc-grid">
                <div><div className="rf-rv-label">Type</div><div className="rf-rv-val">{submitted.type}</div></div>
                <div><div className="rf-rv-label">Priority</div><span className={`chip chip-${submitted.priority?.toLowerCase()}`}><span className="chip-dot"/>{submitted.priority}</span></div>
                <div><div className="rf-rv-label">Est. Response</div><div className="rf-rv-val">⏱ 24 hours</div></div>
              </div>
            </div>

            <div className="rf-success-actions">
              <button className="btn btn-primary btn-lg" onClick={()=>navigate('myRequests')}>View My Requests →</button>
              <button className="btn btn-secondary btn-md" onClick={()=>{setStep(1);setForm({type:'',location:'',description:'',priority:'Normal',photo:null}); setPhotoPreview(null);;setSubmitted(null);}}>Submit Another</button>
              <button className="btn btn-ghost btn-md" onClick={()=>navigate('dashboard')}>Back to Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  </>);
}

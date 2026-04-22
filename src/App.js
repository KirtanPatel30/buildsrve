import React, { useState, useEffect, useCallback } from 'react';
import './globals.css';
import { INITIAL_REQUESTS, WORKERS, ACCOUNTS } from './data';

const LS_KEY   = 'buildserve_requests';
const LS_NOTIF = 'buildserve_notifications';

function loadRequests() {
  try { const s = localStorage.getItem(LS_KEY); if (s) return JSON.parse(s); } catch(e){}
  return INITIAL_REQUESTS;
}
function saveRequests(r) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(r)); } catch(e){}
}
function loadNotifications() {
  try { const s = localStorage.getItem(LS_NOTIF); if (s) return JSON.parse(s); } catch(e){}
  return [];
}
function saveNotifications(n) {
  try { localStorage.setItem(LS_NOTIF, JSON.stringify(n)); } catch(e){}
}

import AuthPage from './AuthPage';
import ResidentDashboard     from './components/resident/ResidentDashboard';
import ReportFlow            from './components/resident/ReportFlow';
import ResidentRequests      from './components/resident/ResidentRequests';
import { ResidentNotifications } from './components/resident/ResidentNotifications';
import { ResidentProfile }   from './components/resident/ResidentNotifications';
import ManagerDashboard      from './components/manager/ManagerDashboard';
import ManagerRequests       from './components/manager/ManagerRequests';
import ManagerWorkers        from './components/manager/ManagerWorkers';
import { ManagerNotifications } from './components/manager/ManagerNotifications';
import { ManagerSettings }   from './components/manager/ManagerNotifications';

const RES_NAV = [
  { key:'dashboard',     icon:'⊞', label:'Dashboard'     },
  { key:'report',        icon:'+', label:'Report Issue'   },
  { key:'myRequests',    icon:'◫', label:'My Requests'    },
  { key:'notifications', icon:'🔔',label:'Notifications'  },
  { key:'profile',       icon:'◯', label:'Profile'        },
];
const MGR_NAV = [
  { key:'dashboard',     icon:'⊞', label:'Dashboard'     },
  { key:'allRequests',   icon:'◫', label:'All Requests'  },
  { key:'workers',       icon:'👷',label:'Workers'        },
  { key:'notifications', icon:'🔔',label:'Notifications'  },
  { key:'settings',      icon:'⚙', label:'Settings'      },
];

export default function App() {
  const [user,        setUser]        = useState(null);
  const [page,        setPage]        = useState('dashboard');
  const [requests,    setRequestsRaw] = useState(loadRequests);
  const [selectedReq, setSelectedReq] = useState(null);
  const [notifications, setNotifsRaw] = useState(loadNotifications);
  const [accounts,    setAccounts]    = useState(ACCOUNTS);

  const setRequests = useCallback((updater) => {
    setRequestsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveRequests(next);
      return next;
    });
  }, []);

  const setNotifs = useCallback((updater) => {
    setNotifsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveNotifications(next);
      return next;
    });
  }, []);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        try { setRequestsRaw(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LS_NOTIF && e.newValue) {
        try { setNotifsRaw(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const pushNotif = useCallback((notif) => {
    setNotifs(prev => [{
      id: Date.now() + Math.random(),
      time: 'Just now',
      unread: true,
      ...notif
    }, ...prev]);
  }, [setNotifs]);

  const handleLogin  = (u) => { setUser(u); setPage('dashboard'); };
  const handleLogout = () => { setUser(null); setPage('dashboard'); setSelectedReq(null); };

  const updateAccount = (id, changes) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...changes } : a));
    if (user?.id === id) setUser(prev => ({ ...prev, ...changes }));
  };

  if (!user) return <AuthPage onLogin={handleLogin} accounts={accounts} onUpdateAccounts={setAccounts} />;

  const myRequests = requests.filter(r => r.residentId === user.id);
  const myPending  = myRequests.filter(r => r.status !== 'Resolved').length;
  const allPending = requests.filter(r => r.status !== 'Resolved').length;
  const myUnread   = notifications.filter(n => n.userId === user.id && n.unread).length;

  const addRequest = (form) => {
    const r = {
      ...form,
      id: Math.floor(2500 + Math.random()*499),
      status:'Pending Review',
      date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
      residentId:   user.id,
      residentName: user.name,
      residentUnit: `${user.building} · ${user.unit}`,
      workerAssigned:null, maintenanceNote:'', confirmed:false, rating:0,
      timeline:[
        {label:'Submitted',  time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),done:true},
        {label:'Reviewed',   time:'',done:false},
        {label:'Assigned',   time:'',done:false},
        {label:'In Progress',time:'',done:false},
        {label:'Resolved',   time:'',done:false},
      ],
    };
    setRequests(p => [r, ...p]);
    pushNotif({
      userId: user.id,
      icon:'＋', type:'orange',
      title:`Request #${r.id} Received`,
      body:`Your ${r.type} request has been received and is pending review.`,
    });
    return r;
  };

  const updateRequest = (id, changes) =>
    setRequests(p => p.map(r => r.id === id ? {...r,...changes} : r));

  const assignWorker = (id, workerId) => {
    const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const req = requests.find(r => r.id === id);
    const worker = WORKERS.find(w => w.id === workerId);
    setRequests(p => p.map(r => {
      if (r.id !== id) return r;
      const tl = r.timeline.map(t =>
        ['Reviewed','Assigned','In Progress'].includes(t.label) ? {...t,time:now,done:true} : t
      );
      return {...r, workerAssigned:workerId, status:'In Progress', timeline:tl};
    }));
    if (req) {
      pushNotif({
        userId: req.residentId,
        icon:'✓', type:'green',
        title:`Request #${id} In Progress`,
        body:`${worker?.name || 'A worker'} has been assigned. Your ${req.type} issue is being handled.`,
      });
    }
  };

  const resolveRequest = (id, note) => {
    const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const req = requests.find(r => r.id === id);
    setRequests(p => p.map(r => {
      if (r.id !== id) return r;
      const tl = r.timeline.map(t => t.label==='Resolved'?{...t,time:now,done:true}:t);
      return {...r, status:'Resolved', maintenanceNote:note, timeline:tl};
    }));
    if (req) {
      pushNotif({
        userId: req.residentId,
        icon:'✓', type:'green',
        title:`Request #${id} Resolved`,
        body:`Your ${req.type} issue has been marked as resolved. Please confirm if the problem is fixed.`,
      });
    }
  };

  const reopenRequest = (id) => {
    const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const req = requests.find(r => r.id === id);
    setRequests(p => p.map(r => {
      if (r.id !== id) return r;
      const tl = r.timeline.map(t => t.label === 'Resolved' ? {...t, time:'', done:false} : t);
      return {...r, status:'In Progress', confirmed:false, timeline:tl};
    }));
    if (req) {
      pushNotif({
        userId: req.residentId,
        icon:'↺', type:'amber',
        title:`Request #${id} Reopened`,
        body:`Your ${req.type} issue has been reopened for follow-up. Management has been notified.`,
      });
    }
  };

  const dismissNotif = (id) =>
    setNotifs(p => p.filter(n => n.id !== id));

  const markAllRead = (userId) =>
    setNotifs(p => p.map(n => n.userId === userId ? {...n, unread:false} : n));

  const goTo = (p) => { setPage(p); setSelectedReq(null); };
  const openReq = (req) => {
    setSelectedReq(req);
    setPage(user.role==='resident' ? 'myRequests' : 'allRequests');
  };

  const nav   = user.role==='resident' ? RES_NAV : MGR_NAV;
  const myNotifs = notifications.filter(n => n.userId === user.id);

  const props = {
    requests, myRequests, workers:WORKERS,
    addRequest, updateRequest, assignWorker, resolveRequest, reopenRequest,
    selectedReq, setSelectedReq, openReq, navigate:goTo,
    currentUser: user,
    notifications: myNotifs,
    allNotifications: notifications,
    dismissNotif, markAllRead,
    updateAccount,
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-logomark">BS</div>
          <div>
            <div className="sb-logoname">BuildServe</div>
            <div className="sb-logosub">MAINTENANCE PORTAL</div>
          </div>
        </div>
        <div className="sb-role-badge">
          <span className={`sb-role-chip ${user.role}`}>
            {user.role === 'resident' ? '👤 Resident' : '🏢 Manager'}
          </span>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Navigation</div>
          {nav.map(n => (
            <button key={n.key}
              className={`sb-item ${page===n.key?'on':''}`}
              onClick={() => goTo(n.key)}>
              <span className="sb-item-icon">{n.icon}</span>
              <span className="sb-item-label">{n.label}</span>
              {n.key==='myRequests'    && myPending>0  && <span className="sb-badge">{myPending}</span>}
              {n.key==='allRequests'   && allPending>0 && <span className="sb-badge">{allPending}</span>}
              {n.key==='notifications' && myUnread>0   && <span className="sb-badge">{myUnread}</span>}
            </button>
          ))}
        </nav>
        <div className="sb-user">
          <div className="sb-user-row" onClick={() => goTo(user.role==='resident'?'profile':'settings')}>
            <div className={`sb-avatar ${user.role}`}>{user.avatar}</div>
            <div style={{flex:1,overflow:'hidden'}}>
              <div className="sb-uname" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
              <div className="sb-urole">{user.role==='resident' ? `${user.building} · ${user.unit}` : 'Building Manager'}</div>
            </div>
            <span className="sb-uarrow">›</span>
          </div>
          <button className="sb-logout-btn" onClick={handleLogout}>
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="main">
        {user.role === 'resident' && <>
          {page==='dashboard'     && <ResidentDashboard   {...props} />}
          {page==='report'        && <ReportFlow           {...props} />}
          {page==='myRequests'    && <ResidentRequests     {...props} />}
          {page==='notifications' && <ResidentNotifications {...props} />}
          {page==='profile'       && <ResidentProfile      {...props} currentUser={user} />}
        </>}
        {user.role === 'manager' && <>
          {page==='dashboard'     && <ManagerDashboard     {...props} />}
          {page==='allRequests'   && <ManagerRequests      {...props} />}
          {page==='workers'       && <ManagerWorkers        {...props} />}
          {page==='notifications' && <ManagerNotifications  {...props} />}
          {page==='settings'      && <ManagerSettings       {...props} currentUser={user} />}
        </>}
      </div>
    </div>
  );
}

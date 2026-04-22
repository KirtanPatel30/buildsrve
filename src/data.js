// ── SHARED DATA & CONSTANTS ──

// Demo accounts — in a real app these would be in a backend/database
export const ACCOUNTS = [
  {
    id: 'r1', role: 'resident',
    name: 'John Doe',       email: 'john@buildserve.app',    password: 'resident123',
    unit: 'Unit 212',       building: 'Building B',           avatar: 'JD',
    phone: '+1 (555) 212-0001', moveIn: 'January 15, 2024',
  },
  {
    id: 'r2', role: 'resident',
    name: 'Sara Nguyen',    email: 'sara@buildserve.app',     password: 'resident123',
    unit: 'Unit 105',       building: 'Building A',           avatar: 'SN',
    phone: '+1 (555) 105-0002', moveIn: 'March 1, 2023',
  },
  {
    id: 'r3', role: 'resident',
    name: 'Alex Rivera',    email: 'alex@buildserve.app',     password: 'resident123',
    unit: 'Unit 301',       building: 'Building C',           avatar: 'AR',
    phone: '+1 (555) 301-0003', moveIn: 'September 10, 2024',
  },
  {
    id: 'm1', role: 'manager',
    name: 'Mike Green',     email: 'manager@buildserve.app',  password: 'manager123',
    unit: null,             building: 'Buildings A, B & C',   avatar: 'MG',
    phone: '+1 (555) 000-9999', moveIn: null,
  },
];

export const ISSUE_TYPES = [
  { key:'Plumbing',        icon:'💧', desc:'Leaks, clogs, pipe damage',     color:'#2563eb' },
  { key:'Electrical',      icon:'⚡', desc:'Outlets, wiring, power loss',   color:'#d97706' },
  { key:'HVAC / Heating',  icon:'🌡️', desc:'Heat, AC, ventilation',         color:'#f05a1a' },
  { key:'Doors / Windows', icon:'🚪', desc:'Locks, glass, frames, hinges',  color:'#7c3aed' },
  { key:'Safety Concern',  icon:'🛡️', desc:'Fire, security, hazard',        color:'#dc2626' },
  { key:'General / Other', icon:'🔧', desc:'Other maintenance needs',       color:'#16a34a' },
];

export const PRIORITIES = [
  { key:'Low',    icon:'▽', desc:'Not urgent — schedule at convenience',    color:'#5a6e99' },
  { key:'Normal', icon:'◇', desc:'Needs attention within a few days',       color:'#2563eb' },
  { key:'Urgent', icon:'▲', desc:'Immediate hazard — water or safety issue',color:'#dc2626' },
];

export const WORKERS = [
  { id:'w1', name:'Mike Williams',   role:'Plumber',            avatar:'MW', phone:'555-0101' },
  { id:'w2', name:'Sarah Chen',      role:'Electrician',        avatar:'SC', phone:'555-0102' },
  { id:'w3', name:'James Torres',    role:'HVAC Technician',    avatar:'JT', phone:'555-0103' },
  { id:'w4', name:'David Kim',       role:'General Maintenance',avatar:'DK', phone:'555-0104' },
];

export const INITIAL_REQUESTS = [
  {
    id:2471, type:'Plumbing', location:'Building B – Unit 212 – Kitchen',
    description:'Water leaking under kitchen sink. Leak increases when the faucet is turned on. Water spreading on the floor.',
    priority:'Urgent', status:'In Progress', date:'Apr 16, 2025', photo:true,
    residentId:'r1', residentName:'John Doe', residentUnit:'Bldg B · Unit 212',
    workerAssigned:'w1', maintenanceNote:'', confirmed:false, rating:0,
    timeline:[
      {label:'Submitted',   time:'Apr 16 · 8:48 PM', done:true},
      {label:'Reviewed',    time:'Apr 16 · 9:00 PM', done:true},
      {label:'Assigned',    time:'Apr 16 · 9:10 PM', done:true},
      {label:'In Progress', time:'Apr 16 · 10:00 AM',done:true},
      {label:'Resolved',    time:'',done:false},
    ],
  },
  {
    id:2468, type:'Plumbing', location:'Building A – Unit 105 – Bathroom',
    description:'Faucet dripping constantly even when fully closed. Started about 3 days ago.',
    priority:'Normal', status:'Resolved', date:'Mar 28, 2025', photo:false,
    residentId:'r1', residentName:'John Doe', residentUnit:'Bldg B · Unit 212',
    workerAssigned:'w1', maintenanceNote:'Replaced washer and O-ring. Faucet fully sealed and tested. No more drip.',
    confirmed:false, rating:0,
    timeline:[
      {label:'Submitted',   time:'Mar 28 · 2:00 PM', done:true},
      {label:'Reviewed',    time:'Mar 28 · 3:00 PM', done:true},
      {label:'Assigned',    time:'Mar 28 · 4:00 PM', done:true},
      {label:'In Progress', time:'Mar 29 · 9:00 AM', done:true},
      {label:'Resolved',    time:'Mar 29 · 11:00 AM',done:true},
    ],
  },
  {
    id:2452, type:'HVAC / Heating', location:'Building A – Unit 105 – Living Room',
    description:'Heater making loud banging noise on startup every morning. Has been going on for a week.',
    priority:'Urgent', status:'Pending Review', date:'Apr 1, 2025', photo:false,
    residentId:'r2', residentName:'Sara Nguyen', residentUnit:'Bldg A · Unit 105',
    workerAssigned:null, maintenanceNote:'', confirmed:false, rating:0,
    timeline:[
      {label:'Submitted',   time:'Apr 1 · 7:30 AM', done:true},
      {label:'Reviewed',    time:'',done:false},
      {label:'Assigned',    time:'',done:false},
      {label:'In Progress', time:'',done:false},
      {label:'Resolved',    time:'',done:false},
    ],
  },
  {
    id:2391, type:'Electrical', location:'Building A – Unit 105 – Kitchen',
    description:'Outlet near sink keeps tripping the breaker. Happens when I plug in the toaster.',
    priority:'Urgent', status:'Resolved', date:'Mar 15, 2025', photo:true,
    residentId:'r2', residentName:'Sara Nguyen', residentUnit:'Bldg A · Unit 105',
    workerAssigned:'w2', maintenanceNote:'GFCI outlet replaced. Breaker tested — all clear. Up to code.',
    confirmed:true, rating:5,
    timeline:[
      {label:'Submitted',   time:'Mar 15 · 10:00 AM', done:true},
      {label:'Reviewed',    time:'Mar 15 · 10:30 AM', done:true},
      {label:'Assigned',    time:'Mar 15 · 11:00 AM', done:true},
      {label:'In Progress', time:'Mar 15 · 1:00 PM',  done:true},
      {label:'Resolved',    time:'Mar 15 · 3:00 PM',  done:true},
    ],
  },
  {
    id:2340, type:'Doors / Windows', location:'Building C – Unit 301 – Front Door',
    description:'Door lock sticking and hard to turn. Takes several tries to unlock.',
    priority:'Normal', status:'In Progress', date:'Apr 12, 2025', photo:false,
    residentId:'r3', residentName:'Alex Rivera', residentUnit:'Bldg C · Unit 301',
    workerAssigned:'w4', maintenanceNote:'', confirmed:false, rating:0,
    timeline:[
      {label:'Submitted',   time:'Apr 12 · 3:00 PM',  done:true},
      {label:'Reviewed',    time:'Apr 12 · 4:00 PM',  done:true},
      {label:'Assigned',    time:'Apr 13 · 9:00 AM',  done:true},
      {label:'In Progress', time:'Apr 13 · 11:00 AM', done:true},
      {label:'Resolved',    time:'',done:false},
    ],
  },
];

export const ICON_MAP = {
  'Plumbing':'💧','Electrical':'⚡','HVAC / Heating':'🌡️',
  'Doors / Windows':'🚪','Safety Concern':'🛡️','General / Other':'🔧',
};

export const statusClass   = (s) => s==='Resolved'?'resolved':s==='In Progress'?'progress':'pending';
export const priorityClass = (p) => p==='Urgent'?'urgent':p==='Normal'?'normal':'low';

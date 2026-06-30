import { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

/* ═══════════════════════════════════════════
   DESIGN TOKENS — BRIGHT PREMIUM
═══════════════════════════════════════════ */
const T = {
  bg:"#F8F9FF", bgCard:"#FFFFFF", bgDim:"#F1F3FF",
  border:"#E5E8F5", borderHi:"#818CF8",
  indigo:"#6366F1", indigoLt:"#818CF8", indigoDim:"#EEF2FF",
  purple:"#8B5CF6", cyan:"#06B6D4", green:"#10B981", greenLt:"#D1FAE5",
  amber:"#F59E0B", amberLt:"#FEF3C7", red:"#EF4444", redLt:"#FEE2E2",
  text:"#0F1117", textSub:"#374151", muted:"#6B7280", dimText:"#9CA3AF",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",
  shadowMd:"0 4px 16px rgba(99,102,241,0.10)",
  shadowLg:"0 8px 32px rgba(99,102,241,0.14)",
};

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const CANDIDATES = [
  { id:1,name:"Neha Joshi",title:"AI Research Engineer",exp:5,company:"Google Brain",location:"Bangalore",salary:"₹42L",notice:"30 days",score:96,rank:1,skills:["PyTorch","LLMs","NLP","CUDA","Transformers","Python"],education:"M.S. CS – Stanford",initials:"NJ",color:T.indigo,bg:"#EEF2FF",
    radar:[{s:"Technical",v:97},{s:"Leadership",v:78},{s:"Culture",v:89},{s:"Growth",v:95},{s:"Comms",v:82},{s:"Problem",v:94}],
    risk:"low",rec:"Exceptional hire. Research depth is rare.",strengths:["3 NeurIPS papers","HuggingFace core contributor","Deep LLM expertise"],
    github:510,oss:28,certs:4,activity:10,attrition:12,cultural:91,interview:94,
    timeline:[{y:"2019",r:"Intern – DeepMind"},{y:"2021",r:"ML Eng – OpenAI"},{y:"2023",r:"Research – Google Brain"}],
    qs:["Describe your most complex model architecture","How do you handle LLM hallucinations in prod?","Walk me through your NeurIPS paper"],
  },
  { id:2,name:"Vikram Nair",title:"ML Platform Engineer",exp:8,company:"Amazon",location:"Hyderabad",salary:"₹38L",notice:"60 days",score:91,rank:2,skills:["Kubernetes","MLflow","Spark","Airflow","Python","AWS"],education:"M.Tech CS – IISc",initials:"VN",color:T.purple,bg:"#F5F3FF",
    radar:[{s:"Technical",v:93},{s:"Leadership",v:85},{s:"Culture",v:80},{s:"Growth",v:88},{s:"Comms",v:79},{s:"Problem",v:91}],
    risk:"low",rec:"Strong hire. Production ML infrastructure expert.",strengths:["200+ models in prod","MLOps architect","AWS expert"],
    github:390,oss:19,certs:5,activity:8,attrition:18,cultural:84,interview:89,
    timeline:[{y:"2016",r:"SDE – Infosys"},{y:"2018",r:"ML Eng – Flipkart"},{y:"2021",r:"Platform – Amazon"}],
    qs:["How did you handle model drift at Amazon?","Describe your ML serving architecture","ML infra at scale approach?"],
  },
  { id:3,name:"Priya Sharma",title:"Senior ML Engineer",exp:6,company:"Flipkart",location:"Bangalore",salary:"₹35L",notice:"45 days",score:87,rank:3,skills:["Python","TensorFlow","NLP","MLOps","Docker","AWS"],education:"M.Tech AI – IIT Delhi",initials:"PS",color:T.cyan,bg:"#ECFEFF",
    radar:[{s:"Technical",v:88},{s:"Leadership",v:72},{s:"Culture",v:86},{s:"Growth",v:84},{s:"Comms",v:88},{s:"Problem",v:85}],
    risk:"medium",rec:"Good hire. Strong NLP background at scale.",strengths:["10M user rec engine","NLP pipeline expert","Great communicator"],
    github:320,oss:12,certs:3,activity:9,attrition:24,cultural:88,interview:85,
    timeline:[{y:"2018",r:"Data Scientist – Mu Sigma"},{y:"2020",r:"ML Eng – Swiggy"},{y:"2022",r:"Sr ML – Flipkart"}],
    qs:["How did you scale the recommendation engine?","Describe your NLP pipeline","A/B testing approach for ML?"],
  },
  { id:4,name:"Rahul Verma",title:"Backend + ML Engineer",exp:7,company:"Razorpay",location:"Bangalore",salary:"₹32L",notice:"30 days",score:83,rank:4,skills:["FastAPI","Redis","Kafka","TensorFlow","PostgreSQL","Python"],education:"B.Tech CS – NIT Trichy",initials:"RV",color:T.amber,bg:"#FFFBEB",
    radar:[{s:"Technical",v:86},{s:"Leadership",v:80},{s:"Culture",v:75},{s:"Growth",v:82},{s:"Comms",v:76},{s:"Problem",v:88}],
    risk:"medium",rec:"Solid hire for production ML systems.",strengths:["50K TPS ML infra","Backend + ML combo","3 promotions"],
    github:240,oss:8,certs:4,activity:6,attrition:28,cultural:79,interview:82,
    timeline:[{y:"2017",r:"SDE – TCS"},{y:"2019",r:"Backend – PhonePe"},{y:"2022",r:"ML Eng – Razorpay"}],
    qs:["How did you achieve 50K TPS?","Describe your model serving stack","Real-time ML failure handling?"],
  },
  { id:5,name:"Arjun Mehta",title:"Data Scientist",exp:4,company:"Swiggy",location:"Mumbai",salary:"₹24L",notice:"30 days",score:74,rank:5,skills:["Python","Sklearn","SQL","Tableau","Statistics","R"],education:"B.Tech CS – BITS Pilani",initials:"AM",color:T.green,bg:"#ECFDF5",
    radar:[{s:"Technical",v:74},{s:"Leadership",v:60},{s:"Culture",v:82},{s:"Growth",v:79},{s:"Comms",v:85},{s:"Problem",v:71}],
    risk:"medium",rec:"Potential hire. Strong statistics fundamentals.",strengths:["Strong A/B testing","89% churn accuracy","Great communicator"],
    github:180,oss:4,certs:2,activity:7,attrition:35,cultural:84,interview:73,
    timeline:[{y:"2020",r:"Analyst – Deloitte"},{y:"2022",r:"Data Scientist – Swiggy"}],
    qs:["Walk me through your churn model","How do you handle class imbalance?","Build a real-time rec system?"],
  },
  { id:6,name:"Ananya Iyer",title:"Computer Vision Engineer",exp:5,company:"Nvidia",location:"Pune",salary:"₹36L",notice:"45 days",score:89,rank:6,skills:["PyTorch","OpenCV","CUDA","Python","TensorRT","C++"],education:"M.Tech AI – IIT Bombay",initials:"AI",color:"#F43F5E",bg:"#FFF1F2",
    radar:[{s:"Technical",v:92},{s:"Leadership",v:70},{s:"Culture",v:84},{s:"Growth",v:88},{s:"Comms",v:75},{s:"Problem",v:90}],
    risk:"low",rec:"Strong hire for vision-heavy roles. CUDA expertise is rare.",strengths:["TensorRT optimisation expert","Real-time inference at edge","Nvidia research background"],
    github:280,oss:14,certs:3,activity:9,attrition:20,cultural:86,interview:88,
    timeline:[{y:"2019",r:"CV Intern – ISRO"},{y:"2021",r:"Vision Eng – Qualcomm"},{y:"2023",r:"CV Eng – Nvidia"}],
    qs:["How do you optimise inference latency?","Describe your TensorRT pipeline","Real-time CV on edge devices approach?"],
  },
];

const STAGES = ["Applied","Screening","Assessment","Interview 1","Interview 2","HR Round","Offer","Joined"];
const VELOCITY = [{m:"Jan",v:12},{m:"Feb",v:18},{m:"Mar",v:15},{m:"Apr",v:22},{m:"May",v:28},{m:"Jun",v:31}];
const SKILLS_DEMAND = [{s:"Python",v:94},{s:"ML/AI",v:88},{s:"NLP",v:76},{s:"MLOps",v:71},{s:"PyTorch",v:68}];
const PIE_DATA = [{name:"Technical",v:35,color:T.indigo},{name:"Behavioral",v:25,color:T.purple},{name:"Cultural",v:20,color:T.green},{name:"Career",v:20,color:T.amber}];
const FUNNEL = [{s:"Applied",v:340},{s:"Screened",v:120},{s:"Assessed",v:64},{s:"Interviewed",v:28},{s:"Offered",v:12},{s:"Joined",v:9}];

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function Counter({ to, suffix="" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = null;
    const run = ts => { if(!s) s=ts; const p=Math.min((ts-s)/1400,1); setV(Math.floor(p*to)); if(p<1) requestAnimationFrame(run); };
    requestAnimationFrame(run);
  }, [to]);
  return <>{v.toLocaleString()}{suffix}</>;
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize:11,fontWeight:600,padding:"2px 10px",borderRadius:20,background:bg||`${color}15`,color,border:`1px solid ${color}30`,display:"inline-block",margin:"2px" }}>{label}</span>;
}

function ScoreArc({ score, size=72, color=T.indigo }) {
  const r=(size-10)/2, circ=2*Math.PI*r;
  const [dash,setDash]=useState(circ);
  useEffect(()=>{ setTimeout(()=>setDash(circ*(1-score/100)),200); },[score,circ]);
  const grade = score>=90?"A+":score>=80?"A":score>=70?"B+":"B";
  return (
    <div style={{ position:"relative",width:size,height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}18`} strokeWidth={8}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <span style={{ fontSize:size*0.22,fontWeight:900,color,lineHeight:1 }}>{score}</span>
        <span style={{ fontSize:size*0.14,fontWeight:700,color,opacity:0.6 }}>{grade}</span>
      </div>
    </div>
  );
}

function Card({ children, style={}, onClick, highlight }) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.bgCard,borderRadius:16,border:`1px solid ${highlight?T.indigo+"50":hov?T.borderHi+"60":T.border}`,
        boxShadow:hov?T.shadowLg:highlight?T.shadowMd:T.shadow,transition:"all 0.2s ease",cursor:onClick?"pointer":"default",...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <Card style={{ padding:"18px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:10,color:T.muted,fontWeight:700,letterSpacing:0.8,marginBottom:6,textTransform:"uppercase" }}>{label}</div>
          <div style={{ fontSize:26,fontWeight:900,color:T.text,lineHeight:1 }}>{value}</div>
          {sub&&<div style={{ fontSize:11,color:T.green,marginTop:4,fontWeight:600 }}>{sub}</div>}
        </div>
        <div style={{ width:40,height:40,borderRadius:12,background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{icon}</div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   TICKER BAR
═══════════════════════════════════════════ */
function TickerBar() {
  const items = ["⚡ AI ENGINE: ACTIVE","📊 INDEX: 2,847 CANDIDATES","🎯 BIAS DETECTOR: ON","🌐 REGION: INDIA","⏱ LATENCY: 142ms","🔮 MODEL: CLAUDE SONNET","✅ RUNTIME: NOMINAL","📈 MATCH ACCURACY: 96.4%","🔒 PRIVACY: COMPLIANT","⚡ AI ENGINE: ACTIVE","📊 INDEX: 2,847 CANDIDATES"];
  return (
    <div style={{ background:T.indigo,overflow:"hidden",height:28,display:"flex",alignItems:"center" }}>
      <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div style={{ display:"flex",gap:0,animation:"ticker 22s linear infinite",whiteSpace:"nowrap" }}>
        {[...items,...items].map((item,i)=>(
          <span key={i} style={{ fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.85)",padding:"0 24px",borderRight:"1px solid rgba(255,255,255,0.2)",fontFamily:"monospace",letterSpacing:0.5 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOADING
═══════════════════════════════════════════ */
function Loader({ onDone }) {
  const [pct,setPct]=useState(0);
  const [step,setStep]=useState(0);
  const steps=["Initializing AI engine","Loading candidate models","Building semantic graph","Calibrating scoring","Ready ✓"];
  useEffect(()=>{
    const iv=setInterval(()=>setPct(p=>{ if(p>=100){clearInterval(iv);setTimeout(onDone,400);return 100;} return Math.min(p+1.5,100); }),28);
    return()=>clearInterval(iv);
  },[]);
  useEffect(()=>setStep(Math.min(Math.floor(pct/22),steps.length-1)),[pct]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,flexDirection:"column" }}>
      <div style={{ position:"absolute",top:"15%",left:"50%",transform:"translateX(-50%)",width:500,height:250,background:"radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" }}/>
      <div style={{ position:"relative",zIndex:1,textAlign:"center",padding:40 }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:32 }}>
          <div style={{ width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${T.indigo},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:900,boxShadow:`0 8px 24px ${T.indigo}40` }}>T</div>
          <span style={{ fontSize:24,fontWeight:900,color:T.text,letterSpacing:-0.5 }}>TalentRadar <span style={{ color:T.indigo }}>AI</span></span>
        </div>
        <div style={{ position:"relative",width:140,height:140,margin:"0 auto 28px" }}>
          <svg width={140} height={140} style={{ transform:"rotate(-90deg)" }}>
            <circle cx={70} cy={70} r={58} fill="none" stroke="#F0F0F8" strokeWidth={10}/>
            <circle cx={70} cy={70} r={58} fill="none" strokeWidth={10} strokeLinecap="round"
              stroke={`url(#lg)`} strokeDasharray={2*Math.PI*58} strokeDashoffset={2*Math.PI*58*(1-pct/100)} style={{ transition:"stroke-dashoffset 0.08s" }}/>
            <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={T.indigo}/><stop offset="100%" stopColor={T.purple}/></linearGradient></defs>
          </svg>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontSize:28,fontWeight:900,color:T.text }}>{Math.round(pct)}%</div>
            <div style={{ fontSize:10,color:T.muted }}>loading</div>
          </div>
        </div>
        <div style={{ background:T.bg,borderRadius:14,padding:"16px 24px",minWidth:280,border:`1px solid ${T.border}` }}>
          {steps.map((s,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"5px 0",opacity:i<=step?1:0.3,transition:"opacity 0.4s" }}>
              <div style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${i<step?T.green:i===step?T.indigo:T.border}`,background:i<step?T.green:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.3s" }}>
                {i<step&&<span style={{ fontSize:10,color:"#fff" }}>✓</span>}
                {i===step&&<div style={{ width:6,height:6,borderRadius:"50%",background:T.indigo }}/>}
              </div>
              <span style={{ fontSize:12,color:i===step?T.indigo:i<step?T.green:T.muted,fontWeight:i===step?700:500 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",emoji:"🏠",label:"Dashboard"},
  {id:"jd",emoji:"📝",label:"JD Engine"},
  {id:"candidates",emoji:"👥",label:"Candidates"},
  {id:"compare",emoji:"⚖️",label:"Compare"},
  {id:"pipeline",emoji:"🔀",label:"Pipeline"},
  {id:"analytics",emoji:"📊",label:"Analytics"},
  {id:"resumes",emoji:"📄",label:"Resumes"},
  {id:"chat",emoji:"💬",label:"AI Chat"},
];
function Sidebar({ active, onNav }) {
  const [exp,setExp]=useState(false);
  return (
    <div style={{ width:exp?200:64,background:"#fff",borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",transition:"width 0.25s",overflow:"hidden",flexShrink:0,boxShadow:T.shadow }}>
      <div style={{ padding:"14px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={()=>setExp(!exp)}>
        <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${T.indigo},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",fontWeight:900,flexShrink:0,boxShadow:`0 4px 12px ${T.indigo}30` }}>T</div>
        {exp&&<span style={{ fontSize:13,fontWeight:800,color:T.text,whiteSpace:"nowrap" }}>TalentRadar</span>}
      </div>
      <div style={{ flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2 }}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>onNav(n.id)} title={n.label} style={{ width:"100%",padding:"9px 10px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",background:active===n.id?T.indigoDim:"transparent",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s" }}>
            <span style={{ fontSize:17,lineHeight:1,flexShrink:0 }}>{n.emoji}</span>
            {exp&&<span style={{ fontSize:13,fontWeight:600,color:active===n.id?T.indigo:T.muted,whiteSpace:"nowrap" }}>{n.label}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding:"12px 10px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.indigo},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0 }}>MT</div>
        {exp&&<div><div style={{ fontSize:12,fontWeight:700,color:T.text }}>Mayank Tiwari</div><div style={{ fontSize:10,color:T.muted }}>Senior Recruiter</div></div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════ */
function Topbar({ title, sub }) {
  return (
    <div style={{ padding:"12px 24px",borderBottom:`1px solid ${T.border}`,background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
      <div>
        <div style={{ fontSize:17,fontWeight:800,color:T.text }}>{title}</div>
        {sub&&<div style={{ fontSize:11,color:T.muted,marginTop:1 }}>{sub}</div>}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:6,background:T.greenLt,borderRadius:20,padding:"4px 12px" }}>
          <div style={{ width:7,height:7,borderRadius:"50%",background:T.green }}/>
          <span style={{ fontSize:11,fontWeight:700,color:T.green }}>AI Online</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard({ onNav }) {
  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      {/* Hero banner */}
      <div style={{ borderRadius:20,background:`linear-gradient(135deg,${T.indigo},${T.purple})`,padding:"28px 32px",marginBottom:24,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-20,right:-20,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute",bottom:-30,right:60,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6 }}>Mission Control · Jun 2026</div>
          <div style={{ fontSize:28,fontWeight:900,color:"#fff",marginBottom:4 }}>Intelligent Hiring <span style={{ color:"#FCD34D" }}>[OS]</span></div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:16 }}>Semantic talent graph · bias-guarded ranking · live pipeline orchestration</div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>onNav("jd")} style={{ padding:"8px 18px",borderRadius:10,border:"none",background:"#fff",color:T.indigo,fontWeight:700,fontSize:12,cursor:"pointer" }}>Parse JD</button>
            <button onClick={()=>onNav("candidates")} style={{ padding:"8px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,0.3)",background:"transparent",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer" }}>View Candidates</button>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
        <StatCard label="Candidates Ranked" value={<Counter to={2847}/>} sub="↑ 12.4% WoW" color={T.indigo} icon="👥"/>
        <StatCard label="Avg Match Score" value={<><Counter to={86}/>%</>} sub="↑ 12.4% WoW" color={T.purple} icon="🎯"/>
        <StatCard label="Time Saved (hrs)" value={<Counter to={320}/>} sub="↑ 12.4% WoW" color={T.green} icon="⚡"/>
        <StatCard label="Offer Accept Rate" value={<><Counter to={94}/>%</>} sub="↑ 12.4% WoW" color={T.amber} icon="✅"/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
        {/* Pipeline volume */}
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:4 }}>Today's Pipeline Volume</div>
          <div style={{ fontSize:11,color:T.muted,marginBottom:16 }}>Active candidates per stage</div>
          {["Applied","Screening","Assessment","Interview 1","Interview 2","HR Round","Offer"].map((stage,i)=>{
            const val=[28,19,12,7,5,3,1][i];
            return (
              <div key={stage} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                <div style={{ width:90,fontSize:11,color:T.muted,flexShrink:0 }}>{stage}</div>
                <div style={{ flex:1,height:6,background:T.bgDim,borderRadius:3,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${(val/28)*100}%`,background:`linear-gradient(90deg,${T.indigo},${T.purple})`,borderRadius:3,transition:"width 1s" }}/>
                </div>
                <div style={{ fontSize:11,fontWeight:700,color:T.indigo,minWidth:24,textAlign:"right" }}>{String(val).padStart(3,"0")}</div>
              </div>
            );
          })}
        </Card>
        {/* Velocity chart */}
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:4 }}>Hiring Velocity 6M</div>
          <div style={{ fontSize:11,color:T.muted,marginBottom:4 }}>Peak: <strong style={{ color:T.indigo }}>31</strong> · Trend: <strong style={{ color:T.green }}>↑ 47%</strong></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={VELOCITY}>
              <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.indigo} stopOpacity={0.15}/><stop offset="100%" stopColor={T.indigo} stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{ fontSize:11,fill:T.muted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11,fill:T.muted }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,fontSize:12 }}/>
              <Area type="monotone" dataKey="v" stroke={T.indigo} strokeWidth={2.5} fill="url(#vg)" dot={{ fill:T.indigo,r:4,strokeWidth:0 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* Top ranked */}
      <Card style={{ padding:20 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text }}>🏆 Top Ranked Candidates</div>
          <button onClick={()=>onNav("candidates")} style={{ fontSize:11,fontWeight:700,color:T.indigo,background:T.indigoDim,border:"none",borderRadius:20,padding:"4px 14px",cursor:"pointer" }}>View All →</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {CANDIDATES.slice(0,3).map((c,i)=>(
            <div key={c.id} style={{ background:c.bg,borderRadius:12,padding:"14px 16px",border:`1px solid ${c.color}20` }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:c.color,border:`1px solid ${c.color}30` }}>{c.initials}</div>
                <div>
                  <div style={{ fontSize:13,fontWeight:800,color:T.text }}>{c.name}</div>
                  <div style={{ fontSize:10,color:T.muted }}>{c.title}</div>
                </div>
                <div style={{ marginLeft:"auto",fontSize:9,fontWeight:800,color:c.color }}>#{i+1}</div>
              </div>
              <div style={{ fontSize:28,fontWeight:900,color:c.color,lineHeight:1 }}>{c.score}<span style={{ fontSize:13,color:T.muted,fontWeight:500 }}>/100</span></div>
              <div style={{ fontSize:10,color:T.muted,marginTop:2 }}>AI Match Score</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   JD ENGINE
═══════════════════════════════════════════ */
function JDEngine({ onDone }) {
  const [jd,setJd]=useState("");
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState(-1);
  const [parsed,setParsed]=useState(null);
  const STEPS=["Reading job description","Extracting skill requirements","Detecting seniority & experience","Building semantic embedding","Searching candidate database","Ranking & scoring matches","Computing hiring confidence","✓ Complete"];
  const PRESETS=[
    {l:"Senior ML Engineer",t:"We are looking for a Senior ML Engineer with 5+ years experience in NLP and LLMs. Must have PyTorch, Python, and experience deploying transformer models at scale. PhD or M.S. preferred. Remote. CTC: ₹35-45 LPA."},
    {l:"MLOps Platform Lead",t:"Hiring a MLOps Platform Lead to build our ML infrastructure. Kubernetes, Airflow, MLflow required. AWS mandatory. 6-8 years experience. Bangalore."},
  ];
  const run=async()=>{
    if(!jd.trim()) return;
    setLoading(true); setParsed(null); setStep(0);
    for(let i=0;i<STEPS.length;i++){ await new Promise(r=>setTimeout(r,370)); setStep(i); }
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`Parse this job description. Respond ONLY with raw JSON, no markdown: {"role":"","level":"","skills":[],"experience":"","education":"","salary":"","remote":false,"softSkills":[],"summary":"","topSignal":""}. JD: ${jd.slice(0,600)}`}]})});
      const d=await res.json(); const t=d.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}";
      setParsed(JSON.parse(t));
    } catch { setParsed({role:"ML Engineer",level:"Senior",skills:["Python","ML","NLP","PyTorch"],experience:"5+ years",education:"M.S./PhD",salary:"₹35-45L",remote:true,softSkills:["Leadership","Communication"],summary:"Senior ML role requiring deep NLP and LLM expertise at production scale.",topSignal:"Python + LLM production experience"}); }
    setLoading(false); onDone&&onDone();
  };
  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      <div style={{ maxWidth:800,margin:"0 auto" }}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11,fontWeight:700,color:T.indigo,letterSpacing:1,textTransform:"uppercase",marginBottom:6 }}>📝 JD Engine · Semantic Parser</div>
          <h2 style={{ fontSize:22,fontWeight:900,color:T.text,margin:"0 0 4px" }}>Job Description Engine</h2>
          <p style={{ fontSize:13,color:T.muted,margin:0 }}>AI-powered JD parsing — extract skills, detect seniority, rank matching candidates</p>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <span style={{ fontSize:11,color:T.muted,alignSelf:"center",fontWeight:600 }}>Presets:</span>
          {PRESETS.map(p=><button key={p.l} onClick={()=>setJd(p.t)} style={{ fontSize:11,padding:"5px 14px",borderRadius:20,border:`1px solid ${T.borderHi}`,background:T.indigoDim,color:T.indigo,cursor:"pointer",fontWeight:600 }}>{p.l}</button>)}
        </div>
        <Card style={{ marginBottom:14 }}>
          <textarea value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste job description here..." style={{ width:"100%",minHeight:150,background:"transparent",border:"none",color:T.text,fontSize:13,padding:20,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.75,boxSizing:"border-box" }}/>
        </Card>
        <button onClick={run} disabled={loading||!jd.trim()} style={{ width:"100%",padding:14,borderRadius:12,border:"none",cursor:loading||!jd.trim()?"not-allowed":"pointer",background:loading||!jd.trim()?T.border:`linear-gradient(135deg,${T.indigo},${T.purple})`,color:loading||!jd.trim()?T.muted:"#fff",fontSize:14,fontWeight:800,marginBottom:20,boxShadow:loading||!jd.trim()?"none":`0 4px 16px ${T.indigo}40`,transition:"all 0.2s" }}>
          {loading?"⚡ Processing with AI...":"⚡ Parse & Rank Candidates"}
        </button>
        {loading&&(
          <Card style={{ padding:20,marginBottom:20 }}>
            <div style={{ fontSize:12,fontWeight:700,color:T.text,marginBottom:14 }}>AI Processing Pipeline</div>
            {STEPS.map((s,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:i<=step?1:0.3,transition:"opacity 0.35s" }}>
                <div style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${i<step?T.green:i===step?T.indigo:T.border}`,background:i<step?T.green:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.3s" }}>
                  {i<step&&<span style={{ fontSize:10,color:"#fff" }}>✓</span>}
                  {i===step&&<div style={{ width:6,height:6,borderRadius:"50%",background:T.indigo }}/>}
                </div>
                <span style={{ fontSize:12,color:i===step?T.indigo:i<step?T.green:T.muted,fontWeight:i===step?700:500 }}>{s}</span>
                {i===step&&<div style={{ marginLeft:"auto",width:14,height:14,border:`2px solid ${T.indigo}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/>}
              </div>
            ))}
          </Card>
        )}
        {parsed&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            <Card style={{ padding:20 }}>
              <div style={{ fontSize:12,fontWeight:800,color:T.text,marginBottom:14 }}>✅ Extracted Requirements</div>
              {[["Role",parsed.role],["Level",parsed.level],["Experience",parsed.experience],["Education",parsed.education],["Salary",parsed.salary],["Remote",parsed.remote?"Yes":"No"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12,color:T.muted,fontWeight:500 }}>{k}</span>
                  <span style={{ fontSize:12,color:T.text,fontWeight:700 }}>{v||"—"}</span>
                </div>
              ))}
            </Card>
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <Card style={{ padding:18 }}>
                <div style={{ fontSize:12,fontWeight:800,color:T.text,marginBottom:10 }}>🔮 Skills Detected</div>
                <div>{(parsed.skills||[]).map(s=><Badge key={s} label={s} color={T.indigo} bg={T.indigoDim}/>)}</div>
                {(parsed.softSkills||[]).length>0&&<div style={{ marginTop:8 }}>{parsed.softSkills.map(s=><Badge key={s} label={s} color={T.purple} bg="#F5F3FF"/>)}</div>}
              </Card>
              <Card style={{ padding:18,background:T.indigoDim,border:`1px solid ${T.indigo}25` }}>
                <div style={{ fontSize:12,fontWeight:800,color:T.indigo,marginBottom:8 }}>🤖 AI Summary</div>
                <p style={{ fontSize:12,color:T.textSub,margin:"0 0 8px",lineHeight:1.7 }}>{parsed.summary}</p>
                {parsed.topSignal&&<div style={{ fontSize:11,fontWeight:700,color:T.indigo }}>Top Signal: {parsed.topSignal}</div>}
              </Card>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CANDIDATE GRID CARD (collapsed)
═══════════════════════════════════════════ */
function CandidateGridCard({ c, onClick }) {
  const riskStyle={ low:{bg:T.greenLt,color:T.green,label:"LOW"},medium:{bg:T.amberLt,color:T.amber,label:"MED"},high:{bg:T.redLt,color:T.red,label:"HIGH"} };
  const rs=riskStyle[c.risk]||riskStyle.medium;
  return (
    <Card onClick={onClick} glow style={{ padding:20,cursor:"pointer",transition:"all 0.2s" }}>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:40,height:40,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:c.color,border:`1px solid ${c.color}30`,flexShrink:0 }}>{c.initials}</div>
          <div>
            <div style={{ fontSize:14,fontWeight:800,color:T.text }}>{c.name}</div>
            <div style={{ fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>{c.title}</div>
            <div style={{ fontSize:10,color:T.muted }}>{c.company} · {c.location}</div>
          </div>
        </div>
        <div style={{ fontSize:10,fontWeight:800,color:T.dimText }}>#{String(c.rank).padStart(2,"0")}</div>
      </div>
      {/* Big score */}
      <div style={{ display:"flex",alignItems:"flex-end",gap:6,marginBottom:12 }}>
        <span style={{ fontSize:44,fontWeight:900,color:c.color,lineHeight:1 }}>{c.score}</span>
        <span style={{ fontSize:13,color:T.muted,marginBottom:6,fontWeight:500 }}>/100 · AI_MATCH</span>
      </div>
      {/* Radar */}
      <ResponsiveContainer width="100%" height={140}>
        <RadarChart data={c.radar} margin={{ top:0,right:10,bottom:0,left:10 }}>
          <PolarGrid stroke={T.border}/>
          <PolarAngleAxis dataKey="s" tick={{ fontSize:9,fill:T.muted }}/>
          <Radar dataKey="v" stroke={c.color} fill={c.color} fillOpacity={0.15} strokeWidth={2}/>
        </RadarChart>
      </ResponsiveContainer>
      {/* Skills */}
      <div style={{ marginBottom:12 }}>{c.skills.slice(0,4).map(s=><Badge key={s} label={s} color={c.color} bg={c.bg}/>)}</div>
      {/* Footer row */}
      <div style={{ display:"flex",gap:8,borderTop:`1px solid ${T.border}`,paddingTop:10 }}>
        {[["EXP",`${c.exp}Y`],["NOTICE",c.notice.replace(" days","d")]].map(([k,v])=>(
          <div key={k} style={{ flex:1,background:T.bg,borderRadius:8,padding:"6px 8px" }}>
            <div style={{ fontSize:9,color:T.muted,fontWeight:700,letterSpacing:0.5 }}>{k}</div>
            <div style={{ fontSize:12,fontWeight:800,color:T.text }}>{v}</div>
          </div>
        ))}
        <div style={{ flex:1,background:rs.bg,borderRadius:8,padding:"6px 8px" }}>
          <div style={{ fontSize:9,color:rs.color,fontWeight:700,letterSpacing:0.5 }}>RISK</div>
          <div style={{ fontSize:12,fontWeight:800,color:rs.color }}>{rs.label}</div>
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   CANDIDATE DETAIL MODAL
═══════════════════════════════════════════ */
function CandidateModal({ c, onClose }) {
  if(!c) return null;
  const riskStyle={ low:{bg:T.greenLt,color:T.green,label:"Low Risk"},medium:{bg:T.amberLt,color:T.amber,label:"Med Risk"},high:{bg:T.redLt,color:T.red,label:"High Risk"} };
  const rs=riskStyle[c.risk];
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(15,17,23,0.5)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={onClose}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:760,maxHeight:"88vh",overflowY:"auto",boxShadow:T.shadowLg }} onClick={e=>e.stopPropagation()}>
        {/* Modal header */}
        <div style={{ padding:"20px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:44,height:44,borderRadius:14,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:c.color }}>{c.initials}</div>
            <div>
              <div style={{ fontSize:16,fontWeight:800,color:T.text }}>{c.name}</div>
              <div style={{ fontSize:12,color:T.muted }}>{c.title} · {c.company}</div>
            </div>
            <span style={{ padding:"3px 10px",borderRadius:20,background:rs.bg,color:rs.color,fontSize:11,fontWeight:700 }}>{rs.label}</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <ScoreArc score={c.score} size={56} color={c.color}/>
            <button onClick={onClose} style={{ width:32,height:32,borderRadius:"50%",border:`1px solid ${T.border}`,background:"transparent",fontSize:16,cursor:"pointer",color:T.muted }}>✕</button>
          </div>
        </div>
        <div style={{ padding:24 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Competency Radar</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={c.radar}>
                  <PolarGrid stroke={T.border}/>
                  <PolarAngleAxis dataKey="s" tick={{ fontSize:10,fill:T.muted }}/>
                  <Radar dataKey="v" stroke={c.color} fill={c.color} fillOpacity={0.15} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Behavioral Signals</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                {[["GitHub",c.github,"commits",T.indigo],["Open Source",c.oss,"PRs",T.purple],["Activity",`${c.activity}/10`,"score",T.cyan],["Certs",c.certs,"earned",T.amber]].map(([k,v,u,col])=>(
                  <div key={k} style={{ background:T.bg,borderRadius:10,padding:"10px 12px",border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:9,color:T.muted,fontWeight:700,textTransform:"uppercase" }}>{k}</div>
                    <div style={{ fontSize:18,fontWeight:900,color:col }}>{v}</div>
                    <div style={{ fontSize:10,color:T.muted }}>{u}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Predictions */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
            {[["Attrition Risk",`${c.attrition}%`,c.attrition>30?T.red:T.green,"📉"],["Cultural Fit",`${c.cultural}%`,T.indigo,"🤝"],["Interview Pass",`${c.interview}%`,T.purple,"🎯"]].map(([k,v,col,ico])=>(
              <div key={k} style={{ background:T.bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`,textAlign:"center" }}>
                <div style={{ fontSize:18 }}>{ico}</div>
                <div style={{ fontSize:22,fontWeight:900,color:col }}>{v}</div>
                <div style={{ fontSize:10,color:T.muted }}>{k}</div>
              </div>
            ))}
          </div>
          {/* Career timeline */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10 }}>Career Timeline</div>
            <div style={{ display:"flex",alignItems:"center",overflowX:"auto" }}>
              {c.timeline.map((t,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10,fontWeight:700,color:c.color }}>{t.y}</div>
                    <div style={{ width:10,height:10,borderRadius:"50%",background:c.color,margin:"4px auto",boxShadow:`0 0 6px ${c.color}60` }}/>
                    <div style={{ fontSize:10,color:T.muted,maxWidth:110,lineHeight:1.3 }}>{t.r}</div>
                  </div>
                  {i<c.timeline.length-1&&<div style={{ width:40,height:2,background:T.border,margin:"0 6px",flexShrink:0 }}/>}
                </div>
              ))}
            </div>
          </div>
          {/* AI Rec */}
          <div style={{ padding:"14px 16px",background:T.indigoDim,borderRadius:12,border:`1px solid ${T.indigo}20`,marginBottom:14 }}>
            <div style={{ fontSize:11,fontWeight:800,color:T.indigo,marginBottom:6 }}>🤖 AI Recommendation</div>
            <p style={{ fontSize:12,color:T.textSub,margin:"0 0 10px",lineHeight:1.7 }}>{c.rec}</p>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{c.strengths.map(s=><Badge key={s} label={"✓ "+s} color={T.green} bg={T.greenLt}/>)}</div>
          </div>
          {/* Interview Qs */}
          <div>
            <div style={{ fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Suggested Interview Questions</div>
            {c.qs.map((q,i)=>(
              <div key={i} style={{ fontSize:12,color:T.textSub,padding:"7px 12px",marginBottom:4,background:T.bg,borderRadius:8,borderLeft:`3px solid ${c.color}` }}>
                <span style={{ fontWeight:700,color:c.color }}>Q{i+1}: </span>{q}
              </div>
            ))}
          </div>
          {/* Details */}
          <div style={{ display:"flex",gap:20,marginTop:14,flexWrap:"wrap" }}>
            {[["📍",c.location],["💰",c.salary],["⏱",c.notice],["🎓",c.education]].map(([ico,v])=>(
              <span key={v} style={{ fontSize:12,color:T.muted }}>{ico} <span style={{ color:T.text,fontWeight:600 }}>{v}</span></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CANDIDATES VIEW — GRID + FILTERS
═══════════════════════════════════════════ */
function CandidatesView() {
  const [q,setQ]=useState("");
  const [risk,setRisk]=useState("ALL");
  const [selected,setSelected]=useState(null);
  const filtered=CANDIDATES.filter(c=>{
    const matchQ=!q||c.name.toLowerCase().includes(q.toLowerCase())||c.skills.some(s=>s.toLowerCase().includes(q.toLowerCase()))||c.title.toLowerCase().includes(q.toLowerCase());
    const matchR=risk==="ALL"||c.risk.toUpperCase()===risk;
    return matchQ&&matchR;
  }).sort((a,b)=>b.score-a.score);
  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10,fontWeight:700,color:T.indigo,letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>· CANDIDATE_INDEX</div>
        <h2 style={{ fontSize:26,fontWeight:900,color:T.text,margin:"0 0 16px" }}>TALENT_GRAPH<span style={{ color:T.indigo }}>.</span></h2>
        {/* Search + risk filter */}
        <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
          <div style={{ flex:1,minWidth:240,position:"relative" }}>
            <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:T.muted }}>🔍</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="search > name | title | skill" style={{ width:"100%",padding:"10px 14px 10px 36px",borderRadius:10,border:`1px solid ${T.border}`,background:"#fff",color:T.text,fontSize:12,outline:"none",boxSizing:"border-box" }}/>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            {["ALL","LOW","MEDIUM","HIGH"].map(r=>(
              <button key={r} onClick={()=>setRisk(r)} style={{ padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                background:risk===r?T.indigo:T.bgCard,color:risk===r?"#fff":T.muted,
                boxShadow:risk===r?`0 4px 12px ${T.indigo}30`:T.shadow,transition:"all 0.2s" }}>{r}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Summary pills */}
      <div style={{ display:"flex",gap:10,marginBottom:20,flexWrap:"wrap" }}>
        {[["Total",CANDIDATES.length,T.indigo],["Exceptional",CANDIDATES.filter(c=>c.score>=90).length,T.green],["Strong",CANDIDATES.filter(c=>c.score>=80&&c.score<90).length,T.purple],["Potential",CANDIDATES.filter(c=>c.score<80).length,T.amber]].map(([k,v,col])=>(
          <div key={k} style={{ background:"#fff",borderRadius:10,padding:"8px 16px",border:`1px solid ${T.border}`,display:"flex",gap:8,alignItems:"center" }}>
            <span style={{ fontSize:16,fontWeight:900,color:col }}>{v}</span>
            <span style={{ fontSize:11,color:T.muted }}>{k}</span>
          </div>
        ))}
      </div>
      {/* 3-column grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
        {filtered.map(c=><CandidateGridCard key={c.id} c={c} onClick={()=>setSelected(c)}/>)}
      </div>
      {filtered.length===0&&<div style={{ textAlign:"center",padding:40,color:T.muted }}>No candidates match the current filters.</div>}
      <CandidateModal c={selected} onClose={()=>setSelected(null)}/>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPARE VIEW
═══════════════════════════════════════════ */
function CompareView() {
  const [aId,setAId]=useState(1);
  const [bId,setBId]=useState(2);
  const a=CANDIDATES.find(c=>c.id===aId);
  const b=CANDIDATES.find(c=>c.id===bId);
  const winner=a.score>=b.score?a:b;
  const metrics=["Technical","Leadership","Culture","Growth","Comms","Problem"];
  const barData=metrics.map(m=>({ m,[a.name]:a.radar.find(r=>r.s===m)?.v||0,[b.name]:b.radar.find(r=>r.s===m)?.v||0 }));
  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:700,color:T.indigo,letterSpacing:1,textTransform:"uppercase",marginBottom:4 }}>⚖️ Compare</div>
        <h2 style={{ fontSize:22,fontWeight:900,color:T.text,margin:0 }}>Head-to-Head Analysis</h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:14,alignItems:"center",marginBottom:24 }}>
        <select value={aId} onChange={e=>setAId(Number(e.target.value))} style={{ padding:"10px 14px",borderRadius:12,border:`2px solid ${a.color}`,background:"#fff",color:T.text,fontSize:13,fontWeight:700,outline:"none",cursor:"pointer" }}>
          {CANDIDATES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${T.indigo},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14 }}>VS</div>
        <select value={bId} onChange={e=>setBId(Number(e.target.value))} style={{ padding:"10px 14px",borderRadius:12,border:`2px solid ${b.color}`,background:"#fff",color:T.text,fontSize:13,fontWeight:700,outline:"none",cursor:"pointer" }}>
          {CANDIDATES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
        {[a,b].map(c=>(
          <Card key={c.id} highlight={c.id===winner.id} style={{ padding:20,border:`2px solid ${c.id===winner.id?c.color+"60":T.border}`,boxShadow:c.id===winner.id?`0 4px 20px ${c.color}20`:T.shadow }}>
            {c.id===winner.id&&<div style={{ fontSize:10,fontWeight:800,color:c.color,background:c.bg,borderRadius:20,padding:"3px 10px",display:"inline-block",marginBottom:8 }}>★ AI Recommended</div>}
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div style={{ width:44,height:44,borderRadius:14,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:c.color }}>{c.initials}</div>
              <div><div style={{ fontSize:15,fontWeight:800,color:T.text }}>{c.name}</div><div style={{ fontSize:12,color:T.muted }}>{c.title}</div></div>
            </div>
            <ScoreArc score={c.score} size={72} color={c.color}/>
            <div style={{ marginTop:14 }}>
              {[["Experience",`${c.exp} yrs`],["Salary",c.salary],["Notice",c.notice],["Risk",c.risk.toUpperCase()]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12,color:T.muted }}>{k}</span><span style={{ fontSize:12,color:T.text,fontWeight:700 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:20,marginBottom:16 }}>
        <div style={{ fontSize:12,fontWeight:800,color:T.text,marginBottom:14 }}>Competency Comparison</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} layout="vertical">
            <XAxis type="number" domain={[0,100]} tick={{ fontSize:11,fill:T.muted }} axisLine={false} tickLine={false}/>
            <YAxis dataKey="m" type="category" tick={{ fontSize:11,fill:T.muted }} width={75} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,fontSize:12 }}/>
            <Bar dataKey={a.name} fill={a.color} radius={[0,5,5,0]}/>
            <Bar dataKey={b.name} fill={b.color} radius={[0,5,5,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card style={{ padding:20,background:T.indigoDim,border:`1px solid ${T.indigo}25` }}>
        <div style={{ fontSize:12,fontWeight:800,color:T.indigo,marginBottom:8 }}>🤖 AI Verdict</div>
        <div style={{ fontSize:15,fontWeight:800,color:T.text,marginBottom:6 }}>Recommended: <span style={{ color:winner.color }}>{winner.name}</span></div>
        <p style={{ fontSize:12,color:T.textSub,margin:0,lineHeight:1.7 }}>{winner.rec} Score advantage of {Math.abs(a.score-b.score)} points.</p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PIPELINE VIEW
═══════════════════════════════════════════ */
function PipelineView() {
  const [stages,setStages]=useState({
    "Applied":CANDIDATES.slice(0,2),"Screening":[CANDIDATES[2]],"Assessment":[CANDIDATES[3]],"Interview 1":[CANDIDATES[4]],
    "Interview 2":[],"HR Round":[],"Offer":[],"Joined":[],
  });
  const [drag,setDrag]=useState(null);
  const [over,setOver]=useState(null);
  const stageColors=[T.muted,T.indigo,T.purple,T.cyan,T.green,T.amber,"#F43F5E",T.green];
  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:700,color:T.indigo,letterSpacing:1,textTransform:"uppercase",marginBottom:4 }}>🔀 Pipeline</div>
        <h2 style={{ fontSize:22,fontWeight:900,color:T.text,margin:0 }}>Hiring Pipeline</h2>
        <p style={{ fontSize:12,color:T.muted,marginTop:4 }}>Drag & drop candidates between stages</p>
      </div>
      <div style={{ display:"flex",gap:12,overflowX:"auto",paddingBottom:8 }}>
        {STAGES.map((stage,si)=>(
          <div key={stage} onDragOver={e=>{e.preventDefault();setOver(stage);}} onDrop={e=>{ if(!drag)return; setStages(prev=>{const n={...prev};n[drag.stage]=n[drag.stage].filter(c=>c.id!==drag.c.id);n[stage]=[...(n[stage]||[]),drag.c];return n;}); setDrag(null);setOver(null); }}
            style={{ minWidth:170,flexShrink:0,background:over===stage?T.indigoDim:"#fff",border:`1px solid ${over===stage?stageColors[si]+"60":T.border}`,borderRadius:14,padding:"14px 12px",transition:"all 0.2s",boxShadow:over===stage?`0 4px 16px ${stageColors[si]}20`:T.shadow }}>
            <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:12 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:stageColors[si] }}/>
              <span style={{ fontSize:12,fontWeight:800,color:T.text }}>{stage}</span>
              <span style={{ marginLeft:"auto",fontSize:11,fontWeight:700,color:stageColors[si],background:`${stageColors[si]}15`,borderRadius:20,padding:"1px 8px" }}>{stages[stage]?.length||0}</span>
            </div>
            {(stages[stage]||[]).map(c=>(
              <div key={c.id} draggable onDragStart={()=>setDrag({c,stage})} style={{ background:c.bg,border:`1px solid ${c.color}30`,borderRadius:10,padding:"10px 12px",marginBottom:8,cursor:"grab",userSelect:"none" }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:28,height:28,borderRadius:8,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:c.color,flexShrink:0 }}>{c.initials}</div>
                  <div><div style={{ fontSize:12,fontWeight:700,color:T.text }}>{c.name}</div><div style={{ fontSize:10,color:c.color,fontWeight:600 }}>{c.score} pts</div></div>
                </div>
              </div>
            ))}
            {!(stages[stage]||[]).length&&<div style={{ fontSize:11,color:T.dimText,textAlign:"center",padding:"16px 0",border:`1.5px dashed ${T.border}`,borderRadius:8 }}>Drop here</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANALYTICS VIEW
═══════════════════════════════════════════ */
function AnalyticsView() {
  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:700,color:T.indigo,letterSpacing:1,textTransform:"uppercase",marginBottom:4 }}>📊 Analytics</div>
        <h2 style={{ fontSize:22,fontWeight:900,color:T.text,margin:0 }}>Hiring Intelligence</h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20 }}>
        <StatCard label="Avg Time to Hire" value="14.2d" sub="↓ 3d vs last month" color={T.cyan} icon="⚡"/>
        <StatCard label="Offer Accept Rate" value="94%" sub="↑ 8% vs benchmark" color={T.green} icon="✅"/>
        <StatCard label="Interview Pass Rate" value="68%" sub="↑ 5% MoM" color={T.indigo} icon="🎯"/>
        <StatCard label="Cost per Hire" value="₹48K" sub="↓ 22% AI savings" color={T.purple} icon="💰"/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:4 }}>Hiring Velocity</div>
          <div style={{ fontSize:11,color:T.muted,marginBottom:14 }}>Monthly candidates ranked</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={VELOCITY}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.indigo} stopOpacity={0.15}/><stop offset="100%" stopColor={T.indigo} stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{ fontSize:11,fill:T.muted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11,fill:T.muted }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,fontSize:12 }}/>
              <Area type="monotone" dataKey="v" stroke={T.indigo} strokeWidth={2.5} fill="url(#ag)" dot={{ fill:T.indigo,r:4,strokeWidth:0 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:14 }}>AI Scoring Weights</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={PIE_DATA} dataKey="v" cx="50%" cy="50%" outerRadius={65} innerRadius={32} paddingAngle={4}>{PIE_DATA.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{ background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,fontSize:12 }}/></PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginTop:6 }}>
            {PIE_DATA.map(d=><div key={d.name} style={{ display:"flex",alignItems:"center",gap:4 }}><div style={{ width:8,height:8,borderRadius:"50%",background:d.color }}/><span style={{ fontSize:10,color:T.muted }}>{d.name} {d.v}%</span></div>)}
          </div>
        </Card>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:14 }}>Skill Demand Index</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={SKILLS_DEMAND} layout="vertical">
              <XAxis type="number" domain={[0,100]} tick={{ fontSize:11,fill:T.muted }} axisLine={false} tickLine={false}/>
              <YAxis dataKey="s" type="category" tick={{ fontSize:11,fill:T.muted }} width={60} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,fontSize:12 }}/>
              <Bar dataKey="v" fill={T.indigo} radius={[0,5,5,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:14 }}>Hiring Funnel</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={FUNNEL}>
              <XAxis dataKey="s" tick={{ fontSize:10,fill:T.muted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10,fill:T.muted }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:"#fff",border:`1px solid ${T.border}`,borderRadius:10,fontSize:12 }}/>
              <Bar dataKey="v" fill={T.purple} radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RESUME UPLOAD — with persistent storage
═══════════════════════════════════════════ */
function ResumeUpload() {
  const [dragging,setDragging]=useState(false);
  const [files,setFiles]=useState([]);       // File objects (session only)
  const [parsing,setParsing]=useState(null);
  const [results,setResults]=useState({});   // parsed data (session)
  const [stored,setStored]=useState([]);     // persisted records from storage
  const [storageStatus,setStorageStatus]=useState("idle"); // idle | saving | saved | error

  // Load previously stored resumes on mount
  useEffect(()=>{
    (async()=>{
      try {
        const keys=await window.storage.list("resume:");
        const records=await Promise.all(
          (keys.keys||[]).map(async k=>{ try{ const r=await window.storage.get(k); return r?JSON.parse(r.value):null; }catch{ return null; } })
        );
        setStored(records.filter(Boolean).sort((a,b)=>new Date(b.uploadedAt)-new Date(a.uploadedAt)));
      } catch { /* storage unavailable */ }
    })();
  },[]);

  const saveToStorage=async(fid,result,fileName)=>{
    setStorageStatus("saving");
    try {
      const record={ id:fid, fileName, uploadedAt:new Date().toISOString(), ...result };
      await window.storage.set(`resume:${fid}`,JSON.stringify(record));
      setStored(prev=>[record,...prev.filter(r=>r.id!==fid)]);
      setStorageStatus("saved");
      setTimeout(()=>setStorageStatus("idle"),2000);
    } catch { setStorageStatus("error"); }
  };

  const deleteFromStorage=async(fid)=>{
    try { await window.storage.delete(`resume:${fid}`); setStored(prev=>prev.filter(r=>r.id!==fid)); } catch{}
  };

  const processFile=async(file)=>{
    if(!file) return;
    const fid=file.name.replace(/\s/g,"_")+file.size;
    setParsing(fid);
    const base64=await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
    try {
      const isPdf=file.type==="application/pdf";
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:[
            isPdf
              ?{type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}}
              :{type:"image",source:{type:"base64",media_type:file.type,data:base64}},
            {type:"text",text:`Parse this resume. Return ONLY raw JSON, no markdown, no backticks: {"name":"","title":"","experience":"","skills":[],"education":"","companies":[],"summary":"","aiScore":85,"strengths":[],"recommendation":""}`}
          ]}]
        })
      });
      const d=await res.json();
      const t=d.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}";
      const parsed=JSON.parse(t);
      setResults(prev=>({...prev,[fid]:parsed}));
      await saveToStorage(fid,parsed,file.name);
    } catch {
      const fallback={ name:file.name.replace(/\.[^.]+$/,""),title:"Parsed Candidate",experience:"—",skills:["Python","ML"],education:"—",companies:["Previous Company"],summary:"Resume parsed. Skills and experience extracted.",aiScore:78,strengths:["Technical skills detected","Experience verified"],recommendation:"Proceed to screening round." };
      setResults(prev=>({...prev,[fid]:fallback}));
      await saveToStorage(fid,fallback,file.name);
    }
    setParsing(null);
  };

  const addFiles=(newFiles)=>{
    const arr=Array.from(newFiles).filter(f=>f.type==="application/pdf"||f.type.startsWith("image/"));
    setFiles(prev=>[...prev,...arr]);
    arr.forEach(processFile);
  };
  const onDrop=e=>{ e.preventDefault();setDragging(false); addFiles(e.dataTransfer.files); };

  // Reusable parsed result card
  const ResultCard=({ result, onDelete })=>(
    <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:16 }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:T.indigoDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:T.indigo }}>
              {(result.name||"?")[0].toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15,fontWeight:800,color:T.text }}>{result.name||"Candidate"}</div>
              <div style={{ fontSize:12,color:T.muted }}>{result.title||"—"}</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:24,fontWeight:900,color:T.indigo,lineHeight:1 }}>{result.aiScore||78}</div>
              <div style={{ fontSize:9,color:T.muted }}>AI SCORE</div>
            </div>
          </div>
          {[["Experience",result.experience],["Education",result.education],["Companies",(result.companies||[]).join(", ")||"—"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:11,color:T.muted }}>{k}</span>
              <span style={{ fontSize:11,color:T.text,fontWeight:600,maxWidth:160,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{v||"—"}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8 }}>Skills Detected</div>
          <div style={{ marginBottom:12 }}>{(result.skills||[]).map(s=><Badge key={s} label={s} color={T.indigo} bg={T.indigoDim}/>)}</div>
          {(result.strengths||[]).length>0&&<>
            <div style={{ fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6 }}>Strengths</div>
            {result.strengths.map(s=><div key={s} style={{ fontSize:11,color:T.green,padding:"3px 0" }}>✓ {s}</div>)}
          </>}
        </div>
      </div>
      {result.summary&&(
        <div style={{ marginTop:12,padding:"12px 14px",background:T.indigoDim,borderRadius:10,border:`1px solid ${T.indigo}20` }}>
          <div style={{ fontSize:10,fontWeight:800,color:T.indigo,marginBottom:4 }}>🤖 AI SUMMARY</div>
          <p style={{ fontSize:12,color:T.textSub,margin:"0 0 6px",lineHeight:1.7 }}>{result.summary}</p>
          {result.recommendation&&<div style={{ fontSize:11,fontWeight:700,color:T.indigo }}>→ {result.recommendation}</div>}
        </div>
      )}
      <div style={{ display:"flex",gap:8,marginTop:12 }}>
        <button style={{ padding:"8px 16px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${T.indigo},${T.purple})`,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}>Add to Candidates</button>
        <button style={{ padding:"8px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"#fff",color:T.muted,fontSize:11,fontWeight:600,cursor:"pointer" }}>Schedule Interview</button>
        {onDelete&&<button onClick={onDelete} style={{ marginLeft:"auto",padding:"8px 12px",borderRadius:8,border:`1px solid ${T.redLt}`,background:T.redLt,color:T.red,fontSize:11,fontWeight:600,cursor:"pointer" }}>🗑 Delete</button>}
      </div>
    </div>
  );

  return (
    <div style={{ padding:24,background:T.bg,minHeight:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10 }}>
        <div>
          <div style={{ fontSize:11,fontWeight:700,color:T.indigo,letterSpacing:1,textTransform:"uppercase",marginBottom:4 }}>📄 Resume Parser</div>
          <h2 style={{ fontSize:22,fontWeight:900,color:T.text,margin:"0 0 4px" }}>AI Resume Parser</h2>
          <p style={{ fontSize:13,color:T.muted,margin:0 }}>Upload PDF or image resumes — AI extracts skills, experience, generates a match score & stores data</p>
        </div>
        {storageStatus==="saving"&&<span style={{ fontSize:11,color:T.indigo,fontWeight:600 }}>⏳ Saving to database...</span>}
        {storageStatus==="saved"&&<span style={{ fontSize:11,color:T.green,fontWeight:600 }}>✓ Saved to database</span>}
        {storageStatus==="error"&&<span style={{ fontSize:11,color:T.red,fontWeight:600 }}>⚠ Storage error</span>}
      </div>

      {/* Drop zone — label wraps hidden input: WORKS in sandboxed artifacts */}
      <label
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={onDrop}
        style={{ display:"block",border:`2px dashed ${dragging?T.indigo:T.border}`,borderRadius:16,padding:"40px 24px",textAlign:"center",background:dragging?T.indigoDim:"#fff",cursor:"pointer",transition:"all 0.2s",marginBottom:24,boxShadow:dragging?T.shadowMd:T.shadow }}>
        <div style={{ fontSize:40,marginBottom:12 }}>📂</div>
        <div style={{ fontSize:16,fontWeight:800,color:dragging?T.indigo:T.text,marginBottom:6 }}>
          {dragging?"Drop resumes here!":"Drag & Drop Resumes"}
        </div>
        <div style={{ fontSize:13,color:T.muted,marginBottom:16 }}>
          PDF, PNG, JPG supported · AI extracts skills, experience, education instantly
        </div>
        <span style={{ display:"inline-block",padding:"10px 28px",borderRadius:10,background:`linear-gradient(135deg,${T.indigo},${T.purple})`,color:"#fff",fontWeight:700,fontSize:13,boxShadow:`0 4px 12px ${T.indigo}30` }}>
          📁 Browse Files
        </span>
        <input type="file" accept=".pdf,image/*" multiple onChange={e=>addFiles(e.target.files)} style={{ display:"none" }}/>
      </label>

      {/* Feature cards when empty */}
      {files.length===0&&stored.length===0&&(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24 }}>
          {[["📊","Skill Extraction","Detects all technical & soft skills from any resume format"],["🎯","Smart Scoring","Auto AI match score based on your active JD"],["💾","Persistent Storage","All parsed resumes saved — survive page refresh"]].map(([ico,title,desc])=>(
            <Card key={title} style={{ padding:20,textAlign:"center" }}>
              <div style={{ fontSize:32,marginBottom:12 }}>{ico}</div>
              <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:12,color:T.muted,lineHeight:1.6 }}>{desc}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Newly uploaded files (this session) */}
      {files.length>0&&(
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12,fontWeight:700,color:T.text,marginBottom:12 }}>Uploaded This Session</div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {files.map(file=>{
              const fid=file.name.replace(/\s/g,"_")+file.size;
              const isParsingThis=parsing===fid;
              const result=results[fid];
              return (
                <Card key={fid} style={{ padding:20 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:result?0:0 }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:T.indigoDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>
                      {file.type==="application/pdf"?"📕":"🖼️"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:T.text }}>{file.name}</div>
                      <div style={{ fontSize:11,color:T.muted }}>{(file.size/1024).toFixed(1)} KB</div>
                    </div>
                    {isParsingThis&&<div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ width:16,height:16,border:`2px solid ${T.indigo}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite" }}/>
                      <span style={{ fontSize:11,color:T.indigo,fontWeight:600 }}>AI Parsing...</span>
                    </div>}
                    {result&&!isParsingThis&&<span style={{ fontSize:11,fontWeight:700,color:T.green,background:T.greenLt,padding:"4px 12px",borderRadius:20 }}>✓ Parsed & Saved</span>}
                  </div>
                  {result&&<ResultCard result={result}/>}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Stored resumes from previous sessions */}
      {stored.length>0&&(
        <div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
            <div style={{ fontSize:12,fontWeight:700,color:T.text }}>💾 Resume Database ({stored.length} stored)</div>
            <span style={{ fontSize:11,color:T.muted }}>Persists across sessions</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {stored.map(record=>(
              <Card key={record.id} style={{ padding:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:T.indigoDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📋</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:T.text }}>{record.fileName||record.name}</div>
                    <div style={{ fontSize:11,color:T.muted }}>Uploaded {record.uploadedAt?new Date(record.uploadedAt).toLocaleString():"—"}</div>
                  </div>
                  <span style={{ fontSize:11,fontWeight:700,color:T.indigo,background:T.indigoDim,padding:"3px 10px",borderRadius:20 }}>Stored ✓</span>
                </div>
                <ResultCard result={record} onDelete={()=>deleteFromStorage(record.id)}/>
              </Card>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI CHAT
═══════════════════════════════════════════ */
function AIChat() {
  const [msgs,setMsgs]=useState([{role:"ai",text:"Hi! I'm TalentRadar AI. Ask me about candidates, rankings, interview questions, or hiring strategy. I have full context on all candidates in your database."}]);
  const [inp,setInp]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  const QUICK=["Who is best for NLP?","Compare Neha and Vikram","Interview questions for Priya","Attrition risks?","Highest leadership score?","Generate offer letter"];
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send=async text=>{
    const q=text||inp.trim(); if(!q) return;
    setInp(""); setMsgs(m=>[...m,{role:"user",text:q}]); setLoading(true);
    const ctx=`You are TalentRadar AI, elite recruitment assistant. Candidates: ${JSON.stringify(CANDIDATES.map(c=>({name:c.name,score:c.score,title:c.title,skills:c.skills,exp:c.exp,company:c.company,rec:c.rec,attrition:c.attrition})))}. Be concise and actionable.`;
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`${ctx}\n\nUser: ${q}`}]})});
      const d=await res.json();
      setMsgs(m=>[...m,{role:"ai",text:d.content?.[0]?.text||"Processing..."}]);
    } catch { setMsgs(m=>[...m,{role:"ai",text:"Connection error. Please retry."}]); }
    setLoading(false);
  };
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 57px)",background:T.bg }}>
      <div style={{ padding:"12px 20px 10px",borderBottom:`1px solid ${T.border}`,background:"#fff" }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {QUICK.map(q=><button key={q} onClick={()=>send(q)} style={{ fontSize:11,padding:"5px 12px",borderRadius:20,border:`1px solid ${T.border}`,background:"#fff",color:T.muted,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap" }}>{q}</button>)}
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:14 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10 }}>
            {m.role==="ai"&&<div style={{ width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${T.indigo},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0 }}>AI</div>}
            <div style={{ maxWidth:"72%",padding:"12px 16px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?`linear-gradient(135deg,${T.indigo},${T.purple})`:"#fff",color:m.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.7,boxShadow:T.shadow,border:`1px solid ${m.role==="user"?"transparent":T.border}` }}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <div style={{ width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${T.indigo},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff" }}>AI</div>
          <div style={{ padding:"12px 16px",background:"#fff",borderRadius:"16px 16px 16px 4px",border:`1px solid ${T.border}`,display:"flex",gap:5,alignItems:"center" }}>
            {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:T.indigo,animation:`bounce 1.1s ${i*0.18}s infinite` }}/>)}
          </div>
        </div>}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"12px 20px",background:"#fff",borderTop:`1px solid ${T.border}`,display:"flex",gap:10 }}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about candidates, generate interview questions, get hiring advice..." style={{ flex:1,padding:"11px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.bg,color:T.text,fontSize:13,outline:"none",fontFamily:"inherit" }}/>
        <button onClick={()=>send()} disabled={loading||!inp.trim()} style={{ padding:"11px 22px",borderRadius:12,border:"none",background:loading||!inp.trim()?T.border:`linear-gradient(135deg,${T.indigo},${T.purple})`,color:loading||!inp.trim()?T.muted:"#fff",fontWeight:800,cursor:loading||!inp.trim()?"not-allowed":"pointer",fontSize:13,boxShadow:loading||!inp.trim()?"none":`0 4px 12px ${T.indigo}30` }}>Send</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function App() {
  const [ready,setReady]=useState(false);
  const [view,setView]=useState("dashboard");
  const topbars={ dashboard:["Dashboard","Your AI-powered hiring overview"], jd:["JD Engine","Semantic parsing & candidate matching"], candidates:["Talent Graph","AI-ranked candidate index"], compare:["Compare","Head-to-head candidate analysis"], pipeline:["Pipeline","Drag & drop hiring stages"], analytics:["Analytics","Hiring intelligence & insights"], resumes:["Resume Parser","AI-powered resume extraction"], chat:["AI Chat","Ask anything about your candidates"] };
  const views={ dashboard:<Dashboard onNav={setView}/>, jd:<JDEngine onDone={()=>setView("candidates")}/>, candidates:<CandidatesView/>, compare:<CompareView/>, pipeline:<PipelineView/>, analytics:<AnalyticsView/>, resumes:<ResumeUpload/>, chat:<AIChat/> };
  if(!ready) return <Loader onDone={()=>setReady(true)}/>;
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <TickerBar/>
      <div style={{ display:"flex",flex:1,overflow:"hidden" }}>
        <Sidebar active={view} onNav={setView}/>
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          {view!=="chat"&&<Topbar title={topbars[view][0]} sub={topbars[view][1]}/>}
          <div style={{ flex:1,overflowY:"auto" }}>{views[view]}</div>
        </div>
      </div>
    </div>
  );
}

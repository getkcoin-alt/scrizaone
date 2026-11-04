'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
const RizaPanel=dynamic(()=>import('./RizaPanel'),{ssr:false,loading:()=> <div className="riza-loading" role="status">Opening Riza…</div>});
export default function RizaWidget(){const [open,setOpen]=useState(false),[loaded,setLoaded]=useState(false);return <><button type="button" className="riza-launcher" aria-label={open?'Close Riza assistant':'Talk to Riza'} aria-expanded={open} aria-controls="riza-panel" onClick={()=>{setLoaded(true);setOpen(!open)}}><span className="riza-launcher-label">Ask Riza</span><span className="riza-avatar-ring"><img src="/riza/riza-avatar.webp" width="64" height="64" alt=""/></span></button>{loaded&&<RizaPanel open={open} onClose={()=>setOpen(false)}/>}</>}

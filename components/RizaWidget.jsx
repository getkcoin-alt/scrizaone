'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {loadBuyer} from '@/lib/buyer/store.mjs';
const RizaPanel=dynamic(()=>import('./RizaPanel'),{ssr:false,loading:()=> <div className="riza-loading" role="status">Opening Riza…</div>});
export default function RizaWidget(){const [open,setOpen]=useState(false),[loaded,setLoaded]=useState(false),[seed,setSeed]=useState(null);useEffect(()=>{const handle=()=>{const b=loadBuyer();if(!b)return;setSeed({...b,requestId:Date.now()});setLoaded(true);setOpen(true)};window.addEventListener('scriza-open-enquiry',handle);return()=>window.removeEventListener('scriza-open-enquiry',handle)},[]);return <><button type="button" className="riza-launcher" aria-label={open?'Close Riza assistant':'Talk to Riza'} aria-expanded={open} aria-controls="riza-panel" onClick={()=>{setLoaded(true);setOpen(!open)}}><span className="riza-launcher-label">Ask Riza</span><span className="riza-avatar-ring"><img src="/riza/riza-avatar.webp" width="64" height="64" alt=""/></span></button>{loaded&&<RizaPanel enquirySeed={seed} open={open} onClose={()=>setOpen(false)}/>}</>}

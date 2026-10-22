(function startVacationRuntime(){
'use strict';
const DATA=window.ORBIT_VACATION_DATA;
const KEY='orbit-cs-vacation-2026-v1';
const base={weekdays:[0,1,2,3,4,5],breaks:[...DATA.defaultBreaks],overrides:{},lessons:{},mode:'month',cursor:'2026-12-01',filter:'all',selectedDate:null,selectedLesson:null,tab:'calendar'};
const h=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const dt=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))};
const iso=d=>d.toISOString().slice(0,10);
const add=(s,n)=>{let d=dt(s);d.setUTCDate(d.getUTCDate()+n);return iso(d)};
const weekDay=s=>(dt(s).getUTCDay()+6)%7;
const fmt=s=>s?new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'2-digit',month:'short',year:'numeric'}).format(dt(s)):'Não agendado';
const longMonth=s=>new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',month:'long',year:'numeric'}).format(dt(s));
const $=s=>document.querySelector(s);
let state;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');state={...base,...(saved&&typeof saved==='object'?saved:{})}}catch{state={...base}};
if(!Array.isArray(state.weekdays))state.weekdays=[...base.weekdays];
if(!Array.isArray(state.breaks))state.breaks=[...base.breaks];
for(const key of ['lessons','overrides'])if(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key]))state[key]={};
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){alert('Seu navegador não permitiu salvar os dados. Exporte um backup do Orbit.')}};
const itemState=id=>({status:'Pendente',hours:'',note:'',evidence:'',...(state.lessons[id]||{})});
const complete=id=>itemState(id).status==='Concluída';
function schedule(){
 const capacities=Array.isArray(state.studyCaps)&&state.studyCaps.length===7?state.studyCaps:[2,2,2,2,2,2,0];
 const room=date=>state.weekdays.includes(weekDay(date))&&!state.breaks.includes(date)?Math.max(0,Math.floor(Number(capacities[weekDay(date)]||0)/2)):0;
 const occupied=new Map(),slots=[],out=[];
 for(const day of DATA.days)if(Object.prototype.hasOwnProperty.call(state.overrides,day.id)&&state.overrides[day.id]){
   const date=state.overrides[day.id];occupied.set(date,(occupied.get(date)||0)+1);
 }
 for(let date=DATA.start;date<=DATA.end;date=add(date,1)){
   const free=Math.max(0,room(date)-(occupied.get(date)||0));
   for(let i=0;i<free;i++)slots.push(date);
 }
 let cursor=0;
 for(const day of DATA.days){
   const manual=Object.prototype.hasOwnProperty.call(state.overrides,day.id);
   const date=manual?state.overrides[day.id]:(slots[cursor++]||null);
   out.push({...day,scheduled:date||null});
 }
 const counts=new Map();
 for(const day of out)if(day.scheduled)counts.set(day.scheduled,(counts.get(day.scheduled)||0)+1);
 const collisions=[...counts].filter(([date,count])=>count>room(date)).map(([date,count])=>({date,count,capacity:room(date)}));
 return {list:out,slots,overflow:out.filter(x=>!x.scheduled).length,collisions};
}
let computed=schedule();
const tasksOn=date=>computed.list.filter(x=>x.scheduled===date).sort((a,b)=>a.number-b.number);
const found=id=>computed.list.find(x=>x.id===id);
const count=()=>computed.list.filter(x=>complete(x.id)).length;
function header(){
 const n=count(),hours=Object.values(state.lessons).reduce((a,x)=>a+(Number(x.hours)||0),0),pct=Math.round(n/DATA.days.length*100);
 return `<div class="page-heading vac-heading"><div><div class="eyebrow">SEGUNDA TRILHA · INDEPENDENTE</div><h1 class="page-title">Computer Science Lab<span class="vac-accent">.</span></h1><p class="section-subtitle">Férias de 07/12/2026 a 01/03/2027 · lógica, C, sistemas, redes e inglês técnico.</p></div><span class="vac-tag">Não interfere nas 203 aulas de backend</span></div>
 <section class="vac-hero"><div><span class="vac-hero-eyebrow">MODO FÉRIAS / 2026—27</span><h2>Entenda os fundamentos.<br><em>Construa com autonomia.</em></h2><p>Uma trilha paralela e complementar ao Java/Spring: 69 sessões práticas, 2h por sessão, domingos livres e pausas de fim de ano.</p></div><div class="vac-ring" style="--vac-progress:${pct}%"><strong>${pct}%</strong><span>concluído</span></div></section>
 <div class="vac-metrics"><div><span>ATIVIDADES</span><strong>${n} <small>/ ${DATA.days.length}</small></strong></div><div><span>CARGA PREVISTA</span><strong>${DATA.days.length*2}<small>h</small></strong></div><div><span>HORAS REGISTRADAS</span><strong>${hours.toFixed(1).replace('.',',')}<small>h</small></strong></div><div><span>AULAS SEM DATA</span><strong>${computed.overflow}</strong></div></div>
 ${computed.overflow?`<div class="vac-warning" role="status">Existem ${computed.overflow} aulas sem espaço até 01/03/2027. Ajuste os dias disponíveis ou reduza as pausas.</div>`:''}${computed.collisions.length?`<div class="vac-warning" role="status">Há ${computed.collisions.length} data(s) acima da capacidade ou em dias bloqueados. Revise as remarcações manuais.</div>`:''}`;
}
function trackNav(){
 return `<div class="vac-tracks"><button data-vac-filter="all" class="${state.filter==='all'?'active':''}">Todas as áreas</button>${Object.entries(DATA.tracks).map(([k,v])=>`<button data-vac-filter="${k}" class="${state.filter===k?'active':''}"><span style="background:${v.color}"></span>${h(v.name)}</button>`).join('')}</div>`;
}
function sessionChip(day){
 return `<button class="vac-session ${complete(day.id)?'is-done':''}" data-vac-lesson="${day.id}" title="${h(day.topic)}"><span class="vac-session-dot" style="background:${DATA.tracks[day.track].color}"></span><span class="vac-session-label">${h(day.topic)}</span>${complete(day.id)?'<span aria-label="Concluída">✓</span>':''}</button>`;
}
function calendarCell(date){
 const inMonth=date.slice(0,7)===state.cursor.slice(0,7),inside=date>=DATA.start&&date<=DATA.end,off=state.breaks.includes(date),items=tasksOn(date).filter(x=>state.filter==='all'||x.track===state.filter);
 const actual=items.filter(x=>!complete(x.id)).length,dayNo=Number(date.slice(-2));
 return `<div class="vac-day ${inMonth?'':'outside'} ${off?'is-break':''} ${inside?'in-window':''}">
 <button class="vac-day-title" data-vac-date="${date}" aria-label="Abrir ${fmt(date)}"><span>${dayNo}</span>${off?'<small>Pausa</small>':actual?`<small>${actual} tarefa${actual===1?'':'s'}</small>`:''}</button>
 <div class="vac-events">${items.map(sessionChip).join('')}</div></div>`;
}
function monthView(){
 let first=state.cursor.slice(0,7)+'-01',start=add(first,-weekDay(first)),dates=Array.from({length:42},(_,i)=>add(start,i));
 return `<div class="vac-cal-grid"><div class="vac-weekname">Seg</div><div class="vac-weekname">Ter</div><div class="vac-weekname">Qua</div><div class="vac-weekname">Qui</div><div class="vac-weekname">Sex</div><div class="vac-weekname">Sáb</div><div class="vac-weekname">Dom</div>${dates.map(calendarCell).join('')}</div>`;
}
function weekView(){
 const weekStart=add(state.cursor,-weekDay(state.cursor));
 return `<div class="vac-cal-grid vac-cal-week"><div class="vac-weekname">Seg</div><div class="vac-weekname">Ter</div><div class="vac-weekname">Qua</div><div class="vac-weekname">Qui</div><div class="vac-weekname">Sex</div><div class="vac-weekname">Sáb</div><div class="vac-weekname">Dom</div>${Array.from({length:7},(_,i)=>calendarCell(add(weekStart,i))).join('')}</div>`;
}
function dayPanel(){
 if(!state.selectedDate)return '';
 const d=state.selectedDate,inside=d>=DATA.start&&d<=DATA.end,off=state.breaks.includes(d),items=tasksOn(d);
 return `<section class="vac-detail"><div class="vac-detail-title"><div><span class="eyebrow">AGENDA DO DIA</span><h3>${fmt(d)}</h3></div><button data-vac-close aria-label="Fechar detalhes">×</button></div>
 ${items.length?items.map(day=>`<button class="vac-detail-item" data-vac-lesson="${day.id}"><span style="background:${DATA.tracks[day.track].color}"></span><div><strong>${h(day.topic)}</strong><small>${h(DATA.tracks[day.track].name)} · 2 horas · ${h(itemState(day.id).status)}</small></div><b>→</b></button>`).join(''):'<p class="vac-empty">Nenhuma aula agendada neste dia.</p>'}
 ${inside?`<button class="btn btn-ghost vac-break-toggle" data-vac-break="${d}">${off?'↻ Retirar pausa':'☕ Marcar dia de descanso'}</button>`:'<small>Fora do período de férias.</small>'}</section>`;
}
function sourceFor(day){const id=DATA.tracks[day.track].resource;return DATA.sources.find(x=>x.id===id)||DATA.sources[0]}
function lessonPanel(){
 if(!state.selectedLesson)return '';
 const day=found(state.selectedLesson);if(!day)return '';
 const record=itemState(day.id),src=sourceFor(day);
 return `<section class="vac-detail vac-lesson-card"><div class="vac-detail-title"><div><span class="eyebrow">${day.id} · ${h(DATA.tracks[day.track].name)} · ${day.week}ª semana</span><h3>${h(day.topic)}</h3></div><button data-vac-close aria-label="Fechar aula">×</button></div>
 <div class="vac-lesson-two"><div><small>CONTEÚDO</small><p>${h(day.theory)}</p></div><div><small>DESAFIO PRÁTICO</small><p>${h(day.practice)}</p></div><div><small>EVIDÊNCIA ESPERADA</small><p>${h(day.evidence)}</p></div><div><small>VALIDAÇÃO</small><p>${h(day.acceptance)}</p></div></div>
 <div class="vac-timing"><span>25 min teoria</span><span>65 min prática</span><span>20 min testes</span><span>10 min revisão</span></div>
 <p class="vac-study-link"><strong>Fonte:</strong> <a href="${h(src.url)}" target="_blank" rel="noopener noreferrer">${h(src.title)} ↗</a></p>
 <form id="vac-lesson-form" class="vac-form" data-id="${day.id}"><label>Status<select name="status"><option ${record.status==='Pendente'?'selected':''}>Pendente</option><option ${record.status==='Em andamento'?'selected':''}>Em andamento</option><option ${record.status==='Concluída'?'selected':''}>Concluída</option></select></label><label>Data programada<input type="date" name="date" min="${DATA.start}" max="${DATA.end}" value="${day.scheduled||''}" required></label><label>Horas realizadas<input type="number" name="hours" value="${h(record.hours)}" min="0" max="24" step="0.25" placeholder="Ex.: 2"></label><label>Link de evidência ou commit<input type="text" name="evidence" value="${h(record.evidence)}" placeholder="Ex.: URL do commit"></label><label class="full">Anotações<textarea name="note" rows="3" placeholder="Dúvidas, descobertas e revisões...">${h(record.note)}</textarea></label><div class="vac-form-actions"><button type="button" class="btn btn-ghost" data-vac-reset="${day.id}">Restaurar data automática</button><button type="submit" class="btn btn-primary">Salvar aula</button></div></form></section>`;
}
function calendarView(){
 return `<div class="vac-controls"><div class="vac-nav"><button class="icon-btn" data-vac-shift="-1" aria-label="Período anterior">‹</button><strong>${state.mode==='month'?longMonth(state.cursor):`${fmt(add(state.cursor,-weekDay(state.cursor)))} – ${fmt(add(state.cursor,6-weekDay(state.cursor)))}`}</strong><button class="icon-btn" data-vac-shift="1" aria-label="Próximo período">›</button><button class="btn btn-ghost" data-vac-today>Ir para início</button></div><div class="vac-actions"><button data-vac-mode="month" class="${state.mode==='month'?'current':''}">Mês</button><button data-vac-mode="week" class="${state.mode==='week'?'current':''}">Semana</button></div></div>
 ${trackNav()}${state.mode==='month'?monthView():weekView()}${dayPanel()}${lessonPanel()}`;
}
function roadmapView(){
 return `<div class="vac-roadmap"><section class="vac-card"><h3>Objetivo das férias</h3><p>Fortalecer raciocínio algorítmico, estruturas de dados, C e memória, Linux, redes e comunicação técnica. Java/Spring Boot continua na trilha principal.</p><div class="vac-share">${Object.entries(DATA.tracks).map(([k,v])=>{let own=computed.list.filter(x=>x.track===k),n=own.filter(x=>complete(x.id)).length;return `<div><span style="background:${v.color}"></span><strong>${h(v.name)}</strong><small>${n}/${own.length} aulas</small><div class="vac-progress-track"><span style="width:${Math.round(n/own.length*100)}%;background:${v.color}"></span></div></div>`}).join('')}</div></section>
 <section class="vac-card"><h3>Marcos de validação</h3>${DATA.milestones.map(m=>`<div class="vac-milestone"><b>Semana ${m.week}</b><div><strong>${h(m.goal)}</strong><p>${h(m.evidence)}</p></div></div>`).join('')}</section><section class="vac-card vac-capstone"><h3>Projeto integrador: ${h(DATA.project.name)}</h3><p>${h(DATA.project.summary)}</p><h4>Entregas</h4>${DATA.project.features.map(x=>`<div class="vac-bullet">${h(x)}</div>`).join('')}<h4>Critérios para aprovação</h4>${DATA.project.gates.map(x=>`<div class="vac-bullet">${h(x)}</div>`).join('')}</section><section class="vac-card"><h3>Fontes de estudo</h3><div class="vac-source-list">${DATA.sources.map(src=>`<a href="${h(src.url)}" target="_blank" rel="noopener noreferrer"><strong>${h(src.title)}</strong><small>${h(src.type)} · ${h(src.note)}</small><span>↗</span></a>`).join('')}</div></section></div>`;
}
function configure(){
 return `<section class="vac-config vac-card"><div><h3>Organização de períodos</h3><p>Férias de 07/12/2026 a 01/03/2027. Escolha seus dias habituais; os bloqueios não afetam o roadmap de backend.</p></div><div class="vac-weekdays">${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((name,i)=>`<label><input type="checkbox" data-vac-weekday="${i}" ${state.weekdays.includes(i)?'checked':''}><span>${name}</span></label>`).join('')}</div>
 <p class="vac-muted">Pausas padrão: 24 e 25 de dezembro, 31 de dezembro e 1º de janeiro. Para descansar em outros dias, selecione uma data no calendário e marque pausa.</p><div class="vac-break-list">${state.breaks.map(x=>`<button data-vac-break="${x}" title="Retirar bloqueio">☕ ${fmt(x)} ×</button>`).join('')}</div>
 <div class="vac-config-actions"><button class="btn btn-ghost" data-vac-reset-breaks>Restaurar pausas padrão</button><button class="btn btn-ghost" data-vac-export>Exportar só férias</button><button class="btn btn-ghost" data-vac-restart>Restaurar agenda automática</button></div></section>`;
}
function render(){
 computed=schedule();
 return header()+`<div class="vac-tabs"><button data-vac-tab="calendar" class="${state.tab==='calendar'?'active':''}">Calendário</button><button data-vac-tab="roadmap" class="${state.tab==='roadmap'?'active':''}">Trilha e projeto</button><button data-vac-tab="config" class="${state.tab==='config'?'active':''}">Configurar férias</button></div>`+(state.tab==='calendar'?calendarView():state.tab==='roadmap'?roadmapView():configure());
}
function repaint(){computed=schedule();const main=$('#main');if(main&&window.location.hash.slice(1)==='vacation')main.innerHTML=render();}
function update(f){f();persist();repaint()}
function backup(){return JSON.parse(JSON.stringify(state))}
function restore(value){if(!value||typeof value!=='object'||!Array.isArray(value.weekdays)||!Array.isArray(value.breaks))return false;state={...base,...value};persist();repaint();return true}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-vac-tab],[data-vac-filter],[data-vac-mode],[data-vac-shift],[data-vac-today],[data-vac-date],[data-vac-lesson],[data-vac-close],[data-vac-break],[data-vac-reset],[data-vac-reset-breaks],[data-vac-export],[data-vac-restart]');
 if(!b)return;
 if(b.hasAttribute('data-vac-tab')){update(()=>{state.tab=b.dataset.vacTab;state.selectedDate=null;state.selectedLesson=null});return}
 if(b.hasAttribute('data-vac-filter')){update(()=>{state.filter=b.dataset.vacFilter});return}
 if(b.hasAttribute('data-vac-mode')){update(()=>{state.mode=b.dataset.vacMode});return}
 if(b.hasAttribute('data-vac-shift')){update(()=>{let n=Number(b.dataset.vacShift),d=dt(state.cursor);if(state.mode==='month')d.setUTCMonth(d.getUTCMonth()+n);else d.setUTCDate(d.getUTCDate()+7*n);state.cursor=iso(d)});return}
 if(b.hasAttribute('data-vac-today')){update(()=>{state.cursor='2026-12-01'});return}
 if(b.hasAttribute('data-vac-date')){update(()=>{state.selectedDate=b.dataset.vacDate;state.selectedLesson=null});return}
 if(b.hasAttribute('data-vac-lesson')){update(()=>{state.selectedLesson=b.dataset.vacLesson;state.selectedDate=null});return}
 if(b.hasAttribute('data-vac-close')){update(()=>{state.selectedDate=null;state.selectedLesson=null});return}
 if(b.hasAttribute('data-vac-break')){update(()=>{const date=b.dataset.vacBreak;state.breaks=state.breaks.includes(date)?state.breaks.filter(x=>x!==date):[...state.breaks,date].sort();state.selectedLesson=null});return}
 if(b.hasAttribute('data-vac-reset')){update(()=>{delete state.overrides[b.dataset.vacReset];state.reflowIds=(state.reflowIds||[]).filter(x=>x!==b.dataset.vacReset)});return}
 if(b.hasAttribute('data-vac-reset-breaks')){update(()=>{state.breaks=[...base.breaks]});return}
 if(b.hasAttribute('data-vac-export')){let blob=new Blob([JSON.stringify({type:'orbit-vacation-study',version:1,state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='orbit-ferias-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return}
 if(b.hasAttribute('data-vac-restart')&&confirm('Restaurar as datas automáticas de todas as aulas de férias? Suas anotações e conclusões serão preservadas.')){update(()=>{state.overrides={};state.reflowIds=[]});return}
});
document.addEventListener('change',e=>{const input=e.target;if(input.hasAttribute('data-vac-weekday')){const i=Number(input.dataset.vacWeekday);if(!input.checked&&state.weekdays.length<=1){input.checked=true;alert('Selecione ao menos um dia de estudo.');return}update(()=>{state.weekdays=input.checked?[...state.weekdays,i].sort((a,b)=>a-b):state.weekdays.filter(x=>x!==i);if(input.checked&&Array.isArray(state.studyCaps)&&Number(state.studyCaps[i])===0)state.studyCaps[i]=2})}});
document.addEventListener('submit',e=>{if(e.target.id!=='vac-lesson-form')return;e.preventDefault();const form=e.target,id=form.dataset.id,date=form.elements.namedItem('date').value;if(!date||date<DATA.start||date>DATA.end){alert('A data precisa ficar dentro do período de férias.');return}const hrs=form.elements.namedItem('hours').value;if(hrs!==''&&(!Number.isFinite(Number(hrs))||Number(hrs)<0||Number(hrs)>24)){alert('Horas inválidas.');return}update(()=>{state.overrides[id]=date;state.reflowIds=(state.reflowIds||[]).filter(x=>x!==id);const status=form.elements.namedItem('status').value,prior=state.lessons[id]||{};state.lessons[id]={status,hours:hrs,note:form.elements.namedItem('note').value,evidence:form.elements.namedItem('evidence').value,completedAt:status==='Concluída'?(prior.completedAt||new Date().toISOString().slice(0,10)):''}});});
window.OrbitVacation={render,backup,restore,scheduleSnapshot:()=>schedule(),course:DATA};
})();

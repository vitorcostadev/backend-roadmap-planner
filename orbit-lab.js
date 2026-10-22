(function setupOrbitLab(){
'use strict';
const api=window.OrbitVacation;
if(!api||!api.course)return;
const data=api.course;
const renderOriginal=api.render.bind(api);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateUTC=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))};
const dateISO=d=>d.toISOString().slice(0,10);
const plus=(s,n)=>{const d=dateUTC(s);d.setUTCDate(d.getUTCDate()+n);return dateISO(d)};
const weekday=s=>(dateUTC(s).getUTCDay()+6)%7;
const dateLabel=s=>new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(dateUTC(s));
const today=()=>{const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day};
const defaults=[2,2,2,2,2,2,0];
let tab=null,preview=null,fromDate=today()>data.start?today():data.start,lastAnswers=null;
const questions=[
 {topic:'Algoritmos',q:'Qual é a complexidade de percorrer uma lista de n elementos uma única vez?',opts:['O(1)','O(log n)','O(n)','O(n²)'],answer:2,why:'Uma passagem faz n operações proporcionais ao tamanho da entrada.'},
 {topic:'Algoritmos',q:'Qual condição é indispensável em uma função recursiva correta?',opts:['Um caso-base alcançável','Sempre usar duas chamadas recursivas','Armazenar todos os resultados','Um laço for'],answer:0,why:'O caso-base interrompe a cadeia de chamadas, evitando recursão infinita.'},
 {topic:'Estruturas',q:'Em uma fila FIFO, qual elemento é removido primeiro?',opts:['O último inserido','O primeiro inserido','O elemento de maior valor','Um elemento aleatório'],answer:1,why:'First In, First Out preserva a ordem de chegada.'},
 {topic:'Estruturas',q:'Uma busca binária clássica exige que os dados estejam...',opts:['Ordenados','Duplicados','Em uma lista ligada','Em uma árvore AVL'],answer:0,why:'A decisão de descartar metade do intervalo depende da ordenação.'},
 {topic:'Grafos',q:'Qual algoritmo encontra o menor número de arestas até um destino em um grafo não ponderado?',opts:['DFS','BFS','Quicksort','Busca linear'],answer:1,why:'BFS explora os vértices por distância em número de arestas.'},
 {topic:'Grafos',q:'Dijkstra convencional exige que os pesos das arestas sejam...',opts:['Todos iguais','Negativos','Não negativos','Números inteiros'],answer:2,why:'A correção do algoritmo depende de não existirem arestas com peso negativo.'},
 {topic:'C & Memória',q:'Em C, qual expressão libera uma área obtida com malloc?',opts:['delete(ptr)','free(ptr)','dispose(ptr)','close(ptr)'],answer:1,why:'free libera a memória dinâmica; não é seguro acessá-la depois disso.'},
 {topic:'C & Memória',q:'O que caracteriza um ponteiro pendente (dangling pointer)?',opts:['Um ponteiro para memória já liberada','Um ponteiro NULL','Um inteiro convertido em float','Um array com posição zero'],answer:0,why:'O ponteiro ainda contém um endereço, mas o objeto apontado já não tem vida útil válida.'},
 {topic:'C & Memória',q:'Qual formato é correto para imprimir um ponteiro void* com printf?',opts:['%d','%s','%p','%f'],answer:2,why:'%p é o especificador de formato adequado para ponteiros void*.'},
 {topic:'Sistemas',q:'Qual recurso é compartilhado entre threads do mesmo processo?',opts:['Espaço de endereçamento','Pilha de execução de cada thread','Contador de programa individual','Registradores individuais'],answer:0,why:'Threads do mesmo processo compartilham memória do processo, mas mantêm contexto de execução próprio.'},
 {topic:'Linux',q:'Qual comando filtra linhas de um arquivo por um padrão?',opts:['grep','mkdir','chmod','pwd'],answer:0,why:'grep pesquisa expressões e retorna linhas correspondentes.'},
 {topic:'Redes',q:'Em geral, qual protocolo oferece entrega confiável e ordenada de bytes?',opts:['UDP','ARP','TCP','ICMP'],answer:2,why:'TCP fornece fluxo de bytes com controle de entrega e ordem; UDP não garante isso.'},
 {topic:'Redes',q:'O DNS é usado principalmente para...',opts:['Traduzir nomes em registros de rede','Compilar programas','Criar usuários no sistema','Alocar memória heap'],answer:0,why:'Consultas DNS resolvem nomes para registros como A e AAAA, entre outros.'},
 {topic:'Inglês técnico',q:'O que um README reproduzível precisa apresentar?',opts:['Somente imagens','Pré-requisitos e passos de execução','Histórico pessoal','Somente a licença'],answer:1,why:'Pré-requisitos, instalação, execução e exemplos permitem reproduzir o resultado.'},
 {topic:'Algoritmos',q:'No pior caso, qual é a complexidade de buscar um elemento em um array não ordenado?',opts:['O(1)','O(log n)','O(n)','O(n log n)'],answer:2,why:'Pode ser necessário verificar cada um dos n elementos.'},
];
function snapshot(){const st=api.backup();st.studyCaps=Array.isArray(st.studyCaps)&&st.studyCaps.length===7?st.studyCaps:defaults.slice();st.labReviews=st.labReviews||{};st.labAttempts=Array.isArray(st.labAttempts)?st.labAttempts:[];st.reflowIds=Array.isArray(st.reflowIds)?st.reflowIds:[];return st}
function commit(st){api.restore(st);repaint()}
function repaint(){const main=document.querySelector('#main');if(main&&location.hash.slice(1)==='vacation')main.innerHTML=api.render()}
function scheduleCurrent(st){
 const days=st.studyCaps||defaults,occupied=new Map(),slots=[];
 const cap=date=>st.weekdays.includes(weekday(date))&&!st.breaks.includes(date)?Math.floor(Number(days[weekday(date)]||0)/2):0;
 for(const item of data.days){const manual=st.overrides[item.id];if(manual)occupied.set(manual,(occupied.get(manual)||0)+1)}
 for(let date=data.start;date<=data.end;date=plus(date,1)){
   const free=Math.max(0,cap(date)-(occupied.get(date)||0));
   for(let i=0;i<free;i++)slots.push(date);
 }
 let position=0;
 return data.days.map(item=>({...item,scheduled:Object.prototype.hasOwnProperty.call(st.overrides,item.id)?(st.overrides[item.id]||null):(slots[position++]||null)}));
}
function planned(st,start){
 const lessons=scheduleCurrent(st),pinned=new Set(),assigned={},occupied={},automatic=new Set(st.reflowIds||[]);
 for(const d of lessons){
   const finished=st.lessons[d.id]?.status==='Concluída';
   const manual=Boolean(st.overrides[d.id])&&!automatic.has(d.id);
   if(finished||manual){pinned.add(d.id);if(d.scheduled&&d.scheduled>=start)occupied[d.scheduled]=(occupied[d.scheduled]||0)+1;}
 }
 const spaces=[];
 for(let day=start;day<=data.end;day=plus(day,1)){
   const total=st.weekdays.includes(weekday(day))&&!st.breaks.includes(day)?Math.max(0,Math.floor(Number(st.studyCaps[weekday(day)]||0)/2)):0;
   for(let i=0;i<Math.max(0,total-(occupied[day]||0));i++)spaces.push(day);
 }
 const movable=lessons.filter(d=>!pinned.has(d.id));
 movable.forEach((d,i)=>{if(i<spaces.length)assigned[d.id]=spaces[i]});
 const noRoom=movable.filter(d=>!assigned[d.id]);
 const changes=movable.filter(d=>assigned[d.id]&&d.scheduled!==assigned[d.id]).map(d=>({id:d.id,topic:d.topic,from:d.scheduled,to:assigned[d.id]}));
 return {changes,noRoom,assigned,pinned:pinned.size,untouched:movable.length-changes.length,capacity:spaces.length};
}
function tabBtn(key,title){return '<button type="button" data-lab-tab="'+key+'" class="'+(tab===key?'active':'')+'">'+title+'</button>'}
function capacityInputs(st){return '<div class="lab-cap-grid">'+['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((name,i)=>'<label>'+name+'<select data-lab-cap="'+i+'" aria-label="Horas de estudo '+name+'">'+[0,2,4].map(n=>'<option value="'+n+'" '+(Number(st.studyCaps[i])===n?'selected':'')+'>'+n+'h</option>').join('')+'</select></label>').join('')+'</div>';}
function recoveryView(){
 const st=snapshot(),plan=planned(st,fromDate),overdue=scheduleCurrent(st).filter(d=>d.scheduled&&d.scheduled<fromDate&&st.lessons[d.id]?.status!=='Concluída');
 return '<div class="lab-page"><div class="lab-title"><div><span class="eyebrow">AGENDA INTELIGENTE</span><h2>Reorganizar sem perder o progresso</h2><p>Defina a data de retomada e quantas horas pode estudar em cada dia. As aulas concluídas e remarcadas manualmente não serão deslocadas.</p></div></div>'+
 '<div class="lab-stats"><div><small>Pendentes antes da retomada</small><strong>'+overdue.length+'</strong></div><div><small>Datas que mudariam</small><strong>'+plan.changes.length+'</strong></div><div><small>Aulas sem vaga</small><strong>'+plan.noRoom.length+'</strong></div></div>'+
 '<div class="lab-panel"><label class="lab-date">Retomar em <input type="date" data-lab-from min="'+data.start+'" max="'+data.end+'" value="'+escapeHTML(fromDate)+'"></label><p class="lab-muted">Horas disponíveis por dia (uma aula de 2h ocupa uma vaga). Dias bloqueados e pausas continuam respeitados.</p>'+capacityInputs(st)+
 '<div class="lab-actions"><button class="btn btn-ghost" type="button" data-lab-preview>Atualizar prévia</button><button class="btn btn-primary" type="button" data-lab-apply '+(!preview||preview.noRoom.length?'disabled':'')+'>Confirmar reorganização</button></div>'+
 (preview?'<div class="lab-preview"><h3>Prévia da reorganização</h3><p>'+preview.changes.length+' aula(s) seriam deslocadas; '+preview.pinned+' aula(s) estão protegidas. '+preview.noRoom.length+' aula(s) não cabem no período.</p>'+
 (preview.noRoom.length?'<p class="lab-warning">Não foi aplicada nenhuma mudança. Para comportar todas as aulas, aumente a capacidade de alguns dias, retire pausas ou antecipe a data de retomada.</p>':'')+
 (preview.changes.length?'<ul>'+preview.changes.slice(0,10).map(x=>'<li><strong>'+escapeHTML(x.topic)+'</strong> — '+(x.from?dateLabel(x.from):'sem data')+' → '+dateLabel(x.to)+'</li>').join('')+'</ul><small>'+(preview.changes.length>10?'Mostrando 10 alterações de '+preview.changes.length+'.':'')+'</small>':'<p>As aulas já estão distribuídas; nenhuma data precisa ser alterada.</p>')+'</div>':'<p class="lab-muted">Clique em “Atualizar prévia” para calcular e conferir as alterações antes de confirmá-las.</p>')+
 '</div></div>';
}
function reviewList(){
 const st=snapshot(),now=today(),schedule=scheduleCurrent(st);
 return schedule.filter(d=>st.lessons[d.id]?.status==='Concluída').map(d=>{
   const rec=st.labReviews[d.id]||{},step=Number(rec.step||0);
   const first=st.lessons[d.id].completedAt||d.scheduled||now;
   return {...d,review:rec,due:rec.next||plus(first,1),step};
 }).sort((a,b)=>a.due.localeCompare(b.due));
}
function reviewsView(){
 const list=reviewList(),now=today(),due=list.filter(x=>x.due<=now),future=list.filter(x=>x.due>now);
 return '<div class="lab-page"><div class="lab-title"><div><span class="eyebrow">RECUPERAÇÃO ATIVA</span><h2>Revisões programadas</h2><p>Revise sem consultar materiais primeiro. A resposta é uma autoavaliação, não um teste corrigido automaticamente.</p></div></div>'+
 '<div class="lab-stats"><div><small>Revisões vencidas / para hoje</small><strong>'+due.length+'</strong></div><div><small>Concluídas no curso</small><strong>'+list.length+'</strong></div><div><small>Revisões futuras</small><strong>'+future.length+'</strong></div></div>'+
 (due.length?'<div class="lab-review-list">'+due.slice(0,12).map(d=>'<article class="lab-panel"><div class="lab-review-head"><div><small>'+escapeHTML(data.tracks[d.track].name)+' · '+d.id+' · Prazo '+dateLabel(d.due)+'</small><h3>'+escapeHTML(d.topic)+'</h3></div><span class="lab-step">Etapa '+(d.step+1)+'</span></div><p><strong>Explique sem consultar:</strong> '+escapeHTML(d.theory)+'</p><p><strong>Desafio:</strong> '+escapeHTML(d.practice)+'</p><div class="lab-actions"><button class="btn btn-ghost" data-lab-review="'+d.id+'" data-rating="hard">Preciso reforçar</button><button class="btn btn-primary" data-lab-review="'+d.id+'" data-rating="easy">Consegui explicar</button></div></article>').join('')+'</div>':'<div class="lab-panel"><h3>Nenhuma revisão pendente.</h3><p>Quando você concluir aulas do Modo Férias, o Orbit programará revisões de recuperação ativa.</p></div>')+
 (future.length?'<div class="lab-panel"><h3>Próximas revisões</h3><ul>'+future.slice(0,6).map(d=>'<li>'+escapeHTML(d.topic)+' · '+dateLabel(d.due)+'</li>').join('')+'</ul></div>':'')+'</div>';
}
function quizSet(st){const attempts=st.labAttempts.length,start=(attempts*5)%questions.length;return Array.from({length:5},(_,i)=>questions[(start+i)%questions.length])}
function quizView(){
 const st=snapshot(),subset=quizSet(st),prev=st.labAttempts.at(-1);
 return '<div class="lab-page"><div class="lab-title"><div><span class="eyebrow">AUTOAVALIAÇÃO · 5 QUESTÕES</span><h2>Simulado de fundamentos</h2><p>Questões originais de algoritmos, C, sistemas e redes. Uma rodada contém cinco perguntas; o resultado explica cada resposta.</p></div></div>'+
 (prev?'<div class="lab-panel"><strong>Última rodada: '+prev.score+'/5 acertos ('+Math.round(prev.score/5*100)+'%)</strong><p>Realizada em '+dateLabel(prev.date)+'. O desempenho indica pontos a revisar; não equivale a uma avaliação prática.</p></div>':'')+
 (lastAnswers?'<div class="lab-panel"><h3>Correção da última rodada · '+lastAnswers.score+'/5</h3>'+lastAnswers.results.map((x,i)=>'<div class="lab-answer"><strong>'+(i+1)+'. '+escapeHTML(x.question)+'</strong><p class="'+(x.ok?'lab-correct':'lab-wrong')+'">'+(x.ok?'Correta':'Incorreta')+' · Resposta: '+escapeHTML(x.correct)+'</p><p>'+escapeHTML(x.why)+'</p></div>').join('')+'<button class="btn btn-primary" data-lab-next>Iniciar próxima rodada</button></div>':
 '<form class="lab-panel" id="lab-quiz">'+subset.map((q,i)=>'<fieldset class="lab-question"><legend><span>'+escapeHTML(q.topic)+'</span><strong>'+(i+1)+'. '+escapeHTML(q.q)+'</strong></legend>'+q.opts.map((op,j)=>'<label><input type="radio" name="q'+i+'" value="'+j+'"><span>'+escapeHTML(op)+'</span></label>').join('')+'</fieldset>').join('')+'<button class="btn btn-primary" type="submit">Corrigir respostas</button></form>')+'</div>';
}
function renderExtension(){
 const original=renderOriginal(),marker='<div class="vac-tabs">',start=original.indexOf(marker);
 if(start<0)return original;
 const end=original.indexOf('</div>',start);
 const prefix=original.slice(0,start),nav=original.slice(start,end);
 const extra=tabBtn('recover','Reorganizar')+tabBtn('reviews','Revisões')+tabBtn('quiz','Simulado');
 const native=tab?nav.replace(/class="active"/g,'class=""'):nav;
 return prefix+native+extra+'</div>'+(tab==='recover'?recoveryView():tab==='reviews'?reviewsView():tab==='quiz'?quizView():original.slice(end+6));
}
api.render=renderExtension;
document.addEventListener('click',e=>{if(e.target.closest('[data-vac-tab]')){tab=null;lastAnswers=null;preview=null}if(e.target.closest('[data-vac-tab],[data-vac-filter],[data-vac-mode],[data-vac-shift],[data-vac-today],[data-vac-date],[data-vac-lesson],[data-vac-close],[data-vac-break],[data-vac-reset],[data-vac-reset-breaks],[data-vac-restart]')){preview=null;requestAnimationFrame(repaint)}},true);
document.addEventListener('change',e=>{if(e.target.hasAttribute('data-vac-weekday')){preview=null;requestAnimationFrame(repaint)}},true);
document.addEventListener('submit',e=>{if(e.target.id==='vac-lesson-form'){preview=null;requestAnimationFrame(repaint)}},true);
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-lab-tab],[data-lab-preview],[data-lab-apply],[data-lab-review],[data-lab-next]');
 if(!b)return;
 if(b.hasAttribute('data-lab-tab')){tab=b.dataset.labTab;preview=null;lastAnswers=null;repaint();return}
 if(b.hasAttribute('data-lab-preview')){preview=planned(snapshot(),fromDate);repaint();return}
 if(b.hasAttribute('data-lab-apply')){
  const st=snapshot();
  const fresh=planned(st,fromDate);
  if(!preview||fresh.noRoom.length){alert('Não há espaço suficiente ou a prévia não está atualizada.');return}
  if(!confirm('Confirmar a nova agenda? Serão remarcadas '+fresh.changes.length+' aulas. O progresso, as aulas concluídas e as datas manuais serão preservados.'))return;
  for(const [id,date] of Object.entries(fresh.assigned))st.overrides[id]=date;st.reflowIds=Object.keys(fresh.assigned);
  preview=null;commit(st);return
 }
 if(b.hasAttribute('data-lab-review')){
  const st=snapshot(),id=b.dataset.labReview,prev=st.labReviews[id]||{},easy=b.dataset.rating==='easy',nextStep=easy?Math.min(4,(prev.step||0)+1):0;
  const gaps=[1,3,7,14,30];
  st.labReviews[id]={step:nextStep,last:today(),next:plus(today(),gaps[nextStep]),total:(prev.total||0)+1};
  commit(st);return
 }
 if(b.hasAttribute('data-lab-next')){lastAnswers=null;repaint()}
});
document.addEventListener('change',e=>{
 if(e.target.hasAttribute('data-lab-from')){fromDate=e.target.value;preview=null;repaint();return}
 if(e.target.hasAttribute('data-lab-cap')){
  const st=snapshot(),i=Number(e.target.dataset.labCap);
  st.studyCaps[i]=Number(e.target.value);preview=null;commit(st)
 }
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='lab-quiz')return;
 e.preventDefault();
 const st=snapshot(),selected=quizSet(st),answers=[],results=[];
 for(let i=0;i<selected.length;i++){
  const picked=e.target.querySelector('input[name="q'+i+'"]:checked');
  if(!picked){alert('Responda as cinco questões antes de corrigir.');return}
  const q=selected[i],n=Number(picked.value);
  answers.push(n);results.push({question:q.q,correct:q.opts[q.answer],why:q.why,ok:n===q.answer});
 }
 const score=results.filter(x=>x.ok).length;
 st.labAttempts.push({date:today(),score,answers,questions:selected.map(x=>x.q)});
 lastAnswers={score,results};
 commit(st);
});
window.OrbitLab={preview:(start,settings)=>planned(settings||snapshot(),start||fromDate),getReviews:reviewList,questions:questions.length};
})();

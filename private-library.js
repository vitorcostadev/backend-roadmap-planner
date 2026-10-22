
(() => {
'use strict';
const NAME='orbit-pdfs-pessoais-v1', STORE='books', MAX=30*1024*1024;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function database(){return new Promise((ok,no)=>{if(!('indexedDB' in window))return no(Error('Este navegador não oferece IndexedDB'));const r=indexedDB.open(NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
async function action(mode,run){const db=await database();return new Promise((ok,no)=>{const tx=db.transaction(STORE,mode),req=run(tx.objectStore(STORE));tx.oncomplete=()=>{db.close();ok(req.result)};tx.onerror=()=>{db.close();no(tx.error)};});}
const message=t=>{const n=document.getElementById('private-pdf-msg');if(n)n.textContent=t};
async function redraw(){
const target=document.getElementById('private-pdf-list');if(!target)return;
try {
const books=await action('readonly',s=>s.getAll());
if(!document.getElementById('private-pdf-list'))return;
target.innerHTML=books.length?books.sort((a,b)=>b.when-a.when).map(b=>'<div class="my-pdf-row"><div><strong>'+h(b.name)+'</strong><small>'+(b.size/1048576).toFixed(1).replace('.',',')+' MB • somente neste navegador</small></div><div><button type="button" class="btn btn-ghost" data-my-pdf-open="'+h(b.id)+'">Abrir</button> <button type="button" class="btn btn-ghost" data-my-pdf-delete="'+h(b.id)+'">Excluir</button></div></div>').join(''):'<p>Nenhum PDF pessoal registrado. Adicione sua cópia adquirida legitimamente.</p>';
}catch(e){message('Armazenamento indisponível: '+e.message)}
}
function mount(){
const main=document.getElementById('main');if(!main||location.hash.slice(1)!=='resources'||main.querySelector('#my-pdf-shelf'))return;
const section=document.createElement('section');section.id='my-pdf-shelf';section.className='card my-pdf-shelf';section.innerHTML='<div class="my-pdf-head"><div><div class="eyebrow">LIVROS PESSOAIS · ARMAZENAMENTO LOCAL</div><h2>Meus PDFs</h2><p>Adicione sua cópia de Entendendo Algoritmos. O conteúdo permanece neste dispositivo; não é enviado ao GitHub nem a um servidor.</p></div><label class="btn btn-primary" for="private-pdf-import">Adicionar PDF</label><input type="file" id="private-pdf-import" accept=".pdf,application/pdf" hidden></div><p id="private-pdf-msg" role="status" aria-live="polite">Limite: 30 MB por arquivo. Arquivos pessoais não entram no backup JSON; guarde sua cópia original.</p><div id="private-pdf-list"></div><p><a href="https://github.com/vitorcostadev/backend-roadmap-planner/blob/main/biblioteca/GUIA_ENTENDENDO_ALGORITMOS.md" target="_blank" rel="noopener noreferrer">Guia de leitura e exercícios ↗</a></p>';
const title=main.querySelector('.page-heading');if(title)title.insertAdjacentElement('afterend',section);else main.prepend(section);redraw();
}
document.addEventListener('change',async e=>{if(e.target.id!=='private-pdf-import')return;const file=e.target.files?.[0];e.target.value='';if(!file)return;try{
if(file.size>MAX||!/\.pdf$/i.test(file.name)||(await file.slice(0,5).text())!=='%PDF-')throw Error('Escolha um PDF válido de até 30 MB');
const id=crypto.randomUUID?crypto.randomUUID():String(Date.now());await action('readwrite',s=>s.put({id,name:file.name,size:file.size,blob:file,when:Date.now()}));
message('Arquivo salvo apenas neste navegador.');redraw();
}catch(err){message('Falha ao importar: '+err.message)}});
document.addEventListener('click',async e=>{
const open=e.target.closest('[data-my-pdf-open]');if(open){
const tab=window.open('about:blank','_blank');if(tab)tab.opener=null;
try{const b=await action('readonly',s=>s.get(open.dataset.myPdfOpen));if(!b)throw Error('PDF não encontrado');const url=URL.createObjectURL(b.blob);if(tab)tab.location.replace(url);else message('Permita abertura de nova aba');setTimeout(()=>URL.revokeObjectURL(url),3600000);}
catch(err){if(tab)tab.close();message('Falha ao abrir: '+err.message)}return;
}
const del=e.target.closest('[data-my-pdf-delete]');if(del&&confirm('Excluir este livro apenas do navegador?')){try{await action('readwrite',s=>s.delete(del.dataset.myPdfDelete));message('Livro excluído deste navegador.');redraw()}catch(err){message('Falha ao excluir: '+err.message)}}
});
window.OrbitPersonalPDF={mount};
})();

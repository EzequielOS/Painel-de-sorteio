const jsonInput = document.getElementById('jsonInput');
const fileInput = document.getElementById('fileInput');
const loadBtn = document.getElementById('loadBtn');
const listEl = document.getElementById('list');
const drawBtn = document.getElementById('drawBtn');
const clearBtn = document.getElementById('clearBtn');
const winnerModal = document.getElementById('winner');
const winnerName = document.getElementById('winnerName');
const winnerPhone = document.getElementById('winnerPhone');
const closeWinner = document.getElementById('closeWinner');
const copyWinner = document.getElementById('copyWinner');
const ticker = document.getElementById('ticker');
const tickerName = document.getElementById('tickerName');

let participants = [];
let animInterval = null;

function parseJSONText(text){
  try{
    const data = JSON.parse(text);
    if(!Array.isArray(data)) throw new Error('JSON deve ser um array');
    return data.map(item=>({nome:String(item.nome||item.name||''),telefone:String(item.telefone||item.phone||'')})).filter(p=>p.nome);
  }catch(e){
    alert('JSON inválido: '+e.message);
    return null;
  }
}

function renderList(){
  listEl.innerHTML='';
  participants.forEach((p,idx)=>{
    const li = document.createElement('li');
    li.dataset.index = idx;
    li.innerHTML = `<span>${p.nome}</span><small style="color:var(--muted)">${p.telefone}</small>`;
    listEl.appendChild(li);
  });
}

loadBtn.addEventListener('click', ()=>{
  const text = jsonInput.value.trim();
  if(!text){ alert('Cole o JSON ou faça upload de um arquivo.'); return; }
  const parsed = parseJSONText(text);
  if(parsed) { participants = parsed; renderList(); }
});

fileInput.addEventListener('change', async e=>{
  const f = e.target.files[0]; if(!f) return;
  const text = await f.text();
  jsonInput.value = text;
});

clearBtn.addEventListener('click', ()=>{ participants=[]; renderList(); jsonInput.value=''; });

function pickRandomIndex(){ return Math.floor(Math.random()*participants.length); }

function spawnConfetti(){
  const container = document.createElement('div'); container.className='confetti';
  const emojis = ['🎉','✨','🎊','🥳','💫'];
  for(let i=0;i<30;i++){
    const s = document.createElement('span');
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    s.style.left = Math.random()*100+'%';
    s.style.top = (Math.random()*10)+'%';
    s.style.fontSize = (12+Math.random()*24)+'px';
    s.style.animationDelay = (Math.random()*0.6)+'s';
    container.appendChild(s);
  }
  document.body.appendChild(container);
  setTimeout(()=>container.remove(),2600);
}

function highlightOnce(index){
  listEl.querySelectorAll('li').forEach(li=>li.classList.remove('highlight'));
  const el = listEl.querySelector(`li[data-index="${index}"]`);
  if(el){
    el.classList.add('highlight');
    el.scrollIntoView({behavior:'smooth',block:'center'});
  }
}

drawBtn.addEventListener('click', ()=>{
  if(participants.length===0){ alert('Nenhum participante carregado.'); return; }
  drawBtn.disabled = true;
  const total = participants.length;
  const steps = 60 + Math.floor(Math.random()*30);
  let ptr = Math.floor(Math.random()*total);
  let i = 0;

  // show ticker
  if(ticker) ticker.classList.remove('hidden');

  function runStep(){
    // show current name in ticker
    if(tickerName) tickerName.textContent = participants[ptr].nome;
    if(ticker){
      ticker.classList.add('flash');
      setTimeout(()=>ticker.classList.remove('flash'), 90);
    }
    highlightOnce(ptr);
    ptr = (ptr + 1) % total;
    i++;
    const t = i/steps;
    const delay = Math.round(30 + Math.pow(t,3)*900); // cubic easing for stronger slowdown
    if(i < steps){
      setTimeout(runStep, delay);
    } else {
      // final winner is previous index (ptr moved one past)
      const winnerIdx = (ptr - 1 + total) % total;
      const winner = participants[winnerIdx];
      highlightOnce(winnerIdx);
      // hide ticker then show winner
      setTimeout(()=>{
        if(ticker) ticker.classList.add('hidden');
        showWinner(winner);
        drawBtn.disabled = false;
      }, 300);
    }
  }

  runStep();
});

function showWinner(w){
  winnerName.textContent = w.nome;
  winnerPhone.textContent = w.telefone;
  winnerModal.classList.remove('hidden');
  winnerModal.classList.add('visible');
  spawnConfetti();
}

closeWinner.addEventListener('click', ()=>{ winnerModal.classList.add('hidden'); winnerModal.classList.remove('visible'); });

if(copyWinner){
  copyWinner.addEventListener('click', ()=>{
    const text = `${winnerName.textContent} - ${winnerPhone.textContent}`;
    navigator.clipboard?.writeText(text)
      .then(()=>alert('Copiado: '+text))
      .catch(()=>alert('Não foi possível copiar'));
  });
}

// Support: allow pressing Enter+Ctrl to load
jsonInput.addEventListener('keydown', e=>{ if(e.key==='Enter' && (e.ctrlKey||e.metaKey)) loadBtn.click(); });

// simple helper to accept payloads via global function (useful if backend posts to window)
window.loadParticipantsFromJSON = function(data){
  if(typeof data==='string') data = parseJSONText(data);
  participants = Array.isArray(data)?data:[]; renderList();
}

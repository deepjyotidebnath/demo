// ---- shared state (in memory; resets on reload) ----
const S={
 inv:[{n:"Darjeeling First Flush 100g",p:450,q:34},{n:"Assam CTC 500g",p:260,q:8},{n:"Masala Chai Mix",p:180,q:52},{n:"Ceramic Kulhad Set",p:600,q:5}],
 team:[{n:"Riya Sen",r:"Owner"},{n:"Amit Das",r:"Support"}],
 site:{title:"Fresh tea, straight from the hills",tag:"Order online. We deliver across India.",color:"#1F7A5A",published:false},
 chat:[{b:1,t:"Hi! Ask me about products, prices or stock."}],
 sent:[],orders:[12,18,15,22,28,25,34],
 contacts:{All:240,Customers:120,"New leads":80,Inactive:40}
};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove("show"),1800)}
const tabs={overview:"Overview",website:"Website builder",chatbot:"AI chatbot",whatsapp:"WhatsApp",inventory:"Inventory",team:"Team"};
let cur="overview";
function nav(){$("#nav").innerHTML='<h1>hub<i>.</i></h1>'+Object.entries(tabs).map(([k,v])=>`<button class="${k==cur?"on":""}" data-k="${k}">${v}</button>`).join("")+'<button data-k="theme" style="margin-top:auto">Toggle theme</button>';
 $("#nav").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(b.dataset.k=="theme"){const r=document.documentElement,d=r.dataset.theme=="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark";return}cur=b.dataset.k;render()})}
function render(){nav();$("#view").innerHTML=views[cur]();(binds[cur]||(()=>{}))()}

const views={
overview(){const low=S.inv.filter(i=>i.q<10).length,val=S.inv.reduce((a,i)=>a+i.p*i.q,0),mx=Math.max(...S.orders);
 const bars=S.orders.map((v,i)=>{const h=v/mx*120;return `<rect x="${i*52+10}" y="${140-h}" width="34" height="${h}" rx="4" fill="var(--leaf)"/><text x="${i*52+27}" y="156" text-anchor="middle" font-size="11" fill="var(--mute)">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</text><text x="${i*52+27}" y="${134-h}" text-anchor="middle" font-size="11" fill="var(--ink)">${v}</text>`}).join("");
 return `<h2>Overview</h2><p class="sub">One dashboard for every part of the business.</p>
 <div class="grid g4"><div class="card"><div class="big">${S.orders.reduce((a,b)=>a+b)}</div><div class="lbl">Orders this week</div></div>
 <div class="card"><div class="big">₹${val.toLocaleString("en-IN")}</div><div class="lbl">Stock value</div></div>
 <div class="card"><div class="big" style="color:${low?"var(--warn)":"inherit"}">${low}</div><div class="lbl">Items low on stock</div></div>
 <div class="card"><div class="big">${S.sent.length}</div><div class="lbl">WhatsApp campaigns sent</div></div></div>
 <div class="card" style="margin-top:14px"><b>Orders per day</b><svg viewBox="0 0 380 165" width="100%" style="max-width:520px;display:block;margin-top:8px">${bars}</svg></div>`},

website(){const s=S.site;return `<h2>Website builder</h2><p class="sub">Edit on the left, see changes live on the right.</p>
 <div class="grid g2"><div class="card"><label class="lbl">Headline</label><input id="wt" value="${esc(s.title)}">
 <label class="lbl" style="display:block;margin-top:10px">Subtitle</label><input id="wg" value="${esc(s.tag)}">
 <p class="lbl">Brand colour</p><div class="row">${["#1F7A5A","#C8742B","#3b5bdb","#7b2d8e","#1B2A41"].map(c=>`<button class="sw" data-c="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join("")}</div>
 <p><button class="btn" id="pub">${s.published?"Update site":"Publish site"}</button> <span class="lbl" id="pubs">${s.published?"Live at yourshop.hub.app":"Draft"}</span></p></div>
 <div class="site"><div class="hero" id="hero" style="background:${s.color}"><h3 id="ht">${esc(s.title)}</h3><div id="hg">${esc(s.tag)}</div><p><span style="background:#fff;color:#111;padding:8px 14px;border-radius:8px;font-weight:600">Shop now</span></p></div>
 <div style="padding:14px" class="lbl">Featured: ${S.inv.slice(0,3).map(i=>esc(i.n)+" ₹"+i.p).join(" · ")}</div></div></div>`},

chatbot(){return `<h2>AI chatbot</h2><p class="sub">Answers from your live inventory. Try "price of Assam", "what's in stock" or "do you ship".</p>
 <div class="card"><div class="chat" id="chat">${S.chat.map(m=>`<div class="m ${m.b?"":"me"}">${esc(m.t)}</div>`).join("")}</div>
 <div class="row" style="margin-top:10px"><input id="ci" placeholder="Type a message"><button class="btn" id="cs">Send</button></div></div>`},

whatsapp(){return `<h2>WhatsApp automation</h2><p class="sub">Send a broadcast to a segment. This demo simulates delivery.</p>
 <div class="grid g2"><div class="card"><label class="lbl">Audience</label><select id="wa">${Object.entries(S.contacts).map(([k,v])=>`<option>${k} (${v})</option>`).join("")}</select>
 <label class="lbl" style="display:block;margin-top:10px">Message</label><textarea id="wm" rows="4">Hi {name}, our new Darjeeling first flush is in stock. Reply YES for 10% off.</textarea>
 <p><button class="btn" id="ws">Send broadcast</button></p></div>
 <div class="card"><b>Campaign log</b><div id="wl">${S.sent.length?S.sent.map(x=>`<p style="margin:8px 0"><span class="tag">${x.st}</span> ${esc(x.a)}<br><span class="lbl">${esc(x.m.slice(0,60))}…</span></p>`).join(""):'<p class="lbl">No campaigns yet. Send your first broadcast.</p>'}</div></div></div>`},

inventory(){return `<h2>Inventory</h2><p class="sub">Stock changes here update the dashboard and the chatbot.</p>
 <div class="card scroll"><table><tr><th>Item</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
 ${S.inv.map((i,x)=>`<tr><td>${esc(i.n)}</td><td>₹${i.p}</td><td>${i.q}</td><td><span class="tag ${i.q<10?"low":""}">${i.q<10?"Low":"OK"}</span></td><td><button class="btn alt" data-d="${x}:-1" aria-label="Remove one">−</button> <button class="btn alt" data-d="${x}:1" aria-label="Add one">+</button></td></tr>`).join("")}</table></div>
 <div class="card row" style="margin-top:14px"><input id="in" placeholder="Item name"><input id="ip" type="number" placeholder="Price ₹"><input id="iq" type="number" placeholder="Qty"><button class="btn" id="ia">Add item</button></div>`},

team(){return `<h2>Team</h2><p class="sub">Unlimited members on every plan.</p>
 <div class="card scroll"><table><tr><th>Name</th><th>Role</th></tr>${S.team.map(t=>`<tr><td>${esc(t.n)}</td><td>${esc(t.r)}</td></tr>`).join("")}</table></div>
 <div class="card row" style="margin-top:14px"><input id="tn" placeholder="Full name"><select id="tr"><option>Admin</option><option>Support</option><option>Sales</option><option>Viewer</option></select><button class="btn" id="ta">Invite member</button></div>`}
};

const binds={
website(){const s=S.site;
 $("#wt").oninput=e=>{s.title=e.target.value;$("#ht").textContent=s.title};$("#wg").oninput=e=>{s.tag=e.target.value;$("#hg").textContent=s.tag};
 document.querySelectorAll(".sw").forEach(b=>b.onclick=()=>{s.color=b.dataset.c;$("#hero").style.background=s.color});
 $("#pub").onclick=()=>{s.published=true;$("#pubs").textContent="Live at yourshop.hub.app";$("#pub").textContent="Update site";toast("Published")}},
chatbot(){const go=()=>{const i=$("#ci"),t=i.value.trim();if(!t)return;S.chat.push({b:0,t});S.chat.push({b:1,t:reply(t.toLowerCase())});render();$("#chat").scrollTop=1e5;$("#ci").focus()};
 $("#cs").onclick=go;$("#ci").onkeydown=e=>{if(e.key=="Enter")go()};$("#chat").scrollTop=1e5},
whatsapp(){$("#ws").onclick=()=>{const a=$("#wa").value,m=$("#wm").value.trim();if(!m)return toast("Write a message first");
 const x={a,m,st:"Sending"};S.sent.unshift(x);render();setTimeout(()=>{x.st="Delivered";if(cur=="whatsapp")render();toast("Broadcast delivered")},1400)}},
inventory(){document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{const[x,d]=b.dataset.d.split(":");S.inv[x].q=Math.max(0,S.inv[x].q+ +d);render()});
 $("#ia").onclick=()=>{const n=$("#in").value.trim(),p=+$("#ip").value,q=+$("#iq").value;if(!n||!p)return toast("Enter a name and price");S.inv.push({n,p,q});render();toast("Item added")}},
team(){$("#ta").onclick=()=>{const n=$("#tn").value.trim();if(!n)return toast("Enter a name");S.team.push({n,r:$("#tr").value});render();toast("Invite sent to "+n)}}
};

function reply(q){
 const hit=S.inv.find(i=>i.n.toLowerCase().split(" ").some(w=>w.length>3&&q.includes(w)));
 if(hit&&/price|cost|how much/.test(q))return `${hit.n} costs ₹${hit.p}.`;
 if(hit)return `${hit.n}: ₹${hit.p}, ${hit.q>0?hit.q+" in stock":"out of stock"}.`;
 if(/stock|available|have/.test(q))return "In stock: "+S.inv.filter(i=>i.q>0).map(i=>i.n).join(", ")+".";
 if(/ship|deliver/.test(q))return "We ship across India in 3–5 days.";
 if(/human|agent|support/.test(q))return "Connecting you to our support team on WhatsApp.";
 return "I'm not sure about that. Ask about a product, price, stock or delivery, or say \"agent\" to reach a person.";}
render();

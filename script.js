/* =========================================================
   FUTURO CMS / BACKEND ADAPTER
   ---------------------------------------------------------
   O frontend continua 100% estático. Este bloco NÃO cria
   backend, login, banco ou API. Ele apenas define um contrato
   único para que o futuro painel administrativo consiga:
   - editar textos, títulos e descrições;
   - cadastrar/editar/remover produtos, peixes, plantas etc.;
   - trocar imagens;
   - editar categorias;
   - editar galeria;
   - alterar contatos e informações institucionais;
   - enviar arquivos para um endpoint de upload futuramente.

   O profissional do backend poderá ligar os métodos abaixo
   a endpoints reais sem precisar reestruturar o site.
   ========================================================= */
const CMS_SCHEMA_VERSION = "1.0";

const CMS_SCHEMA = {
  site: ["logo","title","description","whatsapp","instagram","phone","address","hours"],
  navigation: ["label","href","visible","order"],
  hero: ["eyebrow","title","description","primaryButton","secondaryButton","backgroundImage"],
  categories: ["id","name","description","icon","image","visible","order"],
  products: ["id","name","category","price","badge","description","image","visible","order","featured"],
  fish: ["id","name","scientific","description","difficulty","size","image","visible","order"],
  aquariums: ["id","name","description","image","visible","order"],
  accessories: ["id","name","description","image","visible","order"],
  foods: ["id","name","description","image","visible","order"],
  plants: ["id","name","difficulty","light","description","image","visible","order"],
  gallery: ["id","category","image","alt","title","description","visible","order"],
  about: ["eyebrow","title","description","image","note"],
  reviews: ["id","name","date","rating","comment","avatar","visible","order","demo"],
  contact: ["whatsapp","instagram","phone","address","hours","mapUrl"],
  footer: ["description","copyright","links","socials"]
};

/*
  Contrato futuro sugerido:

  GET    /api/site
  PUT    /api/site
  GET    /api/products
  POST   /api/products
  PUT    /api/products/:id
  DELETE /api/products/:id
  GET/POST/PUT/DELETE /api/categories
  GET/POST/PUT/DELETE /api/fish
  GET/POST/PUT/DELETE /api/plants
  GET/POST/PUT/DELETE /api/gallery
  POST   /api/uploads
  DELETE /api/uploads/:id

  IMPORTANTE: os endpoints acima são somente documentação.
  Nenhum deles é chamado nesta versão.
*/
const AquaMaxiCMS = {
  version: CMS_SCHEMA_VERSION,
  mode: "frontend-only",
  apiBase: "/api",
  uploadEndpoint: "/api/uploads",
  schema: CMS_SCHEMA,

  // O backend poderá substituir esta função por fetch('/api/site').
  async load() {
    return null;
  },

  // O backend poderá substituir esta função por PUT/PATCH.
  async save(section, payload) {
    console.info("[AquaMaxi CMS] pronto para salvar:", section, payload);
    return { ok: false, backendNotConfigured: true, section, payload };
  },

  // O backend poderá trocar por multipart/form-data para /api/uploads.
  async uploadAsset(file) {
    if (!file) throw new Error("Arquivo não informado.");
    return {
      ok: false,
      backendNotConfigured: true,
      fileName: file.name,
      message: "Conecte este método ao endpoint de upload quando o backend for criado."
    };
  },

  // Permite que o backend injete um conteúdo completo depois.
  hydrate(content = {}) {
    if (content.site) Object.assign(siteConfig, content.site);
    if (Array.isArray(content.categories)) window.AquaMaxiData.categories = content.categories;
    if (Array.isArray(content.products)) window.AquaMaxiData.products = content.products;
    if (Array.isArray(content.fish)) window.AquaMaxiData.fish = content.fish;
    if (Array.isArray(content.plants)) window.AquaMaxiData.plants = content.plants;
    if (Array.isArray(content.foods)) window.AquaMaxiData.foods = content.foods;
    if (Array.isArray(content.gallery)) window.AquaMaxiData.gallery = content.gallery;
    if (typeof window.renderAllCMS === "function") window.renderAllCMS();
  },

  // Ajuda um futuro painel a saber quais campos cada entidade possui.
  getSchema() {
    return JSON.parse(JSON.stringify(this.schema));
  }
};

window.AquaMaxiCMS = AquaMaxiCMS;

/* =========================================================
   CONFIG
   ========================================================= */
const siteConfig = {
  whatsapp: "", // Ex.: "5511999999999" — não preenchido para não inventar número.
  instagram: "[INSTAGRAM DA AQUAMAXI]",
  phone: "[TELEFONE DA AQUAMAXI]",
  address: "[ENDEREÇO DA AQUAMAXI]",
  hours: "[HORÁRIO DA AQUAMAXI]"
};

/* =========================================================
   MOCK DATA — somente demonstração
   ========================================================= */
const img = {
  aquarium1:"https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1100&q=85",
  aquarium2:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1100&q=85",
  aquarium3:"https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1100&q=85",
  // Betta splendens — foto real de referência (Wikimedia Commons / CC BY 3.0)
  betta:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Beta.jpg",
  fish1:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Beta.jpg",
  fish2:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Beta.jpg",
  plant1:"https://happypetpets.com/wp-content/uploads/2022/03/Appearance-of-Anubias-Nana.jpg",
  plant2:"https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=900&q=85",
  nature:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
  // Produtos reais usados como REFERÊNCIA visual; não significam estoque da AquaMaxi.
  substrate:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Aquarium_gravel.jpg",
  externalFilter:"https://cdn.webshopapp.com/shops/6950/files/357924370/jbl-cristalprofi-e702-greenline.jpg",
  led:"https://www.aquaplantarumshop.it/pimages/Chihiros-WRGB-II-90-bluetooth-controller-100w-6200lumen-extra-big-2107-384.jpg",
  food:"https://www.kroger.com/product/images/large/front/0004679816204"
};
const categories = [
  ["Peixes Ornamentais","Peixes de diferentes espécies para aquários.","🐟",img.fish2],
  ["Aquários","Aquários e soluções para diferentes ambientes.","◫",img.aquarium1],
  ["Plantas Aquáticas","Plantas para criar ambientes naturais.","♧",img.plant1],
  ["Acessórios","Equipamentos e acessórios para aquarismo.","✦",img.aquarium3],
  ["Rações","Alimentação demonstrativa para peixes.","◉",img.fish1],
  ["Filtros","Soluções para filtragem e qualidade da água.","⌁",img.aquarium2],
  ["Iluminação","Iluminação para valorizar o aquário.","☼",img.nature],
  ["Decoração","Elementos decorativos para aquários.","◆",img.plant2]
];
const products = [
  {id:1,name:"Aquário Plantado Premium",cat:"Aquários",price:"Consultar",badge:"Referência visual",desc:"Composição demonstrativa para aquário plantado. Não representa um produto oficial da AquaMaxi.",image:img.aquarium1},
  {id:2,name:"Kit Aquário Nano",cat:"Aquários",price:"Consultar",badge:"Referência visual",desc:"Conceito compacto para ambientes menores; especificações devem ser definidas pela loja.",image:img.aquarium3},
  {id:3,name:"JBL CristalProfi e702 Greenline",cat:"Acessórios",price:"Consultar",badge:"Produto real",desc:"Filtro externo JBL para aquários de 60–200 L, com vazão nominal de 700 L/h e consumo de 9 W. Consulte o fabricante para especificações completas.",image:img.externalFilter},
  {id:4,name:"Chihiros WRGB II LED",cat:"Acessórios",price:"Consultar",badge:"Produto real",desc:"Iluminador WRGB para aquários plantados, com controle por aplicativo e ajuste de intensidade/espectro. Modelo e tamanho devem ser confirmados antes da compra.",image:img.led},
  {id:5,name:"TetraMin Flakes",cat:"Rações",price:"Consultar",badge:"Produto real",desc:"Ração em flocos da Tetra para peixes tropicais. A embalagem e a formulação exibidas são de referência e não indicam estoque da AquaMaxi.",image:img.food},
  {id:6,name:"Aqua One Natural Gravel 5 kg",cat:"Decoração",price:"Consultar",badge:"Produto real",desc:"Cascalho natural para aquários, apresentado como referência de substrato. Granulometria e composição devem ser conferidas no produto original.",image:img.substrate},
  {id:7,name:"Tronco Natural para Aquário",cat:"Decoração",price:"Consultar",badge:"Referência visual",desc:"Elemento decorativo natural. A disponibilidade, espécie da madeira e tratamento devem ser confirmados com a loja.",image:img.plant2},
  {id:8,name:"Anubias",cat:"Plantas",price:"Consultar",badge:"Espécie real",desc:"Planta aquática do gênero Anubias, usada em aquários plantados. Identificação da espécie e condições de cultivo devem ser confirmadas.",image:img.plant1},
  {id:9,name:"Betta splendens",cat:"Peixes",price:"Consultar",badge:"Espécie real",desc:"Betta, também conhecido como peixe-lutador-siamês. A foto mostra um exemplar real de Betta splendens; disponibilidade, sexo e variedade devem ser confirmados.",image:img.betta}
];
const fish = [
  {name:"Betta",scientific:"Betta splendens",desc:"Peixe de água doce originário do Sudeste Asiático. Possui órgão labirinto e os machos podem apresentar forte territorialidade.",tags:["Fácil*","~6 cm*"],image:img.betta},
  {name:"Guppy",scientific:"Poecilia reticulata",desc:"Pequeno peixe vivíparo muito popular em aquários comunitários, com muitas variedades de cores e nadadeiras.",tags:["Fácil*","~5 cm*"],image:img.fish1},
  {name:"Tetra Neon",scientific:"Paracheirodon innesi",desc:"Peixe pequeno de cardume, reconhecido pela faixa azul e vermelha e indicado para comunidades planejadas.",tags:["Intermediário*","~4 cm*"],image:img.fish2},
  {name:"Acará-bandeira",scientific:"Pterophyllum scalare",desc:"Ciclídeo de corpo alto que precisa de espaço vertical e planejamento de compatibilidade.",tags:["Intermediário*","~15 cm*"],image:img.aquarium2},
  {name:"Kinguio",scientific:"Carassius auratus",desc:"Peixe ornamental de grande produção de resíduos e que exige aquário adequado ao porte adulto.",tags:["Intermediário*","porte variável"],image:img.fish1},
  {name:"Molly",scientific:"Poecilia sphenops",desc:"Peixe vivíparo popular, encontrado em diferentes variedades de cor e formato.",tags:["Fácil*","~8 cm*"],image:img.fish2},
  {name:"Platy",scientific:"Xiphophorus maculatus",desc:"Peixe vivíparo de pequeno porte, conhecido por sua variedade de cores e comportamento comunitário.",tags:["Fácil*","~6 cm*"],image:img.fish1}
];
const plants = [
  {name:"Anubias",level:"Fácil",light:"Baixa",desc:"Planta resistente e versátil para diversas composições.",image:img.plant1},
  {name:"Java Fern",level:"Fácil",light:"Baixa",desc:"Opção popular para aquários naturais e de baixa exigência.",image:img.plant2},
  {name:"Cryptocoryne",level:"Intermediária",light:"Baixa/Média",desc:"Planta de visual natural para criar profundidade no layout.",image:img.plant1}
];
const foods = [
  {name:"Flocos",level:"Peixes tropicais",light:"Uso diário",desc:"Formato demonstrativo para alimentação de peixes ornamentais.",image:img.fish1},
  {name:"Pellets",level:"Peixes ornamentais",light:"Uso diário",desc:"Categoria visual de alimento em pellets.",image:img.fish2},
  {name:"Alimento especializado",level:"Conforme espécie",light:"Consultar",desc:"Espaço preparado para categorias específicas de alimentação.",image:img.aquarium1}
];
const gallery = [
  {cat:"Aquários",image:img.aquarium1,alt:"Aquário plantado demonstrativo"},
  {cat:"Aquários",image:img.aquarium2,alt:"Ambiente aquático demonstrativo"},
  {cat:"Plantas",image:img.plant1,alt:"Plantas em ambiente natural"},
  {cat:"Peixes",image:img.fish1,alt:"Peixes ornamentais demonstrativos"},
  {cat:"Plantas",image:img.plant2,alt:"Composição com plantas"},
  {cat:"Aquários",image:img.aquarium3,alt:"Aquário demonstrativo"}
 ];

// Fonte única de dados para o futuro painel administrativo.
// O backend poderá substituir estas coleções por dados vindos da API.
window.AquaMaxiData = {
  site: siteConfig,
  categories,
  products,
  fish,
  plants,
  foods,
  gallery
};

/* =========================================================
   UI FUNCTIONS
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let activeFilter = "Todos", query = "", favorites = JSON.parse(localStorage.getItem("aquamaxi-favorites")||"[]");

function renderCategories(){
  $("#categoryGrid").innerHTML = window.AquaMaxiData.categories.map(c=>`
    <article class="category-card reveal" data-cms-entity="category" data-cms-id="${c[0]}">
      <img src="${c[3]}" alt="${c[0]} — imagem demonstrativa" loading="lazy">
      <div class="category-info"><div class="category-icon">${c[2]}</div><h3>${c[0]}</h3><p>${c[1]}</p></div>
    </article>`).join("");
}
function renderProducts(){
  const list = window.AquaMaxiData.products.filter(p=>(activeFilter==="Todos"||p.cat===activeFilter) && (p.name+" "+p.cat+" "+p.desc).toLowerCase().includes(query.toLowerCase()));
  $("#productGrid").innerHTML = list.length ? list.map(p=>`
    <article class="product-card" data-cms-entity="product" data-cms-id="${p.id}">
      <div class="product-image"><img src="${p.image}" alt="${p.name} — imagem demonstrativa" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80'"><span class="badge">${p.badge}</span>
      <button class="heart ${favorites.includes(p.id)?"fav":""}" data-fav="${p.id}" aria-label="Favoritar ${p.name}">${favorites.includes(p.id)?"♥":"♡"}</button></div>
      <div class="product-body"><span class="product-cat">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p>
      <div class="product-foot"><div><div class="price">${p.price}</div><span class="demo">valor demonstrativo</span></div><button class="details-btn" data-product="${p.id}">Ver detalhes ↗</button></div></div>
    </article>`).join("") : `<div class="empty"><strong>Nenhum produto encontrado.</strong><br><span>Tente outro termo ou limpe os filtros.</span></div>`;
}
function renderFish(){
  $("#fishGrid").innerHTML = window.AquaMaxiData.fish.map((f,i)=>`
    <article class="fish-card" data-cms-entity="fish" data-cms-id="${i}"><img src="${f.image}" alt="${f.name} — imagem demonstrativa" loading="lazy"><div class="fish-info">
      <h3>${f.name}</h3><span class="scientific">${f.scientific}</span><p>${f.desc}</p><div class="fish-tags">${f.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <button class="text-btn" data-fish="${i}">Ver detalhes →</button></div></article>`).join("");
}
function renderPlants(){
  $("#plantGrid").innerHTML = window.AquaMaxiData.plants.map(p=>`<article class="plant-card" data-cms-entity="plant"> src="${p.image}" alt="${p.name} — imagem demonstrativa" loading="lazy"><div class="plant-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="plant-meta"><span>Dificuldade: ${p.level}</span><span>Iluminação: ${p.light}</span></div></div></article>`).join("");
}
function renderFoods(){
  $("#foodGrid").innerHTML = window.AquaMaxiData.foods.map(p=>`<article class="plant-card"><img src="${p.image}" alt="${p.name} — imagem demonstrativa" loading="lazy"><div class="plant-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="plant-meta"><span>${p.level}</span><span>${p.light}</span></div></div></article>`).join("");
}
function renderGallery(filter="Todos"){
  const list = window.AquaMaxiData.gallery.map((g,i)=>({...g,i})).filter(g=>filter==="Todos"||g.cat===filter);
  $("#galleryGrid").innerHTML = list.map(g=>`<button class="gallery-item" data-cms-entity="gallery" data-cms-id="${g.i}" data-gallery="${g.i}" aria-label="Ampliar ${g.alt}"><img src="${g.image}" alt="${g.alt}" loading="lazy"></button>`).join("");
}

/* =========================================================
   CMS REFRESH
   ========================================================= */
window.renderAllCMS = function(){
  renderCategories();
  renderProducts();
  renderFish();
  renderPlants();
  renderFoods();
  renderGallery();
  $("#contactWhatsapp").textContent=siteConfig.whatsapp || "[WHATSAPP DA AQUAMAXI]";
  $("#contactInstagram").textContent=siteConfig.instagram || "[INSTAGRAM DA AQUAMAXI]";
  $("#contactPhone").textContent=siteConfig.phone || "[TELEFONE DA AQUAMAXI]";
  $("#contactAddress").textContent=siteConfig.address || "[ENDEREÇO DA AQUAMAXI]";
  $("#contactHours").textContent=siteConfig.hours || "[HORÁRIO DA AQUAMAXI]";
};

/* =========================================================
   FILTERS / SEARCH
   ========================================================= */
$$(".chip[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".chip[data-filter]").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
  activeFilter=btn.dataset.filter; renderProducts();
}));
$("#search").addEventListener("input",e=>{query=e.target.value;renderProducts()});

$$(".chip[data-gallery-filter]").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".chip[data-gallery-filter]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderGallery(btn.dataset.galleryFilter);
}));

/* =========================================================
   MODALS
   ========================================================= */
function openProduct(id){
  const p=window.AquaMaxiData.products.find(x=>x.id===Number(id)); if(!p)return;
  $("#productModalContent").innerHTML=`<img src="${p.image}" alt="${p.name} — imagem demonstrativa"><div class="modal-copy"><span class="eyebrow">${p.cat}</span><h2>${p.name}</h2><p>${p.desc}</p><div class="meta"><span>${p.badge}</span><span>Conteúdo demonstrativo</span></div><h3>${p.price}</h3><small style="color:#789099">Produto de referência visual. Não significa estoque, preço ou vínculo comercial com a AquaMaxi. Confirme disponibilidade e especificações com a loja.</small><br><button class="primary-btn" style="margin-top:20px" onclick="showToast('Ação demonstrativa — conecte ao atendimento oficial futuramente.')">Solicitar informações ↗</button></div>`;
  $("#productModal").classList.add("open");document.body.classList.add("modal-open");
}
function openFish(i){
  const f=window.AquaMaxiData.fish[i];$("#productModalContent").innerHTML=`<img src="${f.image}" alt="${f.name} — imagem demonstrativa"><div class="modal-copy"><span class="eyebrow">Espécie demonstrativa</span><h2>${f.name}</h2><div class="scientific">${f.scientific}</div><p>${f.desc}</p><div class="meta">${f.tags.map(t=>`<span>${t}</span>`).join("")}</div><p style="font-size:.78rem">As informações são introdutórias. O asterisco (*) indica informação resumida para interface; confirme parâmetros, compatibilidade, volume e manejo antes de adquirir a espécie.</p></div>`;
  $("#productModal").classList.add("open");document.body.classList.add("modal-open");
}
let galleryIndex=0;
function openGallery(i){galleryIndex=Number(i);updateGallery();$("#galleryModal").classList.add("open");document.body.classList.add("modal-open")}
function updateGallery(){const g=window.AquaMaxiData.window.AquaMaxiData.gallery[galleryIndex];$("#galleryLarge").src=g.image;$("#galleryLarge").alt=g.alt}
function closeModal(id){$(id).classList.remove("open");document.body.classList.remove("modal-open")}
document.addEventListener("click",e=>{
  const product=e.target.closest("[data-product]"); if(product)openProduct(product.dataset.product);
  const fishBtn=e.target.closest("[data-fish]"); if(fishBtn)openFish(fishBtn.dataset.fish);
  const fav=e.target.closest("[data-fav]"); if(fav){const id=Number(fav.dataset.fav);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem("aquamaxi-favorites",JSON.stringify(favorites));renderProducts();showToast(favorites.includes(id)?"Adicionado aos favoritos":"Removido dos favoritos");}
  const gal=e.target.closest("[data-gallery]"); if(gal)openGallery(gal.dataset.gallery);
  const close=e.target.closest("[data-close]"); if(close)closeModal("#"+close.dataset.close);
});
$("#galleryPrev").onclick=()=>{galleryIndex=(galleryIndex-1+window.AquaMaxiData.gallery.length)%window.AquaMaxiData.gallery.length;updateGallery()};
$("#galleryNext").onclick=()=>{galleryIndex=(galleryIndex+1)%window.AquaMaxiData.gallery.length;updateGallery()};
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal("#"+m.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$$(".modal.open").forEach(m=>closeModal("#"+m.id))};if(e.key==="ArrowLeft"&&$("#galleryModal").classList.contains("open"))$("#galleryPrev").click();if(e.key==="ArrowRight"&&$("#galleryModal").classList.contains("open"))$("#galleryNext").click()});

/* =========================================================
   NAVIGATION
   ========================================================= */
const header=$("#header");
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",scrollY>30),{passive:true});
$("#menuBtn").onclick=()=>{const open=$("#mobileMenu").classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",open)};
$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{$("#mobileMenu").classList.remove("open");$("#menuBtn").setAttribute("aria-expanded","false")}));
const sections=$$("main section[id]");
const navLinks=$$(".nav-links a");
const navObs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id))}}),{rootMargin:"-40% 0px -50% 0px"});
sections.forEach(s=>navObs.observe(s));

/* =========================================================
   ANIMATIONS
   ========================================================= */
const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");revealObs.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>revealObs.observe(el));


/* =========================================================
   EDITABLE STATIC CONTENT BINDINGS
   ---------------------------------------------------------
   Um futuro painel poderá chamar:
   AquaMaxiCMS.applyStatic({
     "hero.title":"Novo título",
     "hero.description":"Novo texto",
     "hero.backgroundImage":"https://..."
   });
   ========================================================= */
AquaMaxiCMS.applyStatic = function(values = {}){
  Object.entries(values).forEach(([key, value])=>{
    const node = document.querySelector(`[data-cms-key="${CSS.escape(key)}"]`);
    if(!node) return;
    if(node.tagName === "IMG") {
      node.src = value;
    } else {
      node.textContent = value;
    }
  });
};

AquaMaxiCMS.getStaticKeys = function(){
  return [...document.querySelectorAll("[data-cms-key]")].map(el=>el.dataset.cmsKey);
};


/* =========================================================
   CONFIG / CONTACT
   ========================================================= */
$("#contactWhatsapp").textContent=siteConfig.whatsapp?siteConfig.whatsapp:"[WHATSAPP DA AQUAMAXI]";
$("#contactInstagram").textContent=siteConfig.instagram;
$("#contactPhone").textContent=siteConfig.phone;
$("#contactAddress").textContent=siteConfig.address;
$("#contactHours").textContent=siteConfig.hours;
function whatsappUrl(){
  return siteConfig.whatsapp ? "https://wa.me/"+siteConfig.whatsapp : "";
}
$("#whatsappContact").onclick=()=>{if(whatsappUrl())window.open(whatsappUrl(),"_blank","noopener");else showToast("Número do WhatsApp ainda não foi configurado.")};
$("#floatingWhatsapp").onclick=e=>{if(whatsappUrl()){e.preventDefault();window.open(whatsappUrl(),"_blank","noopener")}else{e.preventDefault();location.hash="contato";showToast("Número do WhatsApp ainda não foi configurado.")}};
function showToast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2600)}

/* =========================================================
   INIT
   ========================================================= */
renderCategories();renderProducts();renderFish();renderPlants();renderFoods();renderGallery();
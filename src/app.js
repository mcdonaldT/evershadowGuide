(() => {
  'use strict';
  const D = window.EVERSHADOW;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const paths = {
    core: '<path d="m12 2 8 5v10l-8 5-8-5V7Z"/><path d="m12 6 4 3v6l-4 3-4-3V9Z"/><path d="M12 6v12"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2"/>',
    city: '<path d="M3 21V9h6v12m0 0V3h6v18m0 0V7h6v14M1 21h22M5 12h2m-2 4h2m4-9h2m-2 4h2m-2 4h2m4-4h2m-2 4h2"/>',
    coins: '<ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v4c0 1.7 2.7 3 6 3m6-7v3M3 10v4c0 1.7 2.7 3 6 3M3 14v4c0 1.7 2.7 3 6 3"/><ellipse cx="16" cy="13" rx="5" ry="3"/><path d="M11 13v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5"/>',
    book: '<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15M5 8h4m-4 4h4m6-4h4m-4 4h4"/>',
    swords: '<path d="M3 2h4l13 14-4 4L3 7V2Zm18 0h-4l-5 6m5 5 4-6V2M2 21l5-5m10 0 5 5M2 14l8 8m4 0 8-8"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3"/>',
    shield: '<path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6Z"/><path d="M12 6v11m-4-7h8"/>',
    quill: '<path d="M4 20 18 6M3 21l3-7C8 5 15 1 22 2c0 7-4 14-13 16l-6 3Zm7-4 1-7m3 3 6-1"/>',
    home: '<path d="m2 11 10-9 10 9M5 9v12h14V9M10 21v-7h4v7"/>',
    leaf: '<path d="M20 3C7 1 1 8 6 17c9 5 16-1 14-14ZM3 21 16 8m-8 8v-5m4 1h5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    vault: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="5"/><path d="m12 7 1 3 4 2-4 1-1 4-1-4-4-1 4-2Z"/>',
    pack: '<path d="M9 6V4a3 3 0 0 1 6 0v2M6 6h12l2 15H4ZM4 11h16M9 11v4h6v-4"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    warning: '<path d="m12 3 10 18H2ZM12 9v5m0 3v.1"/>',
    route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',
    pin: '<path d="M19 9c0 6-7 13-7 13S5 15 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2"/>',
    paw: '<ellipse cx="12" cy="16" rx="5" ry="4"/><ellipse cx="4" cy="10" rx="2" ry="3"/><ellipse cx="9" cy="5" rx="2" ry="3"/><ellipse cx="15" cy="5" rx="2" ry="3"/><ellipse cx="20" cy="10" rx="2" ry="3"/>',
    print: '<path d="M6 8V2h12v6M6 17H3V8h18v9h-3M6 14h12v8H6ZM17 11h1"/>',
    train: '<rect x="5" y="2" width="14" height="17" rx="4"/><path d="M5 10h14M12 3v7M8 19l-2 3m10-3 2 3M8 14h1m6 0h1"/>',
    infinity: '<path d="M12 12C8 4 2 6 2 12s6 8 10 0c4-8 10-6 10 0s-6 8-10 0Z"/>'
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.compass}</svg>`;
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const nav = [
    ['overview', 'Welcome to Evershadow', 'compass', '01'], ['city', 'The City & Its Rings', 'city', '02'],
    ['economy', 'Coin & Commerce', 'coins', '03'], ['dungeon', 'Dungeon Guide', 'book', '04'],
    ['guild', 'The Adventurer’s Guild', 'swords', '05'], ['people', 'People to Know', 'people', '06'],
    ['factions', 'Guilds & Factions', 'shield', '07']
  ];
  $('#main-nav').innerHTML = nav.map(([id, label, symbol, number]) => `<a class="nav-item" href="#${id}" data-nav="${id}">${icon(symbol)}<span>${label}</span><span class="nav-index">${number}</span></a>`).join('');
  const main = $('#main');
  let currentRoute = 'overview';
  let floorId = '1';
  let peopleCategory = 'All';
  let peopleQuery = '';
  let storageAvailable = true;
  let checklist = {};
  try {
    const stored = JSON.parse(localStorage.getItem('evershadow-preparation-v1') || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) checklist = stored;
  } catch { storageAvailable = false; }
  function saveChecklist() {
    try { localStorage.setItem('evershadow-preparation-v1', JSON.stringify(checklist)); }
    catch { storageAvailable = false; }
  }
  const link = (route, text) => `<a class="text-link" href="#${route}">${text}${icon('arrow')}</a>`;
  const pageIntro = (number, title, description) => `<div class="page-intro"><span class="eyebrow">THE FIELD GUIDE &nbsp; / &nbsp; CHAPTER ${number}</span><h1>${title}</h1><p>${description}</p></div>`;
  const heading = (title, subtitle = '') => `<div class="section-heading"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div></div>`;
  const notice = text => `<div class="notice">${icon('warning')}<p>${text}</p></div>`;
  const table = (headers, rows, extraClass = '') => `<div class="table-wrap"><table class="${extraClass}"><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  function renderOverview() {
    return `<section class="hero" aria-labelledby="hero-title"><img class="hero-image" src="assets/evershadow-city.png" alt="An illustrated view of Evershadow: countless illuminated towers and terraces around the vast, teal-lit Abyssal Core."><div class="hero-inner"><div class="hero-kicker">A CITY ABOVE. A WORLD BELOW.</div><h1 id="hero-title">Evershadow</h1><p class="hero-subtitle">The Eternal Dungeon City</p><p class="hero-copy">Five rings. Countless stories. One endless descent.<br>Find your place in the city built around the Abyssal Core—and prepare for what waits beneath it.</p><div class="actions"><a class="button" href="#city">Explore the city ${icon('arrow')}</a><a class="button secondary" href="#dungeon/1">Open the dungeon guide ${icon('book')}</a></div></div><span class="hero-caption">THE ABYSSAL CORE &nbsp; · &nbsp; AN ARTIST’S IMPRESSION</span></section>
    <div class="page overview-content"><div class="city-stats">${[['city','Five rings','ONE EXTRAORDINARY CITY'],['people','15 million','PEOPLE CALL IT HOME'],['core','The Abyssal Core','THE CITY’S ENDLESS DUNGEON'],['book','Floors 01–02','YOUR FIRST FIELD NOTES']].map(([i,v,l])=>`<div class="stat">${icon(i)}<div><strong>${v}</strong><span>${l}</span></div></div>`).join('')}</div>
    <div class="welcome-row"><div><span class="eyebrow">WELCOME, ADVENTURER</span><h2>Every fortune starts with a first step.</h2><p>Evershadow is more than a gateway to the unknown. It is a city of merchants and makers, scholars and healers, and adventurers from across the world. The dungeon shapes everything here—from the coin in your pocket to the carriage that takes you home.</p></div><div class="arrival-note"><span class="eyebrow">YOUR FIRST STOP</span><p>Head east of Core Plaza to the Adventurer’s Guild. Meet your receptionist, find your party, and get your bearings before your first descent.</p>${link('guild','Get to know the guild')}</div></div>
    <div class="section-heading"><h2>A guide to your next chapter</h2><span class="eyebrow">KNOW THE CITY. KNOW THE WAY.</span></div>
    <div class="explore-grid"><a class="explore-card" href="#city"><div class="card-art map-art"><img src="assets/central-district.webp" alt="Parchment map of the Central District" loading="lazy"><span class="art-label">PLACES & PASSAGES</span></div><div class="card-copy"><h3>A city in five rings</h3><p>From Core Plaza to the outer walls, discover where life happens.</p><span class="text-link">Walk the districts ${icon('arrow')}</span></div></a><a class="explore-card" href="#dungeon/1"><div class="card-art"><img src="assets/verdant-meadow.png" alt="A winding path through the lush Verdant Meadow" loading="lazy"><span class="art-label">THE FIRST DESCENT</span></div><div class="card-copy"><h3>Beyond the threshold</h3><p>Routes, creatures, and field notes for your first two floors.</p><span class="text-link">Read the guidebook ${icon('arrow')}</span></div></a><a class="explore-card" href="#guild"><div class="card-art guild-art">${icon('swords')}<span class="art-label">A PLACE TO BELONG</span></div><div class="card-copy"><h3>You don’t delve alone</h3><p>Find your people, earn your rank, and make a name for yourself.</p><span class="text-link">Enter the guildhall ${icon('arrow')}</span></div></a></div>
    <div class="bottom-callout">${icon('coins')}<p><strong>A little coin goes a long way.</strong><br>A meal, a room, a transit ticket—learn what life in Evershadow costs.</p>${link('economy','Coin & commerce')}</div></div>`;
  }

  function renderCity(selected = 'central') {
    const district = D.districts.find(d => d.id === selected) || D.districts[0];
    const rings = [...D.districts].reverse().map((d, i) => {
      const radius = 174 - i * 33;
      return `<g><circle class="map-ring ${district.id === d.id ? 'active' : ''}" cx="210" cy="210" r="${radius}" data-district="${d.id}" tabindex="0" role="button" aria-label="Explore ${d.name}" aria-pressed="${district.id === d.id}"/><text class="ring-label" x="210" y="${210-radius+20}" text-anchor="middle">${d.number}</text></g>`;
    }).join('');
    return `<div class="page">${pageIntro('02','One city. Five worlds.','Evershadow unfolds in concentric rings around the Abyssal Core. Follow the streets outward and the city changes—from monumental plazas to busy markets, lived-in neighborhoods, workshops, and farmland.')}
    <div class="section-label">THE FIVE RINGS OF EVERSHADOW</div><div class="map-layout" style="margin-top:18px"><div class="ring-map"><span class="north">N ↑</span><svg viewBox="0 0 420 420" aria-label="Interactive schematic of Evershadow’s five districts">${rings}<path d="M24 210h352M210 24v352" stroke="#bbb57a" stroke-opacity=".18" pointer-events="none" stroke-dasharray="3 7"/><path d="m210 196 9 6v13l-9 6-9-6v-13Z" stroke="#e5ca8f" fill="none" pointer-events="none"/></svg><div class="map-scale"><span>SELECT A RING TO EXPLORE</span><span>SCHEMATIC · NOT TO SCALE</span></div></div><div class="district-detail" id="district-detail" aria-live="polite">${districtContent(district)}</div></div>
    <div class="district-selector" aria-label="Choose a city district">${D.districts.map(d=>`<button type="button" data-district="${d.id}" aria-pressed="${d.id === district.id}">${d.number} &nbsp; ${d.short}</button>`).join('')}</div>
    ${heading('At the heart of it all','Your bearings around Core Plaza. Directions are relative to the dungeon entrance.')}
    <div class="two-column"><div class="central-map"><img src="assets/central-district.webp" alt="Illustrated overhead map of the Central District, with a circular dungeon entrance amid civic buildings and landscaped plazas." loading="lazy"><button class="map-open" type="button" data-open-map>View full map ↗</button></div><div class="landmarks">${D.landmarks.map((p,i)=>`<details class="landmark" id="${p.id}" ${i===0?'open':''}><summary><span class="direction">${p.direction}</span>${p.name}</summary><p>${p.description}</p><p class="person-line">${p.person}</p></details>`).join('')}</div></div>
    <div class="two-column service-panel"><article class="panel"><div class="fact-icon">${icon('train')}</div><span class="eyebrow">GETTING AROUND</span><h3 style="margin-top:10px">The Arcane Transit Network</h3><p>Levitating carriages run along illuminated routes between the rings and through local neighborhoods. Dungeon-derived crystals, mana conduits, and bound wind spirits power the network. Major hubs connect longer journeys through teleportation nodes.</p><div class="tag-row"><span class="tag gold">Single ride · 2 cp</span><span class="tag gold">Monthly pass · 1 gp</span></div></article><article class="panel"><div class="fact-icon">${icon('home')}</div><span class="eyebrow">A NEIGHBORHOOD TO KNOW</span><h3 style="margin-top:10px">The Iron Anchor</h3><p>Residential Sector 4 is home to veterans and working families. Dark basalt, amber-veined Heartwood beams, and soft blue lanterns give its streets a quieter character. Life centers on ATN Hub 04 and the Anvil marketplace.</p>${link('economy','Find the cost of a room')}</article></div></div>`;
  }
  function districtContent(d) {
    return `<span class="eyebrow">RING ${d.number} &nbsp; / &nbsp; CITY ATLAS</span><h2>${d.name}</h2><p class="district-subtitle">${d.subtitle}</p><p>${d.description}</p><ul>${d.sights.map(s=>`<li>${s}</li>`).join('')}</ul><p class="visit-note"><strong>Come here to:</strong> ${d.visit}</p><div class="tag-row">${d.places.map(p=>`<span class="tag">${p}</span>`).join('')}</div>`;
  }
  function selectDistrict(id) {
    const district = D.districts.find(d=>d.id===id);
    if (!district) return;
    $('#district-detail').innerHTML = districtContent(district);
    $$('[data-district]').forEach(el=>{ const selected=el.dataset.district===id; el.setAttribute('aria-pressed',String(selected)); el.classList.toggle('active',selected); });
    history.replaceState(null,'',`#city/${id}`);
  }

  function renderEconomy() {
    return `<div class="page">${pageIntro('03','Coin & commerce.','The Abyssal Core is the engine of Evershadow’s economy. Adventurers bring back materials; merchants, craftspeople, and scholars turn those discoveries into wealth, equipment, and the magic of everyday life.')}
    <div class="economy-top"><div class="economy-fact"><strong>50%</strong><span>Typical loot sale price against market value</span></div><div class="economy-fact"><strong>5%</strong><span>Guild fee on loot sales</span></div><div class="economy-fact"><strong>10%</strong><span>City tax on goods and services sold</span></div></div>
    <div class="market-split"><section id="prices"><h2 style="font-size:27px">The everyday price list</h2><p class="small-copy">Listed guide prices. Availability and final quotes may vary.</p><div class="filters"><label class="sr-only" for="price-search">Find goods or services</label><input id="price-search" type="search" placeholder="Find a meal, a room, a potion…"><label class="sr-only" for="price-category">Price category</label><select id="price-category"><option>All categories</option>${[...new Set(D.goods.map(g=>g[1]))].map(c=>`<option>${c}</option>`).join('')}</select></div><div id="price-results"></div><p class="small-copy" id="price-count" role="status" style="margin-top:12px"></p></section>
    <aside class="calculator" id="loot"><span class="eyebrow">BEFORE YOU VISIT THE EXCHANGE</span><h3 style="margin-top:10px">What is your loot worth?</h3><p>Estimate one type of haul using average market values for the first two floors.</p><div class="calculator-fields"><label class="field-label">Dungeon material<select id="loot-item">${D.loot.map(([name,,floor],i)=>`<option value="${i}">${name} · F${floor}</option>`).join('')}</select></label><label class="field-label">Quantity<input id="loot-quantity" type="number" min="1" max="9999" value="1" step="1" inputmode="numeric" required></label></div><div id="loot-result" aria-live="polite"></div><p class="calc-help">Estimate convention: the merchant pays 50% of market value. The 5% guild fee and 10% city tax are each deducted from that sale price, rounded separately to the nearest copper. Your GM confirms the final settlement.</p></aside></div>
    <div class="notice">${icon('coins')}<p><strong>Coin at a glance:</strong> 1 gp = 10 sp = 100 cp. Prices below use familiar coin units. The Astral Vault Network also supports Aetheric Marks; ask a transaction hub for exchange terms.</p></div>
    ${heading('The cost of calling it home','A fortune to one citizen is a single commission to another.')}
    <div class="two-column"><section><h3>Monthly wages</h3>${table(['Profession','Income / month'],D.wages,'price-table')}</section><section><h3>Monthly rent</h3>${table(['Accommodation','Rent / month'],D.housing,'price-table')}<p class="small-copy" style="margin-top:16px">Basic living is roughly 10–15 gp per month, depending on circumstances. Shared housing is common: a laborer earning 6 gp cannot comfortably fund a private household alone.</p><div class="tag-row"><span class="tag">Comfortable life · ~50 gp / month</span><span class="tag">Wealthy life · ~200 gp / month</span></div></section></div>
    <details class="economy-details" id="crafting"><summary>Crafting & commissions</summary><p class="small-copy">Examples include both materials and the craftsperson’s fee. Supplying your own materials changes the coin you need to pay.</p>${table(['Commission','Materials + work','Total'],D.crafting,'price-table')}</details>
    <details class="economy-details" id="market-values"><summary>Dungeon materials · market & sale values</summary>${table(['Material','Floor','Market value','Merchant pays'],D.loot.map(([n,v,f])=>[n,`0${f}`,`${v} gp`,`${v/2} gp before fees`]),'price-table')}</details>
    ${heading('The wealth that keeps Evershadow moving')}
    <div class="two-column"><article class="panel" id="banking"><div class="fact-icon">${icon('vault')}</div><span class="eyebrow">THE ASTRAL VAULT NETWORK</span><h3 style="margin-top:10px">A vault that travels with you</h3><p>Registered citizens and adventurers can open a personal arcane vault with the Arcane Treasury Guild. Store coin, artifacts, and contracts; access your holdings through an attuned sigil or authorized key.</p><p>Arcane Transaction Hubs in major districts support deposits, withdrawals, transfers, and appraisals. Aetheric transfers move funds between linked vaults, while physical gold remains in use.</p><div class="tag-row"><span class="tag">Personal vaults</span><span class="tag">Magical transfers</span><span class="tag">Loot appraisal</span></div></article><article class="panel"><span class="eyebrow">CITY SERVICES · MONTHLY BUDGET</span><h3 style="margin-top:10px">155,000 gp in public services</h3><p>The guide’s listed operating estimates show how the city directs its service spending.</p>${D.services.map(([n,v])=>`<div class="budget-row"><div class="budget-label"><span>${n}</span><span>${v.toLocaleString('en-US')} gp</span></div><div class="bar-track"><div class="bar-fill" style="width:${v/50000*100}%"></div></div></div>`).join('')}</article></div></div>`;
  }
  function filterPrices() {
    const query = ($('#price-search')?.value || '').trim().toLowerCase();
    const category = $('#price-category')?.value || 'All categories';
    const goods = D.goods.filter(g => (category === 'All categories' || g[1] === category) && g.join(' ').toLowerCase().includes(query));
    $('#price-results').innerHTML = goods.length ? table(['Good or service','Category','Price'],goods,'price-table') : '<div class="empty-state">No matching prices. Try another item or category.</div>';
    $('#price-count').textContent = `${goods.length} ${goods.length === 1 ? 'price' : 'prices'} in the guide`;
  }
  function updateLoot() {
    const input=$('#loot-quantity');
    const quantity=Number(input.value);
    const item=D.loot[Number($('#loot-item').value)];
    const valid=input.value.trim()!=='' && Number.isInteger(quantity) && quantity>=1 && quantity<=9999 && item;
    input.setAttribute('aria-invalid',String(!valid));
    if (!valid) { $('#loot-result').innerHTML='<p class="notice">Enter a whole quantity from 1 to 9,999.</p>'; return; }
    const market=item[1]*quantity*100;
    const sale=market/2;
    const fee=Math.round(sale*.05);
    const tax=Math.round(sale*.1);
    const money=cp=>(cp/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' gp';
    $('#loot-result').innerHTML=`<div class="calc-lines"><div class="calc-row"><span>Total market value</span><span>${money(market)}</span></div><div class="calc-row"><span>Merchant’s offer · 50%</span><span>${money(sale)}</span></div><div class="calc-row"><span>Guild fee · 5%</span><span>− ${money(fee)}</span></div><div class="calc-row"><span>City tax · 10%</span><span>− ${money(tax)}</span></div></div><div class="calc-total"><span>ESTIMATED TAKE-HOME</span><strong id="loot-total">${money(sale-fee-tax)}</strong></div>`;
  }

  function renderDungeon(id='1') {
    const floor=D.floors.find(f=>f.id===id)||D.floors[0]; floorId=floor.id;
    const checked=floor.gear.filter((_,i)=>checklist[`${floorId}-${i}`]===true).length;
    return `<div class="page">${pageIntro('04','Beyond the threshold.','The Adventurer’s Guidebook to the first two floors of the Abyssal Core. Know the terrain, respect its inhabitants, and prepare together. Every dungeon instance can be different.')}
    <div class="floor-toolbar"><div class="tabs" role="tablist" aria-label="Choose a dungeon floor">${D.floors.map(f=>`<button type="button" class="tab" id="floor-tab-${f.id}" role="tab" aria-controls="floor-panel" aria-selected="${f.id===floorId}" tabindex="${f.id===floorId?'0':'-1'}" data-floor="${f.id}"><span>0${f.id}</span>${f.id==='1'?'Verdant Meadow':'Whispering Woods'}</button>`).join('')}</div><button type="button" class="button secondary small" id="print-floor" aria-label="Print the selected floor guide">${icon('print')} Print this floor</button></div>
    <section id="floor-panel" role="tabpanel" aria-labelledby="floor-tab-${floorId}"><div class="floor-hero ${floor.className}"><img src="assets/${floorId==='1'?'verdant-meadow':'whispering-woods'}.png" alt="${floorId==='1'?'Sunlit hills, tall grass, and a stream in the Verdant Meadow.':'An ancient forest path disappears into mist beneath the towering trees of the Whispering Woods.'}"><div class="floor-hero-copy"><span class="eyebrow">THE ABYSSAL CORE &nbsp; / &nbsp; FLOOR 0${floorId}</span><h2>${floor.name}</h2><p class="subtitle">${floor.subtitle}</p><div class="tag-row"><span class="tag gold">${floor.biome}</span><span class="tag">${floor.risk}</span></div></div></div><p class="floor-intro">${floor.description}</p>${notice(floor.warning)}
    <div class="floor-layout"><div><section class="field-section" id="floor-routes"><h3>${icon('route')} Paths & safer routes</h3>${floor.routes.map(([n,p])=>`<div class="field-entry"><h4>${n}</h4><p>${p}</p></div>`).join('')}</section><section class="field-section" id="floor-places"><h3>${icon('pin')} Places to look for</h3>${floor.places.map(([n,p])=>`<div class="field-entry"><h4>${n}</h4><p>${p}</p></div>`).join('')}</section><section class="field-section" id="floor-creatures"><h3>${icon('paw')} Creatures of the floor</h3>${floor.creatures.map(([n,p,d],i)=>`<details class="creature" id="creature-${i}"><summary>${icon('paw')}${n}</summary><div class="creature-content"><p>${p}</p><p class="drop-line"><strong>Known drops:</strong> ${d}.</p></div></details>`).join('')}</section></div>
    <aside class="floor-aside"><div class="checklist"><span class="eyebrow">BEFORE YOU DESCEND</span><h3 style="margin-top:10px">Pack with a purpose.</h3><p class="check-caption">Recommended gear and expedition reminders.</p><div class="check-progress" aria-hidden="true"><span id="check-bar" style="width:${checked/floor.gear.length*100}%"></span></div>${floor.gear.map((g,i)=>`<label class="check-item"><input type="checkbox" data-check="${floorId}-${i}" ${checklist[`${floorId}-${i}`]===true?'checked':''}><span>${g}</span></label>`).join('')}<div class="check-footer"><span id="check-count" role="status">${checked} of ${floor.gear.length} ready</span><button type="button" class="subtle-button" id="reset-checklist">Reset list</button></div><p class="check-caption" id="storage-note" style="margin-top:13px;margin-bottom:0">${storageAvailable?'Your checklist is saved on this device.':'Checklist available for this visit; browser storage is unavailable.'}</p></div><div class="field-loot"><span class="eyebrow">WORTH KNOWING</span><h3 style="margin-top:10px">Materials to remember</h3><div class="tag-row">${floor.drops.map(d=>`<span class="tag">${d}</span>`).join('')}</div><p class="small-copy">A useful material may be worth keeping for a commission. Check its market value before you sell.</p>${link('economy/loot','Estimate your loot value')}</div></aside></div>
    <div class="notice">${icon('people')}<p><strong>Work together. Respect the forest.</strong> The guide offers a starting point, not a promise. Paths, resources, and encounters may differ between journeys. Decide how your party will regroup before entering.</p></div></section></div>`;
  }
  function updateChecklist() {
    const items=$$('[data-check]');
    const checked=items.filter(el=>el.checked).length;
    $('#check-count').textContent=`${checked} of ${items.length} ready`;
    $('#check-bar').style.width=`${checked/items.length*100}%`;
    if (!storageAvailable) $('#storage-note').textContent='Checklist available for this visit; browser storage is unavailable.';
  }
  function switchFloor(id) {
    if (!D.floors.some(f=>f.id===id)) return;
    main.innerHTML=renderDungeon(id);
    history.replaceState(null,'',`#dungeon/${id}`);
    $(`#floor-tab-${id}`).focus({preventScroll:true});
  }

  function renderGuild() {
    return `<div class="page">${pageIntro('05','A place to belong.','Your guild is a starting point, a support network, and a place to return to. Beyond its great doors, a new adventurer can find advice, companions, work, and the next step forward.')}
    <div class="guild-banner">${icon('swords')}<div><span class="eyebrow">EAST OF CORE PLAZA</span><h2 style="margin-top:9px">The Adventurer’s Guild</h2><p>Vaulted ceilings, polished stone, warm magical light, and the sound of a hundred expeditions being planned. Guildmaster Thorne Ironguard leads a hall built around exploration, research, combat, and negotiation.</p></div></div>
    ${heading('Your first visit')}
    <div class="steps">${[['01','Meet reception','Sign in with Lirae and collect a numbered token. New parties are assigned a receptionist for gear, provisions, and guidance.'],['02','Find your footing','Meet your advisor, register your party, and learn about your guild badge. Use the lounge and mission board to meet companions.'],['03','Choose your work','Read a suitable mission scroll. The party leader claims it, and the party is registered. Confirm special requirements with the desk.'],['04','Return & report','Bring the completed scroll to reception. Staff verify your work and arrange your reward. Restock, rest, and discuss your next steps.']].map(([n,h,p])=>`<article class="step"><span class="step-number">${n}</span><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>
    ${heading('Your badge. Your progress.','A rank is earned through experience, judgment, and the trust of your guild.')}
    <div class="two-column"><section><div class="rank-picker" aria-label="Explore guild ranks">${D.ranks.map(([rank],i)=>`<button type="button" class="rank-button" data-rank="${rank}" aria-label="${rank} rank" aria-pressed="${i===0}">${rank}</button>`).join('')}</div><div class="rank-description" id="rank-description" aria-live="polite">${rankContent(D.ranks[0])}</div><p class="small-copy" style="margin-top:17px">Promotion considers completed missions, skill, conduct, and contributions to the guild. Ask reception for a review; higher ranks may require a trial. Discovery and leadership matter alongside combat.</p></section><article class="panel"><div class="fact-icon">${icon('core')}</div><h3>More than an insignia</h3><p>A guild badge is attuned to its owner’s soul. Its low-level Sending core supports brief communication, while its unique magical “seed” links it to a particular dungeon instance.</p><p>A paired counterpart shares the seed’s signature. Coordinate your expedition through the guild so your party enters its designated instance.</p><div class="tag-row"><span class="tag">Personal attunement</span><span class="tag">Sending core</span><span class="tag">Instance seed</span></div></article></div>
    ${heading('Read the board before you take the job','Mission categories and typical rewards. Confirm the requirements on the actual posting.')}
    <div class="mission-grid">${D.missions.map(([color,n,r,reward,desc])=>`<article class="mission-card ${color}"><span class="tag">${r} RANK</span><h3>${n}</h3><p>${desc}</p><span class="reward">${reward}</span></article>`).join('')}</div>
    ${heading('Make yourself at home')}
    <div class="three-column"><article class="panel"><div class="fact-icon">${icon('people')}</div><h3>The common hall</h3><p>Share stories by the fireplaces, plan at the long tables, and study the trophy displays. The cafeteria offers hearty meals, with a tavern area nearby.</p></article><article class="panel"><div class="fact-icon">${icon('shield')}</div><h3>Training & advice</h3><p>A hall to the right leads to the training grounds. Advisors help with briefings and progression; private offices provide space for detailed discussions.</p></article><article class="panel"><div class="fact-icon">${icon('pack')}</div><h3>Supplies & information</h3><p>Visit Balin Stonetoe beside the cafeteria to restock. Check announcements and the arcane city map before planning your next expedition.</p></article></div><div class="bottom-callout">${icon('people')}<p><strong>Put a name to a familiar face.</strong><br>Know who to ask when you need a hand.</p>${link('people','Meet the people of Evershadow')}</div></div>`;
  }
  const rankContent = ([rank,name,description])=>`<h3>${rank} Rank · ${name}</h3><p>${description}</p>`;

  function renderPeople() {
    peopleCategory='All';peopleQuery='';
    return `<div class="page">${pageIntro('06','Names worth remembering.','A helpful receptionist. An exacting mentor. A merchant with just the right connection. These are some of the people you may meet as you make a life in Evershadow.')}
    <div class="filters"><label class="sr-only" for="people-search">Search people by name, role, or location</label><input type="search" id="people-search" placeholder="Find a name, a role, a place…">${['All','Guild','City','Independent','Community'].map((c,i)=>`<button type="button" class="filter-button" data-people-category="${c}" aria-pressed="${i===0}">${c}</button>`).join('')}</div><p class="small-copy" id="people-count" role="status"></p><div class="people-grid" id="people-grid"></div></div>`;
  }
  function filterPeople() {
    const people=D.people.filter(p=>(peopleCategory==='All'||p.category===peopleCategory)&&[p.name,p.role,p.place,p.description,p.help].join(' ').toLowerCase().includes(peopleQuery.toLowerCase().trim()));
    $('#people-count').textContent=`${people.length} ${people.length===1?'person':'people'} in the directory`;
    $('#people-grid').innerHTML=people.length?people.map(p=>`<article class="person-card" id="person-${p.id}"><div class="person-header">${icon(p.icon)}<span class="initials">${p.initials}</span></div><div class="person-content"><span class="eyebrow">${p.role}</span><h3>${p.name}</h3><p>${p.description}</p><button type="button" class="text-link" data-person="${p.id}">Meet ${p.name.split(' ')[0]} ${icon('arrow')}</button></div></article>`).join(''):'<p class="empty-state" style="grid-column:1/-1">No people match that search. Try a different name or group.</p>';
  }
  function openPerson(id) {
    const p=D.people.find(p=>p.id===id);if(!p)return;
    openDetail(`<div class="portrait-seal">${icon(p.icon)}</div><span class="eyebrow">${p.role}</span><h2 id="detail-title">${p.name}</h2><p>${p.description}</p><p>${p.detail}</p><div class="notice">${icon('pin')}<p><strong>Where to find them</strong><br>${p.place}</p></div><h3>Ask about</h3><p>${p.help}</p>`);
  }
  function renderFactions() {
    return `<div class="page">${pageIntro('07','The powers around you.','Evershadow thrives through its guilds, civic institutions, independent companies, and community groups. Knowing what each one does is the first step toward finding your place among them.')}
    <div class="factions-grid">${D.factions.map(f=>`<article class="faction-card" id="faction-${f.id}"><div class="faction-symbol">${icon(f.icon)}</div><div><span class="eyebrow">${f.type}</span><h3>${f.name}</h3><p>${f.description}</p><p class="contact">${f.contact}</p><p class="relationship">${f.relationship}</p></div></article>`).join('')}</div>
    <div class="grin-feature"><img src="assets/grinreapers.webp" alt="The GrinReapers’ grinning mask emblem" loading="lazy"><div><span class="eyebrow">A NAME YOU’LL HEAR IN THE TRADE RING</span><h3>Fight hard. Laugh harder.</h3><p>The GrinReapers’ familiar mix of fierce loyalty and dark humor makes them stand out in the city’s adventuring circles. Their guildhall is modest; their sense of camaraderie is anything but.</p>${link('people/retsu','Meet Retsu “Reaper” Jinsei')}</div></div></div>`;
  }

  function openDetail(content, map=false) {
    const dialog=$('#detail-dialog');dialog.classList.toggle('map-dialog',map);
    $('#detail-body').innerHTML=content;
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;
  }
  function closeMenu() {
    const wasOpen=$('#sidebar').classList.contains('open');
    $('#sidebar').classList.remove('open');$('#menu-shade').hidden=true;
    $('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Open navigation');
    if(wasOpen&&window.matchMedia('(max-width:720px)').matches)$('#menu-toggle').focus();
  }
  function toggleMenu() {
    const open=!$('#sidebar').classList.contains('open');
    $('#sidebar').classList.toggle('open',open);$('#menu-shade').hidden=!open;
    $('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');
    if(open)$('.nav-item.active').focus();
  }
  $('#menu-toggle').addEventListener('click',toggleMenu);
  $('#menu-shade').addEventListener('click',closeMenu);
  $('#main-nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  window.matchMedia('(min-width:721px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

  function renderRoute(initial=false) {
    let hash;
    try {hash=decodeURIComponent(location.hash.slice(1));}catch{hash='overview';}
    const [requested,detail]=hash.split('/');
    const page=nav.some(n=>n[0]===requested)?requested:'overview';
    currentRoute=page;
    if(!requested||requested!==page)history.replaceState(null,'',`#${page}`);
    if($('#detail-dialog').open)$('#detail-dialog').close();
    const renders={overview:renderOverview,city:()=>renderCity(detail),economy:renderEconomy,dungeon:()=>renderDungeon(detail),guild:renderGuild,people:renderPeople,factions:renderFactions};
    main.innerHTML=renders[page]();
    if(page==='economy'){filterPrices();updateLoot();}
    if(page==='people')filterPeople();
    $$('.nav-item').forEach(el=>{const active=el.dataset.nav===page;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    const title=nav.find(n=>n[0]===page)[1];
    $('#breadcrumb-current').textContent=title;
    document.title=`${title} — Evershadow Field Guide`;
    closeMenu();
    if(!initial)main.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
    if(page==='people'&&detail)openPerson(detail);
    const anchor=page==='factions'?`faction-${detail}`:page==='dungeon'?undefined:detail;
    if(anchor&&['economy','factions','city'].includes(page)) {
      const target=document.getElementById(anchor);
      if(target){if(target.tagName==='DETAILS')target.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));}
    }
  }
  window.addEventListener('hashchange',()=>renderRoute());

  main.addEventListener('click',event=>{
    const target=event.target.closest('button,[data-district]');if(!target)return;
    if(target.dataset.district)selectDistrict(target.dataset.district);
    if(target.hasAttribute('data-open-map'))openDetail('<h2 id="detail-title">The Central District</h2><p>An illustrated view of Core Plaza and its surroundings. Use the location list in the city atlas for directions.</p><img src="assets/central-district.webp" alt="Full illustrated map of the Central District">',true);
    if(target.dataset.floor)switchFloor(target.dataset.floor);
    if(target.dataset.rank){const rank=D.ranks.find(r=>r[0]===target.dataset.rank);$('#rank-description').innerHTML=rankContent(rank);$$('[data-rank]').forEach(el=>el.setAttribute('aria-pressed',String(el===target)));}
    if(target.dataset.peopleCategory){peopleCategory=target.dataset.peopleCategory;$$('[data-people-category]').forEach(el=>el.setAttribute('aria-pressed',String(el===target)));filterPeople();}
    if(target.dataset.person)openPerson(target.dataset.person);
    if(target.id==='reset-checklist'){$$('[data-check]').forEach(el=>{el.checked=false;delete checklist[el.dataset.check];});saveChecklist();updateChecklist();}
    if(target.id==='print-floor')window.print();
  });
  main.addEventListener('input',event=>{
    const el=event.target;
    if(el.id==='price-search')filterPrices();
    if(el.id==='loot-quantity')updateLoot();
    if(el.id==='people-search'){peopleQuery=el.value;filterPeople();}
  });
  main.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='price-category')filterPrices();
    if(el.id==='loot-item')updateLoot();
    if(el.dataset.check){checklist[el.dataset.check]=el.checked;saveChecklist();updateChecklist();}
  });
  main.addEventListener('keydown',event=>{
    const target=event.target;
    if(target.matches('.map-ring')&&['Enter',' '].includes(event.key)){event.preventDefault();selectDistrict(target.dataset.district);}
    if(target.matches('[data-floor]')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();switchFloor(event.key==='Home'?'1':event.key==='End'?'2':floorId==='1'?'2':'1');}
  });
  document.addEventListener('click',event=>{
    const close=event.target.closest('[data-close-dialog]');if(close)close.closest('dialog').close();
  });
  $$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));

  const searchIndex=[];
  function addSearch(title,category,text,route){searchIndex.push({title,category,text,route,match:`${title} ${category} ${text}`.toLowerCase()});}
  nav.forEach(([id,label])=>addSearch(label,'Chapter',`Open the ${label.toLowerCase()} chapter.`,id));
  D.districts.forEach(d=>addSearch(d.name,'City atlas',`${d.description} ${d.places.join(', ')}`,`city/${d.id}`));
  D.landmarks.forEach(p=>addSearch(p.name,'Core Plaza',`${p.direction} · ${p.person}. ${p.description}`,`city/${p.id}`));
  D.people.forEach(p=>addSearch(p.name,p.role,`${p.place}. ${p.help}`,`people/${p.id}`));
  D.factions.forEach(f=>addSearch(f.name,'Guilds & factions',f.description,`factions/${f.id}`));
  D.goods.forEach(([name,category,price])=>addSearch(name,category,`${price} · listed guide price.`,`economy/prices`));
  D.loot.forEach(([name,value,floor])=>addSearch(name,`Floor ${floor} material`,`${value} gp market value; merchant offer ${value/2} gp before fees.`,`economy/loot`));
  D.floors.forEach(f=>{
    addSearch(f.name,`Floor 0${f.id}`,f.description,`dungeon/${f.id}`);
    [...f.routes,...f.places,...f.creatures].forEach(([name,desc,drops])=>addSearch(name,`Floor ${f.id} · ${f.name}`,`${desc}${drops?' Known drops: '+drops:''}`,`dungeon/${f.id}`));
  });
  addSearch('Arcane Transit Network · ATN','Travel','Levitating carriages, district routes, and teleportation hubs. 2 cp per ride; 1 gp monthly pass.','city');
  addSearch('Astral Vault Network · AVN','Banking','Arcane Treasury Guild. Personal vaults, Aetheric Marks, transfers, and appraisal.','economy/banking');
  addSearch('Guild ranks & promotions','The guild','F E D C B A S. Mission completion, skill evaluation, reputation, contribution, and promotion reviews.','guild');
  addSearch('Guild badge & Sending core','The guild','Soul attunement, Sending communication, seed signatures, and dungeon instances.','guild');
  addSearch('Monthly wages & rent','Coin & commerce','Commoner wages, housing, lifestyle, and living costs.','economy');
  addSearch('Crafting & commissions','Coin & commerce','Bear Hide Armor, Stinger dagger, Heartwood Staff, healing potion, Phase Venom, +1 weapon enchantment.','economy/crafting');

  function searchGuide() {
    const query=$('#global-search').value.trim().toLowerCase();
    const words=query.split(/\s+/).filter(Boolean);
    const results=words.length?searchIndex.filter(item=>words.every(word=>item.match.includes(word))).sort((a,b)=>Number(b.title.toLowerCase().includes(query))-Number(a.title.toLowerCase().includes(query))):searchIndex.filter(item=>item.category==='Chapter');
    const shown=results.slice(0,40);
    $('#search-status').textContent=query?`${results.length} ${results.length===1?'match':'matches'}${results.length>40?' · first 40 shown':''}`:'Where would you like to go?';
    $('#search-results').innerHTML=shown.length?shown.map(r=>`<a class="search-result" href="#${r.route}" data-search-result><div><strong>${esc(r.title)}</strong><span>${esc(r.category)} · ${esc(r.text.length>125?r.text.slice(0,122)+'…':r.text)}</span></div>${icon('arrow')}</a>`).join(''):'<p class="empty-state">No entries found. Try a shorter name, a creature, or a city service.</p>';
  }
  function openSearch(){closeMenu();$('#search-dialog').showModal();$('#global-search').value='';searchGuide();$('#global-search').focus();}
  $('#open-search').addEventListener('click',openSearch);
  $('#global-search').addEventListener('input',searchGuide);
  $('#global-search').addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();$('[data-search-result]')?.focus();}if(event.key==='Enter'){$('[data-search-result]')?.click();}});
  $('#search-results').addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp'].includes(event.key))return;
    const results=$$('[data-search-result]');const index=results.indexOf(document.activeElement);
    if(index===-1)return;event.preventDefault();
    if(event.key==='ArrowUp'&&index===0)$('#global-search').focus();
    else results[(index+(event.key==='ArrowDown'?1:-1)+results.length)%results.length]?.focus();
  });
  $('#search-results').addEventListener('click',event=>{
    const a=event.target.closest('[data-search-result]');if(!a)return;
    event.preventDefault();$('#search-dialog').close();
    if(location.hash===a.getAttribute('href'))renderRoute();else location.hash=a.getAttribute('href');
  });
  document.addEventListener('keydown',event=>{
    const editable=/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.target.isContentEditable;
    if((event.key==='/'&&!editable)||((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k')){event.preventDefault();if(!$('dialog[open]'))openSearch();}
    if(event.key==='Escape')closeMenu();
    if(event.key==='Tab'&&$('#sidebar').classList.contains('open')){
      const links=$$('a,button',$('#sidebar'));const first=links[0],last=links.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  let printStates=[];
  window.addEventListener('beforeprint',()=>{if(!printStates.length)printStates=$$('details',main).map(el=>[el,el.open]);printStates.forEach(([el])=>{el.open=true;});});
  window.addEventListener('afterprint',()=>{printStates.forEach(([el,open])=>{el.open=open;});printStates=[];});
  renderRoute(true);
})();

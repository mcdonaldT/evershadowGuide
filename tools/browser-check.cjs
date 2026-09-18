'use strict';
// Dependency-free integration checks against a real headless Edge browser.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { createServer, siteRoot } = require('./serve.cjs');
const root = path.resolve(__dirname, '..');
const qa = path.join(root, 'qa');
fs.mkdirSync(qa, { recursive: true });
const profile = fs.mkdtempSync(path.join(qa, 'edge-profile-'));
const browserPath = process.env.EVERSHADOW_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const checks = [];
const errors = [];
const networkFailures = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser, socket, server;
let id = 0;
const pending = new Map();
const record = (name, passed, detail = '') => { checks.push({ name, passed: Boolean(passed), detail }); if (!passed) throw new Error(`${name}: ${detail}`); console.log(`PASS ${name}`); };
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const messageId = ++id;
    const timeout = setTimeout(() => { pending.delete(messageId); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(messageId, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id: messageId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) { if (await evaluate(expression)) return; await pause(80); }
  throw new Error(`Timed out waiting for ${expression}`);
}
async function navigate(url) {
  await send('Page.navigate', { url });
  await waitFor('document.readyState === "complete" && !!document.querySelector("main h1")');
  await evaluate('Promise.all([...document.images].map(img => img.decode().catch(() => {})))');
}
async function route(hash) {
  await evaluate(`location.hash=${JSON.stringify(hash)}`);
  await waitFor(`document.querySelector('.nav-item.active').dataset.nav === ${JSON.stringify(hash.split('/')[0])}`);
  await pause(90);
}
async function click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); }
async function input(selector, value, event = 'input') {
  await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.value=${JSON.stringify(value)}; el.dispatchEvent(new Event(${JSON.stringify(event)}, {bubbles:true})); })()`);
}
async function screenshot(name, full = false) {
  await evaluate('Promise.all([...document.images].map(img => img.decode().catch(() => {})))');
  await pause(100);
  const options = { format: 'png', captureBeyondViewport: full };
  if (full) { const metrics = await send('Page.getLayoutMetrics'); options.clip = { x: 0, y: 0, width: metrics.cssContentSize.width, height: Math.min(metrics.cssContentSize.height, 6000), scale: 1 }; }
  const result = await send('Page.captureScreenshot', options);
  fs.writeFileSync(path.join(qa, name + '.png'), Buffer.from(result.data, 'base64'));
}
async function run() {
  if (!fs.existsSync(browserPath)) throw new Error(`Browser not found at ${browserPath}. Set EVERSHADOW_BROWSER to a Chromium browser executable.`);
  server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
  let spawnError;
  browser.on('error', error => { spawnError = error; });
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 150 && !fs.existsSync(portFile); i++) { if (spawnError) throw spawnError; await pause(100); }
  if (!fs.existsSync(portFile)) throw new Error('Headless browser did not provide its debugging port.');
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(item => item.type === 'page');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const task = pending.get(message.id); pending.delete(message.id); clearTimeout(task.timeout);
      if (message.error) task.reject(new Error(message.error.message)); else task.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) networkFailures.push(message.params.response.url);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
  await navigate(base);
  record('Home opens with generated art and seven chapters', await evaluate('document.querySelectorAll(".nav-item").length===7 && document.querySelector(".hero-image").naturalWidth > 0'));
  await screenshot('desktop-home', true);
  for (const page of ['city', 'economy', 'dungeon/1', 'guild', 'people', 'factions']) {
    await route(page);
    record(`${page} renders without horizontal overflow`, await evaluate('document.documentElement.scrollWidth <= innerWidth && !!document.querySelector("main h1")'));
    record(`${page} images load`, await evaluate('Promise.all([...document.querySelectorAll("main img")].map(i=>i.decode().then(()=>true).catch(()=>false))).then(a=>a.every(Boolean))'));
  }
  await route('city');
  await click('button[data-district="residential"]');
  record('District selection updates map, text, and link', await evaluate('document.querySelector("#district-detail h2").textContent.includes("Residential") && location.hash==="#city/residential" && document.querySelector(".map-ring.active").dataset.district==="residential"'));
  await evaluate('document.querySelector(".map-ring[data-district=outer]").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  record('District map supports keyboard activation', await evaluate('document.querySelector("#district-detail h2").textContent.includes("Outer")'));
  await click('[data-open-map]');
  record('Central map opens in a full-size dialog', await evaluate('document.querySelector("#detail-dialog").open && document.querySelector("#detail-body img").naturalWidth > 0'));
  await click('#detail-dialog [data-close-dialog]');
  await screenshot('desktop-city');
  await route('economy');
  await input('#price-search', 'potion');
  record('Price search finds healing potion', await evaluate('document.querySelectorAll("#price-results tbody tr").length===1 && document.querySelector("#price-results").textContent.includes("50 gp")'));
  await input('#price-search', ''); await input('#price-category', 'Travel', 'change');
  record('Price category filters travel', await evaluate('document.querySelectorAll("#price-results tbody tr").length===3'));
  await input('#price-search', 'does-not-exist');
  record('Price search handles no results', await evaluate('document.querySelector("#price-results").textContent.includes("No matching prices")'));
  await input('#price-search', ''); await input('#price-category', 'All categories', 'change');
  await input('#loot-item', '3', 'change'); await input('#loot-quantity', '1');
  record('Bear Hide sale settles to 63.75 gp', await evaluate('document.querySelector("#loot-total").textContent==="63.75 gp"'));
  await input('#loot-quantity', '2');
  record('Loot quantity recalculates to 127.50 gp', await evaluate('document.querySelector("#loot-total").textContent==="127.50 gp"'));
  for (const invalid of ['0', '-1', '1.5', '', '10000']) {
    await input('#loot-quantity', invalid);
    record(`Loot rejects invalid quantity ${JSON.stringify(invalid)}`, await evaluate('document.querySelector("#loot-quantity").getAttribute("aria-invalid")==="true" && !document.querySelector("#loot-total")'));
  }
  await input('#loot-quantity', '1'); await screenshot('desktop-economy');
  await route('dungeon/1');
  await click('[data-check="1-0"]');
  record('Floor checklist updates and saves', await evaluate('document.querySelector("#check-count").textContent==="1 of 6 ready" && JSON.parse(localStorage.getItem("evershadow-preparation-v1"))["1-0"]===true'));
  await click('[data-floor="2"]');
  record('Floor tabs change guide and keep separate checklists', await evaluate('document.querySelector(".floor-hero h2").textContent==="The Whispering Woods" && document.querySelector("#check-count").textContent==="0 of 6 ready" && location.hash==="#dungeon/2"'));
  await evaluate('document.querySelector("#floor-tab-2").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
  record('Floor tabs support arrow keys', await evaluate('document.querySelector("#floor-tab-1").getAttribute("aria-selected")==="true" && document.querySelector("[data-check=\\"1-0\\"]").checked'));
  await send('Page.reload');
  await waitFor('!!document.querySelector("[data-check=\\"1-0\\"]")');
  record('Checklist survives reload', await evaluate('document.querySelector("[data-check=\\"1-0\\"]").checked'));
  await click('#reset-checklist');
  record('Checklist reset clears saved preparation', await evaluate('document.querySelector("#check-count").textContent==="0 of 6 ready" && !JSON.parse(localStorage.getItem("evershadow-preparation-v1"))["1-0"]'));
  await click('[data-floor="2"]');
  await click('#creature-1 summary');
  record('Creature details expose public tactics and known drops', await evaluate('document.querySelector("#creature-1").open && document.querySelector("#creature-1").textContent.includes("Dimensional Shard")'));
  await evaluate('window.dispatchEvent(new Event("beforeprint"))');
  record('Printing expands all selected-floor creature entries', await evaluate('[...document.querySelectorAll(".creature")].every(d=>d.open)'));
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  const pdf = await send('Page.printToPDF', { printBackground: false, paperWidth: 8.27, paperHeight: 11.7, marginTop: .4, marginBottom: .4, marginLeft: .4, marginRight: .4 });
  fs.writeFileSync(path.join(qa, 'floor-2-print-check.pdf'), Buffer.from(pdf.data, 'base64'));
  await send('Emulation.setEmulatedMedia', { media: '' });
  await evaluate('window.dispatchEvent(new Event("afterprint"))');
  record('Print cleanup restores collapsed entries', await evaluate('!document.querySelector("#creature-0").open && document.querySelector("#creature-1").open'));
  await screenshot('desktop-floor-2', true);
  await route('guild'); await click('[data-rank="S"]');
  record('Rank selector displays S-rank guidance', await evaluate('document.querySelector("#rank-description").textContent.includes("Legendary")'));
  await screenshot('desktop-guild');
  await route('people'); await input('#people-search', 'Elara');
  record('NPC search distinguishes both Elaras', await evaluate('document.querySelectorAll(".person-card").length===2'));
  await click('[data-people-category="City"]');
  record('NPC search combines with role filters', await evaluate('document.querySelectorAll(".person-card").length===1 && document.querySelector(".person-card").textContent.includes("Windrider")'));
  await input('#people-search', ''); await click('[data-people-category="All"]');
  await click('[data-person="stormveil"]');
  record('NPC profile opens public identity and location', await evaluate('document.querySelector("#detail-dialog").open && document.querySelector("#detail-title").textContent==="Elara Stormveil" && document.querySelector("#detail-body").textContent.includes("Ask about")'));
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  record('Escape closes profile dialog', await evaluate('!document.querySelector("#detail-dialog").open'));
  await screenshot('desktop-people');
  await click('#open-search'); await input('#global-search', 'heartwood');
  record('Global search finds cross-chapter material', await evaluate('document.querySelectorAll("[data-search-result]").length>=2'));
  await input('#global-search', '<script>alert(1)</script>');
  record('Search treats special input as text', await evaluate('document.querySelector("#search-results").textContent.includes("No entries")'));
  await input('#global-search', 'Seraphina'); await click('[data-search-result]');
  await waitFor('document.querySelector("#detail-dialog").open');
  record('Global search opens the requested NPC', await evaluate('document.querySelector("#detail-title").textContent==="Seraphina Lumina"'));
  await click('#detail-dialog [data-close-dialog]');
  await route('factions'); await screenshot('desktop-factions');
  await navigate(base+'#dungeon/2');
  record('Direct floor links survive a fresh page load', await evaluate('document.querySelector(".floor-hero h2").textContent==="The Whispering Woods"'));
  await evaluate('location.hash="unknown-route"');
  await waitFor('location.hash==="#overview" && !!document.querySelector(".hero")');
  record('Unknown routes fall back to the welcome page', await evaluate('location.hash==="#overview" && !!document.querySelector(".hero")'));
  for (const width of [390, 320, 768]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 721 });
    for (const page of ['overview','city','economy','dungeon/2','guild','people','factions']) {
      await route(page);
      const dimensions=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
      record(`${width}px layout fits ${page}`,dimensions.scroll<=dimensions.width,JSON.stringify(dimensions));
      if(width===390&&['overview','dungeon/2','people'].includes(page))await screenshot(`mobile-${page.replace('/','-')}`,true);
    }
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await route('overview'); await click('#menu-toggle');
  record('Mobile menu opens with expanded state', await evaluate('document.querySelector("#sidebar").classList.contains("open") && document.querySelector("#menu-toggle").getAttribute("aria-expanded")==="true"'));
  await click('[data-nav="guild"]'); await waitFor('document.querySelector(".nav-item.active").dataset.nav==="guild"');
  record('Mobile navigation changes chapter and closes menu', await evaluate('!document.querySelector("#sidebar").classList.contains("open") && document.querySelector("#menu-shade").hidden'));
  await navigate(pathToFileURL(path.join(siteRoot,'index.html')).href+'#dungeon/2');
  record('Direct-file offline opening works with local images', await evaluate('location.protocol==="file:" && document.querySelector(".floor-hero h2").textContent==="The Whispering Woods" && document.querySelector(".floor-hero img").naturalWidth>0'));
  await click('#open-search'); await input('#global-search','Windrider');
  record('Search works without a web server', await evaluate('document.querySelectorAll("[data-search-result]").length>0'));
  record('No browser JavaScript or console errors',errors.length===0,errors.join('\n'));
  record('No missing resources',networkFailures.length===0,networkFailures.join('\n'));
  const status=await new Promise((resolve,reject)=>{http.get(base+'%2e%2e%5cEDITORIAL_NOTES.md',res=>{res.resume();resolve(res.statusCode);}).on('error',reject);});
  record('Local server blocks access outside public folder',status===403||status===404,String(status));
  const publicText=['app.js','data.js','index.html'].map(file=>fs.readFileSync(path.join(siteRoot,file),'utf8')).join('\n');
  record('Known private identities and plot terms are absent from shipped code',!/(Valeria|Shadowstrike|Synners|Counterfeit Badges|unregistered vaults|Stat Block|Armor Class)/i.test(publicText));
}
(async()=>{
  let failed;
  try { await run(); } catch(error) { failed=error; console.error(error.stack); }
  finally {
    if(socket?.readyState===1) { try { await send('Browser.close'); } catch {} socket.close(); }
    if(browser&&!browser.killed)browser.kill();
    if(server)await new Promise(resolve=>server.close(resolve));
    for(const task of pending.values())clearTimeout(task.timeout);
    await pause(400);
    // The sole deletion target is the exact temporary browser profile created above.
    const relative=path.relative(qa,profile);
    if(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&path.basename(profile).startsWith('edge-profile-')) {
      try { fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200}); } catch(error) { console.warn('Temporary browser profile could not be removed:',error.message); }
    }
    const report={date:new Date().toISOString(),browser:browserPath,passed:checks.filter(c=>c.passed).length,total:checks.length,checks,errors,networkFailures,failure:failed?.message||null};
    fs.writeFileSync(path.join(qa,'verification.json'),JSON.stringify(report,null,2));
    console.log(`${report.passed}/${report.total} checks passed. Screenshots and report: ${qa}`);
    if(failed)process.exitCode=1;
  }
})();

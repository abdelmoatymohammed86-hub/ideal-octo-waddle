// غيّر رقم الإصدار V عند تعديل index.html أو sw.js ليظهر زر التحديث للمشغلين
const V='test-faults-v4';
const SHELL=['./','index.html','manifest.json','data.json','learn-czk.html','learn-relay.html','icon-192.png','icon-512.png','icon-180.png','favicon-32.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='SKIP')self.skipWaiting()});
// الشبكة أولاً (أحدث نسخة)، ولو لا يوجد إنترنت تُفتح النسخة المحفوظة
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});

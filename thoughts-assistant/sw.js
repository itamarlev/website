self.addEventListener('push', event => {
  let payload = {};
  try{ payload = event.data ? event.data.json() : {}; }catch(e){
    payload = {body:event.data ? event.data.text() : ''};
  }
  const title = payload.title || 'Thought reminder';
  const options = {
    body:payload.body || '',
    data:payload.url || './',
    tag:payload.tag || undefined,
    renotify:false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data || './';
  event.waitUntil((async () => {
    const windows = await clients.matchAll({type:'window', includeUncontrolled:true});
    for(const client of windows){
      if('focus' in client){
        await client.focus();
        if('navigate' in client) await client.navigate(target);
        return;
      }
    }
    if(clients.openWindow) await clients.openWindow(target);
  })());
});

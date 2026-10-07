const config = window.THurContent || {};
const groupUrl = (() => { try { const u = new URL(config.groupUrl); return u.protocol === 'https:' && u.hostname === 'chat.whatsapp.com' ? u.href : ''; } catch { return ''; } })();
const dialog = document.querySelector('#registration-dialog');
document.querySelectorAll('[data-group-cta]').forEach(link => {
  if(groupUrl){link.href=groupUrl;link.target='_blank';link.rel='noopener noreferrer';}
  else link.addEventListener('click', e => {e.preventDefault();dialog.showModal();});
});
document.querySelectorAll('.dialog-close,.dialog-dismiss').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

// Somente URLs HTTPS ou arquivos locais da página podem ser usados como mídia.
function safeMediaUrl(value){
  if(typeof value !== 'string' || !value.trim()) return '';
  try{const url=new URL(value,location.href);return url.protocol==='https:'||url.origin===location.origin?url.href:'';}catch{return '';}
}
const videoUrl=safeMediaUrl(config.videoUrl);
const video=document.querySelector('#intro-video');
const videoPoster=document.querySelector('.video-poster');
const videoPlaceholder=document.querySelector('#video-placeholder');
if(videoUrl){
  video.src=videoUrl;
  video.hidden=false;
  videoPoster.hidden=true;
  videoPlaceholder.hidden=true;
  const captionsUrl=safeMediaUrl(config.videoCaptionsUrl);
  if(captionsUrl){const track=document.createElement('track');track.kind='captions';track.srclang='pt-BR';track.label='Português';track.src=captionsUrl;video.append(track);}
  video.addEventListener('error',()=>{video.hidden=true;videoPoster.hidden=false;videoPlaceholder.hidden=false;videoPlaceholder.querySelector('p').textContent='O vídeo não carregou. Você pode conhecer a mentoria nas informações desta página.';});
}
const testimonials=Array.isArray(config.testimonials)?config.testimonials:[];
for(const item of testimonials){
  const src=safeMediaUrl(item.image);if(!src||typeof item.alt!=='string'||!item.alt.trim())continue;
  const figure=document.createElement('figure');const img=document.createElement('img');
  img.src=src;img.alt=item.alt;img.loading='lazy';figure.append(img);
  if(item.caption){const caption=document.createElement('figcaption');caption.textContent=String(item.caption);figure.append(caption);}
  document.querySelector('#testimonials-grid').append(figure);
}
document.querySelector('#depoimentos').hidden=!document.querySelector('#testimonials-grid').children.length;

'use strict';
const titles = {es:'Polarización ideológica y afectiva en Latinoamérica | Proyecto 2027',en:'Ideological and Affective Polarization in Latin America | 2027 Project'};
function setLanguage(lang, updateUrl = true) {
  if (!Object.hasOwn(titles,lang)) lang = 'es';
  document.documentElement.lang = lang;
  document.title = titles[lang];
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  const subject = lang === 'es' ? 'Aportación económica al proyecto de polarización 2027' : 'Financial contribution to the 2027 polarization project';
  document.querySelectorAll('.contact-cta').forEach(contact => {
    const recipient = contact.getAttribute('href').split('?')[0];
    contact.href = recipient + '?subject=' + encodeURIComponent(subject);
  });
  document.querySelector('nav').setAttribute('aria-label', lang === 'es' ? 'Principal' : 'Main navigation');
  if (updateUrl && location.protocol !== 'file:') {
    const url = new URL(location.href); url.searchParams.set('lang',lang);
    history.replaceState(null,'',url);
  }
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.lang)));
setLanguage(new URLSearchParams(location.search).get('lang') || 'es',false);
const slider = document.getElementById('feeling');
slider.addEventListener('input',() => { document.getElementById('feeling-value').value = slider.value; });

const context = document.getElementById('feeling-context');
function updateFeelingContext() {
  const value = Number(slider.value);
  const es = document.documentElement.lang === 'es';
  const texts = value <= 2
    ? ['Una valoración muy desfavorable puede indicar hostilidad hacia otro grupo de votantes. La investigación estudiará cómo se relaciona con la tolerancia política.','A very unfavorable evaluation can indicate hostility toward another group of voters. The research will study how it relates to political tolerance.']
    : value >= 8
    ? ['Una valoración muy favorable refleja cercanía hacia ese grupo de votantes. Comparar las valoraciones de distintos grupos ayuda a estudiar la polarización afectiva.','A very favorable evaluation reflects warmth toward this group of voters. Comparing evaluations across groups helps us study affective polarization.']
    : value === 5
    ? ['5 indica una valoración neutral. La escala separa los sentimientos hacia otros votantes del desacuerdo con sus ideas.','5 indicates a neutral evaluation. The scale distinguishes feelings toward other voters from disagreement with their ideas.']
    : ['La escala permite captar matices entre rechazo, neutralidad y simpatía. Una sola respuesta no basta para determinar el nivel de polarización de una persona.','The scale captures degrees of dislike, neutrality, and warmth. A single response cannot establish a person’s level of polarization.'];
  context.textContent = texts[es ? 0 : 1];
  slider.setAttribute('aria-valuetext', `${value} / 10`);
}
slider.addEventListener('input', updateFeelingContext);
function updateDownloads() {
  const lang = document.documentElement.lang;
  document.querySelectorAll('.download-summary').forEach(link => link.href = `assets/${lang === 'es' ? 'resumen-proyecto-es' : 'project-brief-en'}.pdf`);
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {updateFeelingContext();updateDownloads();}));
updateFeelingContext();updateDownloads();

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
function inquiry() {
  const data = new FormData(form);
  const es = document.documentElement.lang === 'es';
  return {
    recipient:data.get('recipient'),
    subject:es ? 'Consulta sobre financiamiento del proyecto de polarización 2027' : 'Funding inquiry for the 2027 polarization project',
    body:`${data.get('message')}\n\n${es ? 'Nombre' : 'Name'}: ${data.get('name')}\n${es ? 'Correo' : 'Email'}: ${data.get('email')}`
  };
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const q = inquiry();
  window.location.href = `mailto:${q.recipient}?subject=${encodeURIComponent(q.subject)}&body=${encodeURIComponent(q.body)}`;
  status.textContent = document.documentElement.lang === 'es'
    ? 'Se solicitó abrir tu aplicación de correo. El mensaje no se ha enviado; revísalo y envíalo desde allí. También puedes copiarlo.'
    : 'Your email app was asked to open. The message has not been sent; review and send it there. You can also copy it.';
});
document.getElementById('copy-message').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  const q = inquiry();
  const es = document.documentElement.lang === 'es';
  const message = `${es ? 'Para' : 'To'}: ${q.recipient}\n${es ? 'Asunto' : 'Subject'}: ${q.subject}\n\n${q.body}`;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(message);
    status.textContent = es ? 'Mensaje copiado. Pégalo en tu correo y envíalo cuando estés listo.' : 'Message copied. Paste it into your email and send it when ready.';
  } catch {
    const fallback = document.getElementById('copy-fallback');
    fallback.hidden = false;fallback.value = message;fallback.focus();fallback.select();
    status.textContent = es ? 'Copia el texto seleccionado y envíalo desde tu servicio de correo.' : 'Copy the selected text and send it using your email service.';
  }
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }), {threshold:0.08});
  document.querySelectorAll('[data-reveal]').forEach(section => {
    if (section.getBoundingClientRect().top >= window.innerHeight) {section.classList.add('reveal-pending');observer.observe(section);}
  });
}

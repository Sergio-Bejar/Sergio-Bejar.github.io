'use strict';
const titles = {es:'Polarización ideológica y afectiva en Latinoamérica | Proyecto 2027',en:'Ideological and Affective Polarization in Latin America | 2027 Project'};
function setLanguage(lang, updateUrl = true) {
  if (!Object.hasOwn(titles,lang)) lang = 'es';
  document.documentElement.lang = lang;
  document.title = titles[lang];
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
  const subject = lang === 'es' ? 'Apoyo al proyecto de polarización ideológica y afectiva 2027' : 'Supporting the 2027 ideological and affective polarization project';
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

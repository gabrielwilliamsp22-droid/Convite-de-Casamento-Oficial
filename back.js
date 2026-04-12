
   // State
  let guestCount = 1;
  let rsvpOpen = false;
  let allRsvps = [];
  const WEDDING_DATE = new Date('2026-08-15T00:00:00');

  const defaultConfig = {
    background_color: '#2d3a28',
    surface_color: '#fdf8ef',
    text_color: '#5a6b4a',
    primary_action_color: '#c9a961',
    secondary_action_color: '#9d8859',
    font_family: 'Playfair Display',
    font_size: 16,
    bride_name: 'Alana',
    groom_name: 'Gabriel',
    wedding_date_text: '15 de Agosto de 2026',
    invitation_text: 'têm a honra de convidá-los para o seu casamento',
    gift_list_url: 'https://example.com',
    venue_url: 'https://maps.google.com'
  };

  function applyConfig(config) {
    const c = key => config[key] || defaultConfig[key];
    const bride = c('bride_name');
    const groom = c('groom_name');

    document.getElementById('coupleNames').textContent = `${bride} & ${groom}`;
    document.getElementById('sealText').textContent = `${bride[0]} & ${groom[0]}`;
    document.getElementById('invText').textContent = c('invitation_text');
    document.getElementById('dateText').textContent = c('wedding_date_text');
    document.getElementById('giftLink').href = c('gift_list_url');
    document.getElementById('venueLink').href = c('venue_url');

    // Colors
    const bg = c('background_color');
    const surface = c('surface_color');
    const text = c('text_color');
    const primary = c('primary_action_color');
    const secondary = c('secondary_action_color');

    document.getElementById('app').style.backgroundColor = bg;
    document.querySelector('.inv-inner').style.background = `linear-gradient(135deg, ${surface}, ${adjustColor(surface, -10)})`;
    document.getElementById('coupleNames').style.color = text;
    document.getElementById('dateText').style.color = text;

    document.querySelectorAll('.btn-primary').forEach(b => {
      b.style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
    });
    document.querySelectorAll('.btn-secondary').forEach(b => {
      b.style.color = secondary;
      b.style.borderColor = `${primary}44`;
    });

    // Font
    const font = c('font_family');
    const baseStack = 'serif';
    document.getElementById('dateText').style.fontFamily = `${font}, ${baseStack}`;
    document.querySelectorAll('.cd-num').forEach(el => el.style.fontFamily = `${font}, ${baseStack}`);

    const baseSize = c('font_size');
    document.getElementById('coupleNames').style.fontSize = `${baseSize * 2.6}px`;
    document.getElementById('invText').style.fontSize = `${baseSize}px`;
    document.getElementById('dateText').style.fontSize = `${baseSize * 1.6}px`;
  }

  function adjustColor(hex, amt) {
    hex = hex.replace('#', '');
    let r = Math.max(0, Math.min(255, parseInt(hex.substr(0,2),16) + amt));
    let g = Math.max(0, Math.min(255, parseInt(hex.substr(2,2),16) + amt));
    let b = Math.max(0, Math.min(255, parseInt(hex.substr(4,2),16) + amt));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }
  
  // Envelope open
  function openEnvelope() {
    const w = document.getElementById('envelopeWrapper');
    if (w.classList.contains('opened')) return;
    w.classList.add('opened');
    document.getElementById('invitationCard').classList.add('visible');
  }

  // RSVP
  function toggleRSVP() { 
    const modal = document.getElementById('rsvpModal'); modal.classList.toggle('active'); 
}
// Bloqueio por Navegador

  /*function toggleRSVP() {
  if (localStorage.getItem('rsvpConfirmed') === 'true') {
    showToast('Você já confirmou presença 😉');
    return;
  }

  const modal = document.getElementById('rsvpModal');
  modal.classList.toggle('active');
}*/

  function changeCount(d) {
    guestCount = Math.max(1, Math.min(20, guestCount + d));
    document.getElementById('guestCount').textContent = guestCount;
  }

 async function confirmRSVP() {
  const name = document.getElementById('guestName').value.trim();

  if (!name) {
    showToast('Por favor, insira seu nome.');
    return;
  }
 

  const btn = document.getElementById('confirmBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading-spinner"></span>';

 

  // 🔥 COLOCA SEU LINK AQUI
  const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSe95wuOrR27jCyi3p9xMavygxEIuVS36Pj_V8VydrVte_rdvA/formResponse";

  // 🔥 COLOCA SEUS ENTRY AQUI
  
  const nomeField = "entry.1065371127";
  const qtdField = "entry.202158554";

  const formData = new FormData();
  formData.append(nomeField, name);
  formData.append(qtdField, guestCount);

  try {
    await fetch(formURL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    // SUCESSO (igual seu sistema original)
    localStorage.setItem('rsvpConfirmed', 'true');

    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('rsvpBtn').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';

    showToast('Presença confirmada! 🎉');

  } catch (error) {
    showToast('Erro ao enviar. Tente novamente.');
  }

  btn.disabled = false;
  btn.innerHTML = '<span>Confirmar</span>';
}

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // Countdown
  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '0';
      document.getElementById('cdHours').textContent = '0';
      document.getElementById('cdMins').textContent = '0';
      document.getElementById('cdSecs').textContent = '0';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdDays').textContent = d;
    document.getElementById('cdHours').textContent = h;
    document.getElementById('cdMins').textContent = m;
    document.getElementById('cdSecs').textContent = s;
  }
  
  document.getElementById('rsvpModal').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
});
//Bloqueio Por Navegador Pessoal e esconde o botão
/*
window.addEventListener('load', () => {
  if (localStorage.getItem('rsvpConfirmed') === 'true') {
    document.getElementById('rsvpBtn').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  }
});*/

  updateCountdown();
  setInterval(updateCountdown, 1000);

  lucide.createIcons();
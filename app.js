const dialog = document.querySelector('#donation-dialog');
const form = document.querySelector('#donation-form');
const campaignField = document.querySelector('#campaign-name');
const context = document.querySelector('#dialog-context');
const success = document.querySelector('#form-success');
const closeDialog = document.querySelector('.close-dialog');

function openDonation(campaign = '') {
  form.hidden = false;
  success.hidden = true;
  form.reset();
  form.querySelector('[type="submit"]').disabled = false;
  campaignField.value = campaign;
  context.textContent = campaign
    ? `Você selecionou a campanha “${campaign}”. Preencha somente o necessário.`
    : 'Preencha somente o necessário. Seus dados serão usados apenas para combinar a entrega desta doação.'; dialog.showModal();
  document.querySelector('#donor-name').focus();
}

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => openDonation(button.dataset.campaign || ''));
});

closeDialog.addEventListener('click', () => dialog.close());
document.querySelector('[data-close-success]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf0HUhjG0f_kJt8cSsy22pPxM_lpbFMQHD4hxool8umcv7WQg/formResponse';
const ENTRY = {
  name: 'entry.683085657',
  contact: 'entry.1734104300',
  campaign: 'entry.1279378033',
  item: 'entry.1227639942',
  consent: 'entry.1178425067'
};
const CONSENT_TEXT = 'Autorizo o projeto Casa Azul Conecta a usar meu contato somente para combinar a entrega desta doação.';
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  const data = Object.fromEntries(new FormData(form));
  const body = new URLSearchParams({
    [ENTRY.name]: data.name,
    [ENTRY.contact]: data.contact,
    [ENTRY.campaign]: data.campaign,
    [ENTRY.item]: data.item,
    [ENTRY.consent]: CONSENT_TEXT
  });
  try {
    await fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body });
    form.hidden = true; success.hidden = false; success.focus();
  } catch {
    alert('Não foi possível enviar. Verifique sua conexão e tente novamente.');
    submitButton.disabled = false;
  }
});

document.querySelector('#campaign-filter').addEventListener('change', (event) => {
  const selected = event.target.value;
  let count = 0;
  document.querySelectorAll('.campaign-card').forEach((card) => {
    const show = selected === 'todas' || card.dataset.category === selected;
    card.hidden = !show;
    if (show) count += 1;
  });
  document.querySelector('#empty-state').hidden = count !== 0;
});

document.querySelector('#contrast-toggle').addEventListener('click', (event) => {
  const enabled = document.body.classList.toggle('high-contrast');
  event.currentTarget.setAttribute('aria-pressed', String(enabled));
  event.currentTarget.textContent = enabled ? 'Contraste padrão' : 'Alto contraste';
});

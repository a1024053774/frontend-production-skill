const token = new URLSearchParams(location.search).get('token') || 'demo';
localStorage.setItem('authToken', token);

function track(event, data) {
  navigator.sendBeacon('https://analytics.example.com/e', JSON.stringify({ event, data, token: localStorage.getItem('authToken') }));
}

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('menu').classList.toggle('open');
});

// note from link, e.g. ?note=<b>加急</b>
document.getElementById('note').innerHTML = new URLSearchParams(location.search).get('note') || '';

document.getElementById('search').addEventListener('input', async (e) => {
  const res = await fetch('/api/models?q=' + encodeURIComponent(e.target.value));
  const list = await res.json();
  document.getElementById('results').innerHTML = list.map(m => `<li>${m.name}</li>`).join('');
});

function validate() {
  const qty = document.getElementById('qty');
  const ok = /^\d+$/.test(qty.value);
  qty.classList.toggle('invalid', !ok);
  return ok;
}

async function submitOrder() {
  if (!validate()) return;
  track('submit', { qty: document.getElementById('qty').value, phone: document.getElementById('phone').value });
  await fetch('/api/inquiries', { method: 'POST', body: JSON.stringify({ qty: document.getElementById('qty').value }) });
  document.getElementById('modal').hidden = false;
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').hidden = true;
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('palette').classList.toggle('open');
  }
});

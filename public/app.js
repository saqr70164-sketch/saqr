// Frontend JS: submit lead and fetch recommendations
document.getElementById('leadForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    company: document.getElementById('company').value,
    industry: document.getElementById('industry').value,
    size_category: document.getElementById('size_category').value,
    pain_points: document.getElementById('pain_points').value
  };
  const res = await fetch('/leads', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  const lead = await res.json();
  // fetch recommendations using industry
  const q = lead.industry ? `?industry=${encodeURIComponent(lead.industry)}` : '';
  const rec = await fetch('/recommendations' + q).then(r=>r.json());
  renderRecommendations(rec);
});

function renderRecommendations(list){
  const container = document.getElementById('recommendations');
  container.innerHTML = '';
  if(!list || list.length===0){ container.innerHTML = '<p>لا توجد توصيات حالياً.</p>'; return; }
  list.forEach(cs=>{
    const div = document.createElement('div');
    div.className = 'case';
    let km = cs.key_metrics || cs.key_metrics || {};
    try { if (typeof cs.key_metrics === 'string') km = JSON.parse(cs.key_metrics); } catch(e){}
    div.innerHTML = `<h3>${cs.title}</h3>
      <p><strong>القطاع:</strong> ${cs.industry || '-'}</p>
      <p>${cs.summary || ''}</p>
      <p><strong>مقاييس رئيسية:</strong> ${JSON.stringify(km)}</p>
      <p><a href="${cs.hero_image_url || '#'}" target="_blank">صورة العمل</a></p>`;
    container.appendChild(div);
  });
}

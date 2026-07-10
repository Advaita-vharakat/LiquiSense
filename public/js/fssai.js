// Render FSSAI tips, chips filter, search and theme toggle

(function(){
  const tips = [
    { id:1, title:'Check FSSAI License on Milk Packages', body:'Always verify the 14-digit FSSAI license number on milk and dairy products. You can verify it on the FSSAI website.', tags:['Dairy','FSS Act 2006'] },
    { id:2, title:'Store Cooked Food Properly', body:'Keep cooked food at safe temperatures. Refrigerate within 2 hours.', tags:['Storage'] },
    { id:3, title:'Read Labels Carefully', body:'Check manufacturing and expiry dates, ingredients and allergen info.', tags:['Label'] },
    { id:4, title:'Avoid Cross Contamination', body:'Use separate boards for raw meat and vegetables.', tags:['Meat','Hygiene'] },
    { id:5, title:'Check Packaged Milk Code', body:'Look for pasteurization and FSSAI mark on packaged milk.', tags:['Dairy'] },
    { id:6, title:'Wash Fruits & Vegetables', body:'Rinse under running water and peel when possible.', tags:['Fruits','Vegetable'] },
    { id:7, title:'Inspect Seafood Freshness', body:'Smell, texture and color are indicators of freshness.', tags:['Seafood'] },
    { id:8, title:'Store Grains Dry', body:'Keep grains in airtight containers to avoid moisture and pests.', tags:['Grains'] }
  ];

  const ICON_DOC = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_SAVE = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 21v-8H7v8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v7a1 1 0 0 0 1 1h14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 6l-4-4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2v13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const tipsGrid = document.getElementById('tipsGrid');
  const tipsCount = document.getElementById('tipsCount');
  const searchInput = document.getElementById('fssaiSearch');
  const chips = Array.from(document.querySelectorAll('.chip'));

  function renderTips(list){
    tipsGrid.innerHTML = '';
    list.forEach(t=>{
      const el = document.createElement('div');
      el.className = 'tip-card';
      el.innerHTML = `
        <div class="card-head">
          <div class="tip-icon" aria-hidden="true">${ICON_DOC}</div>
          <div style="flex:1">
            <h5>${t.title}</h5>
            <p>${t.body}</p>
            <div class="tip-tags">${t.tags.map(x=>`<span class="badge">${x}</span>`).join('')}</div>
          </div>
        </div>
      `;
      const actions = document.createElement('div');
      actions.style.marginTop = '12px';
      actions.innerHTML = `
        <button class="mini-btn save" data-id="${t.id}" aria-label="Save tip">${ICON_SAVE}<span>Save</span></button>
        <button class="mini-btn share" data-id="${t.id}" aria-label="Share tip">${ICON_SHARE}<span>Share</span></button>
      `;
      el.appendChild(actions);
      tipsGrid.appendChild(el);
    });
    tipsCount.innerText = `${list.length} Tips Found`;
  }

  function filterByChip(cat){
    if (cat === 'all') return tips;
    return tips.filter(t => t.tags.map(x=>x.toLowerCase()).includes(cat.toLowerCase()));
  }

  // initial render
  renderTips(tips);

  // search
  searchInput.addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    const activeChip = document.querySelector('.chip.active')?.getAttribute('data-cat') || 'all';
    let list = filterByChip(activeChip);
    if (q) list = list.filter(t => (t.title + ' ' + t.body + ' ' + t.tags.join(' ')).toLowerCase().includes(q));
    renderTips(list);
  });

  // chips
  chips.forEach(c=>{
    c.addEventListener('click', ()=>{
      chips.forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      searchInput.value = '';
      const cat = c.getAttribute('data-cat');
      renderTips(filterByChip(cat));
    });
  });

  // save/share (simple handlers)
  document.addEventListener('click', (e)=>{
    if (e.target.closest('.mini-btn.save')) {
      const btn = e.target.closest('.mini-btn.save');
      btn.innerHTML = `${ICON_SAVE}<span>Saved</span>`;
      btn.disabled = true;
    } else if (e.target.closest('.mini-btn.share')) {
      // placeholder share action
      alert('Share link copied (placeholder).');
    }
  });

  // Note: theme toggle centralized in Settings; per-page theme buttons removed.

})();

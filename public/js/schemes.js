document.addEventListener('DOMContentLoaded',()=>{
    const schemes = [
        {id:1,title:'PM-KISAN Samman Nidhi', ministry:'Ministry of Agriculture', category:'financial', desc:'Income support of ₹6,000 per year in three equal installments to all land holding farmer families.', tags:['₹6,000/year','Direct Transfer','No Middleman'], budget:'₹6,000/yr', ben:'11 Cr+'},
        {id:2,title:'Pradhan Mantri Fasal Bima Yojana', ministry:'Ministry of Agriculture', category:'insurance', desc:'Comprehensive crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities.', tags:['Low Premium','Quick Settlement','All Crops Covered'], budget:'₹ Upto 98%', ben:'5 Cr+'},
        {id:3,title:'Kisan Credit Card (KCC)', ministry:'Ministry of Finance', category:'financial', desc:'Provides farmers with affordable credit for agriculture and allied activities, fisheries, and animal husbandry.', tags:['4% Interest','Flexible Repayment','No Collateral'], budget:'₹ 3% Interest Subvention', ben:'7 Cr+'},
        {id:4,title:'PM Krishi Sinchayee Yojana', ministry:'Ministry of Agriculture', category:'irrigation', desc:'Ensures access to protective irrigation to all agricultural farms through micro irrigation systems.', tags:['Drip Irrigation','Sprinkler Systems','Water Saving'], budget:'₹ Upto 55%', ben:'2 Cr+'},
        {id:5,title:'Sub-Mission on Agricultural Mechanization', ministry:'Ministry of Agriculture', category:'equipment', desc:'Provides subsidies on purchase of agricultural machinery and equipment including tractors, harvesters, etc.', tags:['Tractors','Harvesters','Power Tillers'], budget:'₹ Upto 50%', ben:'1 Cr+'},
        {id:6,title:'e-NAM (National Agriculture Market)', ministry:'Ministry of Agriculture', category:'equipment', desc:'Online trading platform for agricultural commodities enabling farmers to get better prices by selling directly.', tags:['Better Prices','Pan-India Market','Transparent Bidding'], budget:'₹ Free Registration', ben:'1.7 Cr+'}
    ];

    const container = document.getElementById('schemesContainer');
    const search = document.getElementById('schemeSearch');
    const chips = document.querySelectorAll('.chips-row .chip');
    const statCount = document.getElementById('statCount');
    const statBudget = document.getElementById('statBudget');
    const statBen = document.getElementById('statBen');

    function render(list){
        container.innerHTML = '';
        list.forEach(s => {
            const card = document.createElement('div');
            card.className = 'scheme-card';
            const icon = getIcon(s.category);
            card.innerHTML = `
                <div class="card-header">
                    <div class="scheme-header-left">
                        <div class="scheme-icon">${icon}</div>
                        <div>
                            <div class="ministry">${s.ministry}</div>
                            <h4 class="scheme-title">${s.title}</h4>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="scheme-desc">${s.desc}</p>
                    <div class="tags">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
                </div>
                <div class="card-footer">
                    <div class="left">
                        <div class="budget">${s.budget}</div>
                        <div class="beneficiaries">${s.ben}</div>
                    </div>
                    <div class="right"><button class="apply-btn">Apply</button></div>
                </div>
            `;
            container.appendChild(card);
        });
        statCount.innerText = list.length;
        // simple aggregated placeholders
        statBudget.innerText = '₹2L Cr';
        statBen.innerText = '14 Cr';
    }

    function filterAndRender(){
        const q = search.value.trim().toLowerCase();
        const activeChip = document.querySelector('.chips-row .chip.active');
        const cat = activeChip ? activeChip.dataset.cat : 'all';
        let res = schemes.filter(s=> (cat==='all' || s.category===cat));
        if(q) res = res.filter(s=> (s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.tags.join(' ').toLowerCase().includes(q)));
        render(res);
    }

    chips.forEach(ch=>{
        ch.addEventListener('click',()=>{
            chips.forEach(c=>c.classList.remove('active'));
            ch.classList.add('active');
            filterAndRender();
        });
    });

    search.addEventListener('input',()=>filterAndRender());

    // initial render
    render(schemes);
});

function getIcon(cat){
    // icons use currentColor so they inherit header color
    switch(cat){
        case 'financial':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="M8 11h8M8 15h6"/></svg>`;
        case 'insurance':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v6c0 5-3.58 9.74-7 10-3.42-.26-7-5-7-10V6l7-4z"/></svg>`;
        case 'equipment':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18M6 7v10a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7"/><path d="M9 3v4M15 3v4"/></svg>`;
        case 'irrigation':
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s-6 6-6 10a6 6 0 0 0 12 0c0-4-6-10-6-10z"/></svg>`;
        default:
            return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h6"/></svg>`;
    }
}

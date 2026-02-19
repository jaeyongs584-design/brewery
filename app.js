/* 진부양조장 경영관리 — v2 */
const STORAGE_KEY = 'jinbu_brewery_data';
const WORK_STAGES = [{ id: 'jumo', name: '주모', emoji: '🧪' }, { id: 'stage1', name: '1단', emoji: '1️⃣' }, { id: 'stage2', name: '2단', emoji: '2️⃣' }, { id: 'jeseng', name: '제성', emoji: '🍶' }, { id: 'packing', name: '술포장', emoji: '📦' }];

const DEFAULT_PRODUCTS = [{ id: 'corn', name: '찰옥수수', emoji: '🌽' }, { id: 'angelica', name: '당귀', emoji: '🌿' }, { id: 'deodeok', name: '더덕', emoji: '🏔️' }];
const DEFAULT_BOTTLES = [{ value: 0.75, label: '750ml' }, { value: 1, label: '1L' }, { value: 1.5, label: '1.5L' }, { value: 1.7, label: '1.7L' }];
const DEFAULT_MATERIALS = [
    { id: 'm1', name: '입국', supplier: '주향입국', unit: 'kg' },
    { id: 'm2', name: '병', supplier: '케이비씨(KBC)', unit: '개' },
    { id: 'm3', name: '밀가루', supplier: '영서유통', unit: 'kg' },
    { id: 'm4', name: '재료', supplier: '대종상사', unit: 'kg' },
    { id: 'm5', name: '마개', supplier: '삼천상사', unit: '개' },
    { id: 'm6', name: '라벨', supplier: 'DS팩', unit: '장' },
    { id: 'm7', name: '박스', supplier: '대원포장', unit: '개' }];

function getDefaultData() {
    const cId = { v: 100 }; const nid = () => cId.v++;
    const customers = [
        { id: nid(), name: '대관령삼대떡비지', type: 'customer', contact: '송현성', phone: '', bizNo: '365-95-01000', note: '한식' },
        { id: nid(), name: '누리식당', type: 'customer', contact: '', phone: '', bizNo: '', note: '한식' },
        { id: nid(), name: '개벽산거리는날', type: 'customer', contact: '', phone: '', bizNo: '117-18-77253', note: '한식' },
        { id: nid(), name: '계봉삼소이횟집', type: 'customer', contact: '', phone: '', bizNo: '', note: '' },
        { id: nid(), name: '카루마루스', type: 'customer', contact: '', phone: '', bizNo: '224-05-56680', note: '한식' },
        { id: nid(), name: '경강리식당', type: 'customer', contact: '', phone: '', bizNo: '226-28-51949', note: '한식' },
        { id: nid(), name: '대관민속주류', type: 'customer', contact: '조남임', phone: '', bizNo: '226-28-02042', note: '금융업소매/신용조합' },
        { id: nid(), name: '봉평에메랄드', type: 'customer', contact: '', phone: '', bizNo: '224-28-01138', note: '한식' },
        { id: nid(), name: '봉평오만복국', type: 'customer', contact: '함원안', phone: '', bizNo: '461-12-00528', note: '한식음식점' },
        { id: nid(), name: '봉평식당', type: 'customer', contact: '정영의', phone: '', bizNo: '226-32-05621', note: '한식점업' },
        { id: nid(), name: '봉평커피', type: 'customer', contact: '', phone: '', bizNo: '226-10-27648', note: '' },
        { id: nid(), name: '신채원당', type: 'customer', contact: '한준오', phone: '', bizNo: '474-36-00442', note: '한식' },
        { id: nid(), name: '삼수식당', type: 'customer', contact: '', phone: '', bizNo: '228-02-70939', note: '' },
        { id: nid(), name: '소금강', type: 'customer', contact: '', phone: '', bizNo: '226-10-27849', note: '' },
        { id: nid(), name: '전고지유가전', type: 'customer', contact: '김종백', phone: '', bizNo: '226-82-12889', note: '도소매' },
        { id: nid(), name: '전봉래토마토', type: 'customer', contact: '김영고', phone: '', bizNo: '226-52-10464', note: '도소매/축산업' },
        { id: nid(), name: '하들마트', type: 'customer', contact: '', phone: '', bizNo: '', note: '' },
        { id: nid(), name: '진부시장맛집', type: 'customer', contact: '', phone: '', bizNo: '', note: '' },
        { id: nid(), name: '용평리조트', type: 'customer', contact: '', phone: '', bizNo: '', note: '' }
    ];
    const suppliers = [
        { id: nid(), name: '주향입국', type: 'supplier', contact: '', phone: '', bizNo: '', note: '입국 공급' },
        { id: nid(), name: '케이비씨(KBC)', type: 'supplier', contact: '', phone: '', bizNo: '', note: '병 공급' },
        { id: nid(), name: '영서유통', type: 'supplier', contact: '', phone: '', bizNo: '', note: '밀가루 공급' },
        { id: nid(), name: '대종상사', type: 'supplier', contact: '', phone: '', bizNo: '', note: '재료 공급' },
        { id: nid(), name: '삼천상사', type: 'supplier', contact: '', phone: '', bizNo: '', note: '마개 공급' },
        { id: nid(), name: 'DS팩', type: 'supplier', contact: '', phone: '', bizNo: '', note: '라벨 공급' },
        { id: nid(), name: '대원포장', type: 'supplier', contact: '', phone: '', bizNo: '', note: '박스 공급' }
    ];
    return { clients: [...customers, ...suppliers], production: [], sales: [], purchases: [], workLogs: [], materials: [...DEFAULT_MATERIALS], products: [...DEFAULT_PRODUCTS], bottleSizes: [...DEFAULT_BOTTLES], nextId: cId.v + 1 };
}

let data; let currentTab = 'dashboard'; let viewMonth = new Date();
const $ = id => document.getElementById(id); const mainContent = $('main-content');

function loadData() { try { const r = localStorage.getItem(STORAGE_KEY); if (r) { data = JSON.parse(r); if (!data.workLogs) data.workLogs = []; if (!data.materials) data.materials = [...DEFAULT_MATERIALS]; if (!data.products) data.products = [...DEFAULT_PRODUCTS]; if (!data.bottleSizes) data.bottleSizes = [...DEFAULT_BOTTLES]; } else { data = getDefaultData(); saveData(); } } catch (e) { data = getDefaultData(); saveData(); } }
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function genId() { return data.nextId++; }
function formatNum(n) { return n.toLocaleString('ko-KR'); }
function formatWon(n) { return '₩' + formatNum(Math.round(n)); }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : ''; }
function formatDateFull(d) { return d ? new Date(d).toLocaleDateString('ko-KR') : ''; }
function getProduct(id) { return (data.products || DEFAULT_PRODUCTS).find(p => p.id === id) || { name: '?', emoji: '❓' }; }
function getClient(id) { return data.clients.find(c => c.id === id) || { name: '알 수 없음' }; }
function getBottleLabel(s) { const b = (data.bottleSizes || DEFAULT_BOTTLES).find(x => x.value === s); return b ? b.label : s + 'L'; }
function today() { return new Date().toISOString().split('T')[0]; }
function filterByMonth(arr, f) { const ym = viewMonth.getFullYear() + '-' + String(viewMonth.getMonth() + 1).padStart(2, '0'); return arr.filter(r => r[f] && r[f].startsWith(ym)); }
function filterByYear(arr, f) { const y = viewMonth.getFullYear().toString(); return arr.filter(r => r[f] && r[f].startsWith(y)); }
function getTotalLiters(r) { if (r.liters) return Number(r.liters); const bs = r.bottleSize || 1; const bottles = (Number(r.bottles) || 0) + (Number(r.boxes) || 0) * (Number(r.bottlesPerBox) || 0); return bottles * bs; }

function showToast(msg, type = '') { const t = $('toast'); t.textContent = msg; t.className = 'toast ' + type; setTimeout(() => t.classList.add('hidden'), 2500); }
function openModal(title, html) { $('modal-title').textContent = title; $('modal-body').innerHTML = html; $('modal-overlay').classList.remove('hidden'); }
function closeModal() { $('modal-overlay').classList.add('hidden'); }
$('modal-close').addEventListener('click', closeModal);
$('modal-overlay').addEventListener('click', e => { if (e.target === $('modal-overlay')) closeModal(); });
let confirmCb = null;
function showConfirm(msg, cb) { $('confirm-msg').textContent = msg; $('confirm-overlay').classList.remove('hidden'); confirmCb = cb; }
$('confirm-cancel').addEventListener('click', () => $('confirm-overlay').classList.add('hidden'));
$('confirm-ok').addEventListener('click', () => { $('confirm-overlay').classList.add('hidden'); if (confirmCb) confirmCb(); });

document.querySelectorAll('.tab').forEach(tab => { tab.addEventListener('click', () => { currentTab = tab.dataset.tab; document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); render(); }); });
$('fab').addEventListener('click', () => {
    switch (currentTab) { case 'production': openProductionForm(); break; case 'sales': openSalesForm(); break; case 'purchases': openPurchaseForm(); break; case 'clients': openClientForm(); break; case 'products': openProductForm(); break; case 'worklog': openWorkLogForm(); break; case 'materials': openMaterialForm(); break; default: showToast('탭을 선택하고 추가하세요'); }
});
function render() { switch (currentTab) { case 'dashboard': renderDashboard(); break; case 'production': renderProduction(); break; case 'sales': renderSales(); break; case 'purchases': renderPurchases(); break; case 'clients': renderClients(); break; case 'products': renderProducts(); break; case 'worklog': renderWorkLog(); break; case 'materials': renderMaterials(); break; } }
function renderMonthNav() { const l = viewMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }); return `<div class="month-nav"><button class="month-nav__btn" id="prev-month">◀</button><span class="month-nav__label">${l}</span><button class="month-nav__btn" id="next-month">▶</button></div>`; }
function bindMonthNav() { const p = $('prev-month'), n = $('next-month'); if (p) p.addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() - 1); render(); }); if (n) n.addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() + 1); render(); }); }

/* ═══ DASHBOARD ═══ */
function renderDashboard() {
    const mP = filterByMonth(data.production, 'date'), mS = filterByMonth(data.sales, 'date'), yP = filterByYear(data.production, 'date'), yS = filterByYear(data.sales, 'date');
    const mPT = mP.reduce((s, r) => s + getTotalLiters(r), 0), mST = mS.reduce((s, r) => s + Number(r.total), 0);
    const outs = data.sales.filter(s => s.status === 'outstanding').reduce((s, r) => s + Number(r.total), 0);
    const payable = data.purchases.filter(p => p.status === 'outstanding').reduce((s, r) => s + Number(r.amount), 0);
    const yPT = yP.reduce((s, r) => s + getTotalLiters(r), 0), yST = yS.reduce((s, r) => s + Number(r.total), 0);
    const ym = viewMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }), yr = viewMonth.getFullYear() + '년';
    let h = renderMonthNav();
    h += `<div class="section-header"><h3>📅 ${ym} 요약</h3></div><div class="stats-row">
<div class="stat-card stat-card--amber"><div class="stat-card__label">이번 달 생산</div><div class="stat-card__value">${formatNum(Math.round(mPT))}L</div></div>
<div class="stat-card stat-card--gold"><div class="stat-card__label">이번 달 매출</div><div class="stat-card__value">${formatWon(mST)}</div></div>
<div class="stat-card stat-card--red"><div class="stat-card__label">미수금</div><div class="stat-card__value">${formatWon(outs)}</div></div>
<div class="stat-card stat-card--blue"><div class="stat-card__label">미지급</div><div class="stat-card__value">${formatWon(payable)}</div></div></div>`;
    h += `<div class="section-header"><h3>📈 ${yr} 누적</h3></div><div class="stats-row">
<div class="stat-card stat-card--amber"><div class="stat-card__label">연간 생산</div><div class="stat-card__value">${formatNum(Math.round(yPT))}L</div></div>
<div class="stat-card stat-card--gold"><div class="stat-card__label">연간 매출</div><div class="stat-card__value">${formatWon(yST)}</div></div></div>`;
    h += `<div class="section-header"><h3>🍶 제품별 생산 (이번 달)</h3></div>`;
    (data.products || DEFAULT_PRODUCTS).forEach(p => { const l = mP.filter(r => r.productId === p.id).reduce((s, r) => s + getTotalLiters(r), 0); h += `<div class="list-item"><div class="list-item__icon">${p.emoji}</div><div class="list-item__body"><div class="list-item__title">${p.name}</div></div><div class="list-item__right"><div class="list-item__amount">${formatNum(Math.round(l))}L</div></div></div>`; });
    const recent = [...data.production.map(r => ({ ...r, _t: 'prod', _s: r.date })), ...data.sales.map(r => ({ ...r, _t: 'sale', _s: r.date })), ...data.purchases.map(r => ({ ...r, _t: 'purch', _s: r.date }))].sort((a, b) => b._s.localeCompare(a._s)).slice(0, 6);
    if (recent.length) { h += `<div class="section-header"><h3>🕐 최근 활동</h3></div>`; recent.forEach(r => { if (r._t === 'prod') { const p = getProduct(r.productId); h += `<div class="list-item"><div class="list-item__icon">🏭</div><div class="list-item__body"><div class="list-item__title">${p.emoji} ${p.name}</div><div class="list-item__subtitle">${formatDate(r.date)}</div></div><div class="list-item__right"><div class="list-item__amount">${formatNum(Math.round(getTotalLiters(r)))}L</div></div></div>`; } else if (r._t === 'sale') { const p = getProduct(r.productId), c = getClient(r.clientId); h += `<div class="list-item"><div class="list-item__icon">💰</div><div class="list-item__body"><div class="list-item__title">${c.name}</div><div class="list-item__subtitle">${formatDate(r.date)}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(r.total)}</div><div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미수금'}</span></div></div></div>`; } else { h += `<div class="list-item"><div class="list-item__icon">🛒</div><div class="list-item__body"><div class="list-item__title">${r.item}</div><div class="list-item__subtitle">${formatDate(r.date)}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(r.amount)}</div><div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미지급'}</span></div></div></div>`; } }); }
    mainContent.innerHTML = h; bindMonthNav();
}

/* ═══ PRODUCTION ═══ */
function renderProduction() {
    const recs = filterByMonth(data.production, 'date').sort((a, b) => b.date.localeCompare(a.date));
    const totalL = recs.reduce((s, r) => s + getTotalLiters(r), 0);
    let h = renderMonthNav();
    h += `<div class="stats-row"><div class="stat-card stat-card--amber"><div class="stat-card__label">이번 달 총 생산</div><div class="stat-card__value">${formatNum(Math.round(totalL))}L</div></div></div>`;
    if (!recs.length) { h += `<div class="empty-state"><div class="empty-state__icon">🏭</div><div class="empty-state__text">이번 달 생산 기록이 없습니다.<br>＋ 버튼으로 추가하세요.</div></div>`; }
    else {
        recs.forEach(r => {
            const p = getProduct(r.productId); const tl = getTotalLiters(r); let desc = ''; if (r.bottles || r.boxes) desc = `${getBottleLabel(r.bottleSize)} · ${r.bottles || 0}병${r.boxes ? ' + ' + r.boxes + '박스' : ''}`; else desc = formatNum(r.liters) + 'L 직접입력';
            h += `<div class="list-item" onclick="editProduction(${r.id})"><div class="list-item__icon">${p.emoji}</div><div class="list-item__body"><div class="list-item__title">${p.name}</div><div class="list-item__subtitle">${formatDateFull(r.date)} · ${desc}${r.note ? ' · ' + r.note : ''}</div></div><div class="list-item__right"><div class="list-item__amount">${formatNum(Math.round(tl))}L</div></div></div>`;
        });
    }
    mainContent.innerHTML = h; bindMonthNav();
}

function openProductionForm(editId) {
    const ex = editId ? data.production.find(r => r.id === editId) : null;
    const prods = data.products || DEFAULT_PRODUCTS; const sizes = data.bottleSizes || DEFAULT_BOTTLES;
    let h = `<div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${ex ? ex.date : today()}"></div>`;
    h += `<div class="form-group"><label>제품</label><select class="form-select" id="f-product">${prods.map(p => `<option value="${p.id}" ${ex && ex.productId === p.id ? 'selected' : ''}>${p.emoji} ${p.name}</option>`).join('')}</select></div>`;
    h += `<div class="form-group"><label>입력 방식</label><div class="toggle-group"><button type="button" class="toggle-btn ${!ex || !ex.bottles ? 'active' : ''}" data-val="liter">📏 리터 직접입력</button><button type="button" class="toggle-btn ${ex && ex.bottles ? 'active' : ''}" data-val="bottle">🍶 병/박스</button></div></div>`;
    h += `<div id="liter-section" style="${ex && ex.bottles ? 'display:none' : ''}"><div class="form-group"><label>생산량 (리터)</label><input type="number" class="form-input" id="f-liters" step="0.1" value="${ex && ex.liters ? ex.liters : ''}" placeholder="예: 100"></div></div>`;
    h += `<div id="bottle-section" style="${!ex || !ex.bottles ? 'display:none' : ''}">
<div class="form-group"><label>병 사이즈</label><div class="toggle-group" id="size-btns">${sizes.map(b => `<button type="button" class="toggle-btn ${ex && ex.bottleSize === b.value ? 'active' : ''}" data-val="${b.value}">${b.label}</button>`).join('')}</div></div>
<div class="form-group"><label>병 수량</label><div style="display:flex;gap:8px;align-items:center"><input type="number" class="form-input" id="f-bottles" value="${ex ? ex.bottles || '' : ''}" placeholder="직접입력" style="flex:1"><button type="button" class="btn btn--sm btn--outline qbtn" data-q="12">12병</button><button type="button" class="btn btn--sm btn--outline qbtn" data-q="15">15병</button></div></div>
<div class="form-group"><label>박스 수량</label><div class="form-row"><div><input type="number" class="form-input" id="f-boxes" value="${ex ? ex.boxes || '' : ''}" placeholder="박스 수"></div><div style="display:flex;gap:4px;align-items:center"><span style="font-size:0.8rem;white-space:nowrap">1박스=</span><input type="number" class="form-input" id="f-bpb" value="${ex ? ex.bottlesPerBox || 12 : 12}" style="width:60px"><span style="font-size:0.8rem">병</span></div></div></div>
<div class="form-group"><label>총 리터 (자동계산)</label><input type="text" class="form-input" id="f-calc" readonly></div></div>`;
    h += `<div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${ex ? ex.note || '' : ''}"></div>`;
    h += `<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '생산 기록 수정' : '생산 기록 추가', h);

    let mode = ex && ex.bottles ? 'bottle' : 'liter'; let selSize = ex ? ex.bottleSize || 1 : 1;
    const calcLiters = () => { const b = parseInt($('f-bottles').value) || 0; const bx = parseInt($('f-boxes').value) || 0; const bpb = parseInt($('f-bpb').value) || 0; $('f-calc').value = formatNum(Math.round((b + bx * bpb) * selSize * 100) / 100) + 'L'; };
    $('modal-body').querySelectorAll('.toggle-group')[0].querySelectorAll('.toggle-btn').forEach(btn => { btn.addEventListener('click', () => { $('modal-body').querySelectorAll('.toggle-group')[0].querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); mode = btn.dataset.val; $('liter-section').style.display = mode === 'liter' ? '' : 'none'; $('bottle-section').style.display = mode === 'bottle' ? '' : 'none'; }); });
    $('size-btns').querySelectorAll('.toggle-btn').forEach(btn => { btn.addEventListener('click', () => { $('size-btns').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); selSize = parseFloat(btn.dataset.val); calcLiters(); }); });
    $('modal-body').querySelectorAll('.qbtn').forEach(btn => { btn.addEventListener('click', () => { $('f-bottles').value = btn.dataset.q; calcLiters(); }); });
    ['f-bottles', 'f-boxes', 'f-bpb'].forEach(id => { const el = $(id); if (el) el.addEventListener('input', calcLiters); });
    if (mode === 'bottle') calcLiters();

    $('f-submit').addEventListener('click', () => {
        const date = $('f-date').value; const productId = $('f-product').value; const note = $('f-note').value; if (!date || !productId) { showToast('필수 항목을 입력하세요', 'error'); return; }
        let rec; if (mode === 'liter') { const liters = parseFloat($('f-liters').value); if (!liters) { showToast('리터를 입력하세요', 'error'); return; } rec = { date, productId, liters, bottles: 0, boxes: 0, bottlesPerBox: 0, bottleSize: 0, note }; }
        else { const bottles = parseInt($('f-bottles').value) || 0; const boxes = parseInt($('f-boxes').value) || 0; const bpb = parseInt($('f-bpb').value) || 0; if (!bottles && !boxes) { showToast('병 또는 박스를 입력하세요', 'error'); return; } rec = { date, productId, liters: 0, bottles, boxes, bottlesPerBox: bpb, bottleSize: selSize, note }; }
        if (ex) Object.assign(ex, rec); else data.production.push({ id: genId(), ...rec });
        saveData(); closeModal(); render(); showToast(ex ? '수정 완료' : '생산 기록 추가됨', 'success');
    });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제할까요?', () => { data.production = data.production.filter(r => r.id !== editId); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editProduction = id => openProductionForm(id);

/* ═══ SALES ═══ */
function renderSales() {
    const recs = filterByMonth(data.sales, 'date').sort((a, b) => b.date.localeCompare(a.date));
    const tot = recs.reduce((s, r) => s + Number(r.total), 0), oc = recs.filter(r => r.status === 'outstanding').length;
    let h = renderMonthNav();
    h += `<div class="stats-row"><div class="stat-card stat-card--gold"><div class="stat-card__label">이번 달 매출</div><div class="stat-card__value">${formatWon(tot)}</div></div><div class="stat-card stat-card--red"><div class="stat-card__label">미수금</div><div class="stat-card__value">${oc}건</div></div></div>`;
    if (!recs.length) h += `<div class="empty-state"><div class="empty-state__icon">💰</div><div class="empty-state__text">판매 기록이 없습니다.<br>＋ 버튼으로 추가하세요.</div></div>`;
    else recs.forEach(r => { const p = getProduct(r.productId), c = getClient(r.clientId); h += `<div class="list-item" onclick="editSale(${r.id})"><div class="list-item__icon">${p.emoji}</div><div class="list-item__body"><div class="list-item__title">${c.name}</div><div class="list-item__subtitle">${formatDate(r.date)} · ${getBottleLabel(r.bottleSize)} × ${r.quantity}병</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(r.total)}</div><div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미수금'}</span></div></div></div>`; });
    mainContent.innerHTML = h; bindMonthNav();
}

function openSalesForm(editId) {
    const ex = editId ? data.sales.find(r => r.id === editId) : null; const custs = data.clients.filter(c => c.type === 'customer'); const prods = data.products || DEFAULT_PRODUCTS; const sizes = data.bottleSizes || DEFAULT_BOTTLES;
    if (!custs.length && !ex) { showToast('먼저 판매처를 등록하세요', 'error'); return; }
    let h = `<div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${ex ? ex.date : today()}"></div>
<div class="form-group"><label>판매처</label><select class="form-select" id="f-client">${custs.map(c => `<option value="${c.id}" ${ex && ex.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
<div class="form-group"><label>제품</label><select class="form-select" id="f-product">${prods.map(p => `<option value="${p.id}" ${ex && ex.productId === p.id ? 'selected' : ''}>${p.emoji} ${p.name}</option>`).join('')}</select></div>
<div class="form-row"><div class="form-group"><label>병 사이즈</label><select class="form-select" id="f-size">${sizes.map(b => `<option value="${b.value}" ${ex && ex.bottleSize === b.value ? 'selected' : ''}>${b.label}</option>`).join('')}</select></div>
<div class="form-group"><label>수량 (병)</label><input type="number" class="form-input" id="f-qty" value="${ex ? ex.quantity : ''}" placeholder="50"></div></div>
<div class="form-row"><div class="form-group"><label>병당 단가</label><input type="number" class="form-input" id="f-price" value="${ex ? ex.unitPrice : ''}"></div>
<div class="form-group"><label>합계</label><input type="text" class="form-input" id="f-total" readonly value="${ex ? formatWon(ex.total) : '₩0'}"></div></div>
<div class="form-group"><label>결제 상태</label><div class="toggle-group"><button type="button" class="toggle-btn ${!ex || ex.status === 'paid' ? 'active' : ''}" data-val="paid">💵 완료</button><button type="button" class="toggle-btn ${ex && ex.status === 'outstanding' ? 'active' : ''}" data-val="outstanding">🔴 미수금</button></div></div>
<div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${ex ? ex.note || '' : ''}"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '판매 수정' : '판매 추가', h);
    const calc = () => { $('f-total').value = formatWon((parseInt($('f-qty').value) || 0) * (parseInt($('f-price').value) || 0)); }; $('f-qty').addEventListener('input', calc); $('f-price').addEventListener('input', calc);
    let selSt = ex ? ex.status : 'paid'; $('modal-body').querySelectorAll('.toggle-btn').forEach(btn => { btn.addEventListener('click', () => { $('modal-body').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); selSt = btn.dataset.val; }); });
    $('f-submit').addEventListener('click', () => { const d = $('f-date').value, ci = parseInt($('f-client').value), pi = $('f-product').value, bs = parseFloat($('f-size').value), q = parseInt($('f-qty').value), up = parseInt($('f-price').value), t = q * up, n = $('f-note').value; if (!d || !q || !up) { showToast('필수 입력', 'error'); return; } if (ex) Object.assign(ex, { date: d, clientId: ci, productId: pi, bottleSize: bs, quantity: q, unitPrice: up, total: t, status: selSt, note: n }); else data.sales.push({ id: genId(), date: d, clientId: ci, productId: pi, bottleSize: bs, quantity: q, unitPrice: up, total: t, status: selSt, note: n }); saveData(); closeModal(); render(); showToast(ex ? '수정' : '추가됨', 'success'); });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제?', () => { data.sales = data.sales.filter(r => r.id !== editId); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editSale = id => openSalesForm(id);

/* ═══ PURCHASES ═══ */
function renderPurchases() {
    const recs = filterByMonth(data.purchases, 'date').sort((a, b) => b.date.localeCompare(a.date));
    const tot = recs.reduce((s, r) => s + Number(r.amount), 0), oc = recs.filter(r => r.status === 'outstanding').length;
    let h = renderMonthNav();
    h += `<div class="stats-row"><div class="stat-card stat-card--blue"><div class="stat-card__label">이번 달 구매</div><div class="stat-card__value">${formatWon(tot)}</div></div><div class="stat-card stat-card--red"><div class="stat-card__label">미지급</div><div class="stat-card__value">${oc}건</div></div></div>`;
    if (!recs.length) h += `<div class="empty-state"><div class="empty-state__icon">🛒</div><div class="empty-state__text">구매 기록이 없습니다.</div></div>`;
    else recs.forEach(r => { const s = r.supplierId ? getClient(r.supplierId) : { name: '' }; h += `<div class="list-item" onclick="editPurchase(${r.id})"><div class="list-item__icon">🛒</div><div class="list-item__body"><div class="list-item__title">${r.item}</div><div class="list-item__subtitle">${formatDate(r.date)}${s.name ? ' · ' + s.name : ''}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(r.amount)}</div><div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미지급'}</span></div></div></div>`; });
    mainContent.innerHTML = h; bindMonthNav();
}

function openPurchaseForm(editId) {
    const ex = editId ? data.purchases.find(r => r.id === editId) : null; const sups = data.clients.filter(c => c.type === 'supplier');
    let h = `<div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${ex ? ex.date : today()}"></div>
<div class="form-group"><label>공급처</label><select class="form-select" id="f-supplier"><option value="">-- 선택 --</option>${sups.map(s => `<option value="${s.id}" ${ex && ex.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
<div class="form-group"><label>품목</label><input type="text" class="form-input" id="f-item" value="${ex ? ex.item : ''}" placeholder="예: 쌀 100kg"></div>
<div class="form-group"><label>금액 (원)</label><input type="number" class="form-input" id="f-amount" value="${ex ? ex.amount : ''}"></div>
<div class="form-group"><label>결제 상태</label><div class="toggle-group"><button type="button" class="toggle-btn ${!ex || ex.status === 'paid' ? 'active' : ''}" data-val="paid">💵 완료</button><button type="button" class="toggle-btn ${ex && ex.status === 'outstanding' ? 'active' : ''}" data-val="outstanding">🔴 미지급</button></div></div>
<div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${ex ? ex.note || '' : ''}"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '구매 수정' : '구매 추가', h);
    let selSt = ex ? ex.status : 'paid'; $('modal-body').querySelectorAll('.toggle-btn').forEach(btn => { btn.addEventListener('click', () => { $('modal-body').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); selSt = btn.dataset.val; }); });
    $('f-submit').addEventListener('click', () => { const d = $('f-date').value, si = $('f-supplier').value ? parseInt($('f-supplier').value) : null, it = $('f-item').value, am = parseInt($('f-amount').value), n = $('f-note').value; if (!d || !it || !am) { showToast('필수 입력', 'error'); return; } if (ex) Object.assign(ex, { date: d, supplierId: si, item: it, amount: am, status: selSt, note: n }); else data.purchases.push({ id: genId(), date: d, supplierId: si, item: it, amount: am, status: selSt, note: n }); saveData(); closeModal(); render(); showToast(ex ? '수정' : '추가됨', 'success'); });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제?', () => { data.purchases = data.purchases.filter(r => r.id !== editId); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editPurchase = id => openPurchaseForm(id);

/* ═══ CLIENTS ═══ */
function renderClients() {
    const custs = data.clients.filter(c => c.type === 'customer'), sups = data.clients.filter(c => c.type === 'supplier'); let h = '';
    h += `<div class="section-header"><h3>🏪 판매처 (${custs.length})</h3></div>`;
    if (!custs.length) h += `<div class="empty-state"><div class="empty-state__text">등록된 판매처가 없습니다.</div></div>`;
    custs.forEach(c => { const ts = data.sales.filter(s => s.clientId === c.id).reduce((s, r) => s + Number(r.total), 0); const os = data.sales.filter(s => s.clientId === c.id && s.status === 'outstanding').reduce((s, r) => s + Number(r.total), 0); h += `<div class="list-item" onclick="editClient(${c.id})"><div class="list-item__icon">🏪</div><div class="list-item__body"><div class="list-item__title">${c.name}</div><div class="list-item__subtitle">${c.bizNo || ''}${c.contact ? ' · ' + c.contact : ''}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(ts)}</div>${os ? `<div class="list-item__status"><span class="badge badge--outstanding">미수금 ${formatWon(os)}</span></div>` : ''}</div></div>`; });
    h += `<div class="section-header"><h3>📦 공급처 (${sups.length})</h3></div>`;
    if (!sups.length) h += `<div class="empty-state"><div class="empty-state__text">등록된 공급처가 없습니다.</div></div>`;
    sups.forEach(c => { const tp = data.purchases.filter(p => p.supplierId === c.id).reduce((s, r) => s + Number(r.amount), 0); const os = data.purchases.filter(p => p.supplierId === c.id && p.status === 'outstanding').reduce((s, r) => s + Number(r.amount), 0); h += `<div class="list-item" onclick="editClient(${c.id})"><div class="list-item__icon">📦</div><div class="list-item__body"><div class="list-item__title">${c.name}</div><div class="list-item__subtitle">${c.note || ''}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(tp)}</div>${os ? `<div class="list-item__status"><span class="badge badge--outstanding">미지급 ${formatWon(os)}</span></div>` : ''}</div></div>`; });
    mainContent.innerHTML = h;
}

function openClientForm(editId) {
    const ex = editId ? data.clients.find(c => c.id === editId) : null;
    let h = `<div class="form-group"><label>구분</label><div class="toggle-group"><button type="button" class="toggle-btn ${!ex || ex.type === 'customer' ? 'active' : ''}" data-val="customer">🏪 판매처</button><button type="button" class="toggle-btn ${ex && ex.type === 'supplier' ? 'active' : ''}" data-val="supplier">📦 공급처</button></div></div>
<div class="form-group"><label>거래처 이름</label><input type="text" class="form-input" id="f-name" value="${ex ? ex.name : ''}"></div>
<div class="form-group"><label>사업자번호</label><input type="text" class="form-input" id="f-bizno" value="${ex ? ex.bizNo || '' : ''}" placeholder="선택사항"></div>
<div class="form-group"><label>담당자</label><input type="text" class="form-input" id="f-contact" value="${ex ? ex.contact || '' : ''}"></div>
<div class="form-group"><label>전화번호</label><input type="tel" class="form-input" id="f-phone" value="${ex ? ex.phone || '' : ''}"></div>
<div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${ex ? ex.note || '' : ''}"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '거래처 수정' : '거래처 추가', h);
    let selT = ex ? ex.type : 'customer'; $('modal-body').querySelectorAll('.toggle-btn').forEach(btn => { btn.addEventListener('click', () => { $('modal-body').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); selT = btn.dataset.val; }); });
    $('f-submit').addEventListener('click', () => { const nm = $('f-name').value.trim(); if (!nm) { showToast('이름을 입력하세요', 'error'); return; } const obj = { name: nm, type: selT, bizNo: $('f-bizno').value.trim(), contact: $('f-contact').value.trim(), phone: $('f-phone').value.trim(), note: $('f-note').value.trim() }; if (ex) Object.assign(ex, obj); else data.clients.push({ id: genId(), ...obj }); saveData(); closeModal(); render(); showToast(ex ? '수정' : '추가됨', 'success'); });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm(`"${ex.name}" 삭제?`, () => { data.clients = data.clients.filter(c => c.id !== editId); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editClient = id => openClientForm(id);

/* ═══ PRODUCTS ═══ */
function renderProducts() {
    const prods = data.products || DEFAULT_PRODUCTS; const sizes = data.bottleSizes || DEFAULT_BOTTLES;
    let h = `<div class="section-header"><h3>🍶 등록된 제품 (${prods.length}종)</h3></div>`;
    prods.forEach(p => { const tp = data.production.filter(r => r.productId === p.id).reduce((s, r) => s + getTotalLiters(r), 0); h += `<div class="list-item" onclick="editProduct('${p.id}')"><div class="list-item__icon">${p.emoji}</div><div class="list-item__body"><div class="list-item__title">오대산 ${p.name} 생막걸리</div><div class="list-item__subtitle">총 생산: ${formatNum(Math.round(tp))}L</div></div></div>`; });
    h += `<div class="section-header"><h3>📏 병 사이즈 (${sizes.length}종)</h3></div>`;
    sizes.forEach((b, i) => { h += `<div class="list-item" onclick="editBottleSize(${i})"><div class="list-item__icon">🍶</div><div class="list-item__body"><div class="list-item__title">${b.label}</div><div class="list-item__subtitle">${b.value}L</div></div></div>`; });
    mainContent.innerHTML = h;
}

function openProductForm(editId) {
    const ex = editId ? (data.products || []).find(p => p.id === editId) : null;
    let h = `<div class="form-group"><label>제품 이름</label><input type="text" class="form-input" id="f-name" value="${ex ? ex.name : ''}" placeholder="예: 찰옥수수"></div>
<div class="form-group"><label>이모지</label><input type="text" class="form-input" id="f-emoji" value="${ex ? ex.emoji : '🍶'}" placeholder="🍶"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '제품 수정' : '제품 추가', h);
    $('f-submit').addEventListener('click', () => { const nm = $('f-name').value.trim(), em = $('f-emoji').value.trim() || '🍶'; if (!nm) { showToast('이름 입력', 'error'); return; } if (ex) { ex.name = nm; ex.emoji = em; } else { if (!data.products) data.products = [...DEFAULT_PRODUCTS]; data.products.push({ id: 'p' + genId(), name: nm, emoji: em }); } saveData(); closeModal(); render(); showToast(ex ? '수정' : '추가됨', 'success'); });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제?', () => { data.products = data.products.filter(p => p.id !== editId); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editProduct = id => openProductForm(id);

function editBottleSize(idx) {
    const sizes = data.bottleSizes || DEFAULT_BOTTLES; const ex = sizes[idx];
    let h = `<div class="form-group"><label>용량 (리터)</label><input type="number" class="form-input" id="f-val" step="0.01" value="${ex ? ex.value : ''}"></div>
<div class="form-group"><label>표시명</label><input type="text" class="form-input" id="f-label" value="${ex ? ex.label : ''}" placeholder="예: 750ml"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '병 사이즈 수정' : '병 사이즈 추가', h);
    $('f-submit').addEventListener('click', () => { const v = parseFloat($('f-val').value), l = $('f-label').value.trim(); if (!v || !l) { showToast('입력하세요', 'error'); return; } if (ex) { ex.value = v; ex.label = l; } else { if (!data.bottleSizes) data.bottleSizes = [...DEFAULT_BOTTLES]; data.bottleSizes.push({ value: v, label: l }); } saveData(); closeModal(); render(); showToast('저장됨', 'success'); });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제?', () => { data.bottleSizes.splice(idx, 1); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editBottleSize = editBottleSize;

/* ═══ WORK LOG ═══ */
function renderWorkLog() {
    const recs = filterByMonth(data.workLogs || [], 'date').sort((a, b) => b.date.localeCompare(a.date));
    let h = renderMonthNav();
    h += `<div class="section-header"><h3>📋 작업 일지</h3></div>`;
    if (!recs.length) h += `<div class="empty-state"><div class="empty-state__icon">📋</div><div class="empty-state__text">작업 기록이 없습니다.<br>＋ 버튼으로 추가하세요.</div></div>`;
    else recs.forEach(r => {
        const p = getProduct(r.productId); const stg = WORK_STAGES.find(s => s.id === r.stage) || { name: '?', emoji: '?' }; const matList = (r.materials || []).map(m => m.name + ' ' + m.quantity + (m.unit || '')).join(', ');
        h += `<div class="list-item" onclick="editWorkLog(${r.id})"><div class="list-item__icon">${stg.emoji}</div><div class="list-item__body"><div class="list-item__title">${p.emoji} ${p.name} — ${stg.name}</div><div class="list-item__subtitle">${formatDateFull(r.date)}${matList ? ' · 원료: ' + matList : ''}${r.note ? ' · ' + r.note : ''}</div></div></div>`;
    });
    mainContent.innerHTML = h; bindMonthNav();
}

function openWorkLogForm(editId) {
    const ex = editId ? (data.workLogs || []).find(r => r.id === editId) : null; const prods = data.products || DEFAULT_PRODUCTS; const mats = data.materials || DEFAULT_MATERIALS;
    let matRows = ex && ex.materials ? ex.materials.length : 1;
    function matRowHTML(i, m) { return `<div class="form-row mat-row" data-i="${i}"><div class="form-group" style="flex:2"><select class="form-select mat-name"><option value="">-- 원료 --</option>${mats.map(mt => `<option value="${mt.name}" ${m && m.name === mt.name ? 'selected' : ''}>${mt.name} (${mt.supplier})</option>`).join('')}<option value="__custom" ${m && !mats.find(mt => mt.name === m.name) ? 'selected' : ''}>직접입력</option></select></div><div class="form-group" style="flex:1"><input type="number" class="form-input mat-qty" value="${m ? m.quantity : ''}" placeholder="수량"></div><div class="form-group" style="flex:0.8"><input type="text" class="form-input mat-unit" value="${m ? m.unit || '' : 'kg'}" placeholder="단위"></div></div>`; }
    let h = `<div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${ex ? ex.date : today()}"></div>
<div class="form-group"><label>제품</label><select class="form-select" id="f-product">${prods.map(p => `<option value="${p.id}" ${ex && ex.productId === p.id ? 'selected' : ''}>${p.emoji} ${p.name}</option>`).join('')}</select></div>
<div class="form-group"><label>공정 단계</label><div class="toggle-group" id="stage-btns">${WORK_STAGES.map(s => `<button type="button" class="toggle-btn ${ex && ex.stage === s.id ? 'active' : ''}" data-val="${s.id}">${s.emoji} ${s.name}</button>`).join('')}</div></div>
<div class="section-header"><h3>🧪 원료 사용</h3><span class="section-header__action" id="add-mat-row">+ 추가</span></div>
<div id="mat-rows">`;
    for (let i = 0; i < matRows; i++)h += matRowHTML(i, ex && ex.materials ? ex.materials[i] : null);
    h += `</div>
<div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${ex ? ex.note || '' : ''}"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '작업일지 수정' : '작업일지 추가', h);

    let selStage = ex ? ex.stage : 'jumo';
    $('stage-btns').querySelectorAll('.toggle-btn').forEach(btn => { btn.addEventListener('click', () => { $('stage-btns').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); selStage = btn.dataset.val; }); });
    if (!ex) $('stage-btns').querySelector('.toggle-btn').classList.add('active');
    $('add-mat-row').addEventListener('click', () => { const rows = $('mat-rows'); const i = rows.children.length; rows.insertAdjacentHTML('beforeend', matRowHTML(i, null)); });
    $('f-submit').addEventListener('click', () => {
        const d = $('f-date').value, pi = $('f-product').value, n = $('f-note').value; if (!d) { showToast('날짜 입력', 'error'); return; }
        const materials = []; $('mat-rows').querySelectorAll('.mat-row').forEach(row => { const sel = row.querySelector('.mat-name'); let nm = sel.value; if (nm === '__custom') nm = prompt('원료 이름을 입력하세요') || ''; const qty = parseFloat(row.querySelector('.mat-qty').value) || 0; const unit = row.querySelector('.mat-unit').value; if (nm && qty) materials.push({ name: nm, quantity: qty, unit }); });
        const rec = { date: d, productId: pi, stage: selStage, materials, note: n }; if (ex) Object.assign(ex, rec); else { if (!data.workLogs) data.workLogs = []; data.workLogs.push({ id: genId(), ...rec }); } saveData(); closeModal(); render(); showToast(ex ? '수정' : '추가됨', 'success');
    });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제?', () => { data.workLogs = data.workLogs.filter(r => r.id !== editId); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editWorkLog = id => openWorkLogForm(id);

/* ═══ MATERIALS ═══ */
function renderMaterials() {
    const mats = data.materials || DEFAULT_MATERIALS;
    let h = `<div class="section-header"><h3>📝 원료 목록</h3></div>`;
    mats.forEach((m, i) => {
        const inQty = (data.purchases || []).filter(p => p.item && p.item.includes(m.name)).reduce((s, r) => s + 1, 0);
        const outQty = (data.workLogs || []).reduce((s, wl) => s + (wl.materials || []).filter(x => x.name === m.name).reduce((ss, x) => ss + x.quantity, 0), 0);
        h += `<div class="list-item" onclick="editMaterial(${i})"><div class="list-item__icon">🧪</div><div class="list-item__body"><div class="list-item__title">${m.name}</div><div class="list-item__subtitle">공급: ${m.supplier} · 단위: ${m.unit}</div></div><div class="list-item__right"><div class="list-item__amount">사용: ${formatNum(Math.round(outQty))}${m.unit}</div></div></div>`;
    });
    h += `<div class="section-header" style="margin-top:24px"><h3>📊 원료 사용 내역 (이번 달)</h3></div>`;
    const mLogs = filterByMonth(data.workLogs || [], 'date');
    const usage = {}; mLogs.forEach(wl => { (wl.materials || []).forEach(x => { if (!usage[x.name]) usage[x.name] = { qty: 0, unit: x.unit }; usage[x.name].qty += x.quantity; }); });
    if (!Object.keys(usage).length) h += `<div class="empty-state"><div class="empty-state__text">이번 달 사용 내역이 없습니다.</div></div>`;
    else Object.entries(usage).forEach(([name, v]) => { h += `<div class="list-item"><div class="list-item__icon">📦</div><div class="list-item__body"><div class="list-item__title">${name}</div></div><div class="list-item__right"><div class="list-item__amount">${formatNum(Math.round(v.qty))} ${v.unit}</div></div></div>`; });
    mainContent.innerHTML = h; bindMonthNav();
}

function openMaterialForm(idx) {
    const mats = data.materials || DEFAULT_MATERIALS; const ex = idx !== undefined ? mats[idx] : null;
    let h = `<div class="form-group"><label>원료 이름</label><input type="text" class="form-input" id="f-name" value="${ex ? ex.name : ''}" placeholder="예: 입국"></div>
<div class="form-group"><label>공급처</label><input type="text" class="form-input" id="f-supplier" value="${ex ? ex.supplier : ''}" placeholder="예: 주향입국"></div>
<div class="form-group"><label>단위</label><input type="text" class="form-input" id="f-unit" value="${ex ? ex.unit : 'kg'}" placeholder="kg, 개, 장"></div>
<button class="btn btn--primary" id="f-submit">${ex ? '수정' : '추가'}</button>`;
    if (ex) h += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;
    openModal(ex ? '원료 수정' : '원료 추가', h);
    $('f-submit').addEventListener('click', () => { const nm = $('f-name').value.trim(), sp = $('f-supplier').value.trim(), un = $('f-unit').value.trim() || 'kg'; if (!nm) { showToast('이름 입력', 'error'); return; } if (ex) { ex.name = nm; ex.supplier = sp; ex.unit = un; } else { if (!data.materials) data.materials = []; data.materials.push({ id: 'm' + genId(), name: nm, supplier: sp, unit: un }); } saveData(); closeModal(); render(); showToast('저장됨', 'success'); });
    if (ex) $('f-delete').addEventListener('click', () => { showConfirm('삭제?', () => { data.materials.splice(idx, 1); saveData(); closeModal(); render(); showToast('삭제됨', 'success'); }); });
}
window.editMaterial = idx => openMaterialForm(idx);

/* ═══ INIT ═══ */
loadData(); render();

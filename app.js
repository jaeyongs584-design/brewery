/* ═══════════════════════════════════════════════════
   진부양조장 경영관리 — Application Logic
   ═══════════════════════════════════════════════════ */

// ── Constants ──
const PRODUCTS = [
    { id: 'corn', name: '찰옥수수', emoji: '🌽' },
    { id: 'angelica', name: '당귀', emoji: '🌿' },
    { id: 'deodeok', name: '더덕', emoji: '🏔️' }
];
const BOTTLE_SIZES = [
    { value: 0.75, label: '750ml' },
    { value: 1, label: '1L' },
    { value: 1.5, label: '1.5L' },
    { value: 1.7, label: '1.7L' }
];
const STORAGE_KEY = 'jinbu_brewery_data';

// ── State ──
let data = { clients: [], production: [], sales: [], purchases: [], nextId: 1 };
let currentTab = 'dashboard';
let viewMonth = new Date();

// ── DOM Refs ──
const $ = id => document.getElementById(id);
const mainContent = $('main-content');

// ── Data Persistence ──
function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) data = JSON.parse(raw);
    } catch (e) { console.error('Data load error', e); }
}
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function genId() { return data.nextId++; }

// ── Helpers ──
function formatNum(n) { return n.toLocaleString('ko-KR'); }
function formatWon(n) { return '₩' + formatNum(Math.round(n)); }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : ''; }
function formatDateFull(d) { return d ? new Date(d).toLocaleDateString('ko-KR') : ''; }
function getProduct(id) { return PRODUCTS.find(p => p.id === id) || { name: '?', emoji: '❓' }; }
function getClient(id) { return data.clients.find(c => c.id === id) || { name: '알 수 없음' }; }
function getBottleLabel(size) { const b = BOTTLE_SIZES.find(s => s.value === size); return b ? b.label : size + 'L'; }
function today() { return new Date().toISOString().split('T')[0]; }
function monthKey(d) { const dt = new Date(d); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'); }
function yearKey(d) { return new Date(d).getFullYear().toString(); }

function filterByMonth(arr, dateField) {
    const ym = viewMonth.getFullYear() + '-' + String(viewMonth.getMonth() + 1).padStart(2, '0');
    return arr.filter(r => r[dateField] && r[dateField].startsWith(ym));
}
function filterByYear(arr, dateField) {
    const y = viewMonth.getFullYear().toString();
    return arr.filter(r => r[dateField] && r[dateField].startsWith(y));
}

// ── Toast ──
function showToast(msg, type = '') {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast ' + type;
    setTimeout(() => t.classList.add('hidden'), 2500);
}

// ── Modal ──
function openModal(title, bodyHTML) {
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = bodyHTML;
    $('modal-overlay').classList.remove('hidden');
}
function closeModal() { $('modal-overlay').classList.add('hidden'); }
$('modal-close').addEventListener('click', closeModal);
$('modal-overlay').addEventListener('click', e => { if (e.target === $('modal-overlay')) closeModal(); });

// ── Confirm ──
let confirmCallback = null;
function showConfirm(msg, cb) {
    $('confirm-msg').textContent = msg;
    $('confirm-overlay').classList.remove('hidden');
    confirmCallback = cb;
}
$('confirm-cancel').addEventListener('click', () => $('confirm-overlay').classList.add('hidden'));
$('confirm-ok').addEventListener('click', () => {
    $('confirm-overlay').classList.add('hidden');
    if (confirmCallback) confirmCallback();
});

// ═══════════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════════
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        currentTab = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        render();
    });
});

// ═══════════════════════════════════════════════════
//  FAB
// ═══════════════════════════════════════════════════
$('fab').addEventListener('click', () => {
    switch (currentTab) {
        case 'production': openProductionForm(); break;
        case 'sales': openSalesForm(); break;
        case 'purchases': openPurchaseForm(); break;
        case 'clients': openClientForm(); break;
        case 'products': showToast('제품은 기본 3종이 등록되어 있습니다'); break;
        default: showToast('탭을 선택하고 추가하세요'); break;
    }
});

// ═══════════════════════════════════════════════════
//  RENDER ROUTER
// ═══════════════════════════════════════════════════
function render() {
    switch (currentTab) {
        case 'dashboard': renderDashboard(); break;
        case 'production': renderProduction(); break;
        case 'sales': renderSales(); break;
        case 'purchases': renderPurchases(); break;
        case 'clients': renderClients(); break;
        case 'products': renderProducts(); break;
    }
}

// ═══════════════════════════════════════════════════
//  1. DASHBOARD
// ═══════════════════════════════════════════════════
function renderDashboard() {
    const mProd = filterByMonth(data.production, 'date');
    const mSales = filterByMonth(data.sales, 'date');
    const mPurch = filterByMonth(data.purchases, 'date');
    const yProd = filterByYear(data.production, 'date');
    const ySales = filterByYear(data.sales, 'date');

    const mProdTotal = mProd.reduce((s, r) => s + Number(r.liters), 0);
    const mSalesTotal = mSales.reduce((s, r) => s + Number(r.total), 0);
    const outstanding = data.sales.filter(s => s.status === 'outstanding').reduce((s, r) => s + Number(r.total), 0);
    const payable = data.purchases.filter(p => p.status === 'outstanding').reduce((s, r) => s + Number(r.amount), 0);

    const yProdTotal = yProd.reduce((s, r) => s + Number(r.liters), 0);
    const ySalesTotal = ySales.reduce((s, r) => s + Number(r.total), 0);

    const ym = viewMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    const yr = viewMonth.getFullYear() + '년';

    let html = renderMonthNav();

    html += `<div class="section-header"><h3>📅 ${ym} 요약</h3></div>`;
    html += `<div class="stats-row">
    <div class="stat-card stat-card--amber"><div class="stat-card__label">이번 달 생산</div><div class="stat-card__value">${formatNum(mProdTotal)}L</div></div>
    <div class="stat-card stat-card--gold"><div class="stat-card__label">이번 달 매출</div><div class="stat-card__value">${formatWon(mSalesTotal)}</div></div>
    <div class="stat-card stat-card--red"><div class="stat-card__label">미수금 (받을 돈)</div><div class="stat-card__value">${formatWon(outstanding)}</div></div>
    <div class="stat-card stat-card--blue"><div class="stat-card__label">미지급 (줄 돈)</div><div class="stat-card__value">${formatWon(payable)}</div></div>
  </div>`;

    html += `<div class="section-header"><h3>📈 ${yr} 누적</h3></div>`;
    html += `<div class="stats-row">
    <div class="stat-card stat-card--amber"><div class="stat-card__label">연간 생산</div><div class="stat-card__value">${formatNum(yProdTotal)}L</div></div>
    <div class="stat-card stat-card--gold"><div class="stat-card__label">연간 매출</div><div class="stat-card__value">${formatWon(ySalesTotal)}</div></div>
  </div>`;

    // Product breakdown this month
    html += `<div class="section-header"><h3>🍶 제품별 생산 (이번 달)</h3></div>`;
    PRODUCTS.forEach(p => {
        const liters = mProd.filter(r => r.productId === p.id).reduce((s, r) => s + Number(r.liters), 0);
        html += `<div class="list-item">
      <div class="list-item__icon">${p.emoji}</div>
      <div class="list-item__body"><div class="list-item__title">${p.name}</div></div>
      <div class="list-item__right"><div class="list-item__amount">${formatNum(liters)}L</div></div>
    </div>`;
    });

    // Recent activity
    const recent = [
        ...data.production.map(r => ({ ...r, _type: 'prod', _sort: r.date })),
        ...data.sales.map(r => ({ ...r, _type: 'sale', _sort: r.date })),
        ...data.purchases.map(r => ({ ...r, _type: 'purch', _sort: r.date }))
    ].sort((a, b) => b._sort.localeCompare(a._sort)).slice(0, 8);

    if (recent.length) {
        html += `<div class="section-header"><h3>🕐 최근 활동</h3></div>`;
        recent.forEach(r => {
            if (r._type === 'prod') {
                const p = getProduct(r.productId);
                html += `<div class="list-item"><div class="list-item__icon">🏭</div><div class="list-item__body"><div class="list-item__title">${p.emoji} ${p.name} 생산</div><div class="list-item__subtitle">${formatDate(r.date)}</div></div><div class="list-item__right"><div class="list-item__amount">${formatNum(r.liters)}L</div></div></div>`;
            } else if (r._type === 'sale') {
                const p = getProduct(r.productId); const c = getClient(r.clientId);
                html += `<div class="list-item"><div class="list-item__icon">💰</div><div class="list-item__body"><div class="list-item__title">${c.name} · ${p.emoji}${p.name}</div><div class="list-item__subtitle">${formatDate(r.date)}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(r.total)}</div><div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미수금'}</span></div></div></div>`;
            } else {
                html += `<div class="list-item"><div class="list-item__icon">🛒</div><div class="list-item__body"><div class="list-item__title">${r.item}</div><div class="list-item__subtitle">${formatDate(r.date)}</div></div><div class="list-item__right"><div class="list-item__amount">${formatWon(r.amount)}</div><div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미지급'}</span></div></div></div>`;
            }
        });
    }

    mainContent.innerHTML = html;
    bindMonthNav();
}

// ── Month Nav ──
function renderMonthNav() {
    const label = viewMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    return `<div class="month-nav">
    <button class="month-nav__btn" id="prev-month">◀</button>
    <span class="month-nav__label">${label}</span>
    <button class="month-nav__btn" id="next-month">▶</button>
  </div>`;
}
function bindMonthNav() {
    const prev = $('prev-month'), next = $('next-month');
    if (prev) prev.addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() - 1); render(); });
    if (next) next.addEventListener('click', () => { viewMonth.setMonth(viewMonth.getMonth() + 1); render(); });
}

// ═══════════════════════════════════════════════════
//  2. PRODUCTION
// ═══════════════════════════════════════════════════
function renderProduction() {
    const records = filterByMonth(data.production, 'date').sort((a, b) => b.date.localeCompare(a.date));
    const totalL = records.reduce((s, r) => s + Number(r.liters), 0);

    let html = renderMonthNav();
    html += `<div class="stats-row"><div class="stat-card stat-card--amber"><div class="stat-card__label">이번 달 총 생산</div><div class="stat-card__value">${formatNum(totalL)}L</div></div></div>`;

    if (!records.length) {
        html += `<div class="empty-state"><div class="empty-state__icon">🏭</div><div class="empty-state__text">이번 달 생산 기록이 없습니다.<br>＋ 버튼으로 추가하세요.</div></div>`;
    } else {
        records.forEach(r => {
            const p = getProduct(r.productId);
            html += `<div class="list-item" onclick="editProduction(${r.id})">
        <div class="list-item__icon">${p.emoji}</div>
        <div class="list-item__body"><div class="list-item__title">${p.name}</div><div class="list-item__subtitle">${formatDateFull(r.date)}${r.note ? ' · ' + r.note : ''}</div></div>
        <div class="list-item__right"><div class="list-item__amount">${formatNum(r.liters)}L</div></div>
      </div>`;
        });
    }
    mainContent.innerHTML = html;
    bindMonthNav();
}

function openProductionForm(editId) {
    const existing = editId ? data.production.find(r => r.id === editId) : null;
    const title = existing ? '생산 기록 수정' : '생산 기록 추가';

    let html = `<div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${existing ? existing.date : today()}"></div>`;
    html += `<div class="form-group"><label>제품</label><select class="form-select" id="f-product">${PRODUCTS.map(p => `<option value="${p.id}" ${existing && existing.productId === p.id ? 'selected' : ''}>${p.emoji} ${p.name}</option>`).join('')}</select></div>`;
    html += `<div class="form-group"><label>생산량 (리터)</label><input type="number" class="form-input" id="f-liters" placeholder="예: 100" value="${existing ? existing.liters : ''}" step="0.1"></div>`;
    html += `<div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" placeholder="선택사항" value="${existing ? existing.note || '' : ''}"></div>`;
    html += `<button class="btn btn--primary" id="f-submit">${existing ? '수정' : '추가'}</button>`;
    if (existing) html += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;

    openModal(title, html);

    $('f-submit').addEventListener('click', () => {
        const date = $('f-date').value;
        const productId = $('f-product').value;
        const liters = parseFloat($('f-liters').value);
        const note = $('f-note').value;
        if (!date || !productId || !liters) { showToast('필수 항목을 입력하세요', 'error'); return; }

        if (existing) {
            Object.assign(existing, { date, productId, liters, note });
        } else {
            data.production.push({ id: genId(), date, productId, liters, note });
        }
        saveData(); closeModal(); render();
        showToast(existing ? '수정 완료' : '생산 기록 추가됨', 'success');
    });

    if (existing) {
        $('f-delete').addEventListener('click', () => {
            showConfirm('이 생산 기록을 삭제할까요?', () => {
                data.production = data.production.filter(r => r.id !== editId);
                saveData(); closeModal(); render(); showToast('삭제됨', 'success');
            });
        });
    }
}
window.editProduction = id => openProductionForm(id);

// ═══════════════════════════════════════════════════
//  3. SALES
// ═══════════════════════════════════════════════════
function renderSales() {
    const records = filterByMonth(data.sales, 'date').sort((a, b) => b.date.localeCompare(a.date));
    const totalSales = records.reduce((s, r) => s + Number(r.total), 0);
    const outstandingCount = records.filter(r => r.status === 'outstanding').length;

    let html = renderMonthNav();
    html += `<div class="stats-row">
    <div class="stat-card stat-card--gold"><div class="stat-card__label">이번 달 매출</div><div class="stat-card__value">${formatWon(totalSales)}</div></div>
    <div class="stat-card stat-card--red"><div class="stat-card__label">미수금 건수</div><div class="stat-card__value">${outstandingCount}건</div></div>
  </div>`;

    if (!records.length) {
        html += `<div class="empty-state"><div class="empty-state__icon">💰</div><div class="empty-state__text">이번 달 판매 기록이 없습니다.<br>＋ 버튼으로 추가하세요.</div></div>`;
    } else {
        records.forEach(r => {
            const p = getProduct(r.productId); const c = getClient(r.clientId);
            html += `<div class="list-item" onclick="editSale(${r.id})">
        <div class="list-item__icon">${p.emoji}</div>
        <div class="list-item__body">
          <div class="list-item__title">${c.name}</div>
          <div class="list-item__subtitle">${formatDate(r.date)} · ${getBottleLabel(r.bottleSize)} × ${r.quantity}병</div>
        </div>
        <div class="list-item__right">
          <div class="list-item__amount">${formatWon(r.total)}</div>
          <div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미수금'}</span></div>
        </div>
      </div>`;
        });
    }
    mainContent.innerHTML = html;
    bindMonthNav();
}

function openSalesForm(editId) {
    const existing = editId ? data.sales.find(r => r.id === editId) : null;
    const customers = data.clients.filter(c => c.type === 'customer');

    if (!customers.length && !existing) {
        showToast('먼저 거래처(판매처)를 등록하세요', 'error');
        return;
    }

    let html = `
    <div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${existing ? existing.date : today()}"></div>
    <div class="form-group"><label>판매처</label><select class="form-select" id="f-client">${customers.map(c => `<option value="${c.id}" ${existing && existing.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
    <div class="form-group"><label>제품</label><select class="form-select" id="f-product">${PRODUCTS.map(p => `<option value="${p.id}" ${existing && existing.productId === p.id ? 'selected' : ''}>${p.emoji} ${p.name}</option>`).join('')}</select></div>
    <div class="form-row">
      <div class="form-group"><label>병 사이즈</label><select class="form-select" id="f-size">${BOTTLE_SIZES.map(b => `<option value="${b.value}" ${existing && existing.bottleSize === b.value ? 'selected' : ''}>${b.label}</option>`).join('')}</select></div>
      <div class="form-group"><label>수량 (병)</label><input type="number" class="form-input" id="f-qty" value="${existing ? existing.quantity : ''}" placeholder="예: 50"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>병당 단가 (원)</label><input type="number" class="form-input" id="f-price" value="${existing ? existing.unitPrice : ''}" placeholder="예: 3000"></div>
      <div class="form-group"><label>합계</label><input type="text" class="form-input" id="f-total" readonly value="${existing ? formatWon(existing.total) : '₩0'}"></div>
    </div>
    <div class="form-group"><label>결제 상태</label>
      <div class="toggle-group">
        <button type="button" class="toggle-btn ${!existing || existing.status === 'paid' ? 'active' : ''}" data-val="paid">💵 완료</button>
        <button type="button" class="toggle-btn ${existing && existing.status === 'outstanding' ? 'active' : ''}" data-val="outstanding">🔴 미수금</button>
      </div>
    </div>
    <div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${existing ? existing.note || '' : ''}" placeholder="선택사항"></div>
    <button class="btn btn--primary" id="f-submit">${existing ? '수정' : '추가'}</button>`;
    if (existing) html += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;

    openModal(existing ? '판매 기록 수정' : '판매 기록 추가', html);

    // Auto-calc total
    const calcTotal = () => {
        const qty = parseInt($('f-qty').value) || 0;
        const price = parseInt($('f-price').value) || 0;
        $('f-total').value = formatWon(qty * price);
    };
    $('f-qty').addEventListener('input', calcTotal);
    $('f-price').addEventListener('input', calcTotal);

    // Toggle
    let selStatus = existing ? existing.status : 'paid';
    $('modal-body').querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $('modal-body').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selStatus = btn.dataset.val;
        });
    });

    $('f-submit').addEventListener('click', () => {
        const date = $('f-date').value;
        const clientId = parseInt($('f-client').value);
        const productId = $('f-product').value;
        const bottleSize = parseFloat($('f-size').value);
        const quantity = parseInt($('f-qty').value);
        const unitPrice = parseInt($('f-price').value);
        const total = quantity * unitPrice;
        const note = $('f-note').value;

        if (!date || !quantity || !unitPrice) { showToast('필수 항목을 입력하세요', 'error'); return; }

        if (existing) {
            Object.assign(existing, { date, clientId, productId, bottleSize, quantity, unitPrice, total, status: selStatus, note });
        } else {
            data.sales.push({ id: genId(), date, clientId, productId, bottleSize, quantity, unitPrice, total, status: selStatus, note });
        }
        saveData(); closeModal(); render();
        showToast(existing ? '수정 완료' : '판매 기록 추가됨', 'success');
    });

    if (existing) {
        $('f-delete').addEventListener('click', () => {
            showConfirm('이 판매 기록을 삭제할까요?', () => {
                data.sales = data.sales.filter(r => r.id !== editId);
                saveData(); closeModal(); render(); showToast('삭제됨', 'success');
            });
        });
    }
}
window.editSale = id => openSalesForm(id);

// ═══════════════════════════════════════════════════
//  4. PURCHASES
// ═══════════════════════════════════════════════════
function renderPurchases() {
    const records = filterByMonth(data.purchases, 'date').sort((a, b) => b.date.localeCompare(a.date));
    const totalPurch = records.reduce((s, r) => s + Number(r.amount), 0);
    const outstandingCount = records.filter(r => r.status === 'outstanding').length;

    let html = renderMonthNav();
    html += `<div class="stats-row">
    <div class="stat-card stat-card--blue"><div class="stat-card__label">이번 달 구매</div><div class="stat-card__value">${formatWon(totalPurch)}</div></div>
    <div class="stat-card stat-card--red"><div class="stat-card__label">미지급 건수</div><div class="stat-card__value">${outstandingCount}건</div></div>
  </div>`;

    if (!records.length) {
        html += `<div class="empty-state"><div class="empty-state__icon">🛒</div><div class="empty-state__text">이번 달 구매 기록이 없습니다.<br>＋ 버튼으로 추가하세요.</div></div>`;
    } else {
        records.forEach(r => {
            const sup = r.supplierId ? getClient(r.supplierId) : { name: '' };
            html += `<div class="list-item" onclick="editPurchase(${r.id})">
        <div class="list-item__icon">🛒</div>
        <div class="list-item__body">
          <div class="list-item__title">${r.item}</div>
          <div class="list-item__subtitle">${formatDate(r.date)}${sup.name ? ' · ' + sup.name : ''}</div>
        </div>
        <div class="list-item__right">
          <div class="list-item__amount">${formatWon(r.amount)}</div>
          <div class="list-item__status"><span class="badge badge--${r.status}">${r.status === 'paid' ? '완료' : '미지급'}</span></div>
        </div>
      </div>`;
        });
    }
    mainContent.innerHTML = html;
    bindMonthNav();
}

function openPurchaseForm(editId) {
    const existing = editId ? data.purchases.find(r => r.id === editId) : null;
    const suppliers = data.clients.filter(c => c.type === 'supplier');

    let html = `
    <div class="form-group"><label>날짜</label><input type="date" class="form-input" id="f-date" value="${existing ? existing.date : today()}"></div>
    <div class="form-group"><label>공급처</label><select class="form-select" id="f-supplier"><option value="">-- 선택 --</option>${suppliers.map(s => `<option value="${s.id}" ${existing && existing.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
    <div class="form-group"><label>품목</label><input type="text" class="form-input" id="f-item" value="${existing ? existing.item : ''}" placeholder="예: 쌀 100kg"></div>
    <div class="form-group"><label>금액 (원)</label><input type="number" class="form-input" id="f-amount" value="${existing ? existing.amount : ''}" placeholder="예: 500000"></div>
    <div class="form-group"><label>결제 상태</label>
      <div class="toggle-group">
        <button type="button" class="toggle-btn ${!existing || existing.status === 'paid' ? 'active' : ''}" data-val="paid">💵 완료</button>
        <button type="button" class="toggle-btn ${existing && existing.status === 'outstanding' ? 'active' : ''}" data-val="outstanding">🔴 미지급</button>
      </div>
    </div>
    <div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${existing ? existing.note || '' : ''}" placeholder="선택사항"></div>
    <button class="btn btn--primary" id="f-submit">${existing ? '수정' : '추가'}</button>`;
    if (existing) html += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;

    openModal(existing ? '구매 기록 수정' : '구매 기록 추가', html);

    let selStatus = existing ? existing.status : 'paid';
    $('modal-body').querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $('modal-body').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selStatus = btn.dataset.val;
        });
    });

    $('f-submit').addEventListener('click', () => {
        const date = $('f-date').value;
        const supplierId = $('f-supplier').value ? parseInt($('f-supplier').value) : null;
        const item = $('f-item').value;
        const amount = parseInt($('f-amount').value);
        const note = $('f-note').value;

        if (!date || !item || !amount) { showToast('필수 항목을 입력하세요', 'error'); return; }

        if (existing) {
            Object.assign(existing, { date, supplierId, item, amount, status: selStatus, note });
        } else {
            data.purchases.push({ id: genId(), date, supplierId, item, amount, status: selStatus, note });
        }
        saveData(); closeModal(); render();
        showToast(existing ? '수정 완료' : '구매 기록 추가됨', 'success');
    });

    if (existing) {
        $('f-delete').addEventListener('click', () => {
            showConfirm('이 구매 기록을 삭제할까요?', () => {
                data.purchases = data.purchases.filter(r => r.id !== editId);
                saveData(); closeModal(); render(); showToast('삭제됨', 'success');
            });
        });
    }
}
window.editPurchase = id => openPurchaseForm(id);

// ═══════════════════════════════════════════════════
//  5. CLIENTS
// ═══════════════════════════════════════════════════
function renderClients() {
    const customers = data.clients.filter(c => c.type === 'customer');
    const suppliers = data.clients.filter(c => c.type === 'supplier');

    let html = '';
    html += `<div class="section-header"><h3>🏪 판매처 (${customers.length})</h3></div>`;
    if (!customers.length) html += `<div class="empty-state"><div class="empty-state__text">등록된 판매처가 없습니다.</div></div>`;
    customers.forEach(c => {
        const totalSales = data.sales.filter(s => s.clientId === c.id).reduce((s, r) => s + Number(r.total), 0);
        const outstanding = data.sales.filter(s => s.clientId === c.id && s.status === 'outstanding').reduce((s, r) => s + Number(r.total), 0);
        html += `<div class="list-item" onclick="editClient(${c.id})">
      <div class="list-item__icon">🏪</div>
      <div class="list-item__body">
        <div class="list-item__title">${c.name}</div>
        <div class="list-item__subtitle">${c.contact || ''}${c.phone ? ' · ' + c.phone : ''}</div>
      </div>
      <div class="list-item__right">
        <div class="list-item__amount">${formatWon(totalSales)}</div>
        ${outstanding ? `<div class="list-item__status"><span class="badge badge--outstanding">미수금 ${formatWon(outstanding)}</span></div>` : ''}
      </div>
    </div>`;
    });

    html += `<div class="section-header"><h3>📦 공급처 (${suppliers.length})</h3></div>`;
    if (!suppliers.length) html += `<div class="empty-state"><div class="empty-state__text">등록된 공급처가 없습니다.</div></div>`;
    suppliers.forEach(c => {
        const totalPurch = data.purchases.filter(p => p.supplierId === c.id).reduce((s, r) => s + Number(r.amount), 0);
        const outstanding = data.purchases.filter(p => p.supplierId === c.id && p.status === 'outstanding').reduce((s, r) => s + Number(r.amount), 0);
        html += `<div class="list-item" onclick="editClient(${c.id})">
      <div class="list-item__icon">📦</div>
      <div class="list-item__body">
        <div class="list-item__title">${c.name}</div>
        <div class="list-item__subtitle">${c.contact || ''}${c.phone ? ' · ' + c.phone : ''}</div>
      </div>
      <div class="list-item__right">
        <div class="list-item__amount">${formatWon(totalPurch)}</div>
        ${outstanding ? `<div class="list-item__status"><span class="badge badge--outstanding">미지급 ${formatWon(outstanding)}</span></div>` : ''}
      </div>
    </div>`;
    });

    mainContent.innerHTML = html;
}

function openClientForm(editId) {
    const existing = editId ? data.clients.find(c => c.id === editId) : null;

    let html = `
    <div class="form-group"><label>구분</label>
      <div class="toggle-group">
        <button type="button" class="toggle-btn ${!existing || existing.type === 'customer' ? 'active' : ''}" data-val="customer">🏪 판매처</button>
        <button type="button" class="toggle-btn ${existing && existing.type === 'supplier' ? 'active' : ''}" data-val="supplier">📦 공급처</button>
      </div>
    </div>
    <div class="form-group"><label>거래처 이름</label><input type="text" class="form-input" id="f-name" value="${existing ? existing.name : ''}" placeholder="예: OO마트"></div>
    <div class="form-group"><label>담당자</label><input type="text" class="form-input" id="f-contact" value="${existing ? existing.contact || '' : ''}" placeholder="선택사항"></div>
    <div class="form-group"><label>전화번호</label><input type="tel" class="form-input" id="f-phone" value="${existing ? existing.phone || '' : ''}" placeholder="선택사항"></div>
    <div class="form-group"><label>메모</label><input type="text" class="form-input" id="f-note" value="${existing ? existing.note || '' : ''}" placeholder="선택사항"></div>
    <button class="btn btn--primary" id="f-submit">${existing ? '수정' : '추가'}</button>`;
    if (existing) html += `<button class="btn btn--danger" style="margin-top:10px;width:100%" id="f-delete">삭제</button>`;

    openModal(existing ? '거래처 수정' : '거래처 추가', html);

    let selType = existing ? existing.type : 'customer';
    $('modal-body').querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $('modal-body').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selType = btn.dataset.val;
        });
    });

    $('f-submit').addEventListener('click', () => {
        const name = $('f-name').value.trim();
        const contact = $('f-contact').value.trim();
        const phone = $('f-phone').value.trim();
        const note = $('f-note').value.trim();

        if (!name) { showToast('거래처 이름을 입력하세요', 'error'); return; }

        if (existing) {
            Object.assign(existing, { name, type: selType, contact, phone, note });
        } else {
            data.clients.push({ id: genId(), name, type: selType, contact, phone, note });
        }
        saveData(); closeModal(); render();
        showToast(existing ? '수정 완료' : '거래처 추가됨', 'success');
    });

    if (existing) {
        $('f-delete').addEventListener('click', () => {
            showConfirm(`"${existing.name}" 거래처를 삭제할까요?`, () => {
                data.clients = data.clients.filter(c => c.id !== editId);
                saveData(); closeModal(); render(); showToast('삭제됨', 'success');
            });
        });
    }
}
window.editClient = id => openClientForm(id);

// ═══════════════════════════════════════════════════
//  6. PRODUCTS
// ═══════════════════════════════════════════════════
function renderProducts() {
    let html = `<div class="section-header"><h3>📦 등록된 제품 (${PRODUCTS.length}종)</h3></div>`;

    PRODUCTS.forEach(p => {
        const totalProd = data.production.filter(r => r.productId === p.id).reduce((s, r) => s + Number(r.liters), 0);
        const totalSales = data.sales.filter(r => r.productId === p.id).reduce((s, r) => s + Number(r.total), 0);
        html += `<div class="list-item">
      <div class="list-item__icon">${p.emoji}</div>
      <div class="list-item__body">
        <div class="list-item__title">오대산 ${p.name} 생막걸리</div>
        <div class="list-item__subtitle">총 생산: ${formatNum(totalProd)}L · 총 매출: ${formatWon(totalSales)}</div>
      </div>
    </div>`;
    });

    html += `<div class="section-header"><h3>📏 병 사이즈</h3></div>`;
    BOTTLE_SIZES.forEach(b => {
        html += `<div class="list-item">
      <div class="list-item__icon">🍶</div>
      <div class="list-item__body"><div class="list-item__title">${b.label}</div><div class="list-item__subtitle">${b.value}L</div></div>
    </div>`;
    });

    mainContent.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════
loadData();
render();

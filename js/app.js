(function () {
  'use strict';

  const PROFILES = window.PROFILES || {};
  const PROFILE_IDS = Object.keys(PROFILES);
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app'), sheet = $('#sheet'), backdrop = $('#sheetBackdrop'), screenEl = $('#screen');

  /* Nhúng trong landing page (?embed=1): chỉ còn màn hình app, báo trạng thái cho trang cha */
  const EMBED = new URLSearchParams(location.search).get('embed') === '1';
  if (EMBED) document.body.classList.add('embed');
  function notifyParent(msg) {
    if (!EMBED || window.parent === window) return;
    try { window.parent.postMessage({ type: 'insurex-demo', ...msg }, location.origin); } catch (e) { /* trang cha khác origin */ }
  }

  /* ---------------- helpers ---------------- */
  const ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
    bell: '<path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.2M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 005.4-1.6"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/>',
    transfer: '<path d="M7 7h13l-4-4"/><path d="M17 17H4l4 4"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21h.01M17 21h4v-4"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    bill: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    piggy: '<path d="M4 11a7 6 0 0113-3.5L20 7v4h1v3h-2a7 7 0 01-3 3v3h-3v-2h-3v2H7v-3.5A6 6 0 014 11z"/><path d="M15 11h.01"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    chevDown: '<path d="M6 9l6 6 6-6"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    del: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 001-1V6a1 1 0 00-1-1z"/><path d="M17 9l-5 6M12 9l5 6"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    spark: '<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>',
    file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    wand: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>'
  };
  const svg = (n, s = 22, sw = 2) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

  /* Định dạng số theo profile: numberLocale (mặc định vi-VN) và currencySuffix (mặc định " VND") */
  const fmt = n => Math.round(n || 0).toLocaleString((S && P().numberLocale) || 'vi-VN');
  const vnd = n => fmt(n) + ((S && P().currencySuffix) || ' VND');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = n => String(n).padStart(2, '0');
  const dstr = d => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  const tstr = d => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  const rnd = n => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
  const initials = name => name.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('');
  const shade = c => `linear-gradient(150deg, ${c} 0%, color-mix(in srgb, ${c} 62%, #000) 100%)`;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  function readVN(num) {
    if (!num) return '';
    const d = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const r3 = (n, full) => {
      const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), u = n % 10, s = [];
      if (full || h) s.push(d[h] + ' trăm');
      if (t > 1) { s.push(d[t] + ' mươi'); if (u === 1) s.push('mốt'); else if (u === 5) s.push('lăm'); else if (u) s.push(d[u]); }
      else if (t === 1) { s.push('mười'); if (u === 5) s.push('lăm'); else if (u) s.push(d[u]); }
      else if (u) { if (full || h) s.push('lẻ'); s.push(d[u]); }
      return s.join(' ');
    };
    const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ'];
    const g = []; let n = num;
    while (n > 0) { g.push(n % 1000); n = Math.floor(n / 1000); }
    const parts = [];
    for (let i = g.length - 1; i >= 0; i--) if (g[i]) parts.push(r3(g[i], i < g.length - 1) + units[i]);
    const s = parts.join(' ') + ' đồng';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const FAKE_NAMES = ['NGUYEN THI HONG NHUNG', 'TRAN QUOC BAO', 'LE THANH TAM', 'VO HOANG PHUC', 'DANG MINH THU', 'BUI VAN KHANH', 'HOANG THI LAN', 'PHAN DUC TRUNG'];

  /* ---------------- state ---------------- */
  let S;
  let logs = [];
  function freshState(pid) {
    const p = PROFILES[pid];
    const pl = (p.insurance && p.insurance.placements) || {};
    return {
      pid, screen: 'home', stack: [], hide: false,
      balance: p.customer.balance,
      form: blankForm(p),
      addon: false,
      otpFor: 'transfer', pin: '',
      txn: null,
      product: null, plan: 0, consent: false, productSrc: '',
      policies: [], viewPolicy: null, policyFresh: false,
      hubTab: 'mine', claims: [],
      on: {
        home: !!(pl.home && pl.home.enabled !== false),
        confirm: !!(pl.confirm && pl.confirm.enabled !== false),
        success: !!(pl.success && pl.success.enabled !== false)
      }
    };
  }
  function blankForm(p) {
    return { bank: null, account: '', name: '', looking: false, amount: 0, note: (p.transfer && p.transfer.defaultNote) || '', contact: -1 };
  }
  const P = () => PROFILES[S.pid];
  const INS = () => P().insurance || { products: {}, placements: {} };
  const prod = id => INS().products[id];
  const bankName = code => (P().banks.find(b => b.code === code) || { name: code }).name;
  const owns = id => S.policies.some(x => x.productId === id);

  function confirmOffer() {
    const c = INS().placements.confirm;
    if (!S.on.confirm || !c) return null;
    const pr = prod(c.productId);
    if (!pr || owns(c.productId) || S.form.amount < (c.minAmount || 0)) return null;
    const planIdx = c.planIndex || 0;
    return { id: c.productId, pr, planIdx, plan: pr.plans[planIdx] };
  }

  function log(type, msg) {
    logs.push({ t: new Date(), type, msg });
    renderLog();
  }

  /* ---------------- navigation ---------------- */
  function go(scr) { S.stack.push(S.screen); S.screen = scr; render(); }
  function back() { S.screen = S.stack.pop() || 'home'; render(); }
  function goHome() { S.stack = []; S.screen = 'home'; render(); }

  function render(quiet) {
    closeSheet();
    const prevBody = $('.body', app);
    const scroll = quiet && prevBody ? prevBody.scrollTop : 0;
    const sk = skin();
    app.innerHTML = ((sk.screens && sk.screens[S.screen]) || SCREENS[S.screen])(quiet);
    const root = app.firstElementChild;
    if (quiet && root) {
      root.style.animation = 'none';
      const b = $('.body', app); if (b) b.scrollTop = scroll;
    }
    const st = (sk.status && sk.status[S.screen]) || {};
    screenEl.style.setProperty('--sbg', S.screen === 'product' ? prod(S.product).color : st.bg || 'var(--pd)');
    screenEl.style.setProperty('--sbc', st.color || '#fff');
    const bind = (sk.bind && sk.bind[S.screen]) || BIND[S.screen];
    if (bind) bind();
    if (!quiet) trackView();
    renderSteps();
    notifyParent({ screen: S.screen });
  }

  function trackView() {
    if (S.screen === 'home' && S.on.home && prod((INS().placements.home || {}).productId)) {
      log('view', `Banner "${prod(INS().placements.home.productId).short}" – Trang chủ`);
    }
    if (S.screen === 'confirm') {
      const o = confirmOffer();
      if (o) log('view', `Offer "${o.pr.short}" – Màn xác nhận`);
    }
    if (S.screen === 'success') {
      xsellList().forEach(id => log('view', `Cross-sell "${prod(id).short}" – Màn thành công`));
    }
  }

  /* ---------------- UI pieces ---------------- */
  const nav = (title, opts = {}) => `
    <div class="nav" ${opts.bg ? `style="background:${opts.bg}"` : ''}>
      <button class="nav-btn" data-act="${opts.backAct || 'back'}">${svg('back', 24, 2.4)}</button>
      <div class="nav-title">${esc(title)}</div>
      <button class="nav-btn" data-act="home">${opts.right === false ? '' : svg('home', 22)}</button>
    </div>`;

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('on'), 1800);
  }

  function openSheet(title, html, bind) {
    sheet.innerHTML = `<div class="sh-grab"></div><div class="sh-h"><span>${esc(title)}</span><button data-act="closeSheet" style="color:var(--muted)">${svg('x', 22)}</button></div><div class="sh-b">${html}</div>`;
    sheet.classList.add('on');
    backdrop.classList.add('on');
    if (bind) bind();
  }
  function closeSheet() { sheet.classList.remove('on'); backdrop.classList.remove('on'); }

  /* ---------------- screens ---------------- */
  const SCREENS = {};
  const BIND = {};

  SCREENS.home = () => {
    const p = P(), c = p.customer, ins = INS();
    const hp = ins.placements.home, hprod = S.on.home && hp && prod(hp.productId);
    const bal = S.hide ? '•••••••••' : fmt(S.balance);
    const quick = [
      ['transfer', 'Chuyển tiền', 'data-act="go" data-to="transfer"'],
      ['qr', 'Quét mã QR', 'data-act="toast"'],
      ['phone', 'Nạp tiền điện thoại', 'data-act="toast"'],
      ['bill', 'Thanh toán hóa đơn', 'data-act="toast"'],
      ['piggy', 'Tiết kiệm online', 'data-act="toast"'],
      ['card', 'Dịch vụ thẻ', 'data-act="toast"'],
      ['shield', 'Bảo hiểm', 'data-act="go" data-to="hub"', true],
      ['grid', 'Tất cả', 'data-act="toast"']
    ];
    return `
    <div class="scr fade">
      <div class="body">
        <div class="home-hero">
          <div class="home-top">
            <div class="avatar">${esc(c.initials)}</div>
            <div><div class="hello">Xin chào,</div><div class="uname">${esc(c.name)}</div></div>
            <div class="spacer"></div>
            <div class="logo-chip">${esc(p.logoText)}</div>
            <button class="icon-btn" data-act="toast" data-msg="Bạn không có thông báo mới">${svg('bell', 20)}<span class="dot"></span></button>
          </div>
        </div>
        <div class="acct-card">
          <div class="acct-row">
            <div><div class="acct-label">${esc(c.accountType)}</div><div class="acct-no">${esc(c.account)}</div></div>
            <button class="acct-eye" data-act="toggleBal">${svg(S.hide ? 'eyeOff' : 'eye', 20)}</button>
          </div>
          <div class="acct-bal">${bal} <small>VND</small></div>
          <div class="acct-links">
            <button data-act="toast">Lịch sử giao dịch</button>
            <button data-act="toast">Chi tiết tài khoản</button>
          </div>
        </div>
        <div class="quick">
          ${quick.map(([ic, t, a, isNew]) => `<button class="q-item" ${a}><span class="q-ic">${svg(ic, 24)}${isNew && hprod ? '<span class="new">Mới</span>' : ''}</span>${t}</button>`).join('')}
        </div>
        ${hprod ? `
        <button class="promo" style="background:${shade(hprod.color)}" data-act="openProduct" data-id="${hp.productId}" data-src="Trang chủ">
          <span class="pi">${svg(hprod.icon, 26)}</span>
          <span style="position:relative;z-index:1">
            <div class="pt">${esc(hprod.name)}</div>
            <div class="ps">${esc(hprod.tagline)}</div>
            ${hprod.badge ? `<span class="pbadge">${esc(hprod.badge)} · Mua ngay</span>` : ''}
          </span>
        </button>` : ''}
        <div class="sec-title">Ưu đãi dành cho bạn <a>Xem tất cả</a></div>
        <div class="tiles">
          <div class="tile"><b>Hoàn tiền 10%</b>Thanh toán QR tại siêu thị</div>
          <div class="tile"><b>Lãi suất 5,2%</b>Tiết kiệm online 6 tháng</div>
        </div>
      </div>
      <div class="tabbar">
        <button class="tab on">${svg('home', 22)}Trang chủ</button>
        <button class="tab" data-act="toast">${svg('clock', 22)}Lịch sử</button>
        <button class="tab center" data-act="toast"><span class="tc">${svg('qr', 22)}</span></button>
        <button class="tab" data-act="toast">${svg('gift', 22)}Ưu đãi</button>
        <button class="tab" data-act="toast">${svg('user', 22)}Cá nhân</button>
      </div>
    </div>`;
  };

  SCREENS.transfer = () => {
    const p = P(), f = S.form;
    return `
    <div class="scr">
      ${nav('Chuyển tiền')}
      <div class="body pad">
        <div class="card src">
          <div class="si">${esc(p.logoText)}</div>
          <div style="flex:1"><div class="sn">${esc(p.customer.account)}</div><div class="sb">Số dư khả dụng: <b style="color:var(--text)">${vnd(S.balance)}</b></div></div>
          ${svg('chevDown', 18)}
        </div>
        <div class="seg">
          <button class="on">Đến tài khoản</button>
          <button data-act="toast">Đến số thẻ</button>
          <button data-act="toast">Qua mã QR</button>
        </div>
        <div class="lbl">Người nhận đã lưu</div>
        <div class="contacts">
          ${p.contacts.map((c, i) => `
            <button class="ct ${f.contact === i ? 'sel' : ''}" data-act="pickContact" data-i="${i}">
              <span class="ca">${esc(initials(c.name))}</span>${esc(c.name.split(' ').slice(-1)[0])}<span class="cb">${esc(c.bank)}</span>
            </button>`).join('')}
        </div>
        <button class="field" data-act="pickBank">
          <span class="fl">Ngân hàng nhận</span>
          <span class="fv ${f.bank ? '' : 'ph'}" id="bankVal">${f.bank ? esc(bankName(f.bank)) : 'Chọn ngân hàng'} ${svg('chevDown', 18)}</span>
        </button>
        <div class="field"><label for="fAcc">Số tài khoản</label><input id="fAcc" inputmode="numeric" autocomplete="off" placeholder="Nhập số tài khoản" value="${esc(f.account)}"></div>
        <div class="namerow" id="nameRow"></div>
        <div class="field field-amt"><div style="flex:1"><label for="fAmt">Số tiền</label><input id="fAmt" inputmode="numeric" autocomplete="off" placeholder="0"></div><span class="cur">VND</span></div>
        <div class="words" id="amtWords"></div>
        <div class="chips">
          ${[100000, 500000, 1000000, 2000000, 5000000].map(v => `<button class="chip" data-act="chip" data-v="${v}">${fmt(v)}</button>`).join('')}
        </div>
        <div class="field"><label for="fNote">Nội dung chuyển tiền</label><textarea id="fNote" rows="2" maxlength="140">${esc(f.note)}</textarea></div>
      </div>
      <div class="footer"><button class="btn primary" id="btnNext" data-act="toConfirm" disabled>Tiếp tục</button></div>
    </div>`;
  };

  BIND.transfer = () => {
    const acc = $('#fAcc'), amt = $('#fAmt'), note = $('#fNote');
    if (S.form.amount) amt.value = fmt(S.form.amount);
    acc.addEventListener('input', () => {
      acc.value = acc.value.replace(/\D/g, '').slice(0, 19);
      S.form.account = acc.value;
      S.form.contact = -1;
      document.querySelectorAll('.ct.sel').forEach(el => el.classList.remove('sel'));
      lookup();
    });
    amt.addEventListener('input', () => {
      const d = amt.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 12);
      S.form.amount = +d || 0;
      amt.value = d ? fmt(+d) : '';
      updateAmount();
    });
    note.addEventListener('input', () => { S.form.note = note.value; });
    updateName(); updateAmount();
  };

  let lookTimer;
  function lookup() {
    clearTimeout(lookTimer);
    const f = S.form;
    f.name = ''; f.looking = false;
    if (f.bank && f.account.length >= 6) {
      f.looking = true;
      lookTimer = setTimeout(() => {
        f.looking = false;
        const c = P().contacts.find(x => x.account === f.account && x.bank === f.bank);
        let h = 0; for (const ch of f.account) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
        f.name = c ? c.name : FAKE_NAMES[h % FAKE_NAMES.length];
        updateName();
      }, 700);
    }
    updateName();
  }
  function updateName() {
    const el = $('#nameRow'); if (!el) return;
    const f = S.form;
    el.className = 'namerow' + (f.name ? ' ok' : f.looking ? ' load' : '');
    el.innerHTML = f.name ? `${svg('check', 16, 3)} ${esc(f.name)}` : f.looking ? '<span class="spin"></span> Đang kiểm tra tên người nhận…' : '';
    validate();
  }
  function updateAmount() {
    const el = $('#amtWords'); if (!el) return;
    const a = S.form.amount;
    if (a > S.balance) { el.className = 'words err'; el.textContent = 'Số tiền vượt quá số dư khả dụng'; }
    else { el.className = 'words'; el.textContent = readVN(a); }
    validate();
  }
  function validate() {
    const b = $('#btnNext'); if (!b) return;
    const f = S.form;
    b.disabled = !(f.bank && f.name && f.amount >= 1000 && f.amount <= S.balance);
  }

  SCREENS.confirm = () => {
    const f = S.form, p = P(), o = confirmOffer();
    const prem = o && S.addon ? o.plan.premium : 0;
    return `
    <div class="scr">
      ${nav('Xác nhận giao dịch')}
      <div class="body pad">
        <div class="card">
          <div class="amt-hero">
            <div class="al">Số tiền chuyển</div>
            <div class="av">${vnd(f.amount)}</div>
            <div class="aw">${esc(readVN(f.amount))}</div>
          </div>
          <div class="rows">
            <div class="r"><span>Từ tài khoản</span><span>${esc(p.customer.account)}<span class="sub">${esc(p.customer.name)}</span></span></div>
            <div class="r"><span>Đến tài khoản</span><span>${esc(f.account)}<span class="sub">${esc(f.name)}</span></span></div>
            <div class="r"><span>Ngân hàng</span><span>${esc(bankName(f.bank))}</span></div>
            <div class="r"><span>Nội dung</span><span>${esc(f.note || '—')}</span></div>
            <div class="r"><span>Hình thức</span><span>${esc((p.transfer && p.transfer.method) || 'Chuyển nhanh')}</span></div>
            <div class="r"><span>Phí giao dịch</span><span style="color:var(--ok)">Miễn phí</span></div>
          </div>
        </div>
        ${o ? `
        <div class="offer ${S.addon ? 'on' : ''}">
          <span class="ob">${S.addon ? '✓ Đã chọn' : 'Đề xuất cho bạn'}</span>
          <div class="oh" data-act="toggleAddon" style="cursor:pointer">
            <span class="oi" style="background:${o.pr.color}">${svg(o.pr.icon, 22)}</span>
            <div>
              <div class="ot">${esc(o.pr.name)}</div>
              <div class="od">${esc(o.pr.offerText || o.pr.tagline)} – quyền lợi đến <b>${vnd(o.plan.coverage)}</b>.</div>
            </div>
          </div>
          <div class="of">
            <div class="op">Phí chỉ <b>${fmt(o.plan.premium)}đ</b> / ${o.plan.term} ngày</div>
            <button class="sw ${S.addon ? 'on' : ''}" data-act="toggleAddon" aria-label="Thêm bảo hiểm"></button>
          </div>
          <button class="more" data-act="addonInfo">Xem quyền lợi chi tiết</button>
          <div class="prov">Cung cấp bởi ${esc(INS().provider)} · ${esc(INS().distributorNote || '')}</div>
        </div>` : ''}
        <div class="card" style="margin-top:12px">
          <div class="rows">
            ${prem ? `<div class="r"><span>Phí bảo hiểm</span><span>${vnd(prem)}</span></div>` : ''}
            <div class="r total"><span>Tổng tiền</span><span>${vnd(f.amount + prem)}</span></div>
          </div>
        </div>
      </div>
      <div class="footer"><button class="btn primary" data-act="doConfirm">Xác nhận</button></div>
    </div>`;
  };

  SCREENS.otp = () => {
    const isIns = S.otpFor === 'insurance';
    return `
    <div class="scr">
      ${nav('Xác thực giao dịch')}
      <div class="otp-wrap">
        <div class="otp-ic">${svg('lock', 34)}</div>
        <div class="otp-t">Nhập mã PIN Smart OTP</div>
        <div class="otp-s">${isIns ? 'Xác thực thanh toán phí bảo hiểm' : 'Xác thực giao dịch chuyển tiền'}<br><b style="color:var(--text)">${vnd(isIns ? prod(S.product).plans[S.plan].premium : S.form.amount + ((confirmOffer() && S.addon) ? confirmOffer().plan.premium : 0))}</b></div>
        <div class="dots" id="dots">${'<i></i>'.repeat(6)}</div>
        <div class="otp-hint">Demo: nhập 6 số bất kỳ</div>
      </div>
      <div class="keypad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button class="key" data-act="key" data-k="${k}">${k}</button>`).join('')}
        <button class="key fn" data-act="toast" data-msg="Chức năng quên mã PIN chỉ minh họa">Quên PIN</button>
        <button class="key" data-act="key" data-k="0">0</button>
        <button class="key fn" data-act="key" data-k="del">${svg('del', 26, 1.8)}</button>
      </div>
    </div>`;
  };

  function pressKey(k) {
    const dots = $('#dots'); if (!dots) return;
    if (S.pin.length >= 6 && k !== 'del') return;
    S.pin = k === 'del' ? S.pin.slice(0, -1) : S.pin + k;
    [...dots.children].forEach((d, i) => d.classList.toggle('f', i < S.pin.length));
    if (S.pin.length === 6) setTimeout(processing, 180);
  }

  function processing() {
    const root = app.firstElementChild;
    const el = document.createElement('div');
    el.className = 'proc';
    el.innerHTML = `<div class="ring"></div><p>${S.otpFor === 'insurance' ? 'Đang phát hành hợp đồng bảo hiểm…' : 'Đang xử lý giao dịch…'}</p>`;
    root.appendChild(el);
    setTimeout(S.otpFor === 'insurance' ? finishPurchase : finishTransfer, 1300);
  }

  function createPolicy(productId, planIdx, src) {
    const pr = prod(productId), plan = pr.plans[planIdx];
    const start = new Date(), end = new Date(start.getTime() + plan.term * 86400000);
    const pol = { productId, planIdx, no: 'EI' + start.getFullYear() + '-' + rnd(8), start, end, src, premium: plan.premium };
    S.policies.push(pol);
    log('buy', `Mua "${pr.short}" (${plan.name}) ${fmt(plan.premium)}đ – ${src}`);
    return pol;
  }

  function finishTransfer() {
    const f = S.form, o = confirmOffer();
    const prem = o && S.addon ? o.plan.premium : 0;
    S.balance -= f.amount + prem;
    S.txn = { ...f, bankName: bankName(f.bank), time: new Date(), code: 'FT' + rnd(12), prem, policy: null };
    if (prem) S.txn.policy = createPolicy(o.id, o.planIdx, 'Màn xác nhận');
    S.stack = []; S.screen = 'success'; render();
  }

  function finishPurchase() {
    const pr = prod(S.product), plan = pr.plans[S.plan];
    S.balance -= plan.premium;
    S.viewPolicy = createPolicy(S.product, S.plan, S.productSrc || 'App');
    S.policyFresh = true;
    S.stack = []; S.screen = 'policy'; render();
  }

  function xsellList() {
    const s = INS().placements.success;
    if (!S.on.success || !s) return [];
    return (s.productIds || []).filter(id => prod(id) && !owns(id)).slice(0, 3);
  }

  const xsCard = (id, src) => {
    const pr = prod(id);
    return `<button class="xs-card" style="--c:${pr.color}" data-act="openProduct" data-id="${id}" data-src="${src}">
      <span class="xi">${svg(pr.icon, 24)}</span>
      <span style="flex:1"><div class="xt">${esc(pr.name)}</div><div class="xd">${esc(pr.tagline)}</div>${pr.badge ? `<span class="xb">${esc(pr.badge)}</span>` : ''}</span>
      <span class="xgo">${svg('chev', 20)}</span>
    </button>`;
  };

  SCREENS.success = () => {
    const t = S.txn, p = P(), xs = xsellList();
    return `
    <div class="scr fade">
      <div class="body">
        <div class="succ-hero">
          <div class="succ-check">${svg('check', 38, 3.2)}</div>
          <div class="succ-t">Chuyển tiền thành công</div>
          <div class="succ-a">${vnd(t.amount)}</div>
          <div class="succ-d">${tstr(t.time)} · ${dstr(t.time)}</div>
        </div>
        <div class="pad" style="padding-top:0">
          <div class="card receipt">
            <div class="rows">
              <div class="r"><span>Người nhận</span><span>${esc(t.name)}<span class="sub">${esc(t.account)} · ${esc(t.bank)}</span></span></div>
              <div class="r"><span>Nội dung</span><span>${esc(t.note || '—')}</span></div>
              <div class="r"><span>Mã giao dịch</span><span>${t.code}</span></div>
              <div class="r"><span>Số dư còn lại</span><span>${vnd(S.balance)}</span></div>
            </div>
            ${t.policy ? `
            <button class="policy-ok" data-act="viewPolicy" data-no="${t.policy.no}" style="width:100%;text-align:left">
              <span class="pk">${svg('shield', 20)}</span>
              <span style="flex:1"><b>Đã kích hoạt ${esc(prod(t.policy.productId).name)}</b><span>Số HĐ ${t.policy.no} · Hiệu lực đến ${dstr(t.policy.end)}</span></span>
              <span style="color:#047857">${svg('chev', 18)}</span>
            </button>` : ''}
          </div>
          ${xs.length ? `
          <div class="xsell">
            <div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Dành riêng cho ${esc(p.customer.greetName || p.customer.name.split(' ').slice(-1)[0])}</div>
            ${xs.map(id => xsCard(id, 'Màn thành công')).join('')}
          </div>` : ''}
          <div class="btn-row" style="margin-top:14px">
            <button class="btn soft" data-act="toast" data-msg="Đã lưu ảnh biên lai">${svg('share', 18)} Chia sẻ</button>
            <button class="btn outline" data-act="newTransfer">Giao dịch mới</button>
          </div>
        </div>
      </div>
      <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
    </div>`;
  };

  SCREENS.product = () => {
    const pr = prod(S.product), c = P().customer, plan = pr.plans[S.plan];
    return `
    <div class="scr">
      <div class="body">
        <div class="prod-hero" style="background:${shade(pr.color)}">
          <button class="nav-btn" data-act="back">${svg('back', 24, 2.4)}</button>
          <div class="pic">${svg(pr.icon, 30)}</div>
          <h2>${esc(pr.name)}</h2>
          <p>${esc(pr.tagline)}</p>
          <span class="prov">${svg('shield', 13)} ${esc(INS().provider)} · ${esc(INS().distributorNote || '')}</span>
        </div>
        <div class="prod-body" style="--c:${pr.color}">
          <div class="card">
            <div class="lbl" style="margin-bottom:10px">Chọn gói bảo hiểm</div>
            <div class="plans">
              ${pr.plans.map((pl, i) => `
                <button class="plan ${i === S.plan ? 'on' : ''}" data-act="pickPlan" data-i="${i}">
                  <span class="rd"></span>
                  <span><div class="pn">${esc(pl.name)}</div><div class="pc">Quyền lợi đến ${vnd(pl.coverage)}</div></span>
                  <span class="pp">${fmt(pl.premium)}đ<small>${pl.term >= 365 ? '/ năm' : `/ ${pl.term} ngày`}</small></span>
                </button>`).join('')}
            </div>
          </div>
          <div class="card">
            <div class="lbl">Quyền lợi chính</div>
            <ul class="benefits">${pr.benefits.map(b => `<li>${svg('check', 18, 2.6)}<span>${esc(b)}</span></li>`).join('')}</ul>
          </div>
          <div class="card">
            <div class="autofill">${svg('wand', 16)} Tự động điền từ hồ sơ ngân hàng – không cần nhập lại</div>
            <div class="rows">
              <div class="r"><span>Người được bảo hiểm</span><span>${esc(c.name)}</span></div>
              <div class="r"><span>Ngày sinh</span><span>${esc(c.dob || '')}</span></div>
              <div class="r"><span>CCCD</span><span>${esc(c.idNumber || '')}</span></div>
              <div class="r"><span>Số điện thoại</span><span>${esc(c.phone || '')}</span></div>
              <div class="r"><span>Thời hạn</span><span>${plan.term} ngày, từ hôm nay</span></div>
            </div>
          </div>
          <button class="consent ${S.consent ? 'on' : ''}" data-act="consent">
            <span class="cb">${S.consent ? svg('check', 14, 3.4) : ''}</span>
            <span>Tôi đã đọc và đồng ý với <a>Quy tắc bảo hiểm</a>, <a>Điều khoản sản phẩm</a> và đồng ý chia sẻ thông tin cho ${esc(INS().provider)}.</span>
          </button>
        </div>
      </div>
      <div class="footer">
        <div class="buybar">
          <div class="bp"><small>Phí bảo hiểm</small><b>${fmt(plan.premium)}đ</b></div>
          <button class="btn primary" data-act="buy" ${S.consent ? '' : 'disabled'}>Mua ngay</button>
        </div>
      </div>
    </div>`;
  };

  SCREENS.policy = () => {
    const pol = S.viewPolicy, pr = prod(pol.productId), plan = pr.plans[pol.planIdx], c = P().customer;
    return `
    <div class="scr ${S.policyFresh ? 'fade' : ''}">
      ${S.policyFresh ? `
      <div class="succ-hero" style="padding-bottom:30px">
        <div class="succ-check">${svg('check', 38, 3.2)}</div>
        <div class="succ-t">Mua bảo hiểm thành công</div>
        <div class="succ-d">Giấy chứng nhận điện tử đã được gửi tới email & SMS của bạn</div>
      </div>` : nav('Giấy chứng nhận bảo hiểm')}
      <div class="body pad">
        <div class="cert" style="background:${shade(pr.color)}">
          <div class="ch"><span>Giấy chứng nhận bảo hiểm</span>${svg(pr.icon, 22)}</div>
          <div class="cn">${esc(pr.name)}</div>
          <div class="cno">Số: ${pol.no}</div>
          <div class="cg">
            <div>Người được BH<b>${esc(c.name)}</b></div>
            <div>Gói<b>${esc(plan.name)}</b></div>
            <div>Quyền lợi tối đa<b>${vnd(plan.coverage)}</b></div>
            <div>Phí đã thanh toán<b>${vnd(plan.premium)}</b></div>
            <div>Hiệu lực từ<b>${dstr(pol.start)}</b></div>
            <div>Đến<b>${dstr(pol.end)}</b></div>
          </div>
        </div>
        <div class="card" style="margin-top:12px">
          <div class="rows">
            <div class="r"><span>Nhà bảo hiểm</span><span>${esc(INS().provider)}</span></div>
            <div class="r"><span>Kênh mua</span><span>${esc(P().appName)} · ${esc(pol.src)}</span></div>
            <div class="r"><span>Hotline bồi thường</span><span>1900 xxxx (24/7)</span></div>
          </div>
        </div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn soft" data-act="toast" data-msg="Đã tải Giấy chứng nhận (PDF)">${svg('file', 18)} Tải GCN</button>
          <button class="btn outline" data-act="myPolicies">Bảo hiểm của tôi</button>
        </div>
      </div>
      <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
    </div>`;
  };

  SCREENS.hub = () => {
    const ins = INS(), mine = S.hubTab !== 'shop', now = Date.now();
    const totalCover = S.policies.reduce((t, pol) => t + prod(pol.productId).plans[pol.planIdx].coverage, 0);
    const polCard = pol => {
      const pr = prod(pol.productId), plan = pr.plans[pol.planIdx];
      const left = Math.max(0, Math.ceil((pol.end - now) / 86400000));
      const used = Math.min(100, Math.max(2, Math.round((now - pol.start) / (pol.end - pol.start) * 100)));
      const claim = S.claims.find(c => c.policyNo === pol.no);
      return `
      <div class="mp" style="--c:${pr.color}">
        <div class="mp-h">
          <span class="mp-i">${svg(pr.icon, 22)}</span>
          <span class="mp-t"><b>${esc(pr.name)}</b><small>Gói ${esc(plan.name)} · ${esc(ins.provider)}</small></span>
          <span class="mp-st">Đang hiệu lực</span>
        </div>
        <div class="mp-g">
          <div><small>Số hợp đồng</small><b>${pol.no}</b></div>
          <div><small>Quyền lợi tối đa</small><b>${vnd(plan.coverage)}</b></div>
          <div><small>Hiệu lực</small><b>${dstr(pol.start)} – ${dstr(pol.end)}</b></div>
          <div><small>Phí đã đóng</small><b>${vnd(pol.premium)}</b></div>
        </div>
        <div class="mp-bar"><i style="width:${used}%"></i></div>
        <div class="mp-left">Còn ${left} ngày bảo vệ</div>
        ${claim ? `<div class="mp-claim">${svg('clock', 16)}<span>Yêu cầu bồi thường <b>${claim.no}</b> đang được xử lý, dự kiến phản hồi trong 5 ngày làm việc.</span></div>` : ''}
        <div class="mp-act">
          <button data-act="viewPolicy" data-no="${pol.no}">${svg('file', 17)} Giấy chứng nhận</button>
          <button data-act="claim" data-no="${pol.no}" ${claim ? 'disabled' : ''}>${svg('shield', 17)} Yêu cầu bồi thường</button>
        </div>
      </div>`;
    };
    return `
    <div class="scr">
      ${nav('Bảo hiểm')}
      <div class="body pad">
        <div class="seg" style="margin-top:0">
          <button class="${mine ? 'on' : ''}" data-act="hubTab" data-tab="mine">Bảo hiểm của tôi${S.policies.length ? ` (${S.policies.length})` : ''}</button>
          <button class="${mine ? '' : 'on'}" data-act="hubTab" data-tab="shop">Sản phẩm</button>
        </div>
        ${mine ? (S.policies.length ? `
        <div class="mp-sum">
          <span class="ms-i">${svg('shield', 26)}</span>
          <div><small>Bạn đang được bảo vệ</small><b>${S.policies.length} hợp đồng đang hiệu lực</b></div>
          <div class="ms-r"><small>Tổng quyền lợi</small><b>${vnd(totalCover)}</b></div>
        </div>
        ${S.policies.slice().reverse().map(polCard).join('')}
        <button class="mp-more" data-act="hubTab" data-tab="shop">${svg('spark', 16)} Xem thêm sản phẩm bảo hiểm</button>` : `
        <div class="mp-empty">
          <span>${svg('shield', 40, 1.6)}</span>
          <b>Bạn chưa có hợp đồng bảo hiểm</b>
          <p>Hợp đồng mua trong ứng dụng sẽ hiện ở đây, kèm giấy chứng nhận điện tử và yêu cầu bồi thường trực tuyến.</p>
          <button class="btn primary" data-act="hubTab" data-tab="shop">Khám phá sản phẩm</button>
        </div>`) : `
        <div class="xsell" style="margin-top:0">
          ${Object.keys(ins.products).map(id => xsCard(id, 'Mục Bảo hiểm')).join('')}
        </div>`}
        <button class="mp-help" data-act="toast" data-msg="Tổng đài chỉ minh họa trong bản demo">${svg('phone', 18)}<span>Cần hỗ trợ bồi thường?<small>Gọi tổng đài 1900 xxxx (24/7)</small></span>${svg('chev', 18)}</button>
        <div style="font-size:11px;color:var(--muted);text-align:center;margin-top:12px">Sản phẩm được cung cấp bởi ${esc(ins.provider)}</div>
      </div>
    </div>`;
  };

  /* ---------------- actions ---------------- */
  const A = {
    back, home: goHome,
    go: d => go(d.to),
    toast: d => toast(d.msg || 'Tính năng chỉ minh họa trong bản demo'),
    closeSheet,
    toggleBal: () => { S.hide = !S.hide; render(true); },

    pickContact: d => {
      const c = P().contacts[+d.i];
      clearTimeout(lookTimer);
      Object.assign(S.form, { bank: c.bank, account: c.account, name: c.name, looking: false, contact: +d.i });
      render(true);
    },
    pickBank: () => {
      const list = q => P().banks.filter(b => (b.code + ' ' + b.name).toLowerCase().includes(q.toLowerCase()))
        .map(b => `<button class="bank-it" data-act="setBank" data-code="${b.code}"><span class="bl">${esc(b.code)}</span><span class="bn">${esc(b.name)}</span></button>`).join('');
      openSheet('Chọn ngân hàng nhận', `<div class="search">${svg('search', 18)}<input id="bankQ" placeholder="Tìm ngân hàng"></div><div id="bankList">${list('')}</div>`, () => {
        $('#bankQ').addEventListener('input', e => { $('#bankList').innerHTML = list(e.target.value); });
      });
    },
    setBank: d => {
      S.form.bank = d.code; S.form.contact = -1;
      closeSheet();
      const v = $('#bankVal');
      v.classList.remove('ph');
      v.innerHTML = `${esc(bankName(d.code))} ${svg('chevDown', 18)}`;
      document.querySelectorAll('.ct.sel').forEach(el => el.classList.remove('sel'));
      lookup();
      $('#fAcc').focus();
    },
    chip: d => {
      S.form.amount = +d.v;
      $('#fAmt').value = fmt(+d.v);
      updateAmount();
    },
    toConfirm: () => {
      const c = INS().placements.confirm;
      S.addon = !!(c && c.defaultChecked);
      go('confirm');
    },
    toggleAddon: () => {
      const o = confirmOffer(); if (!o) return;
      S.addon = !S.addon;
      log(S.addon ? 'opt' : 'opt', `${S.addon ? 'Chọn' : 'Bỏ chọn'} "${o.pr.short}" – Màn xác nhận`);
      render(true);
    },
    addonInfo: () => {
      const o = confirmOffer(); if (!o) return;
      openSheet(o.pr.name, `
        <div style="font-size:13px;color:var(--muted);margin-bottom:10px">${esc(o.pr.tagline)}</div>
        <div class="card" style="background:var(--soft)"><div class="rows">
          <div class="r"><span>Quyền lợi tối đa</span><span>${vnd(o.plan.coverage)}</span></div>
          <div class="r"><span>Thời hạn</span><span>${o.plan.term} ngày</span></div>
          <div class="r"><span>Phí bảo hiểm</span><span>${vnd(o.plan.premium)}</span></div>
        </div></div>
        <ul class="benefits" style="margin:10px 0 14px">${o.pr.benefits.map(b => `<li>${svg('check', 18, 2.6)}<span>${esc(b)}</span></li>`).join('')}</ul>
        <button class="btn primary" data-act="addonYes">${S.addon ? 'Đã thêm vào giao dịch' : `Thêm vào giao dịch · ${fmt(o.plan.premium)}đ`}</button>
        <div style="font-size:10.5px;color:var(--muted);text-align:center;margin-top:10px">Cung cấp bởi ${esc(INS().provider)}. Bằng việc chọn, bạn đồng ý với Quy tắc bảo hiểm.</div>`);
      log('view', `Xem chi tiết "${o.pr.short}" – Màn xác nhận`);
    },
    addonYes: () => {
      if (!S.addon) { S.addon = true; log('opt', `Chọn "${confirmOffer().pr.short}" – Màn xác nhận`); }
      render(true);
    },
    doConfirm: () => { S.otpFor = 'transfer'; S.pin = ''; go('otp'); },
    key: d => pressKey(d.k),

    newTransfer: () => { S.form = blankForm(P()); S.stack = ['home']; S.screen = 'transfer'; render(); },
    openProduct: d => {
      S.product = d.id; S.plan = 0; S.consent = false; S.productSrc = d.src || '';
      log('click', `Mở "${prod(d.id).short}" – ${d.src}`);
      go('product');
    },
    pickPlan: d => { S.plan = +d.i; render(true); },
    consent: () => { S.consent = !S.consent; render(true); },
    buy: () => {
      if (!S.consent) return;
      if (prod(S.product).plans[S.plan].premium > S.balance) { toast('Số dư không đủ'); return; }
      S.otpFor = 'insurance'; S.pin = ''; go('otp');
    },
    hubTab: d => { S.hubTab = d.tab; render(true); },
    myPolicies: () => { S.hubTab = 'mine'; go('hub'); },
    claim: d => {
      const pol = S.policies.find(x => x.no === d.no); if (!pol) return;
      const pr = prod(pol.productId);
      const reasons = ['Bị lừa đảo, mất tiền', 'Tai nạn', 'Ốm đau, nằm viện', 'Lý do khác'];
      openSheet('Yêu cầu bồi thường', `
        <div class="card" style="background:var(--soft)"><div class="rows">
          <div class="r"><span>Sản phẩm</span><span>${esc(pr.name)}</span></div>
          <div class="r"><span>Số hợp đồng</span><span>${pol.no}</span></div>
          <div class="r"><span>Người được bảo hiểm</span><span>${esc(P().customer.name)}</span></div>
        </div></div>
        <div class="lbl" style="margin-top:14px">Sự kiện bảo hiểm</div>
        <div class="chips" id="claimReasons">${reasons.map((r, i) => `<button class="chip ${i ? '' : 'sel'}" data-act="claimReason">${r}</button>`).join('')}</div>
        <div class="field"><label for="claimNote">Mô tả ngắn</label><textarea id="claimNote" rows="2" placeholder="Thời gian, địa điểm, diễn biến"></textarea></div>
        <button class="field" data-act="toast" data-msg="Tải chứng từ chỉ minh họa trong bản demo"><span class="fl">Chứng từ</span><span class="fv ph">Chụp hoặc tải ảnh hóa đơn, biên bản ${svg('chev', 18)}</span></button>
        <button class="btn primary" data-act="claimSend" data-no="${pol.no}">Gửi yêu cầu</button>`);
    },
    claimReason: (d, el) => {
      el.parentNode.querySelectorAll('.chip').forEach(c => c.classList.toggle('sel', c === el));
    },
    claimSend: d => {
      const pol = S.policies.find(x => x.no === d.no);
      const c = { no: 'BT' + rnd(8), policyNo: d.no, time: new Date() };
      S.claims.push(c);
      log('claim', `Gửi yêu cầu bồi thường ${c.no} – "${prod(pol.productId).short}"`);
      render(true);
      toast('Đã gửi yêu cầu bồi thường');
    },
    viewPolicy: d => {
      S.viewPolicy = S.policies.find(x => x.no === d.no); S.policyFresh = false;
      go('policy');
    }
  };

  /* ---------------- skin riêng theo đối tác ----------------
   * Profile khai báo `skin: '<tên>'`; file js/skin-<tên>.js đăng ký window.SKINS[<tên>] = kit => ({ screens, bind, actions, status }).
   * Màn hình nào skin không định nghĩa thì dùng màn hình chung ở trên. */
  const KIT = {
    get S() { return S; }, P, INS, prod, svg, ICONS, esc, fmt, vnd, readVN, dstr, tstr, initials, shade, bankName, owns,
    confirmOffer, xsCard, go, back, goHome, render, toast, openSheet, closeSheet, log, processing, lookup, SCREENS, BIND, A
  };
  const SKINS = {};
  Object.entries(window.SKINS || {}).forEach(([k, make]) => { SKINS[k] = make(KIT); });
  function skin() { return SKINS[P().skin] || {}; }

  screenEl.addEventListener('click', e => {
    if (!notifyParent.touched) { notifyParent.touched = true; notifyParent({ interact: true }); }
    if (e.target === backdrop) { closeSheet(); return; }
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = (skin().actions || {})[el.dataset.act] || A[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el.dataset, el); }
  });

  /* ---------------- presenter panel ---------------- */
  const STEPS = [
    { k: 'home', t: 'Trang chủ ngân hàng', tag: 'Banner' },
    { k: 'transfer', t: 'Nhập thông tin chuyển tiền' },
    { k: 'confirm', t: 'Xác nhận giao dịch', tag: 'Opt-in' },
    { k: 'otp', t: 'Xác thực Smart OTP' },
    { k: 'success', t: 'Thành công', tag: 'Cross-sell' },
    { k: 'product', t: 'Xem & mua bảo hiểm', tag: 'Mua 1 chạm' },
    { k: 'policy', t: 'Nhận GCN điện tử' }
  ];
  function stepIndex() {
    if (S.screen === 'otp' && S.otpFor === 'insurance') return 5;
    const i = STEPS.findIndex(s => s.k === S.screen);
    return i;
  }
  function renderSteps() {
    const cur = stepIndex();
    if (cur >= 0) renderSteps.last = cur;
    const c = renderSteps.last || 0;
    $('#steps').innerHTML = STEPS.map((s, i) =>
      `<li class="${i === c ? 'active' : i < c ? 'done' : ''}">${s.t}${s.tag ? `<span class="tag">${s.tag}</span>` : ''}</li>`).join('');
  }
  function renderLog() {
    const el = $('#eventLog');
    if (!logs.length) { el.innerHTML = '<span class="empty">Các lượt hiển thị / chọn / mua bảo hiểm sẽ hiện ở đây.</span>'; return; }
    el.innerHTML = logs.map(l => `<div><span class="t">${tstr(l.t).slice(0, 5)}</span><span class="ev ${l.type === 'buy' ? 'buy' : ''}">${esc(l.msg)}</span></div>`).join('');
    el.scrollTop = el.scrollHeight;
  }
  function renderPanel() {
    const p = P(), ins = INS();
    $('#partnerMeta').innerHTML = `<b>${esc(p.name)}</b><br>App: ${esc(p.appName)} · Nhà BH: ${esc(ins.provider)}<br>${Object.keys(ins.products).length} sản phẩm bảo hiểm`;
    const T = [
      ['home', 'Trang chủ', 'Banner sản phẩm'],
      ['confirm', 'Màn xác nhận', 'Thêm BH vào giao dịch'],
      ['success', 'Màn thành công', 'Gợi ý sau giao dịch']
    ];
    $('#placementToggles').innerHTML = T.map(([k, t, s]) => {
      const has = !!ins.placements[k];
      return `<label class="p-toggle" style="${has ? '' : 'opacity:.4'}"><span>${t}<small>${s}${has ? '' : ' (profile chưa cấu hình)'}</small></span><input type="checkbox" data-k="${k}" ${S.on[k] ? 'checked' : ''} ${has ? '' : 'disabled'}></label>`;
    }).join('');
  }
  $('#placementToggles').addEventListener('change', e => {
    const k = e.target.dataset.k; if (!k) return;
    S.on[k] = e.target.checked;
    render(true);
  });

  function applyTheme() {
    const t = P().theme || {};
    const set = (k, v) => v && screenEl.style.setProperty(k, v);
    set('--p', t.primary); set('--pd', t.primaryDark); set('--ac', t.accent); set('--soft', t.soft);
    set('--hero', t.hero || t.primary);
    screenEl.dataset.skin = P().skin || '';
    document.title = `${P().appName} · Embedded Insurance Demo`;
    $('#demoNote').textContent = `BẢN DEMO minh họa – không phải ứng dụng chính thức của ${P().name.split(' – ')[0]}`;
  }

  function loadProfile(pid) {
    if (!PROFILES[pid]) pid = PROFILE_IDS[0];
    S = freshState(pid);
    logs = []; renderSteps.last = 0;
    store.set('ei-demo-partner', pid);
    const url = new URL(location.href); url.searchParams.set('partner', pid); history.replaceState(null, '', url);
    $('#partnerSelect').value = pid;
    applyTheme(); renderPanel(); renderLog(); render();
  }

  /* ---------------- device scaling & chrome ---------------- */
  const phone = $('#phone'), wrap = $('#deviceWrap');
  function fit() {
    if (EMBED) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const native = vw < 600 || vh < 520;
    document.body.classList.toggle('native', native);
    document.body.classList.toggle('drawer', native || vw < 960);
    if (!document.body.classList.contains('drawer')) setPanel(false);
    if (native) { phone.style.transform = ''; wrap.style.width = ''; wrap.style.height = ''; return; }
    const area = $('.device-area');
    const W = 418, H = 872;
    const s = Math.min((area.clientWidth - 40) / W, (area.clientHeight - 90) / H, 1.2);
    phone.style.transform = `scale(${s})`;
    wrap.style.width = W * s + 'px';
    wrap.style.height = H * s + 'px';
  }
  function clock() { const d = new Date(); $('#clock').textContent = `${d.getHours()}:${pad2(d.getMinutes())}`; }

  /* ---------------- init ---------------- */
  if (!PROFILE_IDS.length) {
    app.innerHTML = '<div style="padding:80px 24px;text-align:center">Chưa có profile nào trong thư mục profiles/</div>';
    return;
  }
  $('#partnerSelect').innerHTML = PROFILE_IDS.map(id => `<option value="${id}">${esc(PROFILES[id].name)}</option>`).join('');
  $('#partnerSelect').addEventListener('change', e => loadProfile(e.target.value));
  $('#btnReset').addEventListener('click', () => loadProfile(S.pid));
  $('#clearLog').addEventListener('click', () => { logs = []; renderLog(); });
  const togglePresent = () => { document.body.classList.toggle('present'); setTimeout(fit, 320); };
  $('#btnPresent').addEventListener('click', togglePresent);
  function setPanel(open) { document.body.classList.toggle('panel-open', open); }
  $('#btnPanel').addEventListener('click', () => setPanel(true));
  $('#btnPanelClose').addEventListener('click', () => setPanel(false));
  $('#panelScrim').addEventListener('click', () => setPanel(false));
  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (S.screen === 'otp' && !typing) {
      if (/^\d$/.test(e.key)) return pressKey(e.key);
      if (e.key === 'Backspace') return pressKey('del');
    }
    if (typing) return;
    if (e.key === 'p' || e.key === 'P') togglePresent();
    if (e.key === 'Escape') closeSheet();
  });
  window.addEventListener('resize', fit);

  const qp = new URLSearchParams(location.search).get('partner');
  loadProfile(qp || store.get('ei-demo-partner') || PROFILE_IDS[0]);
  fit(); clock(); setInterval(clock, 15000);
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));
})();

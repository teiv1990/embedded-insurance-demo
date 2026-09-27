/*
 * DemoKit – khung dùng chung cho app demo ví điện tử & TMĐT.
 * Script thường (không module) để mở được trực tiếp bằng file://.
 * Giao thức nhúng giống app ngân hàng: ?embed=1 + postMessage({ type: 'insurex-demo', screen | interact }).
 */
(function () {
  'use strict';

  const ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
    bell: '<path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    spark: '<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>',
    file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    wand: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    del: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 001-1V6a1 1 0 00-1-1z"/><path d="M17 9l-5 6M12 9l5 6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    wallet: '<path d="M4 6h14a2 2 0 012 2v10a2 2 0 01-2 2H4z"/><path d="M4 6V5a1 1 0 011-1h11M16 13h.01"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21h.01M17 21h4v-4"/>',
    ticket: '<path d="M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4z"/><path d="M14 7v10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M7.5 8a2.5 2.5 0 010-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 010 5"/>',
    cart: '<path d="M3 4h2.2l2.3 11h10.8l2.2-8H6.2"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    house: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  };
  const svg = (n, s = 22, sw = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;
  const fmt = (n) => Math.round(n || 0).toLocaleString('vi-VN');
  const vnd = (n) => `${fmt(n)}đ`;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = (n) => String(n).padStart(2, '0');
  const dstr = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  const tstr = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  const rnd = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
  const shade = (c) => `linear-gradient(150deg, ${c} 0%, color-mix(in srgb, ${c} 62%, #000) 100%)`;
  const termText = (d) => (d >= 365 ? `${Math.round(d / 365)} năm` : `${d} ngày`);

  function createApp(cfg) {
    const $ = (s, r = document) => r.querySelector(s);
    const app = $('#app');
    const sheet = $('#sheet');
    const backdrop = $('#sheetBackdrop');
    const screenEl = $('#screen');
    const EMBED = new URLSearchParams(location.search).get('embed') === '1';
    if (EMBED) document.body.classList.add('embed');

    function notify(msg) {
      if (!EMBED || window.parent === window) return;
      try { window.parent.postMessage({ type: 'insurex-demo', ...msg }, location.origin); } catch (e) { /* trang cha khác origin */ }
    }

    const S = Object.assign({
      screen: cfg.start, stack: [], policies: [], product: null, plan: 0, consent: false,
      productSrc: '', viewPolicy: null, policyFresh: false, pin: '', pinFor: 'payment',
    }, cfg.state());

    const prod = (id) => cfg.products[id];
    const owns = (id) => S.policies.some((p) => p.productId === id);

    function go(s) { S.stack.push(S.screen); S.screen = s; render(); }
    function back() { S.screen = S.stack.pop() || cfg.start; render(); }
    function home() { S.stack = []; S.screen = cfg.start; render(); }

    function toast(msg) {
      const t = $('#toast');
      t.textContent = msg;
      t.classList.add('on');
      clearTimeout(toast.timer);
      toast.timer = setTimeout(() => t.classList.remove('on'), 1800);
    }
    function openSheet(title, html) {
      sheet.innerHTML = `<div class="sh-grab"></div><div class="sh-h"><span>${esc(title)}</span><button data-act="closeSheet" style="color:var(--muted)">${svg('x', 22)}</button></div><div class="sh-b">${html}</div>`;
      sheet.classList.add('on');
      backdrop.classList.add('on');
    }
    function closeSheet() { sheet.classList.remove('on'); backdrop.classList.remove('on'); }

    const nav = (title) => `<div class="nav"><button class="nav-btn" data-act="back">${svg('back', 24, 2.4)}</button><div class="nav-title">${esc(title)}</div><button class="nav-btn" data-act="home">${svg('home', 22)}</button></div>`;

    function createPolicy(productId, planIdx, src) {
      const pr = prod(productId);
      const plan = pr.plans[planIdx];
      const start = new Date();
      const end = new Date(start.getTime() + plan.term * 86400000);
      const pol = { productId, planIdx, no: `IX${start.getFullYear()}-${rnd(8)}`, start, end, src, premium: plan.premium };
      S.policies.push(pol);
      return pol;
    }

    /* Gợi ý bảo hiểm opt-in: không chọn sẵn, bỏ chọn 1 chạm, xem đủ điều khoản */
    function offer(id, on, act, planIdx = 0) {
      const pr = prod(id);
      const plan = pr.plans[planIdx];
      return `
        <div class="offer ${on ? 'on' : ''}">
          <span class="ob">${on ? '✓ Đã chọn' : 'Đề xuất cho bạn'}</span>
          <div class="oh" data-act="${act}" style="cursor:pointer">
            <span class="oi" style="background:${pr.color}">${svg(pr.icon, 22)}</span>
            <div><div class="ot">${esc(pr.name)}</div><div class="od">${esc(pr.offerText || pr.tagline)} – quyền lợi đến <b>${vnd(plan.coverage)}</b>.</div></div>
          </div>
          <div class="of"><div class="op">Phí chỉ <b>${vnd(plan.premium)}</b> / ${termText(plan.term)}</div><button class="sw ${on ? 'on' : ''}" data-act="${act}" aria-label="Thêm ${esc(pr.short)}"></button></div>
          <button class="more" data-act="terms" data-id="${id}" data-plan="${planIdx}">Xem quyền lợi &amp; điều khoản</button>
          <div class="prov">${esc(cfg.provider)} · phân phối qua InsureX · bỏ chọn bất cứ lúc nào trước khi thanh toán</div>
        </div>`;
    }

    const xsCard = (id, src) => {
      const pr = prod(id);
      return `<button class="xs-card" style="--c:${pr.color}" data-act="openProduct" data-id="${id}" data-src="${esc(src)}"><span class="xi">${svg(pr.icon, 24)}</span><span style="flex:1"><div class="xt">${esc(pr.name)}</div><div class="xd">${esc(pr.tagline)}</div>${pr.badge ? `<span class="xb">${esc(pr.badge)}</span>` : ''}</span><span class="xgo">${svg('chev', 20)}</span></button>`;
    };

    const policyRow = (pol) => `<button class="policy-ok" data-act="viewPolicy" data-no="${pol.no}" style="width:100%;text-align:left"><span class="pk">${svg('shield', 20)}</span><span style="flex:1"><b>Đã kích hoạt ${esc(prod(pol.productId).name)}</b><span>Số HĐ ${pol.no} · Hiệu lực đến ${dstr(pol.end)}</span></span><span style="color:#047857">${svg('chev', 18)}</span></button>`;

    const SCREENS = {
      pin: () => `
        <div class="scr">
          ${nav('Xác thực thanh toán')}
          <div class="otp-wrap">
            <div class="otp-ic">${svg('lock', 34)}</div>
            <div class="otp-t">Nhập mã PIN ${esc(cfg.appName)}</div>
            <div class="otp-s">${S.pinFor === 'insurance' ? 'Thanh toán phí bảo hiểm' : 'Xác thực thanh toán'}<br><b style="color:var(--text)">${vnd(S.pinFor === 'insurance' ? prod(S.product).plans[S.plan].premium : cfg.payAmount(ctx))}</b></div>
            <div class="dots" id="dots">${'<i></i>'.repeat(6)}</div>
            <div class="otp-hint">Demo: nhập 6 số bất kỳ</div>
          </div>
          <div class="keypad">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<button class="key" data-act="key" data-k="${k}">${k}</button>`).join('')}
            <button class="key fn" data-act="toast" data-msg="Chức năng chỉ minh họa">Quên PIN</button>
            <button class="key" data-act="key" data-k="0">0</button>
            <button class="key fn" data-act="key" data-k="del">${svg('del', 26, 1.8)}</button>
          </div>
        </div>`,

      product: () => {
        const pr = prod(S.product);
        const plan = pr.plans[S.plan];
        const c = cfg.customer;
        return `
        <div class="scr">
          <div class="body">
            <div class="prod-hero" style="background:${shade(pr.color)}">
              <button class="nav-btn" data-act="back">${svg('back', 24, 2.4)}</button>
              <div class="pic">${svg(pr.icon, 30)}</div>
              <h2>${esc(pr.name)}</h2>
              <p>${esc(pr.tagline)}</p>
              <span class="prov">${svg('shield', 13)} ${esc(cfg.provider)} · qua InsureX</span>
            </div>
            <div class="prod-body" style="--c:${pr.color}">
              <div class="card">
                <div class="lbl" style="margin-bottom:10px">Chọn gói bảo hiểm</div>
                <div class="plans">
                  ${pr.plans.map((pl, i) => `
                    <button class="plan ${i === S.plan ? 'on' : ''}" data-act="pickPlan" data-i="${i}">
                      <span class="rd"></span>
                      <span><div class="pn">${esc(pl.name)}</div><div class="pc">Quyền lợi đến ${vnd(pl.coverage)}</div></span>
                      <span class="pp">${fmt(pl.premium)}đ<small>/ ${termText(pl.term)}</small></span>
                    </button>`).join('')}
                </div>
              </div>
              <div class="card">
                <div class="lbl">Quyền lợi chính</div>
                <ul class="benefits">${pr.benefits.map((b) => `<li>${svg('check', 18, 2.6)}<span>${esc(b)}</span></li>`).join('')}</ul>
              </div>
              <div class="card">
                <div class="autofill">${svg('wand', 16)} ${esc(cfg.autofillText)}</div>
                <div class="rows">
                  <div class="r"><span>Người được bảo hiểm</span><span>${esc(c.name)}</span></div>
                  <div class="r"><span>Ngày sinh</span><span>${esc(c.dob)}</span></div>
                  <div class="r"><span>Số điện thoại</span><span>${esc(c.phone)}</span></div>
                  <div class="r"><span>Thời hạn</span><span>${termText(plan.term)}, từ hôm nay</span></div>
                </div>
              </div>
              <button class="consent ${S.consent ? 'on' : ''}" data-act="consent">
                <span class="cb">${S.consent ? svg('check', 14, 3.4) : ''}</span>
                <span>Tôi đã đọc và đồng ý với <a data-act="terms" data-id="${S.product}" data-plan="${S.plan}">Quy tắc bảo hiểm và điều khoản</a>, đồng ý chia sẻ thông tin cần thiết cho doanh nghiệp bảo hiểm.</span>
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
      },

      policy: () => {
        const pol = S.viewPolicy;
        const pr = prod(pol.productId);
        const plan = pr.plans[pol.planIdx];
        return `
        <div class="scr ${S.policyFresh ? 'fade' : ''}">
          ${S.policyFresh ? `
          <div class="succ-hero" style="padding-bottom:30px">
            <div class="succ-check">${svg('check', 38, 3.2)}</div>
            <div class="succ-t">Mua bảo hiểm thành công</div>
            <div class="succ-d">Giấy chứng nhận điện tử đã được lưu trong mục Bảo hiểm của tôi</div>
          </div>` : nav('Giấy chứng nhận bảo hiểm')}
          <div class="body pad">
            <div class="cert" style="background:${shade(pr.color)}">
              <div class="ch"><span>Giấy chứng nhận bảo hiểm</span>${svg(pr.icon, 22)}</div>
              <div class="cn">${esc(pr.name)}</div>
              <div class="cno">Số: ${pol.no}</div>
              <div class="cg">
                <div>Người được BH<b>${esc(cfg.customer.name)}</b></div>
                <div>Gói<b>${esc(plan.name)}</b></div>
                <div>Quyền lợi tối đa<b>${vnd(plan.coverage)}</b></div>
                <div>Phí đã thanh toán<b>${vnd(plan.premium)}</b></div>
                <div>Hiệu lực từ<b>${dstr(pol.start)}</b></div>
                <div>Đến<b>${dstr(pol.end)}</b></div>
              </div>
            </div>
            <div class="card" style="margin-top:12px">
              <div class="rows">
                <div class="r"><span>Doanh nghiệp bảo hiểm</span><span>${esc(cfg.provider)}</span></div>
                <div class="r"><span>Kênh mua</span><span>${esc(cfg.appName)} · ${esc(pol.src)}</span></div>
                <div class="r"><span>Yêu cầu bồi thường</span><span>Ngay trong ${esc(cfg.appName)}</span></div>
              </div>
            </div>
            <div class="btn-row" style="margin-top:14px">
              <button class="btn soft" data-act="toast" data-msg="Đã tải Giấy chứng nhận (PDF)">${svg('file', 18)} Tải GCN</button>
              <button class="btn outline" data-act="go" data-to="hub">Bảo hiểm của tôi</button>
            </div>
          </div>
          <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
        </div>`;
      },

      hub: () => `
        <div class="scr">
          ${nav('Bảo hiểm của tôi')}
          <div class="body pad">
            <div class="card">
              <div class="lbl">Hợp đồng của tôi</div>
              ${S.policies.length ? S.policies.map((pol) => {
                const pr = prod(pol.productId);
                return `<button class="pol" data-act="viewPolicy" data-no="${pol.no}" style="width:100%;text-align:left">
                  <span class="pi" style="background:${pr.color}">${svg(pr.icon, 20)}</span>
                  <span><div class="pt">${esc(pr.name)}</div><div class="ps">${pol.no} · đến ${dstr(pol.end)}</div></span>
                  <span class="st">Hiệu lực</span>
                </button>`;
              }).join('') : '<div class="empty-s">Bạn chưa có hợp đồng bảo hiểm nào</div>'}
            </div>
            <div class="xsell">
              <div class="xs-h">Sản phẩm bảo hiểm</div>
              ${Object.keys(cfg.products).map((id) => xsCard(id, 'Bảo hiểm của tôi')).join('')}
            </div>
          </div>
        </div>`,
    };

    function processing(msg, done) {
      const root = app.firstElementChild;
      const el = document.createElement('div');
      el.className = 'proc';
      el.innerHTML = `<div class="ring"></div><p>${esc(msg)}</p>`;
      root.appendChild(el);
      setTimeout(done, 1200);
    }

    function finishPurchase() {
      const plan = prod(S.product).plans[S.plan];
      if (cfg.onInsurancePaid) cfg.onInsurancePaid(ctx, plan.premium);
      S.viewPolicy = createPolicy(S.product, S.plan, S.productSrc || cfg.appName);
      S.policyFresh = true;
      S.stack = [];
      S.screen = 'policy';
      render();
    }

    function pressKey(k) {
      if (S.pin.length >= 6 && k !== 'del') return;
      S.pin = k === 'del' ? S.pin.slice(0, -1) : S.pin + k;
      const dots = $('#dots');
      if (!dots) return;
      [...dots.children].forEach((d, i) => d.classList.toggle('f', i < S.pin.length));
      if (S.pin.length === 6) {
        const forIns = S.pinFor === 'insurance';
        setTimeout(() => processing(forIns ? 'Đang phát hành hợp đồng bảo hiểm…' : 'Đang xử lý thanh toán…', forIns ? finishPurchase : () => cfg.onPaid(ctx)), 180);
      }
    }

    const A = {
      back, home, closeSheet,
      go: (d) => go(d.to),
      toast: (d) => toast(d.msg || 'Tính năng chỉ minh họa trong bản demo'),
      key: (d) => pressKey(d.k),
      startPin: () => { S.pinFor = 'payment'; S.pin = ''; go('pin'); },
      terms: (d) => {
        const pr = prod(d.id);
        const plan = pr.plans[Number(d.plan) || 0];
        openSheet(pr.name, `
          <div style="font-size:13px;color:var(--muted);margin-bottom:10px">${esc(pr.tagline)}</div>
          <div class="card" style="background:var(--soft)"><div class="rows">
            <div class="r"><span>Quyền lợi tối đa</span><span>${vnd(plan.coverage)}</span></div>
            <div class="r"><span>Thời hạn</span><span>${termText(plan.term)}</span></div>
            <div class="r"><span>Phí bảo hiểm</span><span>${vnd(plan.premium)}</span></div>
          </div></div>
          <ul class="benefits" style="margin:10px 0 12px">${pr.benefits.map((b) => `<li>${svg('check', 18, 2.6)}<span>${esc(b)}</span></li>`).join('')}</ul>
          <div class="terms-note">Quy tắc bảo hiểm, điều khoản loại trừ và thời gian chờ được hiển thị đầy đủ trước khi thanh toán. Sản phẩm do ${esc(cfg.provider)} cung cấp và chịu trách nhiệm bồi thường; InsureX là đơn vị công nghệ phân phối.</div>`);
      },
      openProduct: (d) => { S.product = d.id; S.plan = 0; S.consent = false; S.productSrc = d.src || ''; go('product'); },
      pickPlan: (d) => { S.plan = Number(d.i); render(true); },
      consent: () => { S.consent = !S.consent; render(true); },
      buy: () => {
        if (!S.consent) return;
        if (cfg.insurancePay === 'pin') { S.pinFor = 'insurance'; S.pin = ''; go('pin'); }
        else processing('Đang thanh toán bằng phương thức đã lưu…', finishPurchase);
      },
      viewPolicy: (d) => { S.viewPolicy = S.policies.find((x) => x.no === d.no); S.policyFresh = false; go('policy'); },
    };

    const ctx = { S, $, svg, esc, fmt, vnd, dstr, tstr, rnd, shade, termText, nav, offer, xsCard, policyRow, go, back, home, render, toast, openSheet, closeSheet, prod, owns, createPolicy, processing, cfg };
    Object.assign(SCREENS, cfg.screens(ctx));
    Object.assign(A, cfg.actions(ctx));
    const BIND = cfg.bind ? cfg.bind(ctx) : {};

    function render(quiet) {
      closeSheet();
      const prevBody = $('.body', app);
      const scroll = quiet && prevBody ? prevBody.scrollTop : 0;
      app.innerHTML = SCREENS[S.screen]();
      const root = app.firstElementChild;
      if (quiet && root) {
        root.style.animation = 'none';
        const b = $('.body', app);
        if (b) b.scrollTop = scroll;
      }
      screenEl.style.setProperty('--sbg', S.screen === 'product' ? prod(S.product).color : 'var(--pd)');
      if (BIND[S.screen]) BIND[S.screen]();
      notify({ screen: S.screen });
    }

    screenEl.addEventListener('click', (e) => {
      if (!notify.touched) { notify.touched = true; notify({ interact: true }); }
      if (e.target === backdrop) { closeSheet(); return; }
      const el = e.target.closest('[data-act]');
      if (!el || el.disabled) return;
      const fn = A[el.dataset.act];
      if (fn) { e.preventDefault(); e.stopPropagation(); fn(el.dataset, el); }
    });
    document.addEventListener('keydown', (e) => {
      if (S.screen !== 'pin' || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      if (/^\d$/.test(e.key)) pressKey(e.key);
      if (e.key === 'Backspace') pressKey('del');
    });

    Object.entries(cfg.theme).forEach(([k, v]) => screenEl.style.setProperty(k, v));
    const phone = $('#phone');
    const wrap = $('#deviceWrap');
    function fit() {
      if (EMBED) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const native = vw < 600 || vh < 520;
      document.body.classList.toggle('native', native);
      if (native) { phone.style.transform = ''; wrap.style.width = ''; wrap.style.height = ''; return; }
      const W = 418;
      const H = 872;
      const s = Math.min((vw - 40) / W, (vh - 90) / H, 1.2);
      phone.style.transform = `scale(${s})`;
      wrap.style.width = `${W * s}px`;
      wrap.style.height = `${H * s}px`;
    }
    const clock = () => { $('#clock').textContent = tstr(new Date()); };
    window.addEventListener('resize', fit);
    fit();
    clock();
    setInterval(clock, 15000);
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));
    return ctx;
  }

  window.DemoKit = { createApp };
})();

/*
 * SKIN: Sacombank
 * Dựng lại bố cục app Sacombank Pay cho 4 màn: Trang chủ, Chuyển tiền, Xác nhận (bottom sheet), Xác thực.
 * Các màn còn lại (thành công, sản phẩm, GCN, mục Bảo hiểm) dùng màn hình chung, đổi kiểu qua css/skin-sacombank.css.
 */
(window.SKINS = window.SKINS || {}).sacombank = function (K) {
  const { P, INS, prod, svg, esc, fmt, vnd, bankName, initials, confirmOffer } = K;

  Object.assign(K.ICONS, {
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    swap: '<circle cx="12" cy="12" r="9"/><path d="M8 10h8l-2.5-2.5M16 14H8l2.5 2.5"/>',
    chart: '<path d="M4 20V12M9 20V8M14 20v-6"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M14 6l3-3 3 3M17 3v6"/>',
    otp: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><rect x="9.5" y="10" width="5" height="4" rx="1"/><path d="M10.5 10V8.5a1.5 1.5 0 013 0V10"/>',
    openAcc: '<rect x="3" y="4" width="14" height="16" rx="2"/><circle cx="10" cy="10" r="2.2"/><path d="M6.5 16a3.5 3.5 0 017 0M21 9l-5.5 5.5-1 2.5 2.5-1L22.5 10.5z"/>',
    contact: '<rect x="4" y="3" width="15" height="18" rx="2.5"/><circle cx="11.5" cy="10" r="2.4"/><path d="M7.5 16.5a4 4 0 018 0M21 7v3M21 13v3"/>',
    updown: '<path d="M8 10l4-4 4 4z" fill="currentColor"/><path d="M8 14l4 4 4-4z" fill="currentColor"/>',
    caret: '<path d="M7 10l5 5 5-5z" fill="currentColor"/>',
    unlock: '<rect x="4" y="11" width="16" height="10" rx="2" fill="currentColor"/><path d="M8 11V7a4 4 0 017.5-2"/><circle cx="12" cy="16" r="1.4" fill="#fff" stroke="none"/>',
    money: '<rect x="6" y="4" width="15" height="9" rx="1.5"/><circle cx="13.5" cy="8.5" r="2"/><path d="M3 13v6l4 2h7l6-4a1.6 1.6 0 00-2-2.4L15 16h-4"/>'
  });

  const money = n => vnd(n);
  const firstName = () => P().customer.greetName || P().customer.name.trim().split(' ').slice(-1)[0];
  const greeting = () => { const h = new Date().getHours(); return h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'; };
  const bank = code => P().banks.find(b => b.code === code);
  const bankLogo = b => `<span class="sc-blogo" style="background:${b.color || 'var(--p)'}">${esc(b.code.slice(0, 4))}</span>`;

  /* ---------- Trang chủ ---------- */
  function home() {
    const S = K.S, ins = INS();
    const hp = ins.placements.home, hprod = S.on.home && hp && prod(hp.productId);
    return `
    <div class="scr fade sc-home">
      <div class="body">
        <div class="sc-hero">
          <div class="sc-top">
            <button class="sc-search" data-act="toast" aria-label="Tìm kiếm">${svg('search', 20, 2.6)}</button>
            <button class="sc-bell" data-act="toast" data-msg="Bạn không có thông báo mới" aria-label="Thông báo">${svg('bell', 24, 2.2)}</button>
            <button class="sc-ava" data-act="toast" aria-label="Cá nhân">${svg('user', 26, 2)}</button>
          </div>
          <div class="sc-greet">${greeting()}, ${esc(firstName())}!</div>
          <div class="sc-promo">
            <div class="sc-promo-h"><small>MỞ TÀI KHOẢN</small><b>LỢI SUẤT CAO</b></div>
            <div class="sc-promo-cards">
              <div class="pc"><span>TỰ ĐỘNG<br>SINH LỜI</span><b><i>đến</i>6%</b></div>
              <div class="pc"><span>ĐẦU TƯ<br>TĂNG TRƯỞNG</span>
                <div class="two"><em>1 THÁNG<b>8%</b></em><em>6 THÁNG<b>10.2%</b></em></div>
              </div>
            </div>
          </div>
        </div>

        <div class="sc-tiles">
          <button class="sc-tile or" data-act="toast"><span class="ti">${svg('card', 26)}</span>Quản lý thẻ<br>và tài khoản</button>
          <button class="sc-tile bl" data-act="toast"><span class="ti">${svg('piggy', 26)}</span>Tiết kiệm</button>
          <button class="sc-tile bl" data-act="go" data-to="transfer"><span class="ti">${svg('money', 26)}</span>Chuyển tiền</button>
          <button class="sc-tile or" data-act="toast"><span class="ti new">New</span>Sinh lời Tài Lộc</button>
        </div>

        ${hprod ? `
        <button class="sc-insbar" data-act="openProduct" data-id="${hp.productId}" data-src="Trang chủ">
          <span class="ii" style="background:${hprod.color}">${svg(hprod.icon, 22)}</span>
          <span class="it"><b>${esc(hprod.name)}</b><small>${esc(hprod.tagline)}</small></span>
          ${hprod.badge ? `<span class="ib">${esc(hprod.badge)}</span>` : svg('chev', 18)}
        </button>` : ''}

        <div class="sc-svc">
          <button data-act="toast"><span class="si">${svg('chart', 26)}</span>Đầu tư</button>
          <button data-act="toast"><span class="si">${svg('otp', 26)}</span>Smart OTP</button>
          <button data-act="toast"><span class="si">${svg('openAcc', 26)}</span>Mở tài khoản thanh toán</button>
          <button data-act="go" data-to="hub"><span class="si">${svg('shield', 26)}${hprod ? '<i class="new">Mới</i>' : ''}</span>Bảo hiểm</button>
        </div>
      </div>
      <div class="sc-tab">
        <button data-act="toast">${svg('compass', 30, 1.8)}Khám phá</button>
        <button class="mid" data-act="toast"><span class="qr">${svg('qr', 28, 2)}</span>Truy cập nhanh</button>
        <button data-act="go" data-to="transfer">${svg('swap', 30, 1.8)}Giao dịch</button>
      </div>
    </div>`;
  }

  /* ---------- Chuyển tiền ---------- */
  function transferInner(bodyCls) {
    const S = K.S, p = P(), f = S.form, b = f.bank && bank(f.bank);
    return `
      <div class="sc-head">
        <div class="sc-nav">
          <button data-act="back" aria-label="Quay lại">${svg('back', 24, 3)}</button>
          <div>Chuyển tiền</div><span></span>
        </div>
        <div class="sc-tabs"><button class="on">Số tài khoản</button><button data-act="toast">Số thẻ</button></div>
      </div>
      <div class="${bodyCls} sc-form">
        <div class="sc-src">
          <div class="sr1">
            <span class="thumb"><i>TÀI KHOẢN THANH TOÁN</i></span>
            <span><b>${esc(p.customer.account)}</b><small>${esc(p.customer.accountType)}</small></span>
          </div>
          <div class="sr2"><span>Số dư/HM khả dụng</span><b>${money(S.balance)}</b></div>
          <div class="sr3">${svg('caret', 18)}</div>
        </div>

        <div class="sc-lbl">Tên ngân hàng</div>
        <button class="sc-box sc-bank" data-act="pickBank">
          ${b ? `${bankLogo(b)}<span class="bt"><b>${esc(b.name)}</b><small>${esc(b.sub || '')}</small></span><span class="napas">napas 247</span>`
              : '<span class="bt ph">Chọn ngân hàng nhận</span>'}
          <span class="ud">${svg('updown', 22)}</span>
        </button>

        <div class="sc-lbl">Phương thức chuyển tiền</div>
        <button class="sc-box" data-act="toast"><span class="bt">${esc((p.transfer && p.transfer.method) || 'Chuyển tiền nhanh 247')}</span><span class="ud">${svg('updown', 22)}</span></button>

        <label class="sc-lbl" for="fAcc">Số tài khoản nhận</label>
        <div class="sc-box">
          <input id="fAcc" inputmode="numeric" autocomplete="off" placeholder="Nhập số tài khoản" value="${esc(f.account)}">
          <button class="ic" data-act="toast" aria-label="Quét QR">${svg('qr', 22)}</button>
          <button class="ic fill" data-act="scContacts" aria-label="Danh bạ">${svg('contact', 22)}</button>
        </div>

        <div class="sc-lbl">Tên người nhận</div>
        <div class="sc-box"><div class="namerow${f.name ? ' ok' : ''}" id="nameRow">${esc(f.name)}</div></div>

        <label class="sc-lbl" for="fAmt">Số tiền cần chuyển</label>
        <div class="sc-box"><input id="fAmt" inputmode="numeric" autocomplete="off" placeholder="0" value="${f.amount ? fmt(f.amount) : ''}"><span class="cur">đ</span></div>
        <div class="words" id="amtWords"></div>

        <label class="sc-lbl" for="fNote">Diễn giải</label>
        <div class="sc-box"><textarea id="fNote" rows="2" maxlength="140">${esc(f.note)}</textarea></div>
      </div>
      <div class="sc-foot"><button class="btn primary" id="btnNext" data-act="toConfirm" disabled>Tiếp tục</button></div>`;
  }
  const transfer = () => `<div class="scr sc-tf">${transferInner('body')}</div>`;

  /* ---------- Xác nhận giao dịch (bottom sheet trên màn chuyển tiền) ---------- */
  function confirm(quiet) {
    const S = K.S, p = P(), f = S.form, o = confirmOffer();
    const prem = o && S.addon ? o.plan.premium : 0;
    return `
    <div class="scr sc-tf sc-cf ${quiet ? 'still' : ''}">
      <div class="sc-cf-bg" aria-hidden="true">${transferInner('sc-bgbody')}</div>
      <div class="sc-dim" data-act="back"></div>
      <div class="sc-sheet">
        <div class="grab"></div>
        <h3>Xác nhận giao dịch</h3>
        <div class="body sc-rows">
          <div class="r"><span>Loại giao dịch</span><span>Chuyển tiền đến số tài khoản</span></div>
          <div class="r"><span>Số tài khoản chuyển</span><span>${esc(p.customer.account)}</span></div>
          <div class="r"><span>Người nhận</span><span>${esc(f.name)}</span></div>
          <div class="r"><span>Số tài khoản</span><span>${esc(f.account)}</span></div>
          <div class="r"><span>Ngân hàng</span><span>${esc(bankName(f.bank))}</span></div>
          <div class="r"><span>Số tiền</span><span>${money(f.amount)}</span></div>
          <div class="r"><span>Phí giao dịch</span><span>${money(0)}</span></div>
          <div class="r"><span>Diễn giải</span><span>${esc(f.note || '—')}</span></div>
          ${o ? `
          <div class="offer ${S.addon ? 'on' : ''}">
            <span class="ob">${S.addon ? '✓ Đã chọn' : 'Đề xuất cho bạn'}</span>
            <div class="oh" data-act="toggleAddon" style="cursor:pointer">
              <span class="oi" style="background:${o.pr.color}">${svg(o.pr.icon, 22)}</span>
              <div>
                <div class="ot">${esc(o.pr.name)}</div>
                <div class="od">${esc(o.pr.offerText || o.pr.tagline)}, quyền lợi đến <b>${money(o.plan.coverage)}</b>.</div>
              </div>
            </div>
            <div class="of">
              <div class="op">Phí chỉ <b>${money(o.plan.premium)}</b> / ${o.plan.term} ngày</div>
              <button class="sw ${S.addon ? 'on' : ''}" data-act="toggleAddon" aria-label="Thêm bảo hiểm"></button>
            </div>
            <button class="more" data-act="addonInfo">Xem quyền lợi chi tiết</button>
            <div class="prov">Cung cấp bởi ${esc(INS().provider)} · ${esc(INS().distributorNote || '')}</div>
          </div>` : ''}
          ${prem ? `<div class="r"><span>Phí bảo hiểm</span><span>${money(prem)}</span></div>` : ''}
        </div>
        <div class="sc-rows sc-total"><div class="r total"><span>Tổng số tiền</span><span>${money(f.amount + prem)}</span></div></div>
        <div class="sc-sheet-f"><button class="btn primary" data-act="doConfirm">Xác nhận</button></div>
      </div>
    </div>`;
  }

  /* ---------- Xác thực giao dịch (nhấn xác nhận, không nhập PIN) ---------- */
  function auth() {
    const S = K.S, p = P(), f = S.form, isIns = S.otpFor === 'insurance';
    const app = esc(p.appName.toUpperCase());
    const item = (l, v) => `<div class="ai"><span>${l}</span><b>${v}</b></div>`;
    let list;
    if (isIns) {
      const pr = prod(S.product), plan = pr.plans[S.plan];
      list = `<div class="ah">${app}: Thanh toán phí bảo hiểm</div>
        ${item('Từ tài khoản/thẻ:', esc(p.customer.account))}
        ${item('Sản phẩm:', `${esc(pr.name)}<br>Gói ${esc(plan.name)}`)}
        ${item('Nhà bảo hiểm:', esc(INS().provider))}
        ${item('Tổng số tiền:', 'VND ' + fmt(plan.premium))}`;
    } else {
      const o = confirmOffer(), prem = o && S.addon ? o.plan.premium : 0;
      list = `<div class="ah">${app}: Chuyển tiền</div>
        ${item('Từ tài khoản/thẻ:', esc(p.customer.account))}
        ${item('Người thụ hưởng:', `${esc(f.account)}<br>${esc(f.name)}`)}
        ${prem ? item('Bảo hiểm kèm theo:', `${esc(o.pr.name)}<br>VND ${fmt(prem)}`) : ''}
        ${item('Tổng số tiền:', 'VND ' + fmt(f.amount + prem))}
        ${item('Diễn giải:', esc(f.note || '—'))}`;
    }
    return `
    <div class="scr sc-auth">
      <div class="sc-auth-nav">
        <button data-act="back" aria-label="Quay lại">${svg('back', 24, 3)}</button>
        <div>Xác thực giao dịch</div><span></span>
      </div>
      <div class="body">
        <div class="sc-auth-ic">${svg('unlock', 56, 1.8)}<i></i></div>
        <p class="sc-auth-msg">Vui lòng nhấn xác nhận để hoàn tất giao dịch</p>
        <div class="sc-auth-list">${list}</div>
      </div>
      <div class="sc-auth-f">
        <button class="btn primary" data-act="scAuthOk">Xác nhận</button>
        <button class="btn white" data-act="scCancel">Hủy giao dịch</button>
      </div>
    </div>`;
  }

  return {
    screens: { home, transfer, confirm, otp: auth },
    status: {
      home: { bg: 'transparent' },
      confirm: { bg: '#0F3D71' },   // màu header sau khi phủ lớp mờ
      otp: { bg: '#F1F2F6', color: '#111827' }
    },
    actions: {
      setBank: d => {
        const S = K.S;
        S.form.bank = d.code; S.form.contact = -1;
        K.render(true);
        K.lookup();
        const acc = document.getElementById('fAcc');
        if (acc && !S.form.account) acc.focus();
      },
      scContacts: () => {
        K.openSheet('Người nhận đã lưu', P().contacts.map((c, i) => `
          <button class="bank-it" data-act="pickContact" data-i="${i}">
            <span class="bl">${esc(initials(c.name))}</span>
            <span class="bn"><b>${esc(c.name)}</b><br><small style="color:var(--muted)">${esc(c.account)} · ${esc(bankName(c.bank))}</small></span>
          </button>`).join(''));
      },
      scAuthOk: () => K.processing(),
      scCancel: () => { K.goHome(); K.toast('Đã hủy giao dịch'); }
    }
  };
};

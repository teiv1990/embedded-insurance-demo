/* Ví Demo – nạp tiền điện thoại / thanh toán hóa đơn có gợi ý bảo hiểm nhúng. */
(function () {
  'use strict';

  // [THAY] sản phẩm, phí, quyền lợi minh họa
  const PRODUCTS = {
    screen: {
      name: 'Bảo hiểm Rơi vỡ màn hình', short: 'Rơi vỡ màn hình', icon: 'phone', color: '#2B5BFF',
      tagline: 'Chi trả sửa, thay màn hình khi rơi vỡ, vào nước',
      offerText: 'Bảo vệ điện thoại của bạn trước rơi vỡ, vào nước', badge: 'Từ 9.000đ/tháng',
      plans: [{ name: 'Tháng', premium: 9000, coverage: 3000000, term: 30 }, { name: 'Năm', premium: 89000, coverage: 5000000, term: 365 }],
      benefits: ['Sửa hoặc thay màn hình khi rơi vỡ, nứt', 'Chi trả khi điện thoại vào nước', 'Gửi máy tại trung tâm bảo hành liên kết', 'Yêu cầu bồi thường ngay trong ví'],
    },
    home: {
      name: 'Bảo hiểm Nhà tư nhân', short: 'Nhà tư nhân', icon: 'house', color: '#0B9E6A',
      tagline: 'Bảo vệ ngôi nhà trước cháy nổ, bão lũ',
      offerText: 'Bảo vệ ngôi nhà bạn đang thanh toán tiền điện trước cháy nổ, bão lũ', badge: 'Từ 99.000đ/năm',
      plans: [{ name: 'Cơ bản', premium: 99000, coverage: 300000000, term: 365 }, { name: 'Nâng cao', premium: 199000, coverage: 600000000, term: 365 }],
      benefits: ['Thiệt hại do cháy, nổ, sét đánh', 'Thiệt hại do bão, lũ, ngập nước', 'Chi phí dọn dẹp hiện trường', 'Tài sản bên trong nhà (gói Nâng cao)'],
    },
    cyber: {
      name: 'Bảo hiểm An ninh ví', short: 'An ninh ví', icon: 'shield', color: '#7B5CFF',
      tagline: 'Bồi thường khi số dư ví bị chiếm đoạt, lừa đảo',
      offerText: 'Bảo vệ số dư ví trước giao dịch trái phép', badge: 'Chỉ 5.000đ/tháng',
      plans: [{ name: 'Tháng', premium: 5000, coverage: 20000000, term: 30 }, { name: 'Năm', premium: 49000, coverage: 50000000, term: 365 }],
      benefits: ['Bồi thường tiền bị chiếm đoạt do lừa đảo, giả mạo', 'Giao dịch trái phép khi mất điện thoại, lộ mã PIN', 'Hỗ trợ khóa ví và khôi phục tài khoản'],
    },
  };
  const FLOWS = {
    topup: { title: 'Nạp tiền điện thoại', offer: 'screen', xsell: ['cyber', 'home'] },
    bill: { title: 'Thanh toán hóa đơn điện', offer: 'home', xsell: ['screen', 'cyber'] },
  };
  const BILL = 1245000;
  const premiumOf = (c) => (c.S.addon && !c.owns(FLOWS[c.S.flow].offer) ? c.prod(FLOWS[c.S.flow].offer).plans[0].premium : 0);

  DemoKit.createApp({
    appName: 'Ví Demo',
    provider: 'Bảo hiểm Đối tác (demo)',
    start: 'home',
    insurancePay: 'pin',
    theme: { '--p': '#7B3FE4', '--pd': '#5B21B6', '--ac': '#12D6DF', '--soft': '#F3EDFF', '--hero': 'linear-gradient(160deg, #5B21B6 0%, #7B3FE4 60%, #2B5BFF 100%)' },
    customer: { name: 'NGUYỄN MINH ANH', dob: '08/03/1994', phone: '0912 *** 686' },
    autofillText: 'Tự động điền từ hồ sơ ví đã xác thực – không cần nhập lại',
    products: PRODUCTS,
    state: () => ({ balance: 3250000, flow: 'topup', amount: 100000, phoneNo: '0912 345 678', addon: false, txn: null }),
    payAmount: (c) => c.S.amount + premiumOf(c),
    onInsurancePaid: (c, premium) => { c.S.balance -= premium; },
    onPaid: (c) => {
      const { S } = c;
      const f = FLOWS[S.flow];
      const prem = premiumOf(c);
      S.balance -= S.amount + prem;
      S.txn = { flow: S.flow, amount: S.amount, time: new Date(), code: `VD${c.rnd(10)}`, policy: prem ? c.createPolicy(f.offer, 0, 'Màn xác nhận') : null };
      S.addon = false;
      S.stack = [];
      S.screen = 'success';
      c.render();
    },

    screens: (c) => {
      const { S, svg, esc, fmt, vnd } = c;
      return {
        home: () => {
          const quick = [
            ['phone', 'Nạp tiền điện thoại', 'data-act="startFlow" data-flow="topup"'],
            ['bolt', 'Hóa đơn điện', 'data-act="startFlow" data-flow="bill"'],
            ['send', 'Chuyển tiền', 'data-act="toast"'],
            ['qr', 'Quét mã QR', 'data-act="toast"'],
            ['ticket', 'Vé xem phim', 'data-act="toast"'],
            ['shield', 'Bảo hiểm', 'data-act="go" data-to="hub"'],
            ['gift', 'Ưu đãi', 'data-act="toast"'],
            ['grid', 'Tất cả', 'data-act="toast"'],
          ];
          const pr = PRODUCTS.screen;
          return `
          <div class="scr fade">
            <div class="body">
              <div class="home-hero">
                <div class="home-top">
                  <div class="avatar">MA</div>
                  <div><div class="hello">Xin chào,</div><div class="uname">NGUYỄN MINH ANH</div></div>
                  <div class="spacer"></div>
                  <div class="logo-chip">VD</div>
                  <button class="icon-btn" data-act="toast" data-msg="Bạn không có thông báo mới">${svg('bell', 20)}</button>
                </div>
              </div>
              <div class="acct-card">
                <div class="acct-row"><div><div class="acct-label">Số dư ví</div><div class="acct-no">Ví Demo · đã xác thực</div></div></div>
                <div class="acct-bal">${fmt(S.balance)} <small>đ</small></div>
                <div class="acct-links"><button data-act="toast">Nạp tiền vào ví</button><button data-act="toast">Rút tiền</button></div>
              </div>
              <div class="quick">${quick.map(([ic, t, a]) => `<button class="q-item" ${a}><span class="q-ic">${svg(ic, 24)}</span>${t}</button>`).join('')}</div>
              <button class="promo" style="background:${c.shade(pr.color)}" data-act="openProduct" data-id="screen" data-src="Trang chủ ví">
                <span class="pi">${svg(pr.icon, 26)}</span>
                <span style="position:relative;z-index:1"><div class="pt">${esc(pr.name)}</div><div class="ps">${esc(pr.tagline)}</div><span class="pbadge">${esc(pr.badge)} · Mua ngay</span></span>
              </button>
              <div class="sec-title">Ưu đãi dành cho bạn</div>
              <div class="tiles"><div class="tile"><b>Hoàn tiền 5%</b>Thanh toán hóa đơn tháng này</div><div class="tile"><b>Giảm 20.000đ</b>Nạp điện thoại từ 100.000đ</div></div>
            </div>
            <div class="tabbar">
              <button class="tab on">${svg('home', 22)}Trang chủ</button>
              <button class="tab" data-act="toast">${svg('clock', 22)}Lịch sử</button>
              <button class="tab center" data-act="toast"><span class="tc">${svg('qr', 22)}</span></button>
              <button class="tab" data-act="go" data-to="hub">${svg('shield', 22)}Bảo hiểm</button>
              <button class="tab" data-act="toast">${svg('user', 22)}Cá nhân</button>
            </div>
          </div>`;
        },

        topup: () => `
          <div class="scr">
            ${c.nav('Nạp tiền điện thoại')}
            <div class="body pad">
              <div class="field"><label for="fPhone">Số điện thoại</label><input id="fPhone" inputmode="tel" autocomplete="off" value="${esc(S.phoneNo)}"></div>
              <div class="namerow ok">${svg('check', 16, 3)} Nhà mạng được nhận diện tự động · Thuê bao trả trước</div>
              <div class="lbl" style="margin-top:14px">Chọn mệnh giá</div>
              <div class="amt-grid">${[20000, 50000, 100000, 200000, 300000, 500000].map((v) => `<button class="amt ${S.amount === v ? 'on' : ''}" data-act="amt" data-v="${v}"><b>${fmt(v)}đ</b><small>Nhận ngay</small></button>`).join('')}</div>
              <div class="card src" style="margin-top:14px"><div class="si">VD</div><div style="flex:1"><div class="sn">Nguồn tiền: Số dư ví</div><div class="sb">Khả dụng: <b style="color:var(--text)">${vnd(S.balance)}</b></div></div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="go" data-to="confirm">Tiếp tục</button></div>
          </div>`,

        bill: () => `
          <div class="scr">
            ${c.nav('Thanh toán hóa đơn điện')}
            <div class="body pad">
              <div class="card"><div class="rows">
                <div class="r"><span>Nhà cung cấp</span><span>Điện lực (demo)</span></div>
                <div class="r"><span>Mã khách hàng</span><span>PE0123456789</span></div>
                <div class="r"><span>Tên khách hàng</span><span>NGUYỄN MINH ANH</span></div>
                <div class="r"><span>Kỳ thanh toán</span><span>Tháng 09/2026</span></div>
              </div></div>
              <div class="card" style="margin-top:12px"><div class="amt-hero"><div class="al">Số tiền cần thanh toán</div><div class="av">${vnd(BILL)}</div></div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="go" data-to="confirm">Tiếp tục</button></div>
          </div>`,

        confirm: () => {
          const f = FLOWS[S.flow];
          const prem = premiumOf(c);
          return `
          <div class="scr">
            ${c.nav('Xác nhận thanh toán')}
            <div class="body pad">
              <div class="card">
                <div class="amt-hero"><div class="al">${esc(f.title)}</div><div class="av">${vnd(S.amount)}</div></div>
                <div class="rows">
                  ${S.flow === 'topup' ? `<div class="r"><span>Số điện thoại</span><span>${esc(S.phoneNo)}</span></div>` : '<div class="r"><span>Mã khách hàng</span><span>PE0123456789</span></div><div class="r"><span>Kỳ</span><span>09/2026</span></div>'}
                  <div class="r"><span>Nguồn tiền</span><span>Số dư ví</span></div>
                  <div class="r"><span>Phí giao dịch</span><span style="color:var(--ok)">Miễn phí</span></div>
                </div>
              </div>
              ${c.owns(f.offer) ? '' : c.offer(f.offer, S.addon, 'toggleAddon')}
              <div class="card" style="margin-top:12px"><div class="rows">
                ${prem ? `<div class="r"><span>Phí bảo hiểm</span><span>${vnd(prem)}</span></div>` : ''}
                <div class="r total"><span>Tổng thanh toán</span><span>${vnd(S.amount + prem)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="startPin">Thanh toán</button></div>
          </div>`;
        },

        success: () => {
          const t = S.txn;
          const f = FLOWS[t.flow];
          const xs = f.xsell.filter((id) => !c.owns(id)).slice(0, 2);
          return `
          <div class="scr fade">
            <div class="body">
              <div class="succ-hero">
                <div class="succ-check">${svg('check', 38, 3.2)}</div>
                <div class="succ-t">Thanh toán thành công</div>
                <div class="succ-a">${vnd(t.amount)}</div>
                <div class="succ-d">${c.tstr(t.time)} · ${c.dstr(t.time)}</div>
              </div>
              <div class="pad" style="padding-top:0">
                <div class="card receipt">
                  <div class="rows">
                    <div class="r"><span>Dịch vụ</span><span>${esc(f.title)}</span></div>
                    <div class="r"><span>Mã giao dịch</span><span>${t.code}</span></div>
                    <div class="r"><span>Số dư còn lại</span><span>${vnd(S.balance)}</span></div>
                  </div>
                  ${t.policy ? c.policyRow(t.policy) : ''}
                </div>
                ${xs.length ? `<div class="xsell"><div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Có thể bạn quan tâm</div>${xs.map((id) => c.xsCard(id, 'Sau thanh toán')).join('')}</div>` : ''}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
          </div>`;
        },
      };
    },

    actions: (c) => ({
      startFlow: (d) => { c.S.flow = d.flow; c.S.amount = d.flow === 'bill' ? BILL : 100000; c.S.addon = false; c.go(d.flow); },
      amt: (d) => { c.S.amount = Number(d.v); c.render(true); },
      toggleAddon: () => { c.S.addon = !c.S.addon; c.render(true); },
    }),

    bind: (c) => ({
      topup: () => {
        const input = c.$('#fPhone');
        input.addEventListener('input', () => { c.S.phoneNo = input.value; });
      },
    }),
  });
})();

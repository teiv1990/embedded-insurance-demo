/* Chứng khoán Demo – nạp tiền vào tài khoản có bảo hiểm an ninh mạng nhúng, gợi ý bảo hiểm tai nạn, sức khỏe. */
(function () {
  'use strict';

  // [THAY] sản phẩm, phí, quyền lợi minh họa; mã cổ phiếu là giả định
  const PRODUCTS = {
    cyber: {
      name: 'Bảo hiểm An ninh tài khoản', short: 'An ninh tài khoản', icon: 'lock', color: '#059669',
      tagline: 'Bồi thường khi tài khoản bị chiếm đoạt, lừa đảo mạo danh',
      offerText: 'Bảo vệ tiền trong tài khoản trước chiếm đoạt, lừa đảo mạo danh', badge: 'Chỉ 15.000đ/tháng',
      plans: [{ name: 'Tháng', premium: 15000, coverage: 100000000, term: 30 }, { name: 'Năm', premium: 149000, coverage: 200000000, term: 365 }],
      benefits: ['Bồi thường tiền bị rút, chuyển trái phép', 'Lừa đảo mạo danh công ty chứng khoán, cơ quan chức năng', 'Hỗ trợ khóa tài khoản và khôi phục truy cập 24/7'],
    },
    accident: {
      name: 'Bảo hiểm Tai nạn cá nhân', short: 'Tai nạn cá nhân', icon: 'shield', color: '#2B5BFF',
      tagline: 'Bảo vệ 24/7 trước rủi ro tai nạn',
      badge: 'Từ 99.000đ/năm',
      plans: [{ name: 'Cơ bản', premium: 99000, coverage: 100000000, term: 365 }, { name: 'Nâng cao', premium: 189000, coverage: 200000000, term: 365 }],
      benefits: ['Chi phí y tế do tai nạn', 'Bồi thường tử vong, thương tật toàn bộ vĩnh viễn', 'Yêu cầu bồi thường ngay trong app'],
    },
    health: {
      name: 'Bảo an Sức khỏe', short: 'Sức khỏe', icon: 'heart', color: '#E11D48',
      tagline: 'Chi trả một lần khi mắc bệnh hiểm nghèo',
      badge: 'Từ 290.000đ/năm',
      plans: [{ name: 'Cơ bản', premium: 290000, coverage: 300000000, term: 365 }, { name: 'Nâng cao', premium: 520000, coverage: 500000000, term: 365 }],
      benefits: ['Chi trả khi chẩn đoán 1 trong 40 bệnh hiểm nghèo', 'Không cần chứng từ viện phí', 'Dùng tiền bồi thường linh hoạt'],
    },
  };
  const WATCH = [
    { s: 'DEMOA', n: 'Công ty Demo A', p: '28,45', ch: '+1,25%', up: true },
    { s: 'DEMOB', n: 'Ngân hàng Demo B', p: '19,80', ch: '+0,51%', up: true },
    { s: 'DEMOC', n: 'Thép Demo C', p: '31,10', ch: '-0,64%', up: false },
    { s: 'DEMOD', n: 'Bán lẻ Demo D', p: '64,20', ch: '+2,07%', up: true },
  ];
  const premiumOf = (c) => (c.S.addon && !c.owns('cyber') ? PRODUCTS.cyber.plans[0].premium : 0);

  DemoKit.createApp({
    appName: 'Chứng khoán Demo',
    provider: 'Bảo hiểm Đối tác (demo)',
    start: 'home',
    insurancePay: 'pin',
    theme: { '--p': '#059669', '--pd': '#064E3B', '--ac': '#FACC15', '--soft': '#E7F7F1', '--hero': 'linear-gradient(160deg, #064E3B 0%, #059669 100%)' },
    customer: { name: 'NGUYỄN MINH ANH', dob: '08/03/1994', phone: '0912 *** 686' },
    autofillText: 'Tự động điền từ hồ sơ eKYC – không cần nhập lại',
    products: PRODUCTS,
    state: () => ({ cash: 12500000, amount: 10000000, addon: false, txn: null }),
    payAmount: (c) => c.S.amount + premiumOf(c),
    onInsurancePaid: (c, premium) => { c.S.cash = Math.max(0, c.S.cash - premium); },
    onPaid: (c) => {
      const { S } = c;
      const prem = premiumOf(c);
      S.cash += S.amount;
      S.txn = { amount: S.amount, prem, time: new Date(), code: `CK${c.rnd(10)}`, policy: prem ? c.createPolicy('cyber', 0, 'Màn nạp tiền') : null };
      S.addon = false;
      S.stack = [];
      S.screen = 'success';
      c.render();
    },

    screens: (c) => {
      const { S, svg, fmt, vnd } = c;
      return {
        home: () => `
          <div class="scr fade">
            <div class="body">
              <div class="home-hero">
                <div class="home-top"><div class="avatar">MA</div><div><div class="hello">Tài khoản DEMO123456</div><div class="uname">NGUYỄN MINH ANH</div></div><div class="spacer"></div><div class="logo-chip">CK</div></div>
              </div>
              <div class="acct-card">
                <div class="acct-row"><div><div class="acct-label">Tổng tài sản</div><div class="acct-no">Lãi/lỗ hôm nay <b style="color:var(--ok)">+1.842.000đ (+1,24%)</b></div></div></div>
                <div class="acct-bal">${fmt(140000000 + S.cash)} <small>đ</small></div>
                <div class="acct-links"><button data-act="startDeposit">Nạp tiền</button><button data-act="toast">Đặt lệnh</button></div>
              </div>
              <div class="quick">
                <button class="q-item" data-act="startDeposit"><span class="q-ic">${svg('wallet', 24)}</span>Nạp tiền</button>
                <button class="q-item" data-act="toast"><span class="q-ic">${svg('chart', 24)}</span>Đặt lệnh</button>
                <button class="q-item" data-act="toast"><span class="q-ic">${svg('card', 24)}</span>Ký quỹ</button>
                <button class="q-item" data-act="go" data-to="hub"><span class="q-ic">${svg('shield', 24)}</span>Bảo hiểm</button>
              </div>
              <div class="sec-title">Danh mục theo dõi</div>
              <div class="pad" style="padding-top:0"><div class="card wl">${WATCH.map((w) => `<div class="wl-r"><span><b>${w.s}</b><small>${w.n}</small></span><span class="wl-p"><b>${w.p}</b><small class="${w.up ? 'up' : 'down'}">${w.ch}</small></span></div>`).join('')}</div></div>
            </div>
          </div>`,

        deposit: () => `
          <div class="scr">
            ${c.nav('Nạp tiền vào tài khoản')}
            <div class="body pad">
              <div class="card src"><div class="si">${svg('bank', 20)}</div><div style="flex:1"><div class="sn">Từ: Tài khoản ngân hàng liên kết</div><div class="sb">Ngân hàng Demo · **** 6868</div></div></div>
              <div class="lbl" style="margin-top:14px">Số tiền nạp</div>
              <div class="amt-grid">${[5000000, 10000000, 20000000, 50000000].map((v) => `<button class="amt ${S.amount === v ? 'on' : ''}" data-act="amt" data-v="${v}"><b>${fmt(v)}đ</b><small>Có ngay</small></button>`).join('')}</div>
              <div class="card" style="margin-top:14px"><div class="rows"><div class="r"><span>Tiền mặt hiện có</span><span>${vnd(S.cash)}</span></div></div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="go" data-to="confirm">Tiếp tục</button></div>
          </div>`,

        confirm: () => {
          const prem = premiumOf(c);
          return `
          <div class="scr">
            ${c.nav('Xác nhận nạp tiền')}
            <div class="body pad">
              <div class="card">
                <div class="amt-hero"><div class="al">Nạp vào tài khoản DEMO123456</div><div class="av">${vnd(S.amount)}</div></div>
                <div class="rows"><div class="r"><span>Nguồn tiền</span><span>Ngân hàng Demo · **** 6868</span></div><div class="r"><span>Phí</span><span style="color:var(--ok)">Miễn phí</span></div></div>
              </div>
              ${c.owns('cyber') ? '' : c.offer('cyber', S.addon, 'toggleAddon')}
              <div class="card" style="margin-top:12px"><div class="rows">
                ${prem ? `<div class="r"><span>Phí bảo hiểm</span><span>${vnd(prem)}</span></div>` : ''}
                <div class="r total"><span>Tổng trừ từ ngân hàng</span><span>${vnd(S.amount + prem)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="startPin">Xác nhận nạp tiền</button></div>
          </div>`;
        },

        success: () => {
          const t = S.txn;
          const xs = ['accident', 'health'].filter((id) => !c.owns(id));
          return `
          <div class="scr fade">
            <div class="body">
              <div class="succ-hero">
                <div class="succ-check">${svg('check', 38, 3.2)}</div>
                <div class="succ-t">Nạp tiền thành công</div>
                <div class="succ-a">${vnd(t.amount)}</div>
                <div class="succ-d">${c.tstr(t.time)} · ${c.dstr(t.time)} · Sẵn sàng đặt lệnh</div>
              </div>
              <div class="pad" style="padding-top:0">
                <div class="card receipt">
                  <div class="rows"><div class="r"><span>Mã giao dịch</span><span>${t.code}</span></div><div class="r"><span>Tiền mặt khả dụng</span><span>${vnd(S.cash)}</span></div></div>
                  ${t.policy ? c.policyRow(t.policy) : ''}
                </div>
                ${xs.length ? `<div class="xsell"><div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Đầu tư dài hạn, bảo vệ dài lâu</div>${xs.map((id) => c.xsCard(id, 'Sau nạp tiền')).join('')}</div>` : ''}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
          </div>`;
        },
      };
    },

    actions: (c) => ({
      startDeposit: () => { c.S.addon = false; c.go('deposit'); }, // mỗi lần nạp: bảo hiểm luôn chưa chọn
      amt: (d) => { c.S.amount = Number(d.v); c.render(true); },
      toggleAddon: () => { c.S.addon = !c.S.addon; c.render(true); },
    }),
  });
})();

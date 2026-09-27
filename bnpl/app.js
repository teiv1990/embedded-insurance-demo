/* Trả góp Demo – mua trả góp có bảo hiểm tùy chọn (không ảnh hưởng duyệt), gợi ý bảo hiểm mất việc làm. */
(function () {
  'use strict';

  const PRICE = 12990000;
  const DOWN = 3900000;
  const LOAN = PRICE - DOWN;
  const TERMS = [6, 9, 12];
  // [THAY] sản phẩm, phí, quyền lợi minh họa – rà soát quy định bán bảo hiểm kèm khoản vay trước khi dùng thật
  const PRODUCTS = {
    device: {
      name: 'Bảo hiểm Thiết bị trả góp', short: 'Thiết bị', icon: 'phone', color: '#4338CA',
      tagline: 'Sửa, thay máy khi rơi vỡ, mất cắp trong thời gian trả góp',
      offerText: 'Bảo vệ chiếc điện thoại bạn đang trả góp', badge: 'Từ 199.000đ',
      plans: [{ name: '12 tháng', premium: 199000, coverage: PRICE, term: 365 }],
      benefits: ['Sửa hoặc thay máy khi rơi vỡ, vào nước', 'Bồi thường khi mất cắp có báo công an', 'Không gián đoạn lịch trả góp khi máy hỏng'],
    },
    loan: {
      name: 'Bảo hiểm Khoản vay', short: 'Khoản vay', icon: 'shield', color: '#0F766E',
      tagline: 'Trả nợ thay gia đình khi người vay gặp rủi ro',
      offerText: 'Gia đình không phải gánh dư nợ nếu bạn gặp rủi ro', badge: '1% khoản vay',
      plans: [{ name: 'Theo khoản vay', premium: Math.round(LOAN / 100 / 1000) * 1000, coverage: LOAN, term: 365 }],
      benefits: ['Trả toàn bộ dư nợ khi tử vong, thương tật toàn bộ vĩnh viễn', 'Chi trả các kỳ góp khi nằm viện dài ngày', 'Quyền lợi thuộc về người vay và gia đình'],
    },
    job: {
      name: 'Bảo hiểm Mất việc làm', short: 'Mất việc làm', icon: 'briefcase', color: '#F59E0B',
      tagline: 'Chi trả tiền góp hằng tháng khi bạn mất việc',
      badge: 'Từ 29.000đ/tháng',
      plans: [{ name: '3 kỳ góp', premium: 29000, coverage: 3000000, term: 30 }, { name: '6 kỳ góp', premium: 49000, coverage: 6000000, term: 30 }],
      benefits: ['Chi trả tối đa 6 kỳ góp khi mất việc ngoài ý muốn', 'Không ảnh hưởng điểm tín dụng', 'Yêu cầu bồi thường ngay trong app'],
    },
  };
  const monthly = (S) => Math.ceil(LOAN / S.term / 1000) * 1000;
  const insTotal = (S) => (S.device ? PRODUCTS.device.plans[0].premium : 0) + (S.loanIns ? PRODUCTS.loan.plans[0].premium : 0);

  DemoKit.createApp({
    appName: 'Trả góp Demo',
    provider: 'Bảo hiểm Đối tác (demo)',
    start: 'plan',
    insurancePay: 'pin',
    theme: { '--p': '#4338CA', '--pd': '#312E81', '--ac': '#12D6DF', '--soft': '#EEF0FF', '--hero': 'linear-gradient(160deg, #312E81 0%, #4338CA 60%, #7B5CFF 100%)' },
    customer: { name: 'NGUYỄN MINH ANH', dob: '08/03/1994', phone: '0912 *** 686' },
    autofillText: 'Tự động điền từ hồ sơ vay đã xác thực – không cần nhập lại',
    products: PRODUCTS,
    state: () => ({ term: 12, device: false, loanIns: false, contract: null }),
    payAmount: (c) => DOWN + insTotal(c.S), // hôm nay: trả trước + phí bảo hiểm đã chọn
    onPaid: (c) => {
      const { S } = c;
      const policies = [];
      if (S.device) policies.push(c.createPolicy('device', 0, 'Màn xác nhận khoản vay'));
      if (S.loanIns) policies.push(c.createPolicy('loan', 0, 'Màn xác nhận khoản vay'));
      S.contract = { no: `TG${c.rnd(9)}`, term: S.term, monthly: monthly(S), policies };
      S.device = false; S.loanIns = false;
      S.stack = [];
      S.screen = 'approved';
      c.render();
    },

    screens: (c) => {
      const { S, svg, vnd } = c;
      return {
        plan: () => `
          <div class="scr fade">
            <div class="body">
              <div class="home-hero">
                <div class="home-top"><div class="avatar">MA</div><div><div class="hello">Hạn mức khả dụng</div><div class="uname">30.000.000đ</div></div><div class="spacer"></div><div class="logo-chip">TG</div></div>
              </div>
              <div class="pad">
                <div class="card ci"><div class="ci-img"><div class="pdp-phone sm"></div></div><div style="flex:1"><div class="ci-name">Điện thoại Demo X 128GB</div><div class="ci-var">Mua tại Shop đối tác</div><div class="ci-price">${vnd(PRICE)}</div></div></div>
                <div class="card">
                  <div class="rows"><div class="r"><span>Trả trước 30%</span><span>${vnd(DOWN)}</span></div><div class="r"><span>Số tiền trả góp</span><span>${vnd(LOAN)}</span></div><div class="r"><span>Lãi suất</span><span style="color:var(--ok)">0% (demo)</span></div></div>
                </div>
                <div class="lbl" style="margin:14px 0 8px">Chọn kỳ hạn</div>
                <div class="amt-grid terms">${TERMS.map((t) => `<button class="amt ${S.term === t ? 'on' : ''}" data-act="term" data-t="${t}"><b>${t} tháng</b><small>${vnd(Math.ceil(LOAN / t / 1000) * 1000)}/tháng</small></button>`).join('')}</div>
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="toReview">Tiếp tục</button></div>
          </div>`,

        review: () => {
          const ins = insTotal(S);
          return `
          <div class="scr">
            ${c.nav('Xác nhận khoản trả góp')}
            <div class="body pad">
              <div class="card">
                <div class="amt-hero"><div class="al">Góp mỗi tháng</div><div class="av">${vnd(monthly(S))}</div></div>
                <div class="rows">
                  <div class="r"><span>Số tiền trả góp</span><span>${vnd(LOAN)}</span></div>
                  <div class="r"><span>Kỳ hạn</span><span>${S.term} tháng</span></div>
                  <div class="r"><span>Ngày thanh toán</span><span>Ngày 5 hằng tháng</span></div>
                </div>
              </div>
              <div class="note-box">${svg('shield', 16)} Bảo hiểm dưới đây là <b>tùy chọn</b>: không bắt buộc và <b>không ảnh hưởng kết quả duyệt</b> khoản trả góp.</div>
              ${c.offer('device', S.device, 'toggleDevice')}
              ${c.offer('loan', S.loanIns, 'toggleLoan')}
              <div class="card" style="margin-top:12px"><div class="rows">
                <div class="r"><span>Trả trước</span><span>${vnd(DOWN)}</span></div>
                ${ins ? `<div class="r"><span>Phí bảo hiểm</span><span>${vnd(ins)}</span></div>` : ''}
                <div class="r total"><span>Thanh toán hôm nay</span><span>${vnd(DOWN + ins)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="startPin">Ký hợp đồng & trả trước</button></div>
          </div>`;
        },

        approved: () => {
          const k = S.contract;
          return `
          <div class="scr fade">
            <div class="body">
              <div class="succ-hero">
                <div class="succ-check">${svg('check', 38, 3.2)}</div>
                <div class="succ-t">Khoản trả góp đã được duyệt</div>
                <div class="succ-a">${vnd(k.monthly)}/tháng</div>
                <div class="succ-d">Hợp đồng ${k.no} · ${k.term} kỳ · Nhận máy tại cửa hàng</div>
              </div>
              <div class="pad" style="padding-top:0">
                ${k.policies.length ? `<div class="card receipt">${k.policies.map(c.policyRow).join('')}</div>` : ''}
                <div class="card remind">${svg('bell', 18)}<span><b>Nhắc kỳ góp 1 · 05/11/2026</b><small>${vnd(k.monthly)} · tự động trừ từ tài khoản liên kết</small></span></div>
                ${c.owns('job') ? '' : `<div class="xsell"><div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Yên tâm trả góp cả khi mất thu nhập</div>${c.xsCard('job', 'Nhắc kỳ góp')}</div>`}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
          </div>`;
        },
      };
    },

    actions: (c) => ({
      term: (d) => { c.S.term = Number(d.t); c.render(true); },
      toReview: () => { c.S.device = false; c.S.loanIns = false; c.go('review'); }, // bảo hiểm luôn chưa chọn khi vào màn xác nhận
      toggleDevice: () => { c.S.device = !c.S.device; c.render(true); },
      toggleLoan: () => { c.S.loanIns = !c.S.loanIns; c.render(true); },
    }),
  });
})();

/* Travel Demo – đặt vé máy bay có bảo hiểm trễ/hủy chuyến, hành lý; gợi ý bảo hiểm du lịch sau đặt vé. */
(function () {
  'use strict';

  // [THAY] sản phẩm, phí, quyền lợi minh họa
  const PRODUCTS = {
    delay: {
      name: 'Bảo hiểm Trễ, hủy chuyến bay', short: 'Trễ, hủy chuyến', icon: 'clock', color: '#0284C7',
      tagline: 'Chi trả tự động khi chuyến bay trễ từ 2 giờ hoặc bị hủy',
      offerText: 'Nhận tiền tự động nếu chuyến bay trễ từ 2 giờ', badge: 'Chỉ 39.000đ/chặng',
      plans: [{ name: 'Theo chặng', premium: 39000, coverage: 2000000, term: 3 }],
      benefits: ['Trễ từ 2 giờ: chi trả 300.000đ mỗi 2 giờ', 'Chuyến bay bị hủy: hoàn phần vé không được hoàn', 'Chi trả tự động theo dữ liệu chuyến bay, không cần hồ sơ'],
    },
    baggage: {
      name: 'Bảo hiểm Hành lý', short: 'Hành lý', icon: 'bag', color: '#7B5CFF',
      tagline: 'Bồi thường khi hành lý ký gửi thất lạc, hư hỏng',
      offerText: 'Bảo vệ hành lý ký gửi của bạn', badge: 'Chỉ 25.000đ/chặng',
      plans: [{ name: 'Theo chặng', premium: 25000, coverage: 10000000, term: 3 }],
      benefits: ['Hành lý ký gửi thất lạc, mất cắp', 'Hành lý hư hỏng khi vận chuyển', 'Chi phí mua đồ dùng thiết yếu khi hành lý đến chậm'],
    },
    medical: {
      name: 'Bảo hiểm Du lịch', short: 'Du lịch', icon: 'heart', color: '#00A36C',
      tagline: 'Chi phí y tế, tai nạn trong suốt chuyến đi',
      badge: 'Từ 45.000đ/chuyến',
      plans: [{ name: 'Trong nước 5 ngày', premium: 45000, coverage: 100000000, term: 5 }, { name: 'Trong nước 10 ngày', premium: 79000, coverage: 150000000, term: 10 }],
      benefits: ['Chi phí y tế do ốm đau, tai nạn khi đi du lịch', 'Hủy, rút ngắn chuyến đi vì lý do bất khả kháng', 'Hỗ trợ khẩn cấp 24/7'],
    },
  };
  const FLIGHTS = [
    { dep: '06:15', arr: '07:35', price: 1290000, tag: 'Sớm nhất' },
    { dep: '09:40', arr: '11:00', price: 1490000, tag: '' },
    { dep: '19:20', arr: '20:40', price: 1190000, tag: 'Rẻ nhất' },
  ];
  const TAX = 250000;
  const addons = (S) => (S.delay ? PRODUCTS.delay.plans[0].premium : 0) + (S.bag ? PRODUCTS.baggage.plans[0].premium : 0);

  DemoKit.createApp({
    appName: 'Travel Demo',
    provider: 'Bảo hiểm Đối tác (demo)',
    start: 'search',
    insurancePay: 'direct',
    theme: { '--p': '#0284C7', '--pd': '#075985', '--ac': '#F59E0B', '--soft': '#E6F4FB', '--hero': 'linear-gradient(160deg, #075985 0%, #0284C7 60%, #12D6DF 100%)' },
    customer: { name: 'NGUYỄN MINH ANH', dob: '08/03/1994', phone: '0912 *** 686' },
    autofillText: 'Tự động điền từ thông tin hành khách đã lưu – không cần nhập lại',
    products: PRODUCTS,
    state: () => ({ flight: 0, delay: false, bag: false, booking: null }),
    payAmount: () => 0,
    onPaid: () => {},

    screens: (c) => {
      const { S, svg, vnd } = c;
      const f = () => FLIGHTS[S.flight];
      const route = `<div class="fl-route"><div><b>HAN</b><small>Hà Nội</small></div><span class="fl-line">${svg('plane', 20)}</span><div><b>DAD</b><small>Đà Nẵng</small></div></div>`;
      return {
        search: () => `
          <div class="scr fade">
            <div class="body">
              <div class="home-hero">
                <div class="home-top"><div class="avatar">MA</div><div><div class="hello">Xin chào,</div><div class="uname">Minh Anh, đi đâu tiếp?</div></div><div class="spacer"></div><div class="logo-chip">TD</div></div>
              </div>
              <div class="acct-card">
                <div class="lbl" style="margin-bottom:10px">${svg('plane', 16)} Vé máy bay</div>
                ${route}
                <div class="rows" style="margin-top:10px">
                  <div class="r"><span>Ngày đi</span><span>Thứ Năm, 15/10/2026</span></div>
                  <div class="r"><span>Hành khách</span><span>1 người lớn · Phổ thông</span></div>
                </div>
                <button class="btn primary" style="margin-top:12px" data-act="go" data-to="flights">Tìm chuyến bay</button>
              </div>
              <div class="quick">
                <button class="q-item"><span class="q-ic">${svg('plane', 24)}</span>Vé máy bay</button>
                <button class="q-item" data-act="toast"><span class="q-ic">${svg('house', 24)}</span>Khách sạn</button>
                <button class="q-item" data-act="toast"><span class="q-ic">${svg('ticket', 24)}</span>Tour</button>
                <button class="q-item" data-act="go" data-to="hub"><span class="q-ic">${svg('shield', 24)}</span>Bảo hiểm</button>
              </div>
              <button class="promo" style="background:${c.shade(PRODUCTS.medical.color)}" data-act="openProduct" data-id="medical" data-src="Trang chủ">
                <span class="pi">${svg('heart', 26)}</span>
                <span style="position:relative;z-index:1"><div class="pt">Bảo hiểm Du lịch</div><div class="ps">${PRODUCTS.medical.tagline}</div><span class="pbadge">${PRODUCTS.medical.badge} · Mua ngay</span></span>
              </button>
            </div>
          </div>`,

        flights: () => `
          <div class="scr">
            ${c.nav('Hà Nội → Đà Nẵng')}
            <div class="body pad">
              <div class="lbl">Thứ Năm, 15/10 · 1 người lớn</div>
              ${FLIGHTS.map((x, i) => `
                <button class="card fl" data-act="pickFlight" data-i="${i}">
                  <span class="fl-t"><b>${x.dep}</b><small>HAN</small></span>
                  <span class="fl-mid"><small>1 giờ 20 phút · Bay thẳng</small><i></i><small>Hãng bay Demo</small></span>
                  <span class="fl-t"><b>${x.arr}</b><small>DAD</small></span>
                  <span class="fl-p">${x.tag ? `<em>${x.tag}</em>` : ''}<b>${vnd(x.price)}</b></span>
                </button>`).join('')}
            </div>
          </div>`,

        pax: () => {
          const ins = addons(S);
          const total = f().price + TAX + ins;
          return `
          <div class="scr">
            ${c.nav('Thông tin đặt vé')}
            <div class="body pad">
              <div class="card">${route}<div class="rows" style="margin-top:10px"><div class="r"><span>Chuyến bay</span><span>${f().dep} – ${f().arr} · 15/10</span></div></div></div>
              <div class="card" style="margin-top:12px">
                <div class="autofill">${svg('wand', 16)} ${c.cfg.autofillText}</div>
                <div class="rows"><div class="r"><span>Hành khách</span><span>NGUYỄN MINH ANH</span></div><div class="r"><span>Hành lý ký gửi</span><span>20 kg</span></div></div>
              </div>
              ${c.offer('delay', S.delay, 'toggleDelay')}
              ${c.offer('baggage', S.bag, 'toggleBag')}
              <div class="card" style="margin-top:12px"><div class="rows">
                <div class="r"><span>Giá vé</span><span>${vnd(f().price)}</span></div>
                <div class="r"><span>Thuế, phí</span><span>${vnd(TAX)}</span></div>
                ${ins ? `<div class="r"><span>Bảo hiểm</span><span>${vnd(ins)}</span></div>` : ''}
                <div class="r total"><span>Tổng thanh toán</span><span>${vnd(total)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="pay">Thanh toán · ${vnd(total)}</button></div>
          </div>`;
        },

        ticket: () => {
          const b = S.booking;
          return `
          <div class="scr fade">
            <div class="body">
              <div class="succ-hero">
                <div class="succ-check">${svg('check', 38, 3.2)}</div>
                <div class="succ-t">Đặt vé thành công</div>
                <div class="succ-a">${vnd(b.total)}</div>
                <div class="succ-d">Mã đặt chỗ ${b.pnr} · Vé điện tử đã gửi qua email</div>
              </div>
              <div class="pad" style="padding-top:0">
                <div class="card boarding">${route}<div class="rows" style="margin-top:10px"><div class="r"><span>Khởi hành</span><span>${b.dep} · 15/10/2026</span></div><div class="r"><span>Hành khách</span><span>NGUYỄN MINH ANH</span></div></div></div>
                ${b.policies.length ? `<div class="card receipt">${b.policies.map(c.policyRow).join('')}</div>` : ''}
                ${c.owns('medical') ? '' : `<div class="xsell"><div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Chuẩn bị cho chuyến đi Đà Nẵng</div>${c.xsCard('medical', 'Sau đặt vé')}</div>`}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
          </div>`;
        },
      };
    },

    actions: (c) => ({
      pickFlight: (d) => { c.S.flight = Number(d.i); c.S.delay = false; c.S.bag = false; c.go('pax'); },
      toggleDelay: () => { c.S.delay = !c.S.delay; c.render(true); },
      toggleBag: () => { c.S.bag = !c.S.bag; c.render(true); },
      pay: () => {
        const { S } = c;
        const fl = FLIGHTS[S.flight];
        const total = fl.price + TAX + addons(S);
        c.processing('Đang xuất vé…', () => {
          const policies = [];
          if (S.delay) policies.push(c.createPolicy('delay', 0, 'Trang đặt vé'));
          if (S.bag) policies.push(c.createPolicy('baggage', 0, 'Trang đặt vé'));
          S.booking = { pnr: `TD${c.rnd(6)}`, dep: fl.dep, total, policies };
          S.delay = false; S.bag = false;
          S.stack = [];
          S.screen = 'ticket';
          c.render();
        });
      },
    }),
  });
})();

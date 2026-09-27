/* Xe Demo – đặt xe có bảo hiểm chuyến đi nhúng, gợi ý bảo hiểm sau chuyến. */
(function () {
  'use strict';

  // [THAY] sản phẩm, phí, quyền lợi minh họa
  const PRODUCTS = {
    trip: {
      name: 'Bảo hiểm Chuyến đi', short: 'Chuyến đi', icon: 'shield', color: '#00A36C',
      tagline: 'Bảo vệ hành khách suốt chuyến xe',
      offerText: 'Bảo vệ bạn trước tai nạn trong chuyến xe này', badge: 'Chỉ 2.000đ/chuyến',
      plans: [{ name: 'Theo chuyến', premium: 2000, coverage: 20000000, term: 1 }],
      benefits: ['Chi phí điều trị do tai nạn trong chuyến đi', 'Trợ cấp nằm viện', 'Bồi thường tử vong, thương tật do tai nạn'],
    },
    accident: {
      name: 'Bảo hiểm Tai nạn cá nhân', short: 'Tai nạn cá nhân', icon: 'heart', color: '#2B5BFF',
      tagline: 'Bảo vệ 24/7 cho mọi chuyến đi trong năm',
      badge: 'Từ 99.000đ/năm',
      plans: [{ name: 'Cơ bản', premium: 99000, coverage: 100000000, term: 365 }, { name: 'Nâng cao', premium: 189000, coverage: 200000000, term: 365 }],
      benefits: ['Chi phí y tế do tai nạn, không giới hạn phương tiện', 'Bồi thường tử vong, thương tật toàn bộ vĩnh viễn', 'Yêu cầu bồi thường ngay trong app'],
    },
    goods: {
      name: 'Bảo hiểm Hàng hóa giao nhận', short: 'Hàng hóa', icon: 'bag', color: '#F59E0B',
      tagline: 'Bồi thường khi hàng gửi bị hư hỏng, thất lạc',
      badge: 'Chỉ 5.000đ/đơn',
      plans: [{ name: 'Theo đơn', premium: 5000, coverage: 5000000, term: 7 }],
      benefits: ['Bồi thường theo giá trị khai báo khi thất lạc', 'Bồi thường hàng móp méo, vỡ khi giao', 'Xử lý theo dữ liệu đơn giao, không cần giấy tờ'],
    },
  };
  const PLACES = [
    { id: 'office', name: 'Công ty', addr: 'Tòa nhà Demo, 23 Láng Hạ', km: 5.8, min: 18 },
    { id: 'airport', name: 'Sân bay', addr: 'Nhà ga T1, Sân bay Nội Bài', km: 26.4, min: 42 },
    { id: 'home', name: 'Nhà', addr: '12 Nguyễn Trãi, Thanh Xuân', km: 3.2, min: 11 },
  ];
  const RIDES = [
    { id: 'bike', name: 'Xe máy', icon: 'bike', perKm: 5500, base: 12000, note: '1 người' },
    { id: 'car', name: 'Ô tô 4 chỗ', icon: 'car', perKm: 11500, base: 25000, note: 'Tối đa 4 người' },
  ];
  const fare = (S) => {
    const r = RIDES.find((x) => x.id === S.ride);
    return Math.round((r.base + r.perKm * S.place.km) / 1000) * 1000;
  };
  const addonPremium = (c) => (c.S.addon ? PRODUCTS.trip.plans[0].premium : 0);

  DemoKit.createApp({
    appName: 'Xe Demo',
    provider: 'Bảo hiểm Đối tác (demo)',
    start: 'home',
    insurancePay: 'direct',
    theme: { '--p': '#00A36C', '--pd': '#047857', '--ac': '#FACC15', '--soft': '#E8F8F1', '--hero': 'linear-gradient(160deg, #047857 0%, #00A36C 100%)' },
    customer: { name: 'NGUYỄN MINH ANH', dob: '08/03/1994', phone: '0912 *** 686' },
    autofillText: 'Tự động điền từ tài khoản Xe Demo – không cần nhập lại',
    products: PRODUCTS,
    state: () => ({ place: PLACES[0], ride: 'bike', addon: false, trip: null }),
    payAmount: (c) => fare(c.S) + addonPremium(c),
    onPaid: () => {},

    screens: (c) => {
      const { S, svg, esc, vnd } = c;
      return {
        home: () => `
          <div class="scr fade">
            <div class="body">
              <div class="map">
                <div class="map-road r1"></div><div class="map-road r2"></div><div class="map-road r3"></div>
                <span class="map-me">${svg('pin', 30)}</span>
                <div class="map-top"><div class="avatar">MA</div><div class="logo-chip">XD</div></div>
              </div>
              <div class="pad ride-sheet">
                <div class="where">${svg('search', 18)} Bạn muốn đi đâu?</div>
                ${PLACES.map((p) => `<button class="place" data-act="pickPlace" data-id="${p.id}"><span class="pl-ic">${svg('pin', 18)}</span><span style="flex:1"><b>${esc(p.name)}</b><small>${esc(p.addr)}</small></span><span class="pl-km">${String(p.km).replace('.', ',')} km</span></button>`).join('')}
                <div class="quick" style="margin-top:12px">
                  <button class="q-item" data-act="pickPlace" data-id="office"><span class="q-ic">${svg('bike', 24)}</span>Xe máy</button>
                  <button class="q-item" data-act="pickPlace" data-id="airport"><span class="q-ic">${svg('car', 24)}</span>Ô tô</button>
                  <button class="q-item" data-act="toast"><span class="q-ic">${svg('bag', 24)}</span>Giao hàng</button>
                  <button class="q-item" data-act="go" data-to="hub"><span class="q-ic">${svg('shield', 24)}</span>Bảo hiểm</button>
                </div>
              </div>
            </div>
          </div>`,

        confirm: () => {
          const f = fare(S);
          const prem = addonPremium(c);
          return `
          <div class="scr">
            ${c.nav('Xác nhận chuyến đi')}
            <div class="body pad">
              <div class="card route">
                <div class="rt"><i class="dot a"></i><span><small>Điểm đón</small><b>Vị trí hiện tại · 12 Nguyễn Trãi</b></span></div>
                <div class="rt"><i class="dot b"></i><span><small>Điểm đến</small><b>${esc(S.place.name)} · ${esc(S.place.addr)}</b></span></div>
                <div class="rt-meta">${String(S.place.km).replace('.', ',')} km · khoảng ${S.place.min} phút</div>
              </div>
              <div class="rides">${RIDES.map((r) => `<button class="ride ${S.ride === r.id ? 'on' : ''}" data-act="pickRide" data-id="${r.id}"><span class="rd-ic">${svg(r.icon, 26)}</span><span style="flex:1"><b>${r.name}</b><small>${r.note}</small></span><b>${vnd(Math.round((r.base + r.perKm * S.place.km) / 1000) * 1000)}</b></button>`).join('')}</div>
              ${c.offer('trip', S.addon, 'toggleAddon')}
              <div class="card" style="margin-top:12px"><div class="rows">
                <div class="r"><span>Thanh toán</span><span>Ví liên kết</span></div>
                <div class="r"><span>Cước chuyến đi</span><span>${vnd(f)}</span></div>
                ${prem ? `<div class="r"><span>Bảo hiểm chuyến đi</span><span>${vnd(prem)}</span></div>` : ''}
                <div class="r total"><span>Tổng</span><span>${vnd(f + prem)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="book">Đặt xe · ${vnd(f + prem)}</button></div>
          </div>`;
        },

        trip: () => {
          const t = S.trip;
          const r = RIDES.find((x) => x.id === t.ride);
          return `
          <div class="scr fade">
            <div class="body">
              <div class="map short">
                <div class="map-road r1"></div><div class="map-road r2"></div>
                <span class="map-car">${svg(r.icon, 26)}</span>
              </div>
              <div class="pad ride-sheet">
                <div class="lbl">Đang di chuyển tới ${esc(t.place.name)}</div>
                <div class="card driver"><div class="avatar">TB</div><span style="flex:1"><b>Trần Văn B</b><small>${r.name} · 29A1-234.56 · ${svg('star', 12)} 4,9</small></span><button class="icon-btn" data-act="toast" data-msg="Chức năng chỉ minh họa">${svg('phone', 20)}</button></div>
                ${t.policy ? c.policyRow(t.policy) : '<div class="note-box">Chuyến đi này chưa có bảo hiểm.</div>'}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="arrive">Đến nơi (demo)</button></div>
          </div>`;
        },

        done: () => {
          const t = S.trip;
          const xs = ['accident', 'goods'].filter((id) => !c.owns(id));
          return `
          <div class="scr fade">
            <div class="body">
              <div class="succ-hero">
                <div class="succ-check">${svg('check', 38, 3.2)}</div>
                <div class="succ-t">Bạn đã đến nơi</div>
                <div class="succ-a">${vnd(t.total)}</div>
                <div class="succ-d">${esc(t.place.name)} · ${c.tstr(t.time)} · ${c.dstr(t.time)}</div>
              </div>
              <div class="pad" style="padding-top:0">
                <div class="card receipt">
                  <div class="rows">
                    <div class="r"><span>Mã chuyến</span><span>${t.code}</span></div>
                    <div class="r"><span>Cước</span><span>${vnd(t.fare)}</span></div>
                    ${t.policy ? `<div class="r"><span>Bảo hiểm chuyến đi</span><span>${vnd(PRODUCTS.trip.plans[0].premium)}</span></div>` : ''}
                  </div>
                </div>
                ${xs.length ? `<div class="xsell"><div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Đi lại an tâm cả năm</div>${xs.map((id) => c.xsCard(id, 'Sau chuyến đi')).join('')}</div>` : ''}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="home">Về trang chủ</button></div>
          </div>`;
        },
      };
    },

    actions: (c) => ({
      pickPlace: (d) => { c.S.place = PLACES.find((p) => p.id === d.id); c.S.ride = d.id === 'airport' ? 'car' : 'bike'; c.S.addon = false; c.go('confirm'); },
      pickRide: (d) => { c.S.ride = d.id; c.render(true); },
      toggleAddon: () => { c.S.addon = !c.S.addon; c.render(true); },
      book: () => {
        const { S } = c;
        const f = fare(S);
        const prem = addonPremium(c);
        c.processing('Đang tìm tài xế gần bạn…', () => {
          S.trip = { place: S.place, ride: S.ride, fare: f, total: f + prem, code: `XD${c.rnd(8)}`, time: new Date(), policy: prem ? c.createPolicy('trip', 0, 'Màn xác nhận chuyến') : null };
          S.addon = false;
          S.stack = [];
          S.screen = 'trip';
          c.render();
        });
      },
      arrive: () => { c.S.trip.time = new Date(); c.S.stack = []; c.S.screen = 'done'; c.render(); },
    }),
  });
})();

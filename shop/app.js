/* Shop Demo – trang sản phẩm → giỏ hàng → checkout có bảo hiểm nhúng. */
(function () {
  'use strict';

  const PRICE = 12990000;
  const SHIP = 25000;
  // [THAY] sản phẩm, phí, quyền lợi minh họa
  const PRODUCTS = {
    warranty: {
      name: 'Bảo hành mở rộng 12 tháng', short: 'Bảo hành mở rộng', icon: 'shield', color: '#2B5BFF',
      tagline: 'Sửa chữa miễn phí sau khi hết bảo hành hãng',
      offerText: 'Kéo dài bảo hành cho chiếc điện thoại trong giỏ', badge: '5% giá máy',
      plans: [{ name: '12 tháng', premium: 649000, coverage: PRICE, term: 365 }],
      benefits: ['Sửa chữa lỗi phần cứng sau khi hết bảo hành hãng', 'Linh kiện chính hãng, không giới hạn số lần sửa', 'Đổi máy mới nếu không sửa được'],
    },
    shipping: {
      name: 'Bảo hiểm vận chuyển', short: 'Vận chuyển', icon: 'truck', color: '#F59E0B',
      tagline: 'Bồi thường khi hàng hư hỏng, thất lạc trên đường giao',
      offerText: 'Bảo vệ đơn hàng trên đường giao tới bạn', badge: 'Chỉ 15.000đ/đơn',
      plans: [{ name: 'Theo đơn', premium: 15000, coverage: PRICE, term: 30 }],
      benefits: ['Bồi thường toàn bộ giá trị nếu thất lạc', 'Bồi thường khi hàng móp méo, vỡ khi nhận', 'Xử lý theo dữ liệu vận đơn, không cần giấy tờ'],
    },
    drop: {
      name: 'Bảo hiểm Rơi vỡ điện thoại', short: 'Rơi vỡ', icon: 'phone', color: '#7B5CFF',
      tagline: 'Chi trả sửa, thay máy khi rơi vỡ, vào nước',
      offerText: 'Bảo vệ chiếc điện thoại mới', badge: 'Từ 199.000đ',
      plans: [{ name: '6 tháng', premium: 199000, coverage: PRICE, term: 180 }, { name: '12 tháng', premium: 349000, coverage: PRICE, term: 365 }],
      benefits: ['Sửa hoặc thay màn hình, vỏ máy khi rơi vỡ', 'Chi trả khi máy vào nước', 'Yêu cầu bồi thường ngay trong app'],
    },
  };
  const premium = (id) => PRODUCTS[id].plans[0].premium;

  DemoKit.createApp({
    appName: 'Shop Demo',
    provider: 'Bảo hiểm Đối tác (demo)',
    start: 'pdp',
    insurancePay: 'direct',
    theme: { '--p': '#F2542D', '--pd': '#C2410C', '--ac': '#F59E0B', '--soft': '#FFF1EC', '--hero': 'linear-gradient(160deg, #C2410C 0%, #F2542D 100%)' },
    customer: { name: 'NGUYỄN MINH ANH', dob: '08/03/1994', phone: '0912 *** 686' },
    autofillText: 'Tự động điền từ tài khoản Shop Demo – không cần nhập lại',
    products: PRODUCTS,
    state: () => ({ inCart: false, warranty: false, shipIns: false, order: null }),
    payAmount: () => 0,
    onPaid: () => {},

    screens: (c) => {
      const { S, svg, esc, vnd } = c;
      return {
        pdp: () => `
          <div class="scr fade">
            <div class="body">
              <div class="s-top">
                <div class="s-search">${svg('search', 18)}<span>Tìm trên Shop Demo</span></div>
                <button class="icon-btn s-cart" data-act="go" data-to="cart" aria-label="Giỏ hàng">${svg('cart', 22)}${S.inCart ? '<span class="s-badge">1</span>' : ''}</button>
              </div>
              <div class="pdp-img"><div class="pdp-phone"><div class="pdp-cam"></div></div><span class="pdp-sale">-8%</span></div>
              <div class="pad">
                <div class="pdp-name">Điện thoại Demo X 128GB</div>
                <div class="pdp-rate">${svg('star', 14)} 4,9 · Đã bán 12,3k</div>
                <div class="pdp-price">${vnd(PRICE)} <s>${vnd(14090000)}</s></div>
                <div class="card">
                  <div class="perk">${svg('truck', 18)} Giao nhanh 2 giờ · ${vnd(SHIP)}</div>
                  <div class="perk">${svg('shield', 18)} Có bảo hành mở rộng 12 tháng khi mua</div>
                  <div class="perk">${svg('tag', 18)} Trả góp 0% qua thẻ tín dụng</div>
                </div>
              </div>
            </div>
            <div class="footer"><div class="btn-row"><button class="btn soft" data-act="addCart">${svg('cart', 18)} Thêm vào giỏ</button><button class="btn primary" data-act="buyNow">Mua ngay</button></div></div>
          </div>`,

        cart: () => {
          const w = S.warranty ? premium('warranty') : 0;
          return `
          <div class="scr">
            ${c.nav('Giỏ hàng')}
            <div class="body pad">
              <div class="card ci"><div class="ci-img"><div class="pdp-phone sm"></div></div><div style="flex:1"><div class="ci-name">Điện thoại Demo X 128GB</div><div class="ci-var">Màu Xanh · 128GB</div><div class="ci-price">${vnd(PRICE)}</div></div><div class="ci-qty">x1</div></div>
              ${c.owns('warranty') ? '' : c.offer('warranty', S.warranty, 'toggleWarranty')}
              <div class="card" style="margin-top:12px"><div class="rows">
                <div class="r"><span>Tạm tính</span><span>${vnd(PRICE)}</span></div>
                ${w ? `<div class="r"><span>Bảo hành mở rộng</span><span>${vnd(w)}</span></div>` : ''}
                <div class="r total"><span>Tổng</span><span>${vnd(PRICE + w)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="go" data-to="checkout">Thanh toán</button></div>
          </div>`;
        },

        checkout: () => {
          const w = S.warranty ? premium('warranty') : 0;
          const si = S.shipIns ? premium('shipping') : 0;
          const total = PRICE + w + SHIP + si;
          return `
          <div class="scr">
            ${c.nav('Thanh toán')}
            <div class="body pad">
              <div class="card box"><div class="lbl">${svg('house', 16)} Địa chỉ nhận hàng</div><b>NGUYỄN MINH ANH · 0912 *** 686</b><span class="muted">12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM</span></div>
              <div class="card box"><div class="lbl">${svg('truck', 16)} Vận chuyển</div><div class="r2"><span>Giao nhanh 2 giờ</span><b>${vnd(SHIP)}</b></div></div>
              ${c.offer('shipping', S.shipIns, 'toggleShip')}
              <div class="card box" style="margin-top:12px"><div class="lbl">${svg('wallet', 16)} Phương thức thanh toán</div><div class="r2"><span>Ví điện tử đã liên kết</span><b>Mặc định</b></div></div>
              <div class="card"><div class="rows">
                <div class="r"><span>Tiền hàng</span><span>${vnd(PRICE)}</span></div>
                ${w ? `<div class="r"><span>Bảo hành mở rộng</span><span>${vnd(w)}</span></div>` : ''}
                <div class="r"><span>Phí vận chuyển</span><span>${vnd(SHIP)}</span></div>
                ${si ? `<div class="r"><span>Bảo hiểm vận chuyển</span><span>${vnd(si)}</span></div>` : ''}
                <div class="r total"><span>Tổng thanh toán</span><span>${vnd(total)}</span></div>
              </div></div>
            </div>
            <div class="footer"><button class="btn primary" data-act="placeOrder">Đặt hàng · ${vnd(total)}</button></div>
          </div>`;
        },

        order: () => {
          const o = S.order;
          return `
          <div class="scr fade">
            <div class="body">
              <div class="succ-hero">
                <div class="succ-check">${svg('check', 38, 3.2)}</div>
                <div class="succ-t">Đặt hàng thành công</div>
                <div class="succ-a">${vnd(o.total)}</div>
                <div class="succ-d">Mã đơn ${o.code} · Dự kiến giao trong 2 giờ</div>
              </div>
              <div class="pad" style="padding-top:0">
                ${o.policies.length ? `<div class="card receipt">${o.policies.map(c.policyRow).join('')}</div>` : ''}
                ${c.owns('drop') ? '' : `<div class="xsell"><div class="xs-h"><span class="spark">${svg('spark', 18)}</span>Bảo vệ chiếc điện thoại mới</div>${c.xsCard('drop', 'Sau đặt hàng')}</div>`}
              </div>
            </div>
            <div class="footer"><button class="btn primary" data-act="home">Tiếp tục mua sắm</button></div>
          </div>`;
        },
      };
    },

    actions: (c) => ({
      addCart: () => { c.S.inCart = true; c.toast('Đã thêm vào giỏ hàng'); c.render(true); },
      buyNow: () => { c.S.inCart = true; c.go('cart'); },
      toggleWarranty: () => { c.S.warranty = !c.S.warranty; c.render(true); },
      toggleShip: () => { c.S.shipIns = !c.S.shipIns; c.render(true); },
      placeOrder: () => {
        const { S } = c;
        const w = S.warranty && !c.owns('warranty') ? premium('warranty') : 0;
        const si = S.shipIns ? premium('shipping') : 0;
        c.processing('Đang đặt hàng…', () => {
          const policies = [];
          if (w) policies.push(c.createPolicy('warranty', 0, 'Giỏ hàng'));
          if (si) policies.push(c.createPolicy('shipping', 0, 'Trang thanh toán'));
          S.order = { code: `DH${c.rnd(9)}`, total: PRICE + w + SHIP + si, policies };
          S.inCart = false; S.warranty = false; S.shipIns = false;
          S.stack = [];
          S.screen = 'order';
          c.render();
        });
      },
    }),
  });
})();

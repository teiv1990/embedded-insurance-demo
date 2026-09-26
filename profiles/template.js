/*
 * PROFILE MẪU – dùng làm khung để tạo đối tác mới.
 * Copy file này thành profiles/<ma-doi-tac>.js, đổi id (dòng dưới) + nội dung,
 * rồi thêm <script src="profiles/<ma-doi-tac>.js"></script> trong index.html.
 */
(window.PROFILES = window.PROFILES || {})['template'] = {
  id: 'template',
  name: 'Ngân hàng Mẫu (template)',
  appName: 'Mẫu Mobile',
  logoText: 'BANK',

  theme: {
    primary: '#0B7A55',
    primaryDark: '#075239',
    accent: '#F5B21B',
    soft: '#E7F5EF',
    hero: 'linear-gradient(160deg, #075239 0%, #0B7A55 60%, #19A06F 100%)'
  },

  customer: {
    name: 'TRẦN THỊ MAI',
    initials: 'TM',
    account: '0301 2233 4455',
    accountType: 'Tài khoản thanh toán',
    balance: 23400000,
    phone: '0912 *** 456',
    idNumber: '001******789',
    dob: '03/09/1994'
  },

  transfer: {
    method: 'Chuyển nhanh 24/7',
    fee: 0,
    defaultNote: 'TRAN THI MAI chuyen khoan'
  },

  banks: [
    { code: 'BANK', name: 'Ngân hàng Mẫu' },
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'MB', name: 'MB Bank' }
  ],

  contacts: [
    { name: 'NGUYEN HOANG LONG', bank: 'VCB', account: '0011002233445' },
    { name: 'DO THI THANH', bank: 'MB', account: '0987654321' }
  ],

  insurance: {
    provider: 'Bảo hiểm Đối tác',
    distributorNote: 'Phân phối qua Mẫu Mobile',
    placements: {
      home:    { enabled: true, productId: 'cyber' },
      confirm: { enabled: true, productId: 'cyber', minAmount: 1000000, defaultChecked: true }, // chỉ hiện khi chuyển >= 1 triệu
      success: { enabled: true, productIds: ['accident'] }
    },
    products: {
      cyber: {
        name: 'Bảo hiểm Giao dịch an toàn',
        short: 'Giao dịch an toàn',
        icon: 'shield',
        color: '#0EA5E9',
        tagline: 'Bồi thường khi bị lừa đảo chuyển tiền',
        offerText: 'Bảo vệ khoản chuyển này nếu bạn bị lừa đảo',
        badge: 'Chỉ 3.000đ',
        plans: [
          { name: 'Theo giao dịch', premium: 3000, coverage: 10000000, term: 7 },
          { name: 'Tháng', premium: 12000, coverage: 30000000, term: 30 }
        ],
        benefits: [
          'Bồi thường tiền bị chiếm đoạt do lừa đảo',
          'Hỗ trợ khôi phục tài khoản',
          'Bồi thường online nhanh chóng'
        ]
      },
      accident: {
        name: 'Bảo hiểm Tai nạn',
        short: 'Tai nạn',
        icon: 'activity',
        color: '#F97316',
        tagline: 'Chi trả tới 50 triệu khi gặp tai nạn',
        badge: 'Từ 25.000đ/năm',
        plans: [
          { name: 'Cơ bản', premium: 25000, coverage: 25000000, term: 365 },
          { name: 'Nâng cao', premium: 50000, coverage: 50000000, term: 365 }
        ],
        benefits: [
          'Tử vong / thương tật do tai nạn',
          'Chi phí y tế do tai nạn'
        ]
      }
    }
  }
};

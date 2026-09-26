/*
 * PROFILE DEMO: InsureX (trung tính)
 * Dùng cho landing page InsureX – không mang thương hiệu ngân hàng có thật.
 */
(window.PROFILES = window.PROFILES || {})['insurex'] = {
  id: 'insurex',
  name: 'Ngân hàng Số (demo)',
  appName: 'Digital Bank',
  logoText: 'DB',

  theme: {
    primary: '#2B5BFF',
    primaryDark: '#1A2C8F',
    accent: '#12D6DF',
    soft: '#EDF1FF',
    hero: 'linear-gradient(160deg, #1A2C8F 0%, #2B5BFF 55%, #7B5CFF 100%)'
  },

  customer: {
    name: 'NGUYỄN MINH ANH',
    initials: 'MA',
    account: '88886868',
    accountType: 'Tài khoản thanh toán',
    balance: 42500000,
    phone: '0912 *** 686',
    idNumber: '001******456',
    dob: '08/03/1994'
  },

  transfer: {
    method: 'Chuyển nhanh 24/7',
    fee: 0,
    defaultNote: 'NGUYEN MINH ANH chuyen tien'
  },

  banks: [
    { code: 'DB', name: 'Digital Bank (demo)' },
    { code: 'VCB', name: 'Vietcombank – Ngoại thương' },
    { code: 'TCB', name: 'Techcombank – Kỹ thương' },
    { code: 'BIDV', name: 'BIDV – Đầu tư và Phát triển' },
    { code: 'CTG', name: 'VietinBank – Công thương' },
    { code: 'MB', name: 'MB – Quân đội' },
    { code: 'ACB', name: 'ACB – Á Châu' },
    { code: 'VPB', name: 'VPBank – Việt Nam Thịnh Vượng' }
  ],

  contacts: [
    { name: 'TRAN THU HANG', bank: 'VCB', account: '0071000654321' },
    { name: 'LE QUANG HUY', bank: 'DB', account: '66668888' },
    { name: 'PHAM NGOC LAN', bank: 'TCB', account: '19031122334' }
  ],

  insurance: {
    provider: 'InsureX',
    distributorNote: 'Cung cấp bởi InsureX · Bản demo',

    placements: {
      home:    { enabled: true, productId: 'health' },
      confirm: { enabled: true, productId: 'cyber', minAmount: 0, defaultChecked: false },
      success: { enabled: true, productIds: ['accident', 'health'] }
    },

    products: {
      cyber: {
        name: 'Bảo hiểm An toàn giao dịch',
        short: 'An toàn giao dịch',
        icon: 'shield',
        color: '#2B5BFF',
        tagline: 'Bồi thường khi bị lừa đảo, chiếm đoạt tài khoản ngân hàng',
        offerText: 'Bảo vệ khoản chuyển này trước lừa đảo trực tuyến trong 30 ngày',
        badge: 'Chỉ 5.000đ',
        plans: [
          { name: 'Cơ bản', premium: 5000, coverage: 20000000, term: 30 },
          { name: 'Nâng cao', premium: 15000, coverage: 50000000, term: 30 },
          { name: 'Toàn diện', premium: 99000, coverage: 100000000, term: 365 }
        ],
        benefits: [
          'Bồi thường tiền bị chiếm đoạt do lừa đảo, giả mạo',
          'Bồi thường giao dịch trái phép khi mất điện thoại, lộ OTP',
          'Hỗ trợ chi phí pháp lý và khôi phục tài khoản',
          'Bồi thường online nhanh chóng'
        ]
      },
      accident: {
        name: 'Bảo hiểm Tai nạn cá nhân 24/7',
        short: 'Tai nạn 24/7',
        icon: 'activity',
        color: '#F97316',
        tagline: 'Chi trả tới 100 triệu khi gặp tai nạn, mọi lúc mọi nơi',
        badge: 'Từ 30.000đ/năm',
        plans: [
          { name: 'Đồng', premium: 30000, coverage: 30000000, term: 365 },
          { name: 'Bạc', premium: 60000, coverage: 60000000, term: 365 },
          { name: 'Vàng', premium: 100000, coverage: 100000000, term: 365 }
        ],
        benefits: [
          'Tử vong / thương tật toàn bộ vĩnh viễn do tai nạn: chi trả 100% số tiền bảo hiểm',
          'Thương tật bộ phận: chi trả theo tỷ lệ thương tật',
          'Chi phí y tế điều trị do tai nạn',
          'Hiệu lực ngay sau khi thanh toán'
        ]
      },
      health: {
        name: 'Bảo hiểm Sức khỏe An Tâm',
        short: 'Sức khỏe An Tâm',
        icon: 'heart',
        color: '#7B5CFF',
        tagline: 'Nội trú, ngoại trú, bảo lãnh viện phí tại nhiều bệnh viện',
        badge: 'Từ 2.900đ/ngày',
        plans: [
          { name: 'Cơ bản', premium: 1050000, coverage: 100000000, term: 365 },
          { name: 'Nâng cao', premium: 2350000, coverage: 300000000, term: 365 },
          { name: 'Cao cấp', premium: 4800000, coverage: 1000000000, term: 365 }
        ],
        benefits: [
          'Điều trị nội trú: viện phí, phẫu thuật, phòng bệnh',
          'Điều trị ngoại trú (tùy gói)',
          'Bảo lãnh viện phí tại bệnh viện liên kết',
          'Tự động điền thông tin từ hồ sơ ngân hàng – mua trong 30 giây'
        ]
      }
    }
  }
};

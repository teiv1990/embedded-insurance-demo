/*
 * PROFILE DEMO: ACB
 * Mỗi đối tác ngân hàng = 1 file trong thư mục profiles/.
 * Muốn thêm đối tác mới: copy file này, đổi id + nội dung, rồi thêm 1 dòng <script> trong index.html.
 */
(window.PROFILES = window.PROFILES || {})['acb'] = {
  id: 'acb',
  name: 'ACB – Ngân hàng TMCP Á Châu',
  appName: 'ACB ONE',
  logoText: 'ACB',

  theme: {
    primary: '#1B3C8C',
    primaryDark: '#0F2766',
    accent: '#2EA3F2',
    soft: '#EAF1FB',
    hero: 'linear-gradient(160deg, #0F2766 0%, #1B3C8C 55%, #2A63C8 100%)'
  },

  customer: {
    name: 'NGUYỄN VĂN AN',
    initials: 'NA',
    account: '19283746',
    accountType: 'Tài khoản thanh toán',
    balance: 58650000,
    phone: '0909 *** 868',
    idNumber: '079******123',
    dob: '12/05/1990'
  },

  transfer: {
    method: 'Chuyển nhanh NAPAS 247',
    fee: 0,
    defaultNote: 'NGUYEN VAN AN chuyen tien'
  },

  banks: [
    { code: 'ACB', name: 'ACB – Á Châu' },
    { code: 'VCB', name: 'Vietcombank – Ngoại thương' },
    { code: 'TCB', name: 'Techcombank – Kỹ thương' },
    { code: 'BIDV', name: 'BIDV – Đầu tư và Phát triển' },
    { code: 'CTG', name: 'VietinBank – Công thương' },
    { code: 'MB', name: 'MB – Quân đội' },
    { code: 'VPB', name: 'VPBank – Việt Nam Thịnh Vượng' },
    { code: 'TPB', name: 'TPBank – Tiên Phong' },
    { code: 'STB', name: 'Sacombank – Sài Gòn Thương Tín' },
    { code: 'VIB', name: 'VIB – Quốc tế' }
  ],

  contacts: [
    { name: 'TRAN THI BICH NGOC', bank: 'VCB', account: '0071000123456' },
    { name: 'LE MINH QUAN', bank: 'ACB', account: '24681357' },
    { name: 'PHAM THU HA', bank: 'TCB', account: '19036677889' },
    { name: 'CONG TY TNHH AN PHAT', bank: 'BIDV', account: '31410001234567' }
  ],

  insurance: {
    provider: 'Bảo hiểm Đối tác',          // Tên công ty bảo hiểm hiển thị trong app
    distributorNote: 'Phân phối qua ACB ONE',

    // Điểm chạm hiển thị bảo hiểm trong luồng giao dịch
    placements: {
      home:    { enabled: true, productId: 'health' },                 // Banner ở trang chủ
      confirm: { enabled: true, productId: 'cyber', minAmount: 0, defaultChecked: false }, // Opt-in ở màn xác nhận
      success: { enabled: true, productIds: ['accident', 'health'] }  // Cross-sell sau giao dịch
    },

    products: {
      cyber: {
        name: 'Bảo hiểm An toàn giao dịch',
        short: 'An toàn giao dịch',
        icon: 'shield',
        color: '#0EA5E9',
        tagline: 'Bồi thường khi bị lừa đảo, chiếm đoạt tài khoản ngân hàng',
        offerText: 'Bảo vệ tài khoản trước lừa đảo trực tuyến trong 30 ngày',
        badge: 'Chỉ 5.000đ',
        plans: [
          { name: 'Cơ bản', premium: 5000, coverage: 20000000, term: 30 },
          { name: 'Nâng cao', premium: 15000, coverage: 50000000, term: 30 },
          { name: 'Toàn diện', premium: 99000, coverage: 100000000, term: 365 }
        ],
        benefits: [
          'Bồi thường tiền bị chiếm đoạt do lừa đảo, giả mạo (phishing, cuộc gọi giả danh)',
          'Bồi thường giao dịch trái phép khi mất điện thoại, lộ OTP',
          'Hỗ trợ chi phí pháp lý và khôi phục tài khoản',
          'Hotline hỗ trợ 24/7, bồi thường online trong 5 ngày làm việc'
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
          'Hiệu lực ngay sau khi thanh toán, không cần khám sức khỏe'
        ]
      },
      health: {
        name: 'Bảo hiểm Sức khỏe An Tâm',
        short: 'Sức khỏe An Tâm',
        icon: 'heart',
        color: '#E11D48',
        tagline: 'Nội trú, ngoại trú, bảo lãnh viện phí tại 300+ bệnh viện',
        badge: 'Từ 2.900đ/ngày',
        plans: [
          { name: 'Cơ bản', premium: 1050000, coverage: 100000000, term: 365 },
          { name: 'Nâng cao', premium: 2350000, coverage: 300000000, term: 365 },
          { name: 'Cao cấp', premium: 4800000, coverage: 1000000000, term: 365 }
        ],
        benefits: [
          'Điều trị nội trú: viện phí, phẫu thuật, phòng bệnh',
          'Điều trị ngoại trú (tùy gói)',
          'Bảo lãnh viện phí tại hơn 300 bệnh viện, phòng khám',
          'Tự động điền thông tin từ hồ sơ ngân hàng – mua trong 30 giây'
        ]
      }
    }
  }
};

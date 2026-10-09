# Demo Bảo hiểm nhúng trong app ngân hàng

Giao diện điện thoại bấm được thật, mô phỏng luồng **chuyển tiền** của app ngân hàng, có gắn sản phẩm bảo hiểm ở các điểm chạm:

1. **Trang chủ**: banner sản phẩm
2. **Màn xác nhận**: bật thêm bảo hiểm vào giao dịch (opt-in, cộng phí vào tổng tiền)
3. **Màn thành công**: gợi ý sản phẩm sau giao dịch (cross-sell)
4. **Mua 1 chạm**: chọn gói, thông tin tự điền từ hồ sơ ngân hàng, xác thực OTP, nhận Giấy chứng nhận điện tử

## Chạy

```bash
python3 -m http.server 5173
```

Rồi mở http://localhost:5173. Chọn đối tác trực tiếp qua link: `http://localhost:5173/?partner=<ma-doi-tac>`

Hoặc mở thẳng file `index.html` bằng trình duyệt (không cần server).

- **P**: bật/tắt chế độ trình chiếu (ẩn bảng điều khiển)
- Màn OTP: nhập 6 số bất kỳ (gõ được bằng bàn phím máy tính)
- **Làm mới demo**: đưa số dư và luồng về trạng thái ban đầu

## Thêm đối tác mới

1. Copy `profiles/template.js` thành `profiles/<ma-doi-tac>.js`
2. Đổi `id` (ở cả dòng `['...']` lẫn trường `id`), tên, màu, khách hàng, danh bạ, sản phẩm, điểm chạm
3. Thêm dòng sau vào `index.html`, trong khối "PROFILE ĐỐI TÁC":
   ```html
   <script src="profiles/<ma-doi-tac>.js"></script>
   ```

Các trường chính trong profile:

| Trường | Ý nghĩa |
|---|---|
| `theme` | Màu chủ đạo, màu nền phần đầu (`hero`) |
| `customer` | Tên, số tài khoản, số dư, thông tin để tự điền khi mua BH |
| `banks`, `contacts` | Danh sách ngân hàng nhận, người nhận đã lưu |
| `insurance.provider` | Tên công ty bảo hiểm hiển thị trong app |
| `insurance.placements` | Bật/tắt từng điểm chạm, chọn sản phẩm cho mỗi điểm, `minAmount` = số tiền tối thiểu để hiện offer ở màn xác nhận, `defaultChecked` = bật sẵn |
| `insurance.products` | Sản phẩm: tên, icon (`shield`, `heart`, `activity`), màu, các gói (phí, quyền lợi, số ngày hiệu lực), quyền lợi |

## Giao diện riêng theo đối tác (skin)

Mặc định mọi profile dùng chung một bố cục và chỉ đổi màu. Đối tác nào cần bố cục giống app thật thì khai báo `skin` trong profile:

- `profiles/sacombank.js` khai báo `skin: 'sacombank'`, `numberLocale: 'en-US'` và `currencySuffix: 'đ'` để hiện số dạng `5,000đ`.
- `js/skin-sacombank.js` vẽ lại 4 màn Trang chủ, Chuyển tiền, Xác nhận (bảng trượt từ dưới lên) và Xác thực (nhấn xác nhận, không nhập PIN). Các màn còn lại dùng màn hình chung.
- `css/skin-sacombank.css` chứa kiểu dáng của skin.

Thêm skin mới: tạo `js/skin-<tên>.js` đăng ký `window.SKINS['<tên>']`, tạo file CSS tương ứng và nạp cả hai trong `index.html` trước `js/app.js`.

/*
 * PROFILE DEMO: Sacombank – bản bảo hiểm tích sẵn
 * Dùng lại toàn bộ profile "sacombank" (nạp profiles/sacombank.js trước file này), chỉ khác màn xác nhận:
 * công tắc bảo hiểm bật sẵn và không có ô tích đồng ý điều khoản, khách bấm Xác nhận là tham gia.
 */
(function () {
  const p = JSON.parse(JSON.stringify(window.PROFILES['sacombank']));
  p.id = 'sacombank-v2';
  p.name = 'Sacombank – bảo hiểm tích sẵn';

  const c = p.insurance.placements.confirm;
  c.defaultChecked = true;    // công tắc bảo hiểm bật sẵn
  c.consentText = '';         // không hiện ô tích đồng ý
  c.consentDefault = false;

  window.PROFILES[p.id] = p;
})();

// ==UserScript==
// @name         Claude Blue Chat Theme (HP)
// @namespace    https://github.com/HienPhuong99/Theme-Claude
// @version      0.2.1
// @description  Giao diện claude.ai tông xanh kiểu ứng dụng nhắn tin, logo HP.
// @author       HienPhuong99
// @license      MIT
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// @noframes
// @updateURL    https://raw.githubusercontent.com/HienPhuong99/Theme-Claude/main/claude-zalo-theme.user.js
// @downloadURL  https://raw.githubusercontent.com/HienPhuong99/Theme-Claude/main/claude-zalo-theme.user.js
// ==/UserScript==

/*
 * Cách hoạt động: ghi đè các biến màu (CSS custom properties) của claude.ai.
 * Dùng adoptedStyleSheets (không innerHTML, không <style>) nên chạy được với CSP chặt
 * và trong DevTools của app Claude Desktop. Bấm Ctrl+Alt+H để bật/tắt theme.
 */
(function () {
  'use strict';
  window.__hpTheme?.stop?.();

  // Số đo lấy từ bảng màu của Zalo web (11/2026)
  const LIGHT = {
    page: '#ebecf0',    // nền khung chat
    card: '#ffffff',    // sidebar, ô nhập, menu, bong bóng trả lời
    hover: '#f1f2f4',   // di chuột, nền ô tìm kiếm
    selected: '#e5f1ff',// mục đang chọn
    bubble: '#e5f1ff',  // tin nhắn của bạn
    bubbleBorder: 'transparent',
    brand: '#0068ff',
    brandHover: '#005ae0',
    text: '#081b3a',
    text2: '#5a6981',
    muted: '#77859c',
    border: '#d6dbe1',
    rail: '#005ae0',    // cột xanh bên trái
    banner: '#f0f7ff',  // dải trên cùng
  };
  const DARK = {
    page: '#16181c',
    card: '#212428',
    hover: '#2b2f35',
    selected: '#1d3557',
    banner: '#1b2430',
    bubble: '#1d3557',
    bubbleBorder: '#27477a',
    brand: '#3d8bff',
    brandHover: '#5c9dff',
    text: '#e6edf6',
    text2: '#b6c2d1',
    muted: '#8a9bb0',
    border: '#33383f',
    rail: '#123a7a',
  };

  // '#0068ff' -> '216 100% 50%' (claude.ai's older tokens are HSL triplets)
  function hsl(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    let h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = Math.round(h * 60 + 360) % 360;
    }
    return `${h} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
  }

  function vars(p) {
    const v = {
      // hệ màu mới (cds)
      '--cds-page-bg': p.page, '--cds-surface-0': p.page, '--cds-surface-1': p.page,
      '--cds-surface-2': p.card, '--cds-surface-3': p.card,
      '--cds-surface-panel': p.card, '--cds-surface-popover': p.card,
      '--cds-bg-user-message': p.bubble, '--cds-bg-user-message-personal': p.bubble,
      '--cds-text-primary': p.text, '--cds-text-secondary': p.text2, '--cds-text-muted': p.muted,
      '--cds-border': p.border, '--cds-border-strong': p.border,
      '--cds-clay': p.brand, '--cds-clay-emphasized': p.brand,
      '--cds-fill-brand': p.brand, '--cds-fill-brand-hover': p.brandHover,
      '--cds-role-accent-fill': p.brand, '--cds-role-accent-fill-hover': p.brandHover,
      '--cds-fill-accent': p.brand, '--cds-fill-accent-hover': p.brandHover,
      '--cds-text-accent': p.brand,
      // hệ màu cũ (HSL triplet)
      '--bg-000': hsl(p.card), '--bg-100': hsl(p.page), '--bg-200': hsl(p.card),
      '--bg-300': hsl(p.hover), '--bg-400': hsl(p.border), '--bg-500': hsl(p.border),
      '--text-000': hsl(p.text), '--text-100': hsl(p.text),
      '--text-200': hsl(p.text2), '--text-300': hsl(p.text2),
      '--text-400': hsl(p.muted), '--text-500': hsl(p.muted),
      '--accent-brand': hsl(p.brand), '--brand-000': hsl(p.brand),
      '--brand-100': hsl(p.brand), '--brand-200': hsl(p.brandHover),
      '--accent-000': hsl(p.brand), '--accent-100': hsl(p.brand), '--accent-200': hsl(p.brandHover),
      '--accent-900': hsl(p.bubble),
      '--cds-fill-ghost-hover': p.hover, '--cds-fill-ghost-selected': p.selected,
      // biến riêng của theme, dùng ở phần CSS bên dưới
      '--hp-card': p.card, '--hp-border': p.border, '--hp-rail': p.rail,
      '--hp-bubble': p.bubble, '--hp-bubble-border': p.bubbleBorder,
      '--hp-hover': p.hover, '--hp-banner': p.banner, '--hp-selected': p.selected,
      '--hp-text2': p.text2,
    };
    return Object.entries(v).map(([k, val]) => `${k}:${val} !important;`).join('');
  }

  const svg = (bg, fg) => 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${bg}"/>` +
    `<text x="32" y="42" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="${fg}" text-anchor="middle">HP</text></svg>`);
  const AVATAR = svg('#ffffff', '#0068ff');
  // Avatar tròn kiểu danh bạ: bot trả lời và từng cuộc trò chuyện ở thanh bên
  const disc = (bg1, bg2, fg, label, size) => 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>` +
    `<circle cx="32" cy="32" r="32" fill="url(#g)"/><text x="32" y="${32 + size * .36}" font-family="Segoe UI,Arial,sans-serif" ` +
    `font-size="${size}" font-weight="600" fill="${fg}" text-anchor="middle">${label}</text></svg>`);
  const BOT = disc('#4f9bff', '#0068ff', '#fff', 'AI', 26);
  const ROW = disc('#e5f1ff', '#cfe2ff', '#0068ff', '💬', 28);
  // Biểu tượng trang trí trên cột xanh (chỉ là hình nền, không bấm được). Nét viền trắng 1.6px trên lưới 24px.
  const icon = (body, active) => 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">` +
    (active ? `<rect width="48" height="48" rx="6" fill="rgba(0,0,0,.25)"/>` : '') +
    `<g transform="translate(12 12)" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`);
  const ICONS = {
    // bong bóng chat tô trắng, hai vạch xanh (đang chọn)
    chat: '<path fill="#fff" d="M12 3.5c5 0 9 3.4 9 7.6s-4 7.6-9 7.6c-1 0-2-.1-2.9-.4L4.8 20.2l1-3.7C4.1 15.1 3 13.2 3 11.1 3 6.9 7 3.5 12 3.5z"/>' +
          '<path stroke="#0068ff" d="M8.2 9.6h7.6M8.2 12.8h4.8"/>',
    // danh bạ: sổ có gáy, hình người
    contact: '<rect x="5.5" y="3" width="14" height="18" rx="1.8"/><path d="M3.5 7.5h3M3.5 12h3M3.5 16.5h3"/>' +
             '<circle cx="12.5" cy="10" r="2.3"/><path d="M8.8 16.6c.6-1.9 2-2.9 3.7-2.9s3.1 1 3.7 2.9"/>',
    // đám mây có mũi tên đồng bộ
    cloud: '<path d="M7.2 18.5a4.6 4.6 0 0 1-.7-9.1 6 6 0 0 1 11.3-.4 4.8 4.8 0 0 1-.4 9.5z"/>' +
           '<path d="M10 14.6a2.3 2.3 0 0 0 4.2-.4M14 12a2.3 2.3 0 0 0-4.2.4M14.3 15.7v-1.5h-1.5M9.7 10.9v1.5h1.5"/>',
    // thư mục có đám mây nhỏ
    folder: '<path d="M3 7.2A2.2 2.2 0 0 1 5.2 5h3.6l2 2h8a2.2 2.2 0 0 1 2.2 2.2v8.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 17.8z"/>' +
            '<path d="M11.6 17.2a1.9 1.9 0 0 1-.1-3.8 2.7 2.7 0 0 1 5.1.4 1.7 1.7 0 0 1-.2 3.4z"/>',
    // chụp màn hình: khung nét đứt, dấu cộng ở góc
    capture: '<rect x="3.5" y="3.5" width="13.5" height="13.5" rx="1.5" stroke-dasharray="3 2.4"/><path d="M19.5 15.5v5M17 18h5"/>',
    // hộp công cụ
    work: '<rect x="3" y="7.5" width="18" height="12.5" rx="1.8"/><path d="M8.8 7.5V5.6c0-.9.7-1.6 1.6-1.6h3.2c.9 0 1.6.7 1.6 1.6v1.9M3 12.8h18"/>' +
          '<rect x="10.6" y="11.6" width="2.8" height="2.6" rx=".6"/>',
    // bánh răng
    gear: '<path d="M10.3 3h3.4l.5 2.4c.6.2 1.2.6 1.7 1l2.3-.8 1.7 3-1.8 1.6a6.5 6.5 0 0 1 0 2l1.8 1.6-1.7 3-2.3-.8c-.5.4-1.1.8-1.7 1l-.5 2.4h-3.4l-.5-2.4c-.6-.2-1.2-.6-1.7-1l-2.3.8-1.7-3 1.8-1.6a6.5 6.5 0 0 1 0-2L4.1 8.6l1.7-3 2.3.8c.5-.4 1.1-.8 1.7-1z"/>' +
          '<circle cx="12" cy="12" r="2.7"/>',
  };
  // Bố cục: avatar + 2 mục ở trên, 5 mục xếp sát nhau dưới đáy
  const RAIL = [
    `url("${AVATAR}") 8px 14px / 48px 48px`,
    `url("${icon(ICONS.chat, true)}") 8px 80px / 48px 48px`,
    `url("${icon(ICONS.contact)}") 8px 132px / 48px 48px`,
    ...['cloud', 'folder', 'capture', 'work', 'gear'].map((k, i) =>
      `url("${icon(ICONS[k])}") 8px calc(100% - ${12 + (4 - i) * 52}px) / 48px 48px`),
  ].map(l => l + ' no-repeat').join(',\n');

  // claude.ai khai báo lại bảng màu ở nhiều lớp .cds-root lồng nhau, nên phải đặt trên mọi phần tử.
  // ponytail: selector `*` đơn giản nhất; nếu thấy chậm thì thu hẹp về các lớp khai báo biến.
  const css = `
    :root, :root * { ${vars(LIGHT)} }
    html[data-mode="dark"], html[data-mode="dark"] * { ${vars(DARK)} }
    @media (prefers-color-scheme: dark) {
      html[data-mode="system"], html[data-mode="system"] * { ${vars(DARK)} }
    }
    /* Thanh bên: cột xanh 64px bên trái có avatar HP, phần danh sách nền trắng */
    aside.dframe-sidebar {
      background: ${RAIL},
                  linear-gradient(to right, var(--hp-rail) 0 64px, var(--hp-card) 64px) !important;
      padding-left: 64px !important;
    }
    /* Tin nhắn của bạn: bong bóng xanh nhạt có viền */
    [data-engine-native="UserMessage"] .cds-card-fill {
      background: var(--hp-bubble) !important;
      border: 1px solid var(--hp-bubble-border) !important;
      border-radius: 8px !important;
      box-shadow: 0 0 1px rgba(21, 39, 71, .25), 0 1px 2px rgba(21, 39, 71, .1) !important;
    }
    /* Câu trả lời của Claude: bong bóng trắng */
    [data-engine-native="AssistantMessage"] {
      background: var(--hp-card) !important;
      border: 0 !important;
      border-radius: 8px !important;
      padding: 12px !important;
      box-shadow: 0 0 1px rgba(21, 39, 71, .25), 0 1px 2px rgba(21, 39, 71, .1) !important;
    }
    /* Ô tìm kiếm trong thanh bên: xám nhạt bo góc như Zalo */
    aside.dframe-sidebar input {
      background: var(--hp-hover) !important;
      border: 0 !important;
      border-radius: 5px !important;
    }
    aside.dframe-sidebar a { border-radius: 6px !important; }
    /* Dải trên cùng: nền trắng, kẻ mảnh bên dưới như header khung chat Zalo */
    [data-sim-native-ground] {
      background: var(--hp-card) !important;
      border-bottom: 1px solid rgba(0, 0, 0, .15) !important;
    }
    /* Danh sách trò chuyện: dòng cao, avatar tròn bên trái, mục đang mở nền xanh nhạt */
    aside.dframe-sidebar a[href*="/chat/"] {
      display: flex !important; align-items: center !important; gap: 12px !important;
      min-height: 60px !important; padding: 8px 12px !important;
      font-size: 15px !important; color: var(--cds-text-primary) !important;
    }
    aside.dframe-sidebar a[href*="/chat/"]::before {
      content: ""; flex: 0 0 44px; height: 44px; border-radius: 50%;
      background: url("${ROW}") center / cover;
    }
    aside.dframe-sidebar a[href*="/chat/"]:hover { background: var(--hp-hover) !important; }
    aside.dframe-sidebar a[aria-current="page"], aside.dframe-sidebar a[data-active="true"] {
      background: var(--hp-selected) !important;
    }
    /* Câu trả lời có avatar tròn bên trái như tin nhắn đến của Zalo */
    [data-engine-native="AssistantMessage"] {
      position: relative !important; overflow: visible !important;
      margin-left: 48px !important; font-size: 15px !important;
    }
    [data-engine-native="AssistantMessage"]::before {
      content: ""; position: absolute; left: -48px; top: 0; width: 38px; height: 38px;
      border-radius: 50%; background: url("${BOT}") center / cover;
    }
    [data-engine-native="UserMessage"] .cds-card-fill { font-size: 15px !important; }
    /* Ô nhập: phẳng, viền mảnh, viền xanh khi đang gõ */
    div.bg-surface-3 {
      border: 1px solid var(--hp-border) !important; border-radius: 8px !important;
      box-shadow: none !important;
    }
    div.bg-surface-3:focus-within { border-color: var(--cds-fill-brand) !important; }
    /* Thanh cuộn mảnh */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, .2); border-radius: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    /* chữ không chân như app nhắn tin */
    html body, html .font-serif, html .font-claude-response, html [class*="font-claude"] {
      font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    }
  `;

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);

  // Favicon HP (chỉ thấy trên trình duyệt)
  const ICON = svg('#0068ff', '#ffffff');
  function setIcon(on) {
    document.querySelectorAll('link[rel~="icon"]').forEach(l => {
      if (on) { l.dataset.hpOld ??= l.href; l.href = ICON; } else if (l.dataset.hpOld) l.href = l.dataset.hpOld;
    });
  }

  let on = false;
  function toggle(want = !on) {
    on = want;
    const rest = document.adoptedStyleSheets.filter(s => s !== sheet);
    document.adoptedStyleSheets = on ? [...rest, sheet] : rest;
    if (document.head) setIcon(on);
    console.info('%cHP theme: ' + (on ? 'BẬT' : 'TẮT') + ' (Ctrl+Alt+H để đổi)', 'color:#0068ff;font-weight:bold');
  }

  let timer;
  window.__hpTheme = { toggle, stop() { clearInterval(timer); toggle(false); } };
  toggle(true);
  document.addEventListener('DOMContentLoaded', () => setIcon(on));
  // App tự gán lại document.adoptedStyleSheets và làm rơi theme; kiểm tra rồi gắn lại.
  timer = setInterval(() => {
    if (on && !document.adoptedStyleSheets.includes(sheet)) {
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }
  }, 1000);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && !e.shiftKey && e.code === 'KeyH') { e.preventDefault(); toggle(); }
  }, true);
})();

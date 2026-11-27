/* 목회자 가정 지원 — 비밀번호 확인 (견본 사이트 화면 잠금) */
(function () {
  var PASS = '0120';
  var KEY = 'ci-family-unlock';

  var isFamilyPage = document.body.dataset.cat === 'family';
  var params = new URLSearchParams(location.search);
  var id = params.get('id') || '';
  var isFamilyItem = id.indexOf('F-') === 0;
  if (!isFamilyPage && !isFamilyItem) return;
  if (sessionStorage.getItem(KEY) === 'ok') return;

  var css = ''
    + '.gate{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;'
    + 'background:linear-gradient(160deg,#0A1826 0%,#12283c 55%,#1d3550 100%);padding:24px;}'
    + '.gate-card{width:100%;max-width:420px;background:#fff;border-radius:16px;padding:34px 30px 28px;'
    + 'box-shadow:0 24px 60px rgba(0,0,0,.35);text-align:center;font-family:"Pretendard","Noto Sans KR",system-ui,sans-serif;}'
    + '.gate-card .mk{width:52px;height:52px;margin:0 auto 16px;border-radius:50%;background:#0A1826;color:#C9A96A;'
    + 'display:flex;align-items:center;justify-content:center;font-size:22px;}'
    + '.gate-card h2{margin:0 0 6px;font-size:19px;color:#0A1826;letter-spacing:-.02em;}'
    + '.gate-card .sub{margin:0 0 20px;font-size:12.5px;line-height:1.7;color:#5b6773;}'
    + '.gate-card input{width:100%;box-sizing:border-box;padding:12px 14px;font-size:16px;letter-spacing:.35em;'
    + 'text-align:center;border:1px solid #cfd6dd;border-radius:10px;outline:none;color:#0A1826;}'
    + '.gate-card input:focus{border-color:#0A1826;}'
    + '.gate-card button{width:100%;margin-top:12px;padding:12px;font-size:14.5px;font-weight:600;border:0;'
    + 'border-radius:10px;background:#0A1826;color:#fff;cursor:pointer;}'
    + '.gate-card button:hover{background:#14293e;}'
    + '.gate-card .err{min-height:17px;margin:10px 0 0;font-size:12px;color:#c0392b;}'
    + '.gate-card .note{margin:14px 0 0;font-size:11px;color:#93a0ad;line-height:1.6;}'
    + 'body.gate-open{overflow:hidden;}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  document.body.classList.add('gate-open');

  var wrap = document.createElement('div');
  wrap.className = 'gate';
  wrap.innerHTML = ''
    + '<div class="gate-card" role="dialog" aria-modal="true" aria-labelledby="gateTitle">'
    + '<div class="mk">&#128274;</div>'
    + '<h2 id="gateTitle">목회자 가정 지원</h2>'
    + '<p class="sub">개인 정보가 포함된 화면입니다.<br>비밀번호를 입력해 주세요.</p>'
    + '<input id="gateInput" type="password" inputmode="numeric" autocomplete="off" maxlength="12" aria-label="비밀번호">'
    + '<button id="gateBtn" type="button">확인</button>'
    + '<p class="err" id="gateErr"></p>'
    + '<p class="note">견본 사이트의 화면 잠금입니다. 한 번 입력하시면 이 창을 닫을 때까지 유지됩니다.</p>'
    + '</div>';

  function mount() {
    document.body.appendChild(wrap);
    var input = document.getElementById('gateInput');
    var err = document.getElementById('gateErr');
    input.focus();
    function submit() {
      if (input.value.trim() === PASS) {
        sessionStorage.setItem(KEY, 'ok');
        wrap.remove();
        document.body.classList.remove('gate-open');
      } else {
        err.textContent = '비밀번호가 맞지 않습니다.';
        input.value = '';
        input.focus();
      }
    }
    document.getElementById('gateBtn').addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();

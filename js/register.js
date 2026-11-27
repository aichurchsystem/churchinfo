/* 정보 등록 — 분야별 항목 */
(function () {
  const { esc } = UI;
  UI.init('goods');

  const regionSel = document.getElementById('regionSel');
  regionSel.innerHTML += CI.REGIONS.map((r) => `<option value="${r}">${r}</option>`).join('');

  const F = {
    jobs: { sub:['담임·후임','부교역자','파트타임'], extra:[
      ['모집 형태','select',['담임 (청빙)','후임 (위임)','부교역자','교육전도사','파트타임']],
      ['성도 수','text','예) 약 180명'],
      ['사례비','text','예) 월 220만 원 (협의)'],
      ['근무 조건','text','예) 주일 전일 + 주중 3일'],
      ['시작일','date',''],
      ['자격 요건','text','예) 목사 안수, 백석총회 소속']
    ]},
    space: { sub:['매매','임대','양도'], extra:[
      ['거래 형태','select',['매매','임대','양도']],
      ['건물 유형','select',['예배당','교육관','예배당+교육관','주차장','기타']],
      ['면적(평)','text','예) 예배당 120평'],
      ['좌석·주차','text','예) 좌석 130석 · 주차 20대'],
      ['사용 승인','select',['종교시설 사용 승인 완료','변경 예정','미확인']],
      ['가격','text','매매가 또는 보증금/월세'],
      ['열람 가능일','text','예) 평일 오후, 협의']
    ]},
    goods: { sub:['성구','악기','방송장비','차량','기타'], extra:[
      ['물품 분류','select',['성구','악기','방송장비','차량','기타']],
      ['나눔/판매','select',['나눔','판매','양도']],
      ['수량','text','예) 장의자 24개'],
      ['상태','select',['새것','양호','사용감 있음','수리 필요']],
      ['운송 방법','select',['직접 운반','택배 (비용 협의)','방문 수령']],
      ['회수 기한','text','예) 12월 20일까지']
    ]},
    rural: { sub:['농어촌교회 소개','농수산물 정보','교회 간 연결'], extra:[
      ['구분','select',['농어촌교회 소개','농수산물 정보','교회 간 연결']],
      ['품목·내용','text','예) 쌀 20kg, 복분자 가공품'],
      ['출하·진행 시기','text','예) 11월~12월'],
      ['수량·인원','text','예) 100포, 팀당 8명'],
      ['가격','text','확정 전이면 ‘확정 후 게시’로 적어 주세요']
    ]},
    family: { sub:['자녀 교육','결혼 정보','의료비'], extra:[
      ['구분','select',['자녀 교육','결혼 정보','의료비']],
      ['대상','text','예) 목회자 자녀 중·고등학생'],
      ['공개 범위','select',['비공개 (관리자만 확인)','관리자 승인 후 열람']],
      ['상담 희망 시간','text','예) 평일 오후']
    ]},
    groupbuy: { sub:['공동구매','제휴','신청 안내'], extra:[
      ['구분','select',['공동구매','제휴','신청 안내']],
      ['품목','text','예) 화훼, 주보용지'],
      ['참여 규모','text','예) 100개 교회 시범'],
      ['신청 기간','text','예) 확정 후 게시'],
      ['희망 단가','text','협의']
    ]}
  };

  const dyn = document.getElementById('dyn');
  const catSel = document.getElementById('catSel');
  const preset = new URLSearchParams(location.search).get('cat');
  if (preset && F[preset]) catSel.value = preset;

  function draw() {
    const c = F[catSel.value];
    if (!c) { dyn.innerHTML = ''; return; }
    dyn.innerHTML = `
      <div class="frow"><label>세부 분류<em>*</em></label><div class="ctl">
        <select name="sub" required>${c.sub.map((s) => `<option>${s}</option>`).join('')}</select>
      </div></div>
      ${c.extra.map(([lb, type, opt]) => {
        if (type === 'select') {
          return `<div class="frow"><label>${lb}</label><div class="ctl"><select name="x_${lb}">${opt.map((o) => `<option>${o}</option>`).join('')}</select></div></div>`;
        }
        return `<div class="frow"><label>${lb}</label><div class="ctl"><input type="${type}" name="x_${lb}" placeholder="${esc(opt)}"></div></div>`;
      }).join('')}
      <div class="frow" style="background:var(--gold-wash);border-radius:8px;padding:10px 12px;border:1px solid rgba(169,134,63,.2)">
        <label style="color:#7A5E28">안내</label>
        <div class="ctl"><span style="font-size:12px;color:#7A5E28">${catSel.value === 'family'
          ? '결혼 정보는 본인 동의를 받아 등록하며, 관리자 확인 후 비공개로 열람됩니다.'
          : catSel.value === 'groupbuy'
          ? '준비 중인 사업은 모집 일정·품목·가격을 확정 후 게시합니다. 지금은 알림 신청만 받습니다.'
          : '등록된 정보는 관리자 확인 후 공개됩니다. 승인 전에는 등록자와 관리자만 볼 수 있습니다.'}</span></div>
      </div>`;
  }
  catSel.addEventListener('change', draw);
  draw();

  const photos = document.getElementById('photos');
  photos.addEventListener('change', () => {
    const names = Array.from(photos.files).map((f) => f.name).join(', ');
    document.getElementById('photoNames').textContent = names ? `선택한 사진: ${names}` : '';
  });
  const files = document.getElementById('files');
  files.addEventListener('change', () => {
    const names = Array.from(files.files).map((f) => f.name).join(', ');
    document.getElementById('fileNames').textContent = names ? `첨부한 파일: ${names}` : '';
  });

  document.getElementById('regForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const f = e.target;
    const cat = f.cat.value;
    const no = 'CI-2611-' + String(Math.floor(Math.random() * 900) + 100);
    const db = UI.db();
    db.subs.push({ no, cat, sub: f.sub.value, title: f.title.value, church: f.church.value,
      region: f.region.value, name: f.name.value, phone: f.phone.value, date: new Date().toISOString().slice(0, 10), state: 'pending' });
    UI.save(db);

    document.getElementById('regForm').style.display = 'none';
    const box = document.getElementById('regDone');
    box.style.display = 'block';
    box.className = 'done-box';
    box.innerHTML = `<div class="ic">✓</div>
      <h3>등록 신청이 접수되었습니다</h3>
      <p><b>${esc(f.title.value)}</b><br>${esc(f.church.value)} · ${esc(UI.catName(cat))} / ${esc(f.sub.value)}</p>
      <div class="no">접수번호 ${no}</div>
      <p>관리자 확인 후 공개됩니다. 승인 전에는 등록자와 관리자만 확인할 수 있습니다.<br>
      <span style="font-size:11.5px;color:var(--slate-2)">※ 시안 화면으로 실제 서버에는 저장되지 않습니다. (이 브라우저에만 기록)</span></p>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:center">
        <a class="btn btn-navy" href="index.html">첫 화면으로</a>
        <a class="btn btn-line" href="admin.html">관리자 화면에서 확인</a>
      </div>`;
    window.scrollTo({ top: 220, behavior: 'smooth' });
  });
})();

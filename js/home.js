/* 첫 화면 — 확정 시안(2026.11.27) */
(function () {
  const { esc, fmt, dnum, wday } = UI;
  UI.init('');

  /* 대표 문구 (관리자 화면에서 변경 가능) */
  const S = UI.settings();
  const lines = String(S.heroTitle).split('\n');
  document.getElementById('heroTitle').innerHTML =
    esc(lines[0]) + (lines[1] ? '<br><em>' + esc(lines.slice(1).join(' ')) + '</em>' : '');
  document.getElementById('heroSub').textContent = S.heroSub;

  /* 검색 스트립 — 지역 */
  const rs = document.getElementById('qRegion');
  rs.insertAdjacentHTML('beforeend', CI.REGIONS.map((r) => `<option value="${r}">${r}</option>`).join(''));

  /* 주요 서비스 6칸 */
  const SVC = [
    ['01', '노회 안내', '전국 노회와 노회원의 소식과 일정을 한눈에', 'presbytery.html', 'svc01.jpg'],
    ['02', '후임 사역자 찾기', '교회와 사역자를 연결하여 다음 세대를 세웁니다', 'jobs.html', 'svc02.jpg'],
    ['03', '교회 건물 매매·임대', '신뢰 있는 교회 건물 정보를 연결해 드립니다', 'space.html', 'svc03.jpg'],
    ['04', '목회 벼룩시장', '성물·비품·가구·차량을 나누고 연결합니다', 'goods.html', 'svc04.jpg'],
    ['05', '목회자 가정 지원', '사모·자녀·결혼정보까지 목회자 가정을 돕습니다', 'family.html', 'svc05.jpg'],
    ['06', '정보 나눔·자료실', '목회와 교회를 돕는 다양한 자료를 제공합니다', 'data.html', 'svc06.jpg']
  ];
  document.getElementById('svcGrid').innerHTML = SVC.map(([no, t, d, h, img]) => `
    <a class="sv" href="${h}">
      <span class="ph"><img src="assets/img/${img}" alt=""><span class="no">${no}</span></span>
      <span class="bd"><b>${t}</b><span>${d}</span><i class="go">›</i></span>
    </a>`).join('');

  /* 공지사항 */
  const PILL = { '노회소식':'노회', '사역안내':'안내', '자료업데이트':'자료', '행사':'행사' };
  const nList = document.getElementById('noticeList');
  function drawNotice(cat) {
    const rows = UI.notices().filter((n) => !cat || n.cat === cat).slice(0, 4);
    nList.innerHTML = rows.map((n) => `
      <li><a href="notice.html?cat=${encodeURIComponent(n.cat)}">
        <span class="pill">${PILL[n.cat] || '공지'}</span>
        <span class="ti">${esc(n.title)}</span>
        <span class="dt">${fmt(n.date)}</span>
      </a></li>`).join('');
  }
  drawNotice('');
  document.querySelectorAll('#noticeTabs button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#noticeTabs button').forEach((x) => x.classList.toggle('on', x === b));
      drawNotice(b.dataset.cat);
    });
  });

  /* 노회 일정 */
  const sList = document.getElementById('schList');
  function drawSch(tag) {
    const rows = CI.SCHEDULE.filter((s) => !tag || s.tag === tag).slice(0, 4);
    sList.innerHTML = rows.map((s) => {
      const d = dnum(s.date);
      return `<li><a href="presbytery.html#schedule">
        <span class="d">${String(d.m).padStart(2, '0')}.${String(d.d).padStart(2, '0')} <span>(${wday(s.date)})</span></span>
        <span class="t"><b>${esc(s.title)}</b><span>${esc(s.church)}</span></span>
        <span class="c">›</span>
      </a></li>`;
    }).join('');
  }
  drawSch('');
  document.querySelectorAll('#schTabs button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#schTabs button').forEach((x) => x.classList.toggle('on', x === b));
      drawSch(b.dataset.tag);
    });
  });
})();

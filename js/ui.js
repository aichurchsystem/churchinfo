/* 백석총회 교회정보팀 — 공통 UI (상단·메뉴·푸터·저장소) */
window.UI = (function () {

  const NAV = [
    { key:'about', name:'교회정보팀 소개', href:'about.html', subs:[
      ['팀 소개','about.html'], ['주요 업무','about.html#work'], ['이용 방법','about.html#how'], ['문의','about.html#contact'] ] },
    { key:'presbytery', name:'노회안내', href:'presbytery.html', subs:[
      ['노회 소개','presbytery.html'], ['노회 일정','presbytery.html#schedule'], ['노회 소식','presbytery.html#news'] ] },
    { key:'jobs', name:'사역안내', href:'jobs.html', subs:[
      ['후임 사역자 찾기','jobs.html'], ['교회 건물 매매·임대','space.html'], ['농어촌 연결','rural.html'], ['목회자 가정 지원','family.html'] ] },
    { key:'goods', name:'정보마당', href:'goods.html', subs:[
      ['목회 벼룩시장','goods.html'], ['공동구매·제휴','groupbuy.html'], ['최근 등록 정보','index.html#recent'], ['정보 등록하기','register.html'] ] },
    { key:'data', name:'자료실', href:'data.html', subs:[
      ['노회 서식','data.html'], ['임직 자료','data.html'], ['교회 행정','data.html'], ['목회 자료','data.html'] ] },
    { key:'notice', name:'커뮤니티', href:'notice.html', subs:[
      ['공지사항','notice.html'], ['행사 안내','notice.html#event'], ['사업 신청','notice.html#apply'], ['자주 묻는 질문','about.html#faq'] ] }
  ];

  const KEY = 'ci_demo_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function db() {
    const d = load();
    d.state = d.state || {};
    d.settings = d.settings || {};
    d.subs = d.subs || [];
    d.log = d.log || [];
    return d;
  }

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const fmt = (d) => (d || '').replace(/-/g, '.').slice(2);           // 26.11.26
  const fmtFull = (d) => (d || '').replace(/-/g, '.');
  const dnum = (d) => { const p = (d || '').split('-'); return p.length === 3 ? { m: +p[1], d: +p[2] } : { m: '', d: '' }; };
  const wd = ['일','월','화','수','목','금','토'];
  const wday = (d) => { const t = new Date(d + 'T00:00:00'); return isNaN(t) ? '' : wd[t.getDay()]; };

  /* 상태·수정: 관리자 처리 반영 */
  function items() {
    const d = db();
    const st = d.state, ed = d.edits || {};
    return CI.ITEMS.map((it) => {
      const s = st[it.id];
      let status = it.status, hidden = false, pending = false;
      if (s === 'hidden') hidden = true;
      if (s === 'closed') status = 'done';
      if (s === 'pending') pending = true;
      return Object.assign({}, it, ed[it.id] || {}, { status, hidden, pending });
    }).concat(d.subs.filter((x) => x.state === 'approved' && !CI.ITEMS.some((i) => i.id === x.no)).map((x) => ({
      id:x.no, cat:x.cat, sub:x.sub, title:x.title, church:x.church, region:x.region, area:'',
      date:x.date, status:'recruit', img:(CI.CATS.find((c) => c.key === x.cat) || CI.CATS[0]).img,
      summary:'등록 신청으로 접수된 정보입니다.', body:['관리자 승인으로 공개된 정보입니다. 상세 내용은 등록자가 작성한 내용을 바탕으로 표시됩니다.'], spec:{'등록 경로':'정보 등록 신청','담당자':x.name}, hidden:false, pending:false
    })));
  }

  function notices() {
    const extra = (db().notices || []).slice().reverse();
    return extra.concat(CI.NOTICES);
  }
  function visible() { return items().filter((i) => !i.hidden); }

  function settings() {
    return Object.assign({ heroTitle:'함께 세워가는 교회,\n더 넓은 사역의 길',
      heroSub:'사역자부터 교회 공간, 비품 나눔과 농어촌 연결까지 — 교회정보팀이 함께합니다.',
      heroKicker:'교회의 필요를 잇고, 함께하는 목회를 돕습니다',
      contact:'연락처·이메일은 확정 후 게시' }, db().settings);
  }

  function statOf(s) { return CI.STATUS[s] || CI.STATUS.recruit; }
  function statusChip(s) {
    const m = statOf(s);
    const cls = m.k === 'recruit' ? 'recruit' : m.k === 'link' ? 'link' : 'done';
    return `<span class="st ${cls}">${m.label}</span>`;
  }

  function header(active) {
    const nav = NAV.map((m, i) => `
      <div class="it ${(m.key === active || (!active && i === 0)) ? 'on' : ''}">
        <a href="${m.href}">${m.name}</a>
        <div class="sub">${m.subs.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</div>
      </div>`).join('');
    return `
<header class="hd">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="대한예수교장로회 백석총회 교회정보팀">
      <span class="logo"><img src="assets/img/baekseok-emblem.png" alt="백석총회 로고"></span>
      <span class="org"><span>대한예수교장로회</span><b>백석총회</b></span>
      <span class="vline"></span>
      <span class="team">교회정보팀</span>
    </a>
    <nav class="gnb">${nav}</nav>
    <div class="right">
      <a class="login" href="login.html">로그인</a>
      <a class="join" href="join.html">회원가입</a>
      <span class="sep"></span>
      <button class="sbtn" id="searchBtn" aria-label="검색" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.6"/><line x1="15.5" y1="15.5" x2="21" y2="21"/></svg>
      </button>
      <button class="menu-btn" id="menuBtn" aria-label="메뉴 열기" type="button"><span></span></button>
    </div>
  </div>
</header>
<div class="search-pop" id="searchPop">
  <div class="box">
    <h3>정보 찾기</h3>
    <form action="search.html" method="get">
      <select name="field" class="chip" style="height:42px;background:#fff" aria-label="분야">
        <option value="">전체 분야</option>
        ${CI.CATS.map((c) => `<option value="${c.key}">${c.name}</option>`).join('')}
      </select>
      <input class="inp" style="flex:1;border:1px solid var(--line);padding:0 12px;height:42px" type="text" name="q" placeholder="교회명, 지역, 품목, 키워드" aria-label="검색어">
      <button class="btn btn-navy" type="submit">검색</button>
    </form>
  </div>
</div>
<div class="scrim-nav" id="navScrim"></div>
<aside class="nav-drawer" id="navDrawer">
  <div class="dhead"><b>교회정보팀</b><button id="navClose" aria-label="닫기" type="button">×</button></div>
  <div class="dutil"><a href="login.html">로그인</a><a href="join.html">회원가입</a></div>
  ${NAV.map((m) => `<div class="g">${m.name}</div><ul>${m.subs.map(([t, h]) => `<li><a href="${h}"><b>${t}</b></a></li>`).join('')}</ul>`).join('')}
  <div class="g">바로가기</div>
  <ul><li><a href="register.html"><b>정보 등록하기</b></a></li><li><a href="admin.html"><b>관리자(데모)</b></a></li><li><a href="policy.html"><b>이용 안내·개인정보</b></a></li></ul>
</aside>`;
  }

  function footer() {
    return `
<footer class="ft">
  <div class="wrap">
    <b>대한예수교장로회 백석총회 교회정보팀</b>
    <span class="ct">문의처 · <a href="policy.html">이용안내</a> · <a href="policy.html">개인정보처리방침</a>은 확정 후 게시됩니다</span>
    <span class="demo">B안 · 제작 시안</span>
  </div>
</footer>`;
  }

  function init(active) {
    const mount = document.getElementById('site-top');
    if (mount) mount.innerHTML = header(active);
    const fm = document.getElementById('site-footer');
    if (fm) fm.innerHTML = footer();

    const pop = document.getElementById('searchPop');
    const sb = document.getElementById('searchBtn');
    if (sb) sb.addEventListener('click', () => pop.classList.add('on'));
    if (pop) pop.addEventListener('click', (e) => { if (e.target === pop) pop.classList.remove('on'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pop) pop.classList.remove('on'); });

    const dr = document.getElementById('navDrawer'), sc = document.getElementById('navScrim');
    const open = () => { dr.classList.add('on'); sc.classList.add('on'); };
    const close = () => { dr.classList.remove('on'); sc.classList.remove('on'); };
    const mb = document.getElementById('menuBtn');
    if (mb) mb.addEventListener('click', open);
    if (sc) sc.addEventListener('click', close);
    const nc = document.getElementById('navClose');
    if (nc) nc.addEventListener('click', close);
  }

  /* 분야 이름 */
  const catName = (k) => (CI.CATS.find((c) => c.key === k) || {}).name || k;
  const cat = (k) => CI.CATS.find((c) => c.key === k) || CI.CATS[0];

  return { init, NAV, esc, fmt, fmtFull, dnum, wday, items, visible, notices, settings, statusChip, statOf, db, save, load, catName, cat, KEY };
})();

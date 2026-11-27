/* 분야별 목록 · 검색 결과 */
(function () {
  const { esc, fmt, visible, statusChip, catName, dnum, wday } = UI;

  const CONF = {
    jobs: { kicker:'MINISTRY CONNECTION', title:'후임 사역자 찾기', menu:'jobs',
      sub:'담임·후임 사역자, 부교역자, 파트타임 사역자를 교회와 연결합니다.',
      img:'assets/img/svc02.jpg', note:'청빙·모집 공고는 관리자 확인 후 공개됩니다. 교회 소개와 사례비, 시작일을 함께 적어 주시면 연결이 빠릅니다.',
      lead:'교회가 사역자를 만나고, 사역자가 교회를 만나는 자리입니다. 모집 형태와 지역으로 찾아보세요.' },
    space: { kicker:'CHURCH SPACE', title:'교회 건물 매매·임대', menu:'jobs',
      sub:'예배당·교육관·주차장 등 교회 건물 정보를 투명하게 안내합니다.',
      img:'assets/img/svc03.jpg', note:'건물 정보는 사용 승인 여부와 열람 가능 일정을 관리자가 확인한 뒤 공개합니다. 허위 정보는 숨김 처리됩니다.',
      lead:'매매, 임대, 양도로 나누어 확인하실 수 있습니다. 현장 열람은 관리자 확인 후 일정을 조율합니다.' },
    goods: { kicker:'CHURCH MARKET', title:'목회 벼룩시장', menu:'goods',
      sub:'사용하지 않는 성구·악기·방송장비·차량을 필요한 교회로 나눕니다.',
      img:'assets/img/svc04.jpg', note:'나눔과 거래 글은 관리자 확인 후 공개됩니다. 선입금을 요구하는 글은 신고해 주세요.',
      lead:'성구, 악기, 방송장비, 차량, 기타로 나누어 확인하실 수 있습니다. 나눔은 운송 방법을 꼭 적어 주세요.' },
    rural: { kicker:'RURAL CHURCH', title:'농어촌 연결', menu:'jobs',
      sub:'농어촌교회를 소개하고, 농수산물과 교회 간 연결을 돕습니다.',
      img:'assets/img/hero.jpg', note:'농수산물 정보의 가격·출하 시기는 산지 사정에 따라 달라질 수 있습니다. 확정된 내용만 게시합니다.',
      lead:'작은 교회와 도시 교회가 서로를 돕는 자리입니다. 교회 소개, 농수산물, 교회 간 연결로 나누어 안내합니다.' },
    family: { kicker:'PASTOR FAMILY', title:'목회자 가정 지원', menu:'jobs',
      sub:'자녀 교육, 결혼 정보, 의료비 등 목회자 가정의 필요를 함께 살핍니다.',
      img:'assets/img/svc05.jpg', note:'결혼 정보는 본인 동의를 받아 등록하며, 관리자 확인 후 비공개로 열람됩니다. 공개 범위는 등록 시 선택합니다.',
      lead:'목회자와 사모, 자녀의 필요를 조용히 돕습니다. 민감한 정보는 비공개로 운영됩니다.' },
    groupbuy: { kicker:'GROUP BUY', title:'공동구매·제휴', menu:'goods',
      sub:'여러 교회가 함께 사면 더 든든합니다. 공동구매와 제휴 혜택을 안내합니다.',
      img:'assets/img/svc06.jpg', note:'화훼 공동구매는 2027년 고난주간·부활절 100개 교회 시범 사업으로, 모집 일정·품목·가격은 확정 후 게시합니다.',
      lead:'준비 중인 사업과 신청 가능한 사업을 구분해 표시합니다. 신청 절차를 먼저 확인해 주세요.' }
  };

  const params = new URLSearchParams(location.search);
  const isSearch = document.body.dataset.mode === 'search';
  const catKey = document.body.dataset.cat;
  const conf = CONF[catKey] || {};
  UI.init(document.body.dataset.menu || conf.menu || '');

  let pool = visible();
  if (!isSearch) pool = pool.filter((i) => i.cat === catKey);

  /* ── 페이지 히어로 ── */
  const hero = document.getElementById('phero');
  if (isSearch) {
    const q = params.get('q') || '';
    hero.innerHTML = `
      <div class="im"><img src="assets/img/svc06.jpg" alt=""></div>
      <div class="wrap">
        <div class="crumb"><a href="index.html">홈</a><span class="sp">›</span><b>정보 찾기</b></div>
        <h1>정보 찾기</h1>
        <p class="sub">분야·지역·검색어로 교회정보팀에 등록된 정보를 찾습니다${q ? ` — “${esc(q)}”` : ''}.</p>
      </div>`;
  } else {
    hero.innerHTML = `
      <div class="im"><img src="${conf.img}" alt=""></div>
      <div class="wrap">
        <div class="crumb"><a href="index.html">홈</a><span class="sp">›</span>
          <a href="${catKey === 'jobs' || catKey === 'space' || catKey === 'rural' || catKey === 'family' ? 'jobs.html' : 'goods.html'}">${catKey === 'jobs' || catKey === 'space' || catKey === 'rural' || catKey === 'family' ? '사역안내' : '정보마당'}</a>
          <span class="sp">›</span><b>${esc(conf.title)}</b></div>
        <div class="kicker" style="color:var(--gold-3);margin-bottom:9px">${conf.kicker}</div>
        <h1>${esc(conf.title)}</h1>
        <p class="sub">${esc(conf.sub)}</p>
        <div class="metaline" id="heroMeta"></div>
      </div>`;
  }

  const statLine = () => {
    const live = pool.filter((i) => i.status === 'recruit').length;
    const recent = pool.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
    return `<span><b>${pool.length}</b>등록 정보</span><span><b>${live}</b>모집·접수 중</span><span>최근 갱신 <b>${recent ? fmt(recent.date) : '-'}</b></span>`;
  };
  const hm = document.getElementById('heroMeta');
  if (hm) hm.innerHTML = statLine();

  /* ── 사이드바 ── */
  const side = document.getElementById('side');
  const regionCount = {};
  pool.forEach((i) => { regionCount[i.region] = (regionCount[i.region] || 0) + 1; });
  const topRegions = Object.entries(regionCount).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const subs = conf.sub ? [] : (UI.cat(catKey).subs || []);
  const subList = isSearch ? [] : (UI.cat(catKey).subs || []);

  side.innerHTML = `
    <div class="box">
      <div class="bh">분야</div>
      <ul>${CI.CATS.map((c) => `<li><a href="${c.page}" class="${c.key === catKey ? 'on' : ''}">${c.name}<span class="n">${visible().filter((i) => i.cat === c.key).length}</span></a></li>`).join('')}</ul>
    </div>
    ${subList.length ? `<div class="box"><div class="bh">세부 분류</div><ul>
      <li><a href="?">전체<span class="n">${pool.length}</span></a></li>
      ${subList.map((s) => `<li><a href="?sub=${encodeURIComponent(s)}">${s}<span class="n">${pool.filter((i) => i.sub === s).length}</span></a></li>`).join('')}
    </ul></div>` : ''}
    <div class="box">
      <div class="bh">지역</div>
      <ul>${topRegions.map(([r, n]) => `<li><a href="?region=${encodeURIComponent(r)}">${r}<span class="n">${n}</span></a></li>`).join('')}</ul>
    </div>
    <div class="help">
      <b>정보 등록 안내</b>
      <p>등록된 정보는 관리자 확인 후 공개됩니다. 사진과 첨부파일을 함께 올리시면 연결이 빨라집니다.</p>
      <a class="ph" href="register.html${catKey ? '?cat=' + catKey : ''}">정보 등록하기 →</a>
    </div>`;

  /* ── 필터 ── */
  const main = document.getElementById('listMain');
  let state = {
    sub: params.get('sub') || '',
    region: params.get('region') || '',
    field: params.get('field') || (isSearch ? '' : catKey),
    q: params.get('q') || '',
    sort: params.get('sort') || 'new',
    page: 1
  };
  const PER = 8;

  function apply() {
    let rows = visible();
    if (state.field) rows = rows.filter((i) => i.cat === state.field);
    if (!isSearch && !state.field) rows = rows.filter((i) => i.cat === catKey);
    if (state.sub) rows = rows.filter((i) => i.sub === state.sub);
    if (state.region) rows = rows.filter((i) => i.region === state.region);
    if (state.q) {
      const q = state.q.replace(/\s+/g, '');
      rows = rows.filter((i) => (i.title + i.church + i.summary + i.sub + i.region + (i.area || '')).replace(/\s+/g, '').includes(q));
    }
    if (state.sort === 'new') rows.sort((a, b) => b.date.localeCompare(a.date));
    if (state.sort === 'old') rows.sort((a, b) => a.date.localeCompare(b.date));
    if (state.sort === 'status') rows.sort((a, b) => (a.status === 'recruit' ? -1 : 1) - (b.status === 'recruit' ? -1 : 1));
    return rows;
  }

  function chipRow() {
    if (isSearch) {
      const f = state.field ? catName(state.field) : '전체 분야';
      return `<div class="tools">
        <span class="chip on">${esc(f)}</span>
        ${state.region ? `<span class="chip on">${esc(state.region)}</span>` : ''}
        ${state.q ? `<span class="chip on">“${esc(state.q)}”</span>` : ''}
        <span class="sp"></span>
        <a class="chip" href="search.html">조건 초기화</a>
      </div>`;
    }
    const subs2 = UI.cat(catKey).subs || [];
    return `<div class="tools">
      <button class="chip ${state.sub ? '' : 'on'}" data-sub="">전체 <span class="n">${pool.length}</span></button>
      ${subs2.map((s) => `<button class="chip ${state.sub === s ? 'on' : ''}" data-sub="${esc(s)}">${esc(s)} <span class="n">${pool.filter((i) => i.sub === s).length}</span></button>`).join('')}
      <span class="sp"></span>
      <select id="sortSel" aria-label="정렬">
        <option value="new" ${state.sort === 'new' ? 'selected' : ''}>최근 등록순</option>
        <option value="old" ${state.sort === 'old' ? 'selected' : ''}>오래된 순</option>
        <option value="status" ${state.sort === 'status' ? 'selected' : ''}>모집 중 우선</option>
      </select>
      <a class="btn btn-navy btn-sm" href="register.html${catKey ? '?cat=' + catKey : ''}">정보 등록</a>
    </div>`;
  }

  function row(it) {
    return `<a class="row" href="item.html?id=${it.id}">
      <span class="th"><img src="${it.img}" alt=""></span>
      <span class="ti"><b>${esc(it.title)}</b><p><span class="tg">${esc(it.sub)}</span>${esc(it.summary)}</p></span>
      <span class="rg">${esc(it.church)}<span>${esc(it.region)} ${esc(it.area || '')}</span></span>
      <span class="dt">${fmt(it.date)}</span>
      <span class="end">${statusChip(it.status)}</span>
    </a>`;
  }

  function render() {
    const rows = apply();
    const pages = Math.max(1, Math.ceil(rows.length / PER));
    if (state.page > pages) state.page = pages;
    const slice = rows.slice((state.page - 1) * PER, state.page * PER);

    const line = isSearch
      ? `<div class="notice-line"><span class="ic">🔎</span>검색 결과 <b>${rows.length}건</b>입니다. 조건을 바꾸려면 위의 분야·지역·검색어를 조정하세요. 표시된 정보는 시안용 예시입니다.</div>`
      : `<div class="notice-line"><span class="ic">ⓘ</span>${esc(conf.note)} <span style="color:var(--slate-2)">표시된 게시물은 시안용 예시입니다.</span></div>`;

    main.innerHTML = `
      <p style="font-size:13px;color:var(--slate);line-height:1.7;margin-bottom:12px">${esc(conf.lead || '분야·지역·검색어로 원하는 정보를 찾아보세요.')}</p>
      ${chipRow()}
      ${line}
      <div class="rows">${slice.map(row).join('') || '<div class="empty">조건에 맞는 정보가 없습니다.<br><span style="font-size:12px">검색 조건을 바꾸거나 정보를 등록해 주세요.</span></div>'}</div>
      <div class="tools" style="margin-top:10px">
        <span class="cnt">전체 <b>${rows.length}</b>건 · ${state.page} / ${pages} 페이지</span>
      </div>
      <div class="pager">
        ${state.page > 1 ? `<a href="#" data-page="${state.page - 1}">‹</a>` : ''}
        ${Array.from({ length: pages }, (_, i) => `<a href="#" data-page="${i + 1}" class="${state.page === i + 1 ? 'on' : ''}">${i + 1}</a>`).join('')}
        ${state.page < pages ? `<a href="#" data-page="${state.page + 1}">›</a>` : ''}
      </div>`;

    main.querySelectorAll('[data-sub]').forEach((b) => b.addEventListener('click', () => {
      state.sub = b.dataset.sub; state.page = 1; render();
    }));
    const ss = document.getElementById('sortSel');
    if (ss) ss.addEventListener('change', () => { state.sort = ss.value; render(); });
    main.querySelectorAll('[data-page]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault(); state.page = +a.dataset.page; render(); window.scrollTo({ top: 260, behavior: 'smooth' });
    }));
  }
  render();
})();

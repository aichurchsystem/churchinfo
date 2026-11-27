/* 정보 상세 */
(function () {
  const { esc, fmt, visible, statusChip, catName, cat } = UI;
  UI.init('');

  const id = new URLSearchParams(location.search).get('id');
  const it = visible().find((x) => x.id === id) || visible()[0];
  const c = cat(it.cat);
  const el = document.getElementById('detailWrap');

  document.title = it.title + ' | 교회정보팀';

  const spec = Object.entries(it.spec || {}).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  const same = visible().filter((x) => x.cat === it.cat && x.id !== it.id).slice(0, 4);

  el.innerHTML = `
  <section class="phero">
    <div class="im"><img src="${it.img}" alt=""></div>
    <div class="wrap">
      <div class="crumb"><a href="index.html">홈</a><span class="sp">›</span>
        <a href="${c.page}">${c.name}</a><span class="sp">›</span><b>${esc(it.sub)}</b></div>
      <h1 style="font-size:24px">${esc(it.title)}</h1>
      <p class="sub">${esc(it.church)} · ${esc(it.region)} ${esc(it.area || '')}</p>
    </div>
  </section>

  <div class="pagebody"><div class="wrap layout">
    <aside class="side">
      <div class="box">
        <div class="bh">${c.name}</div>
        <ul>${c.subs.map((s) => `<li><a href="${c.page}?sub=${encodeURIComponent(s)}" class="${s === it.sub ? 'on' : ''}">${s}<span class="n">${visible().filter((x) => x.cat === it.cat && x.sub === s).length}</span></a></li>`).join('')}</ul>
      </div>
      <div class="box"><div class="bh">같은 분야 정보</div>
        <ul>${same.map((s) => `<li><a href="item.html?id=${s.id}">${esc(s.title.length > 15 ? s.title.slice(0, 15) + '…' : s.title)}</a></li>`).join('')}</ul>
      </div>
      <div class="help"><b>연결 요청 안내</b><p>연락처는 공개하지 않습니다. 아래 ‘연결 요청’을 남기면 관리자가 확인 후 연결해 드립니다.</p>
        <a class="ph" href="register.html">정보 등록하기 →</a></div>
    </aside>

    <main>
      <article class="detail">
        <div class="top">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:6px">
            <span class="tag gold">${esc(it.sub)}</span>
            <span class="tag navy">${esc(c.name)}</span>
            ${statusChip(it.status)}
          </div>
          <h1>${esc(it.title)}</h1>
          <div class="meta">
            <span>등록 <b>${esc(it.church)}</b></span><span>지역 <b>${esc(it.region)} ${esc(it.area || '')}</b></span>
            <span>등록일 <b>${fmt(it.date)}</b></span><span>조회 <b>${(it.id.charCodeAt(2) * 7 % 90) + 120}</b></span>
          </div>
        </div>
        <div class="photo"><img src="${it.img}" alt="${esc(it.title)}"></div>
        <div class="prose">${(it.body || [it.summary]).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <table class="spec">${spec}</table>
        <div class="contactbox">
          <b>연락처는 공개하지 않습니다.</b> 관리자 확인 후 등록자와 연결해 드립니다. 아래 ‘연결 요청’을 눌러 주세요.
          <div style="margin-top:8px;font-size:11.5px;color:#8A6B33">교회정보팀 문의 — 연락처·이메일은 확정 후 게시</div>
        </div>
        <div class="acts">
          <button class="btn btn-gold" id="askBtn" type="button">연결 요청</button>
          <a class="btn btn-line" href="${c.page}">목록으로</a>
          <a class="btn btn-line" href="register.html?cat=${it.cat}">정보 등록</a>
          <button class="btn btn-line" id="printBtn" type="button">인쇄</button>
        </div>
      </article>
    </main>
  </div></div>`;

  document.getElementById('askBtn').addEventListener('click', function () {
    this.outerHTML = `<div class="contactbox" style="margin:0"><b>연결 요청이 접수되었습니다.</b> (시안 화면) 관리자 확인 후 등록된 연락 방법으로 안내드립니다.</div>`;
  });
  document.getElementById('printBtn').addEventListener('click', () => window.print());
})();

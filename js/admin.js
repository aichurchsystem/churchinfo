/* 관리자 (데모) */
(function () {
  const { esc, fmt, catName, db, save, items, settings, visible } = UI;
  UI.init('');

  let tab = 'all';
  const S = settings();
  document.getElementById('setTitle').value = S.heroTitle;
  document.getElementById('setSub').value = S.heroSub;
  document.getElementById('setContact').value = S.contact;

  function stateOf(it) {
    const d = db();
    const s = d.state[it.id];
    if (s === 'hidden') return 'hidden';
    if (s === 'closed' || it.status === 'done') return 'closed';
    return 'open';
  }

  function rows() {
    const d = db();
    const base = items();
    const pending = d.subs.filter((x) => x.state === 'pending').map((x) => ({
      id: x.no, cat: x.cat, title: x.title, church: x.church, region: x.region, date: x.date,
      status: 'recruit', pending: true, _sub: x
    }));
    return pending.concat(base);
  }

  function draw() {
    const all = rows();
    const d = db();
    const counts = {
      all: all.length,
      pending: all.filter((x) => x.pending).length,
      open: all.filter((x) => !x.pending && stateOf(x) === 'open').length,
      hidden: all.filter((x) => !x.pending && stateOf(x) === 'hidden').length,
      closed: all.filter((x) => !x.pending && stateOf(x) === 'closed').length
    };
    document.getElementById('stats').innerHTML = `
      <div class="stat"><span>전체 등록 정보</span><b>${counts.all}<i>건</i></b></div>
      <div class="stat"><span>접수 대기</span><b>${counts.pending}<i>건</i></b></div>
      <div class="stat"><span>공개 중</span><b>${counts.open}<i>건</i></b></div>
      <div class="stat"><span>숨김·마감</span><b>${counts.hidden + counts.closed}<i>건</i></b></div>`;
    document.getElementById('cntPending').textContent = counts.pending ? `(${counts.pending})` : '';

    let list = all;
    if (tab === 'pending') list = all.filter((x) => x.pending);
    if (tab === 'open') list = all.filter((x) => !x.pending && stateOf(x) === 'open');
    if (tab === 'hidden') list = all.filter((x) => !x.pending && stateOf(x) === 'hidden');
    if (tab === 'closed') list = all.filter((x) => !x.pending && stateOf(x) === 'closed');

    document.getElementById('aBody').innerHTML = list.map((it) => {
      const st = it.pending ? '<span class="st link">접수 대기</span>' : stateOf(it) === 'hidden' ? '<span class="st done">숨김</span>' : stateOf(it) === 'closed' ? '<span class="st done">마감</span>' : '<span class="st recruit">공개</span>';
      const act = it.pending
        ? `<button class="mini" data-act="approve" data-id="${it.id}">승인</button><button class="mini warn" data-act="reject" data-id="${it.id}">반려</button><button class="mini" data-act="edit" data-id="${it.id}">수정</button>`
        : `<button class="mini" data-act="edit" data-id="${it.id}">수정</button>
           <button class="mini" data-act="hide" data-id="${it.id}">${stateOf(it) === 'hidden' ? '복구' : '숨김'}</button>
           <button class="mini" data-act="close" data-id="${it.id}">${stateOf(it) === 'closed' ? '마감 해제' : '마감'}</button>`;
      return `<tr><td style="color:var(--slate-2);font-size:11px">${esc(it.id)}</td>
        <td>${esc(catName(it.cat))}</td>
        <td class="ti">${esc(it.title)}</td>
        <td style="font-size:11.5px">${esc(it.church)}</td>
        <td style="font-size:11px;color:var(--slate-2)">${fmt(it.date)}</td>
        <td>${st}</td><td><div class="acts">${act}</div></td></tr>`;
    }).join('') || '<tr><td colspan="7" style="padding:36px;text-align:center;color:var(--slate)">해당하는 정보가 없습니다.</td></tr>';
  }

  document.getElementById('atabs').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    tab = b.dataset.tab;
    document.querySelectorAll('#atabs button').forEach((x) => x.classList.toggle('on', x === b));
    draw();
  });

  document.getElementById('aBody').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const id = b.dataset.id, act = b.dataset.act;
    const d = db();
    const sub = d.subs.find((x) => x.no === id);

    if (act === 'approve' && sub) { sub.state = 'approved'; }
    if (act === 'reject' && sub) { sub.state = 'rejected'; }
    if (act === 'hide') { d.state[id] = d.state[id] === 'hidden' ? 'open' : 'hidden'; }
    if (act === 'close') { d.state[id] = d.state[id] === 'closed' ? 'open' : 'closed'; }
    if (act === 'edit') {
      const it = rows().find((x) => x.id === id);
      document.getElementById('editPanel').style.display = 'block';
      document.getElementById('editNo').textContent = '(' + id + ')';
      document.getElementById('eTitle').value = it.title;
      document.getElementById('eChurch').value = it.church;
      document.getElementById('eRegion').value = it.region || '';
      document.getElementById('eSummary').value = it.summary || '';
      document.getElementById('editPanel').dataset.id = id;
      document.getElementById('editPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    save(d);
    draw();
  });

  document.getElementById('saveEdit').addEventListener('click', () => {
    const id = document.getElementById('editPanel').dataset.id;
    const d = db();
    d.edits = d.edits || {};
    d.edits[id] = {
      title: document.getElementById('eTitle').value,
      church: document.getElementById('eChurch').value,
      region: document.getElementById('eRegion').value,
      summary: document.getElementById('eSummary').value
    };
    const sub = d.subs.find((x) => x.no === id);
    if (sub) { sub.title = d.edits[id].title; sub.church = d.edits[id].church; sub.region = d.edits[id].region; }
    save(d);
    document.getElementById('editPanel').style.display = 'none';
    draw();
  });
  document.getElementById('cancelEdit').addEventListener('click', () => {
    document.getElementById('editPanel').style.display = 'none';
  });

  /* 대표 문구 저장 */
  document.getElementById('saveSet').addEventListener('click', () => {
    const d = db();
    d.settings = Object.assign(d.settings || {}, {
      heroTitle: document.getElementById('setTitle').value,
      heroSub: document.getElementById('setSub').value,
      contact: document.getElementById('setContact').value
    });
    save(d);
    alert('저장되었습니다. 첫 화면에서 확인하실 수 있습니다.');
  });
  document.getElementById('setImg').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    document.getElementById('setImgPrev').src = url;
  });
  document.getElementById('resetAll').addEventListener('click', () => {
    if (!confirm('승인·숨김·마감 처리와 대표 문구를 모두 처음 상태로 되돌립니다. 계속할까요?')) return;
    localStorage.removeItem(UI.KEY);
    location.reload();
  });

  /* 공지 등록 */
  function drawNoticeAdmin() {
    const d = db();
    const list = (d.notices || []).slice().reverse();
    document.getElementById('noticeAdminList').innerHTML = list.length
      ? '최근 등록한 공지: ' + list.slice(0, 4).map((n) => `<div style="margin-top:5px">· [${esc(n.cat)}] ${esc(n.title)} <span style="color:var(--slate-2)">${fmt(n.date)}</span></div>`).join('')
      : '이 브라우저에서 등록한 공지가 없습니다.';
  }
  drawNoticeAdmin();

  document.getElementById('addNotice').addEventListener('click', () => {
    const t = document.getElementById('nTitle').value.trim();
    if (!t) { alert('공지 제목을 입력해 주세요.'); return; }
    const d = db();
    d.notices = d.notices || [];
    d.notices.push({ id: 'AN-' + Date.now(), cat: document.getElementById('nCat').value, title: t, body: document.getElementById('nBody').value, date: new Date().toISOString().slice(0, 10) });
    save(d);
    document.getElementById('nTitle').value = '';
    document.getElementById('nBody').value = '';
    drawNoticeAdmin();
    alert('공지가 등록되었습니다. 첫 화면 공지사항에 표시됩니다.');
  });

  draw();
})();

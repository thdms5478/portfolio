(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  /* ---------- 키워드 → 제가 한 일 + 함께하면 할 수 있는 일 ---------- */
  const KEYWORDS = [
    { keys: ["PG", "오픈마켓"], title: "PG · 오픈마켓",
      exp: "네이버페이 PG·오픈마켓 두 사업의 카드결제 인프라 운영",
      val: "PG 카드 업무에 별도 적응 기간 없이 투입할 수 있습니다." },
    { keys: ["가맹점번호", "채번", "단말기 ID"], title: "가맹점번호 채번",
      exp: "가맹점번호·단말기 ID 채번부터 어드민 매핑, 심사, QA, 실매출까지 개설 전 과정 담당",
      val: "신규 가맹점 개설 업무를 처음부터 끝까지 수행할 수 있습니다." },
    { keys: ["하위몰", "하위몰 심사", "반송"], title: "하위몰 심사",
      exp: "카드사 심사 반송 시 사유 파악 및 보완 협의로 심사 통과, 연동 일정 확보",
      val: "심사가 지연된 가맹점도 일정 내 결제를 개시할 수 있도록 하겠습니다." },
    { keys: ["승인", "승인한도", "매입한도", "담보"], title: "PG 승인·매입한도",
      exp: "한도 초과 전 카드사·유관부서와 담보 협의 후 사전 증액",
      val: "한도 부족으로 인한 결제 중단을 사전에 방지하겠습니다." },
    { keys: ["환금성 업종"], title: "환금성 업종 한도",
      exp: "상품권·게임·포인트 충전 업종의 카드사별 한도 정책 관리, 게임 가맹점 일 한도 20배 상향 협의",
      val: "카드사 심사가 까다로운 업종의 한도 협의를 수행할 수 있습니다." },
    { keys: ["카드 일반결제"], title: "카드 일반결제 정책",
      exp: "카드사 결제창을 거치는 일반결제의 카드사별 정책 취합 및 유관부서 문의 대응",
      val: "카드사별 정책을 하나의 기준으로 정리해 공유하겠습니다." },
    { keys: ["매입", "매입 VAN", "PM"], title: "매입 VAN 연동 PM",
      exp: "신규 매입 VAN사 연동 PM: 스펙 정의부터 QA까지 수행, 장애 0건 오픈",
      val: "VAN·카드사 연동 프로젝트를 수행할 수 있습니다." },
    { keys: ["매입전문", "전문"], title: "매입전문 포맷 변경",
      exp: "연동 VAN사 전체와 동시 협의해 동일 일자에 동일 포맷으로 변경",
      val: "여러 외부사의 일정을 조율해 동시에 반영할 수 있습니다." },
    { keys: ["QA", "엣지케이스"], title: "QA · 엣지케이스",
      exp: "예외 상황 정의, QA 케이스 직접 설계, 결제 건 직접 생성 후 테스트",
      val: "오픈 전 리스크를 사전에 점검하겠습니다." },
    { keys: ["정산", "차액정산"], title: "차액정산",
      exp: "대량 반송 발생 시 SQL로 대상 데이터 직접 추출, 카드사 협의 후 정상 처리",
      val: "데이터를 직접 추출해 신속하게 대응하겠습니다." },
    { keys: ["채권"], title: "회계 처리 · 채권",
      exp: "카드사 인터페이스 어드민 ↔ 서비스 빌링 시스템 간 회계 처리·채권 생성 기준을 회계·정산 부서와 협의",
      val: "대외 협의 결과를 내부 회계까지 연결하겠습니다." },
    { keys: ["여전법"], title: "여전법 준수",
      exp: "가맹점·한도·소득공제 정책을 여전법 기준에 맞춰 운영",
      val: "사업 확장과 규정 준수를 함께 관리하겠습니다." },
    { keys: ["문화비 소득공제", "소득공제 제외"], title: "소득공제 정책",
      exp: "문화비 소득공제·소득공제 제외 정책 관리 및 유관부서 가이드로 공제 과다·과소 적용 방지",
      val: "신규 서비스의 세무 기준을 사전에 안내하겠습니다." },
    { keys: ["대사", "연말정산 대사"], title: "연말정산 대사",
      exp: "연말정산 대상 매출 카드사와 직접 대사",
      val: "정확한 대사로 정산 오류를 방지하겠습니다." },
    { keys: ["무이자 할부 행사"], title: "무이자 할부 행사",
      exp: "카드사 행사 공문 취합 및 내부 노출 관리",
      val: "카드사 행사를 정확하고 신속하게 반영하겠습니다." },
    { keys: ["화이트라벨"], title: "화이트라벨 서비스",
      exp: "화이트라벨 서비스 오픈 기여",
      val: "신규 결제 서비스 오픈 경험을 바탕으로 기여하겠습니다." },
  ];
  const KW = {};
  KEYWORDS.forEach((k) => k.keys.forEach((key) => (KW[key] = k)));

  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  let tipFor = null;
  const showTip = (el) => {
    const k = KW[el.dataset.t || el.textContent.trim()];
    if (!k) return;
    tipFor = el;
    tip.innerHTML = `<b>${k.title}</b>${k.exp}<em>→ ${k.val}</em>`;
    tip.classList.add("is-show");
    const r = el.getBoundingClientRect();
    const tw = Math.min(320, innerWidth - 24);
    tip.style.maxWidth = tw + "px";
    const left = Math.max(12, Math.min(r.left + r.width / 2 - tw / 2, innerWidth - tw - 12));
    const below = r.bottom + 10 + tip.offsetHeight < innerHeight;
    tip.style.left = left + "px";
    tip.style.top = (below ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + "px";
  };
  const hideTip = () => { tip.classList.remove("is-show"); tipFor = null; };
  $$(".t").forEach((el) => {
    // 제 경험과 연결되지 않는 단어는 밑줄 없이 일반 텍스트로 둔다
    if (!KW[el.dataset.t || el.textContent.trim()]) { el.classList.remove("t"); return; }
    el.tabIndex = 0;
    el.addEventListener("mouseenter", () => showTip(el));
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", () => showTip(el));
    el.addEventListener("blur", hideTip);
    el.addEventListener("click", (e) => { e.stopPropagation(); tipFor === el ? hideTip() : showTip(el); });
  });
  document.addEventListener("click", hideTip);
  addEventListener("scroll", hideTip, { passive: true });

  // 키워드로 보는 채용 포인트 (경력기술서 하단)
  const gl = $("#glossary");
  if (gl) gl.innerHTML = KEYWORDS.map((k) => `<div><dt>${k.title}</dt><dd>${k.exp}</dd><dd class="val">→ ${k.val}</dd></div>`).join("");

  /* ---------- progress bar ---------- */
  const bar = $("#progressBar");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- count-up ---------- */
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    if (reduced || end === 0) { el.textContent = end; return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- hero lifeline ---------- */
  const life = $$(".lifeline span");
  if (life.length && !reduced) {
    let k = 0;
    setInterval(() => { life.forEach((s, i) => s.classList.toggle("is-on", i <= k)); k = (k + 1) % (life.length + 1); }, 900);
  } else life.forEach((s) => s.classList.add("is-on"));

  /* ---------- 승인·매입·정산 전 과정 지도 ---------- */
  // links: 고객-하위몰, 하위몰-PG, PG-VAN, VAN-카드사 / fwd: 오른쪽, rev: 왼쪽(대금), both: 요청·응답, opt: 경유 가능
  // 단계별: 제목 / 업무 맥락 / 근거 / 담당 업무 / 입사 후 기여
  const STAGES = [
    {
      label: "가맹점 개설", sub: "결제 준비",
      on: [1, 2, 3, 4], links: ["off", "fwd", "fwd", "fwd"],
      title: "카드 결제수단 연동을 위해 먼저 카드사에 가맹점 등록부터",
      ctx: "네이버페이는 가맹점과 네이버쇼핑 서비스에 모두 카드결제수단을 제공합니다. 신규 가맹점 입점 시 카드사 가맹점번호와 단말기 ID를 채번해 내부 시스템에 연결하고, 카드사 심사까지 통과시켜 카드결제가 이루어질 수 있도록 했습니다.",
      proof: ["개설 6단계 전담", "구비서류 리드타임 −50%"],
      mine: ["가맹점번호·단말기 ID 채번, 어드민 세팅, 하위몰 심사, QA, 실매출까지 개설 전 과정 담당", "카드사 심사 반송 시 사유 파악 및 보완 협의로 심사 통과", "AI 기반 구비서류 자동 작성으로 지연된 개설 건 해소"],
      value: "신규·유의업종 가맹점의 카드사 입점 업무를 바로 수행할 수 있습니다.",
    },
    {
      label: "승인", sub: "한도·정책",
      on: [0, 1, 2, 3, 4], links: ["fwd", "fwd", "opt", "both"],
      title: "결제가 막히지 않도록 카드사 한도와 정책까지",
      ctx: "카드사는 PG사업자 전체와 환금성 업종에 별도의 승인한도를 부여합니다. 한도 부족으로 결제가 중단되지 않도록 카드사와 사전에 조율했습니다.",
      proof: ["게임 가맹점 일 한도 20배", "카드사 직접 협의"],
      mine: ["PG 승인한도 초과 전 카드사·유관부서와 담보 협의 후 사전 증액", "환금성 업종(상품권·게임·포인트 충전) 카드사별 한도 정책 관리", "카드 일반결제 카드사별 정책 취합 및 유관부서 문의 대응", "결제 실패 시 카드사·VAN사와 원인 파악 및 해소"],
      value: "고한도·환금성 업종 가맹점의 한도 협의를 바로 수행할 수 있습니다.",
    },
    {
      label: "매입", sub: "VAN·전문",
      on: [2, 3, 4], links: ["off", "off", "fwd", "fwd"],
      title: "승인된 거래가 대금으로 확정되도록 매입 경로까지",
      ctx: "승인된 거래는 매입 VAN사를 통해 카드사에 청구되어야 대금이 확정됩니다. 신규 매입 VAN사 연동과 매입전문 포맷 변경을 PM으로 수행했습니다.",
      proof: ["VAN 연동 PM · 장애 0건", "매입전문 동일 일자 전환"],
      mine: ["신규 매입 VAN사 연동 PM: 연동 스펙·운영 정책·엣지케이스 정의, QA 설계, 결제 테스트", "연동 VAN사 전체와 매입전문 포맷 변경 협의 및 동일 일자 반영", "매입한도 관리, 취소 실패 원인 분석 및 재처리 협의"],
      value: "VAN·카드사 신규 연동과 전문 변경 프로젝트를 수행할 수 있습니다.",
    },
    {
      label: "정산", sub: "차액·회계",
      on: [1, 2, 4], dim: [3], links: ["off", "rev", "rev", "rev"],
      title: "들어온 대금이 정확히 지급되도록 정산과 회계까지",
      ctx: "카드사 대금은 가맹점 정산과 내부 회계로 이어집니다. 영세·중소 가맹점의 차액정산과 내부 회계 처리 기준 협의를 담당했습니다.",
      proof: ["SQL 대량 데이터 직접 추출", "회계·정산 부서 협의"],
      mine: ["차액정산 운영 및 반송 건 카드사 협의", "대량 반송 발생 시 SQL로 대상 데이터 직접 추출", "카드사 인터페이스 어드민 ↔ 서비스 빌링 시스템 간 회계 처리·채권 생성 기준 협의"],
      value: "대외 협의 결과를 내부 정산·회계까지 연결할 수 있습니다.",
    },
    {
      label: "사후관리", sub: "세무·행사",
      on: [2, 4], dim: [3], links: ["off", "fwd", "both", "both"],
      title: "결제 이후에도 세무와 규정 준수까지",
      ctx: "카드 매출은 연말정산 소득공제와 연결됩니다. 소득공제 대상·제외 정책을 관리하고, 카드사와 대상 매출을 대사했습니다.",
      proof: ["소득공제 정책 관리", "연말정산 매출 대사"],
      mine: ["문화비 소득공제·소득공제 제외 정책 관리 및 유관부서 가이드", "연말정산 대상 매출 카드사 대사", "카드사 무이자 할부 행사 공문 취합 및 내부 노출 관리"],
      value: "신규 서비스의 세무·규정 준수 기준을 사전에 안내할 수 있습니다.",
    },
  ];
  const lifeEl = $("#life");
  if (lifeEl) {
    const tabs = $(".life__tabs", lifeEl);
    tabs.innerHTML = STAGES.map((s, i) => `<button class="life__tab" role="tab" type="button" aria-selected="${i === 0}" data-i="${i}">${s.label}<small>${s.sub}</small><span class="bar"></span></button>`).join("");
    const actors = $$(".actor", lifeEl);
    const links = $$(".link", lifeEl);
    const pane = $(".life__pane", lifeEl);
    let cur = 0, timer = null, auto = !reduced;
    const render = (i) => {
      cur = i;
      const s = STAGES[i];
      $$(".life__tab", tabs).forEach((t, k) => t.setAttribute("aria-selected", k === i));
      actors.forEach((a, k) => {
        a.classList.toggle("is-on", s.on.includes(k));
        a.classList.toggle("is-dim", !s.on.includes(k) || (s.dim || []).includes(k));
      });
      links.forEach((l, k) => {
        const st = s.links[k];
        l.className = "link" + (st === "opt" ? " is-opt fwd" : st === "off" ? "" : " " + st);
      });
      pane.innerHTML = `
        <div class="life__grid life__pane">
          <div class="life__what">
            <h3>${s.title}</h3>
            <p>${s.ctx}</p>
            <div class="life__proof">${s.proof.map((p) => `<span>${p}</span>`).join("")}</div>
            <p class="life__value"><b>입사 후 기여</b>${s.value}</p>
          </div>
          <div class="life__mine">
            <h4>✦ 담당 업무</h4>
            <ul>${s.mine.map((m) => `<li>${m}</li>`).join("")}</ul>
          </div>
        </div>`;
    };
    const progress = () => {
      clearInterval(timer);
      if (!auto) return;
      const b = $$(".life__tab .bar", tabs)[cur];
      let p = 0;
      timer = setInterval(() => {
        p += 1;
        if (b) b.style.width = p + "%";
        if (p >= 100) { if (b) b.style.width = "0"; render((cur + 1) % STAGES.length); progress(); }
      }, 90);
    };
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".life__tab");
      if (!btn) return;
      auto = false; clearInterval(timer);
      $$(".life__tab .bar", tabs).forEach((b) => (b.style.width = "0"));
      render(Number(btn.dataset.i));
    });
    render(0);
    new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { progress(); ob.disconnect(); } }, { threshold: 0.3 }).observe(lifeEl);
  }

  // 인쇄(PDF 저장) 직전에 모든 시각화를 최종 상태로 맞추는 함수 목록
  const finals = [];

  /* ---------- 매입 VAN 전환 (포트폴리오) ---------- */
  const sw = $("#vanSwitch");
  let runSwitch = null;
  if (sw) {
    const swCount = $("#swCount");
    const oldLane = $('.lane[data-lane="old"]', sw);
    const newLane = $('.lane[data-lane="new"]', sw);
    const results = $$(".results li", sw);
    let processed = 0, counterOn = false, swRun = 0;
    const tick = () => {
      if (!counterOn) return;
      processed += 7 + Math.floor(Math.random() * 9);
      swCount.textContent = processed.toLocaleString("ko-KR");
      setTimeout(tick, reduced ? 1000 : 120);
    };
    runSwitch = async () => {
      const id = ++swRun, alive = () => id === swRun;
      sw.classList.remove("is-switched");
      oldLane.classList.add("is-active"); newLane.classList.remove("is-active");
      $("#oldState").textContent = "운영 중"; $("#newState").textContent = "대기";
      $("#swStatus").textContent = "기존 VAN 경유 매입 중";
      results.forEach((r) => r.classList.remove("is-on"));
      if (!counterOn) { counterOn = true; tick(); }
      await sleep(2200); if (!alive()) return;
      sw.classList.add("is-switched"); newLane.classList.add("is-active");
      $("#newState").textContent = "연결"; $("#swStatus").textContent = "신규 VAN으로 전환 중 · 매입 정상";
      await sleep(900); if (!alive()) return;
      oldLane.classList.remove("is-active");
      $("#oldState").textContent = "전환 완료"; $("#newState").textContent = "운영 중";
      $("#swStatus").textContent = "신규 VAN 경유 매입 중";
      for (const r of results) { await sleep(350); if (!alive()) return; r.classList.add("is-on"); }
    };
    $("#swReplay")?.addEventListener("click", () => runSwitch());
    finals.push(() => {
      swRun++;
      sw.classList.add("is-switched"); newLane.classList.add("is-active"); oldLane.classList.remove("is-active");
      $("#oldState").textContent = "전환 완료"; $("#newState").textContent = "운영 중";
      $("#swStatus").textContent = "신규 VAN 경유 매입 중";
      results.forEach((r) => r.classList.add("is-on"));
    });
  }
  const runTimeline = async (el) => {
    for (const li of $$("li", el)) { li.classList.add("is-done"); await sleep(260); }
  };

  /* ---------- 매입전문 포맷 동시 전환 ---------- */
  const sync = $("#sync");
  let runSync = null;
  if (sync) {
    const rows = $$(".sync__row", sync);
    const day = $("#syncDay");
    const state = $(".sync__internal span", sync);
    let syncRun = 0;
    runSync = async () => {
      const id = ++syncRun, alive = () => id === syncRun;
      sync.classList.remove("is-live");
      rows.forEach((r) => { r.classList.remove("is-agreed", "is-new"); $(".sync__state", r).textContent = "협의 전"; });
      state.textContent = "내부 매입 로직 · 기존 포맷 기준";
      for (let d = 3; d >= 1; d--) {
        day.textContent = "D-" + d;
        await sleep(450); if (!alive()) return;
        const r = rows[3 - d] ;
        if (r) { r.classList.add("is-agreed"); $(".sync__state", r).textContent = "스펙 합의 완료"; }
      }
      rows.forEach((r) => { r.classList.add("is-agreed"); $(".sync__state", r).textContent = "스펙 합의 완료"; });
      await sleep(600); if (!alive()) return;
      day.textContent = "D-Day";
      rows.forEach((r) => { r.classList.add("is-new"); $(".sync__state", r).textContent = "신규 포맷 적용"; });
      await sleep(400); if (!alive()) return;
      sync.classList.add("is-live");
      state.textContent = "● 전 VAN사 동일 포맷 수신 · 정상 처리";
    };
    $("#syncReplay")?.addEventListener("click", () => runSync());
    finals.push(() => {
      syncRun++;
      day.textContent = "D-Day";
      rows.forEach((r) => { r.classList.add("is-agreed", "is-new"); $(".sync__state", r).textContent = "신규 포맷 적용"; });
      sync.classList.add("is-live");
      state.textContent = "● 전 VAN사 동일 포맷 수신 · 정상 처리";
    });
  }

  /* ---------- reveal observer ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("is-in");
      $$("[data-count]", el).forEach(countUp);
      if (el.matches(".tl")) runTimeline(el);
      if (el.contains(sw) && runSwitch) runSwitch();
      if (el.contains(sync) && runSync) runSync();
      if ($("#terminal", el)) runTerminal();
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- AI 구비서류 자동화 데모 ---------- */
  const DOCS = [
    { org: "A카드사", title: "가맹점 신규 등록 신청서", rows: [["신청일", "date"], ["간판명", "sign"], ["입금계좌", "acct"], ["담당자", "req"]] },
    { org: "B카드사", title: "PG 하위가맹점 등록 요청서", rows: [["가맹점명", "sign"], ["요청자", "req"], ["접수일자", "date"], ["대금계좌", "acct"]] },
    { org: "C카드사", title: "가맹점 개설 의뢰서", rows: [["결제대금 입금계좌", "acct"], ["작성일", "date"], ["상호(간판)", "sign"], ["의뢰자 정보", "req"]] },
  ];
  const docsEl = $("#docs");
  const form = $("#demoForm");
  if (form && docsEl) {
    const total = DOCS.reduce((s, d) => s + d.rows.length, 0);
    $("#manualCount").textContent = total;
    const renderDocs = () => {
      docsEl.innerHTML = DOCS.map((d) => `
        <div class="doc"><div class="doc__scan"></div>
          <div class="doc__top"><b>${d.org}</b><span class="doc__state">대기</span></div>
          <div class="doc__name">${d.title}</div>
          ${d.rows.map(([l, k]) => `<div class="doc__row"><span>${l}</span><output data-key="${k}"></output></div>`).join("")}
        </div>`).join("");
    };
    const typeInto = async (el, text) => {
      el.classList.add("typing");
      if (reduced) el.textContent = text;
      else {
        const c = Math.max(1, Math.ceil(text.length / 10));
        for (let i = 0; i <= text.length; i += c) { el.textContent = text.slice(0, i); await sleep(18); }
        el.textContent = text;
      }
      el.classList.remove("typing");
    };
    renderDocs();
    finals.push(() => {
      const data = Object.fromEntries(new FormData(form));
      $$(".doc", docsEl).forEach((d) => {
        $$("output", d).forEach((o) => (o.textContent = data[o.dataset.key] || "-"));
        d.classList.add("is-done"); $(".doc__state", d).textContent = "✓ 작성 완료";
      });
    });
    let running = false;
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (running) return;
      running = true;
      const btn = $("button", form);
      btn.classList.add("is-running");
      const data = Object.fromEntries(new FormData(form));
      renderDocs();
      const els = $$(".doc", docsEl);
      els.forEach((d) => { d.classList.add("is-scanning"); $(".doc__state", d).textContent = "작성 중"; });
      await sleep(450);
      await Promise.all(els.map(async (d, i) => {
        await sleep(i * 160);
        for (const o of $$("output", d)) await typeInto(o, (data[o.dataset.key] || "-").trim() || "-");
        d.classList.remove("is-scanning"); d.classList.add("is-done");
        $(".doc__state", d).textContent = "✓ 작성 완료";
      }));
      btn.classList.remove("is-running");
      toast(`1회 입력으로 카드사 서류 ${DOCS.length}종 · ${total}개 항목 작성 완료`);
      running = false;
    });
  }

  /* ---------- Built with AI terminal ---------- */
  const term = $("#terminal");
  const script = [
    ["u", "> 이력서·경력기술서·포트폴리오를 다시 만들자. 내가 한 업무는 처음부터 다 설명할게."],
    ["a", "● 업무 설명 분석 → 승인·매입·정산 단계별로 담당 업무 재분류"],
    ["a", "● 프로젝트별 배경 → 역할 및 수행 → 성과 및 회고 구조로 정리"],
    ["a", "● 키워드마다 관련 경험 연결 → 마우스를 올리면 바로 확인"],
    ["u", "> 카드 전문가답게, 하지만 모르는 사람도 이해되게. 깔끔하면서 눈에 띄게."],
    ["a", "● 4개 페이지 구성 · 인터랙티브 프로세스 지도 · 데모 구현"],
    ["ok", "✓ GitHub Pages 배포 완료"],
  ];
  let termStarted = false;
  async function runTerminal() {
    if (termStarted || !term) return;
    termStarted = true;
    for (const [cls, line] of script) {
      const span = document.createElement("span");
      span.className = cls;
      term.appendChild(span);
      if (reduced) span.textContent = line;
      else for (let i = 1; i <= line.length; i++) { span.textContent = line.slice(0, i); await sleep(cls === "u" ? 20 : 9); }
      term.appendChild(document.createTextNode("\n"));
      await sleep(cls === "u" ? 450 : 250);
    }
  }

  /* ---------- utilities ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("이메일 주소를 복사했습니다"); }
    catch { toast(b.dataset.copy); }
  }));
  const finalize = () => {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    $$("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
    $$(".tl li").forEach((li) => li.classList.add("is-done"));
    finals.forEach((f) => f());
  };
  addEventListener("beforeprint", finalize);
  $("#printBtn")?.addEventListener("click", () => { finalize(); window.print(); });
})();

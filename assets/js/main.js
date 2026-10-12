(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  /* ---------- 키워드 → 제가 한 일 + 함께하면 할 수 있는 일 ---------- */
  const KEYWORDS = [
    { keys: ["PG", "오픈마켓"], title: "PG · 오픈마켓",
      exp: "네이버페이의 PG와 오픈마켓, 두 사업의 카드결제 인프라를 모두 운영해 왔습니다.",
      val: "PG 카드 업무 구조를 처음부터 다시 배울 필요 없이 바로 투입됩니다." },
    { keys: ["가맹점번호", "채번", "VAN ID"], title: "가맹점번호 채번",
      exp: "가맹점번호·VAN ID 채번부터 내부 반영, 어드민 매핑, 심사, QA, 실매출까지 개설 전 과정을 전담했습니다.",
      val: "신규 가맹점 개설을 처음부터 끝까지 맡을 수 있습니다." },
    { keys: ["하위몰", "하위몰 심사", "반송"], title: "하위몰 심사",
      exp: "카드사 심사가 반송되면 사유를 찾아 보완하고, 카드사와 협의해 통과시켜 연동 일정을 지켰습니다.",
      val: "심사에 막힌 가맹점도 일정 안에 결제를 열 수 있게 합니다." },
    { keys: ["승인", "승인한도", "매입한도", "담보"], title: "PG 승인·매입한도",
      exp: "한도가 초과되기 전에 카드사·내부 유관부서와 담보를 협의해 미리 증액했습니다.",
      val: "한도 때문에 결제가 막히는 일을 사전에 막습니다." },
    { keys: ["환금성 업종"], title: "환금성 업종 한도",
      exp: "상품권·게임·포인트 충전 업종의 한도 정책을 카드사별로 관리하고, 게임 가맹점 일 한도 20배 상향을 이끌어 냈습니다.",
      val: "카드사가 까다롭게 보는 업종의 협의를 맡겨 주셔도 됩니다." },
    { keys: ["카드 일반결제"], title: "카드 일반결제 정책",
      exp: "카드사 결제창을 거치는 일반결제의 카드사별 정책을 종합 취합하고, 유관부서 문의에 기준을 제시했습니다.",
      val: "흩어진 카드사 정책을 하나의 기준으로 정리합니다." },
    { keys: ["매입", "매입 VAN", "PM"], title: "매입 VAN 연동 PM",
      exp: "신규 매입 VAN사 연동을 PM으로 맡아 스펙 정의부터 QA, 오픈 후 운영까지 장애 0건으로 마쳤습니다.",
      val: "VAN·카드사 연동 프로젝트를 PM으로 이끌 수 있습니다." },
    { keys: ["매입전문", "전문"], title: "매입전문 포맷 변경",
      exp: "연동된 전 VAN사와 동시에 협의해, 같은 날 같은 포맷으로 매입전문을 바꿨습니다.",
      val: "여러 외부사의 일정을 하나로 맞추는 일을 해냅니다." },
    { keys: ["QA", "엣지케이스"], title: "QA · 엣지케이스",
      exp: "예외 상황을 먼저 정의하고, QA 케이스를 직접 설계하고, 결제 건을 직접 만들어 테스트했습니다.",
      val: "오픈 전에 문제를 먼저 찾아냅니다." },
    { keys: ["정산", "차액정산"], title: "차액정산",
      exp: "차액정산 반송이 대량으로 생겼을 때 SQL로 대상 데이터를 직접 뽑아, 카드사와 협의해 정상 처리했습니다.",
      val: "개발 요청을 기다리지 않고 데이터로 바로 움직입니다." },
    { keys: ["채권"], title: "회계 처리 · 채권",
      exp: "카드사 인터페이스 어드민과 서비스 빌링 시스템 간 회계 처리, 채권 생성 방식을 회계·정산 부서와 협의했습니다.",
      val: "대외 협의 결과를 내부 회계까지 연결합니다." },
    { keys: ["여전법"], title: "여전법 준수",
      exp: "가맹점·한도·소득공제 정책을 모두 여전법 기준 위에서 운영해 왔습니다.",
      val: "사업 확장과 규정 준수를 함께 챙깁니다." },
    { keys: ["문화비 소득공제", "소득공제 제외"], title: "소득공제 정책",
      exp: "문화비 소득공제·소득공제 제외 정책을 관리하고 유관부서에 가이드해, 고객이 세금을 더 내지도 덜 내지도 않게 했습니다.",
      val: "신규 서비스에 필요한 세무 정책을 먼저 제시합니다." },
    { keys: ["대사", "연말정산 대사"], title: "연말정산 대사",
      exp: "연말정산 대상 매출을 카드사와 직접 한 건씩 맞춰 봤습니다.",
      val: "숫자가 맞을 때까지 확인합니다." },
    { keys: ["무이자 할부 행사"], title: "무이자 할부 행사",
      exp: "카드사 공문을 취합해 행사 내용이 내부에 정확히 노출되도록 관리했습니다.",
      val: "카드사 행사를 빠르고 정확하게 서비스에 반영합니다." },
    { keys: ["화이트라벨"], title: "화이트라벨 서비스",
      exp: "결제수단 제공을 넘어, 실제 화이트라벨 서비스 오픈에 기여했습니다.",
      val: "신규 결제 서비스를 여는 과정을 경험했습니다." },
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
  // 단계별: 제목 / 네이버페이에서 이 단계가 어떤 일이었는지(외부 사람 기준) / 근거 / 제가 맡은 일 / 함께하면
  const STAGES = [
    {
      label: "가맹점 개설", sub: "결제 준비",
      on: [1, 2, 3, 4], links: ["off", "fwd", "fwd", "fwd"],
      title: "결제를 받으려면, 먼저 카드사에 가맹점 등록부터",
      ctx: "네이버페이는 외부 쇼핑몰(하위몰)과 네이버 서비스 모두에 카드결제를 제공합니다. 새 가맹점이 들어올 때마다 카드사에서 가맹점번호를, VAN사에서 VAN ID를 받아 내부 시스템에 연결하고 카드사 심사를 통과시키는 일이 제 몫이었습니다.",
      proof: ["개설 6단계 전담", "구비서류 리드타임 −50%"],
      mine: ["가맹점번호 채번 → VAN ID 채번 → 어드민 세팅 → 하위몰 심사 → QA → 실매출까지 전 과정 전담", "카드사 심사 반송 시 사유를 찾아 보완하고 카드사와 협의해 통과", "카드사별 구비서류를 AI 프로그램으로 한 번에 작성해 밀린 개설 건 해소"],
      value: "신규·유의업종·해외 가맹점의 카드사 입점을 처음부터 끝까지 맡을 수 있습니다.",
    },
    {
      label: "승인", sub: "한도·정책",
      on: [0, 1, 2, 3, 4], links: ["fwd", "fwd", "opt", "both"],
      title: "‘이 카드로 결제해도 될까요?’를 묻고 답하는 몇 초",
      ctx: "카드사는 PG사업자 전체에, 그리고 상품권·게임 같은 업종에 별도로 승인 한도를 둡니다. 네이버페이 전체 한도와 업종별 한도가 모자라 결제가 막히지 않도록 카드사와 미리 조율하는 일을 맡았습니다.",
      proof: ["게임 가맹점 일 한도 20배", "카드사 직접 협의"],
      mine: ["PG 승인한도 초과 카드사·내부와 담보를 협의해 사전 증액", "상품권·게임·포인트 충전 등 환금성 업종 한도 정책을 카드사별로 관리", "카드 일반결제의 카드사별 정책을 취합해 유관부서 문의에 기준 제시", "결제 실패 시 카드사·VAN사와 원인을 찾아 해소"],
      value: "카드사가 까다롭게 보는 고한도·환금성 업종의 한도 협의를 바로 맡을 수 있습니다.",
    },
    {
      label: "매입", sub: "VAN·전문",
      on: [2, 3, 4], links: ["off", "off", "fwd", "fwd"],
      title: "승인만으로는 돈이 들어오지 않습니다",
      ctx: "승인된 거래는 매입 VAN사를 거쳐 카드사에 청구되어야 대금이 확정됩니다. 네이버페이의 이 청구 경로에 새 VAN사를 연결하고, VAN사들과 주고받는 파일 형식을 바꾸는 프로젝트를 제가 이끌었습니다.",
      proof: ["VAN 연동 PM · 장애 0건", "전 VAN사 D-Day 동시 전환"],
      mine: ["신규 매입 VAN사 연동 PM: 스펙·운영 정책·엣지케이스 정의, QA 설계, 직접 결제 테스트, 오픈 후 운영", "연동된 전 VAN사와 동시에 협의해 같은 날 같은 포맷으로 매입전문 변경", "매입한도 관리, 취소 실패 원인 분석과 재처리 협의"],
      value: "VAN·카드사 신규 연동이나 전문 변경 프로젝트를 PM으로 이끌 수 있습니다.",
    },
    {
      label: "정산", sub: "차액·회계",
      on: [1, 2, 4], dim: [3], links: ["off", "rev", "rev", "rev"],
      title: "카드사 → PG → 하위몰, 돈이 거꾸로 흐르는 단계",
      ctx: "카드사에서 들어온 대금은 하위몰 정산과 네이버페이 내부 회계로 이어집니다. 영세·중소 하위몰에 우대 수수료를 돌려주는 차액정산과, 이 돈을 내부 장부에 어떻게 기록할지를 챙겼습니다.",
      proof: ["SQL로 대량 반송 직접 추출", "회계·정산 부서 협의"],
      mine: ["차액정산 운영, 반송 건은 카드사와 협의해 정상 처리", "반송이 대량 발생했을 때 SQL 쿼리를 직접 작성해 대상 데이터 추출", "카드사 인터페이스 어드민 ↔ 서비스 빌링 시스템 간 회계 처리·채권 생성 방식 협의"],
      value: "카드사와의 대외 협의 결과를 내부 정산·회계까지 연결할 수 있습니다.",
    },
    {
      label: "사후관리", sub: "세무·행사",
      on: [2, 4], dim: [3], links: ["off", "fwd", "both", "both"],
      title: "결제가 끝난 뒤에도, 세금과 규정은 계속됩니다",
      ctx: "카드 매출은 고객의 연말정산 소득공제로 이어집니다. 상품권처럼 공제에서 빠져야 하는 매출과 문화비처럼 추가 공제를 받아야 하는 매출을 구분하는 정책, 그리고 카드사와의 대사를 제가 관리했습니다.",
      proof: ["여전법·소득공제 정책 관리", "연말정산 매출 직접 대사"],
      mine: ["문화비 소득공제·소득공제 제외 정책을 관리하고 유관부서에 가이드", "연말정산 대상 매출을 카드사와 직접 대사", "카드사 무이자 할부 행사 공문을 취합해 내부 노출 관리"],
      value: "규정 준수가 필요한 신규 서비스에 정책 기준을 먼저 제시할 수 있습니다.",
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
            <p class="life__value"><b>함께하면</b>${s.value}</p>
          </div>
          <div class="life__mine">
            <h4>✦ 제가 맡은 일</h4>
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

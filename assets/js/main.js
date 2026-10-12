(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  /* ---------- 용어 사전 (모르는 사람도 이해할 수 있게) ---------- */
  const TERMS = {
    "PG": "전자지급결제대행사. 온라인 쇼핑몰을 대신해 카드사와 가맹점 계약을 맺고, 결제 처리부터 대금 정산까지 맡아 주는 회사입니다.",
    "오픈마켓": "통신판매중개업. 여러 판매자와 구매자를 연결해 주는 플랫폼입니다. 네이버 스마트스토어가 대표적입니다.",
    "하위몰": "PG와 계약해 PG의 카드 가맹점 아래에서 결제를 받는 온라인 쇼핑몰입니다. ‘하위 가맹점’이라고도 합니다.",
    "VAN": "부가가치통신망 사업자. PG·가맹점과 카드사 사이에서 결제 데이터를 중계하는 회사입니다.",
    "매입 VAN": "승인이 끝난 거래 내역(매입 데이터)을 PG로부터 받아 카드사로 전달·중계해 주는 VAN사입니다.",
    "가맹점번호": "카드사가 가맹점마다 부여하는 고유 번호입니다. 카드사는 이 번호로 어느 가맹점의 거래인지, 수수료·한도를 얼마로 적용할지 판단합니다.",
    "채번": "번호를 새로 발급받는 일입니다. 가맹점번호 채번 = 카드사에 서류를 내고 새 가맹점번호를 받는 것.",
    "VAN ID": "VAN사가 거래를 중계하기 위해 가맹점(또는 PG)에 부여하는 식별값입니다. 카드사 가맹점번호와 짝지어 관리합니다.",
    "하위몰 심사": "PG가 새 하위몰을 받을 때 카드사가 그 쇼핑몰의 업종·사업 내용·리스크를 확인하는 절차입니다. 통과해야 카드 결제를 열 수 있습니다.",
    "반송": "카드사가 서류·심사·데이터를 처리하지 않고 사유 코드와 함께 되돌려 보내는 것입니다.",
    "승인": "결제하는 순간 카드사가 카드가 정상인지, 한도가 남았는지 확인하고 결제를 허락하는 단계입니다. 승인번호가 발급됩니다.",
    "매입": "승인된 거래를 카드사에 ‘대금을 달라’고 청구하는 단계입니다. 승인만으로는 돈이 들어오지 않고, 매입이 확정되어야 정산됩니다.",
    "정산": "카드사가 수수료를 뺀 결제 대금을 PG에 지급하고, PG가 다시 하위몰에 지급하는 단계입니다.",
    "매입전문": "PG·VAN·카드사가 매입 데이터를 주고받을 때 쓰는 약속된 파일 형식입니다. 어떤 항목을 몇 번째 자리에, 몇 글자로 넣을지까지 정해져 있습니다.",
    "전문": "기관끼리 데이터를 주고받기 위해 미리 약속한 메시지 형식입니다.",
    "차액정산": "영세·중소 하위몰도 우대 수수료를 적용받을 수 있도록, 카드사가 PG에 수수료 차액을 돌려주고 PG가 이를 하위몰에 지급하는 제도입니다.",
    "환금성 업종": "상품권·게임 아이템·포인트 충전처럼 현금으로 바꾸기 쉬운 업종입니다. 카드깡 같은 부정 사용 위험 때문에 카드사가 별도 한도를 둡니다.",
    "여전법": "여신전문금융업법. 카드사와 카드 가맹점이 지켜야 할 의무(가맹점 관리, 부당 결제 금지 등)를 정한 법입니다.",
    "문화비 소득공제": "도서·공연 등 문화비로 쓴 카드 금액에 추가 소득공제를 해 주는 제도입니다. 따로 등록된 가맹점번호로 결제해야 공제가 인정됩니다.",
    "소득공제 제외": "상품권 구매처럼 연말정산 신용카드 소득공제 대상에서 빠져야 하는 매출입니다. 잘못 섞이면 공제가 과다·과소 적용됩니다.",
    "연말정산 대사": "연말정산에 반영될 카드 매출이 카드사 데이터와 우리 데이터에서 일치하는지 한 건 한 건 맞춰 보는 작업입니다.",
    "대사": "두 기관이 가진 거래 데이터가 서로 일치하는지 대조하는 작업입니다.",
    "승인한도": "카드사가 PG사업자 전체에 허용하는 일정 기간 승인 금액의 상한입니다. 넘으면 결제가 막힐 수 있습니다.",
    "매입한도": "카드사가 PG사업자에게 허용하는 일정 기간 매입(청구) 금액의 상한입니다.",
    "담보": "한도를 늘릴 때 카드사가 대금 지급을 보장받기 위해 요구하는 보증 수단입니다.",
    "무이자 할부 행사": "카드사가 업종·기간을 정해 할부 이자를 대신 부담하는 행사입니다. 카드사 공문으로 내용이 공유됩니다.",
    "카드 일반결제": "간편결제 주문서가 아니라 카드사 결제창을 거쳐 진행되는 카드 결제입니다. 카드사별 정책이 그대로 적용됩니다.",
    "BIN": "카드번호 앞 6~8자리로, 어느 카드사의 어떤 카드인지 식별하는 번호입니다.",
    "화이트라벨": "결제 인프라를 다른 회사가 자기 브랜드로 쓸 수 있게 제공하는 방식입니다.",
    "채권": "회계상 ‘받아야 할 돈’으로 기록하는 것입니다. 정산 구조에 따라 언제, 누구에게 채권을 잡을지 정해야 합니다.",
    "QA": "출시 전에 실제 상황처럼 테스트해 품질을 검증하는 과정입니다.",
    "엣지케이스": "자주 일어나지 않지만, 발생하면 장애나 오류로 이어지는 예외 상황입니다.",
    "PM": "프로젝트 매니저. 일정·범위·이해관계자를 조율해 프로젝트를 끝까지 이끄는 역할입니다.",
    "원천사": "결제 수단을 실제로 제공하는 기관입니다. 카드 결제에서는 카드사를 말합니다.",
    "어드민": "내부 담당자가 설정과 데이터를 관리하는 관리자 화면입니다.",
  };

  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  let tipFor = null;
  const showTip = (el) => {
    const key = el.dataset.t || el.textContent.trim();
    const def = TERMS[key];
    if (!def) return;
    tipFor = el;
    tip.innerHTML = `<b>${key}</b>${def}`;
    tip.classList.add("is-show");
    const r = el.getBoundingClientRect();
    const tw = Math.min(300, innerWidth - 24);
    tip.style.maxWidth = tw + "px";
    const left = Math.max(12, Math.min(r.left + r.width / 2 - tw / 2, innerWidth - tw - 12));
    const below = r.bottom + 10 + tip.offsetHeight < innerHeight;
    tip.style.left = left + "px";
    tip.style.top = (below ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + "px";
  };
  const hideTip = () => { tip.classList.remove("is-show"); tipFor = null; };
  $$(".t").forEach((el) => {
    el.tabIndex = 0;
    el.addEventListener("mouseenter", () => showTip(el));
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", () => showTip(el));
    el.addEventListener("blur", hideTip);
    el.addEventListener("click", (e) => { e.stopPropagation(); tipFor === el ? hideTip() : showTip(el); });
  });
  document.addEventListener("click", hideTip);
  addEventListener("scroll", hideTip, { passive: true });

  // 용어 사전 목록 렌더링 (경력기술서 하단)
  const gl = $("#glossary");
  if (gl) gl.innerHTML = Object.entries(TERMS).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

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
  const STAGES = [
    {
      key: "open", label: "가맹점 개설", sub: "결제 준비",
      on: [1, 2, 3, 4], links: ["off", "fwd", "fwd", "fwd"],
      title: "결제를 받으려면, 먼저 카드사에 ‘가게 등록’부터",
      desc: "하위몰이 카드 결제를 받으려면 카드사가 발급한 가맹점번호가 있어야 합니다. 이 번호가 카드사·VAN·PG를 잇는 열쇠 역할을 하고, 카드사는 하위몰 심사로 업종과 리스크를 확인합니다.",
      caption: "PG는 카드사에 구비서류를 내 가맹점번호를 받고, VAN사에서 VAN ID를 받아 내부 시스템에 연결합니다.",
      mine: ["가맹점번호 채번 → VAN ID 채번 → 어드민 세팅 → 하위몰 심사 → QA → 실매출까지 전 과정 담당", "카드사별로 다른 구비서류를 AI 프로그램으로 한 번에 작성", "가맹점번호 통합 관리, 내부 어드민과 매핑"],
      issue: "<b>심사 반송</b> → 반송 사유를 파악하고 카드사와 협의해 심사 통과, 가맹점 연동 일정 확보",
    },
    {
      key: "auth", label: "승인", sub: "결제하는 순간",
      on: [0, 1, 2, 3, 4], links: ["fwd", "fwd", "opt", "both"],
      title: "‘이 카드로 결제해도 될까요?’를 묻고 답하는 몇 초",
      desc: "고객이 결제 버튼을 누르면 PG가 카드사에 승인을 요청하고, 카드사는 카드 상태와 한도를 확인해 승인번호를 돌려줍니다. 이때 PG사업자 전체에 걸린 승인한도와 업종별 한도도 함께 적용됩니다.",
      caption: "승인은 카드사와 직접 연동하거나 VAN을 거쳐 이루어집니다(점선).",
      mine: ["카드사별 PG 승인한도 모니터링, 초과 전 담보 협의로 사전 증액", "상품권·게임·포인트 충전 등 환금성 업종 한도 정책을 전 카드사 기준으로 관리", "카드 일반결제(카드사 결제창) 정책을 종합 취합해 유관부서 문의 대응"],
      issue: "<b>결제 실패</b> → 카드사·VAN사와 실패 원인을 확인하고 유관부서와 해소",
    },
    {
      key: "acq", label: "매입", sub: "대금 청구",
      on: [2, 3, 4], links: ["off", "off", "fwd", "fwd"],
      title: "승인만으로는 돈이 들어오지 않습니다",
      desc: "승인된 거래는 매입 단계에서 카드사에 대금을 청구해야 확정됩니다. PG는 거래 내역을 매입전문 파일로 만들어 매입 VAN에 보내고, VAN은 이를 카드사로 중계합니다. 카드사는 매입을 확정하거나 반송합니다.",
      caption: "매입전문 형식이 한 칸만 어긋나도 매입이 실패하고, 정산과 가맹점 신뢰로 번집니다.",
      mine: ["매입 중계 VAN사 신규 연동 단독 PM: 스펙 정의부터 QA, 오픈 후 운영까지", "연동된 전 VAN사의 매입전문 포맷을 같은 날 동시에 변경", "PG 매입한도 관리, 취소 실패 원인 분석 및 대응"],
      issue: "<b>취소 실패·매입 오류</b> → VAN사·카드사와 원인 확인, 재처리 협의",
    },
    {
      key: "settle", label: "정산", sub: "대금 지급",
      on: [1, 2, 4], dim: [3], links: ["off", "rev", "rev", "rev"],
      title: "카드사 → PG → 하위몰, 돈이 거꾸로 흐르는 단계",
      desc: "매입이 확정되면 카드사는 수수료를 뺀 대금을 PG에 지급하고, PG는 다시 하위몰에 정산합니다. 영세·중소 하위몰에는 우대 수수료를 적용하기 위한 차액정산이 따로 이루어집니다.",
      caption: "대금은 카드사에서 PG로 지급됩니다. VAN은 정산 대금을 거치지 않습니다(흐리게 표시).",
      mine: ["차액정산 운영, 반송 건은 카드사와 협의해 정상 처리", "차액정산 반송이 대량 발생했을 때 SQL로 대상 데이터 직접 추출", "카드사 인터페이스 어드민 ↔ 서비스 빌링 시스템 간 회계 처리·채권 생성 방식을 회계·정산 부서와 협의"],
      issue: "<b>차액정산 반송</b> → 반송 사유별로 카드사와 협의해 정상 차액정산 처리",
    },
    {
      key: "after", label: "사후관리", sub: "세무·대사·행사",
      on: [2, 4], dim: [3], links: ["off", "fwd", "both", "both"],
      title: "결제가 끝난 뒤에도, 세금과 규정은 계속됩니다",
      desc: "카드 매출은 연말정산 소득공제와 연결됩니다. 상품권처럼 공제에서 빠져야 하는 매출, 문화비처럼 추가 공제를 받아야 하는 매출을 정확히 구분해야 고객이 세금을 더 내지도, 덜 내지도 않습니다.",
      caption: "카드사·은행·한국문화정보원 등과 대상 매출을 대사하고, 정책은 유관부서에 가이드합니다.",
      mine: ["문화비 소득공제·소득공제 제외 정책 관리, 유관부서에 준수 가이드", "연말정산 대상 매출을 카드사와 직접 대사", "카드사 무이자 할부 행사 공문 취합 → 내부 노출 관리"],
      issue: "<b>정책 미준수 위험</b> → 신규 서비스·가맹점에 적용할 공제 정책을 사전에 안내",
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
            <p>${s.desc}</p>
            <p class="life__caption">${s.caption}</p>
          </div>
          <div class="life__mine">
            <h4>✦ 여기서 제가 한 일</h4>
            <ul>${s.mine.map((m) => `<li>${m}</li>`).join("")}</ul>
            <p class="life__issue">${s.issue}</p>
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
    ["a", "● 전문 용어 35개 사전화 → 마우스를 올리면 쉬운 설명 표시"],
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

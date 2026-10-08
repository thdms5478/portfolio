(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  /* ---------- nav, progress, active section ---------- */
  const nav = $("#nav");
  const bar = $("#progressBar");
  const links = $$(".nav__links a");
  const sections = links.map((a) => $(a.getAttribute("href")));
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    nav.classList.toggle("is-solid", y > innerHeight * 0.6);
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 120) current = i; });
    links.forEach((a, i) => a.classList.toggle("is-active", i === current));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- hero keyword rotator ---------- */
  const words = ["원천사 협상", "인프라 연동", "AI 자동화", "정산 운영"];
  const rot = $("#rotator");
  if (rot && !reduced) {
    let w = 0;
    (async function loop() {
      for (;;) {
        await sleep(2200);
        const cur = words[w];
        for (let i = cur.length; i >= 0; i--) { rot.textContent = cur.slice(0, i); await sleep(45); }
        w = (w + 1) % words.length;
        const next = words[w];
        for (let i = 1; i <= next.length; i++) { rot.textContent = next.slice(0, i); await sleep(90); }
      }
    })();
  }

  /* ---------- hero console log ---------- */
  const log = $("#consoleLog");
  const events = [
    ['<span class="k">[승인]</span> 게임 가맹점 결제 요청 → 카드사 응답 <span class="ok">0000 정상</span>'],
    ['<span class="k">[매입]</span> 신규 VAN 경유 매입 전문 송신 <span class="ok">OK</span>'],
    ['<span class="k">[한도]</span> 일 한도 10,000,000원 적용 <span class="ok">승인</span>'],
    ['<span class="ai">[AI]</span> 원천사 구비서류 3종 자동 생성 <span class="ok">완료</span>'],
    ['<span class="k">[정산]</span> 차액정산 대사 결과 <span class="ok">불일치 0건</span>'],
    ['<span class="k">[BIN]</span> 카드 BIN 테이블 동기화 <span class="ok">OK</span>'],
    ['<span class="k">[취소]</span> 실패 사유 VAN사 확인 → 유관부서 공유 <span class="ok">해결</span>'],
    ['<span class="k">[대사]</span> 문화비 소득공제 대상 가맹점 대사 <span class="ok">일치</span>'],
  ];
  if (log) {
    let i = 0;
    const push = () => {
      const li = document.createElement("li");
      const t = new Date();
      const ts = [t.getHours(), t.getMinutes(), t.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
      li.innerHTML = `<span class="m">${ts}</span> ${events[i % events.length]}`;
      log.appendChild(li);
      while (log.children.length > 6) log.firstElementChild.remove();
      i++;
    };
    for (let k = 0; k < 4; k++) push();
    if (!reduced) setInterval(push, 1600);
  }

  /* ---------- count-up ---------- */
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    if (reduced || end === 0) { el.textContent = end; return; }
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- VAN migration: steps + live switch-over ---------- */
  const sw = $("#vanSwitch");
  const swCount = $("#swCount");
  const oldLane = $('.lane[data-lane="old"]');
  const newLane = $('.lane[data-lane="new"]');
  const results = $$(".results li");
  let processed = 0;
  let counterOn = false;
  // 매입 처리 건수는 전환 중에도 멈추지 않고 계속 증가 → '무중단'을 시각화
  const tick = () => {
    if (!counterOn) return;
    processed += 7 + Math.floor(Math.random() * 9);
    swCount.textContent = processed.toLocaleString("ko-KR");
    setTimeout(tick, reduced ? 1000 : 120);
  };
  let swRun = 0;
  const runSwitch = async () => {
    const id = ++swRun;
    const alive = () => id === swRun;
    sw.classList.remove("is-switched");
    oldLane.classList.add("is-active");
    newLane.classList.remove("is-active");
    $("#oldState").textContent = "운영 중";
    $("#newState").textContent = "대기";
    $("#swStatus").textContent = "기존 VAN 경유 매입 중";
    results.forEach((r) => r.classList.remove("is-on"));
    if (!counterOn) { counterOn = true; tick(); }

    await sleep(2200); if (!alive()) return;
    sw.classList.add("is-switched");
    newLane.classList.add("is-active");
    $("#newState").textContent = "연결";
    $("#swStatus").textContent = "신규 VAN으로 전환 중 · 매입 정상";

    await sleep(900); if (!alive()) return;
    oldLane.classList.remove("is-active");
    $("#oldState").textContent = "전환 완료";
    $("#newState").textContent = "운영 중";
    $("#swStatus").textContent = "신규 VAN 경유 매입 중";

    for (const r of results) { await sleep(350); if (!alive()) return; r.classList.add("is-on"); }
  };
  $("#swReplay")?.addEventListener("click", runSwitch);

  const runMigration = async () => {
    const steps = $$("#chevrons li");
    for (const s of steps) { s.classList.add("is-done"); await sleep(550); }
    if (sw) runSwitch();
  };

  /* ---------- reveal observer ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("is-in");
      $$("[data-count]", el).forEach(countUp);
      if (el.dataset.count) countUp(el);
      if ($("#chevrons", el)) runMigration();
      if ($("#terminal", el)) runTerminal();
      io.unobserve(el);
    });
  }, { threshold: 0.18 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- AI document automation demo ---------- */
  const DOCS = [
    { org: "A카드사", title: "가맹점 입점 심사 신청서", rows: [["상호", "name"], ["사업자번호", "biz"], ["대표자", "ceo"], ["업종", "type"], ["URL", "url"]] },
    { org: "B카드사", title: "하위몰 등록 요청서", rows: [["가맹점명", "name"], ["대표자 성명", "ceo"], ["사업자번호", "biz"], ["판매 상품", "type"], ["사이트", "url"]] },
    { org: "C은행", title: "가맹점 정보 변경 신고서", rows: [["사업자번호", "biz"], ["법인/상호명", "name"], ["업태·종목", "type"], ["대표자", "ceo"], ["홈페이지", "url"]] },
  ];
  const docsEl = $("#docs");
  const form = $("#demoForm");
  const manual = $("#manualCount");
  const renderDocs = () => {
    docsEl.innerHTML = DOCS.map((d, i) => `
      <div class="doc" data-i="${i}">
        <div class="doc__scan"></div>
        <div class="doc__top"><b>${d.org}</b><span class="doc__state">대기</span></div>
        <div class="doc__name">${d.title}</div>
        ${d.rows.map(([label, key]) => `<div class="doc__row"><span>${label}</span><output data-key="${key}"></output></div>`).join("")}
      </div>`).join("");
  };
  const typeInto = async (el, text) => {
    el.classList.add("typing");
    if (reduced) { el.textContent = text; }
    else {
      const chunk = Math.max(1, Math.ceil(text.length / 12));
      for (let i = 0; i <= text.length; i += chunk) { el.textContent = text.slice(0, i); await sleep(18); }
      el.textContent = text;
    }
    el.classList.remove("typing");
  };
  let running = false;
  if (form) {
    renderDocs();
    const totalFields = DOCS.reduce((s, d) => s + d.rows.length, 0);
    manual.textContent = totalFields;
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (running) return;
      running = true;
      const btn = $("#demoRun");
      btn.classList.add("is-running");
      const data = Object.fromEntries(new FormData(form));
      renderDocs();
      const docEls = $$(".doc", docsEl);
      docEls.forEach((d) => { d.classList.add("is-scanning"); $(".doc__state", d).textContent = "AI 작성 중"; });
      await sleep(500);
      await Promise.all(docEls.map(async (d, di) => {
        await sleep(di * 180);
        for (const out of $$("output", d)) await typeInto(out, (data[out.dataset.key] || "-").trim() || "-");
        d.classList.remove("is-scanning");
        d.classList.add("is-done");
        $(".doc__state", d).textContent = "✓ 검증 완료";
      }));
      btn.classList.remove("is-running");
      toast(`입력 1회로 서류 ${DOCS.length}종 · ${totalFields}개 항목 자동 작성 완료`);
      running = false;
    });
  }

  /* ---------- Built-with-AI terminal ---------- */
  const term = $("#terminal");
  const script = [
    ["u", "> 이력서·포트폴리오 PDF를 읽고, 채용담당자가 3분 안에 내 강점을 파악할 수 있는 웹 포트폴리오를 만들어줘."],
    ["a", "● PDF 2건 분석 완료 — 핵심 성과 3건, 운영 업무 14건 추출"],
    ["a", "● 레퍼런스 디자인 분석 → 섹션 구조·카드 레이아웃 설계"],
    ["u", "> 보수적으로 쓴 표현은 능력이 잘 드러나게 다듬어줘. AI 활용 역량이 돋보이게."],
    ["a", "● 성과 중심 카피로 재작성 · 자동화 체험 데모 구현"],
    ["a", "● 반응형 · 인쇄(PDF) 레이아웃 · 접근성 점검"],
    ["u", "> GitHub에 배포까지 해줘."],
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
      else for (let i = 1; i <= line.length; i++) { span.textContent = line.slice(0, i); await sleep(cls === "u" ? 22 : 10); }
      term.appendChild(document.createTextNode("\n"));
      await sleep(cls === "u" ? 500 : 280);
    }
  }

  /* ---------- career filter ---------- */
  const chips = $$(".chip");
  const tasks = $$("#tasks li");
  chips.forEach((c) => c.addEventListener("click", () => {
    chips.forEach((x) => x.classList.toggle("is-on", x === c));
    const f = c.dataset.filter;
    tasks.forEach((t) => {
      const hit = f === "all" || t.dataset.cat === f;
      t.classList.toggle("is-dim", !hit);
      t.classList.toggle("is-hit", hit && f !== "all" && f !== "ai");
    });
  }));

  /* ---------- utilities ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }
  $("#copyEmail")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("thdms5478@naver.com"); toast("이메일 주소를 복사했습니다"); }
    catch { toast("thdms5478@naver.com"); }
  });
  $("#printBtn")?.addEventListener("click", () => {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    window.print();
  });
})();

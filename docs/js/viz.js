(() => {
  const viz_top = document.getElementById("viz-top");
  const viz_bottom = document.getElementById("viz-bottom");
  if (!viz_top || !viz_bottom) return;

  // 설정값
  const COUNT = 28; // 막대 개수
  const BASE = 10; // 기본 높이(px)
  const AMPLITUDE = 60; // 최대 높이 증가량(px)
  const SPREAD = 50; // 가우스 spread
  const THRESHOLDY = 750; // 아래쪽 바에 영향을 미칠 수 있는 최대 Y값

  const top_bars = [];
  const bottom_bars = [];

  // 막대 DOM 생성
  for (let i = 0; i < COUNT; i++) {
    const bt = document.createElement("div");
    bt.className = "bar";
    viz_top.appendChild(bt);
    top_bars.push(bt);

    const bb = document.createElement("div");
    bb.className = "bar";
    viz_bottom.appendChild(bb);
    bottom_bars.push(bb);
  }

  let centers = [];
  // 각 막대의 중심 X 좌표 계산
  function computeCenters() {
    centers = top_bars.map((el) => {
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2 + window.scrollX;
    });
  }

  // viz-top 아래쪽 Y 좌표
  let viz_top_coordinate = 0;
  function computeTop() {
    const vr = viz_top.getBoundingClientRect();
    viz_top_coordinate = vr.bottom + window.scrollY;
  }

  // viz-bottom 위쪽 Y 좌표
  let viz_bottom_coordinate = 0;
  function computeBottom() {
    const vr = viz_bottom.getBoundingClientRect();
    viz_bottom_coordinate = vr.top + window.scrollY;
  }

  // 이벤트 등록
  window.addEventListener("load", computeCenters);
  window.addEventListener("resize", computeCenters);
  window.addEventListener("scroll", computeCenters, { passive: true });
  window.addEventListener("scroll", computeTop, { passive: true });
  window.addEventListener("scroll", computeBottom, { passive: true });

  // 마우스/터치 좌표 저장
  let mouseX = window.innerWidth / 2;
  let mouseY = Number.POSITIVE_INFINITY;

  function setPointer(x, y) {
    mouseX = x;
    mouseY = y;
  }

  window.addEventListener("mousemove", (e) => setPointer(e.pageX, e.pageY));
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches[0]) {
        setPointer(e.touches[0].pageX, e.touches[0].pageY);
      }
    },
    { passive: true }
  );

  // 가우스 곡선 기반 높이 계산
  function heightFromDistance(dx, amplitude) {
    const gauss = Math.exp(-(dx * dx) / (2 * SPREAD * SPREAD));
    return BASE + amplitude * gauss;
  }

  function render() {
    // 활성 상태 판단 (마우스가 위/아래쪽 범위에 있을 때만)
    const top_active = mouseY < viz_top_coordinate;
    const bottom_active = mouseY > viz_bottom_coordinate;

    // 요소의 현재 화면 좌표
    const topRect = viz_top.getBoundingClientRect();
    const bottomRect = viz_bottom.getBoundingClientRect();

    // 마우스가 해당 viz 안쪽에 있는지 여부
    const topInside =
      mouseY >= topRect.top + window.scrollY &&
      mouseY <= topRect.bottom + window.scrollY;

    const bottomInside =
      mouseY >= bottomRect.top + window.scrollY &&
      mouseY <= bottomRect.bottom + window.scrollY;

    // --- 위쪽 막대 ---
    for (let i = 0; i < top_bars.length; i++) {
      const dx = centers[i] - mouseX;
      let target = top_active ? heightFromDistance(dx, AMPLITUDE) : BASE;

      // 안쪽일 경우 마우스 위치까지만 제한
      if (topInside && mouseY !== Number.POSITIVE_INFINITY) {
        const maxHeight =
          viz_top.offsetHeight - mouseY + topRect.top + window.scrollY;
        const allowedAmplitude = Math.max(0, maxHeight - BASE);
        target = top_active ? heightFromDistance(dx, allowedAmplitude) : BASE;
      }
      top_bars[i].style.height = `${target}px`;
    }

    // --- 아래쪽 막대 ---
    for (let i = 0; i < bottom_bars.length; i++) {
      const dx = centers[i] - mouseX;
      let target = bottom_active ? heightFromDistance(dx, AMPLITUDE) : BASE;

      // 안쪽일 경우 마우스 위치까지만 제한
      if (bottomInside && mouseY !== Number.POSITIVE_INFINITY) {
        const maxHeight =
          viz_bottom.offsetHeight -
          (bottomRect.bottom + window.scrollY) +
          mouseY;
        const allowedAmplitude = Math.max(0, maxHeight - BASE);
        target = bottom_active
          ? heightFromDistance(dx, allowedAmplitude)
          : BASE;
      }

      if (mouseY > THRESHOLDY) {
        target = BASE;
      }

      bottom_bars[i].style.height = `${target}px`;
    }

    requestAnimationFrame(render);
  }

  // 초기 렌더링
  computeCenters();
  computeTop();
  computeBottom();
  render();
})();

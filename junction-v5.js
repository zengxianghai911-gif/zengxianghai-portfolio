'use strict';
{
  const rooms = {
    atrium: { name: '中庭', title: '折线展厅', code: 'A–00', point: [50, 84], tint: '#d9f889',
      caption: '曾湘海的电商视觉作品集。左转看商品主图，直行看详情页，右转看精修与合成。',
      exits: {left: 'product', forward: 'detail', right: 'retouch'} },
    product: { name: '商品主图', code: 'B–01', point: [16, 60], tint: '#a0b8ff', art: ['17', '20', '18'],
      caption: '用构图、光线与色彩把商品推到视觉中心，再把材质和卖点交代清楚。',
      exits: {back: 'atrium', forward: 'campaign', right: 'detail'} },
    detail: { name: '详情页设计', code: 'B–02', point: [50, 52], tint: '#e7c78c', art: ['23', '04', '05'],
      caption: '从首屏到局部特写，把产品卖点和使用场景编排成可以逐段查看的长图。',
      exits: {left: 'product', back: 'atrium', forward: 'archive', right: 'retouch'} },
    retouch: { name: '图片精修', code: 'B–03', point: [84, 60], tint: '#c6aeef', art: ['22', '08', '09'],
      caption: '清理杂光和干扰，重新梳理轮廓、反射与材质。继续向前，可以拖动查看三组原片对比。',
      exits: {left: 'detail', back: 'atrium', forward: 'compare'} },
    campaign: { name: '活动与包装', code: 'C–01', point: [16, 24], tint: '#ff9abd', art: ['21', '19', '24'],
      caption: '从活动主视觉到系列包装，让色彩和字体既能抓住视线，也能维持统一的识别度。',
      exits: {back: 'product', right: 'archive'} },
    compare: { name: '原片与成片', code: 'D–03', point: [84, 24], tint: '#c7f294',
      exits: {left: 'archive', back: 'retouch'} },
    archive: { name: '全部作品', code: 'C–02', point: [50, 16], tint: '#dfebc2',
      exits: {left: 'campaign', back: 'detail', right: 'compare'} }
  };
  const directions = {left: '左转', back: '后退', forward: '向前', right: '右转'};
  const arrows = {left: '←', back: '↓', forward: '↑', right: '→'};
  const keys = {ArrowLeft: 'left', ArrowDown: 'back', ArrowUp: 'forward', ArrowRight: 'right'};
  const legacy = {'room-2': 'product', 'room-3': 'detail', 'room-4': 'retouch', 'room-5': 'campaign', 'room-6': 'archive'};
  const byId = id => document.getElementById(id);
  const app = byId('junction');
  const hall = byId('hall');
  const hallTitle = byId('hall-title');
  const hallScene = byId('hall-scene');
  const hallSet = byId('hall-set');
  const stage = byId('scene-stage');
  const compare = byId('comparison');
  const archive = byId('collection');
  const veil = byId('junction-veil');
  const route = byId('route-dialog');
  const plan = byId('plan');
  const miniMap = byId('mini-map');
  const motion = byId('toggle-motion');
  const movement = Array.from(byId('junction-directions').querySelectorAll('button'));
  const catalogue = new Map(window.PORTFOLIO_WORKS.map(art => [art.id, art]));
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const mapButtons = new Map();
  let current = '';
  let manualMotion = false;
  let transitioning = false;
  let pendingAddress = false;
  let gesture;
  let animated = [];
  try { manualMotion = localStorage.getItem('portfolio-reduce-motion') === 'true'; } catch {}

  function syncMotion() {
    const reduced = manualMotion || media.matches;
    document.documentElement.dataset.reduceMotion = String(reduced);
    motion.setAttribute('aria-pressed', String(reduced));
    motion.disabled = media.matches;
    motion.textContent = media.matches ? '系统已减少动效' : '减少动效';
    if (reduced) animated.forEach(animation => animation.cancel());
  }
  motion.addEventListener('click', () => {
    manualMotion = !manualMotion;
    try { localStorage.setItem('portfolio-reduce-motion', String(manualMotion)); } catch {}
    syncMotion();
  });
  media.addEventListener?.('change', syncMotion);
  syncMotion();

  function readRoom() {
    const hash = location.hash.slice(1);
    return Object.hasOwn(rooms, hash) ? hash : legacy[hash] || 'atrium';
  }

  function drawMap(canvas, compact) {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * dpr);
    canvas.height = Math.round(bounds.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const position = room => [room.point[0] * bounds.width / 100, room.point[1] * bounds.height / 100];
    const paths = new Set();
    for (const [id, room] of Object.entries(rooms)) {
      for (const target of Object.values(room.exits)) {
        const edge = [id, target].sort().join('/');
        if (paths.has(edge)) continue;
        paths.add(edge);
        const points = [position(room), position(rooms[target])];
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        ctx.lineTo(...points[1]);
        const active = id === current || target === current;
        ctx.strokeStyle = active ? rooms[current].tint : '#e5edd24d';
        ctx.lineWidth = active ? (compact ? 1.3 : 1.8) : 1;
        ctx.setLineDash(active ? [] : [3, 4]);
        ctx.stroke();
      }
    }
    if (!compact) return;
    for (const [id, room] of Object.entries(rooms)) {
      const [x, y] = position(room);
      const size = id === current ? 7 : 4;
      ctx.fillStyle = id === current ? room.tint : '#bdc9b2';
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }

  function updateMap() {
    for (const [id, button] of mapButtons) {
      if (id === current) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    }
    miniMap.querySelector('span').textContent = rooms[current].code;
    drawMap(miniMap.querySelector('canvas'), true);
    if (route.open) drawMap(plan.querySelector('canvas'), false);
  }

  function makeButton(label, className, activate) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', activate);
    return button;
  }

  for (const [id, room] of Object.entries(rooms)) {
    const button = makeButton('', 'plan-point', () => {
      route.close();
      void navigate(id);
    });
    const code = document.createElement('small');
    code.textContent = room.code;
    button.append(code, document.createTextNode(room.name));
    button.style.left = room.point[0] + '%';
    button.style.top = room.point[1] + '%';
    button.style.setProperty('--point-tint', room.tint);
    mapButtons.set(id, button);
    plan.append(button);
  }

  function showMap() {
    if (transitioning) return;
    route.showModal();
    updateMap();
    mapButtons.get(current)?.focus({preventScroll: true});
  }
  byId('show-route').addEventListener('click', showMap);
  miniMap.addEventListener('click', showMap);
  byId('route-close').addEventListener('click', () => route.close());
  window.addEventListener('resize', updateMap);

  function artwork(id, scope) {
    document.dispatchEvent(new CustomEvent('portfolio:open', {detail: {id, scope}}));
  }

  function frameImage(art) {
    const image = new Image();
    image.src = art.thumb || 'assets/' + art.id + '-thumb.jpg';
    image.alt = '';
    image.draggable = false;
    image.decoding = 'async';
    return image;
  }

  function labelFrame(button, title, marker) {
    const label = document.createElement('span');
    const icon = document.createElement('b');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = marker;
    label.append(document.createTextNode(title), icon);
    button.append(label);
  }

  function renderHall(id, room) {
    byId('hall-coordinate').textContent = room.code + '  /  ' + (id === 'atrium' ? '电商视觉作品集' : '作品展区');
    hallTitle.textContent = room.title || room.name;
    byId('hall-caption').textContent = room.caption;
    const actions = byId('hall-actions');
    actions.replaceChildren();
    if (id === 'atrium') {
      actions.append(makeButton('查看地图 ↗', 'hall-action', showMap));
      const galleries = [['left', '17'], ['forward', '23'], ['right', '20']];
      hallSet.replaceChildren(...galleries.map(([direction, artId]) => {
        const target = room.exits[direction];
        const button = makeButton('', 'hall-door', () => void navigate(target, direction));
        button.style.setProperty('--door-tint', rooms[target].tint);
        button.append(frameImage(catalogue.get(artId)));
        labelFrame(button, rooms[target].name, arrows[direction]);
        return button;
      }));
      return;
    }
    if (id === 'retouch' || id === 'product') {
      actions.append(makeButton('看原片与成片 ↗', 'hall-action hall-action-accent', () => void navigate('compare')));
    }
    hallSet.replaceChildren(...room.art.map(artId => {
      const art = catalogue.get(artId);
      const button = makeButton('', 'hall-frame', () => artwork(artId, room.art));
      button.dataset.detail = String(art.ratio === '详情长图');
      button.append(frameImage(art));
      labelFrame(button, art.title, '↗');
      return button;
    }));
  }

  function syncDirections() {
    const room = rooms[current];
    for (const button of movement) {
      const direction = button.dataset.direction;
      const destination = rooms[room.exits[direction]];
      button.disabled = transitioning || !destination;
      button.toggleAttribute('data-open', Boolean(destination));
      button.lastElementChild.textContent = destination?.name || directions[direction];
      button.setAttribute('aria-label', destination ? directions[direction] + '前往' + destination.name : directions[direction]);
    }
  }

  function paint(id, focus) {
    current = id;
    const room = rooms[id];
    app.dataset.room = id;
    app.style.setProperty('--room-tint', room.tint);
    hall.hidden = id === 'compare' || id === 'archive';
    compare.hidden = id !== 'compare';
    archive.hidden = id !== 'archive';
    if (!hall.hidden) renderHall(id, room);
    byId('location-code').textContent = room.code;
    byId('location-title').textContent = room.name;
    byId('show-collection').setAttribute('aria-current', id === 'archive' ? 'page' : 'false');
    syncDirections();
    updateMap();
    if (focus) {
      const heading = id === 'archive' ? byId('collection-title') : id === 'compare' ? byId('comparison-title') : hallTitle;
      heading?.focus({preventScroll: true});
    }
  }

  const camera = {
    left: {x: 34, yaw: -31, roll: -4, scale: 1.08},
    right: {x: -34, yaw: 31, roll: 4, scale: 1.08},
    forward: {x: 0, yaw: 0, roll: 0, scale: 1.39},
    back: {x: 0, yaw: 0, roll: 0, scale: .76}
  };
  const view = () => current === 'archive' ? archive : current === 'compare' ? compare : hallScene;
  const directionBetween = (from, to) => {
    const [x, y] = rooms[from].point;
    const [targetX, targetY] = rooms[to].point;
    return Math.abs(targetX - x) > 18 ? (targetX < x ? 'left' : 'right') : (targetY < y ? 'forward' : 'back');
  };

  async function animateTravel(out, direction) {
    const move = camera[direction];
    const neutral = 'perspective(960px) translateX(0%) rotateY(0deg) rotateZ(0deg) scale(1)';
    const portal = 'perspective(960px) translateX(' + (out ? move.x : -move.x * .62) + '%) rotateY(' +
      (out ? move.yaw : -move.yaw * .56) + 'deg) rotateZ(' + (out ? move.roll : -move.roll) + 'deg) scale(' +
      (out ? move.scale : 2 - move.scale) + ')';
    const visible = {transform: neutral, opacity: 1, filter: 'blur(0px)'};
    const crossed = {transform: portal, opacity: .28, filter: 'blur(3px)'};
    const cover = {opacity: 1};
    const clear = {opacity: 0};
    const timing = {duration: out ? 330 : 520, easing: out ? 'cubic-bezier(.54,.03,.84,.46)' : 'cubic-bezier(.18,.72,.24,1)', fill: 'both'};
    animated = [view().animate(out ? [visible, crossed] : [crossed, visible], timing),
      veil.animate(out ? [clear, cover] : [cover, clear], timing)];
    await Promise.allSettled(animated.map(animation => animation.finished));
  }

  async function navigate(id, direction, {instant = false, record = true, focus = true} = {}) {
    if (transitioning || !Object.hasOwn(rooms, id) || id === current) return;
    const animate = !instant && document.documentElement.dataset.reduceMotion !== 'true' && typeof veil.animate === 'function';
    transitioning = true;
    syncDirections();
    try {
      direction ||= directionBetween(current, id);
      if (animate) {
        stage.dataset.traverse = direction;
        await animateTravel(true, direction);
        animated.forEach(animation => animation.cancel());
      }
      paint(id, focus);
      if (record) {
        try { history.pushState(null, '', id === 'atrium' ? location.pathname + location.search : '#' + id); } catch {}
      }
      if (animate && document.documentElement.dataset.reduceMotion !== 'true') await animateTravel(false, direction);
    } finally {
      animated.forEach(animation => animation.cancel());
      animated = [];
      transitioning = false;
      delete stage.dataset.traverse;
      syncDirections();
      if (pendingAddress) {
        pendingAddress = false;
        restoreAddress();
      }
    }
  }

  function move(direction) {
    const destination = rooms[current].exits[direction];
    if (!destination || transitioning) return false;
    void navigate(destination, direction);
    return true;
  }
  function restoreAddress() {
    if (transitioning) pendingAddress = true;
    else void navigate(readRoom(), undefined, {instant: true, record: false, focus: false});
  }

  byId('show-entry').addEventListener('click', () => void navigate('atrium'));
  byId('show-collection').addEventListener('click', () => void navigate('archive'));
  movement.forEach(button => button.addEventListener('click', () => move(button.dataset.direction)));
  window.addEventListener('popstate', restoreAddress);
  window.addEventListener('hashchange', restoreAddress);
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (document.querySelector('dialog[open]') || event.target.closest?.('input, select, textarea, [contenteditable]')) return;
    if (current === 'archive' && event.target.closest?.('#collection')) return;
    if (Object.hasOwn(keys, event.key) && move(keys[event.key])) event.preventDefault();
  });

  hall.addEventListener('pointerdown', event => {
    if (event.target.closest('button') || event.button !== 0 || !event.isPrimary) return;
    gesture = {id: event.pointerId, x: event.clientX, y: event.clientY};
    hall.setPointerCapture(event.pointerId);
  });
  hall.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.max(Math.abs(x), Math.abs(y)) < 46) return;
    move(Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y < 0 ? 'forward' : 'back'));
  });
  hall.addEventListener('lostpointercapture', () => { gesture = undefined; });
  paint(readRoom(), false);
  if (typeof ResizeObserver === 'function') new ResizeObserver(updateMap).observe(miniMap);
}

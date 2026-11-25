'use strict';
{
  const byId = id => document.getElementById(id);
  const dialog = byId('depth-viewer');
  const close = byId('art-close');
  const prev = byId('art-prev');
  const next = byId('art-next');
  const frame = byId('art-frame');
  const image = byId('art-image');
  const overlay = byId('viewer-slices');
  const toggle = byId('slice-toggle');
  const sliceBack = byId('slice-back');
  const sliceNext = byId('slice-next');
  const status = byId('art-image-state');
  const works = new Map(window.PORTFOLIO_WORKS.map(work => [work.id, work]));
  let scope = [];
  let index = 0;
  let trigger;
  let slice = 0;
  let cuts = 1;
  let work;
  let sliced = false;
  let validImage = false;

  function resizeSlices() {
    if (!sliced || !validImage || !dialog.open || !image.naturalWidth) return;
    const width = Math.min(frame.clientWidth, image.naturalWidth);
    const viewport = frame.clientHeight;
    if (!width || !viewport) return;
    const height = width * image.naturalHeight / image.naturalWidth;
    const overflow = Math.max(0, height - viewport);
    const interval = Math.max(1, viewport - Math.min(40, viewport * .16));
    cuts = 1 + Math.ceil(overflow / interval);
    slice = Math.min(slice, cuts - 1);
    const distance = cuts <= 1 ? 0 : (slice * overflow / (cuts - 1));
    frame.style.setProperty('--art-slice-width', `${width}px`);
    frame.style.setProperty('--art-offset', `${-distance}px`);
    frame.dataset.sliced = 'true';
    overlay.hidden = cuts < 2;
    byId('slice-index').textContent = `段落 ${slice + 1} / ${cuts}`;
    sliceBack.disabled = slice <= 0;
    sliceNext.disabled = slice >= cuts - 1;
  }

  function changeSlice(direction) {
    const position = slice + direction;
    if (position < 0 || position >= cuts) return false;
    const focused = document.activeElement;
    slice = position;
    resizeSlices();
    if (document.documentElement.dataset.reduceMotion !== 'true') {
      image.getAnimations?.().forEach(animation => animation.cancel());
      image.animate?.([{opacity: .48}, {opacity: 1}], {duration: 200, easing: 'ease-out'});
    }
    if (focused === sliceBack && sliceBack.disabled) sliceNext.focus();
    if (focused === sliceNext && sliceNext.disabled) sliceBack.focus();
    return true;
  }

  function render() {
    work = works.get(scope[index]);
    byId('art-title').textContent = work.title;
    byId('art-kind').textContent = `${work.industry} / ${work.cat}`;
    byId('art-note').textContent = work.note;
    byId('art-focus').textContent = work.focus;
    byId('art-index').textContent = `${index + 1} / ${scope.length}`;
    const original = work.original || `assets/${work.id}.png`;
    byId('art-original').href = original;
    status.textContent = '正在加载原图…';
    overlay.hidden = true;
    toggle.hidden = true;
    toggle.textContent = '分段查看';
    frame.dataset.sliced = 'false';
    sliced = false;
    validImage = false;
    slice = 0;
    cuts = 1;
    image.alt = work.title;
    image.src = original;
    prev.disabled = index === 0;
    next.disabled = index >= scope.length - 1;
    if (image.complete && image.naturalWidth) imageReady();
  }

  function imageReady() {
    if (!work || validImage) return;
    validImage = true;
    status.textContent = '';
    toggle.hidden = work.ratio !== '详情长图';
    if (work.ratio === '详情长图') {
      sliced = true;
      toggle.textContent = '查看全图';
      resizeSlices();
    }
  }

  function moveWork(direction) {
    const position = index + direction;
    if (position < 0 || position >= scope.length) return;
    const focused = document.activeElement;
    index = position;
    render();
    if ((focused === prev && prev.disabled) || (focused === next && next.disabled)) close.focus();
  }

  document.addEventListener('portfolio:open', event => {
    const {id, scope: requested} = event.detail || {};
    if (dialog.open || !works.has(id) || byId('route-dialog').open) return;
    scope = Array.isArray(requested) ? [...new Set(requested.filter(value => works.has(value)))] : [...works.keys()];
    if (!scope.includes(id)) scope.unshift(id);
    index = scope.indexOf(id);
    trigger = document.activeElement;
    render();
    dialog.showModal();
    if (validImage) resizeSlices();
    close.focus({preventScroll: true});
  });

  image.addEventListener('load', imageReady);
  image.addEventListener('error', () => { if (work) status.textContent = '原图暂时无法加载，可以通过链接重新打开。'; });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    work = undefined;
    validImage = false;
    image.removeAttribute('src');
    trigger?.focus({preventScroll: true});
  });
  prev.addEventListener('click', () => moveWork(-1));
  next.addEventListener('click', () => moveWork(1));
  sliceBack.addEventListener('click', () => changeSlice(-1));
  sliceNext.addEventListener('click', () => changeSlice(1));
  toggle.addEventListener('click', () => {
    sliced = !sliced;
    toggle.textContent = sliced ? '查看全图' : '分段查看';
    frame.dataset.sliced = String(sliced);
    if (sliced) resizeSlices();
    else overlay.hidden = true;
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    if (!sliced || !changeSlice(direction)) moveWork(direction);
  });
  if (typeof ResizeObserver === 'function') new ResizeObserver(resizeSlices).observe(frame);
  else window.addEventListener('resize', resizeSlices);
}

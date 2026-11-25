(() => {
  'use strict';

  const mount = document.getElementById('collection-content');
  const works = window.PORTFOLIO_WORKS;
  if (!mount || !Array.isArray(works) || !works.length) return;

  mount.innerHTML = `
    <div class="collection-header">
      <h2 id="collection-title" tabindex="-1">全部作品<span>.</span></h2>
      <div class="collection-filters" role="group" aria-label="筛选作品">
        <select data-collection-industry aria-label="按品类筛选"></select>
        <select data-collection-type aria-label="按类型筛选"></select>
      </div>
    </div>
    <div class="collection-display">
      <button type="button" class="collection-view" data-collection-view>
        <img alt="" decoding="async" data-collection-image>
      </button>
      <div class="collection-copy">
        <p class="collection-meta" data-collection-meta></p>
        <h3 data-collection-name aria-live="polite"></h3>
        <p class="collection-summary" data-collection-summary></p>
        <button type="button" class="collection-open" data-collection-open>查看作品 <span aria-hidden="true">↗</span></button>
      </div>
    </div>
    <div class="collection-empty" data-collection-empty hidden>
      <p>这个组合没有作品。</p>
      <button type="button" data-collection-reset>查看全部作品</button>
    </div>
    <div class="collection-bottom">
      <div class="collection-rail" role="group" aria-label="切换作品">
        <button type="button" data-collection-prev aria-label="上一件作品">←</button>
        <div class="collection-thumbs" data-collection-thumbs></div>
        <button type="button" data-collection-next aria-label="下一件作品">→</button>
      </div>
      <div class="collection-status">
        <output data-collection-count aria-live="polite"></output>
        <a href="https://github.com/zengxianghai911-gif/zengxianghai-portfolio/releases/download/v2.0.0/portfolio-24.zip" download>下载作品原图 <span aria-hidden="true">↘</span></a>
      </div>
    </div>`;

  const get = selector => mount.querySelector(selector);
  const industry = get('[data-collection-industry]');
  const type = get('[data-collection-type]');
  const display = get('.collection-display');
  const imageButton = get('[data-collection-view]');
  const image = get('[data-collection-image]');
  const title = get('[data-collection-name]');
  const meta = get('[data-collection-meta]');
  const summary = get('[data-collection-summary]');
  const openButton = get('[data-collection-open]');
  const empty = get('[data-collection-empty]');
  const reset = get('[data-collection-reset]');
  const rail = get('.collection-rail');
  const thumbs = get('[data-collection-thumbs]');
  const previous = get('[data-collection-prev]');
  const next = get('[data-collection-next]');
  const count = get('[data-collection-count]');

  const amountPerPage = 5;
  const thumbPath = work => work.thumb || `assets/${work.id}-thumb.jpg`;
  let visibleWorks = works;
  let activeIndex = 0;
  let renderedPage = -1;

  function fillSelect(select, field, allLabel) {
    const values = [...new Set(works.map(work => work[field]).filter(Boolean))];
    select.append(new Option(allLabel, ''), ...values.map(value => new Option(value, value)));
    select.addEventListener('change', filter);
  }

  function filter() {
    visibleWorks = works.filter(work =>
      (!industry.value || work.industry === industry.value) && (!type.value || work.cat === type.value));
    activeIndex = 0;
    renderedPage = -1;
    render();
  }

  function renderRail() {
    const page = Math.floor(activeIndex / amountPerPage);
    if (page !== renderedPage) {
      const start = page * amountPerPage;
      const buttons = visibleWorks.slice(start, start + amountPerPage).map((work, offset) => {
        const button = document.createElement('button');
        const poster = document.createElement('img');
        const index = start + offset;
        button.type = 'button';
        button.dataset.collectionIndex = String(index);
        button.setAttribute('aria-label', `预览 ${work.title}`);
        poster.src = thumbPath(work);
        poster.alt = '';
        poster.decoding = 'async';
        button.append(poster);
        button.addEventListener('click', () => select(index));
        return button;
      });
      thumbs.replaceChildren(...buttons);
      renderedPage = page;
    }

    for (const button of thumbs.children) {
      if (Number(button.dataset.collectionIndex) === activeIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
  }

  function render() {
    const work = visibleWorks[activeIndex];
    const hasResults = Boolean(work);
    empty.hidden = hasResults;
    display.hidden = !hasResults;
    rail.hidden = !hasResults;
    count.value = hasResults ? `${activeIndex + 1} / ${visibleWorks.length} 件` : '0 件';
    if (!work) return;

    const src = thumbPath(work);
    if (src !== image.getAttribute('src')) image.src = src;
    imageButton.dataset.detail = String(work.ratio === '详情长图' || work.cat === '电商详情页');
    imageButton.setAttribute('aria-label', `查看《${work.title}》完整作品`);
    openButton.setAttribute('aria-label', `查看《${work.title}》完整作品与说明`);
    title.textContent = work.title;
    meta.textContent = [work.industry, work.cat].filter(Boolean).join(' / ');
    summary.textContent = work.desc || '';
    summary.hidden = !work.desc;
    previous.setAttribute('aria-disabled', String(activeIndex === 0));
    next.setAttribute('aria-disabled', String(activeIndex === visibleWorks.length - 1));
    renderRail();
  }

  function select(index, keepThumbnailFocus = false) {
    if (index < 0 || index >= visibleWorks.length || index === activeIndex) return;
    activeIndex = index;
    render();
    if (keepThumbnailFocus) thumbs.querySelector('[aria-current="true"]')?.focus({ preventScroll: true });
  }

  function open() {
    const work = visibleWorks[activeIndex];
    if (work) document.dispatchEvent(new CustomEvent('portfolio:open', {
      detail: { id: work.id, scope: visibleWorks.map(item => item.id) },
    }));
  }

  fillSelect(industry, 'industry', '全部品类');
  fillSelect(type, 'cat', '全部类型');
  imageButton.addEventListener('click', open);
  openButton.addEventListener('click', open);
  previous.addEventListener('click', () => select(activeIndex - 1));
  next.addEventListener('click', () => select(activeIndex + 1));
  reset.addEventListener('click', () => {
    industry.value = '';
    type.value = '';
    filter();
    industry.focus({ preventScroll: true });
  });

  mount.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('select')) return;
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    select(activeIndex + direction, thumbs.contains(event.target));
  });

  render();
})();

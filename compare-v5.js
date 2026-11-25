'use strict';
{
  const cases = [
    {id: 'fragrance', name: '香水', title: '玻璃香水瓶',
      problem: '背景偏杂，瓶身和台面亮度接近，透明轮廓不够清晰。',
      fix: '用低饱和紫色收束背景，提亮玻璃边缘，压住干扰主体的反射。'},
    {id: 'camera', name: '相机', title: '黑色数码相机',
      problem: '机身和深色布面挤在一起，握柄纹理、镜筒边缘看不清。',
      fix: '拉开暗部层次，给机身加一圈冷色轮廓光，再控制镜片上的高光。'},
    {id: 'shoe', name: '跑鞋', title: '米白拼色跑鞋',
      problem: '灰台面和零散投影抢眼，鞋面网布的结构被平光压住。',
      fix: '把画面收进暖橄榄色布景，用侧光显出网眼与鞋底轮廓。'}
  ];
  const byId = id => document.getElementById(id);
  const frame = byId('compare-square');
  const before = byId('compare-before');
  const after = byId('compare-after');
  const range = byId('compare-range');
  const group = byId('comparison-cases');
  const buttons = cases.map((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.name;
    button.addEventListener('click', () => select(index));
    group.append(button);
    return button;
  });
  let pointer = null;

  function showSplit() {
    const value = Number(range.value);
    frame.style.setProperty('--split', value + '%');
    frame.dataset.edge = value === 100 ? 'before' : value === 0 ? 'after' : 'split';
    range.setAttribute('aria-valuetext', value === 100 ? '全部模拟原片' : value === 0 ? '全部处理效果' : '模拟原片占 ' + value + '%');
  }

  function select(index) {
    const item = cases[index];
    before.src = 'assets/compare-' + item.id + '-before.jpg';
    before.alt = item.title + '的模拟原片';
    after.src = 'assets/compare-' + item.id + '-after.jpg';
    after.alt = item.title + '的处理效果';
    byId('compare-name').textContent = item.title;
    byId('compare-problem').textContent = item.problem;
    byId('compare-fix').textContent = item.fix;
    buttons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === index)));
    range.value = 50;
    showSplit();
  }

  function placeSplit(event) {
    const bounds = frame.getBoundingClientRect();
    if (!bounds.width) return;
    range.value = Math.round(Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)) * 100);
    showSplit();
  }
  range.addEventListener('input', showSplit);
  range.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    range.focus({preventScroll: true});
    pointer = event.pointerId;
    range.setPointerCapture(pointer);
    placeSplit(event);
  });
  range.addEventListener('pointermove', event => {
    if (event.pointerId === pointer) placeSplit(event);
  });
  range.addEventListener('lostpointercapture', () => { pointer = null; });
  select(0);
}

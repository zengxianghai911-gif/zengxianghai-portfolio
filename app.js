'use strict';
const works = [
 {id:'11',industry:'运动户外',cat:'创意海报',title:'向未来，起跑。',desc:'荧光绿、金属银与超大字体，探索运动视觉的冲击力。',shape:'tall',ratio:'4:5',focus:'高对比撞色 / 金属质感 / 动态构图',note:'新增 AI 辅助概念海报。以荧光绿和银色跑鞋制造强对比，超大字体与环绕金属构成速度感，呈现不同于生活方式画面的运动视觉方向。'},
 {id:'12',industry:'美妆个护',cat:'创意海报',title:'柔软，也有锋芒。',desc:'蓝紫光影、磨砂玻璃与衬线字体，探索冷感美妆视觉。',shape:'tall',ratio:'4:5',focus:'冷感蓝紫 / 玻璃折射 / 字体反差',note:'新增 AI 辅助概念海报。蓝紫色水面、磨砂瓶身与玻璃花瓣构成超现实场景，纤细衬线字与金属高光形成精致的冷暖层次，非真实品牌委托。'},
 {id:'13',industry:'食品饮品',cat:'创意海报',title:'让灵感，冒个泡。',desc:'橙红汽水、飞溅水花与波普字体，探索高能饮品视觉。',shape:'tall',ratio:'4:5',focus:'饱和撞色 / 飞溅动态 / 波普字体',note:'新增 AI 辅助概念海报。橙红与奶油色构成热烈的主色，水果、冰块和飞溅液体围绕斜置易拉罐展开，用圆润大字强化轻快活泼的饮品氛围。'},
 {id:'14',cat:'商品主图',industry:'宠物用品',title:'宠物出行 · 一起去撒欢',desc:'薄荷绿与活力橙，呈现胸背织物与宠物出行情绪。',shape:'tall',ratio:'4:5',focus:'亲和配色 / 织物细节 / 商品与场景',note:'新增 AI 辅助概念视觉。胸背、牵引绳和零食袋以高低差组织，薄荷绿与橙色建立亲和感，宠物形象提供使用情境。非真实客户项目，也不代表已验证的产品性能。'},
 {id:'15',cat:'包装视觉',industry:'食品饮品',title:'坚果包装 · 脆一点的灵感',desc:'黄、红、绿系列包装，以字形与食材建立识别。',shape:'tall',ratio:'4:5',focus:'系列配色 / 包装字形 / 材质表现',note:'新增 AI 辅助包装概念视觉。三款站立袋以一致的字形与插画规则组织不同口味，酒红背景强化食品色彩。展示为生成的包装效果图，未提供刀模、印前文件或实际生产验证。'},
 {id:'16',cat:'商品主图',industry:'时尚配饰',title:'都市包袋 · 带上你的态度',desc:'深灰皮革、银色台面与轮廓光，呈现配饰结构。',shape:'tall',ratio:'4:5',focus:'皮革纹理 / 冷感光线 / 结构轮廓',note:'新增 AI 辅助配饰概念视觉。通过银色台面与深灰皮革的材质反差突出包袋轮廓，蓝色细线和高挑字体呼应都市风格，非真实品牌委托。'},
 {id:'01',industry:'家居生活',cat:'商品主图',title:'随行杯 · 轻装出发',desc:'奶白与草木绿，突出杯型、提手与磨砂质感。',shape:'square',ratio:'1:1',focus:'柔和光线 / 低饱和配色 / 主次关系',note:'奶白主体从绿色背景中自然浮现，布料与叶影补充生活感。标题集中在左上，与右侧杯身形成清晰分区。'},
 {id:'02',industry:'数码科技',cat:'商品主图',title:'耳机 · 日常聆听',desc:'深色画面与轮廓光，呈现数码产品的结构。',shape:'square',ratio:'1:1',focus:'轮廓光 / 深色层次 / 文字对比',note:'黑灰基调承托耳机主体，边缘光线勾勒头梁与耳罩。亮色标题与少量橙色文字帮助区分信息层级。'},
 {id:'03',industry:'美妆个护',cat:'商品主图',title:'护肤瓶 · 简单一点',desc:'琥珀玻璃、水纹与暖光，梳理材质层次。',shape:'square',ratio:'1:1',focus:'透光材质 / 暖色氛围 / 留白',note:'水纹光影与琥珀玻璃形成色彩呼应，石材和布料提供不同触感。瓶身与左侧文字各自留出空间，保持画面呼吸感。'},
 {id:'04',industry:'家居生活',cat:'电商详情页',title:'陶瓷杯 · 把日常握在手里',desc:'从生活场景到釉面、杯口与杯柄的完整长页。',shape:'tall',ratio:'详情长图',focus:'长页节奏 / 局部特写 / 色调统一',note:'由生活场景引入，再通过釉面、杯口等局部特写组织信息。暖调底色贯穿长页，序号与分区标题建立连续阅读的节奏。'},
 {id:'05',industry:'数码科技',cat:'电商详情页',title:'耳机 · 给日常一点节奏',desc:'从整体到微距，用暗色长页组织产品细节。',shape:'tall',ratio:'详情长图',focus:'深浅对比 / 模块编排 / 色彩引导',note:'整体视角与微距细节交替出现，黑灰背景统一不同模块。橙色强调区域与编号为长页提供视觉锚点。'},
 {id:'06',industry:'家居生活',cat:'活动海报',title:'春日焕新 · 家居主题',desc:'清新的色彩与生活陈列，营造季节氛围。',shape:'tall',ratio:'竖版',focus:'季节色彩 / 字体层级 / 场景陈列',note:'鲜绿标题、花枝与浅色家居用品传递春日气息。主标题、补充说明与底部引导形成从上到下的阅读顺序。'},
 {id:'07',industry:'家居生活',cat:'活动海报',title:'桌面有序 · 灵感就位',desc:'横版店铺 Banner，兼顾商品组合与文字层级。',shape:'wide',ratio:'横版',focus:'横幅构图 / 商品组合 / 信息分区',note:'左侧标题与右侧商品组合相互平衡。台灯、耳机与随行杯以高低差组织空间，暖光与统一背景连接不同品类。'},
 {id:'08',industry:'时尚配饰',cat:'商品精修',title:'银饰 · 材质与光影',desc:'背景、金属高光与珍珠质感的效果对照。',shape:'wide',ratio:'效果对照',focus:'金属高光 / 背景纯净度 / 珍珠质感',note:'对照画面用于观察背景、银色边缘与珍珠表面的视觉差异。两侧为生成素材的效果示意，不是实际手工精修的前后记录。'},
 {id:'09',industry:'人物肖像',cat:'人像精修',title:'人像 · 自然肤质',desc:'均匀肤色与克制光影，观察人物纹理。',shape:'wide',ratio:'效果对照',focus:'肤色一致性 / 面部光影 / 自然纹理',note:'画面关注肤色均匀、面部光影与纹理保留之间的平衡。两侧为生成素材的效果示意，不是实际客片的手工修图记录。'},
 {id:'10',industry:'美妆个护',cat:'场景合成',title:'香水 · 让商品融入画面',desc:'从纯净背景到场景应用，观察边缘与光影。',shape:'wide',ratio:'三联图',focus:'边缘衔接 / 光向匹配 / 场景统一',note:'三联画面展示商品从简洁背景到场景应用的视觉方向，关注透光、阴影与环境色之间的联系。本组为生成素材示意。'}
];
const $ = selector => document.querySelector(selector);
const gallery = $('#gallery'), filters = $('#filters'), viewer = $('#viewer');
$('#result-count').textContent=`显示 ${works.length} / ${works.length} 件作品`;
let activeCategory = '全部作品', activeIndustry='全部品类', activeId = null, previousFocus = null, viewerList = works;
function addText(tag,text,parent,className){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;parent.append(el);return el;}
works.forEach(w=>{
 const card=document.createElement('article');card.className=`card ${w.shape}`;card.dataset.cat=w.cat;card.dataset.industry=w.industry;
 const button=document.createElement('button');button.className='image-button';button.type='button';button.setAttribute('aria-label',`查看${w.title}完整作品`);
 const img=document.createElement('img');img.src=`assets/${w.id}-thumb.jpg`;img.alt=w.title;img.loading='lazy';img.decoding='async';img.width=640;img.height=640;button.append(img);
 addText('span','↗',button,'arrow').setAttribute('aria-hidden','true');button.addEventListener('click',()=>openWork(w.id,filteredWorks()));
 const meta=document.createElement('div');meta.className='card-meta';addText('span',w.cat,meta);addText('span',`${w.ratio} / ${w.id}`,meta);
 card.append(button,meta);addText('h3',w.title,card);addText('p',w.desc,card);gallery.append(card);
});
const industryFilters=$('#industry-filters');
function updateFilters(){
 filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===activeCategory)));
 industryFilters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===activeIndustry)));
 let count=0;gallery.querySelectorAll('article').forEach(card=>{card.hidden=(activeCategory!=='全部作品'&&card.dataset.cat!==activeCategory)||(activeIndustry!=='全部品类'&&card.dataset.industry!==activeIndustry);if(!card.hidden){count++;card.classList.remove('fade-in');requestAnimationFrame(()=>card.classList.add('fade-in'));}});
 $('#result-count').textContent=`显示 ${count} / ${works.length} 件作品`;$('#empty').hidden=count>0;
}
['全部作品',...new Set(works.map(w=>w.cat))].forEach(cat=>{const b=document.createElement('button');b.type='button';b.textContent=cat;b.setAttribute('aria-pressed',String(cat===activeCategory));b.addEventListener('click',()=>{activeCategory=cat;updateFilters();});filters.append(b);});
['全部品类','运动户外','美妆个护','食品饮品','宠物用品','时尚配饰','家居生活','数码科技','人物肖像'].forEach(industry=>{const b=document.createElement('button');b.type='button';b.textContent=industry;b.setAttribute('aria-pressed',String(industry===activeIndustry));b.addEventListener('click',()=>{activeIndustry=industry;updateFilters();});industryFilters.append(b);});
$('#reset-filters').addEventListener('click',()=>{activeCategory='全部作品';activeIndustry='全部品类';updateFilters();});
document.querySelectorAll('[data-industry]').forEach(b=>{if(b.tagName!=='BUTTON')return;b.addEventListener('click',()=>{activeCategory='全部作品';activeIndustry=b.dataset.industry;updateFilters();$('#archive').scrollIntoView({behavior:document.documentElement.classList.contains('motion-paused')||matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});});});
function filteredWorks(){return works.filter(w=>(activeCategory==='全部作品'||w.cat===activeCategory)&&(activeIndustry==='全部品类'||w.industry===activeIndustry));}
function showWork(id){
 const w=works.find(w=>w.id===id);if(!w)return;activeId=id;
 $('#viewer-title').textContent=w.title;$('#viewer-category').textContent=`${w.industry} / ${w.cat} / ${w.ratio}`;$('#viewer-description').textContent=w.note;
 const dl=$('#viewer-details');dl.replaceChildren();[['商品品类',w.industry],['观察重点',w.focus],['作品形式',w.ratio],['制作性质','AI 辅助概念视觉样例']].forEach(([label,value])=>{const row=document.createElement('div');addText('dt',label,row);addText('dd',value,row);dl.append(row);});
 const img=$('#viewer-image');$('#image-status').textContent='正在加载清晰原图…';img.alt=w.title+'完整作品';img.src=`assets/${w.id}.png`;$('#original-link').href=img.src;
 $('#viewer-scroll').scrollTop=0;const index=viewerList.findIndex(x=>x.id===id);$('#viewer-position').textContent=`${String(index+1).padStart(2,'0')} / ${String(viewerList.length).padStart(2,'0')}`;
 $('#prev-work').disabled=index<=0;$('#next-work').disabled=index>=viewerList.length-1;
}
function openWork(id,list=works){previousFocus=document.activeElement;viewerList=list;showWork(id);viewer.showModal();document.body.classList.add('modal-open');$('#close-viewer').focus({preventScroll:true});}
function changeWork(direction){const index=viewerList.findIndex(w=>w.id===activeId);if(viewerList[index+direction])showWork(viewerList[index+direction].id);}
document.querySelectorAll('[data-work]').forEach(button=>button.addEventListener('click',()=>openWork(button.dataset.work)));
$('#viewer-image').addEventListener('load',()=>{$('#image-status').textContent='';});
$('#viewer-image').addEventListener('error',()=>{$('#image-status').textContent='图片暂时无法加载，请重试或打开完整原图。';});
$('#close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('#viewer-image').removeAttribute('src');previousFocus?.focus({preventScroll:true});});
viewer.addEventListener('click',event=>{if(event.target!==viewer)return;const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();});
viewer.addEventListener('keydown',event=>{
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();changeWork(event.key==='ArrowLeft'?-1:1);}
 if(event.key==='Tab'){
  const items=[...viewer.querySelectorAll('button:not(:disabled),a[href]')].filter(el=>el.getClientRects().length);
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
});
$('#prev-work').addEventListener('click',()=>changeWork(-1));$('#next-work').addEventListener('click',()=>changeWork(1));
const profile=window.portfolioProfile||{};
if(profile.role){$('.role').replaceChildren();$('.role').append(document.createElement('i'),document.createTextNode(' '+profile.role));}
const contactLinks=$('#contact-links');
[['邮箱',profile.email,'mailto:'],['电话',profile.phone,'tel:']].forEach(([label,value,prefix])=>{if(value){const a=addText('a',`${label} ${value}`,contactLinks);a.href=prefix+value;}});
if(profile.wechat){const b=addText('button',`微信 ${profile.wechat} · 复制`,contactLinks);b.type='button';b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(profile.wechat);b.textContent='微信号已复制';setTimeout(()=>b.textContent=`微信 ${profile.wechat} · 复制`,2200);}catch{b.textContent=`微信 ${profile.wechat}（请手动复制）`;}});}
if(profile.resume&&/^assets\/[\w.\-/]+\.pdf$/i.test(profile.resume)){const a=addText('a','查看个人简历 ↗',contactLinks);a.href=profile.resume;a.target='_blank';a.rel='noopener';}
if(profile.email||profile.phone||profile.wechat)$('#contact-copy').textContent='如果这些画面符合你的团队方向，欢迎联系我聊聊岗位与设计。';
[['求职城市',profile.city],['软件与工具',profile.software],['相关经历',profile.experience],['到岗时间',profile.availability]].forEach(([label,value])=>{if(value)addText('p',`${label} / ${value}`,$('#profile-details'));});

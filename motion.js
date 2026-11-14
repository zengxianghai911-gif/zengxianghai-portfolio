'use strict';
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const stage=document.querySelector('.poster-stage');
 const posters=[...document.querySelectorAll('.stage-poster')];
 const controls=[...document.querySelectorAll('[data-scene]')];
 const captions=['酸性绿 × 金属银 / 运动视觉','电光蓝 × 柔雾紫 / 美妆视觉','汽水橙 × 奶油白 / 饮品视觉'];
 const toggle=document.querySelector('#motion-toggle');
 let scene=0,paused=reduce.matches,hovered=false,focused=false;
 function setScene(index){scene=index;posters.forEach((poster,i)=>{poster.classList.toggle('is-active',i===scene);poster.classList.toggle('is-next',i===(scene+1)%3);poster.classList.toggle('is-prev',i===(scene+2)%3);});controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===scene)));document.querySelector('#scene-caption').textContent=captions[scene];}
 controls.forEach(b=>b.addEventListener('click',()=>setScene(Number(b.dataset.scene))));
 function updateToggle(){document.documentElement.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'开启动效 ▷':'暂停动态 Ⅱ';}
 toggle.addEventListener('click',()=>{paused=!paused;updateToggle();});
 reduce.addEventListener('change',()=>{paused=reduce.matches;updateToggle();});updateToggle();
 const showcase=document.querySelector('.hero-showcase');
 showcase.addEventListener('pointerenter',()=>hovered=true);showcase.addEventListener('pointerleave',()=>{hovered=false;stage.style.removeProperty('--rx');stage.style.removeProperty('--ry');});
 showcase.addEventListener('focusin',()=>focused=true);showcase.addEventListener('focusout',event=>{if(!showcase.contains(event.relatedTarget))focused=false;});
 stage.addEventListener('pointermove',event=>{if(paused||!fine.matches)return;const r=stage.getBoundingClientRect();stage.style.setProperty('--rx',`${((event.clientX-r.left)/r.width-.5)*9}deg`);stage.style.setProperty('--ry',`${-((event.clientY-r.top)/r.height-.5)*7}deg`);});
 document.querySelectorAll('.tilt-card').forEach(card=>{card.addEventListener('pointermove',event=>{if(paused||!fine.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${((event.clientX-r.left)/r.width-.5)*10}deg`);card.style.setProperty('--tilt-y',`${-((event.clientY-r.top)/r.height-.5)*8}deg`);});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});});
 const progress=document.querySelector('.reading-progress');
 let scrollPending=false;
 function updateScroll(){const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${range>0?Math.min(1,Math.max(0,scrollY/range)):0})`;scrollPending=false;}
 addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
 const glow=document.querySelector('.cursor-glow');
 let px=0,py=0,pointerFrame=false;
 document.addEventListener('pointermove',event=>{if(paused||!fine.matches)return;px=event.clientX;py=event.clientY;if(!pointerFrame){pointerFrame=true;requestAnimationFrame(()=>{glow.style.left=`${px}px`;glow.style.top=`${py}px`;glow.style.opacity='1';pointerFrame=false;});}},{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>glow.style.opacity='0');
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.remove('is-waiting');e.target.classList.add('is-visible');observer.unobserve(e.target);}}},{threshold:.06,rootMargin:'0px 0px 25px 0px'});document.querySelectorAll('.lab-card,.industry-card,.project,.about>div,.section-heading').forEach(el=>{el.classList.add('reveal');if(el.getBoundingClientRect().top>innerHeight+30&&!reduce.matches)el.classList.add('is-waiting');observer.observe(el);});}
 let timer;
 function schedule(){clearTimeout(timer);if(document.hidden)return;timer=setTimeout(()=>{if(!paused&&!hovered&&!focused&&!document.querySelector('#viewer').open&&document.querySelector('.hero').getBoundingClientRect().bottom>80)setScene((scene+1)%3);schedule();},5200);}
 document.addEventListener('visibilitychange',schedule);schedule();
 window.addEventListener('pagehide',()=>clearTimeout(timer));
})();

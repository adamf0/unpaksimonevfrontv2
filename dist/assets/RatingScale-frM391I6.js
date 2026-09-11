import{j as t,r as v}from"./vendor-react-1Lu0_Y_q.js";function y({activeStep:s,onNextStep:c,children:m}){return t.jsxs("div",{className:"flex-1 w-full flex flex-col md:flex-row",children:[t.jsx("section",{className:"w-full md:w-[40%] bg-surface",children:t.jsx("div",{className:"sticky top-20 h-fit lg:h-[calc(100vh-5rem)] flex flex-col p-12 md:p-20",children:t.jsxs("div",{className:"max-w-md flex flex-col h-full",children:[t.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 bg-primary-container/30 text-primary rounded-full mb-8 w-fit",children:t.jsx("span",{className:"text-xs font-bold tracking-widest uppercase cursor-pointer",onClick:c,children:s==="admin"?"Student Insights (LPM)":s==="fakultas"?"Student Insights (Fakultas)":s==="prodi"?"Student Insights (Prodi)":"Student Insights (Unit)"})}),t.jsx("h1",{className:"text-[clamp(1rem,1rem+5vw,3.75rem)] font-headline font-extrabold text-on-surface leading-[1.1] mb-6 tracking-tight",children:"Unpak Simonev"}),t.jsx("p",{className:"!text-[clamp(0.7rem,0.7rem+5vw,1.3rem)] text-on-surface-variant leading-relaxed mb-12 font-body font-medium",children:"Your feedback shapes the future of our campus."}),t.jsx("div",{className:"relative mt-auto",children:t.jsx("div",{className:"aspect-[4/3] rounded-xl overflow-hidden shadow-2xl z-10 relative bento-card",children:t.jsx("img",{className:"w-full h-full object-cover",src:"https://lh3.googleusercontent.com/aida-public/AB6AXuDy1duaPAB1nj9_p4kNbdKyG6FmnId6sfU1KcDaedVCQqTgV5U4O27uFmPhmq7W1r7GFSj815EPAtJV3PgMDUqc-qs_7sMoZRbz993cdoDpmo-urZLzzP47YIhDxuiFXcPKKRPe0TnteUmp5HQ6v9Vjzm4i2RxpiYyDWAQ9lTc-baF-mWAcCKpMEh6t7U-3yn8yzF0009789r2OvE1JQv83HJjPibY1M8kTMBdQofU4P3HJsJm5G5Ly3OBP0-yQX8k2LSSsEoVMlq4",alt:"Questionnaire"})})})]})})}),t.jsx("section",{className:"w-full md:w-[60%] bg-surface-container-low p-8 md:p-20",children:m})]})}function w({minLabel:s="Sangat Buruk",maxLabel:c="Sangat Baik",max:m=5,value:d,options:l,onChange:o,disabled:i=!1,readOnly:u=!1}){const[g,b]=v.useState(d??null),n=d!==void 0?d:g,f=l&&l.length>0?l.length:m,h=(r,e)=>{if(i||u)return;const a=(e==null?void 0:e.nilai)??r+1;o?e!==void 0?o(a,e):o(a):b((e==null?void 0:e.value)??a)},p=(r,e)=>{if(n==null)return!1;const a=r+1;return e?String(n)===String(e.value)||String(n)===String(e.label)||e.nilai!==void 0&&Number(n)===e.nilai:Number(n)===a};return t.jsxs("div",{className:`
        grid 
        gap-2 md:gap-4 
        px-1 md:px-2
        grid-cols-1
        min-[360px]:grid-cols-[auto_1fr_auto]
        items-center
      `,children:[t.jsx("span",{className:"text-[10px] md:text-xs font-bold text-error uppercase text-center min-[360px]:text-left",children:s}),t.jsx("div",{className:"grid justify-items-center gap-2",style:{gridTemplateColumns:`repeat(${f}, minmax(0, 1fr))`},children:l&&l.length>0?l.map((r,e)=>{const a=p(e,r),x=r.nilai??r.label??e+1;return t.jsx("button",{type:"button",title:r.label,disabled:i,onClick:()=>h(e,r),className:`
                    aspect-square w-full max-w-[48px]
                    rounded-full border-2 
                    font-bold grid place-items-center
                    text-sm md:text-base transition-all
                    ${a?"border-primary bg-primary text-white shadow-md scale-105":"border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary"}
                    ${i||u?"cursor-default":"cursor-pointer"}
                  `,children:x},r.value||e)}):Array.from({length:f},(r,e)=>{const a=e+1,x=p(e);return t.jsx("button",{type:"button",disabled:i,onClick:()=>h(e),className:`
                    aspect-square w-full max-w-[48px]
                    rounded-full border-2 
                    font-bold grid place-items-center
                    text-sm md:text-base transition-all
                    ${x?"border-primary bg-primary text-white shadow-md scale-105":"border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary"}
                    ${i||u?"cursor-default":"cursor-pointer"}
                  `,children:a},a)})}),t.jsx("span",{className:"text-[10px] md:text-xs font-bold text-primary uppercase text-center min-[360px]:text-right",children:c})]})}export{y as Q,w as R};

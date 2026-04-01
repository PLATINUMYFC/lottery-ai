// ===== 運勢（1日固定＋表示用ラベル） =====
function getDailyFortune(){
  const types=[
    {name:"激熱🔥",boost:1.5,color:"#22c55e",reason:"周期一致・流れ最良"},
    {name:"好調✨",boost:1.2,color:"#60a5fa",reason:"安定＋上昇トレンド"},
    {name:"通常",boost:1.0,color:"#a3a3a3",reason:"平均レンジ"},
    {name:"慎重",boost:0.85,color:"#f59e0b",reason:"ブレ注意"}
  ];
  const key = new Date().toDateString();
  let h=0; for(let i=0;i<key.length;i++) h+=key.charCodeAt(i);
  return types[h % types.length];
}
const fortune = getDailyFortune();

window.onload = () => {
  const el = document.getElementById("fortune");
  el.innerHTML = `今日の運勢：<b style="color:${fortune.color}">${fortune.name}</b>
  <span class="f-badge">${fortune.reason}</span>`;
};

// ===== データ読み込み =====
async function load(type){
  if(type==="num4") return [];
  const res = await fetch(type + ".json");
  return await res.json();
}

// ===== 分析 =====
function analyzeFull(data,max){
  let freq=Array(max+1).fill(0);
  let last=Array(max+1).fill(0);

  data.forEach((draw,i)=>{
    draw.forEach(n=>{
      freq[n]++;
      last[n]=i;
    });
  });

  return {freq,last};
}

function scoreFull(data,max){
  let {freq,last}=analyzeFull(data,max);
  let now=data.length;

  let scores=[];
  for(let i=1;i<=max;i++){
    let cold=now-last[i];                  // 未出現期間
    let center=(i>=20&&i<=23)?4:0;         // 中央ゾーン
    let parity=(i%2===0)?1:1;              // 奇偶バランス
    let luck=Math.random()*2;              // 微ランダム

    let score =
      freq[i]*1.7 +
      cold*1.3 +
      center +
      parity +
      luck * fortune.boost;               // 運勢ブースト

    scores.push({num:i,score,freq:freq[i],cold,center});
  }
  return scores.sort((a,b)=>b.score-a.score);
}

// ===== 生成 =====
function generateBalanced(scores,count){
  let res=[];
  let top=scores.slice(0,25);

  while(res.length<count){
    let n=top[Math.floor(Math.random()*top.length)].num;
    if(!res.includes(n)) res.push(n);
  }
  return res.sort((a,b)=>a-b);
}

// ===== 見た目ユーティリティ =====
function zoneClass(n){
  if(n<=12) return "low";
  if(n<=25) return "mid";
  return "high";
}
function delayClass(i){ return `delay-${Math.min(i,10)}`; }

// 理由チップ（見やすく）
function reasonChips(s){
  let chips=[];
  if(s.center) chips.push("中心域");
  if(s.freq>=3) chips.push("頻出(ホット)");
  if(s.cold>=5) chips.push("コールド復帰期待");
  chips.push((s.num%2===0)?"偶数":"奇数");
  if(s.num<=12) chips.push("低域");
  else if(s.num>=26) chips.push("高域");
  else chips.push("中域");
  return chips;
}

// ===== ナンバーズ4 =====
function num4(){
  let arr=[];
  for(let i=0;i<10;i++){
    let n="";
    for(let j=0;j<4;j++) n+=Math.floor(Math.random()*10);
    arr.push(n);
  }
  return arr;
}

// ===== 実行 =====
async function run(type){
  if(type==="num4"){
    let html=`<div class="card"><div class="card-title">ナンバーズ4</div>`;
    num4().forEach((n,i)=>{
      html+=`<div class="row">
        ${n.split("").map((d,idx)=>`<span class="ball mid ${delayClass(idx)}">${d}</span>`).join("")}
      </div>`;
    });
    html+=`</div>`;
    document.getElementById("out").innerHTML=html;
    return;
  }

  let data=await load(type);
  let max = type==="loto7"?37:43;
  let count = type==="loto6"?6:7;

  let scores=scoreFull(data,max);

  // ---- 激アツTOP10（理由付き） ----
  let html=`<div class="card">
    <div class="card-title">激アツTOP10（理由）</div>
    <div class="row">`;

  scores.slice(0,10).forEach((s,i)=>{
    html+=`<span class="ball ${zoneClass(s.num)} ${delayClass(i)}">${s.num}</span>`;
  });

  html+=`</div><div class="chips">`;
  scores.slice(0,10).forEach((s)=>{
    reasonChips(s).forEach(c=>{
      html+=`<span class="chip">${s.num}:${c}</span>`;
    });
  });
  html+=`</div></div>`;

  // ---- 予想セット（見やすく） ----
  html+=`<div class="card"><div class="card-title">予想セット</div>`;
  for(let i=0;i<8;i++){
    let set=generateBalanced(scores,count);
    html+=`<div class="row">`;
    set.forEach((n,idx)=>{
      html+=`<span class="ball ${zoneClass(n)} ${delayClass(idx)}">${n}</span>`;
    });
    html+=`</div>`;
  }
  html+=`</div>`;

  document.getElementById("out").innerHTML=html;
}

window.run = run;

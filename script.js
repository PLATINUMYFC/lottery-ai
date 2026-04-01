function getFortune(){
  const types=[
    {name:"激熱🔥",boost:1.5},
    {name:"好調✨",boost:1.2},
    {name:"通常",boost:1.0},
    {name:"慎重",boost:0.8}
  ];

  const today = new Date().toDateString();
  let hash = 0;

  for(let i=0;i<today.length;i++){
    hash += today.charCodeAt(i);
  }

  return types[hash % types.length];
}

const fortune = getFortune();

window.onload = () => {
  document.getElementById("fortune").innerHTML =
  "今日の運勢：" + fortune.name;
};

async function load(type){
  if(type==="num4") return [];
  const res = await fetch(type + ".json");
  return await res.json();
}

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
    let cold=now-last[i];
    let center=(i>=20&&i<=23)?4:0;

    let score =
      freq[i]*1.7 +
      cold*1.3 +
      center +
      Math.random()*2;

    scores.push({num:i,score});
  }

  return scores.sort((a,b)=>b.score-a.score);
}

function generateBalanced(scores,count){
  let res=[];
  let top=scores.slice(0,25);

  while(res.length<count){
    let n=top[Math.floor(Math.random()*top.length)].num;
    if(!res.includes(n)) res.push(n);
  }

  return res.sort((a,b)=>a-b);
}

function getReason(n){
  let r=[];
  if(n>=20 && n<=23) r.push("中心ゾーン");
  if(n%2===0) r.push("偶数");
  else r.push("奇数");
  return r.join(" / ");
}

function num4(){
  let arr=[];
  for(let i=0;i<10;i++){
    let n="";
    for(let j=0;j<4;j++){
      n+=Math.floor(Math.random()*10);
    }
    arr.push(n);
  }
  return arr;
}

async function run(type){

  if(type==="num4"){
    let html="<div class='card'>";
    num4().forEach(n=> html+=n+"<br>");
    html+="</div>";
    document.getElementById("out").innerHTML=html;
    return;
  }

  let data=await load(type);

  let max = type==="loto7"?37:43;
  let count = type==="loto6"?6:7;

  let scores=scoreFull(data,max);

  let html="<div class='card'>";

  scores.slice(0,10).forEach(s=>{
    html+=`<div class='num'>${s.num}</div>
    <div class='reason'>${getReason(s.num)}</div>`;
  });

  html+="</div><div class='card'>";

  for(let i=0;i<8;i++){
    let set=generateBalanced(scores,count);
    html+=set.map(n=>`<span class='num'>${n}</span>`).join("")+"<br>";
  }

  html+="</div>";

  document.getElementById("out").innerHTML=html;
}

window.run = run;

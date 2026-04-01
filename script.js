alert("動いてる");

function getFortune(){
  const types=[
    {name:"激熱🔥",boost:1.5},
    {name:"好調✨",boost:1.2},
    {name:"通常",boost:1.0},
    {name:"慎重",boost:0.8}
  ];
  return types[Math.floor(Math.random()*types.length)];
}

const fortune = getFortune();

window.onload = () => {
  document.getElementById("fortune").innerHTML =
  "今日の運勢：" + fortune.name;
};

async function load(type){
  try{
    if(type==="num4") return [];
    const res = await fetch(type + ".json");
    return await res.json();
  }catch{
    alert("データ読み込みエラー");
    return [];
  }
}

function analyze(data,max){
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

function score(data,max){
  let {freq,last}=analyze(data,max);
  let now=data.length;

  let scores=[];

  for(let i=1;i<=max;i++){
    let cold=now-last[i];
    let center=(i>=20&&i<=24)?5:0;

    let score =
      freq[i]1.5 +
      cold1.2 +
      center +
      Math.random()*2;

    scores.push({num:i,score});
  }

  return scores.sort((a,b)=>b.score-a.score);
}

function generate(scores,count){
  let top=scores.slice(0,25);
  let res=[];

  while(res.length<count){
    let n=top[Math.floor(Math.random()*top.length)].num;
    if(!res.includes(n)) res.push(n);
  }

  return res.sort((a,b)=>a-b);
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
    let html="<div class='box'><b>ナンバーズ4</b><br>";
    num4().forEach(n=> html+=n+"<br>");
    html+="</div>";
    document.getElementById("out").innerHTML=html;
    return;
  }

  let data=await load(type);

  let max = type==="loto7"?37:43;
  let count = type==="loto6"?6:7;

  let scores=score(data,max);

  let html="<div class='box'><b>激アツ数字</b><br>";
  scores.slice(0,10).forEach(s=> html+=s.num+" ");
  html+="</div>";

  html+="<div class='box'><b>予想</b><br>";
  for(let i=0;i<8;i++){
    html+=generate(scores,count)+"<br>";
  }
  html+="</div>";

  document.getElementById("out").innerHTML=html;
}

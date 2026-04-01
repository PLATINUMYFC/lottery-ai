async function load(type){
  const res = await fetch(type+".json");
  return await res.json();
}

function getFortune(){
  const types=[
    {name:"激熱🔥",boost:1.5},
    {name:"好調✨",boost:1.2},
    {name:"通常",boost:1.0},
    {name:"慎重",boost:0.8}
  ];
  return types[Math.floor(Math.random()types.length)];
}

let fortune=getFortune();

document.getElementById("fortune").innerHTML=
"今日の運勢："+fortune.name;

async function run(type){

  let data=await load(type);

  let max=type==="loto7"?37:43;
  let count=type==="loto6"?6:type==="loto7"?7:4;

  let scores=scoreFull(data,max);

  scores=scores.map(s=>{
    return {num:s.num,score:s.scorefortune.boost};
  });

  let html="<div class='box'><b>激アツ数字</b><br>";
  scores.slice(0,10).forEach(s=>{
    html+=s.num+" ";
  });
  html+="</div>";

  html+="<div class='box'><b>予想</b><br>";
  for(let i=0;i<8;i++){
    html+=generateFull(scores,count)+"<br>";
  }
  html+="</div>";

  document.getElementById("out").innerHTML=html;
}

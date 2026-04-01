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
    let center=(i>=20&&i<=24)?5:0;
    let luck=Math.random()*2;

    let score=
      freq[i]1.5 +
      cold1.2 +
      center +
      luck;

    scores.push({num:i,score});
  }

  return scores.sort((a,b)=>b.score-a.score);
}

function generateFull(scores,count){
  let top=scores.slice(0,25);
  let res=[];

  while(res.length<count){
    let n=top[Math.floor(Math.random()*top.length)].num;
    if(!res.includes(n)) res.push(n);
  }

  res.sort((a,b)=>a-b);
  return res;
}

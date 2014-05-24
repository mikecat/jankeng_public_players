"use strict";

/*
PlayerName="Adler32"
【感想・作戦・工夫した点など】
相手のこれまでの手をAdler32でハッシュした結果により、自分の次の手を決定します。
*/

var MOD_BY=65521;

var A,B;

function adler32init() {
  A=1;
  B=0;
}

function adler32addData(data,dataSize) {
  var i;
  for(i=0;i<dataSize;i++) {
    A+=data.charCodeAt(i);
    if(A>=MOD_BY)A-=MOD_BY;
    B+=A;
    if(B>=MOD_BY)B-=MOD_BY;
  }
}

function adler32finish(data,dataSize) {
  var adler32=new Array(4);
  adler32addData(data,dataSize);
  adler32[0]=(B>>8)&0xff;
  adler32[1]=B&0xff;
  adler32[2]=(A>>8)&0xff;
  adler32[3]=A&0xff;
  return adler32;
}

function play(h)
{
  var sum = 0;
  adler32init();
  var hash = adler32finish(h[1],h[1].length);
  for(var i=0;i<hash.length;i++)sum=(sum+hash[i])%3;
  return "GCP".charAt(sum);
}

// イベントを受け取り、グーチョキパーのどれを出すかを返信するための仕組みです。
self.addEventListener('message', function(e) {
  self.postMessage( play(e.data.split(",")) );
}, false);

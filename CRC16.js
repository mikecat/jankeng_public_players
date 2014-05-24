"use strict";

/*
PlayerName="CRC16"
【感想・作戦・工夫した点など】
相手のこれまでの手をCRC16でハッシュした結果により、自分の次の手を決定します。
*/

var CRC16table=new Array(256);
var inited=0;
var crc;

function crc16init() {
  if(!inited) {
    var n;
    for(n=0;n<256;n++) {
      var c=n;
      var k;
      for(k=0;k<8;k++) {
        if(c & 1) {
          c=0xA001 ^ (c>>>1);
        } else {
          c>>>=1;
        }
      }
      CRC16table[n]=c;
    }
    inited=1;
  }
  crc=0;
}

function crc16addData(data,dataSize) {
  var i;
  for(i=0;i<dataSize;i++) {
    crc=CRC16table[(crc ^ data.charCodeAt(i))&0xFF]^(crc>>>8);
  }
}

function crc16finish(data,dataSize) {
  var crc16=new Array(2);
  crc16addData(data,dataSize);
  crc16[0]=(crc>>>8)&0xff;
  crc16[1]=crc&0xff;
  return crc16;
}

function play(h)
{
  var sum = 0;
  crc16init();
  var hash = crc16finish(h[1],h[1].length);
  for(var i=0;i<hash.length;i++)sum=(sum+hash[i])%3;
  return "GCP".charAt(sum);
}

// イベントを受け取り、グーチョキパーのどれを出すかを返信するための仕組みです。
self.addEventListener('message', function(e) {
  self.postMessage( play(e.data.split(",")) );
}, false);

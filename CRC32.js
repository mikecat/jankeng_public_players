"use strict";

/*
PlayerName="CRC32"
【感想・作戦・工夫した点など】
相手のこれまでの手をCRC32でハッシュした結果により、自分の次の手を決定します。
*/
var CRC32table=new Array(256);
var inited=0;
var crc;

function crc32init() {
  if(!inited) {
    var n;
    for(n=0;n<256;n++) {
      var c=n;
      var k;
      for(k=0;k<8;k++) {
        if(c & 1) {
          c=0xEDB88320 ^ (c>>>1);
        } else {
          c>>>=1;
        }
      }
      CRC32table[n]=c;
    }
    inited=1;
  }
  crc=0xFFFFFFFF;
}

function crc32addData(data,dataSize) {
  var i;
  for(i=0;i<dataSize;i++) {
    crc=CRC32table[(crc ^ data.charCodeAt(i))&0xFF]^(crc>>>8);
  }
}

function crc32finish(data,dataSize) {
  var crc32=new Array(4);
  crc32addData(data,dataSize);
  crc=~crc;
  crc32[0]=(crc>>24)&0xff;
  crc32[1]=(crc>>16)&0xff;
  crc32[2]=(crc>>8)&0xff;
  crc32[3]=crc&0xff;
  return crc32;
}

function play(h)
{
  var sum = 0;
  crc32init();
  var hash = crc32finish(h[1],h[1].length);
  for(var i=0;i<hash.length;i++)sum=(sum+hash[i])%3;
  return "GCP".charAt(sum);
}

// イベントを受け取り、グーチョキパーのどれを出すかを返信するための仕組みです。
self.addEventListener('message', function(e) {
  self.postMessage( play(e.data.split(",")) );
}, false);

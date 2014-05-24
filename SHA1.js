"use strict";

/*
PlayerName="SHA1"
【感想・作戦・工夫した点など】
相手のこれまでの手をSHA1でハッシュした結果により、自分の次の手を決定します。
*/

function SHR(n,x){return x>>>n;}
function ROTR(n,x){return (x>>>n) | (x<<(32-n));}
function ROTL(n,x){return (x<<n) | (x>>>(32-n));}

var K1=0x5a827999;
var K2=0x6ed9eba1;
var K3=0x8f1bbcdc;
var K4=0xca62c1d6;

function Ch(x,y,z){return (x&y) ^ ((~x)&z);}
function Parity(x,y,z){return x^y^z;}
function Maj(x,y,z){return (x&y) ^ (x&z) ^ (y&z);}

var H=new Array(5);
var sizeh,sizel;

function sha1init() {
  H[0]=0x67452301;
  H[1]=0xefcdab89;
  H[2]=0x98badcfe;
  H[3]=0x10325476;
  H[4]=0xc3d2e1f0;
  sizeh=sizel=0;
}

function sha1addOneDataBlock(data) {
  var W=new Array(80);
  var a,b,c,d,e,T;
  var i;
  for(i=0;i<16;i++) {
    W[i]=(data[(i<<2)]<<24)|(data[(i<<2)|1]<<16)|
      (data[(i<<2)|2]<<8)|data[(i<<2)|3];
  }
  for(i=16;i<80;i++) {
    W[i]=ROTL(1,W[i-3]^W[i-8]^W[i-14]^W[i-16]);
  }
  a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];
  for(i=0;i<20;i++) {
    T=ROTL(5,a)+Ch(b,c,d)+e+K1+W[i];
    e=d;d=c;
    c=ROTL(30,b);
    b=a;a=T;
  }
  for(i=20;i<40;i++) {
    T=ROTL(5,a)+Parity(b,c,d)+e+K2+W[i];
    e=d;d=c;
    c=ROTL(30,b);
    b=a;a=T;
  }
  for(i=40;i<60;i++) {
    T=ROTL(5,a)+Maj(b,c,d)+e+K3+W[i];
    e=d;d=c;
    c=ROTL(30,b);
    b=a;a=T;
  }
  for(i=60;i<80;i++) {
    T=ROTL(5,a)+Parity(b,c,d)+e+K4+W[i];
    e=d;d=c;
    c=ROTL(30,b);
    b=a;a=T;
  }
  H[0]+=a;H[1]+=b;H[2]+=c;H[3]+=d;H[4]+=e;
}

function sha1addData(data,dataSize) {
  var now=new Array(64);
  var i,j;
  for(i=0;i<dataSize;i+=64) {
    for(j=0;j<64;j++)now[j]=data.charCodeAt(i+j);
    sha1addOneDataBlock(now);
  }
  sizel+=dataSize;
  sizeh+=(sizel>>>29);
  sizel&=0x1fffffff;
}

function sha1finish(data,dataSize) {
  var sha1=new Array(20);
  var i;
  var leftLen;
  var leftPtr;
  var buffer=new Array(64);
  sha1addData(data,dataSize&(~63));
  leftLen=dataSize&63;
  leftPtr=dataSize&(~63);
  for(i=0;i<leftLen;i++) {
    buffer[i]=data.charCodeAt(leftPtr+i);
  }
  buffer[i++]=0x80;/* leftLen<=63 */
  for(;i<56;i++)buffer[i]=0;
  sizel+=leftLen;
  sizeh+=(sizel>>>29);
  sizel&=0x1fffffff;
  sizel<<=3;
  if(leftLen<56) {
    buffer[56]=(sizeh>>>24)&0xff;
    buffer[57]=(sizeh>>>16)&0xff;
    buffer[58]=(sizeh>>>8)&0xff;
    buffer[59]=sizeh&0xff;
    buffer[60]=(sizel>>>24)&0xff;
    buffer[61]=(sizel>>>16)&0xff;
    buffer[62]=(sizel>>>8)&0xff;
    buffer[63]=sizel&0xff;
    sha1addOneDataBlock(buffer);
  } else {
    sha1addOneDataBlock(buffer);
    for(i=0;i<56;i++)buffer[i]=0;
    buffer[56]=(sizeh>>>24)&0xff;
    buffer[57]=(sizeh>>>16)&0xff;
    buffer[58]=(sizeh>>>8)&0xff;
    buffer[59]=sizeh&0xff;
    buffer[60]=(sizel>>>24)&0xff;
    buffer[61]=(sizel>>>16)&0xff;
    buffer[62]=(sizel>>>8)&0xff;
    buffer[63]=sizel&0xff;
    sha1addOneDataBlock(buffer);
  }
  for(i=0;i<20;i++) {
    sha1[i]=(H[i>>2]>>>(8*(3-(i&3))))&0xff;
  }
  return sha1;
}

function play(h)
{
  var sum = 0;
  sha1init();
  var hash = sha1finish(h[1],h[1].length);
  for(var i=0;i<hash.length;i++)sum=(sum+hash[i])%3;
  return "GCP".charAt(sum);
}

// イベントを受け取り、グーチョキパーのどれを出すかを返信するための仕組みです。
self.addEventListener('message', function(e) {
  self.postMessage( play(e.data.split(",")) );
}, false);

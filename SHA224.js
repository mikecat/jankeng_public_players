"use strict";

/*
PlayerName="SHA224"
【感想・作戦・工夫した点など】
相手のこれまでの手をSHA224でハッシュした結果により、自分の次の手を決定します。
*/

function SHR(n,x){return x>>>n;}
function ROTR(n,x){return (x>>>n) | (x<<(32-n));}

function Ch(x,y,z){return (x&y) ^ ((~x)&z);}
function Maj(x,y,z){return (x&y) ^ (x&z) ^ (y&z);}
function Sigma0(x){return ROTR(2,x) ^ ROTR(13,x) ^ ROTR(22,x);}
function Sigma1(x){return ROTR(6,x) ^ ROTR(11,x) ^ ROTR(25,x);}
function Ro0(x){return ROTR(7,x) ^ ROTR(18,x) ^ SHR(3,x);}
function Ro1(x){return ROTR(17,x) ^ ROTR(19,x) ^ SHR(10,x);}

var K=new Array(
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,
  0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
  0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,
  0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,
  0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
  0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,
  0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,
  0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
  0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
);

var H=new Array(8);
var sizeh,sizel;

function sha224init() {
  H[0]=0xc1059ed8;
  H[1]=0x367cd507;
  H[2]=0x3070dd17;
  H[3]=0xf70e5939;
  H[4]=0xffc00b31;
  H[5]=0x68581511;
  H[6]=0x64f98fa7;
  H[7]=0xbefa4fa4;
  sizeh=sizel=0;
}

function sha224addOneDataBlock(data) {
  var W=new Array(64);
  var a,b,c,d,e,f,g,h,T1,T2;
  var i;
  for(i=0;i<16;i++) {
    W[i]=(data[(i<<2)]<<24)|(data[(i<<2)|1]<<16)|
      (data[(i<<2)|2]<<8)|data[(i<<2)|3];
  }
  for(i=16;i<64;i++) {
    W[i]=Ro1(W[i-2])+W[i-7]+Ro0(W[i-15])+W[i-16];
  }
  a=H[0];b=H[1];c=H[2];d=H[3];
  e=H[4];f=H[5];g=H[6];h=H[7];
  for(i=0;i<64;i++) {
    T1=(h+Sigma1(e)+Ch(e,f,g)+K[i]+W[i])&0xffffffff;
    T2=(Sigma0(a)+Maj(a,b,c))&0xffffffff;
    h=g;g=f;f=e;
    e=(d+T1)&0xffffffff;
    d=c;c=b;b=a;
    a=(T1+T2)&0xffffffff;
  }
  H[0]+=a;H[1]+=b;H[2]+=c;H[3]+=d;
  H[4]+=e;H[5]+=f;H[6]+=g;H[7]+=h;
}

function sha224addData(data,dataSize) {
  var now=new Array(64);
  var i,j;
  for(i=0;i<dataSize;i+=64) {
    for(j=0;j<64;j++)now[j]=data.charCodeAt(i+j);
    sha224addOneDataBlock(now);
  }
  sizel+=dataSize;
  sizeh+=(sizel>>>29);
  sizel&=0x1fffffff;
}

function sha224finish(data,dataSize) {
  var sha224=new Array(28);
  var i;
  var leftLen;
  var leftPtr;
  var buffer=new Array(64);
  sha224addData(data,dataSize&(~63));
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
    sha224addOneDataBlock(buffer);
  } else {
    sha224addOneDataBlock(buffer);
    for(i=0;i<56;i++)buffer[i]=0;
    buffer[56]=(sizeh>>>24)&0xff;
    buffer[57]=(sizeh>>>16)&0xff;
    buffer[58]=(sizeh>>>8)&0xff;
    buffer[59]=sizeh&0xff;
    buffer[60]=(sizel>>>24)&0xff;
    buffer[61]=(sizel>>>16)&0xff;
    buffer[62]=(sizel>>>8)&0xff;
    buffer[63]=sizel&0xff;
    sha224addOneDataBlock(buffer);
  }
  for(i=0;i<28;i++) {
    sha224[i]=(H[i>>2]>>>(8*(3-(i&3))))&0xff;
  }
  return sha224;
}

function play(h)
{
  var sum = 0;
  sha224init();
  var hash = sha224finish(h[1],h[1].length);
  for(var i=0;i<hash.length;i++)sum=(sum+hash[i])%3;
  return "GCP".charAt(sum);
}

// イベントを受け取り、グーチョキパーのどれを出すかを返信するための仕組みです。
self.addEventListener('message', function(e) {
  self.postMessage( play(e.data.split(",")) );
}, false);

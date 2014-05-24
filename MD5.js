"use strict";

/*
PlayerName="MD5"
【感想・作戦・工夫した点など】
相手のこれまでの手をMD5でハッシュした結果により、自分の次の手を決定します。
*/

function ROTL(x,n){return (x<<n) | (x>>>(32-n));}

function f(x,y,z){return (x&y) | ((~x)&z);}
function g(x,y,z){return (x&z) | (y&(~z));}
function h(x,y,z){return x^y^z;}
function i(x,y,z){return y ^ (x|(~z));}

function ff(a,b,c,d,w,t,s){return (b+ROTL((a+f(b,c,d)+w+t)&0xffffffff,s))&0xffffffff;}
function gg(a,b,c,d,w,t,s){return (b+ROTL((a+g(b,c,d)+w+t)&0xffffffff,s))&0xffffffff;}
function hh(a,b,c,d,w,t,s){return (b+ROTL((a+h(b,c,d)+w+t)&0xffffffff,s))&0xffffffff;}
function ii(a,b,c,d,w,t,s){return (b+ROTL((a+i(b,c,d)+w+t)&0xffffffff,s))&0xffffffff;}

var S11=7;
var S12=12;
var S13=17;
var S14=22;
var S21=5;
var S22=9;
var S23=14;
var S24=20;
var S31=4;
var S32=11;
var S33=16;
var S34=23;
var S41=6;
var S42=10;
var S43=15;
var S44=21;

var A,B,C,D;
var sizeh,sizel;

function md5init() {
  A=0x67452301;
  B=0xefcdab89;
  C=0x98badcfe;
  D=0x10325476;
  sizeh=sizel=0;
}

function md5addOneDataBlock(data) {
  var a,b,c,d;
  var W=new Array(16);
  var i;
  for(i=0;i<16;i++) {
    W[i]=data[(i<<2)]|(data[(i<<2)|1]<<8)|
      (data[(i<<2)|2]<<16)|(data[(i<<2)|3]<<24);
  }

  a=A;b=B;c=C;d=D;

  a=ff(a,b,c,d,W[ 0],0xd76aa478,S11);
  d=ff(d,a,b,c,W[ 1],0xe8c7b756,S12);
  c=ff(c,d,a,b,W[ 2],0x242070db,S13);
  b=ff(b,c,d,a,W[ 3],0xc1bdceee,S14);
  a=ff(a,b,c,d,W[ 4],0xf57c0faf,S11);
  d=ff(d,a,b,c,W[ 5],0x4787c62a,S12);
  c=ff(c,d,a,b,W[ 6],0xa8304613,S13);
  b=ff(b,c,d,a,W[ 7],0xfd469501,S14);
  a=ff(a,b,c,d,W[ 8],0x698098d8,S11);
  d=ff(d,a,b,c,W[ 9],0x8b44f7af,S12);
  c=ff(c,d,a,b,W[10],0xffff5bb1,S13);
  b=ff(b,c,d,a,W[11],0x895cd7be,S14);
  a=ff(a,b,c,d,W[12],0x6b901122,S11);
  d=ff(d,a,b,c,W[13],0xfd987193,S12);
  c=ff(c,d,a,b,W[14],0xa679438e,S13);
  b=ff(b,c,d,a,W[15],0x49b40821,S14);

  a=gg(a,b,c,d,W[ 1],0xf61e2562,S21);
  d=gg(d,a,b,c,W[ 6],0xc040b340,S22);
  c=gg(c,d,a,b,W[11],0x265e5a51,S23);
  b=gg(b,c,d,a,W[ 0],0xe9b6c7aa,S24);
  a=gg(a,b,c,d,W[ 5],0xd62f105d,S21);
  d=gg(d,a,b,c,W[10], 0x2441453,S22);
  c=gg(c,d,a,b,W[15],0xd8a1e681,S23);
  b=gg(b,c,d,a,W[ 4],0xe7d3fbc8,S24);
  a=gg(a,b,c,d,W[ 9],0x21e1cde6,S21);
  d=gg(d,a,b,c,W[14],0xc33707d6,S22);
  c=gg(c,d,a,b,W[ 3],0xf4d50d87,S23);
  b=gg(b,c,d,a,W[ 8],0x455a14ed,S24);
  a=gg(a,b,c,d,W[13],0xa9e3e905,S21);
  d=gg(d,a,b,c,W[ 2],0xfcefa3f8,S22);
  c=gg(c,d,a,b,W[ 7],0x676f02d9,S23);
  b=gg(b,c,d,a,W[12],0x8d2a4c8a,S24);

  a=hh(a,b,c,d,W[ 5],0xfffa3942,S31);
  d=hh(d,a,b,c,W[ 8],0x8771f681,S32);
  c=hh(c,d,a,b,W[11],0x6d9d6122,S33);
  b=hh(b,c,d,a,W[14],0xfde5380c,S34);
  a=hh(a,b,c,d,W[ 1],0xa4beea44,S31);
  d=hh(d,a,b,c,W[ 4],0x4bdecfa9,S32);
  c=hh(c,d,a,b,W[ 7],0xf6bb4b60,S33);
  b=hh(b,c,d,a,W[10],0xbebfbc70,S34);
  a=hh(a,b,c,d,W[13],0x289b7ec6,S31);
  d=hh(d,a,b,c,W[ 0],0xeaa127fa,S32);
  c=hh(c,d,a,b,W[ 3],0xd4ef3085,S33);
  b=hh(b,c,d,a,W[ 6], 0x4881d05,S34);
  a=hh(a,b,c,d,W[ 9],0xd9d4d039,S31);
  d=hh(d,a,b,c,W[12],0xe6db99e5,S32);
  c=hh(c,d,a,b,W[15],0x1fa27cf8,S33);
  b=hh(b,c,d,a,W[ 2],0xc4ac5665,S34);

  a=ii(a,b,c,d,W[ 0],0xf4292244,S41);
  d=ii(d,a,b,c,W[ 7],0x432aff97,S42);
  c=ii(c,d,a,b,W[14],0xab9423a7,S43);
  b=ii(b,c,d,a,W[ 5],0xfc93a039,S44);
  a=ii(a,b,c,d,W[12],0x655b59c3,S41);
  d=ii(d,a,b,c,W[ 3],0x8f0ccc92,S42);
  c=ii(c,d,a,b,W[10],0xffeff47d,S43);
  b=ii(b,c,d,a,W[ 1],0x85845dd1,S44);
  a=ii(a,b,c,d,W[ 8],0x6fa87e4f,S41);
  d=ii(d,a,b,c,W[15],0xfe2ce6e0,S42);
  c=ii(c,d,a,b,W[ 6],0xa3014314,S43);
  b=ii(b,c,d,a,W[13],0x4e0811a1,S44);
  a=ii(a,b,c,d,W[ 4],0xf7537e82,S41);
  d=ii(d,a,b,c,W[11],0xbd3af235,S42);
  c=ii(c,d,a,b,W[ 2],0x2ad7d2bb,S43);
  b=ii(b,c,d,a,W[ 9],0xeb86d391,S44); 

  A=(A+a)&0xffffffff;B=(B+b)&0xffffffff;C=(C+c)&0xffffffff;D=(D+d)&0xffffffff;
}

function md5addData(data,dataSize) {
  var now=new Array(64);
  var i,j;
  for(i=0;i<dataSize;i+=64) {
    for(j=0;j<64;j++)now[j]=data.charCodeAt(i+j);
    md5addOneDataBlock(now);
  }
  sizel+=dataSize;
  sizeh+=(sizel>>>29);
  sizel&=0x1fffffff;
}

function md5finish(data,dataSize) {
  var md5=new Array(16);
  var i;
  var leftLen;
  var leftPtr;
  var buffer=new Array(64);
  md5addData(data,dataSize&(~63));
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
    buffer[56]=sizel&0xff;
    buffer[57]=(sizel>>>8)&0xff;
    buffer[58]=(sizel>>>16)&0xff;
    buffer[59]=(sizel>>>24)&0xff;
    buffer[60]=sizeh&0xff;
    buffer[61]=(sizeh>>>8)&0xff;
    buffer[62]=(sizeh>>>16)&0xff;
    buffer[63]=(sizeh>>>24)&0xff;
    md5addOneDataBlock(buffer);
  } else {
    md5addOneDataBlock(buffer);
    for(i=0;i<56;i++)buffer[i]=0;
    buffer[56]=sizel&0xff;
    buffer[57]=(sizel>>>8)&0xff;
    buffer[58]=(sizel>>>16)&0xff;
    buffer[59]=(sizel>>>24)&0xff;
    buffer[60]=sizeh&0xff;
    buffer[61]=(sizeh>>>8)&0xff;
    buffer[62]=(sizeh>>>16)&0xff;
    buffer[63]=(sizeh>>>24)&0xff;
    md5addOneDataBlock(buffer);
  }
  for(i=0;i<4;i++) {
    md5[i   ]=(A>>>(8*(i&3)))&0xff;
    md5[i|4 ]=(B>>>(8*(i&3)))&0xff;
    md5[i|8 ]=(C>>>(8*(i&3)))&0xff;
    md5[i|12]=(D>>>(8*(i&3)))&0xff;
  }
  return md5;
}

function play(h)
{
  var sum = 0;
  md5init();
  var hash = md5finish(h[1],h[1].length);
  for(var i=0;i<hash.length;i++)sum=(sum+hash[i])%3;
  return "GCP".charAt(sum);
}

// イベントを受け取り、グーチョキパーのどれを出すかを返信するための仕組みです。
self.addEventListener('message', function(e) {
  self.postMessage( play(e.data.split(",")) );
}, false);

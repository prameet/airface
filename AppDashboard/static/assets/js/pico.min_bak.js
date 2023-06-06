/* This library is released under the MIT license, see https://github.com/tehnokv/picojs */
pico={},pico.unpack_cascade=function(t){var r=new DataView(new ArrayBuffer(4)),n=8;r.setUint8(0,t[n+0]),r.setUint8(1,t[n+1]),r.setUint8(2,t[n+2]),r.setUint8(3,t[n+3]);var i=r.getInt32(0,!0);n+=4,r.setUint8(0,t[n+0]),r.setUint8(1,t[n+1]),r.setUint8(2,t[n+2]),r.setUint8(3,t[n+3]);var a=r.getInt32(0,!0);n+=4;for(var e=[],o=[],s=[],c=0;c<a;++c){var f;for(Array.prototype.push.apply(e,[0,0,0,0]),Array.prototype.push.apply(e,t.slice(n,n+4*Math.pow(2,i)-4)),n=n+4*Math.pow(2,i)-4,f=0;f<Math.pow(2,i);++f)r.setUint8(0,t[n+0]),r.setUint8(1,t[n+1]),r.setUint8(2,t[n+2]),r.setUint8(3,t[n+3]),o.push(r.getFloat32(0,!0)),n+=4;r.setUint8(0,t[n+0]),r.setUint8(1,t[n+1]),r.setUint8(2,t[n+2]),r.setUint8(3,t[n+3]),s.push(r.getFloat32(0,!0)),n+=4}return e=new Int8Array(e),o=new Float32Array(o),s=new Float32Array(s),function(t,r,n,c,f){t*=256,r*=256;for(var p=0,u=0,h=Math.pow(2,i)>>0,v=0;v<a;++v){idx=1;for(var d=0;d<i;++d)idx=2*idx+(c[(t+e[p+4*idx+0]*n>>8)*f+(r+e[p+4*idx+1]*n>>8)]<=c[(t+e[p+4*idx+2]*n>>8)*f+(r+e[p+4*idx+3]*n>>8)]);if((u+=o[h*v+idx-h])<=s[v])return-1;p+=4*h}return u-s[a-1]}},pico.run_cascade=function(t,r,n){for(var i=t.pixels,a=t.nrows,e=t.ncols,o=t.ldim,s=n.shiftfactor,c=n.minsize,f=n.maxsize,p=n.scalefactor,u=c,h=[];u<=f;){for(var v=Math.max(s*u,1)>>0,d=u/2+1>>0,l=d;l<=a-d;l+=v)for(var U=d;U<=e-d;U+=v){var x=r(l,U,u,i,o);x>0&&h.push([l,U,u,x])}u*=p}return h},pico.cluster_detections=function(t,r){t=t.sort(function(t,r){return r[3]-t[3]});for(var n,i,a,e,o,s,c,f,p,u,h=new Array(t.length).fill(0),v=[],d=0;d<t.length;++d)if(0==h[d]){for(var l=0,U=0,x=0,m=0,w=0,y=d;y<t.length;++y)n=t[d],i=t[y],void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,a=n[0],e=n[1],o=n[2],s=i[0],c=i[1],f=i[2],p=Math.max(0,Math.min(a+o/2,s+f/2)-Math.max(a-o/2,s-f/2)),u=Math.max(0,Math.min(e+o/2,c+f/2)-Math.max(e-o/2,c-f/2)),p*u/(o*o+f*f-p*u)>r&&(h[y]=1,l+=t[y][0],U+=t[y][1],x+=t[y][2],m+=t[y][3],w+=1);v.push([l/w,U/w,x/w,m])}return v},pico.instantiate_detection_memory=function(t){for(var r=0,n=[],i=0;i<t;++i)n.push([]);return function(t){for(n[r]=t,r=(r+1)%n.length,t=[],i=0;i<n.length;++i)t=t.concat(n[i]);return t}};
import{d as n,r as t,b as r,e as i,f as e}from"./vue-Dk88WT-Z.js";import{b as o,M as u,q as a,V as l}from"./maptalks.es-7YTiJo2Q.js";import{_ as f}from"./index-r5JEVMmp.js";import"./common-DJbht5QT.js";import"./element-CcAO_LfK.js";class c{constructor(){this._partials=new Float64Array(32),this._n=0}add(n){const t=this._partials;let r=0;for(let i=0;i<this._n&&i<32;i++){const e=t[i],o=n+e,u=Math.abs(n)<Math.abs(e)?n-(o-e):e-(o-n);u&&(t[r++]=u),n=o}return t[r]=n,this._n=r+1,this}valueOf(){const n=this._partials;let t,r,i,e=this._n,o=0;if(e>0){for(o=n[--e];e>0&&(t=o,r=n[--e],o=t+r,i=r-(o-t),!i););e>0&&(i<0&&n[e-1]<0||i>0&&n[e-1]>0)&&(r=2*i,t=o+r,r==t-o&&(o=t))}return o}}function s(n){return Array.from(function*(n){for(const t of n)yield*t}(n))}function p(n){if(!n.ok)throw new Error(n.status+" "+n.statusText);if(204!==n.status&&205!==n.status)return n.json()}var h=1e-6,v=1e-12,g=Math.PI,y=g/2,d=g/4,m=2*g,S=180/g,E=g/180,x=Math.abs,M=Math.atan,w=Math.atan2,k=Math.cos,b=Math.sin,j=Math.sign||function(n){return n>0?1:n<0?-1:0},N=Math.sqrt;function _(n){return n>1?y:n<-1?-y:Math.asin(n)}function P(){}function F(n,t){n&&C.hasOwnProperty(n.type)&&C[n.type](n,t)}var A={Feature:function(n,t){F(n.geometry,t)},FeatureCollection:function(n,t){for(var r=n.features,i=-1,e=r.length;++i<e;)F(r[i].geometry,t)}},C={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var r=n.coordinates,i=-1,e=r.length;++i<e;)n=r[i],t.point(n[0],n[1],n[2])},LineString:function(n,t){z(n.coordinates,t,0)},MultiLineString:function(n,t){for(var r=n.coordinates,i=-1,e=r.length;++i<e;)z(r[i],t,0)},Polygon:function(n,t){O(n.coordinates,t)},MultiPolygon:function(n,t){for(var r=n.coordinates,i=-1,e=r.length;++i<e;)O(r[i],t)},GeometryCollection:function(n,t){for(var r=n.geometries,i=-1,e=r.length;++i<e;)F(r[i],t)}};function z(n,t,r){var i,e=-1,o=n.length-r;for(t.lineStart();++e<o;)i=n[e],t.point(i[0],i[1],i[2]);t.lineEnd()}function O(n,t){var r=-1,i=n.length;for(t.polygonStart();++r<i;)z(n[r],t,1);t.polygonEnd()}function X(n){return[w(n[1],n[0]),_(n[2])]}function Y(n){var t=n[0],r=n[1],i=k(r);return[i*k(t),i*b(t),b(r)]}function G(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function L(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function R(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function q(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function T(n){var t=N(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function W(n,t){function r(r,i){return r=n(r,i),t(r[0],r[1])}return n.invert&&t.invert&&(r.invert=function(r,i){return(r=t.invert(r,i))&&n.invert(r[0],r[1])}),r}function H(n,t){return x(n)>g&&(n-=Math.round(n/m)*m),[n,t]}function I(n){return function(t,r){return x(t+=n)>g&&(t-=Math.round(t/m)*m),[t,r]}}function Q(n){var t=I(n);return t.invert=I(-n),t}function V(n,t){var r=k(n),i=b(n),e=k(t),o=b(t);function u(n,t){var u=k(t),a=k(n)*u,l=b(n)*u,f=b(t),c=f*r+a*i;return[w(l*e-c*o,a*r-f*i),_(c*e+l*o)]}return u.invert=function(n,t){var u=k(t),a=k(n)*u,l=b(n)*u,f=b(t),c=f*e-l*o;return[w(l*e+f*o,a*r+c*i),_(c*r-a*i)]},u}function B(n,t){(t=Y(t))[0]-=n,T(t);var r,i=(r=-t[1])>1?0:r<-1?g:Math.acos(r);return((-t[2]<0?-i:i)+m-h)%m}function D(){var n,t=[];return{point:function(t,r,i){n.push([t,r,i])},lineStart:function(){t.push(n=[])},lineEnd:P,rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))},result:function(){var r=t;return t=[],n=null,r}}}function J(n,t){return x(n[0]-t[0])<h&&x(n[1]-t[1])<h}function K(n,t,r,i){this.x=n,this.z=t,this.o=r,this.e=i,this.v=!1,this.n=this.p=null}function U(n,t,r,i,e){var o,u,a=[],l=[];if(n.forEach((function(n){if(!((t=n.length-1)<=0)){var t,r,i=n[0],u=n[t];if(J(i,u)){if(!i[2]&&!u[2]){for(e.lineStart(),o=0;o<t;++o)e.point((i=n[o])[0],i[1]);return void e.lineEnd()}u[0]+=2*h}a.push(r=new K(i,n,null,!0)),l.push(r.o=new K(i,null,r,!1)),a.push(r=new K(u,n,null,!1)),l.push(r.o=new K(u,null,r,!0))}})),a.length){for(l.sort(t),Z(a),Z(l),o=0,u=l.length;o<u;++o)l[o].e=r=!r;for(var f,c,s=a[0];;){for(var p=s,v=!0;p.v;)if((p=p.n)===s)return;f=p.z,e.lineStart();do{if(p.v=p.o.v=!0,p.e){if(v)for(o=0,u=f.length;o<u;++o)e.point((c=f[o])[0],c[1]);else i(p.x,p.n.x,1,e);p=p.n}else{if(v)for(f=p.p.z,o=f.length-1;o>=0;--o)e.point((c=f[o])[0],c[1]);else i(p.x,p.p.x,-1,e);p=p.p}f=(p=p.o).z,v=!v}while(!p.v);e.lineEnd()}}}function Z(n){if(t=n.length){for(var t,r,i=0,e=n[0];++i<t;)e.n=r=n[i],r.p=e,e=r;e.n=r=n[0],r.p=e}}function $(n){return x(n[0])<=g?n[0]:j(n[0])*((x(n[0])+g)%m-g)}function nn(n,t,r,i){return function(e){var o,u,a,l=t(e),f=D(),p=t(f),S=!1,E={point:x,lineStart:j,lineEnd:N,polygonStart:function(){E.point=P,E.lineStart=F,E.lineEnd=A,u=[],o=[]},polygonEnd:function(){E.point=x,E.lineStart=j,E.lineEnd=N,u=s(u);var n=function(n,t){var r=$(t),i=t[1],e=b(i),o=[b(r),-k(r),0],u=0,a=0,l=new c;1===e?i=y+h:-1===e&&(i=-y-h);for(var f=0,s=n.length;f<s;++f)if(S=(p=n[f]).length)for(var p,S,E=p[S-1],x=$(E),M=E[1]/2+d,j=b(M),N=k(M),P=0;P<S;++P,x=A,j=z,N=O,E=F){var F=p[P],A=$(F),C=F[1]/2+d,z=b(C),O=k(C),X=A-x,G=X>=0?1:-1,R=G*X,q=R>g,W=j*z;if(l.add(w(W*G*b(R),N*O+W*k(R))),u+=q?X+G*m:X,q^x>=r^A>=r){var H=L(Y(E),Y(F));T(H);var I=L(o,H);T(I);var Q=(q^X>=0?-1:1)*_(I[2]);(i>Q||i===Q&&(H[0]||H[1]))&&(a+=q^X>=0?1:-1)}}return(u<-h||u<h&&l<-v)^1&a}(o,i);u.length?(S||(e.polygonStart(),S=!0),U(u,rn,n,r,e)):n&&(S||(e.polygonStart(),S=!0),e.lineStart(),r(null,null,1,e),e.lineEnd()),S&&(e.polygonEnd(),S=!1),u=o=null},sphere:function(){e.polygonStart(),e.lineStart(),r(null,null,1,e),e.lineEnd(),e.polygonEnd()}};function x(t,r){n(t,r)&&e.point(t,r)}function M(n,t){l.point(n,t)}function j(){E.point=M,l.lineStart()}function N(){E.point=x,l.lineEnd()}function P(n,t){a.push([n,t]),p.point(n,t)}function F(){p.lineStart(),a=[]}function A(){P(a[0][0],a[0][1]),p.lineEnd();var n,t,r,i,l=p.clean(),c=f.result(),s=c.length;if(a.pop(),o.push(a),a=null,s)if(1&l){if((t=(r=c[0]).length-1)>0){for(S||(e.polygonStart(),S=!0),e.lineStart(),n=0;n<t;++n)e.point((i=r[n])[0],i[1]);e.lineEnd()}}else s>1&&2&l&&c.push(c.pop().concat(c.shift())),u.push(c.filter(tn))}return E}}function tn(n){return n.length>1}function rn(n,t){return((n=n.x)[0]<0?n[1]-y-h:y-n[1])-((t=t.x)[0]<0?t[1]-y-h:y-t[1])}H.invert=H;const en=nn((function(){return!0}),(function(n){var t,r=NaN,i=NaN,e=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(o,u){var a=o>0?g:-g,l=x(o-r);x(l-g)<h?(n.point(r,i=(i+u)/2>0?y:-y),n.point(e,i),n.lineEnd(),n.lineStart(),n.point(a,i),n.point(o,i),t=0):e!==a&&l>=g&&(x(r-e)<h&&(r-=e*h),x(o-a)<h&&(o-=a*h),i=function(n,t,r,i){var e,o,u=b(n-r);return x(u)>h?M((b(t)*(o=k(i))*b(r)-b(i)*(e=k(t))*b(n))/(e*o*u)):(t+i)/2}(r,i,o,u),n.point(e,i),n.lineEnd(),n.lineStart(),n.point(a,i),t=0),n.point(r=o,i=u),e=a},lineEnd:function(){n.lineEnd(),r=i=NaN},clean:function(){return 2-t}}}),(function(n,t,r,i){var e;if(null==n)e=r*y,i.point(-g,e),i.point(0,e),i.point(g,e),i.point(g,0),i.point(g,-e),i.point(0,-e),i.point(-g,-e),i.point(-g,0),i.point(-g,e);else if(x(n[0]-t[0])>h){var o=n[0]<t[0]?g:-g;e=r*o/2,i.point(-o,e),i.point(0,e),i.point(o,e)}else i.point(t[0],t[1])}),[-g,-y]);function on(n){var t=k(n),r=2*E,i=t>0,e=x(t)>h;function o(n,r){return k(n)*k(r)>t}function u(n,r,i){var e=[1,0,0],o=L(Y(n),Y(r)),u=G(o,o),a=o[0],l=u-a*a;if(!l)return!i&&n;var f=t*u/l,c=-t*a/l,s=L(e,o),p=q(e,f);R(p,q(o,c));var v=s,y=G(p,v),d=G(v,v),m=y*y-d*(G(p,p)-1);if(!(m<0)){var S=N(m),E=q(v,(-y-S)/d);if(R(E,p),E=X(E),!i)return E;var M,w=n[0],k=r[0],b=n[1],j=r[1];k<w&&(M=w,w=k,k=M);var _=k-w,P=x(_-g)<h;if(!P&&j<b&&(M=b,b=j,j=M),P||_<h?P?b+j>0^E[1]<(x(E[0]-w)<h?b:j):b<=E[1]&&E[1]<=j:_>g^(w<=E[0]&&E[0]<=k)){var F=q(v,(-y+S)/d);return R(F,p),[E,X(F)]}}}function a(t,r){var e=i?n:g-n,o=0;return t<-e?o|=1:t>e&&(o|=2),r<-e?o|=4:r>e&&(o|=8),o}return nn(o,(function(n){var t,r,l,f,c;return{lineStart:function(){f=l=!1,c=1},point:function(s,p){var h,v=[s,p],y=o(s,p),d=i?y?0:a(s,p):y?a(s+(s<0?g:-g),p):0;if(!t&&(f=l=y)&&n.lineStart(),y!==l&&(!(h=u(t,v))||J(t,h)||J(v,h))&&(v[2]=1),y!==l)c=0,y?(n.lineStart(),h=u(v,t),n.point(h[0],h[1])):(h=u(t,v),n.point(h[0],h[1],2),n.lineEnd()),t=h;else if(e&&t&&i^y){var m;d&r||!(m=u(v,t,!0))||(c=0,i?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1],3)))}!y||t&&J(t,v)||n.point(v[0],v[1]),t=v,l=y,r=d},lineEnd:function(){l&&n.lineEnd(),t=null},clean:function(){return c|(f&&l)<<1}}}),(function(t,i,e,o){!function(n,t,r,i,e,o){if(r){var u=k(t),a=b(t),l=i*r;null==e?(e=t+i*m,o=t-l/2):(e=B(u,e),o=B(u,o),(i>0?e<o:e>o)&&(e+=i*m));for(var f,c=e;i>0?c>o:c<o;c-=l)f=X([u,-a*k(c),-a*b(c)]),n.point(f[0],f[1])}}(o,n,r,e,t,i)}),i?[0,-n]:[-g,n-g])}var un=1e9,an=-un;function ln(n,t,r,i){function e(e,o){return n<=e&&e<=r&&t<=o&&o<=i}function o(e,o,a,f){var c=0,s=0;if(null==e||(c=u(e,a))!==(s=u(o,a))||l(e,o)<0^a>0)do{f.point(0===c||3===c?n:r,c>1?i:t)}while((c=(c+a+4)%4)!==s);else f.point(o[0],o[1])}function u(i,e){return x(i[0]-n)<h?e>0?0:3:x(i[0]-r)<h?e>0?2:1:x(i[1]-t)<h?e>0?1:0:e>0?3:2}function a(n,t){return l(n.x,t.x)}function l(n,t){var r=u(n,1),i=u(t,1);return r!==i?r-i:0===r?t[1]-n[1]:1===r?n[0]-t[0]:2===r?n[1]-t[1]:t[0]-n[0]}return function(u){var l,f,c,p,h,v,g,y,d,m,S,E=u,x=D(),M={point:w,lineStart:function(){M.point=k,f&&f.push(c=[]);m=!0,d=!1,g=y=NaN},lineEnd:function(){l&&(k(p,h),v&&d&&x.rejoin(),l.push(x.result()));M.point=w,d&&E.lineEnd()},polygonStart:function(){E=x,l=[],f=[],S=!0},polygonEnd:function(){var t=function(){for(var t=0,r=0,e=f.length;r<e;++r)for(var o,u,a=f[r],l=1,c=a.length,s=a[0],p=s[0],h=s[1];l<c;++l)o=p,u=h,p=(s=a[l])[0],h=s[1],u<=i?h>i&&(p-o)*(i-u)>(h-u)*(n-o)&&++t:h<=i&&(p-o)*(i-u)<(h-u)*(n-o)&&--t;return t}(),r=S&&t,e=(l=s(l)).length;(r||e)&&(u.polygonStart(),r&&(u.lineStart(),o(null,null,1,u),u.lineEnd()),e&&U(l,a,t,o,u),u.polygonEnd());E=u,l=f=c=null}};function w(n,t){e(n,t)&&E.point(n,t)}function k(o,u){var a=e(o,u);if(f&&c.push([o,u]),m)p=o,h=u,v=a,m=!1,a&&(E.lineStart(),E.point(o,u));else if(a&&d)E.point(o,u);else{var l=[g=Math.max(an,Math.min(un,g)),y=Math.max(an,Math.min(un,y))],s=[o=Math.max(an,Math.min(un,o)),u=Math.max(an,Math.min(un,u))];!function(n,t,r,i,e,o){var u,a=n[0],l=n[1],f=0,c=1,s=t[0]-a,p=t[1]-l;if(u=r-a,s||!(u>0)){if(u/=s,s<0){if(u<f)return;u<c&&(c=u)}else if(s>0){if(u>c)return;u>f&&(f=u)}if(u=e-a,s||!(u<0)){if(u/=s,s<0){if(u>c)return;u>f&&(f=u)}else if(s>0){if(u<f)return;u<c&&(c=u)}if(u=i-l,p||!(u>0)){if(u/=p,p<0){if(u<f)return;u<c&&(c=u)}else if(p>0){if(u>c)return;u>f&&(f=u)}if(u=o-l,p||!(u<0)){if(u/=p,p<0){if(u>c)return;u>f&&(f=u)}else if(p>0){if(u<f)return;u<c&&(c=u)}return f>0&&(n[0]=a+f*s,n[1]=l+f*p),c<1&&(t[0]=a+c*s,t[1]=l+c*p),!0}}}}}(l,s,n,t,r,i)?a&&(E.lineStart(),E.point(o,u),S=!1):(d||(E.lineStart(),E.point(l[0],l[1])),E.point(s[0],s[1]),a||E.lineEnd(),S=!1)}g=o,y=u,d=a}return M}}const fn=n=>n;var cn=1/0,sn=cn,pn=-cn,hn=pn,vn={point:function(n,t){n<cn&&(cn=n);n>pn&&(pn=n);t<sn&&(sn=t);t>hn&&(hn=t)},lineStart:P,lineEnd:P,polygonStart:P,polygonEnd:P,result:function(){var n=[[cn,sn],[pn,hn]];return pn=hn=-(sn=cn=1/0),n}};function gn(n){return function(t){var r=new yn;for(var i in n)r[i]=n[i];return r.stream=t,r}}function yn(){}function dn(n,t,r){var i=n.clipExtent&&n.clipExtent();return n.scale(150).translate([0,0]),null!=i&&n.clipExtent(null),function(n,t){n&&A.hasOwnProperty(n.type)?A[n.type](n,t):F(n,t)}(r,n.stream(vn)),t(vn.result()),null!=i&&n.clipExtent(i),n}function mn(n,t,r){return dn(n,(function(r){var i=t[1][0]-t[0][0],e=t[1][1]-t[0][1],o=Math.min(i/(r[1][0]-r[0][0]),e/(r[1][1]-r[0][1])),u=+t[0][0]+(i-o*(r[1][0]+r[0][0]))/2,a=+t[0][1]+(e-o*(r[1][1]+r[0][1]))/2;n.scale(150*o).translate([u,a])}),r)}yn.prototype={constructor:yn,point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};var Sn=16,En=k(30*E);function xn(n,t){return+t?function(n,t){function r(i,e,o,u,a,l,f,c,s,p,v,g,y,d){var m=f-i,S=c-e,E=m*m+S*S;if(E>4*t&&y--){var M=u+p,k=a+v,b=l+g,j=N(M*M+k*k+b*b),P=_(b/=j),F=x(x(b)-1)<h||x(o-s)<h?(o+s)/2:w(k,M),A=n(F,P),C=A[0],z=A[1],O=C-i,X=z-e,Y=S*O-m*X;(Y*Y/E>t||x((m*O+S*X)/E-.5)>.3||u*p+a*v+l*g<En)&&(r(i,e,o,u,a,l,C,z,F,M/=j,k/=j,b,y,d),d.point(C,z),r(C,z,F,M,k,b,f,c,s,p,v,g,y,d))}}return function(t){var i,e,o,u,a,l,f,c,s,p,h,v,g={point:y,lineStart:d,lineEnd:S,polygonStart:function(){t.polygonStart(),g.lineStart=E},polygonEnd:function(){t.polygonEnd(),g.lineStart=d}};function y(r,i){r=n(r,i),t.point(r[0],r[1])}function d(){c=NaN,g.point=m,t.lineStart()}function m(i,e){var o=Y([i,e]),u=n(i,e);r(c,s,f,p,h,v,c=u[0],s=u[1],f=i,p=o[0],h=o[1],v=o[2],Sn,t),t.point(c,s)}function S(){g.point=y,t.lineEnd()}function E(){d(),g.point=x,g.lineEnd=M}function x(n,t){m(i=n,t),e=c,o=s,u=p,a=h,l=v,g.point=m}function M(){r(c,s,f,p,h,v,e,o,i,u,a,l,Sn,t),g.lineEnd=S,S()}return g}}(n,t):function(n){return gn({point:function(t,r){t=n(t,r),this.stream.point(t[0],t[1])}})}(n)}var Mn,wn=gn({point:function(n,t){this.stream.point(n*E,t*E)}});function kn(n,t,r,i,e,o){if(!o)return function(n,t,r,i,e){function o(o,u){return[t+n*(o*=i),r-n*(u*=e)]}return o.invert=function(o,u){return[(o-t)/n*i,(r-u)/n*e]},o}(n,t,r,i,e);var u=k(o),a=b(o),l=u*n,f=a*n,c=u/n,s=a/n,p=(a*r-u*t)/n,h=(a*t+u*r)/n;function v(n,o){return[l*(n*=i)-f*(o*=e)+t,r-f*n-l*o]}return v.invert=function(n,t){return[i*(c*n-s*t+p),e*(h-s*n-c*t)]},v}function bn(n){return function(n){var t,r,i,e,o,u,a,l,f,c,s=150,p=480,h=250,v=0,g=0,y=0,d=0,x=0,M=0,w=1,k=1,b=null,j=en,_=null,P=fn,F=.5;function A(n){return l(n[0]*E,n[1]*E)}function C(n){return(n=l.invert(n[0],n[1]))&&[n[0]*S,n[1]*S]}function z(){var n=kn(s,0,0,w,k,M).apply(null,t(v,g)),i=kn(s,p-n[0],h-n[1],w,k,M);return r=function(n,t,r){return(n%=m)?t||r?W(Q(n),V(t,r)):Q(n):t||r?V(t,r):H}(y,d,x),a=W(t,i),l=W(r,a),u=xn(a,F),O()}function O(){return f=c=null,A}return A.stream=function(n){return f&&c===n?f:f=wn(function(n){return gn({point:function(t,r){var i=n(t,r);return this.stream.point(i[0],i[1])}})}(r)(j(u(P(c=n)))))},A.preclip=function(n){return arguments.length?(j=n,b=void 0,O()):j},A.postclip=function(n){return arguments.length?(P=n,_=i=e=o=null,O()):P},A.clipAngle=function(n){return arguments.length?(j=+n?on(b=n*E):(b=null,en),O()):b*S},A.clipExtent=function(n){return arguments.length?(P=null==n?(_=i=e=o=null,fn):ln(_=+n[0][0],i=+n[0][1],e=+n[1][0],o=+n[1][1]),O()):null==_?null:[[_,i],[e,o]]},A.scale=function(n){return arguments.length?(s=+n,z()):s},A.translate=function(n){return arguments.length?(p=+n[0],h=+n[1],z()):[p,h]},A.center=function(n){return arguments.length?(v=n[0]%360*E,g=n[1]%360*E,z()):[v*S,g*S]},A.rotate=function(n){return arguments.length?(y=n[0]%360*E,d=n[1]%360*E,x=n.length>2?n[2]%360*E:0,z()):[y*S,d*S,x*S]},A.angle=function(n){return arguments.length?(M=n%360*E,z()):M*S},A.reflectX=function(n){return arguments.length?(w=n?-1:1,z()):w<0},A.reflectY=function(n){return arguments.length?(k=n?-1:1,z()):k<0},A.precision=function(n){return arguments.length?(u=xn(a,F=n*n),O()):N(F)},A.fitExtent=function(n,t){return mn(A,n,t)},A.fitSize=function(n,t){return function(n,t,r){return mn(n,[[0,0],t],r)}(A,n,t)},A.fitWidth=function(n,t){return function(n,t,r){return dn(n,(function(r){var i=+t,e=i/(r[1][0]-r[0][0]),o=(i-e*(r[1][0]+r[0][0]))/2,u=-e*r[0][1];n.scale(150*e).translate([o,u])}),r)}(A,n,t)},A.fitHeight=function(n,t){return function(n,t,r){return dn(n,(function(r){var i=+t,e=i/(r[1][1]-r[0][1]),o=-e*r[0][0],u=(i-e*(r[1][1]+r[0][1]))/2;n.scale(150*e).translate([o,u])}),r)}(A,n,t)},function(){return t=n.apply(this,arguments),A.invert=t.invert&&C,z()}}((function(){return n}))()}function jn(n,t){return[k(t)*b(n),b(t)]}function Nn(n,t,r){this.k=n,this.x=t,this.y=r}function _n(n){return n}function Pn(n,t){var r=t.id,i=t.bbox,e=null==t.properties?{}:t.properties,o=function(n,t){var r=function(n){if(null==n)return _n;var t,r,i=n.scale[0],e=n.scale[1],o=n.translate[0],u=n.translate[1];return function(n,a){a||(t=r=0);var l=2,f=n.length,c=new Array(f);for(c[0]=(t+=n[0])*i+o,c[1]=(r+=n[1])*e+u;l<f;)c[l]=n[l],++l;return c}}(n.transform),i=n.arcs;function e(n,t){t.length&&t.pop();for(var e=i[n<0?~n:n],o=0,u=e.length;o<u;++o)t.push(r(e[o],o));n<0&&function(n,t){for(var r,i=n.length,e=i-t;e<--i;)r=n[e],n[e++]=n[i],n[i]=r}(t,u)}function o(n){return r(n)}function u(n){for(var t=[],r=0,i=n.length;r<i;++r)e(n[r],t);return t.length<2&&t.push(t[0]),t}function a(n){for(var t=u(n);t.length<4;)t.push(t[0]);return t}function l(n){return n.map(a)}function f(n){var t,r=n.type;switch(r){case"GeometryCollection":return{type:r,geometries:n.geometries.map(f)};case"Point":t=o(n.coordinates);break;case"MultiPoint":t=n.coordinates.map(o);break;case"LineString":t=u(n.arcs);break;case"MultiLineString":t=n.arcs.map(u);break;case"Polygon":t=l(n.arcs);break;case"MultiPolygon":t=n.arcs.map(l);break;default:return null}return{type:r,coordinates:t}}return f(t)}(n,t);return null==r&&null==i?{type:"Feature",properties:e,geometry:o}:null==i?{type:"Feature",id:r,properties:e,geometry:o}:{type:"Feature",id:r,bbox:i,properties:e,geometry:o}}jn.invert=(Mn=_,function(n,t){var r=N(n*n+t*t),i=Mn(r),e=b(i),o=k(i);return[w(n*e,r*o),_(r&&t*e/r)]}),Nn.prototype={constructor:Nn,scale:function(n){return 1===n?this:new Nn(this.k*n,this.x,this.y)},translate:function(n,t){return 0===n&0===t?this:new Nn(this.k,this.x+this.k*n,this.y+this.k*t)},apply:function(n){return[n[0]*this.k+this.x,n[1]*this.k+this.y]},applyX:function(n){return n*this.k+this.x},applyY:function(n){return n*this.k+this.y},invert:function(n){return[(n[0]-this.x)/this.k,(n[1]-this.y)/this.k]},invertX:function(n){return(n-this.x)/this.k},invertY:function(n){return(n-this.y)/this.k},rescaleX:function(n){return n.copy().domain(n.range().map(this.invertX,this).map(n.invert,n))},rescaleY:function(n){return n.copy().domain(n.range().map(this.invertY,this).map(n.invert,n))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}},Nn.prototype;const Fn={id:"map",ref:"mapRef",class:"content"};const An=f(n({__name:"App",setup(n,{expose:i}){i();const e=t();function f(){const n=bn(jn).scale(249.5).clipAngle(90+h).scale(148).precision(.1),t={project:function(t){const r=n([t.x,t.y]);return new o(r[0],r[1])},unproject:function(t){const r=n.invert([t.x,t.y]);return!r||isNaN(r[0])||isNaN(r[1])?null:new o(r)}},r=t.project(new o(-180,-90)),i=t.project(new o(180,90)),f={top:i.y,left:r.x,right:i.x,bottom:r.y};fetch("http://examples.maptalks.com/resources/geojson/world-50m.json",(function(n,r){if(n)throw n;const i=new u(e.value,{center:[0,0],centerCross:!0,zoom:2,spatialReference:{projection:t,resolutions:function(){const n=[];for(let t=0;t<10;t++)n[t]=4/Math.pow(2,t);return n}(),fullExtent:f}}),o=(s=r,"GeometryCollection"===(p=r.objects.countries).type?{type:"FeatureCollection",features:p.geometries.map((function(n){return Pn(s,n)}))}:Pn(s,p)),c=a.toGeometry(o);var s,p;const h={lineColor:"#fff",lineWidth:.5,polygonOpacity:1,polygonFill:"#747474"};new l("v",c,{geometryEvents:!1,enableSimplify:!1}).forEach((function(n){n.setSymbol(h)})).addTo(i)})).then(p)}r((()=>{f()}));const c={mapRef:e,initMap:f};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}}),[["render",function(n,t,r,o,u,a){return i(),e("div",Fn,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/tilelayer-projection/d3-proj/src/App.vue"]]);export{An as default};

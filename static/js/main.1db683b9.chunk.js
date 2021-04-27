(this.webpackJsonpwebsite=this.webpackJsonpwebsite||[]).push([[0],{203:function(e,t,n){},246:function(e,t,n){"use strict";n.r(t);var a,r,c,i,s,o,l=n(0),u=n.n(l),d=n(16),j=(n(203),n(293)),b=n(10),f=n(24),p=n(125),m="https://scraper-staging.herokuapp.com",h={main:m,auth:"".concat(m,"/auth"),graphql:"".concat(m,"/graphql")},O={isAuthenticated:!1,setIsAuthenticated:function(){},user:void 0,setUser:function(){}},x=Object(l.createContext)(O),g=function(){return Object(l.useContext)(x)},v=function(e,t){return"".concat(e," ").concat(null!==t&&void 0!==t?t:"")},y=n(122),F=n.n(y),w=function(e){return F()(e).isValid()?F()(e).format("DD/MM/YYYY h:mm:ss a"):""},A="authorizationToken",N=function(){return localStorage.getItem(A)},D=function(e){return localStorage.setItem(A,e)},C=function(){return localStorage.removeItem(A)},k=n(5),B=h.graphql,L={watchQuery:{fetchPolicy:"cache-and-network",errorPolicy:"ignore"},query:{fetchPolicy:"cache-first",errorPolicy:"all"},mutate:{errorPolicy:"all"}},I=function(e){var t=e.children,n=Object(l.useState)(),a=Object(b.a)(n,2),r=a[0],c=a[1],i=g().isAuthenticated,s=Object(l.useMemo)((function(){var e;if(i)return null!==(e=N())&&void 0!==e?e:void 0}),[i]);return Object(l.useEffect)((function(){var e="undefined"!==typeof s?{authorization:s}:void 0,t=Object(f.createHttpLink)({uri:B,credentials:"include",headers:e}),n=new f.InMemoryCache;Object(p.b)({cache:n,storage:new p.a(window.sessionStorage)}).then((function(){var a=new f.ApolloClient({cache:n,link:t,defaultOptions:L,headers:e});c(a),console.log("apollo client is loaded!")})).catch((function(){return console.log("error setting up apollo cache persist")}))}),[s]),Object(k.jsx)(k.Fragment,{children:"undefined"!==typeof r?Object(k.jsx)(f.ApolloProvider,{client:r,children:t}):null})},U=n(35),S=n.n(U),E=n(55),P=n(80),q=n.n(P),M="".concat(h.auth,"/login"),T=function(){var e=Object(E.a)(S.a.mark((function e(t){var n;return S.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q.a.post(M,t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),$="".concat(h.auth,"/logout"),z=function(){var e=Object(E.a)(S.a.mark((function e(t){return S.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q.a.post($,void 0,{headers:{authorization:t}});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Q="".concat(h.auth,"/isAuthenticated"),G=function(){var e=Object(E.a)(S.a.mark((function e(t){return S.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q.a.get(Q,{headers:{authorization:t}});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Y=function(e){var t=e.children,n=Object(l.useState)(!1),a=Object(b.a)(n,2),r=a[0],c=a[1],i=Object(l.useState)(),s=Object(b.a)(i,2),o=s[0],u=s[1];return Object(l.useEffect)((function(){var e=N();null!==e&&G(e).then((function(){return c(!0)})).catch((function(){C(),c(!1)}))}),[]),Object(k.jsx)(x.Provider,{value:{isAuthenticated:r,setIsAuthenticated:c,user:o,setUser:u},children:t})},J=n(67),R=Object(f.gql)(a||(a=Object(J.a)(["\n  query me {\n    me {\n      ... on User {\n        id\n        username\n        firstName\n        lastName\n        createdAt\n      }\n    }\n  }\n"]))),V=Object(f.gql)(r||(r=Object(J.a)(["\n  query simpleUser($id: String, $identifier: String) {\n    simpleUser(where: { id: $id, identifier: $identifier }) {\n      id\n      identifier\n      createdAt\n      lastSeen\n    }\n  }\n"]))),W=function(e){var t=e.children,n=g(),a=n.isAuthenticated,r=n.setUser,c=Object(f.useLazyQuery)(R),i=Object(b.a)(c,2),s=i[0],o=i[1].data;return Object(l.useEffect)((function(){a?s():r(void 0)}),[a,r,s]),Object(l.useEffect)((function(){"undefined"!==typeof o&&null!==o.me&&"User"===o.me.__typename&&r(o.me)}),[o,r]),Object(k.jsx)(k.Fragment,{children:t})},_=n(69),H=n(27),K=n(58),X=n(21),Z=n.p+"static/media/robot.c78c2b88.png",ee=function(e){var t=Object.assign({},e),n=Object(H.f)(),a=g(),r=a.isAuthenticated,c=a.setIsAuthenticated,i=function(){var e=Object(E.a)(S.a.mark((function e(){var t;return S.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,null!==(t=N())){e.next=4;break}throw new Error("Token does not exist in the local storage. This is a no-op.");case 4:return e.next=6,z(t);case 6:C(),c(!1),n.push("/"),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0),alert("There was an error logging you out. Please try again.");case 15:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(){return e.apply(this,arguments)}}();return Object(k.jsxs)("div",Object(X.a)(Object(X.a)({},t),{},{className:v("w-full h-10 md:h-12 lg:h-16 flex flex-row justify-between items-center px-4",null===t||void 0===t?void 0:t.className),children:[Object(k.jsxs)("div",{className:"h-full flex flex-row items-center space-x-2 cursor-pointer",onClick:function(){return n.push("/")},children:[Object(k.jsx)("div",{className:"h-full p-1",children:Object(k.jsx)("img",{src:Z,alt:"robot",className:"h-full"})}),Object(k.jsx)("h1",{className:"text-lg lg:text-2xl xl:text-3xl",children:"Blue Nebula"})]}),Object(k.jsx)("div",{children:r?Object(k.jsx)(_.b,{className:"text-base",to:"/",onClick:i,children:"Logout"}):Object(k.jsx)(_.b,{className:"text-base",to:"/auth",children:"Login"})})]}))},te=function(e){var t=e.overridingClassName,n=e.children,a=Object(K.a)(e,["overridingClassName","children"]);return Object(k.jsxs)("div",{className:null!==t&&void 0!==t?t:v("container mx-auto",null===a||void 0===a?void 0:a.className),children:[Object(k.jsx)(ee,{}),n]})},ne=n(175),ae=Object(f.gql)(c||(c=Object(J.a)(["\n  query microApps {\n    microApps(orderBy: { name: asc }) {\n      id\n      name\n      activeVersion\n    }\n  }\n"]))),re=Object(f.gql)(i||(i=Object(J.a)(["\n  query microAppData($id: String) {\n    findUniqueMicroAppData(where: { id: $id }) {\n      id\n      microAppId\n      name\n      version\n      data\n      createdAt\n      creatorId\n    }\n  }\n"]))),ce=Object(f.gql)(s||(s=Object(J.a)(["\n  query microAppDataUsageLogs($microAppId: String, $microAppName: String) {\n    microAppDataUsageLogs(\n      where: {\n        microAppData: {\n          is: {\n            microApp: {\n              is: {\n                OR: [\n                  { id: { equals: $microAppId } }\n                  { name: { equals: $microAppName } }\n                ]\n              }\n            }\n          }\n        }\n      }\n      orderBy: { timestamp: desc }\n    ) {\n      id\n      simpleUserId\n      microAppDataId\n      timestamp\n      locationLatitude\n      locationLongitude\n    }\n  }\n"]))),ie=n(170),se=n(298),oe=Object(f.gql)(o||(o=Object(J.a)(["\n  query reverseGeocoding($latitude: Float!, $longitude: Float!) {\n    reverseGeocoding(where: { latitude: $latitude, longitude: $longitude }) {\n      label\n      name\n    }\n  }\n"]))),le=function(e){var t,n=e.microAppDataUsageLog,a=n.id,r=n.simpleUserId,c=n.microAppDataId,i=n.timestamp,s=n.locationLatitude,o=n.locationLongitude,u=Object(K.a)(e,["microAppDataUsageLog"]),d=Object(f.useQuery)(V,{variables:{id:r}}),j=d.data,p=d.error,m=Object(f.useQuery)(re,{variables:{id:c}}),h=m.data,O=m.error,x=Object(f.useLazyQuery)(oe),g=Object(b.a)(x,2),y=g[0],F=g[1],A=F.data,N=F.error;Object(l.useEffect)((function(){s&&o&&y({variables:{latitude:s,longitude:o}})}),[s,o,y]);var D=Object(l.useMemo)((function(){return"undefined"!==typeof j&&null!==j.simpleUser?j.simpleUser:void 0}),[j]),C=Object(l.useMemo)((function(){return"undefined"!==typeof h&&null!==h.findUniqueMicroAppData?h.findUniqueMicroAppData:void 0}),[h]),B=Object(l.useMemo)((function(){return"undefined"!==typeof A&&null!==A.reverseGeocoding?A.reverseGeocoding:void 0}),[A]);Object(l.useEffect)((function(){"undefined"!==typeof p&&console.log("error retrieving simple user information",p),"undefined"!==typeof O&&console.log("error retrieving micro app data information",O),"undefined"!==typeof N&&console.log("error getting reverse geocoding information",N)}),[p,O,N]);var L=Object(l.useCallback)((function(e,t){return Object(k.jsxs)("div",{className:"flex flex-row space-x-1",children:[Object(k.jsx)("div",{className:"w-1/3 flex-none",children:Object(k.jsx)("p",{className:"text-basic-600",children:e})}),Object(k.jsx)("p",{children:t})]})}),[]);return Object(k.jsxs)("div",Object(X.a)(Object(X.a)({},u),{},{className:v("space-y-3",null===u||void 0===u?void 0:u.className),children:[L("Usage Log ID",a),L("Timestamp",w(i)),"undefined"!==typeof D?L("User ID",D.id):Object(k.jsx)(k.Fragment,{}),"undefined"!==typeof C?L("Micro App Data","".concat(null!==(t=C.name)&&void 0!==t?t:C.id," (version ").concat(C.version,")")):Object(k.jsx)(k.Fragment,{}),s&&o?L("Location coordinates","".concat(s,", ").concat(o)):Object(k.jsx)(k.Fragment,{}),"undefined"!==typeof B?L("Location address",B.label):Object(k.jsx)(k.Fragment,{})]}))},ue=[{field:"id",headerName:"ID",flex:1},{field:"timestamp",headerName:"Timestamp",type:"dateTime",width:200,valueFormatter:function(e){return w(e.value)}},{field:"simpleUserId",headerName:"User ID",flex:2},{field:"locationLatitude",headerName:"Location Latitude",sortable:!1,flex:1},{field:"locationLongitude",headerName:"Location Longitude",sortable:!1,flex:1}],de=function(e){var t=e.microAppId,n=Object(K.a)(e,["microAppId"]),a=Object(f.useQuery)(ce,{variables:{microAppId:t}}),r=a.data,c=a.loading,i=a.error;Object(l.useEffect)((function(){"undefined"!==typeof i&&console.log("error retrieving usage logs")}),[i]);var s=Object(l.useMemo)((function(){return"undefined"!==typeof r&&null!==r.microAppDataUsageLogs?r.microAppDataUsageLogs:[]}),[r]),o=Object(l.useMemo)((function(){return s}),[s]),u=Object(l.useState)(),d=Object(b.a)(u,2),j=d[0],p=d[1],m=Object(l.useState)(!1),h=Object(b.a)(m,2),O=h[0],x=h[1],g=Object(l.useCallback)((function(e){p(e.id),x(!0)}),[]),v=Object(l.useMemo)((function(){return s.find((function(e){return e.id===j}))}),[s,j]);return Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)(ie.a,Object(X.a)(Object(X.a)({pageSize:10,loading:c,disableSelectionOnClick:!0,onRowClick:g},n),{},{rows:o,columns:ue})),Object(k.jsx)(se.a,{open:O,onClose:function(){return x(!1)},children:"undefined"!==typeof v?Object(k.jsx)("div",{className:"absolute top-1/2 left-1/2 w-5/6 md:w-4/5 lg:w-2/3 transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4",style:{minWidth:300},children:Object(k.jsx)(le,{microAppDataUsageLog:v})}):Object(k.jsx)(k.Fragment,{})})]})},je=function(e){var t=Object.assign({},e),n=Object(f.useQuery)(ae,{fetchPolicy:"network-only"}),a=n.data,r=n.error;Object(l.useEffect)((function(){"undefined"!==typeof r&&(console.log(r),alert("There was an error while fetching for the micro app headers."))}),[r]);var c=Object(l.useMemo)((function(){return"undefined"!==typeof a&&null!==a.microApps?a.microApps:[]}),[a]),i=Object(l.useState)(),s=Object(b.a)(i,2),o=s[0],u=s[1],d=Object(l.useMemo)((function(){return c.find((function(e){return e.id===o}))}),[c,o]),j=Object(l.useMemo)((function(){return d&&{value:d.id,label:d.name}}),[d]),p=Object(l.useMemo)((function(){return c.map((function(e){return{value:e.id,label:e.name}}))}),[c]);return Object(k.jsxs)("div",Object(X.a)(Object(X.a)({},t),{},{className:v("flex flex-col space-y-4",null===t||void 0===t?void 0:t.className),children:[Object(k.jsx)(ne.a,{placeholder:"Select micro app",options:p,value:j,onChange:function(e){e&&u(e.value)}}),"undefined"!==typeof o?Object(k.jsx)("div",{className:"flex-grow flex flex-col w-full overflow-x-auto",children:Object(k.jsx)("div",{className:"flex-grow",style:{minWidth:800},children:Object(k.jsx)(de,{microAppId:o})})}):null]}))},be=function(){var e=g().isAuthenticated;return Object(k.jsx)(te,{className:"h-screen flex flex-col",children:e?Object(k.jsx)(je,{className:"flex-grow my-4"}):Object(k.jsx)("div",{className:"flex-grow flex justify-center items-center",children:Object(k.jsx)("h1",{className:"text-2xl",children:"Please login."})})})},fe=n(296),pe=n(68),me=function(e){var t=e.labelText,n=e.labelProps,a=e.inputProps,r=Object(K.a)(e,["labelText","labelProps","inputProps"]);return Object(k.jsxs)("div",Object(X.a)(Object(X.a)({},r),{},{className:v("flex flex-col",null===r||void 0===r?void 0:r.className),children:[Object(k.jsx)("label",Object(X.a)(Object(X.a)({htmlFor:t},n),{},{children:t})),Object(k.jsx)("input",Object(X.a)({id:t},a))]}))},he=function(e){var t=e.handleSubmit,n=Object(K.a)(e,["handleSubmit"]),a=Object(l.useState)({username:"",password:""}),r=Object(b.a)(a,2),c=r[0],i=r[1],s=function(e){return function(t){return i((function(n){return Object(X.a)(Object(X.a)({},n),{},Object(pe.a)({},e,t.target.value))}))}};return Object(k.jsxs)("form",Object(X.a)(Object(X.a)({},n),{},{className:v("flex flex-col",n.className),children:[[{label:"Username",key:"username"},{label:"Password",key:"password",props:{inputProps:{type:"password"}}}].map((function(e,t){var n=e.label,a=e.key,r=e.props;return Object(k.jsx)(me,Object(X.a)(Object(X.a)({labelText:n},r),{},{inputProps:Object(X.a)({className:"border border-gray-200 rounded p-1",value:c[a],onChange:s(a)},null===r||void 0===r?void 0:r.inputProps),className:v(0!==t?"mt-2":"",null===r||void 0===r?void 0:r.className)}),t)})),Object(k.jsx)("button",{className:"mt-4 btn btn-primary",onClick:function(e){e.preventDefault(),t(c)},type:"submit",children:"Login"})]}))},Oe=n(26),xe=n.n(Oe),ge=function(){var e=g().setIsAuthenticated,t=Object(H.f)(),n=function(){var n=Object(E.a)(S.a.mark((function n(a){var r;return S.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,T(a);case 3:r=n.sent,D(r),e(!0),t.replace("/"),n.next=13;break;case 9:n.prev=9,n.t0=n.catch(0),console.log(n.t0),alert("An error occurred logging you in. Please try again.");case 13:case"end":return n.stop()}}),n,null,[[0,9]])})));return function(e){return n.apply(this,arguments)}}();return Object(k.jsx)("div",{className:"w-screen h-screen flex flex-col justify-center items-center",children:Object(k.jsxs)("div",{className:"w-full max-w-md p-4",children:[Object(k.jsxs)("div",{children:[Object(k.jsx)("img",{src:Z,alt:"robot",className:"w-28 h-28 mx-auto"}),Object(k.jsxs)("div",{className:"mt-2 flex justify-center items-center space-x-2",children:[Object(k.jsx)(fe.a,{color:xe.a.warning[500]}),Object(k.jsx)("p",{className:"font-semibold text-center",children:"Please login to use blue nebula services"})]})]}),Object(k.jsx)("div",{className:"mt-6",children:Object(k.jsx)(he,{handleSubmit:n})})]})})},ve=n(297),ye=function(){return Object(k.jsxs)("div",{className:"w-screen h-screen flex flex-col justify-center items-center",children:[Object(k.jsx)(ve.a,{size:40,color:xe.a.warning[500]}),Object(k.jsx)("h1",{className:"mt-2 text-3xl",children:"404 Not Found"}),Object(k.jsx)("button",{className:"mt-6 btn btn-primary",children:Object(k.jsx)(_.b,{to:"/",children:"Back to home page"})})]})},Fe=function(){return Object(k.jsx)(_.a,{children:Object(k.jsxs)(H.c,{children:[Object(k.jsx)(H.a,{exact:!0,path:"/auth",children:Object(k.jsx)(ge,{})}),Object(k.jsx)(H.a,{exact:!0,path:"/",children:Object(k.jsx)(be,{})}),Object(k.jsx)(H.a,{children:Object(k.jsx)(ye,{})})]})})},we=n(79),Ae=Object(we.a)({palette:{primary:{main:xe.a.primary[500],light:xe.a.primary[700],dark:xe.a.primary[300],contrastText:"white"},secondary:{main:xe.a.basic[500],light:xe.a.basic[700],dark:xe.a.basic[300],contrastText:"white"},success:{main:xe.a.success[500],light:xe.a.success[700],dark:xe.a.success[300],contrastText:"white"},info:{main:xe.a.info[500],light:xe.a.info[700],dark:xe.a.info[300],contrastText:"white"},warning:{main:xe.a.warning[500],light:xe.a.warning[700],dark:xe.a.warning[300],contrastText:"white"},error:{main:xe.a.danger[500],light:xe.a.danger[700],dark:xe.a.danger[300],contrastText:"white"}}});var Ne=function(){return Object(k.jsx)(j.a,{theme:Ae,children:Object(k.jsx)(Y,{children:Object(k.jsx)(I,{children:Object(k.jsx)(W,{children:Object(k.jsx)(Fe,{})})})})})},De=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,300)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),a(e),r(e),c(e),i(e)}))};Object(d.render)(Object(k.jsx)(u.a.StrictMode,{children:Object(k.jsx)(Ne,{})}),document.getElementById("root")),De()},26:function(e,t){e.exports={primary:{100:"#D6E4FF",200:"#ADC8FF",300:"#84A9FF",400:"#6690FF",500:"#3366FF",700:"#1939B7",800:"#102693",900:"#091A7A"},success:{100:"#CAFDD8",200:"#97FBBC",300:"#62F5A7",400:"#3BECA0",500:"#00E096",600:"#00C093",700:"#00A18B",800:"#00817D",900:"#00646B"},info:{100:"#CCF5FF",200:"#99E6FF",300:"#66D0FF",400:"#3FBAFF",500:"#0095FF",600:"#0073DB",700:"#0056B7",800:"#003C93",900:"#002B7A"},warning:{100:"#FFF6CD",200:"#FFEB9B",300:"#FFDD69",400:"#FFCF43",500:"#FFB805",600:"#DB9703",700:"#B77902",800:"#935D01",900:"#7A4900"},danger:{100:"#FFDCD8",200:"#FFB3B1",300:"#FF8A93",400:"#FF6D86",500:"#FF3D71",600:"#DB2C6C",700:"#B71E65",800:"#93135B",900:"#7A0B54"},basic:{100:"#FFFFFF",200:"#F7F9FC",300:"#EDF1F7",400:"#E4E9F2",500:"#C5CEE0",600:"#8F9BB3",700:"#2E3A59",800:"#222B45",900:"#222B45"}}}},[[246,1,2]]]);
//# sourceMappingURL=main.1db683b9.chunk.js.map
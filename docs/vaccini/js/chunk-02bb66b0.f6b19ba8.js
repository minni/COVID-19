(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-02bb66b0"],{"0cb2":function(e,a,t){var n=t("7b0b"),i=Math.floor,o="".replace,r=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,c=/\$([$&'`]|\d{1,2})/g;e.exports=function(e,a,t,s,l,u){var d=t+e.length,v=s.length,p=c;return void 0!==l&&(l=n(l),p=r),o.call(u,p,(function(n,o){var r;switch(o.charAt(0)){case"$":return"$";case"&":return e;case"`":return a.slice(0,t);case"'":return a.slice(d);case"<":r=l[o.slice(1,-1)];break;default:var c=+o;if(0===c)return n;if(c>v){var u=i(c/10);return 0===u?n:u<=v?void 0===s[u-1]?o.charAt(1):s[u-1]+o.charAt(1):n}r=s[c-1]}return void 0===r?"":r}))}},"1b10":function(e,a,t){"use strict";t.r(a);var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"consegne"},[t("loading",{attrs:{active:e.isLoading,"can-cancel":!1,"zon-cancel":"onCancel","is-full-page":!0},on:{"update:active":function(a){e.isLoading=a}}}),t("ScelteVaccinazioni",{model:{value:e.scelte,callback:function(a){e.scelte=a},expression:"scelte"}}),e._v(" TOTALE: "+e._s(e._f("toNumber")(e.totale))+" "),t("Grafico",{attrs:{"chart-data":e.datiGrafico,options:e.options}})],1)},i=[],o=(t("4de4"),t("13d5"),t("b64b"),t("07ac"),t("159b"),t("d81d"),t("466d"),t("ac1f"),t("a15b"),t("1276"),t("5319"),t("fb6a"),function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"scelte_vaccinazioni"},[e._v(" SCELTE: Periodo "),t("select",{directives:[{name:"model",rawName:"v-model",value:e.value.periodo,expression:"value.periodo"}],on:{change:function(a){var t=Array.prototype.filter.call(a.target.options,(function(e){return e.selected})).map((function(e){var a="_value"in e?e._value:e.value;return a}));e.$set(e.value,"periodo",a.target.multiple?t:t[0])}}},[t("option",{attrs:{value:"last_21"}},[e._v("Ultimi 21 giorni")]),t("option",{attrs:{value:"last_180"}},[e._v("Ultimi 6 mesi")]),t("option",{attrs:{value:"all"}},[e._v("Tutto")])]),t("br"),e._v(" Grafico "+e._s(e.value.manip)+" "),t("select",{directives:[{name:"model",rawName:"v-model",value:e.value.manip,expression:"value.manip"}],on:{change:function(a){var t=Array.prototype.filter.call(a.target.options,(function(e){return e.selected})).map((function(e){var a="_value"in e?e._value:e.value;return a}));e.$set(e.value,"manip",a.target.multiple?t:t[0])}}},[t("option",{attrs:{value:""}},[e._v("Giorno per giorno")]),t("option",{attrs:{value:"incremental"}},[e._v("Incrementale")])]),t("br"),e._v(" Andamento "+e._s(e.value.group_by)+" "),t("select",{directives:[{name:"model",rawName:"v-model",value:e.value.group_by,expression:"value.group_by"}],on:{change:function(a){var t=Array.prototype.filter.call(a.target.options,(function(e){return e.selected})).map((function(e){var a="_value"in e?e._value:e.value;return a}));e.$set(e.value,"group_by",a.target.multiple?t:t[0])}}},[t("option",{attrs:{value:"tot"}},[e._v("Totale")]),t("option",{attrs:{value:"reg"}},[e._v("Regione")]),t("option",{attrs:{value:"for"}},[e._v("Fornitore")]),t("option",{attrs:{value:"ses"}},[e._v("Sesso")]),t("option",{attrs:{value:"fas"}},[e._v("Fascia Anagrafica")]),t("option",{attrs:{value:"cat"}},[e._v("Categorie")]),t("option",{attrs:{value:"dos"}},[e._v("Prima / Seconda dose")])]),t("br"),e._v(" Regione "+e._s(e.value.regione)+" "),t("select",{directives:[{name:"model",rawName:"v-model",value:e.value.regione,expression:"value.regione"}],on:{change:function(a){var t=Array.prototype.filter.call(a.target.options,(function(e){return e.selected})).map((function(e){var a="_value"in e?e._value:e.value;return a}));e.$set(e.value,"regione",a.target.multiple?t:t[0])}}},[t("option",{attrs:{value:"all"}},[e._v("Tutte")]),t("option",[e._v("Abruzzo")]),t("option",[e._v("Basilicata")]),t("option",[e._v("Calabria")]),t("option",[e._v("Campania")]),t("option",[e._v("Emilia-Romagna")]),t("option",[e._v("Friuli-Venezia Giulia")]),t("option",[e._v("Lazio")]),t("option",[e._v("Liguria")]),t("option",[e._v("Lombardia")]),t("option",[e._v("Marche")]),t("option",[e._v("Molise")]),t("option",[e._v("Provincia Autonoma Bolzano / Bozen")]),t("option",[e._v("Provincia Autonoma Trento")]),t("option",[e._v("Piemonte")]),t("option",[e._v("Puglia")]),t("option",[e._v("Sardegna")]),t("option",[e._v("Sicilia")]),t("option",[e._v("Toscana")]),t("option",[e._v("Umbria")]),t("option",[e._v("Valle d'Aosta / Vallée d'Aoste")]),t("option",[e._v("Veneto")])])])}),r=[],c={name:"ScelteVaccinazioni",props:["value"]},s=c,l=t("2877"),u=Object(l["a"])(s,o,r,!1,null,null,null),d=u.exports,v=t("79dd"),p=t("9062"),f=t.n(p),_=(t("e40d"),t("5fdb")),m=t("be03"),b=t("87d4"),g={name:"Vaccinzazioni",components:{Loading:f.a,ScelteVaccinazioni:d,Grafico:v["a"]},data:function(){return{isLoading:!1,scelte:{periodo:"last_180",group_by:"tot",manip:"incremental",regione:"all"},totale:0,options:_["a"]}},computed:{datiGrafico:function(){var e=this,a=e.datiPeriodo(e.scelte.periodo);return"all"!=e.scelte.regione&&(a=a.filter((function(a){return a.nome_area==e.scelte.regione}))),"reg"==e.scelte.group_by?e.datiRegione(a):"for"==e.scelte.group_by?e.datiFornitore(a):"ses"==e.scelte.group_by?e.datiSesso(a):"fas"==e.scelte.group_by?e.datiFascia(a):"dos"==e.scelte.group_by?e.datiDose(a):"cat"==e.scelte.group_by?e.datiCategoria(a):e.datiTutto(a)}},created:function(){window.vaccinazioni||this.caricaVaccinazioni()},methods:{datiTutto:function(e){var a=this,t=0,n=e.reduce((function(e,a){var n=Object(m["a"])(a.data_somministrazione);return e[n]||(e[n]=0),e[n]+=a.prima_dose,e[n]+=a.seconda_dose,t+=a.prima_dose+a.seconda_dose,e}),{});return a.totale=t,{labels:Object.keys(n),datasets:[{label:"Complessivo",fill:!1,data:Object(m["c"])(Object.values(n),a.scelte.manip)}]}},datiRegione:function(e){var a=this,t=0,n=[];e.forEach((function(e){n.indexOf(e.nome_area)<0&&n.push(e.nome_area)}));var i=e.reduce((function(e,a){var n=Object(m["a"])(a.data_somministrazione);return e[n]||(e[n]={}),e[n][a.nome_area]||(e[n][a.nome_area]=0),e[n][a.nome_area]+=a.prima_dose,e[n][a.nome_area]+=a.seconda_dose,t+=a.prima_dose+a.seconda_dose,e}),{});return a.totale=t,{labels:Object.keys(i),datasets:n.map((function(e){return{label:e,fill:!1,data:Object(m["c"])(Object.values(i).map((function(a){return a[e]?a[e]:0})),a.scelte.manip)}}))}},datiFornitore:function(e){var a=this,t=0,n=[];e.forEach((function(e){n.indexOf(e.fornitore)<0&&n.push(e.fornitore)}));var i=e.reduce((function(e,a){var n=Object(m["a"])(a.data_somministrazione);return e[n]||(e[n]={}),e[n][a.fornitore]||(e[n][a.fornitore]=0),e[n][a.fornitore]+=a.prima_dose,e[n][a.fornitore]+=a.seconda_dose,t+=a.prima_dose+a.seconda_dose,e}),{});return a.totale=t,{labels:Object.keys(i),datasets:n.map((function(e){return{label:e,fill:!1,data:Object(m["c"])(Object.values(i).map((function(a){return a[e]?a[e]:0})),a.scelte.manip)}}))}},datiSesso:function(e){var a=this,t=0,n=["Maschile","Femminile"],i=e.reduce((function(e,a){var n=Object(m["a"])(a.data_somministrazione);return e[n]||(e[n]={Maschile:0,Femminile:0}),e[n]["Maschile"]+=a.sesso_maschile,e[n]["Femminile"]+=a.sesso_femminile,t+=a.prima_dose+a.seconda_dose,e}),{});return a.totale=t,{labels:Object.keys(i),datasets:n.map((function(e){return{label:e,fill:!1,data:Object(m["c"])(Object.values(i).map((function(a){return a[e]?a[e]:0})),a.scelte.manip)}}))}},datiDose:function(e){var a=this,t=0,n=["Prima","Seconda"],i=e.reduce((function(e,a){var n=Object(m["a"])(a.data_somministrazione);return e[n]||(e[n]={Prima:0,Seconda:0}),e[n]["Prima"]+=a.prima_dose,e[n]["Seconda"]+=a.seconda_dose,t+=a.prima_dose+a.seconda_dose,e}),{});return a.totale=t,{labels:Object.keys(i),datasets:n.map((function(e){return{label:e,fill:!1,data:Object(m["c"])(Object.values(i).map((function(a){return a[e]?a[e]:0})),a.scelte.manip)}}))}},datiFascia:function(e){var a=this,t=0,n=[];e.forEach((function(e){n.indexOf(e.fascia_anagrafica)<0&&n.push(e.fascia_anagrafica)})),n=n.sort();var i=e.reduce((function(e,a){var n=Object(m["a"])(a.data_somministrazione);return e[n]||(e[n]={}),e[n][a.fascia_anagrafica]||(e[n][a.fascia_anagrafica]=0),e[n][a.fascia_anagrafica]+=a.prima_dose,e[n][a.fascia_anagrafica]+=a.seconda_dose,t+=a.prima_dose+a.seconda_dose,e}),{});return a.totale=t,{labels:Object.keys(i),datasets:n.map((function(e){return{label:e,fill:!1,data:Object(m["c"])(Object.values(i).map((function(a){return a[e]?a[e]:0})),a.scelte.manip)}}))}},datiCategoria:function(e){var a=this,t=0,n=[];e.forEach((function(e){Object.keys(e).filter((function(e){return e.match(/^categoria_/)})).forEach((function(e){n.indexOf(e)<0&&n.push(e)}))}));var i=e.reduce((function(e,a){var i=Object(m["a"])(a.data_somministrazione);return e[i]||(e[i]={}),n.forEach((function(n){e[i][n]||(e[i][n]=0),e[i][n]+=a[n],t+=a[n]})),e}),{});return a.totale=t,{labels:Object.keys(i),datasets:n.map((function(e){var t=e.replace(/^categoria_/,"").split("_").join(" ");return t=t.charAt(0).toUpperCase()+t.slice(1),{label:t,fill:!1,data:Object(m["c"])(Object.values(i).map((function(a){return a[e]?a[e]:0})),a.scelte.manip)}}))}},datiPeriodo:function(e){if(!window.vaccinazioni)return[];var a=window.vaccinazioni.data,t=null;return"last_21"==e&&(t=22),"last_180"==e&&(t=181),Object(m["b"])(a,"data_somministrazione",t)},caricaVaccinazioni:function(){var e=this;e.isLoading=!0;var a=e.scelte.group_by;e.scelte.group_by="NONE",Object(b["b"])((function(){e.isLoading=!1,e.scelte.group_by=a}))}}},h=g,O=Object(l["a"])(h,n,i,!1,null,null,null);a["default"]=O.exports},"466d":function(e,a,t){"use strict";var n=t("d784"),i=t("825a"),o=t("50c4"),r=t("1d80"),c=t("8aa5"),s=t("14c3");n("match",1,(function(e,a,t){return[function(a){var t=r(this),n=void 0==a?void 0:a[e];return void 0!==n?n.call(a,t):new RegExp(a)[e](String(t))},function(e){var n=t(a,e,this);if(n.done)return n.value;var r=i(e),l=String(this);if(!r.global)return s(r,l);var u=r.unicode;r.lastIndex=0;var d,v=[],p=0;while(null!==(d=s(r,l))){var f=String(d[0]);v[p]=f,""===f&&(r.lastIndex=c(l,o(r.lastIndex),u)),p++}return 0===p?null:v}]}))},5319:function(e,a,t){"use strict";var n=t("d784"),i=t("825a"),o=t("50c4"),r=t("a691"),c=t("1d80"),s=t("8aa5"),l=t("0cb2"),u=t("14c3"),d=Math.max,v=Math.min,p=function(e){return void 0===e?e:String(e)};n("replace",2,(function(e,a,t,n){var f=n.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,_=n.REPLACE_KEEPS_$0,m=f?"$":"$0";return[function(t,n){var i=c(this),o=void 0==t?void 0:t[e];return void 0!==o?o.call(t,i,n):a.call(String(i),t,n)},function(e,n){if(!f&&_||"string"===typeof n&&-1===n.indexOf(m)){var c=t(a,e,this,n);if(c.done)return c.value}var b=i(e),g=String(this),h="function"===typeof n;h||(n=String(n));var O=b.global;if(O){var j=b.unicode;b.lastIndex=0}var y=[];while(1){var S=u(b,g);if(null===S)break;if(y.push(S),!O)break;var z=String(S[0]);""===z&&(b.lastIndex=s(g,o(b.lastIndex),j))}for(var E="",x=0,w=0;w<y.length;w++){S=y[w];for(var A=String(S[0]),P=d(v(r(S.index),g.length),0),k=[],$=1;$<S.length;$++)k.push(p(S[$]));var C=S.groups;if(h){var T=[A].concat(k,P,g);void 0!==C&&T.push(C);var L=String(n.apply(void 0,T))}else L=l(A,g,P,k,C,n);P>=x&&(E+=g.slice(x,P)+L,x=P+A.length)}return E+g.slice(x)}]}))},a15b:function(e,a,t){"use strict";var n=t("23e7"),i=t("44ad"),o=t("fc6a"),r=t("a640"),c=[].join,s=i!=Object,l=r("join",",");n({target:"Array",proto:!0,forced:s||!l},{join:function(e){return c.call(o(this),void 0===e?",":e)}})}}]);
//# sourceMappingURL=chunk-02bb66b0.f6b19ba8.js.map
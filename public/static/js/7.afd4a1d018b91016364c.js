webpackJsonp([7],{a42I:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Xxa5"),s=n.n(a),i=n("exGp"),o=n.n(i),r=n("Dd8w"),v=n.n(r),c=n("NYxO"),d={data:function(){return{eventSeCode:"002",eventTyCode:"001",eventDetailTyCode:"",eventDetailTyNm:"",orderUpdateList:[],eventList:null,eventDetailTyCodeHead:"A",eventTyCodeList:[{code:"001",name:"정지",group:"SCAN","002":"A","003":"D"},{code:"002",name:"역주행",group:"SCAN","002":"B","003":"E"},{code:"003",name:"보행자",group:"SCAN","002":"C","003":"F"},{code:"004",name:"CCTV",group:"ENV","004":"G"},{code:"005",name:"환경",group:"ENV","004":"H"},{code:"006",name:"도로상황",group:"ENV","004":"I"}]}},computed:{getEventTyCodeList:function(){var e=[];for(var t in this.eventTyCodeList){var n=this.eventTyCodeList[t];"004"==this.eventSeCode?"ENV"==n.group&&e.push(n):"SCAN"==n.group&&e.push(n)}return e}},methods:v()({},Object(c.b)("setting",["saveEventCodes","getEventCodes","setEventCodeOrderMod","delEventCode"]),{moveTab:function(e){this.$router.push({name:e})},changeeventSeCode:function(e){this.eventSeCode=e,this.eventList=null,this.eventDetailTyCodeHead="002"==e?"A":"003"==e?"D":"G",this.fnSearch()},changeEventTyCode:function(e){var t=$("#eventTyCode option:selected").attr("type");this.eventDetailTyCodeHead=t,this.fnSearch(this.eventTyCode)},clearForm:function(e){this.isNull(e)?"004"==this.eventSeCode?this.eventTyCode="004":this.eventTyCode="001":this.eventTyCode=e,this.eventDetailTyCode="",this.eventDetailTyNm=""},isNull:function(e){return void 0==e||""==e||null==e},fnVali:function(){return this.isNull(this.eventDetailTyNm)?(this.$info("세부유형명을 입력해주세요"),!1):this.isNull(this.eventDetailTyCode)?(this.$info("코드을 입력해주세요"),!1):!(this.eventDetailTyCode.length<2)||(this.$info("2자리의 코드로 입력해주세요"),!1)},getEventTyCodeName:function(e){var t="",n=this.getEventTyCodeList;for(var a in n){var s=n[a];if(s.code==e){t=s.name;break}}return t},fnSave:function(){var e=this;return o()(s.a.mark(function t(){var n,a,i,o;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(0!=e.fnVali()){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,e.$confirm("저장 하시겠습니까?");case 4:if(!t.sent){t.next=12;break}return n=e.eventDetailTyCodeHead+e.eventDetailTyCode,a={eventSeCode:e.eventSeCode,eventTyCode:e.eventTyCode,eventDetailTyCode:n,eventDetailTyNm:e.eventDetailTyNm},t.next=10,e.saveEventCodes(a);case 10:200==(i=t.sent).status?e.isNull(i.data.errType)?(e.$info("저장 되었습니다.","확인"),e.fnSearch(e.eventTyCode)):e.$info(i.data.message):(o=i.data,e.$info(o.message));case 12:case"end":return t.stop()}},t,e)}))()},fnSearch:function(e){var t=this;return o()(s.a.mark(function n(){var a,i,o;return s.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return t.clearForm(e),a={eventSeCode:t.eventSeCode,eventTyCode:t.eventTyCode},n.next=4,t.getEventCodes(a);case 4:i=n.sent,o=i.data,t.eventList=o;case 7:case"end":return n.stop()}},n,t)}))()},moveCoderOrdr:function(e,t){var n=this;return o()(s.a.mark(function a(){var i;return s.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(e.codeOrdr!=n.eventList.length||"down"!=t){a.next=2;break}return a.abrupt("return");case 2:if(1!=e.codeOrdr||"up"!=t){a.next=4;break}return a.abrupt("return");case 4:return i={eventSeCode:e.eventSeCode,eventTyCode:e.eventTyCode,eventDetailTyCode:e.eventDetailTyCode,codeOrdr:e.codeOrdr,modeType:t},a.next=7,n.setEventCodeOrderMod(i);case 7:a.sent,n.fnSearch(e.eventTyCode);case 9:case"end":return a.stop()}},a,n)}))()},fnDelete:function(e){var t=this;return o()(s.a.mark(function n(){var a;return s.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t.$confirm("해당 세부유형을 삭제시 문제가 될 수 있습니다. \n정말 삭제하시겠습니까?");case 2:if(!n.sent){n.next=9;break}return a={eventSeCode:e.eventSeCode,eventTyCode:e.eventTyCode,eventDetailTyCode:e.eventDetailTyCode,codeOrdr:e.codeOrdr},n.next=7,t.delEventCode(a);case 7:200==n.sent.status&&(t.$info("해당 세부유형이 삭제되었습니다."),t.fnSearch(t.eventTyCode));case 9:case"end":return n.stop()}},n,t)}))()}}),mounted:function(){$(".fixed_table_box .table_bd").mCustomScrollbar({theme:"minimal-dark"}),this.fnSearch()},watch:{eventDetailTyCode:function(e){null!==/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/.exec(e)&&(this.eventDetailTyCode=e.replace(/[^0-9]/g,"")),isNaN(parseFloat(e))&&(this.eventDetailTyCode="")}}},l={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container setting"},[n("div",{staticClass:"inner"},[n("div",{staticClass:"tab_box type-a"},[n("ul",[n("li",{staticClass:"tab_item",on:{click:function(t){return e.moveTab("timeSet")}}},[n("span",[e._v("야간시간대 설정")])]),e._v(" "),n("li",{staticClass:"tab_item active",on:{click:function(t){return e.moveTab("eventSet")}}},[n("span",[e._v("이벤트 항목 설정")])])])]),e._v(" "),n("div",{staticClass:"content_box left"},[n("div",{staticClass:"tab_box type-b"},[n("ul",[n("li",{staticClass:"tab_item",class:"002"==e.eventSeCode?"active":"",on:{click:function(t){return e.changeeventSeCode("002")}}},[n("span",[e._v("점검지")])]),e._v(" "),n("li",{staticClass:"tab_item",class:"003"==e.eventSeCode?"active":"",on:{click:function(t){return e.changeeventSeCode("003")}}},[n("span",[e._v("오검지")])]),e._v(" "),n("li",{staticClass:"tab_item",class:"004"==e.eventSeCode?"active":"",on:{click:function(t){return e.changeeventSeCode("004")}}},[n("span",[e._v("환경요소")])])])]),e._v(" "),n("div",{staticClass:"tab_cont_box"},[n("div",{staticClass:"tab_cont_item"},[n("span",{staticClass:"tab_item_tit"},[e._v("유형")]),e._v(" "),n("div",{staticClass:"input_box"},[n("select",{directives:[{name:"model",rawName:"v-model",value:e.eventTyCode,expression:"eventTyCode"}],ref:"eventTyCode",staticClass:"select",attrs:{id:"eventTyCode"},on:{change:[function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.eventTyCode=t.target.multiple?n:n[0]},e.changeEventTyCode]}},[e._l(e.getEventTyCodeList,function(t,a){return[n("option",{key:"ty"+a,attrs:{type:t[e.eventSeCode]},domProps:{value:t.code}},[e._v(e._s(t.name))])]})],2)])]),e._v(" "),n("div",{staticClass:"tab_cont_item"},[n("span",{staticClass:"tab_item_tit"},[e._v("세부유형명")]),e._v(" "),n("div",{staticClass:"input_box"},[e._v("+\n                            "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.eventDetailTyNm,expression:"eventDetailTyNm"}],ref:"eventDetailTyNm",staticClass:"input_txt",attrs:{type:"text",id:"eventDetailTyNm"},domProps:{value:e.eventDetailTyNm},on:{input:function(t){t.target.composing||(e.eventDetailTyNm=t.target.value)}}})])]),e._v(" "),n("div",{staticClass:"tab_cont_item"},[n("span",{staticClass:"tab_item_tit"},[e._v("코드")]),e._v(" "),n("div",{staticClass:"input_box"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.eventDetailTyCode,expression:"eventDetailTyCode"}],ref:"eventDetailTyCode",staticClass:"input_txt",attrs:{type:"text",placeholder:"2자리의 코드를 숫자로 입력하세요 00~99",id:"eventDetailTyCode",maxlength:"2"},domProps:{value:e.eventDetailTyCode},on:{input:function(t){t.target.composing||(e.eventDetailTyCode=t.target.value)}}})])])]),e._v(" "),n("div",{staticClass:"input_box txt_c"},[n("button",{staticClass:"btn btn_smd btn_primary",attrs:{id:"saveBtn"},on:{click:e.fnSave}},[e._v("조건 저장")])])]),e._v(" "),n("div",{staticClass:"content_box right"},[n("div",{staticClass:"fixed_table_box"},[e._m(0),e._v(" "),n("div",{staticClass:"table_bd scroll_box"},[n("table",[e._m(1),e._v(" "),e.eventList?n("tbody",[e.eventList.length>0?e._l(e.eventList,function(t,a){return n("tr",{key:a},[n("td",[n("span",[e._v(e._s(t.rnum))])]),e._v(" "),n("td",[n("span",{staticClass:"float_l pl5 pt5"},[e._v("\n                                                "+e._s(e.getEventTyCodeName(t.eventTyCode))+" /  "+e._s(t.eventDetailTyNm)+"("+e._s(t.eventDetailTyCode)+")\n                                            ")]),e._v(" "),n("div",{staticClass:"input_box float_r"},[n("button",{staticClass:"btn btn_secondary btn_sm",on:{click:function(n){return e.fnDelete(t)}}},[e._v("삭제")])]),e._v(" "),n("div",{staticClass:"input_box float_r mr5"},[n("button",{staticClass:"btn btn_secondary w40",attrs:{id:"downBtn"},on:{click:function(n){return e.moveCoderOrdr(t,"down")}}},[e._v("\n                                                 ↓\n                                                ")])]),e._v(" "),n("div",{staticClass:"input_box float_r mr5"},[n("button",{staticClass:"btn btn_secondary w40",attrs:{id:"upbtn"},on:{click:function(n){return e.moveCoderOrdr(t,"up")}}},[e._v("↑")])])])])}):e._e(),e._v(" "),0==e.eventList.length?n("tr",[e._m(2)]):e._e()],2):e._e()])])])])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"table_hd"},[t("table",[t("colgroup",[t("col",{staticClass:"w10p"}),this._v(" "),t("col",{staticClass:"w90p"})]),this._v(" "),t("tbody",[t("tr",[t("td",[t("span",[this._v("번호")])]),this._v(" "),t("td",[t("span",[this._v("항목명")])])])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("colgroup",[t("col",{staticClass:"w10p"}),this._v(" "),t("col",{staticClass:"w90p"})])},function(){var e=this.$createElement,t=this._self._c||e;return t("td",{attrs:{colspan:"2"}},[t("span",[this._v("조건에 부합하는 데이터가 존재하지 않습니다.")])])}]},u=n("VU/8")(d,l,!1,null,null,null);t.default=u.exports}});
//# sourceMappingURL=7.afd4a1d018b91016364c.js.map
<template lang="pug">
div
  //- svg(:viewBox='"0,0," + width + "," + height', ref='chartRef')
  canvas(width='1000', height='500')
  svg(width='1000', height='500', ref='chartRef')

  ul.list
  // 加上 - 后不会进行输出
  - let firends = 10
  case firends 
    when 0
      p 您没有朋友
    when 1
      p 您有一个朋友
    default
      p 您有 #{ firends } 个朋友

  - let user = { des: "foo bar baz" }
  - let auth = false
  #user
    if user.des
      h2.green 描述
      p.des= user.des
      .des.
        这里是一段描述。

  ul
    li 这里是二段描述。
      |
    li 这里是三段描述。

  | 这里是描述文字……
  br
  button.btn 提交
  p
    | 这是一个很长很长而且还很无聊的段落，还没有结束，是的，非常非常地长。突然出现了一个 #[strong 充满力量感的单词]，这确实让人难以 #[em 忽视]。
  p.
    这是一个很长很长而且还很无聊的段落，还没有结束，是的，非常非常地长。突然出现了一个 #[strong 充满力量感的单词]，这确实让人难以 #[em 忽视]。

  ul
    li(v-for='item in list', :key='item.k', :data='item.tit') {{ item.tit }}

  ul
  - let list = "list"
  each item in list 
    li= item
</template>

<script>
import * as d3 from 'd3'
export default {
  data () {
    return {
      width: 375,
      height: 200,
      list: [
        { tit: '1111', k: '1' },
        { tit: '2222', k: '2' },
        { tit: '3333', k: '3' },
        { tit: '4444', k: '4' },
      ],
      data: {
        nodes: [
          { name: 'A人物' },
          { name: 'B人物' },
          { name: 'C人物' },
          { name: 'D人物' },
          { name: 'E人物' },
          { name: 'F人物' },
          { name: 'G人物' },
          { name: 'H人物' },
          { name: 'I人物' },
          { name: 'J人物' },
          { name: 'K人物' },
          { name: 'L人物' },
          { name: 'M人物' },
        ],
        // value越小关系越近
        edges: [
          { source: 0, target: 1, relation: '朋友', value: 3 },
          { source: 0, target: 2, relation: '朋友', value: 3 },
          { source: 0, target: 3, relation: '朋友', value: 6 },
          { source: 1, target: 2, relation: '朋友', value: 6 },
          { source: 1, target: 3, relation: '朋友', value: 7 },
          { source: 2, target: 3, relation: '朋友', value: 7 },
          { source: 0, target: 4, relation: '朋友', value: 3 },
          { source: 0, target: 5, relation: '朋友', value: 3 },
          { source: 4, target: 5, relation: '夫妻', value: 1 },
          { source: 0, target: 6, relation: '兄弟', value: 2 },
          { source: 4, target: 6, relation: '同学', value: 3 },
          { source: 5, target: 6, relation: '同学', value: 3 },
          { source: 4, target: 7, relation: '同学', value: 4 },
          { source: 5, target: 7, relation: '同学', value: 3 },
          { source: 6, target: 7, relation: '同学', value: 3 },
          { source: 4, target: 8, relation: '师生', value: 4 },
          { source: 5, target: 8, relation: '师生', value: 5 },
          { source: 6, target: 8, relation: '师生', value: 3 },
          { source: 7, target: 8, relation: '师生', value: 5 },
          { source: 8, target: 9, relation: '师生', value: 4 },
          { source: 3, target: 9, relation: '师生', value: 5 },
          { source: 2, target: 10, relation: '母子', value: 1 },
          { source: 10, target: 11, relation: '雇佣', value: 6 },
          { source: 10, target: 12, relation: '雇佣', value: 6 },
          { source: 11, target: 12, relation: '同事', value: 7 },
        ],
      },
      graph: {
        "nodes": [
          { "id": "Myriel", "group": 1 },
          { "id": "Napoleon", "group": 1 },
          { "id": "Mlle.Baptistine", "group": 1 },
          { "id": "Mme.Magloire", "group": 1 },
          { "id": "CountessdeLo", "group": 1 },
          { "id": "Geborand", "group": 1 },
          { "id": "Champtercier", "group": 1 },
          { "id": "Cravatte", "group": 1 },
          { "id": "Count", "group": 1 },
          { "id": "OldMan", "group": 1 },
          { "id": "Labarre", "group": 2 },
          { "id": "Valjean", "group": 2 },
          { "id": "Marguerite", "group": 3 },
          { "id": "Mme.deR", "group": 2 },
          { "id": "Isabeau", "group": 2 },
          { "id": "Gervais", "group": 2 },
          { "id": "Tholomyes", "group": 3 },
          { "id": "Listolier", "group": 3 },
          { "id": "Fameuil", "group": 3 },
          { "id": "Blacheville", "group": 3 },
          { "id": "Favourite", "group": 3 },
          { "id": "Dahlia", "group": 3 },
          { "id": "Zephine", "group": 3 },
          { "id": "Fantine", "group": 3 },
          { "id": "Mme.Thenardier", "group": 4 },
          { "id": "Thenardier", "group": 4 },
          { "id": "Cosette", "group": 5 },
          { "id": "Javert", "group": 4 },
          { "id": "Fauchelevent", "group": 0 },
          { "id": "Bamatabois", "group": 2 },
          { "id": "Perpetue", "group": 3 },
          { "id": "Simplice", "group": 2 },
          { "id": "Scaufflaire", "group": 2 },
          { "id": "Woman1", "group": 2 },
          { "id": "Judge", "group": 2 },
          { "id": "Champmathieu", "group": 2 },
          { "id": "Brevet", "group": 2 },
          { "id": "Chenildieu", "group": 2 },
          { "id": "Cochepaille", "group": 2 },
          { "id": "Pontmercy", "group": 4 },
          { "id": "Boulatruelle", "group": 6 },
          { "id": "Eponine", "group": 4 },
          { "id": "Anzelma", "group": 4 },
          { "id": "Woman2", "group": 5 },
          { "id": "MotherInnocent", "group": 0 },
          { "id": "Gribier", "group": 0 },
          { "id": "Jondrette", "group": 7 },
          { "id": "Mme.Burgon", "group": 7 },
          { "id": "Gavroche", "group": 8 },
          { "id": "Gillenormand", "group": 5 },
          { "id": "Magnon", "group": 5 },
          { "id": "Mlle.Gillenormand", "group": 5 },
          { "id": "Mme.Pontmercy", "group": 5 },
          { "id": "Mlle.Vaubois", "group": 5 },
          { "id": "Lt.Gillenormand", "group": 5 },
          { "id": "Marius", "group": 8 },
          { "id": "BaronessT", "group": 5 },
          { "id": "Mabeuf", "group": 8 },
          { "id": "Enjolras", "group": 8 },
          { "id": "Combeferre", "group": 8 },
          { "id": "Prouvaire", "group": 8 },
          { "id": "Feuilly", "group": 8 },
          { "id": "Courfeyrac", "group": 8 },
          { "id": "Bahorel", "group": 8 },
          { "id": "Bossuet", "group": 8 },
          { "id": "Joly", "group": 8 },
          { "id": "Grantaire", "group": 8 },
          { "id": "MotherPlutarch", "group": 9 },
          { "id": "Gueulemer", "group": 4 },
          { "id": "Babet", "group": 4 },
          { "id": "Claquesous", "group": 4 },
          { "id": "Montparnasse", "group": 4 },
          { "id": "Toussaint", "group": 5 },
          { "id": "Child1", "group": 10 },
          { "id": "Child2", "group": 10 },
          { "id": "Brujon", "group": 4 },
          { "id": "Mme.Hucheloup", "group": 8 }
        ],
        "links": [
          { "source": "Napoleon", "target": "Myriel", "value": 1 },
          { "source": "Mlle.Baptistine", "target": "Myriel", "value": 8 },
          { "source": "Mme.Magloire", "target": "Myriel", "value": 10 },
          { "source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6 },
          { "source": "CountessdeLo", "target": "Myriel", "value": 1 },
          { "source": "Geborand", "target": "Myriel", "value": 1 },
          { "source": "Champtercier", "target": "Myriel", "value": 1 },
          { "source": "Cravatte", "target": "Myriel", "value": 1 },
          { "source": "Count", "target": "Myriel", "value": 2 },
          { "source": "OldMan", "target": "Myriel", "value": 1 },
          { "source": "Valjean", "target": "Labarre", "value": 1 },
          { "source": "Valjean", "target": "Mme.Magloire", "value": 3 },
          { "source": "Valjean", "target": "Mlle.Baptistine", "value": 3 },
          { "source": "Valjean", "target": "Myriel", "value": 5 },
          { "source": "Marguerite", "target": "Valjean", "value": 1 },
          { "source": "Mme.deR", "target": "Valjean", "value": 1 },
          { "source": "Isabeau", "target": "Valjean", "value": 1 },
          { "source": "Gervais", "target": "Valjean", "value": 1 },
          { "source": "Listolier", "target": "Tholomyes", "value": 4 },
          { "source": "Fameuil", "target": "Tholomyes", "value": 4 },
          { "source": "Fameuil", "target": "Listolier", "value": 4 },
          { "source": "Blacheville", "target": "Tholomyes", "value": 4 },
          { "source": "Blacheville", "target": "Listolier", "value": 4 },
          { "source": "Blacheville", "target": "Fameuil", "value": 4 },
          { "source": "Favourite", "target": "Tholomyes", "value": 3 },
          { "source": "Favourite", "target": "Listolier", "value": 3 },
          { "source": "Favourite", "target": "Fameuil", "value": 3 },
          { "source": "Favourite", "target": "Blacheville", "value": 4 },
          { "source": "Dahlia", "target": "Tholomyes", "value": 3 },
          { "source": "Dahlia", "target": "Listolier", "value": 3 },
          { "source": "Dahlia", "target": "Fameuil", "value": 3 },
          { "source": "Dahlia", "target": "Blacheville", "value": 3 },
          { "source": "Dahlia", "target": "Favourite", "value": 5 },
          { "source": "Zephine", "target": "Tholomyes", "value": 3 },
          { "source": "Zephine", "target": "Listolier", "value": 3 },
          { "source": "Zephine", "target": "Fameuil", "value": 3 },
          { "source": "Zephine", "target": "Blacheville", "value": 3 },
          { "source": "Zephine", "target": "Favourite", "value": 4 },
          { "source": "Zephine", "target": "Dahlia", "value": 4 },
          { "source": "Fantine", "target": "Tholomyes", "value": 3 },
          { "source": "Fantine", "target": "Listolier", "value": 3 },
          { "source": "Fantine", "target": "Fameuil", "value": 3 },
          { "source": "Fantine", "target": "Blacheville", "value": 3 },
          { "source": "Fantine", "target": "Favourite", "value": 4 },
          { "source": "Fantine", "target": "Dahlia", "value": 4 },
          { "source": "Fantine", "target": "Zephine", "value": 4 },
          { "source": "Fantine", "target": "Marguerite", "value": 2 },
          { "source": "Fantine", "target": "Valjean", "value": 9 },
          { "source": "Mme.Thenardier", "target": "Fantine", "value": 2 },
          { "source": "Mme.Thenardier", "target": "Valjean", "value": 7 },
          { "source": "Thenardier", "target": "Mme.Thenardier", "value": 13 },
          { "source": "Thenardier", "target": "Fantine", "value": 1 },
          { "source": "Thenardier", "target": "Valjean", "value": 12 },
          { "source": "Cosette", "target": "Mme.Thenardier", "value": 4 },
          { "source": "Cosette", "target": "Valjean", "value": 31 },
          { "source": "Cosette", "target": "Tholomyes", "value": 1 },
          { "source": "Cosette", "target": "Thenardier", "value": 1 },
          { "source": "Javert", "target": "Valjean", "value": 17 },
          { "source": "Javert", "target": "Fantine", "value": 5 },
          { "source": "Javert", "target": "Thenardier", "value": 5 },
          { "source": "Javert", "target": "Mme.Thenardier", "value": 1 },
          { "source": "Javert", "target": "Cosette", "value": 1 },
          { "source": "Fauchelevent", "target": "Valjean", "value": 8 },
          { "source": "Fauchelevent", "target": "Javert", "value": 1 },
          { "source": "Bamatabois", "target": "Fantine", "value": 1 },
          { "source": "Bamatabois", "target": "Javert", "value": 1 },
          { "source": "Bamatabois", "target": "Valjean", "value": 2 },
          { "source": "Perpetue", "target": "Fantine", "value": 1 },
          { "source": "Simplice", "target": "Perpetue", "value": 2 },
          { "source": "Simplice", "target": "Valjean", "value": 3 },
          { "source": "Simplice", "target": "Fantine", "value": 2 },
          { "source": "Simplice", "target": "Javert", "value": 1 },
          { "source": "Scaufflaire", "target": "Valjean", "value": 1 },
          { "source": "Woman1", "target": "Valjean", "value": 2 },
          { "source": "Woman1", "target": "Javert", "value": 1 },
          { "source": "Judge", "target": "Valjean", "value": 3 },
          { "source": "Judge", "target": "Bamatabois", "value": 2 },
          { "source": "Champmathieu", "target": "Valjean", "value": 3 },
          { "source": "Champmathieu", "target": "Judge", "value": 3 },
          { "source": "Champmathieu", "target": "Bamatabois", "value": 2 },
          { "source": "Brevet", "target": "Judge", "value": 2 },
          { "source": "Brevet", "target": "Champmathieu", "value": 2 },
          { "source": "Brevet", "target": "Valjean", "value": 2 },
          { "source": "Brevet", "target": "Bamatabois", "value": 1 },
          { "source": "Chenildieu", "target": "Judge", "value": 2 },
          { "source": "Chenildieu", "target": "Champmathieu", "value": 2 },
          { "source": "Chenildieu", "target": "Brevet", "value": 2 },
          { "source": "Chenildieu", "target": "Valjean", "value": 2 },
          { "source": "Chenildieu", "target": "Bamatabois", "value": 1 },
          { "source": "Cochepaille", "target": "Judge", "value": 2 },
          { "source": "Cochepaille", "target": "Champmathieu", "value": 2 },
          { "source": "Cochepaille", "target": "Brevet", "value": 2 },
          { "source": "Cochepaille", "target": "Chenildieu", "value": 2 },
          { "source": "Cochepaille", "target": "Valjean", "value": 2 },
          { "source": "Cochepaille", "target": "Bamatabois", "value": 1 },
          { "source": "Pontmercy", "target": "Thenardier", "value": 1 },
          { "source": "Boulatruelle", "target": "Thenardier", "value": 1 },
          { "source": "Eponine", "target": "Mme.Thenardier", "value": 2 },
          { "source": "Eponine", "target": "Thenardier", "value": 3 },
          { "source": "Anzelma", "target": "Eponine", "value": 2 },
          { "source": "Anzelma", "target": "Thenardier", "value": 2 },
          { "source": "Anzelma", "target": "Mme.Thenardier", "value": 1 },
          { "source": "Woman2", "target": "Valjean", "value": 3 },
          { "source": "Woman2", "target": "Cosette", "value": 1 },
          { "source": "Woman2", "target": "Javert", "value": 1 },
          { "source": "MotherInnocent", "target": "Fauchelevent", "value": 3 },
          { "source": "MotherInnocent", "target": "Valjean", "value": 1 },
          { "source": "Gribier", "target": "Fauchelevent", "value": 2 },
          { "source": "Mme.Burgon", "target": "Jondrette", "value": 1 },
          { "source": "Gavroche", "target": "Mme.Burgon", "value": 2 },
          { "source": "Gavroche", "target": "Thenardier", "value": 1 },
          { "source": "Gavroche", "target": "Javert", "value": 1 },
          { "source": "Gavroche", "target": "Valjean", "value": 1 },
          { "source": "Gillenormand", "target": "Cosette", "value": 3 },
          { "source": "Gillenormand", "target": "Valjean", "value": 2 },
          { "source": "Magnon", "target": "Gillenormand", "value": 1 },
          { "source": "Magnon", "target": "Mme.Thenardier", "value": 1 },
          { "source": "Mlle.Gillenormand", "target": "Gillenormand", "value": 9 },
          { "source": "Mlle.Gillenormand", "target": "Cosette", "value": 2 },
          { "source": "Mlle.Gillenormand", "target": "Valjean", "value": 2 },
          { "source": "Mme.Pontmercy", "target": "Mlle.Gillenormand", "value": 1 },
          { "source": "Mme.Pontmercy", "target": "Pontmercy", "value": 1 },
          { "source": "Mlle.Vaubois", "target": "Mlle.Gillenormand", "value": 1 },
          { "source": "Lt.Gillenormand", "target": "Mlle.Gillenormand", "value": 2 },
          { "source": "Lt.Gillenormand", "target": "Gillenormand", "value": 1 },
          { "source": "Lt.Gillenormand", "target": "Cosette", "value": 1 },
          { "source": "Marius", "target": "Mlle.Gillenormand", "value": 6 },
          { "source": "Marius", "target": "Gillenormand", "value": 12 },
          { "source": "Marius", "target": "Pontmercy", "value": 1 },
          { "source": "Marius", "target": "Lt.Gillenormand", "value": 1 },
          { "source": "Marius", "target": "Cosette", "value": 21 },
          { "source": "Marius", "target": "Valjean", "value": 19 },
          { "source": "Marius", "target": "Tholomyes", "value": 1 },
          { "source": "Marius", "target": "Thenardier", "value": 2 },
          { "source": "Marius", "target": "Eponine", "value": 5 },
          { "source": "Marius", "target": "Gavroche", "value": 4 },
          { "source": "BaronessT", "target": "Gillenormand", "value": 1 },
          { "source": "BaronessT", "target": "Marius", "value": 1 },
          { "source": "Mabeuf", "target": "Marius", "value": 1 },
          { "source": "Mabeuf", "target": "Eponine", "value": 1 },
          { "source": "Mabeuf", "target": "Gavroche", "value": 1 },
          { "source": "Enjolras", "target": "Marius", "value": 7 },
          { "source": "Enjolras", "target": "Gavroche", "value": 7 },
          { "source": "Enjolras", "target": "Javert", "value": 6 },
          { "source": "Enjolras", "target": "Mabeuf", "value": 1 },
          { "source": "Enjolras", "target": "Valjean", "value": 4 },
          { "source": "Combeferre", "target": "Enjolras", "value": 15 },
          { "source": "Combeferre", "target": "Marius", "value": 5 },
          { "source": "Combeferre", "target": "Gavroche", "value": 6 },
          { "source": "Combeferre", "target": "Mabeuf", "value": 2 },
          { "source": "Prouvaire", "target": "Gavroche", "value": 1 },
          { "source": "Prouvaire", "target": "Enjolras", "value": 4 },
          { "source": "Prouvaire", "target": "Combeferre", "value": 2 },
          { "source": "Feuilly", "target": "Gavroche", "value": 2 },
          { "source": "Feuilly", "target": "Enjolras", "value": 6 },
          { "source": "Feuilly", "target": "Prouvaire", "value": 2 },
          { "source": "Feuilly", "target": "Combeferre", "value": 5 },
          { "source": "Feuilly", "target": "Mabeuf", "value": 1 },
          { "source": "Feuilly", "target": "Marius", "value": 1 },
          { "source": "Courfeyrac", "target": "Marius", "value": 9 },
          { "source": "Courfeyrac", "target": "Enjolras", "value": 17 },
          { "source": "Courfeyrac", "target": "Combeferre", "value": 13 },
          { "source": "Courfeyrac", "target": "Gavroche", "value": 7 },
          { "source": "Courfeyrac", "target": "Mabeuf", "value": 2 },
          { "source": "Courfeyrac", "target": "Eponine", "value": 1 },
          { "source": "Courfeyrac", "target": "Feuilly", "value": 6 },
          { "source": "Courfeyrac", "target": "Prouvaire", "value": 3 },
          { "source": "Bahorel", "target": "Combeferre", "value": 5 },
          { "source": "Bahorel", "target": "Gavroche", "value": 5 },
          { "source": "Bahorel", "target": "Courfeyrac", "value": 6 },
          { "source": "Bahorel", "target": "Mabeuf", "value": 2 },
          { "source": "Bahorel", "target": "Enjolras", "value": 4 },
          { "source": "Bahorel", "target": "Feuilly", "value": 3 },
          { "source": "Bahorel", "target": "Prouvaire", "value": 2 },
          { "source": "Bahorel", "target": "Marius", "value": 1 },
          { "source": "Bossuet", "target": "Marius", "value": 5 },
          { "source": "Bossuet", "target": "Courfeyrac", "value": 12 },
          { "source": "Bossuet", "target": "Gavroche", "value": 5 },
          { "source": "Bossuet", "target": "Bahorel", "value": 4 },
          { "source": "Bossuet", "target": "Enjolras", "value": 10 },
          { "source": "Bossuet", "target": "Feuilly", "value": 6 },
          { "source": "Bossuet", "target": "Prouvaire", "value": 2 },
          { "source": "Bossuet", "target": "Combeferre", "value": 9 },
          { "source": "Bossuet", "target": "Mabeuf", "value": 1 },
          { "source": "Bossuet", "target": "Valjean", "value": 1 },
          { "source": "Joly", "target": "Bahorel", "value": 5 },
          { "source": "Joly", "target": "Bossuet", "value": 7 },
          { "source": "Joly", "target": "Gavroche", "value": 3 },
          { "source": "Joly", "target": "Courfeyrac", "value": 5 },
          { "source": "Joly", "target": "Enjolras", "value": 5 },
          { "source": "Joly", "target": "Feuilly", "value": 5 },
          { "source": "Joly", "target": "Prouvaire", "value": 2 },
          { "source": "Joly", "target": "Combeferre", "value": 5 },
          { "source": "Joly", "target": "Mabeuf", "value": 1 },
          { "source": "Joly", "target": "Marius", "value": 2 },
          { "source": "Grantaire", "target": "Bossuet", "value": 3 },
          { "source": "Grantaire", "target": "Enjolras", "value": 3 },
          { "source": "Grantaire", "target": "Combeferre", "value": 1 },
          { "source": "Grantaire", "target": "Courfeyrac", "value": 2 },
          { "source": "Grantaire", "target": "Joly", "value": 2 },
          { "source": "Grantaire", "target": "Gavroche", "value": 1 },
          { "source": "Grantaire", "target": "Bahorel", "value": 1 },
          { "source": "Grantaire", "target": "Feuilly", "value": 1 },
          { "source": "Grantaire", "target": "Prouvaire", "value": 1 },
          { "source": "MotherPlutarch", "target": "Mabeuf", "value": 3 },
          { "source": "Gueulemer", "target": "Thenardier", "value": 5 },
          { "source": "Gueulemer", "target": "Valjean", "value": 1 },
          { "source": "Gueulemer", "target": "Mme.Thenardier", "value": 1 },
          { "source": "Gueulemer", "target": "Javert", "value": 1 },
          { "source": "Gueulemer", "target": "Gavroche", "value": 1 },
          { "source": "Gueulemer", "target": "Eponine", "value": 1 },
          { "source": "Babet", "target": "Thenardier", "value": 6 },
          { "source": "Babet", "target": "Gueulemer", "value": 6 },
          { "source": "Babet", "target": "Valjean", "value": 1 },
          { "source": "Babet", "target": "Mme.Thenardier", "value": 1 },
          { "source": "Babet", "target": "Javert", "value": 2 },
          { "source": "Babet", "target": "Gavroche", "value": 1 },
          { "source": "Babet", "target": "Eponine", "value": 1 },
          { "source": "Claquesous", "target": "Thenardier", "value": 4 },
          { "source": "Claquesous", "target": "Babet", "value": 4 },
          { "source": "Claquesous", "target": "Gueulemer", "value": 4 },
          { "source": "Claquesous", "target": "Valjean", "value": 1 },
          { "source": "Claquesous", "target": "Mme.Thenardier", "value": 1 },
          { "source": "Claquesous", "target": "Javert", "value": 1 },
          { "source": "Claquesous", "target": "Eponine", "value": 1 },
          { "source": "Claquesous", "target": "Enjolras", "value": 1 },
          { "source": "Montparnasse", "target": "Javert", "value": 1 },
          { "source": "Montparnasse", "target": "Babet", "value": 2 },
          { "source": "Montparnasse", "target": "Gueulemer", "value": 2 },
          { "source": "Montparnasse", "target": "Claquesous", "value": 2 },
          { "source": "Montparnasse", "target": "Valjean", "value": 1 },
          { "source": "Montparnasse", "target": "Gavroche", "value": 1 },
          { "source": "Montparnasse", "target": "Eponine", "value": 1 },
          { "source": "Montparnasse", "target": "Thenardier", "value": 1 },
          { "source": "Toussaint", "target": "Cosette", "value": 2 },
          { "source": "Toussaint", "target": "Javert", "value": 1 },
          { "source": "Toussaint", "target": "Valjean", "value": 1 },
          { "source": "Child1", "target": "Gavroche", "value": 2 },
          { "source": "Child2", "target": "Gavroche", "value": 2 },
          { "source": "Child2", "target": "Child1", "value": 3 },
          { "source": "Brujon", "target": "Babet", "value": 3 },
          { "source": "Brujon", "target": "Gueulemer", "value": 3 },
          { "source": "Brujon", "target": "Thenardier", "value": 3 },
          { "source": "Brujon", "target": "Gavroche", "value": 1 },
          { "source": "Brujon", "target": "Eponine", "value": 1 },
          { "source": "Brujon", "target": "Claquesous", "value": 1 },
          { "source": "Brujon", "target": "Montparnasse", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Bossuet", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Joly", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Grantaire", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Bahorel", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Courfeyrac", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Gavroche", "value": 1 },
          { "source": "Mme.Hucheloup", "target": "Enjolras", "value": 1 }
        ]
      }
    }
  },
  mounted () {
    this.force()
    this.draw()
  },
  methods: {
    draw () {
      const chart = d3.select(this.$refs.chartRef)
      const g = chart.append('g').attr('transform', 'translate(60, 60)')
      const z = d3.scaleOrdinal([...d3.schemeCategory10, ...d3.schemeAccent, ...d3.schemePaired,]) // 等价： d3.scaleOrdinal().range(d3.schemeCategory10)

      // d3.forceSimulation(nodes) 使用指定nodes，建立一个没有力模型forces的仿真，如果没有nodes，则默认为空数组
      // nodes: 每个node都是一个对象类型。{index, x, y, vx, vy}
      // index节点在nodes中的索引； x、y： 节点当前的坐标；vx、vy节点在x/y方向的速度
      const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id((d, i) => i).distance(d => d.value * 50)) // link froce(弹簧模型) 可以根据 link distance 将有关联的两个节点拉近或者推远。力的强度与被链接两个节点的距离成比例，类似弹簧力。
        .force('center', d3.forceCenter(this.width / 2, this.height / 2)) // 向心力模型。d3.forceCenter([x, y])使用指定的 x 和 y 坐标创建一个新的向心力模型。默认为 ⟨0,0⟩。center (向心力) 可以将所有的节点的中心统一整体的向指定的位置 ⟨x,y⟩ 移动。这种力强制修改每个节点的位置，但是不会修改速度，因为修改速度会造成节点在期望的位置附近抖动。
        .force('charge', d3.forceManyBody()) // 电荷力模型

      // ① 画连接线； ② 画连接线上的文字；③ 画圆圈和文字； ④ 圆圈上使用d3.drag()

      const link = g.append('g').attr('class', 'links').selectAll('line').data(this.data.edges).enter().append('line').attr('stroke', '#999')
      const node = g.append('g').attr('class', 'nodes').selectAll('g').data(this.data.nodes).enter().append('g')
        .call(d3.drag().on('start', dragStart).on('drag', drag).on('end', dragEnd))

      node.append('circle').attr('r', 5).attr('fill', (d, i) => z(i))

      // simulation.nodes(nodes) => 初始化力导向图
      simulation.nodes(this.data.nodes).on('tick', ticked)
      simulation.force('link').links(this.data.edges)

      function ticked () {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y)
        node.attr('transform', d => `translate(${d.x},${d.y})`)
      }

      function dragStart (e, d) {

        if (e.active) {
          simulation.alphaTarget(0.3).restart()
        }
        // 如果想要一个节点固定在某一个位置，可以额外指定节点的 fx、fy两个属性
        d.fx = d.x
        d.fy = d.y
      }

      function drag (e, d) {
        d.fx = e.x
        d.fy = e.y
      }

      function dragEnd (e, d) {
        if (!e.active) {
          simulation.alphaTarget(0)
        }

        d.fx = null
        d.fy = null
      }



    },
    force () {
      var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height;

      var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      const graph = this.graph

      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph.links);

      d3.select(canvas)
        .call(d3.drag()
          .container(canvas)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      function ticked () {
        context.clearRect(0, 0, width, height);

        context.beginPath();
        graph.links.forEach(drawLink);
        context.strokeStyle = "#aaa";
        context.stroke();

        context.beginPath();
        graph.nodes.forEach(drawNode);
        context.fill();
        context.strokeStyle = "#fff";
        context.stroke();
      }

      function dragsubject (e) {
        return simulation.find(e.x, e.y);
      }


      function dragstarted (e) {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        e.subject.fx = e.subject.x;
        e.subject.fy = e.subject.y;
      }

      function dragged (e) {
        e.subject.fx = e.x;
        e.subject.fy = e.y;
      }

      function dragended (e) {
        if (!e.active) simulation.alphaTarget(0);
        e.subject.fx = null;
        e.subject.fy = null;
      }

      function drawLink (d) {
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
      }

      function drawNode (d) {
        context.moveTo(d.x + 3, d.y);
        context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
      }

    }
  },
}
</script>
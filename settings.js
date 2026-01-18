window.OSM_MAP_DEFAULT_CENTER=[24.071252388959756,120.5445053776353];
const settings = [{
default:
    [{
        style:
        [],
        script: [{
            "settings.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/settings.js?v=20260118195244"
        }],
    },
    ],
    user: [{
        style: [],
        script: [{
            "user.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/user.js?v=20260118195244"
        }],
    },
    ],
    apps: [{
        style: [],
        script: [{
            "datepicker.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/datepicker.js?v=20260118195244"
        }],
    },
    ],
    map: [{
        style: [],
        script: [{
            "map0.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/map0.js?v=20260118195244"
        },{
            "map1.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/map1.js?v=20260118195244"
        },        {
            "map.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/map.js?v=20260118195244"
        }],
    },
    ],
    stories: [{
        style: [],
        script: [{
            "stories.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/stories.js?v=20260118195244"
        }],
    },
    ],
    feed: [{
        style: [],
        script: [{
            "feed.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/feed.js?v=20260118195244"
        }],
    },
    ],
    feeds: [{
        style: [],
        script: [        {
            "1100.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/1100.js?v=20260118195244"
        },
        {
            "909090.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/909090.js?v=20260118195244"
        },
        {
            "909091.js": "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/909091.js?v=20260118195244"
        }],
    },
    ],
},
];

const toy = [
  "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/toy1.png?v=20260118195244",
  "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/toy2.png?v=20260118195244",
  "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/toy3.png?v=20260118195244",
  "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/toy4.png?v=20260118195244"
];

const TOPIC_GROUPS = [{
    id: 'life',
    name: '生活',
    color: '#f97316',
    topics: ['閒聊', '攝影', '玩耍', '飲食', '運動', '旅遊', '職涯', '興趣', '理財', '活動', '靈性']
},
{
    id: 'exam1',
    name: '一階國考',
    color: '#3b82f6',
    topics: ['生物化學', '解剖學', '胚胎學', '發育生物學', '胚胎及發育生物學', '組織學', '生理學', '微生物學', '免疫學', '微生物免疫學', '寄生蟲學', '藥理學', '病理學', '公共衛生學']
},
{
    id: 'exam2',
    name: '二階國考',
    color: '#10b981',
    topics: ['內科', '家庭醫學科', '小兒科', '皮膚科', '神經外科', '神經內科', '精神科', '外科', '外科概論', '骨科', '泌尿科', '麻醉科', '眼科', '耳鼻喉科', '婦產科', '復健科', '急診醫學科', '放射診斷科']
},
{
    id: 'fm',
    name: '家庭醫學科',
    color: '#ec4899',
    topics: ['一般家庭醫學', '家庭醫師臨床手冊', '預防醫學', '居家醫療臨床工作手冊', '家庭醫學與基層醫療', '安寧緩和醫療', '職業醫學', ' 家庭醫學與基層醫療期刊', 'RAKEL Textbook of Family Medicine']
},
{
    id: 'im',
    name: '內科',
    color: '#2563eb',
    topics: ['一般內科', '心臟內科', '胸腔內科', '胃腸肝膽內科', '腎臟內科', '內分泌及新陳代謝科', '血液腫瘤科', '感染科', '風濕免疫科', '過敏免疫科']
},
{
    id: 'surg',
    name: '外科',
    color: '#ea580c',
    topics: ['一般外科', '心臟外科', '胸腔外科', '消化系外科', '大腸直腸外科', '乳房外科', '小兒外科', '肝膽胰外科', '移植外科', '創傷外科']
},
{
    id: 'ped',
    name: '小兒科',
    color: '#f97316',
    topics: ['一般兒科', '新生兒科', '小兒感染科', '小兒心臟科', '小兒腎臟科', '小兒內分泌科', '小兒過敏免疫科', '兒童急診']
},
{
    id: 'obgyn',
    name: '婦產科',
    color: '#db2777',
    topics: ['一般婦產科', '產科', '婦科', '婦癌科', '生殖醫學', '周產期醫學', '不孕症', '高危險妊娠']
},
{
    id: 'ortho',
    name: '骨科',
    color: '#0f766e',
    topics: ['一般骨科', '運動醫學', '脊椎外科', '關節重建', '手外科', '創傷骨科', '小兒骨科']
},
{
    id: 'nsurg',
    name: '神經外科',
    color: '#4f46e5',
    topics: ['一般神經外科', '腦腫瘤', '腦血管外科', '脊椎神經外科', '功能性神經外科', '介入性神經外科']
},
{
    id: 'neuro',
    name: '神經內科',
    color: '#7c3aed',
    topics: ['一般神經內科', '癲癇', '腦血管疾病', '神經免疫', '神經肌肉疾病', '運動障礙', '頭痛與疼痛', '認知與失智']
},
{
    id: 'uro',
    name: '泌尿科',
    color: '#22c55e',
    topics: ['一般泌尿科', '小兒泌尿科', '女性泌尿科', '泌尿腫瘤科', '結石及內視鏡治療', '腎臟移植']
},
{
    id: 'ent',
    name: '耳鼻喉科',
    color: '#14b8a6',
    topics: ['一般耳鼻喉科', '耳科', '鼻科', '喉科', '頭頸腫瘤', '睡眠醫學']
},
{
    id: 'oph',
    name: '眼科',
    color: '#06b6d4',
    topics: ['一般眼科', '視網膜', '青光眼', '角膜與屈光', '小兒眼科', '神經眼科', '眼整形', '眼外傷']
},
{
    id: 'derm',
    name: '皮膚科',
    color: '#f97316',
    topics: ['一般皮膚科', '兒童皮膚科', '美容皮膚科', '免疫與膠原病', '皮膚腫瘤', '性傳染病']
},
{
    id: 'psych',
    name: '精神科',
    color: '#a855f7',
    topics: ['一般精神科', '兒童青少年精神醫學', '老年精神醫學', '成癮醫學', '身心醫學', '司法精神醫學', '社區精神醫學', '心理治療']
},
{
    id: 'rehab',
    name: '復健科',
    color: '#0d9488',
    topics: ['一般復健科', '神經復健', '骨科復健', '小兒復健', '心肺復健', '疼痛復健', '職業復健']
},
{
    id: 'anes',
    name: '麻醉科',
    color: '#f59e0b',
    topics: ['一般麻醉', '心臟麻醉', '小兒麻醉', '產科麻醉', '疼痛門診', '加護醫學', '術後加強照護']
},
{
    id: 'rad',
    name: '放射診斷科',
    color: '#0ea5e9',
    topics: ['一般放射診斷', '介入放射', '神經影像', '心血管影像', '胸腔影像', '腹部影像', '肌骨影像', '乳房影像']
},
{
    id: 'rtonc',
    name: '放射腫瘤科',
    color: '#f97316',
    topics: ['一般放射腫瘤科', '外照射治療', '近距離治療', '立體定位放療', '放射手術', '粒子治療', '緩和放療']
},
{
    id: 'apath',
    name: '解剖病理科',
    color: '#ef4444',
    topics: ['一般外科病理', '細胞學', '血液與骨髓病理', '神經病理', '腎臟病理', '皮膚病理', '婦科病理']
},
{
    id: 'cpath',
    name: '臨床病理科',
    color: '#22c55e',
    topics: ['臨床化學', '血液學', '免疫學', '臨床微生物', '輸血醫學', '毒物與藥物分析']
},
{
    id: 'nm',
    name: '核子醫學科',
    color: '#22d3ee',
    topics: ['診斷核醫', '心臟核醫', '腫瘤核醫', '內用放射治療', 'PET/CT', '分子影像']
},
{
    id: 'em',
    name: '急診醫學科',
    color: '#dc2626',
    topics: ['一般急診', '外傷急救', '小兒急診', '心血管急症', '中風急救', '毒物急症', '災難醫學']
},
{
    id: 'plst',
    name: '整形外科',
    color: '#f97316',
    topics: ['一般整形外科', '美容外科', '顱顏整形', '手外科', '燒傷重建', '顯微重建']
},
{
    id: 'dent',
    name: '牙科',
    color: '#0ea5e9',
    topics: ['一般牙科', '牙髓病科', '牙周病科', '補綴牙科', '口腔顎面外科', '兒童牙科', '齒顎矯正科', '社區牙科', '家醫牙科']
},
{
    id: 'pharm',
    name: '藥學',
    color: '#22c55e',
    topics: ['醫院藥學', '社區藥學', '臨床藥學', '藥物調劑', '藥品管理', '藥事法規']
},
{
    id: 'nurse',
    name: '護理',
    color: '#0ea5e9',
    topics: ['內外科護理', '婦產科護理', '兒科護理', '精神科護理', '社區護理', '長期照護', '加護病房護理', '急診護理']
},
{
    id: 'nutri',
    name: '營養學',
    color: '#22c55e',
    topics: ['臨床營養', '社區營養', '運動營養', '腎臟營養', '腫瘤營養', '兒童營養']
},
{
    id: 'team',
    name: '醫事與專業團隊',
    color: '#8b5cf6',
    topics: ['物理治療師', '職能治療師', '語言治療師', '心理治療師', '醫事技術師', '社工師', '行政人員']
},
{
    id: 'impactfactor',
    name: 'Impact Factor',
    color: '#008927',
    topics: ['點擊分析']
}];

const QUICK_LINKS = {
    "PGY/UGY": [{
        title: "外訓Orientation",
        desc: "家醫、安寧病房、健檢疫苗介紹",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/1026658.png?v=20260118195244",
        url: "https://cchtw-my.sharepoint.com/:f:/g/personal/d1100_cch_org_tw/ElDAVO3YQDFBpUQXPPmlgQsBJmsKZqgWOoQb-2FNDGbKjw?e=l3KUao"
    },
    {
        title: "PGY筆試",
        desc: "PGY筆試前測、後測",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://forms.office.com/r/4cy3CZrvCT"
    },
    {
        title: "UGY筆試",
        desc: "UGY筆試前測、後測",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://forms.office.com/r/ChbDxZVYnt"
    },
    {
        title: "計算餘藥及天數",
        desc: "診斷書住院天數及回診帶藥計算",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/9641509.png?v=20260118195244",
        url: ""
    },
    {
        title: "E-Portfolio",
        desc: "2 項未完成",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/5392393.png?v=20260118195244",
        url: "https://neweportfolio.cch.org.tw/"
    },
    {
        title: "E-learning",
        desc: "1 項未完成",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/3845856.png?v=20260118195244",
        url: "http://elearning.cch.org.tw/cltcms/ctms.do"
    },
    {
        title: "傳統信箱",
        desc: "彰基舊信箱登入",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/2965306.png?v=20260118195244",
        url: "https://outlook.cch.org.tw/"
    },
    {
        title: "分機查詢",
        desc: "院內公務機查詢",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/3014736.png?v=20260118195244",
        url: "https://dpt.cch.org.tw/cch_mvpn/"
    },
    {
        title: "轉QR code",
        desc: "用AI將網址轉成彰基QR code",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/287610.png?v=20260118195244",
        url: "https://sites.google.com/view/cchfm/%E9%80%9A%E7%94%A8%E5%8A%9F%E8%83%BD/qrcode"
    }],
    "R/VS": [{
        title: "住院醫師Orientation",
        desc: "住院醫師工作手冊",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/1026658.png?v=20260118195244",
        url: "https://cchtw-my.sharepoint.com/:f:/r/personal/d1100_cch_org_tw/Documents/%E6%95%99%E5%AD%B8CR/R%26PGY%26UGY%E5%85%B1%E4%BA%AB?csf=1&web=1&e=3Xz2XP"
    },
    {
        title: "評鑒相關",
        desc: "住院醫師工時、作業等統計",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/11531327.png?v=20260118195244",
        url: "https://forms.office.com/Pages/ResponsePage.aspx?id=ZiQhczznWkacDnaDOViPpsrW0RTK8FlDjhEWVClRMqZURFFUMzdSMkUwNEsxOFJUSjNINjBEMENYRC4u"
    },
    {
        title: "Emyway",
        desc: "核心能力、EPA、Milestone",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/3135800.png?v=20260118195244",
        url: "https://emyway.jct.org.tw/"
    },
    {
        title: "EIP工時統計",
        desc: "人資系統報備",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/2784459.png?v=20260118195244",
        url: "https://dpt.cch.org.tw/EIP/#/Login"
    },
    {
        title: "同步行事曆",
        desc: "添加行事曆到我的Google Calendar",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/3773223.png?v=20260118195244",
        url: "https://forms.office.com/r/c3DvcSbiqY"
    },
    {
        title: "口試考古題",
        desc: "歷届家專口試考古題",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/8776696.png?v=20260118195244",
        url: "https://sites.google.com/view/cchfm/%E9%80%9A%E7%94%A8%E5%8A%9F%E8%83%BD/quiz"
    },
    {
        title: "R筆試",
        desc: "住院醫師筆試",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://583124672-atari-embeds.googleusercontent.com/embeds/16cb204cf3a9d4d223a0a3fd8b0eec5d/inner-frame-minified.html"
    },
    {
        title: "R口試",
        desc: "住院醫師口試回饋單",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://forms.office.com/Pages/ResponsePage.aspx?id=ZiQhczznWkacDnaDOViPpsrW0RTK8FlDjhEWVClRMqZUNU5aR1g3WllFUVJUMlY1VENBWTU2SkoxUi4u"
    },
    {
        title: "R口試成績",
        desc: "住院醫師口試成績",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://cchtw-my.sharepoint.com/:x:/r/personal/d1100_cch_org_tw/Documents/%E6%95%99%E5%AD%B8CR/%E7%B6%B2%E9%A0%81%26%E6%88%90%E7%B8%BE/%E5%AE%B6%E5%BA%AD%E6%9A%A8%E7%A4%BE%E5%8D%80%E9%86%AB%E5%AD%B8%E9%83%A8R%E5%8F%A3%E8%A9%9F.xlsx?d=w9dad8e6e46ab4a0ea255f657e3abca79&csf=1&web=1&e=q5NOR2"
    },
    {
        title: "R錄影教學",
        desc: "住院醫師錄影教學回饋單",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://forms.office.com/r/Gdes09Gr2y"
    },
    {
        title: "R原始成績",
        desc: "住院醫師原始成績",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://cchtw-my.sharepoint.com/:x:/r/personal/d1100_cch_org_tw/Documents/%E6%95%99%E5%AD%B8CR/%E7%B6%B2%E9%A0%81%26%E6%88%90%E7%B8%BE/%E5%AE%B6%E5%BA%AD%E6%9A%A8%E7%A4%BE%E5%8D%80%E9%86%AB%E5%AD%B8%E9%83%A8%E9%8C%B4%E5%BD%B1%E6%95%99%E5%AD%B8%E8%A9%95%E4%BC%B0%E8%A1%A8.xlsx?d=wa8342667961c4f3fb20c2c8e3dfa3d5d&csf=1&web=1&e=UlWaat"
    },
    {
        title: "PGY筆試成績",
        desc: "PGY筆試成績",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://cchtw-my.sharepoint.com/:x:/r/personal/d1100_cch_org_tw/Documents/%E6%95%99%E5%AD%B8CR/%E7%B6%B2%E9%A0%81%26%E6%88%90%E7%B8%BE/%E5%AE%B6%E5%BA%AD%E6%9A%A8%E7%A4%BE%E5%8D%80%E9%86%AB%E5%AD%B8%E9%83%A8PGY%E7%AD%BE%E8%A9%9F.xlsx?d=w4f7038aba4ed486a9b78e4383563486d&csf=1&web=1&e=ivNyqX"
    },
    {
        title: "UGY筆試成績",
        desc: "UGY筆試成績",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://cchtw-my.sharepoint.com/:x:/r/personal/d1100_cch_org_tw/Documents/%E6%95%99%E5%AD%B8CR/%E7%B6%B2%E9%A0%81%26%E6%88%90%E7%B8%BE/%E5%AE%B6%E5%BA%AD%E6%9A%A8%E7%A4%BE%E5%8D%80%E9%86%AB%E5%AD%B8%E9%83%A8UGY%E7%AD%BE%E8%A9%9F.xlsx?d=w75b9e02d1bbe4e8aab3f1ec33e2284ad&csf=1&web=1&e=XayekK"
    },
    {
        title: "PGY/UGY EPA",
        desc: "紙本評量電子化",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4838291.png?v=20260118195244",
        url: "https://forms.office.com/r/4EuM1UqyGS"
    }],
    "上傳KM會議記錄": [{
        title: "晨會",
        desc: "社區醫療群學術研討會暨行政會議、住院醫師座談會、OSCE 臨床技能",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/6543839.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=115524"
    },
    {
        title: "臨床研討會",
        desc: "健檢報告解說、門診病歷寫作教學、PEER review",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/11513027.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=115525"
    },
    {
        title: "專題討論",
        desc: "外賓演講、Research meeting、安寧讀書會、預防醫學讀書會",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/4483350.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=115526"
    },
    {
        title: "以EBM方式進行之期刊閱讀",
        desc: "R EBM style 期刊閱讀",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/9110343.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=3023"
    },
    {
        title: "全人醫療（跨領域）討論會",
        desc: "跨領域個案討論會",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/7185630.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=3118"
    },
    {
        title: "家庭訪視及居家照護訓練",
        desc: "居家病例討論會",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/2163350.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=3129"
    },
    {
        title: "核心課程",
        desc: "住院醫師核心課程",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/19007864.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=3148"
    },
    {
        title: "行為科學訓練",
        desc: "巴林小組、錄影教學",
        icon: "https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/2205404.png?v=20260118195244",
        url: "https://km.cch.org.tw/km/listfolders.aspx?uid=3175"
    }]
};


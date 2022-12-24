'use strict'

const _      = require('lodash')
const bcrypt = require('bcryptjs')
const faker  = require('faker')

let demoList = [
  {
    "no": 1,
    "voiceId": "김민지",
    "productName": "민지(Minji)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 40,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 서정적이고 비교적 낮은 목소리를 가진 시인입니다.",
    "colorCode": "#4a5928",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Minji_15.wav",
    "profileImg": "http://3.bp.blogspot.com/__UQSIjH59iA/TB6on15fd1I/AAAAAAAAD9c/VFQE48qBJmk/s1600/Korean+Girl+Facial+Beauty+Characteristics+1024x1024+Pixels.jpg",
    "previewScript": "영영 돌아오지 않을 것처럼, 그리고 곧 사라질만큼 아름다웠다."
  },
  {
    "no": 2,
    "voiceId": "김연진",
    "productName": "연진(Yunjin)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 32,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 열정적이고 강단있게 말하는 뮤지컬 연출 감독입니다.",
    "colorCode": "#c70800",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Yunjin_9.wav",
    "profileImg": "https://i0.wp.com/londonkoreanlinks.net/wp-content/uploads/2015/06/HLee-500.jpg?resize=500%2C333&ssl=1",
    "previewScript": "오늘은 조명팀과 무대팀이 함께 리허설을 맞춰보겠습니다."
  },
  {
    "no": 3,
    "voiceId": "김예지_30대여성",
    "productName": "예지(Yeji)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 37,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 차갑고 비꼬는 말투를 가진 30대 여성입니다.",
    "colorCode": "#623689",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Yeji_12.wav",
    "profileImg": "https://oaksclan.com/wp-content/uploads/2017/08/unique-hairstyles-korean-girl-hairstyles-for-long-hair-asian-girl-hairstyles-for-asian-girl.jpg",
    "previewScript": "사람은 누구나 죽게 되어있어. 빠르거나 늦고의 차이지."
  },
  {
    "no": 4,
    "voiceId": "김유은_10대여자",
    "productName": "유은(Yueun)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 30,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 진중하고 스마트한 목소리를 가진 학교 선생님입니다.",
    "colorCode": "#e8481c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Yueun_14.wav",
    "profileImg": "https://www.90daykorean.com/wp-content/uploads/2017/08/bigstock-184859833.jpg",
    "previewScript": "내일까지 해올 숙제는 교과서 38 페이지에 있는 연습문제들이야."
  },
  {
    "no": 5,
    "voiceId": "김정원",
    "productName": "정원(Jeongwon)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 27,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 명확하고 똑부러지는 성격을 가진, 새로 입사한 신입 아나운서입니다.",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Jeongwon_8.wav",
    "profileImg": "http://img2.sbs.co.kr/img/sbs_cms/CH/2017/06/05/CH97151474_ori.jpg",
    "previewScript": "내일은 전국이 대체로 맑겠고, 오늘보다 기온이 올라 평년기온을 회복하겠습니다."
  },
  {
    "no": 6,
    "voiceId": "김현경",
    "productName": "현경(Hyunkyung)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 33,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 차분하고 나긋나긋하게 말하며 소설을 쓰고 있는 작가입니다.",
    "colorCode": "#e8481c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Hyunkyung_5.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/60.jpg",
    "previewScript": "내 속에서 솟아 나오려는 것. 바로 그것을 나는 살아보려고 했다."
  },
  {
    "no": 7,
    "voiceId": "서예진_10대여성",
    "productName": "예진(Yejin)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 17,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 활기차고 당찬 성격을 가지고 있고, 책읽기를 좋아하는 여고생입니다.",
    "colorCode": "#f8e71c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Yejin_1.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/51.jpg",
    "previewScript": "옛날 어느 마을에 가난한 농부가 살았어. 하루는 농부가 밭에서 일을 하고 있는데 괭이 끝에 무언가 걸리지 뭐야. "
  },
  {
    "no": 8,
    "voiceId": "이은주",
    "productName": "은주(Eunju)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 31,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 차분하고 주위 사람에게 친절한 학교 선생님입니다.",
    "colorCode": "#4a5928",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Eunju_4.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/83.jpg",
    "previewScript": "사람은 그 마음 속에 자기와 똑같은 사람을 보고 마음의 격려를 받는다고 한다."
  },
  {
    "no": 9,
    "voiceId": "이은희",
    "productName": "은희(Eunhee)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 45,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 배려심 깊고 따뜻한 성격을 가진 가정주부입니다.",
    "colorCode": "#4a5928",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Eunhee_3.wav",
    "profileImg": "https://www.asiagraphix.com/wp-content/uploads/2017/03/differences_between_japanese_and_korean_women-624x416.jpg",
    "previewScript": "벌써 날씨가 쌀쌀해졌으니 가벼운 외투를 미리 챙겨놔야겠어요."
  },
  {
    "no": 10,
    "voiceId": "임은아_할머니",
    "productName": "은아(Eunah)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 84,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 사려 깊고 따뜻한 성격을 가진 할머니입니다.",
    "colorCode": "#bf3f86",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Eunah_11.wav",
    "profileImg": "https://us.123rf.com/450wm/donot6/donot61705/donot6170500091/77732166-retrato-de-mujer-mayor-en-el-hogar.jpg?ver=6",
    "previewScript": "늙어서 좋은 점도 있네. 왠만한 일에 놀라지 않게 되니까. "
  },
  {
    "no": 11,
    "voiceId": "장지현",
    "productName": "지현(Jihyun)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 24,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 또박또박하게 말하고 외향적인 성격을 가진 여행 가이드입니다.",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Jihyun_12.wav",
    "profileImg": "https://f.ptcdn.info/566/007/000/1374597209-koreanhair-o.jpg",
    "previewScript": "지금 우리가 도착한 이곳은 옛 궁궐이 있었던 자리입니다."
  },
  {
    "no": 12,
    "voiceId": "정수지_여아",
    "productName": "수지(Suzy)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 9,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 발랄하고 밝은 목소리를 가지고 있는 초등학생입니다.",
    "colorCode": "#f8e71c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Suzy_10.wav",
    "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE-oCsJGZzA8_s_1QbCoOcg50YcuLvwQ1GUT1rOK5Tzsnc5VM8UQ",
    "previewScript": "꿈에서 깨어나도 잊지 않도록 우리의 이름을 써두자."
  },
  {
    "no": 13,
    "voiceId": "한혜진",
    "productName": "혜진(Hyejin)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 28,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 냉정하고 논리적으로 말하기 좋아하는 커리어우먼입니다.",
    "colorCode": "#0d1a6e",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Hyejin_6.wav",
    "profileImg": "https://www.herworld.com/sites/default/files/Claudia%20Kim%20on%20Korean%20plastic%20surgery%20kaya%20pancakes%20and%20her%20face%20cleansing%20addiction%21%20B3.png",
    "previewScript": "오늘 회의에서 사용할 마케팅 관련 자료 준비 부탁해요."
  },
  {
    "no": 14,
    "voiceId": "허민선_세레나",
    "productName": "민선(Minsun)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 26,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 명랑하고 친근한 성격을 가졌으며, 아이들을 좋아하는 유치원 선생님입니다.",
    "colorCode": "#b8d94b",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Minsun_7.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/90.jpg",
    "previewScript": "여러분 오늘 우리가 견학 온 곳은 어린이 박물관이예요."
  },
  {
    "no": 15,
    "voiceId": "홍수민_또박또박",
    "productName": "수민(Sumin)",
    "type": "V",
    "language": "ko",
    "gender": "F",
    "age": 21,
    "appKey": "461c923285d248fb",
    "secretKey": "d06c58c98ada47417113db3731d5e6b7",
    "description": "저는 자기 주장이 강하고 외향적인 성격을 가진 여대생입니다.",
    "colorCode": "#f8e71c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Sumin_2.wav",
    "profileImg": "http://images.china.cn/attachement/jpg/site1006/20130722/001ec949faf11357142622.jpg",
    "previewScript": "제 발표는 여기까지입니다. 지금까지 들어주셔서 고맙습니다."
  },
  {
    "no": 16,
    "voiceId": "강다윗",
    "productName": "다윗(David)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 27,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 푸근하고 둥글둥글한 성격을 가진 20대 청년입니다.",
    "colorCode": "#4a5928",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/David_24.wav",
    "profileImg": "http://www.star4u.co.kr/star4u/data/team/136bec0041649419c46be90c6086b18c.jpg",
    "previewScript": "얘들아 우리 이번주 금요일에 같이 캠핑하러 놀러가자."
  },
  {
    "no": 17,
    "voiceId": "김기평",
    "productName": "기평(Gipyeong)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 32,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 차분하고 논리적으로 말하며 분석하기 좋아하는 젊은 과학자입니다.",
    "colorCode": "#0d1a6e",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Gipyeong_22.wav",
    "profileImg": "https://img.alicdn.com/imgextra/i1/229767369/TB2qsSVbOqAXuNjy1XdXXaYcVXa_!!229767369.jpg",
    "previewScript": "양자역학에서 빛은 파동이자 입자의 형태로 구성된다."
  },
  {
    "no": 18,
    "voiceId": "김동화_할아버지",
    "productName": "동화(Donghwa)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 80,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 통찰력있고 사람들과 이야기하기 좋아하는 할아버지입니다.",
    "colorCode": "#045d76",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Donghwa_18.wav",
    "profileImg": "https://www.aljazeera.com/mritems/Images/2018/3/4/1dbf93507255495c9ab499ceb0335543_18.jpg",
    "previewScript": "세상에서 가장 어려운 일은 사람의 마음을 얻는 일이란다."
  },
  {
    "no": 19,
    "voiceId": "김민정_남아",
    "productName": "민정(Minjeong)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 8,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 순수하고 맑은 목소리를 가진 남자아이입니다.",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Minjeong_17.wav",
    "profileImg": "https://www.koreaboo.com/wp-content/uploads/2016/07/1-120.jpg",
    "previewScript": "오후 4시에 네가 온다면 나는 3시부터 행복해지기 시작할거야."
  },
  {
    "no": 20,
    "voiceId": "서은비_남아",
    "productName": "은비(Eunbi)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 10,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 호기심이 많고 또래보다 조숙한 초등학생입니다.",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Hanul_21.wav",
    "profileImg": "https://ae01.alicdn.com/kf/HTB17b.pIVXXXXXMXpXXq6xXFXXXB/Fashion-men-wig-Men-s-wigs-middle-aged-and-old-hair-wigs-elderly-men-wig-show.jpg",
    "previewScript": "그 어느때보다 신중한 선택이 필요한 기로에 서있습니다."
  },
  {
    "no": 21,
    "voiceId": "이동하",
    "productName": "동하(Dongha)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 28,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 내성적인 성격을 가지고 혼자 있기 좋아하는 직장인입니다.",
    "colorCode": "#045d76",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Dongha_27.wav",
    "profileImg": "https://smhttp-ssl-33667.nexcesscdn.net/manual/wp-content/uploads/2017/02/full-blunt-fringe-men-hair-asian-korean-my-love-from-the-star.jpg",
    "previewScript": "오늘까지 마쳐야 할 업무는 엑셀 파일로 저장해두었습니다.",
    "keywords": {
      "동하": "T",
      "동": "T",
      "하": "T"
    }
  },
  {
    "no": 22,
    "voiceId": "이우석_할아버지",
    "productName": "우석(Woosuk)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 75,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 나긋나긋하고 친근하게 대화하기 좋아하는 연륜 높은 동네 할아버지입니다.",
    "colorCode": "#045d76",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Woosuk_26.wav",
    "profileImg": "https://smhttp-ssl-33667.nexcesscdn.net/manual/wp-content/uploads/2017/02/full-blunt-fringe-men-hair-asian-korean-my-love-from-the-star.jpg",
    "previewScript": "한번 만난 인연은 잊혀지는 것이 아니라, 잊고있을 뿐이란다."
  },
  {
    "no": 23,
    "voiceId": "이지훈",
    "productName": "지훈(Jihoon)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 36,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 진중하고 강단있는 성격을 지닌 형사입니다.",
    "colorCode": "#014d97",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Jihoon_25.wav",
    "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeJW_tilgAcGato_yfXN7_BB6FnzTx0jUudK-ktAciMrqdZx5a",
    "previewScript": "현재 범인의 행적이 묘연하니 2주간 잠복수사를 진행하겠다.",
    "keywords": {
      "지훈": "T",
      "지": "T",
      "훈": "T"
    }
  },
  {
    "no": 24,
    "voiceId": "임민석_남도일",
    "productName": "민석(Minsuk)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 34,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 자기 주장이 강하고 남들과 토론하기 좋아하는 논설위원입니다.",
    "colorCode": "#bf3f86",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Minsuk_16.wav",
    "profileImg": "http://oldsite.aaja.org/wp-content/uploads/2013/08/FrankMugNoGlasses.jpg",
    "previewScript": "이번 선거 결과는, 사전에 예측한 결과와 크게 빗나가지 않았습니다.",
    "keywords": {
      "민석": "T",
      "민": "T",
      "석": "T"
    }
  },
  {
    "no": 25,
    "voiceId": "최우혁",
    "productName": "우혁(Woohyuk)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 26,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 열정적으로 확신에 차서 말하는 젊은 사업가입니다.",
    "colorCode": "#c70800",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Woohyuk_23.wav",
    "profileImg": "https://i.pinimg.com/236x/20/42/e8/2042e866299f002bd730d904bde5bf30--choi-woo-shik-korean-celebrities.jpg",
    "previewScript": "저희 회사의 비즈니스 모델은 세상을 바꿀만한 혁신성을 가지고 있습니다.",
    "keywords": {
      "우혁": "T",
      "우": "T",
      "혁": "T"
    }
  },
  {
    "no": 26,
    "voiceId": "장한얼",
    "productName": "한얼(Hanul)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 38,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 뚝심있고 자신감있게 말하는 신입 정치인입니다.",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Hanul_21.wav",
    "profileImg": "https://ae01.alicdn.com/kf/HTB17b.pIVXXXXXMXpXXq6xXFXXXB/Fashion-men-wig-Men-s-wigs-middle-aged-and-old-hair-wigs-elderly-men-wig-show.jpg",
    "previewScript": "그 어느때보다 신중한 선택이 필요한 기로에 서있습니다.",
    "keywords": {
      "한얼": "T",
      "한": "T",
      "얼": "T"
    }
  },
  {
    "no": 27,
    "voiceId": "황철민_20대청년",
    "productName": "철민(Chulmin)",
    "type": "V",
    "language": "ko",
    "gender": "M",
    "age": 29,
    "appKey": "a971245f6457e00b",
    "secretKey": "1324f1c6644a7554aaa56b261ccf1013",
    "description": "저는 자신감 넘치고 확고한 신념을 가진 신입사원입니다.",
    "colorCode": "#014d97",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Chulmin_19.wav",
    "profileImg": "http://www.fashionfemale.net/wp-content/uploads/2013/06/Men-Asian-Short-Hairstyles-Images.jpg",
    "previewScript": "우리는 우리 앞의 모든 문제들을 해결하기 위해 숭고한 정신을 더욱 전면적으로 실현해야 합니다.",
    "keywords": {
      "철민": "T",
      "철": "T",
      "민": "T"
    }
  },
  {
    "no": 28,
    "voiceId": "Gerard",
    "productName": "Gerard",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 43,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "An old gentleman who has a sensitive and stubborn character",
    "colorCode": "#bf3f86",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Gerard_37_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/men/19.jpg",
    "previewScript": "Twenty years from now, you will be more disappointed by the things that you didn’t do, than by the ones you did do."
  },
  {
    "no": 29,
    "voiceId": "Hana",
    "productName": "Hana",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 26,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A woman in 20s who has an outgoing and stubborn character",
    "colorCode": "#f8e71c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Hana_33_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/40.jpg",
    "previewScript": "We have to get our own rights first."
  },
  {
    "no": 30,
    "voiceId": "trump",
    "productName": "trump",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 72,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A politician who has a passionate and aggresive character",
    "colorCode": "#ff3100",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Trump_31_2.wav",
    "profileImg": "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/trumpus-1538570665.jpg?crop=0.573xw:1.00xh;0.121xw,0&resize=480:*",
    "previewScript": "I want to thank you for being here."
  },
  {
    "no": 31,
    "voiceId": "김혜환english",
    "productName": "Ethan",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 47,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A career woman who has a logical and serious character",
    "colorCode": "#e8481c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Sharon_30_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/53.jpg",
    "previewScript": "I’d like to set up a meeting with you at your earliest convenience"
  },
  {
    "no": 32,
    "voiceId": "박은솔english",
    "productName": "Emma",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 28,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A man in 20s who has a low-pitched firm voice",
    "colorCode": "#045d76",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Danny_35_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/men/35.jpg",
    "previewScript": "But if you come at just any time, I shall never know at what hour my heart is to be ready to greet you."
  },
  {
    "no": 33,
    "voiceId": "이동하english",
    "productName": "Lucas",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 24,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A new employee who has a shy and introspective character",
    "colorCode": "#014d97",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Colin_34_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/men/20.jpg",
    "previewScript": "I have saved the work to be completed by today as an Excel file."
  },
  {
    "no": 34,
    "voiceId": "정지원_라푼젤",
    "productName": "Olivia",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 35,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A teacher who has a caring and warm character",
    "colorCode": "#b8d94b",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Ann_32_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/52.jpg",
    "previewScript": "Look at exercise two. Can you read the instructions, please?"
  },
  {
    "no": 35,
    "voiceId": "정하연english",
    "productName": "Ava",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 30,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "An author who has a soft and calm character",
    "colorCode": "#e8481c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Chloe_28_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/85.jpg",
    "previewScript": "Other people live in dreams, but not in their own."
  },
  {
    "no": 36,
    "voiceId": "최유정english",
    "productName": "Isabella",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 25,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A college student who has a energetic and confident character",
    "colorCode": "#f8e71c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Hazel_29_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/44.jpg",
    "previewScript": "I am going to go on a trip to Africa on this vacation."
  },
  {
    "no": 37,
    "voiceId": "홍영은english",
    "productName": "Sophia",
    "type": "V",
    "language": "en",
    "gender": "M",
    "age": 32,
    "appKey": "01392daa4331e259",
    "secretKey": "a41c6f8d8172ca209a59f2177f8d4ed3",
    "description": "A doctor who speaks fast in a confident manner",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/Sophie_36_2.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/19.jpg",
    "previewScript": "This illness is usually treated with antibiotics and a strict diet."
  },
  {
    "no": 38,
    "voiceId": "해몽우",
    "productName": "谢梦宇",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 23,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "对生活充满热情的女大学生",
    "colorCode": "#c70800",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/xiemengyu38.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/18.jpg",
    "previewScript": "为了更好的准备研究生考试，今年春节不回家了，这样才能多复习一些"
  },
  {
    "no": 39,
    "voiceId": "왕이니",
    "productName": "王依妮",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 25,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "自信，勇敢的20岁青年女性",
    "colorCode": "#f8e71c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/wangyini39.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/12.jpg",
    "previewScript": "这次假期我打算和朋友去参加跳伞培训活动，挑战自己的极限"
  },
  {
    "no": 40,
    "voiceId": "이연정",
    "productName": "李妍静",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 24,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "工作中与同事相处融洽，协作能力强的事业女性",
    "colorCode": "#045d76",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/liyanjing40.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/78.jpg",
    "previewScript": "这个月的生产目标一定要完成，希望各部门同事一起加油！"
  },
  {
    "no": 41,
    "voiceId": "황사로",
    "productName": "黄思路",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 21,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "人际交往能力强，性格诚实稳重的女大学生",
    "colorCode": "#067ef2",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/huangsilu41.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/8.jpg",
    "previewScript": "这次由我组织的迎新晚会能够成功举办全靠大家的支持和积极配合，谢谢大家"
  },
  {
    "no": 42,
    "voiceId": "유천광",
    "productName": "刘田光",
    "type": "V",
    "language": "zh",
    "gender": "M",
    "age": 26,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "拥有坚毅果断性格的男大学生",
    "colorCode": "#014d97",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/liutianguang42.wav",
    "profileImg": "https://randomuser.me/api/portraits/men/26.jpg",
    "previewScript": "虽然招新目标没有达到预期，但是换一种招新模式或许会更好"
  },
  {
    "no": 43,
    "voiceId": "한우선",
    "productName": "韩宇轩",
    "type": "V",
    "language": "zh",
    "gender": "M",
    "age": 28,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "对未来充满热情，积极努力拼搏的男青年",
    "colorCode": "#ff3100",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/hanyuxuan43.wav",
    "profileImg": "https://randomuser.me/api/portraits/men/90.jpg",
    "previewScript": "为了可以争取到学术研究的名额，我会更加努力准备考试的"
  },
  {
    "no": 44,
    "voiceId": "해동",
    "productName": "谢冬",
    "type": "V",
    "language": "zh",
    "gender": "M",
    "age": 24,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "表达，接受新鲜事物能力强，聪明的职场新人",
    "colorCode": "#e8481c",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/haidong44.wav",
    "profileImg": "https://randomuser.me/api/portraits/men/92.jpg",
    "previewScript": "按照公司要求已经和合作商沟通过了，合作商答应赞助本次活动"
  },
  {
    "no": 45,
    "voiceId": "홍명예",
    "productName": "洪明睿",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 30,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "性格强势，做事果断的职场女强人",
    "colorCode": "#bf3f86",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/hongmingrui45.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/35.jpg",
    "previewScript": "此次合作谈判不成功的话就没有必要继续跟进这个项目了"
  },
  {
    "no": 46,
    "voiceId": "왕사연",
    "productName": "王思然",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 32,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "洞察力敏锐，能很好的照顾到别人感受的职场女性",
    "colorCode": "#b8d94b",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/wangsiran46.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/27.jpg",
    "previewScript": "张总不喜欢喝茶，记得一定要准备咖啡"
  },
  {
    "no": 47,
    "voiceId": "강곤",
    "productName": "姜昆",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 23,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "努力上进，对工作充满热情的女员工",
    "colorCode": "#c70800",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/jiangkun47.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/70.jpg",
    "previewScript": "和外国合作商沟通时有些不流畅，看来周末的时候要学习英语了"
  },
  {
    "no": 48,
    "voiceId": "이국화",
    "productName": "李国华",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 27,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "对新鲜的事物充满挑战心，能很好地克服工作中困难的职业女性",
    "colorCode": "#ff3100",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/liguohua48.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/58.jpg",
    "previewScript": "这次的任务很有挑战性，相信我们一定能做好"
  },
  {
    "no": 49,
    "voiceId": "양안기",
    "productName": "梁安琪",
    "type": "V",
    "language": "zh",
    "gender": "F",
    "age": 25,
    "appKey": "47a02cbd1bd48e47",
    "secretKey": "dd28a26246a3e3ba6eeee283cbc0f128",
    "description": "心思细腻，性格温和的女老师",
    "colorCode": "#b8d94b",
    "previewMedia": "http://183.111.120.233:8083/musics/vm/lianganqi49.wav",
    "profileImg": "https://randomuser.me/api/portraits/women/44.jpg",
    "previewScript": "小朋友们大家不要吵闹，请按顺序进入场馆"
  }
]


let randomCardNo = []
for(let i=0; i<50; i++)
  randomCardNo.push(
    faker.random.number({min:1000, max:9999})
    + '-' + faker.random.number({min:1000, max:9999})
    + '-' + faker.random.number({min:1000, max:9999})
    + '-' + faker.random.number({min:1000, max:9999})
  )

let randomExpires = []
for (let i=0; i<50; i++)
  randomExpires.push(
    faker.random.arrayElement(['01','02','03','04','05','06','07','08','09','10','11','12'])
    + '/'
    + faker.random.number({min:2020, max:2030})
  )

const fakerUser = async (username)=>{
  try{
    let user = {}
    let creditCard = {}
    let bankAccount = {}

    faker.locale = 'en'
    creditCard.alias        = username
    creditCard.cardNo       = randomCardNo[faker.random.number(randomCardNo.length-1)]
    creditCard.expires      = randomExpires[faker.random.number(randomExpires.length-1)]
    creditCard.fullName     = username
    creditCard.address1     = faker.fake('{{address.streetAddress}}')
    creditCard.address2     = faker.fake('{{address.secondaryAddress}}')
    creditCard.city         = faker.fake('{{address.city}}')
    creditCard.state        = faker.fake('{{address.state}}')
    creditCard.zipCode      = faker.fake('{{address.zipCode}}')

    let country = COUNTRY[faker.random.number(COUNTRY.length-1)]
    creditCard.country      = country.code
    creditCard.isDefault    = true

    bankAccount.country     = creditCard.country
    bankAccount.bankName    = faker.fake('{{finance.accountName}}')
    bankAccount.accountType = faker.random.arrayElement(['CHECKING', 'SAVING'])
    bankAccount.routingNo   = '123456789'
    bankAccount.accountNo   = '123456789'
    bankAccount.isDefault   = true

    user.email              = username + '@sruniverse.kr'
    user.password           = await bcrypt.hash(username, BCRYPT.SALT_SIZE)
    user.thumbnailUrl       = faker.fake('{{image.avatar}}')
    user.companyName        = faker.fake('{{company.companyName}}')
    user.phone1             = country.phone_code
    user.phone2             = faker.fake('{{phone.phoneNumberFormat}}')
    user.role               = 'USER'
    user.userType           = 'PROVIDER,CUSTOMER'
    user.bizLicenseNo       = '123456789'
    user.creditCards        = [creditCard]
    user.bankAccounts       = [bankAccount]

    user.firstName  = faker.fake('{{name.firstName}}')
    user.lastName   = faker.fake('{{name.lastName}}')

    user.name = user.firstName + ' ' +  user.lastName
    user.country = country.code

    // for test
    if(username.startsWith('meinzug')){
      user.email        = 'meinzug@me.com'
      user.password     = await bcrypt.hash('1234', BCRYPT.SALT_SIZE)
      user.role         = 'USER'
      user.creditCards  = []
      user.bankAccounts = []
      user.isVerifiedEmail = true
    }
    else if(username.startsWith('user99')){
      user.role = 'USER'
      user.creditCards = []
      user.bankAccounts = []
      user.isVerifiedEmail = true
    }
    else if(username.startsWith('admin')){
      user.role = 'ADMIN'
      user.creditCards = []
      user.bankAccounts = []
      user.isVerifiedEmail = true
    }
    else if(username.startsWith('operator')){
      user.role = 'OPERATOR'
      user.creditCards = []
      user.bankAccounts = []
      user.isVerifiedEmail = true
    }

    // for dev test
    let years = 1
    user.createdAt = faker.date.past(years)
    user.updatedAt = user.createdAt

    let newUser = await Users.create(user)

    if(user.userType.includes('PROVIDER'))
      await fakerVoice(newUser._id.toString(), user.email, user.name)

    // return new Promise((resolve, reject)=> resolve('done'))
  }
  catch(err){
    throw err
  }
}

const fakerVoiceProduct = async (voiceId, ownerId, email, username, isOrigin)=>{
  try{
    // init random category
    let randomCategory = CATEGORY[faker.random.number(CATEGORY.length-1)]
    let subCategories = randomCategory.subCategories
    let category = subCategories[faker.random.number(subCategories.length-1)]

    // create voice product
    let vp = {}

    // for voice mall test data
    let demo            = demoList[faker.random.number(demoList.length-1)]
    let vcolor          = _.find(VOICE_COLOR, {code: demo.colorCode.toUpperCase()})

    faker.locale = 'en'
    vp.name             = demo.productName
    vp.description      = demo.description
    vp.price            = faker.random.number(100) + '.' + faker.random.number(9)
    vp.currency         = ''
  //   vp.voiceParameters  = []
    vp.createdBy        = email
    vp.lastModifiedBy   = email
    vp.category         = category.code

    if(!vcolor)
      return log('COLOR_CODE_NOT_FOUND', demo.colorCode.toUpperCase())

    vp.vvsId            = demo.voiceId
    vp.voiceId          = mongoose.Types.ObjectId(voiceId)
    vp.isOrigin         = isOrigin
    vp.isSales          = faker.random.boolean()
    vp.language         = demo.language
    vp.appKey           = demo.appKey
    vp.secretKey        = demo.secretKey
    vp.age              = demo.age
    vp.gender           = demo.gender
    vp.colorCode        = demo.colorCode.toUpperCase()
    vp.colorPos         = [faker.random.number({min:0, max:255}), faker.random.number({min:0, max:255})]
    vp.keywords         = vcolor.keywords
    vp.thumbnailUrl     = demo.profileImg
    vp.isVirtualVoice   = (demo.type === 'V')? true : false
    vp.isReady          = faker.random.boolean()
    vp.previewMediaUrl  = demo.previewMedia
    vp.previewScript    = demo.previewScript
    vp.ownerId          = mongoose.Types.ObjectId(ownerId)


    // for dev test
    let years = 1
    vp.createdAt = faker.date.past(years)
    vp.updatedAt = vp.createdAt

    await VoicesProducts.create(vp)
    // return new Promise((resolve, reject)=> resolve('done'))
  }
  catch(err){
    throw err
  }
}

const fakerVoice = async (ownerId, email, username)=>{
  try{
    let voice = {}

    faker.locale = 'en'
    voice.name            = username
    voice.description     = username + ' voice test'
    voice.language        = faker.random.number(LANGUAGE.length-1).code
    voice.accessToken     = ''
    voice.createdBy       = email
    voice.lastModifiedBy  = email
    voice.ownerId         = mongoose.Types.ObjectId(ownerId)
    voice.isAssistant     = _.sample([true, false])

    // for dev test
    let years = 1
    voice.createdAt = faker.date.past(years)
    voice.updatedAt = voice.createdAt

    voice = await Voices.create(voice)

    await fakerVoiceProduct(voice._id, ownerId, email, username, true)
    // await fakerVoiceProduct(voice._id, email, username, false)
    // await fakerVoiceProduct(voice._id, email, username, false)
    // await fakerVoiceProduct(voice._id, email, username, false)
    // await fakerVoiceProduct(voice._id, email, username, false)

    // return new Promise((resolve, reject)=> resolve('done'))
  }
  catch(err){
    throw err
  }
}

const fakerPurchase = async ()=>{
  try{
    let count   = await Users.countDocuments()
    let random  = faker.random.number({min:0, max:count})
    let user    = await Users.findOne().skip(random).limit(1)

    if(!user) return

    count   = await VoicesProducts.countDocuments()
    random  = faker.random.number({min:0, max:count})
    let product = await VoicesProducts.findOne().skip(random).limit(1)

    if(!product) return

    let purchase = {}
    purchase.buyerId      = user._id
    purchase.productId    = product._id
    purchase.productName  = product.name
    purchase.payName      = 'Ends in ' + faker.random.number({min:1000, max:9999})
    purchase.payType      = faker.random.arrayElement(PAY_TYPE).code
    purchase.useType      = faker.random.arrayElement(USE_TYPE).code
    purchase.price        = product.price
    purchase.payState     = 'READY'
    purchase.taskState    = 'READY'
    purchase.payInfo      = null

    if(product.language === 'ko'){
      purchase.currency = 'KRW'
      purchase.text     = '제 발표는 여기까지입니다. 지금까지 들어주셔서 고맙습니다. 벌써 날씨가 쌀쌀해졌으니 가벼운 외투를 미리 챙겨놔야겠어요. 오늘 회의에서 사용할 마케팅 관련 자료 준비 부탁해요. 여러분 오늘 우리가 견학 온 곳은 어린이 박물관이예요. 지금 우리가 도착한 이곳은 옛 궁궐이 있었던 자리입니다. 내일은 전국이 대체로 맑겠고, 오늘보다 기온이 올라 평년기온을 회복하겠습니다. 오늘은 조명팀과 무대팀이 함께 리허설을 맞춰보겠습니다. 이번 선거 결과는, 사전에 예측한 결과와 크게 빗나가지 않았습니다. 오늘까지 마쳐야 할 업무는 엑셀 파일로 저장해두었습니다. 우리는 우리 앞의 모든 문제들을 해결하기 위해 숭고한 정신을 더욱 전면적으로 실현해야 합니다. 그 어느때보다 신중한 선택이 필요한 기로에 서있습니다. 저희 회사의 비즈니스 모델은 세상을 바꿀만한 혁신성을 가지고 있습니다. 옛날 어느 마을에 가난한 농부가 살았어. 하루는 농부가 밭에서 일을 하고 있는데 괭이 끝에 무언가 걸리지 뭐야. 사람은 누구나 죽게 되어있어. 빠르거나 늦고의 차이지. 내일까지 해올 숙제는 교과서 38 페이지에 있는 연습문제들이야. 오후 4시에 네가 온다면 나는 3시부터 행복해지기 시작할거야. 세상에서 가장 어려운 일은 사람의 마음을 얻는 일이란다. 나무에서 벚꽃이 떨어지는 속도가 초속 5센티미터래. 얘들아 우리 이번주 금요일에 같이 캠핑하러 놀러가자. 한번 만난 인연은 잊혀지는 것이 아니라, 잊고있을 뿐이란다. 사람은 그 마음 속에 자기와 똑같은 사람을 보고 마음의 격려를 받는다고 한다. 내 속에서 솟아 나오려는 것. 바로 그것을 나는 살아보려고 했다.'
    }
    else if(product.language === 'zh'){
      purchase.currency = 'CNY'
      purchase.text     = '虽然今天的工作很多，但是希望大家保持工作的热情一起加油吧！ 昨天和莉莉讨论的一起开一家人气奶茶店的点子很有市场前景，我愿意试一试. 昨天因为身体原因没有完成的报告，这节课结束后应该和教授好好解释一下. 马上就要参加婚礼了，这个月内一定要完成减肥目标！ 可能是我性格太内向了，不爱表达，所以小明才会以为我不喜欢和他聊天的吧. 明天招待来我们公司访问的张总的时候，记得张总不喜欢吃辣的，尽量不要点川菜. 感谢大家对我的信赖，一直和我学习中文，这次的中文考试我会为大家好好准备复习材料. 这次的野营活动由我组织，届时会设计很多新颖的活动，希望大家积极参加.'
    }
    else if(product.language === 'en'){
      purchase.currency = 'USD'
      purchase.text     = 'Other people live in dreams, but not in their own. I am going to go on a trip to Africa on this vacation. I’d like to set up a meeting with you at your earliest convenience I want to thank you for being here. Look at exercise two. Can you read the instructions, please? We have to get our own rights first. I have saved the work to be completed by today as an Excel file. But if you come at just any time, I shall never know at what hour my heart is to be ready to greet you. This illness is usually treated with antibiotics and a strict diet. Twenty years from now, you will be more disappointed by the things that you didn’t do, than by the ones you did do.'
    }

    // for dev test
    let years = 1
    purchase.createdAt = faker.date.past(years)
    purchase.updatedAt = purchase.createdAt

    await Purchases.create(purchase)
    // return new Promise((resolve, reject)=> resolve('done'))
  }
  catch(err){
    throw err
  }
}

const initTestDataGen = async ()=>{
  try{
    if(!_.includes(process.argv, 'reset-data'))
      return

    log('reset test data (users)...')
    await Users.deleteMany({})

    log('reset test data (voices)...')
    await Voices.deleteMany({})

    log('reset test data (voices.products)...')
    await VoicesProducts.deleteMany({})

    log('reset test data (purchases)...')
    await Purchases.deleteMany({})

    log('reset test data (search keyword)...')
    await SearchKeywords.deleteMany({})

    let maxUsers = 47
    for (let i=1; i<maxUsers+1; i++)
      await fakerUser('user'+i)

    let maxPurchases = 47
    for (let i=0; i<maxPurchases; i++)
      await fakerPurchase()

    // for test
    await fakerUser('user99')
    await fakerUser('admin1')
    await fakerUser('admin2')
    await fakerUser('admin3')
    await fakerUser('operator1')
    await fakerUser('operator2')
    await fakerUser('operator3')
    await fakerUser('meinzug')

    // for keyword
    let count = await SearchKeywords.countDocuments({})
    if(count < 1){
      let data = {
        popular: ['#passion','#challenge','#wisdom','#communication','#trust','#AI Speaker','#E-book','#Museum Curation','#Travek Guide','#Smart Car'],
        recommended: ['#passion','#challenge','#wisdom','#communication','#trust','#adoption']
      }
      await SearchKeywords.create(data)
    }
  }
  catch(err){
    throw err
  }
}

module.exports = initTestDataGen()
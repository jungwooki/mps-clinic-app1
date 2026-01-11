import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Trophy, Activity, Zap, Droplets, AlertCircle, Heart, ChevronRight, ChevronLeft, RotateCcw, User, Utensils, Moon, Sun, Info, Clock, CheckCircle2, Calendar, Phone, ClipboardCheck } from 'lucide-react';

const APP_TITLE = "MPS 종합성장체질 리포트";
const SUB_TITLE = "M-Part: 축구 성향체질 정밀 진단";

const QUESTIONS = [
  // 기허 (Energy Deficiency) - 5문항
  { id: 1, category: '기허', text: "경기가 끝나면 다른 친구들보다 회복하는 데 시간이 훨씬 오래 걸려요.", weight: 10 },
  { id: 2, category: '기허', text: "후반전이 되면 다리가 풀리고 숨이 너무 차서 뛰기가 힘들어요.", weight: 8 },
  { id: 3, category: '기허', text: "평소에 목소리에 힘이 없고 조금만 움직여도 땀이 비오듯 쏟아져요.", weight: 6 },
  { id: 4, category: '기허', text: "밥맛이 별로 없고, 조금만 먹어도 배가 금방 불러요.", weight: 7 },
  { id: 5, category: '기허', text: "아침에 일어나는 게 너무 힘들고 낮에도 자꾸 눕고만 싶어요.", weight: 8 },
  
  // 기역 (Counterflow Qi) - 5문항
  { id: 6, category: '기역', text: "경기 중에 실수를 하거나 심판 판정이 억울하면 얼굴이 확 달아오르고 화가 잘 안 참아져요.", weight: 10 },
  { id: 7, category: '기역', text: "흥분하면 머리가 아프거나 가슴이 두근거려서 경기에 집중이 안 돼요.", weight: 8 },
  { id: 8, category: '기역', text: "잠들기 전에 생각이 너무 많아져서 깊게 잠들지 못해요.", weight: 7 },
  { id: 9, category: '기역', text: "가끔 이유 없이 딸꾹질이 자주 나거나 트림이 위로 치밀어 올라와요.", weight: 6 },
  { id: 10, category: '기역', text: "긴장하면 목에 무언가 걸린 듯 답답하고 헛기침이 나와요.", weight: 7 },
  
  // 기울 (Stagnant Qi) - 5문항
  { id: 11, category: '기울', text: "중요한 시합 전에는 가슴이 답답하고 나도 모르게 한숨을 자주 쉬어요.", weight: 10 },
  { id: 12, category: '기울', text: "긴장하면 배가 살살 아프거나 가스가 차서 몸이 둔해져요.", weight: 8 },
  { id: 13, category: '기울', text: "걱정이 많아서 경기 전날 밤에 자꾸 뒤척이며 잠을 설쳐요.", weight: 6 },
  { id: 14, category: '기울', text: "옆구리나 가슴 부위가 팽팽하게 붓거나 아픈 느낌이 들 때가 있어요.", weight: 7 },
  { id: 15, category: '기울', text: "기분에 따라 경기력 기복이 심하다는 소리를 자주 들어요.", weight: 9 },

  // 혈허 (Blood Deficiency) - 5문항
  { id: 16, category: '혈허', text: "경기 중에 종아리나 발바닥에 '쥐(근육 경련)'가 자주 나서 교체될 때가 있어요.", weight: 10 },
  { id: 17, category: '혈허', text: "갑자기 방향을 전환하거나 헤더를 할 때 순간적으로 눈앞이 어질어질해요.", weight: 8 },
  { id: 18, category: '혈허', text: "손톱이 얇고 잘 깨지며, 머리카락이 유난히 푸석푸석해요.", weight: 6 },
  { id: 19, category: '혈허', text: "피부가 건조해서 자주 가렵고, 눈이 금방 피로해져서 침침해요.", weight: 7 },
  { id: 20, category: '혈허', text: "잠을 자는 동안 팔다리가 저리거나 남의 살 같은 느낌이 들어요.", weight: 8 },

  // 어혈 (Blood Stasis) - 5문항
  { id: 21, category: '어혈', text: "상대 선수와 부딪히면 남들보다 멍이 진하게 들고 유독 오래 가요.", weight: 10 },
  { id: 22, category: '어혈', text: "예전에 다쳤던 부위가 날씨가 안 좋거나 밤이 되면 더 콕콕 쑤셔요.", weight: 8 },
  { id: 23, category: '어혈', text: "입술 색이 푸르스름하거나 혀를 보면 검은 점 같은 게 보여요.", weight: 7 },
  { id: 24, category: '어혈', text: "얼굴색이 어둡고 칙칙하며 다크서클이 얼굴에 엄청 내려온 것 같아요.", weight: 6 },
  { id: 25, category: '어혈', text: "몸 어딘가에 딱딱하게 뭉친 곳이 있고 누르면 아픈 부위가 고정되어 있어요.", weight: 9 },

  // 수체 (Fluid Stagnation) - 5문항
  { id: 26, category: '수체', text: "비가 오거나 날씨가 흐리면 몸이 물에 젖은 솜처럼 무거워져요.", weight: 10 },
  { id: 27, category: '수체', text: "아침에 일어나면 얼굴이나 손발이 퉁퉁 부어서 신발이 꽉 끼기도 해요.", weight: 8 },
  { id: 28, category: '수체', text: "관절(무릎, 발목)이 뻑뻑하고 소리가 자주 나며 움직임이 둔해요.", weight: 7 },
  { id: 29, category: '수체', text: "조금만 먹어도 속이 메스껍고 소화가 안 될 때 '꿀렁거리는' 소리가 나요.", weight: 6 },
  { id: 30, category: '수체', text: "대변이 시원하지 않고 끈적거리거나 소변 양이 적고 시원치 않아요.", weight: 8 },
];

const CATEGORY_INFO = {
  '기허': { 
    name: '에너지 방전형', 
    color: '#EAB308', 
    icon: <Zap size={20} />, 
    desc: "기초 에너지가 부족하여 후반전에 탈진하기 쉬운 유형입니다. '양'보다 '질'과 '빈도'에 집중한 영양 공급이 필수적입니다.",
    diet: {
      daily: "매일 아침 따뜻한 꿀물로 위장을 깨우세요. 간식으로 미숫가루나 약밥 같은 전통 곡물을 활용해 탄수화물 로딩 상태를 유지하는 것이 좋습니다.",
      pre: "경기 4시간 전 닭죽(껍질 제거)이나 소고기 야채죽 등 소화가 쉬운 고탄수화물 식사를 하세요. 2시간 전에는 찐 감자나 고구마가 좋습니다.",
      post: "경기 후 30분 내 초코우유나 카스테라를 섭취하세요. 메인 식사는 삼계탕, 전복죽 등 단백질이 풍부한 따뜻한 보양식을 추천합니다."
    },
    sleep: "밤 10시 이전 취침이 필수입니다. 낮잠은 15분 이내로 제한하고 일정한 수면 리듬을 확보하세요.",
    morning: [
      "[누워서 기지개] 눈 뜨자마자 팔다리를 대자로 뻗어 10초간 버티며 전신 근육 깨우기",
      "[폼롤러 흉추 롤링] 등(날개뼈 아래)에 폼롤러를 대고 위아래로 부드럽게 문질러 척추 신경계 자극하기",
      "[아기 자세] 무릎 꿇고 엎드려 이마를 바닥에 대고 허리 긴장을 풀며 깊게 호흡하기"
    ]
  },
  '기역': { 
    name: '다혈질 과부하형', 
    color: '#EF4444', 
    icon: <AlertCircle size={20} />, 
    desc: "위로 치솟는 기운으로 인해 경기 중 구역감이나 역류 느낌이 나타나기 쉽습니다. 위장관 진정과 식사 타이밍 조절이 핵심입니다.",
    diet: {
      daily: "과식을 절대 금하며 식사 도중 물을 많이 마시지 마세요. 저녁 식사는 취침 3시간 전에 마쳐 야간 역류를 방지해야 합니다.",
      pre: "경기 4시간 전 맑은 무국에 흰 밥, 연두부 등 체류 시간이 짧은 유동식을 드세요. 경기 직전에는 생강 캔디나 생강차가 구역감 예방에 효과적입니다.",
      post: "위장관 느낌이 진정될 때까지 자극적인 음식을 피하세요. 된장국, 흰 살 생선찜, 매실차 등 위를 편안하게 하는 식단을 구성하세요."
    },
    sleep: "자기 전 미지근한 물로 족욕을 하여 상체의 열을 내리세요. 암막 커튼으로 깊은 수면 환경을 조성하세요.",
    morning: [
      "[폼롤러 종아리 풀기] 폼롤러 위에 종아리를 올리고 좌우로 도리도리 흔들어 하체로 혈류 유도하기",
      "[목 & 승모근 스트레칭] 고개를 옆으로 지그시 눌러 머리로 쏠린 열과 긴장 내려주기",
      "[나비 자세 호흡] 앉아서 발바닥을 붙이고 상체를 숙여 차분하게 1분간 명상 호흡하기"
    ]
  },
  '기울': { 
    name: '유리멘탈 긴장형', 
    color: '#8B5CF6', 
    icon: <Activity size={20} />, 
    desc: "심리적 압박이 신체화되어 근육이 경직되기 쉬운 유형입니다. 아로마 효과와 자율신경 균형을 돕는 영양이 필요합니다.",
    diet: {
      daily: "녹색 채소와 신맛 나는 과일(시트러스)을 꾸준히 섭취하세요. 즐거운 식사 환경을 만드는 것이 기 순환에 매우 중요합니다.",
      pre: "경기 4시간 전 강황이 든 카레라이스나 유자 드레싱 샐러드를 곁들인 가벼운 식사를 하세요. 경기 직전 오렌지 향을 맡는 것도 좋습니다.",
      post: "비타민 B1이 풍부한 돼지고기 수육과 부추 무침을 추천합니다. 식초가 들어간 초무침 요리는 젖산 분해와 기운 수렴에 도움을 줍니다."
    },
    sleep: "명상이나 잔잔한 음악으로 긴장을 완화하세요. 잠자기 2시간 전에는 경기 영상이나 게임 시청을 중단하세요.",
    morning: [
      "[폼롤러 겨드랑이 롤링] 옆으로 누워 겨드랑이에 폼롤러를 끼고 움직여 림프 순환 돕기",
      "[오픈 북 스트레칭] 옆으로 누워 팔을 반대로 넘기며 닫혀있는 가슴과 흉곽 활짝 열어주기",
      "[개구리 자세] 엎드려서 무릎을 벌리고 골반의 긴장을 툭 내려놓기"
    ]
  },
  '혈허': { 
    name: '근육 영양 공급부족형', 
    color: '#F97316', 
    icon: <Heart size={20} />, 
    desc: "성장기 급성장으로 인해 혈액과 영양이 근육에 충분히 공급되지 못하는 상태입니다. 근육 경련(쥐)에 취약하므로 철분 흡수 극대화 전략이 필요합니다.",
    diet: {
      daily: "1일 1회 붉은 육류 섭취를 원칙으로 하세요. 간식으로는 철분이 강화된 시리얼이나 건포도, 육포 등을 활용하면 좋습니다.",
      pre: "경기 4시간 전 소고기 주먹밥, 떡갈비 등 철분과 탄수화물이 조화된 식사를 하세요. 비타민 C가 풍부한 오렌지 주스를 곁들이면 흡수율이 높아집니다.",
      post: "조혈 작용을 돕는 소고기 미역국, 선지, 포도주스를 섭취하세요. 우유(칼슘)는 철분 흡수를 방해할 수 있으므로 시간차를 두세요."
    },
    sleep: "취침 전 폼롤러 스트레칭으로 근육 긴장을 푸세요. 가습기를 사용하여 점막 건조를 예방하세요.",
    morning: [
      "[발목 펌핑 & 발가락 운동] 누워서 발목을 까딱이고 발가락으로 가위바위보를 하며 말초 신경 깨우기",
      "[폼롤러 허벅지 앞쪽] 엎드려서 허벅지 앞쪽(대퇴사두근)을 부드럽게 롤링하여 혈액 공급하기",
      "[모관 운동] 누워서 팔다리를 천장으로 들고 가볍게 30초간 털어주기"
    ]
  },
  '어혈': { 
    name: '회복 지연형', 
    color: '#4B5563', 
    icon: <User size={20} />, 
    desc: "혈류가 정체되어 염증 경향이 높고 부상 회복이 느린 유형입니다. 항염증 식품과 미세 순환 개선이 핵심입니다.",
    diet: {
      daily: "식용유 대신 올리브유나 들기름을 사용하세요. 요리에 마늘, 양파, 생강, 강황 등 향신료를 적극 활용하여 혈액을 맑게 유지하세요.",
      pre: "경기 2-3시간 전 비트 주스를 마시면 지구력 향상에 큰 도움이 됩니다. 연어 오니기리와 맑은 부추국으로 혈류량을 늘리세요.",
      post: "운동 후 근육통 감소를 위해 타트 체리 주스나 카레(강황)를 드세요. 파인애플의 브로멜라인 성분은 멍과 부종 제거에 탁월합니다."
    },
    sleep: "반신욕을 주 3회 이상 실시하세요. 발을 심장보다 높게 두고 자면 혈액 순환과 피로 해소에 효과적입니다.",
    morning: [
      "[폼롤러 엉덩이 풀기] 한쪽 엉덩이를 폼롤러에 대고 체중을 실어 뭉친 부위(둔근) 집중 공략하기",
      "[폼롤러 허벅지 옆쪽] 옆으로 누워 허벅지 바깥쪽(장경인대)을 살살 문질러 굳은 근막 이완하기",
      "[동적 런지] 깊게 앉았다 일어나며 고관절과 허벅지를 늘려 혈류량 빠르게 증가시키기"
    ]
  },
  '수체': { 
    name: '무거운 다리형', 
    color: '#3B82F6', 
    icon: <Droplets size={20} />, 
    desc: "체내 수분 대사가 원활하지 않아 몸이 무겁고 잘 붓는 유형입니다. 저염 식단과 효율적인 수분 배출 전략이 필요합니다.",
    diet: {
      daily: "저녁 식사를 싱겁게 먹고 야식을 엄금하세요. 율무차나 옥수수수염차를 물 대신 수시로 마셔 불필요한 수분을 배출하세요.",
      pre: "경기 4시간 전 팥밥이나 율무밥, 호박죽 등으로 몸을 가볍게 하세요. 물은 한 번에 많이 마시기보다 15분 간격으로 조금씩 자주 마셔야 합니다.",
      post: "콩국수(식물성 단백질)나 수박 화채로 전해질을 보충하세요. 경기 후 짠 국물 요리(라면 등)는 부종을 악화시키므로 절대 금물입니다."
    },
    sleep: "땀을 약간 낼 정도로 따뜻하게 자는 것이 좋습니다. 습도가 높은 날엔 제습기를 가동해 쾌적한 환경을 유지하세요.",
    morning: [
      "[폼롤러 목 베개] 폼롤러를 베고 누워 고개를 좌우로 도리도리하며 머리와 목의 붓기 빼기",
      "[L자 다리] 벽에 다리를 올리고 3분간 유지하여 하체에 쏠린 수분 순환시키기",
      "[가벼운 제자리 콩콩] 발뒤꿈치를 살짝 들고 가볍게 20회 뛰며 전신 림프 순환 시동 걸기"
    ]
  },
};

export default function App() {
  const [step, setStep] = useState('intro'); // intro, survey, result
  const [currentIdx, setCurrentIdx] = useState(0);
const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userInfo, setUserInfo] = useState({ name: '', birthdate: '', phone: '' });

  const isIntroValid = useMemo(() => {
    return userInfo.name.trim().length > 0 && 
           userInfo.birthdate.length > 0 && 
           userInfo.phone.trim().length >= 10;
  }, [userInfo]);

const handleAnswer = (val: number) => {
    setAnswers({ ...answers, [QUESTIONS[currentIdx].id]: val });
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const scoreData = useMemo(() => {
    const totals = { '기허': 0, '기역': 0, '기울': 0, '혈허': 0, '어혈': 0, '수체': 0 };
    const counts = { '기허': 0, '기역': 0, '기울': 0, '혈허': 0, '어혈': 0, '수체': 0 };

    QUESTIONS.forEach(q => {
      const val = answers[q.id] || 0;
      totals[q.category] += val * (q.weight / 10);
      counts[q.category] += 5 * (q.weight / 10);
    });

    return Object.keys(totals).map(cat => ({
      subject: cat,
      fullSubject: CATEGORY_INFO[cat].name,
      value: Math.round((totals[cat] / counts[cat]) * 100),
      fullMark: 100
    }));
  }, [answers]);

  const topType = useMemo(() => {
    return [...scoreData].sort((a, b) => b.value - a.value)[0];
  }, [scoreData]);

  const restart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setStep('intro');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="p-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Trophy className="text-green-600" size={40} />
              </div>
              <h1 className="text-2xl font-black mb-2 leading-tight text-slate-900">{APP_TITLE}</h1>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                해온한의원 MPS 클리닉 정밀 분석
              </p>
            </div>

            <div className="space-y-4 mb-10">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-1 uppercase tracking-wider">
                  <User size={12} /> 선수 성함
                </label>
                <input 
                  type="text"
                  placeholder="성함을 입력하세요"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-5 focus:border-green-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-1 uppercase tracking-wider">
                  <Calendar size={12} /> 생년월일
                </label>
                <input 
                  type="date"
                  value={userInfo.birthdate}
                  onChange={(e) => setUserInfo({...userInfo, birthdate: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-5 focus:border-green-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 flex items-center gap-1 uppercase tracking-wider">
                  <Phone size={12} /> 보호자 연락처
                </label>
                <input 
                  type="tel"
                  placeholder="010-0000-0000"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-5 focus:border-green-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                />
              </div>
            </div>

            <button 
              onClick={() => isIntroValid && setStep('survey')}
              disabled={!isIntroValid}
              className={`w-full font-bold py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${
                isIntroValid 
                ? "bg-slate-900 hover:bg-black text-white cursor-pointer" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              M-Part 진단 시작하기 <ChevronRight size={20} />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-6 tracking-tight font-medium">
              모든 정보를 입력해야 진단이 가능합니다.
            </p>
          </div>
        )}

        {/* Survey Step */}
        {step === 'survey' && (
          <div className="p-8">
            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">M-Part Survey</span>
                <span className="text-sm font-black text-slate-900">{currentIdx + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 ease-out" 
                  style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="min-h-[140px] flex items-center">
              <h2 className="text-xl font-bold leading-snug text-slate-900">
                "{QUESTIONS[currentIdx].text}"
              </h2>
            </div>

            <div className="space-y-3 mt-6 mb-8">
              {[
                { label: '전혀 아니에요', val: 1 },
                { label: '아닌 편이에요', val: 2 },
                { label: '보통이에요', val: 3 },
                { label: '그런 편이에요', val: 4 },
                { label: '매우 그래요', val: 5 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer(opt.val)}
                  className="w-full py-4 px-6 text-left rounded-2xl border-2 border-slate-50 hover:border-green-500 hover:bg-green-50 transition-all font-bold text-slate-600 hover:text-green-700 flex justify-between items-center group"
                >
                  {opt.label}
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-green-500 flex items-center justify-center transition-all bg-white">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

            {currentIdx > 0 && (
              <button 
                onClick={handleBack}
                className="w-full flex items-center justify-center gap-1 text-slate-400 font-bold text-sm py-2 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft size={16} /> 이전 문항으로 돌아가기
              </button>
            )}
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && (
          <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar bg-white">
            <div className="text-center mb-6 border-b border-slate-100 pb-6">
              <div className="flex flex-col gap-2 mb-4 items-center">
                <div className="inline-flex bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                  Integrated MPS Report
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200">
                    <User size={12} className="text-slate-500" />
                    <span className="text-[11px] font-black text-slate-700">{userInfo.name} 선수</span>
                  </div>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200">
                    <Calendar size={12} className="text-slate-500" />
                    <span className="text-[11px] font-black text-slate-700">{userInfo.birthdate}</span>
                  </div>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200">
                    <Phone size={12} className="text-slate-500" />
                    <span className="text-[11px] font-black text-slate-700">{userInfo.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Part M: Constitutional Tendency</p>
                <h3 className="text-3xl font-black mb-3" style={{ color: CATEGORY_INFO[topType.subject].color }}>
                  {CATEGORY_INFO[topType.subject].name}
                </h3>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {CATEGORY_INFO[topType.subject].desc}
                </p>
              </div>
            </div>

            {/* Part M: Detailed Chart */}
            <div className="h-64 w-full mb-6 bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={scoreData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }} />
                  <Radar
                    name="Constitution"
                    dataKey="value"
                    stroke={CATEGORY_INFO[topType.subject].color}
                    fill={CATEGORY_INFO[topType.subject].color}
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Strategic Advice Section */}
            <div className="space-y-6 mb-10">
              <h4 className="text-lg font-black flex items-center gap-2 mb-2 px-2">
                <ClipboardCheck size={20} className="text-green-600" />
                성향체질 맞춤 성장전략
              </h4>
              
              <div className="bg-orange-50 rounded-3xl border border-orange-100 overflow-hidden">
                <div className="px-5 py-4 bg-orange-100/50 flex items-center gap-2 text-orange-700 font-bold">
                  <Utensils size={18} /> 1. 맞춤 식단 전략
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-1.5 uppercase tracking-wider">
                      <Clock size={12} /> 평상시 (Routine)
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-orange-200">
                      {CATEGORY_INFO[topType.subject].diet.daily}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-1.5 uppercase tracking-wider">
                      <Zap size={12} /> 경기 당일 (경기 전)
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-orange-200">
                      {CATEGORY_INFO[topType.subject].diet.pre}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-1.5 uppercase tracking-wider">
                      <CheckCircle2 size={12} /> 경기 당일 (경기 후)
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-orange-200">
                      {CATEGORY_INFO[topType.subject].diet.post}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold">
                  <Moon size={18} /> 2. 수면 및 휴식 습관
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {CATEGORY_INFO[topType.subject].sleep}
                </p>
              </div>

              <div className="bg-yellow-50 p-5 rounded-3xl border border-yellow-100">
                <div className="flex items-center gap-2 mb-2 text-yellow-700 font-bold">
                  <Sun size={18} /> 3. 아침 루틴 습관
                </div>
                <div className="space-y-3">
                  {CATEGORY_INFO[topType.subject].morning.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-white/60 p-3 rounded-2xl border border-yellow-100">
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {item.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Integration Note for MPS */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 mb-10">
              <h5 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-green-600" />
                MPS 통합 리포트 안내
              </h5>
              <div className="space-y-4">
                <div className="flex items-start gap-3 opacity-100">
                  <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-xs font-black">M</div>
                  <div>
                    <p className="text-[11px] font-black text-slate-900 leading-tight">성향체질 분석 (완료)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">현재 리포트 결과가 포함되었습니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-slate-300 text-white flex items-center justify-center text-xs font-black">P</div>
                  <div>
                    <p className="text-[11px] font-black text-slate-900 leading-tight">부상위험도 분석 (대기)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">피지컬 데이터 측정이 필요합니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-slate-300 text-white flex items-center justify-center text-xs font-black">S</div>
                  <div>
                    <p className="text-[11px] font-black text-slate-900 leading-tight">성장단계 분석 (대기)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">초음파 기반 PHV 단계 판독이 필요합니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={restart}
              className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all mb-8"
            >
              <RotateCcw size={18} /> 테스트 다시하기
            </button>

            {/* Footer */}
            <div className="bg-slate-50 -mx-6 -mb-6 p-6 border-t border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-3">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Medical Notice</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-normal px-4">
                본 테스트 자료는 AI 기반의 해온 축구성장체질연구소(해온 K-MEDI 스포츠클리닉 X 리본코퍼레이션)의 데이터를 기반으로 생성되었으며, 상세한 상담과 MPS 통합 전략은 의료진의 직접 소통이 필요합니다.
              </p>
              <p className="text-[9px] text-slate-500 font-bold mt-4 tracking-tight">
                All right reserved 축구성장체질연구소
              </p>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
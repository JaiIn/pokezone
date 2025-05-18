import { Pokemon, PokemonListResponse, PokemonSpecies, Generation, GENERATIONS, EvolutionChain, Move, PokemonDetail } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// 한국어 포켓몬 이름 매핑 (주요 포켓몬들)
const KOREAN_NAMES: { [key: string]: string } = {
  // 1세대
  "bulbasaur": "이상해씨",
  "ivysaur": "이상해풀",
  "venusaur": "이상해꽃",
  "charmander": "파이리",
  "charmeleon": "리자드",
  "charizard": "리자몽",
  "squirtle": "꼬부기",
  "wartortle": "어니부기",
  "blastoise": "거북왕",
  "caterpie": "캐터피",
  "metapod": "단데기",
  "butterfree": "버터플",
  "weedle": "뿔충이",
  "kakuna": "딱충이",
  "beedrill": "독침붕",
  "pidgey": "구구",
  "pidgeotto": "피죤",
  "pidgeot": "피죤투",
  "rattata": "꼬렛",
  "raticate": "레트라",
  "spearow": "깨비참",
  "fearow": "깨비드릴조",
  "ekans": "아보",
  "arbok": "아보크",
  "pikachu": "피카츄",
  "raichu": "라이츄",
  "sandshrew": "모래두지",
  "sandslash": "고지",
  "nidoran-f": "니드런♀",
  "nidorina": "니드리나",
  "nidoqueen": "니드퀸",
  "nidoran-m": "니드런♂",
  "nidorino": "니드리노",
  "nidoking": "니드킹",
  "clefairy": "삐삐",
  "clefable": "픽시",
  "vulpix": "식스테일",
  "ninetales": "나인테일",
  "jigglypuff": "푸린",
  "wigglytuff": "푸크린",
  "zubat": "주뱃",
  "golbat": "골뱃",
  "oddish": "뚜벅쵸",
  "gloom": "냄새꼬",
  "vileplume": "라플레시아",
  "paras": "파라스",
  "parasect": "파라섹트",
  "venonat": "콘팡",
  "venomoth": "도나리",
  "diglett": "디그다",
  "dugtrio": "닥트리오",
  "meowth": "나옹",
  "persian": "페르시온",
  "psyduck": "고라파덕",
  "golduck": "골덕",
  "mankey": "망키",
  "primeape": "성원숭",
  "growlithe": "가디",
  "arcanine": "윈디",
  "poliwag": "발챙이",
  "poliwhirl": "슈륙챙이",
  "poliwrath": "강챙이",
  "abra": "케이시",
  "kadabra": "윤겔라",
  "alakazam": "후딘",
  "machop": "알통몬",
  "machoke": "근육몬",
  "machamp": "괴력몬",
  "bellsprout": "모다피",
  "weepinbell": "우츠동",
  "victreebel": "우츠보트",
  "tentacool": "왕눈해",
  "tentacruel": "독파리",
  "geodude": "꼬마돌",
  "graveler": "데구리",
  "golem": "딱구리",
  "ponyta": "포니타",
  "rapidash": "날쌩마",
  "slowpoke": "야돈",
  "slowbro": "야드란",
  "magnemite": "코일",
  "magneton": "레어코일",
  "farfetchd": "파오리",
  "doduo": "두두",
  "dodrio": "두트리오",
  "seel": "쥬쥬",
  "dewgong": "쥬레곤",
  "grimer": "질퍽이",
  "muk": "질뻐기",
  "shellder": "셀러",
  "cloyster": "파르셀",
  "gastly": "고오스",
  "haunter": "고우스트",
  "gengar": "팬텀",
  "onix": "롱스톤",
  "drowzee": "슬리프",
  "hypno": "슬리퍼",
  "krabby": "크랩",
  "kingler": "킹크랩",
  "voltorb": "찌리리공",
  "electrode": "붐볼",
  "exeggcute": "아라리",
  "exeggutor": "나시",
  "cubone": "탕구리",
  "marowak": "텅구리",
  "hitmonlee": "시라소몬",
  "hitmonchan": "홍수몬",
  "lickitung": "내루미",
  "koffing": "또가스",
  "weezing": "또도가스",
  "rhyhorn": "뿔카노",
  "rhydon": "코뿌리",
  "chansey": "럭키",
  "tangela": "덩쿠리",
  "kangaskhan": "캥카",
  "horsea": "쏘드라",
  "seadra": "시드라",
  "goldeen": "콘치",
  "seaking": "왕콘치",
  "staryu": "별가사리",
  "starmie": "아쿠스타",
  "mr-mime": "마임맨",
  "scyther": "스라크",
  "jynx": "루주라",
  "electabuzz": "에레브",
  "magmar": "마그마",
  "pinsir": "쁘사이저",
  "tauros": "켄타로스",
  "magikarp": "잉어킹",
  "gyarados": "갸라도스",
  "lapras": "라프라스",
  "ditto": "메타몽",
  "eevee": "이브이",
  "vaporeon": "샤미드",
  "jolteon": "쥬피썬더",
  "flareon": "부스터",
  "porygon": "폴리곤",
  "omanyte": "암나이트",
  "omastar": "암스타",
  "kabuto": "투구",
  "kabutops": "투구푸스",
  "aerodactyl": "프테라",
  "snorlax": "잠만보",
  "articuno": "프리져",
  "zapdos": "썬더",
  "moltres": "파이어",
  "dratini": "미뇽",
  "dragonair": "신뇽",
  "dragonite": "망나뇽",
  "mewtwo": "뮤츠",
  "mew": "뮤",
  
  // 2세대 주요 포켓몬들
  "chikorita": "치코리타",
  "bayleef": "베이리프",
  "meganium": "메가니움",
  "cyndaquil": "브케인",
  "quilava": "마그케인",
  "typhlosion": "블레이범",
  "totodile": "리아코",
  "croconaw": "엘리게이",
  "feraligatr": "장크로다일",
  "sentret": "꼬리선",
  "furret": "다꼬리",
  "hoothoot": "부우부",
  "noctowl": "야부엉",
  "ledyba": "레디바",
  "ledian": "레디안",
  "spinarak": "페이검",
  "ariados": "아리아도스",
  "crobat": "크로뱃",
  "chinchou": "초라기",
  "lanturn": "랜턴",
  "pichu": "피츄",
  "cleffa": "삐",
  "igglybuff": "푸푸린",
  "togepi": "토게피",
  "togetic": "토게틱",
  "natu": "네이티",
  "xatu": "네이티오",
  "mareep": "메리프",
  "flaaffy": "보송송",
  "ampharos": "전룡",
  "bellossom": "아르코",
  "marill": "마릴",
  "azumarill": "마릴리",
  "sudowoodo": "꼬지모",
  "politoed": "왕구리",
  "hoppip": "통통코",
  "skiploom": "두리코",
  "jumpluff": "솜솜코",
  "aipom": "에이팜",
  "sunkern": "해너츠",
  "sunflora": "해루미",
  "yanma": "얀얀마",
  "wooper": "우파",
  "quagsire": "누오",
  "espeon": "에브이",
  "umbreon": "블래키",
  "murkrow": "니로우",
  "slowking": "야도킹",
  "misdreavus": "무우마",
  "unown": "안농",
  "wobbuffet": "마자용",
  "girafarig": "키링키",
  "pineco": "피콘",
  "forretress": "쏘콘",
  "dunsparce": "노고치",
  "gligar": "글라이거",
  "steelix": "강철톤",
  "snubbull": "블루",
  "granbull": "그랑블루",
  "qwilfish": "침바루",
  "scizor": "핫삼",
  "shuckle": "단단지",
  "heracross": "헤라크로스",
  "sneasel": "포푸니",
  "teddiursa": "깜지곰",
  "ursaring": "링곰",
  "slugma": "마그마그",
  "magcargo": "마그카르고",
  "swinub": "꾸꾸리",
  "piloswine": "메꾸리",
  "corsola": "코산호",
  "remoraid": "총어",
  "octillery": "대포무노",
  "delibird": "딜리버드",
  "mantine": "만타인",
  "skarmory": "무장조",
  "houndour": "델빌",
  "houndoom": "헬가",
  "kingdra": "킹드라",
  "phanpy": "코코리",
  "donphan": "코리갑",
  "porygon2": "폴리곤2",
  "stantler": "노라키",
  "smeargle": "루브도",
  "tyrogue": "배루키",
  "hitmontop": "카포에라",
  "smoochum": "뽀뽀라",
  "elekid": "에레키드",
  "magby": "마그비",
  "miltank": "밀탱크",
  "blissey": "해피너스",
  "raikou": "라이코",
  "entei": "앤테이",
  "suicune": "스이쿤",
  "larvitar": "애버라스",
  "pupitar": "데기라스",
  "tyranitar": "마기라스",
  "lugia": "루기아",
  "ho-oh": "칠색조",
  "celebi": "세레비",
};

// 한국어 기술명 매핑
const KOREAN_MOVE_NAMES: { [key: string]: string } = {
  // 물리 공격 기술
  "tackle": "몸통박치기",
  "scratch": "할퀴기",
  "pound": "두드리기",
  "slam": "내동댕이치기",
  "vine-whip": "덩굴채찍",
  "razor-leaf": "면도날잎",
  "bite": "물기",
  "thrash": "난동부리기",
  "cut": "자르기",
  "fury-attack": "연속자르기",
  "peck": "쪼기",
  "drill-peck": "드릴쪼기",
  "wing-attack": "날개치기",
  "fly": "공중날기",
  "body-slam": "몸통박치기",
  "wrap": "조이기",
  "take-down": "돌진",
  "double-edge": "이판사판박치기",
  "tail-whip": "꼬리흔들기",
  "poison-sting": "독침",
  "pin-missile": "미사일바늘",
  "leer": "째려보기",
  "quick-attack": "전광석화",
  "rage": "분노",
  "horn-attack": "뿔찌르기",
  "fury-swipes": "연속할퀴기",
  "slash": "베기",
  "guillotine": "가위자르기",
  "karate-chop": "태권당수",
  "comet-punch": "연속펀치",
  "mega-punch": "메가펀치",
  "pay-day": "돈던지기",
  "fire-punch": "불꽃펀치",
  "ice-punch": "냉동펀치",
  "thunder-punch": "번개펀치",
  "seismic-toss": "지구던지기",
  "strength": "괴력",
  "absorb": "흡수",
  "mega-drain": "메가드레인",
  "leech-seed": "씨뿌리기",
  "growth": "성장",
  "rock-throw": "바위던지기",
  "earthquake": "지진",
  "fissure": "균열",
  "dig": "구멍파기",
  "toxic": "맹독",
  "confusion": "염동력",
  "psychic": "사이코키네시스",
  "hypnosis": "최면술",
  "meditate": "요가포즈",
  "agility": "고속이동",
  "teleport": "순간이동",
  "night-shade": "나이트헤드",
  "mimic": "흙내내기",
  "screech": "째렁째렁",
  "double-team": "분신",
  "recover": "자기회복",
  "harden": "단단해지기",
  "minimize": "작아지기",
  "defense-curl": "웅크리기",
  "barrier": "배리어",
  "light-screen": "빛의장막",
  "haze": "흑안개",
  "reflect": "리플렉터",
  "focus-energy": "기합모으기",
  "bide": "참기",
  "metronome": "손가락흔들기",
  "mirror-move": "따라하기",
  "self-destruct": "자폭",
  "egg-bomb": "알폭탄",
  "lick": "혀로핡기",
  "smog": "스모그",
  "sludge": "오니",
  "bone-club": "뼈다귀치기",
  "fire-blast": "대문자불꽃",
  "waterfall": "폭포오르기",
  "clamp": "집게압박",
  "swift": "스피드스타",
  "skull-bash": "로켓박치기",
  "spike-cannon": "가시대포",
  "constrict": "단단조이기",
  "amnesia": "깜빡하기",
  "kinesis": "염력",
  "soft-boiled": "알낳기",
  "hi-jump-kick": "무릎차기",
  "glare": "뱀눈초리",
  "dream-eater": "꿈먹기",
  "poison-gas": "독가스",
  "barrage": "구슬던지기",
  "leech-life": "흡혈",
  "lovely-kiss": "천사의키스",
  "sky-attack": "공중날기공격",
  "transform": "변신",
  "bubble": "거품",
  "dizzy-punch": "현기증펀치",
  "spore": "버섯포자",
  "flash": "플래시",
  "psywave": "사이코웨이브",
  "splash": "튀어오르기",
  "acid-armor": "용해",
  "crabhammer": "게집게해머",
  "explosion": "대폭발",
  "bonemerang": "뼈다귀부메랑",
  "rest": "잠자기",
  "rock-slide": "암석낙하",
  "hyper-fang": "필살앞니",
  "sharpen": "칼날세우기",
  "conversion": "텍스처",
  "tri-attack": "트라이어택",
  "super-fang": "분쇄앞니",
  "substitute": "대타출동",
  "struggle": "발버둥",
  "sketch": "스케치",
  "triple-kick": "트리플킥",
  "thief": "도둑질",
  "spider-web": "거미줄",
  "mind-reader": "심안",
  "nightmare": "악몽",
  "flame-wheel": "불꽃바퀴",
  "snore": "코골기",
  "curse": "저주",
  "flail": "발버둥치기",
  "conversion-2": "텍스처2",
  "aeroblast": "에어로블라스트",
  "cotton-spore": "솜포자",
  "reversal": "기사회생",
  "spite": "원한",
  "powder-snow": "가루눈",
  "protect": "방어",
  "mach-punch": "마하펀치",
  "scary-face": "무서운얼굴",
  "faint-attack": "속임수",
  "sweet-kiss": "달콤한키스",
  "belly-drum": "배북",
  "sludge-bomb": "오니폭탄",
  "mud-slap": "진흙던지기",
  "octazooka": "옥타포스",
  "spikes": "압정뿌리기",
  "zap-cannon": "전자포",
  "foresight": "식별",
  "destiny-bond": "길동무",
  "perish-song": "멸망의노래",
  "icy-wind": "얼음바람",
  "detect": "판별",
  "bone-rush": "뼈다귀러시",
  "lock-on": "록온",
  "outrage": "역린",
  "sandstorm": "모래바람",
  "giga-drain": "기가드레인",
  "endure": "버티기",
  "charm": "애교부리기",
  "rollout": "구르기",
  "false-swipe": "칼등치기",
  "swagger": "잘난척하기",
  "milk-drink": "우유마시기",
  "spark": "스파크",
  "fury-cutter": "연속베기",
  "steel-wing": "강철날개",
  "mean-look": "검은눈빛",
  "attract": "헤롱헤롱",
  "sleep-talk": "잠꼬대",
  "heal-bell": "치유방울",
  "return": "보은",
  "present": "선물",
  "frustration": "화풀이",
  "safeguard": "신비의부적",
  "pain-split": "아픔나누기",
  "sacred-fire": "신성한불꽃",
  "magnitude": "매그니튜드",
  "dynamic-punch": "폭발펀치",
  "megahorn": "메가혼",
  "dragon-breath": "용의숨결",
  "baton-pass": "배턴터치",
  "encore": "앙코르",
  "pursuit": "따라가때리기",
  "rapid-spin": "고속회전",
  "sweet-scent": "달콤한향기",
  "iron-tail": "아이언테일",
  "metal-claw": "메탈크로우",
  "vital-throw": "생명투척",
  "morning-sun": "아침햇살",
  "synthesis": "광합성",
  "moonlight": "월광",
  "hidden-power": "숨겨진힘",
  "cross-chop": "크로스촙",
  "twister": "회오리",
  "rain-dance": "비바라기",
  "sunny-day": "쾌청",
  "crunch": "깨물어부수기",
  "mirror-coat": "미러코트",
  "psych-up": "자기암시",
  "extreme-speed": "신속",
  "ancient-power": "원시의힘",
  "shadow-ball": "섀도볼",
  "future-sight": "미래예지",
  "rock-smash": "바위깨기",
  "whirlpool": "바다회오리",
  "beat-up": "집단구타"
};

export class PokemonService {
  static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('포켓몬 목록을 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  static async getPokemonByGeneration(generation: Generation, limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    if (generation.id === 0) {
      // 전체 세대
      return this.getPokemonList(limit, offset);
    }
    
    const startId = generation.startId + offset;
    const endId = Math.min(generation.endId, startId + limit - 1);
    
    const results = [];
    for (let i = startId; i <= endId; i++) {
      results.push({
        name: `pokemon-${i}`,
        url: `${BASE_URL}/pokemon/${i}/`
      });
    }
    
    return {
      count: generation.endId - generation.startId + 1,
      next: endId < generation.endId ? `next-page` : null,
      previous: offset > 0 ? `prev-page` : null,
      results
    };
  }

  static async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error('포켓몬 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  static async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) {
      throw new Error('포켓몬 종족 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  static async searchPokemon(query: string): Promise<Pokemon | null> {
    try {
      return await this.getPokemon(query.toLowerCase());
    } catch (error) {
      return null;
    }
  }

  static getKoreanName(pokemon: Pokemon, species?: PokemonSpecies | null): string {
    // 1. 미리 정의된 한국어 이름이 있는지 확인
    if (KOREAN_NAMES[pokemon.name]) {
      return KOREAN_NAMES[pokemon.name];
    }
    
    // 2. species 데이터가 있으면 한국어 이름 찾기
    if (species) {
      const koreanName = species.names.find(name => name.language.name === 'ko');
      if (koreanName) {
        return koreanName.name;
      }
    }
    
    // 3. 없으면 영어 이름 그대로 반환 (첫 글자 대문자)
    return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  }

  static getKoreanFlavorText(species: PokemonSpecies): string {
    const koreanEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'ko'
    );
    return koreanEntry 
      ? koreanEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
      : '설명을 찾을 수 없습니다.';
  }

  static formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  static getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: 'type-normal',
      fighting: 'type-fighting',
      flying: 'type-flying',
      poison: 'type-poison',
      ground: 'type-ground',
      rock: 'type-rock',
      bug: 'type-bug',
      ghost: 'type-ghost',
      steel: 'type-steel',
      fire: 'type-fire',
      water: 'type-water',
      grass: 'type-grass',
      electric: 'type-electric',
      psychic: 'type-psychic',
      ice: 'type-ice',
      dragon: 'type-dragon',
      dark: 'type-dark',
      fairy: 'type-fairy',
    };
    return typeColors[type] || 'type-normal';
  }

  static getTypeKoreanName(type: string): string {
    const typeNames: { [key: string]: string } = {
      normal: '노말',
      fighting: '격투',
      flying: '비행',
      poison: '독',
      ground: '땅',
      rock: '바위',
      bug: '벌레',
      ghost: '고스트',
      steel: '강철',
      fire: '불꽃',
      water: '물',
      grass: '풀',
      electric: '전기',
      psychic: '에스퍼',
      ice: '얼음',
      dragon: '드래곤',
      dark: '악',
      fairy: '페어리',
    };
    return typeNames[type] || type;
  }

  static getStatKoreanName(stat: string): string {
    const statNames: { [key: string]: string } = {
      hp: 'HP',
      attack: '공격',
      defense: '방어',
      'special-attack': '특수공격',
      'special-defense': '특수방어',
      speed: '스피드',
    };
    return statNames[stat] || stat;
  }

  static getGenerationByPokemonId(id: number): Generation | null {
    return GENERATIONS.find(gen => 
      gen.id !== 0 && id >= gen.startId && id <= gen.endId
    ) || null;
  }

  // 진화 체인 정보 가져오기
  static async getEvolutionChain(url: string): Promise<EvolutionChain> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('진화 체인 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  // 기술 정보 가져오기
  static async getMove(nameOrId: string | number): Promise<Move> {
    const response = await fetch(`${BASE_URL}/move/${nameOrId}`);
    if (!response.ok) {
      throw new Error('기술 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  // 포켓몬 상세 정보 가져오기 (진화체인 + 기술 포함)
  static async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    const pokemon = await this.getPokemon(nameOrId);
    const species = await this.getPokemonSpecies(pokemon.id);
    
    let evolutionChain: EvolutionChain | undefined;
    
    try {
      evolutionChain = await this.getEvolutionChain(species.evolution_chain.url);
    } catch (error) {
      console.warn('진화 체인 정보를 가져오는데 실패했습니다:', error);
    }
    
    return {
      ...pokemon,
      species,
      evolutionChain
    };
  }

  // 진화 체인에서 포켓몬 이름들 추출
  static extractEvolutionChain(chain: EvolutionChain): string[][] {
    const evolutionStages: string[][] = [];
    
    const extractFromChain = (detail: any, stage: number = 0) => {
      if (!evolutionStages[stage]) {
        evolutionStages[stage] = [];
      }
      evolutionStages[stage].push(detail.species.name);
      
      if (detail.evolves_to && detail.evolves_to.length > 0) {
        detail.evolves_to.forEach((evolution: any) => {
          extractFromChain(evolution, stage + 1);
        });
      }
    };
    
    extractFromChain(chain.chain);
    return evolutionStages;
  }

  // 기술 학습 방법 한국어 번역
  static getLearnMethodKoreanName(method: string): string {
    const methodNames: { [key: string]: string } = {
      'level-up': '레벨업',
      'egg': '알',
      'tutor': '기술가르침',
      'machine': '기술머신',
      'stadium-surfing-pikachu': '특별',
      'light-ball-egg': '특별',
      'colosseum-purification': '특별',
      'xd-shadow': '특별',
      'xd-purification': '특별',
      'form-change': '폼체인지'
    };
    return methodNames[method] || method;
  }

  // 기술 한국어 이름 가져오기
  static getMoveKoreanName(move: Move): string {
    const koreanName = move.names.find(name => name.language.name === 'ko');
    if (koreanName) {
      return koreanName.name;
    }
    
    // API에서 한국어 이름을 찾을 수 없으면 미리 정의된 매핑 사용
    if (KOREAN_MOVE_NAMES[move.name]) {
      return KOREAN_MOVE_NAMES[move.name];
    }
    
    // 둘 다 없으면 영어 이름을 보기 좋게 변환
    return move.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 영어 기술명을 한국어로 변환 (간단한 버전)
  static getSimpleMoveKoreanName(englishName: string): string {
    if (KOREAN_MOVE_NAMES[englishName]) {
      return KOREAN_MOVE_NAMES[englishName];
    }
    
    // 영어 이름을 보기 좋게 변환
    return englishName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 물리/특수/변화 분류 한국어 번역
  static getDamageClassKoreanName(damageClass: string): string {
    const classNames: { [key: string]: string } = {
      'physical': '물리',
      'special': '특수',
      'status': '변화'
    };
    return classNames[damageClass] || damageClass;
  }

  // 특성 한국어 이름 번역
  static getAbilityKoreanName(abilityName: string): string {
    const abilityNames: { [key: string]: string } = {
      'overgrow': '신록',
      'chlorophyll': '엽렉소',
      'blaze': '맹화',
      'solar-power': '태양발전',
      'torrent': '격류',
      'rain-dish': '비받이',
      'shield-dust': '비늘가루',
      'run-away': '도주',
      'keen-eye': '날카로운눈',
      'tangled-feet': '비비꺼리',
      'big-pecks': '가슴과영',
      'guts': '근성',
      'swarm': '벌레의예감',
      'sniper': '스나이파',
      'intimidate': '위협',
      'moxie': '자신과잘',
      'sand-veil': '모래숨기',
      'sand-rush': '모래플력',
      'sand-force': '모래의힙',
      'poison-point': '독가시',
      'rivalry': '투쟁심',
      'sheer-force': '원하이핐필',
      'cute-charm': '매력적인몸',
      'magic-guard': '매직가드',
      'unaware': '천연',
      'flash-fire': '저가받기',
      'drought': '끄무',
      'inner-focus': '정신력',
      'regenerator': '재생력',
      'magic-bounce': '매직미러',
      'static': '정전기',
      'lightning-rod': '피놰침',
      'sturdy': '단단함',
      'rock-head': '바위머리',
      'weak-armor': '깜지는갑옆',
      'thick-fat': '두꺼운지방',
      'oblivious': '둔감',
      'own-tempo': '마이페이스',
      'synchronize': '싱크로',
      'trace': '트레이스',
      'telepathy': '텔레파시',
      'steadfast': '불굴의마음',
      'justified': '정의의마음',
      'sand-stream': '모래날리기',
      'water-absorb': '저수',
      'damp': '습기',
      'swift-swim': '유영',
      'clear-body': '클리어바디',
      'liquid-ooze': '액체끗',
      'rock-blast': '보이타',
      'adaptability': '적응력',
      'technician': '타이e홀',
      'skill-link': '스킬링크',
      'pickup': '죍기',
      'gluttony': '대식가',
      'unburden': '가볍함',
      'hustle': '다짐',
      'serene-grace': '캜럹',
      'natural-cure': '자연회복'
    };
    return abilityNames[abilityName] || abilityName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}

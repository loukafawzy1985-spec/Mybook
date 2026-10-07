import {
  getCoverIllustration,
  getPage1Illustration,
  getPage2Illustration,
  getPage3Illustration,
  getPage4Illustration,
  getPage5Illustration
} from '../utils/illustrations';

export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface PageQuestion {
  type: 'multiple' | 'truefalse' | 'matching' | 'open';
  text: string;
  options?: QuestionOption[];
  pairs?: MatchingPair[];
  answers?: string[];
}

export interface StoryPage {
  id: string;
  text: string;
  prompt: string;
  prompt2?: string;
  caption?: string;
  layout?: 'standard' | 'fullPicture' | 'caption' | 'twoPictures' | 'textOnly' | 'media';
  question?: PageQuestion;
}

export interface CoverTitle {
  enabled: boolean;
  text: string;
  style: 'bubble' | 'adventure' | 'arcade' | 'magic' | 'elegant' | 'comic';
  effect: 'outline' | '3d' | 'shadow' | 'glow' | 'none';
  color: string;
  accent: string;
  x: number;
  y: number;
  w: number;
  size: number;
  rotation?: number;
  align?: 'left' | 'center' | 'right';
}

export interface StoryData {
  title: string;
  level: string;
  dir: 'rtl' | 'ltr';
  coverPrompt: string;
  endPrompt: string;
  coverTitle: CoverTitle;
  coverTitles: CoverTitle[];
  images: Record<string, string>;
  notes: Record<string, string>;
  marks: Record<string, Record<number, string>>;
  embeds: Record<string, Array<{ type: string; url: string; label: string }>>;
  pages: StoryPage[];
  settings: {
    fontScale: number;
    dyslexic: boolean;
    contrast: boolean;
    reduceMotion: boolean;
    speechRate: number;
  };
  audio: {
    pages: Record<string, string>;
    music: string;
    volume: number;
  };
  studentMode: boolean;
  titleImage: {
    src: string;
    x: number;
    y: number;
    w: number;
    rotation: number;
  };
}

export function getDefaultStoryData(): StoryData {
  const coverImg = getCoverIllustration();
  const page1Img = getPage1Illustration();
  const page2Img = getPage2Illustration();
  const page3Img = getPage3Illustration();
  const page4Img = getPage4Illustration();
  const page5Img = getPage5Illustration();

  return {
    title: 'معاذ وسر النظافة والنشاط',
    level: 'المستوى: الناشئة (8 - 12 سنة) · القيم والسلوك الإيجابي',
    dir: 'rtl',
    coverPrompt: 'صورة غلاف ملونة للأطفال: الطفل معاذ (10 سنوات) بملامح عربية مبتسمة وشعر بني، يرتدي ملابس رياضية ناصعة ويحمل كرة قدم تحت ذراعه، وبجانبه فقاعات صابون برّاقة ومسجد جميل في خلفية مشمسة تشع بالنور والنظافة.',
    endPrompt: 'صورة نهاية القصة: معاذ وجده في باحة المسجد الكبير بعد صلاة الجمعة، يرتديان ثياباً بيضاء ناصعة ومبتسمان بالصحة والنشاط، وحولهما أزهار نضرة وأشجار نخيل في يوم مشمس.',
    coverTitle: {
      enabled: true,
      text: 'معاذ وسر النظافة',
      style: 'bubble',
      effect: 'outline',
      color: '#ffffff',
      accent: '#0f172a',
      x: 6,
      y: 4,
      w: 88,
      size: 40,
      rotation: 0,
      align: 'center',
    },
    coverTitles: [
      {
        enabled: true,
        text: 'معاذ وسر النظافة',
        style: 'bubble',
        effect: 'outline',
        color: '#ffffff',
        accent: '#0f172a',
        x: 6,
        y: 4,
        w: 88,
        size: 40,
        rotation: 0,
        align: 'center',
      },
      {
        enabled: true,
        text: 'بطل الملعب وطهارة الجمعة',
        style: 'elegant',
        effect: 'shadow',
        color: '#fef08a',
        accent: '#1e293b',
        x: 12,
        y: 16,
        w: 76,
        size: 20,
        rotation: 0,
        align: 'center',
      }
    ],
    images: {
      cover: coverImg,
      page1: page1Img,
      page2: page2Img,
      page3: page3Img,
      page4: page4Img,
      page5: page5Img,
      end: page5Img,
    },
    notes: {},
    marks: {},
    embeds: {},
    pages: [
      {
        id: 'page1',
        text: 'كانَ مُعاذٌ فَتًى نَشِيطًا يَبْلُغُ مِنَ العُمُرِ عَشْرَ سَنَواتٍ، يَعْشَقُ كُرَةَ القَدَمِ حَتَّى كَادَ لا يُفارِقُها أَبَدًا.\nيَقْضِي سَاعاتِ العَصْرِ كُلَّها فِي مَلْعَبِ الحَيِّ، يُراوِغُ ويُسَدِّدُ الأَهْدافَ بِحَماسٍ بَيْنَ أَصْدِقائِهِ.\nوعِنْدَما يَنْتَهِي اللَّعِبُ، يَعُودُ إِلَى البَيْتِ فَرِحًا حامِلاً كُرَتَهُ… ولَكِنْ كانَتْ يَداهُ وقَدَماهُ مُلَطَّخَتَيْنِ بِالأَتْرِبَةِ وبِقَاعِ الطِّينِ دُونَ أَنْ يَهْتَمَّ بِذلِكَ!',
        prompt: 'معاذ (10 سنوات) يلعب كرة القدم بحماس مع أصدقائه في ملعب الحي الترابي، يركل الكرة بمهارة، وتظهر على يديه وركبتيه آثار التراب والغبار وسط أشعة الشمس الذهبية.',
        caption: 'معاذ يركض في الملعب الترابي بمهارة وحيوية متناسياً غبار اللعب.',
        layout: 'standard',
        question: {
          type: 'multiple',
          text: 'كم يبلغ عمر معاذ وما هي لعبته المفضلة التي يقضي فيها وقته؟',
          options: [
            { id: 'أ', text: 'عمره 7 سنوات، وهوايته السباحة.', correct: false },
            { id: 'ب', text: 'عمره 10 سنوات، وهوايته كرة القدم.', correct: true },
            { id: 'ج', text: 'عمره 12 سنة، وهوايته الرسم.', correct: false }
          ]
        }
      },
      {
        id: 'page2',
        text: 'بِمُجَرَّدِ أَنْ وَطِئَتْ قَدَما مُعاذٍ عَتبَةَ المَنزِلِ، فاحَتْ رائِحَةُ الطَّعامِ الشَّهِيِّ، فَاشْتَدَّ عَلَيْهِ الجُوعُ.\nانْدَفَعَ مُباشَرَةً نَحْوَ مائِدَةِ الطَّعامِ، ومَدَّ يَدَيْهِ المُغَبَّرَتَيْنِ لِيَتَناوَلَ قِطْعَةَ الخُبْزِ والشَّطِيرَةَ دُونَ أَنْ يَغْسِلَهُما!\nنادَتْهُ أُمُّهُ بِعَطْفٍ وحَزْمٍ: «يا مُعاذُ، تَوَقَّفْ! اغْسِلْ يَدَيْكَ أَوَّلاً بِالماءِ والصّابُونِ!». فأَجابَ بِعَجَلَةٍ: «أَنا جائِعٌ جِدًّا يا أُمِّي، ويَدايَ لا تَبْدُوانِ مُتَّسِخَتَيْنِ!»، ثُمَّ أَكَلَ بِشَراهَةٍ، ومَسَحَ يَدَيْهِ فِي طَرَفِ قَمِيصِهِ وانْصَرَفَ دون غسلهما بعد الأكل أيضاً!',
        prompt: 'معاذ يجري إلى مائدة الطعام في المطبخ ليمد يده المتسخة بالتراب نحو الطعام اللذيذ، بينما أمه تنظر إليه بحرص وتطلب منه غسل يديه أولاً.',
        caption: 'مدّ معاذ يده المتسخة إلى الطعام متعللاً بشدة الجوع!',
        layout: 'standard',
        question: {
          type: 'truefalse',
          text: 'صح أم خطأ: تصرّف معاذ بتناول الطعام مباشرة بعد اللعب دون غسل يديه تصرّف صحي وسليم؟',
          options: [
            { id: 'أ', text: 'خطأ؛ فالأيدي الملوثة تنقل الجراثيم غير المرئية إلى الطعام والمعدة.', correct: true },
            { id: 'ب', text: 'صح؛ لأن الشعور بالجوع يبرر الأكل السريع دون غسيل.', correct: false }
          ]
        }
      },
      {
        id: 'page3',
        text: 'فِي مُنْتَصَفِ تِلْكَ اللَّيْلَةِ، اسْتَيْقَظَ مُعاذٌ يَشْكُو أَلَمًا شَدِيدًا فِي بَطْنِهِ، فَلَمْ يَسْتَطِعِ النَّوْمَ.\nعِندَ الصَّباحِ، فَحَصَهُ الطَّبِيبُ ثُمَّ قالَ مُبْتَسِمًا: «يا بَطَلَ الكُرَةِ، إِنَّ كُرَةَ القَدَمِ رِياضَةٌ مُمْتازَةٌ، ولَكِنَّ التُّرابَ يَحْمِلُ مَلايِينَ الجَراثِيمِ الخَفِيَّةِ الَّتِي انْتَقَلَتْ مِنْ يَدَيْكَ إِلَى مَعِدَتِكَ!». ثم أَمَرَهُ بِقاعِدَةِ الذَّهَبِ:\n«غَسْلُ اليَدَيْنِ جَيِّدًا بِالماءِ الجارِي والصّابُونِ لِمُدَّةِ 20 ثانِيَةً كَامِلَةً، وفَرْكُ بَيْنَ الأَصابِعِ والأَظافِرِ قَبْلَ الطَّعامِ وبَعْدَهُ، هُوَ دِرْعُكَ الحَصِينُ ضِدَّ المَرَضِ».\nوقَفَ مُعاذٌ أَمامَ المَغْسَلَةِ مُطَبِّقًا النَّصِيحَةَ، ورَأَى رَغْوَةَ الصّابُونِ تُزِيلُ كُلَّ أَثَرٍ لِلأَوْساخِ.',
        prompt: 'معاذ يقف أمام حوض المغسلة المشرق ويتعلم غسل يديه بالصابون ورغوة الفقاعات المنعشة بابتسامة وعزم، وتظهر فقاعات تلمع بالنظافة.',
        caption: 'معاذ يتعلم غسل يديه بالصابون لمدة 20 ثانية لحماية صحته.',
        layout: 'standard',
        question: {
          type: 'matching',
          text: 'صِلْ بَيْنَ العادَةِ الصِّحِّيَّةِ وفائِدَتِها المُباشِرَةِ:',
          pairs: [
            { left: 'غسل اليدين بالصابون 20 ثانية', right: 'القضاء التام على الجراثيم والميكروبات' },
            { left: 'غسل اليدين قبل الأكل', right: 'حماية المعدة والجهاز الهضمي من التلوث' },
            { left: 'غسل اليدين بعد الأكل', right: 'إزالة بقايا الطعام والدهون والروائح' },
            { left: 'تقليم الأظافر بانتظام', right: 'منع تجمع الأوساخ تحت الأظافر' }
          ]
        }
      },
      {
        id: 'page4',
        text: 'أَشْرَقَ صَباحُ يَوْمِ الجُمُعَةِ المُبارَكِ، وتَذَكَّرَ مُعاذٌ كَلِماتِ جَدِّهِ الحَبِيبِ: «يَوْمُ الجُمُعَةِ هُوَ عِيدُ الأُسْبُوعِ لِلْمُسْلِمِينَ، ومِنْ سُنَّةِ نَبِيِّنا الكَرِيمِ ﷺ الاسْتِحْمامُ (الغُسْلُ) والتَّطَهُّرُ، وتَقْلِيمُ الأَظافِرِ، والاسْتِياكُ، ولُبْسُ أَنْظَفِ الثِّيابِ البَيْضاءِ والتَّطَيُّبُ بِالمِسْكِ ورَوائِحِ العِطْرِ».\nدَخَلَ مُعاذٌ فاسْتَحَمَّ بِالماءِ الدّافِئِ المُنْعِشِ، ونَظَّفَ أَسْنانَهُ بِالسِّواكِ، وقَصَّ أَظافِرَهُ المُرَتَّبَةَ.\nارْتَدَى ثَوْبَهُ الأَبْيَضَ النَّقِيَّ ووَضَعَ قَطَراتٍ مِنْ عِطْرِ العُودِ الفَوّاحِ. نَظَرَ إِلَى المِرْآةِ فَشَعَرَ بانْتِعاشٍ فائِقٍ وسَعادَةٍ غَمَرَتْ قَلْبَهُ!',
        prompt: 'معاذ يقف أمام المرآة في غرفته الأنيقة بعد الاستحمام، يرتدي ثوباً أبيض ناصعاً ومكوياً، يبتسم بتألق وهو يضع قطرات من العطر، مستعداً ليوم الجمعة.',
        caption: 'معاذ يستعد ليوم الجمعة بالغسل والتطهر ولبس الثياب البيضاء والتطيب.',
        layout: 'standard',
        question: {
          type: 'open',
          text: 'ما هي آداب وسنن النظافة والتطهر التي حَرَصَ عليها معاذ استعداداً لصلاة الجمعة؟',
          answers: ['الاستحمام', 'الغسل', 'التطهر', 'السواك', 'تقليم الاظافر', 'الثياب البيضاء', 'التطيب', 'العطر']
        }
      },
      {
        id: 'page5',
        text: 'مَشَى مُعاذٌ بِجانِبِ جَدِّهِ الوَقُورِ نَحْوَ المَسْجِدِ الكَبِيرِ فِي طُمَأْنِينَةٍ وسُرُورٍ.\nكانَتْ رائِحَةُ الطِّيبِ والنَّظافَةِ تَفُوحُ مِنْهُما، وأَدَّيا صَلاةَ الجُمُعَةِ خاشِعَيْنِ مَعَ المُصَلِّينَ.\nهَمَسَ الجَدُّ مُبْتَسِمًا: «هكَذا يَكُونُ المُسْلِمُ يا بُنَيَّ؛ طاهِرَ البَدَنِ، نَقِيَّ الثِّيابِ، زَكِيَّ الرّائِحَةِ».\nابْتَسَمَ مُعاذٌ وقالَ بِفَخْرٍ: «عَلِمْتُ اليَوْمَ أَنَّ "النَّظافَةَ مِنَ الإِيمانِ"، وسَأَبْقَى دَوْمًا لاعِبًا قَوِيًّا فِي المَلْعَبِ وبَطَلاً نَظِيفًا مُتَطَهِّرًا فِي كُلِّ حَياتِي!»',
        prompt: 'معاذ وجده في المسجد المشرق بنور الشمس، يبتسمان برضا بعد صلاة الجمعة بثيابهما النقية والبيضاء، وأجواء الطهارة والسكينة تملأ المكان.',
        caption: 'معاذ في المسجد برفقة جده: النظافة من الإيمان وسر القوة والصحة.',
        layout: 'standard',
        question: {
          type: 'multiple',
          text: 'ما هو الشعار الحكيم الذي تعلمه معاذ وسيرافقه في لعبه وحياته اليومية؟',
          options: [
            { id: 'أ', text: 'اللعب والسرعة أهم من غسل الأيدي.', correct: false },
            { id: 'ب', text: 'النظافة من الإيمان، والطهارة سر النشاط والصحة.', correct: true },
            { id: 'ج', text: 'غسل اليدين يكون فقط عند ظهور أوساخ واضحة.', correct: false }
          ]
        }
      }
    ],
    settings: {
      fontScale: 1,
      dyslexic: false,
      contrast: false,
      reduceMotion: false,
      speechRate: 0.9,
    },
    audio: {
      pages: {},
      music: '',
      volume: 0.25,
    },
    studentMode: false,
    titleImage: {
      src: '',
      x: 10,
      y: 18,
      w: 80,
      rotation: 0,
    }
  };
}

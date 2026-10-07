import React, { useState, useEffect, useRef } from 'react';
import {
  StoryData,
  StoryPage,
  CoverTitle,
  getDefaultStoryData
} from '../data/storyData';
import {
  playPageTurnSound,
  playSuccessChime,
  playBubbleSound,
  toggleAmbientMusic
} from '../utils/soundEffects';
import {
  getCoverIllustration,
  getPage5Illustration
} from '../utils/illustrations';
import {
  speakArabicText,
  stopArabicSpeech,
  initVoices,
  getBestArabicVoice
} from '../utils/arabicTTS';

interface StoryBookProps {
  initialData?: StoryData;
}

const STORAGE_KEY = 'muaath_interactive_storybook_v1';

export const StoryBook: React.FC<StoryBookProps> = ({ initialData }) => {
  // Load saved state or default
  const [story, setStory] = useState<StoryData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pages && parsed.pages.length) {
          return parsed;
        }
      }
    } catch {}
    return initialData || getDefaultStoryData();
  });

  // Navigation: -1 = Cover, 0..N-1 = Story Pages, N = End leaf
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(-1);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isTurning, setIsTurning] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');

  // Interactive Tools
  const [activeTool, setActiveTool] = useState<'y' | 'g' | 'p' | 'erase' | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});
  const [openTextAnswers, setOpenTextAnswers] = useState<Record<string, string>>({});
  const [matchingSelections, setMatchingSelections] = useState<Record<string, Record<number, string>>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<string, { show: boolean; correct: boolean; msg: string }>>({});

  // Audio / Speech
  const [isReading, setIsReading] = useState<boolean>(false);
  const [currentReadingWord, setCurrentReadingWord] = useState<number | null>(null);
  const [detectedArabicVoice, setDetectedArabicVoice] = useState<string>('');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.25);
  const [audioRecording, setAudioRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Modals
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [showCoverTitleModal, setShowCoverTitleModal] = useState<boolean>(false);
  const [showAllPicturesModal, setShowAllPicturesModal] = useState<boolean>(false);
  const [showReadingSettingsModal, setShowReadingSettingsModal] = useState<boolean>(false);
  const [showAudioStudioModal, setShowAudioStudioModal] = useState<boolean>(false);
  const [showManagePagesModal, setShowManagePagesModal] = useState<boolean>(false);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);

  // View Modes
  const [readerMode, setReaderMode] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string>('cover');
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
    } catch {}
  }, [story]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // In RTL, ArrowRight turns to previous page or next depending on layout
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrevPage();
      } else if (e.key === 'Escape') {
        stopReading();
        closeAllModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, story.pages.length]);

  const closeAllModals = () => {
    setShowNotesModal(false);
    setShowCoverTitleModal(false);
    setShowAllPicturesModal(false);
    setShowReadingSettingsModal(false);
    setShowAudioStudioModal(false);
    setShowManagePagesModal(false);
    setShowProjectModal(false);
  };

  // Turn page logic
  const goToNextPage = () => {
    if (isTurning) return;
    stopReading();
    playPageTurnSound();

    if (currentPageIndex === -1) {
      // Open cover
      setIsFlipped(true);
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPageIndex(0);
        setIsTurning(false);
      }, 500);
      return;
    }

    if (currentPageIndex < story.pages.length) {
      setTurnDirection('next');
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setIsTurning(false);
      }, 400);
    }
  };

  const goToPrevPage = () => {
    if (isTurning) return;
    stopReading();
    playPageTurnSound();

    if (currentPageIndex > 0) {
      setTurnDirection('prev');
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setIsTurning(false);
      }, 400);
    } else if (currentPageIndex === 0) {
      // Close back to cover
      setTurnDirection('prev');
      setIsTurning(true);
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentPageIndex(-1);
        setIsTurning(false);
      }, 400);
    }
  };

  // Voice initialization and auto-stop on page turn
  useEffect(() => {
    initVoices().then(() => {
      const v = getBestArabicVoice();
      if (v) {
        setDetectedArabicVoice(`${v.name} (${v.lang})`);
      }
    });
  }, []);

  useEffect(() => {
    stopReading();
  }, [currentPageIndex]);

  // Read Aloud using Robust Arabic Speech Engine
  const startReading = async (page: StoryPage) => {
    if (isReading) {
      stopReading();
      return;
    }

    // 1. If custom recorded audio exists for this page, play that
    const customAudio = story.audio?.pages?.[page.id];
    if (customAudio) {
      stopReading();
      setIsReading(true);
      showToast('جارٍ تشغيل التسجيل الصوتي للمشهد... 🎙️');
      const audio = new Audio(customAudio);
      audio.onended = () => {
        setIsReading(false);
      };
      audio.onerror = () => {
        setIsReading(false);
      };
      audio.play().catch(() => {
        setIsReading(false);
      });
      return;
    }

    // 2. Play using our dedicated Arabic TTS Engine
    stopReading();
    setIsReading(true);
    showToast('جارٍ قراءة القصة بصوت عربي فصيح... 🔊');

    await speakArabicText(page.text, story.settings.speechRate || 0.9, {
      onStart: () => {
        setIsReading(true);
      },
      onWord: (wordIndex) => {
        setCurrentReadingWord(wordIndex);
      },
      onEnd: () => {
        setIsReading(false);
        setCurrentReadingWord(null);
      },
      onError: (err) => {
        console.warn('Speech error:', err);
        setIsReading(false);
        setCurrentReadingWord(null);
        showToast('تعذر تشغيل الصوت، تأكد من تشغيل مكبر الصوت بجهازك');
      },
    });
  };

  const stopReading = () => {
    stopArabicSpeech();
    setIsReading(false);
    setCurrentReadingWord(null);
  };

  // Highlighting Tool
  const handleWordClick = (pageId: string, wordIdx: number) => {
    if (!activeTool) return;
    playBubbleSound();
    setStory((prev) => {
      const pageMarks = { ...(prev.marks[pageId] || {}) };
      if (activeTool === 'erase') {
        delete pageMarks[wordIdx];
      } else {
        pageMarks[wordIdx] = activeTool;
      }
      return {
        ...prev,
        marks: {
          ...prev.marks,
          [pageId]: pageMarks,
        },
      };
    });
  };

  // Image Upload helper
  const triggerImageUpload = (id: string) => {
    setUploadTargetId(id);
    if (singleFileInputRef.current) {
      singleFileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setStory((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [uploadTargetId]: result,
        },
      }));
      showToast('تم تحديث الصورة بنجاح');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Background Music Toggle
  const handleMusicToggle = () => {
    const newState = !isMusicPlaying;
    const active = toggleAmbientMusic(newState, musicVolume);
    setIsMusicPlaying(active);
    showToast(active ? 'تم تشغيل الموسيقى الهادئة 🎵' : 'تم إيقاف الموسيقى ⏹️');
  };

  // Multiple Choice Quiz
  const handleMultipleChoice = (pageId: string, optionIdx: number, correct: boolean) => {
    if (correct) {
      playSuccessChime();
      setUserAnswers((prev) => ({ ...prev, [pageId]: true }));
      setQuizFeedback((prev) => ({
        ...prev,
        [pageId]: { show: true, correct: true, msg: 'أحسنت! إجابة صحيحة ورائعة، بارك الله فيك 🌟' },
      }));
    } else {
      setUserAnswers((prev) => ({ ...prev, [pageId]: false }));
      setQuizFeedback((prev) => ({
        ...prev,
        [pageId]: { show: true, correct: false, msg: 'إجابة غير صحيحة. اقرأ القصة مجدداً وحاول ثانية!' },
      }));
    }
  };

  // Matching Quiz Check
  const checkMatching = (page: StoryPage) => {
    if (!page.question?.pairs) return;
    const userMap = matchingSelections[page.id] || {};
    const total = page.question.pairs.length;
    let correctCount = 0;

    page.question.pairs.forEach((pair, idx) => {
      if (userMap[idx] === pair.right) {
        correctCount++;
      }
    });

    if (correctCount === total) {
      playSuccessChime();
      setUserAnswers((prev) => ({ ...prev, [page.id]: true }));
      setQuizFeedback((prev) => ({
        ...prev,
        [page.id]: { show: true, correct: true, msg: 'ممتاز! قمت بربط جميع العادات الصحية بفوائدها بدقة 🏆' },
      }));
    } else {
      setQuizFeedback((prev) => ({
        ...prev,
        [page.id]: {
          show: true,
          correct: false,
          msg: `أصبت في ${correctCount} من ${total}. ركّز وأعد المحاولة لاكتمال النظافة!`,
        },
      }));
    }
  };

  // Open Question Check
  const checkOpenQuestion = (page: StoryPage) => {
    if (!page.question?.answers) return;
    const answer = (openTextAnswers[page.id] || '').trim().toLowerCase();
    if (!answer) {
      showToast('يرجى كتابة إجابتك في الصندوق أولاً');
      return;
    }

    const matched = page.question.answers.some((keyword) => answer.includes(keyword.toLowerCase()));
    if (matched) {
      playSuccessChime();
      setUserAnswers((prev) => ({ ...prev, [page.id]: true }));
      setQuizFeedback((prev) => ({
        ...prev,
        [page.id]: { show: true, correct: true, msg: 'بارك الله فيك! إجابة تعبيرية ممتازة تُبيّن حرصك على سنن الجمعة 🌸' },
      }));
    } else {
      setUserAnswers((prev) => ({ ...prev, [page.id]: true })); // Still encourage open questions
      setQuizFeedback((prev) => ({
        ...prev,
        [page.id]: {
          show: true,
          correct: true,
          msg: 'شكراً لمشاركتك القيّمة! تذكّر دائماً: الغسل، السواك، الثياب النظيفة، والتطيب قبل الصلاة ✨',
        },
      }));
    }
  };

  // Current Page Data
  const isCover = currentPageIndex === -1;
  const isEnd = currentPageIndex === story.pages.length;
  const currentPage = !isCover && !isEnd ? story.pages[currentPageIndex] : null;

  // Calculate total score
  const totalQuestions = story.pages.filter((p) => p.question).length;
  const correctCount = Object.values(userAnswers).filter(Boolean).length;

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col items-center justify-between font-['Tajawal'] select-none overflow-hidden transition-colors duration-300 ${
        story.settings.contrast ? 'bg-black text-white' : 'bg-slate-900 text-slate-100'
      } ${story.settings.dyslexic ? 'font-sans' : ''}`}
      style={{
        fontSize: `${story.settings.fontScale * 100}%`,
      }}
    >
      {/* Hidden File Input for Image Replacing */}
      <input
        ref={singleFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header / Status bar */}
      <header className="w-full bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <span className="text-xl">🧼</span>
          <div>
            <h1 className="text-sm font-bold text-amber-400 leading-tight">معاذ وسر النظافة والنشاط</h1>
            <p className="text-xs text-slate-400">قصة تفاعلية هادفة لترسيخ النظافة الشخصية وطهارة الجمعة</p>
          </div>
        </div>

        {/* Center Page Tracker */}
        <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-full text-xs font-semibold text-slate-200 border border-slate-700">
          <span>
            {isCover && 'صفحة الغلاف'}
            {isEnd && 'خاتمة القصة (النهاية)'}
            {currentPage && `المشهد ${currentPageIndex + 1} من ${story.pages.length}`}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">
            النتيجة: {correctCount} / {totalQuestions}
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-1.5">
          {currentPage && (
            <button
              onClick={() => startReading(currentPage)}
              className={`p-1.5 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                isReading
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600/20 border-emerald-500 text-emerald-300 hover:bg-emerald-600/30'
              }`}
              title={isReading ? 'إيقاف التلاوة' : 'استمع إلى قراءة هذا المشهد باللغة العربية'}
            >
              <span>{isReading ? '⏹️' : '🔊'}</span>
              <span>{isReading ? 'إيقاف القراءة' : 'اقرأ لي بالعربية'}</span>
            </button>
          )}

          <button
            onClick={handleMusicToggle}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              isMusicPlaying
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="موسيقى هادئة"
          >
            <span>{isMusicPlaying ? '🔊' : '🎵'}</span>
            <span className="hidden sm:inline">صوت هادئ</span>
          </button>

          <button
            onClick={() => setReaderMode(!readerMode)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              readerMode
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="وضع القارئ"
          >
            <span>📖</span>
            <span className="hidden sm:inline">{readerMode ? 'المؤلف' : 'القارئ'}</span>
          </button>

          <button
            onClick={() => setShowReadingSettingsModal(true)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1"
            title="إعدادات القراءة"
          >
            <span>⚙️</span>
          </button>
        </div>
      </header>

      {/* Main Book Viewing Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center p-2 sm:p-4 perspective-[2000px]">
        {/* The 3D Book Container */}
        <div
          className={`relative transition-all duration-700 ease-out shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row bg-[#fdfbf5] text-[#1e293b] border-4 border-slate-700/60 ${
            isCover ? 'w-full max-w-[480px] h-[640px]' : 'w-full max-w-[960px] h-[640px]'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), 0 0 40px rgba(56, 189, 248, 0.1)',
          }}
        >
          {/* COVER VIEW */}
          {isCover && (
            <div className="relative w-full h-full flex flex-col items-center justify-between p-6 text-center bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-900 text-white">
              {/* Cover Image Background */}
              {story.images.cover && (
                <img
                  src={story.images.cover}
                  alt="غلاف القصة"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              {/* Dynamic Cover Title Layer */}
              <div
                className="relative z-10 mt-6 w-full px-4"
                style={{
                  color: story.coverTitle.color,
                  textAlign: story.coverTitle.align || 'center',
                }}
              >
                <span className="inline-block px-3 py-1 bg-amber-500/90 text-slate-950 text-xs font-black rounded-full mb-2 tracking-wider shadow">
                  سلسلة الآداب والأخلاق الإسلامية
                </span>
                <h1
                  className="font-black leading-tight drop-shadow-lg"
                  style={{
                    fontSize: `${story.coverTitle.size}px`,
                    textShadow: '0 4px 14px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)',
                  }}
                >
                  {story.coverTitle.text}
                </h1>
                <p className="text-sm font-semibold text-sky-200 mt-2 opacity-90 drop-shadow">
                  {story.level}
                </p>
              </div>

              {/* Floating Action to Open Book */}
              <div className="relative z-10 mb-4 flex flex-col items-center gap-3">
                <button
                  onClick={goToNextPage}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-full text-base shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95 transition"
                >
                  <span>افتح القصة وابدأ القراءة</span>
                  <span className="text-xl">◀</span>
                </button>

                {!readerMode && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerImageUpload('cover')}
                      className="px-3 py-1 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-md backdrop-blur"
                    >
                      📷 استبدال صورة الغلاف
                    </button>
                    <button
                      onClick={() => setShowCoverTitleModal(true)}
                      className="px-3 py-1 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-md backdrop-blur"
                    >
                      ✏️ تعديل العنوان
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STORY PAGE VIEW (Two-page layout on md/lg screens) */}
          {currentPage && (
            <div className="w-full h-full flex flex-col md:flex-row relative">
              {/* Spine separator line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent pointer-events-none z-10" />

              {/* RIGHT PAGE: The Vivid Illustration */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 md:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-l border-[#e2d9c8] bg-[#f7f2e7]/70">
                <div className="relative flex-1 w-full rounded-xl overflow-hidden shadow-inner border border-[#d6c7b0] bg-slate-200 flex items-center justify-center group">
                  <img
                    src={story.images[currentPage.id] || getCoverIllustration()}
                    alt={`رسم توضيحي للمشهد ${currentPageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Caption overlay */}
                  {currentPage.caption && (
                    <div className="absolute bottom-2 inset-x-2 bg-slate-900/85 backdrop-blur text-white text-xs p-2 rounded-lg text-center font-medium">
                      {currentPage.caption}
                    </div>
                  )}

                  {/* Change Image Button */}
                  {!readerMode && (
                    <button
                      onClick={() => triggerImageUpload(currentPage.id)}
                      className="absolute top-2 left-2 bg-white/90 hover:bg-white text-slate-800 text-xs px-2.5 py-1 rounded-md shadow border opacity-0 group-hover:opacity-100 transition"
                    >
                      تغيير الصورة
                    </button>
                  )}
                </div>

                <div className="mt-2 text-center text-xs text-slate-500 font-medium">
                  المشهد {currentPageIndex + 1}: {currentPage.caption || 'قصة معاذ'}
                </div>
              </div>

              {/* LEFT PAGE: The Story Text, Audio & Interactive Quiz */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 md:p-6 flex flex-col justify-between bg-[#fdfbf5]">
                {/* Header & Page Number */}
                <div className="flex items-center justify-between pb-2 border-b border-[#e2d9c8]">
                  <span className="text-xs font-bold text-slate-400">
                    صفحة رقم {currentPageIndex + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowNotesModal(true)}
                      className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-medium"
                    >
                      📝 ملاحظاتي {story.notes[currentPage.id] ? '●' : ''}
                    </button>
                  </div>
                </div>

                {/* The Story Text with Word-by-Word highlighting and custom marks */}
                <div className="my-3 overflow-y-auto max-h-[220px] pr-1 leading-relaxed text-slate-800 font-['Cairo'] text-base md:text-lg">
                  {currentPage.text.split(/(\s+)/).map((segment, idx) => {
                    if (/^\s+$/.test(segment)) {
                      return <span key={idx}>{segment}</span>;
                    }
                    const mark = story.marks[currentPage.id]?.[idx];
                    const isReadingThis = currentReadingWord === idx;

                    return (
                      <span
                        key={idx}
                        onClick={() => handleWordClick(currentPage.id, idx)}
                        className={`inline rounded px-0.5 transition-colors cursor-pointer ${
                          isReadingThis
                            ? 'bg-blue-600 text-white font-bold'
                            : mark === 'y'
                            ? 'bg-yellow-200'
                            : mark === 'g'
                            ? 'bg-emerald-200'
                            : mark === 'p'
                            ? 'bg-pink-200'
                            : 'hover:bg-slate-200'
                        }`}
                      >
                        {segment}
                      </span>
                    );
                  })}
                </div>

                {/* Interactive Quiz Box */}
                {currentPage.question && (
                  <div className="my-2 p-3 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs md:text-sm">
                    <p className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span className="text-amber-600 font-black">سؤال الفهم:</span>
                      <span>{currentPage.question.text}</span>
                    </p>

                    {/* Multiple Choice & True/False */}
                    {(currentPage.question.type === 'multiple' ||
                      currentPage.question.type === 'truefalse') && (
                      <div className="space-y-1.5">
                        {currentPage.question.options?.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() =>
                              handleMultipleChoice(currentPage.id, optIdx, opt.correct)
                            }
                            className={`w-full text-right p-2 rounded-lg border text-xs font-semibold transition flex items-center justify-between ${
                              quizFeedback[currentPage.id]?.show
                                ? opt.correct
                                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                                  : 'bg-white border-slate-200 text-slate-400'
                                : 'bg-white hover:bg-amber-100 border-amber-200 text-slate-800'
                            }`}
                          >
                            <span>{opt.text}</span>
                            <span className="text-slate-400 font-bold">{opt.id}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Matching Question */}
                    {currentPage.question.type === 'matching' && (
                      <div className="space-y-1.5">
                        {currentPage.question.pairs?.map((pair, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center justify-between gap-2 bg-white p-1.5 rounded border border-amber-200 text-xs"
                          >
                            <span className="font-semibold text-slate-800">{pair.left}</span>
                            <span className="text-amber-500">←</span>
                            <select
                              value={matchingSelections[currentPage.id]?.[pIdx] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMatchingSelections((prev) => ({
                                  ...prev,
                                  [currentPage.id]: {
                                    ...(prev[currentPage.id] || {}),
                                    [pIdx]: val,
                                  },
                                }));
                              }}
                              className="bg-slate-50 border border-slate-300 rounded p-1 text-xs text-slate-700"
                            >
                              <option value="">اختر الفائدة المناسبة...</option>
                              {currentPage.question?.pairs?.map((p2, i2) => (
                                <option key={i2} value={p2.right}>
                                  {p2.right}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                        <button
                          onClick={() => checkMatching(currentPage)}
                          className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs"
                        >
                          تحقق من التوصيل ✅
                        </button>
                      </div>
                    )}

                    {/* Open Answer Question */}
                    {currentPage.question.type === 'open' && (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="اكتب إجابتك هنا بأسلوبك الجميل..."
                          value={openTextAnswers[currentPage.id] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOpenTextAnswers((prev) => ({ ...prev, [currentPage.id]: val }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => checkOpenQuestion(currentPage)}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs"
                        >
                          إرسال الإجابة 📩
                        </button>
                      </div>
                    )}

                    {/* Feedback message */}
                    {quizFeedback[currentPage.id]?.show && (
                      <div
                        className={`mt-2 p-2 rounded-lg text-xs font-bold ${
                          quizFeedback[currentPage.id]?.correct
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {quizFeedback[currentPage.id]?.msg}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Tools Strip (Read Aloud, Highlighters, Eraser) */}
                <div className="pt-2 border-t border-[#e2d9c8] flex items-center justify-between gap-2">
                  <button
                    onClick={() => startReading(currentPage)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                      isReading
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    title={isReading ? 'إيقاف التلاوة' : 'استمع إلى قراءة هذا المشهد باللغة العربية الفصيحة'}
                  >
                    <span>{isReading ? '⏹️' : '🔊'}</span>
                    <span>{isReading ? 'إيقاف التلاوة' : 'اقرأ لي باللغة العربية'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold ml-1">تظليل:</span>
                    <button
                      onClick={() => setActiveTool(activeTool === 'y' ? null : 'y')}
                      className={`w-6 h-6 rounded-full bg-yellow-300 border-2 ${
                        activeTool === 'y' ? 'border-slate-800 scale-110' : 'border-transparent'
                      }`}
                      title="قلم أصفر"
                    />
                    <button
                      onClick={() => setActiveTool(activeTool === 'g' ? null : 'g')}
                      className={`w-6 h-6 rounded-full bg-emerald-400 border-2 ${
                        activeTool === 'g' ? 'border-slate-800 scale-110' : 'border-transparent'
                      }`}
                      title="قلم أخضر"
                    />
                    <button
                      onClick={() => setActiveTool(activeTool === 'p' ? null : 'p')}
                      className={`w-6 h-6 rounded-full bg-pink-300 border-2 ${
                        activeTool === 'p' ? 'border-slate-800 scale-110' : 'border-transparent'
                      }`}
                      title="قلم وردي"
                    />
                    <button
                      onClick={() => setActiveTool(activeTool === 'erase' ? null : 'erase')}
                      className={`px-1.5 py-0.5 rounded text-xs border ${
                        activeTool === 'erase'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                      title="ممحاة"
                    >
                      ⌫
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* END LEAF (Conclusion & Final Score) */}
          {isEnd && (
            <div className="w-full h-full flex flex-col md:flex-row relative">
              {/* Right: End Illustration */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 flex flex-col justify-center items-center bg-[#f7f2e7]/70 border-b md:border-b-0 md:border-l border-[#e2d9c8]">
                <img
                  src={story.images.end || getPage5Illustration()}
                  alt="نهاية القصة"
                  className="w-full h-full object-contain rounded-xl shadow-md border"
                />
              </div>

              {/* Left: Certificate of Cleanliness & Replay */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
                <span className="text-4xl mb-2">🎉</span>
                <h2 className="text-2xl font-black text-amber-400 mb-1">تمت القصة بحمد الله!</h2>
                <p className="text-sm text-slate-300 mb-4 max-w-xs">
                  أنت الآن بطلٌ نظيف مثل معاذ، تحافظ على طهارتك ونظافة يديك قبل الأكل وبعده، وتستعد
                  لصلاة الجمعة بالغسل والتطيب!
                </p>

                {/* Score Card */}
                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl w-full max-w-xs mb-5">
                  <div className="text-xs text-slate-400 font-bold mb-1">نتيجة اختبارات القصة</div>
                  <div className="text-3xl font-black text-emerald-400">
                    {correctCount} / {totalQuestions}
                  </div>
                  <div className="text-xs text-amber-300 font-medium mt-1">
                    {correctCount === totalQuestions
                      ? 'درجة كاملة! وسام بطل النظافة الذهبي 🥇'
                      : 'أداء ممتاز، يمكنك إعادة القراءة لإتقان كافة الإجابات!'}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setCurrentPageIndex(0);
                      playPageTurnSound();
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
                  >
                    🔄 اقرأ القصة مرة أخرى
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPageIndex(-1);
                      setIsFlipped(false);
                      playPageTurnSound();
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition"
                  >
                    📖 العودة إلى الغلاف
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Main Navigation & Author Controls */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 p-3 flex flex-wrap items-center justify-center gap-3 z-30">
        <button
          onClick={goToPrevPage}
          disabled={currentPageIndex === -1 || isTurning}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
        >
          <span>▶</span>
          <span>السابق</span>
        </button>

        <span className="text-xs text-slate-400 font-bold px-2">
          {isCover && 'الغلاف'}
          {currentPage && `صفحة ${currentPageIndex + 1} / ${story.pages.length}`}
          {isEnd && 'النهاية'}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPageIndex >= story.pages.length || isTurning}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 text-xs font-black rounded-xl shadow flex items-center gap-1.5 transition"
        >
          <span>{isCover ? 'فتح الكتاب' : 'التالي'}</span>
          <span>◀</span>
        </button>

        {/* Author Tools (Visible when not in Reader Mode) */}
        {!readerMode && (
          <div className="flex items-center gap-2 mr-2 border-r border-slate-800 pr-3">
            <button
              onClick={() => setShowAllPicturesModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
            >
              🖼️ معرض الصور
            </button>
            <button
              onClick={() => setShowAudioStudioModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
            >
              🎙️ استوديو الصوت
            </button>
            <button
              onClick={() => setShowManagePagesModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
            >
              📑 إدارة الصفحات
            </button>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
            >
              💾 حفظ وتصدير
            </button>
          </div>
        )}
      </footer>

      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-4 py-2 rounded-full font-bold text-xs shadow-2xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-right text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-amber-400 mb-2 flex items-center gap-2">
              <span>📝</span>
              <span>ملاحظاتي على المشهد {currentPageIndex + 1}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              اكتب خواطرك أو كلمة جديدة تعلمتها أو تلخيصاً لما فهمته من المشهد:
            </p>
            <textarea
              rows={4}
              value={currentPage ? story.notes[currentPage.id] || '' : ''}
              onChange={(e) => {
                if (!currentPage) return;
                const val = e.target.value;
                setStory((prev) => ({
                  ...prev,
                  notes: { ...prev.notes, [currentPage.id]: val },
                }));
              }}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cover Title Designer Modal */}
      {showCoverTitleModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 text-right text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-amber-400 mb-3 flex items-center gap-2">
              <span>🎨</span>
              <span>تنسيق وتصميم عنوان الغلاف</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">نص العنوان:</label>
                <input
                  type="text"
                  value={story.coverTitle.text}
                  onChange={(e) =>
                    setStory((prev) => ({
                      ...prev,
                      coverTitle: { ...prev.coverTitle, text: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">لون الخط:</label>
                  <input
                    type="color"
                    value={story.coverTitle.color}
                    onChange={(e) =>
                      setStory((prev) => ({
                        ...prev,
                        coverTitle: { ...prev.coverTitle, color: e.target.value },
                      }))
                    }
                    className="w-full h-9 p-1 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">حجم الخط ({story.coverTitle.size}px):</label>
                  <input
                    type="range"
                    min={24}
                    max={64}
                    value={story.coverTitle.size}
                    onChange={(e) =>
                      setStory((prev) => ({
                        ...prev,
                        coverTitle: { ...prev.coverTitle, size: Number(e.target.value) },
                      }))
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">نمط العنوان:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bubble', 'adventure', 'arcade', 'magic', 'elegant', 'comic'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() =>
                          setStory((prev) => ({
                            ...prev,
                            coverTitle: { ...prev.coverTitle, style: st },
                          }))
                        }
                        className={`p-2 rounded-lg border text-xs font-bold ${
                          story.coverTitle.style === st
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {st === 'bubble' && 'فقاعات'}
                        {st === 'adventure' && 'مغامرة'}
                        {st === 'arcade' && 'ألعاب ذهبية'}
                        {st === 'magic' && 'سحر وجمال'}
                        {st === 'elegant' && 'أناقة'}
                        {st === 'comic' && 'كوميكس'}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowCoverTitleModal(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                تم وتطبيق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. All Pictures Gallery Modal */}
      {showAllPicturesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col p-5 text-right text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-amber-400 mb-2 flex items-center gap-2">
              <span>🖼️</span>
              <span>معرض صور القصة واستبدالها</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنك استبدال أي صورة برسمك الخاص أو صورك المفضلة بالنقر على "تغيير":
            </p>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {/* Cover slot */}
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 mb-1">الغلاف</span>
                <div className="w-full h-32 bg-slate-900 rounded overflow-hidden flex items-center justify-center mb-2">
                  {story.images.cover && (
                    <img src={story.images.cover} alt="الغلاف" className="w-full h-full object-contain" />
                  )}
                </div>
                <button
                  onClick={() => triggerImageUpload('cover')}
                  className="w-full py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold"
                >
                  تغيير الصورة
                </button>
              </div>

              {/* Pages slots */}
              {story.pages.map((p, pIdx) => (
                <div
                  key={p.id}
                  className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex flex-col items-center"
                >
                  <span className="text-xs font-bold text-amber-300 mb-1">مشهد {pIdx + 1}</span>
                  <div className="w-full h-32 bg-slate-900 rounded overflow-hidden flex items-center justify-center mb-2">
                    {story.images[p.id] && (
                      <img
                        src={story.images[p.id]}
                        alt={`مشهد ${pIdx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => triggerImageUpload(p.id)}
                    className="w-full py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold"
                  >
                    تغيير الصورة
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAllPicturesModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Reading Settings Modal */}
      {showReadingSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-right text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-amber-400 mb-3 flex items-center gap-2">
              <span>⚙️</span>
              <span>خيارات سهولة القراءة والنطق</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">
                  حجم الخط ({Math.round(story.settings.fontScale * 100)}%):
                </label>
                <input
                  type="range"
                  min={80}
                  max={140}
                  value={Math.round(story.settings.fontScale * 100)}
                  onChange={(e) =>
                    setStory((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, fontScale: Number(e.target.value) / 100 },
                    }))
                  }
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">
                  سرعة نطق القراءة ({story.settings.speechRate}x):
                </label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={Math.round(story.settings.speechRate * 100)}
                  onChange={(e) =>
                    setStory((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, speechRate: Number(e.target.value) / 100 },
                    }))
                  }
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Arabic TTS Engine Status & Live Voice Test */}
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="font-bold text-amber-300 mb-1 flex items-center justify-between text-xs">
                  <span>محرك القراءة باللغة العربية:</span>
                  <span className="text-emerald-400 font-normal">
                    {detectedArabicVoice ? `✓ متوفر (${detectedArabicVoice})` : '✓ صوت عربي فصيح متوفر'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  يقرأ القصة بصوت عربي واضح وفصيح مع تظليل كل كلمة أثناء نطقها.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    speakArabicText(
                      'مرحباً يا بطل! النظافة من الإيمان، وغسل اليدين بالماء والصابون يحميك من الأمراض.',
                      story.settings.speechRate || 0.9,
                      {
                        onStart: () => showToast('يجري اختبار الصوت العربي... 🔊'),
                        onEnd: () => showToast('اكتمل اختبار الصوت العربي بنجاح! ✨'),
                      }
                    );
                  }}
                  className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-xs transition"
                >
                  🔊 اختبار نطق جملة تجريبية بالعربية
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={story.settings.contrast}
                    onChange={(e) =>
                      setStory((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, contrast: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>وضع التباين العالي (أسود وأبيض ناصع)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={story.settings.dyslexic}
                    onChange={(e) =>
                      setStory((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, dyslexic: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>خط سهل القراءة لمصابي عسر القراءة (Dyslexia)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowReadingSettingsModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                تطبيق الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Audio Studio Modal */}
      {showAudioStudioModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-right text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-amber-400 mb-3 flex items-center gap-2">
              <span>🎙️</span>
              <span>استوديو الصوت وتسجيل الإلقاء</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="font-bold text-white mb-2">تسجيل صوتي للمشهد الحالي بواسطة الميكروفون:</div>
                <button
                  onClick={async () => {
                    if (audioRecording && mediaRecorderRef.current) {
                      mediaRecorderRef.current.stop();
                      setAudioRecording(false);
                      return;
                    }
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                      recordChunksRef.current = [];
                      const rec = new MediaRecorder(stream);
                      rec.ondataavailable = (e) => recordChunksRef.current.push(e.data);
                      rec.onstop = () => {
                        const blob = new Blob(recordChunksRef.current, { type: 'audio/webm' });
                        const url = URL.createObjectURL(blob);
                        setRecordedAudioUrl(url);
                        showToast('تم حفظ التسجيل الصوتي بنجاح!');
                      };
                      rec.start();
                      mediaRecorderRef.current = rec;
                      setAudioRecording(true);
                      showToast('بدأ التسجيل... تحدث الآن 🎙️');
                    } catch {
                      showToast('تعذر الوصول إلى الميكروفون');
                    }
                  }}
                  className={`w-full py-2 rounded-lg font-bold text-xs transition ${
                    audioRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-red-500 hover:bg-red-400 text-white'
                  }`}
                >
                  {audioRecording ? '■ إيقاف التسجيل وحفظ' : '● بدء تسجيل الصوت الآن'}
                </button>

                {recordedAudioUrl && (
                  <div className="mt-2 text-center">
                    <audio src={recordedAudioUrl} controls className="w-full mt-2" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">مستوى صوت الموسيقى الهادئة:</label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={Math.round(musicVolume * 100)}
                  onChange={(e) => {
                    const v = Number(e.target.value) / 100;
                    setMusicVolume(v);
                    if (isMusicPlaying) {
                      toggleAmbientMusic(true, v);
                    }
                  }}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowAudioStudioModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Manage Pages Modal */}
      {showManagePagesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 text-right text-slate-100 shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="font-bold text-base text-amber-400 mb-2 flex items-center gap-2">
              <span>📑</span>
              <span>إدارة وتعديل مشاهد القصة</span>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-3 text-xs">
              {story.pages.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 truncate">
                    <span className="font-bold text-amber-300 ml-2">مشهد {idx + 1}:</span>
                    <span className="text-slate-300">{p.text.slice(0, 45)}...</span>
                  </div>
                  <button
                    onClick={() => {
                      if (story.pages.length <= 1) {
                        showToast('لا يمكن حذف المشهد الوحيد في القصة');
                        return;
                      }
                      if (confirm(`هل أنت متأكد من حذف المشهد ${idx + 1}؟`)) {
                        setStory((prev) => ({
                          ...prev,
                          pages: prev.pages.filter((_, i) => i !== idx),
                        }));
                        showToast('تم حذف المشهد');
                      }
                    }}
                    className="px-2 py-1 bg-rose-950 border border-rose-700 text-rose-300 rounded hover:bg-rose-900"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowManagePagesModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Project & Download Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 text-right text-slate-100 shadow-2xl">
            <h3 className="font-bold text-base text-amber-400 mb-3 flex items-center gap-2">
              <span>💾</span>
              <span>حفظ وتصدير القصة التفاعلية</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  const jsonStr = JSON.stringify(story, null, 2);
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `قصة_معاذ_وسر_النظافة_${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('تم تصدير ملف القصة بنجاح');
                }}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-right font-bold text-white flex items-center justify-between"
              >
                <span>تصدير ملف القصة (JSON)</span>
                <span>⬇️</span>
              </button>

              <button
                onClick={() => {
                  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${story.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Cairo', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; direction: rtl; }
  .book-container { max-width: 800px; margin: 0 auto; background: #fdfbf5; color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
  .page { padding: 30px; border-bottom: 2px dashed #cbd5e1; }
  .cover { background: #0c4a6e; color: white; text-align: center; padding: 50px 20px; }
  .cover h1 { font-size: 36px; margin: 10px 0; color: #fef08a; }
  .page-img { width: 100%; max-height: 480px; object-fit: contain; border-radius: 12px; margin-bottom: 20px; background: #f1f5f9; }
  .story-text { font-size: 20px; line-height: 1.8; margin-bottom: 20px; }
  .quiz-box { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-top: 15px; }
  .btn-speak { background: #0284c7; color: white; border: 0; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; font-family: inherit; }
</style>
</head>
<body>
<div class="book-container">
  <div class="cover">
    <img src="${story.images.cover}" class="page-img" style="max-height: 380px;">
    <h1>${story.coverTitle.text}</h1>
    <p>${story.level}</p>
    <button class="btn-speak" onclick="speakText('${story.title}. ${story.level}')">🔊 استمع للعنوان</button>
  </div>
  ${story.pages.map((p, i) => `
    <div class="page">
      <h2>المشهد ${i + 1}</h2>
      ${story.images[p.id] ? `<img src="${story.images[p.id]}" class="page-img">` : ''}
      <div class="story-text">${p.text.replace(/\\n/g, '<br>')}</div>
      <button class="btn-speak" onclick="speakText(\`${p.text.replace(/`/g, '\\`').replace(/\\n/g, ' ')}\`)">🔊 اقرأ لي هذا المشهد</button>
      ${p.question ? `<div class="quiz-box"><strong>سؤال الفهم:</strong> ${p.question.text}</div>` : ''}
    </div>
  `).join('')}
</div>
<script>
function speakText(txt) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'ar-SA';
    u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Laila'));
    if (arVoice) u.voice = arVoice;
    window.speechSynthesis.speak(u);
  } else {
    alert('خاصية القراءة الصوتية غير مدعومة');
  }
}
</script>
</body>
</html>`;
                  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `كتاب_معاذ_وسر_النظافة_${Date.now()}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('تم تنزيل الكتاب كصفحة HTML مستقلة بنجاح!');
                }}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-right font-bold text-white flex items-center justify-between"
              >
                <span>تنزيل الكتاب كصفحة تفاعلية مستقلة (HTML)</span>
                <span>🌐</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-right font-bold text-white flex items-center justify-between"
              >
                <span>طباعة القصة أو حفظ كـ PDF</span>
                <span>🖨️</span>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setStory(getDefaultStoryData());
                  setCurrentPageIndex(-1);
                  setIsFlipped(false);
                  setShowProjectModal(false);
                  showToast('تمت إعادة ضبط القصة إلى النموذج الأصلي');
                }}
                className="w-full p-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded-xl text-right font-bold text-rose-300 flex items-center justify-between mt-2"
              >
                <span>إعادة ضبط القصة إلى حالتها الأولى</span>
                <span>🗑️</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

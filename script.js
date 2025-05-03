document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    let mediaPlayer = document.getElementById('media-player');
    const playBtn = document.getElementById('play-btn');
    const playBtnIcon = playBtn.querySelector('i');
    const muteBtn = document.getElementById('mute-btn');
    const muteBtnIcon = muteBtn.querySelector('i');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const fileInput = document.getElementById('file-input');
    const forwardBtn = document.getElementById('forward-btn');
    const backwardBtn = document.getElementById('backward-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playlistItems = document.getElementById('playlist-items');
    const clearPlaylistBtn = document.getElementById('clear-playlist');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const loopBtn = document.getElementById('loop-btn');
    const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
    const playlistContainer = document.getElementById('playlist-container');
    const overlayPlayBtn = document.getElementById('overlay-play-btn');
    const videoOverlay = document.getElementById('video-overlay');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeSelector = document.getElementById('theme-selector');
    const closeThemeSelector = document.getElementById('close-theme-selector');
    const themeColors = document.querySelectorAll('.theme-color');
    const equalizerToggle = document.getElementById('equalizer-toggle');
    const equalizerContainer = document.getElementById('equalizer-container');
    const equalizerBands = document.getElementById('equalizer-bands');
    const equalizerPreset = document.getElementById('equalizer-preset');
    const playbackSpeed = document.getElementById('playback-speed');
    const autoPlayToggle = document.getElementById('auto-play-toggle');
    const shuffleToggle = document.getElementById('shuffle-toggle');
    const playlistSearch = document.getElementById('playlist-search');
    // Spectrum visualization elements
    const viewToggle = document.getElementById('view-toggle');
    const spectrumContainer = document.getElementById('spectrum-container');
    const spectrumCanvas = document.getElementById('spectrum-canvas');
    const spectrumTitle = document.getElementById('spectrum-title');
    const mediaContainer = document.querySelector('.media-container');
    
    // Variables
    let isPlaying = false;
    let isAudio = false;
    let playlist = [];
    let currentIndex = -1;
    let isLooping = false;
    let isShuffling = false;
    let isAutoPlay = true;
    let forwardInterval = null;
    let backwardInterval = null;
    let dragSrcEl = null;
    let touchStartY = 0;
    let initialDragIndex = null;
    let audioContext = null;
    let sourceNode = null;
    let equalizerNodes = [];
    let currentTheme = 'default';
    let isPlayingFromError = false;
    let isSpectrumView = false;
    // Spectrum visualization variables
    let analyser = null;
    let spectrumAnimationId = null;
    
    // Oynatma durumunu kontrol etmek için flag ekleyelim
    let isPlayRequested = false;
    let lastPlayTime = 0;
    
    // Ekolayzer frekansları
    const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    
    // Ekolayzer presetleri
    const equalizerPresets = {
        flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        rock: [4, 3, 2, 0, -1, 0, 2, 3, 4, 3],
        pop: [1, 2, 3, 3, 2, 0, -1, -1, 1, 2],
        jazz: [3, 2, 1, 2, -1, -2, 0, 1, 2, 3],
        electronic: [4, 3, 1, 0, -2, 0, 1, 3, 4, 3],
        classical: [3, 3, 2, 2, 0, -1, 0, 2, 3, 4]
    };
    
    // Çoklu dil desteği
    let currentLanguage = "tr"; // Varsayılan dil Türkçe
    
    // Dil çevirileri
    const translations = {
        // Türkçe
        "tr": {
            "selectMedia": "Medya Seçin",
            "audioPlaying": "Ses Çalınıyor",
            "play": "Oynat",
            "pause": "Duraklat",
            "volume": "Ses",
            "playlist": "Çalma Listesi",
            "clear": "Temizle",
            "clearPlaylist": "Çalma listesi temizlendi",
            "welcome": "Modern Medya Oynatıcıya Hoş Geldiniz!",
            "noPlayableTrack": "Çalınabilir parça bulunamadı",
            "errorPlaying": "Oynatma hatası",
            "formatNotSupported": "Format desteklenmiyor olabilir",
            "searchPlaylist": "Çalma listesinde ara...",
            "selectFiles": "Dosya Seç",
            "showPlaylist": "Çalma Listesini Göster",
            "hidePlaylist": "Çalma Listesini Gizle",
            "playbackSpeed": "Oynatma Hızı",
            "equalizer": "Ekolayzer",
            "flat": "Düz",
            "autoPlay": "Otomatik Oynatma",
            "shuffle": "Karıştır",
            "removeItem": "Kaldır",
            "emptyPlaylist": "Çalma listeniz boş",
            "addMedia": "Çalmak için medya dosyaları ekleyin",
            "fileAdded": "dosya çalma listesine eklendi",
            "filesAdded": "dosya çalma listesine eklendi",
            "unsupportedSkipped": "desteklenmeyen dosya atlandı",
            "unsupportedSkipped_plural": "desteklenmeyen dosya atlandı",
            "noMediaFound": "Hiçbir medya dosyası bulunamadı",
            "selectFileForItem": "Lütfen bu öğe için gerçek dosyayı seçin",
            "mediaPlayerError": "Medya oynatıcı hatası",
            "spectrumView": "Spektrum Görünümü"
        },
        // İngilizce
        "en": {
            "selectMedia": "Select Media",
            "audioPlaying": "Audio Playing",
            "play": "Play",
            "pause": "Pause",
            "volume": "Volume",
            "playlist": "Playlist",
            "clear": "Clear",
            "clearPlaylist": "Playlist cleared",
            "welcome": "Welcome to Modern Media Player!",
            "noPlayableTrack": "Could not find a playable track",
            "errorPlaying": "Error playing",
            "formatNotSupported": "Format may not be supported",
            "searchPlaylist": "Search playlist...",
            "selectFiles": "Select Files",
            "showPlaylist": "Show Playlist",
            "hidePlaylist": "Hide Playlist",
            "playbackSpeed": "Playback Speed",
            "equalizer": "Equalizer",
            "flat": "Flat",
            "autoPlay": "Auto Play",
            "shuffle": "Shuffle",
            "removeItem": "Remove",
            "emptyPlaylist": "Your playlist is empty",
            "addMedia": "Add media files to start playing",
            "fileAdded": "file added to playlist",
            "filesAdded": "files added to playlist",
            "unsupportedSkipped": "unsupported file skipped",
            "unsupportedSkipped_plural": "unsupported files skipped",
            "noMediaFound": "No media files found",
            "selectFileForItem": "Please select the actual file for this item",
            "mediaPlayerError": "Media player error",
            "spectrumView": "Spectrum View"
        },
        // Almanca
        "de": {
            "selectMedia": "Medien auswählen",
            "audioPlaying": "Audio wird abgespielt",
            "play": "Abspielen",
            "pause": "Pause",
            "volume": "Lautstärke",
            "playlist": "Wiedergabeliste",
            "clear": "Löschen",
            "clearPlaylist": "Wiedergabeliste gelöscht",
            "welcome": "Willkommen beim Modern Media Player!",
            "noPlayableTrack": "Konnte keinen abspielbaren Track finden",
            "errorPlaying": "Fehler beim Abspielen",
            "formatNotSupported": "Format wird möglicherweise nicht unterstützt",
            "searchPlaylist": "Wiedergabeliste durchsuchen...",
            "selectFiles": "Dateien auswählen",
            "showPlaylist": "Wiedergabeliste anzeigen",
            "hidePlaylist": "Wiedergabeliste ausblenden",
            "playbackSpeed": "Wiedergabegeschwindigkeit",
            "equalizer": "Equalizer",
            "flat": "Flach",
            "autoPlay": "Automatisch abspielen",
            "shuffle": "Zufallswiedergabe",
            "removeItem": "Entfernen",
            "emptyPlaylist": "Deine Wiedergabeliste ist leer",
            "addMedia": "Füge Mediendateien hinzu, um die Wiedergabe zu starten",
            "fileAdded": "Datei zur Wiedergabeliste hinzugefügt",
            "filesAdded": "Dateien zur Wiedergabeliste hinzugefügt",
            "unsupportedSkipped": "Nicht unterstützte Datei übersprungen",
            "unsupportedSkipped_plural": "Nicht unterstützte Dateien übersprungen",
            "noMediaFound": "Keine Mediendateien gefunden",
            "selectFileForItem": "Bitte wähle die tatsächliche Datei für diesen Eintrag aus",
            "mediaPlayerError": "Mediaplayer-Fehler",
            "spectrumView": "Spektrum Ansicht"
        },
        // Arapça
        "ar": {
            "selectMedia": "اختر الوسائط",
            "audioPlaying": "جاري تشغيل الصوت",
            "play": "تشغيل",
            "pause": "إيقاف",
            "volume": "الصوت",
            "playlist": "قائمة التشغيل",
            "clear": "مسح",
            "clearPlaylist": "تم مسح قائمة التشغيل",
            "welcome": "مرحبًا بك في مشغل الوسائط الحديث!",
            "noPlayableTrack": "لم يتم العثور على مسار قابل للتشغيل",
            "errorPlaying": "خطأ في التشغيل",
            "formatNotSupported": "قد لا يكون التنسيق مدعومًا",
            "searchPlaylist": "بحث في قائمة التشغيل...",
            "selectFiles": "اختر الملفات",
            "showPlaylist": "عرض قائمة التشغيل",
            "hidePlaylist": "إخفاء قائمة التشغيل",
            "playbackSpeed": "سرعة التشغيل",
            "equalizer": "معادل الصوت",
            "flat": "مستوٍ",
            "autoPlay": "تشغيل تلقائي",
            "shuffle": "خلط",
            "removeItem": "إزالة",
            "emptyPlaylist": "قائمة التشغيل فارغة",
            "addMedia": "أضف ملفات وسائط لبدء التشغيل",
            "fileAdded": "تمت إضافة ملف إلى قائمة التشغيل",
            "filesAdded": "تمت إضافة ملفات إلى قائمة التشغيل",
            "unsupportedSkipped": "تم تخطي ملف غير مدعوم",
            "unsupportedSkipped_plural": "تم تخطي ملفات غير مدعومة",
            "noMediaFound": "لم يتم العثور على ملفات وسائط",
            "selectFileForItem": "يرجى اختيار الملف الفعلي لهذا العنصر",
            "mediaPlayerError": "خطأ في مشغل الوسائط",
            "spectrumView": "الرؤية الطيفية"
        },
        // Fransızca
        "fr": {
            "selectMedia": "Sélectionner des médias",
            "audioPlaying": "Audio en cours de lecture",
            "play": "Lecture",
            "pause": "Pause",
            "volume": "Volume",
            "playlist": "Liste de lecture",
            "clear": "Effacer",
            "clearPlaylist": "Liste de lecture effacée",
            "welcome": "Bienvenue sur le lecteur multimédia moderne !",
            "noPlayableTrack": "Impossible de trouver une piste lisible",
            "errorPlaying": "Erreur de lecture",
            "formatNotSupported": "Le format peut ne pas être pris en charge",
            "searchPlaylist": "Rechercher dans la liste de lecture...",
            "selectFiles": "Sélectionner des fichiers",
            "showPlaylist": "Afficher la liste de lecture",
            "hidePlaylist": "Masquer la liste de lecture",
            "playbackSpeed": "Vitesse de lecture",
            "equalizer": "Égaliseur",
            "flat": "Plat",
            "autoPlay": "Lecture automatique",
            "shuffle": "Aléatoire",
            "removeItem": "Supprimer",
            "emptyPlaylist": "Votre liste de lecture est vide",
            "addMedia": "Ajoutez des fichiers multimédias pour commencer la lecture",
            "fileAdded": "fichier ajouté à la liste de lecture",
            "filesAdded": "fichiers ajoutés à la liste de lecture",
            "unsupportedSkipped": "fichier non pris en charge ignoré",
            "unsupportedSkipped_plural": "fichiers non pris en charge ignorés",
            "noMediaFound": "Aucun fichier multimédia trouvé",
            "selectFileForItem": "Veuillez sélectionner le fichier réel pour cet élément",
            "mediaPlayerError": "Erreur du lecteur multimédia",
            "spectrumView": "Vue du spectre"
        },
        // İspanyolca
        "es": {
            "selectMedia": "Seleccionar medios",
            "audioPlaying": "Audio reproduciendo",
            "play": "Reproducir",
            "pause": "Pausar",
            "volume": "Volumen",
            "playlist": "Lista de reproducción",
            "clear": "Limpiar",
            "clearPlaylist": "Lista de reproducción limpiada",
            "welcome": "¡Bienvenido al Reproductor de Medios Moderno!",
            "noPlayableTrack": "No se pudo encontrar una pista reproducible",
            "errorPlaying": "Error al reproducir",
            "formatNotSupported": "El formato puede no ser compatible",
            "searchPlaylist": "Buscar en la lista de reproducción...",
            "selectFiles": "Seleccionar archivos",
            "showPlaylist": "Mostrar lista de reproducción",
            "hidePlaylist": "Ocultar lista de reproducción",
            "playbackSpeed": "Velocidad de reproducción",
            "equalizer": "Ecualizador",
            "flat": "Plano",
            "autoPlay": "Reproducción automática",
            "shuffle": "Aleatorio",
            "removeItem": "Eliminar",
            "emptyPlaylist": "Tu lista de reproducción está vacía",
            "addMedia": "Añade archivos multimedia para comenzar a reproducir",
            "fileAdded": "archivo añadido a la lista de reproducción",
            "filesAdded": "archivos añadidos a la lista de reproducción",
            "unsupportedSkipped": "archivo no compatible omitido",
            "unsupportedSkipped_plural": "archivos no compatibles omitidos",
            "noMediaFound": "No se encontraron archivos multimedia",
            "selectFileForItem": "Por favor, selecciona el archivo real para este elemento",
            "mediaPlayerError": "Error del reproductor multimedia",
            "spectrumView": "Vista del espectro"
        },
        // Hintçe
        "hi": {
            "selectMedia": "मीडिया चुनें",
            "audioPlaying": "ऑडियो चल रहा है",
            "play": "प्ले करें",
            "pause": "रोकें",
            "volume": "आवाज़",
            "playlist": "प्लेलिस्ट",
            "clear": "साफ़ करें",
            "clearPlaylist": "प्लेलिस्ट साफ़ की गई",
            "welcome": "आधुनिक मीडिया प्लेयर में आपका स्वागत है!",
            "noPlayableTrack": "कोई प्ले करने योग्य ट्रैक नहीं मिला",
            "errorPlaying": "प्ले करने में त्रुटि",
            "formatNotSupported": "फॉर्मेट समर्थित नहीं हो सकता है",
            "searchPlaylist": "प्लेलिस्ट में खोजें...",
            "selectFiles": "फ़ाइलें चुनें",
            "showPlaylist": "प्लेलिस्ट दिखाएं",
            "hidePlaylist": "प्लेलिस्ट छिपाएं",
            "playbackSpeed": "प्लेबैक स्पीड",
            "equalizer": "इक्वलाइजर",
            "flat": "फ्लैट",
            "autoPlay": "ऑटो प्ले",
            "shuffle": "शफल",
            "removeItem": "हटाएं",
            "emptyPlaylist": "आपकी प्लेलिस्ट खाली है",
            "addMedia": "प्ले करना शुरू करने के लिए मीडिया फ़ाइलें जोड़ें",
            "fileAdded": "फ़ाइल प्लेलिस्ट में जोड़ी गई",
            "filesAdded": "फ़ाइलें प्लेलिस्ट में जोड़ी गईं",
            "unsupportedSkipped": "असमर्थित फ़ाइल छोड़ी गई",
            "unsupportedSkipped_plural": "असमर्थित फ़ाइलें छोड़ी गईं",
            "noMediaFound": "कोई मीडिया फ़ाइल नहीं मिली",
            "selectFileForItem": "कृपया इस आइटम के लिए वास्तविक फ़ाइल चुनें",
            "mediaPlayerError": "मीडिया प्लेयर त्रुटि",
            "spectrumView": "स्पेक्ट्रम दृश्य"
        }
    };
    
    // Metin çevirme fonksiyonu
    function __(key, count) {
        const lang = translations[currentLanguage] || translations["en"];
        let text = lang[key] || translations["en"][key] || key;
        
        // Çoğul formlar için destek
        if (count !== undefined && count !== 1 && lang[key + "_plural"]) {
            text = lang[key + "_plural"];
        }
        
        return text;
    }
    
    // Dil değiştirme fonksiyonu
    function changeLanguage(langCode) {
        if (translations[langCode]) {
            currentLanguage = langCode;
            updateUILanguage();
            showSnackbar(__("welcome"), 'info');
            return true;
        }
        return false;
    }
    
    // Arayüz dilini güncelleme
    function updateUILanguage() {
        // Sabit metinleri güncelle
        document.querySelector('#now-playing-title').textContent = __("selectMedia");
        mediaPlayer.poster = `https://placehold.co/800x450/212529/e9ecef?text=${__("selectMedia").replace(/ /g, '+')}`;
        
        playBtnIcon.closest('.btn').setAttribute('title', __("play"));
        muteBtn.setAttribute('title', __("volume"));
        
        // Playlist başlığı
        document.querySelector('.playlist-header h4').innerHTML = `<i class="bi bi-music-note-list me-2"></i>${__("playlist")}`;
        
        // Temizle butonu
        clearPlaylistBtn.innerHTML = `<i class="bi bi-trash me-1"></i>${__("clear")}`;
        
        // Playlist arama
        playlistSearch.placeholder = __("searchPlaylist");
        
        // Dosya seçme butonu
        document.querySelector('label[for="file-input"]').innerHTML = `<i class="bi bi-file-earmark-music me-2"></i>${__("selectFiles")}`;
        
        // Playlist göster/gizle butonu
        togglePlaylistBtn.innerHTML = playlistContainer.classList.contains('d-none') ? 
            `<i class="bi bi-music-note-list me-2"></i>${__("showPlaylist")}` : 
            `<i class="bi bi-music-note-list me-2"></i>${__("hidePlaylist")}`;
        
        // Oynatma hızı etiketi
        document.querySelector('label[for="playback-speed"]').textContent = __("playbackSpeed");
        
        // Ekolayzer başlığı
        document.querySelector('#equalizer-container h5').textContent = __("equalizer");
        
        // Preset seçenekleri
        document.querySelector('#equalizer-preset option[value="flat"]').textContent = __("flat");
        
        // Otomatik oynatma ve karıştır menü öğeleri
        document.querySelector('#auto-play-toggle').textContent = __("autoPlay") + ' ';
        document.querySelector('#shuffle-toggle').textContent = __("shuffle") + ' ';
        
        // Boş playlist mesajı
        if (playlist.length === 0) {
            renderPlaylist();
        }
    }
    
    // Dil seçimi için menü oluşturma
    function createLanguageMenu() {
        const navbar = document.querySelector('.player-header');
        
        // Dil menüsü dropdown
        const langDropdown = document.createElement('div');
        langDropdown.className = 'dropdown';
        langDropdown.innerHTML = `
            <button class="btn btn-sm btn-outline-light dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-translate"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="languageDropdown">
                <li><h6 class="dropdown-header">Dil / Language</h6></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="tr">Türkçe</a></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="en">English</a></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="de">Deutsch</a></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="ar">العربية</a></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="fr">Français</a></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="es">Español</a></li>
                <li><a class="dropdown-item lang-option" href="#" data-lang="hi">हिन्दी</a></li>
            </ul>
        `;
        
        // Mevcut dropdown'dan önce ekle
        const settingsDropdown = document.querySelector('#settingsDropdown').closest('.dropdown');
        navbar.insertBefore(langDropdown, settingsDropdown);
        
        // Dil seçeneklerine event listener ekle
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.dataset.lang;
                changeLanguage(lang);
            });
        });
    }
    
    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    overlayPlayBtn.addEventListener('click', togglePlay);
    videoOverlay.addEventListener('click', togglePlay);
    mediaPlayer.addEventListener('click', togglePlay);
    mediaPlayer.addEventListener('play', updatePlayButton);
    mediaPlayer.addEventListener('pause', updatePlayButton);
    mediaPlayer.addEventListener('timeupdate', updateProgress);
    mediaPlayer.addEventListener('loadedmetadata', setupMedia);
    mediaPlayer.addEventListener('ended', handleMediaEnd);
    mediaPlayer.addEventListener('error', handleMediaError);
    progressBar.addEventListener('input', setProgress);
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', setVolume);
    fileInput.addEventListener('change', loadMediaFiles);
    
    // Forward/backward with continuous press
    forwardBtn.addEventListener('mousedown', startFastForward);
    forwardBtn.addEventListener('mouseup', stopFastForward);
    forwardBtn.addEventListener('mouseleave', stopFastForward);
    forwardBtn.addEventListener('touchstart', startFastForward);
    forwardBtn.addEventListener('touchend', stopFastForward);
    
    backwardBtn.addEventListener('mousedown', startRewind);
    backwardBtn.addEventListener('mouseup', stopRewind);
    backwardBtn.addEventListener('mouseleave', stopRewind);
    backwardBtn.addEventListener('touchstart', startRewind);
    backwardBtn.addEventListener('touchend', stopRewind);
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrevious);
    loopBtn.addEventListener('click', toggleLoop);
    shuffleBtn.addEventListener('click', toggleShuffle);
    clearPlaylistBtn.addEventListener('click', clearPlaylist);
    togglePlaylistBtn.addEventListener('click', togglePlaylistVisibility);
    playbackSpeed.addEventListener('change', changePlaybackSpeed);
    
    // Tema ve ayarlar
    themeToggleBtn.addEventListener('click', openThemeSelector);
    closeThemeSelector.addEventListener('click', closeThemeSelectorModal);
    themeColors.forEach(color => {
        color.addEventListener('click', () => changeTheme(color.dataset.theme));
    });
    
    equalizerToggle.addEventListener('click', toggleEqualizer);
    equalizerPreset.addEventListener('change', applyEqualizerPreset);
    
    // Playlist arama
    playlistSearch.addEventListener('input', searchPlaylist);
    
    // Otomatik oynatma ve karıştır
    autoPlayToggle.addEventListener('click', toggleAutoPlay);
    shuffleToggle.addEventListener('click', toggleShuffleFromMenu);
    
    // Drag-and-drop events for playlist container
    playlistItems.addEventListener('dragover', handleDragOver);
    playlistItems.addEventListener('drop', handleDrop);
    
    // Functions
    function togglePlay() {
        if (mediaPlayer.src) {
            if (mediaPlayer.paused) {
                isPlayRequested = true;
                safePlay(mediaPlayer);
                
                // Start visualization if in spectrum view
                if (isSpectrumView && isAudio) {
                    try {
                        // Ensure we have time to set up the audio before visualizing
                        setTimeout(() => {
                            if (isPlaying && isAudio) {
                                setupSpectrum();
                                if (analyser) {
                                    startSpectrumVisualization();
                                }
                            }
                        }, 300);
                    } catch (error) {
                        console.error('Error starting visualization:', error);
                    }
                }
            } else {
                mediaPlayer.pause();
                
                // Stop visualization if in spectrum view
                if (isSpectrumView) {
                    stopSpectrumVisualization();
                }
            }
        } else if (playlist.length > 0) {
            playFromPlaylist(0);
        } else {
            fileInput.click();
        }
    }
    
    function updatePlayButton() {
        if (mediaPlayer.paused) {
            playBtnIcon.className = 'bi bi-play-fill fs-4';
            overlayPlayBtn.querySelector('i').className = 'bi bi-play-fill fs-1';
            isPlaying = false;
        } else {
            playBtnIcon.className = 'bi bi-pause-fill fs-4';
            overlayPlayBtn.querySelector('i').className = 'bi bi-pause-fill fs-1';
            isPlaying = true;
        }
    }
    
    function updateProgress() {
        const percent = (mediaPlayer.currentTime / mediaPlayer.duration) * 100;
        progressBar.value = percent;
        
        // Update current time display
        currentTimeEl.textContent = formatTime(mediaPlayer.currentTime);
    }
    
    function setProgress() {
        mediaPlayer.currentTime = (progressBar.value / 100) * mediaPlayer.duration;
    }
    
    function setupMedia() {
        // Reset controls
        progressBar.value = 0;
        
        // Set duration display
        durationEl.textContent = formatTime(mediaPlayer.duration);
        
        // Enable controls
        mediaPlayer.controls = false;
        
        // Set playback speed
        mediaPlayer.playbackRate = parseFloat(playbackSpeed.value);
        
        // Auto play
        if (isPlaying) {
            isPlayRequested = true;
            safePlay(mediaPlayer);
        }
        
        // Setup audio context for equalizer if it's audio
        if (isAudio && !audioContext) {
            setupEqualizer();
        }
    }
    
    function toggleMute() {
        mediaPlayer.muted = !mediaPlayer.muted;
        
        if (mediaPlayer.muted) {
            muteBtnIcon.className = 'bi bi-volume-mute-fill fs-4';
            volumeSlider.value = 0;
        } else {
            updateVolumeIcon();
            volumeSlider.value = mediaPlayer.volume * 100;
        }
    }
    
    function setVolume() {
        mediaPlayer.volume = volumeSlider.value / 100;
        mediaPlayer.muted = mediaPlayer.volume === 0;
        updateVolumeIcon();
    }
    
    function updateVolumeIcon() {
        const volume = mediaPlayer.volume;
        
        if (mediaPlayer.muted || volume === 0) {
            muteBtnIcon.className = 'bi bi-volume-mute-fill fs-4';
        } else if (volume < 0.5) {
            muteBtnIcon.className = 'bi bi-volume-down-fill fs-4';
        } else {
            muteBtnIcon.className = 'bi bi-volume-up-fill fs-4';
        }
    }

    // Show notification
    function showSnackbar(message, type = 'info') {
        const snackbar = document.getElementById('snackbar');
        snackbar.textContent = message;
        snackbar.className = type;
        snackbar.classList.add('show');
        
        // After 3 seconds, remove the show class
        setTimeout(() => {
            snackbar.classList.remove('show');
        }, 3000);
    }
    

    function loadMediaFiles(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            let validFilesCount = 0;
            let unsupportedCount = 0;
            
            // Check if we have template items to match with
            const hasTemplates = playlist.some(item => item.isTemplate);
            
            if (hasTemplates) {
                // Try to match files with template items
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    
                    // Check if this is a valid media file
                    if (file.type.startsWith('audio') || file.type.startsWith('video')) {
                        try {
                            const fileURL = URL.createObjectURL(file);
                            
                            // Find a matching template by name
                            const templateIndex = playlist.findIndex(item => 
                                item.isTemplate && item.name === file.name);
                            
                            if (templateIndex !== -1) {
                                // Update the template with the actual file data
                                playlist[templateIndex] = {
                                    name: file.name,
                                    type: file.type,
                                    size: formatFileSize(file.size),
                                    url: fileURL,
                                    file: file,
                                    isTemplate: false // No longer a template
                                };
                                
                                validFilesCount++;
                                showSnackbar(`${__("fileAdded")}: ${file.name}`, 'success');
                            } else {
                                // Add as a new item
                                playlist.push({
                                    name: file.name,
                                    type: file.type,
                                    size: formatFileSize(file.size),
                                    url: fileURL,
                                    file: file
                                });
                                validFilesCount++;
                            }
                        } catch (error) {
                            console.error('Error creating object URL:', error);
                            showSnackbar(`${__("errorPlaying")}: ${file.name}: ${error.message}`, 'error');
                        }
                    } else {
                        unsupportedCount++;
                        console.warn('Unsupported file type:', file.type);
                    }
                }
            } else {
                // Add files to playlist normally
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    
                    // Check if this is a valid media file
                    if (file.type.startsWith('audio') || file.type.startsWith('video')) {
                        try {
                            // Create blob URL
                            const fileURL = URL.createObjectURL(file);
                            
                            // Add to playlist
                            playlist.push({
                                name: file.name,
                                type: file.type,
                                size: formatFileSize(file.size),
                                url: fileURL,
                                file: file
                            });
                            validFilesCount++;
                        } catch (error) {
                            console.error('Error creating object URL:', error);
                            showSnackbar(`${__("errorPlaying")}: ${file.name}: ${error.message}`, 'error');
                        }
                    } else {
                        unsupportedCount++;
                        console.warn('Unsupported file type:', file.type);
                    }
                }
            }
            
            // Update playlist UI
            renderPlaylist();
            
            // If nothing is playing, start the first non-template item
            if (validFilesCount > 0 && (!mediaPlayer.src || mediaPlayer.paused)) {
                const firstPlayableIndex = playlist.findIndex(item => !item.isTemplate && !item.hasError);
                if (firstPlayableIndex !== -1) {
                    playFromPlaylist(firstPlayableIndex);
                }
            }
            
            // Show appropriate messages
            if (validFilesCount > 0) {
                showSnackbar(`${validFilesCount} ${validFilesCount === 1 ? __("fileAdded") : __("filesAdded")}`, 'success');
                
                if (unsupportedCount > 0) {
                    setTimeout(() => {
                        showSnackbar(`${unsupportedCount} ${unsupportedCount === 1 ? __("unsupportedSkipped") : __("unsupportedSkipped_plural")}`, 'warning');
                    }, 1500);
                }
            } else if (unsupportedCount > 0) {
                showSnackbar(`${unsupportedCount} ${unsupportedCount === 1 ? __("unsupportedSkipped") : __("unsupportedSkipped_plural")}`, 'warning');
            } else {
                showSnackbar(__("noMediaFound"), 'warning');
            }
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function changePlaybackSpeed() {
        const speed = parseFloat(playbackSpeed.value);
        mediaPlayer.playbackRate = speed;
        showSnackbar(`Playback speed set to ${speed}x`, 'info');
    }
    
    function toggleAutoPlay() {
        isAutoPlay = !isAutoPlay;
        const checkIcon = autoPlayToggle.querySelector('i');
        
        if (isAutoPlay) {
            checkIcon.classList.remove('d-none');
            showSnackbar('Auto-play enabled', 'info');
        } else {
            checkIcon.classList.add('d-none');
            showSnackbar('Auto-play disabled', 'info');
        }
    }
    
    function toggleShuffleFromMenu() {
        toggleShuffle();
        const checkIcon = shuffleToggle.querySelector('i');
        
        if (isShuffling) {
            checkIcon.classList.remove('d-none');
        } else {
            checkIcon.classList.add('d-none');
        }
    }
    
    function toggleShuffle() {
        isShuffling = !isShuffling;
        const shuffleIcon = shuffleBtn.querySelector('i');
        
        if (isShuffling) {
            shuffleIcon.classList.add('active-icon');
            showSnackbar('Shuffle mode enabled', 'info');
        } else {
            shuffleIcon.classList.remove('active-icon');
            showSnackbar('Shuffle mode disabled', 'info');
        }
    }
    
    function renderPlaylist() {
        // Clear playlist container
        playlistItems.innerHTML = '';
        
        if (playlist.length === 0) {
            playlistItems.innerHTML = `
                <div class="empty-playlist text-center py-5">
                    <i class="bi bi-music-note-list fs-1 mb-3"></i>
                    <p>${__("emptyPlaylist")}</p>
                    <p class="text-muted">${__("addMedia")}</p>
                </div>
            `;
            return;
        }
        
        // Filter playlist based on search
        let filteredPlaylist = playlist;
        const searchQuery = playlistSearch.value.trim().toLowerCase();
        if (searchQuery) {
            filteredPlaylist = playlist.filter(item => 
                item.name.toLowerCase().includes(searchQuery) || 
                item.type.toLowerCase().includes(searchQuery)
            );
            
            if (filteredPlaylist.length === 0) {
                playlistItems.innerHTML = `
                    <div class="empty-playlist text-center py-5">
                        <i class="bi bi-search fs-1 mb-3"></i>
                        <p>No matches found</p>
                        <p class="text-muted">Try different search terms</p>
                    </div>
                `;
                return;
            }
        }
        
        // Add each item to playlist
        filteredPlaylist.forEach((item, index) => {
            const actualIndex = playlist.indexOf(item);
            const isActive = actualIndex === currentIndex;
            const isVideo = item.type.startsWith('video');
            const hasError = item.hasError === true;
            const itemEl = document.createElement('div');
            itemEl.className = `playlist-item ${isActive ? 'active' : ''} ${hasError ? 'error-item' : ''}`;
            itemEl.draggable = true;
            itemEl.dataset.index = actualIndex;
            
            if (isActive && isPlaying) {
                itemEl.classList.add('playing');
            }
            
            itemEl.innerHTML = `
                <div class="playlist-item-drag-handle" data-drag-handle="true">
                    <i class="bi bi-grip-vertical"></i>
                </div>
                <div class="playlist-item-icon">
                    <i class="bi ${isVideo ? 'bi-film' : 'bi-music-note-beamed'}${hasError ? ' text-danger' : ''}"></i>
                </div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${item.name}${hasError ? ' <small class="text-danger">(Format not supported)</small>' : ''}</div>
                    <div class="playlist-item-meta">${item.type.split('/')[0]} · ${item.size}</div>
                </div>
                <div class="playlist-item-actions">
                    <button class="btn btn-sm btn-link remove-btn" data-index="${actualIndex}">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </div>
            `;
            
            // Add drag and drop events
            itemEl.addEventListener('dragstart', handleDragStart);
            itemEl.addEventListener('dragend', handleDragEnd);
            itemEl.addEventListener('dragenter', handleDragEnter);
            itemEl.addEventListener('dragleave', handleDragLeave);
            
            // Touch events for mobile
            itemEl.addEventListener('touchstart', handleTouchStart, { passive: false });
            itemEl.addEventListener('touchmove', handleTouchMove, { passive: false });
            itemEl.addEventListener('touchend', handleTouchEnd, { passive: false });
            
            // Click to play
            itemEl.addEventListener('click', (e) => {
                // Only play if not clicking on the remove button or drag handle
                if (!e.target.closest('.remove-btn') && !e.target.closest('[data-drag-handle="true"]')) {
                    playFromPlaylist(actualIndex);
                }
            });
            
            playlistItems.appendChild(itemEl);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                removeFromPlaylist(index);
            });
        });
    }
    
    function searchPlaylist() {
        renderPlaylist();
    }
    
    // Media Player'ı yeniden oluştur
    function recreateMediaPlayer() {
        try {
            console.log("Media player yeniden oluşturuluyor...");
            
            // İşlem sırasında play isteği gelmesin
            isPlayRequested = false;
            
            // Stop spectrum visualization if active
            stopSpectrumVisualization();
            
            // Cleanup audio context and nodes if they exist
            if (audioContext) {
                if (sourceNode) {
                    sourceNode.disconnect();
                    sourceNode = null;
                }
                
                if (equalizerNodes.length > 0) {
                    equalizerNodes.forEach(node => node.disconnect());
                    equalizerNodes = [];
                }
                
                if (analyser) {
                    analyser.disconnect();
                    analyser = null;
                }
            }
            
            // Mevcut medya oynatıcıyı temizle
            const mediaContainer = document.querySelector('.media-container');
            const oldPlayer = document.getElementById('media-player');
            
            if (!mediaContainer || !oldPlayer) {
                console.error("Media container veya player bulunamadı!");
                return null;
            }
            
            // Eski oynatıcının özelliklerini kaydet
            const oldVolume = oldPlayer.volume;
            const oldMuted = oldPlayer.muted;
            
            // Eski oynatıcıyı kaldırmadan önce, tüm play/pause işlemlerini tamamlanması için bekle
            oldPlayer.pause();
            
            // Kısa bir bekleme süresi ekleyelim
            setTimeout(() => {
                oldPlayer.removeAttribute('src');
                oldPlayer.load();
            }, 10);
            
            // Yeni bir video elementi oluştur
            const newPlayer = document.createElement('video');
            newPlayer.id = 'media-player';
            newPlayer.className = 'w-100 rounded shadow';
            newPlayer.poster = 'https://placehold.co/800x450/212529/e9ecef?text=Select+Media';
            
            // Önce eski oynatıcıyı kaldır sonra yenisini ekle
            oldPlayer.remove();
            mediaContainer.insertBefore(newPlayer, mediaContainer.firstChild);
            
            // Yeni oluşturulan oynatıcıya event listener'ları ekle
            newPlayer.addEventListener('play', updatePlayButton);
            newPlayer.addEventListener('pause', updatePlayButton);
            newPlayer.addEventListener('timeupdate', updateProgress);
            newPlayer.addEventListener('loadedmetadata', setupMedia);
            newPlayer.addEventListener('ended', handleMediaEnd);
            newPlayer.addEventListener('error', handleMediaError);
            newPlayer.addEventListener('click', togglePlay);
            
            // Ses ayarlarını aktar
            newPlayer.volume = oldVolume;
            newPlayer.muted = oldMuted;
            
            // Global değişkeni güncelle
            mediaPlayer = newPlayer;
            
            console.log("Media player başarıyla yenilendi");
            return newPlayer;
        } catch (error) {
            console.error("Media player yenileme hatası:", error);
            // Hata durumunda mevcut media player'ı döndür
            return mediaPlayer;
        }
    }

    function playFromPlaylist(index) {
        if (index >= 0 && index < playlist.length) {
            currentIndex = index;
            const item = playlist[index];
            
            // Check if the item is a template or has an invalid URL
            if (item.isTemplate || !item.url) {
                showSnackbar(__("selectFileForItem"), 'warning');
                
                // Try playing the next song if possible
                if (!isPlayingFromError) {
                    isPlayingFromError = true;
                    setTimeout(() => {
                        isPlayingFromError = false;
                        playNext();
                    }, 500);
                }
                return;
            }
            
            // Cleanup previous audio context and nodes if they exist
            if (sourceNode) {
                sourceNode.disconnect();
                sourceNode = null;
            }
            
            try {
                // Medya oynatıcıyı tamamen yeniden oluştur
                const newPlayer = recreateMediaPlayer();
                
                // Eğer yeni oynatıcı oluşturulamamışsa, işlemi durdur
                if (!newPlayer) {
                    showSnackbar(__("mediaPlayerError"), "error");
                    return;
                }
                
                console.log("Yeni şarkı oynatılıyor:", item.name);
                
                // Yeni oynatıcıya kaynağı ekle
                newPlayer.src = item.url;
                
                // Check if it's audio or video
                isAudio = item.type.startsWith('audio');
                
                if (isAudio) {
                    newPlayer.poster = `https://placehold.co/800x450/212529/e9ecef?text=${__("audioPlaying").replace(/ /g, '+')}`;
                    videoOverlay.style.display = 'none';
                    
                    // If we're in spectrum view, update the title
                    if (isSpectrumView) {
                        spectrumTitle.textContent = item.name;
                    }
                } else {
                    videoOverlay.style.display = 'flex';
                }
                
                // Update now playing title
                nowPlayingTitle.textContent = item.name;
                
                // Add error handling for media loading errors
                newPlayer.onerror = function() {
                    console.error('Media error code:', newPlayer.error ? newPlayer.error.code : 'unknown');
                    console.error('Error details:', newPlayer.error);
                    showSnackbar(`${__("errorPlaying")}: ${item.name}. ${__("formatNotSupported")}`, 'error');
                    
                    // Mark this item as problematic
                    item.hasError = true;
                    
                    // If we have more items in the playlist, try playing the next one after a short delay
                    if (playlist.length > 1 && !isPlayingFromError) {
                        isPlayingFromError = true;
                        setTimeout(() => {
                            isPlayingFromError = false;
                            if (currentIndex < playlist.length - 1) {
                                playNext();
                            } else if (playlist.length > 0) {
                                if (isAutoPlay) {
                                    playFromPlaylist(0);
                                }
                            }
                        }, 1000);
                    }
                };
                
                // Oynatma isteği gönder
                isPlayRequested = true;
                safePlay(newPlayer);
                
                // Start spectrum visualization if we're in spectrum view and it's audio
                if (isSpectrumView && isAudio) {
                    try {
                        // Ensure we have time to set up the audio before visualizing
                        setTimeout(() => {
                            if (isPlaying && isAudio) {
                                setupSpectrum();
                                if (analyser) {
                                    startSpectrumVisualization();
                                }
                            }
                        }, 300);
                    } catch (error) {
                        console.error('Error starting visualization:', error);
                    }
                }
                
                // Update playlist UI
                renderPlaylist();
            } catch (error) {
                console.error('Error playing file:', error);
                console.error('Error details:', error);
                showSnackbar(`${__("errorPlaying")}: ${error.message}`, 'error');
                
                // Mark this item as problematic
                item.hasError = true;
                
                // Try playing the next item if available
                if (currentIndex < playlist.length - 1 && !isPlayingFromError) {
                    isPlayingFromError = true;
                    setTimeout(() => {
                        isPlayingFromError = false;
                        playNext();
                    }, 1000);
                }
            }
        }
    }
    
    function handleMediaEnd() {
        // Güvenli şekilde bir sonraki şarkıya geç
        try {
            if (isLooping) {
                // Current track'i tekrar çal
                mediaPlayer.currentTime = 0;
                
                // Güvenli şekilde oynat
                isPlayRequested = true;
                safePlay(mediaPlayer);
            } else {
                // Doğrudan playNext'i çağır - bu fonksiyon zaten hata kontrolü yapıyor
                playNext();
            }
        } catch (error) {
            console.error('Media end handling error:', error);
            
            // Eğer bir hata oluşursa ve daha fazla şarkı varsa, bir sonraki şarkıyı denemeye çalış
            if (!isPlayingFromError && playlist.length > 1) {
                isPlayingFromError = true;
                setTimeout(() => {
                    isPlayingFromError = false;
                    
                    // Mevcut şarkıdan sonra bir şarkı varsa, onu çal
                    if (currentIndex < playlist.length - 1) {
                        playNext();
                    } else if (isAutoPlay && playlist.length > 0) {
                        // Otomatik oynatma açıksa ve başa dönmemiz gerekiyorsa
                        playFromPlaylist(0);
                    }
                }, 1000);
            }
        }
    }
    
    function playNext() {
        if (isShuffling && playlist.length > 1) {
            // Play random track excluding the current one and error tracks
            let attempts = 0;
            let nextIndex;
            
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
                attempts++;
                // Avoid stuck in infinite loop by limiting attempts
                if (attempts > 50) break; 
            } while ((nextIndex === currentIndex || 
                    (playlist[nextIndex].hasError === true)) && 
                    attempts < 50 && playlist.length > 1);
            
            if (attempts <= 50) {
                playFromPlaylist(nextIndex);
            } else {
                showSnackbar('Could not find a playable track', 'warning');
            }
        } else {
            // Find next playable track
            let nextIndex = currentIndex + 1;
            
            // Skip tracks with errors
            while (nextIndex < playlist.length && playlist[nextIndex].hasError === true) {
                nextIndex++;
            }
            
            if (nextIndex < playlist.length) {
                playFromPlaylist(nextIndex);
            } else if (playlist.length > 0 && (isLooping || isAutoPlay)) {
                // Loop back to the first item, skipping any with errors
                let firstPlayable = 0;
                while (firstPlayable < playlist.length && playlist[firstPlayable].hasError === true) {
                    firstPlayable++;
                }
                
                if (firstPlayable < playlist.length) {
                    playFromPlaylist(firstPlayable);
                } else {
                    showSnackbar('No playable tracks in playlist', 'warning');
                }
            }
        }
    }
    
    function playPrevious() {
        if (mediaPlayer.currentTime > 3) {
            // If more than 3 seconds played, restart the current track
            mediaPlayer.currentTime = 0;
        } else if (isShuffling && playlist.length > 1) {
            // Play random track excluding the current one and error tracks
            let attempts = 0;
            let prevIndex;
            
            do {
                prevIndex = Math.floor(Math.random() * playlist.length);
                attempts++;
                // Avoid stuck in infinite loop by limiting attempts
                if (attempts > 50) break;
            } while ((prevIndex === currentIndex || 
                    (playlist[prevIndex].hasError === true)) && 
                    attempts < 50 && playlist.length > 1);
            
            if (attempts <= 50) {
                playFromPlaylist(prevIndex);
            } else {
                showSnackbar('Could not find a playable track', 'warning');
            }
        } else {
            // Find previous playable track
            let prevIndex = currentIndex - 1;
            
            // Skip tracks with errors
            while (prevIndex >= 0 && playlist[prevIndex].hasError === true) {
                prevIndex--;
            }
            
            if (prevIndex >= 0) {
                playFromPlaylist(prevIndex);
            } else if (playlist.length > 0 && (isLooping || isAutoPlay)) {
                // Loop to the last item, skipping any with errors
                let lastPlayable = playlist.length - 1;
                while (lastPlayable >= 0 && playlist[lastPlayable].hasError === true) {
                    lastPlayable--;
                }
                
                if (lastPlayable >= 0) {
                    playFromPlaylist(lastPlayable);
                } else {
                    showSnackbar('No playable tracks in playlist', 'warning');
                }
            }
        }
    }
    
    function removeFromPlaylist(index) {
        // Check if the item to remove is currently playing
        const isCurrentPlaying = index === currentIndex;
        
        // Remove the item
        playlist.splice(index, 1);
        
        // Update currentIndex
        if (index < currentIndex) {
            currentIndex--;
        } else if (isCurrentPlaying) {
            // If we removed the current item
            if (index < playlist.length) {
                // Play the next item at the same position
                playFromPlaylist(index);
            } else if (playlist.length > 0) {
                // Play the last item
                playFromPlaylist(playlist.length - 1);
            } else {
                // Playlist is empty
                mediaPlayer.pause();
                mediaPlayer.src = '';
                mediaPlayer.poster = 'https://placehold.co/800x450/212529/e9ecef?text=Select+Media';
                nowPlayingTitle.textContent = 'Select a file to play';
                currentIndex = -1;
            }
        }
        
        // Render updated playlist
        renderPlaylist();
        showSnackbar('Item removed from playlist', 'info');
    }
    
    function clearPlaylist() {
        if (playlist.length === 0) return;
        
        try {
            // Oynatıcıyı tamamen yenile
            const newPlayer = recreateMediaPlayer();
            
            if (newPlayer) {
                // Set default poster
                newPlayer.poster = `https://placehold.co/800x450/212529/e9ecef?text=${__("selectMedia").replace(/ /g, '+')}`;
            } else {
                // Eğer oynatıcı yenilenemezse hatayı yakala
                showSnackbar(__("mediaPlayerError"), 'error');
            }
            
            nowPlayingTitle.textContent = __("selectMedia");
            
            // Clear playlist
            playlist = [];
            currentIndex = -1;
            isPlaying = false;
            
            // Reset UI elements
            playBtnIcon.className = 'bi bi-play-fill fs-4';
            overlayPlayBtn.querySelector('i').className = 'bi bi-play-fill fs-1';
            currentTimeEl.textContent = '00:00';
            durationEl.textContent = '00:00';
            progressBar.value = 0;
            
            // If audio context exists, disconnect it
            if (sourceNode) {
                sourceNode.disconnect();
                sourceNode = null;
            }
            
            // Update UI
            renderPlaylist();
            showSnackbar(__("clearPlaylist"), 'info');
        } catch (error) {
            console.error('Çalma listesi temizlenirken hata:', error);
            showSnackbar(__("mediaPlayerError"), 'error');
        }
    }
    
    function toggleLoop() {
        isLooping = !isLooping;
        const loopIcon = loopBtn.querySelector('i');
        
        if (isLooping) {
            loopIcon.classList.add('active-icon');
            showSnackbar('Loop enabled', 'info');
        } else {
            loopIcon.classList.remove('active-icon');
            showSnackbar('Loop disabled', 'info');
        }
    }
    
    function togglePlaylistVisibility() {
        playlistContainer.classList.toggle('d-none');
        const isVisible = !playlistContainer.classList.contains('d-none');
        
        togglePlaylistBtn.innerHTML = isVisible 
            ? '<i class="bi bi-music-note-list me-2"></i>Hide Playlist'
            : '<i class="bi bi-music-note-list me-2"></i>Show Playlist';
    }
    
    function startFastForward(e) {
        e.preventDefault();
        if (mediaPlayer.src) {
            // Prevent multiple intervals
            stopFastForward();
            
            // Start continuous forwarding
            forwardInterval = setInterval(() => {
                skipTime(2); // Fast forward by 2 seconds every 100ms
            }, 100);
        }
    }
    
    function stopFastForward() {
        if (forwardInterval) {
            clearInterval(forwardInterval);
            forwardInterval = null;
        }
    }
    
    function startRewind(e) {
        e.preventDefault();
        if (mediaPlayer.src) {
            // Prevent multiple intervals
            stopRewind();
            
            // Start continuous rewinding
            backwardInterval = setInterval(() => {
                skipTime(-2); // Rewind by 2 seconds every 100ms
            }, 100);
        }
    }
    
    function stopRewind() {
        if (backwardInterval) {
            clearInterval(backwardInterval);
            backwardInterval = null;
        }
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    function skipTime(seconds) {
        if (mediaPlayer.src) {
            const newTime = Math.max(0, Math.min(mediaPlayer.duration, mediaPlayer.currentTime + seconds));
            mediaPlayer.currentTime = newTime;
        }
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (mediaPlayer.requestFullscreen) {
                mediaPlayer.requestFullscreen();
            } else if (mediaPlayer.webkitRequestFullscreen) {
                mediaPlayer.webkitRequestFullscreen();
            } else if (mediaPlayer.msRequestFullscreen) {
                mediaPlayer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowRight') {
            skipTime(10);
        } else if (e.code === 'ArrowLeft') {
            skipTime(-10);
        } else if (e.code === 'ArrowUp') {
            volumeSlider.value = Math.min(parseInt(volumeSlider.value) + 10, 100);
            setVolume();
        } else if (e.code === 'ArrowDown') {
            volumeSlider.value = Math.max(parseInt(volumeSlider.value) - 10, 0);
            setVolume();
        } else if (e.code === 'KeyM') {
            toggleMute();
        } else if (e.code === 'KeyF') {
            toggleFullscreen();
        } else if (e.code === 'KeyL') {
            toggleLoop();
        } else if (e.code === 'KeyN') {
            playNext();
        } else if (e.code === 'KeyP') {
            playPrevious();
        } else if (e.code === 'KeyS') {
            toggleShuffle();
        } else if (e.code === 'KeyE') {
            toggleEqualizer();
        }
    });
    
    // Tarayıcı medya format desteğini kontrol etme
    function canPlayType(mimeType) {
        const tempVideo = document.createElement('video');
        return !!tempVideo.canPlayType(mimeType);
    }
    
    // Format desteğini kontrol et ve kullanıcıya göster
    function checkBrowserSupport() {
        const supportedFormats = [];
        const unsupportedFormats = [];
        
        // Tarayıcıyı tespit et
        let browserName = "Bilinmeyen Tarayıcı";
        const userAgent = navigator.userAgent;
        
        if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Mozilla Firefox";
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            browserName = "Samsung Internet";
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            browserName = "Opera";
        } else if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) {
            browserName = "Internet Explorer";
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Microsoft Edge (Legacy)";
        } else if (userAgent.indexOf("Edg") > -1) {
            browserName = "Microsoft Edge (Chromium)";
        } else if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Google Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Safari";
        }
        
        console.log("Kullanılan tarayıcı:", browserName);
        console.log("User Agent:", userAgent);
        
        // Video formatları
        const videoFormats = [
            { name: 'MP4 (H.264)', type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' },
            { name: 'MP4 (Basic)', type: 'video/mp4' },
            { name: 'WebM (VP8)', type: 'video/webm; codecs="vp8, vorbis"' },
            { name: 'WebM (VP9)', type: 'video/webm; codecs="vp9, opus"' },
            { name: 'WebM (Basic)', type: 'video/webm' },
            { name: 'Ogg Theora', type: 'video/ogg; codecs="theora, vorbis"' },
            { name: 'Ogg Video', type: 'video/ogg' },
            { name: 'AVI', type: 'video/avi' },
            { name: 'MKV', type: 'video/x-matroska' },
            { name: 'MOV', type: 'video/quicktime' }
        ];
        
        // Ses formatları
        const audioFormats = [
            { name: 'MP3', type: 'audio/mpeg' },
            { name: 'AAC', type: 'audio/aac' },
            { name: 'WAV', type: 'audio/wav' },
            { name: 'Ogg Vorbis', type: 'audio/ogg; codecs="vorbis"' },
            { name: 'Opus', type: 'audio/ogg; codecs="opus"' },
            { name: 'Ogg Audio', type: 'audio/ogg' },
            { name: 'M4A', type: 'audio/mp4' },
            { name: 'FLAC', type: 'audio/flac' }
        ];
        
        // Video formatlarını kontrol et
        videoFormats.forEach(format => {
            const support = canPlayType(format.type);
            if (support) {
                supportedFormats.push(format.name);
            } else {
                unsupportedFormats.push(format.name);
            }
        });
        
        // Ses formatlarını kontrol et
        audioFormats.forEach(format => {
            const support = canPlayType(format.type);
            if (support) {
                supportedFormats.push(format.name);
            } else {
                unsupportedFormats.push(format.name);
            }
        });
        
        console.log('Desteklenen formatlar:', supportedFormats);
        console.log('Desteklenmeyen formatlar:', unsupportedFormats);
        
        // Kullanıcıya desteklenen formatları göster
        if (supportedFormats.length > 0) {
            showSnackbar(`${browserName} tarayıcınız ${supportedFormats.length} medya formatını destekliyor`, 'info');
            
            // En yaygın format desteğini kontrol et
            const hasMP4 = supportedFormats.includes('MP4 (H.264)') || supportedFormats.includes('MP4 (Basic)');
            const hasMP3 = supportedFormats.includes('MP3');
            
            if (!hasMP4 || !hasMP3) {
                setTimeout(() => {
                    showSnackbar('Bazı yaygın formatlar desteklenmiyor. Chrome veya Edge tarayıcılarını deneyin.', 'warning');
                }, 3000);
            }
            
            // Tam format listesini göstermek isterse
            document.addEventListener('keydown', function(e) {
                // Ctrl+Shift+F tuş kombinasyonu
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
                    alert(`Desteklenen formatlar (${supportedFormats.length}):\n${supportedFormats.join(', ')}\n\nDesteklenmeyen formatlar (${unsupportedFormats.length}):\n${unsupportedFormats.join(', ')}`);
                }
            });
        }
    }
    
    // Initialize
    function initializePlayer() {
        // Initialize volume
        setVolume();
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'default';
        if (savedTheme !== 'default') {
            changeTheme(savedTheme);
        }
        
        // Mark active theme in selector
        document.querySelector(`.theme-color[data-theme="${savedTheme}"]`)?.classList.add('active');
        
        // Initialize playlist visibility for mobile
        if (window.innerWidth < 992) {
            playlistContainer.classList.add('d-none');
        }
        
        // Initialize isAutoPlay with the checkmark
        autoPlayToggle.querySelector('i').classList.toggle('d-none', !isAutoPlay);
        
        // Initialize shuffle with the checkmark
        shuffleToggle.querySelector('i').classList.toggle('d-none', !isShuffling);
        
        // Dil menüsünü oluştur
        createLanguageMenu();
        
        // Kaydedilmiş dili yükle veya varsayılan dili ayarla
        const savedLanguage = localStorage.getItem('language') || currentLanguage;
        changeLanguage(savedLanguage);
        
        // Medya format desteğini kontrol et
        checkBrowserSupport();
        
        // Welcome message
        showSnackbar(__("welcome"), 'info');
        
        // View toggle listener
        viewToggle.addEventListener('click', toggleView);
        
        // When audio ends, stop visualization if active
        mediaPlayer.addEventListener('ended', () => {
            if (isSpectrumView) {
                stopSpectrumVisualization();
            }
        });
        
        // Cleanup spectrum visualization when clearing playlist
        clearPlaylistBtn.addEventListener('click', () => {
            stopSpectrumVisualization();
        });
    }
    
    // Initialize player
    initializePlayer();
    
    // Hide playlist container when screen resizes below 992px
    window.addEventListener('resize', () => {
        if (window.innerWidth < 992 && !playlistContainer.classList.contains('d-none')) {
            playlistContainer.classList.add('d-none');
            togglePlaylistBtn.innerHTML = '<i class="bi bi-music-note-list me-2"></i>Show Playlist';
        }
    });
    
    // Allow drag and drop file upload
    document.addEventListener('dragover', e => {
        e.preventDefault();
        document.body.classList.add('drag-over');
    });
    
    document.addEventListener('dragleave', e => {
        if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
            document.body.classList.remove('drag-over');
        }
    });
    
    document.addEventListener('drop', e => {
        e.preventDefault();
        document.body.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            const files = e.dataTransfer.files;
            let validFilesCount = 0;
            let unsupportedCount = 0;
            
            // Add files to playlist
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Check if file is a supported media type
                if (file.type.startsWith('audio') || file.type.startsWith('video')) {
                    try {
                        const fileURL = URL.createObjectURL(file);
                        
                        playlist.push({
                            name: file.name,
                            type: file.type,
                            size: formatFileSize(file.size),
                            url: fileURL,
                            file: file
                        });
                        
                        validFilesCount++;
                    } catch (error) {
                        console.error('Error creating object URL:', error);
                        showSnackbar(`Error adding file ${file.name}: ${error.message}`, 'error');
                    }
                } else {
                    unsupportedCount++;
                    console.warn('Unsupported file type:', file.type);
                }
            }
            
            // Update playlist UI
            renderPlaylist();
            
            // If nothing is playing, start the first valid file
            if (validFilesCount > 0 && (!mediaPlayer.src || mediaPlayer.paused)) {
                // Find the first valid file index (may not be 0 if there are templates)
                const firstValidIndex = playlist.findIndex(item => !item.hasError && !item.isTemplate);
                if (firstValidIndex !== -1) {
                    playFromPlaylist(firstValidIndex);
                }
            }
            
            // Show appropriate message
            if (validFilesCount > 0) {
                showSnackbar(`${validFilesCount} dosya çalma listesine eklendi`, 'success');
                
                if (unsupportedCount > 0) {
                    setTimeout(() => {
                        showSnackbar(`${unsupportedCount} desteklenmeyen dosya atlandı`, 'warning');
                    }, 1500);
                }
            } else if (unsupportedCount > 0) {
                showSnackbar(`Desteklenmeyen ${unsupportedCount} dosya atlandı`, 'warning');
            } else {
                showSnackbar('Hiçbir medya dosyası bulunamadı', 'warning');
            }
        }
    });
    
    // Tema yönetimi
    function openThemeSelector() {
        themeSelector.classList.add('active');
    }
    
    function closeThemeSelectorModal() {
        themeSelector.classList.remove('active');
    }
    
    function changeTheme(theme) {
        // Remove previous theme class
        document.body.classList.remove(`theme-${currentTheme}`);
        
        // Add new theme class
        document.body.classList.add(`theme-${theme}`);
        currentTheme = theme;
        
        // Update active theme in selector
        document.querySelectorAll('.theme-color').forEach(color => {
            if (color.dataset.theme === theme) {
                color.classList.add('active');
            } else {
                color.classList.remove('active');
            }
        });
        
        // Save theme preference
        localStorage.setItem('theme', theme);
        
        // Close theme selector
        closeThemeSelectorModal();
        
        showSnackbar(`Theme changed to ${theme}`, 'info');
    }
    
    // Ekolayzer
    function toggleEqualizer() {
        equalizerContainer.classList.toggle('d-none');
        
        if (!audioContext && isAudio) {
            setupEqualizer();
        }
    }
    
    // Toggle between player and spectrum view
    function toggleView() {
        isSpectrumView = !isSpectrumView;
        
        if (isSpectrumView) {
            mediaContainer.classList.add('d-none');
            spectrumContainer.classList.remove('d-none');
            viewToggle.querySelector('i').classList.remove('d-none');
            
            // Update spectrum title
            spectrumTitle.textContent = nowPlayingTitle.textContent;
            
            // Setup audio analyser if needed
            if (isAudio && !analyser) {
                setupSpectrum();
            }
            
            // Start visualization if playing
            if (isPlaying && isAudio) {
                startSpectrumVisualization();
            }
        } else {
            mediaContainer.classList.remove('d-none');
            spectrumContainer.classList.add('d-none');
            viewToggle.querySelector('i').classList.add('d-none');
            
            // Stop visualization
            stopSpectrumVisualization();
        }
    }
    
    // Setup audio analyser for spectrum visualization
    function setupSpectrum() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Create or recreate source node if it doesn't exist or is disconnected
            if (!sourceNode && mediaPlayer.src) {
                sourceNode = audioContext.createMediaElementSource(mediaPlayer);
            }
            
            // Don't proceed if we couldn't create a source node
            if (!sourceNode) {
                console.warn('Cannot setup spectrum - no audio source available');
                return;
            }
            
            // Create analyser if not exists
            if (!analyser) {
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                
                // Connect source to analyser if not already connected
                if (equalizerNodes.length > 0) {
                    // If equalizer is active, connect after the last equalizer node
                    const lastNode = equalizerNodes[equalizerNodes.length - 1];
                    
                    // Disconnect last node from destination
                    lastNode.disconnect();
                    
                    // Connect last node to analyser
                    lastNode.connect(analyser);
                    
                    // Connect analyser to destination
                    analyser.connect(audioContext.destination);
                } else {
                    // Connect source directly to analyser
                    sourceNode.connect(analyser);
                    analyser.connect(audioContext.destination);
                }
            }
            
            // Make sure canvas is properly sized
            resizeSpectrumCanvas();
            window.addEventListener('resize', resizeSpectrumCanvas);
        } catch (error) {
            console.error('Error setting up spectrum:', error);
            showSnackbar('Error setting up audio visualization', 'error');
        }
    }
    
    function resizeSpectrumCanvas() {
        spectrumCanvas.width = spectrumCanvas.clientWidth;
        spectrumCanvas.height = spectrumCanvas.clientHeight;
    }
    
    function startSpectrumVisualization() {
        if (!analyser || !isAudio) return;
        
        const ctx = spectrumCanvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function animate() {
            spectrumAnimationId = requestAnimationFrame(animate);
            
            // Get frequency data
            analyser.getByteFrequencyData(dataArray);
            
            // Clear canvas
            ctx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
            
            // Canvas dimensions
            const width = spectrumCanvas.width;
            const height = spectrumCanvas.height;
            
            // Calculate bar width
            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            // Get gradient based on current theme
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            
            // Set gradient colors based on theme
            const computedStyle = getComputedStyle(document.documentElement);
            const primaryColor = computedStyle.getPropertyValue('--primary').trim();
            const secondaryColor = computedStyle.getPropertyValue('--secondary').trim();
            
            gradient.addColorStop(0, secondaryColor);
            gradient.addColorStop(1, primaryColor);
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 1.5;
                
                // Calculate how far we are in the frequency spectrum (0 to 1)
                const freqPercent = i / bufferLength;
                
                // Make higher frequencies have reduced amplitude
                const amplitudeReduction = 1 - (freqPercent * 0.5);
                barHeight *= amplitudeReduction;
                
                ctx.fillStyle = gradient;
                
                // Draw from the bottom
                const barY = height - barHeight;
                
                // Draw rounded top bars
                ctx.beginPath();
                ctx.moveTo(x, height);
                ctx.lineTo(x, barY + 5);
                ctx.quadraticCurveTo(x, barY, x + 5, barY);
                ctx.lineTo(x + barWidth - 5, barY);
                ctx.quadraticCurveTo(x + barWidth, barY, x + barWidth, barY + 5);
                ctx.lineTo(x + barWidth, height);
                ctx.fill();
                
                // Add glow effect
                ctx.shadowColor = primaryColor;
                ctx.shadowBlur = 15;
                ctx.fillRect(x, barY, barWidth, 2);
                ctx.shadowBlur = 0;
                
                // Create reflection effect
                const reflectionGradient = ctx.createLinearGradient(0, barY, 0, height);
                reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                reflectionGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = reflectionGradient;
                ctx.fillRect(x, barY + 2, barWidth, barHeight * 0.6);
                
                x += barWidth + 1;
            }
        }
        
        animate();
    }
    
    function stopSpectrumVisualization() {
        if (spectrumAnimationId) {
            cancelAnimationFrame(spectrumAnimationId);
            spectrumAnimationId = null;
        }
    }

    function setupEqualizer() {
        try {
            // Initialize Web Audio API
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create the source node from media element
            sourceNode = audioContext.createMediaElementSource(mediaPlayer);
            
            // Create equalizer bands
            equalizerBands.innerHTML = '';
            equalizerNodes = [];
            
            frequencies.forEach((frequency, index) => {
                // Create filter node
                const filter = audioContext.createBiquadFilter();
                filter.type = 'peaking';
                filter.frequency.value = frequency;
                filter.gain.value = 0;
                filter.Q.value = 1;
                
                // Add to nodes array
                equalizerNodes.push(filter);
                
                // Create HTML control
                const bandEl = document.createElement('div');
                bandEl.className = 'equalizer-band';
                
                bandEl.innerHTML = `
                    <div class="equalizer-slider">
                        <input type="range" min="-12" max="12" value="0" step="1" data-index="${index}">
                    </div>
                    <div class="equalizer-band-label">${frequency < 1000 ? frequency : frequency/1000+'k'}</div>
                `;
                
                equalizerBands.appendChild(bandEl);
                
                // Add event listener to slider
                const slider = bandEl.querySelector('input');
                slider.addEventListener('input', e => {
                    const value = parseInt(e.target.value);
                    const index = parseInt(e.target.dataset.index);
                    equalizerNodes[index].gain.value = value;
                });
            });
            
            // Connect all nodes
            sourceNode.connect(equalizerNodes[0]);
            
            for (let i = 0; i < equalizerNodes.length - 1; i++) {
                equalizerNodes[i].connect(equalizerNodes[i + 1]);
            }
            
            // Connect the last node to the destination
            equalizerNodes[equalizerNodes.length - 1].connect(audioContext.destination);
            
            // Apply preset
            applyEqualizerPreset();
            
        } catch (error) {
            console.error('Error setting up equalizer:', error);
            showSnackbar('Error setting up equalizer', 'error');
        }
    }
    
    function applyEqualizerPreset() {
        const preset = equalizerPreset.value;
        const gains = equalizerPresets[preset];
        
        if (!gains || !equalizerNodes.length) return;
        
        // Apply gains to each node
        gains.forEach((gain, index) => {
            if (index < equalizerNodes.length) {
                equalizerNodes[index].gain.value = gain;
                
                // Update slider UI
                const slider = document.querySelector(`.equalizer-slider input[data-index="${index}"]`);
                if (slider) {
                    slider.value = gain;
                }
            }
        });
        
        showSnackbar(`Equalizer preset applied: ${preset}`, 'info');
    }
    
    // Drag and drop functions
    function handleDragStart(e) {
        this.classList.add('dragging');
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        initialDragIndex = parseInt(this.dataset.index);
    }
    
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('over');
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    function handleDragEnter(e) {
        this.classList.add('over');
    }
    
    function handleDragLeave(e) {
        this.classList.remove('over');
    }
    
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // If dropped on the container and not on an item
        if (e.target === playlistItems) {
            return false;
        }
        
        // Find the playlist item that was dropped on
        const dropTarget = e.target.closest('.playlist-item');
        if (!dropTarget || dragSrcEl === dropTarget) {
            return false;
        }
        
        const targetIndex = parseInt(dropTarget.dataset.index);
        
        // Move the item in the playlist array
        reorderPlaylist(initialDragIndex, targetIndex);
        
        return false;
    }
    
    // Touch events for mobile drag and drop
    function handleTouchStart(e) {
        if (!e.target.closest('[data-drag-handle="true"]')) {
            return;
        }
        
        // Önce tüm varsayılan hareketleri engelle
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        touchStartY = touch.clientY;
        this.classList.add('dragging');
        initialDragIndex = parseInt(this.dataset.index);
        
        // Add feedback for touch
        this.style.transform = 'scale(1.03)';
        
        // Make other items highlight as potential drop targets
        document.querySelectorAll('.playlist-item').forEach(item => {
            if (item !== this) {
                item.classList.add('potential-target');
            }
        });
    }
    
    function handleTouchMove(e) {
        if (!this.classList.contains('dragging')) {
            return;
        }
        
        // Önce tüm varsayılan hareketleri engelle
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const deltaY = currentY - touchStartY;
        
        // Move the element
        this.style.transform = `translateY(${deltaY}px) scale(1.03)`;
        
        // Find element underneath
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!elemBelow) return;
        
        const droppableBelow = elemBelow.closest('.playlist-item');
        
        if (droppableBelow && droppableBelow !== this) {
            // Remove 'over' class from all items
            document.querySelectorAll('.playlist-item').forEach(item => {
                item.classList.remove('over');
            });
            
            // Add 'over' class to the current target
            droppableBelow.classList.add('over');
        }
    }
    
    function handleTouchEnd(e) {
        if (!this.classList.contains('dragging')) {
            return;
        }
        
        // Önce tüm varsayılan hareketleri engelle
        e.preventDefault();
        e.stopPropagation();
        
        // Reset styles
        this.style.transform = '';
        this.classList.remove('dragging');
        
        // Remove feedback from other items
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('potential-target');
        });
        
        // Find element underneath at touch end
        const touch = e.changedTouches[0];
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!elemBelow) return;
        
        const droppableBelow = elemBelow.closest('.playlist-item');
        
        if (droppableBelow && droppableBelow !== this) {
            const targetIndex = parseInt(droppableBelow.dataset.index);
            reorderPlaylist(initialDragIndex, targetIndex);
        }
        
        // Remove 'over' class from all items
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('over');
        });
    }
    
    function reorderPlaylist(fromIndex, toIndex) {
        // Check if the indices are valid
        if (fromIndex === toIndex || 
            fromIndex < 0 || 
            toIndex < 0 || 
            fromIndex >= playlist.length || 
            toIndex >= playlist.length) {
            return;
        }
        
        // Save the current item
        const itemCurrentlyPlaying = currentIndex >= 0 ? playlist[currentIndex] : null;
        
        // Move the item in the array
        const item = playlist.splice(fromIndex, 1)[0];
        playlist.splice(toIndex, 0, item);
        
        // Update currentIndex if necessary
        if (itemCurrentlyPlaying) {
            currentIndex = playlist.findIndex(item => item === itemCurrentlyPlaying);
        } else if (fromIndex === currentIndex) {
            currentIndex = toIndex;
        } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
            currentIndex--;
        } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
            currentIndex++;
        }
        
        // Re-render the playlist
        renderPlaylist();
        
        // Add visual feedback
        const movedItem = document.querySelector(`.playlist-item[data-index="${toIndex}"]`);
        if (movedItem) {
            movedItem.classList.add('just-moved');
            setTimeout(() => {
                movedItem.classList.remove('just-moved');
            }, 1000);
        }
        
        showSnackbar('Playlist item reordered', 'info');
    }
    
    // Handle media errors
    function handleMediaError() {
        const error = mediaPlayer.error;
        let errorMessage = 'Unknown error occurred';
        
        if (error) {
            switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorMessage = 'Playback was aborted by the user';
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    errorMessage = 'Network error occurred while loading the media';
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    errorMessage = 'Media decoding error - the format may be corrupted';
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = 'Media format is not supported by the browser';
                    break;
                default:
                    errorMessage = `Unknown error (code: ${error.code})`;
            }
        }
        
        console.error('Media error:', errorMessage);
        showSnackbar(`Error: ${errorMessage}`, 'error');
        
        // If we have more items in the playlist, try playing the next one
        if (playlist.length > 1 && currentIndex < playlist.length - 1) {
            showSnackbar('Skipping to next item in playlist', 'info');
            setTimeout(() => playNext(), 1000);
        }
    }
    
    // Dili kaydet
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('language', currentLanguage);
    });
    
    // Güvenli şekilde medya oynatma
    function safePlay(player) {
        // Son oynatma zamanından en az 300ms geçtiyse
        const now = Date.now();
        if (now - lastPlayTime < 300) {
            console.log("Oynatma isteği çok sık, bekletiliyor...");
            // Çok sık oynatma isteği varsa biraz bekle
            setTimeout(() => {
                // Beklerken başka bir istek gelmemişse oynat
                if (isPlayRequested) {
                    isPlayRequested = false;
                    safePlay(player);
                }
            }, 300);
            return;
        }
        
        isPlayRequested = false;
        lastPlayTime = now;
        
        try {
            // Don't pause before attempting to play as it can interrupt pending promises
            // Instead, just attempt to play directly
            const playPromise = player.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.error('Play error:', err);
                    console.error('Error details:', err);
                    
                    // AutoPlay Policy hatası mı kontrol et
                    if (err.name === "NotAllowedError") {
                        showSnackbar(__("mediaPlayerError") + ": " + err.message, "warning");
                    } else {
                        showSnackbar(`${__("errorPlaying")}: ${err.message}`, 'error');
                    }
                });
            }
        } catch (error) {
            console.error("Oynatma sırasında hata:", error);
        }
    }
}); 
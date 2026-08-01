import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Locale = 'ru' | 'en'

const localeStorageKey = 'digitable:chat-locale'

const messages = {
  en: {
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    homeLabel: 'Digitable Chat home',
    navigationMenu: 'Navigation menu',
    navigation: 'Navigate',
    home: 'Home',
    homeDescription: 'Start or join a room',
    connection: 'Connection',
    connectionDescription: 'MQTT, WebRTC, and TURN',
    settings: 'Settings',
    settingsDescription: 'Privacy, sound, and network',
    about: 'About',
    aboutDescription: 'What Digitable Chat is',
    legal: 'Legal',
    legalDescription: 'Use and responsibility',
    connectionPath: 'Connection path',
    changeTheme: 'Change theme',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    changeAppearance: 'Change appearance',
    privateRooms: 'Private rooms',
    eyebrow: 'Encrypted peer-to-peer rooms',
    title: 'Talk without leaving a trail.',
    summary:
      'Create a room and share its link. Your browsers find each other, then open an encrypted connection for messages, calls, screen sharing, and files.',
    connectionFlow: 'Connection flow',
    flowFind: 'Find',
    flowFindDescription: 'MQTT + STUN introduce the browsers',
    flowConnect: 'Connect',
    flowConnectDescription: 'WebRTC connects devices directly',
    flowFallback: 'Fallback',
    flowFallbackDescription: 'TURN helps only when direct access is blocked',
    newConversation: 'New conversation',
    openRoom: 'Open a room',
    username: 'Your username:',
    roomName: 'Room name (generated on your device)',
    generateRoomName: 'Generate a new room name',
    regenerateRoomId: 'Regenerate room id',
    roomNameType: 'Room name type',
    passphrase: 'Passphrase',
    joinPublicRoom: 'Join public room',
    joinPrivateRoom: 'Join private room',
    getEmbedCode: 'Get embed code',
    setupFooter:
      'No account. No conversation history on a server. Built by Digitable on the open-source Chitchatter foundation.',
    connectionPlainLanguage: 'Connection, in plain language',
    connectionTitle: 'How the connection works',
    connectionIntro:
      'Relays help two browsers meet. The conversation itself uses an encrypted WebRTC connection and is not stored by Digitable.',
    shareLink: 'Share a link',
    shareLinkDescription:
      'The room name is created in your browser. A public room opens for anyone with its link; a private room also asks for the same password.',
    findEachOther: 'Find each other',
    findEachOtherDescription:
      'An MQTT relay exchanges the technical introduction. STUN helps each browser learn how it can be reached. Neither carries your chat history.',
    connectDirectly: 'Connect directly',
    connectDirectlyDescription:
      'WebRTC sends messages and media through an encrypted connection between participants. There is no central server keeping a copy of the conversation.',
    useTurn: 'Use TURN if needed',
    useTurnDescription:
      'Some office, mobile, or public networks block a direct path. TURN then forwards the encrypted WebRTC traffic without reading the message content.',
    statusMeaning: 'What the status means',
    statusDirect: 'Direct — device to device',
    statusRelay: 'Relay — encrypted through TURN',
    statusSearching: 'Searching — waiting for a peer',
    statusGuide:
      'Open the participants panel inside a room to see the connection type for each person.',
    copyRoomLink: 'Copy room link',
    showRoomQr: 'Show room QR code',
    hideRoomControls: 'Hide room controls',
    showRoomControls: 'Show room controls',
    exitFullscreen: 'Exit fullscreen',
    enterFullscreen: 'Enter fullscreen',
    participants: 'Show participants and connection status',
    peerList: 'Peer list',
  },
  ru: {
    language: 'Язык',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    homeLabel: 'Главная Digitable Chat',
    navigationMenu: 'Меню навигации',
    navigation: 'Навигация',
    home: 'Главная',
    homeDescription: 'Создать комнату или войти',
    connection: 'Подключение',
    connectionDescription: 'MQTT, WebRTC и TURN',
    settings: 'Настройки',
    settingsDescription: 'Приватность, звук и сеть',
    about: 'О проекте',
    aboutDescription: 'Что такое Digitable Chat',
    legal: 'Условия',
    legalDescription: 'Использование и ответственность',
    connectionPath: 'Путь подключения',
    changeTheme: 'Сменить тему',
    lightMode: 'Светлая тема',
    darkMode: 'Тёмная тема',
    changeAppearance: 'Изменить оформление',
    privateRooms: 'Приватные комнаты',
    eyebrow: 'Зашифрованные P2P-комнаты',
    title: 'Общайтесь, не оставляя следов.',
    summary:
      'Создайте комнату и отправьте ссылку. Браузеры найдут друг друга и откроют зашифрованное соединение для сообщений, звонков, демонстрации экрана и файлов.',
    connectionFlow: 'Схема подключения',
    flowFind: 'Найти',
    flowFindDescription: 'MQTT и STUN знакомят браузеры',
    flowConnect: 'Связать',
    flowConnectDescription: 'WebRTC соединяет устройства напрямую',
    flowFallback: 'Запасной путь',
    flowFallbackDescription: 'TURN помогает, только если прямой путь закрыт',
    newConversation: 'Новый разговор',
    openRoom: 'Открыть комнату',
    username: 'Ваше имя:',
    roomName: 'Имя комнаты (создаётся на вашем устройстве)',
    generateRoomName: 'Создать новое имя комнаты',
    regenerateRoomId: 'Создать другое имя комнаты',
    roomNameType: 'Тип имени комнаты',
    passphrase: 'Фраза',
    joinPublicRoom: 'Войти в публичную комнату',
    joinPrivateRoom: 'Войти в приватную комнату',
    getEmbedCode: 'Получить код для встраивания',
    setupFooter:
      'Без аккаунта и истории разговоров на сервере. Сделано Digitable на основе открытого проекта Chitchatter.',
    connectionPlainLanguage: 'О подключении простыми словами',
    connectionTitle: 'Как работает подключение',
    connectionIntro:
      'Ретрансляторы помогают двум браузерам встретиться. Сам разговор идёт по зашифрованному WebRTC-соединению и не хранится у Digitable.',
    shareLink: 'Отправьте ссылку',
    shareLinkDescription:
      'Имя комнаты создаётся в вашем браузере. В публичную комнату входит любой со ссылкой, а приватная дополнительно просит общий пароль.',
    findEachOther: 'Найдите друг друга',
    findEachOtherDescription:
      'MQTT-ретранслятор передаёт техническое знакомство, а STUN помогает понять доступный сетевой адрес. История переписки через них не передаётся.',
    connectDirectly: 'Соединитесь напрямую',
    connectDirectlyDescription:
      'WebRTC передаёт сообщения и медиа по зашифрованному соединению между участниками. Центрального сервера с копией разговора нет.',
    useTurn: 'TURN, если иначе нельзя',
    useTurnDescription:
      'Офисная, мобильная или публичная сеть может блокировать прямой путь. Тогда TURN пересылает зашифрованный WebRTC-трафик, не читая содержимое сообщений.',
    statusMeaning: 'Что означает статус',
    statusDirect: 'Прямое — устройство к устройству',
    statusRelay: 'Ретрансляция — зашифровано через TURN',
    statusSearching: 'Поиск — ждём участника',
    statusGuide:
      'В комнате откройте панель участников — там виден тип соединения с каждым человеком.',
    copyRoomLink: 'Скопировать ссылку на комнату',
    showRoomQr: 'Показать QR-код комнаты',
    hideRoomControls: 'Скрыть управление комнатой',
    showRoomControls: 'Показать управление комнатой',
    exitFullscreen: 'Выйти из полноэкранного режима',
    enterFullscreen: 'Открыть на весь экран',
    participants: 'Показать участников и состояние подключения',
    peerList: 'Список участников',
  },
} as const

export type MessageKey = keyof (typeof messages)['en']

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
}

const getInitialLocale = (): Locale => {
  try {
    const savedLocale = window.localStorage.getItem(localeStorageKey)

    if (savedLocale === 'ru' || savedLocale === 'en') return savedLocale
  } catch (_error) {
    // Continue with the browser preference when storage is unavailable.
  }

  return window.navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => undefined,
  t: key => messages.en[key],
})

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale

    try {
      window.localStorage.setItem(localeStorageKey, locale)
    } catch (_error) {
      // The interface still switches when storage is unavailable.
    }
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: key => messages[locale][key],
    }),
    [locale]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)

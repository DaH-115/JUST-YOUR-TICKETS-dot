// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock React Cache
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

// Mock Firebase modules
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn(),
  updatePassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  setPersistence: jest.fn(),
  browserLocalPersistence: {},
  browserSessionPersistence: {},
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock("firebase-admin", () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
  })),
  firestore: jest.fn(),
}));

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

// Mock fetch
global.fetch = jest.fn();

// Mock Web APIs for Node.js environment
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock next.js server Request for testing
jest.mock("next/server", () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    method: init?.method || "GET",
    headers: new Headers(init?.headers || {}),
    json: async () => JSON.parse(init?.body || "{}"),
  })),
  NextResponse: {
    json: (data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}));

// Mock console.error to reduce noise in tests
const originalError = console.error;
console.error = (...args) => {
  const message = typeof args[0] === "string" ? args[0] : "";
  const errorObject = args[1] instanceof Error ? args[1] : {};

  // 테스트 중 의도된 에러들을 필터링하는 패턴들
  const silencedPatterns = [
    // React 관련 경고
    /Warning: ReactDOM\.render is no longer supported/,
    /Warning: React\./,

    // 일반적인 에러/실패 키워드 (가장 포괄적)
    /실패/,
    /오류/,
    /error/i,
    /failed/i,
    /exception/i,
  ];

  // 패턴 매칭으로 필터링
  if (silencedPatterns.some((pattern) => pattern.test(message))) {
    return;
  }

  originalError.call(console, ...args);
};

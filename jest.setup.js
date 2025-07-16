// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
global.IntersectionObserver = mockIntersectionObserver;

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
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock React Cache
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    cache: (fn) => fn,
  };
});

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

// Mock Redux Toolkit
jest.mock("store/redux-toolkit/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("store/redux-toolkit/slice/userSlice", () => ({
  selectUser: (state) => state.user,
  userSlice: {
    actions: {
      setUser: (user) => ({ type: "user/setUser", payload: user }),
      clearUser: () => ({ type: "user/clearUser" }),
    },
  },
}));

// Mock Redux Persist
jest.mock("redux-persist/integration/react", () => ({
  PersistGate: ({ children }) => children,
}));

// Mock Alert Context
jest.mock("store/context/alertContext", () => ({
  useAlert: () => ({
    showSuccessHandler: jest.fn(),
    showErrorHandler: jest.fn(),
  }),
}));

// Mock Auth Context
jest.mock("store/context/auth/authContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock usePresignedUrl hook
jest.mock("app/hooks/usePresignedUrl", () => ({
  usePresignedUrl: () => ({
    getPresignedUrl: jest.fn().mockResolvedValue("mock-presigned-url"),
    isLoading: false,
  }),
}));

// 테스트 중 콘솔 에러를 필터링하여 깔끔한 출력 유지
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  const message = typeof args[0] === "string" ? args[0] : "";

  // 테스트 중 억제할 에러 패턴들
  const silencedPatterns = [
    // React 관련 경고/에러
    /Warning: React/,
    /Warning: ReactDOM/,
    /Warning: Each child in a list should have a unique "key" prop/,
    /Warning: Failed prop type/,
    /Element type is invalid/,
    /Check the render method/,
    /Consider adding an error boundary/,

    // Jest/Testing 관련
    /The above error occurred in the/,
    /Error: Uncaught/,
    /at Object\.<anonymous>/,

    // Firebase/Auth 관련 mock 에러
    /Firebase/,
    /auth/,

    // 일반적인 테스트 에러 키워드
    /실패/,
    /오류/,
    /error/i,
    /failed/i,
    /exception/i,
  ];

  // 패턴에 매칭되면 콘솔 출력 억제
  if (silencedPatterns.some((pattern) => pattern.test(message))) {
    return;
  }

  // 그 외의 에러는 원래대로 출력
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  const message = typeof args[0] === "string" ? args[0] : "";

  // 테스트 중 억제할 경고 패턴들
  const silencedWarnings = [
    /Warning: React/,
    /Warning: ReactDOM/,
    /Warning: Function components cannot be given refs/,
    /Warning: forwardRef render functions accept exactly two parameters/,
  ];

  if (silencedWarnings.some((pattern) => pattern.test(message))) {
    return;
  }

  originalWarn.call(console, ...args);
};

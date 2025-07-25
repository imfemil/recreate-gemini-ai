# Folder structure for recreate-gemini-ai
```
recreate-gemini-ai/
├── public/
│   └── google-gemini-icon.png
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── messages/
│   │   │   │   └── route.ts
│   │   ├── dashboard/
│   │   │   ├── [roomId]/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AiInputBar.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatroomList.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── CountrySelect.tsx
│   │   ├── GeminiLanding.tsx
│   │   ├── OTPInput.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── TopbarUser.tsx
│   ├── context/
│   │   └── ChatConvertionsContext.tsx
│   ├── data/
│   │   └── gemini_convertions_data.json
│   ├── hooks/
│   │   ├── useChatInput.ts
│   │   ├── useChatroom.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── chatUtils.ts
│   │   ├── countryService.ts
│   │   ├── otpSimulator.ts
│   │   ├── simulateAiResponse.ts
│   │   └── toast.ts
│   ├── store/
│   │   └── useAppStore.ts
│   ├── style/
│   │   └── globals.css
│   ├── theme/
│   │   └── provider.tsx
│   ├── types/
│   │   └── index.ts
│   ├── validations/
│   │   ├── authSchema.ts
│   │   └── chatroomSchema.ts
│   └── middleware.ts
├── bun.lock
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```
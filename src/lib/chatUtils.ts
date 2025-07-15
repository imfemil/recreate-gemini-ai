export const simulateAiResponse = (text: string, delay = 1500) =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(text), delay)
  );

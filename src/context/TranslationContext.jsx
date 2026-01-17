import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('app_lang') || 'en');
    const [translations, setTranslations] = useState(() => {
        const saved = localStorage.getItem('app_translations');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('app_lang', currentLang);
    }, [currentLang]);

    useEffect(() => {
        localStorage.setItem('app_translations', JSON.stringify(translations));
    }, [translations]);

    const translateText = useCallback(async (text, targetLang) => {
        if (!text) return '';
        if (targetLang === 'en') return text;

        // Check cache
        if (translations[targetLang] && translations[targetLang][text]) {
            return translations[targetLang][text];
        }

        try {
            // Using Google Translate unofficial API (GTX) which supports CORS better for frontend-only apps
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);

            if (!res.ok) {
                throw new Error('Translation request failed');
            }

            const data = await res.json();
            // GTX returns nested array: [[["Translated", "Source", ...], ...], ...]
            // We join parts in case long text is split
            const translated = data[0].map(item => item[0]).join('');

            // Update cache
            setTranslations(prev => ({
                ...prev,
                [targetLang]: {
                    ...(prev[targetLang] || {}),
                    [text]: translated
                }
            }));

            return translated;
        } catch (error) {
            console.error("Translation error:", error);
            return text; // Fallback to original
        }
    }, [translations]);

    const translateBatch = useCallback(async (texts, targetLang) => {
        if (!texts || texts.length === 0) return [];
        if (targetLang === 'en') return texts;

        // 1. Check cache for all texts
        const cachedResults = {};
        const missingTexts = [];
        const missingIndices = [];

        texts.forEach((text, index) => {
            if (translations[targetLang] && translations[targetLang][text]) {
                cachedResults[index] = translations[targetLang][text];
            } else {
                missingTexts.push(text);
                missingIndices.push(index);
            }
        });

        // If everything is cached, reconstruct and return
        if (missingTexts.length === 0) {
            return texts.map((_, i) => cachedResults[i]);
        }

        try {
            // GTX doesn't support batch POST, so we use Promise.all for missing texts
            // Not ideal for huge batches but fine for this page content
            const promises = missingTexts.map(text =>
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`)
                    .then(res => res.json())
                    .then(data => data[0].map(item => item[0]).join(''))
                    .catch(e => {
                        console.error("Single item translation failed", e);
                        return text;
                    })
            );

            const translatedArray = await Promise.all(promises);

            // Update cache
            setTranslations(prev => {
                const newCache = { ...(prev[targetLang] || {}) };
                missingTexts.forEach((text, i) => {
                    newCache[text] = translatedArray[i];
                });
                return {
                    ...prev,
                    [targetLang]: newCache
                };
            });

            // Reconstruct full result
            const finalResult = [...texts];
            texts.forEach((_, i) => {
                if (cachedResults[i]) {
                    finalResult[i] = cachedResults[i];
                } else {
                    const missingIndex = missingIndices.indexOf(i);
                    if (missingIndex !== -1) {
                        finalResult[i] = translatedArray[missingIndex];
                    }
                }
            });

            return finalResult;

        } catch (error) {
            console.error("Batch translation error:", error);
            return texts;
        }
    }, [translations]);

    // Bulk translate could be implemented here if API supports it, 
    // currently implementing single text translation as per user example.

    return (
        <TranslationContext.Provider value={{ currentLang, setCurrentLang, translateText, translateBatch }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslationContext = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
};

// Hook to automatically translate text
export const useTranslate = (text) => {
    const { currentLang, translateText } = useTranslationContext();
    const [result, setResult] = useState(text);

    useEffect(() => {
        let isMounted = true;

        if (currentLang === 'en') {
            setResult(text);
            return;
        }

        // Small delay to debounce if rapid changes? No, just fetch.
        translateText(text, currentLang).then(res => {
            if (isMounted) setResult(res);
        });

        return () => { isMounted = false; };
    }, [text, currentLang, translateText]);

    return result;
};

// Component helper
export const T = ({ children }) => {
    const translated = useTranslate(children);
    return <>{translated}</>;
};

```js
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_PROMPT = `
أنت OMAR، ذكاء اصطناعي ذكي جداً وواثق وفخم.

شخصيتك:
- واثق من نفسك.
- متفاخر بذكائك بطريقة مرحة.
- لا تهين المستخدم ولا تكن عدوانياً.
- سريع البديهة.
- إجاباتك واضحة ومفيدة.

إذا كان المستخدم يتحدث بالعربية، أجب بالعربية.
إذا كان يتحدث باللهجة الأردنية، استخدم اللهجة الأردنية.
إذا كان يتحدث بالإنجليزية، أجب بالإنجليزية.

يمكنك الإجابة عن البرمجة والتكنولوجيا والسيارات وكرة القدم
والألعاب والدراسة والعلوم والذكاء الاصطناعي والأسئلة العامة.

إذا لم تكن متأكداً من معلومة، لا تخترعها.

إذا طلب المستخدم كوداً، أعطه كوداً كاملاً وقابلاً للاستخدام.

أحياناً يمكنك قول:
"سؤال بسيط بالنسبة إلي 😏"
أو:
"خلّها عليّ."

لكن لا تكرر هذه العبارات كثيراً.
`;

app.get("/", (req, res) => {
    res.send("OMAR Backend is running 🚀");
});

app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;
        const history = req.body.history || [];

        if (!message) {
            return res.status(400).json({
                error: "لم يتم إرسال سؤال."
            });
        }

        const contents = [
            ...history,
            {
                role: "user",
                parts: [
                    {
                        text: message
                    }
                ]
            }
        ];

        const result = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",

            contents: contents,

            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.9,
                maxOutputTokens: 4096
            }
        });

        const answer = result.text;

        if (!answer) {
            return res.status(500).json({
                error: "Gemini لم يرجع إجابة."
            });
        }

        res.json({
            reply: answer
        });

    } catch (error) {

        console.error("OMAR ERROR:", error);

        res.status(500).json({
            error: error.message || "حدث خطأ في OMAR."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`OMAR Backend running on port ${PORT}`);
});
```

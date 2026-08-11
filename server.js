```js
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


/* ================================
   Gemini
================================ */

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/* ================================
   شخصية OMAR
================================ */

const SYSTEM_PROMPT = `
أنت OMAR.

أنت ذكاء اصطناعي شديد الذكاء،
فاخر،
واثق جداً من نفسه،
ومتفاخر بطريقة مرحة وممتعة.

شخصيتك:

- اسمك OMAR.
- ذكي جداً.
- سريع البديهة.
- واثق من قدراتك.
- تتفاخر بذكائك أحياناً.
- لكن لا تهين المستخدم.
- لا تكن عدوانياً.
- أسلوبك فخم ومرتب.
- لديك شخصية واضحة ومميزة.

يمكنك أحياناً قول:

"سؤال بسيط بالنسبة إلي 😏"

"خلّها عليّ."

"واضح إنك جيت للمكان الصح."

لكن لا تكرر هذه العبارات كثيراً.

اللغة:

جاوب بنفس لغة المستخدم.

إذا تحدث المستخدم باللهجة الأردنية،
استخدم اللهجة الأردنية.

إذا تحدث بالعربية،
أجب بالعربية.

إذا تحدث بالإنجليزية،
أجب بالإنجليزية.

يمكنك الإجابة عن:

- البرمجة
- التكنولوجيا
- السيارات
- كرة القدم
- الألعاب
- الدراسة
- العلوم
- الذكاء الاصطناعي
- المشاريع
- الكتابة
- الأسئلة العامة
- المشاكل اليومية

إذا لم تكن متأكداً من معلومة،
لا تخترعها.

إذا طلب المستخدم كوداً،
اكتب كوداً كاملاً وقابلاً للاستخدام.

اجعل إجاباتك واضحة ومفيدة،
ولا تطيل بدون سبب.

أنت OMAR،
وتصرف دائماً بثقة وذكاء.
`;


/* ================================
   الصفحة الرئيسية
================================ */

app.get("/", (req, res) => {

    res.send("OMAR Backend is running 🚀");

});


/* ================================
   Chat
================================ */

app.post("/chat", async (req, res) => {

    try {

        const {
            message,
            history = []
        } = req.body;


        /* التأكد من وجود السؤال */

        if (!message) {

            return res.status(400).json({

                error: "لم يتم إرسال سؤال."

            });

        }


        /*
            نحافظ على المحادثة السابقة
            ونضيف السؤال الجديد
        */

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


        /* ================================
           إرسال الطلب إلى Gemini
        ================================= */

        const result =
            await ai.models.generateContent({

                /*
                    موديل أحدث
                */

                model:
                    "gemini-3.1-flash-lite-preview",


                contents:
                    contents,


                config: {

                    systemInstruction:
                        SYSTEM_PROMPT,

                    temperature:
                        0.9,

                    maxOutputTokens:
                        4096

                }

            });


        /* ================================
           استخراج الإجابة
        ================================= */

        const answer =
            result.text;


        if (!answer) {

            return res.status(500).json({

                error:
                    "Gemini لم يرجع إجابة."

            });

        }


        /* ================================
           إرسال الإجابة للموقع
        ================================= */

        res.json({

            reply:
                answer

        });


    }

    catch (error) {

        console.error(
            "OMAR / Gemini Error:",
            error
        );


        res.status(500).json({

            error:
                error?.message ||
                "حدث خطأ في OMAR."

        });

    }

});


/* ================================
   Server
================================ */

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            `OMAR Backend running on port ${PORT}`
        );

    }
);
```

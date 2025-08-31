'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import { useState } from 'react';

type Plan = 'individuals' | 'lawyers';

export default function Pricing() {
  const [activePlan, setActivePlan] = useState<Plan>('individuals');
  const [generatedUsername, setGeneratedUsername] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const API_URL = 'https://loi.morched.tn/api/v1';
  const API_KEY = 'H19FC10-KYP4KA3-G5A8S5E-NJB9S37';

  // Function to generate a random 5-digit number starting with 8
  const generateRandomUsername = (): string => {
    const randomNumber = Math.floor(Math.random() * 10000) + 80000;
    return String(randomNumber);
  };

  // Function to fetch existing users and generate a unique username
  const fetchAndGenerateUsername = async () => {
    setIsSending(true);
    setGeneratedUsername(null);

    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const existingUsernames = data.users.map((user: any) => user.username);

      let newUsername: string;
      do {
        newUsername = generateRandomUsername();
      } while (existingUsernames.includes(newUsername));

      setGeneratedUsername(newUsername);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ، تحقق من وحدة التحكم.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
            خطط الاستخدام
          </h1>
          <p className="max-w-2xl mx-auto mt-5 text-xl text-zinc-200 sm:text-2xl">
            مرشد هي أول منصة رقمية في تونس للاستشارة القانونية عن بُعد. نقدم خدمات متخصصة للأفراد والمحامين والشركات لتلبية كافة احتياجاتكم القانونية.
          </p>

<div className="flex flex-col sm:flex-row justify-center">
  <button
    onClick={() => setActivePlan('individuals')}
    type="button"
    className={`${
      activePlan === 'individuals'
        ? 'bg-zinc-700 text-white shadow-sm'
        : 'border border-transparent text-zinc-400'
    } rounded-md m-1 py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50`}
  >
    أفراد
  </button>

  <button
    onClick={() => setActivePlan('lawyers')}
    type="button"
    className={`${
      activePlan === 'lawyers'
        ? 'bg-zinc-700 text-white shadow-sm'
        : 'border border-transparent text-zinc-400'
    } rounded-md m-1 py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50`}
  >
    شركات
  </button>
</div>


            {/* Generate username */}
            <div className="flex flex-col items-center w-full max-w-sm gap-2 mt-4">
              <p dir="rtl" className="text-sm text-zinc-400 text-center">
                اضغط الزر 🔑 للحصول على كود الدخول
              </p>

              <Button
                variant="slim"
                onClick={fetchAndGenerateUsername}
                loading={isSending}
                disabled={isSending}
                className="w-full"
              >
                {isSending ? 'جاري التوليد...' : 'توليد اسم المستخدم'}
              </Button>

              {generatedUsername && (
                <a
                  href={`sms:25484040?body= ${generatedUsername}`}
                  className="mt-4 block p-4 bg-zinc-800 rounded-md text-center hover:bg-zinc-700 transition cursor-pointer"
                >
                  <p className="text-sm text-zinc-300">
                    اسم المستخدم الجديد الخاص بك هو:
                  </p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {generatedUsername}
                  </p>
                  <p dir="rtl" className="text-sm text-zinc-400 text-center mt-1">
                    اضغط هنا لإرسال هذا الكود مباشرة إلى المرشد 📲  25484040 (سعر الرسالة 200 مليم)

                  </p>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 sm:mt-16 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {activePlan === 'individuals' && (
            <div className="flex flex-col flex-1 max-w-xs p-6 bg-zinc-900 rounded-lg shadow-sm border border-pink-500">
              <h2 className="text-2xl font-semibold leading-6 text-white">الخطة المجانية</h2>
              <p className="mt-4 text-zinc-300">للاطلاع على خدماتنا.</p>
              <p className="mt-8">
                <span className="text-5xl font-extrabold text-white">0 د.ت</span>
              </p>
              <div className="flex-1 mt-6">
                <ul role="list" className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">✅</span>
                    <p className="ml-3 text-base text-zinc-300">20 سؤالًا كحد أقصى يوميًا</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">✅</span>
                    <p className="ml-3 text-base text-zinc-300">وصول عبر رابط لمدة 30 يوم</p>
                  </li>
                </ul>
              </div>
              <p dir="rtl" className="mt-8 text-sm text-zinc-400 text-center">
                اضغط على <strong>توليد اسم مستخدم</strong>، ثم أرسل الكود الناتج إلى الرقم <strong><bdi dir="ltr">📲 25484040</bdi></strong>
              </p>
            </div>
          )}

          {activePlan === 'lawyers' && (
            <div className="flex flex-col flex-1 max-w-xs p-6 bg-zinc-900 rounded-lg shadow-sm border border-pink-500">
              <h2 className="text-2xl font-semibold leading-6 text-white">الخطة الاحترافية</h2>
              <p className="mt-4 text-zinc-300">للمحامين والشركات التي تحتاج إلى أدوات متقدمة.</p>
              <p className="mt-4 text-sm text-zinc-400">تواصل معنا للحصول على حسابك الخاص.</p>
              <p className="mt-2 text-base font-bold text-white">contact@aibc.tn</p>
              <div className="flex-1 mt-6">
                <ul role="list" className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">وصول غير محدود</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">إنشاء مساحات عمل للفريق</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">إدارة المستخدمين</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">تحليل الوثائق القانونية</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">دمج مرشد عبر واجهة برمجة التطبيقات (API) أو الودجت (Widget)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">الربط بقاعدة البيانات</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">إدارة القضايا وتصنيفها</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">استشارات غير محدودة</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">⚖️</span>
                    <p className="ml-3 text-base text-zinc-300">تدريب شخصي على استخدام مرشد</p>
                  </li>
                </ul>
              </div>
              <a
                href="mailto:contact@aibc.tn"
                className="mt-8 text-center text-sm font-semibold text-white bg-pink-500 rounded-md py-2 hover:bg-pink-600 transition"
              >
                تواصل معنا
              </a>
            </div>
          )}
        </div>

        <LogoCloud />
      </div>
    </section>
  );
}

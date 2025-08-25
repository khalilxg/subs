'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Simplified types for this example
type Plan = 'individuals' | 'lawyers';

export default function Pricing() {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<Plan>('individuals');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const handlePhoneSubmit = async () => {
    if (!phoneNumber) return;

    setIsSending(true);

    try {
      const response = await fetch('https://aibc.tn/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });

      if (response.ok) {
        console.log('Phone number sent successfully!');
        setPhoneNumber(''); // Clear the field on success
      } else {
        console.error('Failed to send phone number.');
      }
    } catch (error) {
      console.error('Error sending phone number:', error);
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
            مرشد هي أول منصة رقمية في تونس للاستشارة القانونية عن بُعد. نقدم
            خدمات متخصصة للأفراد والمحامين والشركات لتلبية كافة احتياجاتكم
            القانونية.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:mt-8">
            <div className="relative flex self-center p-0.5 bg-zinc-900 rounded-lg border border-zinc-800">
              <button
                onClick={() => setActivePlan('individuals')}
                type="button"
                className={`${
                  activePlan === 'individuals'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                مواطن عادي
              </button>
              <button
                onClick={() => setActivePlan('lawyers')}
                type="button"
                className={`${
                  activePlan === 'lawyers'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                محامي / شركات
              </button>
            </div>
            <div className="flex flex-col items-center w-full max-w-sm gap-2 mt-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="أدخل رقم الهاتف"
                className="w-full px-4 py-2 text-white bg-zinc-800 border border-zinc-700 rounded-md text-center placeholder:text-center focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <Button
                variant="slim"
                onClick={handlePhoneSubmit}
                loading={isSending}
                className="w-full"
              >
                إرسال
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-12 sm:mt-16 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {/* Individuals Plan Card */}
          {activePlan === 'individuals' && (
            <div className="flex flex-col flex-1 max-w-xs p-6 bg-zinc-900 rounded-lg shadow-sm border border-pink-500">
              <h2 className="text-2xl font-semibold leading-6 text-white">
                الخطة المجانية
              </h2>
              <p className="mt-4 text-zinc-300">
                استشارة قانونية مجانية لمدة 30 يومًا.
              </p>
              <p className="mt-8">
                <span className="text-5xl font-extrabold text-white">0 د.ت</span>
              </p>
              <div className="flex-1 mt-6">
                <ul role="list" className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ✅
                    </span>
                    <p className="ml-3 text-base text-zinc-300">استشارة قانونية</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ✅
                    </span>
                    <p className="ml-3 text-base text-zinc-300">
                      وصول عبر رابط لمدة 30 يوم
                    </p>
                  </li>
                </ul>
              </div>
              <p className="mt-8 text-sm text-zinc-400">
                ستتلقى رابطًا عبر رسالة نصية يمنحك وصولًا لمدة 30 يومًا مجانًا.
              </p>
            </div>
          )}

          {/* Lawyers/Companies Plan Card */}
          {activePlan === 'lawyers' && (
            <div className="flex flex-col flex-1 max-w-xs p-6 bg-zinc-900 rounded-lg shadow-sm border border-pink-500">
              <h2 className="text-2xl font-semibold leading-6 text-white">
                المحامون والشركات
              </h2>
              <p className="mt-4 text-zinc-300">
                للحصول على وصول غير محدود وميزات متقدمة.
              </p>
                <p className="mt-4 text-sm text-zinc-400">
                  تواصل معنا للحصول على حسابك الخاص.
                </p>

                <p className="mt-2 text-base font-bold text-white">
                  contact@aibc.tn
                </p>
              <div className="flex-1 mt-6">
                <ul role="list" className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ⚖️
                    </span>
                    <p className="ml-3 text-base text-zinc-300">وصول غير محدود</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ⚖️
                    </span>
                    <p className="ml-3 text-base text-zinc-300">لوحة تحكم</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ⚖️
                    </span>
                    <p className="ml-3 text-base text-zinc-300">إدارة القضايا</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ⚖️
                    </span>
                    <p className="ml-3 text-base text-zinc-300">تقارير</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 pt-1 text-green-500">
                      ⚖️
                    </span>
                    <p className="ml-3 text-base text-zinc-300">مميزات إضافية</p>
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
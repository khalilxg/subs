'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Plan = 'individuals' | 'lawyers';

export default function Pricing() {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<Plan>('individuals');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showRedirecting, setShowRedirecting] = useState<boolean>(false);

  const API_URL = 'https://loi.morched.tn/api/v1';
  const API_KEY = 'H19FC10-KYP4KA3-G5A8S5E-NJB9S37';
  const WORKSPACE = 'loi';
  const DEFAULT_PASS = '12345678';

  const handlePhoneSubmit = async () => {
    if (!phoneNumber) return;

    setIsSending(true);

    try {
      const createResp = await fetch(`${API_URL}/admin/users/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          username: phoneNumber,
          password: DEFAULT_PASS,
          role: 'default',
        }),
      });

      const createData = await createResp.json();
      let redirectUrl = null;

      if (createData.error && createData.error.includes('Unique constraint failed')) {
        redirectUrl = 'https://loi.morched.tn/workspace/loi';
      } else {
        const userId = createData?.user?.id;
        if (!userId) {
          console.error('Failed to create user', createData);
          alert('Failed to create user. Check console.');
          setIsSending(false);
          return;
        }

        const workspaceResp = await fetch(`${API_URL}/admin/workspaces/${WORKSPACE}/manage-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            userIds: [userId],
            reset: false,
          }),
        });

        const workspaceData = await workspaceResp.json();
        if (!workspaceData.success) {
          console.error('Failed to add user to workspace', workspaceData);
          alert('Failed to add user to workspace. Check console.');
          setIsSending(false);
          return;
        }

        const tokenResp = await fetch(`${API_URL}/users/${userId}/issue-auth-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
        });

        const tokenData = await tokenResp.json();
        const token = tokenData?.token;
        if (!token) {
          console.error('Failed to get auth token', tokenData);
          alert('Failed to generate auth token. Check console.');
          setIsSending(false);
          return;
        }
        redirectUrl = `http://loi.morched.tn/sso/simple?token=${token}&redirectTo=/workspace/loi`;
      }
      
      setIsSending(false);
      setShowRedirecting(true);
      
      // The reliable 10-second delay before redirecting.
      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }, 10000); // 10 seconds

    } catch (err) {
      console.error(err);
      alert('An error occurred. Check console.');
      setIsSending(false);
    }
  };

  return (
    <section className="bg-black">
      {/* Full-screen, semi-transparent overlay with GIF */}
      {showRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/morched.gif"
              alt="Redirecting animation"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="mt-4 text-black text-lg absolute bottom-10">
            {'جاري المعالجة، يرجى الانتظار...'}
          </p>
        </div>
      )}

      {/* Main content, hidden when redirecting */}
      <div className={`${showRedirecting ? 'hidden' : ''} max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8`}>
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
                أفراد
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
                شركات
              </button>
            </div>

            <div className="flex flex-col items-center w-full max-w-sm gap-2 mt-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/\D/g, '');
                  if (numericValue.length <= 8) {
                    setPhoneNumber(numericValue);
                  }
                }}
                placeholder="أدخل رقم الهاتف"
                className="w-full px-4 py-2 text-white bg-zinc-800 border border-zinc-700 rounded-md text-center placeholder:text-center focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              {phoneNumber.length > 0 && phoneNumber.length !== 8 && (
                <p className="text-red-400 text-sm text-center mt-2">
                  أدخل رقمك الحقيقي المكون من 8 أرقام
                </p>
              )}

              <Button
                variant="slim"
                onClick={handlePhoneSubmit}
                loading={isSending}
                disabled={phoneNumber.length !== 8 || isSending}
                className="w-full"
              >
                {isSending ? 'جاري المعالجة، يرجى الانتظار...' : 'توليد الرابط'}
              </Button>

              <p className="mt-2 text-center text-sm text-zinc-300">
                عند النقر، سيتم تحويلك تلقائيًا إلى <strong>مرشد قانون</strong> لطرح الأسئلة والحصول على إجابات فورية. <br/>
                سيكون اسم المستخدم هو رقمك، وكلمة المرور هي <strong>12345678</strong> افتراضيًا.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-12 sm:mt-16 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {activePlan === 'individuals' && (
            <>
              {/* Free Plan */}
              <div className="flex flex-col flex-1 max-w-xs p-6 bg-zinc-900 rounded-lg shadow-sm border border-pink-500">
                <h2 className="text-2xl font-semibold leading-6 text-white">
                  الخطة المجانية
                </h2>
                <p className="mt-4 text-zinc-300">
                  للاطلاع على خدماتنا.
                </p>
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
                <p className="mt-8 text-sm text-zinc-400">
                  ستتلقى رابطًا عبر رسالة نصية يمنحك وصولًا مجانيًا لمدة 30 يومًا.
                </p>
              </div>
            </>
          )}

          {activePlan === 'lawyers' && (
            <>
              {/* Lawyer/Company Plan */}
              <div className="flex flex-col flex-1 max-w-xs p-6 bg-zinc-900 rounded-lg shadow-sm border border-pink-500">
                <h2 className="text-2xl font-semibold leading-6 text-white">
                  الخطة الاحترافية
                </h2>
                <p className="mt-4 text-zinc-300">
                  للمحامين والشركات التي تحتاج إلى أدوات متقدمة.
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
            </>
          )}
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}

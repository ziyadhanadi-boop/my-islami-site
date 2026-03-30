import React, { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'سياسة الخصوصية | إسلامي';
  }, []);

  const sectionStyle = {
    marginBottom: '2.5rem',
    lineHeight: '1.8',
    color: 'var(--text-secondary)'
  };

  const titleStyle = {
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-heading)',
    marginBottom: '1rem',
    fontSize: '1.5rem'
  };

  return (
    <div className="container" style={{ padding: '5rem 1rem', maxWidth: '900px', direction: 'rtl', textAlign: 'right' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-primary)', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
        سياسة الخصوصية 🔒
      </h1>

      <div className="card" style={{ padding: '3rem', borderRadius: '1.25rem' }}>
        <section style={sectionStyle}>
          <h2 style={titleStyle}>1. مقدمة</h2>
          <p>
            نحن في منصة "إسلامي" نولي أهمية قصوى لخصوصية زوارنا. توضح هذه الوثيقة أنواع المعلومات الشخصية التي نجمعها وكيفية استخدامها.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>2. جمع المعلومات</h2>
          <p>
            لا نقوم بجمع أي معلومات شخصية عنك إلا إذا قمت بتزويدنا بها طواعية (مثل الاشتراك في النشرة البريدية). المعلومات التي نجمعها قد تشمل البريد الإلكتروني فقط لإرسال التحديثات.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>3. ملفات تعريف الارتباط (Cookies)</h2>
          <p>
            نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم، مثل حفظ "المقالات المفضلة" أو تذكر حالة "الوضع الليلي" الخاصة بك. هذه الملفات تُخزن محلياً على جهازك ولا تهدف للتجسس.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>4. حماية البيانات</h2>
          <p>
            نحن نلتزم بعدم بيع أو تأجير أو مشاركة معلوماتك الشخصية مع أي أطراف ثالثة لأغراض تسويقية. بياناتك مشفرة ومحمية بأحدث معايير الأمان التقنية.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>5. الاتصال بنا</h2>
          <p>
            إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، لا تتردد في التواصل معنا عبر قنوات الاتصال المتاحة في الموقع.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;

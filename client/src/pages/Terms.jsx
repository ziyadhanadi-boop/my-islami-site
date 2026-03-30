import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'شروط الاستخدام | إسلامي';
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
        شروط الاستخدام 📜
      </h1>

      <div className="card" style={{ padding: '3rem', borderRadius: '1.25rem' }}>
        <section style={sectionStyle}>
          <h2 style={titleStyle}>1. قبول الشروط</h2>
          <p>
            باستخدامك لمنصة "إسلامي"، فإنك توافق على الالتزام بشروط الاستخدام المذكورة هنا وجميع القوانين المعمول بها. إذا كنت لا توافق، يرجى عدم استخدام الموقع.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>2. حقوق الملكية الفكرية</h2>
          <p>
            جميع المحتويات المتوفرة على "إسلامي" بما في ذلك النصوص، الصور، والمواد السمعية والبصرية هي ملك للمنصة أو حاصلة على ترخيص نشر قانوني، وتُقدم لأغراض غير تجارية فقط.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>3. الاستخدام المسموح</h2>
          <p>
            يُسمح لك بمشاركة المقالات والمحتوى عبر وسائل التواصل الاجتماعي مع ذكر المصدر، ولا يُسمح لك بتعديل المحتوى أو استخدامه لأغراض تجارية دون إذن كتابي مسبق.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>4. إخلاء المسؤولية</h2>
          <p>
            نحن نبذل قصارى جهدنا لضمان دقة وصحة المعلومات الشرعية المقدمة، ومع ذلك، فإن الموقع يُعد وسيلة للتوعية العامة ولا يُعتبر بديلاً عن الفتاوى الخاصة بالحالات الفردية المعقدة التي تتطلب مقابلة أهل العلم مباشرة.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>5. التحديثات</h2>
          <p>
            لنا الحق في تعديل هذه الشروط في أي وقت، وسيتم إخطار المستخدمين بأي تغييرات جوهرية من خلال الموقع.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


const resources = {
  bg: {
    translation: {
      hero: {
        uni_name: "Висше училище по телекомуникации и пощи",
        phd_lab: "Докторантско училище",
        description: "Съвместна платформа за изследвания и иновации за докторанти, научни ръководители и академични институции.",
        info_button: "Информация",
        mission_button: "Мисия",
        contact: "Контакти",
        login: "Вход за регистрирани потребители"
      },
      contact: {
        title: "Свържете се с нас",
        mail: "Email",
        phone: "Телефон",
        address: "Адрес",
        socials: "Социални мрежи"
      },
      specialties: {
        title: "Докторантски програми",
        code: "Шифър",
        field: "Професионално направление",
        program: "Докторска програма",
        fullTime: "Редовна",
        partTime: "Задочна",

        fields: {
          communication_computer_engineering: "Комуникационна и компютърна техника",
          general_engineering: "Общо инженерство",
        },
        programs: {
          theoretical_foundations_communication_tech:
            "Теоретични основи на комуникационната техника",
          it_networks_cybersecurity:
            "Информационни технологии, комуникационни мрежи и киберсигурност",
          industrial_engineering: "Индустриален инженеринг",
        },
        download: "Изтегли конспект",
        application: "Кандидатстване",
        law: "Закон за висшето образование",
        regulations: "Правилник на ВУТП",
        taxes: "Такси за обучение",
      },
      documents: {
        title: "Електронни ресурси"
      },
      news: {
        title: "Новини и събития"
      },
      apply: {
        download: "Изтегли файл",
        procedure: {
          title: "Процедура за кандидатстване",
          step1: "Заявление за кандидатстване.",
          step2: "Диплома за завършена образователно-квалификационна степен “магистър” и приложението към нея.",
          step3: "Автобиография (европейски формат).",
          step4: "Документ за платени такси за кандидатстване в размер на 110 лв. (за изпит по специалността на докторската програма и по чужд език).",
          step5: "Декларация по чл. 91, ал. 7, т. 2 от ЗВО по образец, в която кандидатите посочват необходимите лични данни и декларират, че отговарят на условията по програмата, а именно: 1) че са нови докторанти, които ще се обучават в редовна форма и към момента на обявяване на процедурата не са зачислени в докторантура при висше училище/научна организация; 2) че не са защитили ОНС „доктор“; 3) не са отчислени с или без право на защита след обучение в докторска програма.",
          step6: "Документи, доказващи компетентност за изпълнение на задачите в рамките на докторантурата, напр. списък с научни публикации, цитати, участия в изследователски проекти, обучения, патенти и полезни модели, членство в научни или обществени организации, обществена дейност, владеене на езици и др.",
          step7: "Формуляр за съгласие за обработка на лични данни при кандидатстване.",
          step8: "Декларация за достоверност на представените документи."
        }
      },
      tax: {
        name: "Такса",
        amount: "Размер",
        BGtitle: "Такси за обучение за български граждани",
        NonBGtitle: "Такси за обучение за чуждестранни граждани от страни извън ЕС и ЕИП",
        taxesBG: {
          application_fee: "Такса за кандидатсване в ОНС “Доктор”",
          exam_tax: "Такса за изпит по специалността / Чужд език",
          anual_fees: "ГОДИШНА ТАКСА ОБУЧЕНИЕ В ОНС “ДОКТОР” – РЕДОВНА ФОРМА – ДЪРЖАВНА ПОРЪЧКА",
          anual_fees3_1: "Годишна такса обучение – П.Н. 3.7 “Администрация и управление”",
          anual_fees3_2: "Годишна такса обучение – П.Н. 5.3. “Комуникационна и компютърна техника”",
          anula_fees3_3: "Годишна такса обучение – П.Н. 5.13. “Общо инженерство”",
          anual_fees2: "ГОДИШНА ТАКСА ОБУЧЕНИЕ В ОНС “ДОКТОР” – ЗАДОЧНА ФОРМА – ДЪРЖАВНА ПОРЪЧКА",
          anual_fees2_1: "Годишна такса обучение – П.Н. 3.7 “Администрация и управление”",
          anual_fees2_2: "Годишна такса обучение – П.Н. 5.3. “Комуникационна и компютърна техника”",
          anual_fees2_3: "Годишна такса обучение – П.Н. 5.13. “Общо инженерство”",
          anual_fees3: "ГОДИШНА ТАКСА ОБУЧЕНИЕ В ОНС “ДОКТОР” – РЕДОВНА/САМОСТОЯТЕЛНА ФОРМА – ПЛАТЕНО ОБУЧЕНИЕ",
          anual_fees3_1: "Годишна такса обучение – П.Н. 3.7 “Администрация и управление”",
          anual_fees3_2: "Годишна такса обучение – П.Н. 5.3. “Комуникационна и компютърна техника”",
          anual_fees3_3: "Годишна такса обучение – П.Н. 5.13. “Общо инженерство”",
          anual_fees4: "ГОДИШНА ТАКСА ОБУЧЕНИЕ В ОНС “ДОКТОР” – ЗАДОЧНА ФОРМА – ПЛАТЕНО ОБУЧЕНИЕ",
          anual_fees4_1: "Годишна такса обучение – П.Н. 3.7 “Администрация и управление”",
          anual_fees4_2: "Годишна такса обучение – П.Н. 5.3. “Комуникационна и компютърна техника”",
          anual_fees4_3: "Годишна такса обучение – П.Н. 5.13. “Общо инженерство”",
          anual_fees5: "ДРУГИ ТАКСИ ЗА ОБУЧЕНИЕ В ОНС “ДОКТОР”",
          anual_fees5_1: "Такса за предварително обсъждане пред катедрен съвет, в т. ч. разширен катедрен съвет",
          anual_fees5_2: "Такса за защита пред научно жури, в т. ч. и издаване на диплома за придобиване на ОНС „Доктор“"
        }
      }
    }
  },
  en: {
    translation: {
      hero: {
        uni_name: "University of Telecommunications and Posts",
        phd_lab: "PhD Lab",
        description: "A collaborative research and innovation platform for doctoral students, supervisors, and academic institutions.",
        info_button: "Info",
        mission_button: "Mission",
        contact: "Contact",
        login: "Login for registered users"
      },
      contact: {
        title: "Contact Us",
        mail: "Email",
        phone: "Phone",
        address: "Address",
        socials: "Social Media"
      },
      specialties: {
        title: "Doctoral Programs",
        code: "Code",
        field: "Professional Field",
        program: "Doctoral Program",
        fullTime: "Full-time",
        partTime: "Part-time",

        fields: {
          communication_computer_engineering:
            "Communication and Computer Engineering",
          general_engineering: "General Engineering",
        },
        programs: {
          theoretical_foundations_communication_tech:
            "Theoretical Foundations of Communication Technology",
          it_networks_cybersecurity:
            "Information Technologies, Communication Networks and Cybersecurity",
          industrial_engineering: "Industrial Engineering"
        },
        download: "Download Synopsis",
        application: "Apply",
        law: "Higher Education Act",
        regulations: "UTP Regulations",
        taxes: "Taxes",
      },
      documents: {
        title: "Electronic Resources"
      },
      news: {

      },
      apply: {
        download: "Download File",
        procedure: {
          title: "Application Procedure",
          step1: "Application form for admission.",
          step2: "Diploma of completed educational and qualification degree “master” and its annex.",
          step3: "Curriculum vitae (European format).",
          step4: "Document for paid application fees in the amount of BGN 110 (for an exam in the specialty of the doctoral program and in a foreign language).",
          step5: "Declaration under Art. 91, para. 7, item 2 of the HEA in a template, in which candidates provide the necessary personal data and declare that they meet the conditions of the program, namely: 1) that they are new doctoral students who will be trained in full-time form and at the time of announcing the procedure are not enrolled in a doctorate at a higher education institution/scientific organization; 2) that they have not defended a PhD degree; 3) have not been expelled with or without the right to defend after training in a doctoral program.",
          step6: "Documents proving competence for performing tasks within the framework of the doctorate, e.g. list of scientific publications, citations, participation in research projects, trainings, patents and utility models, membership in scientific or public organizations, public activity, language proficiency, etc.",
          step7: "Consent form for personal data processing during application.",
          step8: "Declaration of authenticity of the submitted documents."
        }
      },
      tax: {
        name: "Tax",
        amount: "Amount",
        BGtitle: "Tax Fees for Bulgarian Citizens",
        NonBGtitle: "Tax Fees for Non-EU and Non-EEA Foreign Citizens",
        taxesBG: {
          application_fee: "Application fee for admission to PhD degree",
          exam_tax: "Exam fee in the specialty / Foreign language",
          anual_fees: "ANNUAL TUITION FEE FOR PhD DEGREE – FULL-TIME FORM – STATE ORDER",
          anual_fees3_1: "Annual tuition fee – P.F. 3.7 “Administration and Management”",
          anual_fees3_2: "Annual tuition fee – P.F. 5.3. “Communication and Computer Engineering”",
          anula_fees3_3: "Annual tuition fee – P.F. 5.13. “General Engineering”",
          anual_fees2: "ANNUAL TUITION FEE FOR PhD DEGREE – PART-TIME FORM – STATE ORDER",
          anual_fees2_1: "Annual tuition fee – P.F. 3.7 “Administration and Management”",
          anual_fees2_2: "Annual tuition fee – P.F. 5.3. “Communication and Computer Engineering”",
          anual_fees2_3: "Annual tuition fee – P.F. 5.13. “General Engineering”",
          anual_fees3: "ANNUAL TUITION FEE FOR PhD DEGREE – FULL-TIME/INDEPENDENT FORM – PAID EDUCATION",
          anual_fees3_1: "Annual tuition fee – P.F. 3.7 “Administration and Management”",
          anual_fees3_2: "Annual tuition fee – P.F. 5.3. “Communication and Computer Engineering”",
          anual_fees3_3: "Annual tuition fee – P.F. 5.13. “General Engineering”",
          anual_fees4: "ANNUAL TUITION FEE FOR PhD DEGREE – PART-TIME FORM – PAID EDUCATION",
          anual_fees4_1: "Annual tuition fee – P.F. 3.7 “Administration and Management”",
          anual_fees4_2: "Annual tuition fee – P.F. 5.3. “Communication and Computer Engineering”",
          anual_fees4_3: "Annual tuition fee – P.F. 5.13. “General Engineering”",
          anual_fees5: "OTHER TUITION FEES FOR PhD DEGREE",
          anual_fees5_1: "Fee for preliminary discussion before the departmental council, including extended departmental council",
          anual_fees5_2: "Fee for defense before a scientific jury, including issuance of a diploma for obtaining a PhD degree"
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "bg", // default if detected language not available
    lng: localStorage.getItem("language") || "bg", // start with saved language
    debug: true,
    interpolation: { escapeValue: false }
  });
  

export default i18n;
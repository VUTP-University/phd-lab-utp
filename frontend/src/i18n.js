import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


const resources = {
  bg: {
    translation: {
      navbar: {
        brand: "Смарт PhD Lab 5.0",
        home: "Начало",
        my_courses: "Моите курсове",
        admin_panel: "Административен панел",
        theme: {
          light: "Светла тема",
          dark: "Тъмна тема"
        },
        contact: "Контакти",
        logout: "Изход"
      },
      hero: {
        uni_name: "Висше училище по телекомуникации и пощи",
        phd_lab: "Докторантско училище",
        description: "Съвместна платформа за изследвания и иновации за докторанти, научни ръководители и академични институции.",
        info_button: "За проекта",
        mission_button: "Мисия",
        contact: "Контакти",
        login: "Вход за регистрирани потребители"
      },
      about: {
        about_title: "За проекта",
        members_title: "Членове на проекта",
        members: [
          { "name": "Проф. д-р Миглена Темелкова", "position": "Ръководител" },
          { "name": "Доц. д-р Вихра Димитрова", "position": "Координатор" },
          { "name": "Доц. д-р Ради Димитров", "position": "Счетоводител" },
          { "name": "Нина Найденова", "position": "Експерт административни дейности" },
          { "name": "Цонка Иванова", "position": "Експерт образователни дейности" },
          { "name": "Гл. ас. д-р Катерина Николова", "position": "Координатор за МГУ" },
          { "name": "Доц. д-р Борислава Гълъбова", "position": "Експерт образователни дейности МГУ" },
          { "name": "Доц. д-р инж. Ивайло Ченчев", "position": "Експерт ИКТ и НИД" },
          { "name": "Доц. д-р инж. Мариела Александрова", "position": "Координатор ТУ-Варна" }
        ]

      },
      project_scope: {
        title: "Цели и обхват на проекта",
        contentNotFound: "Съдържанието не е намерено за избрания език."
      },
      contact: {
        title: "Свържете се с нас",
        mail: "Email",
        phone: "Телефон",
        address: "Адрес",
        socials: "Социални мрежи",
        back_button: "Назад",
        send_message: "Изпратете съобщение",
        placeholder_name: 'Име',
        placeholder_email: 'Имейл',
        email_subject: "Тема",
        message: "Съобщение"


      },
      specialties: {
        title: "Докторантски програми",
        code: "Шифър",
        field: "Професионално направление",
        program: "Докторска програма",
        fullTime: "Редовна",
        partTime: "Задочна",
        moreinfo: "Повече информация",

        fields: {
          communication_computer_engineering: "Комуникационна и компютърна техника",
          general_engineering: "Общо инженерство",
          administration_management: "Администрация и управление",
        },
        programs: {
          theoretical_foundations_communication_tech:
            "Теоретични основи на комуникационната техника",
          it_networks_cybersecurity:
            "Информационни технологии, комуникационни мрежи и киберсигурност",
          industrial_engineering: "Индустриален инженеринг",
          organization_and_management_of_telecommunication_and_post:
            "Организация и управление в телекомуникациите и пощите"
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
        title: "Новини и събития",
        loading: "Зареждане на новините...",
        no_news: "Няма създадени новини",
        more_images: "още изображения",
        news: "Новина",
        event: "Събитие",
        share_on_facebook: "Сподели във Facebook",
        share_on_linkedin: "Сподели в LinkedIn",
        view_all: "Виж всички новини"


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
          anual_fees_1: "Годишна такса обучение – П.Н. 3.7 “Администрация и управление”",
          anual_fees_2: "Годишна такса обучение – П.Н. 5.3. “Комуникационна и компютърна техника”",
          anual_fees_3: "Годишна такса обучение – П.Н. 5.13. “Общо инженерство”",
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
      },
      admin_dashboard: {
        title: "Административен панел",
        courses_title: "Всички курсове",
        loading: "Зареждане на курсовете...",
        error: "Грешка при зареждане на курсовете.",
        course_name: "Име",
        course_id: "ID на курса",
        section: "Секция",
        status: "Статус",
        visible: "Видим",
        sidebar: {
          users: "Управление на потребители",
          courses: "Управление на курсове",
          news: "Новини и събития",
          publications: "Публикации"
        },
        users_mgmt: {
          title: "Управление на потребители",
          admins: "Администратори",
          students: "Студенти",
        },
        news: {
          title: "Управление на новини и събития",
          create: "Създай новина/събитие",
          edit: "Редактирай",
          delete: "Изтрий",
          news_title: "Заглавие",
          news_title_description: "Въведете заглавие на новината или събитието",
          news_type: "Тип",
          type_news: "Новина",
          type_event: "Събитие",
          description: "Описание",
          description_placeholder: "Въведете описание на новината или събитието",
          no_images: "Няма изображения",
          one_image: "1 изображение",
          multiple_images: "{{ count }} изображения",
          hide: "Скрий новината",
          show: "Покажи новината",
          images: "Изображения",
          choose_images: "Изберете изображения",
          imagenr: "изображения",
          existing_images: "Съществуващи изображения",
          delete_image: "Изтрий изображение",
          cancel: "Отказ",
          saving: "Запазване...",
          update_news: "Обнови новината",
          create_news: "Създай новина",
          delete_news: "Изтрий новината",
          all_news: "Всички новини и събития",
          loading: "Зареждане на новините...",
          no_news: "Няма създадени новини",
          visibility_toggle: "Показване/Скриване",
          image_upload: "Качване на изображения",
        }
      },
      dashboard: {
        title: "Табло за управление",
        courses_title: "Моите курсове",
        loading: "Зареждане на курсовете...",
        individual_plan_loading: "Зареждане на индивидуалния план...",
        individual_plan_uploaded: "Качен: ",
        error: "Грешка при зареждане на курсовете.",
        go_to_classroom: "Отиди в Classroom",
        individual_plan: "Индивидуален план",
        no_plan: "Няма намерен индивидуален план.",
        download: "Изтегли",
        ai_assistant_name: "Cognito AI Асистент",
        ai_assistant_descr: "Вашият академичен помощник",
        ai_quick_analysis: "Бърз анализ на представянето Ви",
        ai_overall_performance: "Общ анализ",
        ai_overall_performance_descr: "Общ анализ на академичното представяне",
        ai_analyze: "AI резюме на представянето Ви",
        ai_analyze_clear: "Изчисти резултата",
        ai_select_analysis: "Изберете анализ и кликнете за обработка",
        ai_powered_by: "Задвижван от OpenAI",
        ai_limit_info: "До 10 анализа на ден.",
        ai_analyze_my_plan: "Анализирай моя индивидуален план",
        ai_analyze_individual_plan: "Анализ на индивидуалния план",
        ai_analyze_individual_plan_descr: "Подробен анализ на индивидуалния план с препоръки",
        ai_analyze_in_progress: "Обработвам Вашата информация...",
        ai_analyze_error: "Грешка при анализирането. Моля, опитайте отново по-късно.",
        course_cards: {
          ai_insight: "AI Резюме",
          open_classroom: "Отвори Classroom",
          loading_details: "Зареждане на детайлите на курса...",
          waiting: "чaкaщи",
          event: "събития",
          no_due_date: "Няма крайна дата",
          open_assignments: "Активни задания",
          graded_assignments: "Оценени задания",
          grade: "Оценка",
          not_graded_assignments: "Няма оценка",
          upcoming_events: "Предстоящи събития",
          view_in_calendar: "Виж в календара",
          google_meet: "Google Meet срещи",
          join_meet: "Присъедини се към срещата",
          no_assignments: "Няма задания за този курс.",
          error: "Грешка при зареждане на данните за курса."
        }

      },
      footer: {
        resources: "Ресурси",
        about: "За проекта",
        scope: "Мисия",
        contact: "Контакти",
        utp: "Висше училище по телекомуникации и пощи",
      }
    }
  },
  en: {
    translation: {
      navbar: {
        brand: "Smart PhD Lab 5.0",
        home: "Home",
        my_courses: "My Courses",
        admin_panel: "Admin Panel",
        theme: {
          light: "Light Theme",
          dark: "Dark Theme"
        },
        contact: "Contacts",
        logout: "Logout"
      },
      hero: {
        uni_name: "University of Telecommunications and Posts",
        phd_lab: "PhD Lab",
        description: "A collaborative research and innovation platform for doctoral students, supervisors, and academic institutions.",
        info_button: "About",
        mission_button: "Scope",
        contact: "Contact",
        login: "Login for registered users"
      },
      about: {
        about_title: "About the Project",
        members_title: "Project Members",
        members: [
          { "name": "Prof. Dr. Miglena Temelkova", "position": "Project Leader" },
          { "name": "Assoc. Prof. Dr. Vihra Dimitrova", "position": "Coordinator" },
          { "name": "Assoc. Prof. Dr. Radi Dimitrov", "position": "Accountant" },
          { "name": "Nina Naydenova", "position": "Administrative Activities Expert" },
          { "name": "Tsonka Ivanova", "position": "Educational Activities Expert" },
          { "name": "Assist. Prof. Dr. Katerina Nikolova", "position": "MGU Coordinator" },
          { "name": "Assoc. Prof. Dr. Borislava Galabova", "position": "MGU Educational Activities Expert" },
          { "name": "Assoc. Prof. Dr. Eng. Ivaylo Chenchev", "position": "ICT and RDI Expert" },
          { "name": "Assoc. Prof. Dr. Eng. Mariela Alexandrova", "position": "TU-Varna Coordinator" }
        ]

      },
      project_scope: {
        title: "Project Goals and Scope",
        contentNotFound: "Content not found for the selected language."
      },
      contact: {
        title: "Contact Us",
        mail: "Email",
        phone: "Phone",
        address: "Address",
        socials: "Social Media",
        back_button: "Back",
        send_message: "Send message",
        placeholder_name: 'Name',
        placeholder_email: 'Email',
        email_subject: "Subject",
        message: "Message"
      },
      specialties: {
        title: "Doctoral Programs",
        code: "Code",
        field: "Professional Field",
        program: "Doctoral Program",
        fullTime: "Full-time",
        partTime: "Part-time",
        moreinfo: "Details",
        fields: {
          communication_computer_engineering: "Communication and Computer Engineering",
          general_engineering: "General Engineering",
          administration_management: "Administration and Management"
        },
        programs: {
          theoretical_foundations_communication_tech:
            "Theoretical Foundations of Communication Technology",
          it_networks_cybersecurity:
            "Information Technologies, Communication Networks and Cybersecurity",
          industrial_engineering: "Industrial Engineering",
          organization_and_management_of_telecommunication_and_post:
            "Organization and Management of Telecommunications and Post"
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
        title: "News & Events",
        loading: "Loading news...",
        no_news: "No news created",
        more_images: "more images",
        news: "News",
        event: "Event",
        share_on_facebook: "Share on Facebook",
        share_on_linkedin: "Share on LinkedIn",
        view_all: "View All News"
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
          anual_fees_1: "Annual tuition fee – P.F. 3.7 “Administration and Management”",
          anual_fees_2: "Annual tuition fee – P.F. 5.3. “Communication and Computer Engineering”",
          anual_fees_3: "Annual tuition fee – P.F. 5.13. “General Engineering”",
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
      },
      admin_dashboard: {
        title: "Admin Panel",
        courses_title: "All Courses",
        loading: "Loading courses...",
        error: "Error loading courses.",
        course_name: "Course Name",
        course_id: "Course ID",
        section: "Section",
        status: "Status",
        visible: "Visible",
        sidebar: {
          users: "Users Management",
          courses: "Courses Management",
          news: "News & Events",
          publications: "Publications"
        },
        users_mgmt: {
          title: "Users Management",
          admins: "Admins",
          students: "Students",
        },
        news: {
          title: "News & Events Management",
          create: "Create News/Event",
          edit: "Edit",
          delete: "Delete",
          news_title: "Title",
          news_title_description: "Enter the title of the news or event",
          news_type: "Type",
          type_news: "News",
          type_event: "Event",
          description: "Description",
          description_placeholder: "Enter the description of the news or event",
          no_images: "No images",
          one_image: "1 image",
          multiple_images: "{{ count }} images",
          hide: "Hide news",
          show: "Show news",
          images: "Images",
          choose_images: "Choose images",
          imagenr: "images",
          existing_images: "Existing images",
          delete_image: "Delete image",
          cancel: "Cancel",
          saving: "Saving...",
          update_news: "Update News",
          create_news: "Create News",
          delete_news: "Delete News",
          all_news: "All News and Events",
          loading: "Loading news...",
          no_news: "No news created",
          visibility_toggle: "Show/Hide",
          image_upload: "Upload Images"
        }
      },
      dashboard: {
        title: "Dashboard",
        courses_title: "My Courses",
        loading: "Loading courses...",
        individual_plan_loading: "Loading individual plan...",
        individual_plan_uploaded: "Uploaded: ",
        error: "Error loading courses.",
        go_to_classroom: "Go to Classroom",
        individual_plan: "Individual Plan",
        no_plan: "No individual plan found.",
        download: "Download",
        ai_assistant_name: "Cognito AI Assistant",
        ai_assistant_descr: "Your academic assistant",
        ai_quick_analysis: "Quick Performance Analysis",
        ai_overall_performance: "Overall Performance Analysis",
        ai_overall_performance_descr: "Overall analysis of academic performance",
        ai_analyze: "AI Summary of Your Performance",
        ai_analyze_clear: "Clear Result",
        ai_select_analysis: "Select an analysis and click to process",
        ai_powered_by: "Powered by OpenAI",
        ai_limit_info: "Up to 10 analyses per day.",
        ai_analyze_my_plan: "Analyze my individual plan",
        ai_analyze_individual_plan: "Individual Plan Analysis",
        ai_analyze_individual_plan_descr: "Detailed analysis of the individual plan with recommendations",
        ai_analyze_in_progress: "Processing your information...",
        ai_analyze_error: "Error analyzing. Please try again later.",
        course_cards: {
          ai_insight: "AI Insight",
          open_classroom: "Open Classroom",
          loading_details: "Loading course details...",
          waiting: "waiting",
          event: "events",
          no_due_date: "No due date",
          open_assignments: "Open assignments",
          graded_assignments: "Graded assignments",
          grade: "Grade",
          not_graded_assignments: "Not graded",
          upcoming_events: "Upcoming events",
          view_in_calendar: "View in calendar",
          google_meet: "Google Meet sessions",
          join_meet: "Join the meeting",
          no_assignments: "No assignments for this course.",
          error: "Error loading course data."
        }
      },
      footer: {
        resources: "Resources",
        about: "About",
        scope: "Scope",
        contact: "Contacts",
        utp: "University of Telecommunications and Posts",
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
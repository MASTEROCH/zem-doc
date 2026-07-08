/* ════════════════════════════════════════════════════════════════════
   Земский Доктор · Врачи (16 специалистов) — спарсено с zem-doc.ru
   Имена, специальности и стаж реальные; рейтинги/био — для прототипа.
   ════════════════════════════════════════════════════════════════════ */

export type Doctor = {
  id: string;
  name: string;
  photo: string;
  specialties: string[];
  role: string;        // краткая роль для карточки
  experience: number;  // лет
  category?: string;   // квалификационная категория / степень
  deptIds: string[];
  bio: string;
  rating: number;
  reviews: number;
  nextSlot: string;    // ближайшее окно
};

export const doctors: Doctor[] = [
  {
    id: 'morozova-n', name: 'Морозова Наталья Юрьевна', photo: 'doctors/morozova-n.jpg',
    specialties: ['Кардиолог'], role: 'Врач-кардиолог', experience: 39,
    category: 'Высшая категория', deptIds: ['cardio'],
    bio: 'Ведущий кардиолог центра. Диагностика и лечение гипертонии, ИБС, аритмий. Индивидуальный подбор терапии и программы наблюдения.',
    rating: 4.9, reviews: 214, nextSlot: 'сегодня 15:30',
  },
  {
    id: 'morozova-m', name: 'Морозова Мария Михайловна', photo: 'doctors/morozova-m.jpg',
    specialties: ['Кардиолог'], role: 'Врач-кардиолог', experience: 16,
    category: 'Кандидат мед. наук', deptIds: ['cardio'],
    bio: 'Кардиолог, специалист по функциональной диагностике сердца. Ведёт пациентов с гипертонией и нарушениями ритма.',
    rating: 4.8, reviews: 98, nextSlot: 'завтра 10:00',
  },
  {
    id: 'bobylev', name: 'Бобылев Андрей Анатольевич', photo: 'doctors/bobylev.jpg',
    specialties: ['Терапевт', 'Кардиолог', 'Пульмонолог'], role: 'Терапевт · кардиолог · пульмонолог', experience: 23,
    category: 'Высшая категория', deptIds: ['therapy', 'cardio', 'pulmo'],
    bio: 'Врач широкого профиля. Ведёт первичный приём, хронические заболевания сердца и дыхательной системы, чек-апы.',
    rating: 4.9, reviews: 176, nextSlot: 'сегодня 17:00',
  },
  {
    id: 'belikova', name: 'Беликова Елена Сергеевна', photo: 'doctors/belikova.jpg',
    specialties: ['Терапевт', 'Гастроэнтеролог'], role: 'Терапевт · гастроэнтеролог', experience: 32,
    category: 'Высшая категория', deptIds: ['therapy', 'gastro'],
    bio: 'Опытный терапевт и гастроэнтеролог. Диагностика и лечение заболеваний ЖКТ, подбор диеты, ведение хронических пациентов.',
    rating: 4.9, reviews: 189, nextSlot: 'завтра 11:30',
  },
  {
    id: 'arhipova', name: 'Архипова Наталья Юрьевна', photo: 'doctors/arhipova.jpg',
    specialties: ['УЗИ', 'Функциональная диагностика'], role: 'Врач УЗИ · функциональная диагностика', experience: 28,
    category: 'Высшая категория', deptIds: ['uzi', 'func-diag'],
    bio: 'Врач ультразвуковой и функциональной диагностики. Экспертное УЗИ всех органов, ЭКГ, Холтер. Расшифровка сразу на приёме.',
    rating: 4.9, reviews: 231, nextSlot: 'сегодня 14:00',
  },
  {
    id: 'ivankova', name: 'Иванкова Инна Гершевна', photo: 'doctors/ivankova.jpg',
    specialties: ['Эндокринолог'], role: 'Врач-эндокринолог', experience: 51,
    category: 'Высшая категория', deptIds: ['endo'],
    bio: 'Эндокринолог с полувековым опытом. Заболевания щитовидной железы, диабет, нарушения обмена веществ и веса.',
    rating: 5.0, reviews: 264, nextSlot: 'завтра 09:30',
  },
  {
    id: 'buzaeva', name: 'Бузаева Ирина Николаевна', photo: 'doctors/buzaeva.jpg',
    specialties: ['Гинеколог', 'Акушер'], role: 'Акушер-гинеколог', experience: 36,
    category: 'Высшая категория', deptIds: ['gyneco'],
    bio: 'Акушер-гинеколог высшей категории. Профилактические осмотры, ведение беременности, лечение воспалительных заболеваний.',
    rating: 4.9, reviews: 203, nextSlot: 'сегодня 16:15',
  },
  {
    id: 'kuznecova', name: 'Кузнецова Татьяна Александровна', photo: 'doctors/kuznecova.jpg',
    specialties: ['Гинеколог', 'Акушер'], role: 'Акушер-гинеколог', experience: 47,
    category: 'Высшая категория', deptIds: ['gyneco'],
    bio: 'Один из самых опытных гинекологов центра. Бережный подход, ведение сложных случаев, планирование беременности.',
    rating: 5.0, reviews: 248, nextSlot: 'завтра 12:00',
  },
  {
    id: 'zubareva', name: 'Зубарева Ирина Анатольевна', photo: 'doctors/zubareva.jpg',
    specialties: ['Онкогинеколог', 'Гинеколог'], role: 'Онкогинеколог', experience: 31,
    category: 'Высшая категория', deptIds: ['oncology', 'gyneco'],
    bio: 'Онкогинеколог. Ранняя диагностика и профилактика онкозаболеваний женской репродуктивной системы, наблюдение групп риска.',
    rating: 4.9, reviews: 142, nextSlot: 'завтра 15:00',
  },
  {
    id: 'volozneva', name: 'Волознева Дарья Викторовна', photo: 'doctors/volozneva.jpg',
    specialties: ['Гинеколог'], role: 'Врач-гинеколог', experience: 8,
    category: 'Второе высшее', deptIds: ['gyneco'],
    bio: 'Гинеколог, внимательный к деталям специалист. Плановые осмотры, контрацепция, лечение воспалительных заболеваний.',
    rating: 4.8, reviews: 76, nextSlot: 'сегодня 13:00',
  },
  {
    id: 'dunaeva', name: 'Дунаева Римма Даниловна', photo: 'doctors/dunaeva.jpg',
    specialties: ['Ревматолог'], role: 'Врач-ревматолог', experience: 4,
    deptIds: ['rheuma'],
    bio: 'Ревматолог. Диагностика и лечение заболеваний суставов и соединительной ткани, современные схемы терапии.',
    rating: 4.8, reviews: 41, nextSlot: 'завтра 14:30',
  },
  {
    id: 'levina', name: 'Левина Ольга Андреевна', photo: 'doctors/levina.jpg',
    specialties: ['Невролог'], role: 'Врач-невролог', experience: 7,
    deptIds: ['neuro'],
    bio: 'Невролог. Лечение головных болей, болей в спине, головокружений и нарушений сна. Лечебные блокады.',
    rating: 4.8, reviews: 88, nextSlot: 'сегодня 18:00',
  },
  {
    id: 'leschinsky', name: 'Лещинский Андрей Владиславович', photo: 'doctors/leschinsky.jpg',
    specialties: ['Нейрохирург'], role: 'Врач-нейрохирург', experience: 27,
    category: 'Высшая категория', deptIds: ['neuro'],
    bio: 'Нейрохирург. Консультации при заболеваниях позвоночника и нервной системы, второе мнение, малоинвазивные методики.',
    rating: 4.9, reviews: 119, nextSlot: 'завтра 16:00',
  },
  {
    id: 'morozov', name: 'Морозов Юрий Николаевич', photo: 'doctors/morozov.jpg',
    specialties: ['Сосудистый хирург'], role: 'Сердечно-сосудистый хирург', experience: 39,
    category: 'Высшая категория', deptIds: ['cardio-surgery'],
    bio: 'Сердечно-сосудистый хирург. Лечение варикоза, флебология, УЗДС вен, склеротерапия, послеоперационное наблюдение.',
    rating: 4.9, reviews: 157, nextSlot: 'завтра 10:30',
  },
  {
    id: 'marinova', name: 'Маринова Анна Алексеевна', photo: 'doctors/marinova.jpg',
    specialties: ['Психолог', 'Клинический психолог'], role: 'Клинический психолог', experience: 18,
    deptIds: ['psycho'],
    bio: 'Клинический психолог. Работа со стрессом, тревогой, выгоранием и кризисными состояниями. Психодиагностика.',
    rating: 4.9, reviews: 103, nextSlot: 'сегодня 19:00',
  },
  {
    id: 'krestina', name: 'Крестина Ирина Викторовна', photo: 'doctors/krestina.jpg',
    specialties: ['Психолог', 'Детский психолог'], role: 'Психолог · детский психолог', experience: 7,
    deptIds: ['psycho'],
    bio: 'Психолог для детей и взрослых. Детско-родительские отношения, адаптация, поддержка в трудных ситуациях.',
    rating: 4.8, reviews: 64, nextSlot: 'завтра 13:30',
  },
  {
    id: 'romanenko', name: 'Романенко Наталья Владимировна', photo: 'doctors/romanenko.jpg',
    specialties: ['Терапевт', 'Гастроэнтеролог'], role: 'Терапевт · гастроэнтеролог', experience: 32,
    category: 'Высшая категория', deptIds: ['therapy', 'gastro'],
    bio: 'Терапевт и гастроэнтеролог с большим стажем. Первичный приём, заболевания ЖКТ, ведение хронических пациентов.',
    rating: 4.9, reviews: 168, nextSlot: 'сегодня 15:00',
  },
  {
    id: 'sadovsky', name: 'Садовский Евгений Михайлович', photo: 'doctors/sadovsky.jpg',
    specialties: ['Терапевт', 'Ревматолог'], role: 'Терапевт · ревматолог', experience: 13,
    deptIds: ['therapy', 'rheuma'],
    bio: 'Терапевт и ревматолог. Диагностика и лечение заболеваний суставов, подбор терапии, ведение сопутствующих заболеваний.',
    rating: 4.8, reviews: 92, nextSlot: 'завтра 11:00',
  },
  {
    id: 'chernovol', name: 'Черновол Надежда Владимировна', photo: 'doctors/chernovol.jpg',
    specialties: ['УЗИ'], role: 'Врач ультразвуковой диагностики', experience: 32,
    category: 'Высшая категория', deptIds: ['uzi'],
    bio: 'Врач УЗИ высшей категории. Экспертное ультразвуковое исследование органов и сосудов, расшифровка на приёме.',
    rating: 4.9, reviews: 137, nextSlot: 'сегодня 12:30',
  },
  {
    id: 'nasevich', name: 'Насевич Елена Ивановна', photo: 'doctors/nasevich.jpg',
    specialties: ['УЗИ'], role: 'Врач ультразвуковой диагностики', experience: 11,
    deptIds: ['uzi'],
    bio: 'Врач ультразвуковой диагностики. Проводит УЗИ всех органов и систем, скрининги, исследования при беременности.',
    rating: 4.8, reviews: 84, nextSlot: 'завтра 09:00',
  },
  {
    id: 'sabirova', name: 'Сабирова Людмила Александровна', photo: 'doctors/sabirova.jpg',
    specialties: ['Функциональная диагностика'], role: 'Врач функциональной диагностики', experience: 15,
    deptIds: ['func-diag'],
    bio: 'Врач функциональной диагностики. ЭКГ, суточное мониторирование, исследования дыхания. Точность и быстрый результат.',
    rating: 4.8, reviews: 71, nextSlot: 'сегодня 16:00',
  },
  {
    id: 'opryshko', name: 'Опрышко Никита Сергеевич', photo: 'doctors/opryshko.jpg',
    specialties: ['Невролог', 'Отоневролог'], role: 'Невролог · отоневролог', experience: 9,
    deptIds: ['neuro'],
    bio: 'Невролог и отоневролог. Головокружения, нарушения равновесия, головные боли, заболевания периферической нервной системы.',
    rating: 4.8, reviews: 79, nextSlot: 'завтра 14:00',
  },
  {
    id: 'petrova', name: 'Петрова Ирина Владимировна', photo: 'doctors/petrova.jpg',
    specialties: ['Медицинский массаж'], role: 'Массажист', experience: 19,
    deptIds: ['massage'],
    bio: 'Специалист по медицинскому массажу. Реабилитация после травм, лечение болей в спине и шее, курсовые программы.',
    rating: 4.9, reviews: 121, nextSlot: 'сегодня 13:00',
  },
  {
    id: 'popov', name: 'Попов Евгений Михайлович', photo: 'doctors/popov.jpg',
    specialties: ['Онколог', 'Маммолог', 'Хирург'], role: 'Онколог · маммолог · хирург', experience: 11,
    deptIds: ['oncology'],
    bio: 'Онколог-маммолог, хирург. Ранняя диагностика новообразований, дерматоскопия, консультации и второе мнение.',
    rating: 4.9, reviews: 96, nextSlot: 'завтра 15:30',
  },
  {
    id: 'rudenko', name: 'Руденко Светлана Борисовна', photo: 'doctors/rudenko.jpg',
    specialties: ['Гинеколог', 'Маммолог', 'Онколог'], role: 'Гинеколог · маммолог · онколог', experience: 26,
    category: 'Высшая категория', deptIds: ['gyneco', 'oncology'],
    bio: 'Гинеколог-онколог, маммолог. Комплексное женское здоровье, онкоскрининг, наблюдение групп риска.',
    rating: 4.9, reviews: 158, nextSlot: 'сегодня 17:30',
  },
];

export function findDoctor(id: string) {
  return doctors.find((d) => d.id === id);
}
export function doctorsByDept(deptId: string) {
  return doctors.filter((d) => d.deptIds.includes(deptId));
}

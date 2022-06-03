// Айди товаров для получения фидбеков
const IMT_ID = [
    2184174,
    2530796,
    2530797,
    2530798,
    2530799,
    2553414,
    2594067,
    2594070,
    2594073,
    2594074,
    2594075,
    2961825,
    2961826,
    2961827,
    3998207,
    8922103,
    8977175,
    21093638,
    21352032,
    22218854,
    26261033,
    31120362,
    31122019,
    55810454,
    55812174,
];

const ALTERNATIVE_IMT_ID = [
    12445305
];

const UPDATE_DB_PERIOD = 1000*60*10; // 10 min

const ONE_DAY = 1000 * 60 * 60 * 24; // 24 hours

const TEXT_DELAY = 1000 * 3;

const START_PROMO_DAY = '2022-04-25T00:00:00.000Z'; // отсечка даты начала сбора отзывов

const WORK_IN_PROGRESS = ['Обрабатываем фото...', 'Еще немного...', 'Уже почти...']; // текст для обратной связи во время распознания картинки

const WORK_IS_DONE = 'Я прочитал твою картинку, твой отзыв:';

//Api для получения фидбэков
const FEEDBACK_API = 'https://public-feedbacks.wildberries.ru/api/v1/feedbacks/site';

// Ссылка в строенным промокодом
const PROMO_URL = "https://fitstars.ru/subscribe?tariff=126&promo=StarFitForYou&tariffs%5B%5D=126";

// Контактный email
const EMAIL = 'konovalova.a@prime-sport.ru';

// Приветствие
const GREETINGS = name => `Привет, ${name}! Добро пожаловать в Telegram Bot Prime Sport. Отправь скриншот своего отзыва или скопируй сюда его текст и получишь промокод на две недели бесплатного онлайн-фитнеса! Чтобы точно все получилось, постарайся отправлять скрин без лишнего текста: если на снимке будет больше 40% другой информации, я не смогу распознать отзыв.`;

// Ожидание ответа
const FIRST_ANSWER = 'Супер, спасибо! Скоро вернусь с обратной связью 😉';

// Скрин/Текст корректен
// const CORRECT_FEEDBACK = `Ура! Нашел) Держи свой <a href=${PROMO_URL}>промокод</a>!`;
const CORRECT_FEEDBACK = `Ура! Нашел) Держи свой промокод! 
${PROMO_URL}`;

// Дубль скрина/текста
const REPEATED_ANSWER = `Хм, для данного отзыва промокод уже отправлен. Попробуй другой отзыв или напиши нашему менеджеру ${EMAIL}, если уверен, что это ошибка.`;

// Отзыв не найден
const FEEDBACK_NOT_FOUND = `Отзыва пока нет в базе. В течение 24 часов база будет обновлена, я отправлю промокод сразу, как найду твой отзыв! Если не хочешь ждать, напиши нашему менеджеру ${EMAIL}, тебе подскажут, что делать.`;

// Отзыв не найден спустя 24 часа
const FEEDBACK_NOT_FOUND_24 = `Что-то пошло не так( Я не смог найти этот отзыв в базе. Но я очень хочу, чтобы ты все-таки получил свой промокод! Напиши нашему менеджеру ${EMAIL}, тебе подскажут, что делать.`;

// Завершающий ответ
const FINAL_ANSWER = 'Удачных тренировок! Буду держать за тебя кулачки) Чуть не забыл, у нас есть еще много классного и полезного для фитнеса. Загляни <a href="https://www.wildberries.ru/seller/45944">сюда</a>.';

module.exports = {
    IMT_ID,
    ALTERNATIVE_IMT_ID,
    UPDATE_DB_PERIOD,
    TEXT_DELAY,
    START_PROMO_DAY,
    ONE_DAY,
    WORK_IN_PROGRESS,
    WORK_IS_DONE,
    FEEDBACK_API,
    GREETINGS, 
    FIRST_ANSWER,
    FINAL_ANSWER, 
    CORRECT_FEEDBACK, 
    REPEATED_ANSWER, 
    FEEDBACK_NOT_FOUND, 
    FEEDBACK_NOT_FOUND_24 
};
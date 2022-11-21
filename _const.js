// Айди товаров для получения фидбеков
const IMT_ID = [
    2184174,
    2184207,
    2214694,
    2214695,
    2214697,
    2354042,
    2354044,
    2530796,
    2530797,
    2530798,
    2530799,
    2530806,
    2553414,
    2594067,
    2594070,
    2594073,
    2594074,
    2594075,
    2594094,
    2594096,
    2594097,
    2759981,
    2759986,
    2759999,
    2961825,
    2961826,
    2961827,
    3998207,
    6237233,
    6237234,
    6237236,
    6237240,
    6237242,
    6237243,
    6821789,
    6821790,
    6821791,
    6821796,
    6821797,
    8611611,
    8611614,
    8611616,
    8611618,
    8611621,
    8611623,
    8611626,
    8611627,
    8611630,
    8611631,
    8611635,
    8611636,
    8922103,
    8977175,
    9334252,
    10424209,
    10424218,
    10424229,
    10424232,
    10424249,
    10424251,
    10424252,
    10424253,
    20055526,
    21093638,
    21352032,
    22218854,
    26261033,
    27461255,
    31120362,
    31122019,
    55810454,
    55812174,
    55813391,
    55834947,
    55837855,
    8611601,
    8611638,
    8611637,
    8611640,
    8611639,
    3998228,
    3998227,
    2760010,
    2760008,
    2759989,
    2553437,
    2553436,
    9450603,
    9450604,
    9450605,
    9450606,
    9586794,
    9586796,
    9586799,
    9586800,
    3400045,
    8611641,
    8611642,
    8611643,
    8611644,
    8611645,
    10424220,
    39877778,
    11520442,
    26624614,
    10424220,
    7336107,
    6224912,
    2553432,
    2594100,
    2230907,
    2230906,
    3998226,
    13013432,
    14233905,
    14234526,
    14234359,
    9334574,
    10634074,
    10634075,
    9334575,
    49269089,
    9334575,
    2760151,
    2760150,
    2553417,
    2184185,
    8922101,
    2553412,
    2273916,
    2273917,
    2273918,
    2553413,
    10254054,
    2553416,
    2553415,
    8922102,
    3400022,
    3400023,
    3400024,
    3400025,
    3400026,
    8922105,
    27368890,
    9233091,
    3400027,
    9233094,
    46870045,
    29638230,
    29638475,
    29636054,
    29636209,
    29636294,
    57152725,
    57153118,
    57154718,
    57157364,
    57155861,
    57158126,
    57159741,
    57160287,
    57161476,
    57217417,
    57217390,
    57218070,
    57220965,
    57222757,
    57224695,
    9233093,
    8922104,
    8930367,
    8977174,
    8922104,
    29638814,
    29639048,
    29639348,
    29635941,
    29636391,
    29636746,
    29636912,
    29637253,
    29637422,
    61918491,
    61934485,
    61935994,
    61939135,
    61939635
];

const ALTERNATIVE_IMT_ID = [
    12445305
];

const UPDATE_DB_PERIOD = 1000*60*10; // 10 min

const ONE_DAY = 1000 * 60 * 60 * 24; // 24 hours

const TEXT_DELAY = 1000 * 3;

const START_PROMO_DAY = '2022-07-04T00:00:00.000Z'; // отсечка даты начала сбора отзывов

const WORK_IN_PROGRESS = ['Обрабатываем фото...', 'Еще немного...', 'Уже почти...']; // текст для обратной связи во время распознания картинки

const WORK_IS_DONE = 'Я прочитал твою картинку, твой отзыв:';

//Api для получения фидбэков
const FEEDBACK_API = 'https://public-feedbacks.wildberries.ru/api/v1/feedbacks/site';

// Ссылка в строенным промокодом
const PROMO_URL = "https://fitstars.ru/subscribe?tariff=126&promo=StarFitForYou&tariffs%5B%5D=126";

// Контактный email
const EMAIL = 'skripkina.k@prime-sport.ru';

// Приветствие
const GREETINGS = name => `Привет, ${name}! Добро пожаловать в Telegram Bot Prime Sport. Отправь скриншот своего отзыва или скопируй сюда его текст и получишь промокод на две недели бесплатного онлайн-фитнеса! Чтобы точно все получилось, постарайся отправлять скрин без лишнего текста: если на снимке будет больше 40% другой информации, я не смогу распознать отзыв.`;

// Ожидание ответа
const FIRST_ANSWER = 'Супер, спасибо! Скоро вернусь с обратной связью 😉';

// Скрин/Текст корректен
// const CORRECT_FEEDBACK = `Ура! Нашел) Держи свой <a href=${PROMO_URL}>промокод</a>!`;
const CORRECT_FEEDBACK = `Ура! Нашел) Держи свой промокод! ${PROMO_URL}`;

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
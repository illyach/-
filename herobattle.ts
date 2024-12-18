// Part 1: Визначення типів і інтерфейсів

enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER",
}

enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED",
}

interface HeroStats {
    health: number; // Здоров'я
    attack: number; // Атака
    defense: number; // Захист
    speed: number; // Швидкість
}

interface Hero {
    id: number; // Ідентифікатор героя
    name: string; // Ім'я героя
    type: HeroType; // Тип героя
    attackType: AttackType; // Тип атаки
    stats: HeroStats; // Характеристики героя
    isAlive: boolean; // Статус живий/мертвий
}

type AttackResult = {
    damage: number; // Завданий урон
    isCritical: boolean; // Чи була критична атака
    remainingHealth: number; // Залишок здоров'я
};

// Утилітарна функція для генерації випадкових характеристик
function getRandomStat(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Part 2: Функції

let heroIdCounter = 1; // Лічильник для генерації ідентифікаторів героїв

function createHero(name: string, type: HeroType): Hero {
    const stats: HeroStats = {
        health: getRandomStat(20, 250), // Генерація здоров'я
        attack: getRandomStat(20, 250), // Генерація атаки
        defense: getRandomStat(10, 50), // Генерація захисту
        speed: getRandomStat(20, 250), // Генерація швидкості
    };

    return {
        id: heroIdCounter++,
        name,
        type,
        attackType: type === HeroType.Mage ? AttackType.Magical : type === HeroType.Archer ? AttackType.Ranged : AttackType.Physical,
        stats,
        isAlive: true, // Герой створюється живим
    };
}

function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const isCritical = Math.random() < 0.2; // Імовірність критичної атаки - 20%
    let damage = attacker.stats.attack - defender.stats.defense; // Розрахунок урону

    if (isCritical) {
        damage *= 2; // Подвійний урон для критичної атаки
    }

    damage = Math.max(damage, 0); // Урон не може бути від'ємним

    const remainingHealth = Math.max(defender.stats.health - damage, 0); // Залишок здоров'я після атаки
    return { damage, isCritical, remainingHealth };
}

function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find((hero) => hero[property] === value); // Пошук героя за вказаною властивістю
}

function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `Один або обидва герої вже переможені.`;
    }

    const result1 = calculateDamage(hero1, hero2);
    hero2.stats.health = result1.remainingHealth;
    hero2.isAlive = hero2.stats.health > 0;

    let roundSummary = `${hero1.name} атакує ${hero2.name} на ${result1.damage} урону${result1.isCritical ? " (Критичний удар!)" : ""}.`;

    if (!hero2.isAlive) {
        roundSummary += ` ${hero2.name} переможений!`;
        return roundSummary;
    }

    const result2 = calculateDamage(hero2, hero1);
    hero1.stats.health = result2.remainingHealth;
    hero1.isAlive = hero1.stats.health > 0;

    roundSummary += `\n${hero2.name} контратакує ${hero1.name} на ${result2.damage} урону${result2.isCritical ? " (Критичний удар!)" : ""}.`;

    if (!hero1.isAlive) {
        roundSummary += ` ${hero1.name} переможений!`;
    }

    return roundSummary;
}

// Part 3: Практичне використання
const heroes: Hero[] = [
    createHero("Axe", HeroType.Warrior),
    createHero("Zeus", HeroType.Mage),
    createHero("Windranger", HeroType.Archer),
    createHero("Phantom Assassin", HeroType.Warrior),
    createHero("Invoker", HeroType.Mage),
    createHero("Sniper", HeroType.Archer),
];

// Демонстрація створення героїв
console.log("Створені герої:", heroes);

// Демонстрація пошуку героя
const foundHero = findHeroByProperty(heroes, "type", HeroType.Mage);
console.log("Знайдений герой:", foundHero);

function getRandomIndex(array: any[]): number {
    return Math.floor(Math.random() * array.length); // Отримання випадкового індексу
}

// Функція для вибору двох різних випадкових героїв з масиву
function getTwoRandomHeroes(heroes: Hero[]): [Hero, Hero] {
    let index1 = getRandomIndex(heroes);
    let index2: number;

    do {
        index2 = getRandomIndex(heroes);
    } while (index1 === index2); // Перевірка, щоб індекси не співпадали

    return [heroes[index1], heroes[index2]];
}

// Демонстрація бою
try {
    // Вибір двох випадкових героїв
    const [hero1, hero2] = getTwoRandomHeroes(heroes);

    console.log(`Випадково вибрані герої: ${hero1.name} vs ${hero2.name}`);

    // Проведення бойових раундів
    let battleResult = battleRound(hero1, hero2);
    console.log("Результат раунду бою:\n", battleResult);

    if (hero1.isAlive && hero2.isAlive) {
        battleResult = battleRound(hero1, hero2);
        console.log("Результат наступного раунду бою:\n", battleResult);
    }
} catch (error) {
    console.error(error.message);
}

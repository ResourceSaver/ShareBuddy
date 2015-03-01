class Advice {
    private static cooking: string[];
    private static leisure: string[];
    private static fitness: string[];
    private static hygiene: string[];
    private static selected: string[];

    public constructor() {
        Advice.cooking = new Array();
        Advice.leisure = new Array();
        Advice.fitness = new Array();
        Advice.hygiene = new Array();

        Advice.fitness.push("A laptop computer uses around 60 watts of power, but a desktop unit can use 300 watts.");
        Advice.fitness.push("About 15% of the electricity bill is for lighting. Turn off your lights in areas not being used.");
        Advice.fitness.push("Turn off appliances at the wall when not in use – appliances left on standby still use energy.");
        Advice.fitness.push("Use desk or standard lamps where most light is needed, so less lighting is required in the rest of the room.");
        Advice.fitness.push("If you are watching TV while working, try doing it on your computer instead.");
        Advice.fitness.push("Use the energy-saving standby mode on your computer.");
        Advice.fitness.push("Make sure to turn off all appliances (computer, TVs, game consoles) before going to bed.");
        Advice.fitness.push("If you have a printer, turn it off when you are not printing.");

        Advice.hygiene.push("Load your washer fully each wash. If you do not have a full load, adjust the water level of your machine to save on water and power.");
        Advice.hygiene.push("Avoid using small amounts of hot water if cold water will do. Each time you run the hot tap a litre or more of heated water goes cold in the pipes.");
        Advice.hygiene.push("Like washing the dishes, it is usually more energy (and water) efficient to put the plug in the sink rather than have a hot tap running straight down the drain.");
        Advice.hygiene.push("If your faucet leaks, get it fixed. A hot water tap dripping once a second for a day can waste enough hot water for an extra person.");
        Advice.hygiene.push("Don't overfill the dryer, and don't over dry clothes.");
        Advice.hygiene.push("Don't allow water to run down the sink as you wash, shave, or brush teeth.");
        Advice.hygiene.push("Iron large batches of clothing at together to avoid wasting energy reheating the iron.");
        Advice.hygiene.push("Save time and energy by cleaning the lint out of the clothes dryer before each run.");
        Advice.hygiene.push("A washing machine spends about 90% of it's energy on heating the water. Using warm or cold instead of hot water can half the energy consumption.");
        Advice.hygiene.push("Drying consecutive loads of laundry will be more efficient as the residual heat will help dry the next load.");

        Advice.leisure.push("Keep your room temperature moderate and wear a sweater if needed.");
        Advice.leisure.push("A laptop computer uses around 60 watts of power, but a desktop unit can use 300 watts.");
        Advice.leisure.push("About 15% of the electricity bill is for lighting. Turn off your lights in areas not being used.");
        Advice.leisure.push("Turn off appliances at the wall when not in use – appliances left on standby still use energy.");
        Advice.leisure.push("Use desk or standard lamps where most light is needed, so less lighting is required in the rest of the room.");
        Advice.leisure.push("If you are watching TV while working, do it on your computer.");
        Advice.leisure.push("Use the energy-saving standby mode on your computer.");
        Advice.fitness.push("Make sure to turn off all appliances (computer, TVs, game consoles) before going to bed.");
        Advice.fitness.push("If you have a printer, turn it off when you are not printing.");

        Advice.cooking.push("Use microwave ovens where possible. Their smaller wattage and faster cooking times can use up to 70% less electricity than other conventional methods.");
        Advice.cooking.push("You can use the water in the saucepan to boil pasta and potatoes at the same time.");
        Advice.cooking.push("Boiling water in an electric kettle is 50% more efficient than using the stove. For additional savings, fill only to the level you need.");
        Advice.cooking.push("A full fridge spends less energy than an empty fridge. If you're not keeping a fridge at least two-thirds full or a freezer at least three quarters full, it's too big and therefore costing you more money to run.");
        Advice.cooking.push("Defrost your freezer every six months or when there is a one-centimetre frost build up.");
        Advice.cooking.push("Don't leave the fridge door open for longer than necessary.");
        Advice.cooking.push("The fridge is commonly the biggest energy user in the home.");
        Advice.cooking.push("Don't put hot foods into fridge/freezer, allow food to cool down.");
        Advice.cooking.push("Don't over-fill pots with water when cooking vegetables.");
        Advice.cooking.push("Limit the times the oven door is opened, as this can cause up to 15% loss of hot air each time the door is opened.");
        Advice.cooking.push("Simmer food, never boil furiously.");
        Advice.cooking.push("Thaw foods before cooking.");
        Advice.cooking.push("Use a lid when boiling water.");
        Advice.cooking.push("Use the correct size saucepan to fit the stove plate.");
        Advice.cooking.push("Cook toast in a toaster, not under the grill/oven.");
        Advice.cooking.push("Keep your microwave clean to reduce cooking times to a minimum.");
        Advice.cooking.push("Use a kettle, not the stove, to boil water. Not only will it heat water quickly, it is also 50% more efficient.");
        Advice.cooking.push("Fill the kettle from the cold water tap.");
        Advice.cooking.push("Never rinse dirty dishes or utensils under the running hot water tap – always wash up by plugging the sink.");
        Advice.cooking.push("Avoid using small amounts of hot water if cold water will do. Each time you run the hot tap a litre or more of water that was heated goes cold.");
        Advice.cooking.push("If your faucet leaks, get it fixed. A hot water tap dripping once a second for a day can waste enough hot water for an extra person.");
    }

    public static GetAdvice(type: string): string {

        if (this.cooking == null)
            new Advice();

        switch (type) {
            case "Cooking":
                Advice.selected = Advice.cooking;
                break;
            case "Fitness":
                Advice.selected = Advice.fitness;
                break;
            case "Leisure":
                Advice.selected = Advice.leisure;
                break;
            case "Hygiene": 
                Advice.selected = Advice.hygiene;
                break;
        }

        var ran = Math.floor(Math.random() * Advice.selected.length);
        return Advice.selected[ran];
    }
}

var numberOfImages: number = 17;
var imagesLoaded: number = 0;

class Images {
    background: HTMLImageElement;
    pet: HTMLImageElement;
    drop: HTMLImageElement;
    mole: HTMLImageElement;
    pile: HTMLImageElement;
    bucket: HTMLImageElement;
    cookie: HTMLImageElement;
    eggs: HTMLImageElement;
    pan: HTMLImageElement;
    molebg: HTMLImageElement;
    rainbg: HTMLImageElement;
    circuit: HTMLImageElement;
    clouds1: HTMLImageElement;
    clouds2: HTMLImageElement;
    plate: HTMLImageElement;
    female: HTMLImageElement;
    bee: HTMLImageElement;
    callback;

    constructor(callback) {

        this.callback = callback;

        this.background = new Image();
        this.background.onload = () => this.ImageLoaded();
        this.background.src = "/../Images/background.png";

        this.molebg = new Image();
        this.molebg.onload = () => this.ImageLoaded();
        this.molebg.src = "/../Images/molebg.png";

        this.pet = new Image();
        this.pet.onload = () => this.ImageLoaded();
        this.pet.src = "/../Images/pet.png";

        this.female = new Image();
        this.female.onload = () => this.ImageLoaded();
        this.female.src = "/../Images/female.png";

        this.drop = new Image();
        this.drop.onload = () => this.ImageLoaded();
        this.drop.src = "/../Images/drop.png";

        this.mole = new Image();
        this.mole.onload = () => this.ImageLoaded();
        this.mole.src = "/../Images/mole.png";

        this.pile = new Image();
        this.pile.onload = () => this.ImageLoaded();
        this.pile.src = "/../Images/pile.png";

        this.bucket = new Image();
        this.bucket.onload = () => this.ImageLoaded();
        this.bucket.src = "/../Images/bucket.png";

        this.cookie = new Image();
        this.cookie.onload = () => this.ImageLoaded();
        this.cookie.src = "/../Images/cookie.png";

        this.eggs = new Image();
        this.eggs.onload = () => this.ImageLoaded();
        this.eggs.src = "/../Images/eggs.png";

        this.pan = new Image();
        this.pan.onload = () => this.ImageLoaded();
        this.pan.src = "/../Images/pan.png";

        this.rainbg = new Image();
        this.rainbg.onload = () => this.ImageLoaded();
        this.rainbg.src = "/../Images/rain.png";

        this.circuit = new Image();
        this.circuit.onload = () => this.ImageLoaded();
        this.circuit.src = "/../Images/circuit.png";

        this.plate = new Image();
        this.plate.onload = () => this.ImageLoaded();
        this.plate.src = "/../Images/plate.png";

        this.clouds1 = new Image();
        this.clouds1.onload = () => this.ImageLoaded();
        this.clouds1.src = "/../Images/clouds1.png";

        this.bee = new Image();
        this.bee.onload = () => this.ImageLoaded();
        this.bee.src = "/../Images/bee.png";

        this.clouds2 = new Image();
        this.clouds2.onload = () => this.ImageLoaded();
        this.clouds2.src = "/../Images/clouds2.png";
    }

    private ImageLoaded() {
        imagesLoaded++;

        if (imagesLoaded == numberOfImages) {
            this.callback();
        }
    }
} 
export class CalendarStyle {

    background_color: RGBAColorStyle = new RGBAColorStyle({ red: 13, green: 148, blue: 136 })
    text_color: RGBAColorStyle = new RGBAColorStyle({ red: 255, green: 255, blue: 255 })
    item_to_day_color: RGBAColorStyle = new RGBAColorStyle({ red: 248, green: 113, blue: 113 })

    constructor(data?: Partial<CalendarStyle>) {
        Object.assign(this, data);
    }
}

export class RGBAColorStyle {

    red: number = 0
    green: number = 0
    blue: number = 0
    opacity: number = 1

    constructor(data?: Partial<RGBAColorStyle>) {
        Object.assign(this, data);
    }
}
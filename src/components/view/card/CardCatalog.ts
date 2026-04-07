import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export class CardCatalog extends Card<ICard> {
    set category(value: string) {
        if (this._category) {
            const modifier = categoryMap[value as keyof typeof categoryMap];
            this._category.textContent = value;
            
            this._category.className = `card__category ${modifier}`
        }
    }
}



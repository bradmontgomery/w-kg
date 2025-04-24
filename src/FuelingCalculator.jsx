import { useState } from 'react';

/**
 * brand: Brand name,
 * name: product name,
 * carbs: Carbohydrates (in grams)
 * calories: Calories in one serving
 * serving: Serving size (in grams)
 */
const snacks = [
    {brand: "Junkless ", name: "Chocolate Chip", carbs: 21, calories: 130, serving: 31},
    {brand: "Cliff Bar", name: "White Chocolate Macadamia Nut", carbs: 42, calories: 260, serving: 68},
    {brand: "SIS", name: "GO Isotonic Gel", carbs: 22, calories: 87, serving: 60},
    {brand: "Larabar", name: "Lemon Bar", carbs: 24, calories: 200, serving: 45},
]

function FuelingCalculator() {

    return (
        <p>Fueling caclulator coming soon.</p>
    )
}

export default FuelingCalculator;
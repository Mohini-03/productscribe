let descriptions = [
  {
    id: "desc-001",
    productName: "Breezy Red Cotton Kurta",
    category: "Clothing",
    tone: "friendly",
    price: "₹599",
    rawNotes: "red cotton kurta, size m, soft fabric, good for summer",
    generatedDescription: "Stay cool through summer in this soft, breathable cotton kurta. A relaxed Medium fit and rich red tone make it easy to dress up or down — all for ₹599.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "desc-002",
    productName: "Handcrafted Bamboo Basket",
    category: "Home & Kitchen",
    tone: "professional",
    price: "₹349",
    rawNotes: "bamboo basket, handmade, 12 inch, eco-friendly",
    generatedDescription: "Crafted by skilled artisans, this 12-inch bamboo storage basket blends durability with eco-conscious design. An elegant, sustainable addition to any home at ₹349.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "desc-003",
    productName: "Festive Diya Set",
    category: "Festive & Gifts",
    tone: "festive",
    price: "₹199",
    rawNotes: "set of 12 clay diyas, hand painted, diwali gift pack",
    generatedDescription: "Light up the festive season with this gorgeous set of 12 hand-painted clay diyas! Perfect as a Diwali gift — joyful, traditional, and just ₹199.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 4;
function generateId() {
  return `desc-${String(nextId++).padStart(3, "0")}`;
}

module.exports = { descriptions, generateId };
import type { MenuItem } from "../types"

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Minute Burger",
    category: "Sulit Sandwiches",
    price: 89.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "2",
    name: "Black Pepper Burger",
    category: "Big Time Burgers",
    price: 89.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "3",
    name: "Bacon Cheese Burger",
    category: "Big Time Burgers",
    price: 96.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "4",
    name: "Beef Shawarma",
    category: "Big Time Burgers",
    price: 90.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "5",
    name: "Steak Burger",
    category: "Big Time Burgers",
    price: 136.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "6",
    name: "Double Minute Burger",
    category: "Sulit Sandwiches",
    price: 63.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "7",
    name: "Chili Con Cheese Franks",
    category: "Hotdogs",
    price: 94.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "8",
    name: "French Onion Franks",
    category: "Hotdogs",
    price: 92.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  { id: "9", name: "Calamantea", category: "Beverages", price: 24.0, image: "/placeholder.svg?height=120&width=120" },
  { id: "10", name: "Iced Choco", category: "Beverages", price: 23.0, image: "/placeholder.svg?height=120&width=120" },
  {
    id: "11",
    name: "Double Cheesy Burger",
    category: "Big Time Burgers",
    price: 79.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "12",
    name: "Double Chicken Time",
    category: "Chicken Time Sandwiches",
    price: 69.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "13",
    name: "50/50 Veggie Premium Chicken Burger",
    category: "Chicken Time Sandwiches",
    price: 86.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "14",
    name: "Chicken Time",
    category: "Chicken Time Sandwiches",
    price: 50.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "15",
    name: "Roasted Sesame Crispy Chicken Burger",
    category: "Chicken Time Sandwiches",
    price: 96.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "16",
    name: "Chimi-Pesto Burger",
    category: "Big Time Burgers",
    price: 98.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "17",
    name: "Cheesy Burger",
    category: "Big Time Burgers",
    price: 52.0,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "18",
    name: "Cheesy Nachos",
    category: "Extras/Side Items",
    price: 52.0,
    image: "/placeholder.svg?height=120&width=120",
  },
]

export const categories = [
  "All",
  "Sulit Sandwiches",
  "Big Time Burgers",
  "Chicken Time Sandwiches",
  "Hotdogs",
  "Beverages",
  "Extras/Side Items",
]

/**
 * Get image source for a product based on its name
 * Maps product names to their corresponding image files
 */
export function getProductImage(productName: string): any {
  const name = productName.toLowerCase()

  // Map product names to image files (check specific items first before generic categories)
  if (name.includes("steak")) {
    return require("../images/SteakBurger.png")
  }
  if (name.includes("bacon") && name.includes("cheese")) {
    return require("../images/BaconCheese.png")
  }
  if (name.includes("beef") && name.includes("shawarma")) {
    return require("../images/BeefShawarma.png")
  }
  if (name.includes("black pepper")) {
    return require("../images/BlackPepper.png")
  }
  if (name.includes("cheesy") && name.includes("burger") && !name.includes("double")) {
    return require("../images/CheesyBurger.png")
  }
  if (name.includes("cheesy") && name.includes("nachos")) {
    return require("../images/CheesyNachos.png")
  }
  if (name.includes("chicken") && name.includes("chimichurri")) {
    return require("../images/ChickenChimichurri.png")
  }
  if (name.includes("chicken") && name.includes("roasted")) {
    return require("../images/ChickenRoasted.png")
  }
  if (name.includes("chicken time") && name.includes("double")) {
    return require("../images/DoubleChickenTime.png")
  }
  if (name.includes("chicken time")) {
    return require("../images/ChickenTime.png")
  }
  if (name.includes("chili") && name.includes("cheese")) {
    return require("../images/ChiliCheese.png")
  }
  if (name.includes("double") && name.includes("cheesy")) {
    return require("../images/DoubleCheesy.png")
  }
  if (name.includes("double") && name.includes("minute")) {
    return require("../images/DoubleMinute.png")
  }
  if (name.includes("french onion")) {
    return require("../images/FrenchOnion.png")
  }
  if (name.includes("minute burger") && !name.includes("double")) {
    return require("../images/MinuteBurger.png")
  }

  // Drinks/Beverages - use Calamantea.png for all drinks (check after specific items)
  // Check for "tea" as a word (not part of "steak") by checking if it's at the end or followed by space/end
  const isTea = name.includes("calamantea") || name.endsWith("tea") || name.includes(" tea") || name.includes("tea ")
  if (isTea || name.includes("iced choco") || name.includes("choco") || 
      name.includes("drink") || name.includes("beverage") || 
      name.includes("soda") || name.includes("juice") || name.includes("shake")) {
    return require("../images/Calamantea.png")
  }
  if (name.includes("veggie") && name.includes("chicken")) {
    return require("../images/VeggieChicken.png")
  }

  // Default fallback to MinuteBurger
  return require("../images/MinuteBurger.png")
}
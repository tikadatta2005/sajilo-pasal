export const KEYS = {
  AUTH: "sajil_auth",
  SALES: "sales",
  INVENTORY: "inventory",
}

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key) {
  localStorage.removeItem(key)
}

export function getAuth() {
  return getItem(KEYS.AUTH)
}

export function setAuth(username) {
  setItem(KEYS.AUTH, { username, loggedIn: true })
}

export function clearAuth() {
  removeItem(KEYS.AUTH)
}

export function getSales() {
  return getItem(KEYS.SALES) || []
}

export function setSales(sales) {
  setItem(KEYS.SALES, sales)
}

export function getInventory() {
  return getItem(KEYS.INVENTORY) || []
}

export function setInventory(inventory) {
  setItem(KEYS.INVENTORY, inventory)
}

function importIcons(r) {
  let icons = {}
  r.keys().map((item, index) => {
    icons[item.replace("./", "")] = r(item)
  })
  return icons
}

export const icons = importIcons(
  require.context("../../src/assets/icons", false, /\.(png|jpe?g|svg)$/)
)

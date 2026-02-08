import React from "react"

const Header = ({
  title,
  as: Tag = "h1",
  size = "text-xl",
  flag
}) => {
  const [first, ...rest] = title.split(" ")
  const last = rest.join(" ")

  return (
    <Tag className={`text-3xl sm:${size} font-bold font-bbh-bogle ${flag ? "text-red-600" :"text-primary"}`}>
      {first}{" "}
      {last && (
        <span className={`text-white p-1 rounded-lg mr-2 ${flag ? "bg-red-600" :"bg-primary"}`}>
          {last}
        </span>
      )}
    </Tag>
  )
}

export default Header

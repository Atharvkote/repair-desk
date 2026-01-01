import React from 'react'

const Header = ({ title }) => {
    const [firstname, lastname] = title.split(' ')
    return (
        <h1 className="text-xl sm:text-3xl font-bold font-bbh-bogle  text-primary">
            {firstname} <span className="text-white p-1 rounded-lg mr-2 bg-primary">{lastname}</span>
        </h1>
    )
}

export default Header

'use client'

import { useState } from 'react'

const Question = () => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={onChange}
          className="border border-black/20 px-4 py-2 text-lg rounded-lg"
          value={value}
          type="text"
          placeholder="Ask a question"
        />
        <button
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg text-white ml-4"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
export default Question

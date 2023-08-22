'use client'

import { updateEntry } from '@/Utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import Spinner from './Spinner'

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(entry.analysis)
  const [isSaving, setIsSaving] = useState(false)

  const { mood, summary, color, subject, negative } = analysis
  const analysisData = [
    { name: 'Mood', value: mood },
    { name: 'Summary', value: summary },
    { name: 'Color', value: color },
    { name: 'Subject', value: subject },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ]

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true)
      setIsSaving(true)
      const updated = await updateEntry(entry.id, _value)
      setAnalysis(updated.analysis)
      setIsLoading(false)
      setIsSaving(false)
    },
  })

  return (
    <div className="w-full h-full grid grid-cols-3">
      {/* <div className="left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div> */}

      <div className="col-span-2">
        {isLoading && <div>...loading</div>}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div>
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-2 py-4 border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span className="pl-3">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Editor

import {
  type YamlType,
  type ZodDescriptionObject,
} from '@open-truss/open-truss'
import { useEffect } from 'react'

export default function PropInput({
  name,
  onChange,
  type,
  value,
}: {
  name: string
  onChange: (value: YamlType) => void
  type: ZodDescriptionObject
  value?: string
}): JSX.Element | null {
  const defaultValue = type.defaultValue as string
  value = value ?? defaultValue

  useEffect(() => {
    onChange(defaultValue)
  }, [])

  if (name === 'children') {
    return null
  }

  switch (type.type) {
    case 'ZodUndefined':
    case 'ZodNull':
    case 'ZodVoid':
      return null
    case 'ZodNumber':
    case 'ZodBigInt':
      return (
        <input
          name={name}
          type="number"
          value={Number(value)}
          onChange={(e) => {
            onChange(Number(e.target.value))
          }}
        />
      )
    case 'ZodString':
      return (
        <input
          name={name}
          placeholder={name}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      )
    case 'ZodBoolean':
      return (
        <div>
          <label htmlFor={name}>{name}</label>
          <input
            type="checkbox"
            id={name}
            name={name}
            placeholder={name}
            checked={Boolean(value)}
            onChange={(e) => {
              onChange(e.target.checked)
            }}
          />
        </div>
      )
    case 'ZodEnum':
      if (Array.isArray(type?.shape)) {
        const enumOptions = type.shape.map((option: string) => (
          <div key={option}>
            <label htmlFor={option}>{option}</label>
            <input
              type="radio"
              id={option}
              name={option}
              value={option}
              checked={value === option}
              onChange={(e) => {
                onChange(e.target.value)
              }}
            />
          </div>
        ))
        return <>{enumOptions}</>
      }
  }

  return (
    <div>
      Name: {name}. type: {JSON.stringify(type)}
    </div>
  )
}

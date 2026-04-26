interface FormFieldProps {
  label: string
  children: React.ReactNode
  error?: string
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#7b96b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: '#e63946' }}>{error}</span>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#060e1f',
  border: '1px solid #1a2d4a',
  borderRadius: 8,
  color: '#e2ecf7',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={e => { e.target.style.borderColor = '#0077b6' }}
      onBlur={e => { e.target.style.borderColor = '#1a2d4a' }}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}
export function Select({ children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, ...props.style, cursor: 'pointer' }}
      onFocus={e => { e.target.style.borderColor = '#0077b6' }}
      onBlur={e => { e.target.style.borderColor = '#1a2d4a' }}
    >
      {children}
    </select>
  )
}

"use client"
import React, { useState } from 'react'

const SignIn = () => {
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setMessage(JSON.stringify(data, null, 2))
    } catch (err) {
      setMessage('Error: ' + err)
    }
  }

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username</label><br />
          <input name="identifier" type="text" value={form.identifier} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <pre>{message}</pre>}
    </div>
  )
}

export default SignIn
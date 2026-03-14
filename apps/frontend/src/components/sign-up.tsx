"use client"
import React, { useState } from 'react'

const SignUp = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input name="email" type="text" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>Username (optional)</label><br />
          <input name="username" type="text" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <pre>{message}</pre>}
    </div>
  )
}

export default SignUp
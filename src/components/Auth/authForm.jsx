"use client"
import React, { useState } from 'react'
import {supabase} from '../../app/api/supabase/client' 

function Login() {
  const [email, setEmail] = useState("")

  const eventSubmit = async (e)=>{
    e.preventDefault()
    
    try {
      const result =await supabase.auth.signInWithOtp({
        email,
        
      })
      console.log(result)
    } catch (error) {
      console.error(error)
    }
    

  }
  const AuthSubmitwithGoogle= async (e)=>{
    e.preventDefault()
    
    try {
      const result =await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      
      console.log(result)
    } catch (error) {
      console.error(error)
    }
    

  }
  return (<>
    <button onClick={AuthSubmitwithGoogle}>GOOGLE</button>
    <form onSubmit={eventSubmit}>

      <input 
      type="email" 
      name="email" 
      placeholder='yourmail@site.com'
      onChange={(e)=> setEmail(e.target.value)} />
      <button>
        Send
      </button>
    </form>
  </>)
}

export default Login;
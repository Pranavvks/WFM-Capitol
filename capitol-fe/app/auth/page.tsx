import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CapitolLogo from "../Logomark.svg";
import {login,signup} from "./action"

export default function Auth() {
    return (
      <div className="bg-gray-950 text-white h-screen flex flex-col">
 
        <div className="flex justify-center items-center h-1/6">
          <div className="flex flex-row items-center gap-2">
            <Image 
              src={CapitolLogo} 
              alt="Capitol Logo" 
              className="w-8 h-8"
            />
            <div className="text-lg font-semibold text-white">
              Capitol Insurance
            </div>
          </div>
        </div>
  
        
        <div className="flex flex-col items-center justify-start h-3/4 p-4">
   
          <div className="text-center mb- p-10">
            <h2 className="text-3xl font-light text-white">Welcome back</h2>
          </div>
  

          <Card className="w-full max-w-md bg-[#121518] border border-gray-800 m-20 shadow-2xl rounded-xl py-6 px-8">
            <form className="space-y-6">

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="johndoe@proton.me"
                  className="w-full px-4 py-3 bg-black border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
               
              </div>
  
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-black border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  

              <Button 
                type="submit" 
                className="w-full mb-4 bg-zinc-800 border border-zinc-700 hover:bg-[#374151] text-white font-medium py-2 px-4 rounded-lg "
                formAction={login}
              >
                Sign in
              </Button>
  
              
              <Button 
                type="submit" 
                className="w-full  bg-zinc-800 border border-zinc-700 hover:bg-[#4b5563] text-gray-300 font-medium py-2 px-4 rounded-lg "
                formAction={signup}
              >
                Sign up
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }
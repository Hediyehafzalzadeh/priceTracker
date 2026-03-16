"use client";


import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button';
import { addProduct } from '@/app/actions';
import { toast } from 'sonner';

import { AuthModal } from './AuthModal';
import { Loader2 } from 'lucide-react';

const AddProductForm = ({ user }) => {

  const [url , setUrl] = useState("") ;
  const [loading , setLoading] = useState(false) ;
  const [showAuthModal , setShowAuthModal] = useState(false) ;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true) ; 
      return ;

    }
    setLoading(true);
    const formData = new FormData(); 
    formData.append("url", url) ;
    const result = await addProduct (formData);
    if(result.error){
      toast.error(result.error);

    }else{
      toast.success(result.message || "Product added successfully");
      setUrl("");
      
    }
    setLoading(false);
  };

  return (
    <>
    <form className='w-full max-w-2xl mx-auto' onSubmit={handleSubmit}>
      <div className='flex flex-col sm:flex-row gap-2'>
        <Input type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="Paste product URL here"
        className="h-12 text-base"
        required
        disabled={loading}
         /> 
         <Button
          className="bg-violet-400 text-gray-800 h-10 sm:h-12 px-8 "
          type="submit"
          disabled={loading}
          size={"lg"}
          >
            {loading? (<>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
            Adding ...
            </>) : ("track price") }

          </Button>
      </div>
  </form>
  <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
</>
  )
    
}

export default AddProductForm;